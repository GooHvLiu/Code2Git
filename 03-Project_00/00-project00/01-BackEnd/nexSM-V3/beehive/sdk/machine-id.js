/**
 * 机器指纹生成模块（SDK版）
 * 算法必须与服务端 server/core/machineId.js 完全一致
 * 基于 CPU + 内存 + MAC + 硬盘序列号 生成 SHA256 哈希
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
    macAddress: _getMacAddress(),
    diskSerial: _getDiskSerial()
  };
}

function getMachineId() {
  const info = getMachineInfo();
  const raw = [
    info.cpus,
    info.totalMem,
    info.macAddress,
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
  return 'unknown_cpu';
}

function _getMacAddress() {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const iface = interfaces[name];
      for (const item of iface) {
        if (!item.internal && item.mac && item.mac !== '00:00:00:00:00:00') {
          return item.mac;
        }
      }
    }
  } catch (e) {}
  return '00:00:00:00:00:00';
}

function _getDiskSerial() {
  try {
    const platform = os.platform();
    if (platform === 'win32') {
      const output = execSync('wmic diskdrive get serialnumber', { encoding: 'utf8', timeout: 3000 });
      const lines = output.trim().split('\n').filter(l => l.trim());
      if (lines.length > 1) return lines[1].trim();
    } else if (platform === 'linux') {
      const output = execSync('cat /sys/block/sda/serial 2>/dev/null || echo "unknown"', { encoding: 'utf8', timeout: 3000 });
      return output.trim();
    } else if (platform === 'darwin') {
      const output = execSync('diskutil info / | grep "Volume UUID"', { encoding: 'utf8', timeout: 3000 });
      return output.trim();
    }
  } catch (e) {}
  return 'unknown_disk';
}

module.exports = { getMachineId, getMachineInfo };
