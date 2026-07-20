import Vue from "vue";
import App from "./App.vue";
//全局挂载路由
import VueRouter from "vue-router";

//引入路由配置
import router from "@router/index.js";

Vue.config.productionTip = false;
Vue.use(VueRouter);

new Vue({
  render: (h) => h(App),
  router
}).$mount("#app");
