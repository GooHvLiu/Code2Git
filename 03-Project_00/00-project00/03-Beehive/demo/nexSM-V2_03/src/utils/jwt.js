/**
 * JWT 工具函数
 * 统一封装token生成、验证、解析
 */
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

/**
 * 生成token
 * @param {Object} payload 载荷数据
 * @returns {string} token字符串
 */
function generateToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
    algorithm: jwtConfig.algorithm
  });
}

/**
 * 验证token
 * @param {string} token token字符串
 * @returns {Object|null} 解析结果，失败返回null
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (err) {
    return null;
  }
}

/**
 * 解析token（不验证过期）
 * @param {string} token
 * @returns {Object|null}
 */
function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
