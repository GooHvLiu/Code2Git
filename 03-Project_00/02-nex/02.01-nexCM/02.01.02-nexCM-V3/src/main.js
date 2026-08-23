import Vue from 'vue'
import 'reset-css'
// 全局样式（变量、mixin、工具类、Element UI 覆盖）
import '@/assets/styles/index.less'
import App from './App.vue'

// 初始化主题（从 localStorage 或 settings 读取）
import { initTheme } from '@/utils/theme'
initTheme()

// Element UI 注册
import '@/plugins/element.js'
// 通用业务组件全局注册（Pagination/SvgIcon/DictTag/SearchForm/TableToolbar/UploadImage/ElectronicSignature）
import components from '@/plugins/components.js'
Vue.use(components)
// SVG 图标自动注册
import '@/assets/icons/index.js'
// 全局过滤器
import filters from '@/filters'
Vue.use(filters)
// 自定义指令
import directives from '@/directives'
Vue.use(directives)
// 权限判断工具（挂载 $hasRole / $hasPermission / $checkPermission）
import permissionUtil from '@/utils/permission'
Vue.use(permissionUtil)
// 全局 Message 防重复封装（挂载 $msg）
import messageUtil from '@/utils/message'
Vue.use(messageUtil)

// Vuex Store
import store from '@/store/index.js'
// 路由（内部已 Vue.use(VueRouter)）
import router from '@/router/index.js'
// 路由守卫，加载即生效
import '@/router/permission.js'
// 国际化
import i18n from '@/i18n'

Vue.config.productionTip = false

/**
 * 全局异常处理
 * 捕获组件渲染、生命周期、事件回调中的错误，避免白屏无提示
 */
Vue.config.errorHandler = function (err, vm, info) {
  // eslint-disable-next-line no-console
  console.error('[Global Error]', info, err)
  // 收集到 errorLog 模块
  if (vm.$store) {
    vm.$store.dispatch('errorLog/addErrorLog', { err, vm, info })
  }
  // 开发环境弹提示
  if (process.env.NODE_ENV === 'development') {
    vm.$message && vm.$message.error(`页面异常：${err.message || '未知错误'}`)
  }
}

new Vue({
  render: h => h(App),
  store,
  router,
  i18n,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
