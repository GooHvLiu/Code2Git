/**
 * 国际化工具函数
 * 注意：数据库只存储国际化 key，翻译由前端处理
 * 不使用 JSON 多语言字段，不使用兜底方案
 */

// 默认语言
const DEFAULT_LANG = 'zh-CN'

// 支持的语言列表
const SUPPORTED_LANGS = ['zh-CN', 'en-US']

/**
 * 从请求中获取语言参数
 * @param {Object} req - Express 请求对象
 * @returns {string} 语言代码
 */
function getLangFromRequest(req) {
  // 优先从 query 参数获取
  if (req.query && req.query.lang) {
    return normalizeLang(req.query.lang)
  }
  // 其次从 header 获取
  if (req.headers && req.headers['accept-language']) {
    const lang = req.headers['accept-language'].split(',')[0]
    return normalizeLang(lang)
  }
  return DEFAULT_LANG
}

/**
 * 标准化语言代码
 * @param {string} lang - 原始语言代码
 * @returns {string} 标准化后的语言代码
 */
function normalizeLang(lang) {
  if (!lang) return DEFAULT_LANG
  const lower = lang.toLowerCase().replace(/_/g, '-')
  if (lower.startsWith('zh')) return 'zh-CN'
  if (lower.startsWith('en')) return 'en-US'
  // 其他语言直接返回标准化后的代码（支持用户自定义添加的语言）
  return lang
}

module.exports = {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  getLangFromRequest,
  normalizeLang
}
