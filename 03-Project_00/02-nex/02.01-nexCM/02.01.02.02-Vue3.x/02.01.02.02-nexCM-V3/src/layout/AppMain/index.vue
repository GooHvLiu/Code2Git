<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </router-view>
  </section>
</template>

<script setup lang="ts">
/**
 * 主内容区：router-view + keep-alive
 */
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
const cachedViews = computed(() => tagsViewStore.cachedViews)
</script>

<style scoped>
/*
 * 注意：此处刻意不使用 <transition mode="out-in"> 包裹 keep-alive。
 * 实测 transition(out-in) + keep-alive + 匿名(<script setup> 无 name)页面组件 + :key 组合，
 * 在切换到/离开占位页时会出现旧组件不卸载、新组件不挂载（URL/标签已变但主区域残留旧页面）。
 * 后台管理系统路由切换动画非必需，故移除过渡以保证稳定性；
 * 若将来恢复过渡，需先为所有路由组件补齐与路由 name 一致的 defineOptions({ name })。
 */
.app-main {
  flex: 1;
  overflow-y: auto;
  background: var(--app-main-bg, #fff);
  padding: 16px;
}
</style>
