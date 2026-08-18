/**
 * ==========================================
 * 数据字典接口
 * ==========================================
 */
import request from '@/utils/request'

/**
 * 根据字典编码获取字典数据
 * @param {string} code - 字典编码（比如 'device_status', 'gender', 'department'）
 */
export function requestGetDictApi(code) {
  // 发起一个 GET 请求，将字典编码作为 dictType 参数传给后端
  return request({ url: `/dict/data?dictType=${code}`, method: 'get' })
}
