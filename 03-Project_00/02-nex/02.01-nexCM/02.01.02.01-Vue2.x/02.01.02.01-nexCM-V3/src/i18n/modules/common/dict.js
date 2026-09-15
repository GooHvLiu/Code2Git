/**
 * 公共模块 - 内置数据字典枚举国际化
 * 大厂规范：跨模块复用的枚举字典统一归 common，全局唯一权威来源
 * 数据来源：数据库 nex_dict_type / nex_dict_item 中 7 个内置字典（dict.js 工具按 code+value 动态取词）
 * 注意：不使用兜底方案，缺失字段直接显示 key；中英文结构必须一一对应
 */
export default {
  // ==================== 内置字典类型名 ====================
  types: {
    // 【字典类型】用户状态
    user_status: '用户状态',
    // 【字典类型】性别
    user_sex: '性别',
    // 【字典类型】用户角色
    user_role: '用户角色',
    // 【字典类型】审计操作类型
    audit_action: '审计操作类型',
    // 【字典类型】审计操作结果
    audit_result: '审计操作结果',
    // 【字典类型】通知类型
    notification_type: '通知类型',
    // 【字典类型】通知优先级
    notification_priority: '通知优先级'
  },

  // ==================== 内置字典项值（key 为数据库 item.value） ====================
  items: {
    // 用户状态
    user_status: {
      1: '启用',
      0: '禁用'
    },
    // 性别
    user_sex: {
      0: '未知',
      1: '男',
      2: '女'
    },
    // 用户角色
    user_role: {
      administrator: '管理员',
      engineer: '工程师',
      operator: '操作员'
    },
    // 审计操作类型
    audit_action: {
      USER_LOGIN: '用户登录',
      USER_REGISTER: '用户注册',
      USER_CREATE: '新增用户',
      USER_UPDATE: '修改用户',
      USER_DELETE: '删除用户',
      PLC_WRITE: 'PLC参数修改',
      SYSTEM_EXPORT: '数据导出',
      USER_LOGIN_FAILED: '用户登录失败',
      USER_LOGOUT: '用户登出',
      USER_BATCH_DELETE: '批量删除用户',
      USER_STATUS_CHANGE: '修改用户状态',
      USER_RESET_PASSWORD: '重置密码',
      PLC_READ: 'PLC参数读取',
      PLC_CONNECT: 'PLC连接',
      PLC_DISCONNECT: 'PLC断开',
      PLC_RECONNECT: 'PLC重连',
      SYSTEM_CONFIG_CHANGE: '系统配置修改',
      SYSTEM_IMPORT: '数据导入',
      AUDIT_VERIFY: '审计哈希链校验'
    },
    // 审计操作结果
    audit_result: {
      success: '成功',
      failed: '失败'
    },
    // 通知类型
    notification_type: {
      system: '系统通知',
      plc: 'PLC告警',
      user: '用户相关',
      audit: '审计相关'
    },
    // 通知优先级
    notification_priority: {
      normal: '普通',
      high: '高',
      critical: '紧急'
    }
  }
}
