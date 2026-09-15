import { ROUTE_PATHS } from './pathConstants'

// 路由白名单：不需要登录就能访问的页面
// 没有 token 时，仅允许直接访问白名单内页面；其他页面强制跳登录
// 注意：与 axios 的 NO_TOKEN_API（接口白名单）完全不同
export const ROUTE_WHITE_LIST = [ROUTE_PATHS.LOGIN, ROUTE_PATHS.LICENSE_IMPORT]