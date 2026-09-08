/**
 * 国际化管理服务
 * 负责前端国际化语言文件的读取、保存、备份、恢复、搜索等功能
 * 同时管理语言元数据和预设语言列表
 */

const fs = require('fs')
const path = require('path')
const { PRESET_LANGUAGES } = require('../../config/languages.config')

// ========== 路径配置 ==========

// 前端项目根目录
const FRONTEND_ROOT = path.resolve(__dirname, '../../../../../02.01-nexCM/02.01.02-nexCM-V3')
// 前端国际化语言文件目录
const I18N_DIR = path.join(FRONTEND_ROOT, 'src', 'i18n', 'langs')

// 默认备份目录
const DEFAULT_BACKUP_DIR = path.join(__dirname, '../../../backups', 'i18n')

// 备份配置文件路径
const BACKUP_CONFIG_FILE = path.join(__dirname, '../../config', 'i18n-backup-config.json')

// 语言元数据配置文件路径
const LANGUAGES_CONFIG_FILE = path.join(__dirname, '../../config', 'i18n-languages.json')

// 预设语言配置文件路径
const PRESET_LANGUAGES_CONFIG_FILE = path.join(__dirname, '../../config', 'languages.config.js')

// ========== 工具函数 ==========

/**
 * 确保目录存在，不存在则创建
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * 获取备份目录
 * 优先从配置文件读取，否则使用默认目录
 */
function getBackupDir() {
  try {
    if (fs.existsSync(BACKUP_CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(BACKUP_CONFIG_FILE, 'utf-8'))
      if (config.backupDir) {
        return config.backupDir
      }
    }
  } catch (e) {
    // 读取配置失败时使用默认目录
  }
  return DEFAULT_BACKUP_DIR
}

/**
 * 设置备份目录
 */
function setBackupDir(dirPath) {
  ensureDir(path.dirname(BACKUP_CONFIG_FILE))
  const config = { backupDir: dirPath, updatedAt: new Date().toISOString() }
  fs.writeFileSync(BACKUP_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
  ensureDir(dirPath)
}

/**
 * 将嵌套对象扁平化
 * 例如：{ a: { b: 1 } } -> { 'a.b': 1 }
 */
function flattenObject(obj, prefix = '') {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey))
    } else {
      result[fullKey] = value
    }
  }
  return result
}

/**
 * 将扁平化对象还原为嵌套对象
 * 例如：{ 'a.b': 1 } -> { a: { b: 1 } }
 */
function unflattenObject(flatObj) {
  const result = {}
  for (const [keyPath, value] of Object.entries(flatObj)) {
    const keys = keyPath.split('.')
    let current = result
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
  }
  return result
}

/**
 * 将对象转换为 JS 模块字符串
 * 用于生成 export default 格式的语言文件
 */
function objectToJsModule(obj, indent = 0) {
  const spaces = '  '.repeat(indent)
  const childSpaces = '  '.repeat(indent + 1)
  
  if (obj === null || obj === undefined) {
    return 'null'
  }
  
  if (typeof obj === 'string') {
    // 转义字符串中的反斜杠和单引号
    const escaped = obj.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    return `'${escaped}'`
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj)
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    const items = obj.map(item => `${childSpaces}${objectToJsModule(item, indent + 1)}`)
    return `[\n${items.join(',\n')}\n${spaces}]`
  }
  
  if (typeof obj === 'object') {
    const keys = Object.keys(obj)
    if (keys.length === 0) return '{}'
    
    const items = keys.map(key => {
      const value = obj[key]
      // 如果 key 是合法标识符则不加引号，否则加引号
      const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`
      return `${childSpaces}${keyStr}: ${objectToJsModule(value, indent + 1)}`
    })
    
    return `{\n${items.join(',\n')}\n${spaces}}`
  }
  
  return String(obj)
}

/**
 * 生成时间戳字符串
 * 格式：YYYYMMDD_HHMMSS
 */
function getTimestamp() {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
}

// ========== 语言元数据管理 ==========

/**
 * 获取所有语言元数据
 * 从 i18n-languages.json 文件读取
 */
function getAllLanguageMeta() {
  try {
    if (fs.existsSync(LANGUAGES_CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(LANGUAGES_CONFIG_FILE, 'utf-8'))
    }
  } catch (e) {
    console.error('[I18N] 读取语言元数据配置文件失败:', e)
  }
  return {}
}

/**
 * 获取指定语言的元数据
 */
function getLanguageMeta(langCode) {
  const allMeta = getAllLanguageMeta()
  return allMeta[langCode] || null
}

/**
 * 保存指定语言的元数据
 */
function saveLanguageMeta(langCode, meta) {
  try {
    ensureDir(path.dirname(LANGUAGES_CONFIG_FILE))
    const allMeta = getAllLanguageMeta()
    allMeta[langCode] = {
      ...meta,
      code: langCode,
      updatedAt: new Date().toISOString()
    }
    fs.writeFileSync(LANGUAGES_CONFIG_FILE, JSON.stringify(allMeta, null, 2), 'utf-8')
    return true
  } catch (e) {
    console.error('[I18N] 保存语言元数据失败:', e)
    return false
  }
}

/**
 * 获取语言名称（优先使用 autonym）
 */
function getLangName(langCode) {
  // 优先从语言元数据获取
  const meta = getLanguageMeta(langCode)
  if (meta && meta.autonym) {
    return meta.autonym
  }
  
  // 其次从预设语言列表获取
  const preset = PRESET_LANGUAGES.find((l) => l.code === langCode)
  if (preset) {
    return preset.autonym
  }
  
  // 最后返回语言代码
  return langCode
}

// ========== 预设语言管理 ==========

/**
 * 获取所有预设语言列表
 */
function getPresetLanguages() {
  return PRESET_LANGUAGES
}

/**
 * 获取指定语言的预设信息
 */
function getPresetLanguage(langCode) {
  return PRESET_LANGUAGES.find((l) => l.code === langCode) || null
}

/**
 * 读取预设语言配置文件内容
 */
function getPresetLanguagesConfigContent() {
  try {
    if (fs.existsSync(PRESET_LANGUAGES_CONFIG_FILE)) {
      return fs.readFileSync(PRESET_LANGUAGES_CONFIG_FILE, 'utf-8')
    }
  } catch (e) {
    console.error('[I18N] 读取预设语言配置文件失败:', e)
  }
  return ''
}

/**
 * 保存预设语言配置文件内容
 */
function savePresetLanguagesConfigContent(content) {
  try {
    ensureDir(path.dirname(PRESET_LANGUAGES_CONFIG_FILE))
    fs.writeFileSync(PRESET_LANGUAGES_CONFIG_FILE, content, 'utf-8')
    return true
  } catch (e) {
    console.error('[I18N] 保存预设语言配置文件失败:', e)
    return false
  }
}

// ========== 文件管理 ==========

/**
 * 获取语言文件列表
 * 返回包含文件名、语言代码、语言名称、大小、更新时间等信息的数组
 */
function getFileList() {
  if (!fs.existsSync(I18N_DIR)) {
    return []
  }
  
  // 获取所有语言元数据
  const allMeta = getAllLanguageMeta()
  
  let files = fs.readdirSync(I18N_DIR)
    .filter(f => f.endsWith('.js'))
    .map(f => {
      const filePath = path.join(I18N_DIR, f)
      const stats = fs.statSync(filePath)
      // 从文件名提取语言代码，例如 zh-CN.js -> zh-CN
      const langCode = f.replace('.js', '')
      // 优先从语言元数据获取，其次从预设语言获取
      const meta = allMeta[langCode] || getPresetLanguage(langCode) || {}
      return {
        fileName: f,
        langCode,
        langName: meta.autonym || meta.name || langCode,
        name: meta.name || langCode,
        autonym: meta.autonym || langCode,
        flag: meta.flag || '',
        isBuiltIn: meta.isBuiltIn || false,
        isMaster: meta.isMaster || false,
        size: stats.size,
        updatedAt: stats.mtime.toISOString(),
        path: filePath
      }
    })
  
  // 排序：中文优先，其他按文件名排序
  files = files.sort((a, b) => {
    if (a.langCode === 'zh-CN') return -1
    if (b.langCode === 'zh-CN') return 1
    return a.fileName.localeCompare(b.fileName)
  })
  
  return files
}

/**
 * 解析国际化文件
 * 支持 ES module 格式（export default {...}）
 * 使用多种策略尝试解析，提高兼容性
 */
function parseI18nFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // 策略1：将 export default 替换为 return，然后用 new Function 执行
  try {
    const modifiedContent = content.replace(/export\s+default\s*/, 'return ')
    const fn = new Function(modifiedContent)
    const result = fn()
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      return result
    }
  } catch (e) {
    // 解析失败，尝试下一种策略
  }
  
  // 策略2：手动查找 export default 后的对象，匹配大括号
  try {
    const exportIndex = content.search(/export\s+default/)
    if (exportIndex !== -1) {
      const braceStart = content.indexOf('{', exportIndex)
      if (braceStart !== -1) {
        let depth = 0
        let braceEnd = -1
        let inString = false
        let stringChar = ''
        for (let i = braceStart; i < content.length; i++) {
          const char = content[i]
          if (inString) {
            if (char === stringChar && content[i-1] !== '\\') {
              inString = false
            }
          } else {
            if (char === '"' || char === "'" || char === '`') {
              inString = true
              stringChar = char
            } else if (char === '{') {
              depth++
            } else if (char === '}') {
              depth--
              if (depth === 0) {
                braceEnd = i
                break
              }
            }
          }
        }
        if (braceEnd !== -1) {
          const objectStr = content.substring(braceStart, braceEnd + 1)
          const fn = new Function(`return ${objectStr}`)
          const result = fn()
          if (result && typeof result === 'object' && !Array.isArray(result)) {
            return result
          }
        }
      }
    }
  } catch (e) {
    // 解析失败，尝试下一种策略
  }
  
  // 策略3：使用正则匹配 export default 后的对象
  try {
    const match = content.match(/export\s+default\s+({[\s\S]*})\s*;?\s*$/)
    if (match) {
      const fn = new Function(`return ${match[1]}`)
      const result = fn()
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        return result
      }
    }
  } catch (e) {
    // 解析失败
  }
  
  throw new Error('Internal error')
}

/**
 * 读取语言文件
 * 返回包含文件名、语言代码、数据、扁平化数据、更新时间的对象
 */
function readFile(fileName) {
  const filePath = path.join(I18N_DIR, fileName)
  if (!fs.existsSync(filePath)) {
    throw new Error('Internal error')
  }
  
  // 解析国际化文件
  const i18nData = parseI18nFile(filePath)
  
  // 验证解析结果
  if (!i18nData || typeof i18nData !== 'object' || Array.isArray(i18nData)) {
    throw new Error('Internal error')
  }
  
  return {
    fileName,
    langCode: fileName.replace('.js', ''),
    data: i18nData,
    flatData: flattenObject(i18nData),
    updatedAt: fs.statSync(filePath).mtime.toISOString()
  }
}

/**
 * 搜索语言文件内容
 * 在 key 和 value 中搜索关键词
 */
function searchContent(fileName, keyword) {
  const { flatData } = readFile(fileName)
  const lowerKeyword = keyword.toLowerCase()
  
  const results = []
  for (const [key, value] of Object.entries(flatData)) {
    const keyMatch = key.toLowerCase().includes(lowerKeyword)
    const valueMatch = String(value).toLowerCase().includes(lowerKeyword)
    if (keyMatch || valueMatch) {
      results.push({
        key,
        value,
        matchKey: keyMatch,
        matchValue: valueMatch
      })
    }
  }
  
  return {
    keyword,
    total: results.length,
    results
  }
}

/**
 * 保存语言文件
 * 保存前会自动创建备份
 */
function saveFile(fileName, data) {
  const filePath = path.join(I18N_DIR, fileName)
  if (!fs.existsSync(filePath)) {
    throw new Error('Internal error')
  }
  
  // 先创建备份
  const backupResult = backupFile(fileName)
  
  // 生成新文件内容
  const jsContent = `/**
 * ${fileName.replace('.js', '')} 国际化配置文件
 * 由国际化管理模块自动生成
 * 请勿手动修改此文件，除非您了解其结构
 * 
 * 最后更新时间: ${new Date().toISOString()}
 */

export default ${objectToJsModule(data, 0)}
`
  
  // 写入文件
  fs.writeFileSync(filePath, jsContent, 'utf-8')
  
  return {
    success: true,
    fileName,
    backupFile: backupResult.backupFile,
    updatedAt: new Date().toISOString()
  }
}

// ========== 备份管理 ==========

/**
 * 备份语言文件
 * 将文件复制到备份目录，文件名包含时间戳
 */
function backupFile(fileName) {
  const filePath = path.join(I18N_DIR, fileName)
  if (!fs.existsSync(filePath)) {
    throw new Error('Internal error')
  }
  
  const backupDir = getBackupDir()
  ensureDir(backupDir)
  
  const timestamp = getTimestamp()
  const backupFileName = `${fileName.replace('.js', '')}_${timestamp}.js`
  const backupFilePath = path.join(backupDir, backupFileName)
  
  // 复制文件
  fs.copyFileSync(filePath, backupFilePath)
  
  return {
    success: true,
    backupFile: backupFileName,
    backupPath: backupFilePath,
    createdAt: new Date().toISOString()
  }
}

/**
 * 获取备份文件列表
 * 可以指定文件名筛选特定语言的备份
 */
function getBackupList(fileName) {
  const backupDir = getBackupDir()
  if (!fs.existsSync(backupDir)) {
    return []
  }
  
  const langCode = fileName ? fileName.replace('.js', '') : null
  
  const files = fs.readdirSync(backupDir)
    .filter(f => f.endsWith('.js'))
    .filter(f => !langCode || f.startsWith(`${langCode}_`))
    .map(f => {
      const filePath = path.join(backupDir, f)
      const stats = fs.statSync(filePath)
      return {
        fileName: f,
        size: stats.size,
        createdAt: stats.mtime.toISOString(),
        path: filePath
      }
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  
  return files
}

/**
 * 恢复备份
 * 将备份文件恢复到语言文件目录
 * 恢复前会自动创建当前文件的备份
 */
function restoreBackup(backupFileName, targetFileName) {
  const backupDir = getBackupDir()
  const backupFilePath = path.join(backupDir, backupFileName)
  const targetFilePath = path.join(I18N_DIR, targetFileName)
  
  if (!fs.existsSync(backupFilePath)) {
    throw new Error('Internal error')
  }
  if (!fs.existsSync(targetFilePath)) {
    throw new Error('Internal error')
  }
  
  // 先备份当前文件
  const currentBackup = backupFile(targetFileName)
  
  // 恢复备份文件
  fs.copyFileSync(backupFilePath, targetFilePath)
  
  return {
    success: true,
    restoredFrom: backupFileName,
    targetFile: targetFileName,
    currentBackup: currentBackup.backupFile
  }
}

/**
 * 删除备份文件
 */
function deleteBackup(backupFileName) {
  const backupDir = getBackupDir()
  const backupFilePath = path.join(backupDir, backupFileName)
  
  if (!fs.existsSync(backupFilePath)) {
    throw new Error('Internal error')
  }
  
  fs.unlinkSync(backupFilePath)
  
  return { success: true, deletedFile: backupFileName }
}

// ========== 配置项管理 ==========

/**
 * 添加配置项
 * 在指定路径下添加新的 key-value 对
 */
function addConfig(fileName, parentPath, key, value) {
  const { data } = readFile(fileName)
  
  // 检查 key 是否已存在
  const fullPath = parentPath ? `${parentPath}.${key}` : key
  const flatData = flattenObject(data)
  if (flatData[fullPath] !== undefined) {
    throw new Error('Internal error')
  }
  
  // 导航到父路径，如果不存在则创建
  let parent = data
  if (parentPath) {
    const keys = parentPath.split('.')
    for (const k of keys) {
      if (!parent[k]) {
        parent[k] = {}
      }
      parent = parent[k]
    }
  }
  
  // 添加新的 key-value
  parent[key] = value
  
  // 保存文件
  return saveFile(fileName, data)
}

/**
 * 删除配置项
 * 删除指定路径的 key
 */
function deleteConfig(fileName, keyPath) {
  const { data } = readFile(fileName)
  
  const keys = keyPath.split('.')
  let parent = data
  
  // 导航到父路径
  for (let i = 0; i < keys.length - 1; i++) {
    if (!parent[keys[i]]) {
      throw new Error('Internal error')
    }
    parent = parent[keys[i]]
  }
  
  // 删除最后一个 key
  const lastKey = keys[keys.length - 1]
  if (parent[lastKey] === undefined) {
    throw new Error('Internal error')
  }
  delete parent[lastKey]
  
  // 保存文件
  return saveFile(fileName, data)
}

// ========== 备份配置 ==========

/**
 * 获取备份配置信息
 */
function getBackupConfig() {
  return {
    backupDir: getBackupDir(),
    defaultBackupDir: DEFAULT_BACKUP_DIR,
    i18nDir: I18N_DIR,
    frontendRoot: FRONTEND_ROOT
  }
}

// ========== 语言创建 ==========

/**
 * 创建新语言
 * 从源语言文件复制，生成新的语言文件
 * 同时保存语言元数据
 * 
 * @param {string} sourceFileName - 源语言文件名，例如 'zh-CN.js'
 * @param {string} newFileName - 新语言文件名，例如 'ja-JP.js'
 * @param {string} newLangName - 新语言名称（autonym），例如 '日本語'
 * @param {boolean} copyValues - 是否复制源语言的值，true 表示复制，false 表示清空值
 * @returns {object} 创建结果
 */
function createLanguage(sourceFileName, newFileName, newLangName, copyValues = true) {
  // 参数校验
  if (!sourceFileName || !newFileName) {
    throw new Error('Internal error')
  }
  if (!newFileName.endsWith('.js')) {
    throw new Error('New language file name must end with .js')
  }
  
  // 检查源文件是否存在
  const sourcePath = path.join(I18N_DIR, sourceFileName)
  if (!fs.existsSync(sourcePath)) {
    throw new Error('Internal error')
  }
  
  // 检查新文件是否已存在
  const newPath = path.join(I18N_DIR, newFileName)
  if (fs.existsSync(newPath)) {
    throw new Error('Internal error')
  }
  
  // 读取源文件数据
  const { data: sourceData } = readFile(sourceFileName)
  
  // 处理数据：复制值或清空值
  let newData
  if (copyValues) {
    // 深拷贝源数据
    newData = JSON.parse(JSON.stringify(sourceData))
  } else {
    // 递归清空所有值
    const clearValues = (obj) => {
      const result = {}
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          result[key] = clearValues(value)
        } else {
          result[key] = ''
        }
      }
      return result
    }
    newData = clearValues(sourceData)
  }
  
  // 生成新文件内容
  const content = `/**
 * ${newFileName.replace('.js', '')} 国际化配置文件
 * 由国际化管理模块自动生成
 * 请勿手动修改此文件，除非您了解其结构
 * 
 * 最后更新时间: ${new Date().toISOString()}
 */

export default ${objectToJsModule(newData, 0)}
`
  
  // 写入新文件
  fs.writeFileSync(newPath, content, 'utf-8')
  
  // 保存语言元数据
  const langCode = newFileName.replace('.js', '')
  // 从预设语言列表获取元数据
  const presetMeta = getPresetLanguage(langCode) || {}
  // 构建语言元数据
  const langMeta = {
    code: langCode,
    name: presetMeta.name || langCode,
    autonym: newLangName || presetMeta.autonym || langCode,
    flag: presetMeta.flag || '',
    fileName: newFileName,
    isBuiltIn: false,
    isMaster: false
  }
  saveLanguageMeta(langCode, langMeta)
  
  return {
    success: true,
    fileName: newFileName,
    langCode,
    langName: langMeta.autonym,
    langMeta,
    filePath: newPath,
    message: `语言文件创建成功: ${newFileName}`
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
  getBackupDir,
  getLangName,
  getAllLanguageMeta,
  getLanguageMeta,
  saveLanguageMeta,
  getPresetLanguages,
  getPresetLanguage,
  getPresetLanguagesConfigContent,
  savePresetLanguagesConfigContent,
  createLanguage
}
