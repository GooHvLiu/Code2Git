/**
 * ==========================================
 * 系统全局设置
 * ==========================================
 */
import config from '@/config'

const settings = {
  get title(): string {
    return config.SYSTEM_NAME
  },
  fixedHeader: true,
  sidebarLogo: true,
  tagsView: true,
  showSettings: false,
  errorLog: 'production' as 'production' | 'always' | 'none',
  watermark: false,
  watermarkText: '',
  sessionTimeout: 30
}

export default settings
