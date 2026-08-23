<template>
  <div class="time-check">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="time-card">
          <div slot="header" class="card-header">
            <span>⏰ 服务器时间</span>
            <el-button type="primary" size="small" icon="el-icon-refresh" @click="loadServerTime" :loading="loading">同步</el-button>
          </div>
          <div class="time-display">
            <div class="time-big">{{ serverTimeStr }}</div>
            <div class="time-date">{{ serverDateStr }}</div>
            <div class="time-badge">
              <span class="badge-dot"></span>
              来自授权服务器
            </div>
          </div>
          <el-descriptions :column="1" border size="small" style="margin-top:20px">
            <el-descriptions-item label="时间戳(ms)">{{ serverTime }}</el-descriptions-item>
            <el-descriptions-item label="时区">UTC+8 (Asia/Shanghai)</el-descriptions-item>
            <el-descriptions-item label="同步状态">
              <el-tag type="success" size="small" effect="plain">已同步</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="card-header">
            <span>📊 时间对比</span>
          </div>
          <div class="compare-list">
            <div class="compare-item">
              <div class="compare-label">
                <span class="compare-icon" style="background:#667eea">💻</span>
                本地时间
              </div>
              <div class="compare-value">{{ localTimeStr }}</div>
            </div>
            <div class="compare-item">
              <div class="compare-label">
                <span class="compare-icon" style="background:#43e97b">🌐</span>
                服务器时间
              </div>
              <div class="compare-value">{{ serverTimeStr }}</div>
            </div>
            <div class="compare-item highlight" :class="{ warning: timeDiff > 5000 }">
              <div class="compare-label">
                <span class="compare-icon" :style="{ background: timeDiff > 5000 ? '#f5576c' : '#4facfe' }">
                  {{ timeDiff > 5000 ? '⚠️' : '✓' }}
                </span>
                时间偏差
              </div>
              <div class="compare-value">{{ timeDiff > 0 ? Math.round(timeDiff/1000) + ' 秒' : '同步中...' }}</div>
            </div>
          </div>
          <el-alert
            v-if="timeDiff > 5000"
            title="检测到本地时间与服务器时间偏差较大"
            :description="`偏差约 ${Math.round(timeDiff/1000)} 秒，可能影响授权验证的时间校准功能`"
            type="warning"
            show-icon
            :closable="false"
            style="margin-top:16px"
          />
          <el-alert
            v-else-if="serverTime"
            title="本地时间与服务器时间基本一致"
            description="时间偏差在正常范围内，授权验证功能正常"
            type="success"
            show-icon
            :closable="false"
            style="margin-top:16px"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top:20px">
      <div slot="header" class="card-header">
        <span>🛡️ 防时间回退机制</span>
      </div>
      <el-steps :active="4" finish-status="success" align-center class="flow-steps">
        <el-step title="记录时间" description="每次验证写入加密守卫文件" />
        <el-step title="检测回退" description="比较当前与上次记录时间" />
        <el-step title="冻结授权" description="回退超5分钟自动冻结" />
        <el-step title="联网校准" description="调用API校准后自动恢复" />
      </el-steps>
      <el-divider />
      <div class="explain-grid">
        <div class="explain-card">
          <div class="explain-icon">❓</div>
          <div class="explain-title">为什么需要防时间回退？</div>
          <div class="explain-text">如果客户端将系统时间调回授权有效期内，就能绕过过期限制。防回退机制确保时间只能向前流动。</div>
        </div>
        <div class="explain-card">
          <div class="explain-icon">⏱️</div>
          <div class="explain-title">时钟漂移容忍度</div>
          <div class="explain-text">允许 5 分钟的微小时间回退（NTP 同步可能导致），超过此阈值才会触发授权冻结。</div>
        </div>
        <div class="explain-card">
          <div class="explain-icon">🔄</div>
          <div class="explain-title">如何恢复授权？</div>
          <div class="explain-text">检测到回退后，客户端必须联网调用授权服务器 <code>/api/time</code> 获取真实时间，校准成功后自动重置守卫文件。</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getServerTime } from '@/api';
import dayjs from 'dayjs';

export default {
  name: 'TimeCheck',
  data() {
    return { serverTime: 0, localTime: Date.now(), loading: false, timer: null };
  },
  computed: {
    serverTimeStr() { return this.serverTime ? dayjs(this.serverTime).format('HH:mm:ss') : '--:--:--'; },
    serverDateStr() { return this.serverTime ? dayjs(this.serverTime).format('YYYY年MM月DD日 dddd') : ''; },
    localTimeStr() { return dayjs(this.localTime).format('YYYY-MM-DD HH:mm:ss'); },
    timeDiff() { return Math.abs(this.serverTime - this.localTime); }
  },
  async mounted() {
    await this.loadServerTime();
    this.timer = setInterval(() => {
      this.localTime = Date.now();
      if (this.serverTime) this.serverTime += 1000;
    }, 1000);
  },
  beforeDestroy() { clearInterval(this.timer); },
  methods: {
    async loadServerTime() {
      this.loading = true;
      try { const res = await getServerTime(); this.serverTime = res.data.serverTime; }
      catch (e) {} finally { this.loading = false; }
    }
  }
};
</script>

<style lang="less" scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: 600; color: #1a1a2e; }

.time-card { .time-display { text-align: center; padding: 20px 0;
  .time-big { font-size: 56px; font-weight: 700; font-family: 'SF Mono', monospace;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: 2px;
  }
  .time-date { font-size: 16px; color: #606266; margin-top: 8px; }
  .time-badge {
    display: inline-flex; align-items: center; gap: 6px;
    margin-top: 16px; padding: 6px 16px;
    background: #f0f9ff; border-radius: 20px;
    font-size: 12px; color: #409eff;
    .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #67c23a; animation: pulse 2s infinite; }
  }
}
}
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

.compare-list { display: flex; flex-direction: column; gap: 12px; }
.compare-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px; background: #f8f9fc; border-radius: 12px;
  transition: all 0.2s;
  &.highlight { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); }
  &.warning { background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%); }
  .compare-label { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #606266;
    .compare-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    }
  }
  .compare-value { font-size: 15px; font-weight: 600; color: #1a1a2e; font-family: monospace; }
}

.flow-steps { padding: 20px 0; }

.explain-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.explain-card {
  padding: 20px; background: #f8f9fc; border-radius: 12px;
  transition: all 0.2s;
  &:hover { background: #f0f2ff; transform: translateY(-2px); }
  .explain-icon { font-size: 28px; margin-bottom: 10px; }
  .explain-title { font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 8px; }
  .explain-text { font-size: 12px; color: #606266; line-height: 1.7;
    code { background: #e8eaed; padding: 1px 6px; border-radius: 4px; font-size: 11px; color: #667eea; }
  }
}
</style>
