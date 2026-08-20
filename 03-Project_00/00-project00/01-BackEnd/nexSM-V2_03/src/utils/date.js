/**
 * 时间工具函数
 * 基于 dayjs 封装
 */
const dayjs = require('dayjs');

/**
 * 格式化时间
 * @param {Date|string|number} date 时间
 * @param {string} format 格式化字符串
 * @returns {string}
 */
function format(date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(format);
}

/**
 * 获取今天开始时间
 * @returns {string}
 */
function getTodayStart() {
  return dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 获取今天结束时间
 * @returns {string}
 */
function getTodayEnd() {
  return dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 获取N天前的时间
 * @param {number} days 天数
 * @returns {string}
 */
function getDaysAgo(days) {
  return dayjs().subtract(days, 'day').format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 计算两个时间差（秒）
 * @param {Date|string} start
 * @param {Date|string} end
 * @returns {number}
 */
function diffSeconds(start, end) {
  return dayjs(end).diff(dayjs(start), 'second');
}

module.exports = {
  format,
  getTodayStart,
  getTodayEnd,
  getDaysAgo,
  diffSeconds
};
