/**
 * Common Module - Business Error Code Internationalization Fields (English)
 * Keys correspond one-to-one with backend ERROR_CODE in src/constants/errorCode.js.
 * The frontend request.js looks up common.error.${code} dynamically by response code.
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // ==================== General parameter errors ====================
  // [Error] Parameter error
  PARAM_ERROR: 'Parameter error',
  // [Error] Missing required parameter
  PARAM_MISSING: 'Missing required parameter',
  // [Submodule] Param validation error (supports field.type three-level lookup)
  PARAM_INVALID: {
    // [Error] Invalid parameter format (general)
    default: 'Invalid parameter format',
    // [Field] Password
    password: {
      // [Validation] Min length
      string_min: 'Password must be at least {limit} characters',
      // [Validation] Max length
      string_max: 'Password must be at most {limit} characters',
      // [Validation] Not empty
      string_empty: 'Password is required',
      // [Validation] Required
      any_required: 'Password is required'
    },
    // [Field] Username
    username: {
      string_min: 'Username must be at least {limit} characters',
      string_max: 'Username must be at most {limit} characters',
      string_empty: 'Username is required',
      any_required: 'Username is required'
    },
    // [Field] Email
    email: {
      string_email: 'Invalid email format',
      string_empty: 'Email is required',
      any_required: 'Email is required'
    },
    // [Validation] General min length
    string_min: '{field} must be at least {limit} characters',
    // [Validation] General max length
    string_max: '{field} must be at most {limit} characters',
    // [Validation] General not empty
    string_empty: '{field} is required',
    // [Validation] General required
    any_required: '{field} is required',
    // [Validation] Must be a string
    string_base: '{field} must be a string',
    // [Validation] Must be a number
    number_base: '{field} must be a number'
  },

  // ==================== Authentication errors ====================
  // [Error] Unauthorized
  UNAUTHORIZED: 'Please login first',
  // [Error] Token expired
  TOKEN_EXPIRED: 'Login expired, please login again',
  // [Error] Invalid token
  TOKEN_INVALID: 'Invalid token',
  // [Error] Kicked out
  TOKEN_KICKED_OUT: 'Your account has been logged in on another device, current device has been kicked offline',
  // [Error] Permission denied
  PERMISSION_DENIED: 'Permission denied',

  // ==================== Captcha errors ====================
  // [Error] Captcha expired
  CAPTCHA_EXPIRED: 'Captcha has expired, please get a new one',
  // [Error] Captcha error
  CAPTCHA_ERROR: 'Incorrect captcha',

  // ==================== Resource / system errors ====================
  // [Error] Not found
  NOT_FOUND: 'Interface not found',
  // [Error] System error
  SYSTEM_ERROR: 'System error',
  // [Error] Database error
  DATABASE_ERROR: 'Database operation failed',
  // [Error] Network error
  NETWORK_ERROR: 'Network error',
  // [Error] Unknown error
  UNKNOWN_ERROR: 'Unknown error',

  // ==================== Department module ====================
  // [Error] Department not found
  DEPT_NOT_FOUND: 'Department not found',
  // [Error] Parent invalid
  DEPT_PARENT_INVALID: 'Parent department cannot be set to itself',
  // [Error] Has children
  DEPT_HAS_CHILDREN: 'Has child departments, cannot delete',
  // [Error] Has users
  DEPT_HAS_USERS: 'There are users under this department, cannot delete',

  // ==================== Role module ====================
  // [Error] Role not found
  ROLE_NOT_FOUND: 'Role not found',
  // [Error] Role code exists
  ROLE_CODE_EXISTS: 'Role code already exists',
  // [Error] Built-in role cannot edit
  ROLE_BASIC_CANNOT_EDIT: 'Built-in roles cannot be edited',
  // [Error] Built-in role cannot delete
  ROLE_BASIC_CANNOT_DELETE: 'Built-in roles cannot be deleted',

  // ==================== User module ====================
  // [Error] User not found
  USER_NOT_FOUND: 'User not found',
  // [Error] Username exists
  USER_USERNAME_EXISTS: 'Username already exists',
  // [Error] Password error
  USER_PASSWORD_ERROR: 'Incorrect password',
  // [Error] User disabled
  USER_DISABLED: 'Account has been disabled',
  // [Error] User locked
  USER_LOCKED: 'Account has been locked, please try again in {minutes} minutes',
  // [Error] User not locked
  USER_NOT_LOCKED: 'This user is not locked',
  // [Error] Register failed
  USER_REGISTER_FAIL: 'Registration failed',
  // [Error] Device limit exceeded
  DEVICE_LIMIT_EXCEEDED: 'Online device limit reached (max {maxDevices} devices), please contact administrator to kick other devices',

  // ==================== Dictionary module ====================
  // [Error] Dict type not found
  DICT_TYPE_NOT_FOUND: 'Dictionary type not found',
  // [Error] Dict type code exists
  DICT_TYPE_CODE_EXISTS: 'Dictionary type code already exists',
  // [Error] Dict item not found
  DICT_ITEM_NOT_FOUND: 'Dictionary item not found',
  // [Error] Dict item value duplicate
  DICT_ITEM_VALUE_DUPLICATE: 'Values cannot be duplicated under the same dictionary type',

  // ==================== Audit module ====================
  // [Error] Audit not modifiable
  AUDIT_NOT_MODIFIABLE: 'Audit logs cannot be modified',
  // [Error] Audit not deletable
  AUDIT_NOT_DELETABLE: 'Audit logs cannot be deleted',

  // ==================== Notification module ====================
  // [Error] Notification not found
  NOTIFICATION_NOT_FOUND: 'Notification not found',
  // [Error] Title and content required
  NOTIFICATION_TITLE_CONTENT_REQUIRED: 'Title and content cannot be empty',
  // [Error] User ID required
  NOTIFICATION_USER_ID_REQUIRED: 'User ID cannot be empty (or use broadcast: true to broadcast)',

  // ==================== Customer module ====================
  // [Error] Customer not found
  CUSTOMER_NOT_FOUND: 'Customer not found',

  // ==================== Menu module ====================
  // [Error] User ID required
  MENU_USER_ID_REQUIRED: 'User ID cannot be empty',
  // [Error] Menu not modified
  MENU_NOT_MODIFIED: 'Menu unchanged (cache hit)',

  // ==================== File upload module ====================
  // [Error] File not exist
  FILE_NOT_EXIST: 'Please select a file to upload',
  // [Error] File path empty
  FILE_PATH_EMPTY: 'File path cannot be empty',
  // [Error] File path invalid
  FILE_PATH_INVALID: 'Invalid file path',
  // [Error] File too large
  FILE_TOO_LARGE: 'File size exceeds limit',
  // [Error] File type not allowed
  FILE_TYPE_NOT_ALLOWED: 'Unsupported file type',
  // [Error] File upload failed
  FILE_UPLOAD_FAIL: 'File upload failed',
  // [Error] File delete failed
  FILE_DELETE_FAIL: 'File deletion failed',
  // [Error] File limit exceeded
  FILE_LIMIT_EXCEEDED: 'Number of uploaded files exceeds limit',
  // [Error] Unexpected file field
  FILE_UNEXPECTED_FIELD: 'Unexpected file field',

  // ==================== GitHub image hosting module ====================
  // [Error] Config incomplete
  GITHUB_CONFIG_ERROR: 'GitHub image hosting configuration incomplete',
  // [Error] Upload failed
  GITHUB_UPLOAD_FAIL: 'GitHub upload failed',
  // [Error] Delete failed
  GITHUB_DELETE_FAIL: 'GitHub file deletion failed',
  // [Error] API error
  GITHUB_API_ERROR: 'GitHub API call failed',

  // ==================== Email module ====================
  // [Error] Config not found
  EMAIL_CONFIG_NOT_FOUND: 'Email configuration not found',
  // [Error] Config name exists
  EMAIL_CONFIG_NAME_EXISTS: 'Configuration name already exists',
  // [Error] Default cannot delete
  EMAIL_CONFIG_DEFAULT_CANNOT_DELETE: 'Default configuration cannot be deleted, please set another configuration as default first',
  // [Error] System config cannot delete
  EMAIL_CONFIG_SYSTEM_CANNOT_DELETE: 'System built-in configuration cannot be deleted',
  // [Error] Default cannot disable
  EMAIL_CONFIG_DEFAULT_CANNOT_DISABLE: 'Default configuration cannot be disabled, please set another configuration as default first',
  // [Error] Only enabled can be default
  EMAIL_CONFIG_ONLY_ENABLED_CAN_DEFAULT: 'Only enabled configurations can be set as default',
  // [Error] Name required
  EMAIL_NAME_REQUIRED: 'Configuration name cannot be empty',
  // [Error] Provider required
  EMAIL_PROVIDER_REQUIRED: 'Provider cannot be empty',
  // [Error] Host required
  EMAIL_HOST_REQUIRED: 'SMTP server address cannot be empty',
  // [Error] Port required
  EMAIL_PORT_REQUIRED: 'SMTP port cannot be empty',
  // [Error] Username required
  EMAIL_USERNAME_REQUIRED: 'Email account cannot be empty',
  // [Error] Password required
  EMAIL_PASSWORD_REQUIRED: 'Email authorization code cannot be empty',
  // [Error] Config ID required
  EMAIL_CONFIG_ID_REQUIRED: 'Configuration ID cannot be empty',
  // [Error] Recipient required
  EMAIL_TO_EMAIL_REQUIRED: 'Test recipient email cannot be empty',
  // [Error] Status required
  EMAIL_STATUS_REQUIRED: 'Status cannot be empty',
  // [Error] Email format invalid
  EMAIL_FORMAT_INVALID: 'Invalid email format',
  // [Error] Validation failed
  EMAIL_VALIDATION_FAILED: 'Configuration validation failed',
  // [Error] Test send failed
  EMAIL_TEST_SEND_FAILED: 'Test email sending failed',

  // ==================== Part module ====================
  // [Error] Part code exists
  PART_CODE_EXISTS: 'Part code {partCode} already exists',
  // [Error] Part code same as old
  PART_CODE_SAME_AS_OLD: 'New part code {partCode} is the same as the old code, no need to replace',
  // [Error] Spec not match
  PART_SPEC_NOT_MATCH: 'Spec model {userSpec} does not match template spec model {templateSpec}, must use the spec model defined in the template',
  // [Error] Rated life not match
  PART_RATED_LIFE_NOT_MATCH: 'Rated life {userRatedLife} does not match template rated life {templateRatedLife}, must use the rated life defined in the template',
  // [Error] Template key exists
  PART_TEMPLATE_KEY_EXISTS: 'Template code {templateKey} already exists',
  // [Error] Template has parts
  PART_TEMPLATE_HAS_PARTS: 'This template has {partCount} part instances, cannot delete',
  // [Error] Base template cannot edit/delete
  PART_TEMPLATE_IS_BASE: 'Base templates cannot be edited or deleted',

  // ==================== License error ====================
  // [Error] Software license expired
  LICENSE_EXPIRED: 'Software license expired, please import a license file',

  // ==================== HTTP status codes (HTTP-layer errors, not business codes) ====================
  http: {
    // [HTTP 400] Bad request
    400: 'Bad request',
    // [HTTP 401] Unauthorized
    401: 'Unauthorized, please sign in again',
    // [HTTP 403] Forbidden
    403: 'Access denied, insufficient permission',
    // [HTTP 404] Not found
    404: 'Request address not found',
    // [HTTP 500] Server error
    500: 'Server error, please contact the administrator',
    // [HTTP 502] Bad gateway
    502: 'Bad gateway, the backend service may be offline',
    // [HTTP 503] Service unavailable
    503: 'Service unavailable',
    // [HTTP 504] Gateway timeout
    504: 'Request timeout, please try again later'
  }
}
