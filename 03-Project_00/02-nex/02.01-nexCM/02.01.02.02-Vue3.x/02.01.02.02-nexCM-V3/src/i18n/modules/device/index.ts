/**
 * 设备管理模块 - 国际化字段聚合入口
 * 聚合所有设备管理相关子模块的国际化字段
 */
import part from './part'
import alarm from './alarm'
import state from './state'

export default {
  // 物料管理
  part,
  // 报警管理
  alarm,
  // 状态总览
  state
}
