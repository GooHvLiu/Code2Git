/**
 * 超级面板模块 - 国际化字段聚合入口
 * 聚合所有超级面板相关子模块的国际化字段
 */
import role from './role.js'
import dept from './dept.js'
import menuConfig from './menu-config.js'
import i18n from './i18n.js'
import config from './config.js'
import database from './database.js'
import license from './license.js'
import projectConfig from './projectConfig.js'
import dict from './dict.js'
import feature from './feature.js'

export default {
  // 角色管理
  role,
  // 部门管理
  dept,
  // 菜单配置
  menuConfig,
  // 语言配置
  i18n,
  // 参数配置
  config,
  // 数据库管理
  database,
  // 授权管理
  license,
  // 项目配置
  projectConfig,
  // 字典管理
  dict,
  // 功能配置
  feature
}
