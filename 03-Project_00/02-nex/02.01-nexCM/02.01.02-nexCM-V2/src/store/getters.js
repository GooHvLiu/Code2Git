/**
 * ==========================================
 * Vuex 全局 Getters
 * ==========================================
 * 统一出口，组件中通过 this.$store.getters.xxx 使用
 * 避免组件中直接访问深层 state，便于维护
 */
const getters = {
  // app 模块
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  /** 全局 Loading 是否显示（计数 > 0 时为 true） */
  globalLoading: state => state.app.globalLoading > 0,

  // user 模块
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,

  // permission 模块
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  userMenu: state => state.permission.userMenu,

  // tagsView 模块
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  // errorLog 模块
  errorLogs: state => state.errorLog.logs
}

export default getters
