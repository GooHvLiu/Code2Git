<template>
  <div class="overview-container">
    <!-- 第一行：4个核心指标卡片 -->
    <el-row :gutter="16" class="top-row">
      <!-- 设备运行状态 -->
      <el-col :span="6">
        <div class="status-card" :class="deviceStatus.status">
          <div class="card-icon">
            <i :class="deviceStatus.icon"></i>
          </div>
          <div class="card-content">
            <div class="card-label">设备运行状态</div>
            <div class="card-value">{{ deviceStatus.text }}</div>
            <div class="card-sub">已运行 {{ deviceStatus.duration }}</div>
          </div>
          <div class="status-pulse" v-if="deviceStatus.status === 'running'"></div>
        </div>
      </el-col>

      <!-- 运行速度 -->
      <el-col :span="6">
        <div class="metric-card speed">
          <div class="card-icon">
            <i class="el-icon-speed"></i>
          </div>
          <div class="card-content">
            <div class="card-label">运行速度</div>
            <div class="card-value">{{ metrics.currentSpeed }}<span class="card-unit">瓶/h</span></div>
            <div class="card-sub">目标：{{ metrics.targetSpeed }} 瓶/h</div>
          </div>
        </div>
      </el-col>

      <!-- 今日产能 -->
      <el-col :span="6">
        <div class="metric-card today">
          <div class="card-icon">
            <i class="el-icon-date"></i>
          </div>
          <div class="card-content">
            <div class="card-label">今日产能</div>
            <div class="card-value">{{ formatNumber(metrics.todayOutput) }}<span class="card-unit">瓶</span></div>
            <div class="card-sub">完成率 {{ metrics.todayRate }}%</div>
          </div>
          <el-progress :percentage="metrics.todayRate" :show-text="false" :stroke-width="4" color="#67c23a" class="card-progress" />
        </div>
      </el-col>

      <!-- 本班产能 -->
      <el-col :span="6">
        <div class="metric-card shift">
          <div class="card-icon">
            <i class="el-icon-time"></i>
          </div>
          <div class="card-content">
            <div class="card-label">本班产能</div>
            <div class="card-value">{{ formatNumber(metrics.shiftOutput) }}<span class="card-unit">瓶</span></div>
            <div class="card-sub">{{ metrics.shiftName }} · 目标 {{ formatNumber(metrics.shiftTarget) }} 瓶</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 第二行：24小时产能趋势 + 实时报警 -->
    <el-row :gutter="16" class="bottom-row">
      <!-- 24小时产能趋势 -->
      <el-col :span="16">
        <el-card shadow="never" class="chart-card">
          <div slot="header" class="card-header">
            <span class="header-title"><i class="el-icon-line-chart"></i> 24小时产能趋势</span>
            <el-tag size="small" type="success" class="live-tag">
              <span class="live-dot"></span>实时
            </el-tag>
          </div>
          <div class="chart-body">
            <div class="bar-chart">
              <div 
                v-for="(item, index) in productionTrend" 
                :key="index" 
                class="bar-item"
              >
                <div class="bar-tooltip">{{ item.hour }}时：{{ formatNumber(item.value) }}瓶</div>
                <div class="bar-wrapper">
                  <div 
                    class="bar" 
                    :style="{ height: (item.value / maxTrendValue * 100) + '%' }"
                    :class="{ 'current': index === productionTrend.length - 1 }"
                  ></div>
                </div>
                <div class="bar-label">{{ item.hour }}</div>
              </div>
            </div>
            <div class="chart-summary">
              <span>今日总计：<b>{{ formatNumber(metrics.todayOutput) }}</b> 瓶</span>
              <span>峰值：<b>{{ formatNumber(maxTrendValue) }}</b> 瓶/小时</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 实时报警 -->
      <el-col :span="8">
        <el-card shadow="never" class="alarm-card">
          <div slot="header" class="card-header">
            <span class="header-title"><i class="el-icon-warning-outline"></i> 实时报警</span>
            <el-tag size="small" type="danger" v-if="activeAlarms.length > 0">{{ activeAlarms.length }} 条</el-tag>
            <el-tag size="small" type="success" v-else>正常</el-tag>
          </div>
          <div class="alarm-body">
            <div class="alarm-list">
              <div 
                v-for="(alarm, index) in activeAlarms" 
                :key="index" 
                class="alarm-item"
                :class="alarm.level"
              >
                <i class="alarm-icon" :class="alarm.icon"></i>
                <div class="alarm-info">
                  <div class="alarm-title">{{ alarm.title }}</div>
                  <div class="alarm-code">代码：{{ alarm.code }}</div>
                </div>
                <div class="alarm-time">{{ alarm.time }}</div>
              </div>
            </div>
            <div v-if="activeAlarms.length === 0" class="no-alarm">
              <i class="el-icon-circle-check"></i>
              <span>设备运行正常，无报警</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
/**
 * 概况预览页面 - 精简版，只展示最核心的6个指标
 *
 * 功能定位：给客户/管理层快速查看设备运行核心指标
 * 展示内容：
 * 1. 设备运行状态
 * 2. 运行速度
 * 3. 今日产能
 * 4. 本班产能
 * 5. 24小时产能趋势
 * 6. 实时报警
 *
 * 数据来源（PLC地址映射）：
 * - 设备状态：M5001(运行) / M5002(空闲) / M5003(故障)
 * - 当前运行速度：D4010（瓶/小时）
 * - 今日产量：D4004
 * - 本班产量：D4002
 * - 产量趋势：需要后端定时采集D4004并存储历史数据
 * - 实时报警：D4012 + M4000-M4110
 */
import { computed } from 'vue'
import store from '@/store'


// 通用数据：从 store 获取
const trendData = computed(() => store.getters.trendData)
const currentAlarms = computed(() => store.getters.currentAlarms)

// 设备运行状态（基于 store 通用对象 + 页面特有 icon）
const deviceStatus = computed(() => {
  const obj = store.getters['device/deviceStatusObj'] || {}
  return {
    status: store.getters.deviceStatus,
    text: store.getters.deviceStatusText,
    duration: obj.duration || '0小时0分钟',
    icon: store.getters.deviceStatus === 'running' ? 'el-icon-video-play' : 'el-icon-video-pause'
  }
})

// 产能指标（页面特有格式）
const metrics = computed(() => {
  const prod = store.getters.productionStats
  const params = store.getters.realtimeParams
  return {
    currentSpeed: params.speed,
    targetSpeed: 1500,
    todayOutput: prod.todayOutput,
    todayRate: prod.todayRate,
    shiftOutput: prod.shiftOutput,
    shiftTarget: prod.shiftTarget,
    shiftName: prod.shiftName
  }
})

// 24小时产能趋势（页面特有格式转换）
const productionTrend = computed(() => {
  if (trendData.value && trendData.value.speed && trendData.value.speed.length > 0) {
    return trendData.value.speed.map(item => ({ hour: item.time.slice(0, 2), value: item.value }))
  }
  return [
    { hour: '00', value: 0 }, { hour: '02', value: 0 }, { hour: '04', value: 0 },
    { hour: '06', value: 120 }, { hour: '08', value: 850 }, { hour: '10', value: 1200 },
    { hour: '12', value: 1100 }, { hour: '14', value: 1350 }, { hour: '16', value: 1280 },
    { hour: '18', value: 660 }, { hour: '20', value: 0 }, { hour: '22', value: 0 }
  ]
})

// 实时报警（页面特有格式转换）
const activeAlarms = computed(() => {
  if (currentAlarms.value && currentAlarms.value.length > 0) {
    return currentAlarms.value.slice(0, 5).map(a => ({
      level: a.level || 'warning',
      icon: a.level === 'danger' ? 'el-icon-error' : 'el-icon-warning',
      title: a.message || a.title,
      code: a.code || '',
      time: a.time || ''
    }))
  }
  return [
    { level: 'warning', icon: 'el-icon-warning', title: '灌装轴位置异动报警', code: 'M4068', time: '14:23' },
    { level: 'info', icon: 'el-icon-info', title: '真空异常预警', code: 'M4020', time: '14:15' }
  ]
})

// 趋势最大值
const maxTrendValue = computed(() => {
  return Math.max(...productionTrend.value.map(item => item.value), 1)
})

// 格式化数字
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

</script>

<style scoped lang="less">
.overview-container {
  padding: 16px;
  background: #fff;
}

// ========== 通用卡片样式 ==========
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding-left: 12px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 16px;
    background: #409eff;
    border-radius: 2px;
  }
  .header-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    i { margin-right: 6px; color: #409eff; }
  }
  .live-tag {
    display: flex;
    align-items: center;
    .live-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #fff;
      border-radius: 50%;
      margin-right: 4px;
      animation: blink 1.5s infinite;
    }
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

// ========== 第一行：指标卡片 ==========
.top-row {
  margin-bottom: 16px;
}

// 设备状态卡片
.status-card {
  position: relative;
  height: 110px;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  color: #fff;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid transparent;

  &.running { background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%); }
  &.idle { background: linear-gradient(135deg, #909399 0%, #606266 100%); }
  &.fault { background: linear-gradient(135deg, #f56c6c 0%, #c45656 100%); }

  .card-icon {
    font-size: 40px;
    margin-right: 14px;
    opacity: 0.9;
  }
  .card-content {
    flex: 1;
    .card-label {
      font-size: 13px;
      opacity: 0.85;
      margin-bottom: 6px;
    }
    .card-value {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .card-sub {
      font-size: 12px;
      opacity: 0.75;
    }
  }
  .status-pulse {
    position: absolute;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }
  70% { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
}

// 普通指标卡片
.metric-card {
  position: relative;
  height: 110px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  transition: all 0.3s;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
  }
  &.speed::before { background: linear-gradient(180deg, #409eff 0%, #337ecc 100%); }
  &.today::before { background: linear-gradient(180deg, #67c23a 0%, #529b2e 100%); }
  &.shift::before { background: linear-gradient(180deg, #e6a23c 0%, #b88230 100%); }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.08);
    border-color: #dcdfe6;
  }

  .card-icon {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #fff;
    margin-right: 14px;
  }
  &.speed .card-icon { background: linear-gradient(135deg, #409eff 0%, #337ecc 100%); }
  &.today .card-icon { background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%); }
  &.shift .card-icon { background: linear-gradient(135deg, #e6a23c 0%, #b88230 100%); }

  .card-content {
    flex: 1;
    .card-label {
      font-size: 13px;
      color: #909399;
      margin-bottom: 6px;
    }
    .card-value {
      font-size: 22px;
      font-weight: 700;
      color: #303133;
      line-height: 1.2;
      .card-unit {
        font-size: 12px;
        font-weight: 400;
        color: #909399;
        margin-left: 3px;
      }
    }
    .card-sub {
      font-size: 12px;
      color: #c0c4cc;
      margin-top: 4px;
    }
  }
  .card-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

// ========== 第二行：图表 + 报警 ==========
.bottom-row {
  .chart-card, .alarm-card {
    height: 300px;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 4px 16px 0 rgba(0,0,0,0.08);
      border-color: #dcdfe6;
    }
    /deep/ .el-card__header {
      padding: 14px 16px;
      border-bottom: 1px solid #f0f2f5;
    }
    /deep/ .el-card__body {
      height: calc(100% - 57px);
      padding: 16px;
    }
  }
  .alarm-card {
    .card-header::before {
      background: #f56c6c;
    }
  }
}

// 产能趋势图
.chart-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  .bar-chart {
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    padding: 10px 0;
    border-bottom: 1px solid #ebeef5;
    .bar-item {
      position: relative;
      width: 6%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .bar-tooltip {
        position: absolute;
        top: -28px;
        left: 50%;
        transform: translateX(-50%);
        background: #303133;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 10;
      }
      &:hover .bar-tooltip { opacity: 1; }
      .bar-wrapper {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: flex-end;
        .bar {
          width: 100%;
          background: linear-gradient(180deg, #409eff 0%, #66b1ff 100%);
          border-radius: 4px 4px 0 0;
          transition: all 0.3s;
          min-height: 2px;
          &:hover { background: linear-gradient(180deg, #337ecc 0%, #409eff 100%); }
          &.current { background: linear-gradient(180deg, #67c23a 0%, #85ce61 100%); }
        }
      }
      .bar-label {
        font-size: 11px;
        color: #909399;
        margin-top: 6px;
      }
    }
  }
  .chart-summary {
    display: flex;
    justify-content: space-around;
    padding-top: 12px;
    font-size: 13px;
    color: #606266;
    b { color: #409eff; font-size: 15px; }
  }
}

// 实时报警
.alarm-body {
  height: 100%;
  .alarm-list {
    height: 100%;
    overflow-y: auto;
    .alarm-item {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 8px;
      background: #f5f7fa;
      transition: all 0.3s;
      &:hover { background: #ecf5ff; }
      &.danger { border-left: 4px solid #f56c6c; .alarm-icon { color: #f56c6c; } }
      &.warning { border-left: 4px solid #e6a23c; .alarm-icon { color: #e6a23c; } }
      &.info { border-left: 4px solid #409eff; .alarm-icon { color: #409eff; } }
      .alarm-icon {
        font-size: 20px;
        margin-right: 12px;
      }
      .alarm-info {
        flex: 1;
        .alarm-title {
          font-size: 13px;
          color: #303133;
          font-weight: 500;
          margin-bottom: 2px;
        }
        .alarm-code {
          font-size: 11px;
          color: #909399;
        }
      }
      .alarm-time {
        font-size: 12px;
        color: #c0c4cc;
      }
    }
  }
  .no-alarm {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #67c23a;
    i {
      font-size: 48px;
      margin-bottom: 12px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>
