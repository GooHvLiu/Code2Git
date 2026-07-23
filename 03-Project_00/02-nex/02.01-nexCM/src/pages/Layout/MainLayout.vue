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
  height: 100%;
  width: 100%;
  display: flex;
  .layout-right {
    flex: 1;
  }
}
</style>
