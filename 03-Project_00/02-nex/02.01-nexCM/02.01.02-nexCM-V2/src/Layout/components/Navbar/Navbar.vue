<template>
  <div class="navbar">
    <div class="navbar-top">
      <div class="navbar-left">
        <div class="collapse-btn" @click="toggleSideBar">
          <i :class="sidebar.opened ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
        </div>
        <div class="breadcrumb-wrap">
          <HeadBreadcrumb />
        </div>
      </div>
      <div class="navbar-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <svg-icon :icon-file-name="userInfo?.avatar || 'who'" class="avatar-icon" />
            <span class="username">{{ userInfo.username || '用户' }}</span>
            <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="navbar-bottom">
      <TagsView />
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { mapState, mapActions } from 'vuex'
import HeadBreadcrumb from '@/components/Breadcrumb/HeadBreadcrumb.vue'
import TagsView from '@/Layout/components/TagsView/TagsView.vue'

export default {
  name: 'Navbar',
  components: { HeadBreadcrumb, TagsView },
  computed: {
    ...mapState('app', ['sidebar']),
    ...mapState('user', ['userInfo'])
  },
  methods: {
    ...mapActions('app', ['toggleSideBar']),
    ...mapActions('user', ['logout']),
    async handleCommand(command) {
      if (command === 'logout') {
        await this.logout()
        this.$router.push('/login')
      }
      if (command === 'profile') {
        this.$router.push('/profile')
      }
    }
  }
}
</script>

<style scoped lang="less">
.navbar {
  height: 84px;
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
}

.collapse-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: @border-radius-base;
  font-size: 20px;
  color: @navbar-text;
  .transition(background);

  &:hover {
    background: @bg-gray;
  }
}

.breadcrumb-wrap {
  margin-left: @spacing-sm;
}

.navbar-right {
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: @navbar-text;
    outline: none;

    .avatar-icon {
      font-size: 20px;
      margin-right: 6px;
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
</style>
