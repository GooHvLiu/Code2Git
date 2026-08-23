/**
 * 时间防护模块
 * 核心能力：
 * 1. 防时间回退：记录每次验证的时间戳，如果系统时间被调回过去，立即检测到
 * 2. 联网时间校准：通过授权服务器或公共时间API获取真实时间
 * 3. 时间偏移计算：计算本地时间与真实时间的偏差，用于授权验证时校准
 *
 * 工作原理：
 * - 每次授权验证时，将当前时间写入加密的时间守卫文件（.timeguard）
 * - 下次验证时，读取上次记录的时间，如果当前时间 < 上次时间，判定为时间回退
 * - 时间回退后授权失效，必须联网校准恢复
 * - 联网校准成功后，重置时间守卫文件
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

class TimeGuard {
  constructor() {
    this.guardFile = null;
    this.timeOffset = 0; // 本地时间与真实时间的偏差（毫秒）
    this.lastSyncTime = 0; // 上次联网校准时间
  }

  /**
   * 初始化时间守卫（指定守卫文件路径）
   * @param {string} guardFilePath 时间守卫文件路径
   */
  init(guardFilePath) {
    this.guardFile = guardFilePath;
    // 确保目录存在
    const dir = path.dirname(guardFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // 读取已有的时间偏移
    this._loadGuard();
  }

  /**
   * 加载守卫文件
   */
  _loadGuard() {
    try {
      if (this.guardFile && fs.existsSync(this.guardFile)) {
        const content = fs.readFileSync(this.guardFile, 'utf8');
        const data = JSON.parse(this._decrypt(content));
        this.timeOffset = data.timeOffset || 0;
        this.lastSyncTime = data.lastSyncTime || 0;
      }
    } catch (e) {
      console.error('[TimeGuard] 加载守卫文件失败:', e.message);
    }
  }

  /**
   * 保存守卫文件
   */
  _saveGuard() {
    try {
      if (!this.guardFile) return;
      const data = {
        lastCheckTime: Date.now(),
        timeOffset: this.timeOffset,
        lastSyncTime: this.lastSyncTime,
        version: '1.0'
      };
      const encrypted = this._encrypt(JSON.stringify(data));
      fs.writeFileSync(this.guardFile, encrypted, 'utf8');
    } catch (e) {
      console.error('[TimeGuard] 保存守卫文件失败:', e.message);
    }
  }

  /**
   * 检查时间是否被回退
   * @returns {Object} { ok: boolean, reason: string, currentTime: number }
   */
  checkTimeRollback() {
    try {
      if (!this.guardFile || !fs.existsSync(this.guardFile)) {
        // 首次运行，创建守卫文件
        this._saveGuard();
        return { ok: true, reason: '首次运行，初始化时间守卫' };
      }

      const content = fs.readFileSync(this.guardFile, 'utf8');
      const data = JSON.parse(this._decrypt(content));
      const lastCheckTime = data.lastCheckTime || 0;
      const currentTime = Date.now();

      // 允许5分钟的时钟漂移误差（NTP同步可能导致微小回退）
      const driftTolerance = 5 * 60 * 1000;

      if (currentTime < lastCheckTime - driftTolerance) {
        const rollbackAmount = lastCheckTime - currentTime;
        return {
          ok: false,
          reason: `检测到系统时间被回退（回退约 ${Math.round(rollbackAmount / 1000)} 秒），授权已冻结，请联网校准时间`,
          currentTime,
          lastCheckTime,
          rollbackAmount
        };
      }

      // 时间正常，更新守卫文件
      this._saveGuard();
      return { ok: true, reason: '时间正常' };
    } catch (e) {
      console.error('[TimeGuard] 时间检查异常:', e.message);
      // 异常情况下保守处理：视为时间异常
      return { ok: false, reason: '时间守卫文件损坏，请联网校准恢复' };
    }
  }

  /**
   * 联网获取真实时间
   * 优先调用授权服务器，失败则调用公共时间API
   * @param {string} [serverUrl] 授权服务器时间API地址
   * @returns {Promise<Object>} { ok: boolean, serverTime: number, offset: number, source: string }
   */
  async syncNetworkTime(serverUrl) {
    const sources = [];

    // 1. 授权服务器（优先）
    if (serverUrl) {
      sources.push({ url: `${serverUrl}/api/time`, source: 'license_server' });
    }

    // 2. 公共时间API（备用）
    sources.push({ url: 'https://worldtimeapi.org/api/timezone/Etc/UTC', source: 'worldtimeapi' });
    sources.push({ url: 'http://worldtimeapi.org/api/ip', source: 'worldtimeapi_ip' });

    for (const src of sources) {
      try {
        const startTime = Date.now();
        const response = await axios.get(src.url, { timeout: 5000 });
        const endTime = Date.now();
        const latency = (endTime - startTime) / 2; // 估算网络延迟

        let serverTime;
        if (src.source === 'license_server') {
          serverTime = response.data?.data?.serverTime || response.data?.serverTime;
        } else {
          // worldtimeapi 返回 unixtime（秒）
          serverTime = response.data?.unixtime ? response.data.unixtime * 1000 : null;
        }

        if (serverTime) {
          const trueTime = serverTime + latency;
          this.timeOffset = trueTime - Date.now();
          this.lastSyncTime = Date.now();
          this._saveGuard();

          console.log(`[TimeGuard] 时间校准成功，来源: ${src.source}，偏差: ${Math.round(this.timeOffset)}ms`);
          return {
            ok: true,
            serverTime: trueTime,
            offset: this.timeOffset,
            source: src.source,
            latency
          };
        }
      } catch (e) {
        console.warn(`[TimeGuard] 时间源 ${src.source} 不可用: ${e.message}`);
        continue;
      }
    }

    return { ok: false, reason: '所有时间源均不可用，请检查网络连接' };
  }

  /**
   * 获取校准后的真实时间
   * @returns {number} 校准后的时间戳
   */
  getTrueTime() {
    return Date.now() + this.timeOffset;
  }

  /**
   * 重置时间守卫（联网校准成功后调用，清除回退状态）
   */
  reset() {
    this.timeOffset = 0;
    this._saveGuard();
    return { ok: true, reason: '时间守卫已重置' };
  }

  /**
   * 简单加密（XOR + Base64），用于守卫文件
   */
  _encrypt(text) {
    const key = 'BeehiveTimeGuard@2024';
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return Buffer.from(result, 'binary').toString('base64');
  }

  _decrypt(encoded) {
    const key = 'BeehiveTimeGuard@2024';
    const text = Buffer.from(encoded, 'base64').toString('binary');
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }
}

module.exports = new TimeGuard();
