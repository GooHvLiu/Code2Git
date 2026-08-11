<template>
  <div
    class="sidebar"
    :class="{ 'is-collapse': !sidebar.opened }"
    :style="{ width: sidebar.opened ? config.SIDEBAR_WIDTH : config.SIDEBAR_COLLAPSE_WIDTH }"
  >
    <div class="sidebar-logo">
      <router-link to="/" class="logo-link">
        <img :src="config.SYSTEM_LOGO" alt="logo" class="logo-img" />
        <span v-show="sidebar.opened" class="logo-text">{{ config.SYSTEM_NAME }}</span>
      </router-link>
    </div>

    <el-scrollbar class="sidebar-scroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="!sidebar.opened"
        :collapse-transition="false"
        :unique-opened="true"
        :background-color="config.SIDEBAR_BG"
        :text-color="config.SIDEBAR_TEXT"
        :active-text-color="config.SIDEBAR_ACTIVE_TEXT"
        mode="vertical"
        router
      >
        <sidebar-item
          v-for="item in menuItems"
          :key="item.path"
          :item="item"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { mapState } from 'vuex'
import config from '@/config'
import SidebarItem from './SidebarItem.vue'

export default {
  name: 'Sidebar',
  components: { SidebarItem },
  data() {
    return { config }
  },
  computed: {
    ...mapState('app', ['sidebar']),
    ...mapState('permission', { menuItems: 'userMenu' }),
    /** 当前激活菜单（解决子路由高亮父菜单问题） */
    activeMenu() {
      const { meta, path } = this.$route
      if (meta?.activeMenu) return meta.activeMenu
      return path
    }
  }
}
</script>

<style scoped lang="less">
.sidebar {
  height: 100%;
  background-color: @sidebar-bg;
  transition: width 0.28s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .sidebar-logo {
    height: 50px;
    display: flex;
    align-items: center;
    overflow: hidden;
    flex-shrink: 0;
    background: #2b3a4d;

    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 0 16px;
      width: 100%;
    }

    .logo-img {
      width: 30px;
      height: 30px;
      flex-shrink: 0;
    }

    .logo-text {
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      margin-left: 10px;
      white-space: nowrap;
    }
  }

  .sidebar-scroll {
    flex: 1;
    min-height: 0;

    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  ::v-deep .el-menu {
    border-right: none;
  }

  &.is-collapse {
    .sidebar-logo {
      .logo-link {
        padding: 0;
        justify-content: center;
      }
    }
  }
}
</style>
