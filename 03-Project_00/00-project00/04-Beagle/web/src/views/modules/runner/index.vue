<template>
  <div class="page-container">
    <!-- 插件介绍 -->
    <div class="card intro-card" v-if="meta.moduleName">
      <div class="intro-head">
        <div class="intro-title">
          <SafeIcon :name="meta.icon" :size="24" />
          <span>{{ meta.moduleName }}</span>
          <el-tag size="small" type="info">v{{ meta.version || '1.0.0' }}</el-tag>
          <el-tag v-if="meta.author" size="small" type="success">作者：{{ meta.author }}</el-tag>
          <el-tag size="small">{{ categoryName(meta.category) }}</el-tag>
        </div>
      </div>
      <p class="intro-desc">{{ meta.description }}</p>
    </div>

    <!-- 配置 -->
    <div class="card">
      <div class="page-header">
        <div class="header-title">检测配置</div>
        <div class="header-actions">
          <el-select v-model="selectedProject" placeholder="选择项目" style="width: 220px" @change="loadConfig">
            <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
          <el-button type="primary" @click="handleRun" :loading="running" :disabled="!selectedProject">
            <el-icon><VideoPlay /></el-icon> 开始检测
          </el-button>
        </div>
      </div>

      <el-skeleton v-if="metaLoading" :rows="3" animated />
      <el-empty v-else-if="!meta.moduleName" description="未找到该插件" />
      <ConfigForm v-else :schema="meta.configSchema || []" v-model="config" />
    </div>

    <!-- 进度 -->
    <div v-if="running" class="card stage-card">
      <el-steps :active="activeStage" align-center finish-status="success">
        <el-step v-for="s in stages" :key="s.key" :title="s.label" />
      </el-steps>
    </div>

    <!-- 结果 -->
    <div class="card result-card" v-if="report">
      <ModuleReport :report="report" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import SafeIcon from '@/components/SafeIcon.vue'
import ConfigForm from '@/components/ConfigForm.vue'
import ModuleReport from '@/components/ModuleReport.vue'
import { getAllProjects } from '@/api/projects'
import { getModuleList, getModuleConfig, saveModuleConfig } from '@/api/modules'
import { runTest, getTestReport } from '@/api/testRuns'

const route = useRoute()
const router = useRouter()
const moduleType = route.params.moduleType

const projects = ref([])
const selectedProject = ref(null)
const running = ref(false)
const metaLoading = ref(true)
const meta = reactive({})
const config = reactive({})
const stages = ref([{ key: 'run', label: '执行' }])
const activeStage = ref(0)
const report = ref(null)

const CATEGORY_NAMES = {
  quality: '质量检测', permission: '权限测试', api: '接口测试',
  performance: '性能测试', security: '安全测试', other: '其他'
}
function categoryName(c) { return CATEGORY_NAMES[c] || c || '其他' }

function defaultsFromSchema(schema) {
  const obj = {}
  for (const f of schema) {
    obj[f.key] = f.default !== undefined
      ? JSON.parse(JSON.stringify(f.default))
      : (f.type === 'boolean' ? false : (f.type === 'multiselect' ? [] : (f.type === 'number' ? null : '')))
  }
  return obj
}

async function loadMeta() {
  try {
    const res = await getModuleList()
    const m = (res.data || []).find(x => x.moduleType === moduleType)
    if (!m) {
      ElMessage.error('插件不存在或未注册')
      return
    }
    Object.assign(meta, m)
    stages.value = m.progressStages?.length ? m.progressStages : [{ key: 'run', label: '执行' }]
    Object.assign(config, defaultsFromSchema(m.configSchema || []))
  } finally {
    metaLoading.value = false
  }
}

async function loadProjects() {
  const res = await getAllProjects()
  projects.value = res.data
  if (route.query.projectId) selectedProject.value = Number(route.query.projectId)
  else if (projects.value.length) selectedProject.value = projects.value[0].id
  if (selectedProject.value) loadConfig()
}

async function loadConfig() {
  if (!selectedProject.value) return
  try {
    const res = await getModuleConfig(selectedProject.value)
    const cfg = res.data?.find(c => c.module_type === moduleType)
    if (cfg?.config) Object.assign(config, cfg.config)
  } catch (e) { /* ignore */ }
}

async function handleRun() {
  if (!selectedProject.value) return ElMessage.warning('请先选择项目')
  running.value = true
  report.value = null
  activeStage.value = 0
  try {
    await saveModuleConfig(selectedProject.value, { module_type: moduleType, config: { ...config }, enabled: 1 })
    const runRes = await runTest({ project_id: selectedProject.value, module_type: moduleType, config: { ...config } })
    await waitForResult(runRes.data.run_id)
  } catch (e) {
    console.error(e)
    ElMessage.error('执行失败')
  } finally {
    running.value = false
  }
}

async function waitForResult(runId, maxAttempts = 120) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 1000))
    activeStage.value = Math.min(stages.value.length - 1, Math.floor(i / 3))
    try {
      const res = await getTestReport(runId)
      if (res.data) {
        report.value = res.data
        activeStage.value = stages.value.length
        ElMessage.success('检测完成')
        return
      }
    } catch (e) { /* 尚未生成 */ }
  }
  ElMessage.warning('检测超时，可稍后到测试报告页查看')
}

onMounted(() => {
  loadMeta()
  loadProjects()
})
</script>

<style scoped>
.intro-card { padding: 18px 20px; }
.intro-head { display: flex; justify-content: space-between; align-items: center; }
.intro-title { display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 600; }
.intro-desc { font-size: 13px; color: #606266; line-height: 1.8; margin: 12px 0 0; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.header-title { font-size: 16px; font-weight: 600; }
.header-actions { display: flex; gap: 12px; align-items: center; }
.stage-card { margin-top: 16px; }
.result-card { margin-top: 16px; }
</style>
