<!--
  fixture/list/index.vue - 治具列表
  功能：RFID治具管理、使用次数、保养状态、报废
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>治具列表</h2>
      <p>RFID治具管理</p>
    </div>
    <div class="table-container">
      <el-table :data="tableData" border>
        <el-table-column prop="rfidCode" label="RFID编号" width="180" />
        <el-table-column prop="fixtureCode" label="治具编号" width="120" />
        <el-table-column prop="fixtureName" label="治具名称" />
        <el-table-column prop="fixtureType" label="类型" width="120" />
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag size="small">{{ statusText[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="useCount" label="使用次数" width="100" align="center" />
        <el-table-column label="操作" width="150">
          <template slot-scope>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">保养</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FixtureList',
  data() {
    return {
      statusText: { idle: '空闲', in_use: '使用中', maintenance: '保养中', scrapped: '已报废' },
      tableData: [
        { id: 1, rfidCode: 'E20034120001', fixtureCode: 'F-001', fixtureName: 'A型治具', fixtureType: 'A', status: 'in_use', useCount: 1234 },
        { id: 2, rfidCode: 'E20034120002', fixtureCode: 'F-002', fixtureName: 'B型治具', fixtureType: 'B', status: 'idle', useCount: 567 }
      ]
    }
  }
}
</script>
