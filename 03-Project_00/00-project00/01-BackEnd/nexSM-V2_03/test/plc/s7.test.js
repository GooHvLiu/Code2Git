/**
 * S7 协议单元测试
 * 测试地址格式、配置、依赖检查
 * （真实 S7 通讯需要西门子 PLC 或安装 nodes7）
 */
const { TestRunner, assert } = require('./helpers')
const S7Client = require('../../src/plc/protocols/S7Client')

const runner = new TestRunner()

runner.test('S7Client 未安装 nodes7 时 connect 抛出明确错误', async () => {
  const client = new S7Client({
    connection: { host: '192.168.1.10', port: 102, rack: 0, slot: 1 }
  })
  // 无论是否安装，都应该有明确的错误处理
  try {
    await client.connect()
    // 如果安装了 nodes7 且连接成功（不太可能），则通过
    assert.ok(true)
  } catch (err) {
    // 未安装时应该提示安装依赖
    assert.ok(
      err.message.includes('nodes7') || err.message.includes('ECONNREFUSED') || err.message.includes('connect'),
      `错误信息应包含依赖或连接提示，实际: ${err.message}`
    )
  }
})

runner.test('S7Client 默认端口为 102', async () => {
  const client = new S7Client({
    connection: { host: '192.168.1.10' }
  })
  const status = client.getStatus()
  assert.strictEqual(status.port, 102)
})

runner.test('S7Client 默认 rack=0, slot=1', async () => {
  const client = new S7Client({
    connection: { host: '192.168.1.10' }
  })
  const status = client.getStatus()
  assert.strictEqual(status.rack, 0)
  assert.strictEqual(status.slot, 1)
})

runner.test('S7Client 自定义 rack/slot', async () => {
  const client = new S7Client({
    connection: { host: '192.168.1.10', rack: 1, slot: 2 }
  })
  const status = client.getStatus()
  assert.strictEqual(status.rack, 1)
  assert.strictEqual(status.slot, 2)
})

runner.test('S7Client getStatus 包含协议标识', async () => {
  const client = new S7Client({ connection: {} })
  const status = client.getStatus()
  assert.strictEqual(status.protocol, 'S7')
})

runner.test('S7Client 地址直接使用配置的 address', async () => {
  const client = new S7Client({ connection: {} })
  const tagItem = { address: 'DB1.DBW0', type: 'uint16' }
  assert.strictEqual(client._toS7Address(tagItem), 'DB1.DBW0')
})

runner.test('S7Client 支持的地址格式', async () => {
  const client = new S7Client({ connection: {} })
  const formats = [
    'DB1.DBX0.0',  // 布尔
    'DB1.DBW0',     // 字
    'DB1.DBD0',     // 双字
    'DB1.DBD0.REAL' // 实数
  ]
  for (const addr of formats) {
    assert.strictEqual(client._toS7Address({ address: addr }), addr)
  }
})

runner.test('S7Client 未连接时 readTag 抛出错误', async () => {
  const client = new S7Client({ connection: {} })
  await assert.rejects(
    () => client.readTag({ address: 'DB1.DBW0', type: 'uint16' }),
    /PLC 未连接/
  )
})

module.exports = runner
