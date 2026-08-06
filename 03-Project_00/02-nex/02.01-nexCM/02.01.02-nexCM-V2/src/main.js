/**
 * main.js - 应用入口文件
 * 
 * 职责：
 * 1. 引入 Vue 和第三方库
 * 2. 引入全局样式
 * 3. 注册全局组件和过滤器
 * 4. 创建 Vue 实例并挂载
 */
import Vue from 'vue'

// CSS 重置（统一各浏览器默认样式）
import 'normalize.css/normalize.css'

// Element UI 组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // 中文语言包

// 全局样式（自定义样式变量、过渡动画、侧边栏样式等）
import '@/assets/styles/index.scss'

// 根组件、Vuex Store、Vue Router
import App from './App'
import store from './store'
import router from './router'

// 全局功能模块
import '@/icons' // SVG 图标自动注册
import '@/permission' // 路由守卫（登录校验、权限控制）

// 全局过滤器
import * as filters from './filters'

// 注册 Element UI，默认组件尺寸 small
Vue.use(ElementUI, { locale, size: 'small' })

// 注册全局过滤器（在模板中通过 | 使用）
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 关闭生产环境提示
Vue.config.productionTip = false

// 创建 Vue 实例
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App) // 渲染根组件
})
