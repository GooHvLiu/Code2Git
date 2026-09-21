/**
 * ==========================================
 * 系统全局配置 - 聚合出口
 * ==========================================
 */
import system from './system.config'
import network from './network.config'
import ui from './ui.config'
import messages from './messages.config'

const config = {
  ...system,
  ...network,
  ...ui,
  ...messages
}

export default config
