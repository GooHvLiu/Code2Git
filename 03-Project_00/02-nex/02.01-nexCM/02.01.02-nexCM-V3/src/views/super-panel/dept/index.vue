<template>
  <div class="dept-management">
    <!-- ==================== 页面头部 ==================== -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ $t("menu.superPanel.dept.page.title") }}
        </h2>
        <p class="page-desc">{{ $t("menu.superPanel.dept.page.pageDesc") }}</p>
      </div>
      <div class="header-right">
        <export-dropdown
          :data="flatTableData"
          :columns="exportColumns"
          :title="$t('menu.superPanel.dept.page.title')"
          :filename="$t('menu.superPanel.dept.page.title')"
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

    <!-- ==================== 树形表格 ==================== -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :header-cell-style="{
        background: '#f5f7fa',
        color: '#606266',
        fontWeight: 'bold',
        textAlign: 'center',
      }"
      default-expand-all
      class="dept-table"
    >
      <el-table-column
        :label="$t('menu.superPanel.dept.page.deptName')"
        prop="dept_name"
        min-width="200"
      />
      <el-table-column
        :label="$t('menu.superPanel.dept.page.orderNum')"
        prop="order_num"
        width="100"
        align="center"
      />
      <el-table-column
        :label="$t('menu.superPanel.dept.page.leader')"
        prop="leader"
        width="120"
        align="center"
      />
      <el-table-column
        :label="$t('menu.superPanel.dept.page.phone')"
        prop="phone"
        width="150"
        align="center"
      />
      <el-table-column
        :label="$t('menu.superPanel.dept.page.email')"
        prop="email"
        width="200"
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
        :label="$t('common.operation')"
        width="200"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            @click="handleAddChild(row)"
            >{{ $t("menu.superPanel.dept.page.addChild") }}</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleEdit(row)"
            >{{ $t("common.edit") }}</el-button
          >
          <el-button
            type="text"
            size="small"
            style="color: #f56c6c"
            @click="handleDelete(row)"
            >{{ $t("common.delete") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- ==================== 部门编辑弹窗 ==================== -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="560px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item
          :label="$t('menu.superPanel.dept.page.parentDept')"
          prop="parent_id"
        >
          <el-select
            v-model="form.parent_id"
            :placeholder="$t('menu.superPanel.dept.page.parentDeptPlaceholder')"
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
        <el-form-item
          :label="$t('menu.superPanel.dept.page.deptName')"
          prop="dept_name"
        >
          <el-input
            v-model="form.dept_name"
            :maxlength="50"
            :placeholder="$t('menu.superPanel.dept.page.deptNamePlaceholder')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.dept.page.orderNum')"
          prop="order_num"
        >
          <el-input-number v-model="form.order_num" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('menu.superPanel.dept.page.leader')" prop="leader">
          <el-input v-model="form.leader" />
        </el-form-item>
        <el-form-item :label="$t('menu.superPanel.dept.page.phone')" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item :label="$t('menu.superPanel.dept.page.email')" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">{{ $t("common.enable") }}</el-radio>
            <el-radio :label="0">{{ $t("common.disable") }}</el-radio>
          </el-radio-group>
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
import { ref, reactive, computed, onMounted } from "vue";
import { Message, MessageBox } from "element-ui";
import ExportDropdown from "@/components/ExportDropdown/index.vue";
import {
  requestGetDeptTreeApi,
  requestCreateDeptApi,
  requestUpdateDeptApi,
  requestDeleteDeptApi,
} from "@/api";
import { useI18n } from "@/composables/useI18n";

const { t: $t } = useI18n();

// ===== 响应式数据 =====
const loading = ref(false);
const tableData = ref([]);
const deptTree = ref([]);
const formRef = ref(null);

const dialog = reactive({ visible: false, title: "", isEdit: false });
const form = reactive({
  id: null,
  parent_id: 0,
  dept_name: "",
  order_num: 0,
  leader: "",
  phone: "",
  email: "",
  status: 1,
});

const rules = {
  dept_name: [
    {
      required: true,
      message: $t("menu.superPanel.dept.page.deptNameRequired"),
      trigger: "blur",
    },
  ],
};

// ===== 计算属性 =====
/** 扁平化的部门列表（用于上级部门下拉选择） */
const flatDeptOptions = computed(() => {
  const result = [{ id: 0, dept_name: $t("menu.superPanel.dept.page.rootDept") }];
  const flatten = (list) => {
    if (!Array.isArray(list)) return;
    list.forEach((item) => {
      result.push({ id: item.id, dept_name: item.dept_name });
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }
    });
  };
  flatten(tableData.value);
  return result;
});

/** 扁平化树形数据用于导出 */
const flatTableData = computed(() => {
  const result = [];
  const flatten = (list, level = 0) => {
    list.forEach((item) => {
      result.push({ ...item, _level: level });
      if (item.children && item.children.length > 0) {
        flatten(item.children, level + 1);
      }
    });
  };
  flatten(tableData.value);
  return result;
});

const exportColumns = computed(() => [
  {
    label: $t("menu.superPanel.dept.page.deptName"),
    prop: "dept_name",
    width: 200,
    formatter: (row) => "  ".repeat(row._level || 0) + row.dept_name,
  },
  {
    label: $t("menu.superPanel.dept.page.orderNum"),
    prop: "order_num",
    width: 100,
  },
  { label: $t("menu.superPanel.dept.page.leader"), prop: "leader", width: 120 },
  { label: $t("menu.superPanel.dept.page.phone"), prop: "phone", width: 150 },
  { label: $t("menu.superPanel.dept.page.email"), prop: "email", width: 200 },
  {
    label: $t("common.status"),
    prop: "status",
    width: 80,
    formatter: (row) =>
      row.status === 1 ? $t("common.enable") : $t("common.disable"),
  },
]);

// ===== 方法 =====
async function getList() {
  loading.value = true;
  try {
    const res = await requestGetDeptTreeApi();
    tableData.value = res.data || [];
    deptTree.value = [{ id: 0, dept_name: $t("menu.superPanel.dept.page.rootDept"), children: res || [] }];
  } finally {
    loading.value = false;
  }
}

function handleAdd() {
  Object.assign(dialog, {
    visible: true,
    title: $t("menu.superPanel.dept.page.addDept"),
    isEdit: false,
  });
  Object.assign(form, {
    id: null,
    parent_id: 0,
    dept_name: "",
    order_num: 0,
    leader: "",
    phone: "",
    email: "",
    status: 1,
  });
}

function handleAddChild(row) {
  Object.assign(dialog, {
    visible: true,
    title: $t("menu.superPanel.dept.page.addChild"),
    isEdit: false,
  });
  Object.assign(form, {
    id: null,
    parent_id: row.id,
    dept_name: "",
    order_num: 0,
    leader: "",
    phone: "",
    email: "",
    status: 1,
  });
}

function handleEdit(row) {
  Object.assign(dialog, {
    visible: true,
    title: $t("menu.superPanel.dept.page.editDept"),
    isEdit: true,
  });
  Object.assign(form, { ...row });
}

function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      if (dialog.isEdit) {
        await requestUpdateDeptApi(form.id, form);
        Message.success($t("common.updateSuccess"));
      } else {
        await requestCreateDeptApi(form);
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
  MessageBox.confirm(
    $t("menu.superPanel.dept.page.deleteConfirm"),
    $t("common.tip"),
    {
      confirmButtonText: $t("common.confirm"),
      cancelButtonText: $t("common.cancel"),
      type: "warning",
    }
  )
    .then(async () => {
      await requestDeleteDeptApi(row.id);
      Message.success($t("common.deleteSuccess"));
      getList();
    })
    .catch(() => {});
}

// ===== 生命周期 =====
onMounted(() => {
  getList();
});
</script>

<style scoped lang="less">
.dept-management {
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

// 部门表格
.dept-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}
</style>
