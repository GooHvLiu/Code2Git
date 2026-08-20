/**
 * ==========================================
 * 表单通用 Mixin
 * ==========================================
 * 封装表单的重置、校验、清除校验等通用逻辑
 * 适用于搜索表单、新增/编辑表单等场景
 *
 * 子类必须定义：
 * - form: 表单数据对象
 * - defaultForm: 表单默认值（用于重置）
 * - rules: 校验规则（可选）
 *
 * 用法：
 * import formMixin from '@/mixins/form'
 * export default {
 *   mixins: [formMixin],
 *   data() {
 *     return {
 *       form: { username: '', password: '' },
 *       defaultForm: { username: '', password: '' },
 *       rules: { username: [{ required: true, message: '请输入用户名', trigger: 'blur' }] }
 *     }
 *   }
 * }
 *
 * 模板中：
 * <el-form ref="formRef" :model="form" :rules="rules">
 */
export default {
  data() {
    return {
      /** 表单 ref 名称，子类可覆盖，默认 formRef */
      formRefName: 'formRef'
    }
  },
  methods: {
    /**
     * 重置表单（恢复默认值 + 清除校验状态）
     */
    resetForm() {
      // 深拷贝默认值，避免引用问题
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.clearValidate()
    },

    /**
     * 校验表单
     * @returns {Promise<Boolean>} 校验通过返回 true，失败返回 false
     */
    async validateForm() {
      const ref = this.$refs[this.formRefName]
      if (!ref) {
        // eslint-disable-next-line no-console
        console.warn(`[formMixin] 未找到 ref="${this.formRefName}" 的表单`)
        return true
      }
      return new Promise(resolve => {
        ref.validate(valid => {
          resolve(valid)
        })
      })
    },

    /**
     * 校验表单指定字段
     * @param {Array|String} fields 字段名或字段名数组
     * @returns {Promise<Boolean>}
     */
    async validateField(fields) {
      const ref = this.$refs[this.formRefName]
      if (!ref) return true
      return new Promise(resolve => {
        ref.validateField(fields, error => {
          resolve(!error)
        })
      })
    },

    /**
     * 清除表单校验状态
     * @param {Array|String} fields 可选，指定字段，不传清除全部
     */
    clearValidate(fields) {
      const ref = this.$refs[this.formRefName]
      if (ref) {
        ref.clearValidate(fields)
      }
    },

    /**
     * 回填表单数据（编辑时用）
     * @param {Object} data 要回填的数据
     * @param {Boolean} merge 是否合并到现有 form，默认覆盖
     */
    fillForm(data, merge = false) {
      if (merge) {
        this.form = { ...this.form, ...data }
      } else {
        this.form = { ...this.defaultForm, ...data }
      }
      this.$nextTick(() => {
        this.clearValidate()
      })
    }
  }
}
