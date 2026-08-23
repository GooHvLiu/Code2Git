/**
 * 时间防护模块（SDK版）
 * 算法必须与服务端 server/core/timeGuard.js 完全一致
 *
 * 核心能力：
 * 1. 防时间回退：记录每次验证时间，检测系统时间被调回
 * 2. 联网校准：调用授权服务器或公共时间API获取真实时间
 * 3. 时间偏移：计算本地与真实时间偏差
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const GUARD_KEY = 'BeehiveTimeGuard@2024';

class TimeGuard {
  constructor() {
    this.guardFile = null;
    this.timeOffset = 0;
    this.lastSyncTime = 0;
  }

  init(guardFilePath) {
    this.guardFile = guardFilePath;
    const dir = path.dirname(guardFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this._loadGuard();
  }

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
   */
  checkTimeRollback() {
    try {
      if (!this.guardFile || !fs.existsSync(this.guardFile)) {
        this._saveGuard();
        return { ok: true, reason: '首次运行，初始化时间守卫' };
      }

      const content = fs.readFileSync(this.guardFile, 'utf8');
      const data = JSON.parse(this._decrypt(content));
      const lastCheckTime = data.lastCheckTime || 0;
      const currentTime = Date.now();
      const driftTolerance = 5 * 60 * 1000; // 允许5分钟时钟漂移

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

      this._saveGuard();
      return { ok: true, reason: '时间正常' };
    } catch (e) {
      console.error('[TimeGuard] 时间检查异常:', e.message);
      return { ok: false, reason: '时间守卫文件损坏，请联网校准恢复' };
    }
  }

  /**
   * 联网获取真实时间
   * 多时间源容错：授权服务器 -> 公网网站响应头Date -> 公共时间API
   */
  async syncNetworkTime(serverUrl) {
    const sources = [];

    // 1. 授权服务器时间接口（如果提供了serverUrl）
    if (serverUrl) {
      sources.push({ url: `${serverUrl}/api/time`, source: 'license_server', type: 'json' });
    }

    // 2. 公网稳定网站（从响应头Date字段获取时间，无需专用接口）
    sources.push({ url: 'https://www.baidu.com', source: 'baidu', type: 'header' });
    sources.push({ url: 'https://www.taobao.com', source: 'taobao', type: 'header' });
    sources.push({ url: 'https://www.jd.com', source: 'jd', type: 'header' });

    // 3. 公共时间API（返回JSON）
    sources.push({ url: 'https://worldtimeapi.org/api/timezone/Etc/UTC', source: 'worldtimeapi', type: 'json' });
    sources.push({ url: 'http://worldtimeapi.org/api/ip', source: 'worldtimeapi_ip', type: 'json' });

    for (const src of sources) {
      try {
        const startTime = Date.now();
        const response = await axios.get(src.url, {
          timeout: 5000,
          // 公网网站可能返回HTML，不需要解析body，只要响应头就行
          responseType: src.type === 'header' ? 'text' : 'json',
          validateStatus: () => true // 不校验状态码，只要有响应头Date就行
        });
        const endTime = Date.now();
        const latency = (endTime - startTime) / 2;

        let serverTime = null;

        if (src.type === 'header') {
          // 从响应头Date字段解析时间
          const dateHeader = response.headers?.date;
          if (dateHeader) {
            serverTime = new Date(dateHeader).getTime();
          }
        } else if (src.source === 'license_server') {
          serverTime = response.data?.data?.serverTime || response.data?.serverTime;
        } else {
          serverTime = response.data?.unixtime ? response.data.unixtime * 1000 : null;
        }

        if (serverTime && !isNaN(serverTime)) {
          const trueTime = serverTime + latency;
          this.timeOffset = trueTime - Date.now();
          this.lastSyncTime = Date.now();
          this._saveGuard();
          return { ok: true, serverTime: trueTime, offset: this.timeOffset, source: src.source, latency };
        }
      } catch (e) {
        continue;
      }
    }
    return { ok: false, reason: '所有时间源均不可用，请检查网络连接' };
  }

  getTrueTime() {
    return Date.now() + this.timeOffset;
  }

  reset() {
    this.timeOffset = 0;
    this._saveGuard();
    return { ok: true, reason: '时间守卫已重置' };
  }

  _encrypt(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ GUARD_KEY.charCodeAt(i % GUARD_KEY.length));
    }
    return Buffer.from(result, 'binary').toString('base64');
  }

  _decrypt(encoded) {
    const text = Buffer.from(encoded, 'base64').toString('binary');
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ GUARD_KEY.charCodeAt(i % GUARD_KEY.length));
    }
    return result;
  }
}

module.exports = new TimeGuard();
module.exports.TimeGuard = TimeGuard;
