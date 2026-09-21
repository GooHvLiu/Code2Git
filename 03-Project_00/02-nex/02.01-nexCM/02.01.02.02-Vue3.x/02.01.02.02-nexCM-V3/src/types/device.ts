/**
 * ==========================================
 * device.ts - 设备域业务类型定义
 * ==========================================
 * 覆盖：设备状态总览 / 报警看板 / 备件寿命与模板 / 更换记录
 */
import type { Component } from 'vue'

/** 备件（寿命）记录 */
export interface Part {
  id?: number | string
  template_id?: number | string
  template_key?: string
  /** 显示名称（兼容后端字段） */
  part_name?: string
  name?: string
  /** 编码（兼容后端字段） */
  part_code?: string
  code?: string
  /** 规格型号（兼容后端字段） */
  spec_model?: string
  spec?: string
  /** 已用寿命（兼容后端字段） */
  used_life?: number
  used?: number
  /** 额定寿命（兼容后端字段） */
  rated_life?: number
  total?: number
  /** 安装日期（兼容后端字段） */
  install_date?: string
  installDate?: string
  remark?: string
  /** 前端展示用图标 class */
  icon?: string
}

/** 备件模板 */
export interface PartTemplate {
  id?: number | string
  /** 模板国际化 key / 模板名（兼容后端字段） */
  name_key?: string
  template_name?: string
  name?: string
  template_key?: string
  code_prefix?: string
  stat_method?: string
  stat_tag?: string
  /** 后端默认额定寿命（兼容字段） */
  default_rated_life?: number
  default_life?: number
  rated_life?: number
  /** 后端默认规格（兼容字段） */
  default_spec?: string
  spec?: string
  status?: number
}

/** 备件更换记录 */
export interface ReplaceRecord {
  id?: number | string
  part_name?: string
  partName?: string
  old_code?: string
  oldCode?: string
  new_code?: string
  newCode?: string
  operator_name?: string
  operator?: string
  replace_time?: string
  time?: string
  status?: string
}

/** 报警级别 */
export type AlarmLevel = 'critical' | 'major' | 'minor' | 'info'
/** 报警处理状态 */
export type AlarmStatus = 'pending' | 'processing' | 'resolved'
/** 报警类别 */
export type AlarmCategory = 'position' | 'vacuum' | 'servo' | 'timeout' | 'temperature' | 'pressure' | 'other'

/** 报警记录（列表） */
export interface AlarmRecord {
  id: number
  alarmNo: string
  alarmTime: string
  level: AlarmLevel
  levelText: string
  category: AlarmCategory
  categoryText: string
  alarmCode: string
  description: string
  deviceCode: string
  status: AlarmStatus
  statusText: string
  handler: string
  resolveTime: string
}

/** 报警统计卡片 */
export interface AlarmStatCard {
  label: string
  value: number | string
  icon: Component
  type: 'danger' | 'critical' | 'warning' | 'info'
  trend: number
}

/** 报警类别分布项（环形图） */
export interface AlarmCategoryDatum {
  name: string
  count: number
  percent: number
  color: string
}

/** 报警级别分布项 */
export interface AlarmLevelDatum {
  name: string
  count: number
  percent: number
  type: AlarmLevel
}

/** TOP 报警类型项 */
export interface AlarmTopDatum {
  name: string
  desc: string
  count: number
  trend: number
}

/** 关键运行指标（状态总览） */
export interface CoreMetric {
  label: string
  value: number | string
  unit: string
  trend: number
  trendUp: boolean
}

/** 实时运行参数 */
export interface RealtimeParam {
  key: string
  name: string
  value: number
  unit: string
  min: number
  max: number
  decimal: number
}

/** 今日运行统计 */
export interface TodayStat {
  label: string
  value: number | string
  unit: string
  sub: string
}

/** 趋势图数据点 */
export interface TrendPoint {
  time: string
  value: number
}
