/**
 * 公共模块 - 消息提示类国际化字段
 * 所有页面通用的消息提示、弹窗标题、确认文案
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  // 【消息】加载中
  loading: '加载中...',
  // 【消息】创建成功
  createSuccess: '创建成功',
  // 【消息】新增成功
  addSuccess: '新增成功',
  // 【消息】保存成功
  saveSuccess: '保存成功',
  // 【消息】删除成功
  deleteSuccess: '删除成功',
  // 【消息】更新成功
  updateSuccess: '更新成功',
  // 【消息】刷新成功
  refreshSuccess: '刷新成功',
  // 【消息】重置成功
  resetSuccess: '重置成功',
  // 【消息】操作失败（通用）
  operationFailed: '操作失败',
  // 【消息】提示
  tip: '提示',
  // 【消息】警告
  warning: '警告',
  // 【消息】删除确认
  deleteConfirm: '删除确认',
  // 【消息】删除确认内容（带名称参数）
  deleteConfirmMessage: '确定要删除"{name}"吗？',
  // 【消息】删除确认默认内容（无名称时）
  deleteConfirmDefault: '确定要删除吗？删除后不可恢复。',
  // 【消息】批量操作确认
  batchConfirm: '批量操作确认',
  // 【消息】批量操作确认内容（带 count/action 参数）
  batchConfirmMessage: '已选中 {count} 项，确定要执行{action}吗？',
  // 【消息】通用操作
  action: '操作',
  // 【消息】退出登录确认内容
  logoutConfirmMessage: '确定要退出登录吗？',
  // 【消息】重复请求取消原因
  requestCancelDuplicate: '重复请求，自动取消上一次',
  // 【消息】路由切换取消请求原因
  requestCancelRouteChange: '路由切换，取消未完成请求',
  // 【消息】危险操作
  dangerOperation: '危险操作',
  // 【消息】退出确认
  logoutConfirm: '退出确认',
  // 【消息】没有可导出的数据
  noDataToExport: '没有可导出的数据',
  // 【消息】没有可导出的列
  noColumnsToExport: '没有可导出的列',
  // 【消息】导出成功（带 count 参数）
  exportSuccess: '成功导出 {count} 条数据',
  // 【消息】导出数据（PDF 标题）
  exportData: '导出数据',
  // 【消息】导出人
  exporter: '导出人',
  // 【消息】导出时间
  exportTime: '导出时间',
  // 【消息】记录数前缀
  recordCountPrefix: '共',
  // 【消息】记录数后缀
  recordCountSuffix: '条记录',
  // 【消息】PDF 导出失败
  pdfExportFailed: 'PDF 导出失败，请重试',
  // 【消息】不支持的导出格式
  unsupportedExportFormat: '不支持的导出格式',
  // 【消息】下载成功
  downloadSuccess: '下载成功',
  // 【消息】下载失败
  downloadFailed: '下载失败',
  // 【消息】危险操作需输入指定文本（带 text 参数）
  confirmTextRequired: '请输入"{text}"以确认',
  // 【消息】系统名称
  systemName: 'nexCM 标准版本',
  // 【消息】系统描述
  systemDESC: '桌面式灌装加塞设备'
}
