/**
 * ==========================================
 * Utils 统一导出入口
 * ==========================================
 * 按功能域分组：auth / business / config / data / request / ui。
 * 本入口集中再导出各模块的具名导出（函数、常量、类型）。
 *
 * 说明：
 * - 以默认导出的单例模块（如 request 实例、websocket 客户端、bus 事件总线、
 *   config 配置对象）仍建议从其深层路径引入，避免扁平化后语义不清；
 * - 业务代码推荐按深层路径精确引入（如 @/utils/data/date），以获得更好的
 *   tree-shaking 与可读性；本入口用于统一收口与类型汇总。
 *
 * 作者：GooHv
 * 创建日期：2026-09-24
 */

// 事件总线（mitt）
export * from './bus'

// auth：令牌 / 权限 / 许可证守卫 / 角色映射
export * from './auth/auth'
export * from './auth/licenseGuard'
export * from './auth/permission'
export * from './auth/roleMapper'

// business：字典 / 导出 / 许可证 / 通知 / 翻译等业务工具
export * from './business/dict'
export * from './business/exportTable'
export * from './business/licenseHelper'
export * from './business/notificationPresenter'
export * from './business/translateManager'
export * from './business/translationFormat'
export * from './business/worldCities'

// config：系统配置 / 业务码常量 / 环境变量
export * from './config/config'
export * from './config/constants'
export * from './config/env'

// data：缓存 / 日期 / 存储 / 校验
export * from './data/cache'
export * from './data/date'
export * from './data/storage'
export * from './data/storageKey'
export * from './data/validate'

// request：axios 封装 / websocket 客户端
export * from './request/request'
export * from './request/websocket'

// ui：消息反馈 / 主题
export * from './ui/feedback'
export * from './ui/theme'
