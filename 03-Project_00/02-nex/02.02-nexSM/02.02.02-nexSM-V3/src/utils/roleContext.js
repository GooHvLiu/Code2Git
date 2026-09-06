/**
 * ==========================================
 * 角色上下文工具（数据库字段驱动，无硬编码角色编码）
 * ==========================================
 * 所有角色属性（等级、是否超级管理员、可见角色等级）均来自 nex_role 表：
 *   - role_level:          角色等级，数字越小等级越高
 *   - is_super_admin:      是否为超级管理员（拥有所有权限）
 *   - visible_role_levels: 在权限配置中可见的角色等级列表
 *
 * 角色信息带进程内缓存，角色变更时调用 clearRoleCache() 清除
 */
const { query } = require('../db/index')
const cache = require('./cache')

const ROLE_CACHE_PREFIX = 'role_ctx:'
const ROLE_LIST_CACHE_KEY = 'role_ctx:all_list'
const ROLE_CACHE_TTL = 30 * 60 // 30 分钟

/**
 * 解析 JSON 字段（mysql2 可能已自动解析，也可能返回字符串）
 * @param {any} value
 * @returns {any}
 */
function parseJsonField(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch (e) {
    return null
  }
}

/**
 * 规范化角色对象，解析 JSON 字段
 * @param {Object} row 数据库行
 * @returns {Object} 规范化后的角色对象
 */
function normalizeRole(row) {
  if (!row) return null
  return {
    ...row,
    // role_name 和 description 已改为 VARCHAR 字符串，无需 JSON 解析
    visible_role_levels: parseJsonField(row.visible_role_levels) || [],
    is_super_admin: Number(row.is_super_admin) === 1,
    is_hidden: Number(row.is_hidden) === 1,
    is_builtin: Number(row.is_builtin) === 1,
    role_level: Number(row.role_level) || 0,
  }
}

/**
 * 获取全部启用角色列表（带缓存）
 * @param {boolean} forceRefresh 是否强制刷新缓存
 * @returns {Promise<Array>} 角色列表
 */
async function getAllRoles(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = cache.get(ROLE_LIST_CACHE_KEY)
    if (cached) return cached
  }
  const rows = await query(
    'SELECT * FROM nex_role WHERE status = 1 ORDER BY role_level ASC, sort ASC, id ASC'
  )
  const list = rows.map(normalizeRole)
  cache.set(ROLE_LIST_CACHE_KEY, list, ROLE_CACHE_TTL)
  return list
}

/**
 * 根据角色编码获取角色完整信息（带缓存）
 * @param {string} roleCode 角色编码
 * @param {boolean} forceRefresh 是否强制刷新缓存
 * @returns {Promise<Object|null>}
 */
async function getRoleByCode(roleCode, forceRefresh = false) {
  if (!roleCode) return null
  const cacheKey = ROLE_CACHE_PREFIX + 'code:' + roleCode
  if (!forceRefresh) {
    const cached = cache.get(cacheKey)
    if (cached) return cached
  }
  const rows = await query(
    'SELECT * FROM nex_role WHERE role_code = ? AND status = 1 LIMIT 1',
    [roleCode]
  )
  const role = normalizeRole(rows[0] || null)
  if (role) {
    cache.set(cacheKey, role, ROLE_CACHE_TTL)
  }
  return role
}

/**
 * 从 user 对象中提取角色编码（兼容字符串/数组）
 * @param {Object} user req.user 或用户对象
 * @returns {string|null}
 */
function extractRoleCode(user) {
  if (!user) return null
  const role = user.role
  if (Array.isArray(role)) return role[0] || null
  return role || null
}

/**
 * 判断指定用户是否为超级管理员（依据数据库 is_super_admin 字段）
 * @param {Object} user req.user 或用户对象（需含 role）
 * @returns {Promise<boolean>}
 */
async function checkIsSuperAdmin(user) {
  const roleCode = extractRoleCode(user)
  if (!roleCode) return false
  const role = await getRoleByCode(roleCode)
  return !!(role && role.is_super_admin)
}

/**
 * 获取指定用户的角色上下文信息
 * @param {Object} user req.user 或用户对象（需含 role）
 * @returns {Promise<Object|null>} 角色对象
 */
async function getRoleContext(user) {
  const roleCode = extractRoleCode(user)
  if (!roleCode) return null
  return await getRoleByCode(roleCode)
}

/**
 * 判断目标角色等级是否对当前用户可见
 * 依据当前用户角色的 visible_role_levels 字段
 * 超级管理员可见所有角色
 * @param {Object} currentUser 当前登录用户
 * @param {number} targetRoleLevel 目标角色的等级
 * @returns {Promise<boolean>}
 */
async function isRoleLevelVisibleToUser(currentUser, targetRoleLevel) {
  const ctx = await getRoleContext(currentUser)
  if (!ctx) return false
  // 超级管理员可见所有
  if (ctx.is_super_admin) return true
  const visibleLevels = ctx.visible_role_levels || []
  return visibleLevels.includes(Number(targetRoleLevel))
}

/**
 * 判断目标角色编码是否对当前用户可见
 * @param {Object} currentUser 当前登录用户
 * @param {string} targetRoleCode 目标角色编码
 * @returns {Promise<boolean>}
 */
async function isRoleVisibleToUser(currentUser, targetRoleCode) {
  const ctx = await getRoleContext(currentUser)
  if (!ctx) return false
  if (ctx.is_super_admin) return true
  const targetRole = await getRoleByCode(targetRoleCode)
  if (!targetRole) return false
  const visibleLevels = ctx.visible_role_levels || []
  return visibleLevels.includes(targetRole.role_level)
}

/**
 * 获取当前用户可见的角色列表（用于角色下拉、权限配置等）
 * 规则：
 *   - 超级管理员可见所有角色
 *   - 其他用户仅可见 visible_role_levels 中包含的等级对应的角色
 *   - is_hidden=1 的角色仅对超级管理员可见
 * @param {Object} currentUser 当前登录用户
 * @returns {Promise<Array>} 可见角色列表
 */
async function getVisibleRolesForUser(currentUser) {
  const allRoles = await getAllRoles()
  const ctx = await getRoleContext(currentUser)

  if (ctx && ctx.is_super_admin) {
    // 超级管理员可见所有角色
    return allRoles
  }

  const visibleLevels = (ctx && ctx.visible_role_levels) || []
  return allRoles.filter((r) => {
    // 隐藏角色对非超级管理员不可见
    if (r.is_hidden) return false
    return visibleLevels.includes(r.role_level)
  })
}

/**
 * 获取当前用户不可见的角色编码列表（用于用户列表过滤）
 * @param {Object} currentUser 当前登录用户
 * @returns {Promise<Array<string>>} 需排除的角色编码列表
 */
async function getExcludedRoleCodes(currentUser) {
  const allRoles = await getAllRoles()
  const visibleRoles = await getVisibleRolesForUser(currentUser)
  const visibleCodes = new Set(visibleRoles.map((r) => r.role_code))
  return allRoles
    .filter((r) => !visibleCodes.has(r.role_code))
    .map((r) => r.role_code)
}

/**
 * 清除角色缓存（角色增删改后调用）
 */
function clearRoleCache() {
  cache.del(ROLE_LIST_CACHE_KEY)
  cache.delByPrefix(ROLE_CACHE_PREFIX)
}

module.exports = {
  normalizeRole,
  parseJsonField,
  getAllRoles,
  getRoleByCode,
  extractRoleCode,
  checkIsSuperAdmin,
  getRoleContext,
  isRoleLevelVisibleToUser,
  isRoleVisibleToUser,
  getVisibleRolesForUser,
  getExcludedRoleCodes,
  clearRoleCache,
}
