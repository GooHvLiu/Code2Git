/**
 * ==========================================
 * 路由实例（Vue Router 4）
 * ==========================================
 * - hash 模式
 * - resetRouter：遍历 removeRoute 后重新 addRoute（Router4 已删 matcher）
 * - push/replace 重复导航错误按需 catch
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './constant/constantRoutes'

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

/**
 * 重置路由：移除动态添加的路由，恢复静态路由
 * 退出登录时调用
 */
export function resetRouter(): void {
  // 收集动态添加的路由名（静态路由已注册，移除所有后重新挂载静态路由）
  const constantNames = new Set(constantRoutes.map(r => r.name).filter(Boolean))
  // 当前已注册的所有路由
  const allNames = router
    .getRoutes()
    .map(r => r.name)
    .filter(Boolean) as string[]
  allNames.forEach(name => {
    if (!constantNames.has(name)) {
      router.removeRoute(name)
    }
  })
}

export default router
