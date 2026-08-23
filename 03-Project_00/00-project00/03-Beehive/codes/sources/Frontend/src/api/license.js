/**
 * 授权管理 API
 * 与后端 /prod-api/v2/license 接口对应
 */
import request from '@/utils/request'

/**
 * 查询当前授权状态（完整信息）
 * GET /prod-api/v2/license/status
 * @returns {Promise<Object>} 授权完整信息（valid、licenseData、machineInfo、licenseFile、timeGuard等）
 */
export function getLicenseStatus() {
  return request({
    url: '/license/status',
    method: 'get'
  })
}

/**
 * 导入授权文件
 * POST /prod-api/v2/license/import
 * @param {File} file .lic 授权文件
 * @returns {Promise<Object>} 授权详细信息
 */
export function importLicense(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/license/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    // 授权导入接口不需要 token（未授权时也能导入）
    // 通过 NO_TOKEN_API 白名单机制处理
    timeout: 30000
  })
}

/**
 * 获取当前服务器机器ID
 * GET /prod-api/v2/license/machine-id
 * @returns {Promise<{machineId: string, machineInfo: Object}>}
 */
export function getMachineId() {
  return request({
    url: '/license/machine-id',
    method: 'get'
  })
}

/**
 * 手动触发联网时间校准
 * POST /prod-api/v2/license/sync-time
 * @returns {Promise<{ok: boolean, beforeTime: number, afterTime: number, drift: number}>}
 */
export function syncLicenseTime() {
  return request({
    url: '/license/sync-time',
    method: 'post'
  })
}

/**
 * 下载当前授权文件
 * GET /prod-api/v2/license/download
 * @returns {Promise<Blob>}
 */
export function downloadLicense() {
  return request({
    url: '/license/download',
    method: 'get',
    responseType: 'blob'
  })
}
