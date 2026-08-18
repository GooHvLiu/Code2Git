<template>
  <div class="app-main" ref="appMain">
    <!-- 路由切换时显示骨架屏 -->
    <Skeleton v-if="routeLoading" :rows="8" title class="route-skeleton" />
    <!-- 实际页面内容 -->
    <TransitionSlide
      v-else
      direction="down"
      :duration="transitionDuration"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view :key="$route.path" />
      </keep-alive>
    </TransitionSlide>
  </div>
</template>

<script>
import { TransitionSlide } from "@morev/vue-transitions";
import { mapGetters } from "vuex";
import config from "@/config";
import Skeleton from "@/components/Skeleton/index.vue";

export default {
  name: "AppMain",
  components: { TransitionSlide, Skeleton },
  data() {
    return {
      transitionDuration: config.TRANSITION_DURATION,
      routeLoading: false,
      skeletonTimer: null,
    };
  },
  computed: {
    ...mapGetters(["cachedViews"]),
  },
  watch: {
    /**
     * 路由切换时：
     * 1. 滚动到顶部
     * 2. 非 keep-alive 页面显示骨架屏，提升感知速度
     */
    $route(to, from) {
      // 滚动到顶部
      this.$nextTick(() => {
        if (this.$refs.appMain) {
          this.$refs.appMain.scrollTop = 0;
        }
      });

      // 首次进入或从无 name 路由跳转时不显示骨架屏
      if (!from.name || !to.name) return;

      // 目标页面在 keep-alive 缓存中，切换很快，不显示骨架屏,如需测试骨架屏效果，临时注释掉下面这行即可
      if (this.cachedViews.includes(to.name)) return;

      // 显示骨架屏
      this.routeLoading = true;
      clearTimeout(this.skeletonTimer);
      this.skeletonTimer = setTimeout(() => {
        this.routeLoading = false;
      }, 300);
    },
  },
  beforeDestroy() {
    clearTimeout(this.skeletonTimer);
  },
};
</script>

<style scoped lang="less">
.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: @app-main-padding;
  background: @app-main-bg;
}

.route-skeleton {
  padding: @spacing-md;
}
</style>
