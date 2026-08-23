/**
 * ==========================================
 * 中文语言包
 * ==========================================
 * 按模块分组，新增文案在此添加
 * 结构与 en-US.js 保持一致
 */
export default {
  // ==================== 通用 ====================
  common: {
    confirm: '确定',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '新增',
    search: '搜索',
    reset: '重置',
    export: '导出',
    import: '导入',
    refresh: '刷新',
    operation: '操作',
    status: '状态',
    index: '序号',
    createTime: '创建时间',
    updateTime: '更新时间',
    loading: '加载中...',
    success: '操作成功',
    failed: '操作失败',
    tip: '提示',
    warning: '警告',
    error: '错误',
    untitled: '未命名',
    redirect: '重定向',
    systemName: 'nexCM 设备管理系统',
    systemDESC: '移动式灌装加塞设备'
  },

  // ==================== 登录页 ====================
  login: {
    title: '欢迎登录',
    username: '用户名',
    password: '密码',
    captcha: '验证码',
    loginBtn: '登 录',
    registerBtn: '注 册',
    registerTitle: '注册账号',
    email: '邮箱',
    confirmPassword: '确认密码',
    hasAccount: '已有账号？',
    loginNow: '立即登录',
    noAccount: '还没有账号？',
    registerNow: '立即注册',
    usernameRequired: '用户名不能为空',
    passwordRequired: '密码不能为空',
    captchaRequired: '验证码不能为空',
    emailRequired: '邮箱不能为空',
    confirmPasswordRequired: '请再次输入密码',
    registerSuccess: '注册成功，请登录'
  },

  // ==================== 布局 ====================
  layout: {
    home: '网站首页',
    profile: '个人中心',
    userManagement: '用户管理',
    auditLog: '审计追踪',
    logout: '退出登录',
    user: '用户',
    searchMenu: '搜索菜单...',
    tagsView: {
      refresh: '刷新',
      close: '关闭',
      closeOthers: '关闭其他',
      closeLeft: '关闭左侧',
      closeRight: '关闭右侧',
      closeAll: '关闭全部'
    }
  },

  // ==================== 错误页 ====================
  error: {
    notFound: '页面不存在',
    backHome: '返回首页',
    back: '返回上一页',
    countdown: '页面将在 {count} 秒后自动返回首页',
    forbidden: '抱歉，您没有访问权限',
    forbiddenDesc: '该页面需要特定权限才能访问，请联系管理员',
    forbiddenTitle: '无权限'
  },

  // ==================== 首页 ====================
  home: {
    welcome: '欢迎使用',
    admin: '管理员'
  },

  // ==================== 主题设置 ====================
  theme: {
    quickMenu: '快捷菜单',
    palette: '主题调色',
    language: '语言切换',
    resetAll: '恢复全部默认',
    reset: '恢复默认',
    custom: '自定义',
    switchedToZh: '已切换为中文',
    switchedToEn: 'Switched to English',
    sidebarBg: '侧边栏背景颜色',
    sidebarHoverText: '侧边栏悬停文字',
    sidebarHoverBg: '侧边栏悬停背景',
    sidebarIconColor: '侧边栏图标颜色',
    sidebarActiveBg: '选中菜单背景'
  },

  // ==================== 个人中心 ====================
  profile: {
    title: '个人中心',
    basicInfo: '基本信息',
    username: '用户名',
    realName: '真实姓名',
    email: '邮箱',
    phone: '手机号',
    role: '角色',
    status: '状态',
    createTime: '创建时间',
    changePassword: '修改密码',
    oldPassword: '原密码',
    newPassword: '新密码',
    confirmPassword: '确认密码'
  },

  // ==================== 用户管理 ====================
  user: {
    title: '用户管理',
    username: '用户名',
    password: '密码',
    realName: '真实姓名',
    sex: '性别',
    sexUnknown: '未知',
    sexMale: '男',
    sexFemale: '女',
    email: '邮箱',
    phone: '手机号',
    role: '角色',
    status: '状态',
    createTime: '创建时间',
    operation: '操作',
    addUser: '新增用户',
    editUser: '编辑用户',
    enable: '启用',
    disable: '禁用',
    resetPassword: '重置密码',
    remark: '备注',
    roleAdministrator: '管理员',
    roleEngineer: '工程师',
    roleOperator: '操作员',
    usernamePlaceholder: '请输入用户名',
    passwordPlaceholder: '请输入密码',
    realNamePlaceholder: '请输入姓名',
    emailPlaceholder: '请输入邮箱',
    phonePlaceholder: '请输入手机号',
    rolePlaceholder: '请选择角色',
    remarkPlaceholder: '请输入备注',
    usernameLength: '长度在 2 到 50 个字符',
    passwordLength: '长度在 6 到 32 个字符',
    emailInvalid: '请输入正确的邮箱地址',
    deleteConfirm: '确认删除用户「{name}」吗？',
    batchDeleteConfirm: '确认删除选中的 {count} 个用户吗？',
    deleteSuccess: '删除成功',
    batchDeleteSuccess: '批量删除成功',
    exportFileName: '用户列表',
    resetPasswordTitle: '重置密码',
    resetPasswordPlaceholder: '请输入新密码',
    resetPasswordError: '密码长度 6-20 位',
    resetPasswordSuccess: '密码重置成功'
  },

  // ==================== 审计追踪 ====================
  audit: {
    title: '审计追踪',
    myTitle: '我的操作记录',
    userName: '操作人',
    action: '操作类型',
    target: '操作对象',
    oldValue: '修改前',
    newValue: '修改后',
    result: '结果',
    success: '成功',
    failed: '失败',
    ip: 'IP地址',
    createdAt: '操作时间',
    timeRange: '时间范围',
    startTime: '开始时间',
    endTime: '结束时间'
  }
}
