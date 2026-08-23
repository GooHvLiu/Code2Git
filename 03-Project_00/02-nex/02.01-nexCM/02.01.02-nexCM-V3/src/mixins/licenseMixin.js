/**
 * ==========================================
 * 授权管理 Mixin
 * ==========================================
 * 授权管理页面的通用数据和方法
 * 可在任意组件中 mixins: [licenseMixin] 使用
 *
 * 使用示例：
 * import licenseMixin from '@/mixins/licenseMixin'
 * export default {
 *   mixins: [licenseMixin],
 *   // ...
 * }
 */
import { getLicenseStatus, importLicense, syncLicenseTime, downloadLicense } from '@/api'
import { formatLicenseTime, licenseTypeTag, licenseTypeLabel, copyToClipboard, getLicenseCountdown } from '@/utils/licenseHelper'

export default {
  data() {
    return {
      // 授权数据
      licenseData: {},
      licenseLoading: false,
      licenseSyncing: false,
      licenseImporting: false,
      // 授权导入弹窗
      showLicenseImport: false,
      selectedLicenseFile: null,
      // 授权倒计时
      licenseCountdown: '',
      licenseCountdownTimer: null,
      // 折叠面板默认展开项（空数组表示全部折叠）
      licenseActiveNames: []
    }
  },
  beforeDestroy() {
    if (this.licenseCountdownTimer) {
      clearInterval(this.licenseCountdownTimer)
    }
  },
  methods: {
    /**
     * 加载授权状态数据
     */
    async loadLicenseData() {
      this.licenseLoading = true
      try {
        const res = await getLicenseStatus()
        this.licenseData = res.data || {}
        this.startLicenseCountdown()
      } catch (e) {
        // 获取失败不影响其他功能
      } finally {
        this.licenseLoading = false
      }
    },

    /**
     * 启动授权过期倒计时
     */
    startLicenseCountdown() {
      if (this.licenseCountdownTimer) {
        clearInterval(this.licenseCountdownTimer)
      }
      if (!this.licenseData.valid || !this.licenseData.expiresAt) {
        this.licenseCountdown = '-'
        return
      }
      const update = () => {
        this.licenseCountdown = getLicenseCountdown(this.licenseData.expiresAt)
      }
      update()
      this.licenseCountdownTimer = setInterval(update, 60000)
    },

    /**
     * 处理授权文件选择
     */
    handleLicenseFileChange(file) {
      this.selectedLicenseFile = file.raw
    },

    /**
     * 导入授权文件
     */
    async handleImportLicense() {
      if (!this.selectedLicenseFile) return
      this.licenseImporting = true
      try {
        await importLicense(this.selectedLicenseFile)
        this.$message.success(this.$t('license.importSuccess'))
        this.showLicenseImport = false
        this.selectedLicenseFile = null
        await this.loadLicenseData()
      } catch (e) {
        // 错误已在拦截器提示
      } finally {
        this.licenseImporting = false
      }
    },

    /**
     * 下载授权文件
     */
    async handleDownloadLicense() {
      try {
        const res = await downloadLicense()
        const blob = new Blob([res.data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `license_${Date.now()}.lic`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (e) {
        this.$message.error(this.$t('license.downloadFailed'))
      }
    },

    /**
     * 联网诊断（时间校准）
     */
    async handleSyncLicenseTime() {
      this.licenseSyncing = true
      try {
        const res = await syncLicenseTime()
        if (res.code === 200) {
          const data = res.data || {}
          this.$message.success(`${this.$t('license.networkDiagnosisSuccess')}，时间源: ${data.source || '未知'}，时间偏移: ${Math.round(data.offset || 0)}ms`)
        } else {
          this.$message.error(res.msg || this.$t('license.networkDiagnosisFailed'))
        }
        await this.loadLicenseData()
      } catch (e) {
        this.$message.error(this.$t('license.networkDiagnosisFailed'))
      } finally {
        this.licenseSyncing = false
      }
    },

    /**
     * 复制机器ID到剪贴板
     */
    async copyMachineId() {
      const text = this.licenseData.machineId
      if (!text) return
      const success = await copyToClipboard(text)
      if (success) {
        this.$message.success(this.$t('license.copySuccess'))
      } else {
        this.$message.error('复制失败')
      }
    },

    // 工具函数代理（方便模板中直接使用）
    formatLicenseTime,
    licenseTypeTag,
    licenseTypeLabel
  }
}
