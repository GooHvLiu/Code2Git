/**
 * nex-request 主入口
 *
 * 用法：
 * import { createRequest } from 'nex-request'
 * const request = createRequest({ baseURL: '/api', getToken: () => localStorage.getItem('token') })
 * export default request
 */
import { createRequest } from './src/request'

export { createRequest }
export default { createRequest }
