/**
 * ==========================================
 * 系统信息配置
 * ==========================================
 */
import i18n from '@/i18n'

const systemConfig = {
  /** 系统名称（getter 形式，随 i18n 语言切换） */
  get SYSTEM_NAME(): string {
    return i18n.global.t('common.systemName')
  },
  get SYSTEM_DESC(): string {
    return i18n.global.t('common.systemDESC')
  },
  /** 系统版本号 */
  SYSTEM_VERSION: '2.0.0',
  /** localStorage / sessionStorage key 前缀，避免多项目冲突 */
  STORAGE_PREFIX: 'nexCM-v2-'
}

export default systemConfig
