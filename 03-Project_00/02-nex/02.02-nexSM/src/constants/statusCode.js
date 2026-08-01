/**
 * 状态枚举常量
 * 统一管理所有业务状态码，避免魔法数字
 */

// 用户状态
const USER_STATUS = {
  DISABLED: 0,  // 禁用
  ENABLED: 1,   // 启用
  LOCKED: 2     // 锁定
};

// 用户角色
const USER_ROLE = {
  ADMIN: 1,     // 管理员
  OPERATOR: 2,  // 运维人员
  VIEWER: 3     // 只读用户
};

// 设备状态
const DEVICE_STATUS = {
  STOPPED: 0,   // 停机
  RUNNING: 1,   // 运行中
  FAULT: 2,     // 故障
  MAINTENANCE: 3 // 维护中
};

// 报警状态
const ALARM_STATUS = {
  UNHANDLED: 0,  // 未处理
  HANDLING: 1,   // 处理中
  RESOLVED: 2    // 已解决
};

// 报警级别
const ALARM_LEVEL = {
  INFO: 1,      // 提示
  WARNING: 2,   // 警告
  ERROR: 3,     // 错误
  CRITICAL: 4   // 严重
};

// 工单状态
const ORDER_STATUS = {
  PENDING: 0,     // 待处理
  PROCESSING: 1,  // 处理中
  COMPLETED: 2,   // 已完成
  CLOSED: 3       // 已关闭
};

// 工单优先级
const ORDER_PRIORITY = {
  LOW: 1,      // 低
  NORMAL: 2,   // 中
  HIGH: 3,     // 高
  URGENT: 4    // 紧急
};

module.exports = {
  USER_STATUS,
  USER_ROLE,
  DEVICE_STATUS,
  ALARM_STATUS,
  ALARM_LEVEL,
  ORDER_STATUS,
  ORDER_PRIORITY
};
