<template>
  <div v-if="selectedCount > 0" class="notification-batch-toolbar">
    <span class="batch-info">{{ $t('notification.selectedCount', { count: selectedCount }) }}</span>
    <el-button size="small" type="primary" icon="el-icon-check" @click="$emit('batch-mark-read')">
      {{ $t('notification.batchMarkRead') }}
    </el-button>
    <el-button v-if="archiveTab === '0'" size="small" icon="el-icon-folder-opened" @click="$emit('batch-archive')">
      {{ $t('notification.batchArchive') }}
    </el-button>
    <el-button v-if="archiveTab === '1'" size="small" icon="el-icon-refresh-left" @click="$emit('batch-unarchive')">
      {{ $t('notification.batchUnarchive') }}
    </el-button>
    <el-button size="small" type="danger" icon="el-icon-delete" @click="$emit('batch-delete')">
      {{ $t('notification.batchDelete') }}
    </el-button>
    <el-button size="small" @click="$emit('clear-selection')">{{ $t('notification.clearSelection') }}</el-button>
  </div>
</template>

<script setup>
defineProps({
  selectedCount: {
    type: Number,
    default: 0
  },
  archiveTab: {
    type: String,
    default: '0'
  }
})

defineEmits([
  'batch-mark-read',
  'batch-archive',
  'batch-unarchive',
  'batch-delete',
  'clear-selection'
])
</script>

<style scoped lang="less">
.notification-batch-toolbar {
  background: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;

  .batch-info {
    font-size: 14px;
    color: #409eff;
    font-weight: 500;
  }
}
</style>
