/**
 * Common Module - Internationalization Fields Aggregation Entry
 * Aggregates all common sub-module internationalization fields
 * Note: No fallback solution, missing fields directly display the key
 */
import action from './action.js'
import status from './status.js'
import message from './message.js'
import error from './error.js'
import table from './table.js'
import validate from './validate.js'
import dict from './dict.js'

export default {
  // Action
  ...action,
  // Status
  ...status,
  // Message
  ...message,
  // Error codes (namespace mount: common.error.CODE)
  error,
  // Form validation (namespace mount: common.validate.field)
  validate,
  // 内置数据字典枚举（命名空间挂载：common.dict.types/items）
  dict,
  // Table
  ...table
}
