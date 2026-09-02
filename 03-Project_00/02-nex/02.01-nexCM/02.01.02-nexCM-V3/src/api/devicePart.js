import request from '@/utils/request'

/**
 * 部件寿命管理 API
 */

// ==================== 部件模板相关 ====================

/**
 * 获取所有部件模板
 */
export function getPartTemplates() {
  return request({
    url: '/device-part/templates',
    method: 'get'
  })
}

// ==================== 部件实例相关 ====================

/**
 * 获取所有部件实例
 */
export function getPartList() {
  return request({
    url: '/device-part/list',
    method: 'get'
  })
}

/**
 * 获取部件详情
 */
export function getPartDetail(id) {
  return request({
    url: `/device-part/${id}`,
    method: 'get'
  })
}

/**
 * 添加部件实例
 */
export function addPart(data) {
  return request({
    url: '/device-part/add',
    method: 'post',
    data
  })
}

/**
 * 更新部件实例
 */
export function updatePart(id, data) {
  return request({
    url: `/device-part/update/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除部件实例
 */
export function deletePart(id) {
  return request({
    url: `/device-part/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 部件更换录入
 */
export function replacePart(id, data) {
  return request({
    url: `/device-part/replace/${id}`,
    method: 'post',
    data
  })
}

// ==================== 使用寿命统计相关 ====================

/**
 * 更新单个部件使用寿命
 */
export function updatePartUsedLife(id, plcValue) {
  return request({
    url: `/device-part/update-life/${id}`,
    method: 'post',
    data: { plc_value: plcValue }
  })
}

/**
 * 批量更新所有部件使用寿命（从PLC数据）
 */
export function batchUpdatePartUsedLife(plcData) {
  return request({
    url: '/device-part/batch-update-life',
    method: 'post',
    data: { plc_data: plcData }
  })
}

// ==================== 更换记录相关 ====================

/**
 * 获取更换记录列表
 */
export function getReplaceRecords(params) {
  return request({
    url: '/device-part/replace-records/list',
    method: 'get',
    params
  })
}

// ==================== 预警相关 ====================

/**
 * 获取需要预警的部件列表
 */
export function getWarningParts(threshold) {
  return request({
    url: '/device-part/warning-parts/list',
    method: 'get',
    params: { threshold }
  })
}
