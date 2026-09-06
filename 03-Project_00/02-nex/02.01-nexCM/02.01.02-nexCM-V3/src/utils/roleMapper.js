/**
 * 角色名称和描述映射工具
 *
 * 内置角色（Super_Admin, Administrator, Engineer, Operator）的名称和描述
 * 通过 role_code 从前端 i18n 中获取，支持中英文切换。
 *
 * 自定义角色（is_builtin=0）直接使用数据库中存储的 role_name 和 description。
 *
 * 使用方式：
 *   import { getRoleName, getRoleDesc } from '@/utils/roleMapper'
 *   const name = getRoleName(role)  // role 可以是对象或 role_code 字符串
 */

import i18n from '@/i18n'

/**
 * 从角色对象或 role_code 中提取 role_code
 * @param {Object|string} role - 角色对象或 role_code 字符串
 * @returns {string|null} role_code
 */
function extractRoleCode(role) {
  if (!role) return null
  if (typeof role === 'string') return role
  return role.role_code || null
}

/**
 * 判断是否为内置角色（通过 role_code 匹配）
 * @param {Object|string} role - 角色对象或 role_code 字符串
 * @returns {boolean}
 */
export function isBuiltinRole(role) {
  const code = extractRoleCode(role)
  if (!code) return false
  const builtinCodes = ['Super_Admin', 'Administrator', 'Engineer', 'Operator']
  return builtinCodes.includes(code)
}

/**
 * 获取角色名称
 * 内置角色优先使用 i18n 翻译，自定义角色使用数据库中的 role_name
 * @param {Object|string} role - 角色对象（需含 role_code, role_name）或 role_code 字符串
 * @returns {string} 角色名称
 */
export function getRoleName(role) {
  const code = extractRoleCode(role)
  if (code) {
    // 优先从 i18n 获取内置角色名称
    const i18nName = i18n.t(`roles.${code}.name`)
    if (i18nName && i18nName !== `roles.${code}.name`) {
      return i18nName
    }
  }
  // 自定义角色或 i18n 未配置时，使用数据库中的 role_name
  if (typeof role === 'object' && role && role.role_name) {
    return role.role_name
  }
  return code || ''
}

/**
 * 获取角色描述
 * 内置角色优先使用 i18n 翻译，自定义角色使用数据库中的 description
 * @param {Object|string} role - 角色对象（需含 role_code, description）或 role_code 字符串
 * @returns {string} 角色描述
 */
export function getRoleDesc(role) {
  const code = extractRoleCode(role)
  if (code) {
    // 优先从 i18n 获取内置角色描述
    const i18nDesc = i18n.t(`roles.${code}.desc`)
    if (i18nDesc && i18nDesc !== `roles.${code}.desc`) {
      return i18nDesc
    }
  }
  // 自定义角色或 i18n 未配置时，使用数据库中的 description
  if (typeof role === 'object' && role && role.description) {
    return role.description
  }
  return ''
}

export default {
  getRoleName,
  getRoleDesc,
  isBuiltinRole,
}
