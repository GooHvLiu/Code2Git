/**
 * ==========================================
 * 确认弹窗封装
 * ==========================================
 * 封装 Element UI MessageBox.confirm，统一确认框样式和文案
 * 支持删除确认、批量操作确认、危险操作确认等场景
 *
 * 用法：
 * import { confirmDelete, confirmAction, confirmDanger } from '@/utils/confirm'
 * const ok = await confirmDelete('确定要删除这条记录吗？')
 * if (ok) { ... }
 */
import { MessageBox } from 'element-ui'

/**
 * 通用确认弹窗
 * @param {String} message 提示内容
 * @param {String} title 标题
 * @param {Object} options 配置项（同 MessageBox.confirm）
 * @returns {Promise<Boolean>} 确认返回 true，取消返回 false
 */
export function confirmAction(message, title = '提示', options = {}) {
  return MessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    ...options
  })
    .then(() => true)
    .catch(() => false)
}

/**
 * 删除确认
 * @param {String} message 提示内容，默认"确定要删除吗？删除后不可恢复。"
 * @returns {Promise<Boolean>}
 */
export function confirmDelete(message = '确定要删除吗？删除后不可恢复。') {
  return confirmAction(message, '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
}

/**
 * 批量操作确认
 * @param {Number} count 选中数量
 * @param {String} action 操作名称，如"删除"、"导出"
 * @returns {Promise<Boolean>}
 */
export function confirmBatch(count, action = '操作') {
  if (count === 0) {
    return Promise.resolve(false)
  }
  return confirmAction(`已选中 ${count} 项，确定要执行${action}吗？`, '批量操作确认', {
    type: 'warning'
  })
}

/**
 * 危险操作确认（红色按钮，需要输入确认文字）
 * @param {String} message 提示内容
 * @param {String} confirmText 需要输入的确认文字，如"DELETE"
 * @returns {Promise<Boolean>}
 */
export function confirmDanger(message, confirmText = '') {
  return MessageBox.confirm(message, '危险操作', {
    confirmButtonText: '确认执行',
    cancelButtonText: '取消',
    type: 'error',
    distinguishCancelAndClose: true,
    // 危险操作需要输入确认文字
    beforeClose: (action, instance, done) => {
      if (action === 'confirm' && confirmText) {
        if (instance.inputValue !== confirmText) {
          instance.$message.error(`请输入 "${confirmText}" 以确认`)
          return
        }
      }
      done()
    }
  })
    .then(() => true)
    .catch(() => false)
}

/**
 * 退出登录确认
 * @returns {Promise<Boolean>}
 */
export function confirmLogout() {
  return confirmAction('确定要退出登录吗？', '退出确认', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning'
  })
}
