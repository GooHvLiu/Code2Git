/**
 * Modbus TCP 协议单元测试
 * 使用 Mock 方式测试数据转换和地址计算
 * （真实 Modbus 通讯需要硬件或模拟服务器）
 */
const { TestRunner, assert } = require('./helpers')
const ModbusTcpClient = require('../../src/plc/protocols/ModbusTcpClient')
const {
  wordsToFloat,
  floatToWords,
  uint16ToInt16,
  int16ToUint16,
  wordsToUint32,
  uint32ToWords,
  wordsToInt32,
  int32ToWords
} = require('../../src/plc/utils/plcDataConvert')

const runner = new TestRunner()

// ========== 数据转换测试 ==========

runner.test('float <-> words 转换（swap=true）', async () => {
  const original = 25.5
  const [w1, w2] = floatToWords(original, true)
  const result = wordsToFloat(w1, w2, true)
  assert.ok(Math.abs(result - original) < 0.001, `期望 ${original}，实际 ${result}`)
})

runner.test('float <-> words 转换（swap=false）', async () => {
  const original = 100.25
  const [w1, w2] = floatToWords(original, false)
  const result = wordsToFloat(w1, w2, false)
  assert.ok(Math.abs(result - original) < 0.001)
})

runner.test('int16 <-> uint16 转换', async () => {
  assert.strictEqual(uint16ToInt16(0), 0)
  assert.strictEqual(uint16ToInt16(32767), 32767)
  assert.strictEqual(uint16ToInt16(32768), -32768)
  assert.strictEqual(uint16ToInt16(65535), -1)
  assert.strictEqual(int16ToUint16(-1), 65535)
  assert.strictEqual(int16ToUint16(-32768), 32768)
})

runner.test('uint32 <-> words 转换', async () => {
  const original = 123456789
  const [w1, w2] = uint32ToWords(original, true)
  const result = wordsToUint32(w1, w2, true)
  assert.strictEqual(result, original)
})

runner.test('int32 <-> words 转换（负数）', async () => {
  const original = -123456
  const [w1, w2] = int32ToWords(original, true)
  const result = wordsToInt32(w1, w2, true)
  assert.strictEqual(result, original)
})

// ========== ModbusTcpClient 测试 ==========

runner.test('ModbusTcpClient 地址偏移计算（40001 -> 0）', async () => {
  const client = new ModbusTcpClient({ connection: {} })
  assert.strictEqual(client._toOffset(40001), 0)
  assert.strictEqual(client._toOffset(40002), 1)
  assert.strictEqual(client._toOffset(40100), 99)
})

runner.test('ModbusTcpClient 寄存器数量计算', async () => {
  const client = new ModbusTcpClient({ connection: {} })
  assert.strictEqual(client._getRegisterCount({ type: 'uint16' }), 1)
  assert.strictEqual(client._getRegisterCount({ type: 'int16' }), 1)
  assert.strictEqual(client._getRegisterCount({ type: 'bool' }), 1)
  assert.strictEqual(client._getRegisterCount({ type: 'float' }), 2)
  assert.strictEqual(client._getRegisterCount({ type: 'uint32' }), 2)
  assert.strictEqual(client._getRegisterCount({ type: 'int32' }), 2)
  assert.strictEqual(client._getRegisterCount({ type: 'string', length: 5 }), 5)
  assert.strictEqual(client._getRegisterCount({ type: 'string' }), 10) // 默认10
})

runner.test('ModbusTcpClient 未支持类型抛出错误', async () => {
  const client = new ModbusTcpClient({ connection: {} })
  assert.throws(() => client._getRegisterCount({ type: 'unknown' }), /未支持数据类型/)
})

runner.test('ModbusTcpClient getStatus 包含连接信息', async () => {
  const client = new ModbusTcpClient({
    connection: { host: '192.168.1.10', port: 502, unitId: 1 }
  })
  const status = client.getStatus()
  assert.strictEqual(status.connected, false)
  assert.strictEqual(status.protocol, 'ModbusTcp')
  assert.strictEqual(status.host, '192.168.1.10')
  assert.strictEqual(status.port, 502)
  assert.strictEqual(status.unitId, 1)
})

runner.test('ModbusTcpClient 未连接时 readTag 抛出错误', async () => {
  const client = new ModbusTcpClient({ connection: {} })
  await assert.rejects(() => client.readTag({ address: 40001, type: 'uint16' }), /PLC 未连接/)
})

module.exports = runner
