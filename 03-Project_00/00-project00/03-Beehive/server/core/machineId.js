/**
 * 机器指纹生成模块
 * 基于 CPU + 内存 + 硬盘序列号 + 平台 + 架构 生成唯一机器ID
 * 用于授权文件与硬件绑定，防止授权文件拷贝到其他机器使用
 *
 * 注意：本模块同时被服务端（生成授权时录入）和客户端SDK（验证时比对）使用
 * 算法必须保持一致
 *
 * 稳定性设计：
 * - 不使用MAC地址：MAC地址会因换网络、睡眠唤醒、VPN、虚拟网卡等情况变化，不稳定
 * - 硬盘：取系统盘（Index=0）序列号，避免多硬盘顺序变化
 * - 所有获取失败的字段返回空字符串而非固定值，避免降低唯一性
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
    // 组合关键硬件信息（排除可能变化的字段如hostname、MAC地址）
    const raw = [
      info.cpus,
      info.totalMem,
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
    return '';
  }

  /**
   * 获取硬盘序列号（取系统盘 Index=0）
   * 改进：指定 Index=0 取系统盘，避免多硬盘顺序变化
   */
  _getDiskSerial() {
    try {
      const platform = os.platform();
      if (platform === 'win32') {
        // Windows: 取系统盘（Index=0）序列号
        const output = execSync('wmic diskdrive where Index=0 get serialnumber', { encoding: 'utf8', timeout: 3000 });
        const lines = output.trim().split('\n').filter(l => l.trim());
        if (lines.length > 1) return lines[1].trim();
      } else if (platform === 'linux') {
        // Linux: 读取系统盘（根目录所在盘）
        const output = execSync('cat /sys/block/sda/serial 2>/dev/null || echo ""', { encoding: 'utf8', timeout: 3000 });
        return output.trim();
      } else if (platform === 'darwin') {
        const output = execSync('diskutil info / | grep "Volume UUID"', { encoding: 'utf8', timeout: 3000 });
        return output.trim();
      }
    } catch (e) {
      // 静默失败，返回空字符串
    }
    return '';
  }
}

module.exports = new MachineId();
