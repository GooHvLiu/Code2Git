/**
 * 超级面板模块 - 角色管理国际化字段
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  // 【子模块】页面
  page: {
    // 【操作】新增角色
    addRole: '新增角色',
    // 【提示】基础角色不可删除
    basicRoleCannotDelete: '基础角色不可删除',
    // 【提示】基础角色不可编辑
    basicRoleCannotEdit: '基础角色不可编辑',
    // 【确认】删除确认
    deleteConfirm: '确定要删除此角色吗？',
    // 【操作】编辑角色
    editRole: '编辑角色',
    // 【页面】页面描述
    pageDesc: '管理系统角色和权限分配',
    // 【标签】角色编码
    roleCode: '角色编码',
    // 【提示】角色编码必填
    roleCodeRequired: '角色编码不能为空',
    // 【标签】角色名称
    roleName: '角色名称',
    // 【提示】角色名称必填
    roleNameRequired: '角色名称不能为空',
    // 【子模块】提示
    tips: {
      // 【提示】描述
      description: '角色的描述信息',
      // 【提示】角色编码
      roleCode: '角色的唯一编码',
      // 【提示】角色名称
      roleName: '角色的显示名称',
      // 【提示】状态
      status: '角色的状态'
    },
    // 【页面】标题
    title: '角色管理'
  }
}
