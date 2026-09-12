<template>
  <div class="page-container">
    <div class="card">
      <div class="page-header">
        <div class="header-left">
          <div class="header-title">插件管理</div>
          <el-tag size="small" type="info">{{ total }} 个插件</el-tag>
        </div>
        <div class="header-right">
        </div>
      </div>

      <el-alert
        title="插件与项目独立管理：删除项目不会卸载插件，每个项目可单独绑定/解绑插件"
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      />

      <el-table :data="plugins" v-loading="loading" border>
        <el-table-column label="插件" min-width="220">
          <template #default="{ row }">
            <div class="plugin-info">
              <div class="plugin-icon" :class="{ disabled: row.enabled !== 1 }">
                <SafeIcon :name="row.icon" :size="22" />
              </div>
              <div>
                <div class="plugin-name">{{ row.module_name }}</div>
                <div class="plugin-type">{{ row.module_type }} · v{{ row.version }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="240" show-overflow-tooltip />
        <el-table-column label="分类" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ categoryNames[row.category] || row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="100" align="center">
          <template #default="{ row }">
            {{ row.author || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.enabled === 1" @change="(val) => handleToggle(row, val)" />
          </template>
        </el-table-column>
        <el-table-column label="绑定项目" width="110" align="center">
          <template #default="{ row }">
            <el-button link @click="showBindDialog(row)"> {{ boundCount[row.module_type] || 0 }} 个项目 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 绑定项目对话框 -->
    <el-dialog v-model="bindDialogVisible" :title="`绑定项目 - ${currentPlugin?.module_name}`" width="600px">
      <el-checkbox-group v-model="selectedProjects" style="display: flex; flex-direction: column; gap: 10px">
        <el-checkbox v-for="p in allProjects" :key="p.id" :value="p.id">
          {{ p.name }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="bindDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBindings">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import SafeIcon from "@/components/SafeIcon.vue";
import { getPluginList, togglePlugin } from "@/api/plugins";
import { getAllProjects } from "@/api/projects";
import request from "@/api/request";

const loading = ref(false);
const plugins = ref([]);
const allProjects = ref([]);
const boundCount = ref({});
const bindDialogVisible = ref(false);
const currentPlugin = ref(null);
const selectedProjects = ref([]);

const categoryNames = {
  quality: "质量检测",
  permission: "权限测试",
  api: "接口测试",
  performance: "性能测试",
  security: "安全测试",
  other: "其他"
};

const total = ref(0);

async function loadPlugins() {
  loading.value = true;
  try {
    const res = await getPluginList();
    plugins.value = res.data;
    total.value = res.data.length;
    loadBoundCounts();
  } finally {
    loading.value = false;
  }
}

async function loadBoundCounts() {
  const res = await getAllProjects();
  allProjects.value = res.data;
  const counts = {};
  for (const p of allProjects.value) {
    try {
      const pluginRes = await request({ url: `/plugins/project/${p.id}`, method: "get" });
      for (const pp of pluginRes.data) {
        counts[pp.module_type] = (counts[pp.module_type] || 0) + 1;
      }
    } catch (e) {
      /* ignore */
    }
  }
  boundCount.value = counts;
}

async function handleToggle(row, val) {
  try {
    await togglePlugin(row.module_type, val);
    ElMessage.success(val ? `插件「${row.module_name}」已启用` : `插件「${row.module_name}」已禁用`);
    loadPlugins();
  } catch (e) {
    ElMessage.error("操作失败");
  }
}

function showBindDialog(row) {
  currentPlugin.value = row;
  selectedProjects.value = [];
  bindDialogVisible.value = true;
}

async function saveBindings() {
  const moduleType = currentPlugin.value.module_type;
  for (const p of allProjects.value) {
    const shouldBind = selectedProjects.value.includes(p.id);
    try {
      const res = await request({ url: `/plugins/project/${p.id}`, method: "get" });
      const existing = res.data.find((pp) => pp.module_type === moduleType);
      if (shouldBind && !existing) {
        await request({ url: `/plugins/project/${p.id}/bind`, method: "post", data: { module_type: moduleType } });
      } else if (!shouldBind && existing) {
        await request({ url: `/plugins/project/${p.id}/unbind/${moduleType}`, method: "delete" });
      }
    } catch (e) {
      /* ignore */
    }
  }
  ElMessage.success("项目绑定已更新");
  bindDialogVisible.value = false;
  loadBoundCounts();
}

onMounted(() => {
  loadPlugins();
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.plugin-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.plugin-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #ecf5ff;
  color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.plugin-icon.disabled {
  background: #f5f7fa;
  color: #909399;
}

.plugin-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.plugin-type {
  font-size: 12px;
  color: #909399;
}
</style>
