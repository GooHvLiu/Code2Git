/**
 * PlcManager 多设备管理器单元测试
 */
const { TestRunner, MockPlc, testTags, assert } = require('./helpers')
const { PlcManager, PROTOCOL_MAP } = require('../../src/plc/manager/PlcManager')

const runner = new TestRunner()

// 注入 Mock 协议用于测试
PROTOCOL_MAP.Mock = MockPlc

function createManager() {
  const mgr = new PlcManager()
  return mgr
}

runner.test('注册设备成功', async () => {
  const mgr = createManager()
  mgr.registerDevice('test1', { protocol: 'Mock' }, testTags)
  assert.strictEqual(mgr.size, 1)
  assert.deepStrictEqual(mgr.getDeviceNames(), ['test1'])
})

runner.test('注册重复设备名抛出错误', async () => {
  const mgr = createManager()
  mgr.registerDevice('dup', { protocol: 'Mock' }, [])
  assert.throws(() => mgr.registerDevice('dup', { protocol: 'Mock' }, []), /已注册/)
})

runner.test('注册不支持的协议抛出错误', async () => {
  const mgr = createManager()
  assert.throws(
    () => mgr.registerDevice('bad', { protocol: 'UnknownProto' }, []),
    /不支持的协议/
  )
})

runner.test('获取未注册设备抛出错误', async () => {
  const mgr = createManager()
  assert.throws(() => mgr.getDevice('notexist'), /未注册/)
  assert.throws(() => mgr.getClient('notexist'), /未注册/)
})

runner.test('连接所有设备', async () => {
  const mgr = createManager()
  mgr.registerDevice('dev1', { protocol: 'Mock' }, testTags)
  mgr.registerDevice('dev2', { protocol: 'Mock' }, testTags)
  const results = await mgr.connectAll()
  assert.strictEqual(results.dev1.success, true)
  assert.strictEqual(results.dev2.success, true)
  assert.strictEqual(mgr.getDevice('dev1').connected, true)
  assert.strictEqual(mgr.getDevice('dev2').connected, true)
})

runner.test('读取单个点位', async () => {
  const mgr = createManager()
  mgr.registerDevice('dev1', { protocol: 'Mock' }, testTags)
  await mgr.connectAll()
  mgr.getClient('dev1').setRegister(40001, 5)
  const val = await mgr.readTag('dev1', 'runStatus')
  assert.strictEqual(val, 5)
})

runner.test('读取不存在的点位抛出错误', async () => {
  const mgr = createManager()
  mgr.registerDevice('dev1', { protocol: 'Mock' }, testTags)
  await mgr.connectAll()
  await assert.rejects(() => mgr.readTag('dev1', 'notexist'), /不存在/)
})

runner.test('读取所有点位（批量）', async () => {
  const mgr = createManager()
  mgr.registerDevice('dev1', { protocol: 'Mock' }, testTags)
  await mgr.connectAll()
  mgr.getClient('dev1').setRegister(40001, 1)
  mgr.getClient('dev1').setRegister(40003, 99)
  const values = await mgr.readAllTags('dev1')
  assert.strictEqual(values.runStatus, 1)
  assert.strictEqual(values.alarmCode, 99)
})

runner.test('写入点位', async () => {
  const mgr = createManager()
  mgr.registerDevice('dev1', { protocol: 'Mock' }, testTags)
  await mgr.connectAll()
  await mgr.writeTag('dev1', 'setSpeed', 50)
  const val = await mgr.readTag('dev1', 'setSpeed')
  assert.strictEqual(val, 50)
})

runner.test('写入只读点位抛出错误', async () => {
  const mgr = createManager()
  mgr.registerDevice('dev1', { protocol: 'Mock' }, testTags)
  await mgr.connectAll()
  await assert.rejects(() => mgr.writeTag('dev1', 'runStatus', 2), /只读/)
})

runner.test('数据缓存', async () => {
  const mgr = createManager()
  mgr.registerDevice('dev1', { protocol: 'Mock' }, testTags)
  await mgr.connectAll()
  mgr.getClient('dev1').setRegister(40001, 3)
  await mgr.readTag('dev1', 'runStatus')
  const cache = mgr.getCachedData('dev1')
  assert.strictEqual(cache.runStatus, 3)
})

runner.test('获取所有设备状态', async () => {
  const mgr = createManager()
  mgr.registerDevice('dev1', { protocol: 'Mock' }, testTags)
  mgr.registerDevice('dev2', { protocol: 'Mock' }, testTags)
  await mgr.connectAll()
  const status = mgr.getAllStatus()
  assert.ok(status.dev1)
  assert.ok(status.dev2)
  assert.strictEqual(status.dev1.connected, true)
  assert.strictEqual(status.dev2.connected, true)
  assert.strictEqual(status.dev1.tagCount, testTags.length)
})

runner.test('移除设备', async () => {
  const mgr = createManager()
  mgr.registerDevice('dev1', { protocol: 'Mock' }, testTags)
  await mgr.connectAll()
  await mgr.removeDevice('dev1')
  assert.strictEqual(mgr.size, 0)
  assert.throws(() => mgr.getDevice('dev1'), /未注册/)
})

runner.test('断开所有设备', async () => {
  const mgr = createManager()
  mgr.registerDevice('dev1', { protocol: 'Mock' }, testTags)
  mgr.registerDevice('dev2', { protocol: 'Mock' }, testTags)
  await mgr.connectAll()
  await mgr.disconnectAll()
  assert.strictEqual(mgr.getDevice('dev1').connected, false)
  assert.strictEqual(mgr.getDevice('dev2').connected, false)
})

module.exports = runner
