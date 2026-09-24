<template>
  <div v-watermark="watermarkText" class="main-layout" :class="{ 'is-mobile': isMobileDevice }">
    <Sidebar />

    <!-- 移动端遮罩：点击关闭侧边栏 -->
    <div
      v-if="isMobileDevice && appStore.sidebar.opened"
      class="drawer-mask"
      @click="appStore.closeSideBar(false)"
    ></div>

    <div class="layout-right">
      <Navbar />
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 主布局：侧边栏 + 顶部导航（含标签栏）+ 内容区
 * 作者：GooHv
 */
import { computed } from 'vue'
import Sidebar from './Sidebar/index.vue'
import Navbar from './Navbar/index.vue'
import AppMain from './AppMain/index.vue'
import settings from '@/settings'
import { getConfig } from '@/utils/config/config'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useResize } from '@/composables/useResize'
import { useSessionTimeout } from '@/composables/useSessionTimeout'

const appStore = useAppStore()
const userStore = useUserStore()

// 响应式检测（移动端自动折叠，内部 onMounted 自动监听）
useResize()
// 会话超时检测
useSessionTimeout()

const isMobileDevice = computed(() => appStore.device === 'mobile')

/** 水印文本：未开启时返回空串（指令不渲染） */
const watermarkText = computed<string>(() => {
  const enabled = getConfig<boolean>('watermarkEnabled', settings.watermark) as boolean
  if (!enabled) return ''
  const custom = getConfig<string>('watermarkText', settings.watermarkText || '') as string
  const username = userStore.userInfo?.username ? String(userStore.userInfo.username) : ''
  return custom || username
})
</script>

<style scoped lang="less">
.main-layout {
  display: flex;
  height: 100%;
  width: 100%;
}

.layout-right {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* 移动端：侧边栏抽屉化 */
.main-layout.is-mobile {
  position: relative;

  :deep(.sidebar) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: @z-sidebar;
    transition: transform @transition-duration;
    transform: translateX(0);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }

  /* 折叠状态滑出屏幕 */
  :deep(.sidebar.is-collapse) {
    transform: translateX(-100%);
    box-shadow: none;
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
}
</style>
