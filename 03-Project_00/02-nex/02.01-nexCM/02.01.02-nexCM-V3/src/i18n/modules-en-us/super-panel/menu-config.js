/**
 * Super Panel Module - Menu Configuration Internationalization Fields
 * Big company standard: unified nested object structure, grouped by functional area
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // ==================== Page Common ====================
  page: {
    // [Page] Page title
    title: 'Menu Configuration',
    // [Page] Page description
    desc: 'Manage system menu structure, support menu CRUD, drag sorting and preview',
    // [Action] Action
    action: 'Action',
    // [Status] Loading
    loading: 'Loading...'
  },

  // ==================== Menu Tree ====================
  tree: {
    // [Action] Add top menu
    addTop: 'Add Top Menu',
    // [Label] Menu tree
    title: 'Menu Tree',
    // [Label] Menu count
    count: 'Menu Count',
    // [Action] Refresh menu
    refresh: 'Refresh Menu',
    // [Tip] Click left menu to view detail
    clickToViewDetail: 'Click a menu on the left to view details'
  },

  // ==================== Menu Detail Fields ====================
  detail: {
    // [Label] Menu detail
    title: 'Menu Detail',
    // [Label] Basic info
    basicInfo: 'Basic Info',
    // [Label] Display config
    displayConfig: 'Display Configuration',
    // [Label] Route config
    routeConfig: 'Route Configuration',
    // [Label] Sort and type
    sortAndType: 'Sort and Type',
    // [Field] Always show
    alwaysShow: 'Always Show',
    // [Field] Component
    component: 'Component',
    // [Field] Hidden
    hidden: 'Hidden',
    // [Field] Icon
    icon: 'Icon',
    // [Field] ID
    id: 'Menu ID',
    // [Field] Name
    name: 'Route Name',
    // [Field] No cache
    noCache: 'No Cache',
    // [Field] Parent ID
    parentId: 'Parent ID',
    // [Field] Path
    path: 'Route Path',
    // [Field] Redirect
    redirect: 'Redirect',
    // [Field] Sort
    sort: 'Sort',
    // [Field] Title
    menuTitle: 'Menu Title',
    // [Field] Type
    type: 'Menu Type',
    // [Field] Update time
    updateTime: 'Update Time'
  },

  // ==================== Edit Mode ====================
  edit: {
    // [Label] Edit mode
    mode: 'Edit Mode',
    // [Tip] Edit mode tip
    modeTip: 'In edit mode, you can modify menu configuration. Changes take effect after saving',
    // [Action] Enter edit mode
    enter: 'Enter Edit Mode',
    // [Action] Exit edit mode
    exit: 'Exit Edit Mode',
    // [Label] View mode
    viewMode: 'View Mode',
    // [Action] Save changes
    save: 'Save Changes',
    // [Action] Save and exit
    saveAndExit: 'Save and Exit',
    // [Action] Discard changes
    discard: 'Discard Changes',
    // [Action] Undo changes
    undo: 'Undo Changes',
    // [Tip] No changes
    noChanges: 'No unsaved changes',
    // [Tip] Unsaved changes
    unsavedChanges: 'Unsaved changes',
    // [Confirm] Confirm exit
    confirmExit: 'You have unsaved changes. Are you sure you want to exit?',
    // [Label] Change stats
    changeStats: 'Change Statistics',
    // [Stats] Added count
    changeAdded: 'Added',
    // [Stats] Deleted count
    changeDeleted: 'Deleted',
    // [Stats] Modified count
    changeModified: 'Modified'
  },

  // ==================== Menu Type & Status ====================
  type: {
    // [Type] Button
    button: 'Button',
    // [Type] Directory
    directory: 'Directory',
    // [Type] Menu
    menu: 'Menu',
    // [Type] Param
    param: 'Parameter',
    // [Status] Status - hidden
    hidden: 'Hidden'
  },

  // ==================== Delete Menu ====================
  delete: {
    // [Action] Delete
    action: 'Delete',
    // [Action] Delete menu
    menu: 'Delete Menu',
    // [Tip] Delete permission tip
    permissionTip: 'You do not have permission to delete this menu',
    // [Action] Confirm delete
    confirm: 'Confirm Delete',
    // [Button] Confirm delete button
    confirmButton: 'Delete',
    // [Message] Confirm delete message
    message: 'Are you sure you want to delete this menu? This action cannot be undone',
    // [Title] Confirm delete title
    title: 'Delete Confirmation',
    // [Confirm] Confirm delete with children
    withChildren: 'This menu contains submenus. Are you sure you want to delete all of them?'
  },

  // ==================== Menu Backup ====================
  backup: {
    // [Action] Create backup
    create: 'Create Backup',
    // [Title] Create backup title
    createTitle: 'Create Menu Backup',
    // [Message] Backup create failed
    createFailed: 'Failed to create backup',
    // [Message] Backup create success
    createSuccess: 'Backup created successfully',
    // [Message] Backup delete failed
    deleteFailed: 'Failed to delete backup',
    // [Message] Backup delete success
    deleteSuccess: 'Backup deleted successfully',
    // [Label] Backup file name
    fileName: 'Backup File Name',
    // [Label] Backup history
    history: 'Backup History',
    // [Title] Backup list title
    listTitle: 'Backup List',
    // [Placeholder] Backup remark placeholder
    remarkPlaceholder: 'Enter backup remark (optional)',
    // [Tip] No backup files
    noFiles: 'No backup files',
    // [Label] File size
    fileSize: 'File Size',
    // [Label] Created at
    createdAt: 'Created At',
    // [Label] Remark
    remark: 'Remark',
    // [Label] Current backup path
    currentPath: 'Current Backup Path',
    // [Tip] Current backup path tip
    currentPathTip: 'The directory path where the current menu backup files are stored',
    // [Label] New backup path
    newPath: 'New Backup Path',
    // [Placeholder] New backup path placeholder
    newPathPlaceholder: 'Enter the new backup directory path',
    // [Tip] New backup path tip
    newPathTip: 'Enter the new menu backup directory path, click Save to apply',
    // [Title] Backup path title
    pathTitle: 'Backup Path Settings',
    // [Message] Save path failed
    savePathFailed: 'Failed to update backup path',
    // [Message] Save path success
    savePathSuccess: 'Backup path updated successfully'
  },

  // ==================== Preview ====================
  preview: {
    // [Description] Preview description
    desc: 'Preview the actual effect of menu configuration',
    // [Action] Preview effect
    action: 'Preview Effect',
    // [Message] Preview load failed
    loadFailed: 'Failed to load preview data',
    // [Tip] Preview main tip 1
    mainTip: 'The preview window will open in a new tab',
    // [Tip] Preview main tip 2
    mainTip2: 'Preview data is stored in local storage and expires after closing the preview window',
    // [Label] Preview menu count
    menuCount: 'Preview Menu Count',
    // [Label] Preview mode
    mode: 'Preview Mode',
    // [Tip] Preview no data
    noData: 'No preview data',
    // [Label] Preview time
    time: 'Preview Time',
    // [Title] Preview title
    title: 'Menu Preview'
  },

  // ==================== Notes / Warnings ====================
  warning: {
    // [Title] Warning title
    title: 'Notes',
    // [Warning] Warning 1
    item1: 'After entering edit mode, all changes will not take effect until saved',
    // [Warning] Warning 2
    item2: 'Deleting a menu will also delete all its submenus, please proceed with caution',
    // [Warning] Warning 3
    item3: 'Menu titles use internationalization keys. After modification, you need to add corresponding translations in language configuration',
    // [Warning] Warning 4
    item4: 'Dragging menus can adjust sorting and parent-child relationships',
    // [Warning] Warning 5
    item5: 'The preview function opens in a new window to view the actual display effect of the menu'
  },

  // ==================== Common Actions ====================
  common: {
    // [Action] Cancel
    cancel: 'Cancel',
    // [Action] Refresh
    refresh: 'Refresh',
    // [Action] Import config
    importConfig: 'Import Config',
    // [Message] Save success
    saveSuccess: 'Saved successfully',
    // [Tip] Path not empty
    pathNotEmpty: 'Path cannot be empty'
  }
}
