<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '210px'" class="layout-sidebar">
      <div class="sidebar-logo">
        <div class="logo-badge">
          <img src="../../public/beagle.svg" alt="Beagle" class="logo-icon" />
        </div>
        <transition name="fade">
          <div v-if="!isCollapse" class="logo-info">
            <div class="logo-title">Beagle</div>
            <div class="logo-sub">Project Test Platform</div>
          </div>
        </transition>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        class="sidebar-menu"
        background-color="#001529"
        text-color="rgba(255,255,255,0.65)"
        active-text-color="#ffffff"
      >
        <template v-for="route in menuRoutes">
          <el-menu-item v-if="!route.meta?.hidden" :key="route.path" :index="'/' + route.path">
            <el-icon style="font-size: 21px"><component :is="route.meta?.icon || 'Menu'" /></el-icon>
            <template #title>{{ route.meta?.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container class="layout-main">
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-time">
            <el-icon><Timer /></el-icon>
            <span>{{ currentTime }}</span>
          </div>
          <div class="header-user">
            <div class="user-avatar">S</div>
            <div class="user-info">
              <div class="user-name">GooHv</div>
              <div class="user-role">SuperAdmin</div>
            </div>
          </div>
        </div>
      </el-header>

      <el-main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isCollapse = ref(false);
const currentTime = ref("");
let timer = null;

const menuRoutes = computed(() => {
  const layoutRoute = route.matched.find((r) => r.path === "/");
  return layoutRoute?.children?.filter((c) => !c.meta?.hidden) || [];
});

const activeMenu = computed(() => route.path);
const currentTitle = computed(() => route.meta?.title || "");

function toggleCollapse() {
  isCollapse.value = !isCollapse.value;
}

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("zh-CN", { hour12: false });
}

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

/* ========== 侧边栏（Beehive 风格） ========== */
.layout-sidebar {
  background: #001529 !important;
  position: relative;
  overflow: hidden;
  transition: width 0.28s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.logo-icon {
  width: 30px;
  height: 30px;
  display: block;
}

.logo-info .logo-title {
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.logo-info .logo-sub {
  color: rgba(255, 255, 255, 0.45);
  margin-top: 2px;
}

/* 菜单 */
.sidebar-menu {
  border-right: none !important;
  padding: 10px -10px;
  flex: 1;
  overflow-y: auto;
}

:deep(.sidebar-menu .el-menu-item) {
  color: rgba(255, 255, 255, 0.65) !important;
  gap: 10px;
  border-radius: 6px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 42px;
  line-height: 42px;
  transition: all 0.2s ease;
}

:deep(.sidebar-menu .el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #fff !important;
}

:deep(.sidebar-menu .el-menu-item .el-menu-item__icon) {
  margin-right: 10px;
}
:deep(.sidebar-menu .el-menu-item.is-active) {
  background: #1890ff !important;
  color: #fff !important;
}

/* 折叠状态：图标居中 + 放大 */
:deep(.sidebar-menu.el-menu--collapse .el-menu-item) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
:deep(.sidebar-menu.el-menu--collapse .el-menu-item .el-menu-item__icon) {
  margin-right: 0 !important;
}

/* ========== 主区域 ========== */
.layout-main {
  background: #f0f2f5;
}

.layout-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px !important;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-icon {
  font-size: 36px;
  color: #606266;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.collapse-icon:hover {
  background: #f0f0f0;
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  background: #f5f7fa;
  padding: 5px 12px;
  border-radius: 16px;
}

.header-time .el-icon {
  color: #1890ff;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 8px;
  transition: background 0.2s;
}

.header-user:hover {
  background: #f5f7fa;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-info {
  line-height: 1.3;
}

.user-info .user-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
}

.user-info .user-role {
  font-size: 11px;
  color: #909399;
}

.layout-content {
  background: #f0f2f5;
  padding: 0;
  overflow-y: auto;
}

/* ========== 页面过渡（Beehive 风格：上下滑动+淡入淡出） ========== */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.25s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.05s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
