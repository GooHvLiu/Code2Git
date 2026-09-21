/**
 * ==========================================
 * App Store - 全局 UI 状态
 * ==========================================
 * 侧边栏折叠、设备类型、全局 Loading 计数
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLocalStorage, setLocalStorage } from '@/utils/data/storage'
import { LOCALSTORAGE_KEYS } from '@/utils/data/storageKey'

interface SidebarState {
  opened: boolean
  withoutAnimation: boolean
}

function getSidebarOpened(): boolean {
  const stored = getLocalStorage<string>(LOCALSTORAGE_KEYS.SIDEBAR_STATUS)
  return stored === null ? true : stored === 'opened'
}

export const useAppStore = defineStore('app', () => {
  const sidebar = ref<SidebarState>({
    opened: getSidebarOpened(),
    withoutAnimation: false
  })
  const device = ref<'desktop' | 'mobile'>('desktop')
  const globalLoading = ref(0)

  function toggleSideBar(): void {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
    setLocalStorage(LOCALSTORAGE_KEYS.SIDEBAR_STATUS, sidebar.value.opened ? 'opened' : 'closed')
  }

  function closeSideBar(withoutAnimation: boolean): void {
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
    setLocalStorage(LOCALSTORAGE_KEYS.SIDEBAR_STATUS, 'closed')
  }

  function toggleDevice(d: 'desktop' | 'mobile'): void {
    device.value = d
  }

  function showLoading(): void {
    globalLoading.value++
  }

  function hideLoading(): void {
    if (globalLoading.value > 0) globalLoading.value--
  }

  function resetLoading(): void {
    globalLoading.value = 0
  }

  return {
    sidebar,
    device,
    globalLoading,
    toggleSideBar,
    closeSideBar,
    toggleDevice,
    showLoading,
    hideLoading,
    resetLoading
  }
})
