<template>
  <div class="system-config-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ pageTitle }}</h2>
        <p class="page-desc">{{ t('superPanel.config.page.desc') }}</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="small" :disabled="configStatus !== 'ready'" :loading="loading" @click="handleSave">
          <el-icon><Check /></el-icon>&nbsp;{{ t('superPanel.config.page.save') }}
        </el-button>
        <el-button size="small" :disabled="configStatus !== 'ready'" :loading="loading" @click="handleReset">
          <el-icon><RefreshLeft /></el-icon>&nbsp;{{ t('superPanel.config.page.reset') }}
        </el-button>
      </div>
    </div>

    <!-- 主体：左侧导航 + 右侧配置 -->
    <div class="config-body">
      <!-- 左侧分类导航 -->
      <div class="config-sidebar">
        <div
          v-for="item in filteredMenuList"
          :key="item.key"
          class="menu-item"
          :class="{ active: activeMenu === item.key }"
          @click="activeMenu = item.key"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </div>
      </div>

      <!-- 右侧配置内容 -->
      <div class="config-content">
        <!-- 加载中 -->
        <div v-if="configStatus === 'loading'" class="config-status-wrapper">
          <div class="config-status-loading">
            <el-icon class="status-icon is-loading"><Loading /></el-icon>
            <p class="status-text">{{ t('superPanel.config.page.loadingText') }}</p>
          </div>
        </div>

        <!-- 加载失败 -->
        <div v-else-if="configStatus === 'error'" class="config-status-wrapper">
          <div class="config-status-error">
            <el-icon class="status-icon error-icon"><WarningFilled /></el-icon>
            <h3 class="status-title">{{ t('superPanel.config.page.loadFailedTitle') }}</h3>
            <p class="status-desc">{{ t('superPanel.config.page.loadFailedDesc') }}</p>
            <el-button type="primary" @click="loadConfigs">
              <el-icon><Refresh /></el-icon>&nbsp;{{ t('superPanel.config.page.reload') }}
            </el-button>
          </div>
        </div>

        <!-- 配置不完整 -->
        <div v-else-if="configStatus === 'incomplete'" class="config-status-wrapper">
          <div class="config-status-incomplete">
            <el-alert :title="t('superPanel.config.page.incompleteTitle')" type="warning" :closable="false" show-icon class="incomplete-alert">
              <template #default>
                <p class="incomplete-desc">
                  {{ t('superPanel.config.page.incompleteDesc', { count: missingConfigKeys.length }) }}
                </p>
                <div class="missing-keys-list">
                  <p class="missing-keys-title">{{ t('superPanel.config.page.missingKeysTitle') }}</p>
                  <ul>
                    <li v-for="key in missingConfigKeys" :key="key">{{ key }}</li>
                  </ul>
                </div>
                <p class="incomplete-tip">{{ t('superPanel.config.page.incompleteTip') }}</p>
              </template>
            </el-alert>
            <div class="incomplete-actions">
              <el-button type="primary" @click="loadConfigs">
                <el-icon><Refresh /></el-icon>&nbsp;{{ t('superPanel.config.page.reload') }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 正常配置内容 -->
        <div v-else class="config-panels-wrapper">
          <!-- PLC -->
          <div v-if="activeMenu === 'plc'" class="config-panel">
            <h3 class="panel-title">{{ t('superPanel.config.plc.title') }}</h3>
            <el-form :model="form" label-width="160px">
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.plc.protocol') }}
                    <el-tooltip :content="t('superPanel.config.plc.protocolTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-select v-model="form.plcProtocol" style="width: 200px">
                  <el-option label="Modbus TCP" value="ModbusTcp" />
                  <el-option label="S7" value="S7" />
                  <el-option label="OPC UA" value="OpcUa" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.plc.host') }}
                    <el-tooltip :content="t('superPanel.config.plc.hostTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input v-model="form.plcHost" placeholder="192.168.1.100" style="width: 250px" />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.plc.port') }}
                    <el-tooltip :content="t('superPanel.config.plc.portTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.plcPort" :min="1" :max="65535" controls-position="right" />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.plc.unitId') }}
                    <el-tooltip :content="t('superPanel.config.plc.unitIdTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.plcUnitId" :min="1" :max="255" controls-position="right" />
              </el-form-item>

              <el-divider content-position="left">{{ t('superPanel.config.plc.pollSettings') }}</el-divider>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.plc.pollFast') }}
                    <el-tooltip :content="t('superPanel.config.plc.pollFastTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.pollFastInterval" :min="50" :max="5000" :step="50" controls-position="right" />
                <span class="unit-text">ms</span>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.plc.pollSlow') }}
                    <el-tooltip :content="t('superPanel.config.plc.pollSlowTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.pollSlowInterval" :min="100" :max="10000" :step="100" controls-position="right" />
                <span class="unit-text">ms</span>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.plc.reconnectDelay') }}
                    <el-tooltip :content="t('superPanel.config.plc.reconnectDelayTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.plcReconnectDelay" :min="1000" :max="30000" :step="500" controls-position="right" />
                <span class="unit-text">ms</span>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.plc.enablePoll') }}
                    <el-tooltip :content="t('superPanel.config.plc.enablePollTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-switch v-model="form.plcEnablePoll" active-value="true" inactive-value="false" />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.plc.enableWriteAudit') }}
                    <el-tooltip :content="t('superPanel.config.plc.enableWriteAuditTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-switch v-model="form.plcEnableWriteAudit" active-value="true" inactive-value="false" />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.plc.maxWriteRetry') }}
                    <el-tooltip :content="t('superPanel.config.plc.maxWriteRetryTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.plcMaxWriteRetry" :min="0" :max="5" :step="1" controls-position="right" />
                <span class="unit-text">{{ t('superPanel.config.plc.unitTimes') }}</span>
              </el-form-item>
            </el-form>
          </div>

          <!-- 连接 -->
          <div v-if="activeMenu === 'connection'" class="config-panel">
            <h3 class="panel-title">{{ t('superPanel.config.connection.title') }}</h3>
            <el-form :model="form" label-width="160px">
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.connection.heartbeatInterval') }}
                    <el-tooltip :content="t('superPanel.config.connection.heartbeatIntervalTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.heartbeatInterval" :min="5000" :max="60000" :step="1000" controls-position="right" />
                <span class="unit-text">ms</span>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.connection.deviceStatusCheckInterval') }}
                    <el-tooltip :content="t('superPanel.config.connection.deviceStatusCheckIntervalTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.deviceStatusCheckInterval" :min="60" :max="3600" :step="60" controls-position="right" />
                <span class="unit-text">{{ t('superPanel.config.connection.unitSecond') }}</span>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.connection.deviceOfflineThreshold') }}
                    <el-tooltip :content="t('superPanel.config.connection.deviceOfflineThresholdTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.deviceOfflineThreshold" :min="120" :max="7200" :step="60" controls-position="right" />
                <span class="unit-text">{{ t('superPanel.config.connection.unitSecond') }}</span>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.connection.maintenanceCheckInterval') }}
                    <el-tooltip :content="t('superPanel.config.connection.maintenanceCheckIntervalTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.maintenanceCheckInterval" :min="1" :max="168" :step="1" controls-position="right" />
                <span class="unit-text">{{ t('superPanel.config.connection.unitHour') }}</span>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.connection.partLifeStatInterval') }}
                    <el-tooltip :content="t('superPanel.config.connection.partLifeStatIntervalTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.partLifeStatInterval" :min="1" :max="60" :step="1" controls-position="right" />
                <span class="unit-text">{{ t('superPanel.config.connection.unitMinute') }}</span>
              </el-form-item>
            </el-form>
          </div>

          <!-- 邮箱 -->
          <div v-if="activeMenu === 'email'" class="config-panel">
            <EmailConfig />
          </div>

          <!-- 语言 -->
          <div v-if="activeMenu === 'language'" class="config-panel">
            <LanguageConfig />
          </div>

          <!-- 翻译 -->
          <div v-if="activeMenu === 'translation'" class="config-panel">
            <TranslationConfig />
          </div>

          <!-- 上传 -->
          <div v-if="activeMenu === 'upload'" class="config-panel">
            <h3 class="panel-title">{{ t('superPanel.config.upload.title') }}</h3>
            <el-form :model="form" label-width="160px">
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.upload.maxFileSize') }}
                    <el-tooltip :content="t('superPanel.config.upload.maxFileSizeTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.uploadMaxFileSize" :min="1" :max="100" :step="1" controls-position="right" />
                <span class="unit-text">MB</span>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.upload.allowedTypes') }}
                    <el-tooltip :content="t('superPanel.config.upload.allowedTypesTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input v-model="form.uploadAllowedTypes" placeholder="image,pdf,excel,word" style="width: 300px" />
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.upload.uploadPath') }}
                    <el-tooltip :content="t('superPanel.config.upload.uploadPathTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input v-model="form.uploadPath" placeholder="/uploads" style="width: 300px" />
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.upload.enableAudit') }}
                    <el-tooltip :content="t('superPanel.config.upload.enableAuditTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-switch v-model="form.uploadEnableAudit" active-value="true" inactive-value="false" />
              </el-form-item>
            </el-form>
          </div>

          <!-- 审计 -->
          <div v-if="activeMenu === 'audit'" class="config-panel">
            <h3 class="panel-title">{{ t('superPanel.config.audit.title') }}</h3>
            <el-form :model="form" label-width="160px">
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.audit.retentionDays') }}
                    <el-tooltip :content="t('superPanel.config.audit.retentionDaysTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.auditRetentionDays" :min="30" :max="3650" :step="30" controls-position="right" />
                <span class="unit-text">{{ t('superPanel.config.audit.unitDays') }}</span>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ t('superPanel.config.audit.autoArchive') }}
                    <el-tooltip :content="t('superPanel.config.audit.autoArchiveTip')" placement="top">
                      <el-icon class="tip-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <el-switch v-model="form.auditAutoArchive" active-value="true" inactive-value="false" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 超级面板参数配置（PLC / 连接 / 邮箱 / 语言 / 翻译 / 上传 / 审计）
 * @author GooHv
 * 数据全部来自后端；按配置完整性区分 ready / incomplete / error / loading 四种状态。
 */
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useDeviceStore } from '@/store/modules/device'
import { showSuccess, showError, showWarning } from '@/utils/ui/feedback'
import { applyConfig } from '@/utils/config/config'
import { getCoordsByValues } from '@/utils/business/worldCities'
import EmailConfig from '@/components/EmailConfig/index.vue'
import LanguageConfig from './components/LanguageConfig.vue'
import TranslationConfig from './components/TranslationConfig.vue'
import {
  Cpu,
  Link,
  Message,
  ChatLineRound,
  Upload,
  Document,
  Loading,
  WarningFilled,
  Check,
  Refresh,
  RefreshLeft,
  QuestionFilled
} from '@element-plus/icons-vue'
import {
  requestGetAllConfigsApi,
  requestUpdateConfigsApi,
  requestResetConfigsApi
} from '@/api'

const { locale, t } = useI18n()
const deviceStore = useDeviceStore()

type ConfigStatus = 'loading' | 'ready' | 'incomplete' | 'error'

/** 必需配置项清单（与后端 initDefaultData 保持一致） */
const REQUIRED_CONFIG_KEYS = [
  'sessionTimeout', 'defaultPageSize', 'defaultLanguage', 'dateFormat',
  'watermarkEnabled', 'watermarkText', 'loginFailedThreshold', 'lockDurationMinutes',
  'plcProtocol', 'plcHost', 'plcPort', 'plcUnitId', 'pollFastInterval', 'pollSlowInterval',
  'pdfWatermarkEnabled', 'pdfWatermarkText',
  'heartbeatInterval', 'deviceStatusCheckInterval', 'deviceOfflineThreshold', 'maintenanceCheckInterval', 'partLifeStatInterval',
  'deviceName', 'deviceCode', 'deviceRegion', 'deviceInstallDate',
  'partLifeReminderEnabled', 'partLifeThreshold', 'partLifeRemindInterval', 'partLifeSnoozeInterval',
  'allowNoOrderProduction', 'noOrderProductionHighlight', 'showOperatorName', 'showAlarmCount', 'showRuntime',
  'reportIncludeAlarmDetail', 'reportIncludeOperatorDetail', 'reportIncludeDownloadCount',
  'allowRunningOrderDownload', 'autoArchiveCompleted', 'orderSwitchConfirm',
  'plcReconnectDelay', 'plcEnablePoll', 'plcEnableWriteAudit', 'plcMaxWriteRetry',
  'emailSendTimeout', 'emailMaxRetries', 'emailRetryDelay',
  'uploadMaxFileSize', 'uploadAllowedTypes', 'uploadPath', 'uploadEnableAudit',
  'auditRetentionDays', 'auditAutoArchive',
  'licenseExpiringDays', 'licenseGracePeriod', 'licenseCheckInterval',
  'notificationAutoReadDays', 'notificationSoundEnabled'
] as const

/** 超级面板展示的 tab */
const SUPER_PANEL_TABS = ['plc', 'connection', 'email', 'language', 'translation', 'upload', 'audit'] as const

const menuList = computed(() => [
  { key: 'plc', icon: Cpu, title: t('superPanel.config.plc.title') },
  { key: 'connection', icon: Link, title: t('superPanel.config.connection.title') },
  { key: 'email', icon: Message, title: t('superPanel.config.email.title') },
  { key: 'language', icon: ChatLineRound, title: t('superPanel.config.language.title') },
  { key: 'translation', icon: Document, title: t('superPanel.config.translation.title') },
  { key: 'upload', icon: Upload, title: t('superPanel.config.upload.title') },
  { key: 'audit', icon: Document, title: t('superPanel.config.audit.title') }
])

const filteredMenuList = computed(() => menuList.value.filter((item) => (SUPER_PANEL_TABS as readonly string[]).includes(item.key)))

const loading = ref(false)
const activeMenu = ref<string>('plc')
const configStatus = ref<ConfigStatus>('loading')
const missingConfigKeys = ref<string[]>([])

/** 表单：数值型字段显式声明为 number 以兼容 el-input-number 双向绑定，其余走索引签名 */
interface ConfigMap {
  plcPort?: number
  plcHost?: string
  plcUnitId?: number
  pollFastInterval?: number
  pollSlowInterval?: number
  plcReconnectDelay?: number
  plcMaxWriteRetry?: number
  plcEnablePoll?: string
  plcEnableWriteAudit?: string
  uploadEnableAudit?: string
  auditAutoArchive?: string
  heartbeatInterval?: number
  deviceStatusCheckInterval?: number
  deviceOfflineThreshold?: number
  maintenanceCheckInterval?: number
  partLifeStatInterval?: number
  uploadMaxFileSize?: number
  uploadAllowedTypes?: string
  uploadPath?: string
  auditRetentionDays?: number
  [key: string]: any
}
const form = reactive<ConfigMap>({})
REQUIRED_CONFIG_KEYS.forEach((key) => {
  form[key] = undefined
})

const pageTitle = computed(() => t('superPanel.config.page.title'))

/** 解析 deviceRegion（兼容数组 / JSON 字符串 / 逗号分隔） */
function parseDeviceRegion(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
    } catch (e) {
      // 非 JSON
    }
    if (value.includes(',')) return value.split(',').map((s) => s.trim())
  }
  return []
}

/** 解析日期为 YYYY-MM-DD（兼容 Date / 时间戳 / 字符串） */
function parseDate(value: unknown): string {
  if (!value) return ''
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return ''
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, '0')
    const d = String(value.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  if (typeof value === 'number') {
    const ts = value < 1e12 ? value * 1000 : value
    return parseDate(new Date(ts))
  }
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    const date = new Date(value)
    if (!isNaN(date.getTime())) return parseDate(date)
    return value
  }
  return ''
}

function assignFormData(data: ConfigMap): void {
  REQUIRED_CONFIG_KEYS.forEach((key) => {
    if (data && key in data) {
      (form as Record<string, unknown>)[key] = (data as Record<string, unknown>)[key]
    }
  })
}

/** 校验配置完整性，返回缺失 key 列表 */
function checkConfigCompleteness(data: ConfigMap | null): string[] {
  if (!data || typeof data !== 'object') return [...REQUIRED_CONFIG_KEYS]
  return REQUIRED_CONFIG_KEYS.filter((key) => !(key in data))
}

function normalizeFlags(): void {
  form.partLifeReminderEnabled =
    form.partLifeReminderEnabled === true ||
    form.partLifeReminderEnabled === 'true' ||
    form.partLifeReminderEnabled === 1 ||
    form.partLifeReminderEnabled === '1'
  form.defaultLanguage = locale.value
}

async function loadConfigs(): Promise<void> {
  loading.value = true
  configStatus.value = 'loading'
  missingConfigKeys.value = []
  try {
    const res = await requestGetAllConfigsApi()
    if (res.code === 200 && res.data) {
      const data = res.data as ConfigMap
      const missingKeys = checkConfigCompleteness(data)
      if (missingKeys.length > 0) {
        configStatus.value = 'incomplete'
        missingConfigKeys.value = missingKeys
        assignFormData(data)
        showWarning(t('superPanel.config.page.incompleteWarning', { count: missingKeys.length }))
      } else {
        configStatus.value = 'ready'
        assignFormData(data)
        normalizeFlags()
        const parsedRegion = parseDeviceRegion(form.deviceRegion)
        const parsedDate = parseDate(form.deviceInstallDate)
        form.deviceRegion = []
        form.deviceInstallDate = ''
        await nextTick()
        form.deviceRegion = parsedRegion
        form.deviceInstallDate = parsedDate
      }
    } else {
      configStatus.value = 'error'
      showError(t('superPanel.config.page.loadDataAbnormal'))
    }
  } catch (err) {
    configStatus.value = 'error'
    console.error('[参数配置] 加载配置失败:', err)
    showError(t('superPanel.config.page.loadNetworkError'))
  } finally {
    loading.value = false
  }
}

async function handleSave(): Promise<void> {
  if (configStatus.value !== 'ready') {
    const statusMsg: Record<ConfigStatus, string> = {
      loading: t('superPanel.config.page.statusLoading'),
      incomplete: t('superPanel.config.page.statusIncomplete'),
      error: t('superPanel.config.page.statusLoadError'),
      ready: ''
    }
    showError(statusMsg[configStatus.value] || t('superPanel.config.page.statusAbnormal'))
    return
  }
  const missingKeys = checkConfigCompleteness(form)
  if (missingKeys.length > 0) {
    showError(t('superPanel.config.page.missingItems', { count: missingKeys.length, items: missingKeys.join(', ') }))
    return
  }
  loading.value = true
  try {
    const res = await requestUpdateConfigsApi(form)
    if (res.code === 200) {
      applyConfig((res.data as ConfigMap) || form)
      const cityInfo = getCoordsByValues(form.deviceRegion as string[])
      deviceStore.setDeviceInfo({
        name: form.deviceName,
        code: form.deviceCode,
        location: cityInfo ? `${cityInfo.countryNameZh}·${cityInfo.nameZh}` : '',
        locationCode: form.deviceRegion,
        locationCoords: cityInfo ? { lng: cityInfo.lng, lat: cityInfo.lat } : null,
        installDate: form.deviceInstallDate
      })
      showSuccess(t('common.message.saveSuccess'))
    } else {
      showError(t('superPanel.config.page.saveFailedRetry'))
    }
  } catch (err) {
    console.error('[参数配置] 保存配置失败:', err)
    showError(t('superPanel.config.page.saveFailedNetwork'))
  } finally {
    loading.value = false
  }
}

function handleReset(): void {
  if (configStatus.value !== 'ready') {
    showWarning(t('superPanel.config.page.resetNotAllowed'))
    return
  }
  requestResetConfigsApi()
    .then((res) => {
      if (res.code === 200 && res.data) {
        const data = res.data as ConfigMap
        const missingKeys = checkConfigCompleteness(data)
        if (missingKeys.length > 0) {
          configStatus.value = 'incomplete'
          missingConfigKeys.value = missingKeys
          showWarning(t('superPanel.config.page.resetMissingItems', { count: missingKeys.length }))
          return
        }
        configStatus.value = 'ready'
        assignFormData(data)
        normalizeFlags()
        applyConfig(form)
        showSuccess(t('common.message.resetSuccess'))
      } else {
        showError(t('superPanel.config.page.resetFailedRetry'))
      }
    })
    .catch((err) => {
      console.error('[参数配置] 重置配置失败:', err)
      showError(t('superPanel.config.page.resetFailedNetwork'))
    })
}

onMounted(() => {
  loadConfigs()
})
</script>

<style scoped lang="less">
.system-config-container {
  padding: 0;
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;

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
    flex-shrink: 0;
    .header-left {
      .page-title {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        color: #303133;
      }
      .page-desc {
        margin: 0;
        font-size: 13px;
        color: #909399;
      }
    }
    .header-right {
      display: flex;
      gap: 10px;
    }
  }

  .config-body {
    flex: 1;
    display: flex;
    gap: 20px;
    overflow: hidden;

    .config-sidebar {
      width: 200px;
      flex-shrink: 0;
      background: #fff;
      border-radius: 8px;
      padding: 10px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      .menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        cursor: pointer;
        font-size: 14px;
        color: #606266;
        transition: all 0.2s;
        border-left: 3px solid transparent;
        :deep(svg) {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }
        &:hover {
          background: #f5f7fa;
          color: #409eff;
        }
        &.active {
          background: #ecf5ff;
          color: #409eff;
          border-left-color: #409eff;
          font-weight: 500;
        }
      }
    }

    .config-content {
      flex: 1;
      background: #fff;
      border-radius: 8px;
      padding: 30px 40px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      overflow-y: auto;

      .config-status-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        height: 100%;
      }
      .config-status-loading {
        text-align: center;
        .status-icon {
          font-size: 48px;
          color: #409eff;
        }
        .status-text {
          margin-top: 16px;
          font-size: 14px;
          color: #606266;
        }
      }
      .config-status-error {
        text-align: center;
        .status-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }
        .error-icon {
          color: #f56c6c;
        }
        .status-title {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 8px 0;
        }
        .status-desc {
          font-size: 14px;
          color: #909399;
          margin: 0 0 24px 0;
        }
      }
      .config-status-incomplete {
        width: 100%;
        max-width: 700px;
        .incomplete-alert {
          margin-bottom: 20px;
          :deep(.el-alert__description) {
            margin-top: 12px;
          }
          .incomplete-desc {
            font-size: 14px;
            color: #606266;
            margin: 0 0 12px 0;
          }
          .missing-keys-list {
            background: #fdf6ec;
            border: 1px solid #faecd8;
            border-radius: 4px;
            padding: 12px 16px;
            margin: 12px 0;
            .missing-keys-title {
              font-size: 13px;
              font-weight: 600;
              color: #e6a23c;
              margin: 0 0 8px 0;
            }
            ul {
              margin: 0;
              padding-left: 20px;
              li {
                font-size: 13px;
                color: #606266;
                line-height: 1.8;
                font-family: Consolas, Monaco, monospace;
              }
            }
          }
          .incomplete-tip {
            font-size: 13px;
            color: #909399;
            margin: 12px 0 0 0;
          }
        }
        .incomplete-actions {
          text-align: center;
        }
      }

      .config-panel {
        .panel-title {
          margin: 0 0 25px 0;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f2f5;
        }
        :deep(.el-form-item) {
          margin-bottom: 22px;
        }
        :deep(.el-form-item__label) {
          font-size: 14px;
          color: #606266;
        }
        .unit-text {
          margin-left: 10px;
          font-size: 13px;
          color: #909399;
        }
      }
    }
  }
}

.config-label-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
.tip-icon {
  font-size: 14px;
  color: #c0c4cc;
  cursor: help;
  transition: color 0.2s;
  &:hover {
    color: #409eff;
  }
}
</style>
