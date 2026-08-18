<template>
  <div class="head-breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="index"
        >{{ item }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "HeadBreadcrumb",
  computed: {
    breadcrumbList() {
      const titles = this.$route.meta?.titles;
      if (titles && titles.length) {
        return titles.map(t => this.$t(t));
      }
      const title = this.$route.meta?.title;
      return title ? [this.$t(title)] : [];
    },
  },
};
</script>

<style scoped lang="less"></style>
