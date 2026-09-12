<template>
  <div class="page-container">
    <div class="card" v-loading="loading">
      <div class="detail-header">
        <div>
          <el-button @click="$router.back()" link>
            <el-icon><ArrowLeft /></el-icon> 返回
          </el-button>
          <h2 style="display: inline; margin-left: 12px">报告详情 #{{ runId }}</h2>
        </div>
        <div v-if="runInfo" class="run-info">
          <el-tag>{{ runInfo.project_name }}</el-tag>
          <el-tag type="info">{{ runInfo.module_type }}</el-tag>
          <span :class="'status-tag status-' + runInfo.status">{{ statusText[runInfo.status] }}</span>
        </div>
      </div>

      <template v-if="report">
        <!-- 统计概览 -->
        <el-row :gutter="16" style="margin: 20px 0">
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-label">总数</div>
              <div class="stat-value">{{ report.total }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-label">通过</div>
              <div class="stat-value" style="color: #67c23a">{{ report.pass }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-label">失败</div>
              <div class="stat-value" style="color: #f56c6c">{{ report.fail }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-label">通过率</div>
              <div class="stat-value" style="color: #e6a23c">{{ report.passRate }}%</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-label">耗时</div>
              <div class="stat-value">{{ report.duration }}ms</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-label">时间</div>
              <div class="stat-value-sm">{{ report.timestamp?.replace('T', ' ').slice(0, 19) }}</div>
            </div>
          </el-col>
        </el-row>

        <el-alert :title="report.summary" type="info" :closable="false" style="margin-bottom: 16px" />

        <!-- 分类筛选 -->
        <el-radio-group v-model="filterCategory" style="margin-bottom: 16px">
          <el-radio-button label="all">全部 ({{ report.results.length }})</el-radio-button>
          <el-radio-button label="missing">缺失 ({{ countByCategory('missing') }})</el-radio-button>
          <el-radio-button label="extra">多余 ({{ countByCategory('extra') }})</el-radio-button>
          <el-radio-button label="empty">空值 ({{ countByCategory('empty') }})</el-radio-button>
          <el-radio-button label="pass">通过 ({{ countByCategory('pass') }})</el-radio-button>
          <el-radio-button label="info">信息 ({{ countByCategory('info') }})</el-radio-button>
        </el-radio-group>

        <!-- 结果表格 -->
        <el-table :data="filteredResults" size="small" max-height="500">
          <el-table-column prop="id" label="#" width="60" />
          <el-table-column prop="name" label="检测项" min-width="300" show-overflow-tooltip />
          <el-table-column label="结果" width="80">
            <template #default="{ row }">
              <el-tag :type="row.passed ? 'success' : 'danger'" size="small">
                {{ row.passed ? '通过' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="message" label="详情" min-width="250" show-overflow-tooltip />
          <el-table-column prop="expected" label="预期" width="150" show-overflow-tooltip />
          <el-table-column prop="actual" label="实际" width="150" show-overflow-tooltip />
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-button v-if="row.detail" type="primary" link @click="showDetail(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-empty v-else-if="!loading" description="暂无报告数据" />
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="检测详情" width="600px">
      <pre style="background: #f5f7fa; padding: 16px; border-radius: 4px; max-height: 400px; overflow: auto;">{{ JSON.stringify(currentDetail, null, 2) }}</pre>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTestRun, getTestReport } from '@/api/testRuns'

const route = useRoute()
const runId = route.params.id
const loading = ref(false)
const runInfo = ref(null)
const report = ref(null)
const filterCategory = ref('all')
const detailVisible = ref(false)
const currentDetail = ref(null)

const statusText = {
  success: '成功',
  failed: '失败',
  running: '执行中',
  pending: '等待中',
  error: '错误'
}

const filteredResults = computed(() => {
  if (!report.value) return []
  if (filterCategory.value === 'all') return report.value.results
  return report.value.results.filter(r => r.category === filterCategory.value)
})

function countByCategory(cat) {
  return report.value?.results.filter(r => r.category === cat).length || 0
}

async function loadData() {
  loading.value = true
  try {
    const [runRes, reportRes] = await Promise.all([
      getTestRun(runId),
      getTestReport(runId)
    ])
    runInfo.value = runRes.data
    report.value = reportRes.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function showDetail(row) {
  currentDetail.value = row.detail
  detailVisible.value = true
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.run-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
}

.stat-value-sm {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
}
</style>
