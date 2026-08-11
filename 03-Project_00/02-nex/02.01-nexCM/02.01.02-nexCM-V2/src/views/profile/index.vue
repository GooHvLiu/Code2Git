<template>
  <div class="profile-page">
    <el-card shadow="never">
      <div slot="header">个人中心</div>
      <p>用户名：{{ userInfo.username || '--' }}</p>
      <p>姓名：{{ userInfo.realName || '--' }}</p>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { mapState } from 'vuex'

export default {
  name: 'Profile',
  computed: {
    ...mapState('user', ['userInfo'])
  }
}
</script>

<style scoped lang="less">
.profile-page {
  p {
    margin: 8px 0;
    color: @text-regular;
  }
}
</style>
