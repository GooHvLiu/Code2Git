<template>
  <div class="app-main" ref="appMain">
    <TransitionSlide direction="down" :duration="transitionDuration" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="$route.path" />
      </keep-alive>
    </TransitionSlide>
  </div>
</template>

<script>
import { TransitionSlide } from '@morev/vue-transitions'
import { mapGetters } from 'vuex'
import config from '@/config'

export default {
  name: 'AppMain',
  components: { TransitionSlide },
  data() {
    return {
      transitionDuration: config.TRANSITION_DURATION
    }
  },
  computed: {
    ...mapGetters(['cachedViews'])
  },
  watch: {
    /**
     * 路由切换时滚动到顶部
     * 避免从长列表页跳到其他页面后滚动条位置不变
     */
    $route() {
      this.$nextTick(() => {
        if (this.$refs.appMain) {
          this.$refs.appMain.scrollTop = 0
        }
      })
    }
  }
}
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
