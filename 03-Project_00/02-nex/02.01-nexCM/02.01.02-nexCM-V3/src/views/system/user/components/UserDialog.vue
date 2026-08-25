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
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <!-- 树形下拉选择（部门） -->
        <el-select
          v-if="field.type === 'treeselect'"
          v-model="form[field.prop]"
          :placeholder="$t(field.placeholder)"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in flatDeptList"
            :key="item.id"
            :label="item.dept_name"
            :value="item.id"
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
          class="fixed-textarea"
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
import dictMixin from '@/mixins/dict'
import { requestAddUserApi, requestUpdateUserApi } from '@/api'
import { requestGetRoleAllApi } from '@/api'
import { requestGetDeptTreeApi } from '@/api'
import { withCache } from '@/utils/cache'

export default {
  name: 'UserDialog',
  mixins: [dialogMixin, dictMixin],
  data() {
    return {
      /** 需要加载的字典编码 */
      dictCodes: ['user_status', 'user_sex', 'user_role'],
      /** 角色列表（从角色管理接口获取） */
      roleList: [],
      /** 部门树（从部门管理接口获取） */
      deptTree: [],
      /** 表单数据 */
      form: this.getDefaultForm(),
      /** 表单默认值（用于重置） */
      defaultForm: this.getDefaultForm()
    }
  },
  created() {
    this.loadRoleList()
    this.loadDeptTree()
  },
  computed: {
    /** 角色选项（从角色管理接口获取） */
    roleOptions() {
      return this.roleList.map(item => ({
        label: item.role_name || item.role_code,
        value: item.role_code
      }))
    },
    /** 扁平化的部门列表（树形结构转扁平，用于下拉选择） */
    flatDeptList() {
      const result = []
      const flatten = (list) => {
        if (!Array.isArray(list)) return
        list.forEach(item => {
          result.push({ id: item.id, dept_name: item.dept_name })
          if (item.children && item.children.length > 0) {
            flatten(item.children)
          }
        })
      }
      flatten(this.deptTree)
      return result
    },
    /** 性别选项（从数据字典获取） */
    sexOptions() {
      return this.dict.user_sex || []
    },
    /** 状态选项（从数据字典获取） */
    statusOptions() {
      return this.dict.user_status || []
    },
    /**
     * 字段配置数组（驱动表单渲染）- 动态从字典/角色/部门获取
     */
    fieldConfig() {
      return [
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
          options: this.sexOptions
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
          prop: 'dept_id',
          label: 'user.dept',
          type: 'treeselect',
          placeholder: 'user.deptPlaceholder',
          required: false
        },
        {
          prop: 'role',
          label: 'user.role',
          type: 'select',
          placeholder: 'user.rolePlaceholder',
          required: false,
          options: this.roleOptions
        },
        {
          prop: 'status',
          label: 'user.status',
          type: 'radio',
          required: false,
          options: this.statusOptions
        },
        {
          prop: 'remark',
          label: 'user.remark',
          type: 'textarea',
          placeholder: 'user.remarkPlaceholder',
          required: false
        }
      ]
    },
    /** 是否编辑模式 */
    isEdit() {
      return !!this.form.id
    },
    /** 弹窗标题（国际化） */
    dialogTitle: {
      get() {
        return this.isEdit ? this.$t('user.editUser') : this.$t('user.addUser')
      },
      set() {
        // dialogMixin 的 open 方法会尝试赋值，这里忽略，由 getter 根据 isEdit 动态计算
      }
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
    /** 加载角色列表（从角色管理接口，带缓存） */
    async loadRoleList() {
      try {
        const res = await withCache('user_roleList', () => requestGetRoleAllApi())
        this.roleList = res.data || []
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[UserDialog] 加载角色列表失败:', e)
      }
    },
    /** 加载部门树（从部门管理接口，带缓存） */
    async loadDeptTree() {
      try {
        const res = await withCache('user_deptTree', () => requestGetDeptTreeApi())
        this.deptTree = res.data || []
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[UserDialog] 加载部门树失败:', e)
      }
    },
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
        dept_id: null,
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

<style scoped lang="less">
/* 固定 textarea 高度，禁止拖拽调整大小，内容过多时显示滚动条 */
.fixed-textarea /deep/ .el-textarea__inner {
  resize: none;
  min-height: 80px !important;
  max-height: 80px !important;
  overflow-y: auto;
}
</style>
