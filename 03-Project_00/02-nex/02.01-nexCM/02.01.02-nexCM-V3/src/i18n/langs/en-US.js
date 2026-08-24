/**
 * ==========================================
 * English Language Pack
 * ==========================================
 * Grouped by module, add new text here
 * Keep structure consistent with zh-CN.js
 */
export default {
  // ==================== Common ====================
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    export: 'Export',
    exportExcel: 'Export Excel',
    exportPdf: 'Export PDF',
    selected: 'Selected',
    import: 'Import',
    // Export PDF subtitle labels
    exportLabels: {
      exporter: 'Exporter',
      time: 'Export Time',
      countPrefix: 'Total',
      countSuffix: 'records'
    },
    refresh: 'Refresh',
    operation: 'Action',
    status: 'Status',
    index: 'No.',
    sort: 'Sort',
    description: 'Description',
    remark: 'Remark',
    enable: 'Enable',
    disable: 'Disable',
    createTime: 'Create Time',
    updateTime: 'Update Time',
    loading: 'Loading...',
    success: 'Success',
    failed: 'Failed',
    tip: 'Tip',
    warning: 'Warning',
    error: 'Error',
    untitled: 'Untitled',
    redirect: 'Redirect',
    systemName: 'nexCM Web Standard',
    systemDESC: 'Benchtop Filling and Stoppering Machine',
    electronicSignature: 'Electronic Signature',
    featureComingSoon: 'Coming Soon',
    noDataToExport: 'No data to export',
    operator: 'Operator',
    reason: 'Reason',
    reasonPlaceholder: 'Please enter the reason for operation (GMP required)',
    reasonRequired: 'Please enter the reason',
    reasonMinLength: 'Reason must be at least 2 characters',
    password: 'Password',
    passwordPlaceholder: 'Enter password for electronic signature',
    passwordRequired: 'Please enter password',
    sessionTimeout: 'Session timed out, please login again'
  },

  // ==================== Login ====================
  login: {
    title: 'Welcome',
    username: 'Username',
    password: 'Password',
    captcha: 'Captcha',
    loginBtn: 'Login',
    registerBtn: 'Register',
    registerTitle: 'Register',
    email: 'Email',
    confirmPassword: 'Confirm Password',
    hasAccount: 'Already have an account?',
    loginNow: 'Login Now',
    noAccount: "Don't have an account?",
    registerNow: 'Register Now',
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
    captchaRequired: 'Captcha is required',
    emailRequired: 'Email is required',
    confirmPasswordRequired: 'Please confirm your password',
    registerSuccess: 'Registration successful, please login'
  },

  // ==================== Layout ====================
  layout: {
    // 网站首页
    home: 'Home',
    homeOverview: 'Overview',
    homeDashboard: 'Dashboard',
    homeData: 'DataView',

    // 设备管理
    deviceManagement: 'Device',
    deviceState: 'DevState',
    alarmLog: 'AlarmLog',
    partLife: 'PartLife',

    // 生产管理
    productionManagement: 'Production',
    recipeManagement: 'RecipeDB',
    orderManagement: 'OrderLog',

    // 系统配置
    systemSettings: 'Settings',
    dictManagement: 'DictData',
    roleManagement: 'UserRole',
    deptManagement: 'DeptInfo',
    userManagement: 'UserData',
    auditLog: 'AuditLog',
    systemConfig: 'ConfData',

    // 个人中心
    profile: 'Profile',

    // 通知中心
    notificationCenter: 'NotifLog',

    // 退出登录
    logout: 'Logout',

    // 用户
    user: 'User',

    // 搜索
    searchMenu: 'Search menu...',

    // 面包屑
    tagsView: {
      refresh: 'Refresh',
      close: 'Close',
      closeOthers: 'Close Others',
      closeLeft: 'Close Left',
      closeRight: 'Close Right',
      closeAll: 'Close All'
    }
  },

  // ==================== Data Dictionary ====================
  dict: {
    typeList: 'Dictionary Types',
    itemList: 'Dictionary Items',
    typeName: 'Type Name',
    typeCode: 'Type Code',
    typeCodePlaceholder: 'Start with letter, e.g. user_status',
    itemLabel: 'Label',
    itemValue: 'Value',
    itemValuePlaceholder: 'e.g. 1/0',
    itemStatus: 'Status',
    addType: 'Add Dictionary Type',
    editType: 'Edit Dictionary Type',
    addItem: 'Add Dictionary Item',
    editItem: 'Edit Dictionary Item',
    typeNameRequired: 'Please enter dictionary type name',
    typeCodeRequired: 'Please enter dictionary type code',
    itemLabelRequired: 'Please enter dictionary item label',
    itemValueRequired: 'Please enter dictionary item value',
    deleteTypeConfirm: 'Delete this dictionary type? All items will be deleted too.',
    deleteItemConfirm: 'Delete this dictionary item?'
  },

  // ==================== Role Management ====================
  role: {
    title: 'Role Management',
    roleName: 'Role Name',
    roleCode: 'Role Code',
    dataScope: 'Data Scope',
    dataScopeAll: 'All Data',
    dataScopeDept: 'Department',
    dataScopeDeptAndChild: 'Dept & Children',
    dataScopeSelf: 'Self Only',
    permission: 'Permission',
    permissionTitle: 'Menu Permission',
    permissionSuccess: 'Permission updated successfully',
    addRole: 'Add Role',
    editRole: 'Edit Role',
    roleNameRequired: 'Please enter role name',
    roleCodeRequired: 'Please enter role code',
    deleteConfirm: 'Delete this role?'
  },

  // ==================== Department Management ====================
  dept: {
    title: 'Department Management',
    deptName: 'Department Name',
    orderNum: 'Sort',
    leader: 'Leader',
    phone: 'Phone',
    email: 'Email',
    parentDept: 'Parent Dept',
    addChild: 'Add Child Dept',
    addDept: 'Add Department',
    editDept: 'Edit Department',
    deptNameRequired: 'Please enter department name',
    deleteConfirm: 'Delete this department?'
  },

  // ==================== Notification Center ====================
  notification: {
    title: 'Notification Center',
    center: 'Notifications',
    viewAll: 'View All',
    type: 'Type',
    content: 'Content',
    markAllRead: 'Mark All Read',
    all: 'All',
    unread: 'Unread',
    read: 'Read',
    markRead: 'Mark Read',
    empty: 'No notifications',
    typeSystem: 'System',
    typePlc: 'PLC',
    typeUser: 'User',
    typeAudit: 'Audit',
    markReadSuccess: 'Marked as read',
    markAllSuccess: 'All marked as read',
    deleteConfirm: 'Delete this notification?',
    justNow: 'just now',
    minutesAgo: ' min ago',
    hoursAgo: ' hours ago',
    daysAgo: ' days ago'
  },

  // ==================== Error Page ====================
  error: {
    notFound: 'Page Not Found',
    backHome: 'Back Home',
    back: 'Go Back',
    countdown: 'Returning home in {count}s',
    forbidden: 'Sorry, you do not have access',
    forbiddenDesc: 'This page requires specific permissions, please contact the administrator',
    forbiddenTitle: 'Forbidden'
  },

  // ==================== Home ====================
  home: {
    welcome: 'Welcome',
    admin: 'Administrator'
  },

  // ==================== Theme Settings ====================
  theme: {
    quickMenu: 'Quick Menu',
    palette: 'Theme Palette',
    language: 'Language',
    resetAll: 'Reset All',
    reset: 'Reset',
    custom: 'Custom',
    switchedToZh: '已切换为中文',
    switchedToEn: 'Switched to English',
    sidebarBg: 'Sidebar Background Color',
    sidebarHoverText: 'Sidebar Hover Text',
    sidebarHoverBg: 'Sidebar Hover Background',
    sidebarIconColor: 'Sidebar Icon Color',
    sidebarActiveBg: 'Active Menu Background'
  },

  // ==================== Profile ====================
  profile: {
    title: 'Profile',
    basicInfo: 'Basic Info',
    username: 'Username',
    realName: 'Real Name',
    sex: 'Gender',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    status: 'Status',
    createTime: 'Create Time',
    sexMale: 'Male',
    sexFemale: 'Female',
    sexUnknown: 'Unknown',
    roleAdministrator: 'Administrator',
    roleEngineer: 'Engineer',
    roleOperator: 'Operator',
    statusEnabled: 'Enabled',
    statusDisabled: 'Disabled',
    changePassword: 'Change Password',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password'
  },

  // ==================== User Management ====================
  user: {
    title: 'User Management',
    username: 'Username',
    password: 'Password',
    realName: 'Real Name',
    sex: 'Gender',
    sexUnknown: 'Unknown',
    sexMale: 'Male',
    sexFemale: 'Female',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    dept: 'Department',
    status: 'Status',
    createTime: 'Create Time',
    operation: 'Action',
    addUser: 'Add User',
    editUser: 'Edit User',
    enable: 'Enable',
    disable: 'Disable',
    resetPassword: 'Reset Password',
    remark: 'Remark',
    roleAdministrator: 'Administrator',
    roleEngineer: 'Engineer',
    roleOperator: 'Operator',
    usernamePlaceholder: 'Enter username',
    passwordPlaceholder: 'Enter password',
    realNamePlaceholder: 'Enter real name',
    emailPlaceholder: 'Enter email',
    phonePlaceholder: 'Enter phone',
    rolePlaceholder: 'Select role',
    deptPlaceholder: 'Select department',
    remarkPlaceholder: 'Enter remark',
    usernameLength: 'Length between 2 and 50 characters',
    passwordLength: 'Length between 6 and 32 characters',
    emailInvalid: 'Please enter a valid email address',
    deleteConfirm: 'Are you sure to delete user "{name}"?',
    batchDeleteConfirm: 'Are you sure to delete {count} selected users?',
    deleteSuccess: 'Deleted successfully',
    batchDeleteSuccess: 'Batch deleted successfully',
    exportFileName: 'UserList',
    resetPasswordTitle: 'Reset Password',
    resetPasswordPlaceholder: 'Enter new password',
    resetPasswordError: 'Password length 6-20 characters',
    resetPasswordSuccess: 'Password reset successfully'
  },

  // ==================== Audit Log ====================
  audit: {
    title: 'Audit Log',
    myTitle: 'My Activity',
    userName: 'Operator',
    action: 'Action',
    target: 'Target',
    oldValue: 'Old Value',
    newValue: 'New Value',
    result: 'Result',
    success: 'Success',
    failed: 'Failed',
    ip: 'IP Address',
    createdAt: 'Time',
    timeRange: 'Time Range',
    startTime: 'Start Time',
    endTime: 'End Time'
  },

  // ==================== System Config ====================
  systemConfig: {
    title: 'System Configuration',
    desc: 'Customize system parameters, including system settings, security settings, device connection, export configuration, etc.',
    save: 'Save',
    reset: 'Reset',
    saveSuccess: 'Configuration saved successfully',
    resetSuccess: 'Configuration reset to default',
    resetConfirm: 'Are you sure to reset to default configuration?',
    loadFailed: 'Failed to load configuration',
    saveFailed: 'Failed to save configuration',
    resetFailed: 'Failed to reset configuration',
    system: {
      title: 'System Config',
      sessionTimeout: 'Session Timeout',
      minutes: 'minutes',
      defaultPageSize: 'Default Page Size',
      defaultLanguage: 'Default Language',
      dateFormat: 'Date Format'
    },
    security: {
      title: 'Security Config',
      watermarkEnabled: 'Enable Watermark',
      watermarkText: 'Watermark Text',
      watermarkPlaceholder: 'Use current username if empty'
    },
    plc: {
      title: 'Device Connect',
      protocol: 'Protocol',
      host: 'Device IP Address',
      port: 'Device Port',
      unitId: 'Unit ID',
      pollFast: 'Fast Poll Interval',
      pollSlow: 'Slow Poll Interval'
    },
    export: {
      title: 'Export Config',
      pdfWatermarkEnabled: 'PDF Export Watermark',
      pdfWatermarkText: 'PDF Watermark Text',
      pdfWatermarkPlaceholder: 'Use current username if empty'
    },
    connection: {
      title: 'Network Config',
      heartbeatInterval: 'Heartbeat Interval'
    }
  },

  // ==================== License ====================
  license: {
    importTitle: 'License Import',
    manageTitle: 'License Mgmt',
    statusValid: 'License Valid',
    statusInvalid: 'License Invalid',
    statusChecking: 'Checking License',
    statusCheckingTip: 'Please wait...',
    statusTrial: 'Trial License',
    statusFormal: 'Formal License',
    statusPermanent: 'Permanent License',
    licenseFile: 'License File',
    importLicense: 'Import License',
    importSuccess: 'License imported successfully',
    importFailed: 'License import failed',
    selectFile: 'Select License File',
    dragFileHere: 'Drag license file here, or',
    clickUpload: 'click to upload',
    fileFormatTip: 'Only .lic license files are supported',
    noLicense: 'No license file imported yet',
    licenseInfo: 'License Info',
    customerName: 'Customer Name',
    projectName: 'Project Name',
    licenseType: 'License Type',
    expireTime: 'Expire Time',
    machineId: 'Machine ID',
    machineBind: 'Machine Binding',
    timeGuard: 'Time Protection',
    syncTime: 'Sync Time',
    syncTimeSuccess: 'Time synced successfully',
    syncTimeFailed: 'Time sync failed',
    downloadLicense: 'Download License',
    downloadFailed: 'Download failed',
    copyMachineId: 'Copy Machine ID',
    copySuccess: 'Copied successfully',
    features: 'Features',
    issuedAt: 'Issued At',
    notBound: 'Not Bound',
    refresh: 'Refresh',
    download: 'Download',
    remaining: 'Remaining',
    detailTitle: 'License Details',
    licenseId: 'License ID',
    projectId: 'Project ID',
    contact: 'Contact',
    phone: 'Phone',
    email: 'Email',
    maxUsers: 'Max Users',
    allFeatures: 'All Features',
    currentMachineId: 'Current Machine ID',
    boundMachineId: 'Bound Machine ID',
    notBoundAny: 'Not Bound (Any Machine)',
    matchStatus: 'Match Status',
    matched: 'Matched',
    notMatched: 'Not Matched',
    timeGuardStatus: 'Time Guard',
    enabled: 'Enabled',
    notInitialized: 'Not Initialized',
    lastVerified: 'Last Verified',
    serverTime: 'Server Time',
    networkDiagnosis: 'Network Diagnosis',
    fileInfo: 'License File Info',
    filePath: 'File Path',
    fileName: 'File Name',
    fileSize: 'File Size',
    lastModified: 'Last Modified',
    noLicenseFile: 'License file not found, please import first',
    importDialogTitle: 'Import License File',
    importTip: 'Please upload a .lic license file issued by Beehive License Manager',
    dragUpload: 'Drag .lic file here, or click to upload',
    cancel: 'Cancel',
    confirmImport: 'Confirm Import',
    networkDiagnosisSuccess: 'Network diagnosis successful',
    networkDiagnosisFailed: 'Network diagnosis failed, please check network',
    // License import page
    brandTitle: 'Software License Manager',
    brandDesc: 'Beehive License Manager',
    featureRsa: 'RSA Asymmetric Signature',
    featureTimeGuard: 'Anti-Time Rollback',
    featureMachineBind: 'Machine Fingerprint Binding',
    importFormTitle: 'Import License File',
    dragUploadTip: 'Drag .lic license file here, or click to upload',
    fileSizeTip: 'Only .lic license files supported, max 1MB',
    remove: 'Remove',
    importSuccessTitle: 'License Imported Successfully',
    project: 'Project',
    unlimited: 'Unlimited',
    enterSystem: 'Enter System',
    refreshStatus: 'Refresh Status',
    cannotGetStatus: 'Cannot get license status, please check backend service',
    pleaseSelectFile: 'Please select a license file first',
    permanentValid: 'Permanent Valid',
    typeTrial: 'Trial',
    typeStandard: 'Standard',
    typeEnterprise: 'Enterprise',
    typePerpetual: 'Perpetual',
    // License invalid reasons
    reasonFileNotFound: 'License file not found or verification failed',
    reasonProjectMismatch: 'License project mismatch',
    reasonMachineMismatch: 'License does not match current machine (hardware binding)',
    reasonExpired: 'License has expired',
    reasonMissingFeatures: 'Missing feature authorization',
    reasonTimeRollback: 'Time rollback detected, please calibrate system time',
    reasonNetworkSyncFailed: 'Network calibration failed, please check network connection',
    reasonUnknown: 'License verification failed',
    // Machine ID
    copy: 'Copy',
    copyFailed: 'Copy failed',
    machineIdTip: 'For authorization, please provide this machine ID to the supplier'
  }
}
