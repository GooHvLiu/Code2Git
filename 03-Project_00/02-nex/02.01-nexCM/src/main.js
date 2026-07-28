import "reset-css";
import Vue from "vue";
import App from "./App.vue";
// 引入element按需注册文件
import '@/plugins/element.js';
// 引入svg使用的库文
import './assets/icons/index.js'
// 引入路由权限守卫，加载即生效
import "./router/permission";
//引入store
import store from "./store/index.js";
// 全局挂载路由
import VueRouter from "vue-router";
// 引入路由配置
import router from "@router/index.js";

Vue.config.productionTip = false;
// 使用对应的路由
Vue.use(VueRouter);

new Vue({
  render: (h) => h(App),
  store,
  router,
  beforeCreate() {
    Vue.prototype.$bus = this;
  }
}).$mount("#app");
