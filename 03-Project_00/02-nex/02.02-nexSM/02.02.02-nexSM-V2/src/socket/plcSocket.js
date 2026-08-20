/**
 * PLC 实时数据 WebSocket 推送
 * 将轮询采集的变化数据和告警推送到前端
 *
 * 使用方式：
 *   const { initPlcSocket } = require('./src/socket/plcSocket')
 *   initPlcSocket(io)  // io 为 socket.io 实例
 */
const plcPollTask = require('../plc/task/PlcPollTask')
const plcAlarm = require('../plc/alarm/PlcAlarmEngine')

/**
 * 初始化 PLC WebSocket 推送
 * @param {Object} io socket.io 实例
 */
function initPlcSocket(io) {
  // 数据变化推送
  plcPollTask.setCallback((message) => {
    if (message.type === 'data') {
      io.emit('plc:data', {
        device: message.device,
        data: message.data,
        timestamp: message.timestamp
      })
    } else if (message.type === 'alarm') {
      io.emit('plc:alarm', {
        device: message.device,
        alarms: message.alarms,
        timestamp: Date.now()
      })
    }
  })

  // 告警回调（双重保险，确保告警不丢失）
  plcAlarm.setAlarmCallback((alarm) => {
    io.emit('plc:alarm', {
      alarms: [alarm],
      timestamp: Date.now()
    })
  })

  console.log('[PLC] WebSocket 推送已初始化')
}

module.exports = { initPlcSocket }
