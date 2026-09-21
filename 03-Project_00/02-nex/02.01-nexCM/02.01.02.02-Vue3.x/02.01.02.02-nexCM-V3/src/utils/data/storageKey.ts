/**
 * ==========================================
 * 本地缓存 Key 常量
 * ==========================================
 */
import config from '@/config'

const PREFIX: string = config.STORAGE_PREFIX

export const LOCALSTORAGE_KEYS = {
  TOKEN: `${PREFIX}authorization-token`,
  USER_INFO: `${PREFIX}user-information`,
  CAPTCHA_UUID: `${PREFIX}captcha-uuid`,
  SIDEBAR_STATUS: `${PREFIX}sidebar-status`,
  PERMISSIONS: `${PREFIX}user-permissions`,
  PERMISSION_VERSION: `${PREFIX}permission-version`
} as const

export const SESSIONSTORAGE_KEYS = {
  // -v2：标签标题由“翻译后字面量”改为存 i18n key（切换语言自动更新），旧缓存一次性失效
  // -v3：首页固定标签 title 改用与侧边栏菜单一致的 key（概况预览），旧缓存一次性失效
  TAG_LIST: `${PREFIX}menu-tags-v3`,
  STORAGE_PAGE_SIZE_KEY: `${PREFIX}table-page-size`
} as const
