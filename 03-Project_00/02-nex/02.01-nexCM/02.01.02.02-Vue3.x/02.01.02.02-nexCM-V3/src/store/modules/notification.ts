/**
 * ==========================================
 * Notification Store - 未读数量
 * ==========================================
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const unreadCount = ref(0)
  const hasUnread = computed(() => unreadCount.value > 0)

  function setUnreadCount(count: number): void {
    unreadCount.value = count
  }
  function incrementUnreadCount(count = 1): void {
    unreadCount.value += count
  }
  function decrementUnreadCount(count = 1): void {
    unreadCount.value = Math.max(0, unreadCount.value - count)
  }
  function clearUnreadCount(): void {
    unreadCount.value = 0
  }

  return {
    unreadCount,
    hasUnread,
    setUnreadCount,
    incrementUnreadCount,
    decrementUnreadCount,
    clearUnreadCount
  }
})
