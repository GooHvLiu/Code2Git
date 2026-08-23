/**
 * 加密核心模块
 * 负责：RSA密钥对生成/加载、RSA签名/验签、AES加密/解密
 *
 * 授权安全模型：
 * 1. 授权服务器持有 RSA 私钥，用于签发授权文件
 * 2. 被保护项目持有 RSA 公钥，用于验证授权文件签名
 * 3. 授权文件内容先用 AES 加密，再用 RSA 私钥签名
 * 4. 客户端无法伪造授权（没有私钥），无法篡改授权（签名验证失败）
 */
const forge = require('node-forge');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('../config');

class CryptoCore {
  constructor() {
    this.publicKey = null;
    this.privateKey = null;
    this._loadKeys();
  }

  /**
   * 加载 RSA 密钥对
   * 如果不存在则自动生成
   */
  _loadKeys() {
    const pubPath = path.join(config.keysDir, config.rsa.publicKeyFile);
    const privPath = path.join(config.keysDir, config.rsa.privateKeyFile);

    if (fs.existsSync(pubPath) && fs.existsSync(privPath)) {
      this.publicKey = fs.readFileSync(pubPath, 'utf8');
      this.privateKey = fs.readFileSync(privPath, 'utf8');
      console.log('[Crypto] RSA 密钥对加载成功');
    } else {
      console.log('[Crypto] 未找到密钥对，正在生成...');
      this.generateKeyPair();
    }
  }

  /**
   * 生成 RSA 密钥对并保存
   */
  generateKeyPair() {
    const keys = forge.pki.rsa.generateKeyPair(config.rsa.keySize);
    this.publicKey = forge.pki.publicKeyToPem(keys.publicKey);
    this.privateKey = forge.pki.privateKeyToPem(keys.privateKey);

    if (!fs.existsSync(config.keysDir)) {
      fs.mkdirSync(config.keysDir, { recursive: true });
    }
    fs.writeFileSync(path.join(config.keysDir, config.rsa.publicKeyFile), this.publicKey);
    fs.writeFileSync(path.join(config.keysDir, config.rsa.privateKeyFile), this.privateKey);
    console.log('[Crypto] RSA 密钥对生成并保存成功');
  }

  /**
   * RSA 私钥签名
   * @param {string} data 待签名数据（JSON字符串）
   * @returns {string} Base64编码的签名
   */
  sign(data) {
    const privateKey = forge.pki.privateKeyFromPem(this.privateKey);
    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    const signature = privateKey.sign(md);
    return forge.util.encode64(signature);
  }

  /**
   * RSA 公钥验签
   * @param {string} data 原始数据
   * @param {string} signature Base64编码的签名
   * @returns {boolean}
   */
  verify(data, signature) {
    try {
      const publicKey = forge.pki.publicKeyFromPem(this.publicKey);
      const md = forge.md.sha256.create();
      md.update(data, 'utf8');
      const sigBytes = forge.util.decode64(signature);
      return publicKey.verify(md.digest().bytes(), sigBytes);
    } catch (e) {
      console.error('[Crypto] 验签失败:', e.message);
      return false;
    }
  }

  /**
   * AES-256-CBC 加密
   * @param {string} plainText 明文
   * @returns {string} Base64编码的密文
   */
  aesEncrypt(plainText) {
    const key = Buffer.from(this._padKey(config.aesKey, 32));
    const iv = Buffer.from(this._padKey(config.aesIv, 16));
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  /**
   * AES-256-CBC 解密
   * @param {string} cipherText Base64编码的密文
   * @returns {string} 明文
   */
  aesDecrypt(cipherText) {
    const key = Buffer.from(this._padKey(config.aesKey, 32));
    const iv = Buffer.from(this._padKey(config.aesIv, 16));
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(cipherText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * 补齐密钥到指定长度
   */
  _padKey(str, length) {
    const buf = Buffer.alloc(length);
    const strBuf = Buffer.from(str, 'utf8');
    strBuf.copy(buf, 0, 0, Math.min(strBuf.length, length));
    return buf;
  }

  /**
   * 获取公钥（供客户端下载/集成）
   */
  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = new CryptoCore();
