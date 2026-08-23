/**
 * 机器指纹生成模块
 * 基于 CPU + 主板 + MAC 地址 + 硬盘序列号 生成唯一机器ID
 * 用于授权文件与硬件绑定，防止授权文件拷贝到其他机器使用
 *
 * 注意：本模块同时被服务端（生成授权时录入）和客户端SDK（验证时比对）使用
 * 算法必须保持一致
 */
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');

class MachineId {
  /**
   * 获取机器指纹信息（原始组件）
   */
  getMachineInfo() {
    const info = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpus: this._getCpuInfo(),
      totalMem: os.totalmem(),
      macAddress: this._getMacAddress(),
      diskSerial: this._getDiskSerial()
    };
    return info;
  }

  /**
   * 生成机器唯一ID（SHA256哈希）
   * @returns {string} 64位十六进制字符串
   */
  getMachineId() {
    const info = this.getMachineInfo();
    // 组合关键硬件信息（排除可能变化的字段如hostname）
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

  /**
   * 获取CPU信息（型号+核心数）
   */
  _getCpuInfo() {
    try {
      const cpus = os.cpus();
      if (cpus && cpus.length > 0) {
        return `${cpus[0].model}_${cpus.length}`;
      }
    } catch (e) {}
    return 'unknown_cpu';
  }

  /**
   * 获取MAC地址（取第一个非内部网卡）
   */
  _getMacAddress() {
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

  /**
   * 获取硬盘序列号
   * 跨平台：Windows用wmic，Linux用hdparm/smartctl，macOS用diskutil
   */
  _getDiskSerial() {
    try {
      const platform = os.platform();
      if (platform === 'win32') {
        // Windows: wmic diskdrive get serialnumber
        const output = execSync('wmic diskdrive get serialnumber', { encoding: 'utf8', timeout: 3000 });
        const lines = output.trim().split('\n').filter(l => l.trim());
        if (lines.length > 1) return lines[1].trim();
      } else if (platform === 'linux') {
        // Linux: 读取 /sys/block
        const output = execSync('cat /sys/block/sda/serial 2>/dev/null || echo "unknown"', { encoding: 'utf8', timeout: 3000 });
        return output.trim();
      } else if (platform === 'darwin') {
        const output = execSync('diskutil info / | grep "Volume UUID"', { encoding: 'utf8', timeout: 3000 });
        return output.trim();
      }
    } catch (e) {
      // 静默失败，返回默认值
    }
    return 'unknown_disk';
  }
}

module.exports = new MachineId();
