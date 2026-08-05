export default {
  namespaced: true,
  state: {
    userMenu: []
  },
  mutations: {
    getRouterMenus(state, payload) {
      state.userMenu = payload
    }
  },
  actions: {
    // asyncChangeUserInfo({commit},payload){}
  },
  getters: {}
};
