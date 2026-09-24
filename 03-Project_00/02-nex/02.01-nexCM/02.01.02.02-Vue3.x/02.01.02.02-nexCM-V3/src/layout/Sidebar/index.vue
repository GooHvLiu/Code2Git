<template>
  <div class="sidebar" :class="{ 'is-collapse': !appStore.sidebar.opened }">
    <div v-if="settings.sidebarLogo" class="sidebar-logo">
      <router-link :to="ROUTE_PATHS.ROOT" class="logo-link">
        <SvgIcon icon-class="logo" class="logo-svg" />
        <span v-show="appStore.sidebar.opened" class="logo-text">{{ t('common.systemName') }}</span>
      </router-link>
    </div>

    <el-scrollbar class="sidebar-scroll">
      <!-- 菜单数据就绪后下一帧再挂载 el-menu：规避 Element Plus 子菜单初始展开时
           ElCollapseTransition 在首帧读取 scrollHeight=0，导致内联 max-height:0 残留、
           展开的子菜单不占文档流高度而与后续一级菜单重叠的问题 -->
      <el-menu
        v-if="menuReady"
        :default-active="activeMenu"
        :collapse="!appStore.sidebar.opened"
        :collapse-transition="false"
        :unique-opened="true"
        :background-color="config.SIDEBAR_BG"
        :text-color="config.SIDEBAR_TEXT"
        :active-text-color="config.SIDEBAR_ACTIVE_TEXT"
        mode="vertical"
        router
      >
        <SidebarItem v-for="item in menuItems" :key="item.path" :item="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
/**
 * 侧边栏：渲染后端下发的菜单树
 * 对齐 Vue2 版：Logo + 折叠宽度 + el-menu 配色/router 模式
 * 作者：GooHv
 */
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import config from '@/config'
import settings from '@/settings'
import { ROUTE_PATHS } from '@/router/constant/pathConstants'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import SvgIcon from '@/components/SvgIcon/index.vue'
import SidebarItem from './SidebarItem.vue'
import type { SidebarMenu } from '@/types/router'

const { t } = useI18n()
const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const menuItems = computed<SidebarMenu[]>(() => permissionStore.userMenu || [])

/**
 * 菜单是否就绪可渲染
 * 菜单数据到达后再等待一个 nextTick 才挂载 el-menu，使 Element Plus 初始展开当前路由
 * 所在父菜单时，内联子菜单 DOM 已完成布局，ElCollapseTransition 能读到正确的 scrollHeight，
 * 避免 max-height:0 内联样式残留导致展开子菜单与后续菜单重叠。
 */
const menuReady = ref(false)
watch(
  () => menuItems.value.length,
  async len => {
    if (len > 0) {
      await nextTick()
      menuReady.value = true
    } else {
      menuReady.value = false
    }
  },
  { immediate: true }
)

/** 当前激活菜单（解决子路由高亮父菜单问题） */
const activeMenu = computed<string>(() => {
  const meta = route.meta as { activeMenu?: string }
  return meta?.activeMenu || route.path
})
</script>

<style scoped lang="less">
.sidebar {
  width: @sidebar-width;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--sidebar-bg);
  transition: width @transition-duration;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  /* 折叠态宽度由 class 驱动（对齐 Vue2 版写法）：
     flex 子项默认 min-width:auto 会被内容最小宽度钳制，故上方显式 min-width:0，
     保证侧边栏可从 @sidebar-width 收缩到 @sidebar-collapsed-width */
  &.is-collapse {
    width: @sidebar-collapsed-width;
  }

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
    height: 0;

    :deep(.el-scrollbar) {
      height: 100%;
    }

    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }

    /* 滚动条始终显示，不只是 hover 时 */
    :deep(.el-scrollbar__bar) {
      opacity: 1;
    }

    :deep(.el-scrollbar__bar.is-vertical) {
      width: 6px;
    }

    :deep(.el-scrollbar__thumb) {
      background-color: rgba(144, 147, 153, 0.4);
      border-radius: 3px;

      &:hover {
        background-color: rgba(144, 147, 153, 0.6);
      }
    }

    /* 修复 el-scrollbar 自带白色背景，保证侧边栏颜色统一 */
    :deep(.el-scrollbar__view) {
      background: transparent !important;
    }
  }

  /* el-menu 背景透明，透出 .sidebar 的 var(--sidebar-bg) */
  :deep(.el-menu) {
    border-right: none;
    background-color: transparent !important;
  }

  /* 修复 Element Plus 垂直子菜单初始展开时 ElCollapseTransition 残留内联
     max-height:0 的问题：首屏样式表/菜单数据异步就绪，展开动画读取 scrollHeight
     那一刻子项高度可能为 0，导致 max-height 从 0→0 不触发 transitionend、内联
     max-height:0 永久残留，展开的子菜单不占文档流高度而与后续一级菜单重叠。
     展开态强制按内容高度布局（收起时 .is-opened 移除，仍保留 EP 原生收起动画）。 */
  :deep(.el-menu .el-sub-menu.is-opened > .el-menu--inline) {
    max-height: none !important;
  }

  /* 折叠时仅隐藏文字，logo 图标位置保持不变 */
  &.is-collapse {
    .logo-text {
      display: none;
    }
  }
}
</style>
