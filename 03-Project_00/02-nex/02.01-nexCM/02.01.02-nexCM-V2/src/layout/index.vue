<template>
  <div class="main-layout" :class="{ 'is-mobile': device === 'mobile' }">
    <Sidebar class="sidebar-container" />
    <div class="layout-right">
      <Navbar />
      <AppMain />
    </div>
    <!-- 移动端遮罩层 -->
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-mask" @click="handleClickOutside" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Sidebar from './components/Sidebar/Sidebar.vue'
import Navbar from './components/Navbar/Navbar.vue'
import AppMain from './components/AppMain/AppMain.vue'
import resizeMixin from '@/mixins/resize'

export default {
  name: 'MainLayout',
  components: { Sidebar, Navbar, AppMain },
  mixins: [resizeMixin],
  computed: {
    ...mapState('app', ['sidebar', 'device'])
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
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
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
  }

  &.is-mobile {
    .sidebar-container {
      position: fixed;
      z-index: @z-sidebar;
    }
  }
}
</style>
