<template>
  <div class="role-management">
    <!-- ==================== 页面头部 ==================== -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ $t("menu.superPanel.role.page.title") }}
        </h2>
        <p class="page-desc">{{ $t("menu.superPanel.role.page.pageDesc") }}</p>
      </div>
      <div class="header-right">
        <export-dropdown
          :data="tableData"
          :columns="exportColumns"
          :title="$t('menu.superPanel.role.page.title')"
          :filename="$t('menu.superPanel.role.page.title')"
          :exporter="$store.state.user.userInfo?.username || ''"
        />
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
        >
          {{ $t("common.add") }}
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          size="small"
          :loading="loading"
          @click="getList"
        >
          {{ $t("common.refresh") }}
        </el-button>
      </div>
    </div>

    <!-- ==================== 表格 ==================== -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      :header-cell-style="{
        background: '#f5f7fa',
        color: '#606266',
        fontWeight: 'bold',
        textAlign: 'center',
      }"
      class="role-table"
    >
      <el-table-column
        :label="$t('common.index')"
        type="index"
        width="60"
        align="center"
      />
      <el-table-column
        :label="$t('menu.superPanel.role.page.roleName')"
        min-width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ getRoleName(row) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.superPanel.role.page.roleCode')"
        prop="role_code"
        min-width="120"
        align="center"
      />
      <el-table-column
        :label="$t('common.status')"
        prop="status"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag size="small" :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? $t("common.enable") : $t("common.disable") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.description')"
        min-width="150"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ getRoleDesc(row) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.operation')"
        width="150"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            :class="{ 'btn-disabled': isBasicRole(row) }"
            :style="{ color: isBasicRole(row) ? '#c0c4cc' : '#409eff' }"
            :disabled="isBasicRole(row)"
            @click="handleEdit(row)"
            >{{ $t("common.edit") }}</el-button
          >
          <el-button
            type="text"
            size="small"
            :class="{ 'btn-disabled': isBasicRole(row) }"
            :style="{ color: isBasicRole(row) ? '#c0c4cc' : '#f56c6c' }"
            :disabled="isBasicRole(row)"
            @click="handleDelete(row)"
            >{{ $t("common.delete") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- ==================== 分页 ==================== -->
    <div class="pagination-section">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <!-- ==================== 角色编辑弹窗 ==================== -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="560px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item
          :label="$t('menu.superPanel.role.page.roleName')"
          prop="role_name"
        >
          <el-input
            v-model="form.role_name"
            :maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.role.page.roleCode')"
          prop="role_code"
        >
          <el-input v-model="form.role_code" :disabled="dialog.isEdit" />
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">{{ $t("common.enable") }}</el-radio>
            <el-radio :label="0">{{ $t("common.disable") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.description')" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialog.visible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button type="primary" @click="submitForm">{{
          $t("common.confirm")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useTable } from "@/composables/useTable";
import ExportDropdown from "@/components/ExportDropdown/index.vue";
import {
  requestGetRoleListApi,
  requestCreateRoleApi,
  requestUpdateRoleApi,
  requestDeleteRoleApi,
} from "@/api";
import { useI18n } from "@/composables/useI18n";
import { Message, MessageBox } from "element-ui";
import { getRoleName, getRoleDesc } from "@/utils/roleMapper";

const { t: $t } = useI18n();

// 搜索参数（角色管理暂无搜索条件）
const queryParams = reactive({});

// 使用 useTable 组合式函数
const { loading, tableData, total, pageNum, pageSize, getList } = useTable(
  requestGetRoleListApi,
  queryParams
);

// 组件自己的状态
const formRef = ref(null);
const dialog = reactive({ visible: false, title: "", isEdit: false });
const form = reactive({
  id: null,
  role_name: "",
  role_code: "",
  status: 1,
  description: "",
});

/**
 * 判断是否是系统内置基本角色（依据数据库 is_builtin 字段，不硬编码角色编码）
 * @param {Object} row - 角色数据
 * @returns {boolean}
 */
function isBasicRole(row) {
  return !!row && Number(row.is_builtin) === 1;
}

const rules = computed(() => ({
  role_name: [
    { required: true, message: $t("menu.superPanel.role.page.roleNameRequired"), trigger: "blur" },
  ],
  role_code: [
    { required: true, message: $t("menu.superPanel.role.page.roleCodeRequired"), trigger: "blur" },
  ],
}));

const exportColumns = computed(() => [
  { label: $t("menu.superPanel.role.page.roleName"), prop: "role_name", width: 120, formatter: (row) => getRoleName(row) },
  { label: $t("menu.superPanel.role.page.roleCode"), prop: "role_code", width: 120 },
  {
    label: $t("common.status"),
    prop: "status",
    width: 80,
    formatter: (row) => (row.status === 1 ? $t("common.enable") : $t("common.disable")),
  },
  { label: $t("common.description"), prop: "description", width: 200, formatter: (row) => getRoleDesc(row) },
]);

// 方法
function handleAdd() {
  Object.assign(dialog, {
    visible: true,
    title: $t("menu.superPanel.role.page.addRole"),
    isEdit: false,
  });
  Object.assign(form, {
    id: null,
    role_name: "",
    role_code: "",
    status: 1,
    description: "",
  });
}

function handleEdit(row) {
  // 基本角色不允许编辑
  if (isBasicRole(row)) {
    Message.warning($t("menu.superPanel.role.page.basicRoleCannotEdit"));
    return;
  }
  Object.assign(dialog, {
    visible: true,
    title: $t("menu.superPanel.role.page.editRole"),
    isEdit: true,
  });
  Object.assign(form, { ...row });
}

function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      if (dialog.isEdit) {
        await requestUpdateRoleApi(form.id, form);
        Message.success($t("common.updateSuccess"));
      } else {
        await requestCreateRoleApi(form);
        Message.success($t("common.createSuccess"));
      }
      dialog.visible = false;
      getList();
    } catch (e) {
      Message.error(e.msg || $t("common.operationFailed"));
    }
  });
}

function handleDelete(row) {
  // 基本角色不允许删除
  if (isBasicRole(row)) {
    Message.warning($t("menu.superPanel.role.page.basicRoleCannotDelete"));
    return;
  }
  MessageBox.confirm(
    $t("menu.superPanel.role.page.deleteConfirm"),
    $t("common.tip"),
    {
      confirmButtonText: $t("common.confirm"),
      cancelButtonText: $t("common.cancel"),
      type: "warning",
    }
  )
    .then(async () => {
      await requestDeleteRoleApi(row.id);
      Message.success($t("common.deleteSuccess"));
      getList();
    })
    .catch(() => {});
}
</script>

<style scoped lang="less">
.role-management {
  padding: 0;
  min-height: calc(100vh - 84px);
}

// 页面头部
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .header-left {
    .page-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }

    .page-desc {
      margin: 8px 0 0;
      font-size: 13px;
      color: #909399;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}

// 角色表格
.role-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}

// 分页区域
.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

// 禁用按钮样式
.btn-disabled {
  color: #c0c4cc !important;
  cursor: not-allowed !important;
  opacity: 0.6;
  
  &:hover {
    color: #c0c4cc !important;
  }
}
</style>
