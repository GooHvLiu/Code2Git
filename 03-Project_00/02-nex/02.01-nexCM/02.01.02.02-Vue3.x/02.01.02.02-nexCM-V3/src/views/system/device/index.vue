<template>
  <div class="device-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ t('system.device.page.title') }}</h2>
        <p class="page-desc">{{ t('system.device.page.pageDesc') }}</p>
      </div>
      <div class="header-right">
        <el-button type="primary" :icon="Refresh" size="small" :loading="loading" @click="fetchData">
          {{ t('common.refresh') }}
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="8" :md="6">
        <div class="stat-card stat-online">
          <div class="stat-icon"><el-icon><Cpu /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ onlineCount }}</div>
            <div class="stat-label">{{ t('system.device.page.onlineDevices') }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6">
        <div class="stat-card stat-limit">
          <div class="stat-icon"><el-icon><Lock /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ maxDevices > 0 ? maxDevices : t('system.device.page.unlimited') }}</div>
            <div class="stat-label">{{ t('system.device.page.maxDevices') }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6">
        <div class="stat-card stat-users">
          <div class="stat-icon"><el-icon><User /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ onlineUsers }}</div>
            <div class="stat-label">{{ t('system.device.page.onlineUsers') }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6">
        <div class="stat-card stat-usage" :class="{ 'stat-warning': usagePercent >= 80 }">
          <div class="stat-icon"><el-icon><TrendCharts /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ usagePercent }}%</div>
            <div class="stat-label">{{ t('system.device.page.usageRate') }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-input
        v-model="searchKeyword"
        :placeholder="t('system.device.page.searchPlaceholder')"
        clearable
        class="search-input"
        @keyup.enter="fetchData"
        @clear="handleClear"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-select
        v-model="filterStatus"
        :placeholder="t('system.device.page.filterStatus')"
        clearable
        class="filter-select"
        @change="fetchData"
      >
        <el-option :label="t('system.device.page.statusOnline')" value="online" />
        <el-option :label="t('system.device.page.statusOffline')" value="offline" />
      </el-select>
      <el-button type="primary" :icon="Refresh" :loading="refreshStatusLoading" @click="handleRefreshStatus">
        {{ t('system.device.page.refreshStatus') }}
      </el-button>
    </div>

    <!-- 设备列表表格 -->
    <el-table v-loading="loading" :element-loading-text="t('common.loading')" :data="deviceList" border stripe class="device-table">
      <el-table-column type="index" :label="t('common.index')" width="60" align="center" />
      <el-table-column :label="t('system.device.page.deviceInfo')" min-width="200">
        <template #default="scope">
          <div class="device-info-cell">
            <div class="device-avatar"><el-icon><Monitor /></el-icon></div>
            <div class="device-details">
              <div class="device-name">{{ formatDeviceName(scope.row.device_name) }}</div>
              <div class="device-id">{{ scope.row.device_id }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('system.device.page.user')" width="150" align="center">
        <template #default="scope">
          <div class="user-cell">
            <div class="user-info">
              <div class="username">{{ scope.row.username || '-' }}</div>
              <div class="user-role">{{ scope.row.role || '-' }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ip" :label="t('system.device.page.ip')" width="140" align="center">
        <template #default="scope"><span class="ip-text">{{ scope.row.ip || '-' }}</span></template>
      </el-table-column>
      <el-table-column :label="t('system.device.page.loginTime')" width="170" align="center">
        <template #default="scope"><span class="time-text">{{ formatTime(scope.row.login_time) }}</span></template>
      </el-table-column>
      <el-table-column :label="t('system.device.page.lastActive')" width="170" align="center">
        <template #default="scope"><span class="time-text">{{ formatTime(scope.row.last_active_time) }}</span></template>
      </el-table-column>
      <el-table-column :label="t('common.status')" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'" size="small" effect="light">
            {{ scope.row.status === 1 ? t('system.device.page.statusOnline') : t('system.device.page.statusOffline') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.operation')" width="180" align="center">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 1 && !isCurrentDevice(scope.row as DeviceRow) && hasKickPermission"
            type="danger"
            size="small"
            :icon="Switch"
            @click="handleKickDevice(scope.row as DeviceRow)"
          >
            {{ t('system.device.kick') }}
          </el-button>
          <el-button
            v-else-if="scope.row.status === 0 && hasDeletePermission"
            type="danger"
            size="small"
            :icon="Delete"
            plain
            @click="handleDeleteDevice(scope.row as DeviceRow)"
          >
            {{ t('system.device.page.delete') }}
          </el-button>
          <span v-else-if="isCurrentDevice(scope.row as DeviceRow)" class="current-device-tag">{{ t('system.device.page.currentDevice') }}</span>
          <span v-else class="no-operation">-</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-section">
      <pagination
        v-model:page="pageNum"
        v-model:limit="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        @pagination="fetchData"
      />
    </div>

    <!-- 踢掉设备确认对话框 -->
    <el-dialog v-model="kickDialogVisible" :title="t('system.device.page.kickConfirmTitle')" width="450px" :close-on-click-modal="false" class="kick-dialog">
      <div class="kick-dialog-content">
        <div class="kick-warning-icon"><el-icon><WarningFilled /></el-icon></div>
        <div class="kick-warning-text">
          <p class="warning-title">{{ t('system.device.page.kickWarningTitle') }}</p>
          <p class="warning-desc">
            {{ t('system.device.page.kickWarningDesc', { deviceName: currentKickDevice?.device_name || t('system.device.page.unknownDevice') }) }}
          </p>
        </div>
      </div>
      <template #footer>
        <el-button @click="kickDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="danger" :loading="kickLoading" @click="confirmKickDevice">{{ t('system.device.kick') }}</el-button>
      </template>
    </el-dialog>

    <!-- 删除设备确认对话框 -->
    <el-dialog v-model="deleteDialogVisible" :title="t('system.device.page.deleteConfirmTitle')" width="420px" :close-on-click-modal="false" class="delete-dialog">
      <div class="delete-dialog-content">
        <div class="delete-warning-icon"><el-icon><WarningFilled /></el-icon></div>
        <div class="delete-warning-text">
          <p class="warning-title">{{ t('system.device.page.deleteWarningTitle') }}</p>
          <p class="warning-desc">
            {{ t('system.device.page.deleteWarningDesc', { deviceName: formatDeviceName(currentDeleteDevice?.device_name) || t('system.device.page.unknownDevice') }) }}
          </p>
        </div>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="danger" :loading="deleteLoading" @click="confirmDeleteDevice">{{ t('system.device.page.delete') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 在线设备管理页
 * 作者：GooHv
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Cpu, Lock, User, TrendCharts, Search, Refresh, Monitor, Switch, Delete, WarningFilled
} from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination/index.vue'
import request from '@/utils/request/request'
import { parseUserAgent } from '@/utils/request/websocket'
import { hasPermission } from '@/utils/auth/permission'
import { showSuccess, showError } from '@/utils/ui/feedback'

const { t } = useI18n()

interface DeviceRow {
  id: string | number
  device_id?: string
  device_name?: string
  username?: string
  role?: string
  ip?: string
  user_id?: string | number
  status?: number
  login_time?: string
  last_active_time?: string
  [key: string]: unknown
}

const loading = ref(false)
const deviceList = ref<DeviceRow[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(20)
const onlineCount = ref(0)
const maxDevices = ref(0)
const searchKeyword = ref('')
const filterStatus = ref('')
const kickDialogVisible = ref(false)
const kickLoading = ref(false)
const currentKickDevice = ref<DeviceRow | null>(null)
const deleteDialogVisible = ref(false)
const deleteLoading = ref(false)
const currentDeleteDevice = ref<DeviceRow | null>(null)
const currentDeviceId = ref(localStorage.getItem('nex_device_id') || '')
const refreshStatusLoading = ref(false)

const hasKickPermission = computed(() => hasPermission('system:device:kick'))
const hasDeletePermission = computed(() => hasPermission('system:device:delete'))

const onlineUsers = computed(() => {
  const userIds = new Set(deviceList.value.filter((d) => d.status === 1).map((d) => d.user_id))
  return userIds.size
})

const usagePercent = computed(() => {
  if (maxDevices.value <= 0) return 0
  return Math.min(100, Math.round((onlineCount.value / maxDevices.value) * 100))
})

function handleClear(): void {
  searchKeyword.value = ''
  fetchData()
}

async function handleRefreshStatus(): Promise<void> {
  refreshStatusLoading.value = true
  try {
    const res = await request({ url: '/user/device/refresh-status', method: 'post' })
    if (res.code === 200) {
      showSuccess(t('system.device.page.refreshStatusSuccess'))
      fetchData()
    } else {
      showError(t('system.device.page.refreshStatusFailed'))
    }
  } catch {
    showError(t('system.device.page.refreshStatusFailed'))
  } finally {
    refreshStatusLoading.value = false
  }
}

function formatDeviceName(deviceName?: string): string {
  if (!deviceName) return t('system.device.page.unknownDevice')
  if (deviceName.includes('·')) return deviceName
  return parseUserAgent(deviceName)
}

function isCurrentDevice(device: DeviceRow): boolean {
  return device.device_id === currentDeviceId.value
}

async function fetchData(): Promise<void> {
  loading.value = true
  try {
    const countRes = await request({ url: '/user/device/count', method: 'get' })
    onlineCount.value = (countRes.data as { count?: number })?.count || 0

    try {
      const licenseRes = await request({ url: '/license/status', method: 'get' })
      maxDevices.value = Number((licenseRes.data as { maxDevices?: number })?.maxDevices) || 0
    } catch {
      maxDevices.value = 0
    }

    const listRes = await request({
      url: '/user/device',
      method: 'get',
      params: { page: pageNum.value, pageSize: pageSize.value, keyword: searchKeyword.value, status: filterStatus.value }
    })
    deviceList.value = ((listRes.data as { list?: DeviceRow[] })?.list) || []
    total.value = (listRes.data as { total?: number })?.total || 0
  } catch (e) {
    showError((e as Error).message || t('system.device.page.fetchFailed'))
  } finally {
    loading.value = false
  }
}

function formatTime(time?: string): string {
  if (!time) return '-'
  const date = new Date(time)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

function handleKickDevice(device: DeviceRow): void {
  currentKickDevice.value = device
  kickDialogVisible.value = true
}

async function confirmKickDevice(): Promise<void> {
  if (!currentKickDevice.value) return
  kickLoading.value = true
  try {
    await request({ url: `/user/device/${currentKickDevice.value.id}/kick`, method: 'post' })
    showSuccess(t('system.device.page.kickSuccess'))
    kickDialogVisible.value = false
    fetchData()
  } catch (e) {
    showError((e as Error).message || t('system.device.page.kickFailed'))
  } finally {
    kickLoading.value = false
  }
}

function handleDeleteDevice(device: DeviceRow): void {
  currentDeleteDevice.value = device
  deleteDialogVisible.value = true
}

async function confirmDeleteDevice(): Promise<void> {
  if (!currentDeleteDevice.value) return
  deleteLoading.value = true
  try {
    await request({ url: `/user/device/${currentDeleteDevice.value.id}`, method: 'delete' })
    showSuccess(t('system.device.page.deleteSuccess'))
    deleteDialogVisible.value = false
    currentDeleteDevice.value = null
    fetchData()
  } catch {
    showError(t('system.device.page.deleteFailed'))
  } finally {
    deleteLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="less">
.device-management {
  padding: 0;
  background: #fff;
  min-height: calc(100vh - 84px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .header-left {
    .page-title { margin: 0; font-size: 20px; font-weight: 600; color: #303133; display: flex; align-items: center; }
    .page-desc { margin: 8px 0 0; font-size: 13px; color: #909399; }
  }
}

.stats-row {
  margin-bottom: 20px;

  .stat-card {
    display: flex;
    align-items: center;
    padding: 18px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid #ebeef5;

    &:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); }

    .stat-icon {
      width: 48px; height: 48px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; margin-right: 14px;
      i { color: #fff; }
    }
    .stat-info {
      .stat-value { font-size: 22px; font-weight: 600; color: #303133; line-height: 1.4; }
      .stat-label { font-size: 13px; color: #909399; margin-top: 6px; line-height: 1.4; }
    }
    &.stat-online .stat-icon { background: linear-gradient(135deg, #67c23a, #85ce61); }
    &.stat-limit .stat-icon { background: linear-gradient(135deg, #e6a23c, #ebb563); }
    &.stat-users .stat-icon { background: linear-gradient(135deg, #409eff, #66b1ff); }
    &.stat-usage .stat-icon { background: linear-gradient(135deg, #f56c6c, #f78989); }
    &.stat-warning {
      background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
      border: 1px solid #fbc4c4;
      box-shadow: 0 4px 16px rgba(245, 108, 108, 0.15);
      animation: warningPulse 2s ease-in-out infinite;
      .stat-icon { background: linear-gradient(135deg, #f56c6c, #e74c3c); box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4); }
      .stat-value { color: #e74c3c; font-weight: 700; }
      .stat-label { color: #f56c6c; }
    }
  }
}

@keyframes warningPulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(245, 108, 108, 0.15); }
  50% { box-shadow: 0 4px 24px rgba(245, 108, 108, 0.35); }
}

.filter-section {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .search-input { flex: 1; max-width: 300px; }
  .filter-select { width: 150px; }
}

.device-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .device-info-cell { display: flex; align-items: center; gap: 12px; }
  .device-avatar {
    width: 40px; height: 40px; border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    i { font-size: 20px; color: #fff; }
  }
  .device-details { flex: 1; min-width: 0; }
  .device-name { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .device-id { font-size: 12px; color: #909399; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .user-cell { display: flex; align-items: center; gap: 10px; }
  .user-info { flex: 1; min-width: 0; }
  .username { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 2px; }
  .user-role { font-size: 12px; color: #909399; }
  .ip-text { font-size: 13px; color: #606266; font-family: 'Courier New', monospace; }
  .time-text { font-size: 13px; color: #606266; }
  .no-operation { color: #c0c4cc; font-size: 13px; }
  .current-device-tag {
    display: inline-block; padding: 4px 10px;
    background: #ecf5ff; color: #409eff; border-radius: 4px;
    font-size: 12px; border: 1px solid #d9ecff;
  }
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}
</style>

