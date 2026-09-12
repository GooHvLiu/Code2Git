import request from './request'

// 触发测试执行
export function runTest(data) {
  return request({ url: '/test-runs/run', method: 'post', data })
}

// 获取执行记录列表
export function getTestRunList(params) {
  return request({ url: '/test-runs/list', method: 'get', params })
}

// 获取执行记录详情
export function getTestRun(id) {
  return request({ url: `/test-runs/${id}`, method: 'get' })
}

// 获取测试报告
export function getTestReport(id) {
  return request({ url: `/test-runs/${id}/report`, method: 'get' })
}

// 删除执行记录
export function deleteTestRun(id) {
  return request({ url: `/test-runs/${id}`, method: 'delete' })
}
