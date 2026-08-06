/**
 * filters/index.js - 全局过滤器
 * 
 * 在 main.js 中注册，可在模板中使用：{{ value | filterName }}
 */
// 时间格式化过滤器，复用 utils 中的 parseTime
export { parseTime as parseTime } from '@/utils'

/**
 * 状态文本格式化
 * 使用：{{ 'running' | formatStatus }} => '运行中'
 */
export function formatStatus(status) {
  const statusMap = {
    pending: '待处理',
    running: '运行中',
    completed: '已完成',
    cancelled: '已取消',
    idle: '空闲',
    offline: '离线',
    fault: '故障',
    maintenance: '维护中'
  }
  return statusMap[status] || status
}

/**
 * 数字千分位格式化
 * @param {number} num 数字
 * @param {number} digits 小数位数
 * 使用：{{ 1234567 | formatNumber }} => '1,234,567'
 */
export function formatNumber(num, digits = 0) {
  if (num === null || num === undefined) return '0'
  return Number(num).toLocaleString('zh-CN', { minimumFractionDigits: digits })
}
