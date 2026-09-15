<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :close-on-click-modal="false"
    :append-to-body="true"
    class="confirm-dialog"
    @close="handleClose"
  >
    <div class="confirm-content">
      <div class="confirm-icon" :class="type">
        <i :class="iconClass"></i>
      </div>
      <div class="confirm-text">
        <p class="confirm-title" v-if="showTitle">{{ titleText }}</p>
        <p class="confirm-message">{{ message }}</p>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">{{ cancelText }}</el-button>
      <el-button :type="confirmType" @click="handleConfirm" :loading="loading">
        {{ confirmText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    // 弹窗标题
    title: {
      type: String,
      default: '确认'
    },
    // 提示内容
    message: {
      type: String,
      required: true
    },
    // 弹窗宽度
    width: {
      type: String,
      default: '420px'
    },
    // 类型：warning / error / info / success
    type: {
      type: String,
      default: 'warning'
    },
    // 确认按钮文字
    confirmText: {
      type: String,
      default: '确定'
    },
    // 取消按钮文字
    cancelText: {
      type: String,
      default: '取消'
    },
    // 确认按钮类型
    confirmType: {
      type: String,
      default: 'primary'
    },
    // 是否显示标题文字
    showTitle: {
      type: Boolean,
      default: false
    },
    // 标题文字
    titleText: {
      type: String,
      default: ''
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    iconClass() {
      const iconMap = {
        warning: 'el-icon-warning-outline',
        error: 'el-icon-error',
        info: 'el-icon-info',
        success: 'el-icon-success'
      }
      return iconMap[this.type] || iconMap.warning
    }
  },
  methods: {
    // 打开弹窗
    open() {
      this.dialogVisible = true
    },
    // 关闭弹窗
    close() {
      this.dialogVisible = false
    },
    // 确认
    handleConfirm() {
      this.$emit('confirm')
    },
    // 取消
    handleCancel() {
      this.$emit('cancel')
      this.dialogVisible = false
    },
    // 关闭
    handleClose() {
      this.$emit('close')
    }
  }
}
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
