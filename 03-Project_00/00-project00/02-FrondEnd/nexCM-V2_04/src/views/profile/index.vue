<template>
  <div class="profile-page">
    <el-card shadow="never">
      <div slot="header">{{ $t('profile.title') }}</div>
      <p>{{ $t('profile.username') }}：{{ userInfo.username || '--' }}</p>
      <p>{{ $t('profile.realName') }}：{{ userInfo.realName || '--' }}</p>
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
