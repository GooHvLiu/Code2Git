<template>
  <div class="page-container">
    <div class="card">
      <div class="page-header">
        <div class="header-title">被测项目管理</div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新增项目
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="项目名称" width="180" />
        <el-table-column prop="description" label="描述" min-width="150" show-overflow-tooltip />
        <el-table-column prop="frontend_path" label="前端路径" min-width="200" show-overflow-tooltip />
        <el-table-column prop="backend_path" label="后端路径" min-width="200" show-overflow-tooltip />
        <el-table-column prop="api_base_url" label="API地址" width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === "active" ? "启用" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handleTest(row)">测试</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        style="margin-top: 16px; justify-content: flex-end"
      />
    </div>

    <!-- 项目表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑项目' : '新增项目'" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="115px">
        <el-form-item prop="name">
          <template #label>
            <span>项目名称</span>
            <el-tooltip content="被测项目的名称，用于在平台中识别" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span>项目描述</span>
            <el-tooltip content="项目的简要说明，方便管理时识别" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入项目描述" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span>前端路径</span>
            <el-tooltip content="被测项目前端代码的本地绝对路径，插件通过此路径扫描文件" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.frontend_path" placeholder="如：F:\project\frontend" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span>后端路径</span>
            <el-tooltip content="被测项目后端代码的本地绝对路径" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.backend_path" placeholder="如：F:\project\backend" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span>API地址</span>
            <el-tooltip content="后端服务的基础 URL，接口测试插件通过此地址发起请求" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.api_base_url" placeholder="如：http://localhost:3000" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span>管理员账号</span>
            <el-tooltip content="测试时用于登录系统的管理员账号" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.admin_username" placeholder="测试用管理员账号" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span>管理员密码</span>
            <el-tooltip content="测试时用于登录系统的管理员密码" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.admin_password" type="password" show-password placeholder="测试用管理员密码" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span>状态</span>
            <el-tooltip content="停用后该项目不会显示在测试模块选择列表中" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-switch v-model="form.status" active-value="active" inactive-value="inactive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getProjectList, createProject, updateProject, deleteProject } from "@/api/projects";

const router = useRouter();
const tableData = ref([]);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref(null);

const form = reactive({
  id: null,
  name: "",
  description: "",
  frontend_path: "",
  backend_path: "",
  api_base_url: "",
  admin_username: "",
  admin_password: "",
  status: "active"
});

const rules = {
  name: [{ required: true, message: "请输入项目名称", trigger: "blur" }]
};

async function loadData() {
  loading.value = true;
  try {
    const res = await getProjectList({ page: page.value, pageSize: pageSize.value });
    tableData.value = res.data.list;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
}

function onPageChange(p) {
  page.value = p;
  loadData();
}

function onSizeChange(s) {
  pageSize.value = s;
  page.value = 1;
  loadData();
}

function resetForm() {
  Object.assign(form, {
    id: null,
    name: "",
    description: "",
    frontend_path: "",
    backend_path: "",
    api_base_url: "",
    admin_username: "",
    admin_password: "",
    status: "active"
  });
}

function handleAdd() {
  isEdit.value = false;
  resetForm();
  dialogVisible.value = true;
}

function handleEdit(row) {
  isEdit.value = true;
  Object.assign(form, { ...row, admin_password: "******" });
  dialogVisible.value = true;
}

async function handleSubmit() {
  await formRef.value.validate();
  try {
    if (isEdit.value) {
      await updateProject(form.id, form);
      ElMessage.success("更新成功");
    } else {
      await createProject(form);
      ElMessage.success("创建成功");
    }
    dialogVisible.value = false;
    loadData();
  } catch (e) {
    // 错误已在拦截器处理
  }
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除项目「${row.name}」吗？相关测试记录也会被删除。`, "提示", {
    type: "warning"
  });
  await deleteProject(row.id);
  ElMessage.success("删除成功");
  loadData();
}

function handleTest(row) {
  router.push({ path: "/modules", query: { projectId: row.id } });
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}
</style>
