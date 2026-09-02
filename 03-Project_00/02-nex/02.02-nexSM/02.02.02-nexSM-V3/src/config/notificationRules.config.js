/**
 * ==========================================
 * 通知规则配置
 * ==========================================
 * 定义哪些事件需要通知，以及通知给哪些角色
 * 可根据业务需求灵活调整
 *
 * 事件类型命名规范：模块.操作
 * 例如：user.register、config.update、device.param.change
 *
 * 国际化说明：
 * - titleKey: 通知标题的国际化 key（前端使用 $t(titleKey, titleParams) 渲染）
 * - contentKey: 通知内容的国际化 key（前端使用 $t(contentKey, contentParams) 渲染）
 * - 动态参数通过 variables 传入，前端渲染时自动填充
 *
 * 通知角色说明：
 * - administrator: 管理员
 * - engineer: 工程师
 * - operator: 操作员
 * - 注意：如需通知"该用户"（操作人自己），请在业务代码中单独调用 sendToUser 发送
 */

module.exports = {
  // 是否启用通知功能
  enabled: true,

  // 通知规则列表（按模块分类）
  rules: [
    // ==================== 1. 系统级通知 ====================
    {
      // 数据备份成功
      eventType: 'system.backup.success',
      titleKey: 'notification.system.backupSuccess.title',
      contentKey: 'notification.system.backupSuccess.content',
      notifyRoles: ['administrator'],
      priority: 'low',
      type: 'system',
      enabled: true
    },
    {
      // 数据备份失败
      eventType: 'system.backup.failed',
      titleKey: 'notification.system.backupFailed.title',
      contentKey: 'notification.system.backupFailed.content',
      notifyRoles: ['administrator'],
      priority: 'high',
      type: 'system',
      enabled: true
    },
    {
      // 授权即将到期（30天内）
      eventType: 'license.expiring',
      titleKey: 'notification.license.expiring.title',
      contentKey: 'notification.license.expiring.content',
      notifyRoles: ['administrator'],
      priority: 'high',
      type: 'system',
      enabled: true
    },
    {
      // 授权已过期
      eventType: 'license.expired',
      titleKey: 'notification.license.expired.title',
      contentKey: 'notification.license.expired.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'high',
      type: 'system',
      enabled: true
    },

    // ==================== 2. 用户管理通知 ====================
    {
      // 新用户注册
      eventType: 'user.register',
      titleKey: 'notification.user.register.title',
      contentKey: 'notification.user.register.content',
      notifyRoles: ['administrator'],
      priority: 'normal',
      type: 'user',
      enabled: true
    },
    {
      // 管理员创建用户
      eventType: 'user.create',
      titleKey: 'notification.user.create.title',
      contentKey: 'notification.user.create.content',
      notifyRoles: ['administrator'],
      priority: 'normal',
      type: 'user',
      enabled: true
    },
    {
      // 用户信息变更
      eventType: 'user.update',
      titleKey: 'notification.user.update.title',
      contentKey: 'notification.user.update.content',
      notifyRoles: ['administrator'],
      priority: 'low',
      type: 'user',
      enabled: true
    },
    {
      // 用户状态变更（启用/禁用）
      eventType: 'user.status.change',
      titleKey: 'notification.user.statusChange.title',
      contentKey: 'notification.user.statusChange.content',
      notifyRoles: ['administrator'],
      priority: 'normal',
      type: 'user',
      enabled: true
    },
    {
      // 用户密码重置
      // 注意：除了通知管理员，业务代码中还需单独调用 sendToUser 通知该用户
      eventType: 'user.password.reset',
      titleKey: 'notification.user.passwordReset.title',
      contentKey: 'notification.user.passwordReset.content',
      notifyRoles: ['administrator'],
      priority: 'normal',
      type: 'user',
      enabled: true
    },
    {
      // 用户登录失败（多次）
      eventType: 'user.login.failed',
      titleKey: 'notification.user.loginFailed.title',
      contentKey: 'notification.user.loginFailed.content',
      notifyRoles: ['administrator'],
      priority: 'high',
      type: 'user',
      enabled: true
    },
    {
      // 用户角色/权限变更
      eventType: 'user.role.change',
      titleKey: 'notification.user.roleChange.title',
      contentKey: 'notification.user.roleChange.content',
      notifyRoles: ['administrator'],
      priority: 'normal',
      type: 'user',
      enabled: true
    },

    // ==================== 3. 设备管理通知 ====================
    {
      // 设备参数变更
      eventType: 'device.param.change',
      titleKey: 'notification.device.paramChange.title',
      contentKey: 'notification.device.paramChange.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'high',
      type: 'plc',
      enabled: true
    },
    {
      // 设备维护提醒
      eventType: 'device.maintenance.reminder',
      titleKey: 'notification.device.maintenanceReminder.title',
      contentKey: 'notification.device.maintenanceReminder.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'normal',
      type: 'plc',
      enabled: true
    },
    {
      // 配件寿命预警
      eventType: 'device.part.life.warning',
      titleKey: 'notification.device.partLifeWarning.title',
      contentKey: 'notification.device.partLifeWarning.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'high',
      type: 'plc',
      enabled: true
    },

    // ==================== 4. 生产管理通知 ====================
    {
      // 生产订单创建
      eventType: 'production.order.create',
      titleKey: 'notification.production.orderCreate.title',
      contentKey: 'notification.production.orderCreate.content',
      notifyRoles: ['administrator', 'engineer', 'operator'],
      priority: 'normal',
      type: 'system',
      enabled: true
    },
    {
      // 生产订单变更
      eventType: 'production.order.update',
      titleKey: 'notification.production.orderUpdate.title',
      contentKey: 'notification.production.orderUpdate.content',
      notifyRoles: ['administrator', 'engineer', 'operator'],
      priority: 'normal',
      type: 'system',
      enabled: true
    },
    {
      // 生产订单完成
      eventType: 'production.order.complete',
      titleKey: 'notification.production.orderComplete.title',
      contentKey: 'notification.production.orderComplete.content',
      notifyRoles: ['administrator', 'engineer', 'operator'],
      priority: 'normal',
      type: 'system',
      enabled: true
    },
    {
      // 批次完成
      eventType: 'production.batch.complete',
      titleKey: 'notification.production.batchComplete.title',
      contentKey: 'notification.production.batchComplete.content',
      notifyRoles: ['administrator', 'engineer', 'operator'],
      priority: 'normal',
      type: 'system',
      enabled: true
    },

    // ==================== 5. 配置管理通知 ====================
    {
      // 系统配置变更
      eventType: 'config.system.update',
      titleKey: 'notification.config.systemUpdate.title',
      contentKey: 'notification.config.systemUpdate.content',
      notifyRoles: ['administrator'],
      priority: 'normal',
      type: 'system',
      enabled: true
    },
    {
      // PLC连接配置变更
      eventType: 'config.plc.connection.update',
      titleKey: 'notification.config.plcConnectionUpdate.title',
      contentKey: 'notification.config.plcConnectionUpdate.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'high',
      type: 'plc',
      enabled: true
    },
    {
      // 连接配置变更
      eventType: 'config.connection.update',
      titleKey: 'notification.config.connectionUpdate.title',
      contentKey: 'notification.config.connectionUpdate.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'high',
      type: 'plc',
      enabled: true
    },
    {
      // 设备参数配置变更
      eventType: 'config.device.params.update',
      titleKey: 'notification.config.deviceParamsUpdate.title',
      contentKey: 'notification.config.deviceParamsUpdate.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'high',
      type: 'plc',
      enabled: true
    },
    {
      // 导出配置变更
      eventType: 'config.export.update',
      titleKey: 'notification.config.exportUpdate.title',
      contentKey: 'notification.config.exportUpdate.content',
      notifyRoles: ['administrator'],
      priority: 'low',
      type: 'system',
      enabled: true
    },
    {
      // 安全配置变更
      eventType: 'config.security.update',
      titleKey: 'notification.config.securityUpdate.title',
      contentKey: 'notification.config.securityUpdate.content',
      notifyRoles: ['administrator'],
      priority: 'high',
      type: 'system',
      enabled: true
    },

    // ==================== 6. 安全/合规通知 ====================
    {
      // 审计日志被导出
      eventType: 'audit.log.export',
      titleKey: 'notification.audit.logExport.title',
      contentKey: 'notification.audit.logExport.content',
      notifyRoles: ['administrator'],
      priority: 'high',
      type: 'audit',
      enabled: true
    },
    {
      // 审计日志被查看
      eventType: 'audit.log.view',
      titleKey: 'notification.audit.logView.title',
      contentKey: 'notification.audit.logView.content',
      notifyRoles: ['administrator'],
      priority: 'low',
      type: 'audit',
      enabled: true
    },
    {
      // 权限配置变更
      eventType: 'permission.change',
      titleKey: 'notification.permission.change.title',
      contentKey: 'notification.permission.change.content',
      notifyRoles: ['administrator'],
      priority: 'high',
      type: 'system',
      enabled: true
    },
    {
      // 敏感数据导出
      eventType: 'data.export',
      titleKey: 'notification.data.export.title',
      contentKey: 'notification.data.export.content',
      notifyRoles: ['administrator'],
      priority: 'high',
      type: 'system',
      enabled: true
    },
    {
      // 数据删除操作
      eventType: 'data.delete',
      titleKey: 'notification.data.delete.title',
      contentKey: 'notification.data.delete.content',
      notifyRoles: ['administrator'],
      priority: 'high',
      type: 'system',
      enabled: true
    }
  ],

  /**
   * 根据事件类型获取通知规则
   * @param {string} eventType - 事件类型
   * @returns {Object|null} 通知规则
   */
  getRule(eventType) {
    return this.rules.find(rule => rule.eventType === eventType && rule.enabled) || null
  },

  /**
   * 渲染通知内容（替换模板变量）- 保留用于兼容旧代码或调试
   * @param {string} template - 内容模板
   * @param {Object} variables - 变量对象
   * @returns {string} 渲染后的内容
   */
  renderContent(template, variables = {}) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] !== undefined ? variables[key] : match
    })
  }
}
