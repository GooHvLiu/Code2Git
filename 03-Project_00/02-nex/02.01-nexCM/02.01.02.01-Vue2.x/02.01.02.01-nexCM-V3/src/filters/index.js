/**
 * ==========================================
 * 全局过滤器统一注册
 * ==========================================
 * 在 main.js 中 Vue.use(filters) 即可注册所有过滤器
 * 新增过滤器只需在此文件 import 并加入 filtersMap
 */
import { formatDateFilter } from './date.filter.js'

/** 过滤器映射表 */
const filtersMap = {
  formatDate: formatDateFilter
}

export default {
  install(Vue) {
    Object.keys(filtersMap).forEach(key => {
      Vue.filter(key, filtersMap[key])
    })
  }
}