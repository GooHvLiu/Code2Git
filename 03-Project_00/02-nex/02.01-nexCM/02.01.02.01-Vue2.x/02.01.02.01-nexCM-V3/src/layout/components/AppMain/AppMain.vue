<template>
  <div class="app-main" ref="appMain">
    <!-- 页面内容 -->
    <TransitionSlide
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

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { TransitionSlide } from "@morev/vue-transitions";
import store from "@/store";
import router from "@/router";
import config from "@/config";

// ===== 响应式数据 =====
const transitionDuration = config.TRANSITION_DURATION
const appMainRef = ref(null)
let afterEachHook = null

// ===== 计算属性 =====
const cachedViews = computed(() => store.getters.cachedViews)

/**
 * 路由切换后：滚动到顶部
 */
function handleAfterEach() {
  nextTick(() => {
    if (appMainRef.value) {
      appMainRef.value.scrollTop = 0
    }
  })
}

// ===== 生命周期 =====
onMounted(() => {
  afterEachHook = router.afterEach(handleAfterEach)
})

onBeforeUnmount(() => {
  if (typeof afterEachHook === 'function') {
    afterEachHook()
  }
})
</script>

<style scoped lang="less">
.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: @app-main-padding;
  background: @app-main-bg;
}
</style>
