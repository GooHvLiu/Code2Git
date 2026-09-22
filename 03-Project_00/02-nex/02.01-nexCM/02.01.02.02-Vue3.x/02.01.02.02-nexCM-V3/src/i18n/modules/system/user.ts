/**
 * 系统设置模块 - 用户管理国际化字段
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  // 【子模块】页面
  page: {
    // 【页面】重置密码弹窗标题
    resetPwdTitle: '重置密码',
    // 【标签】新密码
    newPassword: '新密码',
    // 【占位符】请输入新密码
    newPasswordPlaceholder: '请输入新密码',
    // 【标签】确认密码
    confirmPassword: '确认密码',
    // 【占位符】请再次输入新密码
    confirmPasswordPlaceholder: '请再次输入新密码',
    // 【校验】请输入用户名
    usernameRequired: '请输入用户名',
    // 【校验】用户名长度需在2-50个字符之间
    usernameLength: '用户名长度需在 2-50 个字符之间',
    // 【校验】请输入密码
    passwordRequired: '请输入密码',
    // 【校验】密码长度需在6-32个字符之间
    passwordLength: '密码长度需在 6-32 个字符之间',
    // 【校验】邮箱格式不正确
    emailInvalid: '邮箱格式不正确',
    // 【状态】启用
    statusEnabled: '启用',
    // 【状态】禁用
    statusDisabled: '禁用',
    // 【消息】删除用户成功
    deleteSuccess: '删除成功',
    // 【页面】新增用户
    addUser: '新增用户',
    // 【标签】创建时间
    createTime: '创建时间',
    // 【标签】部门
    dept: '部门',
    // 【占位符】请选择部门
    deptPlaceholder: '请选择部门',
    // 【提示】部门说明
    deptTip: '用户所属部门，从部门管理中获取，支持树形选择',
    // 【页面】编辑用户
    editUser: '编辑用户',
    // 【标签】邮箱
    email: '邮箱',
    // 【占位符】请输入邮箱
    emailPlaceholder: '请输入邮箱',
    // 【提示】邮箱说明
    emailTip: '用户邮箱地址，用于接收邮件通知和密码重置',
    // 【页面】页面描述
    pageDesc: '管理系统用户和账户信息',
    // 【标签】密码
    password: '密码',
    // 【提示】密码不匹配
    passwordMismatch: '两次输入的密码不一致',
    // 【占位符】请输入密码
    passwordPlaceholder: '请输入密码',
    // 【提示】密码说明
    passwordTip: '登录密码，长度6-32个字符，仅新增用户时需要设置',
    // 【标签】电话
    phone: '电话',
    // 【占位符】请输入手机号
    phonePlaceholder: '请输入手机号',
    // 【提示】手机号说明
    phoneTip: '用户手机号码，用于接收通知和验证码',
    // 【标签】真实姓名
    realName: '真实姓名',
    // 【占位符】请输入真实姓名
    realNamePlaceholder: '请输入真实姓名',
    // 【提示】真实姓名说明
    realNameTip: '用户的真实姓名，用于显示和识别用户身份',
    // 【标签】备注
    remark: '备注',
    // 【占位符】请输入备注
    remarkPlaceholder: '请输入备注',
    // 【提示】备注说明
    remarkTip: '备注信息，用于记录用户的额外说明',
    // 【操作】重置密码
    resetPassword: '重置密码',
    // 【消息】重置密码成功
    resetPasswordSuccess: '密码重置成功',
    // 【标签】角色
    role: '角色',
    // 【占位符】请选择角色
    rolePlaceholder: '请选择角色',
    // 【提示】角色说明
    roleTip: '用户角色，决定用户的权限范围，从角色管理中获取',
    // 【标签】性别
    sex: '性别',
    // 【提示】性别说明
    sexTip: '用户性别，从数据字典中获取选项',
    // 【标签】状态
    status: '状态',
    // 【提示】状态说明
    statusTip: '用户状态，启用状态可以正常登录，禁用状态无法登录',
    // 【页面】标题
    title: '用户管理',
    // 【操作】解锁
    unlock: '解锁',
    // 【确认】解锁确认
    unlockConfirm: '确定要解锁此用户吗？',
    // 【消息】解锁成功
    unlockSuccess: '用户解锁成功',
    // 【标签】用户名
    username: '用户名',
    // 【占位符】请输入用户名
    usernamePlaceholder: '请输入用户名',
    // 【提示】用户名说明
    usernameTip: '登录系统使用的用户名，唯一标识，编辑时不可修改',
    // 【确认】删除单个用户（带 name 参数）
    deleteConfirm: '确定要删除用户“{name}”吗？此操作不可撤销！',
    // 【确认】批量删除用户（带 count 参数）
    batchDeleteConfirm: '确定要删除选中的 {count} 个用户吗？此操作不可撤销！',
    // 【消息】批量删除成功
    batchDeleteSuccess: '批量删除成功',
    // 【提示】请先选择要删除的用户
    selectToDelete: '请先选择要删除的用户',
    // 【校验】密码长度不能少于8位
    passwordMinLength8: '密码长度不能少于8位'
  }
}
