<template>
  <div class="license-import-page">
    <div class="license-bg"></div>

    <div class="license-container">
      <!-- 左侧：品牌信息 -->
      <div class="brand-panel">
        <div class="brand-logo"><el-icon><Lock /></el-icon></div>
        <h1 class="brand-title">{{ t('system.config.superPanelLicense.licenseManager.brandTitle') }}</h1>
        <p class="brand-desc">{{ t('system.config.superPanelLicense.licenseManager.brandDesc') }}</p>
        <div class="brand-features">
          <div class="feature-item">
            <el-icon><Lock /></el-icon>
            <span>{{ t('system.config.superPanelLicense.licenseManager.featureRsa') }}</span>
          </div>
          <div class="feature-item">
            <el-icon><Timer /></el-icon>
            <span>{{ t('system.config.superPanelLicense.licenseManager.featureTimeGuard') }}</span>
          </div>
          <div class="feature-item">
            <el-icon><Monitor /></el-icon>
            <span>{{ t('system.config.superPanelLicense.licenseManager.featureMachineBind') }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧：授权导入表单 -->
      <div class="form-panel">
        <h2 class="form-title">
          <el-icon><DocumentChecked /></el-icon>
          {{ t('system.config.superPanelLicense.licenseManager.importFormTitle') }}
        </h2>

        <!-- 当前授权状态 -->
        <div
          class="status-card"
          :class="{ valid: licenseStatus?.valid, invalid: !licenseStatus?.valid }"
          :style="{ visibility: licenseStatus ? 'visible' : 'hidden' }"
        >
          <div class="status-icon">
            <el-icon v-if="licenseStatus?.valid"><CircleCheckFilled /></el-icon>
            <el-icon v-else><Warning /></el-icon>
          </div>
          <div class="status-info">
            <div class="status-label">
              {{
                licenseStatus?.valid
                  ? t('system.config.superPanelLicense.licenseManager.statusValid')
                  : t('system.config.superPanelLicense.licenseManager.statusInvalid')
              }}
            </div>
            <div v-if="licenseStatus?.valid" class="status-detail">
              {{ t('system.config.superPanelLicense.licenseManager.expireTime') }}：{{
                formatTime(licenseStatus.expiresAt)
              }}
            </div>
            <div v-else class="status-detail error">
              {{ formatLicenseReason(licenseStatus?.reason) }}
            </div>
          </div>
          <el-button
            class="status-refresh"
            link
            :icon="Refresh"
            :loading="statusLoading"
            @click="handleRefreshStatus"
          >
            {{ t('system.config.superPanelLicense.licenseManager.refreshStatus') }}
          </el-button>
        </div>

        <!-- 机器码展示区域 -->
        <div class="machine-id-card">
          <div class="machine-id-header">
            <el-icon><Cpu /></el-icon>
            <span class="machine-id-title">
              {{ t('system.config.superPanelLicense.licenseManager.currentMachineId') }}
            </span>
          </div>
          <div class="machine-id-content">
            <span class="machine-id-text mono-text">{{ currentMachineId || '-' }}</span>
            <el-button
              v-if="currentMachineId"
              link
              :icon="DocumentCopy"
              :loading="copyingMachineId"
              @click="copyMachineId"
            >
              {{ t('system.config.superPanelLicense.licenseManager.copy') }}
            </el-button>
          </div>
          <div class="machine-id-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ t('system.config.superPanelLicense.licenseManager.machineIdTip') }}</span>
          </div>
        </div>

        <!-- 上传区域 -->
        <el-upload
          class="license-upload"
          drag
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleFileChange"
          accept=".lic"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            {{ t('system.config.superPanelLicense.licenseManager.dragUploadTip') }}
          </div>
          <template #tip>
            <div class="el-upload__tip">
              {{ t('system.config.superPanelLicense.licenseManager.fileSizeTip') }}
            </div>
          </template>
        </el-upload>

        <!-- 已选择文件展示 -->
        <div v-if="selectedFile" class="selected-file">
          <div class="file-info">
            <el-icon class="file-icon"><Document /></el-icon>
            <div class="file-detail">
              <div class="file-name">{{ selectedFile.name }}</div>
              <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
            </div>
          </div>
          <el-button link :icon="Close" @click="clearSelectedFile">
            {{ t('system.config.superPanelLicense.licenseManager.remove') }}
          </el-button>
        </div>

        <!-- 授权信息展示（导入成功后，自定义描述网格，避免 el-descriptions 注册依赖） -->
        <div v-if="importedLicense" class="license-info-card">
          <div class="info-header">
            <el-icon><CircleCheckFilled /></el-icon>
            <span>{{ t('system.config.superPanelLicense.licenseManager.importSuccessTitle') }}</span>
          </div>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">{{ t('superPanel.license.info.id') }}</span>
              <span class="info-value">{{ importedLicense.licenseId || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ t('superPanel.license.info.project') }}</span>
              <span class="info-value">{{ importedLicense.projectName || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ t('superPanel.license.info.type') }}</span>
              <span class="info-value">{{ licenseTypeLabel(importedLicense.licenseType) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ t('superPanel.license.info.issuedAt') }}</span>
              <span class="info-value">{{ formatTime(importedLicense.issuedAt) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ t('superPanel.license.info.expireTime') }}</span>
              <span class="info-value">{{ formatTime(importedLicense.expiresAt) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ t('superPanel.license.info.maxUsers') }}</span>
              <span class="info-value">
                {{ importedLicense.maxUsers || t('system.config.superPanelLicense.licenseManager.unlimited') }}
              </span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button
            type="primary"
            :icon="Upload"
            :loading="importing"
            :disabled="!selectedFile"
            @click="handleImport"
          >
            {{ t('system.config.superPanelLicense.licenseManager.importLicense') }}
          </el-button>
          <el-button v-if="importedLicense" type="success" :icon="HomeFilled" @click="handleGoHome">
            {{ t('system.config.superPanelLicense.licenseManager.enterSystem') }}
          </el-button>
          <el-button :icon="Refresh" @click="handleRefreshStatus">
            {{ t('system.config.superPanelLicense.licenseManager.refreshStatus') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 授权导入页（无 Layout 全屏页）
 * 授权无效 / 缺失时由路由守卫导向此页：查看当前状态与机器码、上传 .lic 授权文件、
 * 导入成功后重置路由授权缓存并进入系统。
 * 作者：GooHv
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Lock,
  Timer,
  Monitor,
  DocumentChecked,
  CircleCheckFilled,
  Warning,
  Cpu,
  DocumentCopy,
  InfoFilled,
  UploadFilled,
  Upload,
  Document,
  Close,
  HomeFilled,
  Refresh
} from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { useI18n } from '@/composables/useI18n'
import { $msg } from '@/utils/ui/feedback'
import { formatDate, DATE_FORMATS } from '@/utils/data/date'
import { copyToClipboard } from '@/utils/business/licenseHelper'
import { resetLicenseCache } from '@/utils/auth/licenseGuard'
import { getLicenseStatus, importLicense } from '@/api/license'
import { useUserStore } from '@/store/modules/user'
import { ROUTE_PATHS } from '@/router/constant/pathConstants'

defineOptions({ name: 'LicenseImport' })

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

// ===== 响应式数据 =====
const licenseStatus = ref<Record<string, any> | null>(null)
const selectedFile = ref<File | null>(null)
const importing = ref(false)
const importedLicense = ref<Record<string, any> | null>(null)
const currentMachineId = ref('')
const copyingMachineId = ref(false)
const statusLoading = ref(true)

const LM = 'system.config.superPanelLicense.licenseManager'

// ===== 方法 =====
/** 加载当前授权状态 */
async function loadStatus(): Promise<void> {
  statusLoading.value = true
  try {
    const res = await getLicenseStatus()
    licenseStatus.value = (res.data as Record<string, any>) || null
    currentMachineId.value = (res.data as { machineId?: string })?.machineId || ''
  } catch {
    licenseStatus.value = { valid: false, reason: t(`${LM}.cannotGetStatus`) }
  } finally {
    statusLoading.value = false
  }
}

/** 刷新授权状态 */
function handleRefreshStatus(): void {
  importedLicense.value = null
  // 手动刷新时同时清除路由缓存，确保守卫与页面口径一致
  resetLicenseCache()
  loadStatus()
}

/** 文件选择变化 */
function handleFileChange(file: UploadFile): void {
  selectedFile.value = file.raw || null
  importedLicense.value = null
}

/** 清除已选择文件 */
function clearSelectedFile(): void {
  selectedFile.value = null
  importedLicense.value = null
}

/** 格式化文件大小 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/** 导入授权文件 */
async function handleImport(): Promise<void> {
  if (!selectedFile.value) {
    $msg.warning(t(`${LM}.pleaseSelectFile`))
    return
  }
  importing.value = true
  try {
    const res = await importLicense(selectedFile.value)
    importedLicense.value = (res.data as Record<string, any>) || null
    $msg.success(t(`${LM}.importSuccess`))
    // 重置路由授权缓存，下次跳转重新校验
    resetLicenseCache()
    await loadStatus()
  } catch {
    // 错误已在请求拦截器统一提示
  } finally {
    importing.value = false
  }
}

/** 进入系统：已登录跳首页，未登录跳登录页 */
function handleGoHome(): void {
  router.push(userStore.token ? ROUTE_PATHS.HOME : ROUTE_PATHS.LOGIN)
}

/** 格式化时间（空值表示永久有效） */
function formatTime(timestamp?: number | string): string {
  if (!timestamp) return t(`${LM}.permanentValid`)
  return formatDate(timestamp, DATE_FORMATS.DATETIME)
}

/** 授权类型文案 */
function licenseTypeLabel(type?: string): string {
  const map: Record<string, string> = {
    trial: t(`${LM}.typeTrial`),
    standard: t(`${LM}.typeStandard`),
    enterprise: t(`${LM}.typeEnterprise`),
    perpetual: t(`${LM}.typePerpetual`)
  }
  return (type && map[type]) || type || '-'
}

/** 将后端中文失效原因映射为国际化文案 */
function formatLicenseReason(reason?: string): string {
  if (!reason) return t(`${LM}.reasonUnknown`)
  if (reason.includes('不存在') || reason.includes('验证失败')) return t(`${LM}.reasonFileNotFound`)
  if (reason.includes('项目不匹配')) return t(`${LM}.reasonProjectMismatch`)
  if (reason.includes('机器不匹配') || reason.includes('硬件绑定')) return t(`${LM}.reasonMachineMismatch`)
  if (reason.includes('已过期')) return t(`${LM}.reasonExpired`)
  if (reason.includes('缺少功能') || reason.includes('功能授权')) return t(`${LM}.reasonMissingFeatures`)
  if (reason.includes('时间回退') || reason.includes('回退')) return t(`${LM}.reasonTimeRollback`)
  if (reason.includes('联网校准失败') || reason.includes('校准失败')) {
    return t(`${LM}.reasonNetworkSyncFailed`)
  }
  return reason
}

/** 复制机器码 */
async function copyMachineId(): Promise<void> {
  if (!currentMachineId.value) return
  copyingMachineId.value = true
  try {
    await copyToClipboard(currentMachineId.value)
    $msg.success(t(`${LM}.copySuccess`))
  } catch {
    $msg.error(t(`${LM}.copyFailed`))
  } finally {
    copyingMachineId.value = false
  }
}

onMounted(() => {
  loadStatus()
})
</script>

<style scoped lang="less">
.license-import-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}

.license-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.license-container {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 960px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

// 左侧品牌区
.brand-panel {
  flex: 0 0 38%;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
  backdrop-filter: blur(8px);
  padding: 48px 36px;
  color: #fff;
  display: flex;
  flex-direction: column;

  .brand-logo {
    font-size: 56px;
    margin-bottom: 20px;
    opacity: 0.95;
  }
  .brand-title {
    margin: 0 0 14px;
    font-size: 26px;
    font-weight: 700;
  }
  .brand-desc {
    margin: 0 0 36px;
    font-size: 14px;
    line-height: 1.8;
    opacity: 0.88;
  }
  .brand-features {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      opacity: 0.92;

      .el-icon {
        font-size: 18px;
      }
    }
  }
}

// 右侧表单区
.form-panel {
  flex: 1;
  background: #fff;
  padding: 36px 40px;
  max-height: 88vh;
  overflow-y: auto;

  .form-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 22px;
    font-size: 20px;
    font-weight: 600;
    color: #303133;

    .el-icon {
      color: #667eea;
    }
  }
}

// 状态卡
.status-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  margin-bottom: 18px;
  border: 1px solid transparent;

  &.valid {
    background: #f0f9eb;
    border-color: #e1f3d8;
    .status-icon {
      color: #67c23a;
    }
  }
  &.invalid {
    background: #fef0f0;
    border-color: #fde2e2;
    .status-icon {
      color: #f56c6c;
    }
  }
  .status-icon {
    font-size: 28px;
    flex-shrink: 0;
  }
  .status-info {
    flex: 1;
    min-width: 0;
  }
  .status-label {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }
  .status-detail {
    font-size: 12px;
    color: #606266;
    margin-top: 2px;
    word-break: break-all;
    &.error {
      color: #f56c6c;
    }
  }
  .status-refresh {
    flex-shrink: 0;
  }
}

// 机器码卡
.machine-id-card {
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 18px;

  .machine-id-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #606266;
    margin-bottom: 8px;
  }
  .machine-id-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: #fff;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    padding: 8px 12px;
  }
  .machine-id-text {
    font-size: 13px;
    color: #303133;
    word-break: break-all;
  }
  .machine-id-tip {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
    line-height: 1.6;

    .el-icon {
      margin-top: 2px;
      flex-shrink: 0;
    }
  }
}

.mono-text {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

// 上传区
.license-upload {
  width: 100%;
  margin-bottom: 14px;

  :deep(.el-upload-dragger) {
    width: 100%;
    padding: 24px;
  }
  .el-icon--upload {
    font-size: 40px;
    color: #c0c4cc;
    margin-bottom: 8px;
  }
  .el-upload__text {
    font-size: 13px;
    color: #606266;
  }
  .el-upload__tip {
    font-size: 12px;
    color: #909399;
    margin-top: 6px;
  }
}

// 已选文件
.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 16px;

  .file-info {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .file-icon {
    font-size: 22px;
    color: #409eff;
    flex-shrink: 0;
  }
  .file-name {
    font-size: 13px;
    font-weight: 600;
    color: #303133;
    word-break: break-all;
  }
  .file-size {
    font-size: 12px;
    color: #909399;
  }
}

// 导入结果
.license-info-card {
  border: 1px solid #e1f3d8;
  background: #f0f9eb;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 18px;

  .info-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #67c23a;
    margin-bottom: 12px;

    .el-icon {
      font-size: 18px;
    }
  }
  .info-grid {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    overflow: hidden;
  }
  .info-row {
    display: flex;
    font-size: 13px;
    border-bottom: 1px solid #f0f2f5;

    &:last-child {
      border-bottom: none;
    }
  }
  .info-label {
    flex: 0 0 110px;
    padding: 9px 12px;
    background: #fafbfc;
    color: #909399;
  }
  .info-value {
    flex: 1;
    padding: 9px 12px;
    color: #303133;
    word-break: break-all;
  }
}

// 操作按钮
.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .license-container {
    flex-direction: column;
    max-width: 480px;
  }
  .brand-panel {
    flex: none;
    padding: 32px 28px;
  }
}
</style>
