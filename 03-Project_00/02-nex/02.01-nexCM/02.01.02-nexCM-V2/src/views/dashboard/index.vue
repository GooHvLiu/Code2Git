<!--
  dashboard/index.vue - 首页/仪表盘
  显示统计卡片、设备状态、当前订单
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>欢迎使用医疗设备上位机管理系统</h2>
      <p>生产执行 · 订单管理 · 设备监控 · 质量追溯</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in stats" :key="item.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" :style="{ background: item.color }">
            <i :class="item.icon"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 设备状态 + 当前订单 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>设备状态</span>
          </div>
          <div class="device-list">
            <div v-for="device in devices" :key="device.id" class="device-item">
              <span class="status-dot" :class="device.status"></span>
              <span class="device-name">{{ device.name }}</span>
              <el-tag size="mini" :type="device.status === 'running' ? 'success' : device.status === 'fault' ? 'danger' : 'info'">
                {{ statusText[device.status] }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>当前生产订单</span>
          </div>
          <el-table :data="activeOrders" size="small">
            <el-table-column prop="orderNo" label="订单号" width="140" />
            <el-table-column prop="productName" label="产品" />
            <el-table-column label="进度" width="120">
              <template slot-scope="{ row }">
                <el-progress :percentage="Math.round(row.good / row.target * 100)" :stroke-width="10" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      // 统计数据（后续对接接口）
      stats: [
        { label: '今日产量', value: '1,234', icon: 'el-icon-goods', color: '#409EFF' },
        { label: '良品率', value: '98.5%', icon: 'el-icon-circle-check', color: '#67C23A' },
        { label: '运行设备', value: '3 / 5', icon: 'el-icon-cpu', color: '#E6A23C' },
        { label: '活跃订单', value: '5', icon: 'el-icon-document', color: '#F56C6C' }
      ],
      statusText: {
        running: '运行中',
        idle: '空闲',
        fault: '故障',
        offline: '离线'
      },
      devices: [
        { id: 1, name: '1号机 - 装配工位', status: 'running' },
        { id: 2, name: '2号机 - 检测工位', status: 'running' },
        { id: 3, name: '3号机 - 包装工位', status: 'idle' },
        { id: 4, name: '4号机 - 备用', status: 'offline' },
        { id: 5, name: '5号机 - 测试', status: 'fault' }
      ],
      activeOrders: [
        { orderNo: 'ORD20260806001', productName: '医疗配件A', good: 85, target: 100 },
        { orderNo: 'ORD20260806002', productName: '医疗配件B', good: 62, target: 200 },
        { orderNo: 'ORD20260806003', productName: '医疗配件C', good: 45, target: 500 }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.stat-card {
  .el-card__body {
    display: flex;
    align-items: center;
    padding: 20px;
  }
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;

  i {
    font-size: 28px;
    color: #fff;
  }
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.device-list {
  .device-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;

  &.running { background: #67C23A; }
  &.idle { background: #E6A23C; }
  &.fault { background: #F56C6C; }
  &.offline { background: #909399; }
}

.device-name {
  flex: 1;
  font-size: 14px;
}
</style>
