/**
 * BasePlc 抽象基类单元测试
 */
const { TestRunner, MockPlc, testTags, assert } = require('./helpers')
const BasePlc = require('../../src/plc/protocols/BasePlc')

const runner = new TestRunner()

runner.test('BasePlc 子类必须实现 connect', async () => {
  class IncompletePlc extends BasePlc { }
  const plc = new IncompletePlc({})
  await assert.rejects(() => plc.connect(), /子类必须实现 connect/)
})

runner.test('BasePlc 子类必须实现 disconnect', async () => {
  class IncompletePlc extends BasePlc {
    async connect() { }
  }
  const plc = new IncompletePlc({})
  await assert.rejects(() => plc.disconnect(), /子类必须实现 disconnect/)
})

runner.test('BasePlc 子类必须实现 readTag', async () => {
  class IncompletePlc extends BasePlc {
    async connect() { }
    async disconnect() { }
  }
  const plc = new IncompletePlc({})
  await assert.rejects(() => plc.readTag({}), /子类必须实现 readTag/)
})

runner.test('BasePlc 子类必须实现 writeTag', async () => {
  class IncompletePlc extends BasePlc {
    async connect() { }
    async disconnect() { }
    async readTag() { }
  }
  const plc = new IncompletePlc({})
  await assert.rejects(() => plc.writeTag({}, 1), /子类必须实现 writeTag/)
})

runner.test('BasePlc getStatus 返回连接状态', async () => {
  const plc = new MockPlc({})
  const status = plc.getStatus()
  assert.strictEqual(status.connected, false)
  assert.strictEqual(status.protocol, 'Mock')
})

runner.test('BasePlc _ensureConnected 未连接时抛出错误', async () => {
  const plc = new MockPlc({})
  assert.throws(() => plc._ensureConnected(), /PLC 未连接/)
})

runner.test('BasePlc readTags 默认逐个读取', async () => {
  const plc = new MockPlc({})
  await plc.connect()
  plc.setRegister(40001, 1)
  plc.setRegister(40003, 99)

  const result = await plc.readTags([testTags[0], testTags[2]])
  assert.strictEqual(result.runStatus, 1)
  assert.strictEqual(result.alarmCode, 99)
  assert.strictEqual(plc.readCount, 2)
})

runner.test('BasePlc readTags 空数组返回空对象', async () => {
  const plc = new MockPlc({})
  await plc.connect()
  const result = await plc.readTags([])
  assert.deepStrictEqual(result, {})
})

module.exports = runner
