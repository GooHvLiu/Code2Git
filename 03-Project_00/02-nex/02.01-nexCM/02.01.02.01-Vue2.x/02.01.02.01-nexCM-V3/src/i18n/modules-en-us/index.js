/**
 * Modular Internationalization Configuration - English Total Aggregation Entry
 * Aggregates all business module internationalization fields (English)
 * Note: No fallback solution, missing fields directly display the key
 *
 * Module Structure:
 * - common: Common module (action, status, message, validation, error, table)
 * - layout: Layout module (login, navbar, sidebar, tagsview, profile, error-page, quickMenu, home)
 * - system: System settings module (user, role, dept, menu, dict, config, audit, notification, device, permission, errorLog)
 * - superPanel: Super panel module (user, role, dept, menu-config, i18n, config, database, license, projectConfig, dict, feature)
 * - device: Device management module (part, alarm, device, template)
 * - production: Production management module (order, recipe)
 * - heartbeat: Heartbeat monitoring module
 * - notification: Notification management module
 */
import common from './common/index.js'
import layout from './layout/index.js'
import system from './system/index.js'
import superPanel from './super-panel/index.js'
import device from './device/index.js'
import production from './production/index.js'
import heartbeat from './heartbeat/index.js'
import notification from './notification/index.js'

export default {
  // Common module
  common,
  // Layout module
  layout,
  // System settings module
  system,
  // Super panel module
  superPanel,
  // Device management module
  device,
  // Production management module
  production,
  // Heartbeat monitoring module
  heartbeat,
  // Notification management module
  notification
}
