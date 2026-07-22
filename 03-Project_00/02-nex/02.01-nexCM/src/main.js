import "reset-css";
import Vue from "vue";
import App from "./App.vue";

// 全局挂载路由
import VueRouter from "vue-router";

// 引入对应按需使用的插件名称
import { Button, Form, FormItem, Input, Message } from "element-ui";

// 引入路由配置
import router from "@router/index.js";

Vue.config.productionTip = false;
// 使用对应的路由
Vue.use(VueRouter);

// 使用对应的 UI库 插件
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
// 将Message放入原型对象中引用
Vue.prototype.$message = Message;

new Vue({
  render: (h) => h(App),
  router
}).$mount("#app");
