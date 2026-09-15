/**
 * Super Panel Module - Language Configuration Internationalization Fields
 * Big company standard: unified nested object structure, grouped by functional area
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // ==================== Page Common ====================
  page: {
    // [Page] Language configuration title
    title: 'Language Configuration',
    // [Page] Description
    desc: 'Manage system multilingual configuration, support creation, editing, translation and backup of language files',
    // [Action] Actions
    actions: 'Actions'
  },

  // ==================== Node Tree Operations ====================
  node: {
    // [Action] Add child node
    addChild: 'Add Child',
    // [Action] Add config
    addConfig: 'Add Config',
    // [Action] Add sibling node
    addSibling: 'Add Sibling',
    // [Action] Edit config
    editConfig: 'Edit Config',
    // [Action] Delete node
    deleteNode: 'Delete Node',
    // [Action] Confirm delete
    confirmDelete: 'Confirm Delete',
    // [Tip] Cannot add child to leaf
    cannotAddChildToLeaf: 'Cannot add child node to a leaf node',
    // [Tip] No children
    noChildren: 'No child nodes',
    // [Tip] Select node tip
    selectTip: 'Please select a node in the left tree first',
    // [Label] Parent path
    parentPath: 'Parent Path',
    // [Placeholder] Parent path placeholder
    parentPathPlaceholder: 'e.g. user, system.user',
    // [Tip] Parent path tip
    parentPathTip: 'Parent path of the field, leave empty for root nodes',
    // [Tip] Path not empty
    pathNotEmpty: 'Path cannot be empty',
    // [Label] Field path
    fieldPath: 'Field Path',
    // [Label] Folders
    folders: 'Folders',
    // [Label] Items
    items: 'Items'
  },

  // ==================== Field Editing ====================
  field: {
    // [Label] Key name
    keyName: 'Field Name',
    // [Placeholder] Key name placeholder
    keyNamePlaceholder: 'Enter field name, e.g. user.name',
    // [Tip] Key name tip
    keyNameTip: 'Unique identifier for the internationalization field, use dots to separate levels',
    // [Tip] Key invalid
    keyInvalid: 'Invalid field name, can only contain letters, numbers, underscores and dots',
    // [Tip] Key not empty
    keyNotEmpty: 'Field name cannot be empty',
    // [Label] Value
    value: 'Value',
    // [Placeholder] Value placeholder
    valuePlaceholder: 'Enter translation content',
    // [Placeholder] Value placeholder with lang
    valuePlaceholderWithLang: 'Enter {lang} translation content',
    // [Placeholder] Search placeholder
    searchPlaceholder: 'Search field name or value...',
    // [Tip] No data
    noData: 'No data',
    // [Format] Camel format
    formatCamel: 'Camel Case',
    // [Format] Normal format
    formatNormal: 'Normal',
    // [Format] Title format
    formatTitle: 'Title Case'
  },

  // ==================== Translation ====================
  translate: {
    // [Action] Auto translate
    auto: 'Auto Translate',
    // [Action] Auto translate all
    autoAll: 'Auto Translate All',
    // [Tip] Auto translate all tip
    autoAllTip: 'Automatically translate all fields with missing translations to the target language',
    // [Tip] Auto translate tip
    autoTip: 'Use translation API to automatically translate the current field',
    // [Action] Batch translate
    batch: 'Batch Translate',
    // [Tip] Batch translate tip
    batchTip: 'Batch translate all fields with missing translations',
    // [Action] Cancel translate
    cancel: 'Cancel Translate',
    // [Confirm] Cancel translate confirm
    cancelConfirm: 'Are you sure you want to cancel translation? Unsaved changes will be lost',
    // [Action] Close translate
    close: 'Close Translate',
    // [Action] Copy values
    copyValues: 'Copy Values',
    // [Label] Copy values - No
    copyValuesNo: 'No',
    // [Tip] Copy values tip
    copyValuesTip: 'Whether to copy the master language values to the target language',
    // [Label] Copy values - Yes
    copyValuesYes: 'Yes',
    // [Label] Current translating
    currentStatus: 'Translating',
    // [Label] Translating
    status: 'Translating',
    // [Action] Minimize
    minimize: 'Minimize',
    // [Label] Fail count
    failCount: 'Failed',
    // [Label] Success count
    successCount: 'Successful',
    // [Label] Total count
    totalCount: 'Total Count',
    // [Label] Current count
    currentCount: 'Current Count',
    // [Action] Node translate
    node: 'Node Translate',
    // [Tip] Node translate key path missing
    nodeKeyPathMissing: 'Please select a node to translate first',
    // [Tip] Node translate leaf tip
    nodeLeafTip: 'Leaf nodes can directly edit translation content',
    // [Tip] Node translate no content
    nodeNoContent: 'This node has no translatable content',
    // [Tip] Node translate tip
    nodeTip: 'Select a node on the left and edit the translation content on the right',
    // [Tip] Source lang not empty
    sourceNotEmpty: 'Source language cannot be empty',
    // [Label] Source language
    source: 'Source Language',
    // [Tip] Source language tip
    sourceTip: 'The source language for translation, usually Chinese',
    // [Action] Translate all
    all: 'Translate All',
    // [Description] Translate all desc
    allDesc: 'Translate all fields with missing translations',
    // [Message] Translate batch success
    batchSuccess: 'Batch translation completed',
    // [Message] Translate cancelled
    cancelled: 'Translation cancelled',
    // [Message] Translate failed
    failed: 'Translation failed',
    // [Tip] Translate in progress tip
    inProgressTip: 'Translation in progress, please wait...',
    // [Action] Translate missing only
    missingOnly: 'Translate Missing Only',
    // [Description] Translate missing only desc
    missingOnlyDesc: 'Only translate fields that currently have no translation content',
    // [Tip] Translate no content
    noContent: 'No content to translate',
    // [Label] Translate progress
    progress: 'Translation Progress',
    // [Message] Translate save failed
    saveFailed: 'Failed to save translation results',
    // [Tip] Translate source empty
    sourceEmpty: 'Translation source content is empty',
    // [Message] Translate success
    success: 'Translation successful',
    // [Tip] Translate tip
    tip: 'Use AI translation service to automatically translate field content',
    // [Tip] Translate zh not found
    zhNotFound: 'Chinese translation not found, cannot proceed with translation'
  },

  // ==================== Batch Compare ====================
  compare: {
    // [Action] Batch compare fields
    batch: 'Batch Compare Fields',
    // [Tip] Compare empty tip
    emptyTip: 'Please select a target language and click "Start Compare" to compare field structure',
    // [Message] Compare failed
    failed: 'Compare failed',
    // [Message] Compare success
    success: 'Compare completed',
    // [Label] Empty fields
    emptyFields: 'Empty Fields',
    // [Label] Extra field count
    extraCount: 'Extra Fields',
    // [Label] Extra fields
    extraFields: 'Extra Fields',
    // [Label] Master field count
    masterCount: 'Master Fields',
    // [Label] Master language
    masterLanguage: 'Master Language',
    // [Tip] Master language tip
    masterLanguageTip: 'The language used as the comparison baseline, set in Parameter Configuration - Translation Settings',
    // [Label] Master value
    masterValue: 'Master Value',
    // [Label] Missing field count
    missingCount: 'Missing Fields',
    // [Label] Missing fields
    missingFields: 'Missing Fields',
    // [Label] Target field count
    targetCount: 'Target Fields',
    // [Label] Target language
    targetLanguage: 'Target Language',
    // [Tip] Target language tip
    targetLanguageTip: 'Select the language file to compare with the master, only existing languages can be selected',
    // [Label] Target value
    targetValue: 'Target Value',
    // [Tip] Please select language
    selectLanguage: 'Please select a language',
    // [Placeholder] Please select a target language
    pleaseSelectLanguage: 'Please select a target language',
    // [Action] Start compare
    start: 'Start Compare',
    // [Tip] No content to copy
    noContentToCopy: 'No content to copy',
    // [Label] Total
    total: 'Total'
  },

  // ==================== Backup ====================
  backup: {
    // [Action] Backup
    action: 'Backup',
    // [Label] Backup create time
    createTime: 'Backup Time',
    // [Message] Backup failed
    failed: 'Backup failed',
    // [Label] Backup file name
    fileName: 'Backup File Name',
    // [Label] Backup file size
    fileSize: 'File Size',
    // [Backup List] Backup list
    list: 'Backup List',
    // [Label] Backup path
    path: 'Backup Path',
    // [Message] Backup success
    success: 'Backup successful',
    // [Confirm] Confirm delete backup
    deleteConfirm: 'Are you sure you want to delete this backup file? This action cannot be undone',
    // [Message] Delete backup failed
    deleteFailed: 'Delete backup failed',
    // [Message] Delete backup success
    deleteSuccess: 'Delete backup successful',
    // [Tip] No backup
    noBackup: 'No backup files',
    // [Label] Current path
    currentPath: 'Current Path',
    // [Tip] Current path tip
    currentPathTip: 'The directory path where the current language backup files are stored',
    // [Label] New path
    newPath: 'New Path',
    // [Tip] New path tip
    newPathTip: 'Enter the new language backup directory path, click OK to apply',
    // [Message] Set path failed
    setPathFailed: 'Failed to update backup path',
    // [Message] Set path success
    setPathSuccess: 'Backup path updated successfully'
  },

  // ==================== Create Language ====================
  createLang: {
    // [Action] Create language
    action: 'Create Language',
    // [Tip] Source language hint
    sourceHint: 'Source language is the master language. To change it, go to Super Panel -> Config -> Basic Settings',
    // [Message] Create language failed
    failed: 'Create language failed',
    // [Message] Create language success
    success: 'Create language successful',
    // [Tip] Create language tip
    tip: 'Create a new language file, the system will automatically generate the basic structure',
    // [Label] New language code
    code: 'Language Code',
    // [Tip] New language code not empty
    codeNotEmpty: 'Language code cannot be empty',
    // [Placeholder] New language code placeholder
    codePlaceholder: 'e.g. ja-JP, ko-KR',
    // [Tip] New language code tip
    codeTip: 'Unique identifier for the language, e.g. zh-CN, en-US',
    // [Label] New language name
    name: 'Language Name',
    // [Tip] New language name not empty
    nameNotEmpty: 'Language name cannot be empty',
    // [Placeholder] New language name placeholder
    namePlaceholder: 'e.g. 日本語, 한국어',
    // [Tip] New language name tip
    nameTip: 'Display name of the language',
    // [Description] Select language desc
    selectDesc: 'Select the language file to edit',
    // [Title] Select language title
    selectTitle: 'Select Language'
  },

  // ==================== Common Messages ====================
  common: {
    // [Message] Add failed
    addFailed: 'Add failed',
    // [Message] Add success
    addSuccess: 'Add successful',
    // [Message] Delete failed
    deleteFailed: 'Delete failed',
    // [Message] Delete success
    deleteSuccess: 'Delete successful',
    // [Message] Save failed
    saveFailed: 'Save failed',
    // [Message] Save success
    saveSuccess: 'Save successful',
    // [Message] Load file failed
    loadFileFailed: 'Failed to load language file',
    // [Message] Load file list failed
    loadFileListFailed: 'Failed to load language file list',
    // [Tip] No changes
    noChanges: 'No unsaved changes',
    // [Tip] Unsaved changes
    unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?'
  }
}
