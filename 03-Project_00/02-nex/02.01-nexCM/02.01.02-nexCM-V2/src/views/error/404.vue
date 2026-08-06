<!--
  error/404.vue - 404 页面
-->
<template>
  <div style="padding: 100px; text-align: center;">
    <h1 style="font-size: 80px; color: #409EFF; margin: 0;">404</h1>
    <p style="font-size: 20px; color: #606266;">页面不存在</p>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>
<script>
export default { name: 'Page404' }
</script>
