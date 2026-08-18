/**
 * ==========================================
 * 系统信息配置
 * ==========================================
 */
import i18n from '@/i18n'
export default {
  /** 系统名称 - 用于浏览器标题、侧边栏顶部、登录页等 SYSTEM_NAME: 'nexCM 设备管理系统', */
  get SYSTEM_NAME() {
    return i18n.t('common.systemName')
  },
  /** 机种匹配描述 - 用于告诉当前匹配的设备种类等 SYSTEM_DESC: '移动式灌装加塞设备', */
  get SYSTEM_DESC() {
    return i18n.t('common.systemDESC')
  },
  /** 系统版本号 */
  SYSTEM_VERSION: '2.0.0',
  /** 网页标识 Logo 路径 */
  SYSTEM_LOGO: require('@/assets/images/favicon.png'),

  /** localStorage / sessionStorage key 前缀，避免多项目冲突 */
  STORAGE_PREFIX: 'nexCM-v2-'
}
