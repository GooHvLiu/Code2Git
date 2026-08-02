import Vue from 'vue'


// 如下为使用 UI库 的引入方式
import { Button, Upload, Message, MessageBox, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
Vue.use(Button)
Vue.use(Upload)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

import App from './App.vue'
Vue.config.productionTip = false

// 全局实例挂载 $message
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
new Vue({
  render: h => h(App),
}).$mount('#app')
