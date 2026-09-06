<template>
  <div class="part-life-page">
    <!-- Tab切换 -->
    <el-tabs v-model="activeTab" class="part-life-tabs">
      <!-- 寿命详情Tab -->
      <el-tab-pane :label="$t('menu.device.part.tab.life')" name="life">
    <!-- 顶部操作栏 -->
    <div class="page-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          :placeholder="$t('menu.device.part.page.searchPlaceholder')"
          clearable
          style="width: 280px"
          @clear="loadPartList"
          @keyup.enter.native="loadPartList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            v-permission="'device:part:search'"
            @click="loadPartList"
          ></el-button>
        </el-input>
      </div>
      <div class="toolbar-right">
        <el-button
          v-permission="'device:part:add'"
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          >{{ $t("menu.device.part.add") }}</el-button
        >
        <el-button icon="el-icon-refresh" v-permission="'device:part:refresh'"
          @click="loadPartList">{{
          $t("menu.device.part.refresh")
        }}</el-button>
      </div>
    </div>

    <!-- 顶部概览卡片 -->
    <el-row :gutter="12" class="overview-row">
      <el-col
        :span="6"
        v-for="(part, index) in filteredParts"
        :key="part.id || index"
      >
        <div class="part-card" :class="getPartStatus(part)">
          <div class="card-header">
            <div class="part-icon"><i :class="part.icon"></i></div>
            <div class="part-info">
              <div class="part-name">{{ getPartDisplayName(part) }}</div>
              <div class="part-code">{{ part.part_code || part.code }}</div>
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
                <span class="life-label">{{
                  $t("menu.device.part.page.form.usedLife")
                }}</span>
                <span class="life-value"
                  >{{ part.used_life || part.used
                  }}<span class="life-unit">{{
                    $t("menu.device.part.page.unit.times")
                  }}</span></span
                >
              </div>
              <div class="life-item">
                <span class="life-label">{{
                  $t("menu.device.part.page.form.ratedLife")
                }}</span>
                <span class="life-value"
                  >{{ part.rated_life || part.total
                  }}<span class="life-unit">{{
                    $t("menu.device.part.page.unit.times")
                  }}</span></span
                >
              </div>
              <div class="life-item">
                <span class="life-label">{{
                  $t("menu.device.part.page.message.remaining")
                }}</span>
                <span class="life-value" :class="getRemainingClass(part)"
                  >{{ getRemaining(part)
                  }}<span class="life-unit">{{
                    $t("menu.device.part.page.unit.times")
                  }}</span></span
                >
              </div>
            </div>
            <div class="life-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: getLifePercent(part) + '%' }"
                  :class="getPartStatus(part)"
                ></div>
              </div>
              <div class="progress-text">
                {{ getLifePercent(part).toFixed(1) }}%
              </div>
            </div>
            <div class="card-footer">
              <span class="install-date"
                >{{ $t("menu.device.part.page.form.installDate") }}：{{
                  part.install_date || part.installDate
                    ? formatDate(
                        part.install_date || part.installDate,
                        getGlobalDateFormat()
                      )
                    : "-"
                }}</span
              >
              <div class="card-actions">
                <el-button
                  v-permission="'device:part:edit'"
                  type="text"
                  size="small"
                  @click="handleEdit(part)"
                  >{{ $t("menu.device.part.edit") }}</el-button
                >
                <el-button
                  v-permission="'device:part:operate'"
                  type="text"
                  size="small"
                  @click="handleReplace(part)"
                  >{{ $t("menu.device.part.operate") }}</el-button
                >
                <el-button
                  v-permission="'device:part:delete'"
                  type="text"
                  size="small"
                  class="delete-btn"
                  @click="handleDelete(part)"
                  >{{ $t("menu.device.part.delete") }}</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 空数据提示 -->
    <div v-if="filteredParts.length === 0 && !loading" class="empty-tip">
      <i class="el-icon-box"></i>
      <p>{{ $t("menu.device.part.page.message.noData") }}</p>
    </div>

    <!-- 详细信息 + 更换记录 -->
    <el-row :gutter="12" class="detail-row" v-if="filteredParts.length > 0">
      <!-- 部件详细列表 -->
      <el-col :span="14">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title"
              ><i class="el-icon-s-tools"></i>
              {{ $t("menu.device.part.page.title") }}</span
            >
          </div>
          <div class="panel-body">
            <el-table
              :data="filteredParts"
              border
              stripe
              v-loading="loading"
              :header-cell-style="{
                background: '#f5f7fa',
                color: '#606266',
                fontWeight: 'bold',
                textAlign: 'center',
              }"
              style="width: 100%"
            >
              <el-table-column
                :label="$t('menu.device.part.page.form.partName')"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <i
                    :class="scope.row.icon"
                    style="margin-right: 6px; color: #409eff"
                  ></i>
                  {{ getPartDisplayName(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('menu.device.part.page.form.partCode')"
                width="140"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.part_code || scope.row.code }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('menu.device.part.page.form.specModel')"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.spec_model || scope.row.spec || "-" }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('menu.device.part.page.table.lifeProgress')"
                min-width="180"
              >
                <template slot-scope="scope">
                  <div class="table-progress">
                    <div class="tp-bar">
                      <div
                        class="tp-fill"
                        :style="{
                          width: getLifePercent(scope.row) + '%',
                        }"
                        :class="getPartStatus(scope.row)"
                      ></div>
                    </div>
                    <span class="tp-text"
                      >{{ scope.row.used_life || scope.row.used }}/{{
                        scope.row.rated_life || scope.row.total
                      }}
                      {{ $t("menu.device.part.page.unit.times") }}</span
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('menu.device.part.page.table.remainingLife')"
                width="110"
                align="center"
              >
                <template slot-scope="scope">
                  <span :class="getRemainingClass(scope.row)"
                    >{{ getRemaining(scope.row) }}
                    {{ $t("menu.device.part.page.unit.times") }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('menu.device.part.page.table.status')"
                width="80"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag :type="getPartStatusTag(scope.row)" size="mini">{{
                    getPartStatusText(scope.row)
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('menu.device.part.page.form.installDate')"
                width="110"
                align="center"
              >
                <template slot-scope="scope">
                  {{
                    scope.row.install_date || scope.row.installDate
                      ? formatDate(
                          scope.row.install_date || scope.row.installDate,
                          getGlobalDateFormat()
                        )
                      : "-"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('menu.device.part.page.table.operation')"
                width="150"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="'device:part:edit'"
                    type="text"
                    size="small"
                    @click="handleEdit(scope.row)"
                    >{{ $t("menu.device.part.edit") }}</el-button
                  >
                  <el-button
                    v-permission="'device:part:operate'"
                    type="text"
                    size="small"
                    @click="handleReplace(scope.row)"
                    >{{ $t("menu.device.part.operate") }}</el-button
                  >
                  <el-button
                    v-permission="'device:part:delete'"
                    type="text"
                    size="small"
                    class="delete-btn"
                    @click="handleDelete(scope.row)"
                    >{{ $t("menu.device.part.delete") }}</el-button
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
              ><i class="el-icon-document"></i>
              {{
                $t("menu.device.part.page.message.recentReplaceRecords")
              }}</span
            >
          </div>
          <div class="panel-body">
            <div class="timeline">
              <div
                class="timeline-item"
                v-for="(record, index) in recentRecords"
                :key="record.id || index"
              >
                <div class="timeline-dot" :class="record.status"></div>
                <div
                  class="timeline-line"
                  v-if="index < recentRecords.length - 1"
                ></div>
                <div class="timeline-content">
                  <div class="tl-header">
                    <span class="tl-part">{{
                      record.part_name || record.partName
                    }}</span>
                    <el-tag
                      :type="record.status === 'success' ? 'success' : 'danger'"
                      size="mini"
                      >{{
                        record.status === "success"
                          ? $t("menu.device.part.page.message.statusSuccess")
                          : $t("menu.device.part.page.message.statusFailed")
                      }}</el-tag
                    >
                  </div>
                  <div class="tl-detail">
                    <span
                      >{{ $t("menu.device.part.page.message.oldCode") }}：{{
                        record.old_code || record.oldCode
                      }}</span
                    >
                    <span
                      >{{ $t("menu.device.part.page.message.newCode") }}：{{
                        record.new_code || record.newCode
                      }}</span
                    >
                  </div>
                  <div class="tl-footer">
                    <span class="tl-operator"
                      >{{ $t("menu.device.part.page.message.operator") }}：{{
                        record.operator_name || record.operator
                      }}</span
                    >
                    <span class="tl-time">{{
                      record.replace_time || record.time
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="recentRecords.length === 0" class="empty-tip-small">
              暂无更换记录
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 添加/编辑部件弹窗 -->
    <el-dialog
      :title="
        isEdit
          ? $t('menu.device.part.page.editBtn')
          : $t('menu.device.part.page.addBtn')
      "
      :visible.sync="partDialogVisible"
      width="560px"
      :close-on-click-modal="false"
      @closed="handlePartDialogClosed"
    >
      <el-form
        :model="partForm"
        :rules="partRules"
        ref="partFormRef"
        label-width="110px"
        class="part-dialog-form"
      >
        <el-form-item
          :label="$t('menu.device.part.page.form.template')"
          prop="template_id"
        >
          <el-select
            v-model="partForm.template_id"
            :placeholder="
              $t('menu.device.part.page.placeholder.selectTemplate')
            "
            style="width: 100%"
            :disabled="isEdit"
            @change="handleTemplateChange"
          >
            <el-option
              v-for="template in templates"
              :key="template.id"
              :label="getTemplateName(template)"
              :value="template.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('menu.device.part.page.form.partName')"
          prop="part_name"
        >
          <el-input
            v-model="partForm.part_name"
            :placeholder="$t('menu.device.part.page.placeholder.partName')"
            disabled
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.device.part.page.form.partCode')"
          prop="part_code"
        >
          <el-input
            v-model="partForm.part_code"
            :placeholder="$t('menu.device.part.page.placeholder.partCode')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.device.part.page.form.specModel')"
          prop="spec_model"
        >
          <el-input
            v-model="partForm.spec_model"
            :placeholder="$t('menu.device.part.page.placeholder.specModel')"
            disabled
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.device.part.page.form.ratedLife')"
          prop="rated_life"
        >
          <div class="rated-life-input">
            <el-input-number
              v-model="partForm.rated_life"
              :min="1"
              :max="9999999"
              :step="1000"
              controls-position="right"
              style="width: 100%"
              disabled
            />
            <span class="rated-life-unit">{{
              $t("menu.device.part.page.unit.times")
            }}</span>
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('menu.device.part.page.form.installDate')"
          prop="install_date"
        >
          <el-date-picker
            v-model="partForm.install_date"
            type="date"
            :placeholder="$t('menu.device.part.page.placeholder.installDate')"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('menu.device.part.page.form.remark')">
          <el-input
            v-model="partForm.remark"
            type="textarea"
            :rows="2"
            :placeholder="$t('menu.device.part.page.placeholder.remark')"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="partDialogVisible = false">{{
          $t("menu.device.part.page.message.cancelBtn")
        }}</el-button>
        <el-button
          type="primary"
          :loading="partDialogLoading"
          @click="confirmPart"
          >{{ $t("menu.device.part.page.message.confirmBtn") }}</el-button
        >
      </div>
    </el-dialog>

    <!-- 更换录入弹窗 -->
    <el-dialog
      :title="$t('menu.device.part.page.message.replaceDialogTitle')"
      :visible.sync="replaceDialogVisible"
      width="560px"
      :close-on-click-modal="false"
      @closed="handleDialogClosed"
    >
      <el-form
        :model="replaceForm"
        :rules="replaceRules"
        ref="replaceFormRef"
        label-width="110px"
        class="part-dialog-form"
      >
        <el-form-item
          :label="$t('menu.device.part.page.form.replacePart')"
          prop="partCode"
        >
          <el-input
            :value="replaceForm.partName"
            disabled
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.device.part.page.form.currentCode')"
          v-if="currentReplacePart"
        >
          <el-input
            :value="replaceForm.partCode"
            disabled
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.device.part.page.form.newCode')"
          prop="newCode"
        >
          <el-input
            v-model="replaceForm.newCode"
            :placeholder="$t('menu.device.part.page.placeholder.newCode')"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.device.part.page.form.replaceReason')"
          prop="reason"
        >
          <el-select
            v-model="replaceForm.reason"
            :placeholder="$t('menu.device.part.page.placeholder.replaceReason')"
            style="width: 100%"
          >
            <el-option
              :label="$t('menu.device.part.page.replaceReason.life')"
              value="life"
            />
            <el-option
              :label="$t('menu.device.part.page.replaceReason.damage')"
              value="damage"
            />
            <el-option
              :label="$t('menu.device.part.page.replaceReason.maintenance')"
              value="maintenance"
            />
            <el-option
              :label="$t('menu.device.part.page.replaceReason.changeover')"
              value="changeover"
            />
            <el-option
              :label="$t('menu.device.part.page.replaceReason.other')"
              value="other"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('menu.device.part.page.form.remark')">
          <el-input
            v-model="replaceForm.remark"
            type="textarea"
            :rows="2"
            :placeholder="$t('menu.device.part.page.placeholder.remark')"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="replaceDialogVisible = false">{{
          $t("menu.device.part.page.message.cancelBtn")
        }}</el-button>
        <el-button
          type="primary"
          :loading="replaceLoading"
          @click="confirmReplace"
          >{{ $t("menu.device.part.page.form.confirmReplace") }}</el-button
        >
      </div>
    </el-dialog>
      </el-tab-pane>

      <!-- 模板管理Tab -->
      <el-tab-pane :label="$t('menu.device.part.tab.template')" name="template">
        <PartTemplateManager ref="templateManagerRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from "vue";
import { Message, MessageBox } from "element-ui";
import {
  getPartList,
  getPartTemplates,
  addPart,
  updatePart,
  deletePart,
  replacePart,
  getReplaceRecords,
} from "@/api/devicePart";
import { formatDate, getGlobalDateFormat } from "@/utils/date";
import PartTemplateManager from "./components/PartTemplateManager.vue";

// 获取当前实例，用于访问 $t 和 $store
const { proxy } = getCurrentInstance();
const $t = proxy.$t.bind(proxy);

/**
 * 部件寿命管理页面
 * 功能：部件寿命监控、增删改、更换录入、更换记录
 * 数据来源：后端接口
 */

// ===== 响应式数据 =====
const loading = ref(false);
const searchKeyword = ref("");
const parts = ref([]);
const templates = ref([]);
const recentRecords = ref([]);

// Tab切换
const activeTab = ref("life");
const templateManagerRef = ref(null);

// 添加/编辑部件弹窗
const partDialogVisible = ref(false);
const partDialogLoading = ref(false);
const isEdit = ref(false);
const currentEditPart = ref(null);
const partFormRef = ref(null);

const partForm = reactive({
  template_id: null,
  part_name: "",
  part_code: "",
  spec_model: "",
  rated_life: 10000,
  install_date: "",
  remark: "",
});

const partRules = {
  template_id: [
    {
      required: true,
      message: $t("menu.device.part.page.placeholder.selectTemplate"),
      trigger: "change",
    },
  ],
  part_code: [
    {
      required: true,
      message: $t("menu.device.part.page.placeholder.partCode"),
      trigger: "blur",
    },
  ],
  rated_life: [
    {
      required: true,
      message: $t("menu.device.part.page.placeholder.ratedLife"),
      trigger: "blur",
    },
  ],
};

// 更换录入弹窗
const replaceDialogVisible = ref(false);
const replaceLoading = ref(false);
const currentReplacePart = ref(null);
const replaceFormRef = ref(null);

const replaceForm = reactive({
  partCode: "",
  partName: "",
  newCode: "",
  reason: "",
  remark: "",
});

const replaceRules = {
  newCode: [
    {
      required: true,
      message: $t("menu.device.part.page.placeholder.newCode"),
      trigger: "blur",
    },
  ],
  reason: [
    {
      required: true,
      message: $t("menu.device.part.page.placeholder.replaceReason"),
      trigger: "change",
    },
  ],
};

// 部件图标映射
const partIcons = {
  fill_needle: "el-icon-aim",
  fill_tube: "el-icon-s-operation",
  stopper_rod: "el-icon-top-right",
  vacuum_unit: "el-icon-download",
};

// ===== 计算属性 =====
const filteredParts = computed(() => {
  if (!searchKeyword.value) return parts.value;
  const keyword = searchKeyword.value.toLowerCase();
  return parts.value.filter(
    (part) =>
      (part.part_name || part.name || "").toLowerCase().includes(keyword) ||
      (part.part_code || part.code || "").toLowerCase().includes(keyword)
  );
});

// ===== 方法 =====
function getTemplateName(template) {
  // 支持多种字段名：name_key（后端）、template_name、name
  const nameKey =
    template.name_key || template.template_name || template.name || "";
  // 如果是国际化 key（如 menu.device.part.page.template.fill_needle），用 $t 解析
  if (nameKey && nameKey.startsWith("menu.")) {
    return $t(nameKey);
  }
  return nameKey;
}

/**
 * 获取部件显示名称
 * 优先级：part_name > 模板名称 > 部件编码
 */
function getPartDisplayName(part) {
  // 1. 如果部件本身有名称，直接使用
  if (part.part_name || part.name) {
    return part.part_name || part.name;
  }
  // 2. 否则根据 template_key 或 template_id 从模板列表中查找模板名称
  const template = templates.value.find(
    (t) => t.template_key === part.template_key || t.id === part.template_id
  );
  if (template) {
    return getTemplateName(template);
  }
  // 3. 兜底：返回部件编码
  return part.part_code || part.code || "";
}

function getPartStatus(part) {
  const used = Number(part.used_life || part.used || 0);
  const total = Number(part.rated_life || part.total || 1);
  const percent = used / total;
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
  return map[status] || "info";
}

function getPartStatusText(part) {
  const status = getPartStatus(part);
  const map = {
    normal: $t("menu.device.part.page.status.normal"),
    notice: $t("menu.device.part.page.status.warning"),
    warning: $t("menu.device.part.page.status.critical"),
    expired: $t("menu.device.part.page.status.expired"),
  };
  return map[status] || $t("menu.device.part.page.status.normal");
}

function getLifePercent(part) {
  const used = Number(part.used_life || part.used || 0);
  const total = Number(part.rated_life || part.total || 1);
  return Math.min((used / total) * 100, 100);
}

function getRemaining(part) {
  const used = Number(part.used_life || part.used || 0);
  const total = Number(part.rated_life || part.total || 0);
  return Math.max(total - used, 0);
}

function getRemainingClass(part) {
  const remaining = getRemaining(part);
  const total = Number(part.rated_life || part.total || 1);
  const percent = remaining / total;
  if (percent <= 0) return "text-danger";
  if (percent <= 0.2) return "text-warning";
  return "text-success";
}

// ===== 数据加载 =====
async function loadPartList() {
  loading.value = true;
  try {
    const res = await getPartList();
    if (res.code === 200) {
      const list = res.data || [];
      // 补充 icon 字段
      parts.value = list.map((part) => ({
        ...part,
        icon:
          partIcons[part.template_key] ||
          partIcons[part.template_id] ||
          "el-icon-cpu",
      }));
    } else {
      Message.error(
        res.message || $t("menu.device.part.page.message.loadFailed")
      );
    }
  } catch (err) {
    Message.error($t("menu.device.part.page.message.loadFailed"));
  } finally {
    loading.value = false;
  }
}

async function loadTemplates() {
  try {
    const res = await getPartTemplates();
    if (res.code === 200) {
      templates.value = res.data || [];
    }
  } catch (err) {
    // 静默失败，不影响页面显示
  }
}

async function loadReplaceRecords() {
  try {
    const res = await getReplaceRecords({ page: 1, pageSize: 10 });
    if (res.code === 200) {
      recentRecords.value = res.data?.list || res.data || [];
    }
  } catch (err) {
    // 静默失败，不影响页面显示
  }
}

// ===== 添加/编辑部件 =====
function handleAdd() {
  isEdit.value = false;
  currentEditPart.value = null;
  Object.assign(partForm, {
    template_id: null,
    part_name: "",
    part_code: "",
    spec_model: "",
    rated_life: 10000,
    install_date: "",
    remark: "",
  });
  partDialogVisible.value = true;
}

function handleEdit(part) {
  isEdit.value = true;
  currentEditPart.value = part;
  Object.assign(partForm, {
    template_id: part.template_id,
    part_name: part.part_name || part.name,
    part_code: part.part_code || part.code,
    spec_model: part.spec_model || part.spec || "",
    rated_life: Number(part.rated_life || part.total || 10000),
    install_date: part.install_date || part.installDate || "",
    remark: part.remark || "",
  });
  partDialogVisible.value = true;
}

function handleTemplateChange(templateId) {
  const template = templates.value.find((t) => t.id === templateId);
  if (template) {
    // 支持多种字段名：name_key（后端）、template_name、name
    const nameKey =
      template.name_key || template.template_name || template.name || "";
    partForm.part_name = nameKey.startsWith("menu.") ? $t(nameKey) : nameKey;
    // 支持多种字段名：default_rated_life（后端）、default_life、rated_life
    partForm.rated_life = Number(
      template.default_rated_life ||
        template.default_life ||
        template.rated_life ||
        10000
    );
    // 规格型号从模板中带出，不允许用户修改
    partForm.spec_model = template.default_spec || template.spec || "";
  }
}

function handlePartDialogClosed() {
  if (partFormRef.value) {
    partFormRef.value.clearValidate();
  }
}

async function confirmPart() {
  if (!partFormRef.value) return;
  try {
    await partFormRef.value.validate();
  } catch (err) {
    return;
  }

  partDialogLoading.value = true;
  try {
    const data = {
      template_id: partForm.template_id,
      part_name: partForm.part_name,
      part_code: partForm.part_code,
      spec_model: partForm.spec_model,
      rated_life: partForm.rated_life,
      install_date: partForm.install_date,
      remark: partForm.remark,
    };

    if (isEdit.value && currentEditPart.value) {
      const res = await updatePart(currentEditPart.value.id, data);
      if (res.code === 200) {
        Message.success($t("menu.device.part.page.message.updateSuccess"));
        partDialogVisible.value = false;
        loadPartList();
      } else {
        Message.error(
          res.msg || $t("menu.device.part.page.message.updateFailed")
        );
      }
    } else {
      const res = await addPart(data);
      if (res.code === 200) {
        Message.success($t("menu.device.part.page.message.addSuccess"));
        partDialogVisible.value = false;
        loadPartList();
      } else {
        Message.error(
          res.msg || $t("menu.device.part.page.message.addFailed")
        );
      }
    }
  } catch (err) {
    Message.error($t("menu.device.part.page.message.saveFailed"));
  } finally {
    partDialogLoading.value = false;
  }
}

// ===== 删除部件 =====
function handleDelete(part) {
  MessageBox.confirm(
    $t("menu.device.part.page.message.deleteConfirm"),
    $t("menu.device.part.page.message.deleteConfirmTitle"),
    {
      confirmButtonText: $t("menu.device.part.page.message.confirmBtn"),
      cancelButtonText: $t("menu.device.part.page.message.cancelBtn"),
      type: "warning",
    }
  )
    .then(async () => {
      try {
        const res = await deletePart(part.id);
        if (res.code === 200) {
          Message.success($t("menu.device.part.page.message.deleteSuccess"));
          loadPartList();
        } else {
          Message.error(
            res.msg || $t("menu.device.part.page.message.deleteFailed")
          );
        }
      } catch (err) {
        Message.error($t("menu.device.part.page.message.deleteFailedCatch"));
      }
    })
    .catch(() => {});
}

// ===== 更换录入 =====
function handleReplace(part) {
  currentReplacePart.value = part;
  Object.assign(replaceForm, {
    partCode: part.part_code || part.code,
    partName: getPartDisplayName(part),
    newCode: "",
    reason: "",
    remark: "",
  });
  replaceDialogVisible.value = true;
}

function handleDialogClosed() {
  if (replaceFormRef.value) {
    replaceFormRef.value.clearValidate();
  }
}

async function confirmReplace() {
  if (!replaceFormRef.value) return;
  try {
    await replaceFormRef.value.validate();
  } catch (err) {
    return;
  }

  if (!currentReplacePart.value) return;

  replaceLoading.value = true;
  try {
    const data = {
      new_code: replaceForm.newCode,
      replace_reason: replaceForm.reason,
      remark: replaceForm.remark,
    };

    const res = await replacePart(currentReplacePart.value.id, data);
    if (res.code === 200) {
      Message.success($t("menu.device.part.page.message.replaceSuccess"));
      replaceDialogVisible.value = false;
      loadPartList();
      loadReplaceRecords();
    } else {
      Message.error(
        res.msg || $t("menu.device.part.page.message.replaceFailed")
      );
    }
  } catch (err) {
    Message.error($t("menu.device.part.page.message.replaceFailed"));
  } finally {
    replaceLoading.value = false;
  }
}

// ===== 生命周期 =====
onMounted(() => {
  loadTemplates();
  loadPartList();
  loadReplaceRecords();
});
</script>

<style scoped>
.part-life-page {
  padding: 16px;
}

/* 弹窗表单样式优化 - 统一输入框宽度，左右边距协调 */
.part-dialog-form {
  margin-left: 20px;
}

.part-dialog-form .el-form-item__content .el-input,
.part-dialog-form .el-form-item__content .el-select,
.part-dialog-form .el-form-item__content .el-date-editor {
  width: 280px !important;
}

/* 额定寿命输入框 - 输入框和单位在同一行 */
.rated-life-input {
  display: flex;
  align-items: center;
  width: 280px !important;
  gap: 10px;
}

.el-textarea {
  width: 280px !important;
}

.rated-life-input .el-input-number {
  flex: 1;
  min-width: 0;
}

.rated-life-unit {
  color: #909399;
  font-size: 14px;
  white-space: nowrap;
  /* 单位占据右边的间距位置 */
  margin-right: -40px;
  width: 32px;
  text-align: left;
}

.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}

.overview-row {
  margin-bottom: 16px;
}

.part-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #67c23a;
  transition: all 0.3s;
}

.part-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.part-card.normal {
  border-left-color: #67c23a;
}

.part-card.notice {
  border-left-color: #909399;
}

.part-card.warning {
  border-left-color: #e6a23c;
}

.part-card.expired {
  border-left-color: #f56c6c;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.part-icon {
  width: 40px;
  height: 40px;
  background: #ecf5ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #409eff;
  margin-right: 12px;
}

.part-info {
  flex: 1;
}

.part-name {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 2px;
}

.part-code {
  font-size: 12px;
  color: #909399;
}

.life-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.life-item {
  text-align: center;
}

.life-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.life-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.life-unit {
  font-size: 12px;
  color: #909399;
  margin-left: 2px;
  font-weight: normal;
}

.text-success {
  color: #67c23a;
}

.text-warning {
  color: #e6a23c;
}

.text-danger {
  color: #f56c6c;
}

.life-progress {
  margin-bottom: 12px;
}

.progress-bar {
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-fill.normal {
  background: linear-gradient(90deg, #67c23a, #85ce61);
}

.progress-fill.notice {
  background: linear-gradient(90deg, #909399, #a6a9ad);
}

.progress-fill.warning {
  background: linear-gradient(90deg, #e6a23c, #ebb563);
}

.progress-fill.expired {
  background: linear-gradient(90deg, #f56c6c, #f78989);
}

.progress-text {
  text-align: right;
  font-size: 12px;
  color: #909399;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f0f2f5;
}

.install-date {
  font-size: 12px;
  color: #909399;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.delete-btn {
  color: #f56c6c !important;
}

.detail-row {
  margin-top: 16px;
}

.panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.panel-body {
  padding: 16px;
}

.table-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tp-bar {
  flex: 1;
  height: 6px;
  background: #f0f2f5;
  border-radius: 3px;
  overflow: hidden;
}

.tp-fill {
  height: 100%;
  border-radius: 3px;
}

.tp-fill.normal {
  background: #67c23a;
}

.tp-fill.notice {
  background: #909399;
}

.tp-fill.warning {
  background: #e6a23c;
}

.tp-fill.expired {
  background: #f56c6c;
}

.tp-text {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}

.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline-item {
  position: relative;
  padding-bottom: 20px;
}

.timeline-dot {
  position: absolute;
  left: -20px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #67c23a;
}

.timeline-dot.success {
  background: #67c23a;
}

.timeline-dot.failed,
.timeline-dot.fail {
  background: #f56c6c;
}

.timeline-line {
  position: absolute;
  left: -15px;
  top: 20px;
  width: 2px;
  height: calc(100% - 16px);
  background: #e4e7ed;
}

.timeline-content {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 10px 12px;
}

.tl-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.tl-part {
  font-size: 13px;
  font-weight: bold;
  color: #303133;
}

.tl-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: #606266;
  margin-bottom: 6px;
}

.tl-footer {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #909399;
}

.empty-tip {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-tip i {
  font-size: 48px;
  margin-bottom: 12px;
  display: block;
}

.empty-tip-small {
  text-align: center;
  padding: 30px 20px;
  color: #909399;
  font-size: 13px;
}
</style>


