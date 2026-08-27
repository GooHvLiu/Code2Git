<template>
  <div class="device-state-page">
    <!-- 设备信息头部 -->
    <div class="device-header">
      <div class="device-info">
        <div class="device-icon">
          <i class="el-icon-cpu"></i>
          <div class="icon-pulse" :class="deviceStatus.status"></div>
        </div>
        <div class="device-detail">
          <h2 class="device-name">{{ deviceInfo.name }}</h2>
          <div class="device-meta">
            <span><i class="el-icon-collection-tag"></i> 编号：{{ deviceInfo.code }}</span>
            <span><i class="el-icon-place"></i> 位置：{{ deviceInfo.location }}</span>
            <span><i class="el-icon-date"></i> 投用日期：{{ deviceInfo.installDate }}</span>
          </div>
        </div>
      </div>
      <div class="device-status-badge" :class="deviceStatus.status">
        <span class="status-dot"></span>
        <span class="status-text">{{ deviceStatus.text }}</span>
        <span class="status-duration">已运行 {{ deviceStatus.duration }}</span>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <el-row :gutter="12" class="metrics-row">
      <el-col :span="6" v-for="(metric, index) in coreMetrics" :key="index">
        <div class="metric-card" :class="metric.type">
          <div class="metric-icon"><i :class="metric.icon"></i></div>
          <div class="metric-content">
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-value">
              <span class="number">{{ metric.value }}</span>
              <span class="unit">{{ metric.unit }}</span>
            </div>
            <div class="metric-trend" :class="metric.trend > 0 ? 'up' : 'down'">
              <i :class="metric.trend > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
              {{ Math.abs(metric.trend) }}% 较昨日
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 实时运行参数 -->
    <el-row :gutter="12" class="main-row">
      <el-col :span="24">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title"><i class="el-icon-data-line"></i> 实时运行参数</span>
            <span class="panel-badge"><span class="live-dot"></span>实时更新</span>
          </div>
          <div class="panel-body">
            <el-row :gutter="12">
              <el-col :span="4" v-for="(param, index) in realtimeParams" :key="index">
                <div class="param-card" :class="{ warning: param.status === 'warning', danger: param.status === 'danger' }">
                  <div class="param-header">
                    <span class="param-name">{{ param.name }}</span>
                    <span class="param-status" :class="param.status">{{ param.statusText }}</span>
                  </div>
                  <div class="param-value">
                    <span class="value">{{ param.value }}</span>
                    <span class="unit">{{ param.unit }}</span>
                  </div>
                  <div class="param-range">
                    <span>范围：{{ param.min }} ~ {{ param.max }} {{ param.unit }}</span>
                  </div>
                  <div class="param-bar">
                    <div class="bar-bg">
                      <div class="bar-fill" :style="{ width: param.percent + '%' }" :class="param.status"></div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 趋势图 + 运行统计 -->
    <el-row :gutter="12" class="bottom-row">
      <!-- 关键参数趋势 -->
      <el-col :span="16">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title"><i class="el-icon-line-chart"></i> 关键参数趋势（近24小时）</span>
            <div class="chart-tabs">
              <span 
                v-for="tab in trendTabs" 
                :key="tab.value"
                class="chart-tab"
                :class="{ active: activeTrend === tab.value }"
                @click="activeTrend = tab.value"
              >{{ tab.label }}</span>
            </div>
          </div>
          <div class="panel-body">
            <div class="trend-chart">
              <svg viewBox="0 0 800 200" preserveAspectRatio="none" class="chart-svg">
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#409eff;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#409eff;stop-opacity:0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="50" x2="800" y2="50" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4"/>
                <line x1="0" y1="100" x2="800" y2="100" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4"/>
                <line x1="0" y1="150" x2="800" y2="150" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4"/>
                <path :d="trendAreaPath" fill="url(#trendGradient)"/>
                <path :d="trendLinePath" fill="none" stroke="#409eff" stroke-width="2"/>
                <circle 
                  v-for="(point, index) in trendPoints" 
                  :key="index"
                  :cx="point.x" 
                  :cy="point.y" 
                  r="3" 
                  fill="#fff"
                  stroke="#409eff"
                  stroke-width="1.5"
                />
              </svg>
              <div class="chart-labels">
                <span v-for="(label, index) in trendLabels" :key="index">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 今日运行统计 -->
      <el-col :span="8">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title"><i class="el-icon-data-board"></i> 今日运行统计</span>
          </div>
          <div class="panel-body">
            <div class="stats-list">
              <div class="stat-item" v-for="(stat, index) in todayStats" :key="index">
                <div class="stat-icon" :class="stat.type"><i :class="stat.icon"></i></div>
                <div class="stat-info">
                  <div class="stat-label">{{ stat.label }}</div>
                  <div class="stat-value">{{ stat.value }}<span class="stat-unit">{{ stat.unit }}</span></div>
                </div>
                <div class="stat-bar">
                  <div class="stat-bar-fill" :style="{ width: stat.percent + '%' }" :class="stat.type"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

/**
 * 设备状态页面
 * 功能：展示设备实时运行参数、智能分析、趋势图、运行统计
 * 数据来源：统一从 Vuex device 模块获取，不单独请求后端
 */

// ===== 响应式数据 =====
const activeTrend = ref('speed')
const trendTabs = ref([
  { label: '运行速度', value: 'speed' },
  { label: '灌装量', value: 'fillVolume' },
  { label: '真空度', value: 'vacuum' }
])

// ===== 计算属性 =====
// 统一从 store device 模块获取
const deviceInfo = computed(() => store.getters['device/deviceInfo'])
const deviceStatus = computed(() => store.getters['device/deviceStatusObj'])
const coreMetrics = computed(() => store.getters['device/coreMetrics'])
const realtimeParams = computed(() => store.getters['device/realtimeParamsList'])
const todayStats = computed(() => store.getters['device/todayStats'])
const trendData = computed(() => store.getters['device/trendData'])

// 页面特有：趋势图相关计算
const trendLabels = computed(() => trendData.value[activeTrend.value]?.map(item => item.time) || [])
const trendPoints = computed(() => {
  const rawData = trendData.value[activeTrend.value] || []
  if (rawData.length === 0) return []
  // 过滤掉全为0的停机时段，只展示有数据的部分，避免图表被压缩
  const data = rawData.map(item => item.value)
  const hasNonZero = data.some(v => v !== 0)
  if (!hasNonZero) return []

  let maxVal = Math.max(...data)
  let minVal = Math.min(...data)

  // 对于真空度（负数），反转显示：绝对值越大越靠上
  if (activeTrend.value === 'vacuum') {
    const absData = data.map(v => Math.abs(v))
    maxVal = Math.max(...absData)
    minVal = Math.min(...absData.filter(v => v > 0))
    if (minVal === undefined) minVal = 0
    const range = maxVal - minVal || 1
    return data.map((val, index) => ({
      x: (index / (data.length - 1)) * 800,
      y: val === 0 ? 180 : 180 - ((Math.abs(val) - minVal) / range) * 150
    }))
  }

  // 对于其他参数，过滤掉0值后计算范围，让有数据的部分更明显
  const nonZeroData = data.filter(v => v > 0)
  if (nonZeroData.length > 0) {
    maxVal = Math.max(...nonZeroData)
    minVal = Math.min(...nonZeroData)
  }
  const range = maxVal - minVal || 1
  return data.map((val, index) => ({
    x: (index / (data.length - 1)) * 800,
    y: val === 0 ? 180 : 180 - ((val - minVal) / range) * 150
  }))
})
const trendLinePath = computed(() => {
  if (trendPoints.value.length === 0) return ''
  return trendPoints.value.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ')
})
const trendAreaPath = computed(() => {
  if (trendPoints.value.length === 0) return ''
  const line = trendPoints.value.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ')
  return `${line} L800,200 L0,200 Z`
})
</script>

<style scoped lang="less">
.device-state-page {
  padding: 12px;
  background: #fff;
  min-height: calc(100vh - 84px);
}

// 设备头部
.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);

  .device-info {
    display: flex;
    align-items: center;
    .device-icon {
      position: relative;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #409eff 0%, #667eea 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: #fff;
      margin-right: 16px;
      .icon-pulse {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid #fff;
        &.running { background: #67c23a; animation: pulse 2s infinite; }
        &.idle { background: #e6a23c; }
        &.fault { background: #f56c6c; animation: pulse 1s infinite; }
        &.offline { background: #909399; }
      }
    }
    .device-detail {
      .device-name {
        font-size: 20px;
        font-weight: 700;
        color: #303133;
        margin: 0 0 6px 0;
      }
      .device-meta {
        display: flex;
        gap: 20px;
        font-size: 12px;
        color: #909399;
        span { display: flex; align-items: center; gap: 4px; }
      }
    }
  }
  .device-status-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 24px;
    border-radius: 8px;
    &.running { background: #f0f9eb; border: 1px solid #c2e7b0; }
    &.idle { background: #fdf6ec; border: 1px solid #f5dab1; }
    &.fault { background: #fef0f0; border: 1px solid #fbc4c4; }
    &.offline { background: #f4f4f5; border: 1px solid #d3d4d6; }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-bottom: 4px;
      .running & { background: #67c23a; animation: blink 1.5s infinite; }
      .idle & { background: #e6a23c; }
      .fault & { background: #f56c6c; animation: blink 0.8s infinite; }
      .offline & { background: #909399; }
    }
    .status-text {
      font-size: 16px;
      font-weight: 600;
      .running & { color: #67c23a; }
      .idle & { color: #e6a23c; }
      .fault & { color: #f56c6c; }
      .offline & { color: #909399; }
    }
    .status-duration {
      font-size: 11px;
      color: #909399;
      margin-top: 2px;
    }
  }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(103,194,58,0.5); }
  50% { box-shadow: 0 0 0 6px rgba(103,194,58,0); }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

// 核心指标
.metrics-row { margin-bottom: 12px; }
.metric-card {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s;
  &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .metric-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-right: 14px;
    flex-shrink: 0;
    .success & { background: #f0f9eb; color: #67c23a; }
    .primary & { background: #ecf5ff; color: #409eff; }
    .warning & { background: #fdf6ec; color: #e6a23c; }
    .danger & { background: #fef0f0; color: #f56c6c; }
  }
  .metric-content {
    flex: 1;
    min-width: 0;
    .metric-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 4px;
    }
    .metric-value {
      display: flex;
      align-items: baseline;
      .number {
        font-size: 24px;
        font-weight: 700;
        font-family: 'Courier New', monospace;
        .success & { color: #67c23a; }
        .primary & { color: #409eff; }
        .warning & { color: #e6a23c; }
        .danger & { color: #f56c6c; }
      }
      .unit {
        font-size: 12px;
        color: #c0c4cc;
        margin-left: 4px;
      }
    }
    .metric-trend {
      font-size: 11px;
      margin-top: 2px;
      &.up { color: #67c23a; }
      &.down { color: #f56c6c; }
      i { font-size: 10px; margin-right: 2px; }
    }
  }
}

// 通用面板
.panel {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f2f5;
    .panel-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      i { margin-right: 6px; color: #409eff; }
    }
    .panel-badge {
      display: flex;
      align-items: center;
      font-size: 11px;
      color: #409eff;
      .live-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #f56c6c;
        margin-right: 5px;
        animation: blink 1.5s infinite;
      }
    }
  }
  .panel-body {
    flex: 1;
    padding: 16px;
    overflow: hidden;
  }
}

.main-row {
  margin-bottom: 12px;
}

// 实时参数
.param-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 14px 12px;
  margin-bottom: 12px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: #409eff;
  }

  &:hover {
    border-color: #409eff;
    box-shadow: 0 4px 12px rgba(64,158,255,0.12);
    transform: translateY(-2px);
  }

  &.warning {
    border-color: #e6a23c;
    &::before { background: #e6a23c; }
    &:hover { box-shadow: 0 4px 12px rgba(230,162,60,0.12); }
  }

  &.danger {
    border-color: #f56c6c;
    &::before { background: #f56c6c; }
    &:hover { box-shadow: 0 4px 12px rgba(245,108,108,0.12); }
  }

  .param-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .param-name {
      font-size: 12px;
      color: #909399;
      font-weight: 500;
    }
    .param-status {
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 500;
      &.normal { background: #f0f9eb; color: #67c23a; }
      &.warning { background: #fdf6ec; color: #e6a23c; }
      &.danger { background: #fef0f0; color: #f56c6c; }
    }
  }
  .param-value {
    display: flex;
    align-items: baseline;
    margin-bottom: 8px;
    .value {
      font-size: 24px;
      font-weight: 700;
      color: #303133;
      font-family: 'DIN Alternate', 'Courier New', monospace;
      line-height: 1.2;
    }
    .unit {
      font-size: 12px;
      color: #909399;
      margin-left: 4px;
    }
  }
  .param-range {
    font-size: 10px;
    color: #c0c4cc;
    margin-bottom: 8px;
  }
  .param-bar {
    .bar-bg {
      height: 4px;
      background: #fff;
      border-radius: 2px;
      overflow: hidden;
      .bar-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.5s ease;
        &.normal { background: linear-gradient(90deg, #409eff, #66b1ff); }
        &.warning { background: linear-gradient(90deg, #e6a23c, #f0c78a); }
        &.danger { background: linear-gradient(90deg, #f56c6c, #f89898); }
      }
    }
  }
}

// 智能分析
.analysis-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .analysis-item {
    text-align: center;
    flex-shrink: 0;
    .analysis-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 10px;
    }
    .analysis-ring {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto 10px;
      svg { width: 100%; height: 100%; }
      .ring-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .ring-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #67c23a;
          font-family: 'Courier New', monospace;
        }
        .ring-label {
          font-size: 11px;
          color: #909399;
        }
      }
    }
    .oee-breakdown {
      display: flex;
      justify-content: space-around;
      .breakdown-item {
        text-align: center;
        .bd-label { font-size: 10px; color: #909399; display: block; }
        .bd-value { font-size: 14px; font-weight: 600; color: #303133; }
      }
    }
  }
  .analysis-divider {
    height: 1px;
    background: #fff;
    margin: 12px 0;
  }
  .analysis-suggestions {
    flex: 1;
    display: flex;
    flex-direction: column;
    .suggestion-title {
      font-size: 12px;
      color: #909399;
      margin-bottom: 8px;
      font-weight: 500;
      flex-shrink: 0;
    }
    .suggestion-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .suggestion-item {
        display: flex;
        align-items: flex-start;
        padding: 6px 0;
        font-size: 11px;
        color: #606266;
        line-height: 1.5;
        .suggestion-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          flex-shrink: 0;
          font-size: 10px;
          &.info { background: #ecf5ff; color: #409eff; }
          &.warning { background: #fdf6ec; color: #e6a23c; }
          &.success { background: #f0f9eb; color: #67c23a; }
        }
        .suggestion-text { flex: 1; }
      }
    }
  }
}

// 趋势图
.chart-tabs {
  display: flex;
  gap: 4px;
  .chart-tab {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 4px;
    cursor: pointer;
    color: #909399;
    transition: all 0.2s;
    &.active { background: #ecf5ff; color: #409eff; }
    &:hover { color: #409eff; }
  }
}
.trend-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  .chart-svg { flex: 1; width: 100%; }
  .chart-labels {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #c0c4cc;
    padding-top: 4px;
  }
}

// 今日统计
.stats-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .stat-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f2f5;
    &:last-child {
      border-bottom: none;
    }
    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      margin-right: 12px;
      flex-shrink: 0;
      .success & { background: #f0f9eb; color: #67c23a; }
      .warning & { background: #fdf6ec; color: #e6a23c; }
      .danger & { background: #fef0f0; color: #f56c6c; }
      .info & { background: #f4f4f5; color: #909399; }
    }
    .stat-info {
      flex: 1;
      min-width: 0;
      .stat-label { 
        font-size: 12px; 
        color: #909399; 
        line-height: 1.4;
        margin-bottom: 2px;
      }
      .stat-value {
        font-size: 18px;
        font-weight: 700;
        color: #303133;
        font-family: 'Courier New', monospace;
        line-height: 1.4;
        .stat-unit { font-size: 11px; color: #909399; margin-left: 2px; font-weight: normal; }
      }
    }
    .stat-bar {
      width: 60px;
      height: 6px;
      background: #fff;
      border-radius: 3px;
      overflow: hidden;
      flex-shrink: 0;
      .stat-bar-fill {
        height: 100%;
        border-radius: 3px;
        .success & { background: #67c23a; }
        .warning & { background: #e6a23c; }
        .danger & { background: #f56c6c; }
        .info & { background: #909399; }
      }
    }
  }
}

.bottom-row { 
  margin-bottom: 0; 
}
</style>
