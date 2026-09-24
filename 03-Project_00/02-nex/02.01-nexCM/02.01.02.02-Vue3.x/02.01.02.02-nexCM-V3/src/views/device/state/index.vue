<template>
  <div class="device-state-page">
    <!-- 设备信息头部 -->
    <div class="device-header">
      <div class="device-basic">
        <div class="device-icon">
          <el-icon><Cpu /></el-icon>
        </div>
        <div class="device-meta">
          <div class="device-name">{{ deviceInfo.name }}</div>
          <div class="device-sub">
            <span class="meta-item"
              ><el-icon><CollectionTag /></el-icon>{{ deviceInfo.code }}</span
            >
            <span class="meta-item"
              ><el-icon><Location /></el-icon>{{ deviceInfo.location }}</span
            >
            <span class="meta-item"
              ><el-icon><Calendar /></el-icon>{{ t('device.state.installDate') }}: {{ deviceInfo.installDate }}</span
            >
          </div>
        </div>
      </div>
      <div class="device-status">
        <span class="status-dot" :class="deviceStatusObj.status"></span>
        <span class="status-text">{{ deviceStatusObj.text }}</span>
        <span class="status-duration">{{ deviceStatusObj.duration }}</span>
      </div>
    </div>

    <!-- 关键指标卡片 -->
    <el-row :gutter="12" class="metric-row">
      <el-col v-for="metric in coreMetrics" :key="metric.label" :span="6">
        <div class="metric-card">
          <div class="metric-label">{{ metric.label }}</div>
          <div class="metric-value">
            {{ metric.value }}<span class="metric-unit">{{ metric.unit }}</span>
          </div>
          <div class="metric-trend" :class="metric.trendUp ? 'up' : 'down'">
            <el-icon v-if="metric.trendUp"><Top /></el-icon>
            <el-icon v-else><Bottom /></el-icon>
            {{ Math.abs(metric.trend) }}% {{ t('device.state.vsYesterday') }}
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="content-row">
      <!-- 实时运行参数 -->
      <el-col :span="14">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title"
              ><el-icon><DataLine /></el-icon>{{ t('device.state.realtimeParams') }}</span
            >
          </div>
          <div class="panel-body">
            <el-table :data="realtimeParamsList" border stripe size="small">
              <el-table-column prop="name" :label="t('device.state.colParam')" />
              <el-table-column prop="value" :label="t('device.state.colValue')" align="right">
                <template #default="{ row }">
                  {{ Number(row.value).toFixed(row.decimal) }}
                </template>
              </el-table-column>
              <el-table-column prop="unit" :label="t('device.state.colUnit')" width="80" align="center" />
              <el-table-column :label="t('device.state.colRange')" align="center">
                <template #default="{ row }"> {{ row.min }} ~ {{ row.max }} </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>

      <!-- 今日运行统计 -->
      <el-col :span="10">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title"
              ><el-icon><DataBoard /></el-icon>{{ t('device.state.todayStats') }}</span
            >
          </div>
          <div class="panel-body">
            <div class="stat-list">
              <div v-for="stat in todayStats" :key="stat.label" class="stat-item">
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-value">
                  {{ stat.value }}<span class="stat-unit">{{ stat.unit }}</span>
                </div>
                <div class="stat-sub">{{ stat.sub }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
/**
 * 设备状态总览页
 * 数据来源：useDevDashboard（派生自 Pinia device store）
 * 作者：GooHv
 */
import { Cpu, CollectionTag, Location, Calendar, Top, Bottom, DataLine, DataBoard } from '@element-plus/icons-vue'
import { useI18n } from '@/composables/useI18n'
import { useDevDashboard } from '@/composables/useDevDashboard'

const { t } = useI18n()
const { deviceInfo, deviceStatusObj, coreMetrics, realtimeParamsList, todayStats } = useDevDashboard()
</script>

<style scoped lang="less">
.device-state-page {
  padding: 16px;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.device-basic {
  display: flex;
  align-items: center;
}

.device-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #ecf5ff;
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 14px;
}

.device-name {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
}

.device-sub {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #67c23a;
}
.status-dot.idle {
  background: #e6a23c;
}
.status-dot.fault {
  background: #f56c6c;
}
.status-dot.offline {
  background: #909399;
}

.status-text {
  font-weight: 600;
  color: #303133;
}

.status-duration {
  font-size: 12px;
  color: #909399;
}

.metric-row {
  margin-bottom: 16px;
}

.metric-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.metric-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  font-family: 'Courier New', monospace;
}

.metric-unit {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
  margin-left: 4px;
}

.metric-trend {
  font-size: 11px;
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.metric-trend.up {
  color: #f56c6c;
}
.metric-trend.down {
  color: #67c23a;
}

.content-row {
  margin-bottom: 16px;
}

.panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 100%;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 6px;
}

.panel-body {
  padding: 16px;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stat-item {
  padding-bottom: 12px;
  border-bottom: 1px dashed #f0f2f5;
}
.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  font-family: 'Courier New', monospace;
}

.stat-unit {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
  margin-left: 4px;
}

.stat-sub {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}
</style>
