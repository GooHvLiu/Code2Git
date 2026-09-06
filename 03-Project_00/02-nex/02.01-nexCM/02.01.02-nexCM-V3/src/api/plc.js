/**
 * ==========================================
 * PLC 设备接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/plc
 */
import request from '@/utils/request'

/**
 * 获取PLC通讯状态
 * @param {string} [device] 设备名称（可选）
 * @returns {Promise<Object>} PLC状态
 */
export function requestGetPlcStatusApi(device) {
  const params = device ? { device } : {}
  return request({ url: '/plc/status', method: 'get', params })
}

/**
 * 手动重连PLC设备
 * @param {string} [device] 设备名称（可选，不传则重连所有设备）
 * @returns {Promise<Object>} 重连结果
 */
export function requestReconnectPlcApi(device) {
  const data = device ? { device } : {}
  return request({ url: '/plc/reconnect', method: 'post', data, hideLoading: true })
}

/**
 * 读取单个点位
 * @param {string} tag 点位名称
 * @param {string} [device] 设备名称（可选）
 * @returns {Promise<Object>} 点位值
 */
export function requestReadPlcTagApi(tag, device) {
  const params = { tag }
  if (device) params.device = device
  return request({ url: '/plc/read-tag', method: 'get', params })
}

/**
 * 读取所有点位
 * @param {string} [device] 设备名称（可选）
 * @returns {Promise<Object>} 所有点位值
 */
export function requestReadAllPlcTagsApi(device) {
  const params = device ? { device } : {}
  return request({ url: '/plc/read-all', method: 'get', params })
}

/**
 * 下发写参数到PLC
 * @param {Object} data { tag, value, reason, device? }
 * @returns {Promise<Object>} 写入结果
 */
export function requestWritePlcTagApi(data) {
  return request({ url: '/plc/write-tag', method: 'post', data })
}
