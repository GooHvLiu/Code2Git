/**
 * ==========================================
 * nex-utils 主入口
 * ==========================================
 * 通用工具集合：storage、date、validate、message
 *
 * 用法：
 * import { setLocalStorage, formatDate, showError, validateEmail } from 'nex-utils'
 *
 * 或全局注册 message 插件：
 * import msgPlugin from 'nex-utils/message'
 * Vue.use(msgPlugin)
 * this.$msg.error('请求失败')
 */

// storage
export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  clearAllLocalStorage,
  clearAllSessionStorage
} from './src/storage'

// date
export {
  DATE_FORMATS,
  formatDate,
  parseDate,
  now,
  addDays,
  addMonths,
  diffDays,
  isDateBetween,
  startOfDay,
  endOfDay,
  fromNow,
  isToday,
  isSameDay,
  startOfMonth,
  endOfMonth
} from './src/date'
export { default as dayjs } from './src/date'

// validate
export {
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateEmail,
  validatePhone,
  validateIdCard,
  validateUrl,
  validateLength,
  validatePattern
} from './src/validate'

// message
export {
  showMessage,
  showSuccess,
  showError,
  showWarning,
  showInfo
} from './src/message'
export { default as messagePlugin } from './src/message'
