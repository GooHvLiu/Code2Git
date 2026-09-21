/**
 * ==========================================
 * 业务实体类型（通知 / 设备 / 生产 / 字典）
 * ==========================================
 * 与后端主要业务表字段对齐，先覆盖地基链路需要的实体
 */

/** 通知消息 */
export interface NotificationItem {
  id: number | string
  /** 类型：alarm / system / production ... */
  type: string
  title: string
  content?: string
  level?: 'info' | 'warning' | 'critical'
  read: boolean
  createdAt?: string
  [key: string]: unknown
}

/** 设备实时参数 */
export interface DeviceParams {
  speed: number
  fillVolume: number
  vacuum: number
  temperature: number
  pressure: number
  vibration: number
  [key: string]: number
}

/** 设备运行状态 */
export type DeviceStatus = 'running' | 'idle' | 'fault' | 'offline'

/** 字典数据 */
export interface DictData {
  id: number | string
  dictType: string
  dictLabel: string
  dictValue: string
  status?: string
  sort?: number
  remark?: string
}

/** 授权状态 */
export interface LicenseStatus {
  valid: boolean
  expired?: boolean
  daysRemaining?: number
  [key: string]: unknown
}

/** 系统配置项 */
export interface SystemConfig {
  sessionTimeout: number
  defaultPageSize: number
  defaultLanguage: string
  dateFormat: string
  heartbeatInterval: number
  deviceName?: string
  deviceCode?: string
  [key: string]: unknown
}
