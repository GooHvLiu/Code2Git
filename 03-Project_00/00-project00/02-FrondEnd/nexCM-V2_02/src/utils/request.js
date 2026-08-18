/**
 * ==========================================
 * Axios 请求统一封装
 * ==========================================
 * 合并原 axios.js（业务请求）和 pure-axios.js（token校验）为一个实例
 * 通过请求拦截器统一处理：Token 注入、白名单放行
 * 通过响应拦截器统一处理：业务码判断、错误提示、Token过期跳转
 */
import axios from 'axios'
import { MessageBox } from 'element-ui'
import { showError } from './message'
import config from '@/config'
import { getToken } from './auth'
import { ROUTE_PATHS } from '@/router/pathConstants'
import {
  CODE_SUCCESS,
  TOKEN_AUTO_REDIRECT_CODES,
  CODE_PERMISSION_DENIED,
  CODE_MENU_NOT_MODIFIED,
  NO_TOKEN_API
} from '@/utils/constants'

/**
 * 是否正在显示重新登录弹窗
 * 防止多个请求同时 401 时弹出多个框
 */
let isReloginShowing = false

/**
 * pending 请求 Map，用于路由切换时取消未完成的请求
 * key: 请求唯一标识（method + url），value: cancel 函数
 */
const pendingMap = new Map()

/**
 * 生成请求唯一标识
 */
function getRequestKey(config) {
  return `${config.method}-${config.url}`
}

/**
 * 添加 pending 请求
 */
function addPending(config) {
  const key = getRequestKey(config)
  // 相同请求已存在，先取消上一次
  if (pendingMap.has(key)) {
    pendingMap.get(key)('重复请求，自动取消上一次')
  }
  config.cancelToken = new axios.CancelToken(cancel => {
    pendingMap.set(key, cancel)
  })
}

/**
 * 移除 pending 请求
 */
function removePending(config) {
  const key = getRequestKey(config)
  if (pendingMap.has(key)) {
    pendingMap.delete(key)
  }
}

/**
 * 取消所有 pending 请求（路由切换时调用）
 */
export function cancelAllPending() {
  pendingMap.forEach(cancel => cancel('路由切换，取消未完成请求'))
  pendingMap.clear()
}

/**
 * 创建 axios 实例
 */
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: config.REQUEST_TIMEOUT
})

/**
 * 请求重试配置
 * 仅对网络错误和 5xx 服务端错误进行重试
 * 单个请求可通过 config.retry = false 关闭重试
 */
const RETRY_CONFIG = {
  /** 默认重试次数 */
  maxRetries: 2,
  /** 重试间隔（毫秒） */
  retryDelay: 500,
  /** 可重试的 HTTP 状态码 */
  retryableStatus: [500, 502, 503, 504]
}

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 请求拦截器
 * 统一注入 Token
 */
service.interceptors.request.use(
  requestConfig => {
    // 添加 pending 请求（支持取消）
    addPending(requestConfig)

    // 全局 Loading 计数 +1（动态引入 store 避免循环依赖）
    const store = require('@/store/index').default
    store.dispatch('app/showLoading')

    // 判断该接口是否需要 Token（白名单内的不需要）
    const isNeedToken = !NO_TOKEN_API.some(item => requestConfig.url.includes(item))
    if (isNeedToken) {
      const token = getToken()
      if (token) {
        requestConfig.headers[config.TOKEN_HEADER] = `${config.TOKEN_PREFIX} ${token}`
      }
    }
    return requestConfig
  },
  error => {
    // 请求发送失败也要减少 Loading 计数
    const store = require('@/store/index').default
    store.dispatch('app/hideLoading')
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一处理业务码和错误
 */
service.interceptors.response.use(
  response => {
    // 请求完成，移除 pending
    removePending(response.config)
    // 全局 Loading 计数 -1
    const store = require('@/store/index').default
    store.dispatch('app/hideLoading')

    const res = response.data

    // 业务成功
    if (res.code === CODE_SUCCESS) {
      return res
    }

    // 菜单未变更（缓存命中）：不弹错误，直接返回，由调用方处理
    if (res.code === CODE_MENU_NOT_MODIFIED) {
      return res
    }

    // Token 过期/无效：弹一次确认框，用户确认后跳登录
    if (TOKEN_AUTO_REDIRECT_CODES.includes(res.code)) {
      if (!isReloginShowing) {
        isReloginShowing = true
        MessageBox.confirm(config.MESSAGES.TOKEN_EXPIRED, '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 动态引入 store 和 router 避免循环依赖
          const store = require('@/store/index').default
          store.dispatch('user/logout').then(() => {
            const router = require('@/router/index.js').default
            router.push(`${ROUTE_PATHS.LOGIN}?redirect=${router.currentRoute.fullPath}`)
          })
        }).finally(() => {
          isReloginShowing = false
        })
      }
      return Promise.reject(res)
    }

    // 权限不足：弹提示框，不跳转
    if (res.code === CODE_PERMISSION_DENIED) {
      MessageBox.alert(res.msg || config.MESSAGES.PERMISSION_DENIED, '权限提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      return Promise.reject(res)
    }

    // 其他业务错误：弹 Message 提示（防重复）
    showError(res.msg || config.MESSAGES.UNKNOWN_ERROR)
    return Promise.reject(res)
  },
  error => {
    // 请求失败，移除 pending
    if (error.config) {
      removePending(error.config)
    }
    // 全局 Loading 计数 -1
    const store = require('@/store/index').default
    store.dispatch('app/hideLoading')

    // 被取消的请求不弹错误提示
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    // ========== 请求重试 ==========
    // 仅对网络错误和 5xx 服务端错误重试，单个请求可通过 config.retry = false 关闭
    const reqConfig = error.config || {}
    const shouldRetry = reqConfig.retry !== false &&
      (
        !error.response || // 网络错误（无响应）
        RETRY_CONFIG.retryableStatus.includes(error.response.status) // 5xx 服务端错误
      )

    if (shouldRetry) {
      reqConfig._retryCount = reqConfig._retryCount || 0
      if (reqConfig._retryCount < RETRY_CONFIG.maxRetries) {
        reqConfig._retryCount++
        return delay(RETRY_CONFIG.retryDelay).then(() => service(reqConfig))
      }
    }

    // HTTP 层错误（网络异常、404、500 等）
    if (!error.response) {
      showError(config.MESSAGES.NETWORK_ERROR)
    } else {
      const status = error.response.status
      const message = config.HTTP_ERRORS[status] || `请求错误 ${status}`
      showError(message)
    }
    return Promise.reject(error)
  }
)

export default service
