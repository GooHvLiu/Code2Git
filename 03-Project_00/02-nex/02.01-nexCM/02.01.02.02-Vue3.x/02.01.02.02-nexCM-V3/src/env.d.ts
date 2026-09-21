/// <reference types="vite/client" />

/**
 * 全局类型声明
 * - *.vue 单文件组件模块
 * - import.meta.env 的 VITE_ 环境变量类型
 * - 静态资源模块
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.json' {
  const value: unknown
  export default value
}

interface ImportMetaEnv {
  /** 接口基础路径（开发环境走代理，生产环境写完整地址） */
  readonly VITE_BASE_API: string
  /** 后端代理目标地址（仅开发环境） */
  readonly VITE_PROXY_TARGET: string
  /** 开发服务器端口 */
  readonly VITE_PORT: string
  /** 页面标题 */
  readonly VITE_APP_TITLE: string
  /** 部署子路径，默认 '/' */
  readonly VITE_PUBLIC_PATH: string
  /** WebSocket 开发环境主机 */
  readonly VITE_WS_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
