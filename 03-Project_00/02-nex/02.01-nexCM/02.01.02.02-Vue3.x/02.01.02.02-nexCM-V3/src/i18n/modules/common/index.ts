/**
 * 公共模块 - 国际化字段聚合入口
 * 聚合所有公共子模块的国际化字段
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
import action from './action'
import status from './status'
import message from './message'
import error from './error'
import table from './table'
import validate from './validate'
import dict from './dict'
import upload from './upload'
import shift from './shift'

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
  // 上传组件（命名空间挂载：common.upload.*）
  upload,
  // 班次（命名空间挂载：common.shift.day/night）
  ...shift,
  // 表格通用类
  ...table
}
