import request from './request'

// 所有插件列表
export function getPluginList() {
  return request({ url: '/plugins/list', method: 'get' })
}

// 启用/禁用插件
export function togglePlugin(moduleType, enabled) {
  return request({ url: `/plugins/toggle/${moduleType}`, method: 'put', data: { enabled } })
}

// 获取项目已绑定的插件
export function getProjectPlugins(projectId) {
  return request({ url: `/plugins/project/${projectId}`, method: 'get' })
}

// 绑定插件到项目
export function bindPlugin(projectId, data) {
  return request({ url: `/plugins/project/${projectId}/bind`, method: 'post', data })
}

// 解除项目插件绑定
export function unbindPlugin(projectId, moduleType) {
  return request({ url: `/plugins/project/${projectId}/unbind/${moduleType}`, method: 'delete' })
}

// 获取项目可用插件
export function getAvailablePlugins(projectId) {
  return request({ url: `/plugins/project/${projectId}/available`, method: 'get' })
}

// 插件开发文档
export function getPluginDocs() {
  return request({ url: '/plugins/docs', method: 'get' })
}
