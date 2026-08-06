/**
 * auth.js - Token 存储工具
 * 
 * 使用 js-cookie 存储 Token，Cookie 可以在页面刷新后保持登录状态
 * TokenKey 是存储在 Cookie 中的键名
 */
import Cookies from 'js-cookie'

// Token 在 Cookie 中的键名
const TokenKey = 'MCV-Auto-Token'

// 获取 Token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置 Token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除 Token（登出时调用）
export function removeToken() {
  return Cookies.remove(TokenKey)
}
