/**
 * 机器指纹生成模块（SDK版）
 * 算法必须与服务端 server/core/machineId.js 完全一致
 * 基于 CPU + 内存 + MAC + 硬盘序列号 生成 SHA256 哈希
 *
 * 稳定性设计：
 * - MAC地址：取所有物理网卡（排除虚拟网卡），排序后拼接，避免枚举顺序变化导致机器码变化
 * - 硬盘：取系统盘（Index=0）序列号，避免多硬盘顺序变化
 * - 所有获取失败的字段返回空字符串而非固定值，避免降低唯一性
 */
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');

// 虚拟网卡关键词（用于排除）
const VIRTUAL_ADAPTER_KEYWORDS = [
  'vmware', 'virtualbox', 'virtual', 'docker', 'wsl',
  'vethernet', 'loopback', 'tap', 'tunnel', 'ppp',
  'hamachi', 'zerotier', 'tailscale', 'wireguard',
  'bluetooth', 'wi-fi direct', 'microsoft wi-fi direct',
  'wan miniport', 'remote ndis', 'usb tethering'
];

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
  return '';
}

/**
 * 获取MAC地址（所有物理网卡，排序后拼接）
 * 关键改进：不再取第一个网卡，而是取所有物理网卡，排序后拼接
 * 这样即使网卡枚举顺序变化，排序后结果一致
 */
function _getMacAddress() {
  try {
    const interfaces = os.networkInterfaces();
    const macList = [];

    for (const name of Object.keys(interfaces)) {
      const iface = interfaces[name];
      // 排除虚拟网卡（基于名称判断）
      if (_isVirtualAdapter(name)) {
        continue;
      }
      for (const item of iface) {
        if (!item.internal && item.mac && item.mac !== '00:00:00:00:00:00') {
          macList.push(item.mac);
        }
      }
    }

    if (macList.length > 0) {
      // 排序后拼接，确保顺序稳定
      return macList.sort().join(',');
    }
  } catch (e) {}
  return '';
}

/**
 * 判断是否为虚拟网卡
 */
function _isVirtualAdapter(name) {
  const lowerName = name.toLowerCase();
  return VIRTUAL_ADAPTER_KEYWORDS.some(keyword => lowerName.includes(keyword));
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
