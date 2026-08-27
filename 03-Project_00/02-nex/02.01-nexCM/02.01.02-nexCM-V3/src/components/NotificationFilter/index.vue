<template>
  <div class="notification-filter">
    <!-- 归档标签页 -->
    <div class="filter-row">
      <el-radio-group v-model="localArchiveTab" size="small" @change="handleArchiveChange">
        <el-radio-button label="0">{{ $t('notification.unarchived') }}</el-radio-button>
        <el-radio-button label="1">{{ $t('notification.archived') }}</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 类型筛选 -->
    <div class="filter-row">
      <el-radio-group v-model="localFilterType" size="small" @change="handleFilterChange">
        <el-radio-button label="">{{ $t('notification.all') }}</el-radio-button>
        <el-radio-button v-for="(name, key) in typeList" :key="key" :label="key">
          {{ $t(name) }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 状态筛选 -->
    <div class="filter-row">
      <el-radio-group v-model="localReadFilter" size="small" @change="handleReadFilterChange">
        <el-radio-button label="">{{ $t('notification.all') }}</el-radio-button>
        <el-radio-button label="0">{{ $t('notification.unread') }}</el-radio-button>
        <el-radio-button label="1">{{ $t('notification.read') }}</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 高级筛选 -->
    <div class="filter-row advanced-row">
      <el-select
        v-model="localPriorityFilter"
        size="small"
        :placeholder="$t('notification.priority')"
        clearable
        @change="handleFilterChange"
        style="width: 120px;"
      >
        <el-option :label="$t('notification.priorityHigh')" value="high" />
        <el-option :label="$t('notification.priorityMedium')" value="medium" />
        <el-option :label="$t('notification.priorityLow')" value="low" />
      </el-select>

      <el-select
        v-model="localTimeFilter"
        size="small"
        :placeholder="$t('notification.timeRange')"
        clearable
        @change="handleTimeFilterChange"
        style="width: 140px;"
      >
        <el-option :label="$t('notification.today')" value="today" />
        <el-option :label="$t('notification.thisWeek')" value="week" />
        <el-option :label="$t('notification.thisMonth')" value="month" />
        <el-option :label="$t('notification.custom')" value="custom" />
      </el-select>

      <el-date-picker
        v-if="localTimeFilter === 'custom'"
        v-model="localDateRange"
        type="daterange"
        size="small"
        :range-separator="$t('notification.to')"
        :start-placeholder="$t('notification.startDate')"
        :end-placeholder="$t('notification.endDate')"
        @change="handleDateRangeChange"
        style="width: 240px;"
      />

      <el-input
        v-model="localKeyword"
        size="small"
        :placeholder="$t('notification.searchPlaceholder')"
        clearable
        @input="handleKeywordInput"
        @keyup.enter.native="handleFilterChange"
        style="width: 220px;"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleFilterChange"></el-button>
      </el-input>

      <el-button size="small" icon="el-icon-refresh" @click="handleReset">{{ $t('notification.reset') }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  archiveTab: { type: String, default: '0' },
  filterType: { type: String, default: '' },
  readFilter: { type: String, default: '' },
  priorityFilter: { type: String, default: '' },
  timeFilter: { type: String, default: '' },
  dateRange: { type: Array, default: () => [] },
  keyword: { type: String, default: '' },
  debounceTime: { type: Number, default: 300 }
})

const emit = defineEmits([
  'update:archiveTab', 'update:filterType', 'update:readFilter',
  'update:priorityFilter', 'update:timeFilter', 'update:dateRange', 'update:keyword',
  'archive-change', 'filter-change', 'read-filter-change',
  'time-filter-change', 'date-range-change', 'reset'
])

// 通知类型列表（使用国际化 key）
const typeList = {
  system: 'notification.typeSystem',
  plc: 'notification.typePlc',
  user: 'notification.typeUser',
  audit: 'notification.typeAudit',
  device: 'notification.typeDevice',
  connection: 'notification.typeConnection'
}

const localArchiveTab = ref(props.archiveTab)
const localFilterType = ref(props.filterType)
const localReadFilter = ref(props.readFilter)
const localPriorityFilter = ref(props.priorityFilter)
const localTimeFilter = ref(props.timeFilter)
const localDateRange = ref([...props.dateRange])
const localKeyword = ref(props.keyword)

// 防抖定时器
let searchTimer = null

watch(() => props.archiveTab, (val) => { localArchiveTab.value = val })
watch(() => props.filterType, (val) => { localFilterType.value = val })
watch(() => props.readFilter, (val) => { localReadFilter.value = val })
watch(() => props.priorityFilter, (val) => { localPriorityFilter.value = val })
watch(() => props.timeFilter, (val) => { localTimeFilter.value = val })
watch(() => props.dateRange, (val) => { localDateRange.value = [...val] })
watch(() => props.keyword, (val) => { localKeyword.value = val })

function handleArchiveChange() {
  emit('update:archiveTab', localArchiveTab.value)
  emit('archive-change', localArchiveTab.value)
}

function handleFilterChange() {
  emit('update:filterType', localFilterType.value)
  emit('update:priorityFilter', localPriorityFilter.value)
  emit('update:keyword', localKeyword.value)
  emit('filter-change', { type: localFilterType.value, priority: localPriorityFilter.value, keyword: localKeyword.value })
}

// 关键词输入防抖处理
function handleKeywordInput() {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    handleFilterChange()
  }, props.debounceTime)
}

function handleReadFilterChange() {
  emit('update:readFilter', localReadFilter.value)
  emit('read-filter-change', localReadFilter.value)
}

function handleTimeFilterChange() {
  emit('update:timeFilter', localTimeFilter.value)
  emit('time-filter-change', localTimeFilter.value)
}

function handleDateRangeChange() {
  emit('update:dateRange', localDateRange.value)
  emit('date-range-change', localDateRange.value)
}

function handleReset() {
  localArchiveTab.value = '0'
  localFilterType.value = ''
  localReadFilter.value = ''
  localPriorityFilter.value = ''
  localTimeFilter.value = ''
  localDateRange.value = []
  localKeyword.value = ''
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  emit('reset')
}

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
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
    &:last-child { margin-bottom: 0; }
  }

  .advanced-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
}
</style>
