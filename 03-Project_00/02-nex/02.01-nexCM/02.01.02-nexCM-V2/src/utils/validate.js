/**
 * ==========================================
 * 表单校验工具
 * ==========================================
 */

/**
 * 用户名校验：3-16 位
 */
export function validateUsername(rule, value, callback) {
  if (value.length < 3 || value.length > 16) {
    callback(new Error('用户名需要在3-16位之间，请重新输入！'))
  } else {
    callback()
  }
}

/**
 * 密码校验：6-20 位
 */
export function validatePassword(rule, value, callback) {
  if (value.length < 6 || value.length > 20) {
    callback(new Error('密码需要在6-20位之间，请重新输入！'))
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
      callback(new Error('两次输入的密码不一致！'))
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
    callback(new Error('请输入正确的邮箱地址！'))
  } else {
    callback()
  }
}
