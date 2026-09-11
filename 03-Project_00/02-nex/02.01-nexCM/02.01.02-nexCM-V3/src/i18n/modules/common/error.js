/**
 * 公共模块 - 业务错误码国际化字段
 * key 与后端 src/constants/errorCode.js 的 ERROR_CODE 一一对应，
 * 前端 request.js 按响应 code 动态查找 common.error.${code} 进行翻译。
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  // ==================== 通用参数错误 ====================
  // 【错误】参数错误
  PARAM_ERROR: '参数错误',
  // 【错误】缺少必填参数
  PARAM_MISSING: '缺少必填参数',
  // 【子模块】参数校验错误（支持 字段.校验类型 三级查找）
  PARAM_INVALID: {
    // 【错误】参数格式不正确（通用兜底）
    default: '参数格式不正确',
    // 【字段】密码
    password: {
      // 【校验】最小长度
      string_min: '密码最少{limit}个字符',
      // 【校验】最大长度
      string_max: '密码最多{limit}个字符',
      // 【校验】不能为空
      string_empty: '密码不能为空',
      // 【校验】必填
      any_required: '密码不能为空'
    },
    // 【字段】用户名
    username: {
      string_min: '用户名最少{limit}个字符',
      string_max: '用户名最多{limit}个字符',
      string_empty: '用户名不能为空',
      any_required: '用户名不能为空'
    },
    // 【字段】邮箱
    email: {
      string_email: '邮箱格式不正确',
      string_empty: '邮箱不能为空',
      any_required: '邮箱不能为空'
    },
    // 【校验】通用最小长度
    string_min: '{field}最少{limit}个字符',
    // 【校验】通用最大长度
    string_max: '{field}最多{limit}个字符',
    // 【校验】通用不能为空
    string_empty: '{field}不能为空',
    // 【校验】通用必填
    any_required: '{field}不能为空',
    // 【校验】必须为字符串
    string_base: '{field}必须是字符串',
    // 【校验】必须为数字
    number_base: '{field}必须是数字'
  },

  // ==================== 鉴权错误 ====================
  // 【错误】未登录
  UNAUTHORIZED: '未登录，请先登录',
  // 【错误】登录已过期
  TOKEN_EXPIRED: '登录已过期，请重新登录',
  // 【错误】Token无效
  TOKEN_INVALID: 'Token无效',
  // 【错误】被踢下线
  TOKEN_KICKED_OUT: '您已在其他设备登录，当前设备已下线',
  // 【错误】权限不足
  PERMISSION_DENIED: '权限不足',

  // ==================== 验证码错误 ====================
  // 【错误】验证码已失效
  CAPTCHA_EXPIRED: '验证码已失效，请重新获取',
  // 【错误】验证码错误
  CAPTCHA_ERROR: '验证码输入错误',

  // ==================== 资源/系统错误 ====================
  // 【错误】接口不存在
  NOT_FOUND: '接口不存在',
  // 【错误】系统错误
  SYSTEM_ERROR: '系统错误',
  // 【错误】数据库操作失败
  DATABASE_ERROR: '数据库操作失败',
  // 【错误】网络错误
  NETWORK_ERROR: '网络错误',
  // 【错误】未知错误
  UNKNOWN_ERROR: '未知错误',

  // ==================== 部门模块 ====================
  // 【错误】部门不存在
  DEPT_NOT_FOUND: '部门不存在',
  // 【错误】上级部门不能是自己
  DEPT_PARENT_INVALID: '上级部门不能设置为自己',
  // 【错误】存在子部门
  DEPT_HAS_CHILDREN: '存在子部门，无法删除',
  // 【错误】部门下有用户
  DEPT_HAS_USERS: '该部门下有用户，无法删除',

  // ==================== 角色模块 ====================
  // 【错误】角色不存在
  ROLE_NOT_FOUND: '角色不存在',
  // 【错误】角色编码已存在
  ROLE_CODE_EXISTS: '角色编码已存在',
  // 【错误】内置角色不可编辑
  ROLE_BASIC_CANNOT_EDIT: '系统内置角色不允许编辑',
  // 【错误】内置角色不可删除
  ROLE_BASIC_CANNOT_DELETE: '系统内置角色不允许删除',

  // ==================== 用户模块 ====================
  // 【错误】用户不存在
  USER_NOT_FOUND: '用户不存在',
  // 【错误】用户名已存在
  USER_USERNAME_EXISTS: '用户名已存在',
  // 【错误】密码错误
  USER_PASSWORD_ERROR: '密码错误',
  // 【错误】账号已禁用
  USER_DISABLED: '账号已被禁用',
  // 【错误】账户已锁定
  USER_LOCKED: '账户已锁定，请 {minutes} 分钟后再试',
  // 【错误】用户未被锁定
  USER_NOT_LOCKED: '该用户未被锁定',
  // 【错误】注册失败
  USER_REGISTER_FAIL: '注册失败',
  // 【错误】设备数达上限
  DEVICE_LIMIT_EXCEEDED: '在线设备数已达上限（最多 {maxDevices} 台），请联系管理员踢掉其他设备',

  // ==================== 字典模块 ====================
  // 【错误】字典类型不存在
  DICT_TYPE_NOT_FOUND: '字典类型不存在',
  // 【错误】字典类型编码已存在
  DICT_TYPE_CODE_EXISTS: '字典类型编码已存在',
  // 【错误】字典项不存在
  DICT_ITEM_NOT_FOUND: '字典项不存在',
  // 【错误】字典项值重复
  DICT_ITEM_VALUE_DUPLICATE: '同一字典类型下值不能重复',

  // ==================== 审计模块 ====================
  // 【错误】审计日志不可修改
  AUDIT_NOT_MODIFIABLE: '审计日志不允许修改',
  // 【错误】审计日志不可删除
  AUDIT_NOT_DELETABLE: '审计日志不允许删除',

  // ==================== 通知模块 ====================
  // 【错误】通知不存在
  NOTIFICATION_NOT_FOUND: '通知不存在',
  // 【错误】标题内容必填
  NOTIFICATION_TITLE_CONTENT_REQUIRED: '标题和内容不能为空',
  // 【错误】用户ID必填
  NOTIFICATION_USER_ID_REQUIRED: '用户ID不能为空（或使用 broadcast: true 广播）',

  // ==================== 客户模块 ====================
  // 【错误】客户不存在
  CUSTOMER_NOT_FOUND: '客户不存在',

  // ==================== 菜单模块 ====================
  // 【错误】用户ID必填
  MENU_USER_ID_REQUIRED: '用户ID不能为空',
  // 【错误】菜单未变更
  MENU_NOT_MODIFIED: '菜单未变更（缓存命中）',

  // ==================== 文件上传模块 ====================
  // 【错误】文件不存在
  FILE_NOT_EXIST: '请选择要上传的文件',
  // 【错误】文件路径为空
  FILE_PATH_EMPTY: '文件路径不能为空',
  // 【错误】文件路径非法
  FILE_PATH_INVALID: '非法的文件路径',
  // 【错误】文件过大
  FILE_TOO_LARGE: '文件大小超出限制',
  // 【错误】文件类型不允许
  FILE_TYPE_NOT_ALLOWED: '不支持的文件类型',
  // 【错误】文件上传失败
  FILE_UPLOAD_FAIL: '文件上传失败',
  // 【错误】文件删除失败
  FILE_DELETE_FAIL: '文件删除失败',
  // 【错误】文件数量超限
  FILE_LIMIT_EXCEEDED: '上传文件数量超出限制',
  // 【错误】意外的文件字段
  FILE_UNEXPECTED_FIELD: '意外的文件字段',

  // ==================== GitHub 图床模块 ====================
  // 【错误】图床配置不完整
  GITHUB_CONFIG_ERROR: 'GitHub 图床配置不完整',
  // 【错误】上传失败
  GITHUB_UPLOAD_FAIL: 'GitHub 上传失败',
  // 【错误】删除失败
  GITHUB_DELETE_FAIL: 'GitHub 文件删除失败',
  // 【错误】API调用失败
  GITHUB_API_ERROR: 'GitHub API 调用失败',

  // ==================== 邮箱模块 ====================
  // 【错误】邮箱配置不存在
  EMAIL_CONFIG_NOT_FOUND: '邮箱配置不存在',
  // 【错误】配置名称已存在
  EMAIL_CONFIG_NAME_EXISTS: '配置名称已存在',
  // 【错误】默认配置不可删除
  EMAIL_CONFIG_DEFAULT_CANNOT_DELETE: '默认配置不能删除，请先将其他配置设为默认',
  // 【错误】系统内置配置不可删除
  EMAIL_CONFIG_SYSTEM_CANNOT_DELETE: '系统内置配置不能删除',
  // 【错误】默认配置不可禁用
  EMAIL_CONFIG_DEFAULT_CANNOT_DISABLE: '默认配置不能禁用，请先将其他配置设为默认',
  // 【错误】仅启用配置可设默认
  EMAIL_CONFIG_ONLY_ENABLED_CAN_DEFAULT: '只能将启用的配置设为默认',
  // 【错误】配置名称必填
  EMAIL_NAME_REQUIRED: '配置名称不能为空',
  // 【错误】服务商必填
  EMAIL_PROVIDER_REQUIRED: '服务商不能为空',
  // 【错误】SMTP地址必填
  EMAIL_HOST_REQUIRED: 'SMTP服务器地址不能为空',
  // 【错误】SMTP端口必填
  EMAIL_PORT_REQUIRED: 'SMTP端口不能为空',
  // 【错误】邮箱账号必填
  EMAIL_USERNAME_REQUIRED: '邮箱账号不能为空',
  // 【错误】邮箱授权码必填
  EMAIL_PASSWORD_REQUIRED: '邮箱授权码不能为空',
  // 【错误】配置ID必填
  EMAIL_CONFIG_ID_REQUIRED: '配置ID不能为空',
  // 【错误】收件人必填
  EMAIL_TO_EMAIL_REQUIRED: '测试收件人邮箱不能为空',
  // 【错误】状态必填
  EMAIL_STATUS_REQUIRED: '状态不能为空',
  // 【错误】邮箱格式不正确
  EMAIL_FORMAT_INVALID: '邮箱格式不正确',
  // 【错误】配置校验失败
  EMAIL_VALIDATION_FAILED: '配置校验失败',
  // 【错误】测试邮件发送失败
  EMAIL_TEST_SEND_FAILED: '测试邮件发送失败',

  // ==================== 部件模块 ====================
  // 【错误】部件编码已存在
  PART_CODE_EXISTS: '部件编码 {partCode} 已存在',
  // 【错误】部件编码与原编码相同
  PART_CODE_SAME_AS_OLD: '新部件编码与原编码 {partCode} 相同，无需替换',
  // 【错误】规格型号不匹配
  PART_SPEC_NOT_MATCH: '规格型号 {userSpec} 与模板规格型号 {templateSpec} 不匹配，必须使用模板中定义的规格型号',
  // 【错误】额定寿命不匹配
  PART_RATED_LIFE_NOT_MATCH: '额定寿命 {userRatedLife} 与模板额定寿命 {templateRatedLife} 不匹配，必须使用模板中定义的额定寿命',
  // 【错误】模板编码已存在
  PART_TEMPLATE_KEY_EXISTS: '模板编码 {templateKey} 已存在',
  // 【错误】模板下有部件实例
  PART_TEMPLATE_HAS_PARTS: '该模板下有 {partCount} 个部件实例，不允许删除',
  // 【错误】基础模板不可编辑删除
  PART_TEMPLATE_IS_BASE: '基础模板不允许编辑或删除',

  // ==================== 授权错误 ====================
  // 【错误】软件授权已失效
  LICENSE_EXPIRED: '软件授权已失效，请导入授权文件',

  // ==================== HTTP 状态码（HTTP 层错误，非业务码） ====================
  http: {
    // 【HTTP 400】请求参数错误
    400: '请求参数错误',
    // 【HTTP 401】未授权
    401: '未授权，请重新登录',
    // 【HTTP 403】拒绝访问
    403: '拒绝访问，权限不足',
    // 【HTTP 404】地址不存在
    404: '请求地址不存在',
    // 【HTTP 500】服务器错误
    500: '服务器异常，请联系管理员',
    // 【HTTP 502】网关错误
    502: '网关错误，后端服务可能未启动',
    // 【HTTP 503】服务不可用
    503: '服务不可用',
    // 【HTTP 504】网关超时
    504: '请求超时，请稍后重试'
  }
}
