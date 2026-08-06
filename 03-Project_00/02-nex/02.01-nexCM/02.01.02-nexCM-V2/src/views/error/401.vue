<!--
  error/401.vue - 401 无权限页面
-->
<template>
  <div style="padding: 100px; text-align: center;">
    <h1 style="font-size: 80px; color: #F56C6C; margin: 0;">401</h1>
    <p style="font-size: 20px; color: #606266;">没有权限访问此页面</p>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>
<script>
export default { name: 'Page401' }
</script>
