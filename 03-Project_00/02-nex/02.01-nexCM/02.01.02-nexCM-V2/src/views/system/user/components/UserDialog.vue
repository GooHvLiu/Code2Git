<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item :label="$t('user.username')" prop="username">
        <el-input v-model="form.username" :placeholder="$t('user.usernamePlaceholder')" :disabled="!!form.id" />
      </el-form-item>
      <el-form-item :label="$t('user.realName')" prop="realName">
        <el-input v-model="form.realName" :placeholder="$t('user.realNamePlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('user.email')" prop="email">
        <el-input v-model="form.email" :placeholder="$t('user.emailPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('user.phone')" prop="phone">
        <el-input v-model="form.phone" :placeholder="$t('user.phonePlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('user.role')" prop="role">
        <el-select v-model="form.role" :placeholder="$t('user.rolePlaceholder')" style="width: 100%">
          <el-option :label="$t('user.roleAdmin')" value="admin" />
          <el-option :label="$t('user.roleEngineer')" value="engineer" />
          <el-option :label="$t('user.roleOperator')" value="operator" />
          <el-option :label="$t('user.roleGuest')" value="guest" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.status')" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="1">{{ $t('user.enable') }}</el-radio>
          <el-radio label="0">{{ $t('user.disable') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('user.remark')" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="3" :placeholder="$t('user.remarkPlaceholder')" />
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
 * 用户新增/编辑弹窗
 * 使用 dialogMixin 封装通用逻辑
 */
import dialogMixin from '@/mixins/dialog'
import { requestAddUserApi, requestUpdateUserApi } from '@/api/user'

export default {
  name: 'UserDialog',
  mixins: [dialogMixin],
  data() {
    return {
      /** 表单数据 */
      form: {
        id: null,
        username: '',
        realName: '',
        email: '',
        phone: '',
        role: 'operator',
        status: '1',
        remark: ''
      },
      /** 表单默认值（用于重置） */
      defaultForm: {
        id: null,
        username: '',
        realName: '',
        email: '',
        phone: '',
        role: 'operator',
        status: '1',
        remark: ''
      }
    }
  },
  computed: {
    /** 弹窗标题（国际化） */
    dialogTitle() {
      return this.form.id ? this.$t('user.editUser') : this.$t('user.addUser')
    },
    /** 表单校验规则（国际化） */
    rules() {
      return {
        username: [
          { required: true, message: this.$t('user.usernamePlaceholder'), trigger: 'blur' },
          { min: 3, max: 16, message: this.$t('user.usernameLength'), trigger: 'blur' }
        ],
        realName: [
          { required: true, message: this.$t('user.realNamePlaceholder'), trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: this.$t('user.emailInvalid'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 提交 API（dialogMixin 调用）
     */
    submitApi(form) {
      return form.id ? requestUpdateUserApi(form) : requestAddUserApi(form)
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
