<template>
  <div class="home-page">
    <el-card shadow="never" class="welcome-card">
      <div class="welcome-content">
        <img :src="config.SYSTEM_LOGO" alt="logo" class="welcome-logo" />
        <h1 class="welcome-title">{{ config.SYSTEM_NAME }}</h1>
        <p class="welcome-version">v{{ config.SYSTEM_VERSION }}</p>
        <p class="welcome-desc">欢迎使用，{{ userInfo.realName || userInfo.username || '管理员' }}</p>
      </div>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { mapState } from 'vuex'
import config from '@/config'

export default {
  name: 'Home',
  data() {
    return { config }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  }
}
</script>

<style scoped lang="less">
.home-page {
  .welcome-card {
    border-radius: 8px;
  }

  .welcome-content {
    text-align: center;
    padding: 40px 0;
  }

  .welcome-logo {
    width: 80px;
    height: 80px;
  }

  .welcome-title {
    margin: 20px 0 8px;
    font-size: 24px;
    color: #303133;
  }

  .welcome-version {
    color: #909399;
    font-size: 14px;
    margin: 0 0 16px;
  }

  .welcome-desc {
    color: #606266;
    font-size: 16px;
    margin: 0;
  }
}
</style>
