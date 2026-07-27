import Vue from 'vue'
import App from './App.vue'
// 引入svg使用的库文件
import './assets/icons/index.js'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
