/**
 * 通用 WebSocket 管理器
 * 支持：
 * 1. 按用户ID推送消息
 * 2. 广播消息
 * 3. 心跳检测
 * 4. 断线重连（前端处理）
 *
 * 使用方式：
 * const wsManager = require('./wsManager')
 * wsManager.init(server)  // 在 app.js 中初始化
 * wsManager.sendToUser(userId, { type: 'notification', data: {...} })
 * wsManager.broadcast({ type: 'system', data: {...} })
 */
const WebSocket = require('ws')

class WsManager {
  constructor() {
    this.wss = null
    // 用户连接映射：{ userId: [ws1, ws2, ...] }
    this.userConnections = new Map()
    // 心跳间隔
    this.heartbeatInterval = 30000
  }

  /**
   * 初始化 WebSocket 服务
   * @param {http.Server} server - HTTP 服务器实例
   */
  init(server) {
    this.wss = new WebSocket.Server({ server, path: '/ws' })

    this.wss.on('connection', (ws, req) => {
      // 初始状态
      ws.isAlive = true
      ws.userId = null

      // 心跳响应
      ws.on('pong', () => {
        ws.isAlive = true
      })

      // 接收消息
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString())
          this.handleMessage(ws, data)
        } catch (e) {
          console.error('[WS] 消息解析失败:', e.message)
        }
      })

      // 连接关闭
      ws.on('close', () => {
        this.removeConnection(ws)
      })

      // 连接错误
      ws.on('error', (err) => {
        console.error('[WS] 连接错误:', err.message)
      })
    })

    // 心跳检测
    this.startHeartbeat()
  }

  /**
   * 处理客户端消息
   */
  handleMessage(ws, data) {
    switch (data.type) {
      case 'auth':
        // 客户端认证：{ type: 'auth', token: 'xxx', userId: 1 }
        this.authConnection(ws, data)
        break
      case 'ping':
        // 心跳
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }))
        break
      case 'update_poll_interval':
        // 更新轮询间隔（前端修改配置后发送，后端通过配置接口已处理，此处仅确认）
        ws.send(JSON.stringify({ type: 'update_poll_interval_ack', message: '已收到' }))
        break
      default:
        // 未知消息类型静默处理，不打印警告（避免日志刷屏）
        // console.log('[WS] 未知消息类型:', data.type)
    }
  }

  /**
   * 客户端认证
   */
  authConnection(ws, data) {
    // 简单认证：验证 userId（生产环境应验证 JWT token）
    if (data.userId) {
      ws.userId = data.userId
      this.addConnection(data.userId, ws)
      // 发送认证成功响应
      ws.send(JSON.stringify({ type: 'auth_success', message: '认证成功' }))
      // 发送当前 PLC 连接状态给该用户
      try {
        // 延迟导入，避免循环依赖（PlcManager → wsManager → PlcManager）
        const PlcManager = require('../plc/manager/PlcManager')
        const isConnected = PlcManager.isAllConnected()
        ws.send(JSON.stringify({
          type: 'plc_status',
          data: {
            connected: isConnected,
            timestamp: Date.now()
          }
        }))
      } catch (e) {
        console.error('[WS] 发送设备连接状态失败:', e.message)
      }
    } else {
      ws.send(JSON.stringify({ type: 'auth_failed', message: '缺少 userId' }))
    }
  }

  /**
   * 添加用户连接
   */
  addConnection(userId, ws) {
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, [])
    }
    this.userConnections.get(userId).push(ws)
  }

  /**
   * 移除用户连接
   */
  removeConnection(ws) {
    if (ws.userId && this.userConnections.has(ws.userId)) {
      const connections = this.userConnections.get(ws.userId)
      const index = connections.indexOf(ws)
      if (index > -1) {
        connections.splice(index, 1)
      }
      if (connections.length === 0) {
        this.userConnections.delete(ws.userId)
      }
    }
  }

  /**
   * 向指定用户推送消息
   * @param {number} userId - 用户ID
   * @param {object} message - 消息内容
   */
  sendToUser(userId, message) {
    const connections = this.userConnections.get(userId)
    if (connections && connections.length > 0) {
      const data = JSON.stringify(message)
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data)
        }
      })
      return true
    }
    return false
  }

  /**
   * 向多个用户推送消息
   * @param {number[]} userIds - 用户ID列表
   * @param {object} message - 消息内容
   */
  sendToUsers(userIds, message) {
    userIds.forEach(userId => this.sendToUser(userId, message))
  }

  /**
   * 广播消息（所有在线用户）
   * @param {object} message - 消息内容
   */
  broadcast(message) {
    const data = JSON.stringify(message)
    this.wss.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
    })
  }

  /**
   * 获取在线用户数
   */
  getOnlineUserCount() {
    return this.userConnections.size
  }

  /**
   * 获取在线用户ID列表
   */
  getOnlineUserIds() {
    return Array.from(this.userConnections.keys())
  }

  /**
   * 启动心跳检测
   */
  startHeartbeat() {
    setInterval(() => {
      this.wss.clients.forEach(ws => {
        if (ws.isAlive === false) {
          this.removeConnection(ws)
          return ws.terminate()
        }
        ws.isAlive = false
        ws.ping()
      })
    }, this.heartbeatInterval)
  }
}

module.exports = new WsManager()
