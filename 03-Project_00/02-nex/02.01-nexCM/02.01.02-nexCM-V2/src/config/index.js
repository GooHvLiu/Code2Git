/**
 * ==========================================
 * 系统全局配置 - 聚合出口
 * ==========================================
 * 所有配置按模块拆分到同目录下的文件：
 *   - system.js   系统信息、缓存前缀
 *   - network.js  网络请求
 *   - ui.js       分页、侧边栏、标签页、主题色、动画、响应式、登录页文案
 *   - messages.js 全局提示文案、表单校验提示
 *
 * 业务代码统一通过 import config from '@/config' 使用
 * 修改配置只需改对应模块文件，无需全局搜索替换
 */
import system from './system'
import network from './network'
import ui from './ui'
import messages from './messages'

export default {
  ...system,
  ...network,
  ...ui,
  ...messages
}
