<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="560px"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="90px"
    >
      <el-form-item
        v-for="field in visibleFields"
        :key="field.prop"
        :label="$t(field.label)"
        :prop="field.prop"
      >
        <!-- 文本输入 -->
        <el-input
          v-if="field.type === 'input'"
          v-model="form[field.prop]"
          :placeholder="$t(field.placeholder)"
          :disabled="field.disabledEdit && isEdit"
          clearable
        />
        <!-- 密码输入 -->
        <el-input
          v-if="field.type === 'password'"
          v-model="form[field.prop]"
          type="password"
          :placeholder="$t(field.placeholder)"
          show-password
          clearable
        />
        <!-- 下拉选择 -->
        <el-select
          v-if="field.type === 'select'"
          v-model="form[field.prop]"
          :placeholder="$t(field.placeholder)"
          style="width: 100%"
        >
          <el-option
            v-for="opt in field.options"
            :key="opt.value"
            :label="$t(opt.label)"
            :value="opt.value"
          />
        </el-select>
        <!-- 单选按钮 -->
        <el-radio-group v-if="field.type === 'radio'" v-model="form[field.prop]">
          <el-radio
            v-for="opt in field.options"
            :key="opt.value"
            :label="opt.value"
          >{{ $t(opt.label) }}</el-radio>
        </el-radio-group>
        <!-- 文本域 -->
        <el-input
          v-if="field.type === 'textarea'"
          v-model="form[field.prop]"
          type="textarea"
          :rows="3"
          :placeholder="$t(field.placeholder)"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
/**
 * 用户新增/编辑弹窗 - 配置数组驱动
 *
 * 字段配置与后端 user.schema.js 的 Joi 校验规则对齐：
 * - required: true 对应后端 .required()
 * - 字段类型对应后端的 Joi.string()/Joi.number() 等
 * - 选项值对应后端的 USER_ROLE / USER_STATUS / USER_SEX 枚举
 *
 * 新增字段只需在 fieldConfig 数组中添加一项，无需修改模板
 */
import dialogMixin from '@/mixins/dialog'
import { requestAddUserApi, requestUpdateUserApi } from '@/api/user'

export default {
  name: 'UserDialog',
  mixins: [dialogMixin],
  data() {
    return {
      /** 表单数据 */
      form: this.getDefaultForm(),
      /** 表单默认值（用于重置） */
      defaultForm: this.getDefaultForm(),
      /**
       * 字段配置数组（驱动表单渲染）
       * prop: 字段名（与后端一致）
       * label: 标签 i18n key
       * type: input/password/select/radio/textarea
       * placeholder: 占位符 i18n key
       * required: 是否必填（对应后端 .required()）
       * disabledEdit: 编辑时是否禁用
       * show: 显示条件（函数，接收 isEdit 参数）
       * options: 下拉/单选选项（label 为 i18n key，value 与后端枚举一致）
       */
      fieldConfig: [
        {
          prop: 'username',
          label: 'user.username',
          type: 'input',
          placeholder: 'user.usernamePlaceholder',
          required: true,
          disabledEdit: true
        },
        {
          prop: 'password',
          label: 'user.password',
          type: 'password',
          placeholder: 'user.passwordPlaceholder',
          required: true,
          show: (isEdit) => !isEdit // 仅新增时显示密码
        },
        {
          prop: 'real_name',
          label: 'user.realName',
          type: 'input',
          placeholder: 'user.realNamePlaceholder',
          required: false
        },
        {
          prop: 'sex',
          label: 'user.sex',
          type: 'radio',
          required: false,
          options: [
            { label: 'user.sexUnknown', value: 0 },
            { label: 'user.sexMale', value: 1 },
            { label: 'user.sexFemale', value: 2 }
          ]
        },
        {
          prop: 'phone',
          label: 'user.phone',
          type: 'input',
          placeholder: 'user.phonePlaceholder',
          required: false
        },
        {
          prop: 'email',
          label: 'user.email',
          type: 'input',
          placeholder: 'user.emailPlaceholder',
          required: false
        },
        {
          prop: 'role',
          label: 'user.role',
          type: 'select',
          placeholder: 'user.rolePlaceholder',
          required: false,
          options: [
            { label: 'user.roleAdministrator', value: 'administrator' },
            { label: 'user.roleEngineer', value: 'engineer' },
            { label: 'user.roleOperator', value: 'operator' }
          ]
        },
        {
          prop: 'status',
          label: 'user.status',
          type: 'radio',
          required: false,
          options: [
            { label: 'user.enable', value: 1 },
            { label: 'user.disable', value: 0 }
          ]
        },
        {
          prop: 'remark',
          label: 'user.remark',
          type: 'textarea',
          placeholder: 'user.remarkPlaceholder',
          required: false
        }
      ]
    }
  },
  computed: {
    /** 是否编辑模式 */
    isEdit() {
      return !!this.form.id
    },
    /** 弹窗标题（国际化） */
    dialogTitle() {
      return this.isEdit ? this.$t('user.editUser') : this.$t('user.addUser')
    },
    /** 根据显示条件过滤后的字段列表 */
    visibleFields() {
      return this.fieldConfig.filter(field => {
        if (typeof field.show === 'function') {
          return field.show(this.isEdit)
        }
        return true
      })
    },
    /** 表单校验规则（从 fieldConfig 动态生成） */
    rules() {
      const rules = {}
      this.fieldConfig.forEach(field => {
        if (field.required) {
          rules[field.prop] = [
            { required: true, message: this.$t(field.placeholder || field.label), trigger: 'blur' }
          ]
        }
        // 邮箱格式校验
        if (field.prop === 'email') {
          rules[field.prop] = [
            { type: 'email', message: this.$t('user.emailInvalid'), trigger: 'blur' }
          ]
        }
        // 用户名长度校验
        if (field.prop === 'username') {
          rules[field.prop] = [
            { required: true, message: this.$t('user.usernamePlaceholder'), trigger: 'blur' },
            { min: 2, max: 50, message: this.$t('user.usernameLength'), trigger: 'blur' }
          ]
        }
        // 密码长度校验（仅新增时）
        if (field.prop === 'password' && !this.isEdit) {
          rules[field.prop] = [
            { required: true, message: this.$t('user.passwordPlaceholder'), trigger: 'blur' },
            { min: 6, max: 32, message: this.$t('user.passwordLength'), trigger: 'blur' }
          ]
        }
      })
      return rules
    }
  },
  methods: {
    /** 获取默认表单值 */
    getDefaultForm() {
      return {
        id: null,
        username: '',
        password: '',
        real_name: '',
        sex: 0,
        phone: '',
        email: '',
        role: 'operator',
        status: 1,
        remark: ''
      }
    },
    /**
     * 提交 API（dialogMixin 调用）
     * 只提交后端允许的字段，过滤掉 create_time/login_ip 等只读字段
     */
    submitApi(form) {
      // 后端 updateUserSchema 允许的字段白名单
      const ALLOWED_FIELDS = ['username', 'password', 'role', 'real_name', 'sex', 'phone', 'email', 'dept_id', 'avatar', 'remark', 'status']
      const cleanData = {}
      ALLOWED_FIELDS.forEach(key => {
        if (form[key] !== undefined) {
          cleanData[key] = form[key]
        }
      })
      if (form.id) {
        cleanData.id = form.id
      }
      return form.id ? requestUpdateUserApi(cleanData) : requestAddUserApi(cleanData)
    },
    /**
     * 提交成功回调
     */
    onSubmitSuccess() {
      this.$emit('success')
    }
  }
}
</script>
