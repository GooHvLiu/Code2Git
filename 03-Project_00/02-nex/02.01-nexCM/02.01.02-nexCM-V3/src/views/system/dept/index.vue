<template>
  <div class="dept-management">
    <!-- 表格工具栏 -->
    <table-toolbar :title="$t('dept.title')" show-add show-refresh @add="handleAdd" @refresh="getList">
      <template #right>
        <export-dropdown
          :data="flatTableData"
          :columns="exportColumns"
          :title="$t('dept.title')"
          :filename="$t('dept.title')"
          :exporter="$store.state.user.userInfo?.username || ''"
        />
      </template>
    </table-toolbar>

    <!-- 树形表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :header-cell-style="{ textAlign: 'center' }"
      default-expand-all
    >
      <el-table-column :label="$t('dept.deptName')" prop="dept_name" min-width="200" />
      <el-table-column :label="$t('dept.orderNum')" prop="order_num" width="100" align="center" />
      <el-table-column :label="$t('dept.leader')" prop="leader" width="120" align="center" />
      <el-table-column :label="$t('dept.phone')" prop="phone" width="150" align="center" />
      <el-table-column :label="$t('dept.email')" prop="email" width="200" align="center" />
      <el-table-column :label="$t('common.status')" prop="status" width="80" align="center">
        <template slot-scope="{ row }">
          <el-tag size="small" :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? $t('common.enable') : $t('common.disable') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" width="200" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleAddChild(row)">{{ $t('dept.addChild') }}</el-button>
          <el-button type="text" size="small" @click="handleEdit(row)">{{ $t('common.edit') }}</el-button>
          <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(row)">{{ $t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 部门编辑弹窗 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="560px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item :label="$t('dept.parentDept')" prop="parent_id">
          <el-select
            v-model="form.parent_id"
            placeholder="选择上级部门"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in flatDeptOptions"
              :key="item.id"
              :label="item.dept_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dept.deptName')" prop="dept_name">
          <el-input
            v-model="form.dept_name"
            :maxlength="50"
            :placeholder="$t('dept.deptNamePlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('dept.orderNum')" prop="order_num">
          <el-input-number v-model="form.order_num" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('dept.leader')" prop="leader">
          <el-input v-model="form.leader" />
        </el-form-item>
        <el-form-item :label="$t('dept.phone')" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item :label="$t('dept.email')" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item v-if="dialog.isEdit" :label="$t('common.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">{{ $t('common.enable') }}</el-radio>
            <el-radio :label="0">{{ $t('common.disable') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialog.visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableToolbar from '@/components/TableToolbar/index.vue'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import {
  requestGetDeptTreeApi,
  requestCreateDeptApi,
  requestUpdateDeptApi,
  requestDeleteDeptApi
} from '@/api'

export default {
  name: 'DeptManagement',
  components: { TableToolbar, ExportDropdown },
  data() {
    return {
      loading: false,
      tableData: [],
      deptTree: [],
      dialog: { visible: false, title: '', isEdit: false },
      form: { parent_id: 0, dept_name: '', order_num: 0, leader: '', phone: '', email: '', status: 1 },
      rules: {
        dept_name: [{ required: true, message: this.$t('dept.deptNameRequired'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    /** 扁平化的部门列表（用于上级部门下拉选择） */
    flatDeptOptions() {
      const result = [{ id: 0, dept_name: '顶级部门' }]
      const flatten = (list) => {
        if (!Array.isArray(list)) return
        list.forEach(item => {
          result.push({ id: item.id, dept_name: item.dept_name })
          if (item.children && item.children.length > 0) {
            flatten(item.children)
          }
        })
      }
      flatten(this.tableData)
      return result
    },
    /** 扁平化树形数据用于导出 */
    flatTableData() {
      const result = []
      const flatten = (list, level = 0) => {
        list.forEach(item => {
          result.push({ ...item, _level: level })
          if (item.children && item.children.length > 0) {
            flatten(item.children, level + 1)
          }
        })
      }
      flatten(this.tableData)
      return result
    },
    exportColumns() {
      return [
        {
          label: this.$t('dept.deptName'),
          prop: 'dept_name',
          width: 200,
          formatter: row => '  '.repeat(row._level || 0) + row.dept_name
        },
        { label: this.$t('dept.orderNum'), prop: 'order_num', width: 100 },
        { label: this.$t('dept.leader'), prop: 'leader', width: 120 },
        { label: this.$t('dept.phone'), prop: 'phone', width: 150 },
        { label: this.$t('dept.email'), prop: 'email', width: 200 },
        {
          label: this.$t('common.status'),
          prop: 'status',
          width: 80,
          formatter: row => (row.status === 1 ? this.$t('common.enable') : this.$t('common.disable'))
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        const res = await requestGetDeptTreeApi()
        this.tableData = res.data || []
        this.deptTree = [{ id: 0, dept_name: '顶级部门', children: res || [] }]
      } finally {
        this.loading = false
      }
    },
    handleAdd() {
      this.dialog = { visible: true, title: this.$t('dept.addDept'), isEdit: false }
      this.form = { parent_id: 0, dept_name: '', order_num: 0, leader: '', phone: '', email: '', status: 1 }
    },
    handleAddChild(row) {
      this.dialog = { visible: true, title: this.$t('dept.addChild'), isEdit: false }
      this.form = { parent_id: row.id, dept_name: '', order_num: 0, leader: '', phone: '', email: '', status: 1 }
    },
    handleEdit(row) {
      this.dialog = { visible: true, title: this.$t('dept.editDept'), isEdit: true }
      this.form = { ...row }
    },
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        try {
          if (this.dialog.isEdit) {
            await requestUpdateDeptApi(this.form.id, this.form)
            this.$message.success(this.$t('common.updateSuccess'))
          } else {
            await requestCreateDeptApi(this.form)
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
      this.$confirm(this.$t('dept.deleteConfirm'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async () => {
        await requestDeleteDeptApi(row.id)
        this.$message.success(this.$t('common.deleteSuccess'))
        this.getList()
      }).catch(() => {})
    }
  }
}
</script>
