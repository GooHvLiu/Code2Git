/**
 * ==========================================
 * Axios 请求统一封装
 * ==========================================
 * 合并原 axios.js（业务请求）和 pure-axios.js（token校验）为一个实例
 * 通过请求拦截器统一处理：Token 注入、白名单放行
 * 通过响应拦截器统一处理：业务码判断、错误提示、Token过期跳转
 */
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import config from '@/config'
import { getToken } from './auth'
import {
  CODE_SUCCESS,
  TOKEN_AUTO_REDIRECT_CODES,
  CODE_PERMISSION_DENIED,
  NO_TOKEN_API
} from '@/utils/constants'

/**
 * 是否正在显示重新登录弹窗
 * 防止多个请求同时 401 时弹出多个框
 */
let isReloginShowing = false

/**
 * 创建 axios 实例
 */
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: config.REQUEST_TIMEOUT
})

/**
 * 请求拦截器
 * 统一注入 Token
 */
service.interceptors.request.use(
  requestConfig => {
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
  error => Promise.reject(error)
)

/**
 * 响应拦截器
 * 统一处理业务码和错误
 */
service.interceptors.response.use(
  response => {
    const res = response.data

    // 业务成功
    if (res.code === CODE_SUCCESS) {
      return res
    }

    // Token 过期/无效：弹一次确认框，用户确认后跳登录
    if (TOKEN_AUTO_REDIRECT_CODES.includes(res.code)) {
      if (!isReloginShowing) {
        isReloginShowing = true
        MessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 动态引入 store 和 router 避免循环依赖
          const store = require('@/store/index').default
          store.dispatch('user/logout').then(() => {
            const router = require('@/router/index.js').default
            router.push(`/login?redirect=${router.currentRoute.fullPath}`)
          })
        }).finally(() => {
          isReloginShowing = false
        })
      }
      return Promise.reject(res)
    }

    // 权限不足：弹提示框，不跳转
    if (res.code === CODE_PERMISSION_DENIED) {
      MessageBox.alert(res.msg || '当前账号权限不足，无法执行该操作', '权限提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      return Promise.reject(res)
    }

    // 其他业务错误：弹 Message 提示
    Message.error(res.msg || '请求失败')
    return Promise.reject(res)
  },
  error => {
    // HTTP 层错误（网络异常、404、500 等）
    if (!error.response) {
      Message.error('网络异常，无法连接服务器，请检查网络或后端服务')
    } else {
      const statusMap = {
        400: '请求参数错误',
        401: '未授权，请重新登录',
        403: '拒绝访问，权限不足',
        404: '请求地址不存在',
        500: '服务器内部错误',
        502: '网关错误，后端服务可能未启动',
        503: '服务不可用',
        504: '网关超时'
      }
      Message.error(statusMap[error.response.status] || `请求错误 ${error.response.status}`)
    }
    return Promise.reject(error)
  }
)

export default service
