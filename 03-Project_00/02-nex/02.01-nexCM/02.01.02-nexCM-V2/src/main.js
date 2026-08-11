import Vue from 'vue'
import 'reset-css'
// 全局样式（变量、mixin、工具类、Element UI 覆盖）
import '@/assets/styles/index.less'
import App from './App.vue'

// Element UI 注册
import '@/plugins/element.js'
// SVG 图标自动注册
import '@/assets/icons/index.js'
// 全局过滤器
import { formatDateFilter } from '@/filters/index'
Vue.filter('formatDate', formatDateFilter)
// 自定义指令
import directives from '@/directives'
Vue.use(directives)

// Vuex Store
import store from '@/store/index.js'
// 路由（内部已 Vue.use(VueRouter)）
import router from '@/router/index.js'
// 路由守卫，加载即生效
import '@/router/permission.js'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
