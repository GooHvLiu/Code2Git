import Vue from "vue";
import Vuex from "vuex";
import navCollapse from "./navCollapse/index.js";
Vue.use(Vuex);
export default new Vuex.Store({
  modules: { navCollapse }
});
