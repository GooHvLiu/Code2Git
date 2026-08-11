/**
 * ==========================================
 * 登录相关接口
 * ==========================================
 */
import request from '@/utils/request'

/**
 * 获取验证码
 * @returns {Promise<{code:number, msg:string, data:{img:string, uuid:string}}>}
 */
export function requestCaptchaCodeApi() {
  return request({ url: '/captcha/captchaImage', method: 'get' })
}

/**
 * 登录
 * @param {Object} data - { username, password, code, uuid }
 */
export function requestLoginApi(data) {
  return request({ url: '/user/login', method: 'post', data })
}

/**
 * 注册
 * @param {Object} data - { username, password, code, uuid }
 */
export function requestRegisterApi(data) {
  return request({ url: '/user/register', method: 'post', data })
}

/**
 * 获取用户信息（含角色）
 */
export function requestGetUserInfoApi() {
  return request({ url: '/user/info', method: 'get' })
}

/**
 * 获取用户菜单路由
 */
export function requestGetUserMenuApi() {
  return request({ url: '/menu/getRouters', method: 'get' })
}
