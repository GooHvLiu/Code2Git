/**
 * useNotification - 通知中心可复用组合式函数
 *
 * 功能：
 * 1. 通知列表获取和管理
 * 2. 筛选状态管理（类型、优先级、时间范围、归档状态、关键词）
 * 3. 批量选择和批量操作
 * 4. 单个操作（标记已读、删除、归档、恢复）
 * 5. 通知设置获取和更新
 * 6. 未读数量获取
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
 */
import { ref, reactive, computed } from 'vue'
import store from '@/store'
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
import { formatDate } from '@/utils/date'

// 通知类型映射（使用国际化 key）
export const NOTIFICATION_TYPE_MAP = {
  system: { key: 'notification.typeSystem', enabled: true },
  plc: { key: 'notification.typePlc', enabled: true },
  user: { key: 'notification.typeUser', enabled: true },
  audit: { key: 'notification.typeAudit', enabled: true },
  device: { key: 'notification.typeDevice', enabled: true },
  connection: { key: 'notification.typeConnection', enabled: true }
}

// 优先级映射（使用国际化 key）
export const PRIORITY_MAP = {
  high: { key: 'notification.priorityHigh', type: 'danger' },
  medium: { key: 'notification.priorityMedium', type: 'warning' },
  low: { key: 'notification.priorityLow', type: 'info' }
}

// 默认通知设置
export const DEFAULT_NOTIFICATION_SETTINGS = {
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

export function useNotification(options = {}) {
  // ==================== 列表数据 ====================
  const list = ref([])
  const loading = ref(false)
  const total = ref(0)
  const pageNum = ref(1)
  const pageSize = ref(20)

  // ==================== 筛选状态 ====================
  const archiveTab = ref('0') // 0: 未归档, 1: 已归档
  const filterType = ref('')
  const readFilter = ref('')
  const priorityFilter = ref('')
  const timeFilter = ref('')
  const dateRange = ref([])
  const keyword = ref('')

  // 搜索参数
  const queryParams = reactive({
    isRead: '',
    type: '',
    priority: '',
    startDate: '',
    endDate: '',
    isArchived: 0,
    keyword: ''
  })

  // ==================== 批量选择 ====================
  const selectedIds = ref([])

  // 切换选择
  function toggleSelect(id) {
    const index = selectedIds.value.indexOf(id)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(id)
    }
  }

  // 清空选择
  function clearSelection() {
    selectedIds.value = []
  }

  // 是否全选
  const isAllSelected = computed(() => {
    return list.value.length > 0 && list.value.every(item => selectedIds.value.includes(item.id))
  })

  // 全选/取消全选
  function toggleSelectAll() {
    if (isAllSelected.value) {
      clearSelection()
    } else {
      selectedIds.value = list.value.map(item => item.id)
    }
  }

  // ==================== 通知铃铛同步 ====================
  // 从后端获取最新的未读数量，更新到 Vuex 中，实现全局状态同步
  async function refreshUnreadCount() {
    try {
      const res = await requestGetUnreadCountApi()
      const count = res.data?.count || 0
      store.commit('notification/SET_UNREAD_COUNT', count)
    } catch (e) {
      // 静默失败
    }
  }

  // ==================== 列表获取 ====================
  async function getList() {
    loading.value = true
    try {
      const params = {
        page: pageNum.value,
        pageSize: pageSize.value,
        ...queryParams
      }
      const res = await requestGetNotificationListApi(params)
      list.value = res.data?.list || []
      total.value = res.data?.total || 0
    } catch (e) {
      list.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  // ==================== 筛选方法 ====================
  // 归档标签页切换
  function handleArchiveChange() {
    queryParams.isArchived = Number(archiveTab.value)
    pageNum.value = 1
    clearSelection()
    getList()
  }

  // 类型筛选改变
  function handleFilterChange() {
    queryParams.type = filterType.value
    queryParams.priority = priorityFilter.value
    queryParams.keyword = keyword.value
    pageNum.value = 1
    getList()
  }

  // 状态筛选改变
  function handleReadFilterChange() {
    queryParams.isRead = readFilter.value
    pageNum.value = 1
    getList()
  }

  // 时间筛选改变
  function handleTimeFilterChange() {
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
    getList()
  }

  // 自定义日期范围改变
  function handleDateRangeChange() {
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.startDate = formatDate(dateRange.value[0])
      queryParams.endDate = formatDate(dateRange.value[1])
      pageNum.value = 1
      getList()
    }
  }

  // 重置筛选
  function resetFilters() {
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
    getList()
  }

  // ==================== 单个操作 ====================
  // 标记为已读
  async function handleMarkRead(item) {
    await requestMarkAsReadApi(item.id)
    item.is_read = 1
    refreshUnreadCount()
  }

  // 全部标记为已读
  async function handleMarkAll() {
    await requestMarkAllAsReadApi()
    getList()
    refreshUnreadCount()
  }

  // 删除
  async function handleDelete(item) {
    await requestDeleteNotificationApi(item.id)
    getList()
    refreshUnreadCount()
  }

  // 归档单个
  async function handleArchive(item) {
    await requestArchiveApi([item.id])
    getList()
    refreshUnreadCount()
  }

  // 恢复单个
  async function handleUnarchive(item) {
    await requestUnarchiveApi([item.id])
    getList()
    refreshUnreadCount()
  }

  // ==================== 批量操作 ====================
  // 批量标记已读
  async function handleBatchMarkRead() {
    if (selectedIds.value.length === 0) return
    await requestBatchMarkAsReadApi(selectedIds.value)
    list.value.forEach(item => {
      if (selectedIds.value.includes(item.id)) {
        item.is_read = 1
      }
    })
    clearSelection()
    refreshUnreadCount()
  }

  // 批量删除
  async function handleBatchDelete() {
    if (selectedIds.value.length === 0) return
    await requestBatchDeleteApi(selectedIds.value)
    clearSelection()
    getList()
    refreshUnreadCount()
  }

  // 全部删除
  async function handleDeleteAll(includeArchived = false) {
    await requestDeleteAllApi(includeArchived)
    clearSelection()
    getList()
    refreshUnreadCount()
  }

  // 批量归档
  async function handleBatchArchive() {
    if (selectedIds.value.length === 0) return
    await requestArchiveApi(selectedIds.value)
    clearSelection()
    getList()
    refreshUnreadCount()
  }

  // 批量恢复
  async function handleBatchUnarchive() {
    if (selectedIds.value.length === 0) return
    await requestUnarchiveApi(selectedIds.value)
    clearSelection()
    getList()
    refreshUnreadCount()
  }

  // ==================== 通知设置 ====================
  const settings = reactive({ ...DEFAULT_NOTIFICATION_SETTINGS })
  const settingsLoading = ref(false)
  const settingsSaving = ref(false)

  // 加载设置
  async function loadSettings() {
    settingsLoading.value = true
    try {
      const res = await requestGetNotificationSettingsApi()
      if (res.data?.settings) {
        Object.assign(settings, res.data.settings)
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
  async function saveSettings() {
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
  function resetSettings() {
    Object.assign(settings, JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS)))
  }

  // ==================== 未读数量 ====================
  const unreadCount = ref(0)

  // 获取未读数量
  async function fetchUnreadCount() {
    try {
      const res = await requestGetUnreadCountApi()
      unreadCount.value = res.data?.count || 0
    } catch (e) {
      unreadCount.value = 0
    }
  }

  // ==================== 工具方法 ====================
  // 检查是否在免打扰时间段
  function isInDoNotDisturb() {
    if (!settings.doNotDisturb.enabled) return false

    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const startTime = settings.doNotDisturb.startTime
    const endTime = settings.doNotDisturb.endTime

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      // 跨天情况，如 22:00 - 08:00
      return currentTime >= startTime || currentTime <= endTime
    }
  }

  // 检查通知类型是否启用
  function isTypeEnabled(type) {
    return settings.typeEnabled[type] !== false
  }

  // 检查是否应该弹窗提醒
  function shouldPopup(type) {
    if (!settings.popupEnabled) return false
    if (!isTypeEnabled(type)) return false
    if (isInDoNotDisturb()) return false
    return true
  }

  // 检查是否应该播放声音
  function shouldPlaySound(type) {
    if (!settings.soundEnabled) return false
    if (!isTypeEnabled(type)) return false
    if (isInDoNotDisturb()) return false
    return true
  }

  // ==================== 初始化 ====================
  // 如果配置了自动加载，则自动加载列表
  if (options.autoLoad !== false) {
    getList()
  }

  // 如果配置了自动获取未读数量，则自动获取
  if (options.autoFetchUnreadCount !== false) {
    fetchUnreadCount()
  }

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
