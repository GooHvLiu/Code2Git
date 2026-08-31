/**
 * ==========================================
 * 接口响应业务码常量定义
 * ==========================================
 * 与后端 ERROR_CODE 一一对应
 *
 * 编码规则：
 * 200    - 成功
 * 10xxx  - 通用错误（参数、鉴权、系统）
 * 20xxx  - 用户模块
 * 30xxx  - 设备模块
 * 40xxx  - PLC模块
 * 50xxx  - 报警模块
 * 60xxx  - 工单模块
 * 70xxx  - 文件上传模块
 */

// ==================== 基础业务码 ====================
export const CODE_SUCCESS = 200

// ==================== 通用错误 10xxx ====================
export const CODE_PARAM_ERROR = 10001        // 参数错误
export const CODE_PARAM_MISSING = 10002      // 参数缺失
export const CODE_PARAM_INVALID = 10003      // 参数格式非法/参数无效

// ==================== 鉴权错误 101xx ====================
export const CODE_UNAUTHORIZED = 10101       // 未登录/未授权
export const CODE_TOKEN_EXPIRED = 10102      // Token已过期
export const CODE_TOKEN_INVALID = 10103      // Token无效
export const CODE_PERMISSION_DENIED = 10104  // 权限不足，拒绝访问
export const CODE_TOKEN_KICKED_OUT = 10105   // Token被踢下线（在其他设备登录）

// ==================== 资源不存在 ====================
export const CODE_NOT_FOUND = 10404           // 接口/资源不存在

// ==================== 菜单模块 ====================
export const CODE_MENU_NOT_MODIFIED = 10304   // 菜单未变更（缓存命中）

// ==================== 系统错误 105xx ====================
export const CODE_SYSTEM_ERROR = 10500       // 服务器内部系统异常
export const CODE_DATABASE_ERROR = 10501     // 数据库操作异常
export const CODE_NETWORK_ERROR = 10502      // 网络异常
export const CODE_UNKNOWN_ERROR = 10999      // 未知异常

// ==================== 用户模块 20xxx ====================
export const CODE_USER_NOT_EXIST = 20001      // 用户不存在
export const CODE_USER_ALREADY_EXIST = 20002  // 用户已存在
export const CODE_USER_PASSWORD_ERROR = 20003 // 密码错误
export const CODE_USER_DISABLED = 20004       // 用户已被禁用
export const CODE_USER_REGISTER_FAIL = 20005  // 用户注册失败
export const CODE_DEVICE_LIMIT_EXCEEDED = 20006 // 在线设备数已达上限

// ==================== 设备模块 30xxx ====================
export const CODE_DEVICE_NOT_EXIST = 30001       // 设备不存在
export const CODE_DEVICE_ALREADY_EXIST = 30002   // 设备已存在
export const CODE_DEVICE_OFFLINE = 30003         // 设备离线
export const CODE_DEVICE_CONTROL_FAIL = 30004    // 设备控制失败

// ==================== PLC模块 40xxx ====================
export const CODE_PLC_CONNECT_FAIL = 40001    // PLC连接失败
export const CODE_PLC_READ_FAIL = 40002       // PLC读取数据失败
export const CODE_PLC_WRITE_FAIL = 40003      // PLC写入数据失败
export const CODE_PLC_DATA_INVALID = 40004    // PLC返回数据无效

// ==================== 报警模块 50xxx ====================
export const CODE_ALARM_NOT_EXIST = 50001         // 报警记录不存在
export const CODE_ALARM_ALREADY_HANDLED = 50002   // 该报警已处理完成

// ==================== 工单模块 60xxx ====================
export const CODE_ORDER_NOT_EXIST = 60001         // 工单不存在
export const CODE_ORDER_STATUS_ERROR = 60002      // 工单状态异常
export const CODE_ORDER_ASSIGN_FAIL = 60003       // 工单分配失败

// ==================== 文件上传模块 70xxx ====================
export const CODE_FILE_NOT_EXIST = 70001             // 文件不存在
export const CODE_FILE_TOO_LARGE = 70002             // 文件大小超出限制
export const CODE_FILE_TYPE_NOT_ALLOWED = 70003      // 文件类型不允许
export const CODE_FILE_UPLOAD_FAIL = 70004           // 文件上传失败
export const CODE_FILE_DELETE_FAIL = 70005           // 文件删除失败
export const CODE_FILE_LIMIT_EXCEEDED = 70006        // 文件存储数量/容量超限
export const CODE_GITHUB_CONFIG_ERROR = 70101        // Github配置错误
export const CODE_GITHUB_UPLOAD_FAIL = 70102         // Github上传文件失败
export const CODE_GITHUB_DELETE_FAIL = 70103         // Github删除文件失败
export const CODE_GITHUB_API_ERROR = 70104           // Github接口调用异常

// ==================== 分组集合（业务逻辑直接使用） ====================

/** 需要自动清除token + 跳转登录的token错误码集合 */
export const TOKEN_AUTO_REDIRECT_CODES = [
  CODE_UNAUTHORIZED,
  CODE_TOKEN_EXPIRED,
  CODE_TOKEN_INVALID,
  CODE_TOKEN_KICKED_OUT
]

/** 不需要 token 的接口白名单 */
export const NO_TOKEN_API = ['/user/login', '/captcha/captchaImage', '/license/status', '/license/import']

/**
 * 错误码对应的提示文本
 * 仅用于控制台日志，业务提示优先后端返回 msg
 */
export const CODE_TEXT_MAP = {
  [CODE_SUCCESS]: '操作成功',

  [CODE_PARAM_ERROR]: '参数错误',
  [CODE_PARAM_MISSING]: '缺少必填参数',
  [CODE_PARAM_INVALID]: '参数格式不正确',

  [CODE_UNAUTHORIZED]: '未登录，请先登录',
  [CODE_TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [CODE_TOKEN_INVALID]: 'token无效',
  [CODE_PERMISSION_DENIED]: '权限不足',

  [CODE_SYSTEM_ERROR]: '系统错误',
  [CODE_DATABASE_ERROR]: '数据库操作失败',
  [CODE_NETWORK_ERROR]: '网络错误',
  [CODE_UNKNOWN_ERROR]: '未知错误',

  [CODE_USER_NOT_EXIST]: '用户不存在',
  [CODE_USER_ALREADY_EXIST]: '用户已存在',
  [CODE_USER_PASSWORD_ERROR]: '密码错误',
  [CODE_USER_DISABLED]: '账号已被禁用',
  [CODE_USER_REGISTER_FAIL]: '注册失败',

  [CODE_DEVICE_NOT_EXIST]: '设备不存在',
  [CODE_DEVICE_ALREADY_EXIST]: '设备已存在',
  [CODE_DEVICE_OFFLINE]: '设备离线',
  [CODE_DEVICE_CONTROL_FAIL]: '设备控制失败',

  [CODE_PLC_CONNECT_FAIL]: 'PLC连接失败',
  [CODE_PLC_READ_FAIL]: 'PLC数据读取失败',
  [CODE_PLC_WRITE_FAIL]: 'PLC参数下发失败',
  [CODE_PLC_DATA_INVALID]: 'PLC数据异常',

  [CODE_ALARM_NOT_EXIST]: '报警记录不存在',
  [CODE_ALARM_ALREADY_HANDLED]: '报警已处理',

  [CODE_ORDER_NOT_EXIST]: '工单不存在',
  [CODE_ORDER_STATUS_ERROR]: '工单状态错误',
  [CODE_ORDER_ASSIGN_FAIL]: '工单分配失败',

  [CODE_FILE_NOT_EXIST]: '文件不存在',
  [CODE_FILE_TOO_LARGE]: '文件大小超出限制',
  [CODE_FILE_TYPE_NOT_ALLOWED]: '不支持的文件类型',
  [CODE_FILE_UPLOAD_FAIL]: '文件上传失败',
  [CODE_FILE_DELETE_FAIL]: '文件删除失败',
  [CODE_FILE_LIMIT_EXCEEDED]: '上传文件数量超出限制',
  [CODE_GITHUB_CONFIG_ERROR]: 'GitHub 图床配置不完整',
  [CODE_GITHUB_UPLOAD_FAIL]: 'GitHub 图床上传失败',
  [CODE_GITHUB_DELETE_FAIL]: 'GitHub 图床删除失败',
  [CODE_GITHUB_API_ERROR]: 'GitHub API 调用失败'
}

// ==================== 权限角色常量 ====================

/**
 * 系统角色定义
 * 业务页面中通过 v-permission="['admin']" 或判断 roles 控制权限
 * 与后端返回的用户角色字段对应
 */
export const ROLES = {
  /** 超级管理员 - 所有权限 */
  ADMIN: 'admin',
  /** 工程师 - 设备操作、参数配置 */
  ENGINEER: 'engineer',
  /** 操作员 - 日常生产操作 */
  OPERATOR: 'operator',
  /** 管理员 - 用户管理、系统配置 */
  ADMINISTRATOR: 'administrator',
  /** 访客 - 只读权限 */
  GUEST: 'guest'
}

/** 设备类型（与后端字典对应，预留） */
export const DEVICE_TYPES = {
  FILLING: 'filling',       // 灌装机
  STOPPER: 'stopper',       // 加塞机
  INTEGRATED: 'integrated'  // 灌装加塞一体机
}
