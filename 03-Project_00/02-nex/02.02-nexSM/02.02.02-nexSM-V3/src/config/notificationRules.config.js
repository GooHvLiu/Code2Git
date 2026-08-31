/**
 * ==========================================
 * 通知规则配置
 * ==========================================
 * 定义哪些事件需要通知，以及通知给哪些角色
 * 可根据业务需求灵活调整
 *
 * 事件类型命名规范：模块.操作
 * 例如：user.register、config.update、plc.connection.update
 *
 * 国际化说明：
 * - titleKey: 通知标题的国际化 key（前端使用 $t(titleKey, titleParams) 渲染）
 * - contentKey: 通知内容的国际化 key（前端使用 $t(contentKey, contentParams) 渲染）
 * - 动态参数通过 variables 传入，前端渲染时自动填充
 */

module.exports = {
  // 是否启用通知功能
  enabled: true,

  // 通知规则列表
  rules: [
    {
      // 用户注册
      eventType: 'user.register',
      titleKey: 'notification.user.register.title',
      contentKey: 'notification.user.register.content',
      notifyRoles: ['administrator'],
      priority: 'normal',
      type: 'user',
      enabled: true
    },
    {
      // 用户资料更新
      eventType: 'user.profile.update',
      titleKey: 'notification.user.profileUpdate.title',
      contentKey: 'notification.user.profileUpdate.content',
      notifyRoles: ['administrator'],
      priority: 'low',
      type: 'user',
      enabled: true
    },
    {
      // 系统配置更新
      eventType: 'config.system.update',
      titleKey: 'notification.config.systemUpdate.title',
      contentKey: 'notification.config.systemUpdate.content',
      notifyRoles: ['administrator'],
      priority: 'normal',
      type: 'system',
      enabled: true
    },
    {
      // PLC 连接配置更新
      eventType: 'config.plc.connection.update',
      titleKey: 'notification.config.plcConnectionUpdate.title',
      contentKey: 'notification.config.plcConnectionUpdate.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'high',
      type: 'plc',
      enabled: true
    },
    {
      // 连接配置更新
      eventType: 'config.connection.update',
      titleKey: 'notification.config.connectionUpdate.title',
      contentKey: 'notification.config.connectionUpdate.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'high',
      type: 'plc',
      enabled: true
    },
    {
      // 设备参数更新
      eventType: 'config.device.params.update',
      titleKey: 'notification.config.deviceParamsUpdate.title',
      contentKey: 'notification.config.deviceParamsUpdate.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'high',
      type: 'plc',
      enabled: true
    },
    {
      // PLC 报警
      eventType: 'plc.alarm',
      titleKey: 'notification.plc.alarm.title',
      contentKey: 'notification.plc.alarm.content',
      notifyRoles: ['administrator', 'engineer', 'operator'],
      priority: 'high',
      type: 'plc',
      enabled: true
    },
    {
      // PLC 连接断开
      eventType: 'plc.connection.lost',
      titleKey: 'notification.plc.connectionLost.title',
      contentKey: 'notification.plc.connectionLost.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'high',
      type: 'plc',
      enabled: true
    },
    {
      // PLC 连接恢复
      eventType: 'plc.connection.restored',
      titleKey: 'notification.plc.connectionRestored.title',
      contentKey: 'notification.plc.connectionRestored.content',
      notifyRoles: ['administrator', 'engineer'],
      priority: 'normal',
      type: 'plc',
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
