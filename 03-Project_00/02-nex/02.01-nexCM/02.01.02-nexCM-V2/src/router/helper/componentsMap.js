/**
 * ==========================================
 * 动态路由组件映射表
 * ==========================================
 * 后端菜单返回 component 字段时，优先从此映射表查找组件
 * 找不到时回退到 @/views/{path}/index.vue 动态 import
 *
 * 用法：后端菜单配置 component: 'system/user'，映射到对应组件
 * 好处：目录结构调整不影响路由，支持组件复用
 */

const componentsMap = {
  // 示例：新增业务模块时在此注册
  // 'system/user': () => import('@/views/system/user/index.vue'),
  // 'system/role': () => import('@/views/system/role/index.vue'),
}

export default componentsMap
