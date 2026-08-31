<template>
  <div class="alarm-log-page">
    <el-tabs v-model="activeTab" class="alarm-tabs">
      <!-- 统计看板 -->
      <el-tab-pane label="统计看板" name="dashboard">
        <div class="dashboard-content">
          <!-- 顶部统计卡片 -->
          <el-row :gutter="12" class="stats-cards">
            <el-col :span="6" v-for="(stat, index) in alarmStats" :key="index">
              <div class="stat-card" :class="stat.type">
                <div class="stat-icon"><i :class="stat.icon"></i></div>
                <div class="stat-info">
                  <div class="stat-label">{{ stat.label }}</div>
                  <div class="stat-value">
                    {{ stat.value }}<span class="stat-unit">次</span>
                  </div>
                  <div
                    class="stat-trend"
                    :class="stat.trend > 0 ? 'up' : 'down'"
                  >
                    <i
                      :class="stat.trend > 0 ? 'el-icon-top' : 'el-icon-bottom'"
                    ></i>
                    {{ Math.abs(stat.trend) }}% 较昨日
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

          <!-- 图表区域 -->
          <el-row :gutter="12" class="charts-row">
            <!-- 报警类别分布 -->
            <el-col :span="8">
              <div class="chart-panel">
                <div class="panel-header">
                  <span class="panel-title"
                    ><i class="el-icon-pie-chart"></i> 报警类别分布</span
                  >
                </div>
                <div class="panel-body">
                  <div class="category-chart">
                    <div class="donut-wrapper">
                      <svg viewBox="0 0 100 100" class="donut-svg">
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          fill="none"
                          stroke="#f0f2f5"
                          stroke-width="12"
                        />
                        <circle
                          v-for="(item, index) in categoryData"
                          :key="index"
                          cx="50"
                          cy="50"
                          r="35"
                          fill="none"
                          :stroke="item.color"
                          stroke-width="12"
                          :stroke-dasharray="
                            (item.percent / 100) * 219.9 + ' 219.9'
                          "
                          :stroke-dashoffset="getCategoryOffset(index)"
                          transform="rotate(-90 50 50)"
                          stroke-linecap="round"
                        />
                      </svg>
                      <div class="donut-center">
                        <div class="donut-value">{{ totalAlarms }}</div>
                        <div class="donut-label">总报警</div>
                      </div>
                    </div>
                    <div class="category-legend">
                      <div
                        class="legend-item"
                        v-for="(item, index) in categoryData"
                        :key="index"
                      >
                        <span
                          class="legend-dot"
                          :style="{ background: item.color }"
                        ></span>
                        <span class="legend-name">{{ item.name }}</span>
                        <span class="legend-count">{{ item.count }}次</span>
                        <span class="legend-percent">{{ item.percent }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>

            <!-- 报警趋势 -->
            <el-col :span="10">
              <div class="chart-panel">
                <div class="panel-header">
                  <span class="panel-title"
                    ><i class="el-icon-line-chart"></i> 近7天报警趋势</span
                  >
                </div>
                <div class="panel-body">
                  <div class="trend-chart">
                    <svg
                      viewBox="0 0 500 180"
                      preserveAspectRatio="none"
                      class="chart-svg"
                    >
                      <defs>
                        <linearGradient
                          id="alarmTrendGrad"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            style="stop-color: #f56c6c; stop-opacity: 0.3"
                          />
                          <stop
                            offset="100%"
                            style="stop-color: #f56c6c; stop-opacity: 0"
                          />
                        </linearGradient>
                      </defs>
                      <line
                        x1="0"
                        y1="45"
                        x2="500"
                        y2="45"
                        stroke="#f0f2f5"
                        stroke-width="1"
                        stroke-dasharray="4,4"
                      />
                      <line
                        x1="0"
                        y1="90"
                        x2="500"
                        y2="90"
                        stroke="#f0f2f5"
                        stroke-width="1"
                        stroke-dasharray="4,4"
                      />
                      <line
                        x1="0"
                        y1="135"
                        x2="500"
                        y2="135"
                        stroke="#f0f2f5"
                        stroke-width="1"
                        stroke-dasharray="4,4"
                      />
                      <path :d="trendAreaPath" fill="url(#alarmTrendGrad)" />
                      <path
                        :d="trendLinePath"
                        fill="none"
                        stroke="#f56c6c"
                        stroke-width="2"
                      />
                      <circle
                        v-for="(point, index) in trendPoints"
                        :key="index"
                        :cx="point.x"
                        :cy="point.y"
                        r="4"
                        fill="#fff"
                        stroke="#f56c6c"
                        stroke-width="2"
                      />
                    </svg>
                    <div class="chart-labels">
                      <span
                        v-for="(label, index) in trendLabels"
                        :key="index"
                        >{{ label }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </el-col>

            <!-- 报警级别分布 -->
            <el-col :span="6">
              <div class="chart-panel">
                <div class="panel-header">
                  <span class="panel-title"
                    ><i class="el-icon-data-analysis"></i> 报警级别</span
                  >
                </div>
                <div class="panel-body">
                  <div class="level-list">
                    <div
                      class="level-item"
                      v-for="(item, index) in levelData"
                      :key="index"
                    >
                      <div class="level-header">
                        <span class="level-tag" :class="item.type">{{
                          item.name
                        }}</span>
                        <span class="level-count">{{ item.count }}次</span>
                      </div>
                      <div class="level-bar">
                        <div
                          class="level-fill"
                          :style="{ width: item.percent + '%' }"
                          :class="item.type"
                        ></div>
                      </div>
                      <div class="level-percent">{{ item.percent }}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

          <!-- TOP5 报警类型 -->
          <el-row :gutter="12" class="top-row">
            <el-col :span="24">
              <div class="chart-panel">
                <div class="panel-header">
                  <span class="panel-title"
                    ><i class="el-icon-rank"></i> 报警类型 TOP5</span
                  >
                  <span class="panel-subtitle">近30天</span>
                </div>
                <div class="panel-body">
                  <div class="top-list">
                    <div
                      class="top-item"
                      v-for="(item, index) in topAlarms"
                      :key="index"
                    >
                      <div class="top-rank" :class="'rank-' + (index + 1)">
                        {{ index + 1 }}
                      </div>
                      <div class="top-info">
                        <div class="top-name">{{ item.name }}</div>
                        <div class="top-desc">{{ item.desc }}</div>
                      </div>
                      <div class="top-bar">
                        <div
                          class="top-fill"
                          :style="{
                            width:
                              (item.count / topAlarms[0].count) * 100 + '%',
                          }"
                        ></div>
                      </div>
                      <div class="top-count">{{ item.count }}次</div>
                      <div
                        class="top-trend"
                        :class="item.trend > 0 ? 'up' : 'down'"
                      >
                        <i
                          :class="
                            item.trend > 0 ? 'el-icon-top' : 'el-icon-bottom'
                          "
                        ></i>
                        {{ Math.abs(item.trend) }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- 详细记录 -->
      <el-tab-pane label="详细记录" name="list">
        <div class="list-content">
          <!-- 搜索区域 -->
          <div class="search-section">
            <el-form :inline="true" :model="searchForm" class="search-form">
              <el-form-item label="报警级别">
                <el-select
                  v-model="searchForm.level"
                  placeholder="全部"
                  clearable
                  size="small"
                  style="width: 120px"
                >
                  <el-option label="紧急" value="critical" />
                  <el-option label="重要" value="major" />
                  <el-option label="一般" value="minor" />
                  <el-option label="提示" value="info" />
                </el-select>
              </el-form-item>
              <el-form-item label="报警类别">
                <el-select
                  v-model="searchForm.category"
                  placeholder="全部"
                  clearable
                  size="small"
                  style="width: 140px"
                >
                  <el-option label="位置异动" value="position" />
                  <el-option label="真空异常" value="vacuum" />
                  <el-option label="伺服使能" value="servo" />
                  <el-option label="超时报警" value="timeout" />
                  <el-option label="温度异常" value="temperature" />
                  <el-option label="压力异常" value="pressure" />
                </el-select>
              </el-form-item>
              <el-form-item label="处理状态">
                <el-select
                  v-model="searchForm.status"
                  placeholder="全部"
                  clearable
                  size="small"
                  style="width: 120px"
                >
                  <el-option label="未处理" value="pending" />
                  <el-option label="处理中" value="processing" />
                  <el-option label="已处理" value="resolved" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="searchForm.dateRange"
                  type="daterange"
                  range-separator="至"
                  size="small"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 240px"
                />
              </el-form-item>
              <el-form-item label="关键词">
                <el-input
                  v-model="searchForm.keyword"
                  placeholder="报警描述/设备编号"
                  clearable
                  size="small"
                  style="width: 180px"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  @click="handleSearch"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="small"
                  @click="handleReset"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <!-- 操作栏 -->
          <div class="toolbar-section">
            <div class="toolbar-left">
              <span class="total-text"
                >共 <b>{{ total }}</b> 条记录</span
              >
              <el-tag
                v-if="selectedRows.length > 0"
                type="info"
                size="small"
                style="margin-left: 10px"
              >
                已选择 {{ selectedRows.length }} 项
              </el-tag>
            </div>
            <div class="toolbar-right">
              <ExportDropdown
                v-permission="'device:alarm:export'"
                :data="tableData"
                :columns="exportColumns"
                title="报警记录"
                filename="报警记录"
                :selected="selectedRows"
                :exporter="currentUsername"
              />
              <el-button
                type="primary"
                icon="el-icon-refresh"
                size="small"
                @click="handleRefresh"
                >刷新</el-button
              >
            </div>
          </div>

          <!-- 数据表格 -->
          <div class="table-section">
            <el-table
              ref="alarmTable"
              :data="pagedData"
              border
              stripe
              :header-cell-style="{
                background: '#f5f7fa',
                color: '#606266',
                fontWeight: 'bold',
                textAlign: 'center',
              }"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
              />
              <el-table-column
                prop="alarmNo"
                label="报警编号"
                width="140"
                align="center"
              />
              <el-table-column
                prop="alarmTime"
                label="报警时间"
                width="160"
                align="center"
              />
              <el-table-column label="报警级别" width="90" align="center">
                <template slot-scope="scope">
                  <el-tag
                    :type="getLevelType(scope.row.level)"
                    size="small"
                    effect="plain"
                  >
                    {{ getLevelText(scope.row.level) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="报警类别" width="100" align="center">
                <template slot-scope="scope">
                  <span>{{ getCategoryText(scope.row.category) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="alarmCode"
                label="报警代码"
                width="100"
                align="center"
              />
              <el-table-column
                prop="description"
                label="报警描述"
                min-width="200"
                show-overflow-tooltip
              />
              <el-table-column
                prop="deviceCode"
                label="设备编号"
                width="140"
                align="center"
              />
              <el-table-column label="处理状态" width="90" align="center">
                <template slot-scope="scope">
                  <el-tag :type="getStatusType(scope.row.status)" size="small">
                    {{ getStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="handler"
                label="处理人"
                width="90"
                align="center"
              />
              <el-table-column
                prop="resolveTime"
                label="处理时间"
                width="160"
                align="center"
              />
              <el-table-column
                label="操作"
                width="100"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="'device:alarm:detail'"
                    type="text"
                    size="small"
                    @click="handleDetail(scope.row)"
                    >详情</el-button
                  >
                  <el-button
                    v-permission="'device:alarm:handle'"
                    type="text"
                    size="small"
                    @click="handleResolve(scope.row)"
                    v-if="scope.row.status !== 'resolved'"
                    >处理</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页 -->
          <div class="pagination-section">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { Message } from "element-ui";
import store from "@/store";
import ExportDropdown from "@/components/ExportDropdown/index.vue";

/**
 * 报警统计页面
 * 功能：统计看板（类别分布、趋势、级别、TOP5）+ 详细记录（筛选、搜索、导出）
 * 数据来源：统计数据从 Vuex device 模块获取，详细记录后续对接后端接口
 */

// ===== 响应式数据 =====
const activeTab = ref("dashboard");
const currentUsername = ref("admin");

// 搜索
const searchForm = reactive({
  level: "",
  category: "",
  status: "",
  dateRange: [],
  keyword: "",
});

// 分页
const currentPage = ref(1);
const pageSize = ref(20);
const selectedRows = ref([]);

// ===== 以下为页面特有格式模拟数据，后续对接后端接口 =====
const categoryData = ref([
  { name: "位置异动", count: 35, percent: 29.2, color: "#f56c6c" },
  { name: "真空异常", count: 28, percent: 23.3, color: "#e6a23c" },
  { name: "伺服使能", count: 22, percent: 18.3, color: "#409eff" },
  { name: "超时报警", count: 18, percent: 15.0, color: "#909399" },
  { name: "温度异常", count: 10, percent: 8.3, color: "#67c23a" },
  { name: "其他", count: 7, percent: 5.9, color: "#c0c4cc" },
]);
const levelData = ref([
  { name: "紧急", count: 8, percent: 6.7, type: "critical" },
  { name: "重要", count: 32, percent: 26.7, type: "major" },
  { name: "一般", count: 58, percent: 48.3, type: "minor" },
  { name: "提示", count: 22, percent: 18.3, type: "info" },
]);
const trendData = ref([8, 12, 6, 15, 10, 12, 8]);
const trendLabels = ref([
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
  "周六",
  "周日",
]);
const topAlarms = ref([
  {
    name: "位置异动报警",
    desc: "灌装工位位置偏差超过阈值",
    count: 35,
    trend: 15,
  },
  { name: "真空度异常", desc: "真空系统压力不达标", count: 28, trend: -8 },
  {
    name: "伺服使能失败",
    desc: "伺服驱动器无法正常使能",
    count: 22,
    trend: 10,
  },
  { name: "动作超时", desc: "机构动作时间超过设定值", count: 18, trend: -5 },
  { name: "温度异常", desc: "灌装温度超出允许范围", count: 10, trend: 0 },
]);
const tableData = ref(generateMockData());

// ===== 计算属性 =====
// 统计卡片（基于 store 转换）
const alarmStats = computed(() => {
  const s = store.getters.alarmStats;
  return [
    {
      label: "今日报警",
      value: s.todayCount || 12,
      icon: "el-icon-warning",
      type: "danger",
      trend: 20,
    },
    {
      label: "紧急报警",
      value: s.criticalCount || 2,
      icon: "el-icon-error",
      type: "critical",
      trend: -33.3,
    },
    {
      label: "未处理",
      value: s.pendingCount || 5,
      icon: "el-icon-time",
      type: "warning",
      trend: 25,
    },
    {
      label: "平均处理时长",
      value: "1.5",
      icon: "el-icon-alarm-clock",
      type: "info",
      trend: -10,
    },
  ];
});

const totalAlarms = computed(() =>
  categoryData.value.reduce((sum, item) => sum + item.count, 0)
);
const total = computed(() => tableData.value.length);
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return tableData.value.slice(start, start + pageSize.value);
});

const trendPoints = computed(() => {
  const maxVal = Math.max(...trendData.value);
  return trendData.value.map((val, index) => ({
    x: (index / (trendData.value.length - 1)) * 500,
    y: 170 - (val / maxVal) * 140,
  }));
});
const trendLinePath = computed(() => {
  if (trendPoints.value.length === 0) return "";
  return trendPoints.value
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");
});
const trendAreaPath = computed(() => {
  if (trendPoints.value.length === 0) return "";
  const line = trendPoints.value
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");
  return `${line} L500,180 L0,180 Z`;
});

const exportColumns = computed(() => [
  { prop: "alarmNo", label: "报警编号" },
  { prop: "alarmTime", label: "报警时间" },
  { prop: "levelText", label: "报警级别" },
  { prop: "categoryText", label: "报警类别" },
  { prop: "alarmCode", label: "报警代码" },
  { prop: "description", label: "报警描述" },
  { prop: "deviceCode", label: "设备编号" },
  { prop: "statusText", label: "处理状态" },
  { prop: "handler", label: "处理人" },
  { prop: "resolveTime", label: "处理时间" },
]);

// ===== 方法 =====
function generateMockData() {
  const levels = ["critical", "major", "minor", "info"];
  const categories = [
    "position",
    "vacuum",
    "servo",
    "timeout",
    "temperature",
    "pressure",
  ];
  const statuses = ["pending", "processing", "resolved"];
  const handlers = ["张三", "李四", "王五", "赵六", ""];
  const descs = [
    "灌装工位位置偏差超过阈值",
    "真空系统压力不达标",
    "伺服驱动器无法正常使能",
    "机构动作时间超过设定值",
    "灌装温度超出允许范围",
    "加塞压力异常",
    "设备振动超标",
    "气源压力不足",
  ];
  const data = [];
  for (let i = 1; i <= 56; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date(
      2026,
      7,
      24 - Math.floor(Math.random() * 7),
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60)
    );
    data.push({
      id: i,
      alarmNo: "ALM202608" + String(i).padStart(4, "0"),
      alarmTime: formatDate(date),
      level,
      levelText: getLevelText(level),
      category,
      categoryText: getCategoryText(category),
      alarmCode: "E" + String(1000 + i),
      description: descs[Math.floor(Math.random() * descs.length)],
      deviceCode: "NEXCM-FILL-2026-001",
      status,
      statusText: getStatusText(status),
      handler:
        status === "pending"
          ? ""
          : handlers[Math.floor(Math.random() * (handlers.length - 1))],
      resolveTime:
        status === "resolved"
          ? formatDate(new Date(date.getTime() + Math.random() * 3600000))
          : "",
    });
  }
  return data.sort((a, b) => new Date(b.alarmTime) - new Date(a.alarmTime));
}

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

function getCategoryOffset(index) {
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += (categoryData.value[i].percent / 100) * 219.9;
  }
  return -offset;
}

function getLevelType(level) {
  const map = {
    critical: "danger",
    major: "warning",
    minor: "info",
    info: "success",
  };
  return map[level] || "info";
}

function getLevelText(level) {
  const map = { critical: "紧急", major: "重要", minor: "一般", info: "提示" };
  return map[level] || level;
}

function getCategoryText(category) {
  const map = {
    position: "位置异动",
    vacuum: "真空异常",
    servo: "伺服使能",
    timeout: "超时报警",
    temperature: "温度异常",
    pressure: "压力异常",
  };
  return map[category] || category;
}

function getStatusType(status) {
  const map = { pending: "danger", processing: "warning", resolved: "success" };
  return map[status] || "info";
}

function getStatusText(status) {
  const map = { pending: "未处理", processing: "处理中", resolved: "已处理" };
  return map[status] || status;
}

function handleSearch() {
  Message.success("搜索功能待对接后端接口");
}

function handleReset() {
  Object.assign(searchForm, {
    level: "",
    category: "",
    status: "",
    dateRange: [],
    keyword: "",
  });
  currentPage.value = 1;
}

function handleRefresh() {
  Message.success("刷新成功");
}

function handleSelectionChange(selection) {
  selectedRows.value = selection;
}

function handleSizeChange(size) {
  pageSize.value = size;
  currentPage.value = 1;
}

function handlePageChange(page) {
  currentPage.value = page;
}

function handleDetail(row) {
  Message.info(`查看报警详情：${row.alarmNo}`);
}

function handleResolve(row) {
  Message.info(`处理报警：${row.alarmNo}`);
}
</script>

<style scoped lang="less">
.alarm-log-page {
  padding: 12px;
  background: #fff;
  min-height: calc(100vh - 84px);
}

.alarm-tabs {
  /deep/ .el-tabs__header {
    margin-bottom: 12px;
  }
}

// 统计看板
.dashboard-content {
  .stats-cards {
    margin-bottom: 12px;
  }
  .charts-row {
    margin-bottom: 12px;
  }
  .top-row {
    margin-bottom: 0;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-right: 14px;
    flex-shrink: 0;
    .danger & {
      background: #fef0f0;
      color: #f56c6c;
    }
    .critical & {
      background: #fef0f0;
      color: #f56c6c;
    }
    .warning & {
      background: #fdf6ec;
      color: #e6a23c;
    }
    .info & {
      background: #ecf5ff;
      color: #409eff;
    }
  }
  .stat-info {
    flex: 1;
    .stat-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 4px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      font-family: "Courier New", monospace;
      .danger & {
        color: #f56c6c;
      }
      .critical & {
        color: #f56c6c;
      }
      .warning & {
        color: #e6a23c;
      }
      .info & {
        color: #409eff;
      }
      .stat-unit {
        font-size: 12px;
        color: #909399;
        margin-left: 4px;
        font-weight: normal;
      }
    }
    .stat-trend {
      font-size: 11px;
      margin-top: 2px;
      &.up {
        color: #f56c6c;
      }
      &.down {
        color: #67c23a;
      }
      i {
        font-size: 10px;
        margin-right: 2px;
      }
    }
  }
}

// 图表面板
.chart-panel {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f2f5;
    .panel-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      i {
        margin-right: 6px;
        color: #409eff;
      }
    }
    .panel-subtitle {
      font-size: 11px;
      color: #909399;
    }
  }
  .panel-body {
    flex: 1;
    padding: 16px;
    overflow: hidden;
  }
}

// 类别分布
.category-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  .donut-wrapper {
    position: relative;
    width: 130px;
    height: 130px;
    margin: 0 auto 12px;
    .donut-svg {
      width: 100%;
      height: 100%;
    }
    .donut-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .donut-value {
        display: block;
        font-size: 24px;
        font-weight: 700;
        color: #303133;
        font-family: "Courier New", monospace;
      }
      .donut-label {
        font-size: 11px;
        color: #909399;
      }
    }
  }
  .category-legend {
    flex: 1;
    .legend-item {
      display: flex;
      align-items: center;
      padding: 4px 0;
      font-size: 11px;
      .legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 2px;
        margin-right: 6px;
      }
      .legend-name {
        flex: 1;
        color: #606266;
      }
      .legend-count {
        color: #303133;
        font-weight: 600;
        margin-right: 8px;
      }
      .legend-percent {
        color: #909399;
        width: 35px;
        text-align: right;
      }
    }
  }
}

// 趋势图
.trend-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  .chart-svg {
    flex: 1;
    width: 100%;
  }
  .chart-labels {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #c0c4cc;
    padding-top: 4px;
  }
}

// 级别分布
.level-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .level-item {
    .level-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      .level-tag {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        &.critical {
          background: #fef0f0;
          color: #f56c6c;
        }
        &.major {
          background: #fdf6ec;
          color: #e6a23c;
        }
        &.minor {
          background: #ecf5ff;
          color: #409eff;
        }
        &.info {
          background: #f0f9eb;
          color: #67c23a;
        }
      }
      .level-count {
        font-size: 12px;
        font-weight: 600;
        color: #303133;
      }
    }
    .level-bar {
      height: 6px;
      background: #fff;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 2px;
      .level-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.5s;
        &.critical {
          background: #f56c6c;
        }
        &.major {
          background: #e6a23c;
        }
        &.minor {
          background: #409eff;
        }
        &.info {
          background: #67c23a;
        }
      }
    }
    .level-percent {
      font-size: 10px;
      color: #909399;
      text-align: right;
    }
  }
}

// TOP5
.top-list {
  .top-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f5f7fa;
    &:last-child {
      border-bottom: none;
    }
    .top-rank {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      margin-right: 14px;
      flex-shrink: 0;
      &.rank-1 {
        background: linear-gradient(135deg, #f56c6c, #e64242);
      }
      &.rank-2 {
        background: linear-gradient(135deg, #e6a23c, #d48806);
      }
      &.rank-3 {
        background: linear-gradient(135deg, #409eff, #2b7fd4);
      }
      &.rank-4,
      &.rank-5 {
        background: #909399;
      }
    }
    .top-info {
      width: 200px;
      margin-right: 14px;
      .top-name {
        font-size: 13px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 2px;
      }
      .top-desc {
        font-size: 11px;
        color: #909399;
      }
    }
    .top-bar {
      flex: 1;
      height: 8px;
      background: #fff;
      border-radius: 4px;
      overflow: hidden;
      margin-right: 14px;
      .top-fill {
        height: 100%;
        background: linear-gradient(90deg, #409eff, #667eea);
        border-radius: 4px;
        transition: width 0.5s;
      }
    }
    .top-count {
      width: 60px;
      text-align: right;
      font-size: 16px;
      font-weight: 700;
      color: #303133;
      font-family: "Courier New", monospace;
      margin-right: 14px;
    }
    .top-trend {
      width: 50px;
      text-align: right;
      font-size: 12px;
      &.up {
        color: #f56c6c;
      }
      &.down {
        color: #67c23a;
      }
      i {
        font-size: 10px;
        margin-right: 2px;
      }
    }
  }
}

// 详细记录
.list-content {
  .search-section {
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    .search-form > .el-form-item {
      margin-bottom: 0px;
    }
  }
  .toolbar-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    .total-text {
      font-size: 13px;
      color: #606266;
      b {
        color: #409eff;
        font-size: 15px;
      }
    }
    .toolbar-right {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }
  .table-section {
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 0;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    overflow: hidden;
  }
  .pagination-section {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
