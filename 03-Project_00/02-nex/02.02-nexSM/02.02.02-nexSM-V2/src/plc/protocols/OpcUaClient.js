/**
 * OPC UA 协议客户端
 * 工业互联网标准协议，支持复杂数据类型和订阅机制
 *
 * 依赖安装：npm install node-opcua
 * 点位地址格式：ns=1;s=Temperature / ns=2;i=1001
 *
 * 特性：
 * - 支持订阅模式（数据变化主动推送，无需轮询）
 * - 支持复杂数据类型（结构体、数组）
 * - 内置安全策略（None / Sign / SignAndEncrypt）
 */
const BasePlc = require('./BasePlc')

class OpcUaClient extends BasePlc {
  constructor(cfg) {
    super(cfg)
    this.client = null
    this.session = null
    this.subscription = null
    this.monitoredItems = new Map()
    this.config.protocol = 'OpcUa'
    this._opcua = null
  }

  /** 懒加载 node-opcua 依赖 */
  _getOpcUa() {
    if (!this._opcua) {
      try {
        this._opcua = require('node-opcua')
      } catch (e) {
        throw new Error('OPC UA 协议需要安装 node-opcua 依赖：npm install node-opcua')
      }
    }
    return this._opcua
  }

  async connect() {
    const opcua = this._getOpcUa()
    const { OPCUAClient, MessageSecurityMode, SecurityPolicy } = opcua

    const endpointUrl = `opc.tcp://${this.config.connection.host}:${this.config.connection.port || 4840}`

    this.client = OPCUAClient.create({
      endpointMustExist: false,
      securityMode: this.config.securityMode || MessageSecurityMode.None,
      securityPolicy: this.config.securityPolicy || SecurityPolicy.None
    })

    await this.client.connect(endpointUrl)

    // 创建会话
    const userIdentity = this.config.username
      ? { userName: this.config.username, password: this.config.password }
      : null
    this.session = await this.client.createSession(userIdentity)

    this.isConnected = true
    this.connectTime = new Date().toISOString()
    this.lastError = null
  }

  async disconnect() {
    try {
      if (this.subscription) {
        await this.subscription.terminate()
        this.subscription = null
      }
      if (this.session) {
        await this.session.close()
        this.session = null
      }
      if (this.client) {
        await this.client.disconnect()
        this.client = null
      }
    } catch (e) {
      this.lastError = e.message
    } finally {
      this.isConnected = false
      this.monitoredItems.clear()
    }
  }

  async readTag(tagItem) {
    this._ensureConnected()
    const nodeId = tagItem.address // OPC UA 使用 NodeId 字符串
    const dataValue = await this.session.read({ nodeId, attributeId: 13 }) // 13 = Value
    if (dataValue.statusCode && !dataValue.statusCode.isGood()) {
      throw new Error(`OPC UA 读取失败: ${dataValue.statusCode.description}`)
    }
    return dataValue.value.value
  }

  async readTags(tagItems) {
    this._ensureConnected()
    const nodesToRead = tagItems.map(t => ({
      nodeId: t.address,
      attributeId: 13
    }))
    const dataValues = await this.session.read(nodesToRead)
    const result = {}
    tagItems.forEach((tag, idx) => {
      const dv = dataValues[idx]
      if (dv.statusCode && dv.statusCode.isGood()) {
        result[tag.tag] = dv.value.value
      } else {
        result[tag.tag] = null
        this.lastError = dv.statusCode ? dv.statusCode.description : 'Unknown error'
      }
    })
    return result
  }

  async writeTag(tagItem, value) {
    this._ensureConnected()
    const nodeId = tagItem.address
    const statusCode = await this.session.write({
      nodeId,
      attributeId: 13,
      value: { value }
    })
    if (!statusCode.isGood()) {
      throw new Error(`OPC UA 写入失败: ${statusCode.description}`)
    }
  }

  /**
   * OPC UA 专属：订阅模式（数据变化主动推送，无需轮询）
   * @param {Array} tagItems 点位配置
   * @param {Function} callback 数据变化回调 (tag, value) => void
   */
  async subscribe(tagItems, callback) {
    this._ensureConnected()
    const opcua = this._getOpcUa()

    if (!this.subscription) {
      this.subscription = opcua.ClientSubscription.create(this.session, {
        requestedPublishingInterval: this.config.poll?.fastInterval || 200,
        requestedLifetimeCount: 100,
        requestedMaxKeepAliveCount: 10,
        maxNotificationsPerPublish: 100,
        publishingEnabled: true
      })
    }

    for (const tagItem of tagItems) {
      if (this.monitoredItems.has(tagItem.tag)) continue

      const monitoredItem = opcua.ClientMonitoredItem.create(
        this.subscription,
        { nodeId: tagItem.address, attributeId: 13 },
        { samplingInterval: 200, discardOldest: true, queueSize: 1 }
      )

      monitoredItem.on('changed', (dataValue) => {
        if (dataValue.statusCode.isGood()) {
          callback(tagItem.tag, dataValue.value.value)
        }
      })

      this.monitoredItems.set(tagItem.tag, monitoredItem)
    }
  }

  /** 取消订阅 */
  async unsubscribe(tagName) {
    if (tagName) {
      const item = this.monitoredItems.get(tagName)
      if (item) {
        item.terminate()
        this.monitoredItems.delete(tagName)
      }
    } else {
      // 取消所有
      for (const item of this.monitoredItems.values()) {
        item.terminate()
      }
      this.monitoredItems.clear()
    }
  }

  getStatus() {
    return {
      ...super.getStatus(),
      host: this.config.connection.host,
      port: this.config.connection.port || 4840,
      subscribedCount: this.monitoredItems.size,
      hasSubscription: !!this.subscription
    }
  }
}

module.exports = OpcUaClient
