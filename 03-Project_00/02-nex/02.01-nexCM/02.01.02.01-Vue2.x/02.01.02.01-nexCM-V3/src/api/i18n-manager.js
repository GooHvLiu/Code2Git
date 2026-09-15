/**
 * 国际化管理 API（模块化「目录模型」版）
 * 后端路由前缀 /prod-api/v2/i18n-manager
 * 一种语言 = 一个模块目录，接口统一以 langCode（如 zh-CN / en-US）标识语言。
 *
 * 权限：
 *  - /languages、/language/read 登录用户即可（语言切换、动态加载）
 *  - 其余接口仅超级管理员
 */
import request from '@/utils/request/request'

// ========== 语言列表 / 读取 / 搜索 ==========

/** 语言列表（登录用户可访问，用于语言切换与管理页） */
export function requestGetLanguagesApi() {
  return request({
    url: '/i18n-manager/languages',
    method: 'get'
  })
}

/**
 * 聚合读取整门语言（登录用户可访问，用于动态加载语言包）
 * @param {string} langCode - 语言代码，如 zh-CN / en-US / ja-JP
 */
export function requestReadLanguageApi(langCode) {
  return request({
    url: '/i18n-manager/language/read',
    method: 'get',
    params: { langCode }
  })
}

/**
 * 在一门语言内按 key / 值搜索（超管）
 * @param {string} langCode 语言代码
 * @param {string} keyword 关键词
 */
export function requestSearchLanguageApi(langCode, keyword) {
  return request({
    url: '/i18n-manager/language/search',
    method: 'get',
    params: { langCode, keyword }
  })
}

// ========== 节点级增删改 ==========

/** 修改单个 key 的值 */
export function requestSaveNodeApi(payload) {
  return request({
    url: '/i18n-manager/node/save',
    method: 'post',
    data: payload // { langCode, keyPath, value }
  })
}

/** 新增一个 key（common 平铺新增需带 spreadFile） */
export function requestAddNodeApi(payload) {
  return request({
    url: '/i18n-manager/node/add',
    method: 'post',
    data: payload // { langCode, parentPath, key, value, spreadFile }
  })
}

/** 删除一个 key */
export function requestDeleteNodeApi(payload) {
  return request({
    url: '/i18n-manager/node/delete',
    method: 'post',
    data: payload // { langCode, keyPath }
  })
}

/** 整语言灌值（批量翻译结果保存） */
export function requestSaveLanguageValuesApi(langCode, data) {
  return request({
    url: '/i18n-manager/language/save-values',
    method: 'post',
    data: { langCode, data }
  })
}

// ========== 创建语言 ==========

/**
 * 以源语言目录为模板创建新语言（新语言必须命中后端预设）
 * @param {Object} params
 * @param {string} params.sourceLangCode 源语言代码
 * @param {string} params.newLangCode 新语言代码
 * @param {boolean} params.copyValues 是否复制译文（false=清空待翻译）
 */
export function requestCreateLanguageApi(params) {
  return request({
    url: '/i18n-manager/language/create',
    method: 'post',
    data: params
  })
}

// ========== zip 备份 / 恢复 / 删除 ==========

/** 创建整目录 zip 备份 */
export function requestBackupLanguageApi(langCode) {
  return request({
    url: '/i18n-manager/backup',
    method: 'post',
    data: { langCode }
  })
}

/** 备份清单（可按 langCode 过滤，不传返回全部） */
export function requestGetLanguageBackupListApi(langCode) {
  return request({
    url: '/i18n-manager/backups',
    method: 'get',
    params: { langCode }
  })
}

/** 恢复备份（恢复前后端会自动备份当前语言） */
export function requestRestoreLanguageBackupApi(backupFileName, langCode) {
  return request({
    url: '/i18n-manager/backup/restore',
    method: 'post',
    data: { backupFileName, langCode }
  })
}

/** 删除备份 */
export function requestDeleteLanguageBackupApi(backupFileName) {
  return request({
    url: '/i18n-manager/backup/delete',
    method: 'post',
    data: { backupFileName }
  })
}

// ========== 备份目录配置 ==========

/** 获取备份目录配置 */
export function requestGetI18nBackupConfigApi() {
  return request({
    url: '/i18n-manager/backup-config',
    method: 'get'
  })
}

/** 设置备份目录 */
export function requestSetI18nBackupDirApi(backupDir) {
  return request({
    url: '/i18n-manager/backup-dir',
    method: 'post',
    data: { backupDir }
  })
}

// ========== 预设语言 ==========

/** 预设语言列表（新建语言时只能从中选择） */
export function requestGetPresetLanguagesApi() {
  return request({
    url: '/i18n-manager/preset-languages',
    method: 'get'
  })
}

/** 获取预设语言配置文件内容（高级编辑） */
export function requestGetPresetLanguagesConfigApi() {
  return request({
    url: '/i18n-manager/preset-languages/config',
    method: 'get'
  })
}

/** 保存预设语言配置文件内容 */
export function requestSavePresetLanguagesConfigApi(content) {
  return request({
    url: '/i18n-manager/preset-languages/config',
    method: 'post',
    data: { content }
  })
}
