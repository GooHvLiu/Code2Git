// Vue3 框架提供的方法 createApp 方法，可以用来创建应用实例方法
import { createApp } from "vue";
// 引入样式重置文件 reset.css
import "@/style/reset.less";
// 引入根组件App
import App from "./App.vue";
// 引入全局组件- HospitalTop 和 HospitalBottom，用于页面的顶部和底部
import HospitalTop from "@/components/HospitalTop/index.vue";
import HospitalBottom from "@/components/HospitalBottom/index.vue";
// 利用 createApp 方法创建应用实例
const app = createApp(App);
// 将 HospitalTop 和 HospitalBottom 注册为全局组件
app.component("HospitalTop", HospitalTop);
app.component("HospitalBottom", HospitalBottom);
// 将应用实例挂载到挂载点上
app.mount("#app");
