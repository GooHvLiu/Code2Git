/**
 * store/getters.js - 全局 getters
 * 
 * 统一导出各模块的 state，方便在组件中使用 mapGetters
 * 使用：this.$store.getters.token 或 ...mapGetters(['token'])
 */
const getters = {
  // app 模块
  sidebar: state => state.app.sidebar, // 侧边栏状态
  device: state => state.app.device, // 设备类型 desktop/mobile

  // user 模块
  token: state => state.user.token, // Token
  avatar: state => state.user.avatar, // 头像
  name: state => state.user.name, // 用户名
  introduction: state => state.user.introduction, // 介绍
  roles: state => state.user.roles, // 角色列表
  permissions: state => state.user.permissions, // 权限列表

  // permission 模块
  permission_routes: state => state.permission.routes, // 可访问的完整路由表

  // tagsView 模块
  visitedViews: state => state.tagsView.visitedViews, // 访问过的标签页
  cachedViews: state => state.tagsView.cachedViews // 缓存的标签页
}

export default getters
