/**
 * Super Panel Module - Parameter Configuration Internationalization Fields
 * Big company standard: unified nested object structure, grouped by functional area
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // ==================== Page Common ====================
  page: {
    // [Page] Title
    title: 'Parameter Configuration',
    // [Page] Page description
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
    loadingText: 'Loading configuration, please wait...',
    loadFailedTitle: 'Failed to load configuration',
    loadFailedDesc: 'Please check the network connection or contact the administrator',
    reload: 'Reload',
    incompleteTitle: 'Incomplete configuration',
    incompleteDesc: 'Detected {count} uninitialized configuration item(s). Editing and saving are disabled on this page.',
    missingKeysTitle: 'Missing configuration items:',
    incompleteTip: 'Please ask the administrator to run the configuration initialization SQL, or click the button below to reload.',
    incompleteWarning: 'Detected {count} unconfigured item(s), please ask the administrator to initialize the configuration'
  },

  // ==================== Audit Configuration ====================
  audit: {
    // [Label] Audit config title
    title: 'Audit-Conf',
    // [Label] Auto archive
    autoArchive: 'Auto Archive',
    // [Tip] Auto archive tip
    autoArchiveTip: 'When enabled, audit logs older than the retention period will be automatically archived',
    // [Label] Retention days
    retentionDays: 'Retention',
    // [Tip] Retention days tip
    retentionDaysTip: 'Number of days to retain audit logs in the system before archiving',
    unitDays: 'days'
  },

  // ==================== Connection Configuration ====================
  connection: {
    // [Label] Connection config title
    title: 'Conn-Conf',
    // [Label] Device offline threshold
    deviceOfflineThreshold: 'Device Offline',
    // [Tip] Device offline threshold tip
    deviceOfflineThresholdTip: 'Device is considered offline if no heartbeat is received within this time',
    // [Label] Device status check interval
    deviceStatusCheckInterval: 'Device Status',
    // [Tip] Device status check interval tip
    deviceStatusCheckIntervalTip: 'Interval for the system to periodically check device status',
    // [Label] Heartbeat interval
    heartbeatInterval: 'Heartbeat Interval',
    // [Tip] Heartbeat interval tip
    heartbeatIntervalTip: 'Interval for devices to send heartbeat packets to the server',
    // [Label] Maintenance check interval
    maintenanceCheckInterval: 'Maintenance',
    // [Tip] Maintenance check interval tip
    maintenanceCheckIntervalTip: 'Interval for the system to perform maintenance checks',
    // [Label] Part life stat interval
    partLifeStatInterval: 'Part Life',
    // [Tip] Part life stat interval tip
    partLifeStatIntervalTip: 'Interval for the system to calculate part service life statistics',
    // [Unit] Hour
    unitHour: 'hour(s)',
    // [Unit] Minute
    unitMinute: 'minute(s)',
    // [Unit] Second
    unitSecond: 'second(s)'
  },

  // ==================== Email Configuration ====================
  email: {
    // [Label] Email config title
    title: 'Email-Config',
    // [Action] Add button
    addBtn: 'Add Config',
    // [Message] Add success
    addSuccess: 'Email configuration added successfully',
    // [Title] Add title
    addTitle: 'Add Email Configuration',
    // [Label] Auth code
    authCode: 'Authorization Code',
    // [Placeholder] Auth code placeholder
    authCodePlaceholder: 'Enter email authorization code',
    // [Placeholder] Auth code placeholder edit
    authCodePlaceholderEdit: 'Leave blank to keep unchanged',
    // [Tip] Auth code required
    authCodeRequired: 'Authorization code cannot be empty',
    // [Tip] Auth code tip
    authCodeTip: 'SMTP service authorization code, not the login password',
    // [Action] Cancel button
    cancelBtn: 'Cancel',
    // [Label] Config name
    configName: 'Config Name',
    // [Placeholder] Config name placeholder
    configNamePlaceholder: 'Enter config name',
    // [Tip] Config name required
    configNameRequired: 'Config name cannot be empty',
    // [Tip] Config name tip
    configNameTip: 'Name to distinguish different email configurations',
    // [Action] Confirm button
    confirmBtn: 'Confirm',
    // [Label] Default config
    default: 'Default Config',
    // [Action] Delete button
    deleteBtn: 'Delete',
    // [Confirm] Delete confirm
    deleteConfirm: 'Are you sure you want to delete this email configuration?',
    // [Message] Delete success
    deleteSuccess: 'Email configuration deleted successfully',
    // [Title] Delete title
    deleteTitle: 'Delete Email Configuration',
    // [Message] Disable success
    disableSuccess: 'Email configuration disabled',
    // [Action] Edit button
    editBtn: 'Edit',
    // [Title] Edit title
    editTitle: 'Edit Email Configuration',
    // [Label] Email account
    emailAccount: 'Email Account',
    // [Tip] Email account required
    emailAccountRequired: 'Email account cannot be empty',
    // [Tip] Email account tip
    emailAccountTip: 'Email address used for sending emails',
    // [Tip] Email format error
    emailFormatError: 'Invalid email format',
    // [Message] Enable success
    enableSuccess: 'Email configuration enabled',
    // [Label] Is default
    isDefault: 'Set as Default',
    // [Tip] Is default tip
    isDefaultTip: 'Default email configuration will be used for system auto-sent emails',
    // [Message] Load failed
    loadFailed: 'Failed to load email configuration',
    // [Label] Operations
    operations: 'Operations',
    // [Label] Provider
    provider: 'Provider',
    // [Tip] Provider required
    providerRequired: 'Provider cannot be empty',
    // [Tip] Provider tip
    providerTip: 'Email service provider, such as QQ Mail, 163 Mail, etc.',
    // [Action] Refresh button
    refreshBtn: 'Refresh',
    // [Label] Remark
    remark: 'Remark',
    // [Tip] Remark tip
    remarkTip: 'Optional remark information',
    // [Action] Save button
    saveBtn: 'Save',
    // [Placeholder] Search placeholder
    searchPlaceholder: 'Search config name or email',
    // [Label] Sender name
    senderName: 'Sender Name',
    // [Placeholder] Sender name placeholder
    senderNamePlaceholder: 'Enter sender name',
    // [Tip] Sender name tip
    senderNameTip: 'Sender name displayed in emails',
    // [Action] Send test button
    sendTestBtn: 'Send Test Email',
    // [Action] Set default button
    setDefaultBtn: 'Set as Default',
    // [Message] Set default success
    setDefaultSuccess: 'Set as default configuration',
    // [Label] SMTP host
    smtpHost: 'SMTP Host',
    // [Tip] SMTP host required
    smtpHostRequired: 'SMTP host cannot be empty',
    // [Tip] SMTP host tip
    smtpHostTip: 'Email SMTP server address',
    // [Label] SMTP port
    smtpPort: 'SMTP Port',
    // [Tip] SMTP port required
    smtpPortRequired: 'SMTP port cannot be empty',
    // [Tip] SMTP port tip
    smtpPortTip: 'Email SMTP server port, usually 465 or 587',
    // [Label] Status
    status: 'Status',
    // [Tip] Status tip
    statusTip: 'Email configuration enable status',
    // [Action] Test button
    testBtn: 'Test',
    // [Label] Test config name
    testConfigName: 'Test Config',
    // [Tip] Test config name tip
    testConfigNameTip: 'Select email configuration for sending test email',
    // [Title] Test email title
    testEmailTitle: 'Send Test Email',
    // [Label] Test receiver
    testReceiver: 'Test Receiver',
    // [Tip] Test receiver required
    testReceiverRequired: 'Test receiver cannot be empty',
    // [Tip] Test receiver tip
    testReceiverTip: 'Email address to receive the test email',
    // [Message] Test send success
    testSendSuccess: 'Test email sent successfully',
    // [Message] Update success
    updateSuccess: 'Email configuration updated successfully',
    // [Label] Use SSL
    useSSL: 'Use SSL',
    // [Tip] Use SSL tip
    useSSLTip: 'When enabled, use SSL encrypted connection to SMTP server'
  },

  // ==================== Language Configuration ====================
  language: {
    // [Label] Language config title
    title: 'Lang-Config',
    // [Description] Language config card desc
    desc: 'Configure the preset languages and master language supported by the system',
    // [Label] Current supported languages
    currentSupportedLangs: 'Currently Supported Languages',
    // [Warning] Empty warning
    emptyWarning: 'No language configuration',
    // [Message] Load failed
    loadFailed: 'Failed to load language configuration',
    // [Message] Save failed
    saveFailed: 'Failed to save language configuration',
    // [Message] Save success
    saveSuccess: 'Language configuration saved successfully',
    // [Tip] Tip content
    tipContent: 'Language configuration for system multi-language support',
    // [Tip] Extra tip
    tipExtra: 'After adding a new language, you need to configure the corresponding translation file',
    // [Tip] Tip title
    tipTitle: 'Language Configuration Guide',
    // [Label] Total languages
    totalLangs: 'Total Languages',
    // [Unit] Total languages unit
    totalLangsUnit: '',
    // [Action] View languages
    viewLanguages: 'View Language List'
  },

  // ==================== PLC Configuration ====================
  plc: {
    // [Label] Enable poll
    enablePoll: 'Enable Polling',
    // [Tip] Enable poll tip
    enablePollTip: 'When enabled, the system will periodically poll PLC device data',
    // [Label] Enable write audit
    enableWriteAudit: 'Enable Write Audit',
    // [Tip] Enable write audit tip
    enableWriteAuditTip: 'When enabled, all write operations to PLC will be recorded',
    // [Label] Host
    host: 'Host Address',
    // [Tip] Host tip
    hostTip: 'IP address or hostname of the PLC device',
    // [Label] Max write retry
    maxWriteRetry: 'Max Write Retries',
    // [Tip] Max write retry tip
    maxWriteRetryTip: 'Maximum number of retries when write fails',
    // [Label] Poll fast
    pollFast: 'Fast Polling Interval',
    // [Tip] Poll fast tip
    pollFastTip: 'Polling interval for critical data',
    // [Label] Poll settings
    pollSettings: 'Polling Settings',
    // [Label] Poll slow
    pollSlow: 'Slow Polling Interval',
    // [Tip] Poll slow tip
    pollSlowTip: 'Polling interval for non-critical data',
    // [Label] Port
    port: 'Port',
    // [Tip] Port tip
    portTip: 'Communication port of the PLC device',
    // [Label] Protocol
    protocol: 'Comm Protocol',
    // [Tip] Protocol tip
    protocolTip: 'Protocol used for communication with the PLC device',
    // [Label] Reconnect delay
    reconnectDelay: 'Reconnect Delay',
    // [Tip] Reconnect delay tip
    reconnectDelayTip: 'Waiting time before automatic reconnection after disconnection',
    // [Label] PLC config title
    title: 'PLC-Config',
    // [Label] Unit ID
    unitId: 'Unit ID',
    // [Tip] Unit ID tip
    unitIdTip: 'Slave unit ID in Modbus protocol',
    unitTimes: 'times'
  },

  // ==================== Translation Configuration ====================
  translation: {
    // [Label] Basic settings
    basicSettings: 'Basic Settings',
    // [Status] Disabled
    disabled: 'Disabled',
    // [Status] Enabled
    enabled: 'Enabled',
    // [Label] Enable translation
    enableTranslation: 'Translation',
    // [Tip] Enable translation tip
    enableTranslationTip: 'When enabled, the system will automatically translate new i18n fields',
    // [Label] Existing languages
    existingLangs: 'Existing Languages',
    // [Label] Master language
    masterLanguage: 'Master Language',
    // [Tip] Master language tip
    masterLanguageTip: 'Language used as the translation baseline',
    // [Label] Language display field
    languageDisplayField: 'Display Field',
    // [Tip] Language display field tip
    languageDisplayFieldTip: 'Controls how language names appear in the create language dialog. autonym=native name, name=Chinese name',
    // [Option] Display autonym
    displayAutonym: 'Native Name (autonym)',
    // [Option] Display name
    displayName: 'Chinese Name (name)',
    // [Label] Project ID
    projectId: 'Project ID',
    // [Tip] Project ID tip
    projectIdTip: 'Project ID assigned by the translation service provider',
    // [Label] Provider
    provider: 'Provider',
    // [Tip] Provider tip
    providerTip: 'Select the machine translation service provider to use',
    // [Label] Region
    region: 'Region',
    // [Tip] Region tip
    regionTip: 'Regional node for translation service',
    // [Label] Secret ID
    secretId: 'Secret ID',
    // [Placeholder] Secret ID placeholder
    secretIdPlaceholder: 'Enter secret ID',
    // [Tip] Secret ID tip
    secretIdTip: 'Access secret ID for translation service',
    // [Label] Secret key
    secretKey: 'Secret Key',
    // [Placeholder] Secret key placeholder
    secretKeyPlaceholder: 'Enter secret key',
    // [Tip] Secret key tip
    secretKeyTip: 'Access secret key for translation service',
    // [Label] Tencent settings
    tencentSettings: 'Tencent Cloud Settings',
    // [Action] Test config
    testConfig: 'Test Configuration',
    // [Message] Test failed
    testFailed: 'Translation service test failed',
    // [Message] Test success
    testSuccess: 'Translation service test successful',
    // [Option] Tencent Cloud translation
    providerTencent: 'Tencent Cloud Translation',
    // [Option] Region-Guangzhou
    regionGuangzhou: 'Guangzhou',
    // [Option] Region-Shanghai
    regionShanghai: 'Shanghai',
    // [Option] Region-Beijing
    regionBeijing: 'Beijing',
    // [Option] Region-Chengdu
    regionChengdu: 'Chengdu',
    // [Option] Region-Hong Kong
    regionHongkong: 'Hong Kong',
    // [Option] Region-Singapore
    regionSingapore: 'Singapore',
    // [Validation] SecretId required
    secretIdRequired: 'Please enter SecretId',
    // [Validation] SecretKey required
    secretKeyRequired: 'Please enter SecretKey',
    // [Message] Load failed
    loadFailed: 'Failed to load translation config',
    // [Message] Save success
    saveSuccess: 'Translation config saved successfully',
    // [Message] Save failed
    saveFailed: 'Failed to save translation config',
    // [Text] Test default source text
    testDefaultSource: 'Hello',
    // [Tip] Tip content
    tipContent: 'Translation feature requires configuration of translation service first',
    // [Tip] Tip title
    tipTitle: 'Translation Configuration Guide',
    // [Label] Translation config title
    title: 'Trans-Config'
  },

  // ==================== Upload Configuration ====================
  upload: {
    // [Label] Allowed types
    allowedTypes: 'File Types',
    // [Tip] Allowed types tip
    allowedTypesTip: 'Allowed file extensions for upload, separated by commas',
    // [Label] Enable audit
    enableAudit: 'Upload Audit',
    // [Tip] Enable audit tip
    enableAuditTip: 'When enabled, all file upload operations will be recorded',
    // [Label] Max file size
    maxFileSize: 'Max File Size',
    // [Tip] Max file size tip
    maxFileSizeTip: 'Maximum upload size for a single file (MB)',
    // [Label] Upload config title
    title: 'Upload-Config',
    // [Label] Upload path
    uploadPath: 'Upload Path',
    // [Tip] Upload path tip
    uploadPathTip: 'Storage directory path for uploaded files'
  }
}
