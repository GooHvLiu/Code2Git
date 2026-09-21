/**
 * ==========================================
 * useNotification - 通知中心可复用组合式函数
 * ==========================================
 *
 * 功能：
 * 1. 通知列表获取和管理
 * 2. 筛选状态管理（类型、优先级、时间范围、归档状态、关键词）
 * 3. 批量选择和批量操作
 * 4. 单个操作（标记已读、删除、归档、恢复）
 * 5. 通知设置获取和更新
 * 6. 未读数量获取（与全局 notification store 同步）
 *
 * 使用方式：
 * import { useNotification } from '@/composables/useNotification'
 * const {
 *   // 列表数据
 *   list, loading, total, pageNum, pageSize,
 *   // 筛选状态
 *   filterType, readFilter, priorityFilter, timeFilter, dateRange, keyword, archiveTab,
 *   // 批量选择
 *   selectedIds, toggleSelect, clearSelection,
 *   // 操作方法
 *   getList, handleMarkRead, handleMarkAll, handleBatchMarkRead,
 *   handleDelete, handleBatchDelete, handleDeleteAll,
 *   handleArchive, handleBatchArchive, handleUnarchive, handleBatchUnarchive,
 *   // 设置
 *   settings, loadSettings, saveSettings,
 *   // 未读数量
 *   unreadCount, fetchUnreadCount
 * } = useNotification()
 *
 * 作者：GooHv
 */
import { ref, reactive, computed, onUnmounted } from 'vue'
import ws from '@/utils/request/websocket'
import { useNotificationStore } from '@/store/modules/notification'
import {
  requestGetNotificationListApi,
  requestGetUnreadCountApi,
  requestMarkAsReadApi,
  requestMarkAllAsReadApi,
  requestBatchMarkAsReadApi,
  requestDeleteNotificationApi,
  requestBatchDeleteApi,
  requestDeleteAllApi,
  requestArchiveApi,
  requestUnarchiveApi,
  requestGetNotificationSettingsApi,
  requestUpdateNotificationSettingsApi
} from '@/api'
import { formatDate } from '@/utils/data/date'

/** 通知列表项（后端字段，id 与已读状态为操作必需，其余字段按需扩展） */
export interface NotificationRow {
  id: number | string
  is_read?: number
}

/** 通知类型 key 元信息 */
export interface NotificationTypeMeta {
  key: string
  enabled: boolean
}

/** 优先级 tag 元信息 */
export interface PriorityMeta {
  key: string
  type: string
}

// 通知类型映射（使用国际化 key）
export const NOTIFICATION_TYPE_MAP: Record<string, NotificationTypeMeta> = {
  system: { key: 'notification.type.system', enabled: true },
  plc: { key: 'notification.type.plc', enabled: true },
  user: { key: 'notification.type.user', enabled: true },
  audit: { key: 'notification.type.audit', enabled: true },
  device: { key: 'notification.type.device', enabled: true },
  connection: { key: 'notification.type.connection', enabled: true }
}

// 优先级映射（使用国际化 key）
export const PRIORITY_MAP: Record<string, PriorityMeta> = {
  high: { key: 'notification.priority.high', type: 'danger' },
  medium: { key: 'notification.priority.medium', type: 'warning' },
  low: { key: 'notification.priority.low', type: 'info' }
}

/** 免打扰时段 */
export interface DoNotDisturb {
  enabled: boolean
  startTime: string
  endTime: string
}

/** 通知设置 */
export interface NotificationSettingsShape {
  typeEnabled: Record<string, boolean>
  doNotDisturb: DoNotDisturb
  soundEnabled: boolean
  popupEnabled: boolean
  [key: string]: unknown
}

/** WebSocket 已读同步载荷 */
export interface NotificationReadPayload {
  unreadCount?: number
  markAll?: boolean
  notificationIds?: Array<number | string>
}

/** 列表查询参数 */
export interface NotificationQueryParams {
  isRead: string
  type: string
  priority: string
  startDate: string
  endDate: string
  isArchived: number
  keyword: string
}

/** 自动加载选项 */
export interface UseNotificationOptions {
  /** 挂载即拉取列表，默认 true */
  autoLoad?: boolean
  /** 挂载即拉取未读数，默认 true */
  autoFetchUnreadCount?: boolean
}

// 默认通知设置
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsShape = {
  typeEnabled: {
    system: NOTIFICATION_TYPE_MAP.system.enabled,
    plc: NOTIFICATION_TYPE_MAP.plc.enabled,
    user: NOTIFICATION_TYPE_MAP.user.enabled,
    audit: NOTIFICATION_TYPE_MAP.audit.enabled,
    device: NOTIFICATION_TYPE_MAP.device.enabled,
    connection: NOTIFICATION_TYPE_MAP.connection.enabled
  },
  doNotDisturb: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  },
  soundEnabled: true,
  popupEnabled: true
}

export function useNotification(options: UseNotificationOptions = {}) {
  const notificationStore = useNotificationStore()

  // ==================== 列表数据 ====================
  const list = ref<NotificationRow[]>([])
  const loading = ref<boolean>(false)
  const total = ref<number>(0)
  const pageNum = ref<number>(1)
  const pageSize = ref<number>(20)

  // ==================== 筛选状态 ====================
  const archiveTab = ref<string>('0') // 0: 未归档, 1: 已归档
  const filterType = ref<string>('')
  const readFilter = ref<string>('')
  const priorityFilter = ref<string>('')
  const timeFilter = ref<string>('')
  const dateRange = ref<Array<number | Date | string>>([])
  const keyword = ref<string>('')

  // 搜索参数
  const queryParams = reactive<NotificationQueryParams>({
    isRead: '',
    type: '',
    priority: '',
    startDate: '',
    endDate: '',
    isArchived: 0,
    keyword: ''
  })

  // ==================== 批量选择 ====================
  const selectedIds = ref<Array<number | string>>([])

  // 切换选择
  function toggleSelect(id: number | string): void {
    const index = selectedIds.value.indexOf(id)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(id)
    }
  }

  // 清空选择
  function clearSelection(): void {
    selectedIds.value = []
  }

  // 是否全选
  const isAllSelected = computed<boolean>(() => {
    return list.value.length > 0 && list.value.every(item => selectedIds.value.includes(item.id))
  })

  // 全选/取消全选
  function toggleSelectAll(): void {
    if (isAllSelected.value) {
      clearSelection()
    } else {
      selectedIds.value = list.value.map(item => item.id)
    }
  }

  // ==================== 通知铃铛同步 ====================
  // 从后端获取最新的未读数量，更新到 Pinia 中，实现全局状态同步
  async function refreshUnreadCount(): Promise<void> {
    try {
      const res = await requestGetUnreadCountApi()
      const data = (res.data || {}) as { count?: number }
      notificationStore.setUnreadCount(data.count || 0)
    } catch (e) {
      // 静默失败
    }
  }

  // ==================== 列表获取 ====================
  async function getList(): Promise<void> {
    loading.value = true
    try {
      const params: Record<string, unknown> = {
        page: pageNum.value,
        pageSize: pageSize.value,
        ...queryParams
      }
      const res = await requestGetNotificationListApi(params)
      const data = (res.data || {}) as { list?: NotificationRow[]; total?: number }
      list.value = data.list || []
      total.value = data.total || 0
    } catch (e) {
      list.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  // ==================== 筛选方法 ====================
  // 归档标签页切换
  function handleArchiveChange(): void {
    queryParams.isArchived = Number(archiveTab.value)
    pageNum.value = 1
    clearSelection()
    void getList()
  }

  // 类型筛选改变
  function handleFilterChange(): void {
    queryParams.type = filterType.value
    queryParams.priority = priorityFilter.value
    queryParams.keyword = keyword.value
    pageNum.value = 1
    void getList()
  }

  // 状态筛选改变
  function handleReadFilterChange(): void {
    queryParams.isRead = readFilter.value
    pageNum.value = 1
    void getList()
  }

  // 时间筛选改变
  function handleTimeFilterChange(): void {
    const now = new Date()
    let startDate = ''
    let endDate = ''

    if (timeFilter.value === 'today') {
      startDate = formatDate(now)
      endDate = formatDate(now)
    } else if (timeFilter.value === 'week') {
      const day = now.getDay() || 7
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - day + 1)
      startDate = formatDate(weekStart)
      endDate = formatDate(now)
    } else if (timeFilter.value === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      startDate = formatDate(monthStart)
      endDate = formatDate(now)
    }

    queryParams.startDate = startDate
    queryParams.endDate = endDate
    pageNum.value = 1
    void getList()
  }

  // 自定义日期范围改变
  function handleDateRangeChange(): void {
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.startDate = formatDate(dateRange.value[0] as Date)
      queryParams.endDate = formatDate(dateRange.value[1] as Date)
      pageNum.value = 1
      void getList()
    }
  }

  // 重置筛选
  function resetFilters(): void {
    archiveTab.value = '0'
    filterType.value = ''
    readFilter.value = ''
    priorityFilter.value = ''
    timeFilter.value = ''
    dateRange.value = []
    keyword.value = ''
    Object.assign(queryParams, {
      isRead: '',
      type: '',
      priority: '',
      startDate: '',
      endDate: '',
      isArchived: 0,
      keyword: ''
    })
    pageNum.value = 1
    clearSelection()
    void getList()
  }

  // ==================== 单个操作 ====================
  // 标记为已读
  async function handleMarkRead(item: NotificationRow): Promise<void> {
    await requestMarkAsReadApi(String(item.id))
    item.is_read = 1
    void refreshUnreadCount()
  }

  // 全部标记为已读
  async function handleMarkAll(): Promise<void> {
    await requestMarkAllAsReadApi()
    await getList()
    void refreshUnreadCount()
  }

  // 删除
  async function handleDelete(item: NotificationRow): Promise<void> {
    await requestDeleteNotificationApi(String(item.id))
    await getList()
    void refreshUnreadCount()
  }

  // 归档单个
  async function handleArchive(item: NotificationRow): Promise<void> {
    await requestArchiveApi([item.id])
    await getList()
    void refreshUnreadCount()
  }

  // 恢复单个
  async function handleUnarchive(item: NotificationRow): Promise<void> {
    await requestUnarchiveApi([item.id])
    await getList()
    void refreshUnreadCount()
  }

  // ==================== 批量操作 ====================
  // 批量标记已读
  async function handleBatchMarkRead(): Promise<void> {
    if (selectedIds.value.length === 0) return
    await requestBatchMarkAsReadApi(selectedIds.value)
    list.value.forEach(item => {
      if (selectedIds.value.includes(item.id)) {
        item.is_read = 1
      }
    })
    clearSelection()
    void refreshUnreadCount()
  }

  // 批量删除
  async function handleBatchDelete(): Promise<void> {
    if (selectedIds.value.length === 0) return
    await requestBatchDeleteApi(selectedIds.value)
    clearSelection()
    await getList()
    void refreshUnreadCount()
  }

  // 全部删除
  async function handleDeleteAll(includeArchived = false): Promise<void> {
    await requestDeleteAllApi(includeArchived)
    clearSelection()
    await getList()
    void refreshUnreadCount()
  }

  // 批量归档
  async function handleBatchArchive(): Promise<void> {
    if (selectedIds.value.length === 0) return
    await requestArchiveApi(selectedIds.value)
    clearSelection()
    await getList()
    void refreshUnreadCount()
  }

  // 批量恢复
  async function handleBatchUnarchive(): Promise<void> {
    if (selectedIds.value.length === 0) return
    await requestUnarchiveApi(selectedIds.value)
    clearSelection()
    await getList()
    void refreshUnreadCount()
  }

  // ==================== 通知设置 ====================
  const settings = reactive<NotificationSettingsShape>(JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS)))
  const settingsLoading = ref<boolean>(false)
  const settingsSaving = ref<boolean>(false)

  // 加载设置
  async function loadSettings(): Promise<void> {
    settingsLoading.value = true
    try {
      const res = await requestGetNotificationSettingsApi()
      const data = (res.data || {}) as { settings?: Partial<NotificationSettingsShape> }
      if (data.settings) {
        Object.assign(settings, data.settings)
        // 确保 typeEnabled 包含所有类型
        Object.keys(NOTIFICATION_TYPE_MAP).forEach(key => {
          if (settings.typeEnabled[key] === undefined) {
            settings.typeEnabled[key] = NOTIFICATION_TYPE_MAP[key].enabled
          }
        })
      }
    } catch (e) {
      // 加载失败，使用默认设置
    } finally {
      settingsLoading.value = false
    }
  }

  // 保存设置
  async function saveSettings(): Promise<boolean> {
    settingsSaving.value = true
    try {
      await requestUpdateNotificationSettingsApi(settings)
      return true
    } catch (e) {
      return false
    } finally {
      settingsSaving.value = false
    }
  }

  // 重置设置为默认
  function resetSettings(): void {
    Object.assign(settings, JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS)))
  }

  // ==================== 未读数量 ====================
  const unreadCount = ref<number>(0)

  // 获取未读数量
  async function fetchUnreadCount(): Promise<void> {
    try {
      const res = await requestGetUnreadCountApi()
      const data = (res.data || {}) as { count?: number }
      unreadCount.value = data.count || 0
    } catch (e) {
      unreadCount.value = 0
    }
  }

  // ==================== 工具方法 ====================
  // 检查是否在免打扰时间段
  function isInDoNotDisturb(): boolean {
    if (!settings.doNotDisturb.enabled) return false

    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const { startTime, endTime } = settings.doNotDisturb

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    }
    // 跨天情况，如 22:00 - 08:00
    return currentTime >= startTime || currentTime <= endTime
  }

  // 检查通知类型是否启用
  function isTypeEnabled(type: string): boolean {
    return settings.typeEnabled[type] !== false
  }

  // 检查是否应该弹窗提醒
  function shouldPopup(type: string): boolean {
    if (!settings.popupEnabled) return false
    if (!isTypeEnabled(type)) return false
    if (isInDoNotDisturb()) return false
    return true
  }

  // 检查是否应该播放声音
  function shouldPlaySound(type: string): boolean {
    if (!settings.soundEnabled) return false
    if (!isTypeEnabled(type)) return false
    if (isInDoNotDisturb()) return false
    return true
  }

  // ==================== 初始化 ====================
  // 如果配置了自动加载，则自动加载列表
  if (options.autoLoad !== false) {
    void getList()
  }

  // 如果配置了自动获取未读数量，则自动获取
  if (options.autoFetchUnreadCount !== false) {
    void fetchUnreadCount()
  }

  // ==================== WebSocket 已读同步 ====================
  // 监听其他设备标记已读的消息，实时同步本地列表状态
  function handleWsNotificationRead(rawData?: unknown): void {
    if (!rawData) return
    const data = rawData as NotificationReadPayload
    // 更新未读数量为最新值
    if (data.unreadCount !== undefined) {
      unreadCount.value = data.unreadCount
      notificationStore.setUnreadCount(data.unreadCount)
    }
    // 更新本地通知列表的已读状态
    if (data.markAll) {
      // 全部标记已读
      list.value.forEach(item => {
        item.is_read = 1
      })
    } else if (data.notificationIds && data.notificationIds.length > 0) {
      // 批量标记已读
      const idSet = new Set(data.notificationIds)
      list.value.forEach(item => {
        if (idSet.has(item.id)) {
          item.is_read = 1
        }
      })
    }
  }

  // 注册 WebSocket 监听
  ws.on('notification_read', handleWsNotificationRead)

  // 组件卸载时取消监听
  onUnmounted(() => {
    ws.off('notification_read', handleWsNotificationRead)
  })

  return {
    // 列表数据
    list,
    loading,
    total,
    pageNum,
    pageSize,

    // 筛选状态
    archiveTab,
    filterType,
    readFilter,
    priorityFilter,
    timeFilter,
    dateRange,
    keyword,
    queryParams,

    // 批量选择
    selectedIds,
    isAllSelected,
    toggleSelect,
    toggleSelectAll,
    clearSelection,

    // 列表操作
    getList,

    // 筛选方法
    handleArchiveChange,
    handleFilterChange,
    handleReadFilterChange,
    handleTimeFilterChange,
    handleDateRangeChange,
    resetFilters,

    // 单个操作
    handleMarkRead,
    handleMarkAll,
    handleDelete,
    handleArchive,
    handleUnarchive,

    // 批量操作
    handleBatchMarkRead,
    handleBatchDelete,
    handleDeleteAll,
    handleBatchArchive,
    handleBatchUnarchive,

    // 通知设置
    settings,
    settingsLoading,
    settingsSaving,
    loadSettings,
    saveSettings,
    resetSettings,

    // 未读数量
    unreadCount,
    fetchUnreadCount,

    // 工具方法
    isInDoNotDisturb,
    isTypeEnabled,
    shouldPopup,
    shouldPlaySound,

    // 常量
    NOTIFICATION_TYPE_MAP,
    PRIORITY_MAP,
    DEFAULT_NOTIFICATION_SETTINGS
  }
}
