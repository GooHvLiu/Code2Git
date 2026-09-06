/**
 * 权限树工具函数
 * 用于权限配置模块的树数据处理、裁剪、筛选和统计
 */
import { getRoleName as mapperGetRoleName } from "@/utils/roleMapper";

/**
 * 递归裁剪超级专属节点（superOnly）
 * @param {Array} tree 原始树
 * @param {boolean} keepSuper 是否保留超级专属节点（配置超管角色时为 true）
 * @returns {Array} 裁剪后的树（返回副本，不修改原始数据）
 */
export function scopeSuperOnlyNodes(tree, keepSuper) {
  if (!Array.isArray(tree) || tree.length === 0) return [];
  const result = [];
  for (const node of tree) {
    // 非超管角色配置时，直接剔除超级专属节点及其整棵子树
    if (!keepSuper && node.superOnly) continue;
    const newNode = { ...node };
    if (node.children && node.children.length > 0) {
      newNode.children = scopeSuperOnlyNodes(node.children, keepSuper);
    }
    // 配置超管角色时，超级专属节点禁止勾选（超管自动拥有，无需手动配置、不可更改）
    if (keepSuper && node.superOnly) {
      newNode.disabled = true;
    }
    result.push(newNode);
  }
  return result;
}

/**
 * 按类型过滤树形数据
 * @param {Array} tree 原始树
 * @param {string} type 类型（menu/button/param）
 * @returns {Array} 过滤后的树
 */
export function filterTreeByType(tree, type) {
  if (!Array.isArray(tree) || tree.length === 0) return [];
  const result = [];
  for (const node of tree) {
    // 递归筛选子节点
    let filteredChildren = [];
    if (node.children && node.children.length > 0) {
      filteredChildren = filterTreeByType(node.children, type);
    }
    // 如果当前节点类型匹配，或者有子节点匹配，则保留当前节点
    if (node.type === type || filteredChildren.length > 0) {
      const newNode = { ...node };
      if (filteredChildren.length > 0) {
        newNode.children = filteredChildren;
      } else {
        // 如果没有子节点，删除 children 属性，避免 el-tree 显示空的展开箭头
        delete newNode.children;
      }
      result.push(newNode);
    }
  }
  return result;
}

/**
 * 递归统计指定类型的节点数量
 * @param {Array} nodes 节点列表
 * @param {string} type 类型
 * @param {Array} keys 已选中的 key 列表
 * @returns {number} 数量
 */
export function countNodesByType(nodes, type, keys) {
  let count = 0;
  nodes.forEach((node) => {
    if (node.type === type && keys.includes(node.id)) count++;
    if (node.children && node.children.length > 0) {
      count += countNodesByType(node.children, type, keys);
    }
  });
  return count;
}

/**
 * 获取节点图标 class
 * @param {Object} data 节点数据
 * @returns {string} 图标 class
 */
export function getNodeIcon(data) {
  switch (data.type) {
    case "menu":
      return "el-icon-folder";
    case "button":
      return "el-icon-thumb";
    case "param":
      return "el-icon-setting";
    default:
      return "el-icon-document";
  }
}

/**
 * 获取节点图标样式类
 * @param {Object} data 节点数据
 * @returns {string} 样式类
 */
export function getNodeIconClass(data) {
  return `icon-${data.type || "default"}`;
}

/**
 * 根据角色数据库字段获取头像图标文件名
 * is_super_admin=1 或 role_level=1 → SuperAdmin.svg
 * role_level 2→Administrator, 3→Engineer, 4→Operator
 * 其他/未匹配 → who.svg（默认）
 * @param {Object} role 角色数据
 * @returns {string} 图标文件名
 */
export function getRoleAvatarIcon(role) {
  if (Number(role?.is_super_admin) === 1) return "SuperAdmin";
  const levelMap = { 2: "Administrator", 3: "Engineer", 4: "Operator" };
  return levelMap[Number(role?.role_level)] || "who";
}

/**
 * 获取角色名称（统一使用 roleMapper，内置角色走国际化，自定义角色走数据库值）
 * @param {Object} role 角色数据
 * @returns {string} 角色名称
 */
export function getRoleName(role) {
  return mapperGetRoleName(role);
}
