/**
 * ==========================================
 * 表单校验工具
 * ==========================================
 * 校验提示文案统一从 config.VALIDATE 读取
 */
import config from '@/config'

/**
 * 用户名校验：3-16 位
 */
export function validateUsername(rule, value, callback) {
  if (value.length < 3 || value.length > 16) {
    callback(new Error(config.VALIDATE.USERNAME_LENGTH))
  } else {
    callback()
  }
}

/**
 * 密码校验：6-20 位
 */
export function validatePassword(rule, value, callback) {
  if (value.length < 6 || value.length > 20) {
    callback(new Error(config.VALIDATE.PASSWORD_LENGTH))
  } else {
    callback()
  }
}

/**
 * 确认密码校验工厂函数
 * @param {string} password - 需要对比的密码值
 * @returns {Function} Element UI 校验器
 */
export function validateConfirmPassword(password) {
  return function (rule, value, callback) {
    if (value !== password) {
      callback(new Error(config.VALIDATE.PASSWORD_MISMATCH))
    } else {
      callback()
    }
  }
}

/**
 * 邮箱校验
 */
export function validateEmail(rule, value, callback) {
  const reg = /^[\w.-]+@[\w-]+\.[\w.-]+$/
  if (!reg.test(value)) {
    callback(new Error(config.VALIDATE.EMAIL_FORMAT))
  } else {
    callback()
  }
}
