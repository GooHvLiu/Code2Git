<template>
  <div
    class="sidebar"
    :class="{
      'is-collapse': !sidebar.opened,
    }"
    :style="{
      width: sidebar.opened
        ? config.SIDEBAR_WIDTH
        : config.SIDEBAR_COLLAPSE_WIDTH,
    }"
  >
    <div v-if="settings.sidebarLogo" class="sidebar-logo">
      <router-link :to="routePaths.ROOT" class="logo-link">
        <!-- <img :src="config.SYSTEM_LOGO" alt="logo" class="logo-img" /> -->
        <svg-icon icon-file-name="logo" class="logo-svg" />
        <span v-show="sidebar.opened" class="logo-text">{{
          $t("common.systemName")
        }}</span>
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
        <sidebar-item v-for="item in menuItems" :key="item.path" :item="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import config from "@/config";
import settings from "@/settings";
import SidebarItem from "./SidebarItem.vue";
import { ROUTE_PATHS } from "@/router/constant/pathConstants.js";
import store from '@/store'
import router from '@/router'
import { useI18n } from '@/composables/useI18n'

const { t: $t } = useI18n()

const routePaths = ROUTE_PATHS

// ===== 响应式数据 =====
// router.currentRoute 不是响应式的，用 afterEach 监听更新
const currentRoute = ref(router.currentRoute)
let afterEachHook = null
onMounted(() => {
  afterEachHook = router.afterEach((to) => {
    currentRoute.value = to
  })
})
onBeforeUnmount(() => {
  if (typeof afterEachHook === 'function') {
    afterEachHook()
  }
})

// ===== 计算属性 =====
const sidebar = computed(() => store.state.app.sidebar)
const menuItems = computed(() => store.state.permission.userMenu)

/** 当前激活菜单（解决子路由高亮父菜单问题） */
const activeMenu = computed(() => {
  const { meta, path } = currentRoute.value
  if (meta?.activeMenu) return meta.activeMenu
  return path
})
</script>

<style scoped lang="less">
.sidebar {
  height: 100%;
  background-color: var(--sidebar-bg);
  transition: width @transition-duration;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .sidebar-logo {
    height: @navbar-height;
    display: flex;
    align-items: center;
    overflow: hidden;
    flex-shrink: 0;

    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 0 @spacing-lg;
      width: 100%;
    }

    .logo-svg {
      width: @sidebar-logo-img-size;
      height: @sidebar-logo-img-size;
      vertical-align: middle;
      margin-left: 3px;
      flex-shrink: 0;
    }

    .logo-text {
      color: var(--sidebar-text);
      font-size: @sidebar-logo-text-size;
      font-weight: 600;
      margin-left: @spacing-sm;
      white-space: nowrap;
    }
  }

  .sidebar-scroll {
    flex: 1;
    min-height: 0;

    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    /* 修复el-scrollbar内部自带白色背景，保证整体侧边栏颜色统一 */
    ::v-deep .el-scrollbar__view {
      background: transparent !important;
    }
  }

  /* el-menu 背景透明，透出 .sidebar 的 var(--sidebar-bg)；菜单项的透明/选中/hover 由 index.less 统一按顺序管理 */
  ::v-deep .el-menu {
    border-right: none;
    background-color: transparent !important;
  }

  // 折叠时仅隐藏文字，logo 图片位置保持不变（不移动）
  &.is-collapse {
    .logo-text {
      display: none;
    }
  }
}
</style>
