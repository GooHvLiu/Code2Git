/**
 * ==========================================
 * nex-request Axios 请求统一封装
 * ==========================================
 * 支持：Token注入、白名单放行、业务码判断、错误提示、
 *       Token过期跳转、请求重试、防重复请求、Loading计数
 *
 * 用法：
 * import { createRequest } from 'nex-request'
 *
 * const request = createRequest({
 *   baseURL: process.env.VUE_APP_BASE_API,
 *   timeout: 10000,
 *   tokenHeader: 'Authorization',
 *   tokenPrefix: 'Bearer',
 *   getToken: () => localStorage.getItem('token'),
 *   noTokenApis: ['/login', '/register'],
 *   successCode: 200,
 *   tokenExpiredCodes: [401, 403],
 *   onTokenExpired: (res) => { MessageBox.confirm(...).then(() => router.push('/login')) },
 *   onError: (msg) => Message.error(msg),
 *   onLoadingShow: () => store.dispatch('showLoading'),
 *   onLoadingHide: () => store.dispatch('hideLoading')
 * })
 *
 * export default request
 */
import axios from 'axios'

/**
 * 创建请求实例
 * @param {Object} options 配置项
 * @returns {Object} axios 实例 + cancelAllPending 方法
 */
export function createRequest(options = {}) {
  const {
    baseURL = '',
    timeout = 10000,
    tokenHeader = 'Authorization',
    tokenPrefix = 'Bearer',
    getToken = () => '',
    noTokenApis = [],
    successCode = 200,
    tokenExpiredCodes = [401],
    permissionDeniedCode = 403,
    onTokenExpired = null,
    onPermissionDenied = null,
    onError = null,
    onLoadingShow = null,
    onLoadingHide = null,
    maxRetries = 2,
    retryDelay = 500,
    retryableStatus = [500, 502, 503, 504]
  } = options

  /** 是否正在显示重新登录弹窗 */
  let isReloginShowing = false

  /** pending 请求 Map */
  const pendingMap = new Map()

  function getRequestKey(config) {
    return `${config.method}-${config.url}`
  }

  function addPending(config) {
    const key = getRequestKey(config)
    if (pendingMap.has(key)) {
      pendingMap.get(key)('重复请求，自动取消上一次')
    }
    config.cancelToken = new axios.CancelToken(cancel => {
      pendingMap.set(key, cancel)
    })
  }

  function removePending(config) {
    const key = getRequestKey(config)
    if (pendingMap.has(key)) {
      pendingMap.delete(key)
    }
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /** 创建 axios 实例 */
  const service = axios.create({ baseURL, timeout })

  /** 请求拦截器 */
  service.interceptors.request.use(
    requestConfig => {
      addPending(requestConfig)
      if (onLoadingShow) onLoadingShow()

      const isNeedToken = !noTokenApis.some(item => requestConfig.url.includes(item))
      if (isNeedToken) {
        const token = getToken()
        if (token) {
          requestConfig.headers[tokenHeader] = `${tokenPrefix} ${token}`
        }
      }
      return requestConfig
    },
    error => {
      if (onLoadingHide) onLoadingHide()
      return Promise.reject(error)
    }
  )

  /** 响应拦截器 */
  service.interceptors.response.use(
    async response => {
      removePending(response.config)
      if (onLoadingHide) onLoadingHide()

      const res = response.data
      const config = response.config

      // 业务成功
      if (res.code === successCode) {
        return res
      }

      // Token 过期
      if (tokenExpiredCodes.includes(res.code)) {
        if (onTokenExpired && !isReloginShowing) {
          isReloginShowing = true
          Promise.resolve(onTokenExpired(res)).finally(() => {
            isReloginShowing = false
          })
        }
        return Promise.reject(res)
      }

      // 权限不足
      if (res.code === permissionDeniedCode) {
        if (onPermissionDenied) onPermissionDenied(res)
        return Promise.reject(res)
      }

      // 其他业务错误
      if (onError) onError(res.msg || '请求失败')
      return Promise.reject(res)
    },
    async error => {
      if (onLoadingHide) onLoadingHide()

      const config = error.config
      if (config) removePending(config)

      // 请求重试（网络错误或 5xx）
      if (config && !config.__isRetry) {
        const status = error.response?.status
        const shouldRetry = !error.response || retryableStatus.includes(status)
        const retryCount = config.__retryCount || 0

        if (shouldRetry && retryCount < maxRetries) {
          config.__isRetry = true
          config.__retryCount = retryCount + 1
          await delay(retryDelay)
          return service(config)
        }
      }

      if (onError && error.message !== '重复请求，自动取消上一次') {
        onError(error.message || '网络错误')
      }
      return Promise.reject(error)
    }
  )

  /** 取消所有 pending 请求（路由切换时调用） */
  service.cancelAllPending = function(message = '路由切换，取消未完成请求') {
    pendingMap.forEach(cancel => cancel(message))
    pendingMap.clear()
  }

  return service
}

export default { createRequest }
