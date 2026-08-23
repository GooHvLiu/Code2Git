<template>
  <div class="license-import-page">
    <div class="license-bg"></div>

    <div class="license-container">
      <!-- 左侧：品牌信息 -->
      <div class="brand-panel">
        <div class="brand-logo">🔐</div>
        <h1 class="brand-title">软件授权管理</h1>
        <p class="brand-desc">Beehive License Manager</p>
        <div class="brand-features">
          <div class="feature-item">
            <i class="el-icon-lock"></i>
            <span>RSA 非对称签名</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-time"></i>
            <span>防时间回退</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-monitor"></i>
            <span>机器指纹绑定</span>
          </div>
        </div>
      </div>

      <!-- 右侧：授权导入表单 -->
      <div class="form-panel">
        <h2 class="form-title">
          <i class="el-icon-document-checked"></i>
          导入授权文件
        </h2>

        <!-- 当前授权状态 -->
        <div v-if="licenseStatus" class="status-card" :class="{ valid: licenseStatus.valid, invalid: !licenseStatus.valid }">
          <div class="status-icon">
            <i :class="licenseStatus.valid ? 'el-icon-success' : 'el-icon-warning'"></i>
          </div>
          <div class="status-info">
            <div class="status-label">{{ licenseStatus.valid ? '授权有效' : '授权无效' }}</div>
            <div v-if="licenseStatus.valid" class="status-detail">
              过期时间：{{ formatTime(licenseStatus.expiresAt) }}
            </div>
            <div v-else class="status-detail error">
              {{ licenseStatus.reason }}
            </div>
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
            将 <em>.lic</em> 授权文件拖到此处，或<em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            仅支持 .lic 格式的授权文件，最大 1MB
          </div>
        </el-upload>

        <!-- 已选择文件展示 -->
        <div v-if="selectedFile" class="selected-file">
          <div class="file-info">
            <i class="el-icon-document"></i>
            <div class="file-detail">
              <div class="file-name">{{ selectedFile.name }}</div>
              <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
            </div>
          </div>
          <el-button type="text" icon="el-icon-close" @click="clearSelectedFile">移除</el-button>
        </div>

        <!-- 授权信息展示（导入成功后） -->
        <div v-if="importedLicense" class="license-info-card">
          <div class="info-header">
            <i class="el-icon-circle-check"></i>
            <span>授权导入成功</span>
          </div>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="授权ID">{{ importedLicense.licenseId }}</el-descriptions-item>
            <el-descriptions-item label="项目">{{ importedLicense.projectName }}</el-descriptions-item>
            <el-descriptions-item label="授权类型">{{ licenseTypeLabel(importedLicense.licenseType) }}</el-descriptions-item>
            <el-descriptions-item label="签发时间">{{ formatTime(importedLicense.issuedAt) }}</el-descriptions-item>
            <el-descriptions-item label="过期时间">{{ formatTime(importedLicense.expiresAt) }}</el-descriptions-item>
            <el-descriptions-item label="最大用户数">{{ importedLicense.maxUsers || '不限' }}</el-descriptions-item>
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
            导入授权
          </el-button>
          <el-button
            v-if="importedLicense"
            type="success"
            size="medium"
            @click="handleGoHome"
          >
            <i class="el-icon-house"></i>
            进入系统
          </el-button>
          <el-button
            size="medium"
            @click="handleRefreshStatus"
          >
            <i class="el-icon-refresh"></i>
            刷新状态
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLicenseStatus, importLicense } from '@/api/license'
import { ROUTE_PATHS } from '@/router/pathConstants'
import { resetLicenseCache } from '@/router/permission'

export default {
  name: 'LicenseImport',
  data() {
    return {
      licenseStatus: null,
      selectedFile: null,
      importing: false,
      importedLicense: null
    }
  },
  created() {
    this.loadStatus()
  },
  methods: {
    /**
     * 加载当前授权状态
     */
    async loadStatus() {
      try {
        const res = await getLicenseStatus()
        this.licenseStatus = res.data
      } catch (e) {
        this.licenseStatus = { valid: false, reason: '无法获取授权状态，请检查后端服务' }
      }
    },

    /**
     * 刷新授权状态
     */
    handleRefreshStatus() {
      this.importedLicense = null
      this.loadStatus()
    },

    /**
     * 文件选择变化
     */
    handleFileChange(file) {
      this.selectedFile = file.raw
      this.importedLicense = null
    },

    /**
     * 清除已选择的文件
     */
    clearSelectedFile() {
      this.selectedFile = null
      this.importedLicense = null
    },

    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    },

    /**
     * 导入授权文件
     */
    async handleImport() {
      if (!this.selectedFile) {
        this.$message.warning('请先选择授权文件')
        return
      }

      this.importing = true
      try {
        const res = await importLicense(this.selectedFile)
        this.importedLicense = res.data
        this.$message.success('授权文件导入成功')
        // 重置授权缓存，下次路由跳转时重新检查
        resetLicenseCache()
        // 刷新状态
        await this.loadStatus()
      } catch (e) {
        // 错误已在拦截器提示
      } finally {
        this.importing = false
      }
    },

    /**
     * 进入系统（跳转到首页或登录页）
     */
    handleGoHome() {
      // 如果有 token 跳首页，没有跳登录
      const token = this.$store?.state?.user?.token
      if (token) {
        this.$router.push(ROUTE_PATHS.HOME)
      } else {
        this.$router.push(ROUTE_PATHS.LOGIN)
      }
    },

    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      if (!timestamp) return '永久有效'
      const d = new Date(timestamp)
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },

    /**
     * 授权类型标签
     */
    licenseTypeLabel(type) {
      const map = {
        trial: '试用版',
        standard: '标准版',
        enterprise: '企业版',
        perpetual: '永久版'
      }
      return map[type] || type
    }
  }
}
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
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.license-container {
  display: flex;
  width: 900px;
  max-width: 90vw;
  min-height: 560px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* 左侧品牌面板 */
.brand-panel {
  width: 360px;
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

  &.valid {
    background: #f0f9eb;
    border: 1px solid #e1f3d8;
    .status-icon i { color: #67c23a; }
    .status-label { color: #67c23a; }
  }

  &.invalid {
    background: #fef0f0;
    border: 1px solid #fde2e2;
    .status-icon i { color: #f56c6c; }
    .status-label { color: #f56c6c; }
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
}

.status-detail {
  font-size: 12px;
  color: #909399;

  &.error {
    color: #f56c6c;
  }
}

/* 上传区域 */
.license-upload {
  margin-bottom: 20px;

  ::v-deep .el-upload-dragger {
    padding: 24px;
    border-radius: 10px;
    transition: all 0.3s;

    &:hover {
      border-color: #667eea;
    }
  }

  ::v-deep .el-upload__text {
    font-size: 14px;
    color: #606266;

    em {
      color: #667eea;
      font-style: normal;
    }
  }

  ::v-deep .el-upload__tip {
    font-size: 12px;
    color: #c0c4cc;
    margin-top: 8px;
  }
}

/* 已选择文件展示 */
.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 8px;
  margin-bottom: 20px;
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
  margin-top: auto;
  display: flex;
  gap: 12px;
  padding-top: 20px;
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
