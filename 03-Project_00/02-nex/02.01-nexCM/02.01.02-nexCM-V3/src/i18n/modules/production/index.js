/**
 * 生产管理模块 - 国际化字段聚合入口
 * 聚合所有生产管理相关子模块的国际化字段
 */
import order from './order.js'
import recipe from './recipe.js'

export default {
  // 订单管理
  order,
  // 配方管理
  recipe
}
