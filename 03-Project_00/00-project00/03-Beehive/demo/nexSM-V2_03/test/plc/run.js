#!/usr/bin/env node
/**
 * PLC 模块单元测试运行入口
 *
 * 运行方式：
 *   node src/plc/test/run.js              # 运行所有测试
 *   node src/plc/test/run.js modbus       # 只运行 Modbus 测试
 *   node src/plc/test/run.js s7 opcua     # 只运行指定测试
 */

const testFiles = {
  basePlc: './basePlc.test.js',
  modbus: './modbus.test.js',
  s7: './s7.test.js',
  opcua: './opcua.test.js',
  manager: './manager.test.js',
  alarm: './alarm.test.js',
  storage: './storage.test.js'
}

async function run() {
  const args = process.argv.slice(2)
  const selected = args.length > 0 ? args : Object.keys(testFiles)

  let totalPassed = 0
  let totalFailed = 0

  for (const name of selected) {
    if (!testFiles[name]) {
      console.log(`\n⚠️  未知测试模块: ${name}`)
      console.log(`   可选: ${Object.keys(testFiles).join(', ')}`)
      continue
    }

    console.log(`\n📦 模块: ${name.toUpperCase()}`)
    try {
      const runner = require(testFiles[name])
      const passed = await runner.run()
      totalPassed += runner.passed
      totalFailed += runner.failed
    } catch (err) {
      console.log(`  ❌ 测试模块加载失败: ${err.message}`)
      totalFailed++
    }
  }

  console.log('\n========================================')
  console.log(`  总计: 通过 ${totalPassed}，失败 ${totalFailed}`)
  console.log(`  结果: ${totalFailed === 0 ? '✅ 全部通过' : '❌ 存在失败'}`)
  console.log('========================================\n')

  process.exit(totalFailed === 0 ? 0 : 1)
}

run()
