<template>
  <div class="license-manage-page">
    <!-- 状态卡片 -->
    <el-row :gutter="12">
      <el-col :span="16">
        <el-card v-loading="loading" shadow="never">
          <template #header>
            <div class="card-head">
              <span>{{ t('superPanel.license.page.manageTitle') }}</span>
              <el-tag :type="statusTag">{{ statusText }}</el-tag>
            </div>
          </template>
          <el-descriptions v-if="license" :column="2" border>
            <el-descriptions-item :label="t('superPanel.license.info.type')">{{
              licenseTypeLabel
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('superPanel.license.info.expireTime')">{{
              license.expireTime || '-'
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('superPanel.license.info.customerName')">{{
              license.customer || '-'
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('superPanel.license.info.features')">
              <el-tag v-for="f in featureList" :key="f" size="small" style="margin-right: 6px">{{ f }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <div class="actions">
            <el-button type="primary" :icon="Upload" @click="goImport">{{
              t('superPanel.license.import.action')
            }}</el-button>
            <el-button :icon="Download" @click="handleDownload">{{
              t('superPanel.license.import.download')
            }}</el-button>
            <el-button :icon="RefreshRight" @click="handleSync">{{ t('superPanel.license.info.syncTime') }}</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 机器绑定 -->
      <el-col :span="8">
        <el-card shadow="never">
          <template #header
            ><span>{{ t('superPanel.license.manage.machineBinding') }}</span></template
          >
          <p class="binding-label">{{ t('superPanel.license.manage.machineId') }}</p>
          <el-input :model-value="machineId" readonly>
            <template #append
              ><el-button @click="copyMachineId">{{ t('superPanel.license.manage.copy') }}</el-button></template
            >
          </el-input>
          <p class="binding-hint">
            {{ machineId ? t('superPanel.license.status.matched') : t('superPanel.license.status.notMatched') }}
          </p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
/**
 * License 管理页：License 状态展示 / 导入跳转 / 下载 / 时间同步 / 机器 ID
 * 作者：GooHv
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Download, RefreshRight } from '@element-plus/icons-vue'
import { useI18n } from '@/composables/useI18n'
import { $msg } from '@/utils/ui/feedback'
import { getLicenseStatus, getMachineId, syncLicenseTime, downloadLicense } from '@/api/license'
import { ROUTE_PATHS } from '@/router/constant/pathConstants'

const { t } = useI18n()
const router = useRouter()

const loading = ref(false)
const license = ref<Record<string, any> | null>(null)
const machineId = ref('')

const statusTag = computed(() => (license.value?.valid ? 'success' : 'danger'))
const statusText = computed(() =>
  license.value?.valid ? t('superPanel.license.status.valid') : t('superPanel.license.status.invalid')
)
// 授权类型文案沿用后端返回值；若需本地化请由 super-panel 域补充字典 key
const licenseTypeLabel = computed(() => license.value?.type || '-')
const featureList = computed<string[]>(() => license.value?.features || [])

async function loadStatus() {
  loading.value = true
  try {
    const res = await getLicenseStatus()
    license.value = (res.data as Record<string, any>) || null
  } catch {
    /* 拦截器已提示 */
  } finally {
    loading.value = false
  }
}

async function loadMachineId() {
  try {
    const res = await getMachineId()
    machineId.value = (res.data as { machineId?: string })?.machineId || ''
  } catch {
    /* 静默 */
  }
}

function goImport() {
  router.push(ROUTE_PATHS.LICENSE_IMPORT)
}

function copyMachineId() {
  navigator.clipboard?.writeText(machineId.value)
  $msg.success(t('superPanel.license.message.machineIdCopied'))
}

async function handleDownload() {
  try {
    await downloadLicense()
    $msg.success(t('superPanel.license.message.licenseDownloadSuccess'))
  } catch {
    /* 拦截器已提示 */
  }
}

async function handleSync() {
  try {
    await syncLicenseTime()
    $msg.success(t('superPanel.license.message.syncTimeSuccess'))
    loadStatus()
  } catch {
    /* 拦截器已提示 */
  }
}

onMounted(() => {
  loadStatus()
  loadMachineId()
})
</script>

<style scoped>
.license-manage-page {
  padding: 16px;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}
.binding-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}
.binding-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
}
</style>
