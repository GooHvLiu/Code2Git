<template>
  <el-dialog
    :title="$t('common.electronicSignature')"
    :visible.sync="dialogVisible"
    width="480px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item :label="$t('common.operation')">
        <span>{{ operationDesc }}</span>
      </el-form-item>
      <el-form-item :label="$t('common.operator')">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item :label="$t('common.reason')" prop="reason">
        <el-input
          v-model="form.reason"
          type="textarea"
          :rows="3"
          :placeholder="$t('common.reasonPlaceholder')"
          maxlength="200"
          show-word-limit
          class="es-textarea"
        />
      </el-form-item>
      <el-form-item :label="$t('common.password')" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          :placeholder="$t('common.passwordPlaceholder')"
          show-password
          @keyup.enter.native="handleConfirm"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
/**
 * 电子签名弹窗组件
 * GMP 21CFR Part 11 合规：关键操作需密码验证 + 操作原因
 *
 * 使用方法：
 *   <electronic-signature ref="esDialog" @confirm="handleWrite" />
 *
 *   this.$refs.esDialog.open({
 *     operation: '修改灌装体积',
 *     userName: 'admin',
 *     extraData: { tag: 'fillVolume', value: 150 }
 *   })
 *
 *   handleWrite({ password, reason, extraData }) { ... }
 */
export default {
  name: 'ElectronicSignature',
  data() {
    return {
      dialogVisible: false,
      loading: false,
      form: {
        reason: '',
        password: ''
      },
      operationDesc: '',
      userName: '',
      extraData: null
    }
  },
  computed: {
    /** 表单校验规则（与项目其他组件统一：computed + this.$t()） */
    rules() {
      return {
        reason: [
          { required: true, message: this.$t('common.reasonRequired'), trigger: 'blur' },
          { min: 2, message: this.$t('common.reasonMinLength'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('common.passwordRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 打开电子签名弹窗
     * @param {Object} options
     * @param {string} options.operation - 操作描述
     * @param {string} options.userName - 操作人
     * @param {Object} options.extraData - 额外数据，确认后原样返回
     */
    open(options = {}) {
      this.operationDesc = options.operation || ''
      this.userName = options.userName || ''
      this.extraData = options.extraData || null
      this.form.reason = ''
      this.form.password = ''
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },

    /** 确认 */
    handleConfirm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        this.loading = true
        try {
          this.$emit('confirm', {
            password: this.form.password,
            reason: this.form.reason.trim(),
            extraData: this.extraData
          })
        } catch (err) {
          this.$message.error(err.message || '操作失败')
        } finally {
          this.loading = false
        }
      })
    },

    /** 关闭 */
    handleClose() {
      this.dialogVisible = false
      this.form.reason = ''
      this.form.password = ''
      this.extraData = null
    },

    /** 外部调用关闭 */
    close() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-dialog__body {
  padding-top: 10px;
}

/* 固定 textarea 高度，禁止拖拽调整大小，内容过多时显示滚动条 */
.es-textarea /deep/ .el-textarea__inner {
  resize: none;
  min-height: 80px !important;
  max-height: 80px !important;
  overflow-y: auto;
}
</style>
