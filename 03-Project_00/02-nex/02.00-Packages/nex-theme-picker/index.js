/**
 * ==========================================
 * nex-theme-picker 主入口
 * ==========================================
 *
 * 用法：
 * // 1. 组件
 * import ThemePicker from 'nex-theme-picker'
 *
 * // 2. 工具函数
 * import { initTheme, setThemeField, getThemeField, resetThemeField, resetAllTheme, THEME_FIELDS } from 'nex-theme-picker'
 *
 * // 3. vue.config.js 配置
 * const { configureTheme } = require('nex-theme-picker/vue-config')
 */

import ThemePicker from './src/ThemePicker.vue'
import themeVariables from './src/themeVariables.js'

export {
  THEME_FIELDS,
  setThemeField,
  getThemeField,
  resetThemeField,
  resetAllTheme,
  initTheme,
  mixColor
} from './src/theme.js'

export { themeVariables }

export default ThemePicker
