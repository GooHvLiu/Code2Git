// Vue3 框架提供的方法 createApp 方法，可以用来创建应用实例方法
import { createApp } from "vue";
// 引入样式重置文件 reset.css
import "@/style/reset.less";
// 引入根组件App
import App from "./App.vue";
// 引入全局组件- HospitalTop / HospitalBottom / Login，用于页面的顶部和底部
import HospitalTop from "@/components/HospitalTop/index.vue";
import HospitalBottom from "@/components/HospitalBottom/index.vue";
import Login from "@/components/Login/index.vue";
// 引入路由组件
import router from "./router/index.ts";
// 引入 pinia 状态管理工具
import { createPinia } from "pinia";
// 引入 element-plus 组件库
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 引入 element-plus 国际化组件库
import zhCn from "element-plus/es/locale/lang/zh-cn";
// 引入 element-plus Icon图标库
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 利用 createApp 方法创建应用实例
const app = createApp(App);
// 将创建的 createrPinia 进行挂载
app.use(createPinia());
// 将 HospitalTop / HospitalBottom / Login 注册为全局组件
app.component("HospitalTop", HospitalTop);
app.component("HospitalBottom", HospitalBottom);
app.component("Login", Login);
// 使用 router 插件，全局注册相关方法
app.use(router);
// 使用 element-plus 插件，全局注册相关方法 + 国际化全局配置
app.use(ElementPlus, {
  locale: zhCn
});
// 将 element-plus 内置Icon进行全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 将应用实例挂载到挂载点上
app.mount("#app");
