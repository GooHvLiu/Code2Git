/**
 * ==========================================
 * useDevDashboard - 设备状态总览数据派生
 * ==========================================
 * 从 Pinia device store 派生「状态总览」页所需的展示数据：
 *  - coreMetrics       关键运行指标（运行速度 / 灌装量 / 真空度 …）
 *  - realtimeParamsList 实时运行参数列表（结合 params + paramsConfig）
 *  - todayStats        今日运行统计（产量 / 合格率 / OEE …）
 *
 * 迁移自原 Vuex device 模块的同名 getter；因目标 Pinia store 仅保留原始状态，
 * 故在此层做等价派生，页面只消费本 composable 的计算属性。
 *
 * 作者：GooHv
 */
import { computed } from 'vue'
import { useDeviceStore } from '@/store/modules/device'
import { useI18n } from '@/composables/useI18n'
import type { CoreMetric, RealtimeParam, TodayStat } from '@/types/device'

export function useDevDashboard() {
  const deviceStore = useDeviceStore()
  const { t } = useI18n()

  /** 关键运行指标卡片 */
  const coreMetrics = computed<CoreMetric[]>(() => {
    const p = deviceStore.params
    return [
      {
        label: t('device.state.metricSpeed'),
        value: p.speed,
        unit: t('device.state.unitBottlePerHour'),
        trend: 2.4,
        trendUp: true
      },
      {
        label: t('device.state.metricFillVolume'),
        value: p.fillVolume,
        unit: 'mL',
        trend: 0,
        trendUp: true
      },
      {
        label: t('device.state.metricVacuum'),
        value: p.vacuum,
        unit: 'MPa',
        trend: -1.2,
        trendUp: false
      },
      {
        label: t('device.state.metricTemperature'),
        value: p.temperature,
        unit: '℃',
        trend: 0.5,
        trendUp: false
      }
    ]
  })

  /** 实时运行参数列表（params + paramsConfig 合并） */
  const realtimeParamsList = computed<RealtimeParam[]>(() => {
    const config = deviceStore.paramsConfig
    const params = deviceStore.params
    return Object.keys(config).map((key) => {
      const c = config[key]
      return {
        key,
        name: c.name,
        value: Number(params[key as keyof typeof params] ?? 0),
        unit: c.unit,
        min: c.min,
        max: c.max,
        decimal: c.decimal
      }
    })
  })

  /** 今日运行统计 */
  const todayStats = computed<TodayStat[]>(() => {
    const prod = deviceStore.production
    return [
      {
        label: t('device.state.statTodayOutput'),
        value: prod.todayOutput.toLocaleString(),
        unit: t('device.state.unitBottle'),
        sub: `${t('device.state.target')} ${prod.todayTarget.toLocaleString()}`
      },
      {
        label: t('device.state.statQualifiedRate'),
        value: prod.qualifiedRate,
        unit: '%',
        sub: `${t('device.state.qualified')} ${prod.qualifiedCount.toLocaleString()} / ${t('device.state.unqualified')} ${prod.unqualifiedCount.toLocaleString()}`
      },
      {
        label: t('device.state.statOee'),
        value: prod.oee,
        unit: '%',
        sub: `${t('device.state.availability')} ${prod.availability}% · ${t('device.state.performance')} ${prod.performance}%`
      },
      {
        label: t('device.state.statShiftOutput'),
        value: prod.shiftOutput.toLocaleString(),
        unit: t('device.state.unitBottle'),
        sub: `${prod.shiftName} · ${t('device.state.target')} ${prod.shiftTarget.toLocaleString()}`
      }
    ]
  })

  /** 设备基础信息（直接透传 store.info） */
  const deviceInfo = computed(() => deviceStore.info)

  /** 运行时长 / 状态对象（store 已派生） */
  const deviceStatusObj = computed(() => deviceStore.deviceStatusObj)

  /** 关键参数趋势（取运行速度曲线） */
  const trendData = computed(() => deviceStore.trendData.speed)

  return {
    deviceInfo,
    deviceStatusObj,
    coreMetrics,
    realtimeParamsList,
    todayStats,
    trendData
  }
}
