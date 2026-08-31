<template>
  <div class="part-life-page">
    <!-- 顶部概览卡片 -->
    <el-row :gutter="12" class="overview-row">
      <el-col :span="6" v-for="(part, index) in parts" :key="index">
        <div class="part-card" :class="getPartStatus(part)">
          <div class="card-header">
            <div class="part-icon"><i :class="part.icon"></i></div>
            <div class="part-info">
              <div class="part-name">{{ part.name }}</div>
              <div class="part-code">{{ part.code }}</div>
            </div>
            <el-tag
              :type="getPartStatusTag(part)"
              size="small"
              effect="plain"
              >{{ getPartStatusText(part) }}</el-tag
            >
          </div>
          <div class="card-body">
            <div class="life-info">
              <div class="life-item">
                <span class="life-label">已使用</span>
                <span class="life-value"
                  >{{ part.used
                  }}<span class="life-unit">{{ part.unit }}</span></span
                >
              </div>
              <div class="life-item">
                <span class="life-label">额定寿命</span>
                <span class="life-value"
                  >{{ part.total
                  }}<span class="life-unit">{{ part.unit }}</span></span
                >
              </div>
              <div class="life-item">
                <span class="life-label">剩余</span>
                <span class="life-value" :class="getRemainingClass(part)"
                  >{{ part.total - part.used
                  }}<span class="life-unit">{{ part.unit }}</span></span
                >
              </div>
            </div>
            <div class="life-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: (part.used / part.total) * 100 + '%' }"
                  :class="getPartStatus(part)"
                ></div>
              </div>
              <div class="progress-text">
                {{ ((part.used / part.total) * 100).toFixed(1) }}%
              </div>
            </div>
            <div class="card-footer">
              <span class="install-date">安装日期：{{ part.installDate }}</span>
              <el-button
                v-permission="'device:part:operate'"
                type="text"
                size="small"
                @click="handleReplace(part)"
                >更换录入</el-button
              >
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 详细信息 + 更换记录 -->
    <el-row :gutter="12" class="detail-row">
      <!-- 部件详细列表 -->
      <el-col :span="14">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title"
              ><i class="el-icon-s-tools"></i> 部件详细信息</span
            >
            <el-button
              v-permission="'device:part:operate'"
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="handleAddReplace"
              >批量更换录入</el-button
            >
          </div>
          <div class="panel-body">
            <el-table
              :data="parts"
              border
              stripe
              :header-cell-style="{
                background: '#f5f7fa',
                color: '#606266',
                fontWeight: 'bold',
                textAlign: 'center',
              }"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="部件名称"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <i
                    :class="scope.row.icon"
                    style="margin-right: 6px; color: #409eff"
                  ></i>
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column
                prop="code"
                label="部件编码"
                width="140"
                align="center"
              />
              <el-table-column
                prop="spec"
                label="规格型号"
                width="120"
                align="center"
              />
              <el-table-column label="寿命进度" min-width="180">
                <template slot-scope="scope">
                  <div class="table-progress">
                    <div class="tp-bar">
                      <div
                        class="tp-fill"
                        :style="{
                          width: (scope.row.used / scope.row.total) * 100 + '%',
                        }"
                        :class="getPartStatus(scope.row)"
                      ></div>
                    </div>
                    <span class="tp-text"
                      >{{ scope.row.used }}/{{ scope.row.total }}
                      {{ scope.row.unit }}</span
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="剩余寿命" width="110" align="center">
                <template slot-scope="scope">
                  <span :class="getRemainingClass(scope.row)"
                    >{{ scope.row.total - scope.row.used }}
                    {{ scope.row.unit }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="状态" width="80" align="center">
                <template slot-scope="scope">
                  <el-tag :type="getPartStatusTag(scope.row)" size="mini">{{
                    getPartStatusText(scope.row)
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="installDate"
                label="安装日期"
                width="110"
                align="center"
              />
              <el-table-column
                label="操作"
                width="100"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="'device:part:operate'"
                    type="text"
                    size="small"
                    @click="handleReplace(scope.row)"
                    >更换</el-button
                  >
                  <el-button
                    v-permission="'device:part:operate'"
                    type="text"
                    size="small"
                    @click="handleHistory(scope.row)"
                    >记录</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>

      <!-- 更换记录 -->
      <el-col :span="10">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title"
              ><i class="el-icon-document"></i> 近期更换记录</span
            >
            <el-button
              v-permission="'device:part:viewAll'"
              type="text"
              size="small"
              @click="handleViewAll"
              >查看全部</el-button
            >
          </div>
          <div class="panel-body">
            <div class="timeline">
              <div
                class="timeline-item"
                v-for="(record, index) in recentRecords"
                :key="index"
              >
                <div class="timeline-dot" :class="record.status"></div>
                <div
                  class="timeline-line"
                  v-if="index < recentRecords.length - 1"
                ></div>
                <div class="timeline-content">
                  <div class="tl-header">
                    <span class="tl-part">{{ record.partName }}</span>
                    <el-tag
                      :type="record.status === 'success' ? 'success' : 'danger'"
                      size="mini"
                      >{{
                        record.status === "success" ? "成功" : "失败"
                      }}</el-tag
                    >
                  </div>
                  <div class="tl-detail">
                    <span>旧编码：{{ record.oldCode }}</span>
                    <span>新编码：{{ record.newCode }}</span>
                  </div>
                  <div class="tl-footer">
                    <span class="tl-operator"
                      >操作人：{{ record.operator }}</span
                    >
                    <span class="tl-time">{{ record.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 更换录入弹窗 -->
    <el-dialog
      title="部件更换录入"
      :visible.sync="replaceDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @closed="handleDialogClosed"
    >
      <el-form
        :model="replaceForm"
        :rules="replaceRules"
        ref="replaceForm"
        label-width="100px"
      >
        <el-form-item label="更换部件" prop="partName">
          <el-select
            v-model="replaceForm.partCode"
            placeholder="请选择部件"
            style="width: 100%"
            @change="handlePartChange"
          >
            <el-option
              v-for="part in parts"
              :key="part.code"
              :label="part.name + ' (' + part.code + ')'"
              :value="part.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前编码" v-if="replaceForm.partCode">
          <el-input :value="getCurrentPartCode()" disabled />
        </el-form-item>
        <el-form-item label="新物料编码" prop="newCode">
          <el-input
            v-model="replaceForm.newCode"
            placeholder="请输入新物料编码"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="verifyCode"
              :loading="verifying"
              >验证</el-button
            >
          </el-input>
        </el-form-item>
        <el-form-item label="验证结果" v-if="verifyResult">
          <div class="verify-result" :class="verifyResult.status">
            <i
              :class="
                verifyResult.status === 'success'
                  ? 'el-icon-success'
                  : 'el-icon-error'
              "
            ></i>
            <div class="verify-info">
              <div class="verify-name">{{ verifyResult.name }}</div>
              <div class="verify-spec">规格：{{ verifyResult.spec }}</div>
              <div class="verify-batch">批次：{{ verifyResult.batch }}</div>
              <div class="verify-life">额定寿命：{{ verifyResult.life }}</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="更换原因" prop="reason">
          <el-select
            v-model="replaceForm.reason"
            placeholder="请选择更换原因"
            style="width: 100%"
          >
            <el-option label="达到使用寿命" value="life" />
            <el-option label="损坏故障" value="damage" />
            <el-option label="定期维护" value="maintenance" />
            <el-option label="产品换型" value="changeover" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="replaceForm.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="replaceDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmReplace"
          :disabled="!verifyResult || verifyResult.status !== 'success'"
          >确认更换</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { Message } from "element-ui";
import store from "@/store";

/**
 * 部件寿命管理页面
 * 功能：部件寿命监控、更换录入（编码验证）、更换记录
 * 数据来源：部件列表从 Vuex device 模块获取，更换记录后续对接后端接口
 */

// ===== 响应式数据 =====
const replaceDialogVisible = ref(false);
const verifying = ref(false);
const verifyResult = ref(null);
const replaceFormRef = ref(null);

const replaceForm = reactive({
  partCode: "",
  partName: "",
  newCode: "",
  reason: "",
  remark: "",
});

const replaceRules = {
  partCode: [{ required: true, message: "请选择部件", trigger: "change" }],
  newCode: [{ required: true, message: "请输入新物料编码", trigger: "blur" }],
  reason: [{ required: true, message: "请选择更换原因", trigger: "change" }],
};

// 部件图标映射（页面特有，store 中不存 icon）
const partIcons = {
  灌装针组件: "el-icon-aim",
  灌装管组件: "el-icon-s-operation",
  加塞杆: "el-icon-top-right",
  真空组件: "el-icon-download",
};

// ===== 以下为模拟数据，后续对接后端接口 =====
const recentRecords = ref([
  {
    partName: "灌装针组件",
    oldCode: "FILL-NEEDLE-001",
    newCode: "FILL-NEEDLE-002",
    operator: "张三",
    time: "2026-07-15 09:30:00",
    status: "success",
  },
  {
    partName: "真空组件",
    oldCode: "VACUUM-UNIT-001",
    newCode: "VACUUM-UNIT-002",
    operator: "李四",
    time: "2026-07-01 14:20:00",
    status: "success",
  },
  {
    partName: "加塞杆",
    oldCode: "STOPPER-ROD-001",
    newCode: "INVALID-CODE",
    operator: "王五",
    time: "2026-06-20 10:15:00",
    status: "failed",
  },
  {
    partName: "灌装管组件",
    oldCode: "FILL-TUBE-001",
    newCode: "FILL-TUBE-002",
    operator: "张三",
    time: "2026-08-01 08:45:00",
    status: "success",
  },
]);

// ===== 计算属性 =====
// 从 store 获取部件列表，补充页面特有 icon 字段
const partsList = computed(() => store.getters.partsList);
const parts = computed(() =>
  partsList.value.map((part) => ({
    ...part,
    icon: partIcons[part.name] || "el-icon-cpu",
  }))
);

// ===== 方法 =====
function getPartStatus(part) {
  const percent = part.used / part.total;
  if (percent >= 1) return "expired";
  if (percent >= 0.8) return "warning";
  if (percent >= 0.6) return "notice";
  return "normal";
}

function getPartStatusTag(part) {
  const status = getPartStatus(part);
  const map = {
    normal: "success",
    notice: "info",
    warning: "warning",
    expired: "danger",
  };
  return map[status];
}

function getPartStatusText(part) {
  const status = getPartStatus(part);
  const map = {
    normal: "正常",
    notice: "注意",
    warning: "预警",
    expired: "到期",
  };
  return map[status];
}

function getRemainingClass(part) {
  const status = getPartStatus(part);
  if (status === "expired") return "text-danger";
  if (status === "warning") return "text-warning";
  return "";
}

function getCurrentPartCode() {
  const part = parts.value.find((p) => p.code === replaceForm.partCode);
  return part ? part.code : "";
}

function handlePartChange(code) {
  const part = parts.value.find((p) => p.code === code);
  if (part) {
    replaceForm.partName = part.name;
  }
  verifyResult.value = null;
}

function handleReplace(part) {
  Object.assign(replaceForm, {
    partCode: part.code,
    partName: part.name,
    newCode: "",
    reason: "",
    remark: "",
  });
  verifyResult.value = null;
  replaceDialogVisible.value = true;
}

function handleAddReplace() {
  Object.assign(replaceForm, {
    partCode: "",
    partName: "",
    newCode: "",
    reason: "",
    remark: "",
  });
  verifyResult.value = null;
  replaceDialogVisible.value = true;
}

function handleHistory(part) {
  Message.info(`查看 ${part.name} 的更换记录`);
}

function handleViewAll() {
  Message.info("查看全部更换记录");
}

function handleDialogClosed() {
  replaceFormRef.value && replaceFormRef.value.resetFields();
  verifyResult.value = null;
}

async function verifyCode() {
  if (!replaceForm.newCode) {
    Message.warning("请输入新物料编码");
    return;
  }
  verifying.value = true;
  // 模拟与服务器编码验证
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 模拟验证结果（以 VALID 开头的编码验证通过）
  if (
    replaceForm.newCode.startsWith("VALID") ||
    replaceForm.newCode.length >= 8
  ) {
    verifyResult.value = {
      status: "success",
      name: replaceForm.partName || "灌装针组件",
      spec: "2.0mL 标准型",
      batch: "BATCH20260824001",
      life: "10000次",
    };
    Message.success("物料编码验证通过");
  } else {
    verifyResult.value = {
      status: "failed",
      name: "未知物料",
      spec: "-",
      batch: "-",
      life: "-",
    };
    Message.error("物料编码验证失败，请检查编码是否正确");
  }
  verifying.value = false;
}

function confirmReplace() {
  replaceFormRef.value.validate((valid) => {
    if (valid) {
      if (!verifyResult.value || verifyResult.value.status !== "success") {
        Message.error("请先验证新物料编码");
        return;
      }
      Message.success("部件更换成功");
      replaceDialogVisible.value = false;
      // 模拟更新部件数据
      const part = parts.value.find((p) => p.code === replaceForm.partCode);
      if (part) {
        part.used = 0;
        part.installDate = new Date().toISOString().split("T")[0];
      }
    }
  });
}
</script>

<style scoped lang="less">
.part-life-page {
  padding: 12px;
  background: #fff;
  min-height: calc(100vh - 84px);
}

// 概览卡片
.overview-row {
  margin-bottom: 12px;
}
.part-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
  overflow: hidden;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  &.warning {
    border-left: 3px solid #e6a23c;
  }
  &.expired {
    border-left: 3px solid #f56c6c;
  }
  &.notice {
    border-left: 3px solid #409eff;
  }
  &.normal {
    border-left: 3px solid #67c23a;
  }

  .card-header {
    display: flex;
    align-items: center;
    padding: 12px 14px;
    border-bottom: 1px solid #f0f2f5;
    .part-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #ecf5ff;
      color: #409eff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-right: 10px;
    }
    .part-info {
      flex: 1;
      .part-name {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
      .part-code {
        font-size: 11px;
        color: #909399;
        margin-top: 2px;
      }
    }
  }
  .card-body {
    padding: 12px 14px;
    .life-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .life-item {
        text-align: center;
        .life-label {
          font-size: 10px;
          color: #909399;
          display: block;
          margin-bottom: 2px;
        }
        .life-value {
          font-size: 16px;
          font-weight: 700;
          color: #303133;
          font-family: "Courier New", monospace;
          .life-unit {
            font-size: 10px;
            color: #909399;
            font-weight: normal;
            margin-left: 2px;
          }
          &.text-danger {
            color: #f56c6c;
          }
          &.text-warning {
            color: #e6a23c;
          }
        }
      }
    }
    .life-progress {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .progress-bar {
        flex: 1;
        height: 8px;
        background: #fff;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 10px;
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s;
          &.normal {
            background: linear-gradient(90deg, #67c23a, #95d475);
          }
          &.notice {
            background: linear-gradient(90deg, #409eff, #66b1ff);
          }
          &.warning {
            background: linear-gradient(90deg, #e6a23c, #f0c78a);
          }
          &.expired {
            background: linear-gradient(90deg, #f56c6c, #f89898);
          }
        }
      }
      .progress-text {
        font-size: 12px;
        font-weight: 600;
        color: #303133;
        width: 45px;
        text-align: right;
      }
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px dashed #f0f2f5;
      .install-date {
        font-size: 11px;
        color: #909399;
      }
    }
  }
}

// 通用面板
.panel {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f2f5;
    .panel-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      i {
        margin-right: 6px;
        color: #409eff;
      }
    }
  }
  .panel-body {
    padding: 16px;
  }
}

.detail-row {
  margin-bottom: 0;
}

// 表格进度
.table-progress {
  .tp-bar {
    height: 6px;
    background: #fff;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 4px;
    .tp-fill {
      height: 100%;
      border-radius: 3px;
      &.normal {
        background: #67c23a;
      }
      &.notice {
        background: #409eff;
      }
      &.warning {
        background: #e6a23c;
      }
      &.expired {
        background: #f56c6c;
      }
    }
  }
  .tp-text {
    font-size: 11px;
    color: #606266;
  }
}

.text-danger {
  color: #f56c6c;
}
.text-warning {
  color: #e6a23c;
}

// 时间线
.timeline {
  position: relative;
  .timeline-item {
    position: relative;
    padding-left: 24px;
    padding-bottom: 16px;
    &:last-child {
      padding-bottom: 0;
    }
    .timeline-dot {
      position: absolute;
      left: 0;
      top: 4px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 0 0 2px #e4e7ed;
      &.success {
        background: #67c23a;
        box-shadow: 0 0 0 2px #c2e7b0;
      }
      &.failed {
        background: #f56c6c;
        box-shadow: 0 0 0 2px #fbc4c4;
      }
    }
    .timeline-line {
      position: absolute;
      left: 5px;
      top: 18px;
      bottom: -2px;
      width: 2px;
      background: #e4e7ed;
    }
    .timeline-content {
      .tl-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        .tl-part {
          font-size: 13px;
          font-weight: 600;
          color: #303133;
        }
      }
      .tl-detail {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 11px;
        color: #909399;
        margin-bottom: 4px;
      }
      .tl-footer {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #c0c4cc;
      }
    }
  }
}

// 验证结果
.verify-result {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 6px;
  &.success {
    background: #f0f9eb;
    border: 1px solid #c2e7b0;
  }
  &.failed {
    background: #fef0f0;
    border: 1px solid #fbc4c4;
  }
  i {
    font-size: 24px;
    margin-right: 12px;
    .success & {
      color: #67c23a;
    }
    .failed & {
      color: #f56c6c;
    }
  }
  .verify-info {
    .verify-name {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }
    div {
      font-size: 12px;
      color: #606266;
      margin-bottom: 2px;
    }
  }
}
</style>
