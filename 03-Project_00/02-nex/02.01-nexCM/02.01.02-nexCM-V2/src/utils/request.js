/**
 * request.js - Axios 请求封装
 * 
 * 功能：
 * 1. 创建 axios 实例，配置 baseURL 和超时
 * 2. 请求拦截器：自动添加 Authorization 请求头
 * 3. 响应拦截器：统一处理业务状态码和错误
 * 4. Token 过期自动跳登录
 */
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 从环境变量读取
  timeout: 15000 // 请求超时时间 15 秒
})

// ========== 请求拦截器 ==========
service.interceptors.request.use(
  config => {
    // 如果有 Token，添加到请求头
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// ========== 响应拦截器 ==========
service.interceptors.response.use(
  response => {
    const res = response.data

    // 业务状态码不是 20000 表示业务错误
    if (res.code !== 20000) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })

      // 40101: Token 无效; 40102: Token 过期
      if (res.code === 40101 || res.code === 40102) {
        MessageBox.confirm('登录已过期，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 重置 Token 并刷新页面
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // 成功，直接返回 data 部分（减少一层嵌套）
      return res
    }
  },
  error => {
    // HTTP 错误（网络错误、500 等）
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
