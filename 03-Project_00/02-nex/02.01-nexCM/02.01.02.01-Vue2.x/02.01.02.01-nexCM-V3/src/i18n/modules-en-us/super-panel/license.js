/**
 * Super Panel Module - License Management Internationalization Fields
 * Big company standard: unified nested object structure, grouped by functional area
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // ==================== Page Title ====================
  page: {
    // [Title] Manage title
    manageTitle: 'License Management',
    // [Title] Detail title
    detailTitle: 'License Details',
    // [Title] License import page title
    importTitle: 'License Import'
  },

  // ==================== License Info ====================
  info: {
    // [Label] Customer name
    customerName: 'Customer Name',
    // [Label] Brand description
    brandDesc: 'Brand Description',
    // [Label] Contact
    contact: 'Contact',
    // [Label] Email
    email: 'Email',
    // [Label] Phone
    phone: 'Phone',
    // [Label] Project
    project: 'Project',
    // [Label] Project ID
    projectId: 'Project ID',
    // [Label] Project name
    projectName: 'Project Name',
    // [Label] License ID
    id: 'License ID',
    // [Label] License type
    type: 'License Type',
    // [Label] License status
    status: 'License Status',
    // [Label] Max devices
    maxDevices: 'Max Devices',
    // [Label] Max users
    maxUsers: 'Max Users',
    // [Label] Features
    features: 'Feature List',
    // [Label] Admin only
    adminOnly: 'Admin Only',
    // [Label] Expire at
    expireAt: 'Expire At',
    // [Label] Expire time
    expireTime: 'Expire Time',
    // [Label] Issued at
    issuedAt: 'Issued At',
    // [Label] Last modified
    lastModified: 'Last Modified',
    // [Label] Last verified
    lastVerified: 'Last Verified',
    // [Label] Server time
    serverTime: 'Server Time',
    // [Label] Sync time
    syncTime: 'Sync Time',
    // [Label] Time guard
    timeGuard: 'Time Guard',
    // [Label] Time guard status
    timeGuardStatus: 'Time Guard Status',
    // [Label] Time remaining
    timeRemaining: 'Time Remaining',
    // [Label] Unlimited
    unlimited: 'Unlimited'
  },

  // ==================== Status Values ====================
  status: {
    // [Status] Enabled
    enabled: 'Enabled',
    // [Status] Expired
    expired: 'Expired',
    // [Status] Matched
    matched: 'Matched',
    // [Label] Match status
    match: 'Match Status',
    // [Status] Not initialized
    notInitialized: 'Not Initialized',
    // [Status] Not matched
    notMatched: 'Not Matched',
    // [Status] Status invalid
    invalid: 'Status Invalid',
    // [Status] Status valid
    valid: 'Status Valid',
    // [Label] Unknown reason
    unknownReason: 'Unknown Reason'
  },

  // ==================== License File ====================
  file: {
    // [Label] File info
    info: 'File Info',
    // [Label] File name
    name: 'File Name',
    // [Label] File path
    path: 'File Path',
    // [Label] File size
    size: 'File Size',
    // [Tip] No license file
    empty: 'No license file'
  },

  // ==================== Import License ====================
  import: {
    // [Title] Import dialog title
    dialogTitle: 'Import License File',
    // [Action] Import license
    action: 'Import License',
    // [Action] Import new license
    importNew: 'Import New License',
    // [Tip] Import tip
    tip: 'Please select a license file to import',
    // [Action] Confirm import
    confirm: 'Confirm Import',
    // [Label] Drag upload
    dragUpload: 'Drag license file here',
    // [Action] Download
    download: 'Download'
  },

  // ==================== Common Actions ====================
  action: {
    // [Action] Cancel
    cancel: 'Cancel',
    // [Action] Refresh
    refresh: 'Refresh'
  },

  // ==================== Operation Messages ====================
  message: {
    // [Message] Failed to load license status
    loadStatusFailed: 'Failed to obtain license status',
    // [Message] License file imported
    importSuccess: 'License file imported successfully',
    // [Message] Time synchronized
    syncTimeSuccess: 'Time calibrated successfully',
    // [Message] License file downloaded
    licenseDownloadSuccess: 'License file downloaded successfully',
    // [Message] Machine ID copied
    machineIdCopied: 'Machine ID copied',
    // [Message] Copy failed
    copyFailed: 'Copy failed, please copy manually',
    // [Message] Countdown format (days/hours/minutes)
    countdownFormat: '{days}d {hours}h {minutes}m'
  }
}
