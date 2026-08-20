const ModbusRTU = require('modbus-serial')

// 寄存器存储，支持读写
const registers = new Array(200).fill(0)

// 初始化一些测试值
registers[0] = 1      // 40001 设备运行状态 = 运行
registers[1] = 0      // 40002 报警码 = 0
registers[2] = 0      // 40003 急停 = 0

// float 转两个寄存器（注意 swap 顺序与客户端一致）
function floatToRegs(val) {
  const buf = Buffer.alloc(4)
  buf.writeFloatBE(val, 0)
  // 客户端 swap=true，所以这里反序存储
  return [buf.readUInt16BE(2), buf.readUInt16BE(0)]
}

// 初始化 fillVolume = 100.0 (地址 40100 = index 99)
const fv = floatToRegs(100.0)
registers[99] = fv[0]
registers[100] = fv[1]

const vector = {
  getHoldingRegister: function (addr, unitId, callback) {
    callback(null, registers[addr] || 0)
  },
  setRegister: function (addr, value, unitId, callback) {
    registers[addr] = value
    console.log(`[写入] 寄存器 ${addr + 40001} = ${value}`)
    callback()
  }
}

const server = new ModbusRTU.ServerTCP(vector, {
  host: '0.0.0.0',
  port: 502,
  debug: false,
  unitID: 1
})

server.on('error', (err) => {
  console.error('服务器错误:', err.message)
})

console.log('✅ Modbus TCP 模拟服务器已启动')
console.log('   地址: 127.0.0.1:502')
console.log('   从站ID: 1')
console.log('   初始值: fillVolume = 100.0')
console.log('   按 Ctrl+C 停止')
