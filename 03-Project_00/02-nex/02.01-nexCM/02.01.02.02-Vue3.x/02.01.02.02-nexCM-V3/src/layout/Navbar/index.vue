<template>
  <div class="navbar">
    <div class="navbar-top">
      <div class="navbar-left">
        <div class="collapse-btn" @click="toggleSideBar">
          <el-icon>
            <Fold v-if="appStore.sidebar.opened" />
            <Expand v-else />
          </el-icon>
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
        <!-- 心跳指示器 -->
        <HeartbeatIndicator class="heartbeat-indicator-wrapper" />
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <SvgIcon :icon-class="avatarIcon" class="avatar-icon" />
            <span class="username">{{ displayName }}</span>
            <el-icon class="arrow-icon"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">{{ t('layout.navbar.profileTitle') }}</el-dropdown-item>
              <el-dropdown-item command="logout" divided>{{ t('layout.navbar.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div v-if="settings.tagsView" class="navbar-bottom">
      <TagsView />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 顶部导航栏
 * 左：折叠按钮 + 面包屑；右：菜单搜索 / 主题 / 通知 / 心跳 / 用户菜单
 * 作者：GooHv
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Fold, Expand, ArrowDown } from '@element-plus/icons-vue'
import HeadBreadcrumb from '@/components/Breadcrumb/index.vue'
import MenuSearch from '@/components/MenuSearch/index.vue'
import ThemePicker from '@/components/ThemePicker/index.vue'
import NotificationBell from '@/components/NotificationBell/index.vue'
import HeartbeatIndicator from '@/components/HeartbeatIndicator/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import TagsView from '@/layout/TagsView/index.vue'
import { ROUTE_PATHS } from '@/router/constant/pathConstants'
import settings from '@/settings'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

/**
 * 角色头像图标（依据数据库字段，不硬编码角色编码）
 * is_super_admin=1 → SuperAdmin；role_level 2/3/4 → Administrator/Engineer/Operator；其余 who
 */
const avatarIcon = computed<string>(() => {
  const info = userStore.userInfo || {}
  if (Number(info.is_super_admin) === 1) return 'SuperAdmin'
  const levelMap: Record<number, string> = { 2: 'Administrator', 3: 'Engineer', 4: 'Operator' }
  return levelMap[Number(info.role_level)] || 'who'
})

/** 显示名称：真实姓名 → 用户名 → 兜底文案 key */
const displayName = computed<string>(() => {
  const info = userStore.userInfo || {}
  return info.real_name || info.realName || info.username || (t('layout.navbar.user') as string)
})

function toggleSideBar(): void {
  appStore.toggleSideBar()
}

async function handleCommand(command: string): Promise<void> {
  if (command === 'logout') {
    await userStore.logout()
    router.push(ROUTE_PATHS.LOGIN)
  } else if (command === 'profile') {
    router.push(ROUTE_PATHS.PROFILE)
  }
}
</script>

<style scoped lang="less">
.navbar {
  height: @navbar-total-height;
  background: @navbar-bg;
  flex-shrink: 0;
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
  transition: background @transition-duration;

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

  :deep(.el-breadcrumb) {
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
      width: @navbar-avatar-icon-size;
      height: @navbar-avatar-icon-size;
      margin-right: @spacing-xs;
    }

    .username {
      font-size: @font-size-base;
      margin-right: @spacing-xs;
    }

    .arrow-icon {
      font-size: 12px;
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
