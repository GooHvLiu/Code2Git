<template>
  <div class="system-config-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ $t("systemConfig.title") }}</h2>
        <p class="page-desc">{{ $t("systemConfig.desc") }}</p>
      </div>
      <div class="header-right">
        <el-button type="primary" icon="el-icon-check" @click="handleSave">
          {{ $t("systemConfig.save") }}
        </el-button>
        <el-button icon="el-icon-refresh-left" @click="handleReset">
          {{ $t("systemConfig.reset") }}
        </el-button>
      </div>
    </div>

    <!-- 主体内容：左侧导航 + 右侧配置 -->
    <div class="config-body">
      <!-- 左侧分类导航 -->
      <div class="config-sidebar">
        <div
          v-for="item in menuList"
          :key="item.key"
          class="menu-item"
          :class="{ active: activeMenu === item.key }"
          @click="activeMenu = item.key"
        >
          <i :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </div>
      </div>

      <!-- 右侧配置内容 -->
      <div class="config-content">
        <!-- 系统设置 -->
        <div v-show="activeMenu === 'system'" class="config-panel">
          <h3 class="panel-title">{{ $t("systemConfig.system.title") }}</h3>
          <el-form :model="form" label-width="160px" label-position="right">
            <el-form-item :label="$t('systemConfig.system.sessionTimeout')">
              <el-input-number
                v-model="form.sessionTimeout"
                :min="5"
                :max="120"
                :step="5"
                controls-position="right"
              />
              <span class="unit-text">{{
                $t("systemConfig.system.minutes")
              }}</span>
            </el-form-item>

            <el-form-item :label="$t('systemConfig.system.defaultPageSize')">
              <el-select v-model="form.defaultPageSize" style="width: 200px">
                <el-option :label="10" :value="10" />
                <el-option :label="20" :value="20" />
                <el-option :label="50" :value="50" />
                <el-option :label="100" :value="100" />
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('systemConfig.system.defaultLanguage')">
              <el-select v-model="form.defaultLanguage" style="width: 200px">
                <el-option label="简体中文" value="zh-CN" />
                <el-option label="English" value="en-US" />
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('systemConfig.system.dateFormat')">
              <el-select v-model="form.dateFormat" style="width: 200px">
                <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
                <el-option label="YYYY/MM/DD" value="YYYY/MM/DD" />
                <el-option label="DD-MM-YYYY" value="DD-MM-YYYY" />
                <el-option label="DD/MM/YYYY" value="DD/MM/YYYY" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <!-- 安全设置 -->
        <div v-show="activeMenu === 'security'" class="config-panel">
          <h3 class="panel-title">{{ $t("systemConfig.security.title") }}</h3>
          <el-form :model="form" label-width="160px" label-position="right">
            <el-form-item :label="$t('systemConfig.security.watermarkEnabled')">
              <el-switch
                v-model="form.watermarkEnabled"
                active-color="#13ce66"
                inactive-color="#c0c4cc"
              />
            </el-form-item>

            <el-form-item :label="$t('systemConfig.security.watermarkText')">
              <el-input
                v-model="form.watermarkText"
                :placeholder="$t('systemConfig.security.watermarkPlaceholder')"
                clearable
                style="width: 300px"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 设备连接设置 -->
        <div v-show="activeMenu === 'plc'" class="config-panel">
          <h3 class="panel-title">{{ $t("systemConfig.plc.title") }}</h3>
          <el-form :model="form" label-width="160px" label-position="right">
            <el-form-item :label="$t('systemConfig.plc.protocol')">
              <el-select v-model="form.plcProtocol" style="width: 200px">
                <el-option label="Modbus TCP" value="ModbusTcp" />
                <el-option label="S7" value="S7" />
                <el-option label="OPC UA" value="OpcUa" />
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('systemConfig.plc.host')">
              <el-input
                v-model="form.plcHost"
                placeholder="192.168.1.100"
                style="width: 250px"
              />
            </el-form-item>

            <el-form-item :label="$t('systemConfig.plc.port')">
              <el-input-number
                v-model="form.plcPort"
                :min="1"
                :max="65535"
                controls-position="right"
              />
            </el-form-item>

            <el-form-item :label="$t('systemConfig.plc.unitId')">
              <el-input-number
                v-model="form.plcUnitId"
                :min="1"
                :max="255"
                controls-position="right"
              />
            </el-form-item>

            <el-divider content-position="left">轮询设置</el-divider>

            <el-form-item :label="$t('systemConfig.plc.pollFast')">
              <el-input-number
                v-model="form.pollFastInterval"
                :min="50"
                :max="5000"
                :step="50"
                controls-position="right"
              />
              <span class="unit-text">ms</span>
            </el-form-item>

            <el-form-item :label="$t('systemConfig.plc.pollSlow')">
              <el-input-number
                v-model="form.pollSlowInterval"
                :min="100"
                :max="10000"
                :step="100"
                controls-position="right"
              />
              <span class="unit-text">ms</span>
            </el-form-item>
          </el-form>
        </div>

        <!-- 导出设置 -->
        <div v-show="activeMenu === 'export'" class="config-panel">
          <h3 class="panel-title">{{ $t("systemConfig.export.title") }}</h3>
          <el-form :model="form" label-width="160px" label-position="right">
            <el-form-item
              :label="$t('systemConfig.export.pdfWatermarkEnabled')"
            >
              <el-switch
                v-model="form.pdfWatermarkEnabled"
                active-color="#13ce66"
                inactive-color="#c0c4cc"
              />
            </el-form-item>

            <el-form-item :label="$t('systemConfig.export.pdfWatermarkText')">
              <el-input
                v-model="form.pdfWatermarkText"
                :placeholder="$t('systemConfig.export.pdfWatermarkPlaceholder')"
                clearable
                style="width: 300px"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 连接设置 -->
        <div v-show="activeMenu === 'connection'" class="config-panel">
          <h3 class="panel-title">{{ $t("systemConfig.connection.title") }}</h3>
          <el-form :model="form" label-width="160px" label-position="right">
            <el-form-item
              :label="$t('systemConfig.connection.heartbeatInterval')"
            >
              <el-input-number
                v-model="form.heartbeatInterval"
                :min="5000"
                :max="60000"
                :step="1000"
                controls-position="right"
              />
              <span class="unit-text">ms</span>
            </el-form-item>
          </el-form>
        </div>

        <!-- 授权管理 -->
        <div
          v-show="activeMenu === 'license'"
          class="config-panel license-panel"
        >
          <!-- 顶部操作栏 -->
          <div class="license-toolbar">
            <div class="toolbar-title">
              <i class="el-icon-key"></i>
              <span>{{ $t("license.manageTitle") }}</span>
            </div>
            <div class="toolbar-actions">
              <el-button
                size="mini"
                icon="el-icon-refresh"
                @click="loadLicenseData"
                :loading="licenseLoading"
                >{{ $t("license.refresh") }}</el-button
              >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-upload2"
                @click="showLicenseImport = true"
                >{{ $t("license.importLicense") }}</el-button
              >
              <el-button
                v-if="isAdmin"
                size="mini"
                icon="el-icon-download"
                @click="handleDownloadLicense"
                >{{ $t("license.download") }}</el-button
              >
            </div>
          </div>

          <!-- 授权状态卡片 -->
          <div
            class="license-status-card"
            :class="{ valid: licenseData.valid, invalid: !licenseData.valid }"
          >
            <div class="status-left">
              <i
                :class="
                  licenseData.valid
                    ? 'el-icon-circle-check'
                    : 'el-icon-warning-outline'
                "
              ></i>
              <div class="status-text">
                <div class="status-main">
                  {{
                    licenseData.valid
                      ? $t("license.statusValid")
                      : $t("license.statusInvalid")
                  }}
                </div>
                <div class="status-type">
                  <el-tag
                    size="mini"
                    :type="licenseTypeTag(licenseData.licenseType)"
                    effect="dark"
                    >{{ licenseTypeLabel(licenseData.licenseType) }}</el-tag
                  >
                </div>
              </div>
            </div>
            <div class="status-right">
              <div class="status-item">
                <span class="item-label">{{ $t("license.expireTime") }}</span>
                <span class="item-value">{{
                  formatLicenseTime(licenseData.expiresAt)
                }}</span>
              </div>
              <div class="status-item">
                <span class="item-label">{{ $t("license.remaining") }}</span>
                <span class="item-value countdown">{{ licenseCountdown }}</span>
              </div>
              <div class="status-item">
                <span class="item-label">{{ $t("license.projectName") }}</span>
                <span class="item-value">{{
                  licenseData.projectName || "-"
                }}</span>
              </div>
              <div class="status-item">
                <span class="item-label">{{ $t("license.customerName") }}</span>
                <span class="item-value">{{
                  licenseData.customer?.name || "-"
                }}</span>
              </div>
            </div>
          </div>

          <!-- 折叠面板：详细信息 -->
          <el-collapse v-model="licenseActiveNames" class="license-collapse">
            <!-- 授权详细信息 -->
            <el-collapse-item :title="$t('license.detailTitle')" name="detail">
              <div class="license-detail-grid">
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.licenseId') }}</div>
                  <div class="detail-value mono-text">{{ licenseData.licenseId || '-' }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.projectId') }}</div>
                  <div class="detail-value mono-text">{{ licenseData.projectId || '-' }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.projectName') }}</div>
                  <div class="detail-value">{{ licenseData.projectName || '-' }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.licenseType') }}</div>
                  <div class="detail-value">
                    <el-tag size="mini" :type="licenseTypeTag(licenseData.licenseType)">{{ licenseTypeLabel(licenseData.licenseType) }}</el-tag>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.issuedAt') }}</div>
                  <div class="detail-value">{{ formatLicenseTime(licenseData.issuedAt) }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.expireTime') }}</div>
                  <div class="detail-value">{{ formatLicenseTime(licenseData.expiresAt) }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.customerName') }}</div>
                  <div class="detail-value">{{ licenseData.customer?.name || '-' }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.contact') }}</div>
                  <div class="detail-value">{{ licenseData.customer?.contact || '-' }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.phone') }}</div>
                  <div class="detail-value">{{ licenseData.customer?.phone || '-' }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.email') }}</div>
                  <div class="detail-value">{{ licenseData.customer?.email || '-' }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.maxUsers') }}</div>
                  <div class="detail-value">{{ licenseData.maxUsers || $t('common.all') }}</div>
                </div>
                <div class="detail-item detail-item-full">
                  <div class="detail-label">{{ $t('license.features') }}</div>
                  <div class="detail-value">
                    <el-tag v-for="f in (licenseData.features || [])" :key="f" size="mini" effect="plain" style="margin-right: 6px; margin-bottom: 4px;">{{ f }}</el-tag>
                    <span v-if="!licenseData.features || licenseData.features.length === 0" class="text-muted">{{ $t('license.allFeatures') }}</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>

            <!-- 机器绑定信息 -->
            <el-collapse-item :title="$t('license.machineBind')" name="machine">
              <div class="machine-info">
                <div class="machine-row">
                  <span class="machine-label">{{
                    $t("license.currentMachineId")
                  }}</span>
                  <div class="machine-value-wrap">
                    <span class="machine-id mono-text">{{
                      licenseData.machineId || "-"
                    }}</span>
                    <el-button
                      v-if="licenseData.machineId"
                      type="text"
                      size="mini"
                      icon="el-icon-document-copy"
                      @click="copyMachineId"
                    ></el-button>
                  </div>
                </div>
                <div class="machine-row">
                  <span class="machine-label">{{
                    $t("license.boundMachineId")
                  }}</span>
                  <span class="machine-id mono-text">{{
                    licenseData.boundMachineId || $t("license.notBoundAny")
                  }}</span>
                </div>
                <div class="machine-row">
                  <span class="machine-label">{{
                    $t("license.matchStatus")
                  }}</span>
                  <el-tag
                    :type="licenseData.machineMatched ? 'success' : 'danger'"
                    size="mini"
                  >
                    <i
                      :class="
                        licenseData.machineMatched
                          ? 'el-icon-circle-check'
                          : 'el-icon-circle-close'
                      "
                      style="margin-right: 2px"
                    ></i>
                    {{
                      licenseData.machineMatched
                        ? $t("license.matched")
                        : $t("license.notMatched")
                    }}
                  </el-tag>
                </div>
              </div>
            </el-collapse-item>

            <!-- 时间防护信息 -->
            <el-collapse-item :title="$t('license.timeGuard')" name="time">
              <div class="time-info">
                <div class="time-row">
                  <span class="time-label">{{
                    $t("license.timeGuardStatus")
                  }}</span>
                  <el-tag
                    :type="licenseData.timeGuard?.exists ? 'success' : 'info'"
                    size="mini"
                  >
                    {{
                      licenseData.timeGuard?.exists
                        ? $t("license.enabled")
                        : $t("license.notInitialized")
                    }}
                  </el-tag>
                </div>
                <div class="time-row">
                  <span class="time-label">{{
                    $t("license.lastVerified")
                  }}</span>
                  <span class="time-value">{{
                    formatLicenseTime(licenseData.timeGuard?.lastVerifiedAt)
                  }}</span>
                </div>
                <div class="time-row">
                  <span class="time-label">{{ $t("license.serverTime") }}</span>
                  <span class="time-value">{{
                    formatLicenseTime(licenseData.serverTime)
                  }}</span>
                </div>
                <div class="time-row">
                  <span class="time-label">操作</span>
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-refresh"
                    @click="handleSyncLicenseTime"
                    :loading="licenseSyncing"
                    >{{ $t("license.networkDiagnosis") }}</el-button
                  >
                </div>
              </div>
            </el-collapse-item>

            <!-- 授权文件信息（仅管理员） -->
            <el-collapse-item
              v-if="isAdmin"
              :title="$t('license.fileInfo')"
              name="file"
            >
              <div v-if="licenseData.licenseFile" class="license-detail-grid">
                <div class="detail-item detail-item-full">
                  <div class="detail-label">{{ $t('license.filePath') }}</div>
                  <div class="detail-value mono-text">{{ licenseData.licenseFile.path }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.fileName') }}</div>
                  <div class="detail-value">{{ licenseData.licenseFile.fileName }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('license.fileSize') }}</div>
                  <div class="detail-value">{{ licenseData.licenseFile.sizeFormatted }}</div>
                </div>
                <div class="detail-item detail-item-full">
                  <div class="detail-label">{{ $t('license.lastModified') }}</div>
                  <div class="detail-value">{{ formatLicenseTime(licenseData.licenseFile.lastModified) }}</div>
                </div>
              </div>
              <div v-else class="empty-state">
                <i class="el-icon-document-delete"></i>
                <span>{{ $t("license.noLicenseFile") }}</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>

    <!-- 授权导入弹窗 -->
    <el-dialog
      :title="$t('license.importDialogTitle')"
      :visible.sync="showLicenseImport"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="import-tip">
        <i class="el-icon-info"></i>
        <span>{{ $t("license.importTip") }}</span>
      </div>
      <el-upload
        class="import-upload"
        drag
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleLicenseFileChange"
        accept=".lic"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{ $t("license.dragUpload") }}</div>
      </el-upload>
      <div v-if="selectedLicenseFile" class="selected-file-info">
        <i class="el-icon-document-checked"></i>
        <span class="file-name">{{ selectedLicenseFile.name }}</span>
      </div>
      <div slot="footer">
        <el-button @click="showLicenseImport = false">{{
          $t("license.cancel")
        }}</el-button>
        <el-button
          type="primary"
          :loading="licenseImporting"
          :disabled="!selectedLicenseFile"
          @click="handleImportLicense"
          >{{ $t("license.confirmImport") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  requestGetAllConfigsApi,
  requestUpdateConfigsApi,
  requestResetConfigsApi,
} from "@/api";
import { applyConfig } from "@/utils/config";
import licenseMixin from "@/mixins/licenseMixin";

export default {
  name: "SystemConfig",
  mixins: [licenseMixin],
  data() {
    return {
      loading: false,
      activeMenu: "system",
      menuList: [
        { key: "system", icon: "el-icon-setting", title: "" },
        { key: "security", icon: "el-icon-lock", title: "" },
        { key: "plc", icon: "el-icon-cpu", title: "" },
        { key: "export", icon: "el-icon-document", title: "" },
        { key: "connection", icon: "el-icon-connection", title: "" },
        { key: "license", icon: "el-icon-key", title: "" },
      ],
      // 表单数据
      form: {
        // 系统设置
        sessionTimeout: 30,
        defaultPageSize: 20,
        defaultLanguage: "zh-CN",
        dateFormat: "YYYY-MM-DD",
        // 安全设置
        watermarkEnabled: false,
        watermarkText: "",
        // PLC 设置
        plcProtocol: "ModbusTcp",
        plcHost: "127.0.0.1",
        plcPort: 502,
        plcUnitId: 1,
        pollFastInterval: 200,
        pollSlowInterval: 1000,
        // 导出设置
        pdfWatermarkEnabled: true,
        pdfWatermarkText: "",
        // 连接设置
        heartbeatInterval: 25000,
      },
    };
  },
  computed: {
    isAdmin() {
      return this.$store?.state?.user?.userInfo?.role === "administrator";
    },
  },
  created() {
    // 初始化菜单标题（国际化）
    this.menuList[0].title = this.$t("systemConfig.system.title");
    this.menuList[1].title = this.$t("systemConfig.security.title");
    this.menuList[2].title = this.$t("systemConfig.plc.title");
    this.menuList[3].title = this.$t("systemConfig.export.title");
    this.menuList[4].title = this.$t("systemConfig.connection.title");
    this.menuList[5].title = this.$t("license.manageTitle");
    // 加载配置
    this.loadConfigs();
    // 加载授权数据
    this.loadLicenseData();
  },
  beforeDestroy() {
    if (this.licenseCountdownTimer) {
      clearInterval(this.licenseCountdownTimer);
    }
  },
  methods: {
    /**
     * 加载配置
     */
    async loadConfigs() {
      this.loading = true;
      try {
        const res = await requestGetAllConfigsApi();
        if (res.code === 200 && res.data) {
          this.form = { ...this.form, ...res.data };
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[参数配置] 加载配置失败:", err);
        this.$message.error(this.$t("systemConfig.loadFailed"));
      } finally {
        this.loading = false;
      }
    },
    /**
     * 保存配置
     */
    async handleSave() {
      this.loading = true;
      try {
        const res = await requestUpdateConfigsApi(this.form);
        if (res.code === 200) {
          this.$message.success(this.$t("systemConfig.saveSuccess"));
          // 实时生效配置（包含语言切换、心跳间隔、水印等）
          applyConfig(res.data || this.form);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[参数配置] 保存配置失败:", err);
        this.$message.error(this.$t("systemConfig.saveFailed"));
      } finally {
        this.loading = false;
      }
    },
    /**
     * 重置配置
     */
    handleReset() {
      this.$confirm(
        this.$t("systemConfig.resetConfirm"),
        this.$t("common.tip"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          this.loading = true;
          try {
            const res = await requestResetConfigsApi();
            if (res.code === 200 && res.data) {
              this.form = { ...this.form, ...res.data };
              this.$message.success(this.$t("systemConfig.resetSuccess"));
              // 实时生效配置（包含语言切换、心跳间隔、水印等）
              applyConfig(res.data);
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error("[参数配置] 重置配置失败:", err);
            this.$message.error(this.$t("systemConfig.resetFailed"));
          } finally {
            this.loading = false;
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="less">
.system-config-container {
  padding: 20px;
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebeef5;
    flex-shrink: 0;

    .header-left {
      .page-title {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        color: #303133;
      }

      .page-desc {
        margin: 0;
        font-size: 13px;
        color: #909399;
      }
    }

    .header-right {
      display: flex;
      gap: 10px;
    }
  }

  .config-body {
    flex: 1;
    display: flex;
    gap: 20px;
    overflow: hidden;

    // 左侧分类导航
    .config-sidebar {
      width: 200px;
      flex-shrink: 0;
      background: #fff;
      border-radius: 8px;
      padding: 10px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

      .menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        cursor: pointer;
        font-size: 14px;
        color: #606266;
        transition: all 0.2s;
        border-left: 3px solid transparent;

        i {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        &:hover {
          background: #f5f7fa;
          color: #409eff;
        }

        &.active {
          background: #ecf5ff;
          color: #409eff;
          border-left-color: #409eff;
          font-weight: 500;
        }
      }
    }

    // 右侧配置内容
    .config-content {
      flex: 1;
      background: #fff;
      border-radius: 8px;
      padding: 30px 40px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      overflow-y: auto;

      .config-panel {
        .panel-title {
          margin: 0 0 25px 0;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f2f5;
        }

        ::v-deep .el-form-item {
          margin-bottom: 22px;
        }

        ::v-deep .el-form-item__label {
          font-size: 14px;
          color: #606266;
        }

        .unit-text {
          margin-left: 10px;
          font-size: 13px;
          color: #909399;
        }
      }
    }

    // 授权管理面板
    .license-panel {
      .license-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebeef5;

        .toolbar-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #303133;

          i {
            font-size: 20px;
            color: #409eff;
          }
        }

        .toolbar-actions {
          display: flex;
          gap: 8px;
        }
      }

      .license-status-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 15px;

        &.valid {
          background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
          border: 1px solid #e1f3d8;

          .status-left i {
            color: #67c23a;
          }

          .status-main {
            color: #67c23a;
          }
        }

        &.invalid {
          background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
          border: 1px solid #fde2e2;

          .status-left i {
            color: #f56c6c;
          }

          .status-main {
            color: #f56c6c;
          }
        }

        .status-left {
          display: flex;
          align-items: center;
          gap: 12px;

          i {
            font-size: 36px;
          }

          .status-text {
            .status-main {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 4px;
            }
          }
        }

        .status-right {
          display: flex;
          gap: 30px;

          .status-item {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .item-label {
              font-size: 12px;
              color: #909399;
            }

            .item-value {
              font-size: 13px;
              color: #303133;
              font-weight: 500;

              &.countdown {
                color: #e6a23c;
              }
            }
          }
        }
      }

      .license-collapse {
        ::v-deep .el-collapse-item__header {
          font-size: 13px;
          font-weight: 500;
          color: #606266;
          background: #f5f7fa;
          padding-left: 15px;
        }

        ::v-deep .el-collapse-item__content {
          padding: 15px;
        }
      }

      // 授权详细信息 - grid 卡片布局
      .license-detail-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .detail-item {
          background: #fafbfc;
          border: 1px solid #f0f2f5;
          border-radius: 6px;
          padding: 10px 14px;
          transition: all 0.2s;

          &:hover {
            background: #f5f7fa;
            border-color: #dcdfe6;
          }

          .detail-label {
            color: #909399;
            margin-bottom: 6px;
            font-weight: 500;
          }

          .detail-value {
            color: #303133;
            word-break: break-all;
            line-height: 1.5;
          }

          &.detail-item-full {
            grid-column: 1 / -1;
          }
        }
      }

      .mono-text {
        font-family: "Courier New", monospace;
        color: #606266;
        word-break: break-all;
      }

      .text-muted {
        color: #c0c4cc;
        font-size: 12px;
      }

      // 机器绑定信息
      .machine-info {
        .machine-row {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px dashed #ebeef5;

          &:last-child {
            border-bottom: none;
          }

          .machine-label {
            width: 90px;
            color: #909399;
            flex-shrink: 0;
          }

          .machine-value-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
          }

          .machine-id {
            flex: 1;
          }
        }
      }

      // 时间防护信息
      .time-info {
        .time-row {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px dashed #ebeef5;

          &:last-child {
            border-bottom: none;
          }

          .time-label {
            width: 90px;
            color: #909399;
            flex-shrink: 0;
          }

          .time-value {
            color: #303133;
          }
        }
      }

      // 授权文件信息已使用 .license-detail-grid 布局

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px 0;
        color: #c0c4cc;

        i {
          font-size: 40px;
          margin-bottom: 10px;
        }

        span {
          font-size: 13px;
        }
      }
    }
  }
}

// 授权导入弹窗样式
.import-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: #ecf5ff;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #409eff;

  i {
    font-size: 16px;
  }
}

.import-upload {
  ::v-deep .el-upload-dragger {
    padding: 30px 20px;
  }
}

.selected-file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  padding: 10px 15px;
  background: #f0f9eb;
  border-radius: 4px;
  font-size: 13px;

  i {
    font-size: 18px;
    color: #67c23a;
  }

  .file-name {
    color: #67c23a;
    font-weight: 500;
  }
}
</style>
