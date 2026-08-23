/**
 * 授权文件核心模块
 * 负责：授权文件生成、解析、验证
 *
 * 授权文件格式（.lic）：
 * {
 *   "version": "1.0",
 *   "licenseId": "uuid",
 *   "projectId": "nex-cm-v2",
 *   "projectName": "nexCM医疗设备管理系统",
 *   "licenseType": "trial|standard|enterprise|perpetual",
 *   "machineId": "机器指纹（绑定硬件，为空表示不绑定）",
 *   "issuedAt": 1700000000000,
 *   "expiresAt": 1730000000000,  // perpetual为null
 *   "features": ["user_manage", "device_manage"],
 *   "maxUsers": 100,
 *   "customer": { name, contact, phone, email },
 *   "signature": "RSA签名"
 * }
 *
 * 存储方式：JSON -> AES加密 -> Base64编码 -> 写入.lic文件
 */
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
const cryptoCore = require('./crypto');
const config = require('../config');

// 授权类型枚举
const LICENSE_TYPE = {
  TRIAL: 'trial',           // 试用版
  STANDARD: 'standard',     // 标准版
  ENTERPRISE: 'enterprise', // 企业版
  PERPETUAL: 'perpetual'    // 永久版
};

class LicenseCore {
  constructor() {
    this.licenseType = LICENSE_TYPE;
  }

  /**
   * 生成授权文件
   * @param {Object} options 授权参数
   * @param {string} options.projectId 项目ID
   * @param {string} options.projectName 项目名称
   * @param {string} options.licenseType 授权类型
   * @param {string} [options.machineId] 机器指纹（不填则不绑定硬件）
   * @param {number} [options.validDays] 有效天数（perpetual忽略）
   * @param {string[]} [options.features] 授权功能列表
   * @param {number} [options.maxUsers] 最大用户数
   * @param {Object} [options.customer] 客户信息
   * @returns {Object} { licenseId, filePath, licenseData }
   */
  generate(options) {
    const now = Date.now();
    const licenseId = uuidv4();

    // 计算过期时间
    let expiresAt = null;
    if (options.licenseType !== LICENSE_TYPE.PERPETUAL) {
      const validDays = options.validDays || 365;
      expiresAt = dayjs(now).add(validDays, 'day').valueOf();
    }

    // 构建授权数据（不含签名）
    const licenseData = {
      version: '1.0',
      licenseId,
      projectId: options.projectId,
      projectName: options.projectName,
      licenseType: options.licenseType,
      machineId: options.machineId || '',
      issuedAt: now,
      expiresAt,
      features: options.features || [],
      maxUsers: options.maxUsers || 0,
      customer: options.customer || {}
    };

    // RSA 签名（对授权数据JSON字符串签名）
    const dataStr = JSON.stringify(licenseData);
    licenseData.signature = cryptoCore.sign(dataStr);

    // AES 加密后 Base64 编码
    const encrypted = cryptoCore.aesEncrypt(JSON.stringify(licenseData));

    // 保存文件
    if (!fs.existsSync(config.licensesDir)) {
      fs.mkdirSync(config.licensesDir, { recursive: true });
    }
    const fileName = `${options.projectId}_${licenseId.substring(0, 8)}.lic`;
    const filePath = path.join(config.licensesDir, fileName);
    fs.writeFileSync(filePath, encrypted, 'utf8');

    console.log(`[License] 授权文件生成成功: ${fileName}`);
    return { licenseId, filePath, fileName, licenseData };
  }

  /**
   * 解析授权文件（解密 + 验签）
   * @param {string} filePathOrContent .lic文件路径 或 加密内容字符串
   * @returns {Object|null} 授权数据，验证失败返回null
   */
  parse(filePathOrContent) {
    try {
      let encrypted;
      // 判断是文件路径还是内容
      if (filePathOrContent.includes('\n') || filePathOrContent.length < 500) {
        // 可能是文件路径
        if (fs.existsSync(filePathOrContent)) {
          encrypted = fs.readFileSync(filePathOrContent, 'utf8');
        } else {
          encrypted = filePathOrContent;
        }
      } else {
        encrypted = filePathOrContent;
      }

      // AES 解密
      const decrypted = cryptoCore.aesDecrypt(encrypted);
      const licenseData = JSON.parse(decrypted);

      // 提取签名，验证签名
      const signature = licenseData.signature;
      delete licenseData.signature;
      const dataStr = JSON.stringify(licenseData);
      licenseData.signature = signature;

      const isValid = cryptoCore.verify(dataStr, signature);
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
   * 验证授权有效性（不包含时间防护，时间防护由 timeGuard 处理）
   * @param {Object} licenseData 解析后的授权数据
   * @param {Object} [options] 验证选项
   * @param {string} [options.projectId] 项目ID（验证是否匹配）
   * @param {string} [options.machineId] 当前机器指纹（验证硬件绑定）
   * @param {string[]} [options.requiredFeatures] 需要的功能列表
   * @returns {Object} { valid: boolean, reason: string, licenseData }
   */
  validate(licenseData, options = {}) {
    if (!licenseData) {
      return { valid: false, reason: '授权文件为空或解析失败' };
    }

    // 1. 项目ID匹配
    if (options.projectId && licenseData.projectId !== options.projectId) {
      return { valid: false, reason: `授权项目不匹配（期望: ${options.projectId}, 实际: ${licenseData.projectId}）` };
    }

    // 2. 硬件绑定验证
    if (licenseData.machineId && options.machineId) {
      if (licenseData.machineId !== options.machineId) {
        return { valid: false, reason: '授权文件与当前机器不匹配（硬件绑定）' };
      }
    }

    // 3. 过期验证（perpetual不过期）
    if (licenseData.licenseType !== LICENSE_TYPE.PERPETUAL && licenseData.expiresAt) {
      const now = Date.now();
      if (now > licenseData.expiresAt) {
        const expireDate = dayjs(licenseData.expiresAt).format('YYYY-MM-DD HH:mm:ss');
        return { valid: false, reason: `授权已过期（过期时间: ${expireDate}）` };
      }
    }

    // 4. 功能授权验证
    if (options.requiredFeatures && options.requiredFeatures.length > 0) {
      const missing = options.requiredFeatures.filter(f => !licenseData.features.includes(f));
      if (missing.length > 0) {
        return { valid: false, reason: `缺少功能授权: ${missing.join(', ')}` };
      }
    }

    return { valid: true, reason: '授权有效', licenseData };
  }

  /**
   * 列出所有已生成的授权文件
   */
  listLicenses() {
    if (!fs.existsSync(config.licensesDir)) return [];
    const files = fs.readdirSync(config.licensesDir).filter(f => f.endsWith('.lic'));
    return files.map(f => {
      const filePath = path.join(config.licensesDir, f);
      const stat = fs.statSync(filePath);
      const data = this.parse(filePath);
      return {
        fileName: f,
        filePath,
        createdAt: stat.birthtimeMs,
        licenseId: data?.licenseId,
        projectId: data?.projectId,
        projectName: data?.projectName,
        licenseType: data?.licenseType,
        expiresAt: data?.expiresAt,
        customer: data?.customer
      };
    });
  }

  /**
   * 删除授权文件
   */
  deleteLicense(fileName) {
    const filePath = path.join(config.licensesDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
}

module.exports = new LicenseCore();
module.exports.LICENSE_TYPE = LICENSE_TYPE;
