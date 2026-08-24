<template>
  <!--
    403 无权限页面
    用户已登录但访问了无权限的路由时显示
    提供返回首页和返回上一页按钮
  -->
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">403</div>
      <div class="error-title">{{ $t("error.forbidden") }}</div>
      <div class="error-desc">{{ $t("error.forbiddenDesc") }}</div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">{{
          $t("error.backHome")
        }}</el-button>
        <el-button @click="goBack">{{ $t("error.back") }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { ROUTE_PATHS } from "@/router/constant/pathConstants";

export default {
  name: "Forbidden",
  methods: {
    /** 返回首页 */
    goHome() {
      this.$router.push(ROUTE_PATHS.HOME);
    },
    /** 返回上一页 */
    goBack() {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.goHome();
      }
    },
  },
};
</script>

<style scoped lang="less">
.error-page {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - @navbar-total-height);
  display: flex;
  align-items: center;
  justify-content: center;
  background: @bg-page;
}

.error-content {
  text-align: center;
  padding: @spacing-xxl;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: @primary-color;
  line-height: 1;
  margin-bottom: @spacing-lg;
}

.error-title {
  font-size: @font-size-xl;
  color: @text-primary;
  margin-bottom: @spacing-sm;
}

.error-desc {
  font-size: @font-size-base;
  color: @text-secondary;
  margin-bottom: @spacing-xl;
}

.error-actions {
  display: flex;
  gap: @spacing-md;
  justify-content: center;
}
</style>
