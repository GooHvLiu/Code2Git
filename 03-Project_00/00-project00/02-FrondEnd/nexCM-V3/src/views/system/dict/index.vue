<template>
  <div class="dict-management">
    <el-row :gutter="20">
      <!-- 左侧：字典类型列表 -->
      <el-col :span="8">
        <div class="dict-type-panel">
          <div class="panel-header">
            <span>{{ $t('dict.typeList') }}</span>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAddType">
              {{ $t('common.add') }}
            </el-button>
          </div>
          <el-table
            v-loading="typeLoading"
            :data="typeList"
            border
            highlight-current-row
            @current-change="handleTypeChange"
            style="width: 100%"
          >
            <el-table-column prop="dict_name" :label="$t('dict.typeName')" min-width="120" align="center" />
            <el-table-column prop="dict_code" :label="$t('dict.typeCode')" min-width="120" align="center" />
            <el-table-column :label="$t('common.operation')" width="100" align="center">
              <template slot-scope="{ row }">
                <el-button type="text" size="small" @click.stop="handleEditType(row)">{{ $t('common.edit') }}</el-button>
                <el-button type="text" size="small" style="color: #f56c6c" @click.stop="handleDeleteType(row)">{{ $t('common.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <!-- 右侧：字典项列表 -->
      <el-col :span="16">
        <div class="dict-item-panel">
          <div class="panel-header">
            <span>{{ currentType ? currentType.dict_name + ' - ' + $t('dict.itemList') : $t('dict.itemList') }}</span>
            <div class="panel-actions">
              <export-dropdown
                :data="itemList"
                :columns="exportColumns"
                :title="exportTitle"
                :filename="exportTitle"
                :exporter="$store.state.user.userInfo?.username || ''"
              />
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                :disabled="!currentType"
                @click="handleAddItem"
              >
                {{ $t('common.add') }}
              </el-button>
            </div>
          </div>
          <el-table
            v-loading="itemLoading"
            :data="itemList"
            border
            stripe
            :header-cell-style="{ textAlign: 'center' }"
          >
            <el-table-column :label="$t('common.index')" type="index" width="60" align="center" />
            <el-table-column prop="label" :label="$t('dict.itemLabel')" min-width="120" align="center" />
            <el-table-column prop="value" :label="$t('dict.itemValue')" min-width="120" align="center" />
            <el-table-column :label="$t('dict.itemStatus')" prop="status" width="80" align="center">
              <template slot-scope="{ row }">
                <el-tag size="small" :type="row.status === 1 ? 'success' : 'danger'">
                  {{ row.status === 1 ? $t('common.enable') : $t('common.disable') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="sort" :label="$t('common.sort')" width="80" align="center" />
            <el-table-column :label="$t('common.operation')" width="150" align="center" fixed="right">
              <template slot-scope="{ row }">
                <el-button type="text" size="small" @click="handleEditItem(row)">{{ $t('common.edit') }}</el-button>
                <el-button type="text" size="small" style="color: #f56c6c" @click="handleDeleteItem(row)">{{ $t('common.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 字典类型弹窗 -->
    <el-dialog :title="typeDialog.title" :visible.sync="typeDialog.visible" width="560px">
      <el-form :model="typeForm" :rules="typeRules" ref="typeForm" label-width="100px">
        <el-form-item :label="$t('dict.typeName')" prop="dict_name">
          <i18n-input
            v-model="typeForm.dict_name"
            type="input"
            :zh-label="'中文'"
            :en-label="'English'"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item :label="$t('dict.typeCode')" prop="dict_code">
          <el-input v-model="typeForm.dict_code" :placeholder="$t('dict.typeCodePlaceholder')" :disabled="typeDialog.isEdit" />
        </el-form-item>
        <el-form-item :label="$t('common.description')" prop="description">
          <i18n-input
            v-model="typeForm.description"
            type="textarea"
            :rows="2"
            :zh-label="'中文'"
            :en-label="'English'"
            :maxlength="200"
          />
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          <el-radio-group v-model="typeForm.status">
            <el-radio :label="1">{{ $t('common.enable') }}</el-radio>
            <el-radio :label="0">{{ $t('common.disable') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.sort')" prop="sort">
          <el-input-number v-model="typeForm.sort" :min="0" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="typeDialog.visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitTypeForm">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- 字典项弹窗 -->
    <el-dialog :title="itemDialog.title" :visible.sync="itemDialog.visible" width="560px">
      <el-form :model="itemForm" :rules="itemRules" ref="itemForm" label-width="100px">
        <el-form-item :label="$t('dict.itemLabel')" prop="label">
          <i18n-input
            v-model="itemForm.label"
            type="input"
            :zh-label="'中文'"
            :en-label="'English'"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item :label="$t('dict.itemValue')" prop="value">
          <el-input v-model="itemForm.value" :placeholder="$t('dict.itemValuePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          <el-radio-group v-model="itemForm.status">
            <el-radio :label="1">{{ $t('common.enable') }}</el-radio>
            <el-radio :label="0">{{ $t('common.disable') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.sort')" prop="sort">
          <el-input-number v-model="itemForm.sort" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('common.remark')" prop="remark">
          <el-input v-model="itemForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="itemDialog.visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitItemForm">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import {
  requestGetDictTypeListApi,
  requestCreateDictTypeApi,
  requestUpdateDictTypeApi,
  requestDeleteDictTypeApi,
  requestGetDictItemListApi,
  requestCreateDictItemApi,
  requestUpdateDictItemApi,
  requestDeleteDictItemApi
} from '@/api'

export default {
  name: 'DictManagement',
  components: { ExportDropdown },
  data() {
    return {
      typeLoading: false,
      itemLoading: false,
      typeList: [],
      itemList: [],
      currentType: null,
      typeDialog: { visible: false, title: '', isEdit: false },
      itemDialog: { visible: false, title: '', isEdit: false },
      typeForm: { dict_name: {}, dict_code: '', description: {}, status: 1, sort: 0 },
      itemForm: { label: {}, value: '', status: 1, sort: 0, remark: '' },
      typeRules: {
        dict_name: [{ required: true, message: this.$t('dict.typeNameRequired'), trigger: 'blur' }],
        dict_code: [{ required: true, message: this.$t('dict.typeCodeRequired'), trigger: 'blur' }]
      },
      itemRules: {
        label: [{ required: true, message: this.$t('dict.itemLabelRequired'), trigger: 'blur' }],
        value: [{ required: true, message: this.$t('dict.itemValueRequired'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    exportColumns() {
      return [
        { label: this.$t('dict.itemLabel'), prop: 'label', width: 150 },
        { label: this.$t('dict.itemValue'), prop: 'value', width: 150 },
        {
          label: this.$t('dict.itemStatus'),
          prop: 'status',
          width: 80,
          formatter: row => (row.status === 1 ? this.$t('common.enable') : this.$t('common.disable'))
        },
        { label: this.$t('common.sort'), prop: 'sort', width: 80 },
        { label: this.$t('common.remark'), prop: 'remark', width: 200 }
      ]
    },
    exportTitle() {
      return this.currentType
        ? `${this.currentType.dict_name} - ${this.$t('dict.itemList')}`
        : this.$t('dict.itemList')
    }
  },
  created() {
    this.loadTypeList()
  },
  methods: {
    // 加载字典类型列表
    async loadTypeList() {
      this.typeLoading = true
      try {
        const res = await requestGetDictTypeListApi({ page: 1, pageSize: 100 })
        this.typeList = res.data?.list || []
        if (this.typeList.length > 0 && !this.currentType) {
          this.currentType = this.typeList[0]
          this.loadItemList()
        }
      } finally {
        this.typeLoading = false
      }
    },
    // 加载字典项列表
    async loadItemList() {
      if (!this.currentType) return
      this.itemLoading = true
      try {
        const res = await requestGetDictItemListApi({ type_id: this.currentType.id, page: 1, pageSize: 100 })
        this.itemList = res.data?.list || []
      } finally {
        this.itemLoading = false
      }
    },
    // 切换字典类型
    handleTypeChange(row) {
      this.currentType = row
      this.loadItemList()
    },
    // 新增字典类型
    handleAddType() {
      this.typeDialog = { visible: true, title: this.$t('dict.addType'), isEdit: false }
      this.typeForm = { dict_name: {}, dict_code: '', description: {}, status: 1, sort: 0 }
    },
    // 编辑字典类型
    handleEditType(row) {
      this.typeDialog = { visible: true, title: this.$t('dict.editType'), isEdit: true }
      // I18nInput 组件直接绑定 JSON 对象，无需转换
      this.typeForm = { ...row }
    },
    // 提交字典类型表单
    submitTypeForm() {
      this.$refs.typeForm.validate(async valid => {
        if (!valid) return
        try {
          // I18nInput 组件已自动处理 JSON 转换，直接提交
          if (this.typeDialog.isEdit) {
            await requestUpdateDictTypeApi(this.typeForm.id, this.typeForm)
            this.$message.success(this.$t('common.updateSuccess'))
          } else {
            await requestCreateDictTypeApi(this.typeForm)
            this.$message.success(this.$t('common.createSuccess'))
          }
          this.typeDialog.visible = false
          this.loadTypeList()
        } catch (e) {
          this.$message.error(e.msg || this.$t('common.operationFailed'))
        }
      })
    },
    // 删除字典类型
    handleDeleteType(row) {
      this.$confirm(this.$t('dict.deleteTypeConfirm'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async () => {
        await requestDeleteDictTypeApi(row.id)
        this.$message.success(this.$t('common.deleteSuccess'))
        if (this.currentType?.id === row.id) {
          this.currentType = null
          this.itemList = []
        }
        this.loadTypeList()
      }).catch(() => {})
    },
    // 新增字典项
    handleAddItem() {
      this.itemDialog = { visible: true, title: this.$t('dict.addItem'), isEdit: false }
      this.itemForm = { label: {}, value: '', status: 1, sort: 0, remark: '' }
    },
    // 编辑字典项
    handleEditItem(row) {
      this.itemDialog = { visible: true, title: this.$t('dict.editItem'), isEdit: true }
      // I18nInput 组件直接绑定 JSON 对象，无需转换
      this.itemForm = { ...row }
    },
    // 提交字典项表单
    submitItemForm() {
      this.$refs.itemForm.validate(async valid => {
        if (!valid) return
        try {
          // I18nInput 组件已自动处理 JSON 转换，直接提交
          const data = { ...this.itemForm, type_id: this.currentType.id }
          if (this.itemDialog.isEdit) {
            await requestUpdateDictItemApi(this.itemForm.id, data)
            this.$message.success(this.$t('common.updateSuccess'))
          } else {
            await requestCreateDictItemApi(data)
            this.$message.success(this.$t('common.createSuccess'))
          }
          this.itemDialog.visible = false
          this.loadItemList()
        } catch (e) {
          this.$message.error(e.msg || this.$t('common.operationFailed'))
        }
      })
    },
    // 删除字典项
    handleDeleteItem(row) {
      this.$confirm(this.$t('dict.deleteItemConfirm'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async () => {
        await requestDeleteDictItemApi(row.id)
        this.$message.success(this.$t('common.deleteSuccess'))
        this.loadItemList()
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">
.dict-management {
  .dict-type-panel,
  .dict-item-panel {
    background: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    overflow: hidden;
  }
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #ebeef5;
    font-weight: 600;
    font-size: 14px;
    .panel-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}
</style>
