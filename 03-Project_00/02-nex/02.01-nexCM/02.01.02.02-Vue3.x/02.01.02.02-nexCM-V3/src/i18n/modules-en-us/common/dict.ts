/**
 * Common module - built-in data dictionary enum i18n
 * Big-tech standard: cross-module enum dictionaries live under common as the single source of truth
 * Source: 7 built-in dictionaries in nex_dict_type / nex_dict_item (dict util resolves by code+value)
 * Note: no fallback; a missing key renders the key itself. ZH/EN structures must match exactly.
 */
export default {
  // ==================== Built-in dictionary type names ====================
  types: {
    user_status: 'User Status',
    user_sex: 'Gender',
    user_role: 'User Role',
    audit_action: 'Audit Action Type',
    audit_result: 'Audit Result',
    notification_type: 'Notification Type',
    notification_priority: 'Notification Priority'
  },

  // ==================== Built-in dictionary item values (key = DB item.value) ====================
  items: {
    user_status: {
      1: 'Active',
      0: 'Disabled'
    },
    user_sex: {
      0: 'Unknown',
      1: 'Male',
      2: 'Female'
    },
    user_role: {
      administrator: 'Administrator',
      engineer: 'Engineer',
      operator: 'Operator'
    },
    audit_action: {
      USER_LOGIN: 'User Login',
      USER_REGISTER: 'User Register',
      USER_CREATE: 'Create User',
      USER_UPDATE: 'Update User',
      USER_DELETE: 'Delete User',
      PLC_WRITE: 'PLC Parameter Write',
      SYSTEM_EXPORT: 'Data Export',
      USER_LOGIN_FAILED: 'User Login Failed',
      USER_LOGOUT: 'User Logout',
      USER_BATCH_DELETE: 'Batch Delete User',
      USER_STATUS_CHANGE: 'User Status Change',
      USER_RESET_PASSWORD: 'Reset Password',
      PLC_READ: 'PLC Parameter Read',
      PLC_CONNECT: 'PLC Connect',
      PLC_DISCONNECT: 'PLC Disconnect',
      PLC_RECONNECT: 'PLC Reconnect',
      SYSTEM_CONFIG_CHANGE: 'System Config Change',
      SYSTEM_IMPORT: 'Data Import',
      AUDIT_VERIFY: 'Audit Hash Chain Verification'
    },
    audit_result: {
      success: 'Success',
      failed: 'Failed'
    },
    notification_type: {
      system: 'System Notification',
      plc: 'PLC Alarm',
      user: 'User Related',
      audit: 'Audit Related'
    },
    notification_priority: {
      normal: 'Normal',
      high: 'High',
      critical: 'Critical'
    }
  }
}
