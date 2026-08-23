/**
 * PLC 模块入口
 *
 * 两种使用方式：
 *
 * 1. 多设备模式（推荐，大型项目）
 *    const plcManager = require('@/plc').manager
 *    plcManager.registerDevice('fillMachine', config, tagMap)
 *    await plcManager.connectAll()
 *    const val = await plcManager.readTag('fillMachine', 'temperature')
 *
 * 2. 单设备模式（兼容旧版，简单项目）
 *    const { getPlcInstance, getTagConfig } = require('@/plc')
 *    const plc = getPlcInstance()
 *    await plc.connect()
 */
const plcSetting = require('./config/plcSetting')
const plcTagMap = require('./config/plcTagMap')
const plcManager = require('./manager/PlcManager')
const plcPollTask = require('./task/PlcPollTask')
const plcStorage = require('./storage/PlcDataStorage')
const plcAlarm = require('./alarm/PlcAlarmEngine')

// ========== 单设备兼容层 ==========
let singleInstance = null

/** 获取单设备 PLC 实例（兼容旧版） */
function getPlcInstance() {
  if (!singleInstance) {
    const { PROTOCOL_MAP } = require('./manager/PlcManager')
    const ProtocolClass = PROTOCOL_MAP[plcSetting.activeProtocol]
    if (!ProtocolClass) {
      throw new Error(`协议 ${plcSetting.activeProtocol} 尚未实现`)
    }
    singleInstance = new ProtocolClass(plcSetting)
  }
  return singleInstance
}

/** 根据 tag 名称获取点位配置（兼容旧版） */
function getTagConfig(tagName) {
  return plcTagMap.find(item => item.tag === tagName)
}

/** 重置单设备实例（配置变更后调用） */
function resetPlcInstance() {
  if (singleInstance) {
    try { singleInstance.disconnect() } catch (e) { /* ignore */ }
  }
  singleInstance = null
}

// ========== 初始化多设备（如果配置了多设备） ==========
function initDevices() {
  if (plcSetting.devices) {
    for (const [name, config] of Object.entries(plcSetting.devices)) {
      plcManager.registerDevice(name, config, config.tagMap || [])
    }
  }
}

module.exports = {
  // 多设备模式（推荐）
  manager: plcManager,
  pollTask: plcPollTask,
  storage: plcStorage,
  alarm: plcAlarm,

  // 单设备兼容层
  getPlcInstance,
  getTagConfig,
  resetPlcInstance,

  // 配置
  plcTagMap,
  plcSetting,

  // 工具函数
  initDevices
}
