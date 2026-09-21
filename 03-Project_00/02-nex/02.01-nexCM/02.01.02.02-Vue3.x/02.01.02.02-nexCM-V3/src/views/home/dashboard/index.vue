<template>
  <div ref="dashboardRef" class="dashboard-container" :class="{ fullscreen: isFullscreen }">
    <div class="dashboard-stage" :style="stageStyle">
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
            <el-icon><Monitor /></el-icon>
            <div class="icon-ring ring-1"></div>
            <div class="icon-ring ring-2"></div>
          </div>
          <div class="header-text">
            <div class="title-line"></div>
            <h1 class="header-title">{{ t('layout.home.dashboard.title') }}</h1>
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
            :icon="isFullscreen ? Close : FullScreen"
            size="small"
            class="fullscreen-btn"
            @click="toggleFullscreen"
          >
            {{ isFullscreen ? t('layout.home.dashboard.exitFullscreen') : t('layout.home.dashboard.fullscreen') }}
          </el-button>
        </div>
      </div>

      <!-- 第一行：核心指标大卡片 -->
      <el-row :gutter="12" class="metrics-row">
        <el-col v-for="(metric, index) in metricList" :key="index" :span="6">
          <div class="big-metric" :class="metric.type">
            <div class="border-flow"></div>
            <div class="metric-corner corner-tl"></div>
            <div class="metric-corner corner-tr"></div>
            <div class="metric-corner corner-bl"></div>
            <div class="metric-corner corner-br"></div>
            <div class="scan-line"></div>

            <div class="metric-label">
              <el-icon><component :is="metric.icon" /></el-icon>
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
            <div v-if="metric.progress" class="metric-progress">
              <div class="progress-fill" :class="metric.type" :style="{ width: metric.progress + '%' }"></div>
            </div>
            <div v-if="metric.type === 'oee'" class="oee-ring">
              <svg viewBox="0 0 100 100">
                <defs>
                  <linearGradient :id="'oeeGrad-' + index" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00d4ff" />
                    <stop offset="50%" style="stop-color:#409eff" />
                    <stop offset="100%" style="stop-color:#667eea" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e8f0fe" stroke-width="3" />
                <circle
                  cx="50" cy="50" r="42" fill="none" :stroke="'url(#oeeGrad-' + index + ')'" stroke-width="3"
                  :stroke-dasharray="263.9" :stroke-dashoffset="263.9 * (1 - oeeData.value / 100)"
                  transform="rotate(-90 50 50)" stroke-linecap="round"
                />
                <circle cx="50" cy="8" r="2" fill="#409eff" class="ring-dot" />
              </svg>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 第二行：世界地图 + 产能趋势 -->
      <el-row :gutter="12" class="map-row">
        <el-col :span="14">
          <div class="chart-panel map-panel">
            <div class="border-flow"></div>
            <div class="panel-scan"></div>
            <div class="panel-header">
              <span class="panel-title"><el-icon><Location /></el-icon> {{ t('layout.home.dashboard.worldMap.title') }}</span>
              <div class="map-stats">
                <span class="map-stat"><el-icon><User /></el-icon> {{ t('layout.home.dashboard.worldMap.onlineDevice') }} <b>1</b></span>
                <span class="map-stat"><el-icon><WarningFilled /></el-icon> {{ t('layout.home.dashboard.worldMap.alarm') }} <b>0</b></span>
              </div>
            </div>
            <div class="panel-body map-body">
              <div ref="mapChartRef" class="map-chart"></div>
              <div class="device-info-card">
                <div class="info-header">
                  <span class="info-dot"></span>
                  <span class="info-title">{{ t('layout.home.dashboard.deviceInfo.title') }}</span>
                  <el-tag size="small" :type="deviceStatus.status === 'running' ? 'success' : 'warning'" effect="plain">{{ deviceStatus.text }}</el-tag>
                </div>
                <div class="info-body">
                  <div class="info-row">
                    <span class="info-label">{{ t('layout.home.dashboard.deviceInfo.name') }}</span>
                    <span class="info-value">{{ deviceInfo.name || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">{{ t('layout.home.dashboard.deviceInfo.region') }}</span>
                    <span class="info-value">{{ deviceInfo.location || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">{{ t('layout.home.dashboard.deviceInfo.location') }}</span>
                    <span class="info-value">{{ deviceInfo.locationCoords ? deviceInfo.locationCoords.lng + '°E, ' + deviceInfo.locationCoords.lat + '°N' : '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">{{ t('layout.home.dashboard.deviceInfo.ip') }}</span>
                    <span class="info-value">{{ deviceInfo.ip || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">{{ t('layout.home.dashboard.deviceInfo.runtime') }}</span>
                    <span class="info-value highlight">{{ runtimeStats.running }}{{ t('layout.home.dashboard.deviceInfo.hours') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="10">
          <div class="chart-panel">
            <div class="border-flow"></div>
            <div class="panel-scan"></div>
            <div class="panel-header">
              <span class="panel-title"><el-icon><TrendCharts /></el-icon> {{ t('layout.home.dashboard.outputTrend.title') }}</span>
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
                  <line x1="0" y1="45" x2="400" y2="45" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4" />
                  <line x1="0" y1="90" x2="400" y2="90" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4" />
                  <line x1="0" y1="135" x2="400" y2="135" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4" />
                  <path :d="areaPath" fill="url(#lineGradient)" />
                  <path :d="linePath" fill="none" stroke="url(#lineStroke)" stroke-width="2.5" />
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
        <el-col :span="8">
          <div class="chart-panel">
            <div class="border-flow"></div>
            <div class="panel-scan"></div>
            <div class="panel-header">
              <span class="panel-title"><el-icon><Cpu /></el-icon> {{ t('layout.home.dashboard.deviceStatus.title') }}</span>
            </div>
            <div class="panel-body">
              <div class="status-distribution">
                <div class="donut-wrapper">
                  <svg viewBox="0 0 100 100" class="donut-svg">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#f0f2f5" stroke-width="10" />
                    <circle
                      cx="50" cy="50" r="35" fill="none" stroke="#67c23a" stroke-width="10"
                      :stroke-dasharray="(runtimeStats.runningRate / 100) * 219.9 + ' 219.9'"
                      transform="rotate(-90 50 50)" stroke-linecap="round"
                    />
                    <circle
                      cx="50" cy="50" r="35" fill="none" stroke="#e6a23c" stroke-width="10"
                      :stroke-dasharray="(runtimeStats.idleRate / 100) * 219.9 + ' 219.9'"
                      :stroke-dashoffset="-(runtimeStats.runningRate / 100) * 219.9"
                      transform="rotate(-90 50 50)"
                    />
                    <circle
                      cx="50" cy="50" r="35" fill="none" stroke="#f56c6c" stroke-width="10"
                      :stroke-dasharray="(runtimeStats.faultRate / 100) * 219.9 + ' 219.9'"
                      :stroke-dashoffset="-((runtimeStats.runningRate + runtimeStats.idleRate) / 100) * 219.9"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div class="donut-center">
                    <div class="donut-value">{{ runtimeStats.runningRate }}%</div>
                    <div class="donut-label">{{ t('layout.home.dashboard.deviceStatus.runningRate') }}</div>
                  </div>
                </div>
                <div class="status-legend">
                  <div v-for="(item, index) in legendList" :key="index" class="legend-item">
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

        <el-col :span="8">
          <div class="chart-panel">
            <div class="border-flow"></div>
            <div class="panel-scan"></div>
            <div class="panel-header">
              <span class="panel-title"><el-icon><List /></el-icon> {{ t('layout.home.dashboard.batch.title') }}</span>
              <el-tag size="small" type="primary" effect="plain" class="batch-tag">{{ batchInfo.batchNo }}</el-tag>
            </div>
            <div class="panel-body">
              <div class="batch-info">
                <div v-for="(item, index) in batchInfoList" :key="index" class="batch-item">
                  <span class="batch-label">{{ item.label }}</span>
                  <span class="batch-value">{{ item.value }}</span>
                </div>
              </div>
              <div class="batch-progress">
                <div class="progress-header">
                  <span>{{ t('layout.home.dashboard.batch.progress') }}</span>
                  <span class="progress-text">{{ formatNumber(batchInfo.produced) }} / {{ formatNumber(batchInfo.target) }} {{ t('layout.home.dashboard.batch.bottle') }}</span>
                </div>
                <div class="progress-bar-large">
                  <div class="progress-fill-large" :style="{ width: batchInfo.progress + '%' }">
                    <span class="progress-percent">{{ batchInfo.progress }}%</span>
                  </div>
                  <div class="progress-shine"></div>
                </div>
                <div class="batch-stats">
                  <div v-for="(stat, index) in batchStatsList" :key="index" class="batch-stat">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-label">{{ stat.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="chart-panel">
            <div class="border-flow"></div>
            <div class="panel-scan"></div>
            <div class="panel-header">
              <span class="panel-title"><el-icon><TrendCharts /></el-icon> {{ t('layout.home.dashboard.realtime.title') }}</span>
              <span class="panel-badge"><span class="badge-dot"></span>{{ t('layout.home.dashboard.realtime.live') }}</span>
            </div>
            <div class="panel-body">
              <div class="realtime-table">
                <div class="rt-header">
                  <span>{{ t('layout.home.dashboard.realtime.colTime') }}</span><span>{{ t('layout.home.dashboard.realtime.colSpeed') }}</span><span>{{ t('layout.home.dashboard.realtime.colOutput') }}</span><span>{{ t('layout.home.dashboard.realtime.colFill') }}</span><span>{{ t('layout.home.dashboard.realtime.colStatus') }}</span>
                </div>
                <div class="rt-body">
                  <div v-for="(item, index) in realtimeData" :key="index" class="rt-row" :class="{ latest: index === 0 }">
                    <span class="rt-time">{{ item.time }}</span>
                    <span>{{ item.speed }}</span>
                    <span>{{ formatNumber(item.output) }}</span>
                    <span>{{ item.fillVolume }}</span>
                    <span>
                      <span class="rt-status" :class="item.status === 'normal' ? 'normal' : 'warning'">{{ item.status === 'normal' ? t('layout.home.dashboard.realtime.statusNormal') : t('layout.home.dashboard.realtime.statusFluctuate') }}</span>
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
        <el-col :span="12">
          <div class="chart-panel">
            <div class="border-flow"></div>
            <div class="panel-scan"></div>
            <div class="panel-header">
              <span class="panel-title"><el-icon><WarningFilled /></el-icon> {{ t('layout.home.dashboard.alarmStats.title') }}</span>
              <span class="panel-badge danger">{{ alarmStats.total }}{{ t('layout.home.dashboard.alarmStats.times') }}</span>
            </div>
            <div class="panel-body">
              <div class="alarm-stats">
                <div v-for="(item, index) in alarmStats.list" :key="index" class="alarm-stat-item">
                  <div class="as-header">
                    <span class="as-name">{{ item.name }}</span>
                    <span class="as-count">{{ item.count }}{{ t('layout.home.dashboard.alarmStats.times') }}</span>
                  </div>
                  <div class="as-bar">
                    <div class="as-fill" :style="{ width: (item.count / alarmStats.maxCount * 100) + '%', background: item.color }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="chart-panel">
            <div class="border-flow"></div>
            <div class="panel-scan"></div>
            <div class="panel-header">
              <span class="panel-title"><el-icon><CircleCheckFilled /></el-icon> {{ t('layout.home.dashboard.quality.title') }}</span>
              <span class="panel-badge success">{{ t('layout.home.dashboard.quality.qualifiedRate') }} {{ qualityData.qualifiedRate }}%</span>
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
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f0f2f5" stroke-width="8" />
                    <circle
                      cx="50" cy="50" r="38" fill="none" stroke="url(#qualityGradient)" stroke-width="8"
                      :stroke-dasharray="(qualityData.qualifiedRate / 100) * 238.8 + ' 238.8'"
                      transform="rotate(-90 50 50)" stroke-linecap="round"
                    />
                  </svg>
                  <div class="quality-center">
                    <div class="quality-value">{{ qualityData.qualifiedRate }}%</div>
                    <div class="quality-label">{{ t('layout.home.dashboard.quality.qualifiedRate') }}</div>
                  </div>
                </div>
                <div class="quality-stats">
                  <div v-for="(item, index) in qualityStatsList" :key="index" class="qs-item">
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
  </div>
</template>

<script setup lang="ts">
/**
 * 数据看板 - 大屏展示版（浅色科技感 + ECharts 世界地图）
 * 数据来源：统一从 device Pinia store 获取
 * 作者：GooHv
 * 注：UI 文案已接入 layout.home.dashboard 国际化；地图坐标等占位文本保留。
 */
import * as echarts from 'echarts'
import { ref, computed, onMounted, onBeforeUnmount, nextTick, shallowRef } from 'vue'
import type { Component } from 'vue'
import {
  Monitor, Location, User, WarningFilled, TrendCharts, Cpu, List,
  CircleCheckFilled, FullScreen, Close, Box, Clock, Lightning
} from '@element-plus/icons-vue'
import { useDeviceStore } from '@/store/modules/device'
import { useI18n } from '@/composables/useI18n'
import { showError } from '@/utils/ui/feedback'
import { getCoordsByValues } from '@/utils/business/worldCities'

const { t } = useI18n()
const deviceStore = useDeviceStore()

const isFullscreen = ref(false)
const scale = ref(1)
const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const currentTime = ref('')
const currentDate = ref('')
let timer: ReturnType<typeof setInterval> | null = null
const mapChart = shallowRef<echarts.ECharts | null>(null)
const mapLoaded = ref(false)
const trendType = ref('hour')
const trendTabs = computed(() => [
  { label: t('layout.home.dashboard.period.hour'), value: 'hour' },
  { label: t('layout.home.dashboard.period.day'), value: 'day' },
  { label: t('layout.home.dashboard.period.month'), value: 'month' }
])
const realtimeData = ref([
  { time: '14:30:00', speed: 1200, output: 8560, fillVolume: 2.0, status: 'normal' },
  { time: '14:25:00', speed: 1180, output: 8460, fillVolume: 2.0, status: 'normal' },
  { time: '14:20:00', speed: 1210, output: 8360, fillVolume: 2.0, status: 'normal' },
  { time: '14:15:00', speed: 1150, output: 8260, fillVolume: 2.0, status: 'fluctuate' },
  { time: '14:10:00', speed: 1200, output: 8160, fillVolume: 2.0, status: 'normal' }
])

const mapChartRef = ref<HTMLDivElement | null>(null)
const dashboardRef = ref<HTMLElement | null>(null)

const stageStyle = computed(() => {
  if (!isFullscreen.value) return {}
  return {
    width: DESIGN_WIDTH + 'px',
    height: DESIGN_HEIGHT + 'px',
    transform: 'scale(' + scale.value + ')',
    transformOrigin: 'center center',
    flexShrink: 0
  } as Record<string, string | number>
})

const storeProduction = computed(() => deviceStore.production)
const storeParams = computed(() => deviceStore.params)
const storeTrend = computed(() => deviceStore.trendData)
const storeRuntime = computed(() => deviceStore.runtimeStats)
const batchInfo = computed(() => deviceStore.currentBatch)
const deviceInfo = computed(() => deviceStore.info)

const deviceStatus = computed(() => ({
  status: deviceStore.status,
  text: deviceStore.statusText
}))

// 报警统计：从 categoryStats 组装成图表所需结构（源工程直接消费 alarms.total/list/maxCount，此处补齐）
const alarmStats = computed(() => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#667eea']
  const labels: Record<string, string> = {
    position: t('layout.home.dashboard.alarmTypes.position'),
    vacuum: t('layout.home.dashboard.alarmTypes.vacuum'),
    servo: t('layout.home.dashboard.alarmTypes.servo'),
    timeout: t('layout.home.dashboard.alarmTypes.timeout'),
    temperature: t('layout.home.dashboard.alarmTypes.temperature'),
    other: t('layout.home.dashboard.alarmTypes.other')
  }
  const cat = deviceStore.alarms.categoryStats || {}
  const list = Object.keys(cat).map((key, i) => ({
    name: labels[key] || key,
    count: (cat as Record<string, number>)[key] || 0,
    color: colors[i % colors.length]
  }))
  const total = list.reduce((s, it) => s + it.count, 0)
  const maxCount = list.reduce((m, it) => Math.max(m, it.count), 1) || 1
  return { total, list, maxCount }
})

const metrics = computed(() => ({
  todayOutput: storeProduction.value.todayOutput,
  todayTarget: storeProduction.value.todayTarget,
  todayRate: storeProduction.value.todayRate,
  shiftOutput: storeProduction.value.shiftOutput,
  shiftTarget: storeProduction.value.shiftTarget,
  shiftName: storeProduction.value.shiftName,
  currentSpeed: storeParams.value.speed,
  targetSpeed: 1500
}))

const oeeData = computed(() => ({
  value: storeProduction.value.oee,
  availability: storeProduction.value.availability,
  performance: storeProduction.value.performance,
  quality: storeProduction.value.quality
}))

const productionTrend = computed(() => {
  if (storeTrend.value && storeTrend.value.speed && storeTrend.value.speed.length > 0) {
    return storeTrend.value.speed.map((item) => ({ hour: item.time.slice(0, 2), value: item.value }))
  }
  return [
    { hour: '00', value: 0 }, { hour: '02', value: 0 }, { hour: '04', value: 0 },
    { hour: '06', value: 120 }, { hour: '08', value: 850 }, { hour: '10', value: 1200 },
    { hour: '12', value: 1100 }, { hour: '14', value: 1350 }, { hour: '16', value: 1280 },
    { hour: '18', value: 660 }, { hour: '20', value: 0 }, { hour: '22', value: 0 }
  ]
})

const runtimeStats = computed(() => {
  const rt = storeRuntime.value
  const total = rt.running + rt.idle + rt.fault + rt.plannedStop
  return {
    running: rt.running,
    idle: rt.idle,
    fault: rt.fault,
    runningRate: total ? Math.round((rt.running / total) * 1000) / 10 : 0,
    idleRate: total ? Math.round((rt.idle / total) * 1000) / 10 : 0,
    faultRate: total ? Math.round((rt.fault / total) * 1000) / 10 : 0
  }
})

const qualityData = computed(() => {
  const prod = storeProduction.value
  return {
    qualifiedRate: prod.qualifiedRate,
    total: prod.todayOutput,
    qualified: Math.round((prod.todayOutput * prod.qualifiedRate) / 100),
    unqualified: Math.round((prod.todayOutput * (100 - prod.qualifiedRate)) / 100),
    scrapRate: (100 - prod.qualifiedRate).toFixed(1)
  }
})

interface MetricItem {
  type: string
  icon: Component
  label: string
  value: string | number
  unit: string
  subLeft: string
  subRight: string
  progress: string | number | null
}

const metricList = computed<MetricItem[]>(() => [
  {
    type: 'today', icon: Box, label: t('layout.home.dashboard.metrics.todayOutput'),
    value: formatNumber(metrics.value.todayOutput), unit: t('layout.home.dashboard.metrics.bottle'),
    subLeft: `${t('layout.home.dashboard.metrics.target')} ${formatNumber(metrics.value.todayTarget)}`,
    subRight: `${t('layout.home.dashboard.metrics.completion')} ${metrics.value.todayRate}%`,
    progress: metrics.value.todayRate
  },
  {
    type: 'shift', icon: Clock, label: t('layout.home.dashboard.metrics.shiftOutput'),
    value: formatNumber(metrics.value.shiftOutput), unit: t('layout.home.dashboard.metrics.bottle'),
    subLeft: metrics.value.shiftName,
    subRight: `${t('layout.home.dashboard.metrics.target')} ${formatNumber(metrics.value.shiftTarget)}`,
    progress: ((metrics.value.shiftOutput / metrics.value.shiftTarget) * 100).toFixed(1)
  },
  {
    type: 'speed', icon: Lightning, label: t('layout.home.dashboard.metrics.speed'),
    value: metrics.value.currentSpeed, unit: t('layout.home.dashboard.metrics.bottlePerHour'),
    subLeft: `${t('layout.home.dashboard.metrics.target')} ${metrics.value.targetSpeed} ${t('layout.home.dashboard.metrics.bottlePerHour')}`,
    subRight: `${t('layout.home.dashboard.metrics.efficiency')} ${Math.round((metrics.value.currentSpeed / metrics.value.targetSpeed) * 100)}%`,
    progress: ((metrics.value.currentSpeed / metrics.value.targetSpeed) * 100).toFixed(1)
  },
  {
    type: 'oee', icon: TrendCharts, label: t('layout.home.dashboard.metrics.oee'),
    value: oeeData.value.value, unit: '%',
    subLeft: `${t('layout.home.dashboard.metrics.available')} ${oeeData.value.availability}%`,
    subRight: `${t('layout.home.dashboard.metrics.performance')} ${oeeData.value.performance}% ${t('layout.home.dashboard.metrics.qualified')} ${oeeData.value.quality}%`,
    progress: null
  }
])

const legendList = computed(() => ([
  { type: 'running', name: t('layout.home.dashboard.runtime.running'), time: runtimeStats.value.running, rate: runtimeStats.value.runningRate },
  { type: 'idle', name: t('layout.home.dashboard.runtime.idle'), time: runtimeStats.value.idle, rate: runtimeStats.value.idleRate },
  { type: 'fault', name: t('layout.home.dashboard.runtime.fault'), time: runtimeStats.value.fault, rate: runtimeStats.value.faultRate }
]))

const batchInfoList = computed(() => ([
  { label: t('layout.home.dashboard.batchInfo.productName'), value: batchInfo.value.productName },
  { label: t('layout.home.dashboard.batchInfo.fillVolume'), value: `${batchInfo.value.fillVolume} ml` },
  { label: t('layout.home.dashboard.batchInfo.startTime'), value: batchInfo.value.startTime },
  { label: t('layout.home.dashboard.batchInfo.estimatedEnd'), value: batchInfo.value.estimatedEnd }
]))

const batchStatsList = computed(() => ([
  { value: formatNumber(batchInfo.value.produced), label: t('layout.home.dashboard.batchInfo.produced') },
  { value: formatNumber(batchInfo.value.target - batchInfo.value.produced), label: t('layout.home.dashboard.batchInfo.remaining') },
  { value: batchInfo.value.estimatedTime, label: t('layout.home.dashboard.batchInfo.estimatedRemaining') },
  { value: `${batchInfo.value.qualifiedRate}%`, label: t('layout.home.dashboard.quality.qualifiedRate') }
]))

const qualityStatsList = computed(() => ([
  { label: t('layout.home.dashboard.quality.total'), value: formatNumber(qualityData.value.total), type: '' },
  { label: t('layout.home.dashboard.quality.qualified'), value: formatNumber(qualityData.value.qualified), type: 'success' },
  { label: t('layout.home.dashboard.quality.unqualified'), value: formatNumber(qualityData.value.unqualified), type: 'danger' },
  { label: t('layout.home.dashboard.quality.scrapRate'), value: `${qualityData.value.scrapRate}%`, type: '' }
]))

const chartPoints = computed(() => {
  const maxVal = Math.max(...productionTrend.value.map((item) => item.value), 1)
  return productionTrend.value.map((item, index) => ({
    x: (index / (productionTrend.value.length - 1)) * 400,
    y: 170 - (item.value / maxVal) * 150
  }))
})

const linePath = computed(() => {
  if (chartPoints.value.length === 0) return ''
  return chartPoints.value.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ')
})

const areaPath = computed(() => {
  if (chartPoints.value.length === 0) return ''
  const line = chartPoints.value.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ')
  return `${line} L400,180 L0,180 Z`
})

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function updateTime(): void {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  currentTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const weekDays = t('layout.home.dashboard.weekDays') as unknown as string[]
  currentDate.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${weekDays[now.getDay()]}`
}

async function initMap(): Promise<void> {
  if (!mapChartRef.value) return
  try {
    const response = await fetch('/map/world.json')
    if (!response.ok) throw new Error('地图数据加载失败')
    const worldJson = await response.json()
    echarts.registerMap('world', worldJson)
    mapChart.value = echarts.init(mapChartRef.value)

    const info = deviceStore.info
    const deviceName = info.name || 'nexCM-灌装机-001'
    const deviceLocation = info.location || ''

    let deviceCoords: [number, number] = [120.30, 31.57]
    if (info.locationCoords && info.locationCoords.lng && info.locationCoords.lat) {
      deviceCoords = [info.locationCoords.lng, info.locationCoords.lat]
    } else if (Array.isArray(info.locationCode) && info.locationCode.length === 2) {
      const cityInfo = getCoordsByValues(info.locationCode)
      if (cityInfo) deviceCoords = [cityInfo.lng, cityInfo.lat]
    }

    const deviceData = [{
      name: deviceName,
      value: [deviceCoords[0], deviceCoords[1], 100],
      itemStyle: { color: '#409eff' }
    }]

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: 'rgba(64,158,255,0.3)',
        borderWidth: 1,
        textStyle: { color: '#303133', fontSize: 12 },
        formatter: (params: { seriesType?: string; name?: string; value?: number[] }) => {
          if (params.seriesType === 'effectScatter') {
            return `<div style="font-weight:600;margin-bottom:4px;">${params.name}</div>
              <div>${t('layout.home.dashboard.mapTooltip.location')}：${deviceLocation || '中国·江苏无锡'}</div>
              <div>${t('layout.home.dashboard.mapTooltip.coordinates')}：${params.value?.[0]}°E, ${params.value?.[1]}°N</div>
              <div>${t('layout.home.dashboard.mapTooltip.status')}：<span style="color:#67c23a;">${t('layout.home.dashboard.mapTooltip.online')}</span></div>`
          }
          return params.name || ''
        }
      },
      geo: {
        map: 'world', roam: false, zoom: 1.2, center: [60, 25],
        itemStyle: {
          areaColor: { type: 'radial', x: 0.5, y: 0.5, r: 0.8, colorStops: [
            { offset: 0, color: '#e8f4fd' }, { offset: 1, color: '#c6e2ff' }
          ] },
          borderColor: '#7ab8f5', borderWidth: 0.5,
          shadowColor: 'rgba(64,158,255,0.2)', shadowBlur: 10, shadowOffsetX: 2, shadowOffsetY: 2
        },
        emphasis: {
          itemStyle: { areaColor: '#a8d4ff', borderColor: '#409eff', borderWidth: 1 },
          label: { show: false }
        },
        regions: [{
          name: 'China',
          itemStyle: {
            areaColor: { type: 'radial', x: 0.5, y: 0.5, r: 0.8, colorStops: [
              { offset: 0, color: '#d4edda' }, { offset: 1, color: '#a8d5b5' }
            ] },
            borderColor: '#67c23a', borderWidth: 1
          }
        }]
      },
      series: [{
        name: '设备位置', type: 'effectScatter', coordinateSystem: 'geo',
        data: deviceData,
        symbolSize: (val: number[]) => val[2] / 8 + 8,
        showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke', scale: 4, period: 3 },
        emphasis: { scale: true },
        label: {
          show: true, position: 'right', formatter: '{b}', color: '#409eff',
          fontSize: 11, fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.8)',
          padding: [2, 6], borderRadius: 3
        },
        itemStyle: { color: '#409eff', shadowBlur: 10, shadowColor: '#409eff' },
        zlevel: 1
      }]
    }
    mapChart.value.setOption(option)
    mapLoaded.value = true
    window.addEventListener('resize', handleMapResize)
  } catch (error) {
    console.error('地图初始化失败:', error)
    if (mapChartRef.value) {
      mapChartRef.value.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#909399;font-size:13px;">${t('layout.home.dashboard.mapTooltip.loading')}</div>`
    }
  }
}

function handleMapResize(): void {
  mapChart.value?.resize()
}

function updateScale(): void {
  if (!isFullscreen.value) { scale.value = 1; return }
  const screenW = window.innerWidth
  const screenH = window.innerHeight
  scale.value = Math.min(screenW / DESIGN_WIDTH, screenH / DESIGN_HEIGHT)
  nextTick(() => handleMapResize())
}

function toggleFullscreen(): void {
  const el = dashboardRef.value as (HTMLElement & {
    requestFullscreen?: () => Promise<void>
    webkitRequestFullscreen?: () => Promise<void>
  }) | null
  if (!el) return
  if (!isFullscreen.value) {
    const requestMethod = el.requestFullscreen || el.webkitRequestFullscreen
    if (requestMethod) {
      requestMethod.call(el).catch((err: unknown) => {
        console.error('全屏失败:', err)
        showError(t('layout.home.dashboard.tip.fullscreenFailed'))
      })
    } else {
      showError(t('layout.home.dashboard.tip.fullscreenNotSupport'))
    }
  } else {
    const doc = document as Document & { webkitExitFullscreen?: () => void }
    const exitMethod = document.exitFullscreen || doc.webkitExitFullscreen
    if (exitMethod) exitMethod.call(document)
  }
}

function handleFullscreenChange(): void {
  const doc = document as Document & { webkitFullscreenElement?: Element | null }
  isFullscreen.value = !!(document.fullscreenElement || doc.webkitFullscreenElement)
  updateScale()
  setTimeout(() => handleMapResize(), 100)
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  window.addEventListener('resize', updateScale)
  nextTick(() => initMap())
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  window.removeEventListener('resize', handleMapResize)
  window.removeEventListener('resize', updateScale)
  if (mapChart.value) {
    mapChart.value.dispose()
    mapChart.value = null
  }
  const doc = document as Document & { webkitExitFullscreen?: () => void; webkitFullscreenElement?: Element | null }
  if (document.fullscreenElement || doc.webkitFullscreenElement) {
    const exitMethod = document.exitFullscreen || doc.webkitExitFullscreen
    if (exitMethod) exitMethod.call(document)
  }
})
</script>

<style scoped lang="less">
.dashboard-container {
  position: relative;
  padding: 12px;
  min-height: calc(100vh - 84px);
  background: #fff;
  overflow: hidden;
  transition: all 0.3s;

  &.fullscreen,
  &:fullscreen,
  &:-webkit-full-screen {
    padding: 0;
    height: 100vh;
    min-height: 100vh;
    width: 100vw;
    overflow: hidden;
    // 居中显示等比缩放后的 stage，短边留白用背景色填充
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f0f4f8 0%, #e8eef5 30%, #f0f4f8 70%, #eaf0f7 100%);

    // stage 内部用 flex 按比例分配高度（设计尺寸 1920x1080）
    .dashboard-stage {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      box-sizing: border-box;
    }

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

