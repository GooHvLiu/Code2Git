/**
 * ==========================================
 * 自定义指令统一注册
 * ==========================================
 */
import permission from './permission'

const directives = {
  permission
}

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    })
  }
}
