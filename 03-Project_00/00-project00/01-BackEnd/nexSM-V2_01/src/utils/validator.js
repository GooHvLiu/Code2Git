/**
 * 通用校验工具
 * 复杂的参数格式校验统一由 Joi Schema + validate 中间件在路由层完成
 * 这里只保留最基础的通用工具函数
 */

/**
 * 校验是否为空
 * 支持：undefined / null / 空字符串 / 空数组 / 空对象
 * @param {any} value
 * @returns {boolean}
 */
function isEmpty(value) {
  return value === undefined || value === null || value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0);
}

module.exports = {
  isEmpty
};
