/**
 * Super Panel Module - Feature Configuration Internationalization Fields (English)
 * Note: No fallback solution, missing fields directly display the key
 * Structure: page static text; category dynamic names; notification/email/audit/auth/system feature names & descriptions (referenced dynamically via DB feature_name/description)
 */
export default {
  // [Submodule] Page
  page: {
    // [Label] Default value
    defaultValue: 'Default',
    // [Label] Items
    items: 'Items',
    // [Status] Modified
    modified: 'Modified',
    // [Tip] No data
    noData: 'No feature configuration',
    // [Page] Page description
    pageDesc: 'Manage system feature switches and configuration',
    // [Action] Reset
    reset: 'Reset',
    // [Action] Reset all
    resetAll: 'Reset All',
    // [Confirm] Reset all confirm
    resetAllConfirm: 'Are you sure you want to reset all feature configurations?',
    // [Action] Reset category
    resetCategory: 'Reset Category',
    // [Confirm] Reset category confirm
    resetCategoryConfirm: 'Are you sure you want to reset the feature configurations of this category?',
    // [Confirm] Reset confirm
    resetConfirm: 'Are you sure you want to reset this feature configuration?',
    // [Message] Reset success
    resetSuccess: 'Reset successfully',
    // [Page] Title
    title: 'Feature Configuration',
    // [Message] Update success
    updateSuccess: 'Updated successfully'
  },

  // [Submodule] Feature categories (dynamic superPanel.feature.category.{category})
  category: {
    // [Category] Audit
    audit: 'Audit',
    // [Category] Authentication
    auth: 'Authentication',
    // [Category] Email
    email: 'Email',
    // [Category] Notification
    notification: 'Notification',
    // [Category] System
    system: 'System'
  },

  // [Submodule] Notification features
  notification: {
    // [Group] Config change notifications
    config: {
      connectionUpdate: 'Connection Config Change Notification',
      connectionUpdateDesc: 'Notify relevant personnel when connection config changes',
      deviceParamsUpdate: 'Device Parameter Config Change Notification',
      deviceParamsUpdateDesc: 'Notify when device parameter config changes',
      exportUpdate: 'Export Config Change Notification',
      exportUpdateDesc: 'Notify admin when export config changes',
      plcConnectionUpdate: 'PLC Connection Config Change Notification',
      plcConnectionUpdateDesc: 'Notify when PLC connection config changes',
      securityUpdate: 'Security Config Change Notification',
      securityUpdateDesc: 'Notify admin when security config changes',
      systemUpdate: 'System Config Change Notification',
      systemUpdateDesc: 'Notify admin when system config changes'
    },
    // [Group] Device notifications
    device: {
      maintenanceReminder: 'Device Maintenance Reminder',
      maintenanceReminderDesc: 'Send reminder when device needs maintenance',
      paramChange: 'Device Parameter Change Notification',
      paramChangeDesc: 'Notify relevant personnel when device parameters change',
      partLifeWarning: 'Part Life Warning Notification',
      partLifeWarningDesc: 'Send warning when part life reaches threshold'
    },
    // [Group] Production notifications
    production: {
      batchComplete: 'Batch Complete Notification',
      batchCompleteDesc: 'Notify relevant personnel when production batch completes',
      orderComplete: 'Production Order Complete Notification',
      orderCompleteDesc: 'Notify relevant personnel when production order completes',
      orderCreate: 'Production Order Create Notification',
      orderCreateDesc: 'Notify relevant personnel when production order is created',
      orderUpdate: 'Production Order Update Notification',
      orderUpdateDesc: 'Notify relevant personnel when production order changes'
    },
    // [Group] Security audit notifications
    security: {
      dataDelete: 'Data Delete Operation Notification',
      dataDeleteDesc: 'Notify admin when data is deleted',
      dataExport: 'Sensitive Data Export Notification',
      dataExportDesc: 'Notify admin when sensitive data is exported',
      logExport: 'Audit Log Export Notification',
      logExportDesc: 'Notify admin when audit log is exported',
      logView: 'Audit Log View Notification',
      logViewDesc: 'Notify admin when audit log is viewed',
      permissionChange: 'Permission Config Change Notification',
      permissionChangeDesc: 'Notify admin when permission config changes'
    },
    // [Group] System notifications
    system: {
      backupFailed: 'Data Backup Failed Notification',
      backupFailedDesc: 'Send notification when data backup fails',
      backupSuccess: 'Data Backup Success Notification',
      backupSuccessDesc: 'Send notification when data backup succeeds',
      expired: 'License Expired Notification',
      expiredDesc: 'Send notification when license has expired',
      expiring: 'License Expiring Notification',
      expiringDesc: 'Send reminder when license is about to expire'
    },
    // [Group] User notifications
    user: {
      create: 'Admin Created User Notification',
      createDesc: 'Notify relevant personnel when admin creates a user',
      loginFailed: 'User Login Failed Notification',
      loginFailedDesc: 'Notify admin after multiple failed login attempts',
      passwordReset: 'User Password Reset Notification',
      passwordResetDesc: 'Notify admin when user password is reset',
      register: 'New User Registration Notification',
      registerDesc: 'Notify admin when new user registers',
      roleChange: 'User Role/Permission Change Notification',
      roleChangeDesc: 'Notify when user role or permission changes',
      statusChange: 'User Status Change Notification',
      statusChangeDesc: 'Notify when user enable/disable status changes',
      update: 'User Info Update Notification',
      updateDesc: 'Notify admin when user info changes'
    }
  },

  // [Submodule] Email features
  email: {
    // [Group] Device emails
    device: {
      alarm: 'Device Alarm Email',
      alarmDesc: 'Send email notification when device alarms'
    },
    // [Group] Notification forward emails
    notification: {
      forward: 'Notification Forward Email',
      forwardDesc: 'Forward system notifications to user email'
    },
    // [Group] User emails
    user: {
      forgotPasswordCode: 'Forgot Password Verification Code Email',
      forgotPasswordCodeDesc: 'Send verification code to email when user requests password reset',
      passwordReset: 'Admin Reset Password Email',
      passwordResetDesc: 'Send new password to user email after admin resets password',
      resetSuccess: 'Password Reset Success Notification Email',
      resetSuccessDesc: 'Send notification email after password reset succeeds'
    }
  },

  // [Submodule] Audit features
  audit: {
    audit: 'Audit Self Audit',
    auditDesc: 'Record audit view, verify, export operations',
    config: 'System Config Audit',
    configDesc: 'Record system, security, PLC, export, connection, device, order config changes',
    data: 'Data Management Audit',
    dataDesc: 'Record data export, data detail view operations',
    device: 'Device Management Audit',
    deviceDesc: 'Record device status, parameter changes, part life, alarm handling',
    email: 'Email Config Audit',
    emailDesc: 'Record email config changes, email log delete operations',
    license: 'License Management Audit',
    licenseDesc: 'Record license import, license expiration operations',
    permission: 'Permission Management Audit',
    permissionDesc: 'Record role CRUD, permission config changes',
    plc: 'PLC Operation Audit',
    plcDesc: 'Record PLC read/write, connect, disconnect, reconnect operations',
    production: 'Production Management Audit',
    productionDesc: 'Record recipe download, order CRUD, order download operations',
    user: 'User Management Audit',
    userDesc: 'Record user login, registration, CRUD, password reset operations'
  },

  // [Submodule] Authentication features
  auth: {
    firstLoginChangePassword: 'First Login Force Password Change',
    firstLoginChangePasswordDesc: 'Whether password must be changed on first login',
    forgotPassword: 'Forgot Password Feature',
    forgotPasswordDesc: 'Whether to allow password reset via email verification code',
    loginFailedLock: 'Login Failed Lock',
    loginFailedLockDesc: 'Whether to lock account after consecutive failed logins',
    register: 'Registration Feature',
    registerDesc: 'Whether to allow users to self-register accounts'
  },

  // [Submodule] System features
  system: {
    auditMaster: 'Audit Module Master Switch',
    auditMasterDesc: 'All audits disabled when turned off',
    auditVerify: 'Audit Verification Feature',
    auditVerifyDesc: 'Whether audit logs need verification',
    dataExportMaster: 'Data Export Master Switch',
    dataExportMasterDesc: 'All export functions disabled when turned off',
    emailMaster: 'Email System Master Switch',
    emailMasterDesc: 'All emails disabled when turned off',
    maintenanceTaskMaster: 'Scheduled Task Master Switch',
    maintenanceTaskMasterDesc: 'All scheduled tasks stopped when turned off',
    notificationMaster: 'Notification Master Switch',
    notificationMasterDesc: 'All notifications disabled when turned off',
    onlineDeviceLimit: 'Online Device Limit',
    onlineDeviceLimitDesc: 'Whether to limit online devices per user',
    watermark: 'Page Watermark',
    watermarkDesc: 'Whether to display page watermark'
  }
}
