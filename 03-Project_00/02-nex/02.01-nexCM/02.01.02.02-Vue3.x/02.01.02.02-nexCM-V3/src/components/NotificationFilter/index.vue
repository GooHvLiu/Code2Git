<template>
  <div class="notification-filter">
    <!-- 归档标签页 -->
    <div class="filter-row">
      <el-radio-group v-model="localArchiveTab" size="small" @change="handleArchiveChange">
        <el-radio-button value="0">{{ t('notification.status.unarchived') }}</el-radio-button>
        <el-radio-button value="1">{{ t('notification.status.archived') }}</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 类型筛选 -->
    <div class="filter-row">
      <el-radio-group v-model="localFilterType" size="small" @change="handleFilterChange">
        <el-radio-button value="">{{ t('notification.filter.all') }}</el-radio-button>
        <el-radio-button v-for="(name, key) in typeList" :key="key" :value="key">
          {{ t(name) }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 状态筛选 -->
    <div class="filter-row">
      <el-radio-group v-model="localReadFilter" size="small" @change="handleReadFilterChange">
        <el-radio-button value="">{{ t('notification.filter.all') }}</el-radio-button>
        <el-radio-button value="0">{{ t('notification.status.unread') }}</el-radio-button>
        <el-radio-button value="1">{{ t('notification.status.read') }}</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 高级筛选 -->
    <div class="filter-row advanced-row">
      <el-select
        v-model="localPriorityFilter"
        size="small"
        :placeholder="t('notification.filter.priority')"
        clearable
        style="width: 120px"
        @change="handleFilterChange"
      >
        <el-option :label="t('notification.priority.high')" value="high" />
        <el-option :label="t('notification.priority.medium')" value="medium" />
        <el-option :label="t('notification.priority.low')" value="low" />
      </el-select>

      <el-select
        v-model="localTimeFilter"
        size="small"
        :placeholder="t('notification.filter.timeRange')"
        clearable
        style="width: 140px"
        @change="handleTimeFilterChange"
      >
        <el-option :label="t('notification.filter.today')" value="today" />
        <el-option :label="t('notification.filter.thisWeek')" value="week" />
        <el-option :label="t('notification.filter.thisMonth')" value="month" />
        <el-option :label="t('notification.filter.custom')" value="custom" />
      </el-select>

      <el-date-picker
        v-if="localTimeFilter === 'custom'"
        v-model="localDateRange"
        type="daterange"
        size="small"
        :range-separator="t('notification.filter.to')"
        :start-placeholder="t('notification.filter.startDate')"
        :end-placeholder="t('notification.filter.endDate')"
        style="width: 240px"
        @change="handleDateRangeChange"
      />

      <el-input
        v-model="localKeyword"
        size="small"
        :placeholder="t('notification.page.searchPlaceholder')"
        clearable
        style="width: 220px"
        @input="handleKeywordInput"
        @keyup.enter="handleFilterChange"
      >
        <template #append>
          <el-button :icon="Search" @click="handleFilterChange" />
        </template>
      </el-input>

      <el-button size="small" :icon="Refresh" @click="handleReset">
        {{ t('notification.filter.reset') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 通知筛选条（归档/类型/已读/优先级/时间/关键词）
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search, Refresh } from '@element-plus/icons-vue'

defineOptions({ name: 'NotificationFilter' })

interface Props {
  archiveTab?: string
  filterType?: string
  readFilter?: string
  priorityFilter?: string
  timeFilter?: string
  dateRange?: string[]
  keyword?: string
  debounceTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  archiveTab: '0',
  filterType: '',
  readFilter: '',
  priorityFilter: '',
  timeFilter: '',
  dateRange: () => [],
  keyword: '',
  debounceTime: 300
})

const emit = defineEmits<{
  (e: 'update:archiveTab', value: string): void
  (e: 'update:filterType', value: string): void
  (e: 'update:readFilter', value: string): void
  (e: 'update:priorityFilter', value: string): void
  (e: 'update:timeFilter', value: string): void
  (e: 'update:dateRange', value: string[]): void
  (e: 'update:keyword', value: string): void
  (e: 'archive-change', value: string): void
  (e: 'filter-change', payload: { type: string; priority: string; keyword: string }): void
  (e: 'read-filter-change', value: string): void
  (e: 'time-filter-change', value: string): void
  (e: 'date-range-change', value: string[]): void
  (e: 'reset'): void
}>()

const { t } = useI18n()

const typeList: Record<string, string> = {
  system: 'notification.type.system',
  plc: 'notification.type.plc',
  user: 'notification.type.user',
  audit: 'notification.type.audit',
  device: 'notification.type.device',
  connection: 'notification.type.connection',
  security: 'notification.type.security'
}

const localArchiveTab = ref(props.archiveTab)
const localFilterType = ref(props.filterType)
const localReadFilter = ref(props.readFilter)
const localPriorityFilter = ref(props.priorityFilter)
const localTimeFilter = ref(props.timeFilter)
const localDateRange = ref<string[]>([...props.dateRange])
const localKeyword = ref(props.keyword)

let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.archiveTab,
  val => {
    localArchiveTab.value = val
  }
)
watch(
  () => props.filterType,
  val => {
    localFilterType.value = val
  }
)
watch(
  () => props.readFilter,
  val => {
    localReadFilter.value = val
  }
)
watch(
  () => props.priorityFilter,
  val => {
    localPriorityFilter.value = val
  }
)
watch(
  () => props.timeFilter,
  val => {
    localTimeFilter.value = val
  }
)
watch(
  () => props.dateRange,
  val => {
    localDateRange.value = [...val]
  }
)
watch(
  () => props.keyword,
  val => {
    localKeyword.value = val
  }
)

function handleArchiveChange(): void {
  emit('update:archiveTab', localArchiveTab.value)
  emit('archive-change', localArchiveTab.value)
}

function handleFilterChange(): void {
  emit('update:filterType', localFilterType.value)
  emit('update:priorityFilter', localPriorityFilter.value)
  emit('update:keyword', localKeyword.value)
  emit('filter-change', {
    type: localFilterType.value,
    priority: localPriorityFilter.value,
    keyword: localKeyword.value
  })
}

function handleKeywordInput(): void {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => handleFilterChange(), props.debounceTime)
}

function handleReadFilterChange(): void {
  emit('update:readFilter', localReadFilter.value)
  emit('read-filter-change', localReadFilter.value)
}

function handleTimeFilterChange(): void {
  emit('update:timeFilter', localTimeFilter.value)
  emit('time-filter-change', localTimeFilter.value)
}

function handleDateRangeChange(): void {
  emit('update:dateRange', localDateRange.value)
  emit('date-range-change', localDateRange.value)
}

function handleReset(): void {
  localArchiveTab.value = '0'
  localFilterType.value = ''
  localReadFilter.value = ''
  localPriorityFilter.value = ''
  localTimeFilter.value = ''
  localDateRange.value = []
  localKeyword.value = ''
  if (searchTimer) clearTimeout(searchTimer)
  emit('reset')
}

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped lang="less">
.notification-filter {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  margin-bottom: 16px;

  .filter-row {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .advanced-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
}
</style>
