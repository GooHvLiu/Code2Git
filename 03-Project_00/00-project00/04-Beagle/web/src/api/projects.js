import request from './request'

// 获取项目列表
export function getProjectList(params) {
  return request({ url: '/projects', method: 'get', params })
}

// 获取所有项目（下拉用）
export function getAllProjects() {
  return request({ url: '/projects/all', method: 'get' })
}

// 获取项目详情
export function getProject(id) {
  return request({ url: `/projects/${id}`, method: 'get' })
}

// 新增项目
export function createProject(data) {
  return request({ url: '/projects', method: 'post', data })
}

// 更新项目
export function updateProject(id, data) {
  return request({ url: `/projects/${id}`, method: 'put', data })
}

// 删除项目
export function deleteProject(id) {
  return request({ url: `/projects/${id}`, method: 'delete' })
}
