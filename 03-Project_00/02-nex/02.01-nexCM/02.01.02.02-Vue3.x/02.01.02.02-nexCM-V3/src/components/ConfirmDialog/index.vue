<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    :append-to-body="true"
    class="confirm-dialog"
    @close="handleClose"
  >
    <div class="confirm-content">
      <div class="confirm-icon" :class="type">
        <el-icon><component :is="iconComponent" /></el-icon>
      </div>
      <div class="confirm-text">
        <p v-if="showTitle" class="confirm-title">{{ titleText }}</p>
        <p class="confirm-message">{{ message }}</p>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">{{ cancelText || t('common.cancel') }}</el-button>
        <el-button :type="confirmType" :loading="loading" @click="handleConfirm">
          {{ confirmText || t('common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * 确认弹窗组件
 * 通过 ref 调用 open() 打开，emit confirm / cancel / close。
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { WarningFilled, CircleCloseFilled, InfoFilled, CircleCheckFilled } from '@element-plus/icons-vue'
import type { Component } from 'vue'

defineOptions({ name: 'ConfirmDialog' })

type DialogType = 'warning' | 'error' | 'info' | 'success'

interface Props {
  /** 弹窗标题 */
  title?: string
  /** 提示内容 */
  message: string
  /** 弹窗宽度 */
  width?: string
  /** 类型：warning / error / info / success */
  type?: DialogType
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认按钮类型 */
  confirmType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** 是否显示标题文字 */
  showTitle?: boolean
  /** 标题文字 */
  titleText?: string
  /** 加载状态 */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: '420px',
  type: 'warning',
  confirmText: '',
  cancelText: '',
  confirmType: 'primary',
  showTitle: false,
  titleText: '',
  loading: false
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const { t } = useI18n()

const dialogVisible = ref(false)

const iconMap: Record<DialogType, Component> = {
  warning: WarningFilled,
  error: CircleCloseFilled,
  info: InfoFilled,
  success: CircleCheckFilled
}

const iconComponent = computed<Component>(() => iconMap[props.type] || iconMap.warning)

/** 打开弹窗 */
function open(): void {
  dialogVisible.value = true
}

/** 关闭弹窗 */
function close(): void {
  dialogVisible.value = false
}

function handleConfirm(): void {
  emit('confirm')
}

function handleCancel(): void {
  emit('cancel')
  dialogVisible.value = false
}

function handleClose(): void {
  emit('close')
}

defineExpose({ open, close })
</script>

<style scoped lang="less">
.confirm-dialog {
  .confirm-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 0;
  }

  .confirm-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 22px;

    &.warning {
      background: #fdf6ec;
      color: #e6a23c;
    }

    &.error {
      background: #fef0f0;
      color: #f56c6c;
    }

    &.info {
      background: #ecf5ff;
      color: #409eff;
    }

    &.success {
      background: #f0f9eb;
      color: #67c23a;
    }
  }

  .confirm-text {
    flex: 1;
    padding-top: 4px;
  }

  .confirm-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 8px 0;
  }

  .confirm-message {
    font-size: 13px;
    color: #606266;
    line-height: 1.6;
    margin: 0;
  }
}
</style>
