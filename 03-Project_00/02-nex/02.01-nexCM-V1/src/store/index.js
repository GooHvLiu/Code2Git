import Vue from "vue";
import Vuex from "vuex";
import navCollapse from "./navCollapse/index.js";
import userMenu from "./userMenu/index.js";
import userInfo from "./userInfo/index.js";
Vue.use(Vuex);
export default new Vuex.Store({
  modules: { navCollapse, userMenu, userInfo }
});
