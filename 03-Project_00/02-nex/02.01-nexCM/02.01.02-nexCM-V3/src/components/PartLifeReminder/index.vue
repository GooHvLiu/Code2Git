<template>
  <transition name="reminder-fade">
    <div
      v-if="visible"
      class="part-life-reminder"
      :style="{ top: position.top + 'px', left: position.left + 'px', zIndex: zIndex }"
      @mousedown="startDrag"
    >
      <!-- 标题栏（可拖拽区域） -->
      <div class="reminder-header">
        <div class="header-left">
          <i class="el-icon-warning-outline warning-icon"></i>
          <span class="reminder-title">{{ $t("systemConfig.device.reminderTitle") }}</span>
          <span v-if="reminderList.length > 0" class="reminder-count">{{ reminderList.length }}</span>
        </div>
        <div class="header-right">
          <el-button
            type="text"
            class="close-btn"
            @click.stop="handleClose"
          >
            <i class="el-icon-close"></i>
          </el-button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="reminder-body" @mousedown.stop>
        <div class="reminder-content">{{ $t("systemConfig.device.reminderContent") }}</div>
        <div v-if="reminderList.length > 0" class="reminder-list">
          <div
            v-for="(item, index) in reminderList"
            :key="index"
            class="reminder-item"
          >
            <div class="item-name">{{ item.name }}</div>
            <div class="item-info">
              <span class="life-percent" :class="getLifeClass(item.remainingLife)">
                {{ item.remainingLife }}%
              </span>
              <span class="item-location">{{ item.location }}</span>
            </div>
          </div>
        </div>
        <div v-else class="reminder-empty">
          {{ $t("systemConfig.device.reminderNoData") }}
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="reminder-footer" @mousedown.stop>
        <el-button size="small" @click="handleRemindLater">
          {{ $t("systemConfig.device.reminderRemindLater") }}
        </el-button>
        <el-button type="primary" size="small" @click="handleViewDetail">
          {{ $t("systemConfig.device.reminderViewDetail") }}
        </el-button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  reminderList: {
    type: Array,
    default: () => []
  },
  zIndex: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['update:visible', 'close', 'remind-later', 'view-detail'])

// 弹窗位置
const position = reactive({
  top: 100,
  left: 100
})

// 拖拽状态
const isDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })

// 初始化位置（屏幕右下角）
onMounted(() => {
  position.top = window.innerHeight - 350
  position.left = window.innerWidth - 380
})

// 开始拖拽
function startDrag(e) {
  // 只响应左键
  if (e.button !== 0) return
  isDragging.value = true
  dragOffset.x = e.clientX - position.left
  dragOffset.y = e.clientY - position.top
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 拖拽中
function onDrag(e) {
  if (!isDragging.value) return
  let newLeft = e.clientX - dragOffset.x
  let newTop = e.clientY - dragOffset.y
  // 限制在视口范围内
  const maxLeft = window.innerWidth - 100
  const maxTop = window.innerHeight - 50
  newLeft = Math.max(0, Math.min(newLeft, maxLeft))
  newTop = Math.max(0, Math.min(newTop, maxTop))
  position.left = newLeft
  position.top = newTop
}

// 停止拖拽
function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 关闭
function handleClose() {
  emit('update:visible', false)
  emit('close')
}

// 稍后提醒
function handleRemindLater() {
  emit('remind-later')
  handleClose()
}

// 查看详情
function handleViewDetail() {
  emit('view-detail')
}

// 根据剩余寿命获取样式类
function getLifeClass(percent) {
  if (percent <= 10) return 'life-critical'
  if (percent <= 20) return 'life-warning'
  if (percent <= 30) return 'life-notice'
  return 'life-normal'
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.part-life-reminder {
  position: fixed;
  width: 340px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(245, 108, 108, 0.3), 0 0 0 1px rgba(245, 108, 108, 0.2);
  overflow: hidden;
  user-select: none;
}

.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border-bottom: 1px solid #fde2e2;
  cursor: move;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-icon {
  font-size: 20px;
  color: #f56c6c;
}

.reminder-title {
  font-size: 15px;
  font-weight: 600;
  color: #f56c6c;
}

.reminder-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #f56c6c;
  color: #fff;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.close-btn {
  padding: 4px;
  font-size: 16px;
  color: #909399;
}

.close-btn:hover {
  color: #f56c6c;
}

.reminder-body {
  padding: 16px;
  max-height: 280px;
  overflow-y: auto;
}

.reminder-content {
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.5;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 3px solid #f56c6c;
}

.item-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.life-percent {
  font-size: 13px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.life-critical {
  background: #fef0f0;
  color: #f56c6c;
}

.life-warning {
  background: #fdf6ec;
  color: #e6a23c;
}

.life-notice {
  background: #ecf5ff;
  color: #409eff;
}

.life-normal {
  background: #f0f9eb;
  color: #67c23a;
}

.item-location {
  font-size: 12px;
  color: #909399;
}

.reminder-empty {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 13px;
}

.reminder-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
  background: #fafafa;
}

/* 过渡动画 */
.reminder-fade-enter-active,
.reminder-fade-leave-active {
  transition: all 0.3s ease;
}

.reminder-fade-enter,
.reminder-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
