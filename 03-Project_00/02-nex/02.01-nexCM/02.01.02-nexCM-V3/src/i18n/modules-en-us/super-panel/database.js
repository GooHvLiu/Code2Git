/**
 * Super Panel Module - Database Management Internationalization Fields
 * Big company standard: unified nested object structure, grouped by functional area
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // ==================== Page Common ====================
  page: {
    // [Page] Database management title
    title: 'Database Management',
    // [Page] Database management description
    desc: 'Manage database backup, restore and data viewing',
    // [Action] Cancel
    cancel: 'Cancel',
    // [Action] Confirm
    confirm: 'Confirm',
    // [Action] Delete
    delete: 'Delete',
    // [Action] Refresh
    refresh: 'Refresh',
    // [Action] Search
    search: 'Search',
    // [Label] Operation
    operation: 'Operation',
    // [Label] Operator
    operator: 'Operator',
    // [Label] Status
    status: 'Status',
    // [Status] Success
    success: 'Success',
    // [Status] Failed
    failed: 'Failed',
    // [Label] Create time
    createTime: 'Create Time',
    // [Label] File size
    fileSize: 'File Size',
    // [Label] Remark
    remark: 'Remark',
    // [Label] Total size
    totalSize: 'Total Size',
    // [Tip] No description
    noDescription: 'No description',
    // [Warning] Warning
    warning: 'Warning'
  },

  // ==================== Tabs ====================
  tab: {
    // [Label] Backup
    backup: 'Backup',
    // [Label] Data view
    dataView: 'Data View',
    // [Label] Restore
    restore: 'Restore',
    // [Label] Table edit
    tableEdit: 'Table Edit'
  },

  // ==================== Backup ====================
  backup: {
    // [Action] Create backup
    create: 'Create Backup',
    // [Label] Backup name
    name: 'Backup Name',
    // [Placeholder] Backup remark placeholder
    remarkPlaceholder: 'Enter backup remark (optional)',
    // [Tip] Backup select table tip
    selectTableTip: 'Select tables to backup',
    // [Message] Backup failed
    failed: 'Backup failed',
    // [Message] Backup success
    success: 'Backup successful',
    // [Tip] Backup tip
    tip: 'Backup database data to specified directory',
    // [Label] Backup total
    total: 'Total Backups',
    // [Label] Backup type
    type: 'Backup Type',
    // [Label] Full backup
    fullType: 'Full Backup',
    // [Label] Table backup
    tableType: 'Table Backup',
    // [Label] Success backup
    successCount: 'Success Backup',
    // [Label] Failed backup
    failedCount: 'Failed Backup',
    // [Confirm] Delete backup confirm
    deleteConfirm: 'Are you sure you want to delete this backup?',
    // [Action] Go to backup
    goTo: 'Go to Backup'
  },

  // ==================== Restore ====================
  restore: {
    // [Action] Restore
    action: 'Restore',
    // [Confirm] Restore confirm
    confirm: 'Are you sure you want to restore this backup? Current data will be overwritten',
    // [Message] Restore failed
    failed: 'Restore failed',
    // [Message] Restore success
    success: 'Restored successfully',
    // [Title] Restore guide title
    guideTitle: 'Restore Guide',
    // [Step] Restore step 1 title
    step1Title: 'Select Backup File',
    // [Step] Restore step 1 desc
    step1Desc: 'Select the backup file to restore from the backup list',
    // [Step] Restore step 2 title
    step2Title: 'Confirm Restore Content',
    // [Step] Restore step 2 desc
    step2Desc: 'Confirm the tables and data range to restore',
    // [Step] Restore step 3 title
    step3Title: 'Execute Restore',
    // [Step] Restore step 3 desc
    step3Desc: 'Click the restore button to start restoring data',
    // [Step] Restore step 4 title
    step4Title: 'Verify Restore Result',
    // [Step] Restore step 4 desc
    step4Desc: 'Verify data integrity after restore is complete',
    // [Warning] Restore warning title
    warningTitle: 'Restore Notes',
    // [Warning] Restore warning 1
    warning1: 'Restore operation will overwrite current data, please ensure current data is backed up',
    // [Warning] Restore warning 2
    warning2: 'Do not close the page or disconnect during restore',
    // [Warning] Restore warning 3
    warning3: 'After restore is complete, it is recommended to restart the service to ensure data takes effect'
  },

  // ==================== Path Settings ====================
  path: {
    // [Action] Change path
    change: 'Change Path',
    // [Action] Browse
    browse: 'Browse',
    // [Label] Current path
    current: 'Current Path',
    // [Tip] Current path tip
    currentTip: 'Current backup file storage path',
    // [Label] Current storage path
    currentStorage: 'Current Storage Path',
    // [Label] Default path
    default: 'Default Path',
    // [Label] New path
    new: 'New Path',
    // [Placeholder] New path placeholder
    newPlaceholder: 'Enter new backup path',
    // [Tip] New path tip
    newTip: 'Enter new backup storage path',
    // [Title] Path dialog title
    dialogTitle: 'Backup Path Settings',
    // [Warning] Path warning
    warning: 'After changing the path, existing backup files will not be migrated automatically',
    // [Label] Quick path
    quick: 'Quick Path',
    // [Tip] Quick path tip
    quickTip: 'Quick Path'
  },

  // ==================== Data View / Table Edit ====================
  dataView: {
    // [Action] Add record
    addRecord: 'Add Record',
    // [Message] Add failed
    addFailed: 'Failed to add',
    // [Message] Add success
    addSuccess: 'Added successfully',
    // [Action] Edit
    edit: 'Edit',
    // [Action] Edit record
    editRecord: 'Edit Record',
    // [Message] Edit failed
    editFailed: 'Edit failed',
    // [Message] Edit success
    editSuccess: 'Edited successfully',
    // [Message] Save failed
    saveFailed: 'Save failed',
    // [Confirm] Delete confirm
    deleteConfirm: 'Are you sure you want to delete this record?',
    // [Message] Delete failed
    deleteFailed: 'Delete failed',
    // [Message] Delete success
    deleteSuccess: 'Deleted successfully',
    // [Label] Data rows
    dataRows: 'Data Rows',
    // [Label] Field count
    fieldCount: 'Field Count',
    // [Label] Rows
    rows: 'Rows',
    // [Tip] No table
    noTable: 'No data tables',
    // [Placeholder] Enter field placeholder
    fieldSearchPlaceholder: 'Enter field name to search',
    // [Tip] Field value tip
    fieldValueTip: 'Field Value',
    // [Action] Search data
    searchData: 'Search Data',
    // [Action] Search table
    searchTable: 'Search Table',
    // [Label] Select config table
    selectConfig: 'Select Config Table',
    // [Tip] Select config table tip
    selectConfigTip: 'Select the config table to view',
    // [Label] Select table
    select: 'Select Table',
    // [Tip] Select table tip
    selectTip: 'Select the data table to operate',
    // [Label] Table description
    description: 'Table Description',
    // [Label] Table name
    name: 'Table Name',
    // [Tip] Config file tip
    configFileTip: 'Config file path'
  },
  // ==================== Table Categories (dynamic: superPanel.database.categories.{categoryKey}) ====================
  categories: {
    // [Category] System Management
    system: 'System Management',
    // [Category] User Management
    user: 'User Management',
    // [Category] Security & Compliance
    security: 'Security & Compliance',
    // [Category] Log Management
    log: 'Log Management',
    // [Category] Configuration Management
    config: 'Configuration Management',
    // [Category] Notification
    notification: 'Notification',
    // [Category] Device Management
    device: 'Device Management',
    // [Category] License Management
    license: 'License Management'
  }
}
