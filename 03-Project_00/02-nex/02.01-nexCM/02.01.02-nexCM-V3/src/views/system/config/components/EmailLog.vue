<template>
  <div class="email-log-panel">
    <!-- 操作栏 -->
    <div class="email-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          :placeholder="
            $t('menu.system.config.childrenMenu.emailLog.searchPlaceholder')
          "
          clearable
          style="width: 260px"
          @clear="loadList"
          @keyup.enter.native="loadList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="loadList"
          ></el-button>
        </el-input>

        <el-select
          v-model="filterStatus"
          :placeholder="
            $t('menu.system.config.childrenMenu.emailLog.statusFilter')
          "
          clearable
          style="width: 140px; margin-left: 12px"
          @change="loadList"
        >
          <el-option
            :label="
              $t('menu.system.config.childrenMenu.emailLog.statusSending')
            "
            :value="0"
          />
          <el-option
            :label="
              $t('menu.system.config.childrenMenu.emailLog.statusSuccess')
            "
            :value="1"
          />
          <el-option
            :label="$t('menu.system.config.childrenMenu.emailLog.statusFailed')"
            :value="2"
          />
        </el-select>

        <el-select
          v-model="filterConfigId"
          :placeholder="
            $t('menu.system.config.childrenMenu.emailLog.configFilter')
          "
          clearable
          filterable
          style="width: 180px; margin-left: 12px"
          @change="loadList"
        >
          <el-option
            v-for="config in configList"
            :key="config.id"
            :label="config.name"
            :value="config.id"
          />
        </el-select>
      </div>

      <div class="toolbar-right">
        <export-dropdown
          v-permission="'system:config:emailLog:export'"
          :data="tableData"
          :columns="exportColumns"
          :title="$t('menu.system.config.childrenMenu.emailLog.title')"
          :filename="$t('menu.system.config.childrenMenu.emailLog.title')"
          :exporter="$store.state.user.userInfo?.username || ''"
        />
        <el-button
          v-if="multipleSelection.length > 0"
          type="danger"
          icon="el-icon-delete"
          v-permission="'system:config:emailLog:delete'"
          @click="handleBatchDelete"
        >
          {{ $t("menu.system.config.childrenMenu.emailLog.batchDelete") }}
          ({{ multipleSelection.length }})
        </el-button>
        <el-button icon="el-icon-refresh" @click="loadList">
          {{ $t("menu.system.config.childrenMenu.emailLog.refreshBtn") }}
        </el-button>
      </div>
    </div>

    <!-- 日志列表表格 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      :header-cell-style="{
        background: '#f5f7fa',
        color: '#606266',
        fontWeight: 'bold',
        textAlign: 'center',
      }"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column
        prop="config_name"
        :label="$t('menu.system.config.childrenMenu.emailLog.configName')"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="to_email"
        :label="$t('menu.system.config.childrenMenu.emailLog.recipient')"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="subject"
        :label="$t('menu.system.config.childrenMenu.emailLog.subject')"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="template"
        :label="$t('menu.system.config.childrenMenu.emailLog.template')"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.template" size="small" type="info">
            {{ scope.row.template }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('menu.system.config.childrenMenu.emailLog.status')"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success" size="small">
            <i class="el-icon-success" style="margin-right: 3px" />
            {{ $t("menu.system.config.childrenMenu.emailLog.statusSuccess") }}
          </el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger" size="small">
            <i class="el-icon-error" style="margin-right: 3px" />
            {{ $t("menu.system.config.childrenMenu.emailLog.statusFailed") }}
          </el-tag>
          <el-tag v-else type="warning" size="small">
            <i class="el-icon-loading" style="margin-right: 3px" />
            {{ $t("menu.system.config.childrenMenu.emailLog.statusSending") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="retry_count"
        :label="$t('menu.system.config.childrenMenu.emailLog.retryCount')"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.retry_count > 0" style="color: #e6a23c">
            {{ scope.row.retry_count }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="send_duration"
        :label="$t('menu.system.config.childrenMenu.emailLog.duration')"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.send_duration }}ms
        </template>
      </el-table-column>
      <el-table-column
        prop="error_msg"
        :label="$t('menu.system.config.childrenMenu.emailLog.errorMsg')"
        min-width="180"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.error_msg" style="color: #f56c6c">
            {{ scope.row.error_msg }}
          </span>
          <span v-else style="color: #c0c4cc">-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="send_time"
        :label="$t('menu.system.config.childrenMenu.emailLog.sendTime')"
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.send_time || scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.system.config.childrenMenu.emailLog.operations')"
        width="140"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-view"
            @click="handleViewDetail(scope.row)"
          >
            {{ $t("menu.system.config.childrenMenu.emailLog.viewDetail") }}
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            style="color: #f56c6c"
            v-permission="'system:config:emailLog:delete'"
            @click="handleDelete(scope.row)"
          >
            {{ $t("menu.system.config.childrenMenu.emailLog.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 日志详情弹窗 -->
    <el-dialog
      :title="$t('menu.system.config.childrenMenu.emailLog.detailTitle')"
      :visible.sync="detailDialogVisible"
      width="700px"
      append-to-body
    >
      <div v-loading="detailLoading" class="log-detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item
            :label="$t('menu.system.config.childrenMenu.emailLog.logId')"
          >
            {{ currentLog.id }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('menu.system.config.childrenMenu.emailLog.status')"
          >
            <el-tag v-if="currentLog.status === 1" type="success" size="small">
              {{ $t("menu.system.config.childrenMenu.emailLog.statusSuccess") }}
            </el-tag>
            <el-tag
              v-else-if="currentLog.status === 2"
              type="danger"
              size="small"
            >
              {{ $t("menu.system.config.childrenMenu.emailLog.statusFailed") }}
            </el-tag>
            <el-tag v-else type="warning" size="small">
              {{ $t("menu.system.config.childrenMenu.emailLog.statusSending") }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('menu.system.config.childrenMenu.emailLog.configName')"
          >
            {{ currentLog.config_name }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('menu.system.config.childrenMenu.emailLog.recipient')"
          >
            {{ currentLog.to_email }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="currentLog.cc_email"
            :label="$t('menu.system.config.childrenMenu.emailLog.cc')"
          >
            {{ currentLog.cc_email }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('menu.system.config.childrenMenu.emailLog.subject')"
          >
            {{ currentLog.subject }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('menu.system.config.childrenMenu.emailLog.template')"
          >
            {{ currentLog.template || "-" }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('menu.system.config.childrenMenu.emailLog.retryCount')"
          >
            {{ currentLog.retry_count }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('menu.system.config.childrenMenu.emailLog.duration')"
          >
            {{ currentLog.send_duration }}ms
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('menu.system.config.childrenMenu.emailLog.ip')"
          >
            {{ currentLog.ip || "-" }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('menu.system.config.childrenMenu.emailLog.sendTime')"
          >
            {{ formatTime(currentLog.send_time || currentLog.create_time) }}
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="currentLog.error_msg" class="error-section">
          <div class="section-title">
            <i
              class="el-icon-error"
              style="color: #f56c6c; margin-right: 5px"
            />
            {{ $t("menu.system.config.childrenMenu.emailLog.errorMsg") }}
          </div>
          <div class="error-content">{{ currentLog.error_msg }}</div>
        </div>

        <div class="content-section">
          <div class="section-title">
            <i
              class="el-icon-document"
              style="color: #409eff; margin-right: 5px"
            />
            {{ $t("menu.system.config.childrenMenu.emailLog.emailContent") }}
          </div>
          <div class="content-html" v-html="currentLog.content"></div>
        </div>
      </div>

      <span slot="footer">
        <el-button @click="detailDialogVisible = false">
          {{ $t("menu.system.config.childrenMenu.emailLog.close") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  requestGetEmailLogListApi,
  requestGetEmailLogDetailApi,
  requestDeleteEmailLogApi,
  requestBatchDeleteEmailLogsApi,
  requestGetAllEmailConfigsApi,
} from "@/api/email";
import ExportDropdown from "@/components/ExportDropdown/index.vue";

export default {
  name: "EmailLog",
  components: {
    ExportDropdown,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      searchKeyword: "",
      filterStatus: null,
      filterConfigId: null,
      configList: [],
      multipleSelection: [],
      detailDialogVisible: false,
      detailLoading: false,
      currentLog: {},
    };
  },
  computed: {
    // 导出列配置
    exportColumns() {
      return [
        { label: "ID", prop: "id", width: 80 },
        { label: "配置名称", prop: "config_name", width: 150 },
        { label: "收件人", prop: "to_email", width: 200 },
        { label: "邮件主题", prop: "subject", width: 250 },
        { label: "使用模板", prop: "template", width: 120 },
        {
          label: "状态",
          prop: "status",
          width: 100,
          formatter: (row) => {
            if (row.status === 1) return "成功";
            if (row.status === 2) return "失败";
            return "发送中";
          },
        },
        { label: "重试次数", prop: "retry_count", width: 100 },
        { label: "发送耗时(ms)", prop: "send_duration", width: 120 },
        { label: "错误信息", prop: "error_msg", width: 200 },
        { label: "IP地址", prop: "ip", width: 130 },
        {
          label: "发送时间",
          prop: "send_time",
          width: 180,
          formatter: (row) => this.formatTime(row.send_time || row.create_time),
        },
      ];
    },
  },
  created() {
    this.loadConfigList();
    this.loadList();
  },
  methods: {
    /**
     * 加载配置列表（用于筛选下拉）
     */
    async loadConfigList() {
      try {
        const res = await requestGetAllEmailConfigsApi();
        this.configList = res.data || [];
      } catch (err) {
        // 错误已由请求拦截器统一处理，此处无需重复处理
      }
    },

    /**
     * 加载日志列表
     */
    async loadList() {
      this.loading = true;
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          keyword: this.searchKeyword,
        };
        if (
          this.filterStatus !== null &&
          this.filterStatus !== undefined &&
          this.filterStatus !== ""
        ) {
          params.status = this.filterStatus;
        }
        if (this.filterConfigId) {
          params.configId = this.filterConfigId;
        }
        const res = await requestGetEmailLogListApi(params);
        this.tableData = res.data?.list || [];
        this.total = res.data?.total || 0;
      } catch (err) {
        this.$message.error(
          this.$t("menu.system.config.childrenMenu.emailLog.loadFailed")
        );
      } finally {
        this.loading = false;
      }
    },

    /**
     * 分页大小变化
     */
    handleSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.loadList();
    },

    /**
     * 页码变化
     */
    handlePageChange(page) {
      this.page = page;
      this.loadList();
    },

    /**
     * 多选变化
     */
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },

    /**
     * 查看详情
     */
    async handleViewDetail(row) {
      this.detailDialogVisible = true;
      this.detailLoading = true;
      this.currentLog = {};
      try {
        const res = await requestGetEmailLogDetailApi(row.id);
        this.currentLog = res.data || {};
      } catch (err) {
        this.$message.error(
          this.$t("menu.system.config.childrenMenu.emailLog.detailFailed")
        );
      } finally {
        this.detailLoading = false;
      }
    },

    /**
     * 删除单条日志
     */
    handleDelete(row) {
      this.$confirm(
        this.$t("menu.system.config.childrenMenu.emailLog.deleteConfirm"),
        this.$t("menu.system.config.childrenMenu.emailLog.deleteTitle"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          try {
            await requestDeleteEmailLogApi(row.id);
            this.$message.success(
              this.$t("menu.system.config.childrenMenu.emailLog.deleteSuccess")
            );
            this.loadList();
          } catch (err) {
            // 错误已由请求拦截器统一处理，此处无需重复处理
          }
        })
        .catch(() => {});
    },

    /**
     * 批量删除
     */
    handleBatchDelete() {
      if (this.multipleSelection.length === 0) return;
      this.$confirm(
        this.$t("menu.system.config.childrenMenu.emailLog.batchDeleteConfirm", {
          count: this.multipleSelection.length,
        }),
        this.$t("menu.system.config.childrenMenu.emailLog.deleteTitle"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          try {
            const ids = this.multipleSelection.map((item) => item.id);
            await requestBatchDeleteEmailLogsApi(ids);
            this.$message.success(
              this.$t(
                "menu.system.config.childrenMenu.emailLog.batchDeleteSuccess"
              )
            );
            this.multipleSelection = [];
            this.loadList();
          } catch (err) {
            // 错误已由请求拦截器统一处理，此处无需重复处理
          }
        })
        .catch(() => {});
    },

    /**
     * 格式化时间
     */
    formatTime(time) {
      if (!time) return "-";
      const date = new Date(time);
      const pad = (n) => (n < 10 ? "0" + n : n);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`;
    },
  },
};
</script>

<style scoped>
.email-log-panel {
  padding: 0;
}

.email-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.log-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.error-section {
  margin-top: 16px;
  padding: 12px;
  background: #fef0f0;
  border-radius: 4px;
  border-left: 4px solid #f56c6c;
}

.content-section {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.section-title {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
}

.error-content {
  color: #f56c6c;
  font-size: 13px;
  word-break: break-all;
}

.content-html {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  max-height: 300px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
}

.content-html >>> img {
  max-width: 100%;
}

.content-html >>> table {
  border-collapse: collapse;
  width: 100%;
}

.content-html >>> td,
.content-html >>> th {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
