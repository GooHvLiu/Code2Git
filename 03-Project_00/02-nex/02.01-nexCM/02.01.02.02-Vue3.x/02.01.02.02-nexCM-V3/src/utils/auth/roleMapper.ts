/**
 * ==========================================
 * 角色名称和描述映射工具
 * ==========================================
 * 内置角色（Super_Admin / Administrator / Engineer / Operator）的名称与描述
 * 通过 role_code 从前端 i18n（system.role.builtin.*）取，支持中英文切换；
 * 自定义角色（is_builtin=0）直接使用数据库存储的 role_name / description。
 *
 * 用法：
 *   import { getRoleName, getRoleDesc, isBuiltinRole } from '@/utils/auth/roleMapper'
 *   const name = getRoleName(role)   // role 可为对象或 role_code 字符串
 * 作者：GooHv
 */
import i18n from '@/i18n'
import type { Role } from '@/types/system'

/**
 * 从角色对象或 role_code 字符串中提取 role_code
 * @param role 角色对象或 role_code 字符串
 * @returns role_code，无法提取时返回 null
 */
function extractRoleCode(role: Role | string | null | undefined): string | null {
  if (!role) return null
  if (typeof role === 'string') return role
  return role.role_code || null
}

/** 内置角色编码集合 */
const BUILTIN_CODES = ['Super_Admin', 'Administrator', 'Engineer', 'Operator']

/**
 * 判断是否为内置角色（通过 role_code 匹配）
 * @param role 角色对象或 role_code 字符串
 */
export function isBuiltinRole(role: Role | string | null | undefined): boolean {
  const code = extractRoleCode(role)
  return code ? BUILTIN_CODES.includes(code) : false
}

/**
 * 获取角色名称：内置角色优先走 i18n，自定义角色用数据库 role_name
 * @param role 角色对象（含 role_code / role_name）或 role_code 字符串
 */
export function getRoleName(role: Role | string | null | undefined): string {
  const code = extractRoleCode(role)
  if (code) {
    const key = `system.role.builtin.${code}.name`
    const i18nName = i18n.global.t(key)
    if (typeof i18nName === 'string' && i18nName && i18nName !== key) {
      return i18nName
    }
  }
  if (typeof role === 'object' && role && role.role_name) {
    return role.role_name
  }
  return code || ''
}

/**
 * 获取角色描述：内置角色优先走 i18n，自定义角色用数据库 description
 * @param role 角色对象（含 role_code / description）或 role_code 字符串
 */
export function getRoleDesc(role: Role | string | null | undefined): string {
  const code = extractRoleCode(role)
  if (code) {
    const key = `system.role.builtin.${code}.desc`
    const i18nDesc = i18n.global.t(key)
    if (typeof i18nDesc === 'string' && i18nDesc && i18nDesc !== key) {
      return i18nDesc
    }
  }
  if (typeof role === 'object' && role && role.description) {
    return role.description
  }
  return ''
}

export default {
  getRoleName,
  getRoleDesc,
  isBuiltinRole
}
