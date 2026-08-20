/**
 * PLC点位映射配置
 * tag: 业务字段名（前后端统一用这个名字，不要写寄存器地址到接口）
 * address: 协议原始地址（Modbus 4x保持寄存器，如 40001）
 * type: uint16 / int16 / uint32 / int32 / float / bool / string
 * rate: fast高频轮询 | slow低频轮询
 * rw: read只读 / write可读写
 * desc: 中文描述
 * min/max: 可选，写入值范围校验
 * length: string 类型专用，寄存器数量（默认10）
 */
module.exports = [
  // ========== 状态类（fast 高频轮询） ==========
  {
    tag: 'deviceRunStatus',
    address: 40001,
    type: 'uint16',
    rate: 'fast',
    rw: 'read',
    desc: '设备运行状态 0-停止 1-运行 2-故障'
  },
  {
    tag: 'alarmCode',
    address: 40002,
    type: 'uint16',
    rate: 'fast',
    rw: 'read',
    desc: '当前报警编码'
  },
  {
    tag: 'emergencyStop',
    address: 40003,
    type: 'bool',
    rate: 'fast',
    rw: 'read',
    desc: '急停信号 true-触发 false-正常'
  },

  // ========== 工艺参数类（fast） ==========
  {
    tag: 'temperature',
    address: 40010,
    type: 'float',
    rate: 'fast',
    rw: 'read',
    desc: '料液温度（℃）'
  },
  {
    tag: 'pressure',
    address: 40012,
    type: 'float',
    rate: 'fast',
    rw: 'read',
    desc: '系统压力(MPa)'
  },

  // ========== 可写参数类（slow 低频轮询） ==========
  {
    tag: 'fillVolume',
    address: 40100,
    type: 'float',
    rate: 'slow',
    rw: 'write',
    desc: '灌装体积(mL)',
    min: 0,
    max: 1000
  },
  {
    tag: 'fillSpeed',
    address: 40102,
    type: 'uint16',
    rate: 'slow',
    rw: 'write',
    desc: '灌装速度（档）',
    min: 1,
    max: 10
  },
  {
    tag: 'targetTemperature',
    address: 40104,
    type: 'float',
    rate: 'slow',
    rw: 'write',
    desc: '目标温度（℃）',
    min: 0,
    max: 100
  },
  {
    tag: 'deviceMode',
    address: 40110,
    type: 'uint16',
    rate: 'slow',
    rw: 'write',
    desc: '设备模式 0-手动 1-自动 2-调试'
  },

  // ========== 字符串类（slow） ==========
  {
    tag: 'batchNumber',
    address: 40200,
    type: 'string',
    length: 10,
    rate: 'slow',
    rw: 'read',
    desc: '当前批次号'
  }
]
