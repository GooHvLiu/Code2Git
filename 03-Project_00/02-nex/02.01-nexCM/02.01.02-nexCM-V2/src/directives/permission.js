/**
 * ==========================================
 * 权限指令 v-permission
 * ==========================================
 * 根据用户角色控制元素显示/隐藏
 *
 * 用法：
 * <el-button v-permission="['admin']">删除</el-button>
 * <el-button v-permission="['admin', 'editor']">编辑</el-button>
 */
import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value
      const hasPermission = roles.some(role => permissionRoles.includes(role))
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
