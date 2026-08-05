/**
 * 日期格式化过滤器 Vue2
 * @param {String|Number|Date} originVal 原始日期：时间戳/日期字符串/Date对象
 * @param {String} fmt 输出格式 YYYY-MM-DD HH:mm:ss | YYYY-MM-DD | YYYY-MM-DD HH:mm
 * @param {String} emptyText 空数据占位符
 * @returns {String} 格式化后日期
 */
export function formatDateFilter(originVal, fmt = 'YYYY-MM-DD HH:mm:ss', emptyText = '--') {
  // 空值直接返回占位符
  if (originVal === null || originVal === undefined || originVal === '') {
    return emptyText
  }

  let timestamp = originVal
  // 处理字符串时间戳
  if (typeof timestamp === 'string' && /^\d+$/.test(timestamp)) {
    timestamp = Number(timestamp)
  }

  let date
  // 兼容 10位秒时间戳 / 13位毫秒时间戳
  if (typeof timestamp === 'number') {
    date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp)
  } else {
    date = new Date(timestamp)
  }

  // 判断是否为合法日期
  if (isNaN(date.getTime())) {
    return emptyText
  }

  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1)
  const day = padZero(date.getDate())
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  const seconds = padZero(date.getSeconds())

  return fmt
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 补零工具 0~9 => "01"
 */
function padZero(num) {
  return num < 10 ? '0' + num : num
}