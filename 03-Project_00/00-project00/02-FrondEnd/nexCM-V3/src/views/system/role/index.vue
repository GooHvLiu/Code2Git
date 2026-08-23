<template>
  <div class="role-management">
    <!-- 表格工具栏 -->
    <table-toolbar :title="$t('role.title')" show-add show-refresh @add="handleAdd" @refresh="getList">
      <template #right>
        <export-dropdown
          :data="tableData"
          :columns="exportColumns"
          :title="$t('role.title')"
          :filename="$t('role.title')"
          :exporter="$store.state.user.userInfo?.username || ''"
        />
      </template>
    </table-toolbar>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" border stripe :header-cell-style="{ textAlign: 'center' }">
      <el-table-column :label="$t('common.index')" type="index" width="60" align="center" />
      <el-table-column :label="$t('role.roleName')" prop="role_name" min-width="120" align="center" />
      <el-table-column :label="$t('role.roleCode')" prop="role_code" min-width="120" align="center" />
      <el-table-column :label="$t('role.dataScope')" prop="data_scope" width="120" align="center">
        <template slot-scope="{ row }">
          <el-tag size="small">{{ dataScopeMap[row.data_scope] || row.data_scope }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.status')" prop="status" width="80" align="center">
        <template slot-scope="{ row }">
          <el-tag size="small" :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? $t('common.enable') : $t('common.disable') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.description')" prop="description" min-width="150" show-overflow-tooltip />
      <el-table-column :label="$t('common.operation')" width="200" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)">{{ $t('common.edit') }}</el-button>
          <el-button type="text" size="small" @click="handlePermission(row)">{{ $t('role.permission') }}</el-button>
          <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(row)">{{ $t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize" @pagination="getList" />

    <!-- 角色编辑弹窗 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="560px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item :label="$t('role.roleName')" prop="role_name">
          <i18n-input
            v-model="form.role_name"
            type="input"
            :zh-label="'中文'"
            :en-label="'English'"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item :label="$t('role.roleCode')" prop="role_code">
          <el-input v-model="form.role_code" :disabled="dialog.isEdit" />
        </el-form-item>
        <el-form-item :label="$t('role.dataScope')" prop="data_scope">
          <el-select v-model="form.data_scope" style="width: 100%">
            <el-option :label="$t('role.dataScopeAll')" value="all" />
            <el-option :label="$t('role.dataScopeDept')" value="dept" />
            <el-option :label="$t('role.dataScopeDeptAndChild')" value="dept_and_child" />
            <el-option :label="$t('role.dataScopeSelf')" value="self" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">{{ $t('common.enable') }}</el-radio>
            <el-radio :label="0">{{ $t('common.disable') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.description')" prop="description">
          <i18n-input
            v-model="form.description"
            type="textarea"
            :rows="2"
            :zh-label="'中文'"
            :en-label="'English'"
            :maxlength="200"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialog.visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- 菜单权限分配弹窗 -->
    <el-dialog :title="$t('role.permissionTitle')" :visible.sync="permDialog.visible" width="600px">
      <el-tree
        ref="menuTree"
        :data="menuTree"
        :props="{ label: 'title', children: 'children' }"
        show-checkbox
        node-key="id"
        default-expand-all
      />
      <div slot="footer">
        <el-button @click="permDialog.visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitPermission">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableMixin from '@/mixins/table'
import TableToolbar from '@/components/TableToolbar/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import {
  requestGetRoleListApi,
  requestCreateRoleApi,
  requestUpdateRoleApi,
  requestDeleteRoleApi,
  requestGetRoleApi
} from '@/api'

export default {
  name: 'RoleManagement',
  components: { TableToolbar, Pagination, ExportDropdown },
  mixins: [tableMixin],
  data() {
    return {
      listApi: requestGetRoleListApi,
      tableData: [],
      dialog: { visible: false, title: '', isEdit: false },
      permDialog: { visible: false, roleId: null },
      form: { role_name: {}, role_code: '', data_scope: 'self', status: 1, description: {} },
      menuTree: [],
      rules: {
        role_name: [{ required: true, message: this.$t('role.roleNameRequired'), trigger: 'blur' }],
        role_code: [{ required: true, message: this.$t('role.roleCodeRequired'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    dataScopeMap() {
      return {
        all: this.$t('role.dataScopeAll'),
        dept: this.$t('role.dataScopeDept'),
        dept_and_child: this.$t('role.dataScopeDeptAndChild'),
        self: this.$t('role.dataScopeSelf')
      }
    },
    exportColumns() {
      return [
        { label: this.$t('role.roleName'), prop: 'role_name', width: 120 },
        { label: this.$t('role.roleCode'), prop: 'role_code', width: 120 },
        {
          label: this.$t('role.dataScope'),
          prop: 'data_scope',
          width: 120,
          formatter: row => this.dataScopeMap[row.data_scope] || row.data_scope
        },
        {
          label: this.$t('common.status'),
          prop: 'status',
          width: 80,
          formatter: row => (row.status === 1 ? this.$t('common.enable') : this.$t('common.disable'))
        },
        { label: this.$t('common.description'), prop: 'description', width: 200 }
      ]
    }
  },
  methods: {
    handleAdd() {
      this.dialog = { visible: true, title: this.$t('role.addRole'), isEdit: false }
      this.form = { role_name: {}, role_code: '', data_scope: 'self', status: 1, description: {} }
    },
    handleEdit(row) {
      this.dialog = { visible: true, title: this.$t('role.editRole'), isEdit: true }
      // I18nInput 组件直接绑定 JSON 对象，无需转换
      this.form = { ...row }
    },
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        try {
          // I18nInput 组件已自动处理 JSON 转换，直接提交
          if (this.dialog.isEdit) {
            await requestUpdateRoleApi(this.form.id, this.form)
            this.$message.success(this.$t('common.updateSuccess'))
          } else {
            await requestCreateRoleApi(this.form)
            this.$message.success(this.$t('common.createSuccess'))
          }
          this.dialog.visible = false
          this.getList()
        } catch (e) {
          this.$message.error(e.msg || this.$t('common.operationFailed'))
        }
      })
    },
    handleDelete(row) {
      this.$confirm(this.$t('role.deleteConfirm'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async () => {
        await requestDeleteRoleApi(row.id)
        this.$message.success(this.$t('common.deleteSuccess'))
        this.getList()
      }).catch(() => {})
    },
    async handlePermission(row) {
      this.permDialog = { visible: true, roleId: row.id }
      // 加载角色详情（含已选菜单）
      const role = await requestGetRoleApi(row.id)
      // 加载菜单树（从 store 或接口）
      this.menuTree = this.$store.state.permission.menuList || []
      this.$nextTick(() => {
        this.$refs.menuTree.setCheckedKeys(role.menuIds || [])
      })
    },
    async submitPermission() {
      const checkedKeys = this.$refs.menuTree.getCheckedKeys()
      await requestUpdateRoleApi(this.permDialog.roleId, { menuIds: checkedKeys })
      this.$message.success(this.$t('role.permissionSuccess'))
      this.permDialog.visible = false
    }
  }
}
</script>
