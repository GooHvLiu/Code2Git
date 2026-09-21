/**
 * System Settings Module - Internationalization Fields Aggregation Entry (English)
 * Aggregates all system settings related sub-module internationalization fields
 */
import user from './user'
import role from './role'
import config from './config'
import audit from './audit'
import device from './device'
import permission from './permission'
import errorLog from './errorLog'

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
