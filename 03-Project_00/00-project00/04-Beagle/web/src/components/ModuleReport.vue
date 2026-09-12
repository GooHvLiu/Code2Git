<template>
  <div v-if="report" class="module-report">
    <!-- 顶部统计 -->
    <div class="result-header">
      <div class="result-title">{{ title || '检测结果' }}</div>
      <div class="result-stats">
        <el-tag type="info">总项 {{ report.total }}</el-tag>
        <el-tag type="success">通过 {{ report.pass }}</el-tag>
        <el-tag type="danger">问题 {{ report.fail }}</el-tag>
        <el-tag type="warning">通过率 {{ report.passRate }}%</el-tag>
        <el-tag>耗时 {{ report.duration }}ms</el-tag>
      </div>
    </div>

    <!-- 插件自定义数字概览 -->
    <el-row v-if="statEntries.length" :gutter="12" class="stat-row">
      <el-col v-for="[k, v] in statEntries" :key="k" :span="Math.min(8, Math.floor(24 / statEntries.length))">
        <div class="stat-box">
          <div class="stat-num">{{ v }}</div>
          <div class="stat-label">{{ statLabel(k) }}</div>
        </div>
      </el-col>
    </el-row>

    <el-alert :title="report.summary" type="info" :closable="false" class="summary-alert" />

    <!-- 分类筛选 -->
    <el-radio-group v-model="filterCategory" size="small" class="filter-group">
      <el-radio-button label="all">全部 ({{ report.results.length }})</el-radio-button>
      <el-radio-button v-for="c in presentCategories" :key="c.key" :label="c.key">
        {{ c.label }} ({{ c.count }})
      </el-radio-button>
    </el-radio-group>

    <el-table :data="filteredResults" size="small" max-height="560" border>
      <el-table-column prop="id" label="#" width="55" align="center" />
      <el-table-column label="类别" width="120">
        <template #default="{ row }">
          <el-tag :type="categoryTag(row.category)" size="small">{{ categoryLabel(row.category) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="检测项" min-width="180" show-overflow-tooltip />
      <el-table-column label="结果" width="70" align="center">
        <template #default="{ row }">
          <el-icon :size="16" :color="row.passed ? '#67c23a' : '#f56c6c'">
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

    <el-dialog v-model="detailVisible" title="问题详情" width="680px" append-to-body>
      <el-descriptions :column="2" border size="small" class="detail-desc">
        <el-descriptions-item label="检测项">{{ currentDetail?.name }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ categoryLabel(currentDetail?.category) }}</el-descriptions-item>
      </el-descriptions>
      <pre class="detail-json">{{ JSON.stringify(currentDetail?.detail ?? currentDetail?.message, null, 2) }}</pre>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  report: { type: Object, default: null },
  title: { type: String, default: '' },
  // 插件可覆盖分类中文名
  categoryMap: { type: Object, default: () => ({}) }
})

const DEFAULT_CATEGORY_MAP = {
  error: { label: '错误', tag: 'danger' },
  fail: { label: '失败', tag: 'danger' },
  warning: { label: '警告', tag: 'warning' },
  uncertain: { label: '存疑', tag: 'info' },
  info: { label: '信息', tag: 'info' },
  pass: { label: '通过', tag: 'success' }
}

const filterCategory = ref('all')
const detailVisible = ref(false)
const currentDetail = ref(null)

function mergedMap() { return { ...DEFAULT_CATEGORY_MAP, ...props.categoryMap } }
function categoryLabel(c) { return mergedMap()[c]?.label || c || '其他' }
function categoryTag(c) { return mergedMap()[c]?.tag || 'info' }

// 人类可读的 stats key（驼峰转空格）
const STAT_LABELS = {
  filesScanned: '扫描文件', issuesFound: '问题数', linesScanned: '扫描行数',
  definedKeys: '已定义', referencedKeys: '引用数', totalSize: '总体积',
  chunkCount: '产物数', routesFound: '接口数', unprotected: '未鉴权', hits: '命中'
}
function statLabel(k) { return STAT_LABELS[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()) }

const statEntries = computed(() => {
  const s = props.report?.stats
  if (!s || typeof s !== 'object') return []
  return Object.entries(s).filter(([, v]) => ['number', 'string'].includes(typeof v))
})

const presentCategories = computed(() => {
  if (!props.report) return []
  const count = {}
  for (const r of props.report.results) count[r.category] = (count[r.category] || 0) + 1
  return Object.keys(count).map(k => ({ key: k, label: categoryLabel(k), count: count[k] }))
})

const filteredResults = computed(() => {
  if (!props.report) return []
  if (filterCategory.value === 'all') return props.report.results
  return props.report.results.filter(r => r.category === filterCategory.value)
})

function showDetail(row) {
  currentDetail.value = row
  detailVisible.value = true
}
</script>

<style scoped>
.result-header { display: flex; justify-content: space-between; align-items: center; }
.result-title { font-size: 16px; font-weight: 600; }
.result-stats { display: flex; gap: 8px; flex-wrap: wrap; }
.stat-row { margin-top: 14px; }
.stat-box { background: #f8f9fa; border-radius: 8px; padding: 14px; text-align: center; }
.stat-num { font-size: 22px; font-weight: 700; color: #1890ff; }
.stat-label { font-size: 12px; color: #909399; margin-top: 4px; }
.summary-alert { margin: 12px 0; }
.filter-group { margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 6px; }
.detail-desc { margin-bottom: 12px; }
.detail-json {
  background: #1e1e2e; color: #cdd6f4; padding: 16px; border-radius: 8px;
  font-size: 12px; line-height: 1.6; max-height: 420px; overflow: auto; margin: 0;
}
</style>
