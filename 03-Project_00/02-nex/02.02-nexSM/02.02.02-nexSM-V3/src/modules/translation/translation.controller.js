/**
 * 翻译模块 - 控制器层
 * 处理 HTTP 请求，调用服务层
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
    res.json({
      code: 200,
      message: 'success',
      data: safeConfig
    })
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
    res.json({
      code: 200,
      message: '配置保存成功',
      data: {
        ...savedConfig,
        tencent: {
          ...savedConfig.tencent,
          secretKey: savedConfig.tencent.secretKey ? '********' : ''
        }
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
      return res.status(400).json({ code: 400, message: 'text 参数不能为空' })
    }
    if (!source || !target) {
      return res.status(400).json({ code: 400, message: 'source 和 target 参数不能为空' })
    }
    const sourceLang = translationService.convertLangCode(source)
    const targetLang = translationService.convertLangCode(target)
    const result = await translationService.translateText(text, sourceLang, targetLang)
    res.json({
      code: 200,
      message: 'success',
      data: { result }
    })
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
      return res.status(400).json({ code: 400, message: 'items 参数必须是数组' })
    }
    if (!source || !target) {
      return res.status(400).json({ code: 400, message: 'source 和 target 参数不能为空' })
    }
    const results = await translationService.translateBatch(items, source, target)
    res.json({
      code: 200,
      message: 'success',
      data: { results }
    })
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
    res.json({
      code: 200,
      message: 'success',
      data: result
    })
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
