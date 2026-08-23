/**
 * PlcDataStorage 数据持久化单元测试
 */
const { TestRunner, assert } = require('./helpers')
const { PlcDataStorage } = require('../../src/plc/storage/PlcDataStorage')
const fs = require('fs')
const path = require('path')
const os = require('os')

const runner = new TestRunner()

function createStorage() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'plc-test-'))
  return new PlcDataStorage({
    bufferSize: 100,
    flushInterval: 10000, // 测试时不自动刷盘
    dataDir: tmpDir
  })
}

runner.test('存储单条数据', async () => {
  const storage = createStorage()
  storage.store('dev1', 'temperature', 25.5)
  assert.strictEqual(storage.bufferCount, 1)
})

runner.test('批量存储数据', async () => {
  const storage = createStorage()
  storage.storeBatch('dev1', { temperature: 25.5, pressure: 1.2, status: 1 })
  assert.strictEqual(storage.bufferCount, 3)
})

runner.test('缓冲区满时自动刷盘', async () => {
  const storage = createStorage()
  // bufferSize = 100，存储 101 条触发刷盘
  for (let i = 0; i < 101; i++) {
    storage.store('dev1', 'tag', i)
  }
  // 刷盘后缓冲区应清空（或剩余少量）
  assert.ok(storage.bufferCount < 101)
})

runner.test('手动刷盘', async () => {
  const storage = createStorage()
  storage.store('dev1', 'temperature', 25.5)
  storage.store('dev1', 'pressure', 1.2)
  await storage.flush()
  assert.strictEqual(storage.bufferCount, 0)
})

runner.test('刷盘后生成数据文件', async () => {
  const storage = createStorage()
  storage.store('dev1', 'temperature', 25.5)
  await storage.flush()
  const files = fs.readdirSync(storage.dataDir)
  assert.ok(files.length > 0, '应生成数据文件')
  assert.ok(files[0].startsWith('plc-data-'), '文件名应以 plc-data- 开头')
  assert.ok(files[0].endsWith('.jsonl'), '文件应为 .jsonl 格式')
})

runner.test('查询历史数据', async () => {
  const storage = createStorage()
  const now = Date.now()
  // 手动写入测试数据
  storage.store('dev1', 'temperature', 25.5)
  storage.store('dev1', 'temperature', 26.0)
  await storage.flush()

  const results = await storage.query('dev1', 'temperature', now - 60000, now + 60000, 10)
  assert.ok(results.length >= 2, `应查询到至少2条数据，实际 ${results.length}`)
  assert.strictEqual(results[0].device, 'dev1')
  assert.strictEqual(results[0].tag, 'temperature')
})

runner.test('查询限制返回条数', async () => {
  const storage = createStorage()
  for (let i = 0; i < 10; i++) {
    storage.store('dev1', 'v', i)
  }
  await storage.flush()

  const results = await storage.query('dev1', 'v', 0, Date.now() + 60000, 5)
  assert.strictEqual(results.length, 5)
})

runner.test('启动和停止定时刷盘', async () => {
  const storage = createStorage()
  storage.start()
  assert.ok(storage.flushTimer, '应启动定时刷盘')
  await storage.stop()
  assert.strictEqual(storage.flushTimer, null, '停止后应清除定时器')
})

runner.test('停止时刷出剩余数据', async () => {
  const storage = createStorage()
  storage.store('dev1', 'v', 1)
  await storage.stop()
  assert.strictEqual(storage.bufferCount, 0)
})

runner.test('数据记录包含时间戳', async () => {
  const storage = createStorage()
  const before = Date.now()
  storage.store('dev1', 'temperature', 25.5)
  const after = Date.now()
  assert.ok(storage.buffer[0].timestamp >= before)
  assert.ok(storage.buffer[0].timestamp <= after)
})

runner.test('数据记录包含设备和点位', async () => {
  const storage = createStorage()
  storage.store('dev1', 'temperature', 25.5)
  assert.strictEqual(storage.buffer[0].device, 'dev1')
  assert.strictEqual(storage.buffer[0].tag, 'temperature')
  assert.strictEqual(storage.buffer[0].value, 25.5)
})

module.exports = runner
