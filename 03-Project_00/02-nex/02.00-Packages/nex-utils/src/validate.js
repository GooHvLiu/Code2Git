/**
 * ==========================================
 * 表单校验工具
 * ==========================================
 * Element UI 表单校验器集合
 */

/** 用户名校验：3-16 位 */
export function validateUsername(rule, value, callback) {
  if (!value || value.length < 3 || value.length > 16) {
    callback(new Error('用户名长度为 3-16 位'))
  } else {
    callback()
  }
}

/** 密码校验：6-20 位 */
export function validatePassword(rule, value, callback) {
  if (!value || value.length < 6 || value.length > 20) {
    callback(new Error('密码长度为 6-20 位'))
  } else {
    callback()
  }
}

/** 确认密码校验工厂函数 */
export function validateConfirmPassword(password) {
  return function (rule, value, callback) {
    if (value !== password) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }
}

/** 邮箱校验 */
export function validateEmail(rule, value, callback) {
  const reg = /^[\w.-]+@[\w-]+\.[\w.-]+$/
  if (!value || !reg.test(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

/** 手机号校验 */
export function validatePhone(rule, value, callback) {
  const reg = /^1[3-9]\d{9}$/
  if (!value || !reg.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

/** 身份证号校验 */
export function validateIdCard(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!value || !reg.test(value)) {
    callback(new Error('请输入正确的身份证号'))
  } else {
    callback()
  }
}

/** URL 校验 */
export function validateUrl(rule, value, callback) {
  const reg = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  if (!value || !reg.test(value)) {
    callback(new Error('请输入正确的 URL 地址'))
  } else {
    callback()
  }
}

/** 自定义长度校验工厂函数 */
export function validateLength(min, max, message) {
  return function (rule, value, callback) {
    const len = value ? value.length : 0
    if (len < min || len > max) {
      callback(new Error(message || `长度为 ${min}-${max} 位`))
    } else {
      callback()
    }
  }
}

/** 自定义正则校验工厂函数 */
export function validatePattern(pattern, message) {
  return function (rule, value, callback) {
    if (!value || !pattern.test(value)) {
      callback(new Error(message || '格式不正确'))
    } else {
      callback()
    }
  }
}
