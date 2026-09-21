/**
 * ==========================================
 * 登录相关接口
 * ==========================================
 */
import request from '@/utils/request/request'

/**
 * 获取验证码
 * @returns {Promise<{code:number, msg:string, data:{img:string, uuid:string}}>}
 */
export function requestCaptchaCodeApi() {
  return request({ url: '/captcha/captcha-image', method: 'get' })
}

/**
 * 登录
 * @param {Object} data - { username, password, code, uuid }
 */
export function requestLoginApi(data: Record<string, unknown>) {
  return request({ url: '/user/login', method: 'post', data })
}

/**
 * 注册
 * @param {Object} data - { username, password, email, code, uuid }
 */
export function requestRegisterApi(data: Record<string, unknown>) {
  return request({ url: '/user/register', method: 'post', data })
}

/**
 * 获取用户信息（含角色）
 */
export function requestGetUserInfoApi() {
  return request({ url: '/user/info', method: 'get' })
}

/**
 * 获取菜单最新版本号
 * @returns {Promise<{code:number, msg:string, data:{version:string}}>}
 */
export function getMenuVersionApi() {
  return request({ url: '/menu/version', method: 'get' })
}

/**
 * 获取用户菜单路由（支持版本号缓存 + 多语言）
 * @param {string} [version] 前端缓存的版本号
 * @param {string} [lang] 语言代码，如 'zh-CN' / 'en-US'
 */
export function requestGetUserMenuApi(version: string | null, lang: string) {
  return request({
    url: '/menu/routers',
    method: 'get',
    params: {
      ...(version ? { version } : {}),
      ...(lang ? { lang } : {})
    }
  })
}
