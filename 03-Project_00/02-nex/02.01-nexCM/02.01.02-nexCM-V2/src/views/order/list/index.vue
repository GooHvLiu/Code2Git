<!--
  order/list/index.vue - 订单列表
  功能：订单搜索、分页、状态筛选、启动/暂停/详情操作
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>订单列表</h2>
      <p>订单管理与跟踪</p>
    </div>
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="订单号">
          <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable>
            <el-option label="待分配" value="pending" />
            <el-option label="生产中" value="running" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-refresh">重置</el-button>
          <el-button type="success" icon="el-icon-plus" @click="$router.push('/order/create')">新建订单</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="tableData" border v-loading="loading">
        <el-table-column prop="orderNo" label="订单号" width="160" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="targetQuantity" label="目标数量" width="100" align="center" />
        <el-table-column prop="goodQuantity" label="良品" width="80" align="center" />
        <el-table-column prop="badQuantity" label="不良" width="80" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag size="small" :type="statusType[row.status]">{{ statusText[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="操作员" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="$router.push(`/order/detail/${row.id}`)">详情</el-button>
            <el-button type="text" size="small" v-if="row.status === 'pending'">启动</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background layout="total, prev, pager, next" :total="total" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OrderList',
  data() {
    return {
      loading: false,
      queryParams: { orderNo: '', status: '' },
      // Mock 数据，后续对接接口
      tableData: [
        { id: 1, orderNo: 'ORD20260806001', productName: '医疗配件A', targetQuantity: 100, goodQuantity: 85, badQuantity: 3, status: 'running', operatorName: '张三' },
        { id: 2, orderNo: 'ORD20260806002', productName: '医疗配件B', targetQuantity: 200, goodQuantity: 200, badQuantity: 5, status: 'completed', operatorName: '李四' },
        { id: 3, orderNo: 'ORD20260806003', productName: '医疗配件C', targetQuantity: 500, goodQuantity: 0, badQuantity: 0, status: 'pending', operatorName: '-' }
      ],
      total: 3,
      statusText: { pending: '待分配', running: '生产中', completed: '已完成', cancelled: '已取消' },
      statusType: { pending: 'warning', running: '', completed: 'success', cancelled: 'info' }
    }
  }
}
</script>
