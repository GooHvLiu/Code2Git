/**
 * ==========================================
 * Axios 请求统一封装
 * ==========================================
 * 合并原 axios.js（业务请求）和 pure-axios.js（token校验）为一个实例
 * 通过请求拦截器统一处理：Token 注入、白名单放行
 * 通过响应拦截器统一处理：业务码判断、错误提示、Token过期跳转
 */
import axios from 'axios'
import { showError, showWarning } from '../ui/message'
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

/**
 * 是否正在显示重新登录弹窗
 * 防止多个请求同时 401 时弹出多个框
 */
let isReloginShowing = false

/**
 * 是否正在跳转授权导入页
 * 防止多个请求同时 403 时重复跳转
 */
let isLicenseRedirecting = false


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
    // 如果请求配置中设置了 skipPending: true，则跳过重复请求取消逻辑
    // 适用于批量发送的请求（如批量翻译），避免每个请求被下一个请求取消
    if (!requestConfig.skipPending) {
      addPending(requestConfig)
    }

    // 全局 Loading 计数 +1（动态引入 store 避免循环依赖）
    // 如果请求配置中设置了 hideLoading: true，则不显示全局 loading
    if (!requestConfig.hideLoading) {
      const store = require('@/store/index').default
      store.dispatch('app/showLoading')
    }

    // 统一注入当前语言参数（后端根据语言返回对应多语言字段）
    const i18n = require('@/i18n').default
    const currentLang = i18n.locale || 'zh-CN'
    if (requestConfig.method === 'get') {
      requestConfig.params = { ...requestConfig.params, lang: currentLang }
    } else if (requestConfig.method === 'post' || requestConfig.method === 'put') {
      // POST/PUT 请求将 lang 放在 params 中（URL 查询参数），不影响 body 数据
      requestConfig.params = { ...requestConfig.params, lang: currentLang }
    }

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

    // Blob 响应（文件下载）直接返回，不做业务码判断
    if (response.config.responseType === 'blob') {
      return response
    }

    // 业务成功
    if (res.code === CODE_SUCCESS) {
      return res
    }

    // 菜单未变更（缓存命中）：不弹错误，直接返回，由调用方处理
    if (res.code === CODE_MENU_NOT_MODIFIED) {
      return res
    }

    // Token 过期/无效：顶部警告提示，自动跳登录（防重复）
    if (TOKEN_AUTO_REDIRECT_CODES.includes(res.code)) {
      if (!isReloginShowing) {
        isReloginShowing = true
        // 按实际错误码国际化（TOKEN_EXPIRED/TOKEN_INVALID/UNAUTHORIZED 均在 common.error 中）
        const i18nRelogin = require('@/i18n').default
        showWarning(i18nRelogin.t(`common.error.${res.code}`))
        // 动态引入 store 和 router 避免循环依赖
        const store = require('@/store/index').default
        store.dispatch('user/logout').then(() => {
          const router = require('@/router/index.js').default
          router.push(`${ROUTE_PATHS.LOGIN}?redirect=${router.currentRoute.fullPath}`)
        }).finally(() => {
          // 延迟重置标志，避免跳转前其他请求又触发
          setTimeout(() => { isReloginShowing = false }, 2000)
        })
      }
      return Promise.reject(res)
    }

    // 权限不足：顶部警告提示，不跳转（不兜底，缺 key 直接显示 key）
    if (res.code === CODE_PERMISSION_DENIED) {
      const i18n = require('@/i18n').default
      showWarning(i18n.t(`common.error.${res.code}`, res.data || {}))
      return Promise.reject(res)
    }

    // 参数校验错误：优先用 字段名.错误类型 作为 key 查找国际化（type 中的点号替换为下划线，避免 vue-i18n 解析成嵌套对象）；不使用后端中文/msg 兜底
    if (res.code === 'PARAM_INVALID') {
      const i18nInvalid = require('@/i18n').default
      const { field, type } = res.data || {}
      // 把 type 中的点号替换成下划线，如 string.min -> string_min（与 i18n 语言包中的 key 保持一致）
      const typeKey = (type || '').replace(/\./g, '_')
      let paramMessage
      // 1. 优先用 common.error.PARAM_INVALID.field.typeKey 查找（如 common.error.PARAM_INVALID.password.string_min）
      if (field && type && i18nInvalid.te('common.error.PARAM_INVALID.' + field + '.' + typeKey)) {
        paramMessage = i18nInvalid.t('common.error.PARAM_INVALID.' + field + '.' + typeKey, res.data || {})
      }
      // 2. 其次用 common.error.PARAM_INVALID.typeKey 查找（如 common.error.PARAM_INVALID.string_min）
      else if (type && i18nInvalid.te('common.error.PARAM_INVALID.' + typeKey)) {
        paramMessage = i18nInvalid.t('common.error.PARAM_INVALID.' + typeKey, res.data || {})
      }
      // 3. 统一回落到 default（不使用后端原始中文/msg 兜底，缺 key 直接显示 key）
      else {
        paramMessage = i18nInvalid.t('common.error.PARAM_INVALID.default', res.data || {})
      }
      showError(paramMessage)
      return Promise.reject(res)
    }

    // 其他业务错误：根据错误码做国际化，用 data 中的动态参数填充模板（不兜底，缺 key 直接显示 key）
    const i18n = require('@/i18n').default
    const message = res.code
      ? i18n.t(`common.error.${res.code}`, res.data || {})
      : i18n.t('common.error.UNKNOWN_ERROR')
    showError(message)
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
    const i18nHttp = require('@/i18n').default
    if (!error.response) {
      showError(i18nHttp.t('common.error.NETWORK_ERROR'))
    } else {
      const status = error.response.status

      // 403 授权失效：跳转到授权导入页面（区分业务码权限不足）；仅依据 data.type 英文标识判断，不依赖中文文案
      if (status === 403) {
        const resData = error.response.data || {}
        const errType = resData.data?.type || ''
        const isLicenseError = errType.includes('license') || errType === 'time_rollback'

        if (isLicenseError && !isLicenseRedirecting) {
          isLicenseRedirecting = true
          showWarning(i18nHttp.t('common.error.LICENSE_EXPIRED'))
          // 延迟跳转，让用户看到提示
          setTimeout(() => {
            const router = require('@/router/index.js').default
            // 如果当前已经在授权导入页，不重复跳转
            if (router.currentRoute.path !== ROUTE_PATHS.LICENSE_IMPORT) {
              router.push(ROUTE_PATHS.LICENSE_IMPORT)
            }
            isLicenseRedirecting = false
          }, 800)
        } else if (!isLicenseError) {
          // 非授权类403（如权限不足），按 HTTP 状态码国际化
          showError(i18nHttp.t(`common.error.http.${status}`))
        }
        return Promise.reject(error)
      }

      showError(i18nHttp.t(`common.error.http.${status}`))
    }
    return Promise.reject(error)
  }
)

export default service
