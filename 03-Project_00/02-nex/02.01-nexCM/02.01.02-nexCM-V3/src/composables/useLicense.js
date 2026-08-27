/**
 * useLicense - 授权管理组合式函数
 * 授权管理页面的通用数据和方法
 * 替代原 mixins/licenseMixin.js
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { getLicenseStatus, importLicense, syncLicenseTime, downloadLicense } from '@/api'
import { formatLicenseTime, licenseTypeTag, licenseTypeLabel, copyToClipboard, getLicenseCountdown } from '@/utils/licenseHelper'

export function useLicense() {
  const licenseData = ref({})
  const licenseLoading = ref(false)
  const licenseSyncing = ref(false)
  const licenseImporting = ref(false)
  const showLicenseImport = ref(false)
  const selectedLicenseFile = ref(null)
  const licenseCountdown = ref('')
  let licenseCountdownTimer = null
  const licenseActiveNames = ref([])

  async function loadLicenseData() {
    licenseLoading.value = true
    try {
      const res = await getLicenseStatus()
      licenseData.value = res.data || {}
      startLicenseCountdown()
    } catch (e) {
      // 获取失败不影响其他功能
    } finally {
      licenseLoading.value = false
    }
  }

  function startLicenseCountdown() {
    if (licenseCountdownTimer) {
      clearInterval(licenseCountdownTimer)
    }
    if (!licenseData.value.valid || !licenseData.value.expiresAt) {
      licenseCountdown.value = '-'
      return
    }
    const update = () => {
      licenseCountdown.value = getLicenseCountdown(licenseData.value.expiresAt)
    }
    update()
    licenseCountdownTimer = setInterval(update, 60000)
  }

  function handleLicenseFileChange(file) {
    selectedLicenseFile.value = file.raw
  }

  async function handleImportLicense() {
    if (!selectedLicenseFile.value) return
    licenseImporting.value = true
    try {
      await importLicense(selectedLicenseFile.value)
      showLicenseImport.value = false
      selectedLicenseFile.value = null
      await loadLicenseData()
    } catch (e) {
      // 错误已在拦截器提示
    } finally {
      licenseImporting.value = false
    }
  }

  async function handleDownloadLicense() {
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
      // 错误已在拦截器提示
    }
  }

  async function handleSyncLicenseTime() {
    licenseSyncing.value = true
    try {
      const res = await syncLicenseTime()
      if (res.code === 200) {
        // 成功提示由调用方处理
      }
      await loadLicenseData()
    } catch (e) {
      // 错误已在拦截器提示
    } finally {
      licenseSyncing.value = false
    }
  }

  async function copyMachineId() {
    const text = licenseData.value.machineId
    if (!text) return
    return await copyToClipboard(text)
  }

  onMounted(() => {
    loadLicenseData()
  })

  onUnmounted(() => {
    if (licenseCountdownTimer) {
      clearInterval(licenseCountdownTimer)
    }
  })

  return {
    // 状态
    licenseData,
    licenseLoading,
    licenseSyncing,
    licenseImporting,
    showLicenseImport,
    selectedLicenseFile,
    licenseCountdown,
    licenseActiveNames,
    // 方法
    loadLicenseData,
    startLicenseCountdown,
    handleLicenseFileChange,
    handleImportLicense,
    handleDownloadLicense,
    handleSyncLicenseTime,
    copyMachineId,
    // 工具函数
    formatLicenseTime,
    licenseTypeTag,
    licenseTypeLabel
  }
}
