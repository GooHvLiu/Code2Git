<template>
  <div class="head-breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'HeadBreadcrumb',
  computed: {
    breadcrumbList() {
      const titles = this.$route.meta?.titles
      if (titles && titles.length) return titles
      const title = this.$route.meta?.title
      return title ? [title] : []
    }
  }
}
</script>

<style scoped lang="less"></style>
