<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="$t('notification.settings.title')"
    width="560px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-loading="loading" class="notification-settings">
      <!-- 通知类型开关 -->
      <div class="settings-section">
        <div class="section-title">
          <i class="el-icon-bell"></i>
          <span>{{ $t('notification.settings.notificationTypes') }}</span>
        </div>
        <div class="section-desc">{{ $t('notification.settings.typeEnabled') }}</div>
        <div class="type-list">
          <div v-for="(nameKey, key) in typeList" :key="key" class="type-item">
            <span class="type-name">{{ $t(nameKey) }}</span>
            <el-switch
              v-model="settings.typeEnabled[key]"
              active-color="#409eff"
              @change="handleTypeChange"
            />
          </div>
        </div>
      </div>

      <!-- 免打扰时间段 -->
      <div class="settings-section">
        <div class="section-title">
          <i class="el-icon-time"></i>
          <span>{{ $t('notification.settings.doNotDisturb') }}</span>
          <el-switch
            v-model="settings.doNotDisturb.enabled"
            active-color="#409eff"
            style="margin-left: auto;"
          />
        </div>
        <div class="section-desc">{{ $t('notification.settings.doNotDisturbEnabled') }}</div>
        <div v-if="settings.doNotDisturb.enabled" class="time-range">
          <el-time-picker
            v-model="settings.doNotDisturb.startTime"
            format="HH:mm"
            value-format="HH:mm"
            :placeholder="$t('notification.settings.startTime')"
            size="small"
            style="width: 140px;"
          />
          <span class="time-separator">{{ $t('notification.to') }}</span>
          <el-time-picker
            v-model="settings.doNotDisturb.endTime"
            format="HH:mm"
            value-format="HH:mm"
            :placeholder="$t('notification.settings.endTime')"
            size="small"
            style="width: 140px;"
          />
        </div>
      </div>

      <!-- 提醒方式 -->
      <div class="settings-section">
        <div class="section-title">
          <i class="el-icon-setting"></i>
          <span>{{ $t('notification.settings.reminderMethods') }}</span>
        </div>
        <div class="section-desc">{{ $t('notification.settings.reminderMethodsDesc') }}</div>
        <div class="reminder-list">
          <div class="reminder-item">
            <div class="reminder-info">
              <span class="reminder-name">{{ $t('notification.settings.soundEnabled') }}</span>
            </div>
            <el-switch
              v-model="settings.soundEnabled"
              active-color="#409eff"
            />
          </div>
          <div class="reminder-item">
            <div class="reminder-info">
              <span class="reminder-name">{{ $t('notification.settings.popupEnabled') }}</span>
            </div>
            <el-switch
              v-model="settings.popupEnabled"
              active-color="#409eff"
            />
          </div>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">{{ $t('notification.settings.save') }}</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, getCurrentInstance } from 'vue'
import { Message } from 'element-ui'
import {
  requestGetNotificationSettingsApi,
  requestUpdateNotificationSettingsApi
} from '@/api'

const props = defineProps({
  value: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['input', 'updated'])

// 获取 i18n 实例
const { proxy } = getCurrentInstance()
const $t = proxy.$t.bind(proxy)

// 弹窗显示状态
const dialogVisible = ref(props.value)

// 加载状态
const loading = ref(false)
const saving = ref(false)

// 通知类型列表（使用国际化 key）
const typeList = {
  system: 'notification.settings.system',
  plc: 'notification.settings.plc',
  user: 'notification.settings.user',
  audit: 'notification.settings.audit',
  device: 'notification.settings.device',
  connection: 'notification.settings.connection'
}

// 默认设置
const defaultSettings = {
  typeEnabled: {
    system: true,
    plc: true,
    user: true,
    audit: true,
    device: true,
    connection: true
  },
  doNotDisturb: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  },
  soundEnabled: true,
  popupEnabled: true
}

// 设置数据
const settings = reactive({ ...defaultSettings })

// 监听弹窗显示
watch(() => props.value, (val) => {
  dialogVisible.value = val
  if (val) {
    loadSettings()
  }
})

watch(dialogVisible, (val) => {
  emit('input', val)
})

// 加载设置
async function loadSettings() {
  loading.value = true
  try {
    const res = await requestGetNotificationSettingsApi()
    if (res.data?.settings) {
      Object.assign(settings, res.data.settings)
      // 确保 typeEnabled 包含所有类型
      Object.keys(typeList).forEach(key => {
        if (settings.typeEnabled[key] === undefined) {
          settings.typeEnabled[key] = true
        }
      })
    }
  } catch (e) {
    // 加载失败，使用默认设置
  } finally {
    loading.value = false
  }
}

// 类型开关改变
function handleTypeChange() {
  // 可以在这里添加实时预览或验证
}

// 保存设置
async function handleSave() {
  saving.value = true
  try {
    await requestUpdateNotificationSettingsApi(settings)
    Message.success($t('notification.settings.saveSuccess'))
    emit('updated', settings)
    handleClose()
  } catch (e) {
    Message.error($t('notification.operationFailed'))
  } finally {
    saving.value = false
  }
}

// 关闭弹窗
function handleClose() {
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

      i {
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

      .reminder-info {
        .reminder-name {
          display: block;
          font-size: 13px;
          color: #303133;
          font-weight: 500;
        }

        .reminder-desc {
          display: block;
          font-size: 12px;
          color: #909399;
          margin-top: 2px;
        }
      }
    }
  }
}
</style>
