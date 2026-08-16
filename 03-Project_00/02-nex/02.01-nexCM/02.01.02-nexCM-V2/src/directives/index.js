/**
 * ==========================================
 * 自定义指令统一注册
 * ==========================================
 */
import permission from './permission'
import watermark from './watermark'

const directives = {
  permission,
  watermark
}

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    })
  }
}
