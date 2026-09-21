<template>
  <div class="alarm-log-page">
    <el-tabs v-model="activeTab" class="alarm-tabs">
      <!-- 统计看板 -->
      <el-tab-pane :label="t('device.alarm.dashboard.title')" name="dashboard">
        <div class="dashboard-content">
          <!-- 顶部统计卡片 -->
          <el-row :gutter="12" class="stats-cards">
            <el-col v-for="(stat, index) in alarmStats" :key="index" :span="6">
              <div class="stat-card" :class="stat.type">
                <div class="stat-icon"><el-icon><component :is="stat.icon" /></el-icon></div>
                <div class="stat-info">
                  <div class="stat-label">{{ stat.label }}</div>
                  <div class="stat-value">
                    {{ stat.value }}<span class="stat-unit">{{ t('device.alarm.unitTimes') }}</span>
                  </div>
                  <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
                    <el-icon v-if="stat.trend > 0"><Top /></el-icon>
                    <el-icon v-else><Bottom /></el-icon>
                    {{ Math.abs(stat.trend) }}% {{ t('device.alarm.vsYesterday') }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

          <!-- 图表区域 -->
          <el-row :gutter="12" class="charts-row">
            <el-col :span="8">
              <div class="chart-panel">
                <div class="panel-header">
                  <span class="panel-title"><el-icon><PieChart /></el-icon>{{ t('device.alarm.categoryDist') }}</span>
                </div>
                <div class="panel-body">
                  <div class="category-chart">
                    <div class="donut-wrapper">
                      <svg viewBox="0 0 100 100" class="donut-svg">
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#f0f2f5" stroke-width="12" />
                        <circle
                          v-for="(item, index) in categoryData"
                          :key="index"
                          cx="50" cy="50" r="35" fill="none"
                          :stroke="item.color" stroke-width="12"
                          :stroke-dasharray="(item.percent / 100) * 219.9 + ' 219.9'"
                          :stroke-dashoffset="getCategoryOffset(index)"
                          transform="rotate(-90 50 50)" stroke-linecap="round"
                        />
                      </svg>
                      <div class="donut-center">
                        <div class="donut-value">{{ totalAlarms }}</div>
                        <div class="donut-label">{{ t('device.alarm.totalAlarms') }}</div>
                      </div>
                    </div>
                    <div class="category-legend">
                      <div v-for="(item, index) in categoryData" :key="index" class="legend-item">
                        <span class="legend-dot" :style="{ background: item.color }"></span>
                        <span class="legend-name">{{ item.name }}</span>
                        <span class="legend-count">{{ item.count }}{{ t('device.alarm.unitTimes') }}</span>
                        <span class="legend-percent">{{ item.percent }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>

            <el-col :span="10">
              <div class="chart-panel">
                <div class="panel-header">
                  <span class="panel-title"><el-icon><TrendCharts /></el-icon>{{ t('device.alarm.trend7d') }}</span>
                </div>
                <div class="panel-body">
                  <div class="trend-chart">
                    <svg viewBox="0 0 500 180" preserveAspectRatio="none" class="chart-svg">
                      <defs>
                        <linearGradient id="alarmTrendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style="stop-color: #f56c6c; stop-opacity: 0.3" />
                          <stop offset="100%" style="stop-color: #f56c6c; stop-opacity: 0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="45" x2="500" y2="45" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4" />
                      <line x1="0" y1="135" x2="500" y2="135" stroke="#f0f2f5" stroke-width="1" stroke-dasharray="4,4" />
                      <path :d="trendAreaPath" fill="url(#alarmTrendGrad)" />
                      <path :d="trendLinePath" fill="none" stroke="#f56c6c" stroke-width="2" />
                      <circle
                        v-for="(point, index) in trendPoints" :key="index"
                        :cx="point.x" :cy="point.y" r="4" fill="#fff" stroke="#f56c6c" stroke-width="2"
                      />
                    </svg>
                    <div class="chart-labels">
                      <span v-for="(label, index) in trendLabels" :key="index">{{ label }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="chart-panel">
                <div class="panel-header">
                  <span class="panel-title"><el-icon><DataAnalysis /></el-icon>{{ t('device.alarm.levelDist') }}</span>
                </div>
                <div class="panel-body">
                  <div class="level-list">
                    <div v-for="(item, index) in levelData" :key="index" class="level-item">
                      <div class="level-header">
                        <span class="level-tag" :class="item.type">{{ item.name }}</span>
                        <span class="level-count">{{ item.count }}{{ t('device.alarm.unitTimes') }}</span>
                      </div>
                      <div class="level-bar">
                        <div class="level-fill" :style="{ width: item.percent + '%' }" :class="item.type"></div>
                      </div>
                      <div class="level-percent">{{ item.percent }}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

          <!-- TOP5 -->
          <el-row :gutter="12" class="top-row">
            <el-col :span="24">
              <div class="chart-panel">
                <div class="panel-header">
                  <span class="panel-title"><el-icon><Rank /></el-icon>{{ t('device.alarm.top5Title') }}</span>
                  <span class="panel-subtitle">{{ t('device.alarm.top5Subtitle') }}</span>
                </div>
                <div class="panel-body">
                  <div class="top-list">
                    <div v-for="(item, index) in topAlarms" :key="index" class="top-item">
                      <div class="top-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
                      <div class="top-info">
                        <div class="top-name">{{ item.name }}</div>
                        <div class="top-desc">{{ item.desc }}</div>
                      </div>
                      <div class="top-bar">
                        <div class="top-fill" :style="{ width: (item.count / topAlarms[0].count) * 100 + '%' }"></div>
                      </div>
                      <div class="top-count">{{ item.count }}{{ t('device.alarm.unitTimes') }}</div>
                      <div class="top-trend" :class="item.trend > 0 ? 'up' : 'down'">
                        <el-icon v-if="item.trend > 0"><Top /></el-icon>
                        <el-icon v-else><Bottom /></el-icon>
                        {{ Math.abs(item.trend) }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- 详细记录 -->
      <el-tab-pane :label="t('device.alarm.list.title')" name="list">
        <div class="list-content">
          <div class="search-section">
            <el-form :inline="true" :model="searchForm" class="search-form">
              <el-form-item :label="t('device.alarm.colLevel')">
                <el-select v-model="searchForm.level" :placeholder="t('device.alarm.all')" clearable size="small" style="width: 120px">
                  <el-option :label="t('device.alarm.levelCritical')" value="critical" />
                  <el-option :label="t('device.alarm.levelMajor')" value="major" />
                  <el-option :label="t('device.alarm.levelMinor')" value="minor" />
                  <el-option :label="t('device.alarm.levelInfo')" value="info" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('device.alarm.colCategory')">
                <el-select v-model="searchForm.category" :placeholder="t('device.alarm.all')" clearable size="small" style="width: 140px">
                  <el-option :label="t('device.alarm.categoryPosition')" value="position" />
                  <el-option :label="t('device.alarm.categoryVacuum')" value="vacuum" />
                  <el-option :label="t('device.alarm.categoryServo')" value="servo" />
                  <el-option :label="t('device.alarm.categoryTimeout')" value="timeout" />
                  <el-option :label="t('device.alarm.categoryTemperature')" value="temperature" />
                  <el-option :label="t('device.alarm.categoryPressure')" value="pressure" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('device.alarm.colStatus')">
                <el-select v-model="searchForm.status" :placeholder="t('device.alarm.all')" clearable size="small" style="width: 120px">
                  <el-option :label="t('device.alarm.statusPending')" value="pending" />
                  <el-option :label="t('device.alarm.statusProcessing')" value="processing" />
                  <el-option :label="t('device.alarm.statusResolved')" value="resolved" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('device.alarm.keyword')">
                <el-input v-model="searchForm.keyword" :placeholder="t('device.alarm.keywordPlaceholder')" clearable size="small" style="width: 180px" />
              </el-form-item>
              <el-form-item>
                <el-button v-permission="'device:alarm:search'" type="primary" :icon="Search" size="small" @click="handleSearch">{{ t('device.alarm.search') }}</el-button>
                <el-button v-permission="'device:alarm:reset'" :icon="Refresh" size="small" @click="handleReset">{{ t('device.alarm.reset') }}</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="toolbar-section">
            <div class="toolbar-left">
              <span class="total-text">{{ t('device.alarm.totalPrefix') }} <b>{{ total }}</b> {{ t('device.alarm.totalSuffix') }}</span>
              <el-tag v-if="selectedRows.length > 0" type="info" size="small" style="margin-left: 10px">
                {{ t('device.alarm.selected', { count: selectedRows.length }) }}
              </el-tag>
            </div>
            <div class="toolbar-right">
              <el-button v-permission="'device:alarm:export'" type="primary" :icon="Download" size="small" @click="handleExport">{{ t('device.alarm.export') }}</el-button>
              <el-button v-permission="'device:alarm:refresh'" :icon="Refresh" size="small" @click="handleRefresh">{{ t('device.alarm.refresh') }}</el-button>
            </div>
          </div>

          <div class="table-section">
            <el-table :data="pagedData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column type="index" :label="t('device.alarm.colIndex')" width="60" align="center" />
              <el-table-column prop="alarmNo" :label="t('device.alarm.colAlarmNo')" width="140" align="center" />
              <el-table-column prop="alarmTime" :label="t('device.alarm.colAlarmTime')" width="160" align="center" />
              <el-table-column :label="t('device.alarm.colLevel')" width="90" align="center">
                <template #default="{ row }">
                  <el-tag :type="getLevelType(row.level)" size="small" effect="plain">{{ getLevelText(row.level) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="t('device.alarm.colCategory')" width="100" align="center">
                <template #default="{ row }">{{ getCategoryText(row.category) }}</template>
              </el-table-column>
              <el-table-column prop="alarmCode" :label="t('device.alarm.colAlarmCode')" width="100" align="center" />
              <el-table-column prop="description" :label="t('device.alarm.colDescription')" min-width="200" show-overflow-tooltip />
              <el-table-column prop="deviceCode" :label="t('device.alarm.colDeviceCode')" width="140" align="center" />
              <el-table-column :label="t('device.alarm.colStatus')" width="90" align="center">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="handler" :label="t('device.alarm.colHandler')" width="90" align="center" />
              <el-table-column prop="resolveTime" :label="t('device.alarm.colResolveTime')" width="160" align="center" />
              <el-table-column :label="t('device.alarm.colAction')" width="100" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button v-permission="'device:alarm:detail'" type="primary" link size="small" @click="handleDetail(row as AlarmRow)">{{ t('device.alarm.detail') }}</el-button>
                  <el-button v-if="row.status !== 'resolved'" v-permission="'device:alarm:handle'" type="primary" link size="small" @click="handleResolve(row as AlarmRow)">{{ t('device.alarm.handle') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pagination-section">
            <el-pagination
              background layout="total, sizes, prev, pager, next, jumper"
              :total="total" :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize" :current-page="currentPage"
              @size-change="handleSizeChange" @current-change="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
/**
 * 报警统计页：统计看板（类别/趋势/级别/TOP5）+ 详细记录（筛选/搜索/导出）
 * 数据：useDevAlarm；导出走 xlsx 前端导出。
 * 作者：GooHv
 */
import { ref, reactive, computed } from 'vue'
import * as XLSX from 'xlsx'
import {
  Top, Bottom, PieChart, TrendCharts, DataAnalysis, Rank,
  Search, Refresh, Download
} from '@element-plus/icons-vue'
import { useI18n } from '@/composables/useI18n'
import { $msg } from '@/utils/ui/feedback'
import { useDevAlarm } from '@/composables/useDevAlarm'
import type { AlarmCategory, AlarmLevel, AlarmStatus } from '@/types/device'

const { t } = useI18n()
const {
  alarmStats, categoryData, levelData, trendData, trendLabels,
  topAlarms, tableData, totalAlarms,
  getCategoryOffset, getLevelType, getLevelText, getCategoryText, getStatusType, getStatusText
} = useDevAlarm()

const activeTab = ref('dashboard')

const searchForm = reactive<{ level: AlarmLevel | ''; category: AlarmCategory | ''; status: AlarmStatus | ''; dateRange: string[]; keyword: string }>({
  level: '', category: '', status: '', dateRange: [], keyword: ''
})

const currentPage = ref(1)
const pageSize = ref(20)
const selectedRows = ref<Array<Record<string, unknown>>>([])

const total = computed(() => tableData.value.length)
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return tableData.value.slice(start, start + pageSize.value)
})

/** 趋势 SVG 点 / 路径 */
const trendPoints = computed(() => {
  const maxVal = Math.max(...trendData.value, 1)
  return trendData.value.map((val, index) => ({
    x: (index / (trendData.value.length - 1)) * 500,
    y: 170 - (val / maxVal) * 140
  }))
})
const trendLinePath = computed(() => trendPoints.value.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' '))
const trendAreaPath = computed(() => `${trendLinePath.value} L500,180 L0,180 Z`)

function handleSearch() {
  $msg.info(t('device.alarm.searchTodo'))
}
function handleReset() {
  Object.assign(searchForm, { level: '', category: '', status: '', dateRange: [], keyword: '' })
  currentPage.value = 1
}
function handleRefresh() {
  $msg.success(t('device.alarm.refreshSuccess'))
}
function handleSelectionChange(selection: Array<Record<string, unknown>>) {
  selectedRows.value = selection
}
function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}
function handlePageChange(page: number) {
  currentPage.value = page
}
type AlarmRow = { alarmNo: string }

function handleDetail(row: AlarmRow) {
  $msg.info(t('device.alarm.detailTodo', { no: row.alarmNo }))
}
function handleResolve(row: AlarmRow) {
  $msg.info(t('device.alarm.handleTodo', { no: row.alarmNo }))
}

/** 导出当前列表为 xlsx */
function handleExport() {
  const rows = (selectedRows.value.length > 0 ? selectedRows.value : tableData.value).map((r) => ({
    [t('device.alarm.colAlarmNo')]: r.alarmNo,
    [t('device.alarm.colAlarmTime')]: r.alarmTime,
    [t('device.alarm.colLevel')]: r.levelText,
    [t('device.alarm.colCategory')]: r.categoryText,
    [t('device.alarm.colAlarmCode')]: r.alarmCode,
    [t('device.alarm.colDescription')]: r.description,
    [t('device.alarm.colDeviceCode')]: r.deviceCode,
    [t('device.alarm.colStatus')]: r.statusText,
    [t('device.alarm.colHandler')]: r.handler,
    [t('device.alarm.colResolveTime')]: r.resolveTime
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'alarms')
  XLSX.writeFile(wb, 'alarms.xlsx')
}
</script>

<style scoped lang="less">
.alarm-log-page {
  padding: 12px;
  background: #fff;
  min-height: calc(100vh - 84px);
}
.alarm-tabs :deep(.el-tabs__header) {
  margin-bottom: 12px;
}
.dashboard-content {
  .stats-cards { margin-bottom: 12px; }
  .charts-row { margin-bottom: 12px; }
}
.stat-card {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  &:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
  .stat-icon {
    width: 48px; height: 48px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-right: 14px; flex-shrink: 0;
    &.danger, &.critical { background: #fef0f0; color: #f56c6c; }
    &.warning { background: #fdf6ec; color: #e6a23c; }
    &.info { background: #ecf5ff; color: #409eff; }
  }
  .stat-info {
    flex: 1;
    .stat-label { font-size: 12px; color: #909399; margin-bottom: 4px; }
    .stat-value {
      font-size: 24px; font-weight: 700; font-family: 'Courier New', monospace;
      .stat-unit { font-size: 12px; color: #909399; font-weight: normal; margin-left: 4px; }
    }
    .stat-trend {
      font-size: 11px; margin-top: 2px; display: inline-flex; align-items: center; gap: 2px;
      &.up { color: #f56c6c; }
      &.down { color: #67c23a; }
    }
  }
}
.chart-panel {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .panel-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px; border-bottom: 1px solid #f0f2f5;
    .panel-title { font-size: 14px; font-weight: 600; color: #303133; display: inline-flex; align-items: center; gap: 6px; }
    .panel-subtitle { font-size: 11px; color: #909399; }
  }
  .panel-body { flex: 1; padding: 16px; overflow: hidden; }
}
.category-chart {
  height: 100%; display: flex; flex-direction: column;
  .donut-wrapper {
    position: relative; width: 130px; height: 130px; margin: 0 auto 12px;
    .donut-svg { width: 100%; height: 100%; }
    .donut-center {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;
      .donut-value { font-size: 24px; font-weight: 700; color: #303133; font-family: 'Courier New', monospace; }
      .donut-label { font-size: 11px; color: #909399; }
    }
  }
  .category-legend { flex: 1; .legend-item { display: flex; align-items: center; padding: 4px 0; font-size: 11px; .legend-dot { width: 8px; height: 8px; border-radius: 2px; margin-right: 6px; } .legend-name { flex: 1; color: #606266; } .legend-count { color: #303133; font-weight: 600; margin-right: 8px; } .legend-percent { color: #909399; width: 35px; text-align: right; } } }
}
.trend-chart {
  height: 100%; display: flex; flex-direction: column;
  .chart-svg { flex: 1; width: 100%; }
  .chart-labels { display: flex; justify-content: space-between; font-size: 10px; color: #c0c4cc; padding-top: 4px; }
}
.level-list {
  height: 100%; display: flex; flex-direction: column; justify-content: space-around;
  .level-item {
    .level-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;
      .level-tag { font-size: 11px; padding: 2px 8px; border-radius: 4px;
        &.critical { background: #fef0f0; color: #f56c6c; }
        &.major { background: #fdf6ec; color: #e6a23c; }
        &.minor { background: #ecf5ff; color: #409eff; }
        &.info { background: #f0f9eb; color: #67c23a; }
      }
      .level-count { font-size: 12px; font-weight: 600; color: #303133; }
    }
    .level-bar { height: 6px; background: #fff; border-radius: 3px; overflow: hidden; margin-bottom: 2px;
      .level-fill { height: 100%; border-radius: 3px;
        &.critical { background: #f56c6c; }
        &.major { background: #e6a23c; }
        &.minor { background: #409eff; }
        &.info { background: #67c23a; }
      }
    }
    .level-percent { font-size: 10px; color: #909399; text-align: right; }
  }
}
.top-list {
  .top-item {
    display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #f5f7fa;
    &:last-child { border-bottom: none; }
    .top-rank {
      width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: #fff; margin-right: 14px; flex-shrink: 0;
      &.rank-1 { background: linear-gradient(135deg, #f56c6c, #e64242); }
      &.rank-2 { background: linear-gradient(135deg, #e6a23c, #d48806); }
      &.rank-3 { background: linear-gradient(135deg, #409eff, #2b7fd4); }
      &.rank-4, &.rank-5 { background: #909399; }
    }
    .top-info { width: 200px; margin-right: 14px; .top-name { font-size: 13px; font-weight: 600; color: #303133; margin-bottom: 2px; } .top-desc { font-size: 11px; color: #909399; } }
    .top-bar { flex: 1; height: 8px; background: #fff; border-radius: 4px; overflow: hidden; margin-right: 14px; .top-fill { height: 100%; background: linear-gradient(90deg, #409eff, #667eea); border-radius: 4px; } }
    .top-count { width: 60px; text-align: right; font-size: 16px; font-weight: 700; color: #303133; font-family: 'Courier New', monospace; margin-right: 14px; }
    .top-trend { width: 50px; text-align: right; font-size: 12px; &.up { color: #f56c6c; } &.down { color: #67c23a; } }
  }
}
.list-content {
  .search-section { background: #fff; border: 1px solid #e4e7ed; border-radius: 8px; padding: 10px; margin-bottom: 12px; }
  .toolbar-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
    .total-text { font-size: 13px; color: #606266; b { color: #409eff; font-size: 15px; } }
    .toolbar-right { display: flex; gap: 8px; align-items: center; }
  }
  .table-section { background: #fff; border: 1px solid #e4e7ed; border-radius: 8px; margin-bottom: 12px; overflow: hidden; }
  .pagination-section { display: flex; justify-content: flex-end; }
}
</style>
