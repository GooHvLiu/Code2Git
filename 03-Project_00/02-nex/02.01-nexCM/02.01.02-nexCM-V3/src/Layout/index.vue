<template>
  <div
    class="main-layout"
    :class="{ 'is-mobile': device === 'mobile' }"
    v-watermark="watermarkText"
  >
    <Sidebar class="sidebar-container" />
    <div class="layout-right">
      <Navbar />
      <AppMain />
    </div>
    <!-- 移动端遮罩层 -->
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-mask"
      @click="handleClickOutside"
    />
    <!-- 部件寿命提醒弹窗（可拖拽、可关闭、非模态） -->
    <PartLifeReminder
      :visible.sync="reminderVisible"
      :reminder-list="reminderList"
      @remind-later="handleRemindLater"
      @view-detail="handleViewDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import store from '@/store'
import router from '@/router'
import Sidebar from "./components/Sidebar/Sidebar.vue"
import Navbar from "./components/Navbar/Navbar.vue"
import AppMain from "./components/AppMain/AppMain.vue"
import PartLifeReminder from "@/components/PartLifeReminder/index.vue"
import { useResize } from "@/composables/useResize"
import { useSessionTimeout } from "@/composables/useSessionTimeout"
import settings from "@/settings"
import { getConfig } from "@/utils/config"

// 使用 useResize 组合式函数
useResize()

// 使用 useSessionTimeout 组合式函数
useSessionTimeout()

// 从 store 获取状态
const sidebar = computed(() => store.state.app.sidebar)
const device = computed(() => store.state.app.device)
const userInfo = computed(() => store.state.user.userInfo)

// 水印配置
const watermarkEnabled = ref(getConfig('watermarkEnabled', settings.watermark))
const customWatermarkText = ref(getConfig('watermarkText', settings.watermarkText))

// 水印文字
const watermarkText = computed(() => {
  if (!watermarkEnabled.value) return ""
  return customWatermarkText.value || userInfo.value?.username || ""
})

// ==================== 部件寿命提醒 ====================
const reminderVisible = ref(false)
const reminderList = ref([])
let reminderTimer = null

// 判断部件寿命提醒是否开启（兼容数据库存储的字符串 'true'/'false'）
function isPartLifeReminderEnabled() {
  const val = getConfig('partLifeReminderEnabled', true)
  return val === true || val === 'true' || val === 1 || val === '1'
}

// 获取需要提醒的部件列表
function getReminderParts() {
  const threshold = parseInt(getConfig('partLifeThreshold', '20'))
  const parts = store.state.device.parts || []
  return parts
    .map(p => {
      const remainingLife = p.total > 0 ? Math.round((p.total - p.used) / p.total * 100) : 100
      return {
        ...p,
        remainingLife
      }
    })
    .filter(p => p.remainingLife <= threshold)
}

// 检查并显示提醒
function checkAndShowReminder() {
  // 检查部件寿命提醒开关
  if (!isPartLifeReminderEnabled()) {
    reminderVisible.value = false
    return
  }
  const parts = getReminderParts()
  if (parts.length > 0) {
    reminderList.value = parts.map(p => ({
      name: p.name,
      remainingLife: p.remainingLife,
      location: p.location || ''
    }))
    reminderVisible.value = true
  }
}

// 启动定时提醒
function startReminderTimer() {
  stopReminderTimer()
  // 检查部件寿命提醒开关
  if (!isPartLifeReminderEnabled()) return
  const interval = getConfig('partLifeRemindInterval', 'day')
  // 转换为毫秒（演示用，实际时间可调整）
  const intervalMap = {
    hour: 60 * 60 * 1000,
    shift: 8 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000
  }
  const delay = intervalMap[interval] || intervalMap.day
  reminderTimer = setInterval(() => {
    checkAndShowReminder()
  }, delay)
}

// 停止定时提醒
function stopReminderTimer() {
  if (reminderTimer) {
    clearInterval(reminderTimer)
    reminderTimer = null
  }
}

// 稍后提醒（暂停一段时间）
function handleRemindLater() {
  // 检查部件寿命提醒开关
  if (!isPartLifeReminderEnabled()) return
  // 从配置读取稍后提醒间隔（分钟），默认10分钟
  const snoozeMinutes = parseInt(getConfig('partLifeSnoozeInterval', '10'))
  setTimeout(() => {
    checkAndShowReminder()
  }, snoozeMinutes * 60 * 1000)
}

// 查看详情（跳转到部件寿命页面）
function handleViewDetail() {
  reminderVisible.value = false
  router.push('/device/part')
}

// 水印配置变化处理
function handleWatermarkConfigChanged(event) {
  if (event.detail?.enabled !== undefined) {
    watermarkEnabled.value = event.detail.enabled
  }
  if (event.detail?.text !== undefined) {
    customWatermarkText.value = event.detail.text
  }
}

// 部件寿命提醒开关变化处理
function handlePartLifeReminderEnabledChanged(event) {
  const rawEnabled = event.detail?.enabled
  if (rawEnabled === undefined) return
  // 兼容字符串 'true'/'false'
  const enabled = rawEnabled === true || rawEnabled === 'true' || rawEnabled === 1 || rawEnabled === '1'
  if (enabled) {
    // 开启：检查并显示提醒，重启定时器
    checkAndShowReminder()
    startReminderTimer()
  } else {
    // 关闭：隐藏提醒，停止定时器
    reminderVisible.value = false
    stopReminderTimer()
  }
}

// 点击遮罩层关闭侧边栏
function handleClickOutside() {
  store.dispatch("app/closeSideBar", { withoutAnimation: false })
}

onMounted(() => {
  // 监听系统配置变化：水印配置改变时更新
  window.addEventListener('watermarkConfigChanged', handleWatermarkConfigChanged)
  // 监听部件寿命提醒开关变化
  window.addEventListener('partLifeReminderEnabledChanged', handlePartLifeReminderEnabledChanged)
  // 应用启动时统一启动设备数据同步
  store.dispatch('device/startDataSync')
  // 启动部件寿命定时提醒（延迟5秒，等数据加载完成）
  setTimeout(() => {
    checkAndShowReminder()
    startReminderTimer()
  }, 5000)
})

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('watermarkConfigChanged', handleWatermarkConfigChanged)
  window.removeEventListener('partLifeReminderEnabledChanged', handlePartLifeReminderEnabledChanged)
  // 停止定时提醒
  stopReminderTimer()
})
</script>

<style scoped lang="less">
.main-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;

  .layout-right {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .drawer-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: @mask-bg;
    z-index: @z-mask;
  }

  &.is-mobile {
    .sidebar-container {
      position: fixed;
      z-index: @z-sidebar;
    }
  }
}
</style>
