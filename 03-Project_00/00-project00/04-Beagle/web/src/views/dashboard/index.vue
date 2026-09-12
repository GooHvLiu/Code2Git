<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card stat-blue">
          <div class="stat-icon">
            <el-icon :size="28"><Folder /></el-icon>
          </div>
          <div class="stat-body">
            <div class="stat-label">被测项目</div>
            <div class="stat-value">{{ stats.projectCount }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-green">
          <div class="stat-icon">
            <el-icon :size="28"><Puzzle /></el-icon>
          </div>
          <div class="stat-body">
            <div class="stat-label">已安装插件</div>
            <div class="stat-value">{{ stats.moduleCount }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-orange">
          <div class="stat-icon">
            <el-icon :size="28"><Timer /></el-icon>
          </div>
          <div class="stat-body">
            <div class="stat-label">总执行次数</div>
            <div class="stat-value">{{ stats.totalRuns }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-red">
          <div class="stat-icon">
            <el-icon :size="28"><CircleCheck /></el-icon>
          </div>
          <div class="stat-body">
            <div class="stat-label">通过率</div>
            <div class="stat-value">{{ stats.passRate }}%</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="14">
        <div class="card">
          <div class="card-title">最近执行趋势</div>
          <div ref="trendChartRef" style="height: 280px"></div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="card">
          <div class="card-title">执行状态分布</div>
          <div ref="pieChartRef" style="height: 280px"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 最近执行记录 -->
    <el-row style="margin-top: 16px">
      <el-col :span="24">
        <div class="card">
          <div class="card-title">最近执行记录</div>
          <el-table :data="recentRuns" style="width: 100%" size="small">
            <el-table-column prop="id" label="ID" width="60" align="center" />
            <el-table-column prop="project_name" label="项目" width="150" />
            <el-table-column prop="module_type" label="测试模块" width="150" />
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="statusType[row.status]" size="small">{{ statusText[row.status] || row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="total_count" label="总数" width="80" align="center" />
            <el-table-column prop="pass_count" label="通过" width="80" align="center" />
            <el-table-column prop="fail_count" label="失败" width="80" align="center" />
            <el-table-column prop="duration" label="耗时" width="90" align="center">
              <template #default="{ row }">{{ row.duration ? (row.duration / 1000).toFixed(1) + 's' : '-' }}</template>
            </el-table-column>
            <el-table-column prop="created_at" label="执行时间" />
            <el-table-column label="操作" width="90" align="center">
              <template #default="{ row }">
                <el-button type="primary" link @click="$router.push(`/reports/${row.id}`)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getTestRunList } from '@/api/testRuns'
import { getProjectList } from '@/api/projects'
import { getModuleList } from '@/api/modules'

const trendChartRef = ref(null)
const pieChartRef = ref(null)
const recentRuns = ref([])
const stats = ref({ projectCount: 0, moduleCount: 0, totalRuns: 0, passRate: 0 })

const statusText = { success: '成功', failed: '失败', running: '执行中', pending: '等待中', error: '错误' }
const statusType = { success: 'success', failed: 'danger', running: 'warning', pending: 'info', error: 'danger' }

async function loadStats() {
  try {
    const [projects, modules, runs] = await Promise.all([
      getProjectList({ page: 1, pageSize: 1 }),
      getModuleList(),
      getTestRunList({ page: 1, pageSize: 100 })
    ])
    stats.value.projectCount = projects.data.total
    stats.value.moduleCount = modules.data.modules.length
    stats.value.totalRuns = runs.data.total
    const successCount = runs.data.list.filter(r => r.status === 'success').length
    stats.value.passRate = runs.data.total > 0 ? ((successCount / runs.data.total) * 100).toFixed(1) : 0
    recentRuns.value = runs.data.list.slice(0, 10)
  } catch (e) {
    console.error('加载统计数据失败', e)
  }
}

function initCharts() {
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['通过', '失败'], bottom: 0 },
      grid: { left: '3%', right: '4%', top: '10%', containLabel: true },
      xAxis: { type: 'category', data: recentRuns.value.map(r => r.created_at?.slice(5, 16) || '').reverse(), axisLine: { lineStyle: { color: '#e8e8e8' } } },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '通过', type: 'line', smooth: true, data: recentRuns.value.map(r => r.pass_count).reverse(), itemStyle: { color: '#67c23a' }, areaStyle: { color: 'rgba(103,194,58,0.1)' } },
        { name: '失败', type: 'line', smooth: true, data: recentRuns.value.map(r => r.fail_count).reverse(), itemStyle: { color: '#f56c6c' }, areaStyle: { color: 'rgba(245,108,108,0.1)' } }
      ]
    })
  }
  if (pieChartRef.value) {
    const chart = echarts.init(pieChartRef.value)
    const statusCount = {}
    recentRuns.value.forEach(r => { statusCount[r.status] = (statusCount[r.status] || 0) + 1 })
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', right: 10, top: 'center' },
      series: [{
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['40%', '50%'],
        label: { show: false },
        data: Object.entries(statusCount).map(([k, v]) => ({ name: statusText[k] || k, value: v }))
      }]
    })
  }
}

onMounted(async () => {
  await loadStats()
  await nextTick()
  initCharts()
})
</script>

<style scoped>
.stat-row {
  margin-bottom: 0;
}

.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-blue .stat-icon { background: #ecf5ff; color: #1890ff; }
.stat-green .stat-icon { background: #f0f9eb; color: #67c23a; }
.stat-orange .stat-icon { background: #fdf6ec; color: #e6a23c; }
.stat-red .stat-icon { background: #fef0f0; color: #f56c6c; }

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #303133;
}
</style>
