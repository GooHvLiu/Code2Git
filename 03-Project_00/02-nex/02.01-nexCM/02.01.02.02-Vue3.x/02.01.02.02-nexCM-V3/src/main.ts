/**
 * ==========================================
 * 应用入口（Vue 3 createApp）
 * ==========================================
 * 注册顺序：Pinia → Router(+守卫) → i18n → Element Plus → SVG → 指令 → 全局样式
 */
import { createApp } from 'vue'
import App from './App.vue'
import pinia from './store'
import router from './router'
import i18n from './i18n'

// 路由守卫（副作用注册）
import './router/permission'

// SVG 雪碧图
import 'virtual:svg-icons-register'

// Element Plus 样式（地基阶段引入全量样式，后续可改按需 CSS）
import 'element-plus/dist/index.css'

// 全局样式
import 'reset-css'
import './assets/styles/index.less'

import componentsPlugin from './plugins/components'
import permissionDirective from '@/directives/permission'
import { watermark } from '@/directives/index'
import safeHtmlDirective from '@/directives/safeHtml'
import { initTheme } from '@/utils/ui/theme'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

// 全局业务组件（Pagination / SvgIcon / DictTag / SearchForm / TableToolbar / UploadImage）
app.use(componentsPlugin)

// 全局指令
app.directive('permission', permissionDirective)
app.directive('watermark', watermark)
app.directive('safe-html', safeHtmlDirective)

// 全局错误处理（占位：接入 errorLog Pinia store）
app.config.errorHandler = (err, _vm, info) => {
  console.error('[全局错误]', err, info)
}

initTheme()

app.mount('#app')
