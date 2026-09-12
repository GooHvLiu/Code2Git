<template>
  <div class="page-container">
    <!-- 插件介绍 -->
    <div class="card intro-card">
      <div class="intro-head" @click="introOpen = !introOpen">
        <div class="intro-title">
          <SafeIcon name="DocumentChecked" :size="22" />
          <span>国际化检测</span>
          <el-tag size="small" type="info">v{{ meta.version || '2.0.0' }}</el-tag>
          <el-tag size="small" type="success" v-if="meta.author">作者：{{ meta.author }}</el-tag>
        </div>
        <el-icon class="intro-toggle" :class="{ open: introOpen }"><ArrowDown /></el-icon>
      </div>
      <el-collapse-transition>
        <div v-show="introOpen" class="intro-body">
          <p>{{ meta.description }}</p>
          <div class="capability-grid">
            <div v-for="cap in capabilities" :key="cap.title" class="cap-item">
              <el-icon :color="cap.color"><component :is="cap.icon" /></el-icon>
              <div>
                <div class="cap-title">{{ cap.title }}</div>
                <div class="cap-desc">{{ cap.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <!-- 配置区域（schema 驱动） -->
    <div class="card">
      <div class="page-header">
        <div class="header-title">检测配置</div>
        <div class="header-actions">
          <el-select v-model="selectedProject" placeholder="选择项目" style="width: 220px" @change="loadConfig">
            <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
          <el-button type="primary" @click="handleRun" :loading="running">
            <el-icon><VideoPlay /></el-icon> 开始检测
          </el-button>
        </div>
      </div>

      <el-skeleton v-if="schemaLoading" :rows="3" animated />
      <ConfigForm v-else :schema="configSchema" v-model="config" />
    </div>

    <!-- 进度 -->
    <div v-if="running" class="card" style="margin-top: 16px">
      <el-steps :active="activeStage" align-center finish-status="success">
        <el-step v-for="s in stages" :key="s.key" :title="s.label" />
      </el-steps>
    </div>

    <!-- 检测结果 -->
    <div v-if="report" class="card" style="margin-top: 16px">
      <div class="result-header">
        <div class="result-title">检测结果</div>
        <div class="result-stats">
          <el-tag type="info">总项 {{ report.total }}</el-tag>
          <el-tag type="success">通过 {{ report.pass }}</el-tag>
          <el-tag type="danger">问题 {{ report.fail }}</el-tag>
          <el-tag type="warning">通过率 {{ report.passRate }}%</el-tag>
          <el-tag>耗时 {{ report.duration }}ms</el-tag>
        </div>
      </div>

      <!-- 概览数字 -->
      <el-row :gutter="12" class="stat-row" v-if="report.stats">
        <el-col :span="6"><div class="stat-box"><div class="stat-num">{{ report.stats.languages }}</div><div class="stat-label">语言包</div></div></el-col>
        <el-col :span="6"><div class="stat-box"><div class="stat-num">{{ report.stats.definedKeys }}</div><div class="stat-label">已定义Key</div></div></el-col>
        <el-col :span="6"><div class="stat-box"><div class="stat-num">{{ report.stats.referencedKeys }}</div><div class="stat-label">引用Key</div></div></el-col>
        <el-col :span="6"><div class="stat-box"><div class="stat-num">{{ report.stats.filesScanned }}</div><div class="stat-label">扫描文件</div></div></el-col>
      </el-row>

      <el-alert :title="report.summary" type="info" :closable="false" style="margin: 12px 0" />

      <!-- 分类筛选（动态生成） -->
      <el-radio-group v-model="filterCategory" size="small" style="margin-bottom: 12px; flex-wrap: wrap; display: flex">
        <el-radio-button label="all">全部 ({{ report.results.length }})</el-radio-button>
        <el-radio-button v-for="c in presentCategories" :key="c.key" :label="c.key">
          {{ c.label }} ({{ c.count }})
        </el-radio-button>
      </el-radio-group>

      <el-table :data="filteredResults" size="small" max-height="520" border>
        <el-table-column prop="id" label="#" width="55" align="center" />
        <el-table-column label="类别" width="110">
          <template #default="{ row }">
            <el-tag :type="categoryTag(row.category)" size="small">{{ categoryLabel(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="检测项" min-width="200" show-overflow-tooltip />
        <el-table-column label="结果" width="70" align="center">
          <template #default="{ row }">
            <el-icon :color="row.passed ? '#67c23a' : '#f56c6c'">
              <component :is="row.passed ? 'CircleCheckFilled' : 'CircleCloseFilled'" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="详情" min-width="280" show-overflow-tooltip />
        <el-table-column label="操作" width="70" align="center">
          <template #default="{ row }">
            <el-button v-if="row.detail" type="primary" link size="small" @click="showDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="问题详情" width="680px">
      <el-descriptions :column="2" border size="small" style="margin-bottom: 12px">
        <el-descriptions-item label="检测项">{{ currentDetail?.name }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ categoryLabel(currentDetail?.category) }}</el-descriptions-item>
      </el-descriptions>
      <pre class="detail-json">{{ JSON.stringify(currentDetail?.detail ?? currentDetail?.message, null, 2) }}</pre>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import SafeIcon from '@/components/SafeIcon.vue'
import ConfigForm from '@/components/ConfigForm.vue'
import { getAllProjects } from '@/api/projects'
import { getModuleList, getModuleConfig, saveModuleConfig } from '@/api/modules'
import { runTest, getTestReport } from '@/api/testRuns'

const MODULE_TYPE = 'i18n-check'
const route = useRoute()

const projects = ref([])
const selectedProject = ref(null)
const running = ref(false)
const schemaLoading = ref(true)
const introOpen = ref(false)

const meta = reactive({ version: '', author: '', description: '' })
const configSchema = ref([])
const config = reactive({})
const stages = ref([{ key: 'run', label: '执行' }])
const activeStage = ref(0)

const report = ref(null)
const filterCategory = ref('all')
const detailVisible = ref(false)
const currentDetail = ref(null)

const capabilities = [
  { title: '语言包完整性', desc: '缺失/多余/空值/重复键，支持单文件、模块目录、JSON', icon: 'DocumentChecked', color: '#1890ff' },
  { title: '多框架引用', desc: 'vue-i18n / react-intl / i18next / 后端 gettext', icon: 'Connection', color: '#67c23a' },
  { title: '未定义 & 冗余', desc: '引用未定义的 key、定义却未使用的 key', icon: 'Warning', color: '#e6a23c' },
  { title: '文件引用图', desc: 'import/require 分析，识别孤儿文件与断链', icon: 'Share', color: '#909399' },
  { title: '数据库国际化', desc: '表/字段使用、冗余表、多语言列检查', icon: 'Coin', color: '#f56c6c' },
  { title: '存疑不武断', desc: '动态 key、孤儿文件等不确定项单列存疑', icon: 'QuestionFilled', color: '#9b59b6' }
]

const CATEGORY_MAP = {
  error: { label: '错误', tag: 'danger' },
  missing: { label: '缺失', tag: 'danger' },
  undefined: { label: '未定义引用', tag: 'danger' },
  broken: { label: '断链', tag: 'danger' },
  extra: { label: '多余', tag: 'warning' },
  empty: { label: '空值', tag: 'warning' },
  unused: { label: '未使用', tag: 'warning' },
  warning: { label: '警告', tag: 'warning' },
  orphan: { label: '孤儿文件', tag: 'warning' },
  uncertain: { label: '存疑', tag: 'info' },
  symmetry: { label: '对称性汇总', tag: 'info' },
  reference: { label: '引用汇总', tag: 'info' },
  graph: { label: '引用图', tag: 'info' },
  database: { label: '数据库', tag: 'info' },
  info: { label: '信息', tag: 'info' },
  pass: { label: '通过', tag: 'success' }
}
function categoryLabel(c) { return CATEGORY_MAP[c]?.label || c || '其他' }
function categoryTag(c) { return CATEGORY_MAP[c]?.tag || 'info' }

const presentCategories = computed(() => {
  if (!report.value) return []
  const count = {}
  for (const r of report.value.results) count[r.category] = (count[r.category] || 0) + 1
  return Object.keys(count).map(k => ({ key: k, label: categoryLabel(k), count: count[k] }))
})
const filteredResults = computed(() => {
  if (!report.value) return []
  if (filterCategory.value === 'all') return report.value.results
  return report.value.results.filter(r => r.category === filterCategory.value)
})

// 从 schema 生成默认配置
function defaultsFromSchema(schema) {
  const obj = {}
  for (const f of schema) {
    obj[f.key] = f.default !== undefined ? JSON.parse(JSON.stringify(f.default)) : (f.type === 'boolean' ? false : (f.type === 'multiselect' ? [] : ''))
  }
  return obj
}

async function loadMeta() {
  try {
    const res = await getModuleList()
    const m = (res.data || []).find(x => x.moduleType === MODULE_TYPE)
    if (m) {
      meta.version = m.version
      meta.author = m.author
      meta.description = m.description
      configSchema.value = m.configSchema || []
      stages.value = m.progressStages || [{ key: 'run', label: '执行' }]
      Object.assign(config, defaultsFromSchema(configSchema.value))
    }
  } finally {
    schemaLoading.value = false
  }
}

async function loadProjects() {
  const res = await getAllProjects()
  projects.value = res.data
  if (route.query.projectId) {
    selectedProject.value = Number(route.query.projectId)
  } else if (projects.value.length > 0) {
    selectedProject.value = projects.value[0].id
  }
  if (selectedProject.value) loadConfig()
}

async function loadConfig() {
  if (!selectedProject.value) return
  try {
    const res = await getModuleConfig(selectedProject.value)
    const cfg = res.data?.find(c => c.module_type === MODULE_TYPE)
    if (cfg?.config) Object.assign(config, cfg.config)
  } catch (e) { /* ignore */ }
}

async function handleRun() {
  if (!selectedProject.value) return ElMessage.warning('请先选择项目')
  running.value = true
  report.value = null
  activeStage.value = 0
  filterCategory.value = 'all'
  try {
    await saveModuleConfig(selectedProject.value, { module_type: MODULE_TYPE, config: { ...config }, enabled: 1 })
    const runRes = await runTest({ project_id: selectedProject.value, module_type: MODULE_TYPE, config: { ...config } })
    await waitForResult(runRes.data.run_id)
  } catch (e) {
    console.error(e)
  } finally {
    running.value = false
  }
}

async function waitForResult(runId, maxAttempts = 90) {
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

function showDetail(row) {
  currentDetail.value = row
  detailVisible.value = true
}

onMounted(() => {
  loadMeta()
  loadProjects()
})
</script>

<style scoped>
.intro-card { padding: 0; overflow: hidden; }
.intro-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; cursor: pointer; user-select: none;
}
.intro-title { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; }
.intro-toggle { transition: transform .2s; color: #909399; }
.intro-toggle.open { transform: rotate(180deg); }
.intro-body { padding: 0 20px 18px; border-top: 1px solid #f0f0f0; }
.intro-body p { font-size: 13px; color: #606266; line-height: 1.8; margin: 12px 0; }
.capability-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.cap-item { display: flex; gap: 10px; background: #f8f9fa; border-radius: 8px; padding: 12px; }
.cap-item .el-icon { font-size: 20px; margin-top: 2px; }
.cap-title { font-size: 13px; font-weight: 600; color: #303133; }
.cap-desc { font-size: 12px; color: #909399; line-height: 1.5; margin-top: 2px; }

.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.header-title { font-size: 16px; font-weight: 600; }
.header-actions { display: flex; gap: 12px; align-items: center; }

.result-header { display: flex; justify-content: space-between; align-items: center; }
.result-title { font-size: 16px; font-weight: 600; }
.result-stats { display: flex; gap: 8px; }
.stat-row { margin-top: 14px; }
.stat-box { background: #f8f9fa; border-radius: 8px; padding: 14px; text-align: center; }
.stat-num { font-size: 24px; font-weight: 700; color: #1890ff; }
.stat-label { font-size: 12px; color: #909399; margin-top: 4px; }
.detail-json {
  background: #1e1e2e; color: #cdd6f4; padding: 16px; border-radius: 8px;
  font-size: 12px; line-height: 1.6; max-height: 420px; overflow: auto; margin: 0;
}
</style>
