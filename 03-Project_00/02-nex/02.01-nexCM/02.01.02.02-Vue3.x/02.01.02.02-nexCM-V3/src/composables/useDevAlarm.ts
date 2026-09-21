/**
 * ==========================================
 * useDevAlarm - 报警看板 / 报警列表数据
 * ==========================================
 * 封装报警页（device/alarm）的展示数据与字典映射：
 *  - 统计卡片 alarmStats
 *  - 类别 / 级别 / TOP5 分布
 *  - 列表 mock 数据 generateTableData
 *  - 级别 / 类别 / 状态 文案与标签类型映射
 *
 * 说明：原 Vue2 版统计取自 Vuex，详细记录为前端 mock。此处保留 mock 形态，
 * 待后端报警记录接口落地后替换 generateTableData 为真实请求。
 *
 * 作者：GooHv
 */
import { ref, computed } from 'vue'
import { Warning, CircleClose, Clock, AlarmClock } from '@element-plus/icons-vue'
import { useDeviceStore } from '@/store/modules/device'
import { useI18n } from '@/composables/useI18n'
import type {
  AlarmCategory,
  AlarmCategoryDatum,
  AlarmLevel,
  AlarmLevelDatum,
  AlarmRecord,
  AlarmStatCard,
  AlarmStatus,
  AlarmTopDatum
} from '@/types/device'

/** 格式化时间为 YYYY-MM-DD HH:mm:ss */
function formatTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function useDevAlarm() {
  const deviceStore = useDeviceStore()
  const { t } = useI18n()

  /** 统计卡片（结合 store.alarms） */
  const alarmStats = computed<AlarmStatCard[]>(() => {
    const a = deviceStore.alarms
    return [
      { label: t('device.alarm.statToday'), value: a.todayCount || 12, icon: Warning, type: 'danger', trend: 20 },
      { label: t('device.alarm.statCritical'), value: a.criticalCount || 2, icon: CircleClose, type: 'critical', trend: -33.3 },
      { label: t('device.alarm.statPending'), value: a.pendingCount || 5, icon: Clock, type: 'warning', trend: 25 },
      { label: t('device.alarm.statAvgHandle'), value: '1.5', icon: AlarmClock, type: 'info', trend: -10 }
    ]
  })

  /** 报警类别分布（环形图） */
  const categoryData = ref<AlarmCategoryDatum[]>([
    { name: t('device.alarm.categoryPosition'), count: 35, percent: 29.2, color: '#f56c6c' },
    { name: t('device.alarm.categoryVacuum'), count: 28, percent: 23.3, color: '#e6a23c' },
    { name: t('device.alarm.categoryServo'), count: 22, percent: 18.3, color: '#409eff' },
    { name: t('device.alarm.categoryTimeout'), count: 18, percent: 15.0, color: '#909399' },
    { name: t('device.alarm.categoryTemperature'), count: 10, percent: 8.3, color: '#67c23a' },
    { name: t('device.alarm.categoryOther'), count: 7, percent: 5.9, color: '#c0c4cc' }
  ])

  /** 报警级别分布 */
  const levelData = ref<AlarmLevelDatum[]>([
    { name: t('device.alarm.levelCritical'), count: 8, percent: 6.7, type: 'critical' },
    { name: t('device.alarm.levelMajor'), count: 32, percent: 26.7, type: 'major' },
    { name: t('device.alarm.levelMinor'), count: 58, percent: 48.3, type: 'minor' },
    { name: t('device.alarm.levelInfo'), count: 22, percent: 18.3, type: 'info' }
  ])

  /** 近 7 天报警趋势原始序列 */
  const trendData = ref<number[]>([8, 12, 6, 15, 10, 12, 8])
  /** 趋势横轴标签（周一…周日） */
  const trendLabels = ref<string[]>([
    t('device.alarm.weekMon'),
    t('device.alarm.weekTue'),
    t('device.alarm.weekWed'),
    t('device.alarm.weekThu'),
    t('device.alarm.weekFri'),
    t('device.alarm.weekSat'),
    t('device.alarm.weekSun')
  ])

  /** TOP5 报警类型 */
  const topAlarms = ref<AlarmTopDatum[]>([
    { name: t('device.alarm.top1Name'), desc: t('device.alarm.top1Desc'), count: 35, trend: 15 },
    { name: t('device.alarm.top2Name'), desc: t('device.alarm.top2Desc'), count: 28, trend: -8 },
    { name: t('device.alarm.top3Name'), desc: t('device.alarm.top3Desc'), count: 22, trend: 10 },
    { name: t('device.alarm.top4Name'), desc: t('device.alarm.top4Desc'), count: 18, trend: -5 },
    { name: t('device.alarm.top5Name'), desc: t('device.alarm.top5Desc'), count: 10, trend: 0 }
  ])

  /** 列表 mock 数据 */
  const tableData = ref<AlarmRecord[]>(generateTableData())

  /** 环形图总报警数 */
  const totalAlarms = computed(() => categoryData.value.reduce((sum, item) => sum + item.count, 0))

  /** 生成 mock 报警记录 */
  function generateTableData(): AlarmRecord[] {
    const levels: AlarmLevel[] = ['critical', 'major', 'minor', 'info']
    const categories: AlarmCategory[] = ['position', 'vacuum', 'servo', 'timeout', 'temperature', 'pressure']
    const statuses: AlarmStatus[] = ['pending', 'processing', 'resolved']
    const handlers = ['张三', '李四', '王五', '赵六', '']
    const descs = [
      t('device.alarm.desc1'), t('device.alarm.desc2'), t('device.alarm.desc3'),
      t('device.alarm.desc4'), t('device.alarm.desc5'), t('device.alarm.desc6'),
      t('device.alarm.desc7'), t('device.alarm.desc8')
    ]
    const data: AlarmRecord[] = []
    for (let i = 1; i <= 56; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const date = new Date(2026, 7, 24 - Math.floor(Math.random() * 7), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
      data.push({
        id: i,
        alarmNo: 'ALM202608' + String(i).padStart(4, '0'),
        alarmTime: formatTime(date),
        level,
        levelText: getLevelText(level),
        category,
        categoryText: getCategoryText(category),
        alarmCode: 'E' + String(1000 + i),
        description: descs[Math.floor(Math.random() * descs.length)],
        deviceCode: 'NEXCM-FILL-2026-001',
        status,
        statusText: getStatusText(status),
        handler: status === 'pending' ? '' : handlers[Math.floor(Math.random() * (handlers.length - 1))],
        resolveTime: status === 'resolved' ? formatTime(new Date(date.getTime() + Math.random() * 3600000)) : ''
      })
    }
    return data.sort((a, b) => new Date(b.alarmTime).getTime() - new Date(a.alarmTime).getTime())
  }

  /** 环形图分段偏移 */
  function getCategoryOffset(index: number): number {
    let offset = 0
    for (let i = 0; i < index; i++) {
      offset += (categoryData.value[i].percent / 100) * 219.9
    }
    return -offset
  }

  function getLevelType(level: AlarmLevel): 'danger' | 'warning' | 'info' | 'success' {
    const map: Record<AlarmLevel, 'danger' | 'warning' | 'info' | 'success'> = {
      critical: 'danger', major: 'warning', minor: 'info', info: 'success'
    }
    return map[level]
  }

  function getLevelText(level: AlarmLevel): string {
    const map: Record<AlarmLevel, string> = {
      critical: t('device.alarm.levelCritical'),
      major: t('device.alarm.levelMajor'),
      minor: t('device.alarm.levelMinor'),
      info: t('device.alarm.levelInfo')
    }
    return map[level] || level
  }

  function getCategoryText(category: AlarmCategory): string {
    const map: Record<AlarmCategory, string> = {
      position: t('device.alarm.categoryPosition'),
      vacuum: t('device.alarm.categoryVacuum'),
      servo: t('device.alarm.categoryServo'),
      timeout: t('device.alarm.categoryTimeout'),
      temperature: t('device.alarm.categoryTemperature'),
      pressure: t('device.alarm.categoryPressure'),
      other: t('device.alarm.categoryOther')
    }
    return map[category] || category
  }

  function getStatusType(status: AlarmStatus): 'danger' | 'warning' | 'success' {
    const map: Record<AlarmStatus, 'danger' | 'warning' | 'success'> = {
      pending: 'danger', processing: 'warning', resolved: 'success'
    }
    return map[status] || 'info'
  }

  function getStatusText(status: AlarmStatus): string {
    const map: Record<AlarmStatus, string> = {
      pending: t('device.alarm.statusPending'),
      processing: t('device.alarm.statusProcessing'),
      resolved: t('device.alarm.statusResolved')
    }
    return map[status] || status
  }

  return {
    alarmStats,
    categoryData,
    levelData,
    trendData,
    trendLabels,
    topAlarms,
    tableData,
    totalAlarms,
    getCategoryOffset,
    getLevelType,
    getLevelText,
    getCategoryText,
    getStatusType,
    getStatusText
  }
}
