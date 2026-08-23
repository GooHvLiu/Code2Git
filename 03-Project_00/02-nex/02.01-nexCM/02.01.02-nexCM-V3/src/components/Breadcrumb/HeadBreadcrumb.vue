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
        // 判断每个标题是否是 i18n key，是就翻译，不是就直接显示
        // 动态路由的标题是后端返回的对应语言文本，不是 i18n key
        return titles.map(t => this.$te(t) ? this.$t(t) : t);
      }
      const title = this.$route.meta?.title;
      if (!title) return [];
      return [this.$te(title) ? this.$t(title) : title];
    },
  },
};
</script>

<style scoped lang="less"></style>
