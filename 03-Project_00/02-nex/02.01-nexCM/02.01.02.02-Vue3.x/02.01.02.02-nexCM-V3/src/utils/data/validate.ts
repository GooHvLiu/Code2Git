/**
 * ==========================================
 * 表单校验工具
 * ==========================================
 * 校验提示文案统一通过 i18n 从 common.validate.* 读取（不硬编码、不兜底）
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import i18n from '@/i18n'

/** Element Plus 表单校验器签名 */
type RuleValidator = (rule: unknown, value: string, callback: (error?: Error | string) => void) => void

/**
 * 用户名校验：3-16 位
 */
export const validateUsername: RuleValidator = (_rule, value, callback) => {
  if (!value || value.length < 3 || value.length > 16) {
    callback(new Error(i18n.global.t('common.validate.usernameLength') as string))
  } else {
    callback()
  }
}

/**
 * 密码校验：6-20 位
 */
export const validatePassword: RuleValidator = (_rule, value, callback) => {
  if (!value || value.length < 6 || value.length > 20) {
    callback(new Error(i18n.global.t('common.validate.passwordLength') as string))
  } else {
    callback()
  }
}

/**
 * 确认密码校验工厂函数
 * @param password - 需要对比的密码值
 * @returns Element Plus 校验器
 */
export function validateConfirmPassword(password: string): RuleValidator {
  return (_rule, value, callback) => {
    if (value !== password) {
      callback(new Error(i18n.global.t('common.validate.passwordMismatch') as string))
    } else {
      callback()
    }
  }
}

/**
 * 邮箱校验
 */
export const validateEmail: RuleValidator = (_rule, value, callback) => {
  const reg = /^[\w.-]+@[\w-]+\.[\w.-]+$/
  if (!value || !reg.test(value)) {
    callback(new Error(i18n.global.t('common.validate.emailFormat') as string))
  } else {
    callback()
  }
}
