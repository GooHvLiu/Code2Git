<template>
  <div class="production-order-page">
    <!-- 统计卡片 -->
    <el-row :gutter="12" class="stat-row">
      <el-col v-for="stat in orderStats" :key="stat.type" :span="6">
        <div class="stat-card" :class="stat.type">
          <div class="stat-label">{{ t(`production.order.stat.${stat.label}`) }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-radio-group v-model="activeTab" size="default">
          <el-radio-button value="running">{{ t('production.order.tabRunning') }}</el-radio-button>
          <el-radio-button value="completed">{{ t('production.order.tabCompleted') }}</el-radio-button>
          <el-radio-button value="planned">{{ t('production.order.tabPlanned') }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="toolbar-right">
        <el-button :icon="Download" size="small" @click="handleExport">{{ t('production.order.export') }}</el-button>
        <el-button type="primary" :icon="Printer" size="small" @click="handleReport">{{ t('production.order.reportBtn') }}</el-button>
      </div>
    </div>

    <!-- 工单表格 -->
    <el-table :data="currentOrders" border stripe style="width: 100%">
      <el-table-column prop="orderNo" :label="t('production.order.colOrderNo')" width="160" align="center" />
      <el-table-column prop="productName" :label="t('production.order.colProduct')" min-width="140" />
      <el-table-column prop="bottleType" :label="t('production.order.colBottleType')" width="110" align="center" />
      <el-table-column :label="t('production.order.colProgress')" min-width="180">
        <template #default="{ row }">
          <el-progress :percentage="row.progress" :status="row.progress === 100 ? 'success' : undefined" />
        </template>
      </el-table-column>
      <el-table-column :label="t('production.order.colQty')" width="140" align="center">
        <template #default="{ row }">{{ row.completed }}/{{ row.quantity }}</template>
      </el-table-column>
      <el-table-column :label="t('production.order.colPriority')" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="priorityType(row.priority)" size="small">{{ t(`production.order.priority.${row.priority}`) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" :label="t('production.order.colStartDate')" width="110" align="center" />
      <el-table-column prop="recipeName" :label="t('production.order.colRecipe')" min-width="150" />
      <el-table-column prop="operator" :label="t('production.order.colOperator')" width="100" align="center" />
    </el-table>

    <el-empty v-if="currentOrders.length === 0" :description="t('production.order.empty')" />
  </div>
</template>

<script setup lang="ts">
/**
 * 生产工单页：工单统计 / 进行中·已完成·计划 切换 / 导出
 * 数据：useProdOrder（前端演示数据）。
 * 作者：GooHv
 */
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import { Download, Printer } from '@element-plus/icons-vue'
import { useI18n } from '@/composables/useI18n'
import { $msg } from '@/utils/ui/feedback'
import { useProdOrder } from '@/composables/useProdOrder'
import type { OrderStatus } from '@/types/production'

const { t } = useI18n()
const { completedOrders, runningOrders, plannedOrders, orderStats } = useProdOrder()

const activeTab = ref<OrderStatus>('running')

const currentOrders = computed(() => {
  if (activeTab.value === 'running') return runningOrders.value
  if (activeTab.value === 'completed') return completedOrders.value
  return plannedOrders.value
})

function priorityType(p: string): 'danger' | 'warning' | 'info' {
  if (p === 'high') return 'danger'
  if (p === 'medium') return 'warning'
  return 'info'
}

function handleExport() {
  const rows = currentOrders.value.map((o) => ({
    [t('production.order.colOrderNo')]: o.orderNo,
    [t('production.order.colProduct')]: o.productName,
    [t('production.order.colBottleType')]: o.bottleType,
    [t('production.order.colProgress')]: `${o.progress}%`,
    [t('production.order.colQty')]: `${o.completed}/${o.quantity}`,
    [t('production.order.colRecipe')]: o.recipeName,
    [t('production.order.colOperator')]: o.operator
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'orders')
  XLSX.writeFile(wb, 'orders.xlsx')
}

function handleReport() {
  // TODO(迁移): 订单 PDF 报表依赖 utils/business/orderReport + pdfGenerator，
  // 待通用导出/报表工具迁移后接入；当前给出占位提示。
  $msg.info(t('production.order.reportTodo'))
}
</script>

<style scoped>
.production-order-page { padding: 16px; }
.stat-row { margin-bottom: 16px; }
.stat-card { background: #fff; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid #409eff; }
.stat-card.completed { border-left-color: #67c23a; }
.stat-card.running { border-left-color: #409eff; }
.stat-card.planned { border-left-color: #e6a23c; }
.stat-label { font-size: 12px; color: #909399; margin-bottom: 8px; }
.stat-value { font-size: 24px; font-weight: 700; color: #303133; font-family: 'Courier New', monospace; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.toolbar-right { display: flex; gap: 8px; }
</style>
