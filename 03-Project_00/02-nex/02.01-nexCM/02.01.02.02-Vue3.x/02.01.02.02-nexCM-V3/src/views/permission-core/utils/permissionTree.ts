/**
 * ==========================================
 * 权限树工具函数
 * ==========================================
 * 用于权限配置模块（permission-core）的树数据处理：
 * 超级专属节点裁剪、按类型过滤、按类型统计、节点图标与角色头像解析。
 * 作者：GooHv
 */
import type { Component } from 'vue'
import { Folder, Pointer, Setting, Document } from '@element-plus/icons-vue'
import { getRoleName as mapperGetRoleName } from '@/utils/auth/roleMapper'
import type { PermissionNode, Role } from '@/types/system'

/**
 * 递归裁剪超级专属节点（superOnly），返回副本，不修改原始数据。
 * - keepSuper=false：直接剔除所有 superOnly 节点及其整棵子树；
 * - keepSuper=true（配置超管角色）：保留 superOnly 节点但禁用勾选。
 * @param tree 原始权限树
 * @param keepSuper 是否保留超级专属节点
 */
export function scopeSuperOnlyNodes(tree: PermissionNode[] | undefined, keepSuper: boolean): PermissionNode[] {
  if (!Array.isArray(tree) || tree.length === 0) return []
  const result: PermissionNode[] = []
  for (const node of tree) {
    // 非超管角色配置时，直接剔除超级专属节点及其整棵子树
    if (!keepSuper && node.superOnly) continue
    const newNode: PermissionNode = { ...node }
    if (node.children && node.children.length > 0) {
      newNode.children = scopeSuperOnlyNodes(node.children, keepSuper)
    }
    // 配置超管角色时，超级专属节点禁止勾选（超管自动拥有，不可更改）
    if (keepSuper && node.superOnly) {
      newNode.disabled = true
    }
    result.push(newNode)
  }
  return result
}

/**
 * 按类型过滤树形数据：节点本身类型匹配或其子树有匹配节点时保留。
 * @param tree 原始权限树
 * @param type 目标类型（menu / button / param）
 */
export function filterTreeByType(tree: PermissionNode[] | undefined, type: string): PermissionNode[] {
  if (!Array.isArray(tree) || tree.length === 0) return []
  const result: PermissionNode[] = []
  for (const node of tree) {
    let filteredChildren: PermissionNode[] = []
    if (node.children && node.children.length > 0) {
      filteredChildren = filterTreeByType(node.children, type)
    }
    // 当前节点类型匹配，或有子节点匹配，则保留
    if (node.type === type || filteredChildren.length > 0) {
      const newNode: PermissionNode = { ...node }
      if (filteredChildren.length > 0) {
        newNode.children = filteredChildren
      } else {
        // 无子节点时删除 children，避免 el-tree 显示空的展开箭头
        delete newNode.children
      }
      result.push(newNode)
    }
  }
  return result
}

/**
 * 递归统计指定类型且 id 命中已选 keys 的节点数量
 * @param nodes 节点列表
 * @param type 目标类型
 * @param keys 已选中的 key 列表（含半选父节点）
 */
export function countNodesByType(nodes: PermissionNode[], type: string, keys: Array<number | string>): number {
  let count = 0
  nodes.forEach(node => {
    if (node.type === type && keys.includes(node.id)) count++
    if (node.children && node.children.length > 0) {
      count += countNodesByType(node.children, type, keys)
    }
  })
  return count
}

/**
 * 获取节点图标组件（element-ui 字体图标 → Element Plus 图标组件）
 * @param data 节点数据
 */
export function getNodeIcon(data: PermissionNode): Component {
  switch (data.type) {
    case 'menu':
      return Folder
    case 'button':
      return Pointer
    case 'param':
      return Setting
    default:
      return Document
  }
}

/**
 * 获取节点图标样式类
 * @param data 节点数据
 */
export function getNodeIconClass(data: PermissionNode): string {
  return `icon-${data.type || 'default'}`
}

/**
 * 根据角色数据库字段获取头像图标文件名。
 * is_super_admin=1 或 role_level=1 → SuperAdmin；
 * role_level 2→Administrator，3→Engineer，4→Operator；其他 → who。
 * @param role 角色数据
 */
export function getRoleAvatarIcon(role: Role | null | undefined): string {
  if (Number(role?.is_super_admin) === 1) return 'SuperAdmin'
  const levelMap: Record<number, string> = { 2: 'Administrator', 3: 'Engineer', 4: 'Operator' }
  return levelMap[Number(role?.role_level)] || 'who'
}

/**
 * 获取角色名称（统一走 roleMapper：内置角色走 i18n，自定义角色走数据库值）
 * @param role 角色数据
 */
export function getRoleName(role: Role | null | undefined): string {
  return mapperGetRoleName(role)
}
