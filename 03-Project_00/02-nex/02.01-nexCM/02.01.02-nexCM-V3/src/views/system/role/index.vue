<template>
  <div class="role-management">
    <!-- 表格工具栏 -->
    <table-toolbar
      :title="$t('menu.system.role.page.title')"
      show-add
      show-refresh
      @add="handleAdd"
      @refresh="getList"
    >
      <template #right>
        <export-dropdown
          :data="tableData"
          :columns="exportColumns"
          :title="$t('menu.system.role.page.title')"
          :filename="$t('menu.system.role.page.title')"
          :exporter="$store.state.user.userInfo?.username || ''"
        />
      </template>
    </table-toolbar>

    <!-- 表格 -->
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
    >
      <el-table-column
        :label="$t('common.index')"
        type="index"
        width="60"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.role.page.roleName')"
        prop="role_name"
        min-width="120"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.role.page.roleCode')"
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
        prop="description"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('common.operation')"
        width="200"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)">{{
            $t("common.edit")
          }}</el-button>
          <el-button type="text" size="small" @click="handlePermission(row)">{{
            $t("menu.system.role.page.permission")
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

    <!-- 分页 -->
    <pagination
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      @pagination="getList"
    />

    <!-- 角色编辑弹窗 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="560px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item
          :label="$t('menu.system.role.page.roleName')"
          prop="role_name"
        >
          <i18n-input
            v-model="form.role_name"
            type="input"
            :zh-label="'中文'"
            :en-label="'English'"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.system.role.page.roleCode')"
          prop="role_code"
        >
          <el-input v-model="form.role_code" :disabled="dialog.isEdit" />
        </el-form-item>
        <el-form-item
          :label="$t('menu.system.role.page.dataScope')"
          prop="data_scope"
        >
          <el-select v-model="form.data_scope" style="width: 100%">
            <el-option
              :label="$t('menu.system.role.page.dataScopeAll')"
              value="all"
            />
            <el-option
              :label="$t('menu.system.role.page.dataScopeDept')"
              value="dept"
            />
            <el-option
              :label="$t('menu.system.role.page.dataScopeDeptAndChild')"
              value="dept_and_child"
            />
            <el-option
              :label="$t('menu.system.role.page.dataScopeSelf')"
              value="self"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">{{ $t("common.enable") }}</el-radio>
            <el-radio :label="0">{{ $t("common.disable") }}</el-radio>
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
        <el-button @click="dialog.visible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button type="primary" @click="submitForm">{{
          $t("common.confirm")
        }}</el-button>
      </div>
    </el-dialog>

    <!-- 菜单权限分配弹窗 -->
    <el-dialog
      :title="$t('menu.system.role.page.permissionTitle')"
      :visible.sync="permDialog.visible"
      width="600px"
    >
      <el-tree
        ref="menuTree"
        :data="menuTree"
        :props="{ label: 'title', children: 'children' }"
        show-checkbox
        node-key="id"
        default-expand-all
      />
      <div slot="footer">
        <el-button @click="permDialog.visible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button type="primary" @click="submitPermission">{{
          $t("common.confirm")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from "vue";
import { useTable } from "@/composables/useTable";
import TableToolbar from "@/components/TableToolbar/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import ExportDropdown from "@/components/ExportDropdown/index.vue";
import {
  requestGetRoleListApi,
  requestCreateRoleApi,
  requestUpdateRoleApi,
  requestDeleteRoleApi,
} from "@/api";

// 搜索参数（角色管理暂无搜索条件）
const queryParams = reactive({});

// 使用 useTable 组合式函数
const { loading, tableData, total, pageNum, pageSize, getList } = useTable(
  requestGetRoleListApi,
  queryParams
);

// 组件自己的状态
const formRef = ref(null);
const menuTree = ref([]);
const dialog = reactive({ visible: false, title: "", isEdit: false });
const permDialog = reactive({ visible: false, roleId: null });
const form = reactive({
  role_name: {},
  role_code: "",
  data_scope: "self",
  status: 1,
  description: {},
});

const rules = computed(() => ({
  role_name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  role_code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
}));

const exportColumns = computed(() => [
  { label: "角色名称", prop: "role_name", width: 120 },
  { label: "角色编码", prop: "role_code", width: 120 },
  {
    label: "状态",
    prop: "status",
    width: 80,
    formatter: (row) => (row.status === 1 ? "启用" : "禁用"),
  },
  { label: "描述", prop: "description", width: 200 },
]);

// 方法
function handleAdd() {
  dialog.visible = true;
  dialog.title = "新增角色";
  dialog.isEdit = false;
  Object.assign(form, {
    role_name: {},
    role_code: "",
    data_scope: "self",
    status: 1,
    description: {},
  });
}

function handleEdit(row) {
  dialog.visible = true;
  dialog.title = "编辑角色";
  dialog.isEdit = true;
  Object.assign(form, row);
}

function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      if (dialog.isEdit) {
        await requestUpdateRoleApi(form.id, form);
      } else {
        await requestCreateRoleApi(form);
      }
      dialog.visible = false;
      getList();
    } catch (e) {
      // 错误已由拦截器处理
    }
  });
}

function handleDelete(row) {
  // 确认删除逻辑
  requestDeleteRoleApi(row.id)
    .then(() => {
      getList();
    })
    .catch(() => {});
}

async function handlePermission(row) {
  permDialog.visible = true;
  permDialog.roleId = row.id;
  menuTree.value = []; // 从 store 或接口获取菜单树
  nextTick(() => {
    // 设置已选菜单
  });
}

async function submitPermission() {
  permDialog.visible = false;
}
</script>
