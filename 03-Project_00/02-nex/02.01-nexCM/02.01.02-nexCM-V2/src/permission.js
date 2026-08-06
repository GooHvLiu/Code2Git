/**
 * permission.js - 全局路由守卫
 * 
 * 核心逻辑：
 * 1. 判断是否有 Token
 * 2. 有 Token：已登录状态，去登录页则跳首页；无用户信息则拉取用户信息和权限路由
 * 3. 无 Token：在白名单内直接放行，否则跳登录页
 * 4. 顶部进度条 NProgress
 */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 顶部进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从 Cookie 获取 Token
import getPageTitle from '@/utils/get-page-title'

// 进度条配置：不显示加载圆圈
NProgress.configure({ showSpinner: false })

// 免登录白名单（不需要登录就能访问的路径）
const whiteList = ['/login', '/kanban']

/**
 * 全局前置守卫
 * 每次路由跳转前执行
 */
router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 判断是否有 Token
  const hasToken = getToken()

  if (hasToken) {
    // ========== 已登录 ==========
    if (to.path === '/login') {
      // 已登录还去登录页，直接跳首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断是否已经获取过用户信息（roles 存在表示已获取）
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // 已有用户信息，直接放行
        next()
      } else {
        // 没有用户信息，需要获取
        try {
          // 获取用户信息（包含 roles 角色列表）
          const { roles } = await store.dispatch('user/getInfo')
          // 根据角色生成可访问的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 动态添加路由到 router
          router.addRoutes(accessRoutes)
          // replace: true 不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 获取失败，重置 Token 并跳登录页
          await store.dispatch('user/resetToken')
          Message.error(error || '验证失败，请重新登录')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // ========== 未登录 ==========
    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单内，直接放行
      next()
    } else {
      // 不在白名单，跳登录页，带上 redirect 参数登录后跳回
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

/**
 * 全局后置钩子
 * 路由跳转完成后关闭进度条
 */
router.afterEach(() => {
  NProgress.done()
})
