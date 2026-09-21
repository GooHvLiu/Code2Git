/**
 * Notification Module - Message templates grouped by event (English)
 * Source: backend src/config/notificationRules.config.js and sendNotification titleKey/contentKey
 * Render: $t(titleKey, params) / $t(contentKey, params), {xxx} are dynamic params
 * Note: No fallback, missing fields display the key; zh/en structure must match exactly
 */
export default {
  audit: {
    logExport: {
      content: 'User {username} exported audit logs',
      title: 'Audit Log Exported',
    },
    logView: {
      content: 'User {username} viewed audit logs',
      title: 'Audit Log Viewed',
    },
  },
  config: {
    connectionUpdate: {
      content: 'Connection configuration has been modified by {username}',
      title: 'Connection Configuration Changed',
    },
    deviceParamsUpdate: {
      content: 'Device parameter configuration has been modified by {username}',
      title: 'Device Parameter Configuration Changed',
    },
    exportUpdate: {
      content: 'Export configuration has been modified by {username}',
      title: 'Export Configuration Changed',
    },
    plcConnectionUpdate: {
      content: 'PLC connection configuration has been modified by {username}',
      title: 'PLC Connection Configuration Changed',
    },
    securityUpdate: {
      content: 'Security configuration has been modified by {username}',
      title: 'Security Configuration Changed',
    },
    systemUpdate: {
      content: 'System configuration has been modified by {username}',
      title: 'System Configuration Changed',
    },
  },
  data: {
    delete: {
      content: 'User {username} deleted data',
      title: 'Data Deletion Operation',
    },
    export: {
      content: 'User {username} exported sensitive data',
      title: 'Sensitive Data Exported',
    },
  },
  device: {
    maintenanceReminder: {
      content: 'Device {deviceName} is about to reach maintenance time, please arrange maintenance in time',
      title: 'Device Maintenance Reminder',
    },
    paramChange: {
      content: 'Device parameter {tag} has been modified by {operator}',
      title: 'Device Parameter Changed',
    },
    partLifeWarning: {
      content: 'Part {partName} service life is about to expire, please replace it in time',
      title: 'Part Life Warning',
    },
    kickedAdmin: {
      content: 'Administrator {operator} kicked device {deviceName} of user {userId} offline at {time}',
      title: 'Device Kicked Offline (Admin Notification)',
    },
    kicked: {
      content: 'Your device {deviceName} was kicked offline by administrator {operator} at {time}',
      title: 'Device Kicked Offline',
    },
  },
  security: {
    kickedOut: {
      content: 'Your account was logged in on device with IP {ip} at {time}, current device has been kicked offline',
      title: 'Account Kicked Offline',
    },
  },
  license: {
    expired: {
      content: 'System license has expired, some features are restricted',
      title: 'License Expired',
    },
    expiring: {
      content: 'System license will expire within 30 days, please renew in time',
      title: 'License Expiring Soon',
    },
  },
  permission: {
    change: {
      content: 'Role {roleName} permission configuration has been modified by {operator}',
      title: 'Permission Configuration Changed',
    },
  },
  production: {
    batchComplete: {
      content: 'Batch {batchNo} has completed production',
      title: 'Batch Completed',
    },
    orderComplete: {
      content: 'Production order {orderNo} has been completed',
      title: 'Production Order Completed',
    },
    orderCreate: {
      content: 'Production order {orderNo} has been created',
      title: 'Production Order Created',
    },
    orderUpdate: {
      content: 'Production order {orderNo} has been updated',
      title: 'Production Order Updated',
    },
  },
  system: {
    backupFailed: {
      content: 'System data backup failed, please check backup configuration',
      title: 'Data Backup Failed',
    },
    backupSuccess: {
      content: 'System data backup completed successfully',
      title: 'Data Backup Successful',
    },
  },
  user: {
    create: {
      content: 'Administrator created user {username}',
      title: 'User Created',
    },
    loginFailed: {
      content: 'User {username} failed to login {count} times consecutively, please pay attention',
      title: 'User Login Failed',
    },
    passwordReset: {
      content: 'User {username} password has been reset',
      title: 'Password Reset',
    },
    register: {
      content: 'User {username} has registered successfully',
      title: 'New User Registered',
    },
    roleChange: {
      content: 'User {username} role has been changed to {role}',
      title: 'User Role Changed',
    },
    statusChange: {
      content: 'User {username} status has been changed to {status}',
      title: 'User Status Changed',
    },
    update: {
      content: 'User {username} information has been updated',
      title: 'User Information Updated',
    },
  },
}
