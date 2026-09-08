/**
 * 国际化管理模块 - 控制器层
 * 处理 HTTP 请求，调用服务层
 */

const i18nManagerService = require('./i18n-manager.service')

/**
 * 获取国际化文件列表
 */
async function getFileList(req, res, next) {
  try {
    const files = i18nManagerService.getFileList()
    res.json({
      code: 200,
      message: 'success',
      data: files
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 读取国际化文件内容
 */
async function readFile(req, res, next) {
  try {
    const { fileName } = req.query
    if (!fileName) {
      return res.status(400).json({ code: 400, message: 'fileName 参数不能为空' })
    }
    const data = i18nManagerService.readFile(fileName)
    res.json({
      code: 200,
      message: 'success',
      data
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 搜索国际化内容
 */
async function searchContent(req, res, next) {
  try {
    const { fileName, keyword } = req.query
    if (!fileName || !keyword) {
      return res.status(400).json({ code: 400, message: 'fileName 和 keyword 参数不能为空' })
    }
    const data = i18nManagerService.searchContent(fileName, keyword)
    res.json({
      code: 200,
      message: 'success',
      data
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 保存国际化文件内容
 */
async function saveFile(req, res, next) {
  try {
    const { fileName, data } = req.body
    if (!fileName || !data) {
      return res.status(400).json({ code: 400, message: 'fileName 和 data 参数不能为空' })
    }
    const result = i18nManagerService.saveFile(fileName, data)
    res.json({
      code: 200,
      message: '保存成功，请重新编译或刷新页面',
      data: result
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 手动备份
 */
async function backupFile(req, res, next) {
  try {
    const { fileName } = req.body
    if (!fileName) {
      return res.status(400).json({ code: 400, message: 'fileName 参数不能为空' })
    }
    const result = i18nManagerService.backupFile(fileName)
    res.json({
      code: 200,
      message: '备份成功',
      data: result
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 获取备份文件列表
 */
async function getBackupList(req, res, next) {
  try {
    const { fileName } = req.query
    const data = i18nManagerService.getBackupList(fileName)
    res.json({
      code: 200,
      message: 'success',
      data
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 恢复备份
 */
async function restoreBackup(req, res, next) {
  try {
    const { backupFileName, targetFileName } = req.body
    if (!backupFileName || !targetFileName) {
      return res.status(400).json({ code: 400, message: 'backupFileName 和 targetFileName 参数不能为空' })
    }
    const result = i18nManagerService.restoreBackup(backupFileName, targetFileName)
    res.json({
      code: 200,
      message: '恢复成功，请重新编译或刷新页面',
      data: result
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 删除备份
 */
async function deleteBackup(req, res, next) {
  try {
    const { backupFileName } = req.body
    if (!backupFileName) {
      return res.status(400).json({ code: 400, message: 'backupFileName 参数不能为空' })
    }
    const result = i18nManagerService.deleteBackup(backupFileName)
    res.json({
      code: 200,
      message: '删除成功',
      data: result
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 新增国际化配置
 */
async function addConfig(req, res, next) {
  try {
    const { fileName, parentPath, key, value } = req.body
    if (!fileName || !key || value === undefined) {
      return res.status(400).json({ code: 400, message: 'fileName、key、value 参数不能为空' })
    }
    const result = i18nManagerService.addConfig(fileName, parentPath, key, value)
    res.json({
      code: 200,
      message: '新增成功，请重新编译或刷新页面',
      data: result
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 删除国际化配置
 */
async function deleteConfig(req, res, next) {
  try {
    const { fileName, keyPath } = req.body
    if (!fileName || !keyPath) {
      return res.status(400).json({ code: 400, message: 'fileName 和 keyPath 参数不能为空' })
    }
    const result = i18nManagerService.deleteConfig(fileName, keyPath)
    res.json({
      code: 200,
      message: '删除成功，请重新编译或刷新页面',
      data: result
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 获取备份目录配置
 */
async function getBackupConfig(req, res, next) {
  try {
    const data = i18nManagerService.getBackupConfig()
    res.json({
      code: 200,
      message: 'success',
      data
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 设置备份目录
 */
async function setBackupDir(req, res, next) {
  try {
    const { backupDir } = req.body
    if (!backupDir) {
      return res.status(400).json({ code: 400, message: 'backupDir 参数不能为空' })
    }
    i18nManagerService.setBackupDir(backupDir)
    res.json({
      code: 200,
      message: '备份目录设置成功',
      data: { backupDir }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 创建新语言文件
 */
async function createLanguage(req, res, next) {
  try {
    const { sourceFileName, newFileName, newLangName, copyValues } = req.body
    if (!sourceFileName || !newFileName) {
      return res.status(400).json({ code: 400, message: 'sourceFileName 和 newFileName 参数不能为空' })
    }
    const result = i18nManagerService.createLanguage(
      sourceFileName,
      newFileName,
      newLangName || newFileName,
      copyValues !== false
    )
    res.json({
      code: 200,
      message: '语言创建成功',
      data: result
    })
  } catch (err) {
    console.error('[I18N] createLanguage controller - 捕获异常:', err)
    next(err)
  }
}

/**
 * 获取预设语言列表
 */
async function getPresetLanguages(req, res, next) {
  try {
    const languages = i18nManagerService.getPresetLanguages()
    res.json({
      code: 200,
      message: 'success',
      data: languages
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 获取所有语言元数据
 */
async function getAllLanguageMeta(req, res, next) {
  try {
    const meta = i18nManagerService.getAllLanguageMeta()
    res.json({
      code: 200,
      message: 'success',
      data: meta
    })
  } catch (err) {
    next(err)
  }
}

// 获取预设语言配置文件内容
async function getPresetLanguagesConfigContent(req, res, next) {
  try {
    const content = i18nManagerService.getPresetLanguagesConfigContent()
    res.json({
      code: 200,
      message: 'success',
      data: content
    })
  } catch (err) {
    next(err)
  }
}

// 保存预设语言配置文件内容
async function savePresetLanguagesConfigContent(req, res, next) {
  try {
    const { content } = req.body
    if (!content) {
      return res.status(400).json({
        code: 400,
        message: '内容不能为空'
      })
    }
    const success = i18nManagerService.savePresetLanguagesConfigContent(content)
    if (success) {
      res.json({
        code: 200,
        message: '保存成功'
      })
    } else {
      res.status(500).json({
        code: 500,
        message: '保存失败'
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getFileList,
  readFile,
  searchContent,
  saveFile,
  backupFile,
  getBackupList,
  restoreBackup,
  deleteBackup,
  addConfig,
  deleteConfig,
  getBackupConfig,
  setBackupDir,
  createLanguage,
  getPresetLanguages,
  getAllLanguageMeta,
  getPresetLanguagesConfigContent,
  savePresetLanguagesConfigContent
}
