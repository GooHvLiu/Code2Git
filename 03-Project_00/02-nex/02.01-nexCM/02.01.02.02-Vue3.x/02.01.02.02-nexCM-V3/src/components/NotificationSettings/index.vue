<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('notification.settings.title')"
    width="560px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-loading="loading" :element-loading-text="t('common.loading')" class="notification-settings">
      <!-- 通知类型开关 -->
      <div class="settings-section">
        <div class="section-title">
          <el-icon><Bell /></el-icon>
          <span>{{ t('notification.settings.notificationTypes') }}</span>
        </div>
        <div class="section-desc">{{ t('notification.settings.typeEnabled') }}</div>
        <div class="type-list">
          <div v-for="(nameKey, key) in typeList" :key="key" class="type-item">
            <span class="type-name">{{ t(nameKey) }}</span>
            <el-switch v-model="settings.typeEnabled[key]" active-color="#409eff" @change="handleTypeChange" />
          </div>
        </div>
      </div>

      <!-- 免打扰时间段 -->
      <div class="settings-section">
        <div class="section-title">
          <el-icon><Clock /></el-icon>
          <span>{{ t('notification.settings.doNotDisturb') }}</span>
          <el-switch v-model="settings.doNotDisturb.enabled" active-color="#409eff" style="margin-left: auto" />
        </div>
        <div class="section-desc">{{ t('notification.settings.doNotDisturbEnabled') }}</div>
        <div v-if="settings.doNotDisturb.enabled" class="time-range">
          <el-time-picker
            v-model="settings.doNotDisturb.startTime"
            format="HH:mm"
            value-format="HH:mm"
            :placeholder="t('notification.settings.startTime')"
            size="small"
            style="width: 140px"
          />
          <span class="time-separator">{{ t('notification.filter.to') }}</span>
          <el-time-picker
            v-model="settings.doNotDisturb.endTime"
            format="HH:mm"
            value-format="HH:mm"
            :placeholder="t('notification.settings.endTime')"
            size="small"
            style="width: 140px"
          />
        </div>
      </div>

      <!-- 提醒方式 -->
      <div class="settings-section">
        <div class="section-title">
          <el-icon><Setting /></el-icon>
          <span>{{ t('notification.settings.reminderMethods') }}</span>
        </div>
        <div class="section-desc">{{ t('notification.settings.reminderMethodsDesc') }}</div>
        <div class="reminder-list">
          <div class="reminder-item">
            <div class="reminder-info">
              <span class="reminder-name">{{ t('notification.settings.soundEnabled') }}</span>
            </div>
            <el-switch v-model="settings.soundEnabled" active-color="#409eff" />
          </div>
          <div class="reminder-item">
            <div class="reminder-info">
              <span class="reminder-name">{{ t('notification.settings.popupEnabled') }}</span>
            </div>
            <el-switch v-model="settings.popupEnabled" active-color="#409eff" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          {{ t('notification.settings.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * 通知设置弹窗（v-model 控制显隐）
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bell, Clock, Setting } from '@element-plus/icons-vue'
import { requestGetNotificationSettingsApi, requestUpdateNotificationSettingsApi } from '@/api'
import { showSuccess, showError } from '@/utils/ui/feedback'

defineOptions({ name: 'NotificationSettings' })

interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'updated', settings: NotificationSettingsData): void
}>()

const { t } = useI18n()

interface DoNotDisturb {
  enabled: boolean
  startTime: string
  endTime: string
}

interface NotificationSettingsData {
  typeEnabled: Record<string, boolean>
  doNotDisturb: DoNotDisturb
  soundEnabled: boolean
  popupEnabled: boolean
  [key: string]: unknown
}

const typeList: Record<string, string> = {
  system: 'notification.settings.system',
  plc: 'notification.settings.plc',
  user: 'notification.settings.user',
  audit: 'notification.settings.audit',
  device: 'notification.settings.device',
  connection: 'notification.settings.connection'
}

const defaultSettings: NotificationSettingsData = {
  typeEnabled: { system: true, plc: true, user: true, audit: true, device: true, connection: true },
  doNotDisturb: { enabled: false, startTime: '22:00', endTime: '08:00' },
  soundEnabled: true,
  popupEnabled: true
}

const dialogVisible = ref(props.modelValue)
const loading = ref(false)
const saving = ref(false)
const settings = reactive<NotificationSettingsData>({ ...defaultSettings })

watch(
  () => props.modelValue,
  val => {
    dialogVisible.value = val
    if (val) loadSettings()
  }
)

watch(dialogVisible, val => {
  emit('update:modelValue', val)
})

async function loadSettings(): Promise<void> {
  loading.value = true
  try {
    const res = await requestGetNotificationSettingsApi()
    const remote = (res.data as { settings?: Partial<NotificationSettingsData> })?.settings
    if (remote) {
      Object.assign(settings, remote)
      Object.keys(typeList).forEach(key => {
        if (settings.typeEnabled[key] === undefined) settings.typeEnabled[key] = true
      })
    }
  } catch {
    // 加载失败，使用默认设置
  } finally {
    loading.value = false
  }
}

function handleTypeChange(): void {
  // 类型开关变化（可扩展实时预览）
}

async function handleSave(): Promise<void> {
  saving.value = true
  try {
    await requestUpdateNotificationSettingsApi(settings)
    showSuccess(t('notification.settings.saveSuccess'))
    emit('updated', settings)
    handleClose()
  } catch {
    showError(t('notification.page.operationFailed'))
  } finally {
    saving.value = false
  }
}

function handleClose(): void {
  dialogVisible.value = false
}
</script>

<style scoped lang="less">
.notification-settings {
  .settings-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 8px;

      .el-icon {
        color: #409eff;
      }
    }

    .section-desc {
      font-size: 12px;
      color: #909399;
      margin-bottom: 12px;
    }
  }

  .type-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .type-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      background: #f5f7fa;
      border-radius: 4px;

      .type-name {
        font-size: 13px;
        color: #606266;
      }
    }
  }

  .time-range {
    display: flex;
    align-items: center;
    gap: 12px;

    .time-separator {
      color: #909399;
    }
  }

  .reminder-list {
    .reminder-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 4px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .reminder-info .reminder-name {
        display: block;
        font-size: 13px;
        color: #303133;
        font-weight: 500;
      }
    }
  }
}
</style>
