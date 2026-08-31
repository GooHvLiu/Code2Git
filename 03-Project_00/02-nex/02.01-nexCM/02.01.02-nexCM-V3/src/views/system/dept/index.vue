<template>
  <div class="dept-management">
    <!-- 表格工具栏 -->
    <table-toolbar
      :title="$t('menu.system.dept.page.title')"
      show-add
      show-refresh
      @add="handleAdd"
      @refresh="getList"
    >
      <template #right>
        <export-dropdown
          :data="flatTableData"
          :columns="exportColumns"
          :title="$t('menu.system.dept.page.title')"
          :filename="$t('menu.system.dept.page.title')"
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
      :header-cell-style="{
        background: '#f5f7fa',
        color: '#606266',
        fontWeight: 'bold',
        textAlign: 'center',
      }"
      default-expand-all
    >
      <el-table-column
        :label="$t('menu.system.dept.page.deptName')"
        prop="dept_name"
        min-width="200"
      />
      <el-table-column
        :label="$t('menu.system.dept.page.orderNum')"
        prop="order_num"
        width="100"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.dept.page.leader')"
        prop="leader"
        width="120"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.dept.page.phone')"
        prop="phone"
        width="150"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.dept.page.email')"
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
          <el-button type="text" size="small" @click="handleAddChild(row)">{{
            $t("menu.system.dept.page.addChild")
          }}</el-button>
          <el-button type="text" size="small" @click="handleEdit(row)">{{
            $t("common.edit")
          }}</el-button>
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

    <!-- 部门编辑弹窗 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="560px"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item
          :label="$t('menu.system.dept.page.parentDept')"
          prop="parent_id"
        >
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
        <el-form-item
          :label="$t('menu.system.dept.page.deptName')"
          prop="dept_name"
        >
          <el-input
            v-model="form.dept_name"
            :maxlength="50"
            :placeholder="$t('menu.system.dept.page.deptNamePlaceholder')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.system.dept.page.orderNum')"
          prop="order_num"
        >
          <el-input-number v-model="form.order_num" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('menu.system.dept.page.leader')" prop="leader">
          <el-input v-model="form.leader" />
        </el-form-item>
        <el-form-item :label="$t('menu.system.dept.page.phone')" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item :label="$t('menu.system.dept.page.email')" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item
          v-if="dialog.isEdit"
          :label="$t('common.status')"
          prop="status"
        >
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
import TableToolbar from "@/components/TableToolbar/index.vue";
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
      message: $t("menu.system.dept.page.deptNameRequired"),
      trigger: "blur",
    },
  ],
};

// ===== 计算属性 =====
/** 扁平化的部门列表（用于上级部门下拉选择） */
const flatDeptOptions = computed(() => {
  const result = [{ id: 0, dept_name: "顶级部门" }];
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
    label: $t("menu.system.dept.page.deptName"),
    prop: "dept_name",
    width: 200,
    formatter: (row) => "  ".repeat(row._level || 0) + row.dept_name,
  },
  {
    label: $t("menu.system.dept.page.orderNum"),
    prop: "order_num",
    width: 100,
  },
  { label: $t("menu.system.dept.page.leader"), prop: "leader", width: 120 },
  { label: $t("menu.system.dept.page.phone"), prop: "phone", width: 150 },
  { label: $t("menu.system.dept.page.email"), prop: "email", width: 200 },
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
    deptTree.value = [{ id: 0, dept_name: "顶级部门", children: res || [] }];
  } finally {
    loading.value = false;
  }
}

function handleAdd() {
  Object.assign(dialog, {
    visible: true,
    title: $t("menu.system.dept.page.addDept"),
    isEdit: false,
  });
  Object.assign(form, {
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
    title: $t("menu.system.dept.page.addChild"),
    isEdit: false,
  });
  Object.assign(form, {
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
    title: $t("menu.system.dept.page.editDept"),
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
    $t("menu.system.dept.page.deleteConfirm"),
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
