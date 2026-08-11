/**
 * ==========================================
 * 路由实例
 * ==========================================
 * 捕获 NavigationDuplicated 错误
 * 提供 resetRouter 方法用于退出登录时重置动态路由
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from './constantRoutes'

Vue.use(VueRouter)

// 捕获路由跳转的 NavigationDuplicated 未捕获 Promise 错误
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

/**
 * 创建路由实例
 */
const createRouter = () => new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

/**
 * 重置路由
 * 退出登录时调用，清除动态添加的路由
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
