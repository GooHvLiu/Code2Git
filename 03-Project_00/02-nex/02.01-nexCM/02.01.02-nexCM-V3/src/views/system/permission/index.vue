<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>权限配置</span>
      </div>
      <div class="permission-config">
        <el-alert
          title="权限配置功能开发中"
          type="info"
          description="该页面正在开发中，敬请期待..."
          show-icon
          :closable="false">
        </el-alert>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SystemPermission',
  data() {
    return {}
  },
  created() {
    // 页面初始化
  },
  methods: {}
}
</script>

<style scoped>
.permission-config {
  padding: 20px;
  text-align: center;
}
</style>
