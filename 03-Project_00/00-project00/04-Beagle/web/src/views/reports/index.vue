<template>
  <div class="page-container">
    <div class="card">
      <div class="page-header">
        <div class="header-title">测试报告</div>
        <div class="filter-bar">
          <el-select v-model="filterProject" placeholder="项目" clearable style="width: 160px" @change="loadData">
            <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
          <el-select v-model="filterModule" placeholder="模块" clearable style="width: 160px" @change="loadData">
            <el-option v-for="m in modules" :key="m.moduleType" :label="m.moduleName" :value="m.moduleType" />
          </el-select>
          <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 120px" @change="loadData">
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
            <el-option label="执行中" value="running" />
            <el-option label="错误" value="error" />
          </el-select>
        </div>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="project_name" label="项目" width="150" />
        <el-table-column prop="module_type" label="测试模块" width="150" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span :class="'status-tag status-' + row.status">{{ statusText[row.status] || row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total_count" label="总数" width="80" />
        <el-table-column prop="pass_count" label="通过" width="80" />
        <el-table-column prop="fail_count" label="失败" width="80" />
        <el-table-column label="通过率" width="100">
          <template #default="{ row }">
            <el-progress
              :percentage="row.total_count > 0 ? Math.round((row.pass_count / row.total_count) * 100) : 0"
              :stroke-width="8"
            />
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时(ms)" width="100" />
        <el-table-column prop="triggered_by" label="触发方式" width="100" />
        <el-table-column prop="created_at" label="执行时间" width="170" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="success" link @click="$router.push(`/reports/${row.id}`)">查看</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        style="margin-top: 16px; justify-content: flex-end"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getTestRunList, deleteTestRun } from "@/api/testRuns";
import { getAllProjects } from "@/api/projects";
import { getModuleList } from "@/api/modules";

const tableData = ref([]);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const projects = ref([]);
const modules = ref([]);
const filterProject = ref(null);
const filterModule = ref(null);
const filterStatus = ref(null);

const statusText = {
  success: "成功",
  failed: "失败",
  running: "执行中",
  pending: "等待中",
  error: "错误"
};

async function loadData() {
  loading.value = true;
  try {
    const params = { page: page.value, pageSize: pageSize.value };
    if (filterProject.value) params.project_id = filterProject.value;
    if (filterModule.value) params.module_type = filterModule.value;
    if (filterStatus.value) params.status = filterStatus.value;
    const res = await getTestRunList(params);
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

async function loadProjects() {
  const res = await getAllProjects();
  projects.value = res.data;
}

async function loadModules() {
  const res = await getModuleList();
  modules.value = res.data.modules;
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除执行记录 #${row.id} 吗？`, "提示", { type: "warning" });
  await deleteTestRun(row.id);
  ElMessage.success("删除成功");
  loadData();
}

onMounted(() => {
  loadProjects();
  loadModules();
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

.filter-bar {
  display: flex;
  gap: 12px;
}
</style>
