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
import sessionTimeoutMixin from "@/mixins/sessionTimeout";
import settings from "@/settings";
import { getConfig } from "@/utils/config";

export default {
  name: "MainLayout",
  components: { Sidebar, Navbar, AppMain },
  mixins: [resizeMixin, sessionTimeoutMixin],
  data() {
    return {
      settings,
      // 水印配置（从系统配置读取，支持实时更新）
      watermarkEnabled: getConfig('watermarkEnabled', settings.watermark),
      customWatermarkText: getConfig('watermarkText', settings.watermarkText)
    };
  },
  created() {
    // 监听系统配置变化：水印配置改变时更新
    window.addEventListener('watermarkConfigChanged', this.handleWatermarkConfigChanged)
  },
  mounted() {
    // 应用启动时统一启动设备数据同步
    // 内部会：1. 首次拉取全量数据 2. WebSocket推送更新 3. 轮询兜底（5秒）
    // 各业务页面只需从 store 读取数据，无需主动 fetch
    this.$store.dispatch('device/startDataSync')
  },
  beforeDestroy() {
    // 移除事件监听
    window.removeEventListener('watermarkConfigChanged', this.handleWatermarkConfigChanged)
  },
  computed: {
    ...mapState("app", ["sidebar", "device"]),
    ...mapState("user", ["userInfo"]),
    /**
     * 水印文字
     * watermarkEnabled 为 false 时返回空字符串（指令内部会跳过）
     * 优先使用 customWatermarkText，否则用当前用户名
     */
    watermarkText() {
      if (!this.watermarkEnabled) return "";
      return this.customWatermarkText || this.userInfo?.username || "";
    },
  },
  methods: {
    /**
     * 水印配置变化时处理
     */
    handleWatermarkConfigChanged(event) {
      if (event.detail?.enabled !== undefined) {
        this.watermarkEnabled = event.detail.enabled
      }
      if (event.detail?.text !== undefined) {
        this.customWatermarkText = event.detail.text
      }
    },
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
