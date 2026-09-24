/**
 * Notification Module - Internationalization Fields (English)
 * Big company standard: unified nested object structure, grouped by functional area
 * Notification center, notification settings related text
 * Note: No fallback solution, missing fields directly display the key
 */

export default {
  // ==================== Page Common ====================
  page: {
    // [Page] Notification center title
    title: 'Notification Center',
    // [Label] Notification center
    center: 'Notification Center',
    // [Label] Notification settings entry
    settingsEntry: 'Notification Settings',
    // [Action] View all
    viewAll: 'View All',
    // [Tip] Empty
    empty: 'No notifications',
    // [Message] Operation failed
    operationFailed: 'Operation failed',
    // [Placeholder] Search placeholder
    searchPlaceholder: 'Search notification title or content',
    // [Label] Selected count
    selectedCount: 'Selected',
    // [Action] Clear selection
    clearSelection: 'Clear Selection'
  },

  // ==================== Filter ====================
  filter: {
    // [Label] All
    all: 'All',
    // [Label] Type
    type: 'Type',
    // [Label] Priority
    priority: 'Priority',
    // [Label] Time range
    timeRange: 'Time Range',
    // [Label] Start date
    startDate: 'Start Date',
    // [Label] End date
    endDate: 'End Date',
    // [Label] To
    to: 'To',
    // [Action] Reset
    reset: 'Reset',
    // [Label] Custom
    custom: 'Custom',
    // [Time] Today
    today: 'Today',
    // [Time] This week
    thisWeek: 'This Week',
    // [Time] This month
    thisMonth: 'This Month'
  },

  // ==================== Relative Time ====================
  time: {
    // [Time] Just now
    justNow: 'Just now',
    // [Time] Minutes ago
    minutesAgo: 'minutes ago',
    // [Time] Hours ago
    hoursAgo: 'hours ago',
    // [Time] Days ago
    daysAgo: 'days ago'
  },

  // ==================== Notification Type ====================
  type: {
    // [Type] System
    system: 'System',
    // [Type] PLC
    plc: 'PLC',
    // [Type] User
    user: 'User',
    // [Type] Audit
    audit: 'Audit',
    // [Type] Device
    device: 'Device',
    // [Type] Connection
    connection: 'Connection',
    // [Type] Security
    security: 'Security',
    // [Type] Production
    production: 'Production',
    // [Type] Config
    config: 'Config',
    // [Type] License
    license: 'License'
  },

  // ==================== Priority ====================
  priority: {
    // [Priority] High
    high: 'High',
    // [Priority] Medium
    medium: 'Medium',
    // [Priority] Low
    low: 'Low'
  },

  // ==================== Status ====================
  status: {
    // [Status] Read
    read: 'Read',
    // [Status] Unread
    unread: 'Unread',
    // [Status] Archived
    archived: 'Archived',
    // [Status] Unarchived
    unarchived: 'Unarchived'
  },

  // ==================== Table Columns ====================
  table: {
    // [Label] Content
    content: 'Content',
    // [Label] Created at
    createdAt: 'Created At'
  },

  // ==================== Actions ====================
  action: {
    // [Action] Mark read
    markRead: 'Mark as Read',
    // [Action] Mark all read
    markAllRead: 'Mark All as Read',
    // [Action] Archive
    archive: 'Archive',
    // [Action] Unarchive
    unarchive: 'Unarchive',
    // [Action] Batch mark read
    batchMarkRead: 'Batch Mark Read',
    // [Action] Batch archive
    batchArchive: 'Batch Archive',
    // [Action] Batch unarchive
    batchUnarchive: 'Batch Unarchive',
    // [Action] Batch delete
    batchDelete: 'Batch Delete',
    // [Action] Delete
    delete: 'Delete'
  },

  // ==================== Confirm ====================
  confirm: {
    // [Confirm] Mark all confirm
    markAll: 'Are you sure you want to mark all notifications as read?',
    // [Confirm] Delete confirm
    delete: 'Are you sure you want to delete this notification?',
    // [Confirm] Batch delete confirm
    batchDelete: 'Are you sure you want to delete selected notifications?'
  },

  // ==================== Result Messages ====================
  message: {
    // [Message] Mark all success
    markAllSuccess: 'All marked as read successfully',
    // [Message] Delete success
    deleteSuccess: 'Deleted successfully',
    // [Message] Batch delete success
    batchDeleteSuccess: 'Batch deleted successfully'
  },

  // ==================== Notification Settings ====================
  settings: {
    // [Label] Notification settings title
    title: 'Notification Settings',
    // [Label] Do not disturb
    doNotDisturb: 'Do Not Disturb',
    // [Status] Do not disturb enabled
    doNotDisturbEnabled: 'Do Not Disturb Enabled',
    // [Label] Start time
    startTime: 'Start Time',
    // [Label] End time
    endTime: 'End Time',
    // [Label] Notification types
    notificationTypes: 'Notification Types',
    // [Label] Popup enabled
    popupEnabled: 'Popup Notification',
    // [Label] Reminder methods
    reminderMethods: 'Reminder Methods',
    // [Description] Reminder methods desc
    reminderMethodsDesc: 'Select how to receive notifications',
    // [Action] Save
    save: 'Save',
    // [Message] Save success
    saveSuccess: 'Saved successfully',
    // [Label] Sound enabled
    soundEnabled: 'Sound Notification',
    // [Label] Type enabled
    typeEnabled: 'Enable Type',
    // [Settings Group] System
    system: 'System',
    // [Settings Group] PLC
    plc: 'PLC',
    // [Settings Group] User
    user: 'User',
    // [Settings Group] Audit
    audit: 'Audit',
    // [Settings Group] Device
    device: 'Device',
    // [Settings Group] Connection
    connection: 'Connection'
  }
}
