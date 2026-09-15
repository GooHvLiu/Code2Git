/**
 * 公共模块 - 国际化字段聚合入口
 * 聚合所有公共子模块的国际化字段
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
import action from './action.js'
import status from './status.js'
import message from './message.js'
import error from './error.js'
import table from './table.js'
import validate from './validate.js'
import dict from './dict.js'

export default {
  // 操作类
  ...action,
  // 状态类
  ...status,
  // 消息提示类
  ...message,
  // 错误码类（命名空间挂载：common.error.错误码）
  error,
  // 表单校验类（命名空间挂载：common.validate.字段）
  validate,
  // 内置数据字典枚举（命名空间挂载：common.dict.types/items）
  dict,
  // 表格通用类
  ...table
}
