/**
 * useLicense - 授权管理组合式函数
 * 授权管理页面的通用数据和方法
 * 替代原 mixins/licenseMixin.js
 *
 * 用法：
 *   const { licenseData, licenseLoading, loadLicenseData, handleImportLicense,
 *           handleDownloadLicense, handleSyncLicenseTime, copyMachineId,
 *           formatLicenseTime, licenseTypeTag, licenseTypeLabel } = useLicense()
 *
 * 作者：GooHv
 */
import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { getLicenseStatus, importLicense, syncLicenseTime, downloadLicense } from '@/api'
import { resetLicenseCache } from '@/utils/auth/licenseGuard'
import {
  formatLicenseTime,
  licenseTypeTag,
  licenseTypeLabel,
  copyToClipboard,
  getLicenseCountdown
} from '@/utils/business/licenseHelper'

/** 授权信息（后端返回结构较松散，按需访问字段） */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LicenseData {
  valid?: boolean
  expiresAt?: number | string
  machineId?: string
  licenseType?: string
  [key: string]: unknown
}

export interface UseLicenseReturn {
  licenseData: Ref<LicenseData>
  licenseLoading: Ref<boolean>
  licenseSyncing: Ref<boolean>
  licenseImporting: Ref<boolean>
  showLicenseImport: Ref<boolean>
  selectedLicenseFile: Ref<File | null>
  licenseCountdown: Ref<string>
  licenseActiveNames: Ref<string[]>
  loadLicenseData: () => Promise<void>
  startLicenseCountdown: () => void
  handleLicenseFileChange: (file: { raw?: File }) => void
  handleImportLicense: () => Promise<void>
  handleDownloadLicense: () => Promise<void>
  handleSyncLicenseTime: () => Promise<void>
  copyMachineId: () => Promise<boolean | void>
  formatLicenseTime: typeof formatLicenseTime
  licenseTypeTag: typeof licenseTypeTag
  licenseTypeLabel: typeof licenseTypeLabel
}

export function useLicense(): UseLicenseReturn {
  const licenseData = ref<LicenseData>({})
  const licenseLoading = ref<boolean>(false)
  const licenseSyncing = ref<boolean>(false)
  const licenseImporting = ref<boolean>(false)
  const showLicenseImport = ref<boolean>(false)
  const selectedLicenseFile = ref<File | null>(null)
  const licenseCountdown = ref<string>('')
  let licenseCountdownTimer: ReturnType<typeof setInterval> | null = null
  const licenseActiveNames = ref<string[]>([])

  async function loadLicenseData(): Promise<void> {
    licenseLoading.value = true
    try {
      const res = await getLicenseStatus()
      licenseData.value = (res.data || {}) as LicenseData
      startLicenseCountdown()
    } catch (e) {
      // 获取失败不影响其他功能
    } finally {
      licenseLoading.value = false
    }
  }

  function startLicenseCountdown(): void {
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

  function handleLicenseFileChange(file: { raw?: File }): void {
    selectedLicenseFile.value = file.raw || null
  }

  async function handleImportLicense(): Promise<void> {
    if (!selectedLicenseFile.value) return
    licenseImporting.value = true
    try {
      await importLicense(selectedLicenseFile.value)
      // 导入成功后重置路由授权缓存，使新授权立即生效
      resetLicenseCache()
      showLicenseImport.value = false
      selectedLicenseFile.value = null
      await loadLicenseData()
    } catch (e) {
      // 错误已在拦截器提示
    } finally {
      licenseImporting.value = false
    }
  }

  async function handleDownloadLicense(): Promise<void> {
    try {
      const res = await downloadLicense()
      const blob = new Blob([res.data as Blob], { type: 'application/octet-stream' })
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

  async function handleSyncLicenseTime(): Promise<void> {
    licenseSyncing.value = true
    try {
      await syncLicenseTime()
      // 成功提示由调用方处理
      await loadLicenseData()
    } catch (e) {
      // 错误已在拦截器提示
    } finally {
      licenseSyncing.value = false
    }
  }

  async function copyMachineId(): Promise<boolean | void> {
    const text = licenseData.value.machineId
    if (!text) return
    return await copyToClipboard(String(text))
  }

  onMounted(() => {
    void loadLicenseData()
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
