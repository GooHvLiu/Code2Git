<!--
  Navbar.vue - 顶部导航栏
  包含：汉堡菜单、面包屑、用户下拉菜单
-->
<template>
  <div class="navbar">
    <!-- 汉堡菜单按钮（折叠/展开侧边栏） -->
    <div class="hamburger-container" @click="toggleSideBar">
      <svg-icon :icon-class="sidebar.opened ? 'hamburger' : 'hamburger-close'" class="hamburger" />
    </div>
    <!-- 面包屑导航 -->
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in levelList" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 右侧用户菜单 -->
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <span style="display:block;">个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  data() {
    return {
      levelList: [] // 面包屑层级
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  watch: {
    // 路由变化时更新面包屑
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    // 切换侧边栏
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 根据 matched 生成面包屑
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      this.levelList = matched
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    padding: 0 15px;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .hamburger {
    display: inline-block;
    width: 20px;
    height: 20px;
    font-size: 20px;
    color: #5a5e66;
    vertical-align: middle;
  }

  .breadcrumb-container {
    float: left;
    line-height: 50px;
    margin-left: 8px;
  }

  .right-menu {
    display: flex;
    align-items: center;
    margin-left: auto;
    padding-right: 20px;

    .avatar-container {
      cursor: pointer;
    }

    .avatar-wrapper {
      display: flex;
      align-items: center;

      .user-avatar {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      .name {
        margin-left: 8px;
        font-size: 14px;
      }
    }
  }
}
</style>
