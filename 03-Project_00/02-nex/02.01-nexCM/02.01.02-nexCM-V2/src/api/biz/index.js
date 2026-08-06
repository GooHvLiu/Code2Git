/**
 * api/biz/index.js - 业务接口
 * 包含治具、工位、设备、订单、生产、报表
 */
import request from '@/utils/request'

// ========== 治具管理 ==========

/** 治具列表 */
export function getFixtureList(params) {
  return request({ url: '/fixtures', method: 'get', params })
}
/** 注册治具 */
export function createFixture(data) {
  return request({ url: '/fixtures', method: 'post', data })
}
/** 更新治具 */
export function updateFixture(id, data) {
  return request({ url: `/fixtures/${id}`, method: 'put', data })
}
/** 删除治具 */
export function deleteFixture(id) {
  return request({ url: `/fixtures/${id}`, method: 'delete' })
}
/**
 * RFID 校验（核心接口）
 * @param {Object} data - { rfidCode, stationId, deviceId }
 * @returns {Promise<{valid: boolean, fixture: object, message: string}>}
 */
export function checkRfid(data) {
  return request({ url: '/fixtures/check', method: 'post', data })
}

// ========== 工位管理 ==========

/** 工位列表 */
export function getStationList(params) {
  return request({ url: '/stations', method: 'get', params })
}

// ========== 设备管理 ==========

/** 设备列表 */
export function getDeviceList(params) {
  return request({ url: '/devices', method: 'get', params })
}
/** 单个设备实时状态 */
export function getDeviceStatus(id) {
  return request({ url: `/devices/${id}/status`, method: 'get' })
}
/** 所有设备实时状态（看板用） */
export function getAllDeviceStatus() {
  return request({ url: '/devices/status', method: 'get' })
}

// ========== 订单管理 ==========

/** 订单列表 */
export function getOrderList(params) {
  return request({ url: '/orders', method: 'get', params })
}
/** 创建订单 */
export function createOrder(data) {
  return request({ url: '/orders', method: 'post', data })
}
/** 订单详情 */
export function getOrderDetail(id) {
  return request({ url: `/orders/${id}`, method: 'get' })
}
/**
 * 启动订单（给 PLC 发允许生产信号）
 * @param {number} id 订单 ID
 * @param {Object} data - { password, reason } 电子签名
 */
export function startOrder(id, data) {
  return request({ url: `/orders/${id}/start`, method: 'post', data })
}
/** 暂停订单 */
export function pauseOrder(id) {
  return request({ url: `/orders/${id}/pause`, method: 'post' })
}
/** 完成订单 */
export function completeOrder(id) {
  return request({ url: `/orders/${id}/complete`, method: 'post' })
}

// ========== 生产执行 ==========

/** 获取当前生产状态（操作台用） */
export function getCurrentProduction() {
  return request({ url: '/production/current', method: 'get' })
}
/** 良品 +1 */
export function goodCount(data) {
  return request({ url: '/production/good', method: 'post', data })
}
/** 不良 +1（带原因） */
export function badCount(data) {
  return request({ url: '/production/bad', method: 'post', data })
}
/** 生产记录查询 */
export function getProductionRecords(params) {
  return request({ url: '/production/records', method: 'get', params })
}

// ========== 报表 ==========

/** 看板汇总数据 */
export function getDashboardData() {
  return request({ url: '/reports/dashboard', method: 'get' })
}
/** 生产报表 */
export function getProductionReport(params) {
  return request({ url: '/reports/production', method: 'get', params })
}
