/**
 * ==========================================
 * Axios 请求统一封装（泛型）
 * ==========================================
 * - baseURL 走 env 兼容层
 * - 统一 Token 注入、业务码判断、错误提示、Token 过期跳转
 * - 取消重复请求、路由切换取消
 * - 动态 import store / router / i18n 避免循环依赖
 */
import axios, { type AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'
import { showError, showWarning } from '../ui/feedback'
import config from '@/config'
import { getToken } from '../auth/auth'
import { ROUTE_PATHS } from '@/router/constant/pathConstants'
import {
  CODE_SUCCESS,
  TOKEN_AUTO_REDIRECT_CODES,
  CODE_PERMISSION_DENIED,
  CODE_MENU_NOT_MODIFIED,
  NO_TOKEN_API
} from '@/utils/config/constants'
import { BASE_API } from '@/utils/config/env'

let isReloginShowing = false
let isLicenseRedirecting = false

/** 扩展 axios 配置：取消重复请求 / 全局 loading 控制 */
export interface RequestConfig extends AxiosRequestConfig {
  skipPending?: boolean
  hideLoading?: boolean
  retry?: boolean
  _retryCount?: number
}

interface PendingItem {
  (message: string): void
}
const pendingMap = new Map<string, PendingItem>()

function getRequestKey(reqConfig: AxiosRequestConfig): string {
  return `${reqConfig.method}-${reqConfig.url}`
}

function addPending(reqConfig: InternalAxiosRequestConfigLike): void {
  const key = getRequestKey(reqConfig)
  if (pendingMap.has(key)) {
    pendingMap.get(key)?.('重复请求，自动取消上一次')
  }
  const source = axios.CancelToken.source()
  reqConfig.cancelToken = source.token
  pendingMap.set(key, (message: string) => source.cancel(message))
}

function removePending(reqConfig: AxiosRequestConfig): void {
  const key = getRequestKey(reqConfig)
  if (pendingMap.has(key)) pendingMap.delete(key)
}

export function cancelAllPending(): void {
  pendingMap.forEach(cancel => cancel('路由切换，取消未完成请求'))
  pendingMap.clear()
}

type InternalAxiosRequestConfigLike = AxiosRequestConfig & {
  skipPending?: boolean
  hideLoading?: boolean
  cancelToken?: any
  retry?: boolean
  _retryCount?: number
  headers: Record<string, string>
}

const service = axios.create({
  baseURL: BASE_API,
  timeout: config.REQUEST_TIMEOUT
})

const RETRY_CONFIG = {
  maxRetries: 2,
  retryDelay: 500,
  retryableStatus: [500, 502, 503, 504]
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 请求拦截器
service.interceptors.request.use(
  async (requestConfig) => {
    const cfg = requestConfig as InternalAxiosRequestConfigLike
    if (!cfg.skipPending) addPending(cfg)

    if (!cfg.hideLoading) {
      const { useAppStore } = await import('@/store/modules/app')
      useAppStore().showLoading()
    }

    const { default: i18n } = await import('@/i18n')
    const currentLang = i18n.global.locale.value || 'zh-CN'
    if (cfg.method === 'get' || cfg.method === 'post' || cfg.method === 'put') {
      cfg.params = { ...(cfg.params || {}), lang: currentLang }
    }

    const isNeedToken = !NO_TOKEN_API.some(item => (cfg.url || '').includes(item))
    if (isNeedToken) {
      const token = getToken()
      if (token) {
        cfg.headers[config.TOKEN_HEADER] = `${config.TOKEN_PREFIX} ${token}`
      }
    }
    return requestConfig
  },
  async (error) => {
    const { useAppStore } = await import('@/store/modules/app')
    useAppStore().hideLoading()
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (response: any) => {
    removePending(response.config)
    const { useAppStore } = await import('@/store/modules/app')
    useAppStore().hideLoading()

    const res = response.data as ApiResponse

    if (response.config.responseType === 'blob') return response

    if (res.code === CODE_SUCCESS) return res
    if (res.code === CODE_MENU_NOT_MODIFIED) return res

    const { default: i18n } = await import('@/i18n')

    if (TOKEN_AUTO_REDIRECT_CODES.includes(res.code as string)) {
      if (!isReloginShowing) {
        isReloginShowing = true
        showWarning(i18n.global.t(`common.error.${res.code}`) as string)
        const { useUserStore } = await import('@/store/modules/user')
        await useUserStore().logout()
        const { default: router } = await import('@/router/index')
        router.push(`${ROUTE_PATHS.LOGIN}?redirect=${router.currentRoute.value.fullPath}`)
        setTimeout(() => { isReloginShowing = false }, 2000)
      }
      return Promise.reject(res)
    }

    if (res.code === CODE_PERMISSION_DENIED) {
      showWarning(i18n.global.t(`common.error.${res.code}`, (res.data || {}) as Record<string, unknown>) as string)
      return Promise.reject(res)
    }

    if (res.code === 'PARAM_INVALID') {
      const { field, type } = (res.data || {}) as { field?: string; type?: string }
      const typeKey = (type || '').replace(/\./g, '_')
      let paramMessage: string
      const dataObj = (res.data || {}) as Record<string, unknown>
      if (field && type && i18n.global.te('common.error.PARAM_INVALID.' + field + '.' + typeKey)) {
        paramMessage = i18n.global.t('common.error.PARAM_INVALID.' + field + '.' + typeKey, dataObj) as string
      } else if (type && i18n.global.te('common.error.PARAM_INVALID.' + typeKey)) {
        paramMessage = i18n.global.t('common.error.PARAM_INVALID.' + typeKey, dataObj) as string
      } else {
        paramMessage = i18n.global.t('common.error.PARAM_INVALID.default', dataObj) as string
      }
      showError(paramMessage)
      return Promise.reject(res)
    }

    const message = res.code
      ? (i18n.global.t(`common.error.${res.code}`, (res.data || {}) as Record<string, unknown>) as string)
      : (i18n.global.t('common.error.UNKNOWN_ERROR') as string)
    showError(message)
    return Promise.reject(res)
  },
  async (error) => {
    if (error.config) removePending(error.config)
    const { useAppStore } = await import('@/store/modules/app')
    useAppStore().hideLoading()

    if (axios.isCancel(error)) return Promise.reject(error)

    const reqConfig = (error.config || {}) as InternalAxiosRequestConfigLike
    const shouldRetry = reqConfig.retry !== false &&
      (!error.response || RETRY_CONFIG.retryableStatus.includes(error.response.status))

    if (shouldRetry) {
      reqConfig._retryCount = reqConfig._retryCount || 0
      if (reqConfig._retryCount < RETRY_CONFIG.maxRetries) {
        reqConfig._retryCount++
        return delay(RETRY_CONFIG.retryDelay).then(() => service(reqConfig))
      }
    }

    const { default: i18n } = await import('@/i18n')
    if (!error.response) {
      showError(i18n.global.t('common.error.NETWORK_ERROR') as string)
    } else {
      const status = error.response.status
      if (status === 403) {
        const resData = (error.response.data || {}) as { data?: { type?: string } }
        const errType = resData?.data?.type || ''
        const isLicenseError = errType.includes('license') || errType === 'time_rollback'
        if (isLicenseError && !isLicenseRedirecting) {
          isLicenseRedirecting = true
          showWarning(i18n.global.t('common.error.LICENSE_EXPIRED') as string)
          setTimeout(async () => {
            const { default: router } = await import('@/router/index')
            if (router.currentRoute.value.path !== ROUTE_PATHS.LICENSE_IMPORT) {
              router.push(ROUTE_PATHS.LICENSE_IMPORT)
            }
            isLicenseRedirecting = false
          }, 800)
        } else if (!isLicenseError) {
          showError(i18n.global.t(`common.error.http.${status}`) as string)
        }
        return Promise.reject(error)
      }
      showError(i18n.global.t(`common.error.http.${status}`) as string)
    }
    return Promise.reject(error)
  }
)

/** 泛型请求方法（供业务层调用） */
export function request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
  return service.request(config) as unknown as Promise<ApiResponse<T>>
}

/**
 * 默认导出：axios 实例的类型化封装。
 * 拦截器已统一解包 { code, message, data }，故运行时 resolve 的就是 ApiResponse。
 */
export default function requestInstance<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
  return service.request(config) as unknown as Promise<ApiResponse<T>>
}
