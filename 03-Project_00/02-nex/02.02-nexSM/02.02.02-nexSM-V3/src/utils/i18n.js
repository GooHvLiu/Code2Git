/**
 * 澶氳瑷€ JSON 瀛楁瑙ｆ瀽宸ュ叿
 * 鐢ㄤ簬澶勭悊鏁版嵁搴撲腑瀛樺偍鐨?JSON 鏍煎紡澶氳瑷€瀛楁
 * 鏍煎紡绀轰緥锛歿"zh-CN": "鐢ㄦ埛鐘舵€?, "en-US": "User Status"}
 */

// 榛樿璇█
const DEFAULT_LANG = 'zh-CN'

// 鏀寔鐨勮瑷€鍒楄〃
const SUPPORTED_LANGS = ['zh-CN', 'en-US']

/**
 * 浠?JSON 澶氳瑷€瀛楁涓幏鍙栨寚瀹氳瑷€鐨勫€?
 * @param {Object|string} jsonField - JSON 瀛楁锛堝彲鑳芥槸瀵硅薄鎴?JSON 瀛楃涓诧級
 * @param {string} lang - 璇█浠ｇ爜锛堝 'zh-CN', 'en-US'锛?
 * @param {string} fallback - 鍏滃簳鍊硷紙褰撴墍鏈夎瑷€閮芥病鏈夋椂杩斿洖锛?
 * @returns {string} 瀵瑰簲璇█鐨勫€?
 */
function getLangValue(jsonField, lang = DEFAULT_LANG, fallback = '') {
  if (!jsonField) return fallback

  // 濡傛灉鏄瓧绗︿覆锛屽皾璇曡В鏋愪负 JSON
  let obj = jsonField
  if (typeof jsonField === 'string') {
    try {
      obj = JSON.parse(jsonField)
    } catch (e) {
      // 瑙ｆ瀽澶辫触锛岀洿鎺ヨ繑鍥炲師瀛楃涓?
      return jsonField
    }
  }

  if (typeof obj !== 'object' || obj === null) {
    return String(obj || fallback)
  }

  // 浼樺厛杩斿洖鎸囧畾璇█
  if (obj[lang]) return obj[lang]

  // 鍏舵杩斿洖榛樿璇█锛堜腑鏂囷級
  if (obj[DEFAULT_LANG]) return obj[DEFAULT_LANG]

  // 杩斿洖绗竴涓潪绌哄€?
  for (const key of Object.keys(obj)) {
    if (obj[key]) return obj[key]
  }

  return fallback
}

/**
 * 鎵归噺澶勭悊鏌ヨ缁撴灉涓殑澶氳瑷€瀛楁
 * @param {Array|Object} data - 鏌ヨ缁撴灉锛堟暟缁勬垨鍗曚釜瀵硅薄锛?
 * @param {Array<string>} fields - 闇€瑕佸鐞嗙殑瀛楁鍚嶅垪琛?
 * @param {string} lang - 璇█浠ｇ爜
 * @returns {Array|Object} 澶勭悊鍚庣殑缁撴灉
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
 * 浠庤姹備腑鑾峰彇璇█鍙傛暟
 * @param {Object} req - Express 璇锋眰瀵硅薄
 * @returns {string} 璇█浠ｇ爜
 */
function getLangFromRequest(req) {
  // 浼樺厛浠?query 鍙傛暟鑾峰彇
  if (req.query && req.query.lang) {
    return normalizeLang(req.query.lang)
  }
  // 鍏舵浠?header 鑾峰彇
  if (req.headers && req.headers['accept-language']) {
    const lang = req.headers['accept-language'].split(',')[0]
    return normalizeLang(lang)
  }
  return DEFAULT_LANG
}

/**
 * 鏍囧噯鍖栬瑷€浠ｇ爜
 * @param {string} lang - 鍘熷璇█浠ｇ爜
 * @returns {string} 鏍囧噯鍖栧悗鐨勮瑷€浠ｇ爜
 */
function normalizeLang(lang) {
  if (!lang) return DEFAULT_LANG
  const lower = lang.toLowerCase().replace(/_/g, '-')
  if (lower.startsWith('zh')) return 'zh-CN'
  if (lower.startsWith('en')) return 'en-US'
  // 其他语言直接返回标准化后的代码（支持用户自定义添加的语言）
  return lang
}

/**
 * 鏋勫缓澶氳瑷€ JSON 瀵硅薄
 * @param {string} zh - 涓枃鍊?
 * @param {string} en - 鑻辨枃鍊?
 * @returns {Object} 澶氳瑷€ JSON 瀵硅薄
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

