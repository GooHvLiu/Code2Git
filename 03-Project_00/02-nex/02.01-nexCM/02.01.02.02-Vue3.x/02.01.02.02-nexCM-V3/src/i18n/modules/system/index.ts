/**
 * 系统设置模块 - 国际化字段聚合入口
 * 聚合所有系统设置相关子模块的国际化字段
 */
import user from './user'
import role from './role'
import config from './config'
import audit from './audit'
import device from './device'
import permission from './permission'
import errorLog from './errorLog'

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
