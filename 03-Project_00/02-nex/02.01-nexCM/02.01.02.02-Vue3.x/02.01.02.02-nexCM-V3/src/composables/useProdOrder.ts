/**
 * ==========================================
 * useProdOrder - 生产工单数据
 * ==========================================
 * 迁移自原 Vuex device 模块的 completedOrders / runningOrders /
 * plannedOrders / orderStats。当前为前端演示数据。
 *
 * 作者：GooHv
 */
import { ref, computed } from 'vue'
import type { OrderStat, ProductionOrder } from '@/types/production'

/** 已完成工单 */
const COMPLETED: ProductionOrder[] = [
  {
    id: 1,
    orderNo: 'WO20260820001',
    productName: '卡式瓶灌装',
    bottleType: '卡式瓶',
    quantity: 5000,
    completed: 5000,
    progress: 100,
    status: 'completed',
    priority: 'high',
    startDate: '2026-08-20',
    endDate: '2026-08-20',
    recipeName: '标准 2mL 卡式瓶配方',
    operator: '张工'
  },
  {
    id: 2,
    orderNo: 'WO20260819002',
    productName: '西林瓶灌装',
    bottleType: '西林瓶',
    quantity: 3000,
    completed: 3000,
    progress: 100,
    status: 'completed',
    priority: 'medium',
    startDate: '2026-08-19',
    endDate: '2026-08-19',
    recipeName: '5mL 西林瓶配方',
    operator: '李工'
  }
]

/** 进行中工单 */
const RUNNING: ProductionOrder[] = [
  {
    id: 3,
    orderNo: 'WO20260824001',
    productName: '卡式瓶灌装',
    bottleType: '卡式瓶',
    quantity: 5000,
    completed: 3240,
    progress: 64.8,
    status: 'running',
    priority: 'high',
    startDate: '2026-08-24',
    endDate: '2026-08-25',
    recipeName: '标准 2mL 卡式瓶配方',
    operator: '张工'
  }
]

/** 计划工单 */
const PLANNED: ProductionOrder[] = [
  {
    id: 4,
    orderNo: 'WO20260826001',
    productName: '微量灌装',
    bottleType: '卡式瓶',
    quantity: 8000,
    completed: 0,
    progress: 0,
    status: 'planned',
    priority: 'low',
    startDate: '2026-08-26',
    endDate: '2026-08-27',
    recipeName: '0.5mL 微量配方',
    operator: '待分配'
  }
]

export function useProdOrder() {
  const completedOrders = ref<ProductionOrder[]>(COMPLETED)
  const runningOrders = ref<ProductionOrder[]>(RUNNING)
  const plannedOrders = ref<ProductionOrder[]>(PLANNED)

  /** 工单统计卡片 */
  const orderStats = computed<OrderStat[]>(() => [
    {
      label: 'total',
      value: completedOrders.value.length + runningOrders.value.length + plannedOrders.value.length,
      type: 'total'
    },
    { label: 'completed', value: completedOrders.value.length, type: 'completed' },
    { label: 'running', value: runningOrders.value.length, type: 'running' },
    { label: 'planned', value: plannedOrders.value.length, type: 'planned' }
  ])

  return { completedOrders, runningOrders, plannedOrders, orderStats }
}
