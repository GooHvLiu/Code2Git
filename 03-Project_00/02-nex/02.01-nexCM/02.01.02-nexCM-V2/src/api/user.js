/**
 * api/user.js - 用户认证相关接口
 */
import request from '@/utils/request'

/**
 * 登录
 * @param {Object} data - { username, password }
 * @returns {Promise<{token: string}>}
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 获取当前用户信息（角色、权限、头像等）
 * @returns {Promise<{name, avatar, roles, permissions}>}
 */
export function getInfo() {
  return request({
    url: '/auth/user-info',
    method: 'get'
  })
}

/**
 * 登出
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
