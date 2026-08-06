<!--
  device/list/index.vue - 设备列表
  功能：设备CRUD、连接/断开PLC、IP/协议配置
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>设备列表</h2>
      <p>设备管理与配置</p>
    </div>
    <div class="table-container">
      <el-table :data="tableData" border>
        <el-table-column prop="deviceCode" label="设备编号" width="120" />
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="ip" label="IP地址" width="150" />
        <el-table-column prop="protocol" label="协议" width="120" />
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag size="small" :type="row.status === 'online' ? 'success' : 'info'">
              {{ row.status === 'online' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope>
            <el-button type="text" size="small">连接</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DeviceList',
  data() {
    return {
      tableData: [
        { id: 1, deviceCode: 'DEV001', deviceName: '1号装配机', ip: '192.168.1.101', protocol: 'Modbus TCP', status: 'online' },
        { id: 2, deviceCode: 'DEV002', deviceName: '2号检测机', ip: '192.168.1.102', protocol: 'Modbus TCP', status: 'online' },
        { id: 3, deviceCode: 'DEV003', deviceName: '3号包装机', ip: '192.168.1.103', protocol: 'OPC UA', status: 'offline' }
      ]
    }
  }
}
</script>
