<template>
  <div class="license-manage">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <i class="el-icon-lock"></i>
        </div>
        <div class="header-text">
          <div class="page-title">授权管理</div>
          <div class="page-subtitle">Beehive License Manager · 软件授权保护</div>
        </div>
      </div>
      <div class="header-right">
        <el-button size="small" icon="el-icon-refresh" @click="loadData" :loading="loading">刷新状态</el-button>
        <el-button size="small" type="primary" icon="el-icon-upload2" @click="showImportDialog = true">导入授权</el-button>
        <el-button v-if="isAdmin" size="small" icon="el-icon-download" @click="handleDownload">下载授权</el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <!-- 左侧：授权状态概览 -->
      <el-col :span="8">
        <el-card class="status-card" shadow="hover" :body-style="{ padding: '0' }">
          <div class="status-banner" :class="{ valid: licenseData.valid, invalid: !licenseData.valid }">
            <div class="status-icon-wrap">
              <i :class="licenseData.valid ? 'el-icon-circle-check' : 'el-icon-warning-outline'"></i>
            </div>
            <div class="status-info">
              <div class="status-label">{{ licenseData.valid ? '授权有效' : '授权无效' }}</div>
              <div class="status-sub" v-if="licenseData.valid">
                <el-tag size="mini" :type="licenseTypeTag(licenseData.licenseType)" effect="dark">{{ licenseTypeLabel(licenseData.licenseType) }}</el-tag>
              </div>
              <div class="status-sub error" v-else>{{ licenseData.reason || '未知原因' }}</div>
            </div>
          </div>

          <div class="status-body">
            <!-- 过期倒计时 -->
            <div class="countdown-box" v-if="licenseData.valid && licenseData.expiresAt">
              <div class="countdown-label">距离过期</div>
              <div class="countdown-value">{{ countdownText }}</div>
              <div class="countdown-date">到期：{{ formatDate(licenseData.expiresAt) }}</div>
            </div>

            <div class="countdown-box expired" v-else-if="!licenseData.valid">
              <div class="countdown-label">授权状态</div>
              <div class="countdown-value">已失效</div>
              <div class="countdown-date">请导入新的授权文件</div>
            </div>

            <!-- 快捷信息 -->
            <div class="quick-list">
              <div class="quick-item">
                <i class="el-icon-suitcase"></i>
                <div class="quick-text">
                  <span class="quick-label">项目</span>
                  <span class="quick-value">{{ licenseData.projectName || '-' }}</span>
                </div>
              </div>
              <div class="quick-item">
                <i class="el-icon-user"></i>
                <div class="quick-text">
                  <span class="quick-label">客户</span>
                  <span class="quick-value">{{ licenseData.customer?.name || '-' }}</span>
                </div>
              </div>
              <div class="quick-item">
                <i class="el-icon-user-solid"></i>
                <div class="quick-text">
                  <span class="quick-label">最大用户数</span>
                  <span class="quick-value">{{ licenseData.maxUsers || '不限' }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：详细信息 -->
      <el-col :span="16">
        <!-- 授权详细信息 -->
        <el-card class="detail-card" shadow="hover">
          <div slot="header" class="card-header">
            <div class="header-icon-sm blue"><i class="el-icon-document"></i></div>
            <span>授权详细信息</span>
          </div>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="授权ID"><span class="mono">{{ licenseData.licenseId || '-' }}</span></el-descriptions-item>
            <el-descriptions-item label="项目ID"><span class="mono">{{ licenseData.projectId || '-' }}</span></el-descriptions-item>
            <el-descriptions-item label="项目名称">{{ licenseData.projectName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="授权类型">
              <el-tag size="small" :type="licenseTypeTag(licenseData.licenseType)">{{ licenseTypeLabel(licenseData.licenseType) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="签发时间">{{ formatTime(licenseData.issuedAt) }}</el-descriptions-item>
            <el-descriptions-item label="过期时间">{{ formatTime(licenseData.expiresAt) }}</el-descriptions-item>
            <el-descriptions-item label="客户名称">{{ licenseData.customer?.name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ licenseData.customer?.contact || '-' }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ licenseData.customer?.phone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ licenseData.customer?.email || '-' }}</el-descriptions-item>
            <el-descriptions-item label="功能模块" :span="2">
              <el-tag v-for="f in (licenseData.features || [])" :key="f" size="mini" effect="plain" style="margin-right: 4px; margin-bottom: 4px;">{{ f }}</el-tag>
              <span v-if="!licenseData.features || licenseData.features.length === 0" class="text-muted">全部功能</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-row :gutter="20">
          <!-- 机器绑定信息 -->
          <el-col :span="12">
            <el-card class="detail-card" shadow="hover">
              <div slot="header" class="card-header">
                <div class="header-icon-sm purple"><i class="el-icon-monitor"></i></div>
                <span>机器绑定</span>
                <el-tag v-if="licenseData.machineBound" size="mini" type="warning" style="margin-left: auto;">已绑定</el-tag>
                <el-tag v-else size="mini" type="success" style="margin-left: auto;">未绑定</el-tag>
              </div>
              <div class="machine-info">
                <div class="machine-row">
                  <span class="machine-label">当前机器ID</span>
                  <div class="machine-value-wrap">
                    <span class="machine-id">{{ licenseData.machineId || '-' }}</span>
                    <el-button v-if="licenseData.machineId" type="text" size="mini" icon="el-icon-document-copy" @click="copyMachineId"></el-button>
                  </div>
                </div>
                <div class="machine-row">
                  <span class="machine-label">绑定机器ID</span>
                  <span class="machine-id">{{ licenseData.boundMachineId || '未绑定（任意机器可用）' }}</span>
                </div>
                <div class="machine-row">
                  <span class="machine-label">匹配状态</span>
                  <el-tag :type="licenseData.machineMatched ? 'success' : 'danger'" size="small">
                    <i :class="licenseData.machineMatched ? 'el-icon-circle-check' : 'el-icon-circle-close'" style="margin-right: 4px;"></i>
                    {{ licenseData.machineMatched ? '匹配' : '不匹配' }}
                  </el-tag>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 时间防护状态 -->
          <el-col :span="12">
            <el-card class="detail-card" shadow="hover">
              <div slot="header" class="card-header">
                <div class="header-icon-sm orange"><i class="el-icon-time"></i></div>
                <span>时间防护</span>
                <el-button type="primary" size="mini" icon="el-icon-refresh" style="margin-left: auto;" @click="handleSyncTime" :loading="syncing">联网校准</el-button>
              </div>
              <div class="time-info">
                <div class="time-row">
                  <span class="time-label">时间守卫</span>
                  <el-tag :type="licenseData.timeGuard?.exists ? 'success' : 'info'" size="small">
                    {{ licenseData.timeGuard?.exists ? '已启用' : '未初始化' }}
                  </el-tag>
                </div>
                <div class="time-row">
                  <span class="time-label">上次验证</span>
                  <span class="time-value">{{ formatTime(licenseData.timeGuard?.lastVerifiedAt) }}</span>
                </div>
                <div class="time-row">
                  <span class="time-label">服务器时间</span>
                  <span class="time-value">{{ formatTime(licenseData.serverTime) }}</span>
                </div>
                <!-- 校准服务器行已隐藏，客户不需要看到时间源信息 -->
                <!-- <div class="time-row">
                  <span class="time-label">校准服务器</span>
                  <span class="time-value mono">{{ licenseConfig.licenseServerUrl }}</span>
                </div> -->
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 授权文件信息（仅管理员，占满整行） -->
    <el-card class="detail-card full-width" shadow="hover" v-if="isAdmin">
      <div slot="header" class="card-header">
        <div class="header-icon-sm green"><i class="el-icon-folder-opened"></i></div>
        <span>授权文件信息</span>
        <el-tag size="mini" type="info" style="margin-left: auto;">仅管理员可见</el-tag>
      </div>
      <div v-if="licenseData.licenseFile" class="file-info">
        <el-descriptions :column="4" border size="small">
          <el-descriptions-item label="文件路径" :span="2"><span class="mono">{{ licenseData.licenseFile.path }}</span></el-descriptions-item>
          <el-descriptions-item label="文件名">{{ licenseData.licenseFile.fileName }}</el-descriptions-item>
          <el-descriptions-item label="文件大小">{{ licenseData.licenseFile.sizeFormatted }}</el-descriptions-item>
          <el-descriptions-item label="最后修改" :span="2">{{ formatTime(licenseData.licenseFile.lastModified) }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-else class="empty-state">
        <i class="el-icon-document-delete"></i>
        <span>授权文件不存在，请先导入授权文件</span>
      </div>
    </el-card>

    <!-- 导入授权弹窗 -->
    <el-dialog title="导入授权文件" :visible.sync="showImportDialog" width="500px" :close-on-click-modal="false" custom-class="license-import-dialog">
      <div class="import-tip">
        <i class="el-icon-info"></i>
        <span>请上传由 Beehive 授权管理系统签发的 <b>.lic</b> 授权文件</span>
      </div>
      <el-upload
        class="import-upload"
        drag
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
        accept=".lic"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将 <em>.lic</em> 文件拖到此处，或<em>点击上传</em></div>
      </el-upload>

      <div v-if="selectedFile" class="selected-file-info">
        <i class="el-icon-document-checked"></i>
        <span class="file-name">{{ selectedFile.name }}</span>
        <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
      </div>

      <div slot="footer">
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" :loading="importing" :disabled="!selectedFile" @click="handleImport">确认导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLicenseStatus, importLicense, syncLicenseTime, downloadLicense } from '@/api'
import licenseConfig from '@/config/license.config'

export default {
  name: 'LicenseManage',
  data() {
    return {
      licenseConfig,
      licenseData: {},
      loading: false,
      showImportDialog: false,
      selectedFile: null,
      importing: false,
      syncing: false,
      countdownTimer: null,
      countdownText: ''
    }
  },
  computed: {
    isAdmin() {
      return this.$store?.state?.user?.userInfo?.role === 'administrator'
    }
  },
  created() {
    this.loadData()
  },
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await getLicenseStatus()
        this.licenseData = res.data || {}
        this.startCountdown()
      } catch (e) {
        this.$message.error('获取授权状态失败')
      } finally {
        this.loading = false
      }
    },

    startCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
      }
      if (!this.licenseData.valid || !this.licenseData.expiresAt) {
        this.countdownText = '-'
        return
      }
      const update = () => {
        const diff = this.licenseData.expiresAt - Date.now()
        if (diff <= 0) {
          this.countdownText = '已过期'
          return
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        this.countdownText = `${days}天 ${hours}时 ${minutes}分`
      }
      update()
      this.countdownTimer = setInterval(update, 60000)
    },

    handleFileChange(file) {
      this.selectedFile = file.raw
    },

    async handleImport() {
      if (!this.selectedFile) return
      this.importing = true
      try {
        await importLicense(this.selectedFile)
        this.$message.success('授权文件导入成功')
        this.showImportDialog = false
        this.selectedFile = null
        await this.loadData()
      } catch (e) {
        // 错误已在拦截器提示
      } finally {
        this.importing = false
      }
    },

    async handleSyncTime() {
      this.syncing = true
      try {
        const res = await syncLicenseTime()
        this.$message.success(res.data?.message || '时间校准成功')
        await this.loadData()
      } catch (e) {
        // 错误已在拦截器提示
      } finally {
        this.syncing = false
      }
    },

    async handleDownload() {
      try {
        const res = await downloadLicense()
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'license.lic')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        this.$message.success('授权文件下载成功')
      } catch (e) {
        this.$message.error('下载失败')
      }
    },

    copyMachineId() {
      if (this.licenseData.machineId) {
        const textarea = document.createElement('textarea')
        textarea.value = this.licenseData.machineId
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
          this.$message.success('机器ID已复制')
        } catch (e) {
          this.$message.error('复制失败，请手动复制')
        }
        document.body.removeChild(textarea)
      }
    },

    formatTime(timestamp) {
      if (!timestamp) return '-'
      const d = new Date(timestamp)
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },

    formatDate(timestamp) {
      if (!timestamp) return '-'
      const d = new Date(timestamp)
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    },

    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    },

    licenseTypeLabel(type) {
      const map = { trial: '试用版', standard: '标准版', enterprise: '企业版', perpetual: '永久版' }
      return map[type] || type || '-'
    },

    licenseTypeTag(type) {
      const map = { trial: 'info', standard: '', enterprise: 'warning', perpetual: 'success' }
      return map[type] || ''
    }
  }
}
</script>

<style lang="less" scoped>
.license-manage {
  padding: 16px;
  background: #f0f2f5;
  min-height: calc(100vh - 84px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px;
  }

  .page-title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a2e;
  }

  .page-subtitle {
    font-size: 13px;
    color: #909399;
    margin-top: 6px;
    line-height: 1.5;
  }

  .header-right {
    display: flex;
    gap: 8px;
  }
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 15px;
}

.header-icon-sm {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;

  &.blue { background: linear-gradient(135deg, #4facfe, #00f2fe); }
  &.purple { background: linear-gradient(135deg, #a18cd1, #fbc2eb); }
  &.orange { background: linear-gradient(135deg, #fa709a, #fee140); }
  &.green { background: linear-gradient(135deg, #43e97b, #38f9d7); }
}

/* 状态卡片 */
.status-card {
  border-radius: 12px;
  overflow: hidden;
}

.status-banner {
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 16px;

  &.valid {
    background: linear-gradient(135deg, #11998e, #38ef7d);
    color: #fff;
  }
  &.invalid {
    background: linear-gradient(135deg, #eb3349, #f45c43);
    color: #fff;
  }

  .status-icon-wrap {
    font-size: 48px;
    flex-shrink: 0;
  }

  .status-label {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .status-sub {
    font-size: 13px;
    opacity: 0.9;
    &.error { font-weight: 500; }
  }
}

.status-body {
  padding: 20px 24px;
}

/* 倒计时 */
.countdown-box {
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa, #e8ecf1);
  border-radius: 10px;
  margin-bottom: 16px;

  &.expired {
    background: linear-gradient(135deg, #fef0f0, #fde2e2);
  }

  .countdown-label {
    font-size: 12px;
    color: #909399;
    margin-bottom: 6px;
  }

  .countdown-value {
    font-size: 24px;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 4px;
  }

  &.expired .countdown-value {
    color: #f56c6c;
  }

  .countdown-date {
    font-size: 12px;
    color: #c0c4cc;
  }
}

/* 快捷信息 */
.quick-list {
  .quick-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    i {
      font-size: 18px;
      color: #667eea;
      width: 24px;
      text-align: center;
    }

    .quick-text {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .quick-label {
      font-size: 13px;
      color: #909399;
    }

    .quick-value {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
    }
  }
}

/* 详情卡片 */
.detail-card {
  margin-bottom: 16px;
  border-radius: 12px;

  /deep/ .el-card__header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  /deep/ .el-descriptions__label {
    line-height: 1.8;
    padding: 10px 12px;
  }

  /deep/ .el-descriptions__content {
    line-height: 1.8;
    padding: 10px 12px;
  }
}

/* 占满整行的卡片 */
.detail-card.full-width {
  width: 100%;
  margin-top: 0;

  /deep/ .el-descriptions__label {
    padding: 16px 20px;
    font-size: 14px;
    font-weight: 500;
  }

  /deep/ .el-descriptions__content {
    padding: 16px 20px;
    font-size: 14px;
  }
}

.mono {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #606266;
  word-break: break-all;
}

.text-muted {
  color: #c0c4cc;
  font-size: 13px;
}

/* 机器信息 */
.machine-info {
  min-height: 168px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .machine-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #f5f5f5;
    line-height: 1.6;

    &:last-child {
      border-bottom: none;
    }

    .machine-label {
      font-size: 13px;
      color: #909399;
      flex-shrink: 0;
    }

    .machine-value-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      justify-content: flex-end;
      overflow: hidden;
      min-width: 0;
    }

    .machine-id {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #606266;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: right;
      flex: 1;
      min-width: 0;
    }
  }
}

/* 时间信息 */
.time-info {
  min-height: 168px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .time-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #f5f5f5;
    line-height: 1.6;

    &:last-child {
      border-bottom: none;
    }

    .time-label {
      font-size: 13px;
      color: #909399;
      flex-shrink: 0;
    }

    .time-value {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
      text-align: right;
    }
  }
}

/* 文件信息空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #c0c4cc;

  i {
    font-size: 48px;
    margin-bottom: 12px;
  }

  span {
    font-size: 14px;
  }
}

/* 导入弹窗 */
.import-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #ecf5ff;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #409eff;

  i {
    font-size: 16px;
  }
}

.import-upload {
  margin-bottom: 16px;
}

.selected-file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0f9eb;
  border-radius: 8px;
  font-size: 13px;

  i {
    color: #67c23a;
    font-size: 18px;
  }

  .file-name {
    color: #303133;
    font-weight: 500;
  }

  .file-size {
    color: #909399;
    margin-left: auto;
  }
}
</style>
