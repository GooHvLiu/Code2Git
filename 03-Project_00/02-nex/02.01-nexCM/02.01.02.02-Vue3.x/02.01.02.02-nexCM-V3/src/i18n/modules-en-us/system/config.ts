/**
 * System Settings Module - Parameter Configuration Internationalization Fields
 * Big company standard: config files use nested object structure, frontend code uniformly uses dot-notation nested keys
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // [General] Page description
  desc: 'Manage system parameter configuration',
  // [Action] Reset
  reset: 'Reset',
  // [Action] Save
  save: 'Save',
  // [Message] Load failed: abnormal data
  loadDataAbnormal: 'Failed to load configuration: abnormal backend data, please refresh and retry',
  // [Message] Load failed: network error
  loadNetworkError: 'Failed to load configuration: check the network connection or contact administrator',
  // [Status] Loading
  statusLoading: 'Loading configuration, please wait...',
  // [Status] Incomplete
  statusIncomplete: 'Configuration is incomplete with uninitialized items and cannot be saved, please contact administrator',
  // [Status] Load error, cannot save
  statusLoadError: 'Failed to load configuration, cannot save, please refresh and retry',
  // [Status] Abnormal status
  statusAbnormal: 'Abnormal configuration status, cannot save',
  // [Message] Missing items (count/items)
  missingItems: '{count} item(s) are not configured and cannot be saved: {items}',
  // [Message] Save failed, retry
  saveFailedRetry: 'Failed to save, please retry',
  // [Message] Save failed, network
  saveFailedNetwork: 'Failed to save, please check the network connection',
  // [Message] Reset not allowed
  resetNotAllowed: 'Reset is not allowed in the current status, please refresh and retry',
  // [Message] Missing after reset (count)
  resetMissingItems: '{count} unconfigured item(s) detected after reset, please contact administrator',
  // [Message] Reset failed, retry
  resetFailedRetry: 'Failed to reset, please retry',
  // [Message] Reset failed, network
  resetFailedNetwork: 'Failed to reset, please check the network connection',

  // ==================== System Configuration ====================
  system: {
    // [Label] System config title
    title: 'Sys-Config',
    // [Label] Date format
    dateFormat: 'Date Format',
    // [Tip] Date format tip
    dateFormatTip: 'Format for system date display',
    // [Label] Default language
    defaultLanguage: 'Default Language',
    // [Tip] Default language tip
    defaultLanguageTip: 'Default language used by the system',
    // [Label] Default page size
    defaultPageSize: 'Default Page Size',
    // [Tip] Default page size tip
    defaultPageSizeTip: 'Default number of records per page in lists',
    // [Label] Minutes
    minutes: 'Minutes',
    // [Label] Session timeout
    sessionTimeout: 'Session Timeout',
    // [Tip] Session timeout tip
    sessionTimeoutTip: 'Time for session to automatically timeout after user inactivity'
  },

  // ==================== Device Configuration ====================
  device: {
    // [Label] Device config title
    title: 'Dev-Config',
    // [Label] Device code
    deviceCode: 'Device Code',
    // [Tip] Device code tip
    deviceCodeTip: 'Unique identifier of the device',
    // [Label] Device install date
    deviceInstallDate: 'Install Date',
    // [Tip] Device install date tip
    deviceInstallDateTip: 'Installation date of the device',
    // [Label] Device name
    deviceName: 'Device Name',
    // [Tip] Device name tip
    deviceNameTip: 'Display name of the device',
    // [Label] Device region
    deviceRegion: 'Device Region',
    // [Tip] Device region tip
    deviceRegionTip: 'Region where the device is located',
    // [Label] Part life remind interval
    partLifeRemindInterval: 'Reminder Interval',
    // [Tip] Part life remind interval tip
    partLifeRemindIntervalTip: 'Time interval for part life reminders',
    // [Label] Part life reminder enabled
    partLifeReminderEnabled: 'Reminder Enabled',
    // [Tip] Part life reminder enabled tip
    partLifeReminderEnabledTip: 'Enable part life reminder feature',
    // [Label] Part life settings title
    partLifeSettingsTitle: 'Part Life Settings',
    // [Label] Part life threshold
    partLifeThreshold: 'Threshold',
    // [Tip] Part life threshold tip
    partLifeThresholdTip: 'Threshold for part life reminders',
    // [Label] Interval - day
    intervalDay: 'Day',
    // [Label] Interval - hour
    intervalHour: 'Hour',
    // [Label] Interval - shift
    intervalShift: 'Shift',
    // [Label] Snooze interval
    snoozeInterval: 'Snooze Interval',
    // [Tip] Snooze interval tip
    snoozeIntervalTip: 'Time interval for snooze reminders',
    // [Label] Snooze 5 min
    snooze5min: '5 min',
    // [Label] Snooze 10 min
    snooze10min: '10 min',
    // [Label] Snooze 30 min
    snooze30min: '30 min',
    // [Label] Snooze 1 hour
    snooze1hour: '1 hour',
    // [Label] Snooze 2 hour
    snooze2hour: '2 hour',
    // [Tip] Reminder content
    reminderContent: 'Reminder Content',
    // [Tip] Reminder no data
    reminderNoData: 'No reminders',
    // [Action] Remind later
    reminderRemindLater: 'Remind Later',
    // [Title] Reminder title
    reminderTitle: 'Device Reminder',
    // [Action] View detail
    reminderViewDetail: 'View Details'
  },

  // ==================== Email Log ====================
  emailLog: {
    // [Label] Email log title
    title: 'Email Logs',
    // [Action] Batch delete
    batchDelete: 'Batch Delete',
    // [Confirm] Batch delete confirm
    batchDeleteConfirm: 'Are you sure you want to delete selected email logs?',
    // [Message] Batch delete success
    batchDeleteSuccess: 'Batch deleted successfully',
    // [Label] Cc
    cc: 'Cc',
    // [Action] Close
    close: 'Close',
    // [Action] Delete
    delete: 'Delete',
    // [Confirm] Delete confirm
    deleteConfirm: 'Are you sure you want to delete this email log?',
    // [Message] Delete success
    deleteSuccess: 'Deleted successfully',
    // [Message] Load failed
    loadFailed: 'Failed to load email logs',
    // [Label] Status
    status: 'Status',
    // [Status] Success
    statusSuccess: 'Success',
    // [Status] Failed
    statusFailed: 'Failed',
    // [Status] Sending
    statusSending: 'Sending',
    // [Label] Subject
    subject: 'Subject',
    // [Title] View detail
    viewDetail: 'View Details',
    // [Label] Error message
    errorMsg: 'Error Message',
    // [Label] Retry count
    retryCount: 'Retry Count',
    // [Label] Send time
    sendTime: 'Send Time',
    // [Label] Config name
    configName: 'Config Name',
    // [Label] Config filter
    configFilter: 'Config Filter',
    // [Label] Status filter
    statusFilter: 'Status Filter',
    // [Label] Delete title
    deleteTitle: 'Delete Email Log',
    // [Message] Detail failed
    detailFailed: 'Failed to load details',
    // [Label] Detail title
    detailTitle: 'Email Details',
    // [Label] Duration
    duration: 'Duration',
    // [Label] Email content
    emailContent: 'Email Content',
    // [Label] IP
    ip: 'IP',
    // [Label] Log ID
    logId: 'Log ID',
    // [Label] Operations
    operations: 'Operations',
    // [Label] Recipient
    recipient: 'Recipient',
    // [Action] Refresh
    refreshBtn: 'Refresh',
    // [Placeholder] Search placeholder
    searchPlaceholder: 'Search email subject or content',
    // [Label] Template
    template: 'Template'
  },

  // ==================== Export Configuration ====================
  export: {
    // [Label] Export config title
    title: 'Exp-Config',
    // [Label] PDF watermark enabled
    pdfWatermarkEnabled: 'PDF Watermark',
    // [Tip] PDF watermark enabled tip
    pdfWatermarkEnabledTip: 'Exported PDF files will include watermark when enabled',
    // [Placeholder] PDF watermark placeholder
    pdfWatermarkPlaceholder: 'Enter watermark text',
    // [Label] PDF watermark text
    pdfWatermarkText: 'Watermark Text',
    // [Tip] PDF watermark text tip
    pdfWatermarkTextTip: 'Watermark text displayed in PDF files'
  },

  // ==================== License Settings ====================
  licenseSetting: {
    // [Label] License settings title
    title: 'Lic-Config',
    // [Label] Check interval
    checkInterval: 'Check Interval',
    // [Tip] Check interval tip
    checkIntervalTip: 'Time interval for system to check license status',
    // [Label] Expiring days
    expiringDays: 'Reminder Days',
    // [Tip] Expiring days tip
    expiringDaysTip: 'Number of days before license expiration to start reminder',
    // [Label] Grace period
    gracePeriod: 'Grace Period',
    // [Tip] Grace period tip
    gracePeriodTip: 'Number of days allowed to continue use after license expiration',
    // [Label] Unit - day
    unitDay: 'Day',
    // [Label] Unit - hour
    unitHour: 'Hour'
  },

  // ==================== Notification Configuration ====================
  notification: {
    // [Label] Notification config title
    title: 'Ntf-Config',
    // [Label] Auto read days
    autoReadDays: 'Auto Read Days',
    // [Tip] Auto read days tip
    autoReadDaysTip: 'Notifications will be automatically marked as read after specified days',
    // [Label] Sound enabled
    soundEnabled: 'Sound Notification',
    // [Tip] Sound enabled tip
    soundEnabledTip: 'Play notification sound when receiving new notification',
    // [Label] Unit - day
    unitDay: 'Day'
  },

  // ==================== Order Configuration ====================
  order: {
    // [Label] Order config title
    title: 'Ord-Config',
    // [Label] Allow no order production
    allowNoOrderProduction: 'No-Order',
    // [Tip] Allow no order production tip
    allowNoOrderProductionTip: 'Allow production without an order when enabled',
    // [Label] Allow running order download
    allowRunningOrderDownload: 'Running Order',
    // [Tip] Allow running order download tip
    allowRunningOrderDownloadTip: 'Allow downloading data of running orders when enabled',
    // [Label] Auto archive completed
    autoArchiveCompleted: 'Auto Archive',
    // [Tip] Auto archive completed tip
    autoArchiveCompletedTip: 'Automatically archive orders after completion',
    // [Label] No order production highlight
    noOrderProductionHighlight: 'No-Order Highlight',
    // [Tip] No order production highlight tip
    noOrderProductionHighlightTip: 'Highlight when producing without order',
    // [Label] Order switch confirm
    orderSwitchConfirm: 'Switch Confirmation',
    // [Tip] Order switch confirm tip
    orderSwitchConfirmTip: 'Confirmation required when switching orders',
    // [Label] Production control
    productionControl: 'Production Control',
    // [Label] Order report config
    reportConfig: 'Order Report Configuration',
    // [Label] Report include alarm detail
    reportIncludeAlarmDetail: 'Alarm Details',
    // [Tip] Report include alarm detail tip
    reportIncludeAlarmDetailTip: 'Include alarm details in order report',
    // [Label] Report include download count
    reportIncludeDownloadCount: 'Download Count',
    // [Tip] Report include download count tip
    reportIncludeDownloadCountTip: 'Include download count in order report',
    // [Label] Report include operator detail
    reportIncludeOperatorDetail: 'Operator Details',
    // [Tip] Report include operator detail tip
    reportIncludeOperatorDetailTip: 'Include operator details in order report',
    // [Label] Show alarm count
    showAlarmCount: 'Show Alarm Count',
    // [Tip] Show alarm count tip
    showAlarmCountTip: 'Show alarm count in order list',
    // [Label] Show operator name
    showOperatorName: 'Show Operator Name',
    // [Tip] Show operator name tip
    showOperatorNameTip: 'Show operator name in order list',
    // [Label] Show runtime
    showRuntime: 'Show Runtime',
    // [Tip] Show runtime tip
    showRuntimeTip: 'Show runtime in order list',
    // [Label] Stat display
    statDisplay: 'Statistics Display'
  },

  // ==================== Security Configuration ====================
  security: {
    // [Label] Security config title
    title: 'Sec-Config',
    // [Label] Lock duration minutes
    lockDurationMinutes: 'Lock Duration',
    // [Tip] Lock duration tip
    lockDurationMinutesTip: 'Duration of account lock after failed login',
    // [Label] Login failed threshold
    loginFailedThreshold: 'Login Failed',
    // [Tip] Login failed threshold tip
    loginFailedThresholdTip: 'Account will be locked after consecutive failed logins reach this value',
    // [Label] Watermark enabled
    watermarkEnabled: 'Enable Watermark',
    // [Placeholder] Watermark placeholder
    watermarkPlaceholder: 'Enter watermark text',
    // [Label] Watermark text
    watermarkText: 'Watermark Text',
    // [Tip] Watermark text tip
    watermarkTextTip: 'Watermark text displayed on the page'
  },

  // ==================== Super Panel License ====================
  superPanelLicense: {
    // [Title] Manage title
    manageTitle: 'Lic-Config',
    // [Label] All features
    allFeatures: 'All Features',
    // [Label] Bound machine ID
    boundMachineId: 'Bound Machine ID',
    // [Action] Cancel
    cancel: 'Cancel',
    // [Action] Confirm import
    confirmImport: 'Confirm Import',
    // [Label] Contact
    contact: 'Contact',
    // [Label] Customer name
    customerName: 'Customer Name',
    // [Label] Current machine ID
    currentMachineId: 'Current Machine ID',
    // [Label] Detail title
    detailTitle: 'License Details',
    // [Action] Download
    download: 'Download',
    // [Label] Drag upload
    dragUpload: 'Drag license file here',
    // [Label] Email
    email: 'Email',
    // [Label] Enabled
    enabled: 'Enabled',
    // [Label] Expire time
    expireTime: 'Expire Time',
    // [Label] Features
    features: 'Features',
    // [Label] File info
    fileInfo: 'File Info',
    // [Label] File name
    fileName: 'File Name',
    // [Label] File path
    filePath: 'File Path',
    // [Label] File size
    fileSize: 'File Size',
    // [Title] Import dialog title
    importDialogTitle: 'Import License File',
    // [Action] Import license
    importLicense: 'Import License',
    // [Tip] Import tip
    importTip: 'Upload license file to activate system',
    // [Label] Issued at
    issuedAt: 'Issued At',
    // [Label] Last modified
    lastModified: 'Last Modified',
    // [Label] Last verified
    lastVerified: 'Last Verified',
    // [Label] License ID
    licenseId: 'License ID',
    // [Label] License type
    licenseType: 'License Type',
    // [Label] Machine bind
    machineBind: 'Machine Binding',
    // [Label] Match status
    matchStatus: 'Match Status',
    // [Label] Matched
    matched: 'Matched',
    // [Label] Max devices
    maxDevices: 'Max Devices',
    // [Label] Max users
    maxUsers: 'Max Users',
    // [Label] Network diagnosis
    networkDiagnosis: 'Network Diagnosis',
    // [Label] No license file
    noLicenseFile: 'No License File',
    // [Label] Not bound any
    notBoundAny: 'Not Bound to Any Machine',
    // [Label] Not initialized
    notInitialized: 'Not Initialized',
    // [Label] Not matched
    notMatched: 'Not Matched',
    // [Label] Operation
    operation: 'Operation',
    // [Label] Phone
    phone: 'Phone',
    // [Label] Project ID
    projectId: 'Project ID',
    // [Label] Project name
    projectName: 'Project Name',
    // [Action] Refresh
    refresh: 'Refresh',
    // [Label] Remaining
    remaining: 'Remaining Time',
    // [Label] Server time
    serverTime: 'Server Time',
    // [Label] Status - invalid
    statusInvalid: 'Invalid',
    // [Label] Status - valid
    statusValid: 'Valid',
    // [Label] Time guard
    timeGuard: 'Time Guard',
    // [Label] Time guard status
    timeGuardStatus: 'Time Guard Status',
    // [Label] Unlimited
    unlimited: 'Unlimited',

    // ==================== License Manager Submodule ====================
    licenseManager: {
      // [Title] Brand title
      brandTitle: 'License Activation',
      // [Description] Brand desc
      brandDesc: 'Import a valid license bound to this server to activate all features of the system.',
      // [Label] Cannot get status
      cannotGetStatus: 'Cannot Get Status',
      // [Action] Copy
      copy: 'Copy',
      // [Message] Copy failed
      copyFailed: 'Copy Failed',
      // [Message] Copy success
      copySuccess: 'Copied Successfully',
      // [Label] Current machine ID
      currentMachineId: 'Current Machine ID',
      // [Tip] Drag upload tip
      dragUploadTip: 'Drag license file here',
      // [Action] Enter system
      enterSystem: 'Enter System',
      // [Label] Expire time
      expireTime: 'Expire Time',
      // [Label] Feature - machine bind
      featureMachineBind: 'Machine Binding',
      // [Label] Feature - RSA
      featureRsa: 'RSA Encryption',
      // [Label] Feature - time guard
      featureTimeGuard: 'Time Guard',
      // [Tip] File size tip
      fileSizeTip: 'Only .lic license files are supported',
      // [Title] Import form title
      importFormTitle: 'Import License File',
      // [Action] Import license
      importLicense: 'Import License',
      // [Message] Import success
      importSuccess: 'Imported Successfully',
      // [Title] Import success title
      importSuccessTitle: 'License Imported Successfully',
      // [Tip] Machine ID tip
      machineIdTip:
        'Provide this machine ID when requesting a license. It is hardware-bound and may become invalid after hardware changes.',
      // [Label] Permanent valid
      permanentValid: 'Permanent Valid',
      // [Tip] Please select file
      pleaseSelectFile: 'Please Select File',
      // [Label] Reason - expired
      reasonExpired: 'License Expired',
      // [Label] Reason - file not found
      reasonFileNotFound: 'License File Not Found',
      // [Label] Reason - machine mismatch
      reasonMachineMismatch: 'Machine Mismatch',
      // [Label] Reason - missing features
      reasonMissingFeatures: 'Missing Feature Authorization',
      // [Label] Reason - network sync failed
      reasonNetworkSyncFailed: 'Network Sync Failed',
      // [Label] Reason - project mismatch
      reasonProjectMismatch: 'Project Mismatch',
      // [Label] Reason - time rollback
      reasonTimeRollback: 'Time Rollback',
      // [Label] Reason - unknown
      reasonUnknown: 'Unknown Reason',
      // [Action] Refresh status
      refreshStatus: 'Refresh Status',
      // [Action] Remove
      remove: 'Remove',
      // [Label] Status - invalid
      statusInvalid: 'Invalid',
      // [Label] Status - valid
      statusValid: 'Valid',
      // [Label] Type - enterprise
      typeEnterprise: 'Enterprise',
      // [Label] Type - perpetual
      typePerpetual: 'Perpetual',
      // [Label] Type - standard
      typeStandard: 'Standard',
      // [Label] Type - trial
      typeTrial: 'Trial',
      // [Label] Unlimited
      unlimited: 'Unlimited'
    }
  },

  // ==================== Children Menu ====================
  childrenMenu: {
    // [Label] Title
    title: 'Children Menu'
  }
}
