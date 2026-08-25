<template>
  <div class="navbar">
    <div class="navbar-top">
      <div class="navbar-left">
        <div class="collapse-btn" @click="toggleSideBar">
          <i
            :class="sidebar.opened ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
          ></i>
        </div>
        <div class="breadcrumb-wrap">
          <HeadBreadcrumb />
        </div>
      </div>
      <div class="navbar-right">
        <!-- 菜单搜索 -->
        <MenuSearch class="menu-search-wrapper" />
        <!-- 主题颜色选择器 -->
        <ThemePicker class="theme-picker-wrapper" />
        <!-- 通知铃铛 -->
        <NotificationBell class="notification-bell-wrapper" />
        <!-- 心跳指示器（位置A：通知铃铛旁边） -->
        <HeartbeatIndicator class="heartbeat-indicator-wrapper" />
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <svg-icon :icon-file-name="avatarIcon" class="avatar-icon" />
            <span class="username">{{
              userInfo.username || $t("layout.user")
            }}</span>
            <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="profile">{{
              $t("layout.profile")
            }}</el-dropdown-item>
            <el-dropdown-item command="logout" divided>{{
              $t("layout.logout")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div v-if="settings.tagsView" class="navbar-bottom">
      <TagsView />
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { mapState, mapActions } from "vuex";
import { hasRole } from "@/utils/permission";
import HeadBreadcrumb from "@/components/Breadcrumb/HeadBreadcrumb.vue";
import TagsView from "@/Layout/components/TagsView/TagsView.vue";
import ThemePicker from "@/components/ThemePicker/index.vue";
import MenuSearch from "@/components/MenuSearch/index.vue";
import NotificationBell from "@/components/NotificationBell/index.vue";
import HeartbeatIndicator from "@/components/HeartbeatIndicator/index.vue";
import { ROUTE_PATHS } from "@/router/constant/pathConstants";
import settings from "@/settings";

export default {
  name: "Navbar",
  components: {
    HeadBreadcrumb,
    TagsView,
    ThemePicker,
    MenuSearch,
    NotificationBell,
    HeartbeatIndicator,
  },
  data() {
    return { settings };
  },
  computed: {
    ...mapState("app", ["sidebar"]),
    ...mapState("user", ["userInfo"]),
    /** 是否管理员（仅 administrator 角色可见用户管理） */
    isAdmin() {
      return hasRole("administrator");
    },
    /**
     * 根据角色确定头像图标
     * 角色 → 图标映射：
     *   administrator → administrator.svg
     *   operator      → operator.svg
     *   engineer      → engineer.svg
     *   其他/未匹配    → who.svg（默认）
     */
    avatarIcon() {
      const roleMap = {
        administrator: "administrator",
        operator: "operator",
        engineer: "engineer",
        user: "user",
      };
      const role = this.userInfo?.role;
      // role 可能是字符串或数组，取第一个
      const roleCode = Array.isArray(role) ? role[0] : role;
      return roleMap[roleCode] || "who";
    },
  },
  methods: {
    ...mapActions("app", ["toggleSideBar"]),
    ...mapActions("user", ["logout"]),
    async handleCommand(command) {
      if (command === "logout") {
        await this.logout();
        this.$router.push(ROUTE_PATHS.LOGIN);
      }
      if (command === "profile") {
        this.$router.push(ROUTE_PATHS.PROFILE);
      }
    },
  },
};
</script>

<style scoped lang="less">
.navbar {
  height: @navbar-total-height;
  background: @navbar-bg;
}

.navbar-top {
  height: @navbar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 @spacing-lg;
  border-bottom: 1px solid @border-lighter;
}

.navbar-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.collapse-btn {
  width: @navbar-collapse-btn-size;
  height: @navbar-collapse-btn-size;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: @border-radius-base;
  font-size: @navbar-collapse-icon-size;
  color: @navbar-text;
  .transition(background);

  &:hover {
    background: @bg-gray;
  }
}

.breadcrumb-wrap {
  margin-left: @spacing-sm;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;

  ::v-deep .el-breadcrumb {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: @spacing-sm;
  flex-shrink: 0;
  margin-left: @spacing-sm;

  .theme-picker-wrapper {
    display: inline-flex;
  }

  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: @navbar-text;
    outline: none;

    .avatar-icon {
      font-size: @navbar-avatar-icon-size;
      margin-right: @spacing-xs;
    }

    .username {
      font-size: @font-size-base;
      margin-right: @spacing-xs;
    }
  }
}

.navbar-bottom {
  height: @tagsview-height;
}

/* 响应式：中等屏幕隐藏用户名，只保留头像 */
@media (max-width: 992px) {
  .navbar-right .username {
    display: none;
  }
}

/* 响应式：小屏幕隐藏面包屑 */
@media (max-width: 576px) {
  .breadcrumb-wrap {
    display: none;
  }
}
</style>
