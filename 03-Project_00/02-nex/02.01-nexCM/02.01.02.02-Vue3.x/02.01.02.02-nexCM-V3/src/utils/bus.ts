/**
 * ==========================================
 * 事件总线（替代 Vue2 的 new Vue() $bus）
 * ==========================================
 * 使用 mitt，体积小、类型安全。
 * 用法：
 *   import bus from '@/utils/bus'
 *   bus.on('some-event', handler)
 *   bus.emit('some-event', payload)
 */
import mitt, { type Emitter } from 'mitt'

/** 自定义事件映射（可按需扩展） */
export type BusEvents = {
  kicked_out: { reason?: string }
  [key: string]: unknown
}

const bus: Emitter<BusEvents> = mitt<BusEvents>()

export default bus
