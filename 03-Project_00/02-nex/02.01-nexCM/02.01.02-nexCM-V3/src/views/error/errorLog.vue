<template>
  <!--
    错误日志查看页面
    展示 store/modules/errorLog.js 收集到的前端错误
    用于开发环境排查问题
  -->
  <div class="error-log-page">
    <!-- 工具栏 -->
    <div class="toolbar">
      <span class="total">共 {{ errorLogs.length }} 条错误</span>
      <el-button type="danger" size="small" @click="handleClear" :disabled="errorLogs.length === 0">
        清空日志
      </el-button>
    </div>

    <!-- 错误列表 -->
    <div class="error-list" v-loading="false">
      <div v-if="errorLogs.length === 0" class="empty">
        <i class="el-icon-circle-check"></i>
        <span>暂无错误日志</span>
      </div>

      <div
        v-for="(log, index) in errorLogs"
        :key="index"
        class="error-item"
      >
        <div class="error-header">
          <span class="error-message">{{ log.message }}</span>
          <span class="error-time">{{ formatTime(log.time) }}</span>
        </div>
        <div class="error-info" v-if="log.info">
          <span class="label">触发位置：</span>{{ log.info }}
        </div>
        <div class="error-url" v-if="log.url">
          <span class="label">页面地址：</span>{{ log.url }}
        </div>
        <div class="error-stack" v-if="log.stack" @click="toggleExpand(index)">
          <span class="label">堆栈信息</span>
          <i :class="expandedIndex === index ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          <pre v-show="expandedIndex === index">{{ log.stack }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { formatDate } from '@/utils/date'


// ===== 响应式数据 =====
/** 展开的堆栈索引 */
const expandedIndex = ref(-1)

// ===== 计算属性 =====
const errorLogs = computed(() => store.getters.errorLogs)

// ===== 方法 =====
/** 格式化时间 */
function formatTime(time) {
  return formatDate(time, 'YYYY-MM-DD HH:mm:ss')
}

/** 切换堆栈展开 */
function toggleExpand(index) {
  expandedIndex.value = expandedIndex.value === index ? -1 : index
}

/** 清空日志 */
async function handleClear() {
  const ok = await MessageBox.confirm('确定要清空所有错误日志吗？', '提示', {
    type: 'warning'
  }).catch(() => false)
  if (ok) {
    store.dispatch('errorLog/clearErrorLog')
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

    i {
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

    .label {
      color: @text-placeholder;
    }
  }

  .error-stack {
    cursor: pointer;
    font-size: @font-size-sm;
    color: @text-secondary;

    .label {
      color: @text-placeholder;
    }

    i {
      margin-left: @spacing-xs;
    }

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
