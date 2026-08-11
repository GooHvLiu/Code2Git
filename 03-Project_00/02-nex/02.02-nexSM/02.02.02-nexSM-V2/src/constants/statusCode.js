/**
 * 状态枚举常量
 * 统一管理所有业务状态码，避免魔法数字
 * 所有枚举值严格与数据库字段定义对齐
 * 后续修改任何状态值/枚举值，只需改本文件，业务代码无需改动
 */

// ==================== 通用 ====================

/** 通用布尔值（0否 1是） */
const BOOLEAN = {
  FALSE: 0,  // 否
  TRUE: 1    // 是
};

/** 软删除标记（通用，所有表的 is_delete 字段） */
const IS_DELETE = {
  NORMAL: 0,   // 正常
  DELETED: 1   // 已删除
};

/** 启用/禁用状态（通用，大部分表的 status 字段） */
const COMMON_STATUS = {
  DISABLED: 0,  // 禁用
  ENABLED: 1    // 启用
};

// ==================== 用户模块 nex_user ====================

/** 用户账号状态 status tinyint：1启用 0禁用 */
const USER_STATUS = {
  DISABLED: 0,  // 禁用
  ENABLED: 1,   // 启用
  LOCKED: 2     // 锁定（预留，数据库暂未使用）
};

/** 用户岗位类别 role varchar(50)：administrator管理员 / engineer工程师 / operator操作员 */
const USER_ROLE = {
  ADMINISTRATOR: 'administrator',  // 管理员
  ENGINEER: 'engineer',            // 工程师
  OPERATOR: 'operator'             // 操作员
};

/** 用户性别 sex tinyint：0未知 1男 2女 */
const USER_SEX = {
  UNKNOWN: 0,  // 未知
  MALE: 1,     // 男
  FEMALE: 2    // 女
};

/** 是否首次登录 is_first_login tinyint(1)：1是 0否 */
const IS_FIRST_LOGIN = {
  NO: 0,   // 否（已完成首次信息完善）
  YES: 1   // 是（需要首次登录完善信息）
};

// ==================== 菜单模块 nex_menu ====================

/** 菜单是否隐藏 hidden tinyint：1隐藏 0显示 */
const MENU_HIDDEN = {
  SHOW: 0,    // 显示
  HIDDEN: 1   // 隐藏
};

/** 菜单是否始终显示根节点 always_show tinyint：1是 0否 */
const MENU_ALWAYS_SHOW = {
  NO: 0,  // 否
  YES: 1  // 是
};

/** 菜单是否不缓存 no_cache tinyint：1不缓存 0缓存 */
const MENU_NO_CACHE = {
  CACHE: 0,      // 缓存
  NO_CACHE: 1    // 不缓存
};

// ==================== 文件上传模块 files ====================

/** 文件存储类型 storage_type varchar：local本地 / github图床 */
const FILE_STORAGE_TYPE = {
  LOCAL: 'local',    // 本地存储
  GITHUB: 'github'   // GitHub图床
};

// ==================== 设备模块 ====================

const DEVICE_STATUS = {
  STOPPED: 0,    // 停机
  RUNNING: 1,    // 运行中
  FAULT: 2,      // 故障
  MAINTENANCE: 3 // 维护中
};

// ==================== 报警模块 ====================

const ALARM_STATUS = {
  UNHANDLED: 0,  // 未处理
  HANDLING: 1,   // 处理中
  RESOLVED: 2    // 已解决
};

const ALARM_LEVEL = {
  INFO: 1,      // 提示
  WARNING: 2,   // 警告
  ERROR: 3,     // 错误
  CRITICAL: 4   // 严重
};

// ==================== 工单模块 ====================

const ORDER_STATUS = {
  PENDING: 0,     // 待处理
  PROCESSING: 1,  // 处理中
  COMPLETED: 2,   // 已完成
  CLOSED: 3       // 已关闭
};

const ORDER_PRIORITY = {
  LOW: 1,      // 低
  NORMAL: 2,   // 中
  HIGH: 3,     // 高
  URGENT: 4    // 紧急
};

module.exports = {
  // 通用
  BOOLEAN,
  IS_DELETE,
  COMMON_STATUS,
  // 用户模块
  USER_STATUS,
  USER_ROLE,
  USER_SEX,
  IS_FIRST_LOGIN,
  // 菜单模块
  MENU_HIDDEN,
  MENU_ALWAYS_SHOW,
  MENU_NO_CACHE,
  // 文件上传
  FILE_STORAGE_TYPE,
  // 设备
  DEVICE_STATUS,
  // 报警
  ALARM_STATUS,
  ALARM_LEVEL,
  // 工单
  ORDER_STATUS,
  ORDER_PRIORITY
};
