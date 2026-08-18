/**
 * nex-svg-icon 主入口
 *
 * 用法：
 * // 1. 全局注册
 * import SvgIcon from 'nex-svg-icon'
 * Vue.component('svg-icon', SvgIcon)
 *
 * // 2. 局部使用
 * import SvgIcon from 'nex-svg-icon'
 * export default { components: { SvgIcon } }
 *
 * // 3. 模板
 * <svg-icon icon-file-name="home" class="menu-icon" />
 */
import SvgIcon from './src/SvgIcon.vue'

export default SvgIcon
export { SvgIcon }
