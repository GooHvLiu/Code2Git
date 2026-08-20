/**
 * PLC 全局配置文件
 * 支持单设备（兼容旧版）和多设备配置
 * 优先级：环境变量 > 本文件默认值
 *
 * 单设备配置（简单场景）：
 *   activeProtocol + connection + poll
 *
 * 多设备配置（复杂场景）：
 *   devices: { name: { protocol, connection, poll, tagMap } }
 */

// ========== 单设备默认配置（兼容旧版） ==========
const singleDeviceConfig = {
  // 协议类型：ModbusTcp / S7 / OpcUa
  activeProtocol: process.env.PLC_PROTOCOL || 'ModbusTcp',

  connection: {
    host: process.env.PLC_HOST || '127.0.0.1',
    port: parseInt(process.env.PLC_PORT) || 502,
    unitId: parseInt(process.env.PLC_UNIT_ID) || 1,
    // S7 专用
    rack: parseInt(process.env.PLC_RACK) || 0,
    slot: parseInt(process.env.PLC_SLOT) || 1,
    // OPC UA 专用
    username: process.env.PLC_USERNAME || '',
    password: process.env.PLC_PASSWORD || ''
  },

  poll: {
    fastInterval: parseInt(process.env.PLC_FAST_INTERVAL) || 200,
    slowInterval: parseInt(process.env.PLC_SLOW_INTERVAL) || 1000,
    reconnectDelay: parseInt(process.env.PLC_RECONNECT_DELAY) || 3000
  },

  // 功能开关
  enablePoll: process.env.PLC_ENABLE_POLL !== 'false',
  enableWriteAudit: process.env.PLC_ENABLE_WRITE_AUDIT !== 'false',
  maxWriteRetry: parseInt(process.env.PLC_MAX_WRITE_RETRY) || 1
}

// ========== 多设备配置（按需添加） ==========
// 示例：
// const multiDeviceConfig = {
//   fillMachine: {
//     protocol: 'ModbusTcp',
//     connection: { host: '192.168.1.10', port: 502, unitId: 1 },
//     poll: { fastInterval: 200, slowInterval: 1000 }
//   },
//   cappingMachine: {
//     protocol: 'S7',
//     connection: { host: '192.168.1.20', port: 102, rack: 0, slot: 1 },
//     poll: { fastInterval: 500, slowInterval: 2000 }
//   }
// }

const multiDeviceConfig = process.env.PLC_MULTI_DEVICE === 'true' ? {} : null

module.exports = {
  ...singleDeviceConfig,
  devices: multiDeviceConfig,
  // 协议支持列表
  supportedProtocols: ['ModbusTcp', 'S7', 'OpcUa']
}
