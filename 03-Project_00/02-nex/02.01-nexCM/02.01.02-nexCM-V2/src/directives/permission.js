/**
 * ==========================================
 * 权限指令 v-permission
 * ==========================================
 * 根据用户角色或权限码控制元素显示/隐藏
 *
 * 用法（角色判断，兼容原有）：
 * <el-button v-permission="['admin']">删除</el-button>
 * <el-button v-permission="['admin', 'editor']">编辑</el-button>
 *
 * 用法（权限码判断）：
 * <el-button v-permission="'user:add'">新增</el-button>
 * <el-button v-permission="['user:add', 'user:edit']">操作</el-button>
 *
 * 说明：角色和权限码会同时检查，只要有一个匹配就显示
 */
import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles
  const permissions = store.getters && store.getters.permissions

  if (!value) {
    throw new Error('need permission! Like v-permission="[\'admin\']" or v-permission="\'user:add\'"')
  }

  // 统一转成数组处理
  const permissionList = Array.isArray(value) ? value : [value]

  // 同时检查角色和权限码，只要有一个匹配就通过
  const hasPermission = permissionList.some(item => {
    return roles.includes(item) || permissions.includes(item)
  })

  if (!hasPermission) {
    el.parentNode && el.parentNode.removeChild(el)
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
