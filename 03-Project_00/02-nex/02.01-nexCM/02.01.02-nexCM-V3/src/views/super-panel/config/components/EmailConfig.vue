<template>
  <div class="email-config-panel">
    <!-- 操作栏 -->
    <div class="email-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          :placeholder="
            $t('menu.superPanel.config.childrenMenu.email.searchPlaceholder')
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
          v-permission="'system:config:email:add'"
          @click="handleAdd"
        >
          {{ $t("menu.superPanel.config.childrenMenu.email.addBtn") }}
        </el-button>
        <el-button icon="el-icon-refresh" @click="loadList">
          {{ $t("menu.superPanel.config.childrenMenu.email.refreshBtn") }}
        </el-button>
      </div>
    </div>

    <!-- 配置列表表格 -->
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
    >
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column
        prop="name"
        :label="$t('menu.superPanel.config.childrenMenu.email.configName')"
        min-width="150"
      />
      <el-table-column
        prop="provider"
        :label="$t('menu.superPanel.config.childrenMenu.email.provider')"
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
        :label="$t('menu.superPanel.config.childrenMenu.email.smtpHost')"
        min-width="180"
      />
      <el-table-column
        prop="port"
        :label="$t('menu.superPanel.config.childrenMenu.email.smtpPort')"
        width="90"
        align="center"
      />
      <el-table-column
        prop="username_masked"
        :label="$t('menu.superPanel.config.childrenMenu.email.emailAccount')"
        min-width="180"
      />
      <el-table-column
        prop="from_name"
        :label="$t('menu.superPanel.config.childrenMenu.email.senderName')"
        min-width="120"
      />
      <el-table-column
        prop="is_default"
        :label="$t('menu.superPanel.config.childrenMenu.email.isDefault')"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_default === 1" type="success" size="small">
            {{ $t("menu.superPanel.config.childrenMenu.email.default") }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('menu.superPanel.config.childrenMenu.email.status')"
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
        :label="$t('menu.superPanel.config.childrenMenu.email.operations')"
        width="280"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-s-promotion"
            v-permission="'system:config:email:test'"
            @click="handleTest(scope.row)"
          >
            {{ $t("menu.superPanel.config.childrenMenu.email.testBtn") }}
          </el-button>
          <el-button
            v-if="scope.row.is_default !== 1"
            type="text"
            size="small"
            icon="el-icon-star-off"
            v-permission="'system:config:email:edit'"
            @click="handleSetDefault(scope.row)"
          >
            {{ $t("menu.superPanel.config.childrenMenu.email.setDefaultBtn") }}
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            v-permission="'system:config:email:edit'"
            @click="handleEdit(scope.row)"
          >
            {{ $t("menu.superPanel.config.childrenMenu.email.editBtn") }}
          </el-button>
          <el-button
            v-if="scope.row.is_default !== 1 && scope.row.is_system !== 1"
            type="text"
            size="small"
            icon="el-icon-delete"
            style="color: #f56c6c"
            v-permission="'system:config:email:delete'"
            @click="handleDelete(scope.row)"
          >
            {{ $t("menu.superPanel.config.childrenMenu.email.deleteBtn") }}
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
        label-width="120px"
      >
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.configName')"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :placeholder="
              $t('menu.superPanel.config.childrenMenu.email.configNamePlaceholder')
            "
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.provider')"
          prop="provider"
        >
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
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.smtpHost')"
          prop="host"
        >
          <el-input v-model="form.host" placeholder="smtp.qq.com" />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.smtpPort')"
          prop="port"
        >
          <el-input-number
            v-model="form.port"
            :min="1"
            :max="65535"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.useSSL')"
          prop="secure"
        >
          <el-switch v-model="form.secure" />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.emailAccount')"
          prop="username"
        >
          <el-input v-model="form.username" placeholder="example@qq.com" />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.authCode')"
          prop="password"
        >
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="
              form.id
                ? $t(
                    'menu.superPanel.config.childrenMenu.email.authCodePlaceholderEdit'
                  )
                : $t(
                    'menu.superPanel.config.childrenMenu.email.authCodePlaceholder'
                  )
            "
          />
          <div class="form-tip">
            {{ $t("menu.superPanel.config.childrenMenu.email.authCodeTip") }}
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.senderName')"
          prop="from_name"
        >
          <el-input
            v-model="form.from_name"
            :placeholder="
              $t('menu.superPanel.config.childrenMenu.email.senderNamePlaceholder')
            "
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.isDefault')"
          prop="is_default"
        >
          <el-switch
            v-model="form.is_default"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.status')"
          prop="status"
        >
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.remark')"
          prop="remark"
        >
          <el-input type="textarea" v-model="form.remark" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t("menu.superPanel.config.childrenMenu.email.cancelBtn")
        }}</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">{{
          $t("menu.superPanel.config.childrenMenu.email.saveBtn")
        }}</el-button>
      </div>
    </el-dialog>

    <!-- 测试邮件对话框 -->
    <el-dialog
      :title="$t('menu.superPanel.config.childrenMenu.email.testEmailTitle')"
      :visible.sync="testDialogVisible"
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form :model="testForm" label-width="100px">
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.testConfigName')"
        >
          <el-input v-model="testForm.configName" disabled />
        </el-form-item>
        <el-form-item
          :label="$t('menu.superPanel.config.childrenMenu.email.testReceiver')"
          prop="toEmail"
        >
          <el-input v-model="testForm.toEmail" placeholder="test@example.com" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="testDialogVisible = false">{{
          $t("menu.superPanel.config.childrenMenu.email.cancelBtn")
        }}</el-button>
        <el-button type="primary" :loading="testing" @click="handleSendTest">{{
          $t("menu.superPanel.config.childrenMenu.email.sendTestBtn")
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
        ? this.$t("menu.superPanel.config.childrenMenu.email.editTitle")
        : this.$t("menu.superPanel.config.childrenMenu.email.addTitle");
    },
    formRules() {
      return {
        name: [
          {
            required: true,
            message: this.$t(
              "menu.superPanel.config.childrenMenu.email.configNameRequired"
            ),
            trigger: "blur",
          },
        ],
        provider: [
          {
            required: true,
            message: this.$t(
              "menu.superPanel.config.childrenMenu.email.providerRequired"
            ),
            trigger: "change",
          },
        ],
        host: [
          {
            required: true,
            message: this.$t(
              "menu.superPanel.config.childrenMenu.email.smtpHostRequired"
            ),
            trigger: "blur",
          },
        ],
        port: [
          {
            required: true,
            message: this.$t(
              "menu.superPanel.config.childrenMenu.email.smtpPortRequired"
            ),
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: this.$t(
              "menu.superPanel.config.childrenMenu.email.emailAccountRequired"
            ),
            trigger: "blur",
          },
          {
            type: "email",
            message: this.$t(
              "menu.superPanel.config.childrenMenu.email.emailFormatError"
            ),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: !this.form.id,
            message: this.$t(
              "menu.superPanel.config.childrenMenu.email.authCodeRequired"
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
        secure: true,
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
          this.$t("menu.superPanel.config.childrenMenu.email.loadFailed")
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
        this.form.secure = item.secure;
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
            this.$t("menu.superPanel.config.childrenMenu.email.updateSuccess")
          );
        } else {
          await requestCreateEmailConfigApi(this.form);
          this.$message.success(
            this.$t("menu.superPanel.config.childrenMenu.email.addSuccess")
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
          this.$t("menu.superPanel.config.childrenMenu.email.deleteConfirm"),
          this.$t("menu.superPanel.config.childrenMenu.email.deleteTitle"),
          {
            confirmButtonText: this.$t(
              "menu.superPanel.config.childrenMenu.email.confirmBtn"
            ),
            cancelButtonText: this.$t(
              "menu.superPanel.config.childrenMenu.email.cancelBtn"
            ),
            type: "warning",
          }
        );
        await requestDeleteEmailConfigApi(row.id);
        this.$message.success(
          this.$t("menu.superPanel.config.childrenMenu.email.deleteSuccess")
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
          this.$t("menu.superPanel.config.childrenMenu.email.setDefaultSuccess")
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
            ? this.$t("menu.superPanel.config.childrenMenu.email.enableSuccess")
            : this.$t("menu.superPanel.config.childrenMenu.email.disableSuccess")
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
          this.$t("menu.superPanel.config.childrenMenu.email.testReceiverRequired")
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
          this.$t("menu.superPanel.config.childrenMenu.email.testSendSuccess")
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
</style>
