/**
 * 系统设置模块 - 国际化字段聚合入口
 * 聚合所有系统设置相关子模块的国际化字段
 */
import user from './user.js'
import role from './role.js'
import config from './config.js'
import audit from './audit.js'
import device from './device.js'
import permission from './permission.js'
import errorLog from './errorLog.js'

export default {
  // 用户管理
  user,
  // 角色管理
  role,
  // 参数配置
  config,
  // 审计日志
  audit,
  // 设备管理
  device,
  // 权限管理
  permission,
  // 错误日志
  errorLog
}
