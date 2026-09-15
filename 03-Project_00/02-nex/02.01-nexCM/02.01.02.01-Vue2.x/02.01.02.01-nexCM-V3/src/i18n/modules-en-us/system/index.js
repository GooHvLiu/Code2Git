/**
 * System Settings Module - Internationalization Fields Aggregation Entry (English)
 * Aggregates all system settings related sub-module internationalization fields
 */
import user from './user.js'
import role from './role.js'
import config from './config.js'
import audit from './audit.js'
import device from './device.js'
import permission from './permission.js'
import errorLog from './errorLog.js'

export default {
  // User management
  user,
  // Role management
  role,
  // Parameter configuration
  config,
  // Audit log
  audit,
  // Device management
  device,
  // Permission management
  permission,
  // Error log
  errorLog
}
