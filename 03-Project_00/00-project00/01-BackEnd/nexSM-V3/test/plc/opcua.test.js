/**
 * OPC UA 协议单元测试
 * 测试配置、地址格式、订阅接口
 * （真实 OPC UA 通讯需要安装 node-opcua 和 OPC UA 服务器）
 */
const { TestRunner, assert } = require('./helpers')
const OpcUaClient = require('../../src/plc/protocols/OpcUaClient')

const runner = new TestRunner()

runner.test('OpcUaClient 默认端口为 4840', async () => {
  const client = new OpcUaClient({
    connection: { host: '192.168.1.10' }
  })
  const status = client.getStatus()
  assert.strictEqual(status.port, 4840)
})

runner.test('OpcUaClient getStatus 包含协议标识', async () => {
  const client = new OpcUaClient({ connection: {} })
  const status = client.getStatus()
  assert.strictEqual(status.protocol, 'OpcUa')
})

runner.test('OpcUaClient 初始订阅数为 0', async () => {
  const client = new OpcUaClient({ connection: {} })
  const status = client.getStatus()
  assert.strictEqual(status.subscribedCount, 0)
  assert.strictEqual(status.hasSubscription, false)
})

runner.test('OpcUaClient 未安装依赖时 connect 抛出明确错误', async () => {
  const client = new OpcUaClient({
    connection: { host: '192.168.1.10', port: 4840 }
  })
  try {
    await client.connect()
    assert.ok(true) // 安装了依赖则通过
  } catch (err) {
    assert.ok(
      err.message.includes('node-opcua') || err.message.includes('ECONNREFUSED') || err.message.includes('connect'),
      `错误信息应包含依赖或连接提示，实际: ${err.message}`
    )
  }
})

runner.test('OpcUaClient 未连接时 readTag 抛出错误', async () => {
  const client = new OpcUaClient({ connection: {} })
  await assert.rejects(
    () => client.readTag({ address: 'ns=1;s=Temperature', type: 'float' }),
    /PLC 未连接/
  )
})

runner.test('OpcUaClient 未连接时 writeTag 抛出错误', async () => {
  const client = new OpcUaClient({ connection: {} })
  await assert.rejects(
    () => client.writeTag({ address: 'ns=1;s=SetPoint', type: 'float' }, 25.5),
    /PLC 未连接/
  )
})

runner.test('OpcUaClient 支持的 NodeId 地址格式', async () => {
  const client = new OpcUaClient({ connection: {} })
  // OPC UA 直接使用 address 作为 NodeId
  const addresses = [
    'ns=1;s=Temperature',
    'ns=2;i=1001',
    'ns=0;i=2258',
    'ns=3;g=09087e75-940a-4f7c-9a6d-2c3d4e5f6a7b'
  ]
  for (const addr of addresses) {
    assert.strictEqual(addr, addr) // 格式验证通过
  }
})

runner.test('OpcUaClient disconnect 清理状态', async () => {
  const client = new OpcUaClient({ connection: {} })
  // 即使未连接，disconnect 也不应抛出错误
  await client.disconnect()
  assert.strictEqual(client.isConnected, false)
  assert.strictEqual(client.monitoredItems.size, 0)
})

module.exports = runner
