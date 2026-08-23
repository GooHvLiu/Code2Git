<template>
  <div
    class="main-layout"
    :class="{ 'is-mobile': device === 'mobile' }"
    v-watermark="watermarkText"
  >
    <Sidebar class="sidebar-container" />
    <div class="layout-right">
      <Navbar />
      <AppMain />
    </div>
    <!-- 移动端遮罩层 -->
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-mask"
      @click="handleClickOutside"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Sidebar from "./components/Sidebar/Sidebar.vue";
import Navbar from "./components/Navbar/Navbar.vue";
import AppMain from "./components/AppMain/AppMain.vue";
import resizeMixin from "@/mixins/resize";
import settings from "@/settings";

export default {
  name: "MainLayout",
  components: { Sidebar, Navbar, AppMain },
  mixins: [resizeMixin],
  data() {
    return { settings };
  },
  computed: {
    ...mapState("app", ["sidebar", "device"]),
    ...mapState("user", ["userInfo"]),
    /**
     * 水印文字
     * settings.watermark 为 false 时返回空字符串（指令内部会跳过）
     * 优先使用 settings.watermarkText，否则用当前用户名
     */
    watermarkText() {
      if (!settings.watermark) return "";
      return settings.watermarkText || this.userInfo?.username || "";
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
};
</script>

<style scoped lang="less">
.main-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;

  .layout-right {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .drawer-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: @mask-bg;
    z-index: @z-mask;
  }

  &.is-mobile {
    .sidebar-container {
      position: fixed;
      z-index: @z-sidebar;
    }
  }
}
</style>
