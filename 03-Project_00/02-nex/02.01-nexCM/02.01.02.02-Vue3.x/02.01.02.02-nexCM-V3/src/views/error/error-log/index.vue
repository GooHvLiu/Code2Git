<template>
  <!-- 错误日志查看页：展示 errorLog store 收集到的前端错误，用于开发排查。作者：GooHv -->
  <div class="error-log-page">
    <div class="toolbar">
      <span class="total">{{ t('system.errorLog.total', { count: errorLogs.length }) }}</span>
      <el-button type="danger" size="small" :disabled="errorLogs.length === 0" @click="handleClear">
        {{ t('system.errorLog.clear') }}
      </el-button>
    </div>

    <div class="error-list">
      <div v-if="errorLogs.length === 0" class="empty">
        <el-icon class="empty-icon"><CircleCheckFilled /></el-icon>
        <span>{{ t('system.errorLog.empty') }}</span>
      </div>

      <div v-for="(log, index) in errorLogs" :key="index" class="error-item">
        <div class="error-header">
          <span class="error-message">{{ log.message }}</span>
          <span class="error-time">{{ formatTime(log.time) }}</span>
        </div>
        <div v-if="log.info" class="error-info">
          <span class="label">{{ t('system.errorLog.triggerLocation') }}</span>{{ log.info }}
        </div>
        <div v-if="log.url" class="error-url">
          <span class="label">{{ t('system.errorLog.pageUrl') }}</span>{{ log.url }}
        </div>
        <div v-if="log.stack" class="error-stack" @click="toggleExpand(index)">
          <span class="label">{{ t('system.errorLog.stackInfo') }}</span>
          <el-icon><component :is="expandedIndex === index ? ArrowUp : ArrowDown" /></el-icon>
          <pre v-show="expandedIndex === index">{{ log.stack }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 错误日志查看页
 * 作者：GooHv
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CircleCheckFilled, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { useErrorLogStore } from '@/store/modules/errorLog'
import { formatDate } from '@/utils/data/date'
import { confirmAction } from '@/utils/ui/feedback'

const { t } = useI18n()
const errorLogStore = useErrorLogStore()

const expandedIndex = ref(-1)
const errorLogs = computed(() => errorLogStore.logs)

function formatTime(time: string): string {
  return formatDate(time, 'YYYY-MM-DD HH:mm:ss')
}

function toggleExpand(index: number): void {
  expandedIndex.value = expandedIndex.value === index ? -1 : index
}

async function handleClear(): Promise<void> {
  const ok = await confirmAction(t('system.errorLog.clearConfirm'), t('system.errorLog.title'), { type: 'warning' })
  if (ok) {
    errorLogStore.clearErrorLog()
    expandedIndex.value = -1
  }
}
</script>

<style scoped lang="less">
.error-log-page {
  padding: @spacing-md;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-md;

  .total {
    font-size: @font-size-base;
    color: @text-secondary;
  }
}

.error-list {
  .empty {
    text-align: center;
    padding: @spacing-xxl * 2;
    color: @text-placeholder;

    .empty-icon {
      font-size: 48px;
      display: block;
      margin-bottom: @spacing-md;
      color: @success-color;
    }
  }
}

.error-item {
  background: @bg-white;
  border: 1px solid @border-light;
  border-radius: @border-radius-base;
  padding: @spacing-md;
  margin-bottom: @spacing-md;

  .error-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @spacing-sm;

    .error-message {
      color: @danger-color;
      font-weight: 500;
      word-break: break-all;
    }
    .error-time {
      font-size: @font-size-sm;
      color: @text-placeholder;
      flex-shrink: 0;
      margin-left: @spacing-md;
    }
  }

  .error-info,
  .error-url {
    font-size: @font-size-sm;
    color: @text-secondary;
    margin-bottom: @spacing-xs;
    word-break: break-all;

    .label { color: @text-placeholder; }
  }

  .error-stack {
    cursor: pointer;
    font-size: @font-size-sm;
    color: @text-secondary;

    .label { color: @text-placeholder; }
    .el-icon { margin-left: @spacing-xs; }

    pre {
      margin-top: @spacing-sm;
      padding: @spacing-sm;
      background: @bg-page;
      border-radius: @border-radius-sm;
      font-size: @font-size-xs;
      color: @text-secondary;
      overflow-x: auto;
      max-height: 300px;
    }
  }
}
</style>
