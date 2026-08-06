<!--
  fixture/register/index.vue - 治具注册
  功能：刷卡读取RFID、录入治具信息、绑定类型、设置保养周期
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>治具注册</h2>
      <p>注册新的RFID治具</p>
    </div>
    <el-alert title="治具注册页面，后续开发" type="info" :closable="false" />
  </div>
</template>
<script>
export default { name: 'FixtureRegister' }
</script>
