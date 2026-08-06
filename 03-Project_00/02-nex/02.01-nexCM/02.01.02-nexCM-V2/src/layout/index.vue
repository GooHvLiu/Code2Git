<!--
  layout/index.vue - 后台主布局
  结构：左侧边栏 + 右侧主区域（顶部导航 + 标签页 + 内容区）
  
  class 说明：
  - hideSidebar: 侧边栏收起
  - openSidebar: 侧边栏展开
  - withoutAnimation: 不使用动画
  - mobile: 移动端模式
-->
<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 移动端遮罩层 -->
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- 左侧边栏 -->
    <sidebar class="sidebar-container" />
    <!-- 右侧主区域 -->
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar /> <!-- 顶部导航栏 -->
        <tags-view v-if="needTagsView" /> <!-- 多标签页 -->
      </div>
      <app-main /> <!-- 路由内容区 -->
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin], // 混入响应式处理
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    // 动态 class
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    // 移动端点击遮罩关闭侧边栏
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
</style>
