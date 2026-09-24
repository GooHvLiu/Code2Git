/**
 * ==========================================
 * 环境变量兼容层
 * ==========================================
 * 把原 process.env.VUE_APP_* 的读取收敛为 import.meta.env.VITE_* 的统一 export。
 * 后续页面/工具统一从这里 import，避免逐文件硬写 import.meta.env。
 * 作者：GooHv
 * 创建日期：2026-09-24
 */

/** 接口基础路径（开发走代理，生产写完整地址） */
export const BASE_API: string = import.meta.env.VITE_BASE_API || '/prod-api/v2'

/** 后端代理目标（仅开发环境） */
export const PROXY_TARGET: string = import.meta.env.VITE_PROXY_TARGET || 'http://127.0.0.1:3002'

/** 开发端口 */
export const APP_PORT: string = import.meta.env.VITE_PORT || '8082'

/** 页面标题 */
export const APP_TITLE: string = import.meta.env.VITE_APP_TITLE || 'nexCM 管理系统'

/** 部署子路径 */
export const PUBLIC_PATH: string = import.meta.env.VITE_PUBLIC_PATH || '/'

/** WebSocket 开发环境主机 */
export const WS_HOST: string = import.meta.env.VITE_WS_HOST || 'localhost:3002'

/** 是否开发环境 */
export const IS_DEV: boolean = import.meta.env.DEV

/** 是否生产环境 */
export const IS_PROD: boolean = import.meta.env.PROD
