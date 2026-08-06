<!--
  system/audit/index.vue - 审计日志
  功能：符合 21 CFR Part 11 的操作追踪
  记录：操作人、时间、模块、操作、对象、IP、结果、变更前后数据
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>审计日志</h2>
      <p>符合 21 CFR Part 11 的操作审计追踪</p>
    </div>
    <div class="table-container">
      <el-table :data="tableData" border>
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="user" label="操作人" width="100" />
        <el-table-column prop="module" label="模块" width="100" />
        <el-table-column prop="action" label="操作" width="100" />
        <el-table-column prop="target" label="操作对象" width="150" />
        <el-table-column prop="ip" label="IP地址" width="150" />
        <el-table-column label="结果" width="80" align="center">
          <template slot-scope="{row}">
            <el-tag size="small" :type="row.success ? 'success' : 'danger'">
              {{ row.success ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope>
            <el-button type="text" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SystemAudit',
  data() {
    return {
      tableData: [
        { time: '2026-08-06 09:00:00', user: 'admin', module: '订单', action: '启动', target: 'ORD20260806001', ip: '192.168.1.10', success: true },
        { time: '2026-08-06 08:30:00', user: 'admin', module: '用户', action: '创建', target: 'zhangsan', ip: '192.168.1.10', success: true }
      ]
    }
  }
}
</script>
