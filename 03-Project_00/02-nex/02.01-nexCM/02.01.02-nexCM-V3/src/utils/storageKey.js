/**
 * ==========================================
 * 本地缓存 Key 常量
 * ==========================================
 * 所有 localStorage / sessionStorage 的 key 统一管理
 * 前缀从 config 读取，避免多项目冲突
 */
import config from '@/config'

/** 统一前缀 */
const PREFIX = config.STORAGE_PREFIX

/**
 * localStorage 缓存键名
 */
export const LOCALSTORAGE_KEYS = {
  /** 登录 Token */
  TOKEN: `${PREFIX}authorization-token`,
  /** 用户信息 */
  USER_INFO: `${PREFIX}user-information`,
  /** 验证码 UUID */
  CAPTCHA_UUID: `${PREFIX}captcha-uuid`,
  /** 侧边栏展开状态 */
  SIDEBAR_STATUS: `${PREFIX}sidebar-status`,
  /** 用户权限码列表 */
  PERMISSIONS: `${PREFIX}user-permissions`,
  /** 权限版本号 */
  PERMISSION_VERSION: `${PREFIX}permission-version`
}

/**
 * sessionStorage 缓存键名
 */
export const SESSIONSTORAGE_KEYS = {
  /** 标签页列表 */
  TAG_LIST: `${PREFIX}menu-tags`,
  /** 表格每页条数 */
  STORAGE_PAGE_SIZE_KEY: `${PREFIX}table-page-size`
}
