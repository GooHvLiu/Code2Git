/**
 * 通知模块 - 国际化字段聚合入口（index 仅聚合；center=通知中心，events=消息模板）
 */
import center from './center'
import events from './events'

export default {
  ...center,
  ...events
}
