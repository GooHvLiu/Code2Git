/**
 * ==========================================
 * 审计规则配置
 * ==========================================
 * 定义哪些操作需要记录审计日志，以及对应的配置
 * 可根据业务需求灵活调整
 *
 * 事件类型命名规范：模块.操作
 * 例如：user.register、config.update、device.param.change
 *
 * 国际化说明：
 * - titleKey: 操作类型的国际化 key（前端使用 $t(titleKey) 渲染）
 * - moduleKey: 所属模块的国际化 key（用于分类展示）
 * - 动态参数通过 variables 传入，前端渲染时自动填充
 *
 * 配置说明：
 * - enabled: 是否启用该操作的审计日志
 * - requireReason: 是否要求填写操作原因（GMP要求）
 * - recordChange: 是否记录修改前后的值（oldValue/newValue）
 * - priority: 优先级（high/normal/low），用于统计和告警
 * - notifyRoles: 该操作发生时需要通知的角色（预留，用于实时监控）
 */

module.exports = {
  // 是否启用审计功能
  enabled: true,

  // 审计规则列表（按模块分类）
  rules: [
    // ==================== 1. 用户管理 ====================
    {
      // 用户注册
      actionType: 'user.register',
      titleKey: 'audit.user.register.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: false,
      recordChange: true,
      priority: 'normal',
      notifyRoles: ['administrator']
    },
    {
      // 用户登录
      actionType: 'user.login',
      titleKey: 'audit.user.login.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // 用户登录失败
      actionType: 'user.loginFailed',
      titleKey: 'audit.user.loginFailed.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 用户登出
      actionType: 'user.logout',
      titleKey: 'audit.user.logout.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'low',
      notifyRoles: []
    },
    {
      // 管理员创建用户
      actionType: 'user.create',
      titleKey: 'audit.user.create.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 修改用户信息
      actionType: 'user.update',
      titleKey: 'audit.user.update.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 删除用户
      actionType: 'user.delete',
      titleKey: 'audit.user.delete.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 批量删除用户
      actionType: 'user.batchDelete',
      titleKey: 'audit.user.batchDelete.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 修改用户状态
      actionType: 'user.statusChange',
      titleKey: 'audit.user.statusChange.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 重置密码
      actionType: 'user.resetPassword',
      titleKey: 'audit.user.resetPassword.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 修改密码
      actionType: 'user.changePassword',
      titleKey: 'audit.user.changePassword.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: false,
      recordChange: true,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // 用户角色变更
      actionType: 'user.roleChange',
      titleKey: 'audit.user.roleChange.title',
      moduleKey: 'audit.module.user',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },

    // ==================== 2. 权限管理 ====================
    {
      // 创建角色
      actionType: 'role.create',
      titleKey: 'audit.role.create.title',
      moduleKey: 'audit.module.permission',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 修改角色
      actionType: 'role.update',
      titleKey: 'audit.role.update.title',
      moduleKey: 'audit.module.permission',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 删除角色
      actionType: 'role.delete',
      titleKey: 'audit.role.delete.title',
      moduleKey: 'audit.module.permission',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 权限配置变更
      actionType: 'permission.change',
      titleKey: 'audit.permission.change.title',
      moduleKey: 'audit.module.permission',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 权限缓存清除
      actionType: 'permission.cacheClear',
      titleKey: 'audit.permission.cacheClear.title',
      moduleKey: 'audit.module.permission',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'normal',
      notifyRoles: []
    },

    // ==================== 3. 系统配置 ====================
    {
      // 系统参数修改
      actionType: 'config.system.change',
      titleKey: 'audit.config.system.change.title',
      moduleKey: 'audit.module.config',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 安全配置修改
      actionType: 'config.security.change',
      titleKey: 'audit.config.security.change.title',
      moduleKey: 'audit.module.config',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // PLC连接配置修改
      actionType: 'config.plc.change',
      titleKey: 'audit.config.plc.change.title',
      moduleKey: 'audit.module.config',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator', 'engineer']
    },
    {
      // 导出配置修改
      actionType: 'config.export.change',
      titleKey: 'audit.config.export.change.title',
      moduleKey: 'audit.module.config',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'normal',
      notifyRoles: ['administrator']
    },
    {
      // 连接配置修改
      actionType: 'config.connection.change',
      titleKey: 'audit.config.connection.change.title',
      moduleKey: 'audit.module.config',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator', 'engineer']
    },
    {
      // 设备配置修改
      actionType: 'config.device.change',
      titleKey: 'audit.config.device.change.title',
      moduleKey: 'audit.module.config',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator', 'engineer']
    },
    {
      // 订单配置修改
      actionType: 'config.order.change',
      titleKey: 'audit.config.order.change.title',
      moduleKey: 'audit.module.config',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'normal',
      notifyRoles: ['administrator']
    },

    // ==================== 4. 设备管理 ====================
    {
      // 设备状态变更
      actionType: 'device.statusChange',
      titleKey: 'audit.device.statusChange.title',
      moduleKey: 'audit.module.device',
      enabled: true,
      requireReason: false,
      recordChange: true,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // 设备参数修改
      actionType: 'device.paramChange',
      titleKey: 'audit.device.paramChange.title',
      moduleKey: 'audit.module.device',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator', 'engineer']
    },
    {
      // 部件寿命-新增
      actionType: 'device.part.create',
      titleKey: 'audit.device.part.create.title',
      moduleKey: 'audit.module.device',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // 部件寿命-编辑
      actionType: 'device.part.update',
      titleKey: 'audit.device.part.update.title',
      moduleKey: 'audit.module.device',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // 部件寿命-更换
      actionType: 'device.part.replace',
      titleKey: 'audit.device.part.replace.title',
      moduleKey: 'audit.module.device',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // 部件寿命-删除
      actionType: 'device.part.delete',
      titleKey: 'audit.device.part.delete.title',
      moduleKey: 'audit.module.device',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 报警处理
      actionType: 'device.alarm.handle',
      titleKey: 'audit.device.alarm.handle.title',
      moduleKey: 'audit.module.device',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'normal',
      notifyRoles: []
    },

    // ==================== 5. 生产管理 ====================
    {
      // 配方下载
      actionType: 'production.recipe.download',
      titleKey: 'audit.production.recipe.download.title',
      moduleKey: 'audit.module.production',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // 生产订单-新增
      actionType: 'production.order.create',
      titleKey: 'audit.production.order.create.title',
      moduleKey: 'audit.module.production',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // 生产订单-编辑
      actionType: 'production.order.update',
      titleKey: 'audit.production.order.update.title',
      moduleKey: 'audit.module.production',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // 生产订单-删除
      actionType: 'production.order.delete',
      titleKey: 'audit.production.order.delete.title',
      moduleKey: 'audit.module.production',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 生产订单-下载
      actionType: 'production.order.download',
      titleKey: 'audit.production.order.download.title',
      moduleKey: 'audit.module.production',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'normal',
      notifyRoles: []
    },

    // ==================== 6. 数据管理 ====================
    {
      // 数据导出
      actionType: 'data.export',
      titleKey: 'audit.data.export.title',
      moduleKey: 'audit.module.data',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // 数据查看详情
      actionType: 'data.viewDetail',
      titleKey: 'audit.data.viewDetail.title',
      moduleKey: 'audit.module.data',
      enabled: false, // 默认不启用，太频繁
      requireReason: false,
      recordChange: false,
      priority: 'low',
      notifyRoles: []
    },

    // ==================== 7. PLC操作 ====================
    {
      // PLC参数写入
      actionType: 'plc.write',
      titleKey: 'audit.plc.write.title',
      moduleKey: 'audit.module.plc',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator', 'engineer']
    },
    {
      // PLC参数读取
      actionType: 'plc.read',
      titleKey: 'audit.plc.read.title',
      moduleKey: 'audit.module.plc',
      enabled: false, // 默认不启用，太频繁
      requireReason: false,
      recordChange: false,
      priority: 'low',
      notifyRoles: []
    },
    {
      // PLC连接
      actionType: 'plc.connect',
      titleKey: 'audit.plc.connect.title',
      moduleKey: 'audit.module.plc',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // PLC断开
      actionType: 'plc.disconnect',
      titleKey: 'audit.plc.disconnect.title',
      moduleKey: 'audit.module.plc',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'normal',
      notifyRoles: []
    },
    {
      // PLC重连
      actionType: 'plc.reconnect',
      titleKey: 'audit.plc.reconnect.title',
      moduleKey: 'audit.module.plc',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'normal',
      notifyRoles: []
    },

    // ==================== 8. 审计自身 ====================
    {
      // 审计日志查看
      actionType: 'audit.view',
      titleKey: 'audit.audit.view.title',
      moduleKey: 'audit.module.audit',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'low',
      notifyRoles: []
    },
    {
      // 审计哈希链校验
      actionType: 'audit.verify',
      titleKey: 'audit.audit.verify.title',
      moduleKey: 'audit.module.audit',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'normal',
      notifyRoles: ['administrator']
    },
    {
      // 审计日志导出
      actionType: 'audit.export',
      titleKey: 'audit.audit.export.title',
      moduleKey: 'audit.module.audit',
      enabled: true,
      requireReason: true,
      recordChange: false,
      priority: 'high',
      notifyRoles: ['administrator']
    },

    // ==================== 9. 授权管理 ====================
    {
      // 授权导入
      actionType: 'license.import',
      titleKey: 'audit.license.import.title',
      moduleKey: 'audit.module.license',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 授权到期
      actionType: 'license.expire',
      titleKey: 'audit.license.expire.title',
      moduleKey: 'audit.module.license',
      enabled: true,
      requireReason: false,
      recordChange: false,
      priority: 'high',
      notifyRoles: ['administrator']
    },

    // ==================== 10. 邮箱配置 ====================
    {
      // 邮箱配置修改
      actionType: 'email.configChange',
      titleKey: 'audit.email.configChange.title',
      moduleKey: 'audit.module.email',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'high',
      notifyRoles: ['administrator']
    },
    {
      // 邮箱日志删除
      actionType: 'email.logDelete',
      titleKey: 'audit.email.logDelete.title',
      moduleKey: 'audit.module.email',
      enabled: true,
      requireReason: true,
      recordChange: true,
      priority: 'normal',
      notifyRoles: []
    }
  ],

  /**
   * 根据操作类型获取审计规则
   * @param {string} actionType - 操作类型
   * @returns {Object|null} 审计规则
   */
  getRule(actionType) {
    return this.rules.find(rule => rule.actionType === actionType) || null
  },

  /**
   * 检查操作类型是否启用审计
   * @param {string} actionType - 操作类型
   * @returns {boolean} 是否启用
   */
  isEnabled(actionType) {
    const rule = this.getRule(actionType)
    return rule ? rule.enabled : false
  },

  /**
   * 检查操作类型是否要求填写原因
   * @param {string} actionType - 操作类型
   * @returns {boolean} 是否要求
   */
  requireReason(actionType) {
    const rule = this.getRule(actionType)
    return rule ? rule.requireReason : false
  },

  /**
   * 获取指定模块的所有规则
   * @param {string} moduleKey - 模块key
   * @returns {Array} 规则列表
   */
  getRulesByModule(moduleKey) {
    return this.rules.filter(rule => rule.moduleKey === moduleKey)
  },

  /**
   * 获取所有启用的规则
   * @returns {Array} 启用的规则列表
   */
  getEnabledRules() {
    return this.rules.filter(rule => rule.enabled)
  }
}
