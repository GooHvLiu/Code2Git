<!--
  order/detail/index.vue - 订单详情
  功能：订单基本信息、生产进度、不良统计、操作日志、报表导出
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>订单详情</h2>
      <p>订单号：{{ $route.params.id }}</p>
    </div>
    <el-alert title="订单详情页面，后续开发" type="info" :closable="false" />
  </div>
</template>
<script>
export default { name: 'OrderDetail' }
</script>
