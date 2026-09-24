<template>
  <div class="overview-container">
    <!-- 第一行：4 个核心指标卡片 -->
    <el-row :gutter="16" class="top-row">
      <!-- 设备运行状态 -->
      <el-col :span="6">
        <div class="status-card" :class="deviceStatus.status">
          <el-icon class="card-icon">
            <VideoPlay v-if="deviceStatus.status === 'running'" />
            <VideoPause v-else />
          </el-icon>
          <div class="card-content">
            <div class="card-label">{{ t('layout.home.dashboard.deviceStatus.title') }}</div>
            <div class="card-value">{{ deviceStatus.text }}</div>
            <div class="card-sub">{{ t('layout.home.overview.runningDuration', { duration: durationText }) }}</div>
          </div>
          <div v-if="deviceStatus.status === 'running'" class="status-pulse"></div>
        </div>
      </el-col>

      <!-- 运行速度 -->
      <el-col :span="6">
        <div class="metric-card speed">
          <div class="card-icon">
            <el-icon><Odometer /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-label">{{ t('layout.home.dashboard.metrics.speed') }}</div>
            <div class="card-value">
              {{ formatNumber(metrics.currentSpeed)
              }}<span class="card-unit">{{ t('layout.home.dashboard.metrics.bottlePerHour') }}</span>
            </div>
            <div class="card-sub">
              {{ t('layout.home.overview.targetSpeed', { speed: formatNumber(metrics.targetSpeed) }) }}
            </div>
          </div>
        </div>
      </el-col>

      <!-- 今日产能 -->
      <el-col :span="6">
        <div class="metric-card today">
          <div class="card-icon">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-label">{{ t('layout.home.dashboard.metrics.todayOutput') }}</div>
            <div class="card-value">
              {{ formatNumber(metrics.todayOutput)
              }}<span class="card-unit">{{ t('layout.home.dashboard.metrics.bottle') }}</span>
            </div>
            <div class="card-sub">{{ t('layout.home.overview.todayRate', { rate: metrics.todayRate }) }}</div>
          </div>
          <el-progress
            :percentage="Number(metrics.todayRate) || 0"
            :show-text="false"
            :stroke-width="4"
            color="#67c23a"
            class="card-progress"
          />
        </div>
      </el-col>

      <!-- 本班产能 -->
      <el-col :span="6">
        <div class="metric-card shift">
          <div class="card-icon">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-label">{{ t('layout.home.dashboard.metrics.shiftOutput') }}</div>
            <div class="card-value">
              {{ formatNumber(metrics.shiftOutput)
              }}<span class="card-unit">{{ t('layout.home.dashboard.metrics.bottle') }}</span>
            </div>
            <div class="card-sub">
              {{
                t('layout.home.overview.shiftTarget', {
                  shift: metrics.shiftName,
                  target: formatNumber(metrics.shiftTarget)
                })
              }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 第二行：24 小时产能趋势 + 实时报警 -->
    <el-row :gutter="16" class="bottom-row">
      <!-- 24 小时产能趋势 -->
      <el-col :span="16">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="header-title">
                <el-icon><TrendCharts /></el-icon>{{ t('layout.home.overview.trendTitle') }}
              </span>
              <el-tag size="small" type="success" class="live-tag">
                <span class="live-dot"></span>{{ t('layout.home.dashboard.realtime.live') }}
              </el-tag>
            </div>
          </template>
          <div class="chart-body">
            <div v-if="productionTrend.length > 0" class="bar-chart">
              <div v-for="(item, index) in productionTrend" :key="index" class="bar-item">
                <div class="bar-tooltip">
                  {{ t('layout.home.overview.trendTooltip', { hour: item.hour, value: formatNumber(item.value) }) }}
                </div>
                <div class="bar-wrapper">
                  <div
                    class="bar"
                    :style="{ height: (item.value / maxTrendValue) * 100 + '%' }"
                    :class="{ current: index === productionTrend.length - 1 }"
                  ></div>
                </div>
                <div class="bar-label">{{ item.hour }}</div>
              </div>
            </div>
            <div v-else class="chart-empty">{{ t('layout.home.overview.trendEmpty') }}</div>
            <div class="chart-summary">
              <span>{{ t('layout.home.overview.todayTotal', { value: formatNumber(metrics.todayOutput) }) }}</span>
              <span>{{ t('layout.home.overview.peak', { value: formatNumber(maxTrendValue) }) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 实时报警 -->
      <el-col :span="8">
        <el-card shadow="never" class="alarm-card">
          <template #header>
            <div class="card-header">
              <span class="header-title">
                <el-icon><Warning /></el-icon>{{ t('layout.home.overview.alarmTitle') }}
              </span>
              <el-tag v-if="activeAlarms.length > 0" size="small" type="danger">
                {{ t('layout.home.overview.alarmCount', { count: activeAlarms.length }) }}
              </el-tag>
              <el-tag v-else size="small" type="success">
                {{ t('layout.home.dashboard.realtime.statusNormal') }}
              </el-tag>
            </div>
          </template>
          <div class="alarm-body">
            <div class="alarm-list">
              <div v-for="(alarm, index) in activeAlarms" :key="index" class="alarm-item" :class="alarm.level">
                <el-icon class="alarm-icon">
                  <CircleCloseFilled v-if="alarm.level === 'danger'" />
                  <WarningFilled v-else-if="alarm.level === 'warning'" />
                  <InfoFilled v-else />
                </el-icon>
                <div class="alarm-info">
                  <div class="alarm-title">{{ alarm.title }}</div>
                  <div v-if="alarm.code" class="alarm-code">
                    {{ t('layout.home.overview.alarmCode', { code: alarm.code }) }}
                  </div>
                </div>
                <div class="alarm-time">{{ alarm.time }}</div>
              </div>
            </div>
            <div v-if="activeAlarms.length === 0" class="no-alarm">
              <el-icon class="no-alarm-icon"><CircleCheckFilled /></el-icon>
              <span>{{ t('layout.home.overview.noAlarm') }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
/**
 * 概况预览页面 - 精简版，只展示最核心的指标
 *
 * 功能定位：给客户 / 管理层快速查看设备运行核心指标
 * 展示内容：设备运行状态、运行速度、今日产能、本班产能、24 小时产能趋势、实时报警
 * 数据来源：Pinia device store（由 WebSocket / 接口同步），本页不内置任何虚构演示数据
 */
import { computed } from 'vue'
import {
  VideoPlay,
  VideoPause,
  Odometer,
  Calendar,
  Timer,
  TrendCharts,
  Warning,
  WarningFilled,
  InfoFilled,
  CircleCloseFilled,
  CircleCheckFilled
} from '@element-plus/icons-vue'
import { useDeviceStore } from '@/store/modules/device'
import { useI18n } from '@/composables/useI18n'

defineOptions({ name: 'HomeOverview' })

const { t } = useI18n()
const deviceStore = useDeviceStore()

type AlarmLevel = 'danger' | 'warning' | 'info'
interface AlarmVM {
  level: AlarmLevel
  title: string
  code: string
  time: string
}

// 设备运行状态：状态文案走国际化（运行 / 空闲 / 故障），不直接消费 store 内的中文 mock 文案
const deviceStatus = computed(() => {
  const status = deviceStore.status
  const statusKey =
    status === 'running'
      ? 'layout.home.dashboard.runtime.running'
      : status === 'fault'
        ? 'layout.home.dashboard.runtime.fault'
        : 'layout.home.dashboard.runtime.idle'
  return { status, text: t(statusKey) }
})

// 已运行时长（小时数 -> 国际化时长句式）
const durationText = computed(() => {
  const hours = Number(deviceStore.runtimeStats.running) || 0
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return t('layout.home.overview.durationFormat', { h, m })
})

// 产能指标
const metrics = computed(() => ({
  currentSpeed: deviceStore.params.speed,
  targetSpeed: deviceStore.paramsConfig.speed.max,
  todayOutput: deviceStore.production.todayOutput,
  todayRate: deviceStore.production.todayRate,
  shiftOutput: deviceStore.production.shiftOutput,
  shiftTarget: deviceStore.production.shiftTarget,
  shiftName: t(deviceStore.production.shiftName)
}))

// 24 小时产能趋势（直接消费 store 数据，无数据时展示空状态而非虚构柱条）
const productionTrend = computed(() => {
  const list = deviceStore.trendData.speed || []
  return list.map(item => ({
    hour: String(item.time).slice(0, 2),
    value: Number(item.value) || 0
  }))
})

// 实时报警（最多展示 5 条）
const activeAlarms = computed<AlarmVM[]>(() => {
  const list = deviceStore.alarms.current || []
  return list.slice(0, 5).map((raw): AlarmVM => {
    const a = raw as Record<string, unknown>
    const level = (['danger', 'warning', 'info'].includes(a.level as string) ? a.level : 'warning') as AlarmLevel
    return {
      level,
      title: String(a.message ?? a.title ?? ''),
      code: a.code != null ? String(a.code) : '',
      time: a.time != null ? String(a.time) : ''
    }
  })
})

// 趋势最大值（至少为 1，避免除零）
const maxTrendValue = computed(() => {
  return Math.max(...productionTrend.value.map(item => item.value), 1)
})

// 数字千分位格式化
function formatNumber(num: number | string): string {
  const n = Number(num) || 0
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<style scoped lang="less">
.overview-container {
  padding: 16px;
  background: #fff;
}

// ========== 通用卡片头部 ==========
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
    display: inline-flex;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    color: #303133;

    .el-icon {
      margin-right: 6px;
      color: #409eff;
    }
  }

  .live-tag {
    display: inline-flex;
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
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
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

  &.running {
    background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
  }
  &.idle {
    background: linear-gradient(135deg, #909399 0%, #606266 100%);
  }
  &.fault {
    background: linear-gradient(135deg, #f56c6c 0%, #c45656 100%);
  }

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
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
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
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
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
  &.speed::before {
    background: linear-gradient(180deg, #409eff 0%, #337ecc 100%);
  }
  &.today::before {
    background: linear-gradient(180deg, #67c23a 0%, #529b2e 100%);
  }
  &.shift::before {
    background: linear-gradient(180deg, #e6a23c 0%, #b88230 100%);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
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
    flex-shrink: 0;
  }
  &.speed .card-icon {
    background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  }
  &.today .card-icon {
    background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
  }
  &.shift .card-icon {
    background: linear-gradient(135deg, #e6a23c 0%, #b88230 100%);
  }

  .card-content {
    flex: 1;
    min-width: 0;
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
  .chart-card,
  .alarm-card {
    height: 300px;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
      border-color: #dcdfe6;
    }
    :deep(.el-card__header) {
      padding: 14px 16px;
      border-bottom: 1px solid #f0f2f5;
    }
    :deep(.el-card__body) {
      height: calc(100% - 57px);
      padding: 16px;
      overflow: visible !important;
      box-sizing: border-box !important;
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

  .chart-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c0c4cc;
    font-size: 13px;
  }

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
        pointer-events: none;
      }
      &:hover .bar-tooltip {
        opacity: 1;
      }
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
          &:hover {
            background: linear-gradient(180deg, #337ecc 0%, #409eff 100%);
          }
          &.current {
            background: linear-gradient(180deg, #67c23a 0%, #85ce61 100%);
          }
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
    b {
      color: #409eff;
      font-size: 15px;
    }
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
      &:hover {
        background: #ecf5ff;
      }
      &.danger {
        border-left: 4px solid #f56c6c;
        .alarm-icon {
          color: #f56c6c;
        }
      }
      &.warning {
        border-left: 4px solid #e6a23c;
        .alarm-icon {
          color: #e6a23c;
        }
      }
      &.info {
        border-left: 4px solid #409eff;
        .alarm-icon {
          color: #409eff;
        }
      }
      .alarm-icon {
        font-size: 20px;
        margin-right: 12px;
        flex-shrink: 0;
      }
      .alarm-info {
        flex: 1;
        min-width: 0;
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
        flex-shrink: 0;
        margin-left: 8px;
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
    .no-alarm-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>
