/**
 * 模块化国际化配置 - 总聚合入口
 * 聚合所有业务模块的国际化字段
 * 注意：不使用兜底方案，缺失字段直接显示 key
 *
 * 模块结构：
 * - common: 公共模块（操作、状态、消息、校验、错误、表格）
 * - layout: 布局模块（登录、导航栏、侧边栏、标签页、个人中心、错误页、快捷菜单、首页）
 * - system: 系统设置模块（用户、角色、部门、菜单、字典、配置、审计、通知、设备、权限、错误日志）
 * - superPanel: 超级面板模块（用户、角色、部门、菜单配置、语言配置、参数配置、数据库、授权、项目配置、字典、功能配置）
 * - device: 设备管理模块（物料、报警、设备、模板）
 * - production: 生产管理模块（订单、配方）
 * - heartbeat: 心跳监控模块
 * - notification: 通知管理模块
 */
import common from './common/index.js'
import layout from './layout/index.js'
import system from './system/index.js'
import superPanel from './super-panel/index.js'
import device from './device/index.js'
import production from './production/index.js'
import heartbeat from './heartbeat/index.js'
import notification from './notification/index.js'

export default {
  // 公共模块
  common,
  // 布局模块
  layout,
  // 系统设置模块
  system,
  // 超级面板模块
  superPanel,
  // 设备管理模块
  device,
  // 生产管理模块
  production,
  // 心跳监控模块
  heartbeat,
  // 通知管理模块
  notification
}
