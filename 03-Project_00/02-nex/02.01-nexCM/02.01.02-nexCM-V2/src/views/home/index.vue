<template>
  <div class="home-page">
    <el-card shadow="never" class="welcome-card">
      <div class="welcome-content">
        <!-- <img :src="config.HOME_LOGO" alt="logo" class="welcome-logo" /> -->
        <h1 class="welcome-title">{{ config.SYSTEM_NAME }}</h1>
        <p class="welcome-version">v{{ config.SYSTEM_VERSION }}</p>
        <p class="welcome-desc">
          欢迎使用，{{ userInfo.realName || userInfo.username || "管理员" }}
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { mapState } from "vuex";
import config from "@/config";

export default {
  name: "Home",
  data() {
    return { config };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
  },
};
</script>

<style scoped lang="less">
.home-page {
  .welcome-card {
    border-radius: @border-radius-md;
  }

  .welcome-content {
    text-align: center;
    padding: @spacing-xxl 0;
  }

  .welcome-logo {
    width: 80px;
    height: 80px;
  }

  .welcome-title {
    margin: @spacing-lg 0 @spacing-xs;
    font-size: @font-size-xxl;
    color: @text-primary;
  }

  .welcome-version {
    color: @text-secondary;
    font-size: @font-size-base;
    margin: 0 0 @spacing-md;
  }

  .welcome-desc {
    color: @text-regular;
    font-size: @font-size-md;
    margin: 0;
  }
}
</style>
