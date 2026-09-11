/**
 * 国际化管理服务（模块化「目录模型」版）
 *
 * 模型（标准，固定）：
 *   一种语言 = 前端 src/i18n 下的一个模块目录
 *     中文 zh-CN -> modules；其他语言 -> modules-<langCode 全小写>（如 en-US -> modules-en-us）
 *   目录内部由 i18n-catalog.util.js 引擎按每层 index.js 聚合，本服务不自行解析结构。
 *
 * 职责：
 *   1. 语言目录列表 / 整语言读取 / 搜索
 *   2. 节点级（单个 key）增删改、整语言灌值（批量翻译）
 *   3. 以源语言目录为模板创建新语言（可清空译文）
 *   4. zip 整目录备份 / 清单 / 恢复（恢复前自动备份当前）/ 删除
 *   5. 备份目录配置、预设语言配置
 *
 * 设计原则：不使用兜底。语言目录缺失、key 无法定位、备份结构不合法一律抛 BusinessError 暴露问题。
 * 母版语言不写死，每次从前端 translation-config.json 的 masterLanguage 动态读取。
 */

const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')

const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')
const presetModule = require('../../config/languages.config')
const catalog = require('./i18n-catalog.util')

// ========== 路径配置 ==========

// 前端项目根目录
const FRONTEND_ROOT = path.resolve(__dirname, '../../../../../02.01-nexCM/02.01.02-nexCM-V3')
// 前端国际化根目录（目录模型：其下是 modules / modules-xx 语言目录）
const I18N_ROOT = path.join(FRONTEND_ROOT, 'src', 'i18n')
// 前端翻译（母版）配置：母版语言动态来源
const TRANSLATION_CONFIG_FILE = path.join(FRONTEND_ROOT, 'src', 'config', 'data', 'translation-config.json')

// 默认备份目录
const DEFAULT_BACKUP_DIR = path.join(__dirname, '../../../backups', 'i18n')
// 备份目录配置文件
const BACKUP_CONFIG_FILE = path.join(__dirname, '../../config', 'i18n-backup-config.json')
// 预设语言配置文件（支持高级编辑）
const PRESET_LANGUAGES_CONFIG_FILE = path.join(__dirname, '../../config', 'languages.config.js')

// ========== 预设语言（可在保存配置后热刷新） ==========

let PRESET_LIST = Array.isArray(presetModule.PRESET_LANGUAGES) ? presetModule.PRESET_LANGUAGES : []
let PRESET_MAP = buildPresetMap(PRESET_LIST)

function buildPresetMap(list) {
  const map = {}
  for (const item of list) map[item.code] = item
  return map
}

function reloadPresets() {
  delete require.cache[require.resolve('../../config/languages.config')]
  // eslint-disable-next-line global-require
  const mod = require('../../config/languages.config')
  PRESET_LIST = Array.isArray(mod.PRESET_LANGUAGES) ? mod.PRESET_LANGUAGES : []
  PRESET_MAP = buildPresetMap(PRESET_LIST)
}

// ========== 基础工具 ==========

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

/** 母版语言：动态读取翻译配置，缺省回落到物理基准 zh-CN（仅配置缺省，非翻译兜底） */
function getMasterLangCode() {
  try {
    if (fs.existsSync(TRANSLATION_CONFIG_FILE)) {
      const cfg = JSON.parse(fs.readFileSync(TRANSLATION_CONFIG_FILE, 'utf-8'))
      if (cfg && cfg.masterLanguage) return cfg.masterLanguage
    }
  } catch (e) {
    // 配置不可读时使用物理基准语言
  }
  return catalog.PHYSICAL_MASTER_CODE
}

/** 校验 langCode 基本格式：xx-YY（语言-区域），允许 2~3 位语言码 */
function assertValidLangCode(langCode) {
  if (!langCode || typeof langCode !== 'string' || !/^[A-Za-z]{2,3}-[A-Za-z]{2}$/.test(langCode)) {
    throw new BusinessError(ERROR_CODE.I18N_LANG_CODE_INVALID, { langCode: langCode || null })
  }
}

/** 断言语言目录存在，返回语言目录绝对路径 */
function assertLangExists(langCode) {
  const dir = catalog.langDirPath(I18N_ROOT, langCode)
  if (!fs.existsSync(dir) || !fs.existsSync(path.join(dir, 'index.js'))) {
    throw new BusinessError(ERROR_CODE.I18N_LANG_NOT_FOUND, { langCode })
  }
  return dir
}

/** 备份文件名只取 basename，防止目录穿越 */
function safeBackupName(backupFileName) {
  const name = path.basename(backupFileName || '')
  if (!name.endsWith('.zip')) {
    throw new BusinessError(ERROR_CODE.PARAM_INVALID, { backupFileName: backupFileName || null })
  }
  return name
}

// ========== 语言列表 / 读取 / 搜索 ==========

/**
 * 列出全部语言（扫描模块目录 + 预设元数据 + 动态母版标记）
 * @returns {Array<object>} 语言列表，母版排第一
 */
function listLanguages() {
  const knownCodes = PRESET_LIST.map((p) => p.code)
  const dirs = catalog.listLangDirs(I18N_ROOT, knownCodes)
  const master = getMasterLangCode()

  const list = dirs.map((d) => {
    const preset = PRESET_MAP[d.langCode] || {}
    const stats = catalog.dirStats(d.abs)
    let fieldCount = 0
    try {
      fieldCount = Object.keys(catalog.flattenObject(catalog.assembleLanguage(I18N_ROOT, d.langCode))).length
    } catch (e) {
      fieldCount = 0
    }
    return {
      langCode: d.langCode,
      dirName: d.dirName,
      name: preset.name || d.langCode,
      autonym: preset.autonym || d.langCode,
      flag: preset.flag || '',
      isMaster: d.langCode === master,
      isBuiltIn: !!PRESET_MAP[d.langCode],
      fieldCount,
      size: stats.size,
      updatedAt: stats.updatedAt
    }
  })

  list.sort((a, b) => (b.isMaster ? 1 : 0) - (a.isMaster ? 1 : 0) || a.langCode.localeCompare(b.langCode))
  return list
}

/**
 * 聚合读取整门语言
 * @returns {{langCode:string,data:object,flatData:object,fieldCount:number,size:number,updatedAt:string|null}}
 */
function readLanguage(langCode) {
  assertValidLangCode(langCode)
  const dir = assertLangExists(langCode)
  const data = catalog.assembleLanguage(I18N_ROOT, langCode)
  const flatData = catalog.flattenObject(data)
  const stats = catalog.dirStats(dir)
  return {
    langCode,
    dirName: catalog.dirNameForLangCode(langCode),
    data,
    flatData,
    fieldCount: Object.keys(flatData).length,
    size: stats.size,
    updatedAt: stats.updatedAt
  }
}

/**
 * 在一门语言内按 key / 值搜索
 * @returns {Array<{key:string,value:*}>}
 */
function searchLanguage(langCode, keyword) {
  if (!keyword) return []
  const { flatData } = readLanguage(langCode)
  const lower = String(keyword).toLowerCase()
  const results = []
  for (const [key, value] of Object.entries(flatData)) {
    if (key.toLowerCase().includes(lower) || String(value == null ? '' : value).toLowerCase().includes(lower)) {
      results.push({ key, value })
    }
  }
  return results
}

// ========== 节点级写回（单个 key） ==========

/**
 * 修改单个已存在 key 的值（定位到叶子文件，仅重写该叶子并保留文件头）
 * @param {string} langCode 语言
 * @param {string} keyPath 点分全局 key，如 common.action.confirm
 * @param {*} value 新值
 */
function saveNodeValue(langCode, keyPath, value) {
  assertValidLangCode(langCode)
  assertLangExists(langCode)
  const segs = String(keyPath || '').split('.').filter(Boolean)
  if (!segs.length) throw new BusinessError(ERROR_CODE.PARAM_MISSING, { field: 'keyPath' })

  const loc = catalog.locateLeafFile(I18N_ROOT, langCode, segs)
  const leaf = catalog.parseModuleObject(loc.file)
  const before = catalog.getValueBySegments(leaf, loc.inFileSegments)
  if (before === undefined) {
    throw new BusinessError(ERROR_CODE.I18N_KEY_NOT_FOUND, { key: keyPath })
  }
  catalog.setValueBySegments(leaf, loc.inFileSegments, value)
  catalog.writeModuleObject(loc.file, leaf)
  return { langCode, key: keyPath, file: path.relative(FRONTEND_ROOT, loc.file) }
}

/**
 * 新增一个 key（父路径可多级，自动创建中间对象）
 * @param {string} [spreadFile] 仅 common 平铺新增时需要，指定落在 action/status/message/table 哪个分类文件
 */
function addNode(langCode, parentPath, key, value, spreadFile) {
  assertValidLangCode(langCode)
  assertLangExists(langCode)
  if (!key) throw new BusinessError(ERROR_CODE.PARAM_MISSING, { field: 'key' })

  const segs = (parentPath ? String(parentPath).split('.').filter(Boolean) : []).concat(key)
  const fullKey = segs.join('.')

  // 已存在则拒绝
  const flat = catalog.flattenObject(catalog.assembleLanguage(I18N_ROOT, langCode))
  if (flat[fullKey] !== undefined) {
    throw new BusinessError(ERROR_CODE.I18N_KEY_EXISTS, { key: fullKey })
  }

  const loc = catalog.locateLeafFile(I18N_ROOT, langCode, segs, { create: true, spreadFile })
  const leaf = catalog.parseModuleObject(loc.file)
  catalog.setValueBySegments(leaf, loc.inFileSegments, value === undefined ? '' : value)
  catalog.writeModuleObject(loc.file, leaf)
  return { langCode, key: fullKey, file: path.relative(FRONTEND_ROOT, loc.file) }
}

/** 删除一个 key */
function deleteNode(langCode, keyPath) {
  assertValidLangCode(langCode)
  assertLangExists(langCode)
  const segs = String(keyPath || '').split('.').filter(Boolean)
  if (!segs.length) throw new BusinessError(ERROR_CODE.PARAM_MISSING, { field: 'keyPath' })

  const loc = catalog.locateLeafFile(I18N_ROOT, langCode, segs)
  const leaf = catalog.parseModuleObject(loc.file)
  const ok = catalog.deleteBySegments(leaf, loc.inFileSegments)
  if (!ok) throw new BusinessError(ERROR_CODE.I18N_KEY_NOT_FOUND, { key: keyPath })
  catalog.writeModuleObject(loc.file, leaf)
  return { langCode, key: keyPath, file: path.relative(FRONTEND_ROOT, loc.file) }
}

/**
 * 整语言灌值（批量翻译）：以磁盘现有叶子骨架为准，把传入嵌套对象的值按叶子归集后逐叶子写回
 * 只更新已存在的 key，不新增结构；只重写被改动的叶子文件，保留文件头。
 * @param {string} langCode 语言
 * @param {object} fullData 完整嵌套数据（值为译文）
 */
function saveLanguageValues(langCode, fullData) {
  assertValidLangCode(langCode)
  assertLangExists(langCode)
  if (!fullData || typeof fullData !== 'object') {
    throw new BusinessError(ERROR_CODE.PARAM_MISSING, { field: 'data' })
  }
  const flat = catalog.flattenObject(fullData)
  const dirty = new Map()
  let updatedFields = 0

  for (const [flatKey, value] of Object.entries(flat)) {
    const segs = flatKey.split('.')
    // 只更新磁盘上已存在的 key（locateLeafFile 找不到即抛错，不静默新增，符合不兜底原则）
    const loc = catalog.locateLeafFile(I18N_ROOT, langCode, segs)
    if (!dirty.has(loc.file)) dirty.set(loc.file, catalog.parseModuleObject(loc.file))
    catalog.setValueBySegments(dirty.get(loc.file), loc.inFileSegments, value)
    updatedFields += 1
  }

  for (const [file, obj] of dirty) catalog.writeModuleObject(file, obj)
  return { langCode, updatedFiles: dirty.size, updatedFields }
}

// ========== 创建语言（整树复制） ==========

/**
 * 以源语言目录为模板创建新语言
 * @param {string} sourceLangCode 源语言
 * @param {string} newLangCode 新语言 code（必须命中预设语言，不允许自由键入）
 * @param {boolean} copyValues true=连同译文一起复制；false=清空全部字符串叶子（待翻译）
 */
function createLanguage(sourceLangCode, newLangCode, copyValues) {
  assertValidLangCode(sourceLangCode)
  assertValidLangCode(newLangCode)
  assertLangExists(sourceLangCode)

  const preset = PRESET_MAP[newLangCode]
  if (!preset) {
    throw new BusinessError(ERROR_CODE.I18N_PRESET_NOT_FOUND, { langCode: newLangCode })
  }

  const withValues = copyValues === true
  // copyLanguageTree 第 4 参 clearValues：不复制译文时清空字符串叶子
  catalog.copyLanguageTree(I18N_ROOT, sourceLangCode, newLangCode, !withValues)

  // 创建后必须能正常聚合，否则立即暴露结构问题
  const fieldCount = Object.keys(catalog.flattenObject(catalog.assembleLanguage(I18N_ROOT, newLangCode))).length

  return {
    success: true,
    langCode: newLangCode,
    dirName: catalog.dirNameForLangCode(newLangCode),
    sourceLangCode,
    copyValues: withValues,
    langName: preset.autonym,
    autonym: preset.autonym,
    name: preset.name,
    flag: preset.flag || '',
    fieldCount
  }
}

// ========== zip 备份 / 清单 / 恢复 / 删除 ==========

function pad2(n) {
  return String(n).padStart(2, '0')
}

/** 生成 YYYYMMDD_HHMMSS（本地时间） */
function timestamp() {
  const d = new Date()
  return (
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}` +
    `_${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`
  )
}

function backupZipName(langCode, ts) {
  const slug = langCode.replace(/-/g, '_').toLowerCase()
  return `i18n_${slug}_${ts}.zip`
}

/** 从备份文件名解析 langCode（大小写不敏感匹配已知语言）与时间 */
function parseBackupName(fileName, knownCodes) {
  const m = /^i18n_([a-z0-9_]+?)_(\d{8}_\d{6})\.zip$/.exec(fileName)
  if (!m) return null
  const langSlug = m[1].replace(/_/g, '-')
  let langCode = null
  const hit = (knownCodes || []).find((c) => c.toLowerCase() === langSlug.toLowerCase())
  if (hit) langCode = hit
  else if (langSlug.toLowerCase() === catalog.PHYSICAL_MASTER_CODE.toLowerCase()) langCode = catalog.PHYSICAL_MASTER_CODE
  const t = /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})$/.exec(m[2])
  let createdAt = null
  if (t) createdAt = new Date(+t[1], +t[2] - 1, +t[3], +t[4], +t[5], +t[6]).toISOString()
  return { langCode, stamp: m[2], createdAt }
}

/** 把一门语言整目录打成 zip（zip 内顶层保留语言目录名） */
function backupLanguage(langCode) {
  assertValidLangCode(langCode)
  const dir = assertLangExists(langCode)
  const backupDir = getBackupDir()
  ensureDir(backupDir)

  const fileName = backupZipName(langCode, timestamp())
  const filePath = path.join(backupDir, fileName)

  const zip = new AdmZip()
  zip.addLocalFolder(dir, catalog.dirNameForLangCode(langCode))
  zip.writeZip(filePath)

  const stat = fs.statSync(filePath)
  return {
    success: true,
    langCode,
    backupFile: fileName,
    backupPath: filePath,
    size: stat.size,
    createdAt: new Date().toISOString()
  }
}

/** 备份清单，时间以文件名时间戳为准（规避文件 birthtime 被复制定格的问题），可按语言过滤 */
function getBackupList(langCode) {
  const backupDir = getBackupDir()
  if (!fs.existsSync(backupDir)) return []
  const knownCodes = listLanguages().map((l) => l.langCode)

  return fs
    .readdirSync(backupDir)
    .filter((f) => f.endsWith('.zip'))
    .map((f) => {
      const parsed = parseBackupName(f, knownCodes)
      const stat = fs.statSync(path.join(backupDir, f))
      return {
        fileName: f,
        langCode: parsed ? parsed.langCode : null,
        size: stat.size,
        createdAt: parsed ? parsed.createdAt : stat.mtime.toISOString(),
        path: path.join(backupDir, f)
      }
    })
    .filter((item) => !langCode || item.langCode === langCode)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * 恢复备份：恢复前自动备份当前语言目录；校验 zip 顶层目录与目标语言一致后清空并解压
 */
function restoreBackup(backupFileName, langCode) {
  assertValidLangCode(langCode)
  assertLangExists(langCode)
  const name = safeBackupName(backupFileName)
  const backupDir = getBackupDir()
  const zipPath = path.join(backupDir, name)
  if (!fs.existsSync(zipPath)) {
    throw new BusinessError(ERROR_CODE.I18N_BACKUP_NOT_FOUND, { backupFile: name })
  }

  const expectedTop = catalog.dirNameForLangCode(langCode)
  let zip
  try {
    zip = new AdmZip(zipPath)
  } catch (e) {
    throw new BusinessError(ERROR_CODE.I18N_BACKUP_INVALID, { backupFile: name })
  }
  const tops = new Set(zip.getEntries().map((en) => en.entryName.split('/')[0]).filter(Boolean))
  if (tops.size !== 1 || !tops.has(expectedTop)) {
    throw new BusinessError(ERROR_CODE.I18N_BACKUP_INVALID, { backupFile: name, expected: expectedTop })
  }

  // 恢复前先备份当前状态
  const preBackup = backupLanguage(langCode)

  // 清空目标语言目录后解压到 i18n 根（zip 顶层目录即目标目录）
  const targetDir = catalog.langDirPath(I18N_ROOT, langCode)
  fs.rmSync(targetDir, { recursive: true, force: true })
  ensureDir(targetDir)
  zip.extractAllTo(I18N_ROOT, true)

  // 恢复后必须能正常聚合，否则判定为结构不合法
  catalog.assembleLanguage(I18N_ROOT, langCode)

  return {
    success: true,
    langCode,
    restoredFrom: name,
    currentBackup: preBackup.backupFile
  }
}

/** 删除一个备份 zip */
function deleteBackup(backupFileName) {
  const name = safeBackupName(backupFileName)
  const backupDir = getBackupDir()
  const filePath = path.join(backupDir, name)
  if (!fs.existsSync(filePath)) {
    throw new BusinessError(ERROR_CODE.I18N_BACKUP_NOT_FOUND, { backupFile: name })
  }
  fs.unlinkSync(filePath)
  return { success: true, deletedFile: name }
}

// ========== 备份目录配置 ==========

function getBackupDir() {
  try {
    if (fs.existsSync(BACKUP_CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(BACKUP_CONFIG_FILE, 'utf-8'))
      if (config.backupDir) return config.backupDir
    }
  } catch (e) {
    // 配置读取失败使用默认目录
  }
  return DEFAULT_BACKUP_DIR
}

function setBackupDir(dirPath) {
  if (!dirPath || typeof dirPath !== 'string') {
    throw new BusinessError(ERROR_CODE.PARAM_MISSING, { field: 'backupDir' })
  }
  ensureDir(path.dirname(BACKUP_CONFIG_FILE))
  const config = { backupDir: dirPath, updatedAt: new Date().toISOString() }
  fs.writeFileSync(BACKUP_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
  ensureDir(dirPath)
  return { backupDir: dirPath }
}

function getBackupConfig() {
  return {
    backupDir: getBackupDir(),
    defaultBackupDir: DEFAULT_BACKUP_DIR,
    i18nRoot: I18N_ROOT,
    frontendRoot: FRONTEND_ROOT,
    masterLanguage: getMasterLangCode()
  }
}

// ========== 预设语言 ==========

function getPresetLanguages() {
  return PRESET_LIST
}

function getPresetLanguage(code) {
  return PRESET_MAP[code] || null
}

function getPresetLanguagesConfigContent() {
  return fs.readFileSync(PRESET_LANGUAGES_CONFIG_FILE, 'utf-8')
}

function savePresetLanguagesConfigContent(content) {
  if (!content || typeof content !== 'string') {
    throw new BusinessError(ERROR_CODE.PARAM_MISSING, { field: 'content' })
  }
  fs.writeFileSync(PRESET_LANGUAGES_CONFIG_FILE, content, 'utf-8')
  reloadPresets()
  return { success: true, count: PRESET_LIST.length }
}

module.exports = {
  // 路径与母版
  I18N_ROOT,
  FRONTEND_ROOT,
  getMasterLangCode,
  // 语言读取
  listLanguages,
  readLanguage,
  searchLanguage,
  // 节点写回
  saveNodeValue,
  addNode,
  deleteNode,
  saveLanguageValues,
  // 创建语言
  createLanguage,
  // zip 备份
  backupLanguage,
  getBackupList,
  restoreBackup,
  deleteBackup,
  // 备份配置
  getBackupConfig,
  getBackupDir,
  setBackupDir,
  // 预设语言
  getPresetLanguages,
  getPresetLanguage,
  getPresetLanguagesConfigContent,
  savePresetLanguagesConfigContent,
  reloadPresets
}
