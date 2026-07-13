import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 如下为创建全局数据总线,全局的VC和VM都能具有此方法$bus及对应的$on、$off、$emit
  beforeCreate() {
    Vue.prototype.$bus = this
  },
}).$mount('#app')
