<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '210px'" class="layout-sidebar">
      <div class="sidebar-logo">
        <div class="logo-badge"><img src="/honeycomb.svg" alt="Beehive" class="logo-icon" /></div>
        <transition name="fade">
          <div v-if="!isCollapse" class="logo-info">
            <div class="logo-title">Beehive</div>
            <div class="logo-sub">License Manager</div>
          </div>
        </transition>
      </div>

      <el-menu
        :default-active="$route.path"
        router
        :collapse="isCollapse"
        :collapse-transition="false"
        class="sidebar-menu"
      >
        <el-menu-item v-for="item in menuList" :key="item.path" :index="item.path">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="layout-main">
      <el-header class="layout-header">
        <div class="header-left">
          <i
            class="collapse-icon"
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            @click="isCollapse = !isCollapse"
          ></i>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="header-time">
            <i class="el-icon-time"></i>
            <span>{{ currentTime }}</span>
          </div>
          <div class="header-user">
            <div class="user-avatar">A</div>
            <div class="user-info">
              <div class="user-name">Admin</div>
              <div class="user-role">超级管理员</div>
            </div>
          </div>
        </div>
      </el-header>

      <el-main class="layout-content">
        <transition name="page-fade" mode="out-in">
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isCollapse: false,
      currentTime: "",
      timer: null
    };
  },
  computed: {
    menuList() {
      return this.$router.options.routes
        .filter((r) => r.meta)
        .map((r) => ({ path: r.path, title: r.meta.title, icon: r.meta.icon }));
    },
    currentTitle() {
      return this.$route.meta?.title || "";
    }
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString("zh-CN", { hour12: false });
    }
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body,
#app {
  height: 100%;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
    sans-serif;
  background: #f0f2f5;
  color: #303133;
}

.layout-container {
  height: 100vh;
}

/* ========== 侧边栏 ========== */
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
.sidebar-logo .logo-badge {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sidebar-logo .logo-badge .logo-icon {
  width: 25px;
  height: 25px;
  display: block;
  margin-left: -8px;
}
.sidebar-logo .logo-info .logo-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}
.sidebar-logo .logo-info .logo-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 2px;
}

/* 菜单 */
.sidebar-menu {
  border-right: none !important;
  background: transparent !important;
  padding: 10px 8px;
  flex: 1;
  overflow-y: auto;
}
.sidebar-menu .el-menu-item {
  color: rgba(255, 255, 255, 0.65) !important;
  border-radius: 6px;
  margin-bottom: 2px;
  height: 42px;
  line-height: 42px;
  transition: all 0.2s ease;
}
.sidebar-menu .el-menu-item:hover {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #fff !important;
}
.sidebar-menu .el-menu-item i {
  font-size: 17px;
  margin-right: 10px;
}
.sidebar-menu .el-menu-item.is-active {
  background: #1890ff !important;
  color: #fff !important;
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
  font-size: 20px;
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
.header-time i {
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
  padding: 20px 24px;
  overflow-y: auto;
}

/* 页面过渡 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.25s ease;
}
.page-fade-enter {
  opacity: 0;
  transform: translateY(8px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* ========== Element UI 覆盖 ========== */
.el-card {
  border-radius: 8px !important;
  border: none !important;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08) !important;
}
.el-card__header {
  border-bottom: 1px solid #f0f0f0 !important;
  padding: 14px 20px !important;
  font-weight: 600;
  color: #262626;
  font-size: 15px;
}
.el-card__body {
  padding: 20px !important;
}

.el-button--primary {
  background: #1890ff !important;
  border-color: #1890ff !important;
}
.el-button--primary:hover {
  background: #40a9ff !important;
  border-color: #40a9ff !important;
}
.el-button {
  border-radius: 6px !important;
}

.el-input__inner,
.el-textarea__inner {
  border-radius: 6px !important;
}
.el-textarea__inner {
  resize: none !important;
}
.el-input__inner:focus {
  border-color: #1890ff !important;
}

.el-table {
  border-radius: 8px !important;
  overflow: hidden;
}
.el-table th {
  background: #fafafa !important;
  color: #595959 !important;
  font-weight: 600 !important;
}

.el-tag {
  border-radius: 4px !important;
}
.el-dialog {
  border-radius: 8px !important;
  overflow: hidden;
}
.el-dialog__header {
  padding: 16px 20px !important;
  border-bottom: 1px solid #f0f0f0;
}
.el-dialog__body {
  padding: 20px !important;
}
.el-dialog__footer {
  padding: 12px 20px !important;
  border-top: 1px solid #f0f0f0;
}

.el-breadcrumb__inner {
  color: #909399 !important;
}
.el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #303133 !important;
  font-weight: 500;
}
</style>
