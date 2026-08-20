/**
 * PLC 告警规则引擎
 * 支持阈值告警、变化告警、状态告警
 *
 * 规则类型：
 * - threshold: 阈值告警（>、<、>=、<=、==、!=）
 * - change: 变化告警（值发生变化时触发）
 * - status: 状态告警（特定值时触发，如设备故障）
 */
class PlcAlarmEngine {
  constructor() {
    this.rules = [] // 告警规则列表
    this.activeAlarms = new Map() // 当前活跃告警 key -> alarm
    this.onAlarmCallback = null // 告警触发回调
    this.lastValues = new Map() // 上一次值 key -> value
  }

  /**
   * 添加告警规则
   * @param {Object} rule { id, device, tag, type, operator, threshold, level, message, enabled }
   */
  addRule(rule) {
    if (!rule.id) rule.id = `alarm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    if (rule.enabled === undefined) rule.enabled = true
    if (rule.level === undefined) rule.level = 'warning' // info / warning / critical
    this.rules.push(rule)
    return rule.id
  }

  /** 移除规则 */
  removeRule(ruleId) {
    const idx = this.rules.findIndex(r => r.id === ruleId)
    if (idx >= 0) this.rules.splice(idx, 1)
  }

  /** 获取所有规则 */
  getRules() {
    return [...this.rules]
  }

  /** 设置告警回调 */
  setAlarmCallback(callback) {
    this.onAlarmCallback = callback
  }

  /**
   * 评估数据，检查是否触发告警
   * @param {string} device 设备名
   * @param {Object} values { tag: value }
   */
  evaluate(device, values) {
    const triggered = []

    for (const rule of this.rules) {
      if (!rule.enabled) continue
      if (rule.device && rule.device !== device) continue
      if (!(rule.tag in values)) continue

      const value = values[rule.tag]
      const key = `${rule.id}_${device}_${rule.tag}`

      switch (rule.type) {
        case 'threshold':
          if (this._checkThreshold(value, rule.operator, rule.threshold)) {
            this._triggerAlarm(key, rule, device, value, triggered)
          } else {
            this._clearAlarm(key)
          }
          break

        case 'change': {
          const lastVal = this.lastValues.get(key)
          if (lastVal !== undefined && lastVal !== value) {
            this._triggerAlarm(key, rule, device, value, triggered)
          }
          this.lastValues.set(key, value)
          break
        }

        case 'status':
          if (value === rule.value) {
            this._triggerAlarm(key, rule, device, value, triggered)
          } else {
            this._clearAlarm(key)
          }
          break
      }
    }

    return triggered
  }

  /** 阈值检查 */
  _checkThreshold(value, operator, threshold) {
    switch (operator) {
      case '>': return value > threshold
      case '<': return value < threshold
      case '>=': return value >= threshold
      case '<=': return value <= threshold
      case '==': return value === threshold
      case '!=': return value !== threshold
      default: return false
    }
  }

  /** 触发告警 */
  _triggerAlarm(key, rule, device, value, triggered) {
    // 已活跃的告警不重复触发
    if (this.activeAlarms.has(key)) return

    const alarm = {
      id: key,
      ruleId: rule.id,
      device,
      tag: rule.tag,
      level: rule.level,
      message: rule.message || `告警: ${rule.tag} = ${value}`,
      value,
      threshold: rule.threshold,
      timestamp: Date.now()
    }

    this.activeAlarms.set(key, alarm)
    triggered.push(alarm)

    if (this.onAlarmCallback) {
      try { this.onAlarmCallback(alarm) } catch (e) { /* ignore */ }
    }
  }

  /** 清除告警 */
  _clearAlarm(key) {
    if (this.activeAlarms.has(key)) {
      const alarm = this.activeAlarms.get(key)
      this.activeAlarms.delete(key)
      // 可以在这里触发告警恢复通知
    }
  }

  /** 获取当前活跃告警 */
  getActiveAlarms() {
    return Array.from(this.activeAlarms.values())
  }

  /** 清除所有活跃告警 */
  clearAll() {
    this.activeAlarms.clear()
  }
}

module.exports = new PlcAlarmEngine()
module.exports.PlcAlarmEngine = PlcAlarmEngine
