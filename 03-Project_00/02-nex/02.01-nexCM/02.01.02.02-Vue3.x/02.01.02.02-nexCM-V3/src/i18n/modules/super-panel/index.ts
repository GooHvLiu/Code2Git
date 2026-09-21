/**
 * 超级面板模块 - 国际化字段聚合入口
 * 聚合所有超级面板相关子模块的国际化字段
 */
import role from './role'
import dept from './dept'
import menuConfig from './menu-config'
import i18n from './i18n'
import config from './config'
import database from './database'
import license from './license'
import projectConfig from './projectConfig'
import dict from './dict'
import feature from './feature'

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
