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

  // user 模块
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,

  // permission 模块
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  userMenu: state => state.permission.userMenu
}

export default getters
