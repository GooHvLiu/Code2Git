// 路由白名单：不需要登录就能访问的页面,没有 token 时，仅允许直接访问 /login；其他页面强制跳登录 与 axios 的白名单完全不一样
export const ROUTE_WHITE_LIST = ["/login"];