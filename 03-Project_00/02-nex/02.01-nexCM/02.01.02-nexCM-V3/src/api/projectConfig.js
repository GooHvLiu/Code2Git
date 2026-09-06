import request from '@/utils/request'

/**
 * 获取项目所有配置信息
 */
export function requestGetProjectConfigApi() {
  return request({
    url: '/project-config/all',
    method: 'get'
  })
}

// ==================== 配置文件管理相关 API ====================

/**
 * 读取指定配置文件的内容
 * @param {string} filePath - 文件路径
 */
export function requestReadConfigFileApi(filePath) {
  return request({
    url: '/file-manager/file/read',
    method: 'get',
    params: { filePath }
  })
}

/**
 * 写入配置文件内容
 * @param {Object} data - { filePath, content, remark }
 */
export function requestWriteConfigFileApi(data) {
  return request({
    url: '/file-manager/file/write',
    method: 'post',
    data
  })
}

/**
 * 获取指定配置文件的备份列表
 * @param {string} filePath - 文件路径
 */
export function requestGetConfigBackupListApi(filePath) {
  return request({
    url: '/file-manager/backups',
    method: 'get',
    params: { filePath }
  })
}

/**
 * 获取备份目录路径
 */
export function requestGetBackupDirApi() {
  return request({
    url: '/file-manager/backup-dir',
    method: 'get'
  })
}

/**
 * 修改备份目录路径
 * @param {Object} data - { backupPath }
 */
export function requestSetBackupDirApi(data) {
  return request({
    url: '/file-manager/backup-dir',
    method: 'post',
    data
  })
}

/**
 * 回滚到指定配置文件备份版本
 * @param {Object} data - { filePath, backupName }
 */
export function requestRestoreConfigBackupApi(data) {
  return request({
    url: '/file-manager/backup/restore',
    method: 'post',
    data
  })
}

/**
 * 删除指定配置文件备份
 * @param {Object} data - { filePath, backupName }
 */
export function requestDeleteConfigBackupApi(data) {
  return request({
    url: '/file-manager/backup/delete',
    method: 'post',
    data
  })
}

/**
 * 配置文件语法检查
 * @param {Object} data - { filePath, content }
 */
export function requestCheckConfigSyntaxApi(data) {
  return request({
    url: '/file-manager/check-syntax',
    method: 'post',
    data
  })
}
