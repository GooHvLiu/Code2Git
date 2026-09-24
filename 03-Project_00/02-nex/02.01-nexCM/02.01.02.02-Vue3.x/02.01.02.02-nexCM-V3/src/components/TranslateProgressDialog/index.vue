<template>
  <div class="translate-progress-wrapper">
    <!-- 完整进度弹窗 -->
    <div
      v-if="translateManager.state.dialogVisible && !translateManager.state.isMinimized"
      class="translate-progress-dialog"
      :style="dialogStyle"
      @mousedown="startDrag"
    >
      <!-- 标题栏 -->
      <div class="dialog-header">
        <div class="header-title">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span v-if="translateManager.state.nodePath">{{ t('superPanel.i18n.translate.node') }}</span>
          <span v-else>{{ t('superPanel.i18n.translate.progress') }}</span>
          <span class="target-lang">{{ translateManager.state.targetLangName }}</span>
          <span v-if="translateManager.state.nodePath" class="node-label" :title="translateManager.state.nodePath">
            [{{ translateManager.state.nodeLabel }}]
          </span>
        </div>
        <div class="header-actions">
          <button class="action-btn" :title="t('superPanel.i18n.translate.minimize')" @click.stop="handleMinimize">
            <el-icon><Minus /></el-icon>
          </button>
          <button
            class="action-btn cancel-btn"
            :class="{ disabled: !translateManager.state.isTranslating }"
            :title="t('superPanel.i18n.translate.cancel')"
            @click.stop="handleCancel"
          >
            <el-icon><CircleClose /></el-icon>
          </button>
          <button class="action-btn close-btn" :title="t('superPanel.i18n.translate.close')" @click.stop="handleClose">
            <el-icon><Close /></el-icon>
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="dialog-body" @mousedown.stop>
        <!-- 进度条 -->
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">{{ t('superPanel.i18n.translate.progress') }}</span>
            <span class="progress-percent">{{ progressPercent }}%</span>
          </div>
          <el-progress :percentage="progressPercent" :status="progressStatus" :stroke-width="12" />
        </div>

        <!-- 统计信息 -->
        <div class="stats-section">
          <div class="stat-item">
            <span class="stat-label">{{ t('superPanel.i18n.translate.totalCount') }}</span>
            <span class="stat-value">{{ translateManager.state.totalCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ t('superPanel.i18n.translate.currentCount') }}</span>
            <span class="stat-value">{{ translateManager.state.currentCount }}</span>
          </div>
          <div class="stat-item success">
            <span class="stat-label">{{ t('superPanel.i18n.translate.successCount') }}</span>
            <span class="stat-value">{{ translateManager.state.successCount }}</span>
          </div>
          <div class="stat-item fail">
            <span class="stat-label">{{ t('superPanel.i18n.translate.failCount') }}</span>
            <span class="stat-value">{{ translateManager.state.failCount }}</span>
          </div>
        </div>

        <!-- 当前翻译项 -->
        <div v-if="translateManager.state.currentKey" class="current-item">
          <div class="current-label">{{ t('superPanel.i18n.translate.currentStatus') }}</div>
          <div class="current-key" :title="translateManager.state.currentKey">
            {{ translateManager.state.currentKey }}
          </div>
          <div
            v-if="translateManager.state.currentValue"
            class="current-value"
            :title="translateManager.state.currentValue"
          >
            "{{ translateManager.state.currentValue }}"
          </div>
        </div>

        <!-- 翻译完成提示 -->
        <div v-if="!translateManager.state.isTranslating && translateManager.state.result" class="result-section">
          <el-alert
            :title="translateManager.state.result.message"
            :type="translateManager.state.result.success ? 'success' : 'error'"
            :closable="false"
            show-icon
          />
          <div class="result-actions">
            <el-button size="small" type="primary" @click="handleClose">
              {{ t('common.confirm') }}
            </el-button>
          </div>
        </div>

        <!-- 提示信息 -->
        <div v-if="translateManager.state.isTranslating" class="tip-section">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ t('superPanel.i18n.translate.tip') }}</span>
        </div>
      </div>
    </div>

    <!-- 最小化后的悬浮进度条 -->
    <div
      v-if="translateManager.state.dialogVisible && translateManager.state.isMinimized"
      class="translate-progress-mini"
      @click="handleRestore"
    >
      <div class="mini-header">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span class="mini-title">{{ t('superPanel.i18n.translate.status') }}</span>
        <span class="mini-percent">{{ progressPercent }}%</span>
      </div>
      <div class="mini-progress">
        <div class="mini-progress-bar" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="mini-info">
        <span>{{ translateManager.state.currentCount }}/{{ translateManager.state.totalCount }}</span>
        <span class="mini-success">✓ {{ translateManager.state.successCount }}</span>
        <span class="mini-fail">✗ {{ translateManager.state.failCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 翻译进度弹窗（可拖拽 / 可最小化）
 * 数据源为 @/utils/business/translateManager 单例（super-panel i18n 迁移 shard 提供）。
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loading, Minus, CircleClose, Close, InfoFilled } from '@element-plus/icons-vue'
import translateManager from '@/utils/business/translateManager'
import { confirmAction } from '@/utils/ui/feedback'

defineOptions({ name: 'TranslateProgressDialog' })

const { t } = useI18n()

const dialogPosition = reactive({ x: 0, y: 0 })
const isDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })

const progressPercent = computed<number>(() => translateManager.getProgressPercent())

const progressStatus = computed<'' | 'success' | 'exception' | undefined>(() => {
  if (!translateManager.state.isTranslating) {
    return translateManager.state.result?.success ? 'success' : 'exception'
  }
  return undefined
})

const dialogStyle = computed(() => ({
  left: dialogPosition.x + 'px',
  top: dialogPosition.y + 'px'
}))

function initDialogPosition(): void {
  const dialogWidth = 480
  const dialogHeight = 380
  dialogPosition.x = (window.innerWidth - dialogWidth) / 2 + 100
  dialogPosition.y = (window.innerHeight - dialogHeight) / 2
}

function handleResize(): void {
  if (dialogPosition.x > window.innerWidth - 100) dialogPosition.x = window.innerWidth - 200
  if (dialogPosition.y > window.innerHeight - 100) dialogPosition.y = window.innerHeight - 200
}

function startDrag(e: MouseEvent): void {
  const target = e.target as HTMLElement
  if (target.closest('.header-actions') || target.closest('.dialog-body')) return
  isDragging.value = true
  dragOffset.x = e.clientX - dialogPosition.x
  dragOffset.y = e.clientY - dialogPosition.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent): void {
  if (!isDragging.value) return
  dialogPosition.x = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 100))
  dialogPosition.y = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 50))
}

function stopDrag(): void {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function handleMinimize(): void {
  translateManager.minimize()
}

function handleRestore(): void {
  translateManager.restore()
}

async function handleCancel(): Promise<void> {
  if (!translateManager.state.isTranslating) return
  try {
    await confirmAction(t('superPanel.i18n.translate.cancelConfirm'), t('superPanel.i18n.translate.cancel'), {
      type: 'warning',
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel')
    })
    translateManager.cancelTranslate()
  } catch {
    // 用户取消
  }
}

function handleClose(): void {
  translateManager.hideDialog()
}

onMounted(() => {
  initDialogPosition()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.translate-progress-dialog {
  position: fixed;
  z-index: 9999;
  width: 480px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  user-select: none;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  cursor: move;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.header-title .el-icon.is-loading {
  animation: rotating 2s linear infinite;
}

.target-lang {
  font-weight: 400;
  opacity: 0.9;
  font-size: 13px;
}

.node-label {
  font-weight: 400;
  opacity: 0.8;
  font-size: 12px;
  color: #409eff;
  margin-left: 4px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
.action-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.action-btn.cancel-btn:hover {
  background: #e6a23c;
}
.action-btn.close-btn:hover {
  background: #f56c6c;
}

.dialog-body {
  padding: 16px;
  cursor: default;
}

.progress-section {
  margin-bottom: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}
.progress-percent {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #909399;
  margin-bottom: 4px;
}
.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
.stat-item.success .stat-value {
  color: #67c23a;
}
.stat-item.fail .stat-value {
  color: #f56c6c;
}

.current-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.current-label {
  font-size: 11px;
  color: #909399;
  margin-bottom: 4px;
}

.current-key {
  font-size: 12px;
  color: #303133;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.current-value {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-section {
  margin-bottom: 16px;
}
.result-actions {
  margin-top: 12px;
  text-align: center;
}

.tip-section {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #fdf6ec;
  border-radius: 4px;
  font-size: 12px;
  color: #e6a23c;
}

.translate-progress-mini {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
  width: 240px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 12px;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.translate-progress-mini:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
}

.mini-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.mini-header .el-icon.is-loading {
  animation: rotating 2s linear infinite;
  color: #409eff;
}
.mini-title {
  font-size: 12px;
  color: #606266;
  flex: 1;
}
.mini-percent {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
}

.mini-progress {
  height: 6px;
  background: #ebeef5;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.mini-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.3s;
}

.mini-info {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #909399;
}

.mini-success {
  color: #67c23a;
}
.mini-fail {
  color: #f56c6c;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
