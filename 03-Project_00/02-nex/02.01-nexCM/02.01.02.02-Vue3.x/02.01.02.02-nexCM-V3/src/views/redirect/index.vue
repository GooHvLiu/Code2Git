<template>
  <div class="redirect-page"></div>
</template>

<script setup lang="ts">
/**
 * 重定向中转页：刷新后再跳转到目标路由
 */
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const { params, query } = route
  const path = Array.isArray(params.path) ? params.path.join('/') : params.path
  router.replace({ path: '/' + (path || ''), query })
})
</script>
