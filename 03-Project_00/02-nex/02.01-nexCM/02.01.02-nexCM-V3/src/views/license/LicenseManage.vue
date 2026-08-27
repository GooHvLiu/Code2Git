<template>
  <div class="license-manage">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <i class="el-icon-lock"></i>
        </div>
        <div class="header-text">
          <div class="page-title">{{ $t('license.manageTitle') }}</div>
          <div class="page-subtitle">{{ $t('license.brandDesc') }}</div>
        </div>
      </div>
      <div class="header-right">
        <el-button size="small" icon="el-icon-refresh" @click="loadData" :loading="loading">{{ $t('license.refresh') }}</el-button>
        <el-button size="small" type="primary" icon="el-icon-upload2" @click="showImportDialog = true">{{ $t('license.importLicense') }}</el-button>
        <el-button v-if="isAdmin" size="small" icon="el-icon-download" @click="handleDownload">{{ $t('license.download') }}</el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <!-- 左侧：授权状态概览 -->
      <el-col :span="8">
        <el-card class="status-card" shadow="hover" :body-style="{ padding: '0' }">
          <div class="status-banner" :class="{ valid: licenseData.valid, invalid: !licenseData.valid }">
            <div class="status-icon-wrap">
              <i :class="licenseData.valid ? 'el-icon-circle-check' : 'el-icon-warning-outline'"></i>
            </div>
            <div class="status-info">
              <div class="status-label">{{ licenseData.valid ? $t('license.statusValid') : $t('license.statusInvalid') }}</div>
              <div class="status-sub" v-if="licenseData.valid">
                <el-tag size="mini" :type="licenseTypeTag(licenseData.licenseType)" effect="dark">{{ licenseTypeLabel(licenseData.licenseType) }}</el-tag>
              </div>
              <div class="status-sub error" v-else>{{ licenseData.reason || $t('license.unknownReason') }}</div>
            </div>
          </div>

          <div class="status-body">
            <!-- 过期倒计时 -->
            <div class="countdown-box" v-if="licenseData.valid && licenseData.expiresAt">
              <div class="countdown-label">{{ $t('license.timeRemaining') }}</div>
              <div class="countdown-value">{{ countdownText }}</div>
              <div class="countdown-date">{{ $t('license.expireAt') }}：{{ formatDate(licenseData.expiresAt) }}</div>
            </div>

            <div class="countdown-box expired" v-else-if="!licenseData.valid">
              <div class="countdown-label">{{ $t('license.licenseStatus') }}</div>
              <div class="countdown-value">{{ $t('license.expired') }}</div>
              <div class="countdown-date">{{ $t('license.importNewLicense') }}</div>
            </div>

            <!-- 快捷信息 -->
            <div class="quick-list">
              <div class="quick-item">
                <i class="el-icon-suitcase"></i>
                <div class="quick-text">
                  <span class="quick-label">{{ $t('license.projectName') }}</span>
                  <span class="quick-value">{{ licenseData.projectName || '-' }}</span>
                </div>
              </div>
              <div class="quick-item">
                <i class="el-icon-user"></i>
                <div class="quick-text">
                  <span class="quick-label">{{ $t('license.customerName') }}</span>
                  <span class="quick-value">{{ licenseData.customer?.name || '-' }}</span>
                </div>
              </div>
              <div class="quick-item">
                <i class="el-icon-user-solid"></i>
                <div class="quick-text">
                  <span class="quick-label">{{ $t('license.maxUsers') }}</span>
                  <span class="quick-value">{{ licenseData.maxUsers || $t('license.unlimited') }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：详细信息 -->
      <el-col :span="16">
        <!-- 授权详细信息 -->
        <el-card class="detail-card" shadow="hover">
          <div slot="header" class="card-header">
            <div class="header-icon-sm blue"><i class="el-icon-document"></i></div>
            <span>{{ $t('license.detailTitle') }}</span>
          </div>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item :label="$t('license.licenseId')"><span class="mono">{{ licenseData.licenseId || '-' }}</span></el-descriptions-item>
            <el-descriptions-item :label="$t('license.projectId')"><span class="mono">{{ licenseData.projectId || '-' }}</span></el-descriptions-item>
            <el-descriptions-item :label="$t('license.projectName')">{{ licenseData.projectName || '-' }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.licenseType')">
              <el-tag size="small" :type="licenseTypeTag(licenseData.licenseType)">{{ licenseTypeLabel(licenseData.licenseType) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('license.issuedAt')">{{ formatTime(licenseData.issuedAt) }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.expireTime')">{{ formatTime(licenseData.expiresAt) }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.customerName')">{{ licenseData.customer?.name || '-' }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.contact')">{{ licenseData.customer?.contact || '-' }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.phone')">{{ licenseData.customer?.phone || '-' }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.email')">{{ licenseData.customer?.email || '-' }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.features')" :span="2">
              <el-tag v-for="f in (licenseData.features || [])" :key="f" size="mini" effect="plain" style="margin-right: 4px; margin-bottom: 4px;">{{ f }}</el-tag>
              <span v-if="!licenseData.features || licenseData.features.length === 0" class="text-muted">全部功能</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-row :gutter="20">
          <!-- 机器绑定信息 -->
          <el-col :span="12">
            <el-card class="detail-card" shadow="hover">
              <div slot="header" class="card-header">
                <div class="header-icon-sm purple"><i class="el-icon-monitor"></i></div>
                <span>机器绑定</span>
                <el-tag v-if="licenseData.machineBound" size="mini" type="warning" style="margin-left: auto;">已绑定</el-tag>
                <el-tag v-else size="mini" type="success" style="margin-left: auto;">未绑定</el-tag>
              </div>
              <div class="machine-info">
                <div class="machine-row">
                  <span class="machine-label">当前机器ID</span>
                  <div class="machine-value-wrap">
                    <span class="machine-id">{{ licenseData.machineId || '-' }}</span>
                    <el-button v-if="licenseData.machineId" type="text" size="mini" icon="el-icon-document-copy" @click="copyMachineId"></el-button>
                  </div>
                </div>
                <div class="machine-row">
                  <span class="machine-label">绑定机器ID</span>
                  <span class="machine-id">{{ licenseData.boundMachineId || '未绑定（任意机器可用）' }}</span>
                </div>
                <div class="machine-row">
                  <span class="machine-label">{{ $t('license.matchStatus') }}</span>
                  <el-tag :type="licenseData.machineMatched ? 'success' : 'danger'" size="small">
                    <i :class="licenseData.machineMatched ? 'el-icon-circle-check' : 'el-icon-circle-close'" style="margin-right: 4px;"></i>
                    {{ licenseData.machineMatched ? $t('license.matched') : $t('license.notMatched') }}
                  </el-tag>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 时间防护状态 -->
          <el-col :span="12">
            <el-card class="detail-card" shadow="hover">
              <div slot="header" class="card-header">
                <div class="header-icon-sm orange"><i class="el-icon-time"></i></div>
                <span>{{ $t('license.timeGuard') }}</span>
                <el-button type="primary" size="mini" icon="el-icon-refresh" style="margin-left: auto;" @click="handleSyncTime" :loading="syncing">{{ $t('license.syncTime') }}</el-button>
              </div>
              <div class="time-info">
                <div class="time-row">
                  <span class="time-label">{{ $t('license.timeGuardStatus') }}</span>
                  <el-tag :type="licenseData.timeGuard?.exists ? 'success' : 'info'" size="small">
                    {{ licenseData.timeGuard?.exists ? $t('license.enabled') : $t('license.notInitialized') }}
                  </el-tag>
                </div>
                <div class="time-row">
                  <span class="time-label">{{ $t('license.lastVerified') }}</span>
                  <span class="time-value">{{ formatTime(licenseData.timeGuard?.lastVerifiedAt) }}</span>
                </div>
                <div class="time-row">
                  <span class="time-label">{{ $t('license.serverTime') }}</span>
                  <span class="time-value">{{ formatTime(licenseData.serverTime) }}</span>
                </div>
                <!-- 校准服务器行已隐藏，客户不需要看到时间源信息 -->
                <!-- <div class="time-row">
                  <span class="time-label">校准服务器</span>
                  <span class="time-value mono">{{ licenseConfig.licenseServerUrl }}</span>
                </div> -->
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 授权文件信息（仅管理员，占满整行） -->
    <el-card class="detail-card full-width" shadow="hover" v-if="isAdmin">
      <div slot="header" class="card-header">
        <div class="header-icon-sm green"><i class="el-icon-folder-opened"></i></div>
        <span>{{ $t('license.fileInfo') }}</span>
        <el-tag size="mini" type="info" style="margin-left: auto;">{{ $t('license.adminOnly') }}</el-tag>
      </div>
      <div v-if="licenseData.licenseFile" class="file-info">
        <el-descriptions :column="4" border size="small">
          <el-descriptions-item :label="$t('license.filePath')" :span="2"><span class="mono">{{ licenseData.licenseFile.path }}</span></el-descriptions-item>
          <el-descriptions-item :label="$t('license.fileName')">{{ licenseData.licenseFile.fileName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('license.fileSize')">{{ licenseData.licenseFile.sizeFormatted }}</el-descriptions-item>
          <el-descriptions-item :label="$t('license.lastModified')" :span="2">{{ formatTime(licenseData.licenseFile.lastModified) }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-else class="empty-state">
        <i class="el-icon-document-delete"></i>
        <span>{{ $t('license.noLicenseFile') }}</span>
      </div>
    </el-card>

    <!-- 导入授权弹窗 -->
    <el-dialog :title="$t('license.importDialogTitle')" :visible.sync="showImportDialog" width="500px" :close-on-click-modal="false" custom-class="license-import-dialog">
      <div class="import-tip">
        <i class="el-icon-info"></i>
        <span>{{ $t('license.importTip') }}</span>
      </div>
      <el-upload
        class="import-upload"
        drag
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
        accept=".lic"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{ $t('license.dragUpload') }}</div>
      </el-upload>

      <div v-if="selectedFile" class="selected-file-info">
        <i class="el-icon-document-checked"></i>
        <span class="file-name">{{ selectedFile.name }}</span>
        <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
      </div>

      <div slot="footer">
        <el-button @click="showImportDialog = false">{{ $t('license.cancel') }}</el-button>
        <el-button type="primary" :loading="importing" :disabled="!selectedFile" @click="handleImport">{{ $t('license.confirmImport') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { Message } from 'element-ui'
import { getLicenseStatus, importLicense, syncLicenseTime, downloadLicense } from '@/api'
import licenseConfig from '@/config/license.config'
import store from '@/store'


// ===== 响应式数据 =====
const licenseData = reactive({})
const loading = ref(false)
const showImportDialog = ref(false)
const selectedFile = ref(null)
const importing = ref(false)
const syncing = ref(false)
let countdownTimer = null
const countdownText = ref('')

// ===== 计算属性 =====
const isAdmin = computed(() => store?.state?.user?.userInfo?.role === 'administrator')

// ===== 方法 =====
async function loadData() {
  loading.value = true
  try {
    const res = await getLicenseStatus()
    Object.assign(licenseData, res.data || {})
    startCountdown()
  } catch (e) {
    Message.error('获取授权状态失败')
  } finally {
    loading.value = false
  }
}

function startCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  if (!licenseData.valid || !licenseData.expiresAt) {
    countdownText.value = '-'
    return
  }
  const update = () => {
    const diff = licenseData.expiresAt - Date.now()
    if (diff <= 0) {
      countdownText.value = '已过期'
      return
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    countdownText.value = `${days}天 ${hours}时 ${minutes}分`
  }
  update()
  countdownTimer = setInterval(update, 60000)
}

function handleFileChange(file) {
  selectedFile.value = file.raw
}

async function handleImport() {
  if (!selectedFile.value) return
  importing.value = true
  try {
    await importLicense(selectedFile.value)
    Message.success('授权文件导入成功')
    showImportDialog.value = false
    selectedFile.value = null
    await loadData()
  } catch (e) {
    // 错误已在拦截器提示
  } finally {
    importing.value = false
  }
}

async function handleSyncTime() {
  syncing.value = true
  try {
    const res = await syncLicenseTime()
    Message.success(res.data?.message || '时间校准成功')
    await loadData()
  } catch (e) {
    // 错误已在拦截器提示
  } finally {
    syncing.value = false
  }
}

async function handleDownload() {
  try {
    const res = await downloadLicense()
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'license.lic')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    Message.success('授权文件下载成功')
  } catch (e) {
    Message.error('下载失败')
  }
}

function copyMachineId() {
  if (licenseData.machineId) {
    const textarea = document.createElement('textarea')
    textarea.value = licenseData.machineId
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      Message.success('机器ID已复制')
    } catch (e) {
      Message.error('复制失败，请手动复制')
    }
    document.body.removeChild(textarea)
  }
}

function formatTime(timestamp) {
  if (!timestamp) return '-'
  const d = new Date(timestamp)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function formatDate(timestamp) {
  if (!timestamp) return '-'
  const d = new Date(timestamp)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function licenseTypeLabel(type) {
  const map = { trial: '试用版', standard: '标准版', enterprise: '企业版', perpetual: '永久版' }
  return map[type] || type || '-'
}

function licenseTypeTag(type) {
  const map = { trial: 'info', standard: '', enterprise: 'warning', perpetual: 'success' }
  return map[type] || ''
}

// ===== 生命周期 =====
onMounted(() => {
  loadData()
})

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style lang="less" scoped>
.license-manage {
  padding: 16px;
  background: #f0f2f5;
  min-height: calc(100vh - 84px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px;
  }

  .page-title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a2e;
  }

  .page-subtitle {
    font-size: 13px;
    color: #909399;
    margin-top: 6px;
    line-height: 1.5;
  }

  .header-right {
    display: flex;
    gap: 8px;
  }
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 15px;
}

.header-icon-sm {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;

  &.blue { background: linear-gradient(135deg, #4facfe, #00f2fe); }
  &.purple { background: linear-gradient(135deg, #a18cd1, #fbc2eb); }
  &.orange { background: linear-gradient(135deg, #fa709a, #fee140); }
  &.green { background: linear-gradient(135deg, #43e97b, #38f9d7); }
}

/* 状态卡片 */
.status-card {
  border-radius: 12px;
  overflow: hidden;
}

.status-banner {
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 16px;

  &.valid {
    background: linear-gradient(135deg, #11998e, #38ef7d);
    color: #fff;
  }
  &.invalid {
    background: linear-gradient(135deg, #eb3349, #f45c43);
    color: #fff;
  }

  .status-icon-wrap {
    font-size: 48px;
    flex-shrink: 0;
  }

  .status-label {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .status-sub {
    font-size: 13px;
    opacity: 0.9;
    &.error { font-weight: 500; }
  }
}

.status-body {
  padding: 20px 24px;
}

/* 倒计时 */
.countdown-box {
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa, #e8ecf1);
  border-radius: 10px;
  margin-bottom: 16px;

  &.expired {
    background: linear-gradient(135deg, #fef0f0, #fde2e2);
  }

  .countdown-label {
    font-size: 12px;
    color: #909399;
    margin-bottom: 6px;
  }

  .countdown-value {
    font-size: 24px;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 4px;
  }

  &.expired .countdown-value {
    color: #f56c6c;
  }

  .countdown-date {
    font-size: 12px;
    color: #c0c4cc;
  }
}

/* 快捷信息 */
.quick-list {
  .quick-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    i {
      font-size: 18px;
      color: #667eea;
      width: 24px;
      text-align: center;
    }

    .quick-text {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .quick-label {
      font-size: 13px;
      color: #909399;
    }

    .quick-value {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
    }
  }
}

/* 详情卡片 */
.detail-card {
  margin-bottom: 16px;
  border-radius: 12px;

  /deep/ .el-card__header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  /deep/ .el-descriptions__label {
    line-height: 1.8;
    padding: 10px 12px;
  }

  /deep/ .el-descriptions__content {
    line-height: 1.8;
    padding: 10px 12px;
  }
}

/* 占满整行的卡片 */
.detail-card.full-width {
  width: 100%;
  margin-top: 0;

  /deep/ .el-descriptions__label {
    padding: 16px 20px;
    font-size: 14px;
    font-weight: 500;
  }

  /deep/ .el-descriptions__content {
    padding: 16px 20px;
    font-size: 14px;
  }
}

.mono {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #606266;
  word-break: break-all;
}

.text-muted {
  color: #c0c4cc;
  font-size: 13px;
}

/* 机器信息 */
.machine-info {
  min-height: 168px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .machine-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #f5f5f5;
    line-height: 1.6;

    &:last-child {
      border-bottom: none;
    }

    .machine-label {
      font-size: 13px;
      color: #909399;
      flex-shrink: 0;
    }

    .machine-value-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      justify-content: flex-end;
      overflow: hidden;
      min-width: 0;
    }

    .machine-id {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #606266;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: right;
      flex: 1;
      min-width: 0;
    }
  }
}

/* 时间信息 */
.time-info {
  min-height: 168px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .time-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #f5f5f5;
    line-height: 1.6;

    &:last-child {
      border-bottom: none;
    }

    .time-label {
      font-size: 13px;
      color: #909399;
      flex-shrink: 0;
    }

    .time-value {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
      text-align: right;
    }
  }
}

/* 文件信息空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #c0c4cc;

  i {
    font-size: 48px;
    margin-bottom: 12px;
  }

  span {
    font-size: 14px;
  }
}

/* 导入弹窗 */
.import-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #ecf5ff;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #409eff;

  i {
    font-size: 16px;
  }
}

.import-upload {
  margin-bottom: 16px;
}

.selected-file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0f9eb;
  border-radius: 8px;
  font-size: 13px;

  i {
    color: #67c23a;
    font-size: 18px;
  }

  .file-name {
    color: #303133;
    font-weight: 500;
  }

  .file-size {
    color: #909399;
    margin-left: auto;
  }
}
</style>
