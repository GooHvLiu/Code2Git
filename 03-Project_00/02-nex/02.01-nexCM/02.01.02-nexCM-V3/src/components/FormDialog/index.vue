<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :width="width"
    :close-on-click-modal="false"
    :append-to-body="true"
    class="form-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-width="labelWidth"
      :disabled="disabled"
    >
      <slot name="form-content" :form="form" :disabled="disabled">
        <!-- 默认内容由调用方通过 slot 提供 -->
      </slot>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">{{ cancelText }}</el-button>
      <el-button :type="confirmType" @click="handleSubmit" :loading="loading">
        {{ confirmText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'FormDialog',
  props: {
    // 弹窗标题（新增时）
    addTitle: {
      type: String,
      default: '新增'
    },
    // 弹窗标题（编辑时）
    editTitle: {
      type: String,
      default: '编辑'
    },
    // 弹窗宽度
    width: {
      type: String,
      default: '600px'
    },
    // 表单数据
    form: {
      type: Object,
      required: true
    },
    // 表单校验规则
    rules: {
      type: Object,
      default: () => ({})
    },
    // 标签宽度
    labelWidth: {
      type: String,
      default: '100px'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
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
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      isEdit: false
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? this.editTitle : this.addTitle
    }
  },
  methods: {
    // 打开弹窗
    open(row = null) {
      this.isEdit = !!row
      this.dialogVisible = true
      // 延迟清除校验，等待 DOM 更新
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },
    // 关闭弹窗
    close() {
      this.dialogVisible = false
    },
    // 校验表单
    validate() {
      return new Promise(resolve => {
        this.$refs.formRef.validate(valid => resolve(valid))
      })
    },
    // 清除校验
    clearValidate() {
      this.$refs.formRef && this.$refs.formRef.clearValidate()
    },
    // 提交
    async handleSubmit() {
      const valid = await this.validate()
      if (!valid) return
      this.$emit('submit', this.form, this.isEdit)
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
.form-dialog {
  ::v-deep .el-dialog__body {
    padding: 20px;
  }

  .dialog-footer {
    text-align: right;
  }
}
</style>
