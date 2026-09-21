/**
 * ==========================================
 * 菜单 / 路由元信息类型
 * ==========================================
 * 扩展 vue-router 的 RouteMeta，对齐后端菜单表字段
 */
import 'vue-router'

/** 菜单节点类型：menu=目录/菜单，button=按钮，param=参数 */
export type MenuNodeType = 'menu' | 'button' | 'param'

/** 后端返回的原始菜单项 */
export interface RawMenuItem {
  /** 路由路径（相对） */
  path: string
  /** 组件路径（views 下，如 system/user/index） */
  component?: string | null
  /** 节点类型 */
  type?: MenuNodeType
  /** 子菜单 */
  children?: RawMenuItem[]
  /** 节点元信息（与路由 meta 对齐） */
  meta?: {
    title?: string
    icon?: string
    /** 面包屑层级标题（i18n key 数组） */
    titles?: string[]
    /** 可见角色编码 */
    roles?: string[]
    /** 是否不缓存 */
    noCache?: boolean
    /** 节点类型（兜底） */
    type?: MenuNodeType
    /** 是否隐藏（前端约定） */
    hidden?: boolean
    [key: string]: unknown
  }
  [key: string]: unknown
}

/** 侧边栏渲染用菜单节点 */
export interface SidebarMenu {
  title: string
  path: string
  icon: string
  children?: SidebarMenu[]
}

/** 扁平化菜单项（菜单搜索用） */
export interface FlatMenuItem {
  title: string
  path: string
  icon: string
  parentTitle: string
  isTopLevel: boolean
}

declare module 'vue-router' {
  interface RouteMeta {
    /** 面包屑/标签页标题层级（取最后一项作为标签标题） */
    titles?: string[]
    /** 单标题 */
    title?: string
    /** 菜单图标 */
    icon?: string
    /** 可见角色 */
    roles?: string[]
    /** 是否隐藏（不进标签栏/菜单） */
    hidden?: boolean
    /** 是否不缓存 keep-alive */
    noCache?: boolean
    /** 节点类型 */
    type?: MenuNodeType
    [key: string]: unknown
  }
}

export {}
