/**
 * ==========================================
 * 数据库管理相关接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/db-manager
 * 仅超级管理员可访问
 */
import request from '@/utils/request'

// ==================== 数据查看 ====================

/**
 * 获取所有表列表
 * @returns {Promise<{code:number, msg:string, data:Array}>}
 */
export function requestGetAllTablesApi() {
  return request({ url: '/db-manager/tables', method: 'get' })
}

/**
 * 获取表结构
 * @param {string} tableName - 表名
 * @returns {Promise<{code:number, msg:string, data:Array}>}
 */
export function requestGetTableStructureApi(tableName) {
  return request({ url: `/db-manager/tables/${tableName}/structure`, method: 'get' })
}

/**
 * 获取表数据（分页）
 * @param {string} tableName - 表名
 * @param {number} page - 页码
 * @param {number} pageSize - 每页条数
 * @param {string} search - 搜索关键词
 * @returns {Promise<{code:number, msg:string, data:{data:Array, total:number, page:number, pageSize:number}}>}
 */
export function requestGetTableDataApi(tableName, page = 1, pageSize = 20, search = '') {
  return request({
    url: `/db-manager/tables/${tableName}/data`,
    method: 'get',
    params: { page, pageSize, search }
  })
}

// ==================== 配置表编辑 ====================

/**
 * 更新表数据
 * @param {string} tableName - 表名
 * @param {object} data - 要更新的数据
 * @param {object} where - 更新条件
 * @returns {Promise<{code:number, msg:string, data:object}>}
 */
export function requestUpdateTableDataApi(tableName, data, where) {
  return request({
    url: `/db-manager/tables/${tableName}/data`,
    method: 'put',
    data: { data, where }
  })
}

/**
 * 插入表数据
 * @param {string} tableName - 表名
 * @param {object} data - 要插入的数据
 * @returns {Promise<{code:number, msg:string, data:object}>}
 */
export function requestInsertTableDataApi(tableName, data) {
  return request({
    url: `/db-manager/tables/${tableName}/data`,
    method: 'post',
    data: { data }
  })
}

/**
 * 删除表数据
 * @param {string} tableName - 表名
 * @param {object} where - 删除条件
 * @returns {Promise<{code:number, msg:string, data:object}>}
 */
export function requestDeleteTableDataApi(tableName, where) {
  return request({
    url: `/db-manager/tables/${tableName}/data`,
    method: 'delete',
    data: { where }
  })
}

// ==================== 版本备份 ====================

/**
 * 创建数据库备份
 * @param {string} backupType - 备份类型：full全量/table单表
 * @param {string} tableName - 单表备份时的表名
 * @param {string} remark - 备份备注
 * @returns {Promise<{code:number, msg:string, data:{backupName:string, filePath:string, fileSize:number}}>}
 */
export function requestCreateBackupApi(backupType = 'full', tableName = null, remark = '') {
  return request({
    url: '/db-manager/backup',
    method: 'post',
    data: { backupType, tableName, remark }
  })
}

/**
 * 获取备份列表
 * @param {number} page - 页码
 * @param {number} pageSize - 每页条数
 * @returns {Promise<{code:number, msg:string, data:{list:Array, total:number, page:number, pageSize:number}}>}
 */
export function requestGetBackupListApi(page = 1, pageSize = 20) {
  return request({
    url: '/db-manager/backup',
    method: 'get',
    params: { page, pageSize }
  })
}

/**
 * 获取备份详情
 * @param {number} id - 备份ID
 * @returns {Promise<{code:number, msg:string, data:object}>}
 */
export function requestGetBackupByIdApi(id) {
  return request({ url: `/db-manager/backup/${id}`, method: 'get' })
}

/**
 * 删除备份
 * @param {number} id - 备份ID
 * @returns {Promise<{code:number, msg:string}>}
 */
export function requestDeleteBackupApi(id) {
  return request({ url: `/db-manager/backup/${id}`, method: 'delete' })
}

// ==================== 回滚 ====================

/**
 * 执行数据库回滚
 * @param {number} id - 备份ID
 * @returns {Promise<{code:number, msg:string, data:{success:boolean, backupId:number, restoredAt:string}}>}
 */
export function requestRestoreBackupApi(id) {
  return request({ url: `/db-manager/backup/${id}/restore`, method: 'post' })
}
