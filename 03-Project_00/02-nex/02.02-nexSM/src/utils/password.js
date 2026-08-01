/**
 * 密码加密工具
 * 使用 bcryptjs 进行哈希加密
 */
const bcrypt = require('bcryptjs');
const appConfig = require('../config/app.config');

/**
 * 加密密码
 * @param {string} plainPassword 明文密码
 * @returns {string} 加密后的哈希值
 */
async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(appConfig.bcrypt.saltRounds);
  return await bcrypt.hash(plainPassword, salt);
}

/**
 * 校验密码
 * @param {string} plainPassword 明文密码
 * @param {string} hashedPassword 哈希密码
 * @returns {boolean} 是否匹配
 */
async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword
};
