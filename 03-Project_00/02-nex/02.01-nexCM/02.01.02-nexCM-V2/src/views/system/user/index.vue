<!--
  system/user/index.vue - 用户管理
  功能：用户CRUD、角色分配、重置密码、启用/禁用
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>用户管理</h2>
      <p>系统用户管理</p>
    </div>
    <div class="table-container">
      <el-table :data="tableData" border>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="role" label="角色" width="120" />
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag size="small" :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">重置密码</el-button>
            <el-button type="text" size="small" style="color:#F56C6C">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SystemUser',
  data() {
    return {
      tableData: [
        { id: 1, username: 'admin', realName: '管理员', phone: '13800138000', role: '管理员', status: 1 },
        { id: 2, username: 'zhangsan', realName: '张三', phone: '13800138001', role: '操作员', status: 1 }
      ]
    }
  }
}
</script>
