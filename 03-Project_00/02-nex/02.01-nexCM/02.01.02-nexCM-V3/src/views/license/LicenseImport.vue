<template>
  <div class="license-import-page">
    <div class="license-bg"></div>

    <div class="license-container">
      <!-- 左侧：品牌信息 -->
      <div class="brand-panel">
        <div class="brand-logo">🔐</div>
        <h1 class="brand-title">{{ $t("license.brandTitle") }}</h1>
        <p class="brand-desc">{{ $t("license.brandDesc") }}</p>
        <div class="brand-features">
          <div class="feature-item">
            <i class="el-icon-lock"></i>
            <span>{{ $t("license.featureRsa") }}</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-time"></i>
            <span>{{ $t("license.featureTimeGuard") }}</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-monitor"></i>
            <span>{{ $t("license.featureMachineBind") }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧：授权导入表单 -->
      <div class="form-panel">
        <h2 class="form-title">
          <i class="el-icon-document-checked"></i>
          {{ $t("license.importFormTitle") }}
        </h2>

        <!-- 当前授权状态 -->
        <div
          class="status-card"
          :class="{
            valid: licenseStatus?.valid,
            invalid: !licenseStatus?.valid,
          }"
          :style="{ visibility: licenseStatus ? 'visible' : 'hidden' }"
        >
          <div class="status-icon">
            <i
              :class="
                licenseStatus?.valid ? 'el-icon-success' : 'el-icon-warning'
              "
            ></i>
          </div>
          <div class="status-info">
            <div class="status-label">
              {{
                licenseStatus?.valid
                  ? $t("license.statusValid")
                  : $t("license.statusInvalid")
              }}
            </div>
            <div v-if="licenseStatus?.valid" class="status-detail">
              {{ $t("license.expireTime") }}：{{
                formatTime(licenseStatus.expiresAt)
              }}
            </div>
            <div v-else class="status-detail error">
              {{ formatLicenseReason(licenseStatus?.reason) }}
            </div>
          </div>
        </div>

        <!-- 机器码展示区域 -->
        <div class="machine-id-card">
          <div class="machine-id-header">
            <i class="el-icon-cpu"></i>
            <span class="machine-id-title">{{
              $t("license.currentMachineId")
            }}</span>
          </div>
          <div class="machine-id-content">
            <span class="machine-id-text mono-text">{{
              currentMachineId || "-"
            }}</span>
            <el-button
              v-if="currentMachineId"
              type="text"
              icon="el-icon-document-copy"
              @click="copyMachineId"
              :loading="copyingMachineId"
            >
              {{ $t("license.copy") }}
            </el-button>
          </div>
          <div class="machine-id-tip">
            <i class="el-icon-info"></i>
            <span>{{ $t("license.machineIdTip") }}</span>
          </div>
        </div>

        <!-- 上传区域 -->
        <el-upload
          class="license-upload"
          drag
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleFileChange"
          accept=".lic"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $t("license.dragUploadTip") }}
          </div>
          <div class="el-upload__tip" slot="tip">
            {{ $t("license.fileSizeTip") }}
          </div>
        </el-upload>

        <!-- 已选择文件展示 -->
        <div v-if="selectedFile" class="selected-file">
          <div class="file-info">
            <i class="el-icon-document"></i>
            <div class="file-detail">
              <div class="file-name">{{ selectedFile.name }}</div>
              <div class="file-size">
                {{ formatFileSize(selectedFile.size) }}
              </div>
            </div>
          </div>
          <el-button
            type="text"
            icon="el-icon-close"
            @click="clearSelectedFile"
            >{{ $t("license.remove") }}</el-button
          >
        </div>

        <!-- 授权信息展示（导入成功后） -->
        <div v-if="importedLicense" class="license-info-card">
          <div class="info-header">
            <i class="el-icon-circle-check"></i>
            <span>{{ $t("license.importSuccessTitle") }}</span>
          </div>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item :label="$t('license.licenseId')">{{
              importedLicense.licenseId
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.project')">{{
              importedLicense.projectName
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.licenseType')">{{
              licenseTypeLabel(importedLicense.licenseType)
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.issuedAt')">{{
              formatTime(importedLicense.issuedAt)
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.expireTime')">{{
              formatTime(importedLicense.expiresAt)
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('license.maxUsers')">{{
              importedLicense.maxUsers || $t("license.unlimited")
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button
            type="primary"
            size="medium"
            :loading="importing"
            :disabled="!selectedFile"
            @click="handleImport"
          >
            <i class="el-icon-upload2"></i>
            {{ $t("license.importLicense") }}
          </el-button>
          <el-button
            v-if="importedLicense"
            type="success"
            size="medium"
            @click="handleGoHome"
          >
            <i class="el-icon-house"></i>
            {{ $t("license.enterSystem") }}
          </el-button>
          <el-button size="medium" @click="handleRefreshStatus">
            <i class="el-icon-refresh"></i>
            {{ $t("license.refreshStatus") }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLicenseStatus, importLicense } from "@/api";
import { ROUTE_PATHS } from "@/router/pathConstants";
import { resetLicenseCache } from "@/router/permission";

export default {
  name: "LicenseImport",
  data() {
    return {
      licenseStatus: null,
      selectedFile: null,
      importing: false,
      importedLicense: null,
      currentMachineId: "",
      copyingMachineId: false,
      statusLoading: true,
    };
  },
  created() {
    this.loadStatus();
  },
  methods: {
    /**
     * 加载当前授权状态
     */
    async loadStatus() {
      this.statusLoading = true;
      try {
        const res = await getLicenseStatus();
        this.licenseStatus = res.data;
        // 从授权状态数据中获取机器码
        this.currentMachineId = res.data?.machineId || "";
      } catch (e) {
        this.licenseStatus = {
          valid: false,
          reason: this.$t("license.cannotGetStatus"),
        };
      } finally {
        this.statusLoading = false;
      }
    },

    /**
     * 刷新授权状态
     */
    handleRefreshStatus() {
      this.importedLicense = null;
      this.loadStatus();
    },

    /**
     * 文件选择变化
     */
    handleFileChange(file) {
      this.selectedFile = file.raw;
      this.importedLicense = null;
    },

    /**
     * 清除已选择的文件
     */
    clearSelectedFile() {
      this.selectedFile = null;
      this.importedLicense = null;
    },

    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    },

    /**
     * 导入授权文件
     */
    async handleImport() {
      if (!this.selectedFile) {
        this.$message.warning(this.$t("license.pleaseSelectFile"));
        return;
      }

      this.importing = true;
      try {
        const res = await importLicense(this.selectedFile);
        this.importedLicense = res.data;
        this.$message.success(this.$t("license.importSuccess"));
        // 重置授权缓存，下次路由跳转时重新检查
        resetLicenseCache();
        // 刷新状态
        await this.loadStatus();
      } catch (e) {
        // 错误已在拦截器提示
      } finally {
        this.importing = false;
      }
    },

    /**
     * 进入系统（跳转到首页或登录页）
     */
    handleGoHome() {
      // 如果有 token 跳首页，没有跳登录
      const token = this.$store?.state?.user?.token;
      if (token) {
        this.$router.push(ROUTE_PATHS.HOME);
      } else {
        this.$router.push(ROUTE_PATHS.LOGIN);
      }
    },

    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      if (!timestamp) return this.$t("license.permanentValid");
      const d = new Date(timestamp);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },

    /**
     * 授权类型标签
     */
    licenseTypeLabel(type) {
      const map = {
        trial: this.$t("license.typeTrial"),
        standard: this.$t("license.typeStandard"),
        enterprise: this.$t("license.typeEnterprise"),
        perpetual: this.$t("license.typePerpetual"),
      };
      return map[type] || type;
    },

    /**
     * 格式化授权失效原因（国际化映射）
     * 根据后端返回的中文 reason 关键词，映射成国际化文案
     */
    formatLicenseReason(reason) {
      if (!reason) return this.$t("license.reasonUnknown");
      // 根据关键词匹配
      if (reason.includes("不存在") || reason.includes("验证失败")) {
        return this.$t("license.reasonFileNotFound");
      }
      if (reason.includes("项目不匹配")) {
        return this.$t("license.reasonProjectMismatch");
      }
      if (reason.includes("机器不匹配") || reason.includes("硬件绑定")) {
        return this.$t("license.reasonMachineMismatch");
      }
      if (reason.includes("已过期")) {
        return this.$t("license.reasonExpired");
      }
      if (reason.includes("缺少功能") || reason.includes("功能授权")) {
        return this.$t("license.reasonMissingFeatures");
      }
      if (reason.includes("时间回退") || reason.includes("回退")) {
        return this.$t("license.reasonTimeRollback");
      }
      if (reason.includes("联网校准失败") || reason.includes("校准失败")) {
        return this.$t("license.reasonNetworkSyncFailed");
      }
      // 未知原因，返回原文
      return reason;
    },

    /**
     * 复制机器码到剪贴板
     */
    async copyMachineId() {
      if (!this.currentMachineId) return;
      this.copyingMachineId = true;
      try {
        const textarea = document.createElement("textarea");
        textarea.value = this.currentMachineId;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        this.$message.success(this.$t("license.copySuccess"));
      } catch (e) {
        this.$message.error(this.$t("license.copyFailed"));
      } finally {
        this.copyingMachineId = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.license-import-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.license-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 20% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.license-container {
  display: grid;
  grid-template-columns: 300px 1fr; /* 左边 300px，右边占剩余 */
  // display: flex;
  width: 900px;
  max-width: 90vw;
  min-height: 400px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* 左侧品牌面板 */
.brand-panel {
  background: linear-gradient(160deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  padding: 48px 36px;
  display: flex;
  flex-direction: column;
}

.brand-logo {
  font-size: 56px;
  margin-bottom: 20px;
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.brand-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 40px 0;
}

.brand-features {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);

  i {
    font-size: 18px;
    color: #667eea;
  }
}

/* 右侧表单面板 */
.form-panel {
  flex: 1;
  min-width: 0;
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    color: #667eea;
  }
}

/* 授权状态卡片 */
.status-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 20px;
  min-height: 60px;
  box-sizing: border-box;

  &.valid {
    background: #f0f9eb;
    border: 1px solid #e1f3d8;
    .status-icon i {
      color: #67c23a;
    }
    .status-label {
      color: #67c23a;
    }
  }

  &.invalid {
    background: #fef0f0;
    border: 1px solid #fde2e2;
    .status-icon i {
      color: #f56c6c;
    }
    .status-label {
      color: #f56c6c;
    }
  }
}

.status-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.status-info {
  flex: 1;
}

.status-label {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
  min-height: 20px;
  line-height: 20px;
}

.status-detail {
  font-size: 12px;
  color: #909399;
  min-height: 18px;
  line-height: 18px;

  &.error {
    color: #f56c6c;
  }
}

/* 机器码展示区域 */
.machine-id-card {
  background: #f8f9fb;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  padding: 16px 18px;
  margin-bottom: 20px;
  overflow: hidden;

  .machine-id-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    i {
      font-size: 16px;
      color: #667eea;
    }

    .machine-id-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
  }

  .machine-id-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 10px;

    .machine-id-text {
      flex: 1;
      min-width: 0;
      font-size: 13px;
      color: #606266;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .machine-id-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #909399;

    i {
      color: #409eff;
    }
  }
}

/* 上传区域 */
.license-upload {
  margin-bottom: 20px;
  width: 100%;
  display: block;

  ::v-deep .el-upload {
    width: 100% !important;
    display: block !important;
  }

  ::v-deep .el-upload-dragger {
    width: 100% !important;
    height: auto !important;
    min-height: 80px !important;
    padding: 12px 16px !important;
    border-radius: 10px;
    transition: all 0.3s;
    box-sizing: border-box;
    display: flex !important;
    align-items: center !important;
    gap: 12px;

    &:hover {
      border-color: #667eea;
    }

    .el-icon-upload {
      font-size: 24px !important;
      line-height: 1 !important;
      margin: 0 !important;
      color: #c0c4cc;
      flex-shrink: 0;
    }

    .el-upload__text {
      flex: 1;
      font-size: 14px !important;
      line-height: 1.4 !important;
      margin: 0 !important;
      color: #606266;
      text-align: left;

      em {
        color: #667eea;
        font-style: normal;
      }
    }
  }

  ::v-deep .el-upload__tip {
    font-size: 12px;
    color: #c0c4cc;
    margin-top: 6px;
    line-height: 1.4;
    padding-left: 4px;
  }
}

/* 已选择文件展示 */
.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-sizing: border-box;

  .el-button {
    flex-shrink: 0;
    margin-left: 12px;
  }
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-info i {
  font-size: 28px;
  color: #409eff;
}

.file-detail {
  .file-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    word-break: break-all;
  }
  .file-size {
    font-size: 12px;
    color: #909399;
    margin-top: 2px;
  }
}

/* 授权信息卡片 */
.license-info-card {
  margin-bottom: 20px;
  border: 1px solid #e1f3d8;
  border-radius: 10px;
  overflow: hidden;
}

.info-header {
  background: #f0f9eb;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #67c23a;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 操作按钮 */
.form-actions {
  display: flex;
}

/* 响应式 */
@media (max-width: 768px) {
  .license-container {
    flex-direction: column;
    width: 95vw;
  }

  .brand-panel {
    width: 100%;
    padding: 32px 24px;
  }

  .form-panel {
    padding: 28px 24px;
  }
}
</style>
