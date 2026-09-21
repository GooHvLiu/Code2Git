<template>
  <div class="head-breadcrumb">
    <el-breadcrumb>
      <template #separator>
        <el-icon class="breadcrumb-separator"><ArrowRight /></el-icon>
      </template>
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="item + '-' + index"
      >
        {{ item }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
/**
 * 头部面包屑
 * 依据当前路由 meta.titles（多级）或 meta.title 解析展示，标题走 i18n。
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { resolveMenuTitle } from '@/router/helper/menuTitle'

defineOptions({ name: 'HeadBreadcrumb' })

const route = useRoute()

const breadcrumbList = computed<string[]>(() => {
  const titles = route.meta?.titles as string[] | undefined
  if (titles && titles.length) {
    return titles.map(t => resolveMenuTitle(t))
  }
  const title = route.meta?.title as string | undefined
  if (!title) return []
  return [resolveMenuTitle(title)]
})
</script>

<style scoped lang="less">
.head-breadcrumb {
  display: inline-block;
  line-height: 50px;
}

.breadcrumb-separator {
  margin: 0 2px;
}
</style>
