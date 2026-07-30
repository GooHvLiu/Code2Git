// 登录校验 ESModule方式 
export { validateUsername } from "./loginValidate.util.js";

// localStorage/sessionStorage 整体删除
export { clearLoginStorage } from './storage.util.js'

// localStorage 本地存储、获取与删除
export { setLocalStorage, getLocalStorage, removeLocalStorage } from './storage.util.js'

// sessionStorage 本地存储、获取与删除
export { setSessionStorage, getSessionStorage, removeSessionStorage } from './storage.util.js'
