/**
 * 翻译模块 - 控制器层
 * 处理 HTTP 请求，调用服务层
 * 国际化规范：成功用 res.success(data)；参数/业务错误用 res.error('错误码')，前端按 common.error.错误码 翻译
 */

const translationService = require('./translation.service')

/**
 * 获取翻译配置
 */
async function getConfig(req, res, next) {
  try {
    const config = translationService.getConfig()
    // 不返回 secretKey
    const safeConfig = {
      ...config,
      tencent: {
        ...config.tencent,
        secretKey: config.tencent.secretKey ? '********' : ''
      }
    }
    res.success(safeConfig)
  } catch (err) {
    next(err)
  }
}

/**
 * 保存翻译配置
 */
async function saveConfig(req, res, next) {
  try {
    const config = req.body
    // 如果 secretKey 是 ********，则保留原值
    if (config.tencent && config.tencent.secretKey === '********') {
      const oldConfig = translationService.getConfig()
      config.tencent.secretKey = oldConfig.tencent.secretKey
    }
    const savedConfig = translationService.saveConfig(config)
    res.success({
      ...savedConfig,
      tencent: {
        ...savedConfig.tencent,
        secretKey: savedConfig.tencent.secretKey ? '********' : ''
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 翻译文本
 */
async function translate(req, res, next) {
  try {
    const { text, source, target } = req.body
    if (!text) {
      return res.error('PARAM_MISSING', null, 400)
    }
    if (!source || !target) {
      return res.error('PARAM_MISSING', null, 400)
    }
    const sourceLang = translationService.convertLangCode(source)
    const targetLang = translationService.convertLangCode(target)
    const result = await translationService.translateText(text, sourceLang, targetLang)
    res.success({ result })
  } catch (err) {
    next(err)
  }
}

/**
 * 批量翻译
 */
async function translateBatch(req, res, next) {
  try {
    const { items, source, target } = req.body
    if (!items || !Array.isArray(items)) {
      return res.error('PARAM_INVALID', null, 400)
    }
    if (!source || !target) {
      return res.error('PARAM_MISSING', null, 400)
    }
    const results = await translationService.translateBatch(items, source, target)
    res.success({ results })
  } catch (err) {
    next(err)
  }
}

/**
 * 测试翻译配置
 */
async function testConfig(req, res, next) {
  try {
    const result = await translationService.testConfig()
    res.success(result)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getConfig,
  saveConfig,
  translate,
  translateBatch,
  testConfig
}
