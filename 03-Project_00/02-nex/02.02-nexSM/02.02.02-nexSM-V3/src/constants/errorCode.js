/**
 * 业务错误码常量
 *
 * 编码规则：
 * - 字符串类型错误码（可读性好，前端直接用作国际化 key）
 * - 通用错误：PARAM_*, AUTH_*, SYSTEM_*
 * - 模块错误：模块名_错误类型，如 DEPT_HAS_USERS、USER_NOT_FOUND
 *
 * 错误响应格式：
 * { code: 'DEPT_HAS_USERS', msg: '调试用中文', data: { count: 1 }, timestamp: 123 }
 *
 * 前端根据 code 做国际化，用 data 中的动态参数填充模板
 */

const ERROR_CODE = {
  // ==================== 通用成功 ====================
  SUCCESS: 200,

  // ==================== 通用错误 ====================
  PARAM_ERROR: 'PARAM_ERROR',           // 参数错误
  PARAM_MISSING: 'PARAM_MISSING',       // 参数缺失
  PARAM_INVALID: 'PARAM_INVALID',       // 参数格式非法/参数无效

  // ==================== 鉴权错误 ====================
  UNAUTHORIZED: 'UNAUTHORIZED',         // 未登录/未授权
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',       // Token已过期
  TOKEN_INVALID: 'TOKEN_INVALID',       // Token无效
  TOKEN_KICKED_OUT: 'TOKEN_KICKED_OUT', // Token被踢下线（在其他设备登录）
  PERMISSION_DENIED: 'PERMISSION_DENIED', // 权限不足

  // ==================== 验证码错误 ====================
  CAPTCHA_EXPIRED: 'CAPTCHA_EXPIRED',   // 验证码已失效
  CAPTCHA_ERROR: 'CAPTCHA_ERROR',       // 验证码输入错误

  // ==================== 资源不存在 ====================
  NOT_FOUND: 'NOT_FOUND',               // 接口/资源不存在

  // ==================== 系统错误 ====================
  SYSTEM_ERROR: 'SYSTEM_ERROR',         // 服务器内部系统异常
  DATABASE_ERROR: 'DATABASE_ERROR',     // 数据库操作异常
  NETWORK_ERROR: 'NETWORK_ERROR',       // 网络异常
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',       // 未知异常

  // ==================== 部门模块 ====================
  DEPT_NOT_FOUND: 'DEPT_NOT_FOUND',           // 部门不存在
  DEPT_PARENT_INVALID: 'DEPT_PARENT_INVALID', // 上级部门不能设置为自己
  DEPT_HAS_CHILDREN: 'DEPT_HAS_CHILDREN',     // 存在子部门，无法删除
  DEPT_HAS_USERS: 'DEPT_HAS_USERS',           // 部门下有用户，无法删除

  // ==================== 角色模块 ====================
  ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',       // 角色不存在
  ROLE_CODE_EXISTS: 'ROLE_CODE_EXISTS',   // 角色编码已存在

  // ==================== 用户模块 ====================
  USER_NOT_FOUND: 'USER_NOT_FOUND',           // 用户不存在
  USER_USERNAME_EXISTS: 'USER_USERNAME_EXISTS', // 用户名已存在
  USER_PASSWORD_ERROR: 'USER_PASSWORD_ERROR',   // 密码错误
  USER_DISABLED: 'USER_DISABLED',               // 账号已被禁用
  USER_LOCKED: 'USER_LOCKED',                   // 账户已锁定
  USER_REGISTER_FAIL: 'USER_REGISTER_FAIL',     // 用户注册失败
  DEVICE_LIMIT_EXCEEDED: 'DEVICE_LIMIT_EXCEEDED', // 在线设备数已达上限

  // ==================== 字典模块 ====================
  DICT_TYPE_NOT_FOUND: 'DICT_TYPE_NOT_FOUND',     // 字典类型不存在
  DICT_TYPE_CODE_EXISTS: 'DICT_TYPE_CODE_EXISTS', // 字典类型编码已存在
  DICT_ITEM_NOT_FOUND: 'DICT_ITEM_NOT_FOUND',     // 字典项不存在
  DICT_ITEM_VALUE_DUPLICATE: 'DICT_ITEM_VALUE_DUPLICATE', // 同一字典类型下值不能重复

  // ==================== 审计模块 ====================
  AUDIT_NOT_MODIFIABLE: 'AUDIT_NOT_MODIFIABLE', // 审计日志不允许修改
  AUDIT_NOT_DELETABLE: 'AUDIT_NOT_DELETABLE',   // 审计日志不允许删除

  // ==================== 通知模块 ====================
  NOTIFICATION_NOT_FOUND: 'NOTIFICATION_NOT_FOUND', // 通知不存在

  // ==================== 客户模块 ====================
  CUSTOMER_NOT_FOUND: 'CUSTOMER_NOT_FOUND', // 客户不存在

  // ==================== 菜单模块 ====================
  MENU_USER_ID_REQUIRED: 'MENU_USER_ID_REQUIRED', // 用户ID不能为空

  // ==================== 文件上传模块 ====================
  FILE_NOT_EXIST: 'FILE_NOT_EXIST',               // 文件不存在/请选择要上传的文件
  FILE_PATH_EMPTY: 'FILE_PATH_EMPTY',             // 文件路径不能为空
  FILE_PATH_INVALID: 'FILE_PATH_INVALID',         // 非法的文件路径
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',               // 文件大小超出限制
  FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED', // 文件类型不允许
  FILE_UPLOAD_FAIL: 'FILE_UPLOAD_FAIL',           // 文件上传失败
  FILE_DELETE_FAIL: 'FILE_DELETE_FAIL',           // 文件删除失败
  FILE_LIMIT_EXCEEDED: 'FILE_LIMIT_EXCEEDED',     // 上传文件数量超出限制
  FILE_UNEXPECTED_FIELD: 'FILE_UNEXPECTED_FIELD', // 意外的文件字段

  // ==================== GitHub 图床模块 ====================
  GITHUB_CONFIG_ERROR: 'GITHUB_CONFIG_ERROR',     // GitHub 图床配置不完整
  GITHUB_UPLOAD_FAIL: 'GITHUB_UPLOAD_FAIL',       // GitHub 上传失败
  GITHUB_DELETE_FAIL: 'GITHUB_DELETE_FAIL',       // GitHub 文件删除失败
  GITHUB_API_ERROR: 'GITHUB_API_ERROR',           // GitHub API 调用失败
};

// 错误码对应消息（调试用，中文，开发环境看日志方便）
const ERROR_MESSAGE = {
  [ERROR_CODE.SUCCESS]: '操作成功',

  [ERROR_CODE.PARAM_ERROR]: '参数错误',
  [ERROR_CODE.PARAM_MISSING]: '缺少必填参数',
  [ERROR_CODE.PARAM_INVALID]: '参数格式不正确',

  [ERROR_CODE.UNAUTHORIZED]: '未登录，请先登录',
  [ERROR_CODE.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [ERROR_CODE.TOKEN_INVALID]: 'token无效',
  [ERROR_CODE.PERMISSION_DENIED]: '权限不足',

  [ERROR_CODE.CAPTCHA_EXPIRED]: '验证码已失效，请重新获取',
  [ERROR_CODE.CAPTCHA_ERROR]: '验证码输入错误',

  [ERROR_CODE.NOT_FOUND]: '接口不存在',

  [ERROR_CODE.SYSTEM_ERROR]: '系统错误',
  [ERROR_CODE.DATABASE_ERROR]: '数据库操作失败',
  [ERROR_CODE.NETWORK_ERROR]: '网络错误',
  [ERROR_CODE.UNKNOWN_ERROR]: '未知错误',

  [ERROR_CODE.DEPT_NOT_FOUND]: '部门不存在',
  [ERROR_CODE.DEPT_PARENT_INVALID]: '上级部门不能设置为自己',
  [ERROR_CODE.DEPT_HAS_CHILDREN]: '存在子部门，无法删除',
  [ERROR_CODE.DEPT_HAS_USERS]: '该部门下有用户，无法删除',

  [ERROR_CODE.ROLE_NOT_FOUND]: '角色不存在',
  [ERROR_CODE.ROLE_CODE_EXISTS]: '角色编码已存在',

  [ERROR_CODE.USER_NOT_FOUND]: '用户不存在',
  [ERROR_CODE.USER_USERNAME_EXISTS]: '用户名已存在',
  [ERROR_CODE.USER_PASSWORD_ERROR]: '密码错误',
  [ERROR_CODE.USER_DISABLED]: '账号已被禁用',
  [ERROR_CODE.USER_LOCKED]: '账户已锁定',
  [ERROR_CODE.USER_REGISTER_FAIL]: '注册失败',

  [ERROR_CODE.DICT_TYPE_NOT_FOUND]: '字典类型不存在',
  [ERROR_CODE.DICT_TYPE_CODE_EXISTS]: '字典类型编码已存在',
  [ERROR_CODE.DICT_ITEM_NOT_FOUND]: '字典项不存在',
  [ERROR_CODE.DICT_ITEM_VALUE_DUPLICATE]: '同一字典类型下值不能重复',

  [ERROR_CODE.AUDIT_NOT_MODIFIABLE]: '审计日志不允许修改',
  [ERROR_CODE.AUDIT_NOT_DELETABLE]: '审计日志不允许删除',

  [ERROR_CODE.NOTIFICATION_NOT_FOUND]: '通知不存在',

  [ERROR_CODE.CUSTOMER_NOT_FOUND]: '客户不存在',

  [ERROR_CODE.MENU_USER_ID_REQUIRED]: '用户ID不能为空',

  [ERROR_CODE.FILE_NOT_EXIST]: '请选择要上传的文件',
  [ERROR_CODE.FILE_PATH_EMPTY]: '文件路径不能为空',
  [ERROR_CODE.FILE_PATH_INVALID]: '非法的文件路径',
  [ERROR_CODE.FILE_TOO_LARGE]: '文件大小超出限制',
  [ERROR_CODE.FILE_TYPE_NOT_ALLOWED]: '不支持的文件类型',
  [ERROR_CODE.FILE_UPLOAD_FAIL]: '文件上传失败',
  [ERROR_CODE.FILE_DELETE_FAIL]: '文件删除失败',
  [ERROR_CODE.FILE_LIMIT_EXCEEDED]: '上传文件数量超出限制',
  [ERROR_CODE.FILE_UNEXPECTED_FIELD]: '意外的文件字段',

  [ERROR_CODE.GITHUB_CONFIG_ERROR]: 'GitHub 图床配置不完整',
  [ERROR_CODE.GITHUB_UPLOAD_FAIL]: 'GitHub 上传失败',
  [ERROR_CODE.GITHUB_DELETE_FAIL]: 'GitHub 文件删除失败',
  [ERROR_CODE.GITHUB_API_ERROR]: 'GitHub API 调用失败',
};

module.exports = {
  ERROR_CODE,
  ERROR_MESSAGE
};
