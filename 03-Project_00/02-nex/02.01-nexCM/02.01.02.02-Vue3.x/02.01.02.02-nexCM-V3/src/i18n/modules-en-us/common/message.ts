/**
 * Common Module - Message Internationalization Fields
 * Common message prompts, dialog titles, confirmation text for all pages
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // [Message] Loading
  loading: 'Loading...',
  // [Message] Create successful
  createSuccess: 'Created successfully',
  // [Message] Add successful
  addSuccess: 'Added successfully',
  // [Message] Save successful
  saveSuccess: 'Saved successfully',
  // [Message] Delete successful
  deleteSuccess: 'Deleted successfully',
  // [Message] Update successful
  updateSuccess: 'Updated successfully',
  // [Message] Refresh successful
  refreshSuccess: 'Refreshed successfully',
  // [Message] Reset succeeded
  resetSuccess: 'Reset succeeded',
  // [Message] Operation failed (general)
  operationFailed: 'Operation failed',
  // [Message] Tip
  tip: 'Tip',
  // [Message] Warning
  warning: 'Warning',
  // [Message] Delete confirmation
  deleteConfirm: 'Delete Confirmation',
  // [Message] Delete confirmation message (with name param)
  deleteConfirmMessage: 'Are you sure you want to delete "{name}"?',
  // [Message] Default delete confirmation message (no name)
  deleteConfirmDefault: 'Are you sure you want to delete? This action cannot be undone.',
  // [Message] Batch operation confirmation
  batchConfirm: 'Batch Operation Confirmation',
  // [Message] Batch confirmation message (count/action params)
  batchConfirmMessage: '{count} item(s) selected. Execute {action}?',
  // [Message] Generic action
  action: 'Action',
  // [Message] Logout confirmation message
  logoutConfirmMessage: 'Are you sure you want to log out?',
  // [Message] Duplicate request cancellation reason
  requestCancelDuplicate: 'Duplicate request; previous request cancelled automatically',
  // [Message] Route change cancellation reason
  requestCancelRouteChange: 'Route changed; pending request cancelled',
  // [Message] Dangerous operation
  dangerOperation: 'Dangerous Operation',
  // [Message] Logout confirmation
  logoutConfirm: 'Logout Confirmation',
  // [Message] No data to export
  noDataToExport: 'No data to export',
  // [Message] No columns to export
  noColumnsToExport: 'No columns to export',
  // [Message] Export succeeded (count param)
  exportSuccess: 'Successfully exported {count} records',
  // [Message] Export data (PDF title)
  exportData: 'Exported Data',
  // [Message] Exporter
  exporter: 'Exported by',
  // [Message] Export time
  exportTime: 'Exported at',
  // [Message] Record count prefix
  recordCountPrefix: 'Total',
  // [Message] Record count suffix
  recordCountSuffix: 'records',
  // [Message] PDF export failed
  pdfExportFailed: 'PDF export failed, please try again',
  // [Message] Unsupported export format
  unsupportedExportFormat: 'Unsupported export format',
  // [Message] Download succeeded
  downloadSuccess: 'Download succeeded',
  // [Message] Download failed
  downloadFailed: 'Download failed',
  // [Message] Dangerous action requires typing the given text (text param)
  confirmTextRequired: 'Please enter "{text}" to confirm',
  // [Message] System name
  systemName: 'nexCM Standard',
  // [Message] System description
  systemDESC: 'Desktop Filling and Stoppering Equipment'
}
