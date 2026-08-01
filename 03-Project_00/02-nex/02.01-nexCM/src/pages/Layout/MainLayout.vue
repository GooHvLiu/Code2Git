<template>
  <div class="MainLayout">
    <NavBar></NavBar>
    <div class="layout-right">
      <HeadView></HeadView>
      <ContentView></ContentView>
    </div>
  </div>
</template>

<script>
import NavBar from "./NavBar.vue";
import HeadView from "./HeadView.vue";
import ContentView from "./ContentView.vue";
export default {
  name: "MainLayout",
  components: {
    NavBar,
    HeadView,
    ContentView
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {}
};
</script>

<style scoped lang="less">
.MainLayout {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden; /* 全局禁止溢出 */

  .layout-right {
    flex: 1;
    min-width: 0; /* flex子元素必须加，允许容器收缩，消除横向滚动条 */
    display: flex;
    flex-direction: column;
  }
}
</style>
