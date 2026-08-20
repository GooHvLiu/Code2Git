/**
 * PLC 单元测试辅助工具
 * 提供 Mock PLC 设备和测试框架
 */
const assert = require('assert')
const BasePlc = require('../../src/plc/protocols/BasePlc')

/**
 * Mock PLC 设备（用于测试，无需真实硬件）
 * 模拟寄存器读写
 */
class MockPlc extends BasePlc {
  constructor(config = {}) {
    super(config)
    this.config.protocol = 'Mock'
    this.registers = new Array(1000).fill(0) // 模拟 1000 个保持寄存器
    this.readCount = 0
    this.writeCount = 0
    this.shouldFail = false // 测试用：模拟读取失败
  }

  async connect() {
    this.isConnected = true
    this.connectTime = new Date().toISOString()
  }

  async disconnect() {
    this.isConnected = false
  }

  async readTag(tagItem) {
    if (this.shouldFail) throw new Error('Mock read failure')
    this._ensureConnected()
    this.readCount++
    const offset = tagItem.address - 40001
    const count = tagItem.type === 'float' || tagItem.type === 'uint32' || tagItem.type === 'int32' ? 2 : 1

    if (tagItem.type === 'uint16') return this.registers[offset]
    if (tagItem.type === 'bool') return this.registers[offset] !== 0
    if (tagItem.type === 'float') {
      // 简单模拟：直接返回存储的数值（不做真实 float 转换）
      return this.registers[offset] / 10
    }
    return this.registers[offset]
  }

  async writeTag(tagItem, value) {
    this._ensureConnected()
    this.writeCount++
    const offset = tagItem.address - 40001
    if (tagItem.type === 'float') {
      this.registers[offset] = Math.round(value * 10)
    } else if (tagItem.type === 'bool') {
      this.registers[offset] = value ? 1 : 0
    } else {
      this.registers[offset] = value
    }
  }

  /** 设置寄存器值（测试用） */
  setRegister(address, value) {
    this.registers[address - 40001] = value
  }

  /** 获取寄存器值（测试用） */
  getRegister(address) {
    return this.registers[address - 40001]
  }
}

/**
 * 简单测试框架
 */
class TestRunner {
  constructor() {
    this.tests = []
    this.passed = 0
    this.failed = 0
  }

  test(name, fn) {
    this.tests.push({ name, fn })
  }

  async run() {
    console.log('\n========== PLC 模块单元测试 ==========\n')
    for (const { name, fn } of this.tests) {
      try {
        await fn()
        this.passed++
        console.log(`  ✅ ${name}`)
      } catch (err) {
        this.failed++
        console.log(`  ❌ ${name}`)
        console.log(`     错误: ${err.message}`)
        if (err.stack) {
          console.log(`     ${err.stack.split('\n')[1]?.trim()}`)
        }
      }
    }
    console.log(`\n========== 测试结果 ==========`)
    console.log(`  通过: ${this.passed}`)
    console.log(`  失败: ${this.failed}`)
    console.log(`  总计: ${this.passed + this.failed}`)
    console.log(`==============================\n`)
    return this.failed === 0
  }
}

// 常用测试点位配置
const testTags = [
  { tag: 'runStatus', address: 40001, type: 'uint16', rate: 'fast', rw: 'read', desc: '运行状态' },
  { tag: 'temperature', address: 40002, type: 'float', rate: 'fast', rw: 'read', desc: '温度' },
  { tag: 'alarmCode', address: 40003, type: 'uint16', rate: 'fast', rw: 'read', desc: '报警码' },
  { tag: 'setSpeed', address: 40100, type: 'uint16', rate: 'slow', rw: 'write', desc: '设定速度', min: 0, max: 100 },
  { tag: 'setVolume', address: 40102, type: 'float', rate: 'slow', rw: 'write', desc: '设定体积', min: 0, max: 1000 }
]

module.exports = {
  MockPlc,
  TestRunner,
  testTags,
  assert
}
