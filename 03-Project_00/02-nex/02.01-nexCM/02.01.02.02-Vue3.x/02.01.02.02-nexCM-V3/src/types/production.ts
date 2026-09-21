/**
 * ==========================================
 * production.ts - 生产域业务类型定义
 * ==========================================
 * 覆盖：生产工单（订单）/ 配方管理
 * 作者：GooHv
 */

/**
 * 配方
 * 字段对齐灌装产线配方：基本信息 + 轴位参数（度 / 脉冲）+ 速度参数（脉冲/s）
 * + 延时与工艺速度（ms / 瓶每小时）+ 智能分析统计
 */
export interface Recipe {
  id: number
  /** 配方编号 */
  code: string
  /** 配方名称 */
  name: string
  /** 产品类型 */
  productType: string
  /** 灌装量（mL） */
  fillVolume: number

  // ===== 轴位参数（角度：度；位置：脉冲）=====
  /** 灌装角度（度） */
  fillAngle: number
  /** 回吸角度（度） */
  suckBackAngle: number
  /** 灌装轴初始位（脉冲） */
  fillAxisInit: number
  /** 灌装轴到达位（脉冲） */
  fillAxisReach: number
  /** 固定轴初始位（脉冲） */
  fixAxisInit: number
  /** 固定轴到达位（脉冲） */
  fixAxisReach: number
  /** 固定轴预升位（脉冲） */
  fixAxisPreLift: number
  /** 加塞轴初始位（脉冲） */
  stopperAxisInit: number
  /** 加塞轴预压位（脉冲） */
  stopperAxisPrePress: number
  /** 加塞轴到达位（脉冲） */
  stopperAxisReach: number

  // ===== 速度参数（脉冲/s）=====
  fillAxisInitSpeed: number
  fillAxisReachSpeed: number
  fixAxisInitSpeed: number
  fixAxisReachSpeed: number
  fixAxisPreLiftSpeed: number
  stopperAxisInitSpeed: number
  stopperAxisPrePressSpeed: number
  stopperAxisReachSpeed: number

  // ===== 延时（ms）与工艺速度（瓶/h）=====
  /** 灌装延时（ms） */
  fillDelay: number
  /** 真空延时（ms） */
  vacuumDelay: number
  /** 灌装速度（瓶/h） */
  fillSpeed: number
  /** 回吸速度（瓶/h） */
  suckBackSpeed: number

  // ===== 智能分析 =====
  /** 使用次数 */
  usageCount: number
  /** 故障率（%） */
  faultRate: number
  /** 平均合格率（%） */
  avgQualifiedRate: number
  /** 最后使用时间 */
  lastUsedTime: string
  /** 是否当前使用中 */
  isActive: boolean
}

/** 工单状态 */
export type OrderStatus = 'completed' | 'running' | 'planned'

/** 生产工单 */
export interface ProductionOrder {
  id: number
  orderNo: string
  productName: string
  bottleType: string
  quantity: number
  completed: number
  progress: number
  status: OrderStatus
  priority: 'high' | 'medium' | 'low'
  startDate: string
  endDate: string
  recipeName: string
  operator: string
}

/** 工单统计卡片 */
export interface OrderStat {
  label: string
  value: number | string
  unit?: string
  sub?: string
  type: 'total' | 'completed' | 'running' | 'planned'
}

/** 今日产量趋势点 */
export interface OutputTrendPoint {
  time: string
  value: number
}
