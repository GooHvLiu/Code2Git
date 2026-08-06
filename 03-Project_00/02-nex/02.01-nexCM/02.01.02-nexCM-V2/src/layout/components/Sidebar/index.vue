<!--
  Sidebar/index.vue - 左侧边栏
  包含 Logo 和菜单
-->
<template>
  <div class="sidebar-wrapper">
    <!-- Logo 区域 -->
    <div class="logo" v-if="showLogo">
      <router-link to="/">
        <svg-icon icon-class="example" class="logo-icon" />
        <h1 class="logo-title">MCV-Auto</h1>
      </router-link>
    </div>
    <!-- 菜单滚动区域 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="activeMenu"
        :collapse="!sidebar.opened"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <!-- 递归渲染菜单项 -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['sidebar']),
    // 从 Vuex 获取可访问的路由
    routes() {
      return this.$store.getters.permission_routes
    },
    // 当前激活的菜单
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // 如果路由配置了 activeMenu，使用它
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
  height: 100%;
  
  .logo {
    height: 50px;
    line-height: 50px;
    background: #2b2f3a;
    text-align: center;
    
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #fff;
      text-decoration: none;
    }
    
    .logo-icon {
      width: 28px;
      height: 28px;
      font-size: 28px;
      color: #409EFF;
    }
    
    .logo-title {
      margin: 0 0 0 10px;
      font-size: 16px;
      font-weight: 600;
      display: inline-block;
      color: #fff;
    }
  }
}
</style>
