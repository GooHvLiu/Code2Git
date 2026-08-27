<template>
  <div id="app" v-loading.fullscreen.lock="globalLoading" element-loading-text="加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import store from '@/store'

const globalLoading = computed(() => store.getters.globalLoading)
</script>
