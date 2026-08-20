/**
 * 业务错误码常量
 * 编码规则：
 * 200    - 成功
 * 10xxx  - 通用错误（参数、鉴权、系统）
 * 20xxx  - 用户模块
 * 30xxx  - 设备模块
 * 40xxx  - PLC模块
 * 50xxx  - 报警模块
 * 60xxx  - 工单模块
 */

const ERROR_CODE = {
  // ==================== 通用成功 ====================
  SUCCESS: 200,

  // ==================== 通用错误 10xxx ====================

  PARAM_ERROR: 10001,// 参数错误
  PARAM_MISSING: 10002,// 参数缺失
  PARAM_INVALID: 10003,// 参数格式非法/参数无效

  // ==================== 鉴权错误 ====================

  UNAUTHORIZED: 10101,// 未登录/未授权
  TOKEN_EXPIRED: 10102,// Token已过期
  TOKEN_INVALID: 10103,// Token无效
  PERMISSION_DENIED: 10104,// 权限不足，拒绝访问

  // ==================== 验证码错误 ====================
  CAPTCHA_EXPIRED: 10201,  // 验证码已失效/过期
  CAPTCHA_ERROR: 10202,    // 验证码输入错误

  // ==================== 资源不存在 ====================
  NOT_FOUND: 10404,        // 接口/资源不存在

  // ==================== 菜单模块 ====================
  MENU_NOT_MODIFIED: 10304, // 菜单未变更（缓存命中）

  // ==================== 系统错误 ====================
  SYSTEM_ERROR: 10500,// 服务器内部系统异常
  DATABASE_ERROR: 10501,// 数据库操作异常
  NETWORK_ERROR: 10502,// 网络异常
  UNKNOWN_ERROR: 10999,// 未知异常

  // ==================== 用户模块 20xxx ====================
  USER_NOT_EXIST: 20001,        // 用户不存在
  USER_ALREADY_EXIST: 20002,    // 用户已存在
  USER_PASSWORD_ERROR: 20003,   // 密码错误
  USER_DISABLED: 20004,         // 用户已被禁用
  USER_REGISTER_FAIL: 20005,     // 用户注册失败

  // ==================== 设备模块 30xxx ====================
  DEVICE_NOT_EXIST: 30001,      // 设备不存在
  DEVICE_ALREADY_EXIST: 30002,  // 设备已存在
  DEVICE_OFFLINE: 30003,        // 设备离线
  DEVICE_CONTROL_FAIL: 30004,   // 设备控制失败

  // ==================== PLC模块 40xxx ====================
  PLC_CONNECT_FAIL: 40001,      // PLC连接失败
  PLC_READ_FAIL: 40002,         // PLC读取数据失败
  PLC_WRITE_FAIL: 40003,        // PLC写入数据失败
  PLC_DATA_INVALID: 40004,       // PLC返回数据无效

  // ==================== 报警模块 50xxx ====================
  ALARM_NOT_EXIST: 50001,       // 报警记录不存在
  ALARM_ALREADY_HANDLED: 50002, // 该报警已处理完成

  // ==================== 工单模块 60xxx ====================
  ORDER_NOT_EXIST: 60001,       // 工单不存在
  ORDER_STATUS_ERROR: 60002,    // 工单状态异常，不允许当前操作
  ORDER_ASSIGN_FAIL: 60003,     // 工单分配失败

  // ==================== 文件上传模块 70xxx ====================
  FILE_NOT_EXIST: 70001,            // 文件不存在
  FILE_TOO_LARGE: 70002,            // 文件大小超出限制
  FILE_TYPE_NOT_ALLOWED: 70003,     // 文件类型不允许
  FILE_UPLOAD_FAIL: 70004,          // 文件上传失败
  FILE_DELETE_FAIL: 70005,          // 文件删除失败
  FILE_LIMIT_EXCEEDED: 70006,       // 文件存储数量/容量超限
  GITHUB_CONFIG_ERROR: 70101,       // Github配置错误
  GITHUB_UPLOAD_FAIL: 70102,        // Github上传文件失败
  GITHUB_DELETE_FAIL: 70103,        // Github删除文件失败
  GITHUB_API_ERROR: 70104           // Github接口调用异常
};

// 错误码对应消息
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

  [ERROR_CODE.USER_NOT_EXIST]: '用户不存在',
  [ERROR_CODE.USER_ALREADY_EXIST]: '用户已存在',
  [ERROR_CODE.USER_PASSWORD_ERROR]: '密码错误',
  [ERROR_CODE.USER_DISABLED]: '账号已被禁用',
  [ERROR_CODE.USER_REGISTER_FAIL]: '注册失败',

  [ERROR_CODE.DEVICE_NOT_EXIST]: '设备不存在',
  [ERROR_CODE.DEVICE_ALREADY_EXIST]: '设备已存在',
  [ERROR_CODE.DEVICE_OFFLINE]: '设备离线',
  [ERROR_CODE.DEVICE_CONTROL_FAIL]: '设备控制失败',

  [ERROR_CODE.PLC_CONNECT_FAIL]: 'PLC连接失败',
  [ERROR_CODE.PLC_READ_FAIL]: 'PLC数据读取失败',
  [ERROR_CODE.PLC_WRITE_FAIL]: 'PLC参数下发失败',
  [ERROR_CODE.PLC_DATA_INVALID]: 'PLC数据异常',

  [ERROR_CODE.ALARM_NOT_EXIST]: '报警记录不存在',
  [ERROR_CODE.ALARM_ALREADY_HANDLED]: '报警已处理',

  [ERROR_CODE.ORDER_NOT_EXIST]: '工单不存在',
  [ERROR_CODE.ORDER_STATUS_ERROR]: '工单状态错误',
  [ERROR_CODE.ORDER_ASSIGN_FAIL]: '工单分配失败',

  [ERROR_CODE.FILE_NOT_EXIST]: '文件不存在',
  [ERROR_CODE.FILE_TOO_LARGE]: '文件大小超出限制',
  [ERROR_CODE.FILE_TYPE_NOT_ALLOWED]: '不支持的文件类型',
  [ERROR_CODE.FILE_UPLOAD_FAIL]: '文件上传失败',
  [ERROR_CODE.FILE_DELETE_FAIL]: '文件删除失败',
  [ERROR_CODE.FILE_LIMIT_EXCEEDED]: '上传文件数量超出限制',
  [ERROR_CODE.GITHUB_CONFIG_ERROR]: 'GitHub 图床配置不完整',
  [ERROR_CODE.GITHUB_UPLOAD_FAIL]: 'GitHub 图床上传失败',
  [ERROR_CODE.GITHUB_DELETE_FAIL]: 'GitHub 图床删除失败',
  [ERROR_CODE.GITHUB_API_ERROR]: 'GitHub API 调用失败'
};

module.exports = {
  ERROR_CODE,
  ERROR_MESSAGE
};
