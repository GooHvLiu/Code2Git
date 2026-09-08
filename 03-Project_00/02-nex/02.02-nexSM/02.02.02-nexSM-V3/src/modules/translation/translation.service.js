/**
 * 翻译模块 - 服务层
 * 实现腾讯云翻译 API 调用和配置管理
 * 仅超级管理员可配置
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const https = require('https')

// ========== 配置 ==========

// 翻译配置文件路径（放在前端项目的 src/config/ 下）
const TRANSLATION_CONFIG_FILE = path.join(__dirname, '../../../../../02.01-nexCM/02.01.02-nexCM-V3/src/config/translation-config.json')

// 默认配置
const DEFAULT_CONFIG = {
  enabled: false,
  provider: 'tencent',
  tencent: {
    secretId: '',
    secretKey: '',
    region: 'ap-guangzhou',
    projectId: 0
  }
}

// 腾讯云翻译 API 配置
const TMT_CONFIG = {
  service: 'tmt',
  version: '2018-03-21',
  endpoint: 'tmt.tencentcloudapi.com',
  action: 'TextTranslate'
}

// 语言代码映射（国际化文件编码 -> 腾讯翻译 API 语言代码）
const LANG_CODE_MAP = {
  'zh-CN': 'zh',
  'zh-TW': 'zh-TW',
  'en-US': 'en',
  'en-GB': 'en',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'fr-FR': 'fr',
  'de-DE': 'de',
  'es-ES': 'es',
  'ru-RU': 'ru',
  'pt-BR': 'pt',
  'it-IT': 'it',
  'th-TH': 'th',
  'vi-VN': 'vi',
  'id-ID': 'id',
  'ms-MY': 'ms',
  'ar-SA': 'ar',
  'hi-IN': 'hi'
}

// ========== 工具函数 ==========

/**
 * 确保目录存在
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * SHA256 哈希
 */
function sha256(message) {
  return crypto.createHash('sha256').update(message).digest('hex')
}

/**
 * HMAC-SHA256
 */
function hmacSha256(key, message) {
  return crypto.createHmac('sha256', key).update(message).digest()
}

/**
 * 获取翻译配置
 * 从配置文件 translation-config.json 读取
 */
function getConfig() {
  let config = { ...DEFAULT_CONFIG }
  try {
    if (fs.existsSync(TRANSLATION_CONFIG_FILE)) {
      const fileConfig = JSON.parse(fs.readFileSync(TRANSLATION_CONFIG_FILE, 'utf-8'))
      config = { ...config, ...fileConfig }
    }
  } catch (e) {
    // 配置文件读取失败，使用默认配置
  }

  return config
}

/**
 * 保存翻译配置
 */
function saveConfig(config) {
  ensureDir(path.dirname(TRANSLATION_CONFIG_FILE))
  const mergedConfig = { ...DEFAULT_CONFIG, ...config, updatedAt: new Date().toISOString() }
  fs.writeFileSync(TRANSLATION_CONFIG_FILE, JSON.stringify(mergedConfig, null, 2), 'utf-8')
  return mergedConfig
}

/**
 * 语言代码转换
 */
function convertLangCode(langCode) {
  return LANG_CODE_MAP[langCode] || langCode.split('-')[0]
}

// ========== 腾讯云签名 ==========

/**
 * 生成腾讯云 API 签名（TC3-HMAC-SHA256）
 */
function generateSignature(secretId, secretKey, region, payload) {
  const timestamp = Math.floor(Date.now() / 1000)
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10)
  
  // 1. 拼接规范请求串
  const httpRequestMethod = 'POST'
  const canonicalUri = '/'
  const canonicalQueryString = ''
  const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${TMT_CONFIG.endpoint}\n`
  const signedHeaders = 'content-type;host'
  const hashedRequestPayload = sha256(payload)
  const canonicalRequest = `${httpRequestMethod}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedRequestPayload}`
  
  // 2. 拼接待签名字符串
  const algorithm = 'TC3-HMAC-SHA256'
  const credentialScope = `${date}/${TMT_CONFIG.service}/tc3_request`
  const hashedCanonicalRequest = sha256(canonicalRequest)
  const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`
  
  // 3. 计算签名
  const secretDate = hmacSha256(`TC3${secretKey}`, date)
  const secretService = hmacSha256(secretDate, TMT_CONFIG.service)
  const secretSigning = hmacSha256(secretService, 'tc3_request')
  const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex')
  
  // 4. 拼接 Authorization
  const authorization = `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
  
  return {
    authorization,
    timestamp,
    date
  }
}

// ========== 翻译 API 调用 ==========

/**
 * 调用腾讯云翻译 API
 * @param {string} text - 待翻译文本
 * @param {string} source - 源语言代码
 * @param {string} target - 目标语言代码
 * @returns {Promise<string>} 翻译结果
 */
function translateText(text, source, target) {
  return new Promise((resolve, reject) => {
    const config = getConfig()
    
    if (!config.enabled) {
      return reject(new Error('翻译功能未启用，请先在参数设置中配置'))
    }
    
    const { secretId, secretKey, region, projectId } = config.tencent
    
    if (!secretId || !secretKey) {
      return reject(new Error('腾讯云 API 密钥未配置'))
    }
    
    // 构建请求参数
    const params = {
      SourceText: text,
      Source: source,
      Target: target,
      ProjectId: projectId || 0
    }
    
    const payload = JSON.stringify(params)
    
    // 生成签名
    const { authorization, timestamp } = generateSignature(secretId, secretKey, region, payload)
    
    // 构建请求选项
    const options = {
      hostname: TMT_CONFIG.endpoint,
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json; charset=utf-8',
        'Host': TMT_CONFIG.endpoint,
        'X-TC-Action': TMT_CONFIG.action,
        'X-TC-Timestamp': timestamp.toString(),
        'X-TC-Version': TMT_CONFIG.version,
        'X-TC-Region': region
      }
    }
    
    // 发送请求
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          if (result.Response && result.Response.TargetText) {
            resolve(result.Response.TargetText)
          } else if (result.Response && result.Response.Error) {
            reject(new Error(`翻译 API 错误: ${result.Response.Error.Message} (${result.Response.Error.Code})`))
          } else {
            reject(new Error('翻译 API 返回格式异常'))
          }
        } catch (e) {
          reject(new Error(`解析翻译结果失败: ${e.message}`))
        }
      })
    })
    
    req.on('error', (e) => {
      reject(new Error(`翻译请求失败: ${e.message}`))
    })
    
    req.write(payload)
    req.end()
  })
}

/**
 * 批量翻译
 * @param {Array} items - 待翻译数组 [{ key, value }]
 * @param {string} sourceLang - 源语言编码
 * @param {string} targetLang - 目标语言编码
 * @returns {Promise<Array>} 翻译结果数组
 */
async function translateBatch(items, sourceLang, targetLang) {
  const source = convertLangCode(sourceLang)
  const target = convertLangCode(targetLang)
  
  const results = []
  for (const item of items) {
    try {
      if (!item.value || typeof item.value !== 'string') {
        results.push({ ...item, translated: item.value || '' })
        continue
      }
      // 跳过纯数字、纯符号的内容
      if (/^[\d\s\p{P}\p{S}]+$/u.test(item.value)) {
        results.push({ ...item, translated: item.value })
        continue
      }
      const translated = await translateText(item.value, source, target)
      results.push({ ...item, translated })
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (e) {
      results.push({ ...item, translated: item.value, error: e.message })
    }
  }
  return results
}

/**
 * 测试翻译配置是否有效
 */
async function testConfig() {
  try {
    const targetText = await translateText('你好', 'zh', 'en')
    return {
      success: true,
      message: '配置有效，翻译测试成功',
      result: {
        source: '你好',
        target: targetText
      }
    }
  } catch (e) {
    return {
      success: false,
      message: e.message
    }
  }
}

module.exports = {
  getConfig,
  saveConfig,
  translateText,
  translateBatch,
  testConfig,
  convertLangCode,
  LANG_CODE_MAP
}
