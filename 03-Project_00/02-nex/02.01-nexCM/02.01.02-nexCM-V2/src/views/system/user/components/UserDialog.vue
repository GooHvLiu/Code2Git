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
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" :disabled="!!form.id" />
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="form.realName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
          <el-option label="管理员" value="admin" />
          <el-option label="工程师" value="engineer" />
          <el-option label="操作员" value="operator" />
          <el-option label="访客" value="guest" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="1">正常</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
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
      /** 弹窗标题 */
      dialogTitle: '新增用户',
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
      },
      /** 表单校验规则 */
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
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
