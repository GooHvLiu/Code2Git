<template>
  <div class="app-main">
    <TransitionSlide direction="down" :duration="280" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta && !$route.meta.noCache" :key="$route.path" />
      </keep-alive>
      <router-view v-if="$route.meta && $route.meta.noCache" :key="$route.path" />
    </TransitionSlide>
  </div>
</template>

<script>
import { TransitionSlide } from '@morev/vue-transitions'

export default {
  name: 'AppMain',
  components: { TransitionSlide }
}
</script>

<style scoped lang="less">
.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  background: #f0f2f5;
}
</style>
