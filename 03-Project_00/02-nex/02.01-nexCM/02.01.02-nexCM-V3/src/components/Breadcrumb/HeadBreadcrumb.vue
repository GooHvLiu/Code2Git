<template>
  <div class="head-breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="item + '-' + index"
      >{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
// 使用 Options API + this.$route，Vue 2 最可靠的响应式方式
// getCurrentInstance() 在 Vue 2.7 中存在响应式不同步的风险
import { resolveMenuTitle } from '@/router/helper/menuTitle'

export default {
  name: 'HeadBreadcrumb',
  computed: {
    breadcrumbList() {
      const route = this.$route
      const titles = route.meta?.titles
      if (titles && titles.length) {
        return titles.map(t => resolveMenuTitle(t))
      }
      const title = route.meta?.title
      if (!title) return []
      return [resolveMenuTitle(title)]
    }
  }
}
</script>

<style scoped lang="less"></style>
