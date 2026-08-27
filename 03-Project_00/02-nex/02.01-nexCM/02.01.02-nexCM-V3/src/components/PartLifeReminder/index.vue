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
  width: 380px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(245, 108, 108, 0.25), 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  user-select: none;
  animation: reminder-pulse 2s ease-in-out infinite;
}

@keyframes reminder-pulse {
  0%, 100% {
    box-shadow: 0 8px 32px rgba(245, 108, 108, 0.25), 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  50% {
    box-shadow: 0 8px 40px rgba(245, 108, 108, 0.4), 0 2px 12px rgba(0, 0, 0, 0.12);
  }
}

.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 50%, #ffdede 100%);
  border-bottom: 1px solid #fde2e2;
  cursor: move;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.warning-icon {
  font-size: 22px;
  color: #f56c6c;
  animation: icon-bounce 1s ease-in-out infinite;
}

@keyframes icon-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.reminder-title {
  font-size: 16px;
  font-weight: 700;
  color: #c0392b;
  letter-spacing: 0.5px;
}

.reminder-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  background: linear-gradient(135deg, #f56c6c 0%, #e74c3c 100%);
  color: #fff;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.4);
}

.close-btn {
  padding: 6px;
  font-size: 18px;
  color: #909399;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
}

.reminder-body {
  padding: 18px;
  max-height: 300px;
  overflow-y: auto;
}

.reminder-content {
  font-size: 14px;
  color: #505050;
  margin-bottom: 14px;
  line-height: 1.6;
  padding: 10px 12px;
  background: linear-gradient(135deg, #fff9f9 0%, #fff5f5 100%);
  border-radius: 8px;
  border-left: 3px solid #f56c6c;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reminder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 3px solid #f56c6c;
  transition: all 0.2s ease;
}

.reminder-item:hover {
  background: #f5f5f5;
  transform: translateX(2px);
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.life-percent {
  font-size: 13px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 12px;
}

.life-critical {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  color: #f56c6c;
}

.life-warning {
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  color: #e6a23c;
}

.life-notice {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  color: #409eff;
}

.life-normal {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  color: #67c23a;
}

.item-location {
  font-size: 12px;
  color: #909399;
}

.reminder-empty {
  text-align: center;
  padding: 24px;
  color: #909399;
  font-size: 14px;
}

.reminder-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid #ebeef5;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.reminder-footer .el-button {
  border-radius: 6px;
  font-weight: 500;
  padding: 8px 18px;
  transition: all 0.2s ease;
}

.reminder-footer .el-button--primary {
  background: linear-gradient(135deg, #f56c6c 0%, #e74c3c 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
}

.reminder-footer .el-button--primary:hover {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
  transform: translateY(-1px);
}

/* 过渡动画 */
.reminder-fade-enter-active,
.reminder-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.reminder-fade-enter,
.reminder-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
