import Vue from "vue";
import { Button, Select, checkbox, DatePicker } from "element-ui";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Select);
Vue.use(checkbox);
Vue.use(DatePicker);

new Vue({
  render: (h) => h(App)
}).$mount("#app");
