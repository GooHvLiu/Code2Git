<template>
  <div ref="dashboardRef" class="dashboard-container" :class="{ fullscreen: isFullscreen }">
    <!-- 科技感装饰背景 -->
    <div class="tech-bg">
      <div class="tech-grid"></div>
      <div class="tech-glow glow-1"></div>
      <div class="tech-glow glow-2"></div>
    </div>

    <!-- 顶部标题栏 -->
    <div class="dashboard-header">
      <div class="header-decor left"></div>
      <div class="header-decor right"></div>
      <div class="header-left">
        <div class="header-icon">
          <i class="el-icon-monitor"></i>
          <div class="icon-ring ring-1"></div>
          <div class="icon-ring ring-2"></div>
        </div>
        <div class="header-text">
          <div class="title-line"></div>
          <h1 class="header-title">生产数据看板</h1>
          <p class="header-sub">PRODUCTION DATA DASHBOARD</p>
        </div>
      </div>
      <div class="header-center">
        <div class="time-wrapper">
          <div class="time-decor left"></div>
          <div class="current-time">{{ currentTime }}</div>
          <div class="time-decor right"></div>
        </div>
        <div class="current-date">{{ currentDate }}</div>
      </div>
      <div class="header-right">
        <div class="status-tag" :class="deviceStatus.status">
          <span class="status-dot"></span>
          <span class="status-ring"></span>
          {{ deviceStatus.text }}
        </div>
        <el-button 
          :icon="isFullscreen ? 'el-icon-close' : 'el-icon-full-screen'" 
          @click="toggleFullscreen"
          size="small"
          class="fullscreen-btn"
        >
          {{ isFullscreen ? '退出全屏' : '全屏展示' }}
        </el-button>
      </div>
    </div>

    <!-- 第一行：核心指标大卡片 -->
    <el-row :gutter="12" class="metrics-row">
      <el-col :span="6" v-for="(metric, index) in metricList" :key="index">
        <div class="big-metric" :class="metric.type">
          <div class="border-flow"></div>
          <div class="metric-corner corner-tl"></div>
          <div class="metric-corner corner-tr"></div>
          <div class="metric-corner corner-bl"></div>
          <div class="metric-corner corner-br"></div>
          <div class="scan-line"></div>
          
          <div class="metric-label">
            <i :class="metric.icon"></i>
            {{ metric.label }}
          </div>
          <div class="metric-value">
            <span class="number" :class="metric.type">{{ metric.value }}</span>
            <span class="unit">{{ metric.unit }}</span>
          </div>
          <div class="metric-footer">
            <span v-html="metric.subLeft"></span>
            <span class="rate" v-html="metric.subRight"></span>
          </div>
          <div class="metric-progress" v-if="metric.progress">
            <div class="progress-fill" :class="metric.type" :style="{ width: metric.progress + '%' }"></div>
          </div>
          <div class="oee-ring" v-if="metric.type === 'oee'">
            <svg viewBox="0 0 100 100">
              <defs>
                <linearGradient :id="'oeeGrad-' + index" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#00d4ff" />
                  <stop offset="50%" style="stop-color:#409eff" />
                  <stop offset="100%" style="stop-color:#667eea" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e8f0fe" stroke-width="3"/>
              <circle cx="50" cy="50" r="42" fill="none" :stroke="'url(#oeeGrad-' + index + ')'" stroke-width="3"
                :stroke-dasharray="263.9" :stroke-dashoffset="263.9 * (1 - oeeData.value / 100)"
                transform="rotate(-90 50 50)" stroke-linecap="round"/>
              <circle cx="50" cy="8" r="2" fill="#409eff" class="ring-dot"/>
            </svg>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 第二行：世界地图 + 产能趋势 -->
    <el-row :gutter="12" class="map-row">
      <!-- 世界地图 -->
      <el-col :span="14">
        <div class="chart-panel map-panel">
          <div class="border-flow"></div>
          <div class="panel-scan"></div>
          <div class="panel-header">
            <span class="panel-title"><i class="el-icon-location-outline"></i> 全球设备分布</span>
            <div class="map-stats">
              <span class="map-stat"><i class="el-icon-male"></i> 在线设备 <b>1</b></span>
              <span class="map-stat"><i class="el-icon-warning"></i> 告警 <b>0</b></span>
            </div>
          </div>
          <div class="panel-body map-body">
            <div ref="mapChart" class="map-chart"></div>
            <!-- 设备信息浮层 -->
            <div class="device-info-card">
              <div class="info-header">
                <span class="info-dot"></span>
                <span class="info-title">设备信息</span>
                <el-tag size="mini" type="success" effect="plain">在线</el-tag>
              </div>
              <div class="info-body">
                <div class="info-row">
                  <span class="info-label">设备名称</span>
                  <span class="info-value">nexCM-灌装机-001</span>
                </div>
                <div class="info-row">
                  <span class="info-label">所在地区</span>
                  <span class="info-value">中国 · 江苏无锡</span>
                </div>
                <div class="info-row">
                  <span class="info-label">经纬度</span>
                  <span class="info-value">120.30°E, 31.57°N</span>
                </div>
                <div class="info-row">
                  <span class="info-label">设备IP</span>
                  <span class="info-value">192.168.1.100</span>
                </div>
                <div class="info-row">
                  <span class="info-label">运行时长</span>
                  <span class="info-value highlight">6小时32分钟</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 产能趋势 -->
      <el-col :span="10">
        <div class="chart-panel">
          <div class="border-flow"></div>
          <div class="panel-scan"></div>
          <div class="panel-header">
            <span class="panel-title"><i class="el-icon-line-chart"></i> 产能趋势</span>
            <div class="panel-tabs">
              <span 
                v-for="tab in trendTabs" 
                :key="tab.value"
                class="tab-item"
                :class="{ active: trendType === tab.value }"
                @click="trendType = tab.value"
              >{{ tab.label }}</span>
            </div>
          </div>
          <div class="panel-body">
            <div class="line-chart">
              <svg viewBox="0 0 400 180" preserveAspectRatio="none" class="chart-svg">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#409eff;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#409eff;stop-opacity:0" />
                  </linearGradient>
                  <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#00d4ff" />
                    <stop offset="50%" style="stop-color:#409eff" />
                    <stop offset="100%" style="stop-color:#667eea" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="45" x2="400" y2="45" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4"/>
                <line x1="0" y1="90" x2="400" y2="90" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4"/>
                <line x1="0" y1="135" x2="400" y2="135" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4"/>
                <path :d="areaPath" fill="url(#lineGradient)"/>
                <path :d="linePath" fill="none" stroke="url(#lineStroke)" stroke-width="2.5"/>
                <circle 
                  v-for="(point, index) in chartPoints" 
                  :key="index"
                  :cx="point.x" 
                  :cy="point.y" 
                  r="4" 
                  fill="#fff"
                  stroke="#409eff"
                  stroke-width="2"
                  class="data-point"
                />
              </svg>
              <div class="chart-labels">
                <span v-for="(item, index) in productionTrend" :key="index">{{ item.hour }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 第三行：设备状态 + 批次 + 实时数据 -->
    <el-row :gutter="12" class="data-row">
      <!-- 设备运行状态 -->
      <el-col :span="8">
        <div class="chart-panel">
          <div class="border-flow"></div>
          <div class="panel-scan"></div>
          <div class="panel-header">
            <span class="panel-title"><i class="el-icon-cpu"></i> 设备运行状态</span>
          </div>
          <div class="panel-body">
            <div class="status-distribution">
              <div class="donut-wrapper">
                <svg viewBox="0 0 100 100" class="donut-svg">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#f0f2f5" stroke-width="10"/>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#67c23a" stroke-width="10"
                    :stroke-dasharray="(runtimeStats.runningRate / 100) * 219.9 + ' 219.9'"
                    transform="rotate(-90 50 50)" stroke-linecap="round"/>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#e6a23c" stroke-width="10"
                    :stroke-dasharray="(runtimeStats.idleRate / 100) * 219.9 + ' 219.9'"
                    :stroke-dashoffset="-(runtimeStats.runningRate / 100) * 219.9"
                    transform="rotate(-90 50 50)"/>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#f56c6c" stroke-width="10"
                    :stroke-dasharray="(runtimeStats.faultRate / 100) * 219.9 + ' 219.9'"
                    :stroke-dashoffset="-((runtimeStats.runningRate + runtimeStats.idleRate) / 100) * 219.9"
                    transform="rotate(-90 50 50)"/>
                </svg>
                <div class="donut-center">
                  <div class="donut-value">{{ runtimeStats.runningRate }}%</div>
                  <div class="donut-label">运行率</div>
                </div>
              </div>
              <div class="status-legend">
                <div class="legend-item" v-for="(item, index) in legendList" :key="index">
                  <span class="legend-dot" :class="item.type"></span>
                  <span class="legend-name">{{ item.name }}</span>
                  <span class="legend-time">{{ item.time }}h</span>
                  <span class="legend-percent">{{ item.rate }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 批次完成情况 -->
      <el-col :span="8">
        <div class="chart-panel">
          <div class="border-flow"></div>
          <div class="panel-scan"></div>
          <div class="panel-header">
            <span class="panel-title"><i class="el-icon-s-order"></i> 批次完成情况</span>
            <el-tag size="mini" type="primary" effect="plain" class="batch-tag">{{ batchInfo.batchNo }}</el-tag>
          </div>
          <div class="panel-body">
            <div class="batch-info">
              <div class="batch-item" v-for="(item, index) in batchInfoList" :key="index">
                <span class="batch-label">{{ item.label }}</span>
                <span class="batch-value">{{ item.value }}</span>
              </div>
            </div>
            <div class="batch-progress">
              <div class="progress-header">
                <span>生产进度</span>
                <span class="progress-text">{{ formatNumber(batchInfo.produced) }} / {{ formatNumber(batchInfo.target) }} 瓶</span>
              </div>
              <div class="progress-bar-large">
                <div class="progress-fill-large" :style="{ width: batchInfo.progress + '%' }">
                  <span class="progress-percent">{{ batchInfo.progress }}%</span>
                </div>
                <div class="progress-shine"></div>
              </div>
              <div class="batch-stats">
                <div class="batch-stat" v-for="(stat, index) in batchStatsList" :key="index">
                  <div class="stat-value">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 实时生产数据 -->
      <el-col :span="8">
        <div class="chart-panel">
          <div class="border-flow"></div>
          <div class="panel-scan"></div>
          <div class="panel-header">
            <span class="panel-title"><i class="el-icon-data-line"></i> 实时生产数据</span>
            <span class="panel-badge"><span class="badge-dot"></span>实时</span>
          </div>
          <div class="panel-body">
            <div class="realtime-table">
              <div class="rt-header">
                <span>时间</span>
                <span>速度</span>
                <span>累计</span>
                <span>填充量</span>
                <span>状态</span>
              </div>
              <div class="rt-body">
                <div class="rt-row" v-for="(item, index) in realtimeData" :key="index" :class="{ latest: index === 0 }">
                  <span class="rt-time">{{ item.time }}</span>
                  <span>{{ item.speed }}</span>
                  <span>{{ formatNumber(item.output) }}</span>
                  <span>{{ item.fillVolume }}</span>
                  <span>
                    <span class="rt-status" :class="item.status === '正常' ? 'normal' : 'warning'">{{ item.status }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 第四行：报警统计 + 质量检测 -->
    <el-row :gutter="12" class="bottom-row">
      <!-- 报警统计 -->
      <el-col :span="12">
        <div class="chart-panel">
          <div class="border-flow"></div>
          <div class="panel-scan"></div>
          <div class="panel-header">
            <span class="panel-title"><i class="el-icon-warning"></i> 今日报警统计</span>
            <span class="panel-badge danger">{{ alarmStats.total }} 次</span>
          </div>
          <div class="panel-body">
            <div class="alarm-stats">
              <div class="alarm-stat-item" v-for="(item, index) in alarmStats.list" :key="index">
                <div class="as-header">
                  <span class="as-name">{{ item.name }}</span>
                  <span class="as-count">{{ item.count }}次</span>
                </div>
                <div class="as-bar">
                  <div class="as-fill" :style="{ width: (item.count / alarmStats.maxCount * 100) + '%', background: item.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 质量检测 -->
      <el-col :span="12">
        <div class="chart-panel">
          <div class="border-flow"></div>
          <div class="panel-scan"></div>
          <div class="panel-header">
            <span class="panel-title"><i class="el-icon-circle-check"></i> 质量检测</span>
            <span class="panel-badge success">合格率 {{ qualityData.qualifiedRate }}%</span>
          </div>
          <div class="panel-body">
            <div class="quality-content">
              <div class="quality-ring">
                <svg viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="qualityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#67c23a" />
                      <stop offset="100%" style="stop-color:#95d475" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f0f2f5" stroke-width="8"/>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="url(#qualityGradient)" stroke-width="8"
                    :stroke-dasharray="(qualityData.qualifiedRate / 100) * 238.8 + ' 238.8'"
                    transform="rotate(-90 50 50)" stroke-linecap="round"/>
                </svg>
                <div class="quality-center">
                  <div class="quality-value">{{ qualityData.qualifiedRate }}%</div>
                  <div class="quality-label">合格率</div>
                </div>
              </div>
              <div class="quality-stats">
                <div class="qs-item" v-for="(item, index) in qualityStatsList" :key="index">
                  <span class="qs-label">{{ item.label }}</span>
                  <span class="qs-value" :class="item.type">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { mapGetters } from 'vuex'

/**
 * 数据看板页面 - 大屏展示版（浅色科技感主题 + ECharts 世界地图）
 *
 * 功能定位：生产车间大屏展示，用于客户参观、实时监控
 * 数据来源：统一从 Vuex device 模块获取原始数据，页面特有格式在 computed 中转换
 */
export default {
  name: 'Dashboard',
  data() {
    return {
      isFullscreen: false,
      currentTime: '',
      currentDate: '',
      timer: null,
      mapChart: null,
      mapLoaded: false,
      trendType: 'hour',
      trendTabs: [
        { label: '小时', value: 'hour' },
        { label: '日', value: 'day' },
        { label: '月', value: 'month' }
      ],
      realtimeData: [
        { time: '14:30:00', speed: 1200, output: 8560, fillVolume: 2.0, status: '正常' },
        { time: '14:25:00', speed: 1180, output: 8460, fillVolume: 2.0, status: '正常' },
        { time: '14:20:00', speed: 1210, output: 8360, fillVolume: 2.0, status: '正常' },
        { time: '14:15:00', speed: 1150, output: 8260, fillVolume: 2.0, status: '波动' },
        { time: '14:10:00', speed: 1200, output: 8160, fillVolume: 2.0, status: '正常' }
      ]
    }
  },
  computed: {
    // ===== 原始数据：从 store 统一获取 =====
    ...mapGetters({
      storeProduction: 'productionStats',
      storeParams: 'realtimeParams',
      storeTrend: 'trendData',
      storeRuntime: 'runtimeStats',
      batchInfo: 'currentBatch',
      alarmStats: 'alarmStats'
    }),
    // ===== 页面特有格式转换（基于 store 原始数据） =====
    deviceStatus() {
      return {
        status: this.$store.getters.deviceStatus,
        text: this.$store.getters.deviceStatusText
      }
    },
    metrics() {
      return {
        todayOutput: this.storeProduction.todayOutput,
        todayTarget: this.storeProduction.todayTarget,
        todayRate: this.storeProduction.todayRate,
        shiftOutput: this.storeProduction.shiftOutput,
        shiftTarget: this.storeProduction.shiftTarget,
        shiftName: this.storeProduction.shiftName,
        currentSpeed: this.storeParams.speed,
        targetSpeed: 1500
      }
    },
    oeeData() {
      return {
        value: this.storeProduction.oee,
        availability: this.storeProduction.availability,
        performance: this.storeProduction.performance,
        quality: this.storeProduction.quality
      }
    },
    productionTrend() {
      if (this.storeTrend && this.storeTrend.speed && this.storeTrend.speed.length > 0) {
        return this.storeTrend.speed.map(item => ({ hour: item.time.slice(0, 2), value: item.value }))
      }
      return [
        { hour: '00', value: 0 }, { hour: '02', value: 0 }, { hour: '04', value: 0 },
        { hour: '06', value: 120 }, { hour: '08', value: 850 }, { hour: '10', value: 1200 },
        { hour: '12', value: 1100 }, { hour: '14', value: 1350 }, { hour: '16', value: 1280 },
        { hour: '18', value: 660 }, { hour: '20', value: 0 }, { hour: '22', value: 0 }
      ]
    },
    runtimeStats() {
      const rt = this.storeRuntime
      const total = rt.running + rt.idle + rt.fault + rt.plannedStop
      return {
        running: rt.running,
        idle: rt.idle,
        fault: rt.fault,
        runningRate: total ? Math.round(rt.running / total * 1000) / 10 : 0,
        idleRate: total ? Math.round(rt.idle / total * 1000) / 10 : 0,
        faultRate: total ? Math.round(rt.fault / total * 1000) / 10 : 0
      }
    },
    qualityData() {
      const prod = this.storeProduction
      return {
        qualifiedRate: prod.qualifiedRate,
        total: prod.todayOutput,
        qualified: Math.round(prod.todayOutput * prod.qualifiedRate / 100),
        unqualified: Math.round(prod.todayOutput * (100 - prod.qualifiedRate) / 100),
        scrapRate: (100 - prod.qualifiedRate).toFixed(1)
      }
    },
    // ===== 原有计算属性 =====
    metricList() {
      return [
        {
          type: 'today',
          icon: 'el-icon-box',
          label: '今日产能',
          value: this.formatNumber(this.metrics.todayOutput),
          unit: '瓶',
          subLeft: `目标 ${this.formatNumber(this.metrics.todayTarget)}`,
          subRight: `完成率 ${this.metrics.todayRate}%`,
          progress: this.metrics.todayRate
        },
        {
          type: 'shift',
          icon: 'el-icon-time',
          label: '本班产能',
          value: this.formatNumber(this.metrics.shiftOutput),
          unit: '瓶',
          subLeft: this.metrics.shiftName,
          subRight: `目标 ${this.formatNumber(this.metrics.shiftTarget)}`,
          progress: (this.metrics.shiftOutput / this.metrics.shiftTarget * 100).toFixed(1)
        },
        {
          type: 'speed',
          icon: 'el-icon-speed',
          label: '运行速度',
          value: this.metrics.currentSpeed,
          unit: '瓶/h',
          subLeft: `目标 ${this.metrics.targetSpeed} 瓶/h`,
          subRight: `效率 ${Math.round(this.metrics.currentSpeed / this.metrics.targetSpeed * 100)}%`,
          progress: (this.metrics.currentSpeed / this.metrics.targetSpeed * 100).toFixed(1)
        },
        {
          type: 'oee',
          icon: 'el-icon-data-line',
          label: '综合稼动率 OEE',
          value: this.oeeData.value,
          unit: '%',
          subLeft: `可用 ${this.oeeData.availability}%`,
          subRight: `性能 ${this.oeeData.performance}% 合格 ${this.oeeData.quality}%`,
          progress: null
        }
      ]
    },
    legendList() {
      return [
        { type: 'running', name: '运行', time: this.runtimeStats.running, rate: this.runtimeStats.runningRate },
        { type: 'idle', name: '空闲', time: this.runtimeStats.idle, rate: this.runtimeStats.idleRate },
        { type: 'fault', name: '故障', time: this.runtimeStats.fault, rate: this.runtimeStats.faultRate }
      ]
    },
    batchInfoList() {
      return [
        { label: '产品名称', value: this.batchInfo.productName },
        { label: '填充量', value: `${this.batchInfo.fillVolume} ml` },
        { label: '开始时间', value: this.batchInfo.startTime },
        { label: '预计完成', value: this.batchInfo.estimatedEnd }
      ]
    },
    batchStatsList() {
      return [
        { value: this.formatNumber(this.batchInfo.produced), label: '已生产' },
        { value: this.formatNumber(this.batchInfo.target - this.batchInfo.produced), label: '剩余' },
        { value: this.batchInfo.estimatedTime, label: '预计剩余' },
        { value: `${this.batchInfo.qualifiedRate}%`, label: '合格率' }
      ]
    },
    qualityStatsList() {
      return [
        { label: '总检测', value: this.formatNumber(this.qualityData.total), type: '' },
        { label: '合格数', value: this.formatNumber(this.qualityData.qualified), type: 'success' },
        { label: '不合格', value: this.formatNumber(this.qualityData.unqualified), type: 'danger' },
        { label: '废品率', value: `${this.qualityData.scrapRate}%`, type: '' }
      ]
    },
    chartPoints() {
      const maxVal = Math.max(...this.productionTrend.map(item => item.value), 1)
      return this.productionTrend.map((item, index) => ({
        x: (index / (this.productionTrend.length - 1)) * 400,
        y: 170 - (item.value / maxVal) * 150
      }))
    },
    linePath() {
      if (this.chartPoints.length === 0) return ''
      return this.chartPoints.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ')
    },
    areaPath() {
      if (this.chartPoints.length === 0) return ''
      const line = this.chartPoints.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ')
      return `${line} L400,180 L0,180 Z`
    }
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    updateTime() {
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      this.currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      this.currentDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${weekDays[now.getDay()]}`
    },
    /**
     * 初始化 ECharts 世界地图
     */
    async initMap() {
      if (!this.$refs.mapChart) return
      
      try {
        // 加载世界地图 GeoJSON（本地静态资源，不依赖网络）
        const response = await fetch('/map/world.json')
        if (!response.ok) throw new Error('地图数据加载失败')
        const worldJson = await response.json()
        
        // 注册地图
        echarts.registerMap('world', worldJson)
        
        // 初始化 ECharts 实例
        this.mapChart = echarts.init(this.$refs.mapChart)
        
        // 设备位置数据（中国无锡）
        const deviceData = [
          {
            name: 'nexCM-灌装机-001',
            value: [120.30, 31.57, 100],
            itemStyle: { color: '#409eff' }
          }
        ]
        
        // 配置项
        const option = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: 'rgba(64,158,255,0.3)',
            borderWidth: 1,
            textStyle: { color: '#303133', fontSize: 12 },
            formatter: function(params) {
              if (params.seriesType === 'effectScatter') {
                return `<div style="font-weight:600;margin-bottom:4px;">${params.name}</div>
                        <div>位置：中国 · 江苏无锡</div>
                        <div>经纬度：${params.value[0]}°E, ${params.value[1]}°N</div>
                        <div>状态：<span style="color:#67c23a;">在线</span></div>`
              }
              return params.name
            }
          },
          geo: {
            map: 'world',
            roam: false,
            zoom: 1.2,
            center: [60, 25],
            itemStyle: {
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  { offset: 0, color: '#e8f4fd' },
                  { offset: 1, color: '#c6e2ff' }
                ]
              },
              borderColor: '#7ab8f5',
              borderWidth: 0.5,
              shadowColor: 'rgba(64,158,255,0.2)',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            emphasis: {
              itemStyle: {
                areaColor: '#a8d4ff',
                borderColor: '#409eff',
                borderWidth: 1
              },
              label: {
                show: false
              }
            },
            regions: [
              {
                name: 'China',
                itemStyle: {
                  areaColor: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [
                      { offset: 0, color: '#d4edda' },
                      { offset: 1, color: '#a8d5b5' }
                    ]
                  },
                  borderColor: '#67c23a',
                  borderWidth: 1
                }
              }
            ]
          },
          series: [
            {
              name: '设备位置',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: deviceData,
              symbolSize: function(val) {
                return val[2] / 8 + 8
              },
              showEffectOn: 'render',
              rippleEffect: {
                brushType: 'stroke',
                scale: 4,
                period: 3
              },
              hoverAnimation: true,
              label: {
                show: true,
                position: 'right',
                formatter: '{b}',
                color: '#409eff',
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: 'rgba(255,255,255,0.8)',
                padding: [2, 6],
                borderRadius: 3
              },
              itemStyle: {
                color: '#409eff',
                shadowBlur: 10,
                shadowColor: '#409eff'
              },
              zlevel: 1
            }
          ]
        }
        
        this.mapChart.setOption(option)
        this.mapLoaded = true
        
        // 监听窗口大小变化
        window.addEventListener('resize', this.handleMapResize)
        
      } catch (error) {
        console.error('地图初始化失败:', error)
        // 降级：显示提示
        if (this.$refs.mapChart) {
          this.$refs.mapChart.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#909399;font-size:13px;">地图数据加载中...</div>'
        }
      }
    },
    handleMapResize() {
      if (this.mapChart) {
        this.mapChart.resize()
      }
    },
    toggleFullscreen() {
      const el = this.$refs.dashboardRef
      if (!this.isFullscreen) {
        const requestMethod = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen
        if (requestMethod) {
          requestMethod.call(el).catch(err => {
            console.error('全屏失败:', err)
            this.$message.error('全屏失败，请检查浏览器权限')
          })
        } else {
          this.$message.error('当前浏览器不支持全屏')
        }
      } else {
        const exitMethod = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
        if (exitMethod) {
          exitMethod.call(document)
        }
      }
    },
    handleFullscreenChange() {
      this.isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)
      // 全屏切换后延迟调整地图大小，确保 flex 布局计算完成
      setTimeout(() => {
        this.handleMapResize()
      }, 100)
    }
  },
  mounted() {
    // 确保设备数据已加载
    this.$store.dispatch('device/fetchAllData')
    this.updateTime()
    this.timer = setInterval(() => {
      this.updateTime()
    }, 1000)
    document.addEventListener('fullscreenchange', this.handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange)
    
    // 初始化地图（延迟确保 DOM 渲染完成）
    this.$nextTick(() => {
      this.initMap()
    })
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange)
    window.removeEventListener('resize', this.handleMapResize)
    if (this.mapChart) {
      this.mapChart.dispose()
      this.mapChart = null
    }
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const exitMethod = document.exitFullscreen || document.webkitExitFullscreen
      if (exitMethod) exitMethod.call(document)
    }
  }
}
</script>

<style scoped lang="less">
.dashboard-container {
  position: relative;
  padding: 12px;
  min-height: calc(100vh - 84px);
  background: linear-gradient(135deg, #f0f4f8 0%, #e8eef5 30%, #f0f4f8 70%, #eaf0f7 100%);
  overflow: hidden;
  transition: all 0.3s;

  &.fullscreen,
  &:fullscreen,
  &:-webkit-full-screen {
    padding: 12px;
    height: 100vh;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: linear-gradient(135deg, #f0f4f8 0%, #e8eef5 30%, #f0f4f8 70%, #eaf0f7 100%);

    // 顶部标题栏固定高度
    .dashboard-header {
      flex-shrink: 0;
      margin-bottom: 0;
    }

    // 各行按比例分配高度
    .metrics-row {
      flex: 1.1;
      min-height: 0;
      margin-bottom: 0;
      .el-col {
        height: 100%;
      }
      .big-metric {
        height: 100%;
      }
    }
    .map-row {
      flex: 2.4;
      min-height: 0;
      margin-bottom: 0;
      .el-col {
        height: 100%;
      }
      .chart-panel {
        height: 100%;
      }
    }
    .data-row {
      flex: 2;
      min-height: 0;
      margin-bottom: 0;
      .el-col {
        height: 100%;
      }
      .chart-panel {
        height: 100%;
      }
    }
    .bottom-row {
      flex: 1.8;
      min-height: 0;
      .el-col {
        height: 100%;
      }
      .chart-panel {
        height: 100%;
      }
    }

    // 面板内部自适应
    .panel-body {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .map-body {
      height: auto;
      flex: 1;
      min-height: 0;
    }
    .map-chart {
      height: 100%;
    }
    .line-chart {
      min-height: 0;
    }
    .status-distribution,
    .batch-progress,
    .realtime-table,
    .alarm-stats,
    .quality-content {
      min-height: 0;
    }
  }
}

// ========== 科技感背景 ==========
.tech-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  .tech-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(64,158,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(64,158,255,0.04) 1px, transparent 1px);
    background-size: 30px 30px;
  }

  .tech-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.5;
    &.glow-1 {
      width: 500px; height: 500px;
      top: -150px; right: -100px;
      background: radial-gradient(circle, rgba(64,158,255,0.2) 0%, transparent 70%);
      animation: glowMove1 8s ease-in-out infinite;
    }
    &.glow-2 {
      width: 400px; height: 400px;
      bottom: -100px; left: -50px;
      background: radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%);
      animation: glowMove2 10s ease-in-out infinite;
    }
  }
}

@keyframes glowMove1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-30px, 20px); }
}
@keyframes glowMove2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -30px); }
}

.dashboard-header,
.metrics-row,
.map-row,
.data-row,
.bottom-row {
  position: relative;
  z-index: 1;
}

// ========== 顶部标题栏 ==========
.dashboard-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(64,158,255,0.2);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(64,158,255,0.08);

  .header-decor {
    position: absolute;
    top: -1px;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #409eff, transparent);
    &.left { left: 15%; }
    &.right { right: 15%; }
  }

  .header-left {
    display: flex;
    align-items: center;
    .header-icon {
      position: relative;
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, #409eff 0%, #667eea 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      margin-right: 16px;
      color: #fff;
      box-shadow: 0 4px 15px rgba(64,158,255,0.3);

      .icon-ring {
        position: absolute;
        border: 1px solid rgba(64,158,255,0.4);
        border-radius: 12px;
        &.ring-1 {
          top: -4px; left: -4px; right: -4px; bottom: -4px;
          animation: ringRotate 4s linear infinite;
        }
        &.ring-2 {
          top: -8px; left: -8px; right: -8px; bottom: -8px;
          border-color: rgba(64,158,255,0.15);
          animation: ringRotate 6s linear infinite reverse;
        }
      }
    }
    .header-text {
      position: relative;
      .title-line {
        position: absolute;
        left: 0;
        top: -6px;
        width: 30px;
        height: 2px;
        background: linear-gradient(90deg, #409eff, transparent);
      }
      .header-title {
        font-size: 22px;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(90deg, #303133 0%, #409eff 50%, #303133 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 2px;
        animation: titleShine 4s linear infinite;
      }
      .header-sub {
        font-size: 10px;
        color: #909399;
        margin: 4px 0 0;
        letter-spacing: 3px;
        font-weight: 500;
      }
    }
  }
  .header-center {
    text-align: center;
    .time-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      .time-decor {
        width: 20px;
        height: 1px;
        background: linear-gradient(90deg, transparent, #409eff);
        &.right { background: linear-gradient(90deg, #409eff, transparent); }
      }
    }
    .current-time {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(180deg, #409eff 0%, #667eea 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
    }
    .current-date {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
      letter-spacing: 1px;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: 14px;
    .status-tag {
      position: relative;
      display: flex;
      align-items: center;
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 1px;
      &.running {
        background: #f0f9eb;
        border: 1px solid #c2e7b0;
        color: #67c23a;
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        margin-right: 8px;
        animation: blink 1.5s infinite;
      }
      .status-ring {
        position: absolute;
        top: 50%;
        left: 14px;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        border: 1px solid currentColor;
        border-radius: 50%;
        opacity: 0.4;
        animation: ringPulse 2s infinite;
      }
    }
    .fullscreen-btn {
      background: #ecf5ff;
      border: 1px solid #b3d8ff;
      color: #409eff;
      font-weight: 500;
      letter-spacing: 1px;
      &:hover {
        background: linear-gradient(135deg, #409eff 0%, #667eea 100%);
        color: #fff;
        border-color: transparent;
        box-shadow: 0 4px 12px rgba(64,158,255,0.3);
      }
    }
  }
}

@keyframes ringRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes titleShine {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
@keyframes ringPulse {
  0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.4; }
  50% { transform: translateY(-50%) scale(1.5); opacity: 0; }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

// ========== 通用面板 ==========
.chart-panel {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #fafcfe 100%);
  border: 1px solid rgba(64,158,255,0.15);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(64,158,255,0.06);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .border-flow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #409eff, transparent);
    animation: borderFlow 3s linear infinite;
    z-index: 2;
    opacity: 0.6;
  }

  .panel-scan {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(64,158,255,0.3), transparent);
    animation: panelScan 4s ease-in-out infinite;
    z-index: 2;
    pointer-events: none;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    border-bottom: 1px solid #f0f2f5;
    background: linear-gradient(90deg, rgba(64,158,255,0.05) 0%, transparent 100%);
    .panel-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      letter-spacing: 1px;
      i { margin-right: 6px; color: #409eff; }
    }
    .panel-badge {
      display: flex;
      align-items: center;
      font-size: 11px;
      padding: 2px 10px;
      border-radius: 10px;
      background: #ecf5ff;
      color: #409eff;
      font-weight: 500;
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #409eff;
        margin-right: 5px;
        animation: blink 1.5s infinite;
      }
      &.danger { background: #fef0f0; color: #f56c6c; }
      &.success { background: #f0f9eb; color: #67c23a; }
    }
    .panel-tabs {
      display: flex;
      gap: 4px;
      .tab-item {
        font-size: 11px;
        padding: 3px 10px;
        border-radius: 4px;
        cursor: pointer;
        color: #909399;
        transition: all 0.2s;
        border: 1px solid transparent;
        &.active {
          background: #ecf5ff;
          color: #409eff;
          border-color: #d9ecff;
        }
      }
    }
  }
  .panel-body {
    flex: 1;
    padding: 12px;
    overflow: hidden;
  }
}

@keyframes borderFlow {
  0% { left: -100%; }
  100% { left: 100%; }
}
@keyframes panelScan {
  0%, 100% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

// ========== 第一行：大指标卡片 ==========
.metrics-row {
  margin-bottom: 12px;
}
.big-metric {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #fafcfe 100%);
  border: 1px solid rgba(64,158,255,0.15);
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 4px 16px rgba(64,158,255,0.06);
  overflow: hidden;
  height: 130px;

  .border-flow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #409eff, transparent);
    animation: borderFlow 3s linear infinite;
    z-index: 2;
    opacity: 0.6;
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(64,158,255,0.3), transparent);
    animation: scanMove 3s ease-in-out infinite;
    z-index: 2;
    pointer-events: none;
  }

  .metric-corner {
    position: absolute;
    width: 10px;
    height: 10px;
    border-color: #409eff;
    border-style: solid;
    z-index: 3;
    opacity: 0.5;
    &.corner-tl { top: 3px; left: 3px; border-width: 2px 0 0 2px; }
    &.corner-tr { top: 3px; right: 3px; border-width: 2px 2px 0 0; }
    &.corner-bl { bottom: 3px; left: 3px; border-width: 0 0 2px 2px; }
    &.corner-br { bottom: 3px; right: 3px; border-width: 0 2px 2px 0; }
  }

  .metric-label {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #909399;
    margin-bottom: 8px;
    font-weight: 500;
    letter-spacing: 1px;
    i { margin-right: 6px; color: #409eff; font-size: 14px; }
  }
  .metric-value {
    display: flex;
    align-items: baseline;
    margin-bottom: 8px;
    .number {
      font-size: 32px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      letter-spacing: 1px;
      &.today { color: #67c23a; }
      &.shift { color: #e6a23c; }
      &.speed { color: #409eff; }
      &.oee { color: #667eea; }
    }
    .unit {
      font-size: 13px;
      color: #c0c4cc;
      margin-left: 4px;
      font-weight: 500;
    }
  }
  .metric-footer {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #c0c4cc;
    .rate { color: #409eff; font-weight: 600; }
  }
  .metric-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #f0f2f5;
    .progress-fill {
      height: 100%;
      transition: width 0.5s;
      &.today { background: linear-gradient(90deg, #67c23a, #95d475); }
      &.shift { background: linear-gradient(90deg, #e6a23c, #f0c78a); }
      &.speed { background: linear-gradient(90deg, #409eff, #66b1ff); }
    }
  }

  &.oee {
    .oee-footer { span { font-size: 10px; } }
    .oee-ring {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 70px;
      height: 70px;
      .ring-dot { animation: ringDotRotate 4s linear infinite; transform-origin: 50px 50px; }
      svg { width: 100%; height: 100%; }
    }
  }
}

@keyframes scanMove {
  0%, 100% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
@keyframes ringDotRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// ========== 第二行：地图 + 产能趋势 ==========
.map-row {
  margin-bottom: 12px;
  .chart-panel { height: 300px; }
}

// 世界地图
.map-panel {
  .map-stats {
    display: flex;
    gap: 12px;
    .map-stat {
      font-size: 11px;
      color: #909399;
      i { margin-right: 3px; }
      b { color: #409eff; font-size: 13px; }
    }
  }
  .map-body {
    padding: 8px;
    position: relative;
    height: calc(100% - 42px);
  }
  .map-chart {
    width: 100%;
    height: 100%;
  }
}

// 设备信息浮层
.device-info-card {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 200px;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(64,158,255,0.3);
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(64,158,255,0.15);
  backdrop-filter: blur(10px);
  overflow: hidden;
  z-index: 10;

  .info-header {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    background: linear-gradient(90deg, rgba(64,158,255,0.1) 0%, transparent 100%);
    border-bottom: 1px solid #f0f2f5;
    .info-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #67c23a;
      margin-right: 6px;
      box-shadow: 0 0 6px #67c23a;
      animation: blink 1.5s infinite;
    }
    .info-title {
      flex: 1;
      font-size: 12px;
      font-weight: 600;
      color: #303133;
    }
  }
  .info-body {
    padding: 8px 10px;
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 11px;
      border-bottom: 1px dashed #f0f2f5;
      &:last-child { border-bottom: none; }
      .info-label { color: #909399; }
      .info-value { color: #303133; font-weight: 500; text-align: right; max-width: 120px; }
      .highlight { color: #409eff; font-weight: 600; }
    }
  }
}

// ========== 折线图 ==========
.line-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  .chart-svg {
    flex: 1;
    width: 100%;
    .data-point {
      transition: r 0.2s;
      &:hover { r: 6; }
    }
  }
  .chart-labels {
    display: flex;
    justify-content: space-around;
    font-size: 10px;
    color: #c0c4cc;
    padding-top: 4px;
  }
}

// ========== 第三行：数据 ==========
.data-row {
  margin-bottom: 12px;
  .chart-panel { height: 240px; }
}

// 设备状态
.status-distribution {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  .donut-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    .donut-svg { width: 100%; height: 100%; }
    .donut-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .donut-value {
        font-size: 20px;
        font-weight: 700;
        color: #67c23a;
        font-family: 'Courier New', monospace;
      }
      .donut-label {
        font-size: 10px;
        color: #909399;
        letter-spacing: 1px;
      }
    }
  }
  .status-legend {
    flex: 1;
    .legend-item {
      display: flex;
      align-items: center;
      padding: 6px 0;
      font-size: 12px;
      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        margin-right: 8px;
        &.running { background: #67c23a; }
        &.idle { background: #e6a23c; }
        &.fault { background: #f56c6c; }
      }
      .legend-name { flex: 1; color: #606266; }
      .legend-time { color: #303133; font-weight: 600; margin-right: 8px; }
      .legend-percent { color: #909399; width: 35px; text-align: right; }
    }
  }
}

// 批次
.batch-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
  .batch-item {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    .batch-label { color: #909399; }
    .batch-value { color: #303133; font-weight: 500; }
  }
}
.batch-tag {
  background: #ecf5ff !important;
  border-color: #d9ecff !important;
  color: #409eff !important;
}
.batch-progress {
  .progress-header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 6px;
    span:first-child { color: #606266; font-weight: 600; letter-spacing: 1px; }
    .progress-text { color: #409eff; font-weight: 500; }
  }
  .progress-bar-large {
    position: relative;
    height: 22px;
    background: #f0f2f5;
    border-radius: 11px;
    overflow: hidden;
    margin-bottom: 12px;
    .progress-fill-large {
      height: 100%;
      background: linear-gradient(90deg, #409eff 0%, #667eea 100%);
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
      transition: width 0.5s;
      .progress-percent {
        font-size: 11px;
        font-weight: 700;
        color: #fff;
      }
    }
    .progress-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shineMove 2s ease-in-out infinite;
    }
  }
  .batch-stats {
    display: flex;
    justify-content: space-around;
    .batch-stat {
      text-align: center;
      .stat-value {
        font-size: 16px;
        font-weight: 700;
        color: #409eff;
        font-family: 'Courier New', monospace;
        margin-bottom: 2px;
      }
      .stat-label {
        font-size: 10px;
        color: #909399;
        letter-spacing: 1px;
      }
    }
  }
}

@keyframes shineMove {
  0% { left: -100%; }
  100% { left: 200%; }
}

// 实时数据
.realtime-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  .rt-header {
    display: flex;
    padding: 6px 8px;
    background: linear-gradient(90deg, #ecf5ff 0%, #f5f7fa 100%);
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #409eff;
    letter-spacing: 1px;
    span { flex: 1; text-align: center; &:first-child { text-align: left; } }
  }
  .rt-body {
    flex: 1;
    overflow-y: auto;
    .rt-row {
      display: flex;
      padding: 8px;
      border-bottom: 1px solid #f5f7fa;
      font-size: 11px;
      color: #606266;
      transition: background 0.2s;
      &:hover { background: #f5f7fa; }
      &.latest {
        background: linear-gradient(90deg, #f0f9eb 0%, transparent 100%);
        .rt-time { color: #67c23a; font-weight: 600; }
      }
      span { flex: 1; text-align: center; &:first-child { text-align: left; color: #909399; font-family: 'Courier New', monospace; } }
      .rt-status {
        padding: 1px 6px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 500;
        &.normal { background: #f0f9eb; color: #67c23a; }
        &.warning { background: #fdf6ec; color: #e6a23c; }
      }
    }
  }
}

// ========== 第四行 ==========
.bottom-row {
  .chart-panel { height: 220px; }
}

// 报警
.alarm-stats {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .alarm-stat-item {
    .as-header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 4px;
      .as-name { color: #606266; }
      .as-count { color: #303133; font-weight: 600; }
    }
    .as-bar {
      position: relative;
      height: 8px;
      background: #f0f2f5;
      border-radius: 4px;
      overflow: hidden;
      .as-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.5s;
      }
    }
  }
}

// 质量
.quality-content {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  .quality-ring {
    position: relative;
    width: 110px;
    height: 110px;
    flex-shrink: 0;
    svg { width: 100%; height: 100%; }
    .quality-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .quality-value {
        font-size: 24px;
        font-weight: 700;
        color: #67c23a;
        font-family: 'Courier New', monospace;
      }
      .quality-label {
        font-size: 11px;
        color: #909399;
        letter-spacing: 1px;
      }
    }
  }
  .quality-stats {
    flex: 1;
    .qs-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f5f7fa;
      font-size: 13px;
      &:last-child { border-bottom: none; }
      .qs-label { color: #909399; }
      .qs-value { color: #303133; font-weight: 600; &.success { color: #67c23a; } &.danger { color: #f56c6c; } }
    }
  }
}
</style>
