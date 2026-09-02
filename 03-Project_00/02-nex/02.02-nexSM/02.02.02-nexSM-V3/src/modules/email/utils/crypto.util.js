/**
 * 加密工具
 * 用于邮箱授权码等敏感信息的加密存储
 * 使用AES-256-CBC加密
 */
const crypto = require('crypto');

// 加密密钥（从环境变量读取，默认使用一个固定密钥，生产环境建议修改）
const ENCRYPTION_KEY = process.env.EMAIL_ENCRYPTION_KEY || 'nexsm_email_encryption_key_2024';
// 确保密钥长度为32字节（AES-256）
const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
// IV长度
const IV_LENGTH = 16;

/**
 * 加密文本
 * @param {string} text - 要加密的文本
 * @returns {string} 加密后的文本（Base64编码，包含IV）
 */
function encrypt(text) {
  if (!text) return '';
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // IV和加密内容一起存储，用冒号分隔
    return iv.toString('hex') + ':' + encrypted;
  } catch (err) {
    console.error('[加密] 加密失败:', err.message);
    return text;
  }
}

/**
 * 解密文本
 * @param {string} encryptedText - 加密后的文本
 * @returns {string} 解密后的文本
 */
function decrypt(encryptedText) {
  if (!encryptedText) return '';
  try {
    // 检查是否是加密格式（包含冒号）
    if (!encryptedText.includes(':')) {
      // 不是加密格式，直接返回（兼容明文）
      return encryptedText;
    }
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      return encryptedText;
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('[加密] 解密失败:', err.message);
    return encryptedText;
  }
}

/**
 * 检查文本是否是加密格式
 * @param {string} text - 要检查的文本
 * @returns {boolean} 是否是加密格式
 */
function isEncrypted(text) {
  if (!text) return false;
  return text.includes(':') && text.split(':').length === 2 && text.split(':')[0].length === IV_LENGTH * 2;
}

/**
 * 脱敏邮箱地址（中间用*代替）
 * @param {string} email - 邮箱地址
 * @returns {string} 脱敏后的邮箱地址
 */
function maskEmail(email) {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const username = parts[0];
  const domain = parts[1];
  if (username.length <= 2) {
    return username[0] + '***@' + domain;
  }
  return username[0] + '***' + username[username.length - 1] + '@' + domain;
}

module.exports = {
  encrypt,
  decrypt,
  isEncrypted,
  maskEmail
};
