<template>
  <div id="app" v-loading.fullscreen.lock="globalLoading" :element-loading-text="$t('common.loading')" element-loading-background="rgba(0, 0, 0, 0.3)">
    <router-view></router-view>
    <!-- 全局翻译进度弹窗 -->
    <TranslateProgressDialog />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import store from '@/store'
import i18n, { loadLanguageFile } from '@/i18n'
import TranslateProgressDialog from '@/components/TranslateProgressDialog/index.vue'

const globalLoading = computed(() => store.getters.globalLoading)

// 应用启动时加载当前语言的语言包（用于动态语言，如日语等）
onMounted(async () => {
  const currentLang = i18n.locale
  // 内置语言（中文和英文）已经在模块加载时注册，不需要动态加载
  if (currentLang !== 'zh-CN' && currentLang !== 'en-US') {
    try {
      await loadLanguageFile(currentLang)
    } catch (err) {
      // 加载失败不阻塞应用启动，可能是用户未登录或网络问题
    }
  }
})
</script>
