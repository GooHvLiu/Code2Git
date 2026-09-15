/**
 * ==========================================
 * 菜单管理接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/menu
 */
import request from '@/utils/request/request'

/** 获取登录用户的菜单路由（支持版本号缓存） */
export function requestGetRoutersApi(version, lang) {
  return request({
    url: '/menu/routers',
    method: 'get',
    params: { version, lang }
  })
}

/** 获取菜单最新版本号 */
export function requestGetMenuVersionApi() {
  return request({ url: '/menu/version', method: 'get' })
}

// ==================== 菜单配置管理相关接口 ====================

/** 获取所有菜单树（用于菜单配置页面） */
export function requestGetAdminMenuTreeApi() {
  return request({ url: '/menu/admin/tree', method: 'get' })
}

/** 创建菜单 */
export function requestCreateMenuApi(data) {
  return request({ url: '/menu/admin', method: 'post', data })
}

/** 更新菜单 */
export function requestUpdateMenuApi(id, data) {
  return request({ url: `/menu/admin/${id}`, method: 'put', data })
}

/** 删除菜单 */
export function requestDeleteMenuApi(id) {
  return request({ url: `/menu/admin/${id}`, method: 'delete' })
}

/** 拖拽菜单 */
export function requestDragMenuApi(id, parentId, sort) {
  return request({
    url: `/menu/admin/${id}/drag`,
    method: 'put',
    data: { parentId, sort }
  })
}

/** 批量保存菜单修改 */
export function requestBatchSaveMenuApi(changes) {
  return request({
    url: '/menu/admin/batch-save',
    method: 'post',
    data: { changes }
  })
}

// ==================== 备份管理相关接口 ====================

/** 获取备份目录配置 */
export function requestGetMenuBackupDirApi() {
  return request({ url: '/menu/admin/backup/dir', method: 'get' })
}

/** 设置备份目录 */
export function requestSetMenuBackupDirApi(backupDir) {
  return request({
    url: '/menu/admin/backup/dir',
    method: 'put',
    data: { backupDir }
  })
}

/** 创建备份 */
export function requestCreateMenuBackupApi(remark) {
  return request({
    url: '/menu/admin/backup',
    method: 'post',
    data: { remark }
  })
}

/** 获取备份列表 */
export function requestGetMenuBackupListApi() {
  return request({ url: '/menu/admin/backup/list', method: 'get' })
}

/** 恢复备份 */
export function requestRestoreMenuBackupApi(fileName) {
  return request({
    url: '/menu/admin/backup/restore',
    method: 'post',
    data: { fileName }
  })
}

/** 删除备份 */
export function requestDeleteMenuBackupApi(fileName) {
  return request({
    url: `/menu/admin/backup/${fileName}`,
    method: 'delete'
  })
}
