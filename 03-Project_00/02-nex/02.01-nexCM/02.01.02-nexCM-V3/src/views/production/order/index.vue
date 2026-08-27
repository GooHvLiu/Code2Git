<template>
  <div class="order-container">
    <!-- 顶部统计概览 -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon green"><i class="el-icon-circle-check"></i></div>
        <div class="stat-info">
          <div class="stat-value">{{ orderStats.completedCount }}</div>
          <div class="stat-label">{{ $t("order.completed") }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue"><i class="el-icon-video-play"></i></div>
        <div class="stat-info">
          <div class="stat-value">{{ orderStats.runningCount }}</div>
          <div class="stat-label">{{ $t("order.running") }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><i class="el-icon-time"></i></div>
        <div class="stat-info">
          <div class="stat-value">{{ orderStats.plannedCount }}</div>
          <div class="stat-label">{{ $t("order.planned") }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple"><i class="el-icon-data-line"></i></div>
        <div class="stat-info">
          <div class="stat-value">{{ orderStats.avgQualifiedRate }}%</div>
          <div class="stat-label">{{ $t("order.qualifiedRate") }}</div>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
          <el-tab-pane name="completed">
            <span slot="label" class="tab-label">
              {{ $t("order.completed") }}
              <span class="tab-badge">{{ completedOrders.length }}</span>
            </span>
          </el-tab-pane>
          <el-tab-pane name="running">
            <span slot="label" class="tab-label">
              {{ $t("order.running") }}
              <span class="tab-badge running">{{ runningOrders.length }}</span>
            </span>
          </el-tab-pane>
          <el-tab-pane name="planned">
            <span slot="label" class="tab-label">
              {{ $t("order.planned") }}
              <span class="tab-badge planned">{{ plannedOrders.length }}</span>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="toolbar-right">
        <el-button
          type="primary"
          icon="el-icon-download"
          :disabled="!canDownload"
          @click="handleDownloadSelected"
        >
          {{ $t("order.downloadSelected") }} ({{ selectedOrders.length }})
        </el-button>
        <el-button
          icon="el-icon-document"
          :disabled="!canDownloadAll"
          @click="handleDownloadAll"
        >
          {{ $t("order.downloadAll") }}
        </el-button>
      </div>
    </div>

    <!-- 无订单生产提示 -->
    <el-alert
      v-if="showNoOrderTip"
      :title="$t('order.noOrderProduction')"
      type="warning"
      :closable="false"
      show-icon
      class="no-order-alert"
    />

    <!-- 订单表格 -->
    <div class="order-table-wrapper">
      <el-table
        :data="currentOrders"
        border
        stripe
        highlight-current-row
        :cell-style="cellStyle"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="50"
          :selectable="checkSelectable"
        />
        <el-table-column
          :label="$t('order.orderNo')"
          prop="orderNo"
          width="170"
        />
        <el-table-column
          :label="$t('order.productName')"
          prop="productName"
          width="140"
        />
        <el-table-column
          :label="$t('order.recipeName')"
          prop="recipeName"
          width="120"
        />
        <el-table-column
          :label="$t('order.batchNo')"
          prop="batchNo"
          width="140"
        />
        <el-table-column
          :label="$t('order.targetQty')"
          prop="targetQty"
          width="90"
          align="center"
        />
        <el-table-column
          :label="$t('order.completedQty')"
          width="110"
          align="center"
        >
          <template slot-scope="scope">
            <div class="qty-cell">
              <span>{{ scope.row.completedQty }}</span>
              <el-progress
                v-if="scope.row.status === 'running'"
                :percentage="scope.row.progress"
                :show-text="false"
                :stroke-width="4"
                class="qty-progress"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('order.qualifiedRate')"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.qualifiedRate >= 98
                  ? 'success'
                  : scope.row.qualifiedRate >= 95
                  ? 'warning'
                  : 'danger'
              "
              size="mini"
            >
              {{ scope.row.qualifiedRate }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="orderConfig.showOperatorName"
          :label="$t('order.operator')"
          prop="operator"
          width="90"
          align="center"
        />
        <el-table-column
          v-if="orderConfig.showAlarmCount"
          :label="$t('order.alarmCount')"
          prop="alarmCount"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.alarmCount > 0" type="danger" size="mini">{{
              scope.row.alarmCount
            }}</el-tag>
            <span v-else class="text-muted">0</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="orderConfig.showRuntime"
          :label="$t('order.runtime')"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.runtime ? scope.row.runtime + "h" : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('order.startTime')"
          prop="startTime"
          width="150"
        />
        <el-table-column
          :label="$t('order.endTime')"
          prop="endTime"
          width="150"
        >
          <template slot-scope="scope">
            {{
              scope.row.endTime ||
              (scope.row.status === "running" ? scope.row.estimatedEnd : "--")
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('order.status')" width="90" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="statusType(scope.row.status)"
              size="small"
              effect="dark"
            >
              {{ statusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.operation') || '操作'"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-download"
              :disabled="!canDownloadOrder(scope.row)"
              @click="handleDownloadSingle(scope.row)"
            >
              {{ $t("order.download") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Message } from "element-ui";
import store from "@/store";
import { generateOrderReport } from "@/utils/orderReport";
import { getConfig } from "@/utils/config";
import { useI18n } from "@/composables/useI18n";

const { t: $t } = useI18n();

// ===== 响应式数据 =====
const activeTab = ref("completed");
const selectedOrders = ref([]);
const selectedRowKeys = ref([]);

// ===== 计算属性 =====
const completedOrders = computed(() => store.getters["device/completedOrders"]);
const runningOrders = computed(() => store.getters["device/runningOrders"]);
const plannedOrders = computed(() => store.getters["device/plannedOrders"]);
const orderStats = computed(() => store.getters["device/orderStats"]);

// 当前Tab的订单列表
const currentOrders = computed(() => {
  switch (activeTab.value) {
    case "completed":
      return completedOrders.value;
    case "running":
      return runningOrders.value;
    case "planned":
      return plannedOrders.value;
    default:
      return [];
  }
});

// 订单设置配置（从系统配置读取）
const orderConfig = computed(() => ({
  allowNoOrderProduction: getConfig("allowNoOrderProduction", false),
  noOrderProductionHighlight: getConfig("noOrderProductionHighlight", false),
  showOperatorName: getConfig("showOperatorName", true),
  showAlarmCount: getConfig("showAlarmCount", true),
  showRuntime: getConfig("showRuntime", true),
  reportIncludeAlarmDetail: getConfig("reportIncludeAlarmDetail", true),
  reportIncludeOperatorDetail: getConfig("reportIncludeOperatorDetail", true),
  reportIncludeDownloadCount: getConfig("reportIncludeDownloadCount", true),
  allowRunningOrderDownload: getConfig("allowRunningOrderDownload", false),
}));

// 是否显示无订单生产提示
const showNoOrderTip = computed(
  () =>
    orderConfig.value.allowNoOrderProduction &&
    orderConfig.value.noOrderProductionHighlight &&
    runningOrders.value.length === 0
);

// 当前Tab是否可以下载
const canDownload = computed(() => {
  if (activeTab.value === "planned") return false;
  if (
    activeTab.value === "running" &&
    !orderConfig.value.allowRunningOrderDownload
  )
    return false;
  return selectedOrders.value.length > 0;
});

const canDownloadAll = computed(() => {
  if (activeTab.value === "planned") return false;
  if (
    activeTab.value === "running" &&
    !orderConfig.value.allowRunningOrderDownload
  )
    return false;
  return currentOrders.value.length > 0;
});

// 当前用户名（导出人）
const exporter = computed(
  () => store?.state?.user?.userInfo?.username || "admin"
);

// PDF水印设置
const pdfWatermark = computed(() => getConfig("pdfWatermarkEnabled", true));
const pdfWatermarkText = computed(
  () => getConfig("pdfWatermarkText", "") || exporter.value
);

// ===== 方法 =====
function handleTabClick() {
  selectedOrders.value = [];
  selectedRowKeys.value = [];
}

function handleSelectionChange(selection) {
  selectedOrders.value = selection;
  selectedRowKeys.value = selection.map((item) => item.orderNo);
}

/**
 * 单元格样式 —— 选中行用内联样式设置背景色和文字颜色，优先级最高
 * @param {Object} param { row, column, rowIndex, columnIndex }
 */
function cellStyle({ row }) {
  if (selectedRowKeys.value.includes(row.orderNo)) {
    return {
      backgroundColor: "#ecf5ff",
      color: "#303133",
    };
  }
  return {};
}

// 检查行是否可选中（计划订单不可选中下载）
function checkSelectable(row) {
  return canDownloadOrder(row);
}

// 检查订单是否可下载
function canDownloadOrder(row) {
  if (row.status === "planned") return false;
  if (row.status === "running" && !orderConfig.value.allowRunningOrderDownload)
    return false;
  return true;
}

function statusType(status) {
  switch (status) {
    case "completed":
      return "success";
    case "running":
      return "primary";
    case "planned":
      return "warning";
    default:
      return "info";
  }
}

function statusText(status) {
  switch (status) {
    case "completed":
      return $t("order.statusCompleted");
    case "running":
      return $t("order.statusRunning");
    case "planned":
      return $t("order.statusPlanned");
    default:
      return status;
  }
}

// 下载单个订单报告
function handleDownloadSingle(order) {
  if (!canDownloadOrder(order)) {
    if (order.status === "planned") {
      Message.warning($t("order.plannedNoDownload"));
    } else if (order.status === "running") {
      Message.warning($t("order.runningNoDownload"));
    }
    return;
  }
  generateAndDownload([order]);
}

// 下载选中订单报告
function handleDownloadSelected() {
  if (selectedOrders.value.length === 0) {
    Message.warning($t("order.selectOrderTip"));
    return;
  }
  generateAndDownload(selectedOrders.value);
}

// 下载全部订单报告
function handleDownloadAll() {
  generateAndDownload(currentOrders.value);
}

// 生成并下载订单报告（每个订单一个PDF文件）
async function generateAndDownload(orders) {
  const config = {
    exporter: exporter.value,
    watermark: pdfWatermark.value,
    watermarkText: pdfWatermarkText.value,
    includeAlarmDetail: orderConfig.value.reportIncludeAlarmDetail,
    includeOperatorDetail: orderConfig.value.reportIncludeOperatorDetail,
    includeDownloadCount: orderConfig.value.reportIncludeDownloadCount,
  };

  let successCount = 0;
  let failCount = 0;

  for (const order of orders) {
    try {
      await generateOrderReport(order, config, (key) => $t(key));
      // 增加下载次数
      store.commit("device/INCREMENT_ORDER_DOWNLOAD", {
        type: activeTab.value,
        id: order.id,
      });
      successCount++;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("订单报告生成失败:", e);
      failCount++;
    }
  }

  if (failCount === 0) {
    Message.success(`成功生成 ${successCount} 份订单报告`);
  } else if (successCount === 0) {
    Message.error(`全部 ${failCount} 份订单报告生成失败，请查看控制台详情`);
  } else {
    Message.warning(
      `成功 ${successCount} 份，失败 ${failCount} 份，请查看控制台详情`
    );
  }
}
</script>

<style scoped lang="less">
.order-container {
  padding: 16px;
  background: #fff;
  min-height: calc(100vh - 84px);
}

// ========== 统计概览 ==========
.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  .stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    padding: 18px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      border-color: #dcdfe6;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: #fff;
      flex-shrink: 0;

      &.green {
        background: linear-gradient(135deg, #67c23a, #85ce61);
      }
      &.blue {
        background: linear-gradient(135deg, #409eff, #66b1ff);
      }
      &.orange {
        background: linear-gradient(135deg, #e6a23c, #ebb563);
      }
      &.purple {
        background: linear-gradient(135deg, #909399, #a6a9ad);
      }
    }

    .stat-info {
      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: #303133;
        line-height: 1.2;
      }
      .stat-label {
        font-size: 13px;
        color: #909399;
        margin-top: 2px;
      }
    }
  }
}

// ========== 操作栏 ==========
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;

  .toolbar-left {
    ::v-deep .el-tabs--card > .el-tabs__header {
      margin: 0;
      border: none;
    }
    ::v-deep .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: none; /* 或者你想要的样式 */
    }

    ::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 0 18px;
      margin-right: 12px;
      white-space: nowrap;
      overflow: visible;
      text-overflow: clip;
      height: 36px;
      line-height: 34px;

      &:last-child {
        margin-right: 0;
      }

      &.is-active {
        background: #409eff;
        color: #fff !important;
        border-color: #409eff;
      }
    }
    .tab-label {
      display: inline-flex;
      align-items: center;
    }
    .tab-badge {
      display: inline-block;
      background: #fff;
      color: #606266;
      border-radius: 10px;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 6px;
      line-height: 18px;

      &.running {
        background: #ecf5ff;
        color: #409eff;
      }
      &.planned {
        background: #fdf6ec;
        color: #e6a23c;
      }
    }
    // 选中状态下徽章样式（蓝色背景上用白色半透明徽章）
    ::v-deep .el-tabs__item.is-active .tab-badge {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;

      &.running {
        background: rgba(255, 255, 255, 0.25);
        color: #fff;
      }
      &.planned {
        background: rgba(255, 255, 255, 0.25);
        color: #fff;
      }
    }
  }

  .toolbar-right {
    display: flex;
    gap: 10px;
  }
}

.no-order-alert {
  margin-bottom: 12px;
}

// ========== 订单表格 ==========
.order-table-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 16px;

  // 完成数量单元格
  .qty-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    .qty-progress {
      width: 60px;
    }
  }

  .text-muted {
    color: #c0c4cc;
  }
}

// 表格全局样式覆盖（非 scoped，确保生效）
// 注意：选中行样式已通过 :cell-style 内联样式实现，优先级最高
</style>

<style lang="less">
// ===== 横向滚动条美化（细、淡，不显眼）=====
html body .order-table-wrapper .el-table__body-wrapper::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
html
  body
  .order-table-wrapper
  .el-table__body-wrapper::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 3px;
}
html
  body
  .order-table-wrapper
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 3px;
  &:hover {
    background-color: #909399;
  }
}
html
  body
  .order-table-wrapper
  .el-table__body-wrapper::-webkit-scrollbar-corner {
  background: #fff;
}
</style>
