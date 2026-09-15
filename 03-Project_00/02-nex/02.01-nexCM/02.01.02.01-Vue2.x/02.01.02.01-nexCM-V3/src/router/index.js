/**
 * ==========================================
 * 路由实例
 * ==========================================
 * 捕获 NavigationDuplicated 错误
 * 提供 resetRouter 方法用于退出登录时重置动态路由
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from './constant/constantRoutes'

Vue.use(VueRouter)

// 捕获路由跳转的未捕获 Promise 错误
// Vue Router 3.x 导航错误通过 err._isRouter=true 和 err.type(数字) 标识：
// 2=redirected 4=aborted 8=cancelled 16=duplicated，均为正常导航行为
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

const SILENT_FAILURE_TYPES = [2, 4, 8, 16]

function isRouterSilent(err) {
  return err && err._isRouter && SILENT_FAILURE_TYPES.includes(err.type)
}

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (!isRouterSilent(err)) throw err
  })
}

VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => {
    if (!isRouterSilent(err)) throw err
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
