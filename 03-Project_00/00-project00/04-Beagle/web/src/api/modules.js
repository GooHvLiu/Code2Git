import request from './request'

// 获取所有已注册的测试模块
export function getModuleList() {
  return request({ url: '/modules/list', method: 'get' })
}

// 获取项目的模块配置
export function getModuleConfig(projectId) {
  return request({ url: `/modules/config/${projectId}`, method: 'get' })
}

// 保存项目的模块配置
export function saveModuleConfig(projectId, data) {
  return request({ url: `/modules/config/${projectId}`, method: 'post', data })
}
