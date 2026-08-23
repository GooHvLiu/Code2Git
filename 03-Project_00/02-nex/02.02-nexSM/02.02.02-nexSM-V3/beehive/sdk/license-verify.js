/**
 * 授权验证核心模块（SDK版）
 * 负责：授权文件解密、RSA验签、有效性验证
 *
 * 加密算法必须与服务端一致：
 * - AES-256-CBC 解密授权文件
 * - RSA-SHA256 验证签名
 */
const fs = require('fs');
const crypto = require('crypto');
const { getMachineId } = require('./machine-id');
const config = require('./config');

const LICENSE_TYPE = config.LICENSE_TYPE;

class LicenseVerifier {
  /**
   * @param {Object} options
   * @param {string} options.projectId 被保护项目ID
   * @param {string} options.publicKey RSA公钥（PEM格式）
   * @param {string} options.licensePath 授权文件路径
   * @param {string} [options.aesKey] AES密钥（必须与服务端一致，默认从config读取）
   * @param {string} [options.aesIv] AES IV（必须与服务端一致，默认从config读取）
   * @param {string[]} [options.requiredFeatures] 需要的功能列表
   */
  constructor(options = {}) {
    this.projectId = options.projectId;
    this.publicKey = options.publicKey;
    this.licensePath = options.licensePath;
    this.aesKey = options.aesKey || config.AES_KEY;
    this.aesIv = options.aesIv || config.AES_IV;
    this.requiredFeatures = options.requiredFeatures || [];
    this._cachedLicense = null;
    this._cacheTime = 0;
    this._cacheTtl = 60 * 1000;
  }

  /**
   * 解析授权文件（解密 + 验签）
   * @returns {Object|null}
   */
  parse() {
    try {
      if (!this.licensePath || !fs.existsSync(this.licensePath)) {
        return null;
      }
      const encrypted = fs.readFileSync(this.licensePath, 'utf8');
      const decrypted = this._aesDecrypt(encrypted);
      const licenseData = JSON.parse(decrypted);

      // 验签
      const signature = licenseData.signature;
      delete licenseData.signature;
      const dataStr = JSON.stringify(licenseData);
      licenseData.signature = signature;

      const isValid = this._verifySignature(dataStr, signature);
      if (!isValid) {
        console.error('[License] 授权文件签名验证失败');
        return null;
      }
      return licenseData;
    } catch (e) {
      console.error('[License] 解析授权文件失败:', e.message);
      return null;
    }
  }

  /**
   * 验证授权有效性
   * @param {Object} [options]
   * @param {boolean} [options.checkMachineId=true] 是否检查机器绑定
   * @param {boolean} [options.checkExpire=true] 是否检查过期
   * @returns {Object} { valid, reason, licenseData }
   */
  verify(options = {}) {
    const { checkMachineId = true, checkExpire = true } = options;

    // 缓存
    const now = Date.now();
    let licenseData;
    if (this._cachedLicense && now - this._cacheTime < this._cacheTtl) {
      licenseData = this._cachedLicense;
    } else {
      licenseData = this.parse();
      this._cachedLicense = licenseData;
      this._cacheTime = now;
    }

    if (!licenseData) {
      return { valid: false, reason: '授权文件不存在或验证失败' };
    }

    // 项目ID匹配
    if (this.projectId && licenseData.projectId !== this.projectId) {
      return { valid: false, reason: `授权项目不匹配（期望: ${this.projectId}, 实际: ${licenseData.projectId}）` };
    }

    // 机器绑定
    if (checkMachineId && licenseData.machineId) {
      const currentMachineId = getMachineId();
      if (licenseData.machineId !== currentMachineId) {
        return { valid: false, reason: '授权文件与当前机器不匹配（硬件绑定）' };
      }
    }

    // 过期检查
    if (checkExpire && licenseData.licenseType !== LICENSE_TYPE.PERPETUAL && licenseData.expiresAt) {
      if (now > licenseData.expiresAt) {
        const expireDate = new Date(licenseData.expiresAt).toLocaleString('zh-CN');
        return { valid: false, reason: `授权已过期（过期时间: ${expireDate}）` };
      }
    }

    // 功能授权
    if (this.requiredFeatures && this.requiredFeatures.length > 0) {
      const missing = this.requiredFeatures.filter(f => !licenseData.features.includes(f));
      if (missing.length > 0) {
        return { valid: false, reason: `缺少功能授权: ${missing.join(', ')}` };
      }
    }

    return { valid: true, reason: '授权有效', licenseData };
  }

  /**
   * 清除缓存（重新导入授权文件后调用）
   */
  clearCache() {
    this._cachedLicense = null;
    this._cacheTime = 0;
  }

  // ==================== 内部方法 ====================

  _aesDecrypt(cipherText) {
    const key = this._padKey(this.aesKey, 32);
    const iv = this._padKey(this.aesIv, 16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(cipherText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  _verifySignature(data, signature) {
    try {
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(data, 'utf8');
      return verify.verify(this.publicKey, signature, 'base64');
    } catch (e) {
      console.error('[License] 验签异常:', e.message);
      return false;
    }
  }

  _padKey(str, length) {
    const buf = Buffer.alloc(length);
    const strBuf = Buffer.from(str, 'utf8');
    strBuf.copy(buf, 0, 0, Math.min(strBuf.length, length));
    return buf;
  }
}

module.exports = LicenseVerifier;
module.exports.LICENSE_TYPE = LICENSE_TYPE;
