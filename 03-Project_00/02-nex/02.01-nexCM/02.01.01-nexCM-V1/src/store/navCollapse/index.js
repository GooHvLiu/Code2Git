export default {
  namespaced: true,
  state: {
    isCollapse: false
  },
  mutations: {
    changeIsCollapse(state) {
      state.isCollapse = !state.isCollapse;
    }
  },
  actions: {},
  getters: {}
};
