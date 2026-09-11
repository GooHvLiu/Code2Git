/**
 * 国际化管理模块 - 控制器层（模块化「目录模型」版）
 * 处理 HTTP 请求，调用服务层。
 * 规范：成功 res.success(data)；参数缺失 res.error('PARAM_MISSING', null, 400)；
 *       业务异常统一 next(err)，由全局错误中间件按错误码返回，前端按 code 翻译，不做兜底。
 */

const i18nManagerService = require('./i18n-manager.service')

// ========== 语言列表 / 读取 / 搜索 ==========

/** 语言列表（登录用户均可，用于语言切换与管理页） */
async function listLanguages(req, res, next) {
  try {
    res.success(i18nManagerService.listLanguages())
  } catch (err) {
    next(err)
  }
}

/** 聚合读取整门语言（登录用户均可，用于动态加载语言包） */
async function readLanguage(req, res, next) {
  try {
    const { langCode } = req.query
    if (!langCode) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.readLanguage(langCode))
  } catch (err) {
    next(err)
  }
}

/** 在一门语言内按 key / 值搜索（超管） */
async function searchLanguage(req, res, next) {
  try {
    const { langCode, keyword } = req.query
    if (!langCode || !keyword) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.searchLanguage(langCode, keyword))
  } catch (err) {
    next(err)
  }
}

// ========== 节点级增删改 ==========

/** 修改单个 key 的值 */
async function saveNodeValue(req, res, next) {
  try {
    const { langCode, keyPath, value } = req.body
    if (!langCode || !keyPath) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.saveNodeValue(langCode, keyPath, value))
  } catch (err) {
    next(err)
  }
}

/** 新增一个 key */
async function addNode(req, res, next) {
  try {
    const { langCode, parentPath, key, value, spreadFile } = req.body
    if (!langCode || !key) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.addNode(langCode, parentPath, key, value, spreadFile))
  } catch (err) {
    next(err)
  }
}

/** 删除一个 key */
async function deleteNode(req, res, next) {
  try {
    const { langCode, keyPath } = req.body
    if (!langCode || !keyPath) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.deleteNode(langCode, keyPath))
  } catch (err) {
    next(err)
  }
}

/** 整语言灌值（批量翻译结果保存） */
async function saveLanguageValues(req, res, next) {
  try {
    const { langCode, data } = req.body
    if (!langCode || !data) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.saveLanguageValues(langCode, data))
  } catch (err) {
    next(err)
  }
}

// ========== 创建语言 ==========

/** 以源语言目录为模板创建新语言（新语言必须命中预设） */
async function createLanguage(req, res, next) {
  try {
    const { sourceLangCode, newLangCode, copyValues } = req.body
    if (!sourceLangCode || !newLangCode) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.createLanguage(sourceLangCode, newLangCode, copyValues === true))
  } catch (err) {
    next(err)
  }
}

// ========== zip 备份 / 恢复 / 删除 ==========

/** 创建整目录 zip 备份 */
async function backupLanguage(req, res, next) {
  try {
    const { langCode } = req.body
    if (!langCode) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.backupLanguage(langCode))
  } catch (err) {
    next(err)
  }
}

/** 备份清单（可按 langCode 过滤） */
async function getBackupList(req, res, next) {
  try {
    const { langCode } = req.query
    res.success(i18nManagerService.getBackupList(langCode))
  } catch (err) {
    next(err)
  }
}

/** 恢复备份（恢复前自动备份当前） */
async function restoreBackup(req, res, next) {
  try {
    const { backupFileName, langCode } = req.body
    if (!backupFileName || !langCode) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.restoreBackup(backupFileName, langCode))
  } catch (err) {
    next(err)
  }
}

/** 删除备份 */
async function deleteBackup(req, res, next) {
  try {
    const { backupFileName } = req.body
    if (!backupFileName) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.deleteBackup(backupFileName))
  } catch (err) {
    next(err)
  }
}

// ========== 备份目录配置 ==========

async function getBackupConfig(req, res, next) {
  try {
    res.success(i18nManagerService.getBackupConfig())
  } catch (err) {
    next(err)
  }
}

async function setBackupDir(req, res, next) {
  try {
    const { backupDir } = req.body
    if (!backupDir) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.setBackupDir(backupDir))
  } catch (err) {
    next(err)
  }
}

// ========== 预设语言 ==========

async function getPresetLanguages(req, res, next) {
  try {
    res.success(i18nManagerService.getPresetLanguages())
  } catch (err) {
    next(err)
  }
}

async function getPresetLanguagesConfigContent(req, res, next) {
  try {
    res.success(i18nManagerService.getPresetLanguagesConfigContent())
  } catch (err) {
    next(err)
  }
}

async function savePresetLanguagesConfigContent(req, res, next) {
  try {
    const { content } = req.body
    if (!content) return res.error('PARAM_MISSING', null, 400)
    res.success(i18nManagerService.savePresetLanguagesConfigContent(content))
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listLanguages,
  readLanguage,
  searchLanguage,
  saveNodeValue,
  addNode,
  deleteNode,
  saveLanguageValues,
  createLanguage,
  backupLanguage,
  getBackupList,
  restoreBackup,
  deleteBackup,
  getBackupConfig,
  setBackupDir,
  getPresetLanguages,
  getPresetLanguagesConfigContent,
  savePresetLanguagesConfigContent
}
