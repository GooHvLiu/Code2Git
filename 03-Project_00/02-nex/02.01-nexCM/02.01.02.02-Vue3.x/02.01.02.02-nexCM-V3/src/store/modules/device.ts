/**
 * ==========================================
 * Device Store - 设备数据统一管理
 * ==========================================
 * 设备信息、运行状态、实时参数、生产统计、报警、趋势、部件寿命
 * 数据来源：WebSocket 消息 / 轮询 / 手动刷新
 */
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type { DeviceParams, DeviceStatus } from '@/types/business'

export const useDeviceStore = defineStore('device', () => {
  const info = reactive({
    name: 'nexCM-灌装机-001',
    code: 'NEXCM-FILL-2026-001',
    model: 'nexCM-V2 全自动灌装机',
    location: '中国 · 江苏无锡 · 生产车间A区',
    locationCode: ['CN', 'CN-WX'] as string[],
    locationCoords: { lng: 120.30, lat: 31.57 },
    installDate: '2026-01-15',
    manufacturer: 'nexCM 科技',
    ip: '192.168.1.100'
  })

  const status = ref<DeviceStatus>('running')
  const statusText = ref('运行中')
  const runningDuration = ref(0)
  const runningStartTime = ref<number | null>(null)

  const params = reactive<DeviceParams>({
    speed: 1200,
    fillVolume: 2.0,
    vacuum: -0.085,
    temperature: 22.5,
    pressure: 0.12,
    vibration: 0.8
  })

  const paramsConfig = reactive<Record<string, { name: string; unit: string; min: number; max: number; decimal: number }>>({
    speed: { name: '运行速度', unit: '瓶/h', min: 0, max: 1500, decimal: 0 },
    fillVolume: { name: '灌装体积', unit: 'mL', min: 0.5, max: 10, decimal: 1 },
    vacuum: { name: '真空度', unit: 'MPa', min: -0.1, max: -0.05, decimal: 3 },
    temperature: { name: '灌装温度', unit: '℃', min: 15, max: 35, decimal: 1 },
    pressure: { name: '加塞压力', unit: 'MPa', min: 0.05, max: 0.2, decimal: 2 },
    vibration: { name: '设备振动', unit: 'mm/s', min: 0, max: 2.5, decimal: 1 }
  })

  const production = reactive({
    todayOutput: 8560,
    todayTarget: 12000,
    todayRate: 71.3,
    shiftOutput: 3240,
    shiftTarget: 5000,
    shiftName: '白班',
    totalOutput: 125680,
    qualifiedRate: 98.5,
    qualifiedCount: 8432,
    unqualifiedCount: 128,
    oee: 85.6,
    availability: 92.8,
    performance: 94.2,
    quality: 97.9
  })

  const currentBatch = reactive({
    batchNo: 'B20260824001',
    productName: '卡式瓶灌装',
    fillVolume: 2.0,
    startTime: '08:00:00',
    estimatedEnd: '18:00:00',
    produced: 3240,
    target: 5000,
    progress: 64.8,
    estimatedTime: '2小时28分',
    qualifiedRate: 98.5
  })

  const alarms = reactive({
    current: [] as Array<{ id?: number | string; [k: string]: unknown }>,
    todayCount: 12,
    criticalCount: 2,
    pendingCount: 5,
    categoryStats: { position: 35, vacuum: 28, servo: 22, timeout: 18, temperature: 10, other: 7 },
    levelStats: { critical: 8, major: 32, minor: 58, info: 22 }
  })

  const trendData = reactive<Record<string, Array<{ time: string; value: number }>>>({
    speed: [
      { time: '10:00', value: 1200 }, { time: '12:00', value: 1100 }
    ],
    fillVolume: [{ time: '10:00', value: 2.0 }],
    vacuum: [{ time: '10:00', value: -0.085 }],
    temperature: [],
    output: []
  })

  const parts = ref([
    { id: 1, name: '灌装针组件', code: 'FILL-NEEDLE-001', spec: '2.0mL 标准型', used: 8500, total: 10000, unit: '次' },
    { id: 2, name: '灌装管组件', code: 'FILL-TUBE-001', spec: '硅胶管 φ8×12', used: 420, total: 500, unit: '小时' }
  ])

  const runtimeStats = reactive({ running: 6.5, idle: 0.8, fault: 0.2, plannedStop: 0.5 })

  const lastUpdateTime = ref<number | null>(null)
  const loading = ref(false)
  const syncStarted = ref(false)

  const isDeviceOnline = computed(() => status.value === 'running' || status.value === 'idle')
  const deviceStatusObj = computed(() => {
    const h = Math.floor(runtimeStats.running)
    const m = Math.round((runtimeStats.running - h) * 60)
    return { status: status.value, text: statusText.value, duration: `${h}小时${m}分钟` }
  })
  const lastUpdateText = computed(() => {
    if (!lastUpdateTime.value) return '从未更新'
    const diff = Math.floor((Date.now() - lastUpdateTime.value) / 1000)
    if (diff < 5) return '刚刚'
    if (diff < 60) return `${diff}秒前`
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    return `${Math.floor(diff / 3600)}小时前`
  })

  function setDeviceInfo(infoPatch: Record<string, unknown>): void {
    Object.assign(info, infoPatch)
  }

  function setDeviceStatus(s: DeviceStatus, text?: string): void {
    status.value = s
    if (text) statusText.value = text
    if (s === 'running' && !runningStartTime.value) runningStartTime.value = Date.now()
    if (s !== 'running') runningStartTime.value = null
  }

  function updateParams(paramsPatch: Partial<DeviceParams>): void {
    Object.assign(params, paramsPatch)
  }

  function updateProduction(patch: Record<string, unknown>): void {
    Object.assign(production, patch)
  }

  function setCurrentBatch(batch: Record<string, unknown>): void {
    Object.assign(currentBatch, batch)
  }

  function updateLastUpdateTime(): void {
    lastUpdateTime.value = Date.now()
  }

  function onWebSocketMessage(message: { type: string; data?: Record<string, unknown> }): void {
    if (!message || !message.type) return
    switch (message.type) {
      case 'status':
        setDeviceStatus((message.data?.status as DeviceStatus) || 'running', message.data?.statusText as string)
        break
      case 'params':
        updateParams((message.data || {}) as Partial<DeviceParams>)
        break
      case 'production':
        updateProduction(message.data || {})
        break
      case 'batch':
        setCurrentBatch(message.data || {})
        break
      default:
        break
    }
    updateLastUpdateTime()
  }

  async function fetchAllData(): Promise<void> {
    updateLastUpdateTime()
  }

  function onDeviceDisconnected(): void {
    status.value = 'offline'
    statusText.value = '离线'
    alarms.current = []
    lastUpdateTime.value = null
  }

  return {
    info,
    status,
    statusText,
    runningDuration,
    runningStartTime,
    params,
    paramsConfig,
    production,
    currentBatch,
    alarms,
    trendData,
    parts,
    runtimeStats,
    lastUpdateTime,
    loading,
    syncStarted,
    isDeviceOnline,
    deviceStatusObj,
    lastUpdateText,
    setDeviceInfo,
    setDeviceStatus,
    updateParams,
    updateProduction,
    setCurrentBatch,
    updateLastUpdateTime,
    onWebSocketMessage,
    fetchAllData,
    onDeviceDisconnected
  }
})
