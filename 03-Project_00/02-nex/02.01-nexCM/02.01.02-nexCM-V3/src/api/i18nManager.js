/**
 * 国际化管理 API
 * 后端路由前缀 /prod-api/v2/i18n-manager
 * 仅超级管理员可访问
 */
import request from '@/utils/request'

// ========== 文件管理 ==========

/**
 * 获取语言列表（所有登录用户可访问，用于语言切换）
 */
export function requestGetLanguagesApi() {
  return request({
    url: '/i18n-manager/languages',
    method: 'get'
  })
}

/**
 * 读取语言文件内容（所有登录用户可访问，用于动态加载语言包）
 * @param {string} fileName - 文件名（如 zh-CN.js）
 */
export function requestReadLanguageFileApi(fileName) {
  return request({
    url: '/i18n-manager/language/read',
    method: 'get',
    params: { fileName }
  })
}

/**
 * 获取国际化文件列表（仅超级管理员可访问，用于国际化管理页面）
 */
export function requestGetI18nFileListApi() {
  return request({
    url: '/i18n-manager/files',
    method: 'get'
  })
}

/**
 * 读取国际化文件内容（仅超级管理员可访问，用于国际化管理页面）
 * @param {string} fileName - 文件名（如 zh-CN.js）
 */
export function requestReadI18nFileApi(fileName) {
  return request({
    url: '/i18n-manager/file/read',
    method: 'get',
    params: { fileName }
  })
}

/**
 * 搜索国际化内容
 * @param {string} fileName - 文件名
 * @param {string} keyword - 搜索关键词
 */
export function requestSearchI18nContentApi(fileName, keyword) {
  return request({
    url: '/i18n-manager/search',
    method: 'get',
    params: { fileName, keyword }
  })
}

/**
 * 保存国际化文件内容
 * @param {string} fileName - 文件名
 * @param {object} data - 国际化数据对象
 */
export function requestSaveI18nFileApi(fileName, data) {
  return request({
    url: '/i18n-manager/file/save',
    method: 'post',
    data: { fileName, data }
  })
}

// ========== 备份管理 ==========

/**
 * 手动备份
 * @param {string} fileName - 文件名
 */
export function requestBackupI18nFileApi(fileName) {
  return request({
    url: '/i18n-manager/backup',
    method: 'post',
    data: { fileName }
  })
}

/**
 * 获取备份文件列表
 * @param {string} [fileName] - 文件名（可选，不传则返回所有备份）
 */
export function requestGetI18nBackupListApi(fileName) {
  return request({
    url: '/i18n-manager/backups',
    method: 'get',
    params: { fileName }
  })
}

/**
 * 恢复备份
 * @param {string} backupFileName - 备份文件名
 * @param {string} targetFileName - 目标文件名
 */
export function requestRestoreI18nBackupApi(backupFileName, targetFileName) {
  return request({
    url: '/i18n-manager/backup/restore',
    method: 'post',
    data: { backupFileName, targetFileName }
  })
}

/**
 * 删除备份
 * @param {string} backupFileName - 备份文件名
 */
export function requestDeleteI18nBackupApi(backupFileName) {
  return request({
    url: '/i18n-manager/backup/delete',
    method: 'post',
    data: { backupFileName }
  })
}

// ========== 配置管理 ==========

/**
 * 新增国际化配置
 * @param {string} fileName - 文件名
 * @param {string} parentPath - 父级路径（如 'common' 或 'menu.system'）
 * @param {string} key - key 名称
 * @param {string} value - 值
 */
export function requestAddI18nConfigApi(fileName, parentPath, key, value) {
  return request({
    url: '/i18n-manager/config/add',
    method: 'post',
    data: { fileName, parentPath, key, value }
  })
}

/**
 * 删除国际化配置
 * @param {string} fileName - 文件名
 * @param {string} keyPath - 完整 key 路径（如 'common.save'）
 */
export function requestDeleteI18nConfigApi(fileName, keyPath) {
  return request({
    url: '/i18n-manager/config/delete',
    method: 'post',
    data: { fileName, keyPath }
  })
}

// ========== 备份路径配置 ==========

/**
 * 获取备份目录配置
 */
export function requestGetI18nBackupConfigApi() {
  return request({
    url: '/i18n-manager/backup-config',
    method: 'get'
  })
}

/**
 * 设置备份目录
 * @param {string} backupDir - 备份目录路径
 */
export function requestSetI18nBackupDirApi(backupDir) {
  return request({
    url: '/i18n-manager/backup-dir',
    method: 'post',
    data: { backupDir }
  })
}

// ========== 语言管理 ==========

/**
 * 创建新语言文件
 * @param {Object} params - 参数
 * @param {string} params.sourceFileName - 源语言文件名（如 zh-CN.js）
 * @param {string} params.newFileName - 新语言文件名（如 ja-JP.js）
 * @param {string} params.newLangName - 新语言显示名称
 * @param {boolean} params.copyValues - 是否复制源语言的 value
 */
export function requestCreateLanguageApi(params) {
  return request({
    url: '/i18n-manager/language/create',
    method: 'post',
    data: params
  })
}

/**
 * 获取预设语言列表
 */
export function requestGetPresetLanguagesApi() {
  return request({
    url: '/i18n-manager/preset-languages',
    method: 'get'
  })
}

/**
 * 获取所有语言元数据
 */
export function requestGetAllLanguageMetaApi() {
  return request({
    url: '/i18n-manager/language-meta',
    method: 'get'
  })
}

/**
 * 获取预设语言配置文件内容
 */
export function requestGetPresetLanguagesConfigApi() {
  return request({
    url: '/i18n-manager/preset-languages/config',
    method: 'get'
  })
}

/**
 * 保存预设语言配置文件内容
 * @param {string} content - 配置文件内容
 */
export function requestSavePresetLanguagesConfigApi(content) {
  return request({
    url: '/i18n-manager/preset-languages/config',
    method: 'post',
    data: { content }
  })
}
