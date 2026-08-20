/**
 * ==========================================
 * 弹窗通用 Mixin
 * ==========================================
 * 封装新增/编辑弹窗的通用逻辑：显示/隐藏、表单重置、提交
 *
 * 用法：
 * export default {
 *   mixins: [dialogMixin],
 *   data() {
 *     return {
 *       // 必须定义：弹窗标题
 *       dialogTitle: '新增',
 *       // 表单数据
 *       form: { id: null, username: '' },
 *       // 表单默认值（用于重置）
 *       defaultForm: { id: null, username: '' }
 *     }
 *   },
 *   methods: {
 *     // 必须定义：提交表单的 API 方法
 *     submitApi(form) { return requestAddUserApi(form) },
 *     // 可选：提交成功回调
 *     onSubmitSuccess() { this.$emit('success') }
 *   }
 * }
 */
export default {
  data() {
    return {
      /** 弹窗显示状态 */
      dialogVisible: false,
      /** 提交中状态 */
      submitLoading: false
    }
  },
  methods: {
    /**
     * 打开弹窗
     * @param {Object} row - 编辑时传入行数据，新增时不传
     */
    open(row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        if (row) {
          // 编辑：回填数据
          this.form = { ...this.defaultForm, ...row }
          this.dialogTitle = this.editTitle || '编辑'
        } else {
          // 新增：重置表单
          this.form = { ...this.defaultForm }
          this.dialogTitle = this.addTitle || '新增'
        }
        // 清除表单校验
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },

    /**
     * 关闭弹窗
     */
    close() {
      this.dialogVisible = false
      this.form = { ...this.defaultForm }
      this.$refs.formRef && this.$refs.formRef.clearValidate()
    },

    /**
     * 提交表单
     */
    handleSubmit() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        if (!this.submitApi) {
          // eslint-disable-next-line no-console
          console.warn('[dialogMixin] 请定义 submitApi 方法')
          return
        }
        this.submitLoading = true
        try {
          await this.submitApi(this.form)
          this.$message.success(this.$t('common.success') || '操作成功')
          this.close()
          // 提交成功回调
          this.onSubmitSuccess && this.onSubmitSuccess()
        } catch (e) {
          // 错误已由 request 拦截器统一处理
        } finally {
          this.submitLoading = false
        }
      })
    }
  }
}
