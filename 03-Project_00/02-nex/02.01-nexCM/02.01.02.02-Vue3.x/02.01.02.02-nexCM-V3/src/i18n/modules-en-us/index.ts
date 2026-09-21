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
import common from './common/index'
import layout from './layout/index'
import system from './system/index'
import superPanel from './super-panel/index'
import device from './device/index'
import production from './production/index'
import heartbeat from './heartbeat/index'
import notification from './notification/index'

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
