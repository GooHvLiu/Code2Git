import { ROUTE_PATHS } from './pathConstants'

/** 路由白名单：不需要登录就能访问的页面 */
export const ROUTE_WHITE_LIST: string[] = [ROUTE_PATHS.LOGIN, ROUTE_PATHS.LICENSE_IMPORT]
