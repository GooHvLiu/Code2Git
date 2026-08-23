/**
 * PLC 服务层
 * 支持多设备模式和单设备兼容模式
 *
 * 多设备模式：传入 deviceName 参数
 * 单设备模式：不传 deviceName，使用默认设备
 */
const { manager, getPlcInstance, getTagConfig, plcSetting, plcTagMap } = require('../../plc/index')
const auditLogger = require('../audit/auditLogger')

// 默认设备名（单设备模式使用）
const DEFAULT_DEVICE = 'default'

/**
 * 确保默认设备已注册（单设备兼容）
 */
function _ensureDefaultDevice() {
  if (!manager.getDeviceNames().includes(DEFAULT_DEVICE)) {
    manager.registerDevice(DEFAULT_DEVICE, plcSetting, plcTagMap)
  }
}

/**
 * 校验写入值的类型和范围
 */
function validateWriteValue(tagConf, value) {
  if (value === undefined || value === null) {
    throw new Error('写入值不能为空')
  }

  switch (tagConf.type) {
    case 'uint16':
      if (typeof value !== 'number' || value < 0 || value > 65535) {
        throw new Error(`uint16 类型值必须在 0-65535 之间，当前: ${value}`)
      }
      break
    case 'int16':
      if (typeof value !== 'number' || value < -32768 || value > 32767) {
        throw new Error(`int16 类型值必须在 -32768~32767 之间，当前: ${value}`)
      }
      break
    case 'uint32':
      if (typeof value !== 'number' || value < 0 || value > 4294967295) {
        throw new Error(`uint32 类型值必须在 0-4294967295 之间，当前: ${value}`)
      }
      break
    case 'int32':
      if (typeof value !== 'number' || value < -2147483648 || value > 2147483647) {
        throw new Error(`int32 类型值必须在 -2147483648~2147483647 之间，当前: ${value}`)
      }
      break
    case 'float':
      if (typeof value !== 'number' || isNaN(value)) {
        throw new Error(`float 类型必须是有效数字，当前: ${value}`)
      }
      break
    case 'bool':
      if (typeof value !== 'boolean') {
        throw new Error(`bool 类型必须是 true/false，当前: ${value}`)
      }
      break
    case 'string':
      if (typeof value !== 'string') {
        throw new Error(`string 类型必须是字符串，当前: ${typeof value}`)
      }
      break
    default:
      throw new Error(`未支持的数据类型: ${tagConf.type}`)
  }

  if (tagConf.min !== undefined && value < tagConf.min) {
    throw new Error(`值不能小于 ${tagConf.min}，当前: ${value}`)
  }
  if (tagConf.max !== undefined && value > tagConf.max) {
    throw new Error(`值不能大于 ${tagConf.max}，当前: ${value}`)
  }
}

/**
 * 读取单个点位
 * @param {string} tagName 点位名
 * @param {string} [deviceName] 设备名（多设备模式）
 */
async function readPlcTag(tagName, deviceName) {
  if (deviceName) {
    const value = await manager.readTag(deviceName, tagName)
    const tagConf = manager.getDevice(deviceName).tagMap.find(t => t.tag === tagName)
    return { tag: tagName, value, desc: tagConf?.desc }
  }
  // 单设备兼容
  _ensureDefaultDevice()
  const value = await manager.readTag(DEFAULT_DEVICE, tagName)
  const tagConf = getTagConfig(tagName)
  return { tag: tagName, value, desc: tagConf?.desc }
}

/**
 * 读取所有点位
 * @param {string} [deviceName] 设备名
 */
async function readAllTags(deviceName) {
  if (deviceName) {
    return manager.readAllTags(deviceName)
  }
  _ensureDefaultDevice()
  return manager.readAllTags(DEFAULT_DEVICE)
}

/**
 * 写入点位
 * @param {string} tagName 点位名
 * @param {any} newValue 写入值
 * @param {Object} operatorInfo 操作人信息 {userId, userName, ip, userAgent, reason}
 * @param {string} [deviceName] 设备名
 */
async function writePlcTag(tagName, newValue, operatorInfo, deviceName) {
  const devName = deviceName || DEFAULT_DEVICE
  if (!deviceName) _ensureDefaultDevice()

  const device = manager.getDevice(devName)
  const tagConf = device.tagMap.find(t => t.tag === tagName)
  if (!tagConf) throw new Error(`点位 ${tagName} 不存在`)
  if (tagConf.rw !== 'write') throw new Error(`点位 ${tagName} 只读，禁止写入`)

  // 校验写入值
  validateWriteValue(tagConf, newValue)

  // 读旧值
  const oldVal = await manager.readTag(devName, tagName)

  // 执行写入（带重试）
  let lastError = null
  for (let attempt = 1; attempt <= plcSetting.maxWriteRetry; attempt++) {
    try {
      await manager.writeTag(devName, tagName, newValue)
      lastError = null
      break
    } catch (err) {
      lastError = err
      console.warn(`[PLC] 写入失败 (第${attempt}次):`, err.message)
    }
  }
  if (lastError) throw lastError

  // 回读验证
  let verified = false
  let readBackVal = null
  try {
    readBackVal = await manager.readTag(devName, tagName)
    if (tagConf.type === 'float') {
      verified = Math.abs(readBackVal - newValue) < 0.001
    } else {
      verified = readBackVal === newValue
    }
  } catch (err) {
    console.warn('[PLC] 回读验证失败:', err.message)
  }

  // GMP 审计追踪
  if (plcSetting.enableWriteAudit) {
    await auditLogger.log(operatorInfo, {
      action: auditLogger.ACTION.PLC_WRITE,
      target: `${tagConf.tag} (${tagConf.desc})`,
      oldValue: String(oldVal),
      newValue: String(newValue),
      result: verified ? 'success' : 'verify_failed',
      reason: operatorInfo.reason || ''
    })
  }

  return {
    tag: tagName,
    desc: tagConf.desc,
    device: devName,
    oldValue: oldVal,
    newValue,
    readBackValue: readBackVal,
    verified
  }
}

/** 获取 PLC 连接状态 */
async function getPlcStatus(deviceName) {
  if (deviceName) {
    return manager.getClient(deviceName).getStatus()
  }
  _ensureDefaultDevice()
  return manager.getClient(DEFAULT_DEVICE).getStatus()
}

/** 获取所有设备状态 */
function getAllStatus() {
  return manager.getAllStatus()
}

module.exports = {
  readPlcTag,
  readAllTags,
  writePlcTag,
  getPlcStatus,
  getAllStatus,
  validateWriteValue
}
