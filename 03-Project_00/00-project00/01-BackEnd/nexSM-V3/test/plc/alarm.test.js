/**
 * PlcAlarmEngine 告警规则引擎单元测试
 */
const { TestRunner, assert } = require('./helpers')
const { PlcAlarmEngine } = require('../../src/plc/alarm/PlcAlarmEngine')

const runner = new TestRunner()

function createEngine() {
  return new PlcAlarmEngine()
}

runner.test('添加阈值告警规则', async () => {
  const engine = createEngine()
  const id = engine.addRule({
    device: 'dev1',
    tag: 'temperature',
    type: 'threshold',
    operator: '>',
    threshold: 80,
    level: 'critical',
    message: '温度过高'
  })
  assert.ok(id)
  assert.strictEqual(engine.getRules().length, 1)
})

runner.test('阈值告警 > 触发', async () => {
  const engine = createEngine()
  engine.addRule({
    tag: 'temperature',
    type: 'threshold',
    operator: '>',
    threshold: 80,
    message: '温度过高'
  })
  const triggered = engine.evaluate('dev1', { temperature: 90 })
  assert.strictEqual(triggered.length, 1)
  assert.strictEqual(triggered[0].value, 90)
})

runner.test('阈值告警 < 不触发', async () => {
  const engine = createEngine()
  engine.addRule({
    tag: 'temperature',
    type: 'threshold',
    operator: '>',
    threshold: 80,
    message: '温度过高'
  })
  const triggered = engine.evaluate('dev1', { temperature: 70 })
  assert.strictEqual(triggered.length, 0)
})

runner.test('阈值告警各运算符', async () => {
  const engine = createEngine()
  const operators = [
    { op: '>', val: 81, threshold: 80, expect: true },
    { op: '>', val: 80, threshold: 80, expect: false },
    { op: '>=', val: 80, threshold: 80, expect: true },
    { op: '<', val: 79, threshold: 80, expect: true },
    { op: '<=', val: 80, threshold: 80, expect: true },
    { op: '==', val: 80, threshold: 80, expect: true },
    { op: '!=', val: 81, threshold: 80, expect: true }
  ]
  for (const { op, val, threshold, expect } of operators) {
    const e = createEngine()
    e.addRule({ tag: 'v', type: 'threshold', operator: op, threshold })
    const t = e.evaluate('dev', { v: val })
    assert.strictEqual(t.length > 0, expect, `${op} ${val} ${threshold} 期望 ${expect}`)
  }
})

runner.test('状态告警触发', async () => {
  const engine = createEngine()
  engine.addRule({
    tag: 'runStatus',
    type: 'status',
    value: 2,
    level: 'critical',
    message: '设备故障'
  })
  const triggered = engine.evaluate('dev1', { runStatus: 2 })
  assert.strictEqual(triggered.length, 1)
  assert.strictEqual(triggered[0].message, '设备故障')
})

runner.test('状态告警恢复时清除', async () => {
  const engine = createEngine()
  engine.addRule({
    tag: 'runStatus',
    type: 'status',
    value: 2,
    message: '设备故障'
  })
  engine.evaluate('dev1', { runStatus: 2 }) // 触发
  assert.strictEqual(engine.getActiveAlarms().length, 1)
  engine.evaluate('dev1', { runStatus: 1 }) // 恢复
  assert.strictEqual(engine.getActiveAlarms().length, 0)
})

runner.test('变化告警触发', async () => {
  const engine = createEngine()
  engine.addRule({
    tag: 'mode',
    type: 'change',
    message: '模式变化'
  })
  engine.evaluate('dev1', { mode: 1 }) // 第一次，不触发
  assert.strictEqual(engine.getActiveAlarms().length, 0)
  const triggered = engine.evaluate('dev1', { mode: 2 }) // 变化，触发
  assert.strictEqual(triggered.length, 1)
})

runner.test('相同值不重复触发告警', async () => {
  const engine = createEngine()
  engine.addRule({
    tag: 'temperature',
    type: 'threshold',
    operator: '>',
    threshold: 80,
    message: '温度过高'
  })
  engine.evaluate('dev1', { temperature: 90 }) // 第一次触发
  assert.strictEqual(engine.getActiveAlarms().length, 1)
  const triggered = engine.evaluate('dev1', { temperature: 95 }) // 仍在告警，不重复触发
  assert.strictEqual(triggered.length, 0)
  assert.strictEqual(engine.getActiveAlarms().length, 1)
})

runner.test('告警回调触发', async () => {
  const engine = createEngine()
  let callbackAlarm = null
  engine.setAlarmCallback((alarm) => {
    callbackAlarm = alarm
  })
  engine.addRule({
    tag: 'temperature',
    type: 'threshold',
    operator: '>',
    threshold: 80,
    message: '温度过高'
  })
  engine.evaluate('dev1', { temperature: 90 })
  assert.ok(callbackAlarm)
  assert.strictEqual(callbackAlarm.message, '温度过高')
})

runner.test('禁用规则不触发', async () => {
  const engine = createEngine()
  engine.addRule({
    tag: 'temperature',
    type: 'threshold',
    operator: '>',
    threshold: 80,
    enabled: false,
    message: '温度过高'
  })
  const triggered = engine.evaluate('dev1', { temperature: 90 })
  assert.strictEqual(triggered.length, 0)
})

runner.test('移除规则', async () => {
  const engine = createEngine()
  const id = engine.addRule({
    tag: 'temperature',
    type: 'threshold',
    operator: '>',
    threshold: 80
  })
  assert.strictEqual(engine.getRules().length, 1)
  engine.removeRule(id)
  assert.strictEqual(engine.getRules().length, 0)
})

runner.test('清除所有活跃告警', async () => {
  const engine = createEngine()
  engine.addRule({ tag: 't', type: 'threshold', operator: '>', threshold: 80 })
  engine.evaluate('dev', { t: 90 })
  assert.strictEqual(engine.getActiveAlarms().length, 1)
  engine.clearAll()
  assert.strictEqual(engine.getActiveAlarms().length, 0)
})

module.exports = runner
