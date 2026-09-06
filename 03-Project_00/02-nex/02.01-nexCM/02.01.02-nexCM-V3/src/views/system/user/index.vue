<template>
  <div class="user-management">
    <!-- ==================== 页面头部 ==================== -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ $t("menu.system.user.page.title") }}
        </h2>
        <p class="page-desc">{{ $t("menu.system.user.page.pageDesc") }}</p>
      </div>
      <div class="header-right">
        <export-dropdown
          :data="tableData"
          :columns="exportColumns"
          :title="$t('menu.system.user.page.title')"
          :filename="$t('menu.system.user.page.title')"
          :selected="selectedRows"
          :exporter="$store.state.user.userInfo?.username || ''"
        />
        <el-button
          v-if="selectedIds.length > 0"
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="handleBatchDelete"
        >
          {{ $t("common.delete") }}({{ selectedIds.length }})
        </el-button>
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
          @click="refreshList"
        >
          {{ $t("common.refresh") }}
        </el-button>
      </div>
    </div>

    <!-- ==================== 搜索表单 ==================== -->
    <search-form :form="queryParams" @search="handleQuery" @reset="handleReset">
      <el-form-item
        :label="$t('menu.system.user.page.username')"
        prop="username"
      >
        <el-input
          v-model="queryParams.username"
          :placeholder="$t('menu.system.user.page.username')"
          clearable
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item :label="$t('menu.system.user.page.role')" prop="role">
        <el-select
          v-model="queryParams.role"
          :placeholder="$t('menu.system.user.page.role')"
          clearable
          style="width: 120px"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('menu.system.user.page.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :placeholder="$t('menu.system.user.page.status')"
          clearable
          style="width: 100px"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </search-form>

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
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        :label="$t('common.index')"
        type="index"
        width="60"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.user.page.username')"
        prop="username"
        min-width="120"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.user.page.realName')"
        prop="real_name"
        min-width="100"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.user.page.email')"
        prop="email"
        min-width="160"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.user.page.phone')"
        prop="phone"
        min-width="120"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.user.page.role')"
        prop="role"
        min-width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <dict-tag dict-code="user_role" :value="row.role" />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.system.user.page.dept')"
        prop="dept_name"
        min-width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.dept_name || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.system.user.page.status')"
        prop="status"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <dict-tag :options="statusOptions" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.system.user.page.createTime')"
        prop="create_time"
        min-width="160"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          {{ formatDateTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.operation')"
        width="240"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)">{{
            $t("common.edit")
          }}</el-button>
          <el-button type="text" size="small" @click="handleResetPwd(row)">{{
            $t("menu.system.user.page.resetPassword")
          }}</el-button>
          <el-button
            v-if="isUserLocked(row)"
            type="text"
            size="small"
            style="color: #e6a23c"
            @click="handleUnlock(row)"
            >{{ $t("menu.system.user.page.unlock") }}</el-button
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

    <!-- ==================== 分页 ==================== -->
    <pagination
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      @pagination="getList"
    />

    <!-- ==================== 新增/编辑弹窗 ==================== -->
    <user-dialog ref="userDialog" @success="refreshList" />

    <!-- ==================== 重置密码弹窗 ==================== -->
    <el-dialog
      title="重置密码"
      :visible.sync="resetPwdDialogVisible"
      width="400px"
    >
      <el-form :model="resetPwdForm" label-width="80px">
        <el-form-item label="用户名"
          ><span>{{ resetPwdUser?.username }}</span></el-form-item
        >
        <el-form-item label="新密码">
          <el-input
            v-model="resetPwdForm.newPassword"
            type="password"
            placeholder="请输入新密码（至少8位）"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="resetPwdForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            @keyup.enter.native="handleConfirmResetPwd"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="resetPwdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmResetPwd"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useTable } from "@/composables/useTable";
import { useDict } from "@/composables/useDict";
import SearchForm from "@/components/SearchForm/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import DictTag from "@/components/DictTag/index.vue";
import ExportDropdown from "@/components/ExportDropdown/index.vue";
import { formatDate } from "@/utils/date";
// eslint-disable-next-line no-unused-vars
import UserDialog from "./components/UserDialog.vue";
import {
  requestGetUserListApi,
  requestDeleteUserApi,
  requestBatchDeleteUserApi,
  requestResetUserPwdApi,
  requestUnlockUserApi,
} from "@/api";
import { Message, MessageBox } from "element-ui";
import { requestGetRoleAllApi } from "@/api";
import { requestGetDeptTreeApi } from "@/api";
import { withCache } from "@/utils/cache";
import { useI18n } from "@/composables/useI18n";

const { t: $t } = useI18n();

// 字典数据
const { dict } = useDict(["user_status", "user_sex", "user_role"]);

// 搜索参数
const queryParams = reactive({
  username: "",
  role: "",
  status: "",
});

// 请求前参数转换
function beforeFetch(params) {
  const { pageNum, ...rest } = params;
  return { page: pageNum, ...rest };
}

// 使用 useTable 组合式函数
const {
  loading,
  tableData,
  total,
  pageNum,
  pageSize,
  getList,
  handleQuery,
  handleReset,
  refreshList,
  handleSortChange,
} = useTable(requestGetUserListApi, queryParams, { beforeFetch });

// 角色列表（从角色管理接口获取，带缓存）
const roleList = ref([]);
// 部门树（从部门管理接口获取，带缓存）
const deptTree = ref([]);
// 选中的ID列表
const selectedIds = ref([]);
// 选中的行数据（用于导出选中）
const selectedRows = ref([]);

// 弹窗 ref
const userDialog = ref(null);

// 角色列表（从字典获取，用于下拉框和显示）
const roleOptions = computed(() => dict.value.user_role || []);

// 角色映射（用于表格显示）
const roleMap = computed(() => {
  const map = {};
  roleOptions.value.forEach((item) => {
    map[item.value] = item.label;
  });
  return map;
});

// 状态字典（从数据字典获取）
const statusOptions = computed(() => dict.value.user_status || []);

// 导出列配置
const exportColumns = computed(() => [
  { label: "用户名", prop: "username", width: 120 },
  { label: "真实姓名", prop: "real_name", width: 100 },
  { label: "邮箱", prop: "email", width: 180 },
  { label: "手机号", prop: "phone", width: 130 },
  {
    label: "角色",
    prop: "role",
    width: 100,
    formatter: (row) => roleMap.value[row.role] || row.role,
  },
  {
    label: "状态",
    prop: "status",
    width: 80,
    formatter: (row) => (row.status === 1 ? "启用" : "禁用"),
  },
  {
    label: "创建时间",
    prop: "create_time",
    width: 170,
    formatter: (row) => formatDate(row.create_time),
  },
]);

// 加载角色列表（从角色管理接口，带缓存）
async function loadRoleList() {
  try {
    const res = await withCache("user_roleList", () => requestGetRoleAllApi());
    roleList.value = res.data || [];
  } catch (e) {
    // eslint-disable-next-line no-console
  }
}

// 加载部门树（从部门管理接口，带缓存）
async function loadDeptTree() {
  try {
    const res = await withCache("user_deptTree", () => requestGetDeptTreeApi());
    deptTree.value = res.data || [];
  } catch (e) {
    // eslint-disable-next-line no-console
  }
}

// 格式化日期时间（模板中使用）
function formatDateTime(date) {
  return formatDate(date);
}

// 多选变化
function handleSelectionChange(selection) {
  selectedIds.value = selection.map((item) => item.id);
  selectedRows.value = selection;
}

// 新增
function handleAdd() {
  userDialog.value.open();
}

// 编辑
function handleEdit(row) {
  userDialog.value.open(row);
}

// 删除
function handleDelete(row) {
  MessageBox.confirm(`确定要删除用户「${row.username}」吗？此操作不可撤销！`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await requestDeleteUserApi(row.id);
        Message.success("删除成功");
        refreshList();
      } catch (err) {
        // 错误已由拦截器处理
      }
    })
    .catch(() => {});
}

// 批量删除
function handleBatchDelete() {
  if (selectedIds.value.length === 0) {
    Message.warning("请先选择要删除的用户");
    return;
  }
  MessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个用户吗？此操作不可撤销！`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await requestBatchDeleteUserApi([...selectedIds.value]);
        Message.success("批量删除成功");
        selectedIds.value = [];
        refreshList();
      } catch (err) {
        // 错误已由拦截器处理
      }
    })
    .catch(() => {});
}

// 重置密码相关
const resetPwdDialogVisible = ref(false);
const resetPwdUser = ref(null);
const resetPwdForm = reactive({ newPassword: "", confirmPassword: "" });

function handleResetPwd(row) {
  resetPwdUser.value = row;
  resetPwdForm.newPassword = "";
  resetPwdForm.confirmPassword = "";
  resetPwdDialogVisible.value = true;
}

async function handleConfirmResetPwd() {
  if (!resetPwdForm.newPassword || resetPwdForm.newPassword.length < 8) {
    Message.warning("密码长度不能少于8位");
    return;
  }
  if (resetPwdForm.newPassword !== resetPwdForm.confirmPassword) {
    Message.warning($t("menu.system.user.page.passwordMismatch"));
    return;
  }
  try {
    await requestResetUserPwdApi(
      resetPwdUser.value.id,
      resetPwdForm.newPassword
    );
    Message.success($t("menu.system.user.page.resetPasswordSuccess"));
    resetPwdDialogVisible.value = false;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[用户管理] 重置密码失败:", err);
  }
}
// 判断用户是否被锁定
function isUserLocked(row) {
  if (!row.lock_until) return false;
  return new Date(row.lock_until) > new Date();
}

// 解锁用户
async function handleUnlock(row) {
  try {
    await MessageBox.confirm(
      $t("menu.system.user.page.unlockConfirm"),
      $t("common.tip"),
      {
        confirmButtonText: $t("common.confirm"),
        cancelButtonText: $t("common.cancel"),
        type: "warning",
      }
    );
    await requestUnlockUserApi(row.id);
    Message.success($t("menu.system.user.page.unlockSuccess"));
    getList();
  } catch (err) {
    if (err !== "cancel") {
      // eslint-disable-next-line no-console
      console.error("[用户管理] 解锁用户失败:", err);
    }
  }
}
onMounted(() => {
  loadRoleList();
  loadDeptTree();
});
</script>

<style scoped lang="less">
.user-management {
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

/deep/ .el-table .caret-wrapper {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
