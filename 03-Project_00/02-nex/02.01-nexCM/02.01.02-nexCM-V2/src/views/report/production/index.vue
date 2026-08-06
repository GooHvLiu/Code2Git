<!--
  report/production/index.vue - 生产报表
  功能：按时间/订单/设备统计产量、良品率，导出Excel
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>生产报表</h2>
      <p>生产数据统计与导出</p>
    </div>
    <el-alert title="生产报表页面，后续开发" type="info" :closable="false" />
  </div>
</template>
<script>
export default { name: 'ReportProduction' }
</script>
