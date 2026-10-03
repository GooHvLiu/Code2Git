// utils/dateFormatter.ts
import dayjs from "dayjs";
import type { ConfigType, OpUnitType, QUnitType } from "dayjs"; // 改为 import type
import "dayjs/locale/zh-cn";

// 按需引入插件（如需要相对时间、时区等，取消注释即可）
// import relativeTime from 'dayjs/plugin/relativeTime';
// import timezone from 'dayjs/plugin/timezone';
// import utc from 'dayjs/plugin/utc';

// dayjs.extend(relativeTime);
// dayjs.extend(timezone);
// dayjs.extend(utc);

dayjs.locale("zh-cn");

/**
 * 日期格式化工具函数
 * @param date - 待格式化的日期，支持时间戳、日期字符串、Date 对象、dayjs 实例
 * @param format - 目标格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @param fallback - 日期无效或为空时的兜底返回值，默认 '—'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date?: ConfigType | null, format = "YYYY-MM-DD HH:mm:ss", fallback = "—"): string => {
  if (date === null || date === undefined || date === "") {
    return fallback;
  }

  const parsed = dayjs(date);

  if (!parsed.isValid()) {
    return fallback;
  }

  return parsed.format(format);
};

/**
 * 获取当前日期，按指定格式返回
 * @param format - 目标格式，默认 'YYYY-MM-DD'
 * @returns 格式化后的当前日期字符串
 */
export const getCurrentDate = (format = "YYYY-MM-DD"): string => {
  return dayjs().format(format);
};

/**
 * 获取当前年月，格式如 "2026年10月"
 * @returns 当前年月字符串
 */
export const getCurrentYearMonth = (): string => {
  return dayjs().format("YYYY年MM月");
};

/**
 * 判断两个日期是否属于同一单位（默认按月比较）
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @param unit - 比较单位，默认 'month'
 * @returns 是否相同
 */
export const isSame = (date1: ConfigType, date2: ConfigType, unit: QUnitType | OpUnitType = "month"): boolean => {
  return dayjs(date1).isSame(dayjs(date2), unit as unknown as any);
};

/**
 * 判断两个日期是否属于同一个月
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @returns 是否同月
 */
export const isSameMonth = (date1: ConfigType, date2: ConfigType): boolean => {
  return isSame(date1, date2, "month");
};

/**
 * 计算两个日期之间的差值
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @param unit - 差值单位，默认 'day'
 * @returns 差值（date1 - date2）
 */
export const getDateDiff = (date1: ConfigType, date2: ConfigType, unit: QUnitType | OpUnitType = "day"): number => {
  return dayjs(date1).diff(dayjs(date2), unit);
};

/**
 * 日期加减
 * @param date - 原始日期
 * @param amount - 加减数量，正数加，负数减
 * @param unit - 单位，默认 'day'
 * @param format - 返回格式，默认 'YYYY-MM-DD'
 * @returns 计算后的日期字符串
 */
export const addDate = (date: ConfigType, amount: number, unit: OpUnitType = "day", format = "YYYY-MM-DD"): string => {
  return dayjs(date)
    .add(amount, unit as unknown as any)
    .format(format);
};

/**
 * 解析日期为 dayjs 实例，无效时返回 null
 * @param date - 待解析的日期
 * @returns dayjs 实例或 null
 */
export const parseDate = (date?: ConfigType | null): dayjs.Dayjs | null => {
  if (date === null || date === undefined || date === "") {
    return null;
  }
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed : null;
};
