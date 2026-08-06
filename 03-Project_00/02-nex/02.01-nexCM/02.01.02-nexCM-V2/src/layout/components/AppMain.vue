<!--
  AppMain.vue - 主内容区
  渲染路由组件，带过渡动画
-->
<template>
  <section class="app-main">
    <!-- 路由切换过渡动画 -->
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // 用 path 作为 key，保证不同路由切换时重新渲染
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
