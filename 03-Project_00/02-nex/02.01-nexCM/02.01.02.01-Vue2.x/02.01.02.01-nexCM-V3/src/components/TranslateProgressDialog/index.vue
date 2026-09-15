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
        <i class="el-icon-loading"></i>
        <span v-if="translateManager.state.nodePath">{{ $t('superPanel.i18n.translate.node') }}</span>
        <span v-else>{{ $t('superPanel.i18n.translate.progress') }}</span>
        <span class="target-lang">{{ translateManager.state.targetLangName }}</span>
        <span v-if="translateManager.state.nodePath" class="node-label" :title="translateManager.state.nodePath">
          [{{ translateManager.state.nodeLabel }}]
        </span>
      </div>
      <div class="header-actions">
        <!-- 最小化按钮 -->
        <button class="action-btn" :title="$t('superPanel.i18n.translate.minimize')" @click.stop="handleMinimize">
          <i class="el-icon-minus"></i>
        </button>
        <!-- 取消翻译按钮 -->
        <button
          class="action-btn cancel-btn"
          :class="{ disabled: !translateManager.state.isTranslating }"
          :title="$t('superPanel.i18n.translate.cancel')"
          @click.stop="handleCancel"
        >
          <i class="el-icon-remove-outline"></i>
        </button>
        <!-- 关闭按钮 -->
        <button class="action-btn close-btn" :title="$t('superPanel.i18n.translate.close')" @click.stop="handleClose">
          <i class="el-icon-close"></i>
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="dialog-body" @mousedown.stop>
      <!-- 进度条 -->
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-label">{{ $t('superPanel.i18n.translate.progress') }}</span>
          <span class="progress-percent">{{ progressPercent }}%</span>
        </div>
        <el-progress
          :percentage="progressPercent"
          :status="progressStatus"
          :stroke-width="12"
        ></el-progress>
      </div>

      <!-- 统计信息 -->
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-label">{{ $t('superPanel.i18n.translate.totalCount') }}</span>
          <span class="stat-value">{{ translateManager.state.totalCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{ $t('superPanel.i18n.translate.currentCount') }}</span>
          <span class="stat-value">{{ translateManager.state.currentCount }}</span>
        </div>
        <div class="stat-item success">
          <span class="stat-label">{{ $t('superPanel.i18n.translate.successCount') }}</span>
          <span class="stat-value">{{ translateManager.state.successCount }}</span>
        </div>
        <div class="stat-item fail">
          <span class="stat-label">{{ $t('superPanel.i18n.translate.failCount') }}</span>
          <span class="stat-value">{{ translateManager.state.failCount }}</span>
        </div>
      </div>

      <!-- 当前翻译项 -->
      <div class="current-item" v-if="translateManager.state.currentKey">
        <div class="current-label">{{ $t('superPanel.i18n.translate.currentStatus') }}</div>
        <div class="current-key" :title="translateManager.state.currentKey">
          {{ translateManager.state.currentKey }}
        </div>
        <div class="current-value" :title="translateManager.state.currentValue" v-if="translateManager.state.currentValue">
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
        ></el-alert>
        <div class="result-actions">
          <el-button size="small" type="primary" @click="handleClose">
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="tip-section" v-if="translateManager.state.isTranslating">
        <i class="el-icon-info"></i>
        <span>{{ $t('superPanel.i18n.translate.tip') }}</span>
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
      <i class="el-icon-loading"></i>
      <span class="mini-title">{{ $t('superPanel.i18n.translate.status') }}</span>
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

<script>
import translateManager from '@/utils/business/translateManager'
import { MessageBox } from 'element-ui'

export default {
  name: 'TranslateProgressDialog',
  data() {
    return {
      translateManager,
      // 弹窗位置
      dialogPosition: {
        x: 0,
        y: 0
      },
      // 拖拽状态
      isDragging: false,
      dragOffset: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    // 进度百分比
    progressPercent() {
      return translateManager.getProgressPercent()
    },
    // 进度条状态
    progressStatus() {
      if (!translateManager.state.isTranslating) {
        return translateManager.state.result?.success ? 'success' : 'exception'
      }
      return null
    },
    // 弹窗样式
    dialogStyle() {
      return {
        left: this.dialogPosition.x + 'px',
        top: this.dialogPosition.y + 'px'
      }
    }
  },
  mounted() {
    // 初始化弹窗位置（屏幕中央偏右）
    this.initDialogPosition()
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    // 移除拖拽事件监听
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
  },
  methods: {
    // 初始化弹窗位置
    initDialogPosition() {
      const dialogWidth = 480
      const dialogHeight = 380
      this.dialogPosition.x = (window.innerWidth - dialogWidth) / 2 + 100
      this.dialogPosition.y = (window.innerHeight - dialogHeight) / 2
    },
    // 窗口大小变化
    handleResize() {
      // 确保弹窗在可视范围内
      if (this.dialogPosition.x > window.innerWidth - 100) {
        this.dialogPosition.x = window.innerWidth - 200
      }
      if (this.dialogPosition.y > window.innerHeight - 100) {
        this.dialogPosition.y = window.innerHeight - 200
      }
    },
    // 开始拖拽
    startDrag(e) {
      if (e.target.closest('.header-actions') || e.target.closest('.dialog-body')) {
        return
      }
      this.isDragging = true
      this.dragOffset.x = e.clientX - this.dialogPosition.x
      this.dragOffset.y = e.clientY - this.dialogPosition.y
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
    },
    // 拖拽中
    onDrag(e) {
      if (!this.isDragging) return
      this.dialogPosition.x = e.clientX - this.dragOffset.x
      this.dialogPosition.y = e.clientY - this.dragOffset.y
      // 限制在可视范围内
      this.dialogPosition.x = Math.max(0, Math.min(this.dialogPosition.x, window.innerWidth - 100))
      this.dialogPosition.y = Math.max(0, Math.min(this.dialogPosition.y, window.innerHeight - 50))
    },
    // 停止拖拽
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
    // 最小化
    handleMinimize() {
      translateManager.minimize()
    },
    // 还原
    handleRestore() {
      translateManager.restore()
    },
    // 取消翻译
    handleCancel() {
      if (!translateManager.state.isTranslating) return
      MessageBox.confirm(
        this.$t('superPanel.i18n.translate.cancelConfirm'),
        this.$t('superPanel.i18n.translate.cancel'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
          zIndex: 10000,
          customClass: 'cancel-translate-confirm'
        }
      ).then(() => {
        translateManager.cancelTranslate()
      }).catch(() => {
        // 用户取消，不做处理
      })
    },
    // 关闭弹窗（翻译在后台继续）
    handleClose() {
      translateManager.hideDialog()
    }
  }
}
</script>

<style scoped>
/* 完整进度弹窗 */
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

/* 标题栏 */
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

.header-title .el-icon-loading {
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

/* 内容区域 */
.dialog-body {
  padding: 16px;
  cursor: default;
}

/* 进度条区域 */
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

/* 统计信息 */
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

/* 当前翻译项 */
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

/* 结果区域 */
.result-section {
  margin-bottom: 16px;
}

.result-actions {
  margin-top: 12px;
  text-align: center;
}

/* 提示信息 */
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

/* 最小化后的悬浮进度条 */
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
  transition: transform 0.2s, box-shadow 0.2s;
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

.mini-header .el-icon-loading {
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

<!-- 全局样式：确保取消翻译确认弹窗置顶显示 -->
<style>
.cancel-translate-confirm {
  z-index: 10001 !important;
}

.cancel-translate-confirm + .v-modal {
  z-index: 10000 !important;
}
</style>
