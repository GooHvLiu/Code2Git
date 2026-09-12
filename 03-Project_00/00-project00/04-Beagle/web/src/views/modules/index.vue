<template>
  <div class="page-container">
    <div class="card">
      <div class="page-header">
        <div class="header-title">测试模块</div>
        <el-select v-model="selectedProject" placeholder="选择被测项目" style="width: 240px" @change="loadProjectPlugins">
          <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
        </el-select>
      </div>

      <div v-if="!selectedProject" class="empty-tip">
        <el-empty description="请先选择一个项目" />
      </div>

      <div v-loading="loading" v-else>
        <el-empty v-if="pluginList.length === 0" description="该项目尚未绑定任何插件，请到「项目管理」或「插件管理」中绑定" />

        <template v-for="(modules, category) in groupedPlugins" :key="category">
          <div class="category-title">{{ categoryNames[category] || category }}</div>
          <el-row :gutter="16">
            <el-col :span="8" v-for="mod in modules" :key="mod.moduleType">
              <div class="module-card" @click="enterModule(mod)">
                <div class="module-icon" :style="{ background: getIconBg(mod), color: getIconColor(mod) }">
                  <SafeIcon :name="mod.icon" :size="28" />
                </div>
                <div class="module-name">{{ mod.moduleName }}</div>
                <div class="module-desc">{{ mod.description }}</div>
                <div class="module-footer">
                  <el-tag type="success" size="small">v{{ mod.version || '1.0.0' }}</el-tag>
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAllProjects } from '@/api/projects'
import { getAvailablePlugins } from '@/api/plugins'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const projects = ref([])
const selectedProject = ref(null)
const pluginList = ref([])

const categoryNames = {
  quality: '质量检测',
  permission: '权限测试',
  api: '接口测试',
  performance: '性能测试',
  security: '安全测试',
  other: '其他'
}

const iconPalette = [
  { bg: '#ecf5ff', color: '#1890ff' },
  { bg: '#f0f9eb', color: '#67c23a' },
  { bg: '#fdf6ec', color: '#e6a23c' },
  { bg: '#fef0f0', color: '#f56c6c' },
  { bg: '#e6f7ff', color: '#1890ff' },
  { bg: '#f4f4f5', color: '#909399' }
]

const groupedPlugins = computed(() => {
  const groups = {}
  for (const mod of pluginList.value) {
    const cat = mod.category || 'other'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(mod)
  }
  return groups
})

function getIconBg(mod) {
  const idx = (mod.moduleType || '').charCodeAt(0) % iconPalette.length
  return iconPalette[idx].bg
}

function getIconColor(mod) {
  const idx = (mod.moduleType || '').charCodeAt(0) % iconPalette.length
  return iconPalette[idx].color
}

async function loadProjects() {
  const res = await getAllProjects()
  projects.value = res.data
  if (route.query.projectId) {
    selectedProject.value = Number(route.query.projectId)
  } else if (projects.value.length > 0) {
    selectedProject.value = projects.value[0].id
  }
  if (selectedProject.value) {
    loadProjectPlugins()
  }
}

async function loadProjectPlugins() {
  if (!selectedProject.value) return
  loading.value = true
  try {
    const res = await getAvailablePlugins(selectedProject.value)
    pluginList.value = res.data.plugins || []
  } finally {
    loading.value = false
  }
}

function enterModule(mod) {
  // 拥有定制页面的插件；其余插件统一走 schema 驱动的通用执行页
  const customPages = {
    'i18n-check': '/modules/i18n-check'
  }
  const target = customPages[mod.moduleType] || `/modules/run/${mod.moduleType}`
  router.push({ path: target, query: { projectId: selectedProject.value } })
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  margin: 16px 0 12px;
  padding-left: 8px;
  border-left: 3px solid #1890ff;
}

.module-card {
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ebeef5;
}

.module-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #1890ff;
}

.module-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.module-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.module-desc {
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
  margin-bottom: 12px;
  min-height: 36px;
}

.module-footer {
  display: flex;
  align-items: center;
}
</style>
