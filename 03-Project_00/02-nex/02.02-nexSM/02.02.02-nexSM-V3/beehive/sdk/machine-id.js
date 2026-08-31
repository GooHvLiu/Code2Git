/**
 * 机器指纹生成模块（SDK版）
 * 算法必须与服务端 server/core/machineId.js 完全一致
 * 基于 CPU + 内存 + 硬盘序列号 + 平台 + 架构 生成 SHA256 哈希
 *
 * 稳定性设计：
 * - 不使用MAC地址：MAC地址会因换网络、睡眠唤醒、VPN、虚拟网卡等情况变化，不稳定
 * - 硬盘：取系统盘（Index=0）序列号，避免多硬盘顺序变化
 * - 所有获取失败的字段返回空字符串而非固定值，避免降低唯一性
 */
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');

function getMachineInfo() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: _getCpuInfo(),
    totalMem: os.totalmem(),
    diskSerial: _getDiskSerial()
  };
}

function getMachineId() {
  const info = getMachineInfo();
  const raw = [
    info.cpus,
    info.totalMem,
    info.diskSerial,
    info.platform,
    info.arch
  ].join('|');
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function _getCpuInfo() {
  try {
    const cpus = os.cpus();
    if (cpus && cpus.length > 0) {
      return `${cpus[0].model}_${cpus.length}`;
    }
  } catch (e) {}
  return '';
}

/**
 * 获取硬盘序列号（取系统盘 Index=0）
 * 改进：指定 Index=0 取系统盘，避免多硬盘顺序变化
 */
function _getDiskSerial() {
  try {
    const platform = os.platform();
    if (platform === 'win32') {
      // Windows: 取系统盘（Index=0）序列号
      const output = execSync('wmic diskdrive where Index=0 get serialnumber', { encoding: 'utf8', timeout: 3000 });
      const lines = output.trim().split('\n').filter(l => l.trim());
      if (lines.length > 1) return lines[1].trim();
    } else if (platform === 'linux') {
      const output = execSync('cat /sys/block/sda/serial 2>/dev/null || echo ""', { encoding: 'utf8', timeout: 3000 });
      return output.trim();
    } else if (platform === 'darwin') {
      const output = execSync('diskutil info / | grep "Volume UUID"', { encoding: 'utf8', timeout: 3000 });
      return output.trim();
    }
  } catch (e) {}
  return '';
}

module.exports = { getMachineId, getMachineInfo };
