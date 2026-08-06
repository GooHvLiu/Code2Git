/**
 * validate.js - 表单校验工具
 * 
 * 提供常用的表单校验规则，配合 Element UI 的 el-form 使用
 */

/**
 * 用户名是否合法（示例：只允许 admin 和 editor）
 */
export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 判断是否是外部链接
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 手机号校验
 * 使用：<el-form-item prop="phone" :rules="[{ validator: validatePhone, trigger: 'blur' }]">
 */
export function validatePhone(rule, value, callback) {
  if (!value) {
    callback()
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

/**
 * 邮箱校验
 */
export function validateEmail(rule, value, callback) {
  if (!value) {
    callback()
  } else if (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的邮箱'))
  }
}
