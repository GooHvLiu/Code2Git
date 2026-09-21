/**
 * Common Module - Internationalization Fields Aggregation Entry
 * Aggregates all common sub-module internationalization fields
 * Note: No fallback solution, missing fields directly display the key
 */
import action from './action'
import status from './status'
import message from './message'
import error from './error'
import table from './table'
import validate from './validate'
import dict from './dict'
import upload from './upload'

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
  // Built-in dict enums (namespace: common.dict.types/items)
  dict,
  // Upload components (namespace: common.upload.*)
  upload,
  // Table
  ...table
}
