import Vue from "vue";
import App from "./App.vue";

//全局挂载路由
import VueRouter from "vue-router";

// 引入对应按需使用的插件名称
import { Button } from "element-ui";

//引入路由配置
import router from "@router/index.js";

Vue.config.productionTip = false;
// 使用对应的路由
Vue.use(VueRouter);

// 使用对应的 Button 插件
Vue.use(Button);

new Vue({
  render: (h) => h(App),
  router
}).$mount("#app");
