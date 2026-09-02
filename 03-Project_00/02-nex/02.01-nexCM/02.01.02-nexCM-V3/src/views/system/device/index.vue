<template>
  <div class="device-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ $t("menu.system.device.page.title") }}
        </h2>
        <p class="page-desc">{{ $t("menu.system.device.page.pageDesc") }}</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="fetchData"
          :loading="loading"
        >
          {{ $t("common.refresh") }}
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="8" :md="6">
        <div class="stat-card stat-online">
          <div class="stat-icon">
            <i class="el-icon-cpu"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ onlineCount }}</div>
            <div class="stat-label">
              {{ $t("menu.system.device.page.onlineDevices") }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6">
        <div class="stat-card stat-limit">
          <div class="stat-icon">
            <i class="el-icon-lock"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">
              {{
                maxDevices > 0
                  ? maxDevices
                  : $t("menu.system.device.page.unlimited")
              }}
            </div>
            <div class="stat-label">
              {{ $t("menu.system.device.page.maxDevices") }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6">
        <div class="stat-card stat-users">
          <div class="stat-icon">
            <i class="el-icon-user"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ onlineUsers }}</div>
            <div class="stat-label">
              {{ $t("menu.system.device.page.onlineUsers") }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6">
        <div
          class="stat-card stat-usage"
          :class="{ 'stat-warning': usagePercent >= 80 }"
        >
          <div class="stat-icon">
            <i class="el-icon-data-line"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ usagePercent }}%</div>
            <div class="stat-label">
              {{ $t("menu.system.device.page.usageRate") }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-input
        v-model="searchKeyword"
        :placeholder="$t('menu.system.device.page.searchPlaceholder')"
        prefix-icon="el-icon-search"
        clearable
        class="search-input"
        @keyup.enter.native="fetchData"
        @clear="handleClear"
      />
      <el-select
        v-model="filterStatus"
        :placeholder="$t('menu.system.device.page.filterStatus')"
        clearable
        class="filter-select"
        @change="fetchData"
      >
        <el-option
          :label="$t('menu.system.device.page.statusOnline')"
          value="online"
        />
        <el-option
          :label="$t('menu.system.device.page.statusOffline')"
          value="offline"
        />
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-refresh"
        :loading="refreshStatusLoading"
        @click="handleRefreshStatus"
      >
        {{ $t("menu.system.device.page.refreshStatus") }}
      </el-button>
    </div>

    <!-- 设备列表表格 -->
    <el-table
      v-loading="loading"
      :data="deviceList"
      border
      stripe
      :header-cell-style="{
        background: '#f5f7fa',
        color: '#606266',
        fontWeight: 'bold',
        textAlign: 'center',
      }"
      class="device-table"
    >
      <el-table-column
        type="index"
        :label="$t('common.index')"
        width="60"
        align="center"
      />

      <el-table-column
        :label="$t('menu.system.device.page.deviceInfo')"
        min-width="200"
      >
        <template slot-scope="scope">
          <div class="device-info-cell">
            <div class="device-avatar">
              <i class="el-icon-monitor"></i>
            </div>
            <div class="device-details">
              <div class="device-name">
                {{ formatDeviceName(scope.row.device_name) }}
              </div>
              <div class="device-id">{{ scope.row.device_id }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('menu.system.device.page.user')"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <div class="user-cell">
            <div class="user-info">
              <div class="username">{{ scope.row.username || "-" }}</div>
              <div class="user-role">{{ scope.row.role || "-" }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="ip"
        :label="$t('menu.system.device.page.ip')"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <span class="ip-text">{{ scope.row.ip || "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('menu.system.device.page.loginTime')"
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span class="time-text">{{ formatTime(scope.row.login_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('menu.system.device.page.lastActive')"
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span class="time-text">{{
            formatTime(scope.row.last_active_time)
          }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.status')" width="100" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'success' : 'info'"
            size="small"
            effect="light"
          >
            {{
              scope.row.status === 1
                ? $t("menu.system.device.page.statusOnline")
                : $t("menu.system.device.page.statusOffline")
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('common.operation')"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1 && !isCurrentDevice(scope.row)"
            type="danger"
            size="mini"
            icon="el-icon-switch-button"
            @click="handleKickDevice(scope.row)"
          >
            {{ $t("menu.system.device.kick") }}
          </el-button>
          <span
            v-else-if="isCurrentDevice(scope.row)"
            class="current-device-tag"
            >{{ $t("menu.system.device.page.currentDevice") }}</span
          >
          <!-- 离线设备：显示删除按钮 -->
          <el-button
            v-else-if="scope.row.status === 0"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            plain
            @click="handleDeleteDevice(scope.row)"
          >
            {{ $t("menu.system.device.page.delete") }}
          </el-button>
          <span v-else class="no-operation">-</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </div>

    <!-- 踢掉设备确认对话框 -->
    <el-dialog
      :title="$t('menu.system.device.page.kickConfirmTitle')"
      :visible.sync="kickDialogVisible"
      width="450px"
      :close-on-click-modal="false"
      class="kick-dialog"
    >
      <div class="kick-dialog-content">
        <div class="kick-warning-icon">
          <i class="el-icon-warning-outline"></i>
        </div>
        <div class="kick-warning-text">
          <p class="warning-title">
            {{ $t("menu.system.device.page.kickWarningTitle") }}
          </p>
          <p class="warning-desc">
            {{
              $t("menu.system.device.page.kickWarningDesc", {
                deviceName:
                  currentKickDevice?.device_name ||
                  $t("menu.system.device.page.unknownDevice"),
              })
            }}
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="kickDialogVisible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button
          type="danger"
          @click="confirmKickDevice"
          :loading="kickLoading"
        >
          {{ $t("menu.system.device.kick") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 删除设备确认对话框 -->
    <el-dialog
      :title="$t('menu.system.device.page.deleteConfirmTitle')"
      :visible.sync="deleteDialogVisible"
      width="420px"
      :close-on-click-modal="false"
      class="delete-dialog"
    >
      <div class="delete-dialog-content">
        <div class="delete-warning-icon">
          <i class="el-icon-warning-outline"></i>
        </div>
        <div class="delete-warning-text">
          <p class="warning-title">
            {{ $t("menu.system.device.page.deleteWarningTitle") }}
          </p>
          <p class="warning-desc">
            {{
              $t("menu.system.device.page.deleteWarningDesc", {
                deviceName:
                  formatDeviceName(currentDeleteDevice?.device_name) ||
                  $t("menu.system.device.page.unknownDevice"),
              })
            }}
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button
          type="danger"
          @click="confirmDeleteDevice"
          :loading="deleteLoading"
        >
          {{ $t("menu.system.device.page.delete") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Message } from "element-ui";
import request from "@/utils/request";
import i18n from "@/i18n";
import { parseUserAgent } from "@/utils/websocket";

// 响应式数据
const loading = ref(false);
const deviceList = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(20);
const onlineCount = ref(0);
const maxDevices = ref(0);
const searchKeyword = ref("");
const filterStatus = ref("");
const kickDialogVisible = ref(false);
const kickLoading = ref(false);
const currentKickDevice = ref(null);
const deleteDialogVisible = ref(false);
const deleteLoading = ref(false);
const currentDeleteDevice = ref(null);
const currentDeviceId = ref(localStorage.getItem("nex_device_id") || "");
const refreshStatusLoading = ref(false);

// 计算属性
const onlineUsers = computed(() => {
  const userIds = new Set(
    deviceList.value.filter((d) => d.status === 1).map((d) => d.user_id)
  );
  return userIds.size;
});

const usagePercent = computed(() => {
  if (maxDevices.value <= 0) return 0;
  return Math.min(
    100,
    Math.round((onlineCount.value / maxDevices.value) * 100)
  );
});

// 方法
function handleClear() {
  searchKeyword.value = "";
  fetchData();
}

async function handleRefreshStatus() {
  refreshStatusLoading.value = true;
  try {
    const res = await request({
      url: "/user/device/refresh-status",
      method: "post",
    });
    if (res.code === 200) {
      Message.success(i18n.t("menu.system.device.page.refreshStatusSuccess"));
      // 刷新后重新获取设备列表
      fetchData();
    } else {
      Message.error(
        res.message || i18n.t("menu.system.device.page.refreshStatusFailed")
      );
    }
  } catch (err) {
    Message.error(i18n.t("menu.system.device.page.refreshStatusFailed"));
  } finally {
    refreshStatusLoading.value = false;
  }
}
function formatDeviceName(deviceName) {
  if (!deviceName) return i18n.t("menu.system.device.page.unknownDevice");
  // 如果已经是简短格式（包含 ·），直接返回
  if (deviceName.includes("·")) return deviceName;
  // 否则用 parseUserAgent 解析
  return parseUserAgent(deviceName);
}

function isCurrentDevice(device) {
  return device.device_id === currentDeviceId.value;
}

async function fetchData() {
  loading.value = true;
  try {
    // 获取在线设备总数
    const countRes = await request({
      url: "/user/device/count",
      method: "get",
    });
    onlineCount.value = countRes.data?.count || 0;

    // 获取最大客户端数限制（从授权文件 license.lic 中读取，0表示不限制）
    try {
      const licenseRes = await request({
        url: "/license/status",
        method: "get",
      });
      maxDevices.value = Number(licenseRes.data?.maxDevices) || 0;
    } catch (licenseErr) {
      maxDevices.value = 0;
    }

    // 获取设备列表
    const listRes = await request({
      url: "/user/device",
      method: "get",
      params: {
        page: pageNum.value,
        pageSize: pageSize.value,
        keyword: searchKeyword.value,
        status: filterStatus.value,
      },
    });
    deviceList.value = listRes.data?.list || [];
    total.value = listRes.data?.total || 0;
  } catch (e) {
    Message.error(e.message || i18n.t("menu.system.device.page.fetchFailed"));
  } finally {
    loading.value = false;
  }
}

function formatTime(time) {
  if (!time) return "-";
  const date = new Date(time);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function handleKickDevice(device) {
  currentKickDevice.value = device;
  kickDialogVisible.value = true;
}

async function confirmKickDevice() {
  if (!currentKickDevice.value) return;
  kickLoading.value = true;
  try {
    await request({
      url: `/user/device/${currentKickDevice.value.id}/kick`,
      method: "post",
    });
    Message.success(i18n.t("menu.system.device.page.kickSuccess"));
    kickDialogVisible.value = false;
    fetchData();
  } catch (e) {
    Message.error(e.message || i18n.t("menu.system.device.page.kickFailed"));
  } finally {
    kickLoading.value = false;
  }
}

// 打开删除设备确认对话框
function handleDeleteDevice(device) {
  currentDeleteDevice.value = device;
  deleteDialogVisible.value = true;
}

// 确认删除设备
async function confirmDeleteDevice() {
  if (!currentDeleteDevice.value) return;
  deleteLoading.value = true;
  try {
    await request({
      url: `/user/device/${currentDeleteDevice.value.id}`,
      method: "delete",
    });
    Message.success(i18n.t("menu.system.device.page.deleteSuccess"));
    deleteDialogVisible.value = false;
    currentDeleteDevice.value = null;
    fetchData();
  } catch (err) {
    Message.error(
      err.message || i18n.t("menu.system.device.page.deleteFailed")
    );
  } finally {
    deleteLoading.value = false;
  }
}

// 生命周期
onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="less">
.device-management {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 84px);
}

// 页面标题
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .header-left {
    .page-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;

      .title-icon {
        margin-right: 10px;
        color: #409eff;
        font-size: 24px;
      }
    }

    .page-desc {
      margin: 8px 0 0;
      font-size: 13px;
      color: #909399;
    }
  }
}

// 统计卡片
.stats-row {
  margin-bottom: 20px;

  .stat-card {
    display: flex;
    align-items: center;
    padding: 18px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    margin-bottom: 20px;
    border: 1px solid #ebeef5;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-right: 14px;

      i {
        color: #fff;
      }
    }

    .stat-info {
      .stat-value {
        font-size: 22px;
        font-weight: 600;
        color: #303133;
        line-height: 1.4;
      }

      .stat-label {
        font-size: 13px;
        color: #909399;
        margin-top: 6px;
        line-height: 1.4;
      }
    }

    &.stat-online .stat-icon {
      background: linear-gradient(135deg, #67c23a, #85ce61);
    }

    &.stat-limit .stat-icon {
      background: linear-gradient(135deg, #e6a23c, #ebb563);
    }

    &.stat-users .stat-icon {
      background: linear-gradient(135deg, #409eff, #66b1ff);
    }

    &.stat-usage .stat-icon {
      background: linear-gradient(135deg, #f56c6c, #f78989);
    }

    // 使用率预警（超过80%）
    &.stat-warning {
      background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
      border: 1px solid #fbc4c4;
      box-shadow: 0 4px 16px rgba(245, 108, 108, 0.15);
      animation: warningPulse 2s ease-in-out infinite;

      .stat-icon {
        background: linear-gradient(135deg, #f56c6c, #e74c3c);
        box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
      }

      .stat-value {
        color: #e74c3c;
        font-weight: 700;
      }

      .stat-label {
        color: #f56c6c;
      }
    }
  }
}

@keyframes warningPulse {
  0%,
  100% {
    box-shadow: 0 4px 16px rgba(245, 108, 108, 0.15);
  }
  50% {
    box-shadow: 0 4px 24px rgba(245, 108, 108, 0.35);
  }
}

// 筛选区域
.filter-section {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .search-input {
    flex: 1;
    max-width: 300px;
  }

  .filter-select {
    width: 150px;
  }
}

// 设备表格
.device-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .device-info-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .device-avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
      font-size: 20px;
      color: #fff;
    }
  }

  .device-details {
    flex: 1;
    min-width: 0;
  }

  .device-name {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .device-id {
    font-size: 12px;
    color: #909399;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-info {
    flex: 1;
    min-width: 0;
  }

  .username {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 2px;
  }

  .user-role {
    font-size: 12px;
    color: #909399;
  }

  .ip-text {
    font-size: 13px;
    color: #606266;
    font-family: "Courier New", monospace;
  }

  .time-text {
    font-size: 13px;
    color: #606266;
  }

  .no-operation {
    color: #c0c4cc;
    font-size: 13px;
  }

  .current-device-tag {
    display: inline-block;
    padding: 4px 10px;
    background: #ecf5ff;
    color: #409eff;
    border-radius: 4px;
    font-size: 12px;
    border: 1px solid #d9ecff;
  }
}

// 分页
.pagination-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}

// 踢掉设备弹窗
.kick-dialog {
  .kick-warning {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: #fef0f0;
    border-radius: 8px;
    border: 1px solid #fde2e2;
    margin-bottom: 16px;

    i {
      font-size: 24px;
      color: #f56c6c;
      flex-shrink: 0;
    }

    .warning-content {
      flex: 1;

      .warning-title {
        font-size: 14px;
        font-weight: 600;
        color: #f56c6c;
        margin-bottom: 4px;
      }

      .warning-desc {
        font-size: 13px;
        color: #606266;
        line-height: 1.5;
      }
    }
  }

  .device-info-card {
    padding: 16px;
    background: #f5f7fa;
    border-radius: 8px;
    margin-bottom: 16px;

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 13px;
        color: #909399;
      }

      .info-value {
        font-size: 13px;
        color: #303133;
        font-weight: 500;
      }
    }
  }
}

// 删除设备弹窗
.delete-dialog {
  .delete-dialog-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 0;

    .delete-warning-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fef0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      i {
        font-size: 22px;
        color: #f56c6c;
      }
    }

    .delete-warning-text {
      flex: 1;
      padding-top: 4px;

      .warning-title {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 8px 0;
      }

      .warning-desc {
        font-size: 13px;
        color: #606266;
        line-height: 1.6;
        margin: 0;
      }
    }
  }
}
</style>
