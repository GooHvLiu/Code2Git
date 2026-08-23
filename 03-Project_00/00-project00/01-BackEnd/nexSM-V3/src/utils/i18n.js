/**
 * 多语言 JSON 字段解析工具
 * 用于处理数据库中存储的 JSON 格式多语言字段
 * 格式示例：{"zh-CN": "用户状态", "en-US": "User Status"}
 */

// 默认语言
const DEFAULT_LANG = 'zh-CN'

// 支持的语言列表
const SUPPORTED_LANGS = ['zh-CN', 'en-US']

/**
 * 从 JSON 多语言字段中获取指定语言的值
 * @param {Object|string} jsonField - JSON 字段（可能是对象或 JSON 字符串）
 * @param {string} lang - 语言代码（如 'zh-CN', 'en-US'）
 * @param {string} fallback - 兜底值（当所有语言都没有时返回）
 * @returns {string} 对应语言的值
 */
function getLangValue(jsonField, lang = DEFAULT_LANG, fallback = '') {
  if (!jsonField) return fallback

  // 如果是字符串，尝试解析为 JSON
  let obj = jsonField
  if (typeof jsonField === 'string') {
    try {
      obj = JSON.parse(jsonField)
    } catch (e) {
      // 解析失败，直接返回原字符串
      return jsonField
    }
  }

  if (typeof obj !== 'object' || obj === null) {
    return String(obj || fallback)
  }

  // 优先返回指定语言
  if (obj[lang]) return obj[lang]

  // 其次返回默认语言（中文）
  if (obj[DEFAULT_LANG]) return obj[DEFAULT_LANG]

  // 返回第一个非空值
  for (const key of Object.keys(obj)) {
    if (obj[key]) return obj[key]
  }

  return fallback
}

/**
 * 批量处理查询结果中的多语言字段
 * @param {Array|Object} data - 查询结果（数组或单个对象）
 * @param {Array<string>} fields - 需要处理的字段名列表
 * @param {string} lang - 语言代码
 * @returns {Array|Object} 处理后的结果
 */
function processLangFields(data, fields, lang = DEFAULT_LANG) {
  if (!data) return data

  const processItem = (item) => {
    if (!item || typeof item !== 'object') return item
    const result = { ...item }
    for (const field of fields) {
      if (result[field] !== undefined) {
        result[field] = getLangValue(result[field], lang)
      }
    }
    return result
  }

  if (Array.isArray(data)) {
    return data.map(processItem)
  }
  return processItem(data)
}

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
  return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG
}

/**
 * 构建多语言 JSON 对象
 * @param {string} zh - 中文值
 * @param {string} en - 英文值
 * @returns {Object} 多语言 JSON 对象
 */
function buildLangObject(zh, en = '') {
  return {
    'zh-CN': zh || '',
    'en-US': en || zh || ''
  }
}

module.exports = {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  getLangValue,
  processLangFields,
  getLangFromRequest,
  normalizeLang,
  buildLangObject
}
