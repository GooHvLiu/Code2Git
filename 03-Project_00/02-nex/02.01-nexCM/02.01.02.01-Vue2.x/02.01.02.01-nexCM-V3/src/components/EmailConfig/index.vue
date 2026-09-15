<template>
  <div class="email-config-panel">
    <!-- 操作栏 -->
    <div class="email-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          :placeholder="
            $t('superPanel.config.email.searchPlaceholder')
          "
          clearable
          style="width: 280px"
          @clear="loadList"
          @keyup.enter.native="loadList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="loadList"
          ></el-button>
        </el-input>
      </div>
      <div class="toolbar-right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
        >
          {{ $t("superPanel.config.email.addBtn") }}
        </el-button>
        <el-button icon="el-icon-refresh" @click="loadList">
          {{ $t("superPanel.config.email.refreshBtn") }}
        </el-button>
      </div>
    </div>

    <!-- 配置列表表格 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      :element-loading-text="$t('common.loading')"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column
        prop="name"
        :label="$t('superPanel.config.email.configName')"
        min-width="150"
      />
      <el-table-column
        prop="provider"
        :label="$t('superPanel.config.email.provider')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag size="small">{{
            getProviderLabel(scope.row.provider)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="host"
        :label="$t('superPanel.config.email.smtpHost')"
        min-width="180"
      />
      <el-table-column
        prop="port"
        :label="$t('superPanel.config.email.smtpPort')"
        width="90"
        align="center"
      />
      <el-table-column
        prop="username_masked"
        :label="$t('superPanel.config.email.emailAccount')"
        min-width="180"
      />
      <el-table-column
        prop="from_name"
        :label="$t('superPanel.config.email.senderName')"
        min-width="120"
      />
      <el-table-column
        prop="is_default"
        :label="$t('superPanel.config.email.isDefault')"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_default === 1" type="success" size="small">
            {{ $t("superPanel.config.email.default") }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('superPanel.config.email.status')"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('superPanel.config.email.operations')"
        width="280"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-s-promotion"
            @click="handleTest(scope.row)"
          >
            {{ $t("superPanel.config.email.testBtn") }}
          </el-button>
          <el-button
            v-if="scope.row.is_default !== 1"
            type="text"
            size="small"
            icon="el-icon-star-off"
            @click="handleSetDefault(scope.row)"
          >
            {{ $t("superPanel.config.email.setDefaultBtn") }}
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >
            {{ $t("superPanel.config.email.editBtn") }}
          </el-button>
          <el-button
            v-if="scope.row.is_default !== 1 && scope.row.is_system !== 1"
            type="text"
            size="small"
            icon="el-icon-delete"
            style="color: #f56c6c"
            @click="handleDelete(scope.row)"
          >
            {{ $t("superPanel.config.email.deleteBtn") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="email-pagination">
      <el-pagination
        background
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form
        ref="emailForm"
        :model="form"
        :rules="formRules"
        label-width="130px"
      >
        <el-form-item prop="name">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.configName') }}
              <el-tooltip :content="$t('superPanel.config.email.configNameTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input
            v-model="form.name"
            :placeholder="
              $t('superPanel.config.email.configNamePlaceholder')
            "
          />
        </el-form-item>
        <el-form-item prop="provider">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.provider') }}
              <el-tooltip :content="$t('superPanel.config.email.providerTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-select
            v-model="form.provider"
            style="width: 100%"
            @change="handleProviderChange"
          >
            <el-option
              v-for="item in providerList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="host">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.smtpHost') }}
              <el-tooltip :content="$t('superPanel.config.email.smtpHostTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="form.host" placeholder="smtp.qq.com" />
        </el-form-item>
        <el-form-item prop="port">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.smtpPort') }}
              <el-tooltip :content="$t('superPanel.config.email.smtpPortTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input-number
            v-model="form.port"
            :min="1"
            :max="65535"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item prop="secure">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.useSSL') }}
              <el-tooltip :content="$t('superPanel.config.email.useSSLTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-switch
            v-model="form.secure"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item prop="username">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.emailAccount') }}
              <el-tooltip :content="$t('superPanel.config.email.emailAccountTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="form.username" placeholder="example@qq.com" />
        </el-form-item>
        <el-form-item prop="password">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.authCode') }}
              <el-tooltip :content="$t('superPanel.config.email.authCodeTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="
              form.id
                ? $t(
                    'superPanel.config.email.authCodePlaceholderEdit'
                  )
                : $t(
                    'superPanel.config.email.authCodePlaceholder'
                  )
            "
          />
          <div class="form-tip">
            {{ $t("superPanel.config.email.authCodeTip") }}
          </div>
        </el-form-item>
        <el-form-item prop="from_name">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.senderName') }}
              <el-tooltip :content="$t('superPanel.config.email.senderNameTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input
            v-model="form.from_name"
            :placeholder="
              $t('superPanel.config.email.senderNamePlaceholder')
            "
          />
        </el-form-item>
        <el-form-item prop="is_default">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.isDefault') }}
              <el-tooltip :content="$t('superPanel.config.email.isDefaultTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-switch
            v-model="form.is_default"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item prop="status">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.status') }}
              <el-tooltip :content="$t('superPanel.config.email.statusTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item prop="remark">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.remark') }}
              <el-tooltip :content="$t('superPanel.config.email.remarkTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input type="textarea" v-model="form.remark" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t("superPanel.config.email.cancelBtn")
        }}</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">{{
          $t("superPanel.config.email.saveBtn")
        }}</el-button>
      </div>
    </el-dialog>

    <!-- 测试邮件对话框 -->
    <el-dialog
      :title="$t('superPanel.config.email.testEmailTitle')"
      :visible.sync="testDialogVisible"
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form :model="testForm" label-width="120px">
        <el-form-item>
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.testConfigName') }}
              <el-tooltip :content="$t('superPanel.config.email.testConfigNameTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="testForm.configName" disabled />
        </el-form-item>
        <el-form-item prop="toEmail">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.config.email.testReceiver') }}
              <el-tooltip :content="$t('superPanel.config.email.testReceiverTip')" placement="top">
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="testForm.toEmail" placeholder="test@example.com" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="testDialogVisible = false">{{
          $t("superPanel.config.email.cancelBtn")
        }}</el-button>
        <el-button type="primary" :loading="testing" @click="handleSendTest">{{
          $t("superPanel.config.email.sendTestBtn")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  requestGetEmailConfigListApi,
  requestCreateEmailConfigApi,
  requestUpdateEmailConfigApi,
  requestDeleteEmailConfigApi,
  requestSetDefaultEmailConfigApi,
  requestUpdateEmailConfigStatusApi,
  requestSendTestEmailApi,
  requestGetEmailProvidersApi,
} from "@/api/email";

export default {
  name: "EmailConfig",
  data() {
    return {
      loading: false,
      saving: false,
      testing: false,
      searchKeyword: "",
      page: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      providerList: [],
      dialogVisible: false,
      testDialogVisible: false,
      form: this.getEmptyForm(),
      testForm: {
        configId: null,
        configName: "",
        toEmail: "",
      },
    };
  },
  computed: {
    dialogTitle() {
      return this.form.id
        ? this.$t("superPanel.config.email.editTitle")
        : this.$t("superPanel.config.email.addTitle");
    },
    formRules() {
      return {
        name: [
          {
            required: true,
            message: this.$t(
              "superPanel.config.email.configNameRequired"
            ),
            trigger: "blur",
          },
        ],
        provider: [
          {
            required: true,
            message: this.$t(
              "superPanel.config.email.providerRequired"
            ),
            trigger: "change",
          },
        ],
        host: [
          {
            required: true,
            message: this.$t(
              "superPanel.config.email.smtpHostRequired"
            ),
            trigger: "blur",
          },
        ],
        port: [
          {
            required: true,
            message: this.$t(
              "superPanel.config.email.smtpPortRequired"
            ),
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: this.$t(
              "superPanel.config.email.emailAccountRequired"
            ),
            trigger: "blur",
          },
          {
            type: "email",
            message: this.$t(
              "superPanel.config.email.emailFormatError"
            ),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: !this.form.id,
            message: this.$t(
              "superPanel.config.email.authCodeRequired"
            ),
            trigger: "blur",
          },
        ],
      };
    },
  },
  created() {
    this.loadProviders();
    this.loadList();
  },
  methods: {
    getEmptyForm() {
      return {
        id: null,
        name: "",
        provider: "qq",
        host: "smtp.qq.com",
        port: 465,
        secure: 1,
        username: "",
        password: "",
        from_name: "",
        is_default: 0,
        status: 1,
        remark: "",
      };
    },
    resetForm() {
      this.form = this.getEmptyForm();
      this.$refs.emailForm && this.$refs.emailForm.clearValidate();
    },
    async loadProviders() {
      try {
        const res = await requestGetEmailProvidersApi();
        this.providerList = res.data || [];
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[邮箱配置] 加载邮箱服务商列表失败:", err);
      }
    },
    getProviderLabel(provider) {
      const item = this.providerList.find((p) => p.value === provider);
      return item ? item.label : provider;
    },
    async loadList() {
      this.loading = true;
      try {
        const res = await requestGetEmailConfigListApi({
          page: this.page,
          pageSize: this.pageSize,
          keyword: this.searchKeyword,
        });
        this.tableData = res.data.list || [];
        this.total = res.data.total || 0;
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.config.email.loadFailed")
        );
      } finally {
        this.loading = false;
      }
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.loadList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.loadList();
    },
    handleAdd() {
      this.resetForm();
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.form = { ...row, password: "" };
      this.dialogVisible = true;
    },
    handleProviderChange(provider) {
      const item = this.providerList.find((p) => p.value === provider);
      if (item) {
        this.form.host = item.host;
        this.form.port = item.port;
        this.form.secure = item.secure ? 1 : 0;
      }
    },
    async handleSave() {
      try {
        await this.$refs.emailForm.validate();
      } catch (err) {
        return;
      }

      this.saving = true;
      try {
        if (this.form.id) {
          await requestUpdateEmailConfigApi(this.form.id, this.form);
          this.$message.success(
            this.$t("superPanel.config.email.updateSuccess")
          );
        } else {
          await requestCreateEmailConfigApi(this.form);
          this.$message.success(
            this.$t("superPanel.config.email.addSuccess")
          );
        }
        this.dialogVisible = false;
        this.loadList();
      } catch (err) {
        // 错误已由请求拦截器统一处理，此处无需重复处理
      } finally {
        this.saving = false;
      }
    },
    async handleDelete(row) {
      try {
        await this.$confirm(
          this.$t("superPanel.config.email.deleteConfirm"),
          this.$t("superPanel.config.email.deleteTitle"),
          {
            confirmButtonText: this.$t(
              "superPanel.config.email.confirmBtn"
            ),
            cancelButtonText: this.$t(
              "superPanel.config.email.cancelBtn"
            ),
            type: "warning",
          }
        );
        await requestDeleteEmailConfigApi(row.id);
        this.$message.success(
          this.$t("superPanel.config.email.deleteSuccess")
        );
        this.loadList();
      } catch (err) {
        if (err !== "cancel") {
          // 错误已由请求拦截器统一处理，此处无需重复处理
        }
      }
    },
    async handleSetDefault(row) {
      try {
        await requestSetDefaultEmailConfigApi(row.id);
        this.$message.success(
          this.$t("superPanel.config.email.setDefaultSuccess")
        );
        this.loadList();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[邮箱配置] 设置默认邮箱配置失败:", err);
      }
    },
    async handleStatusChange(row) {
      try {
        await requestUpdateEmailConfigStatusApi(row.id, row.status);
        this.$message.success(
          row.status === 1
            ? this.$t("superPanel.config.email.enableSuccess")
            : this.$t("superPanel.config.email.disableSuccess")
        );
      } catch (err) {
        row.status = row.status === 1 ? 0 : 1;
      }
    },
    handleTest(row) {
      this.testForm = {
        configId: row.id,
        configName: row.name,
        toEmail: "",
      };
      this.testDialogVisible = true;
    },
    async handleSendTest() {
      if (!this.testForm.toEmail) {
        this.$message.warning(
          this.$t("superPanel.config.email.testReceiverRequired")
        );
        return;
      }
      this.testing = true;
      try {
        await requestSendTestEmailApi({
          configId: this.testForm.configId,
          toEmail: this.testForm.toEmail,
        });
        this.$message.success(
          this.$t("superPanel.config.email.testSendSuccess")
        );
        this.testDialogVisible = false;
      } catch (err) {
        // 错误已由请求拦截器统一处理，此处无需重复处理
      } finally {
        this.testing = false;
      }
    },
  },
};
</script>

<style scoped>
.email-config-panel {
  padding: 20px;
}

.email-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 10px;
}

.email-pagination {
  margin-top: 16px;
  text-align: right;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

/* ========== 带问号提示的 label ========== */
.label-with-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.label-tip-icon {
  color: #c0c4cc;
  cursor: help;
  font-size: 14px;
  transition: color 0.2s;
}

.label-tip-icon:hover {
  color: #409eff;
}
</style>
