/**
 * 超级面板模块 - 菜单配置国际化字段
 * 大厂规范：统一嵌套对象结构，按功能区分组
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  // ==================== 页面通用 ====================
  page: {
    // 【页面】页面标题
    title: '菜单配置',
    // 【页面】页面描述
    desc: '管理系统菜单结构，支持菜单的增删改查、拖拽排序和预览',
    // 【操作】操作
    action: '操作',
    // 【状态】加载中
    loading: '加载中...'
  },

  // ==================== 菜单树 ====================
  tree: {
    // 【操作】添加顶级菜单
    addTop: '添加顶级菜单',
    // 【标签】菜单树
    title: '菜单树',
    // 【标签】菜单数量
    count: '菜单数量',
    // 【操作】刷新菜单
    refresh: '刷新菜单',
    // 【提示】点击左侧菜单查看详情
    clickToViewDetail: '点击左侧菜单查看详情'
  },

  // ==================== 菜单详情字段 ====================
  detail: {
    // 【标签】菜单详情
    title: '菜单详情',
    // 【标签】基本信息
    basicInfo: '基本信息',
    // 【标签】显示配置
    displayConfig: '显示配置',
    // 【标签】路由配置
    routeConfig: '路由配置',
    // 【标签】排序和类型
    sortAndType: '排序和类型',
    // 【字段】始终显示
    alwaysShow: '始终显示',
    // 【字段】组件
    component: '组件',
    // 【字段】隐藏
    hidden: '隐藏',
    // 【字段】图标
    icon: '图标',
    // 【字段】ID
    id: '菜单ID',
    // 【字段】名称
    name: '路由名称',
    // 【字段】不缓存
    noCache: '不缓存',
    // 【字段】父级ID
    parentId: '父级ID',
    // 【字段】路径
    path: '路由路径',
    // 【字段】重定向
    redirect: '重定向',
    // 【字段】排序
    sort: '排序',
    // 【字段】标题
    menuTitle: '菜单标题',
    // 【字段】类型
    type: '菜单类型',
    // 【字段】更新时间
    updateTime: '更新时间',
    // 【标签】只读
    readonly: '（只读）'
  },

  // ==================== 编辑模式 ====================
  edit: {
    // 【标签】编辑模式
    mode: '编辑模式',
    // 【提示】编辑模式提示
    modeTip: '在编辑模式下可以修改菜单配置，保存后生效',
    // 【操作】进入编辑模式
    enter: '进入编辑模式',
    // 【操作】退出编辑模式
    exit: '退出编辑模式',
    // 【标签】查看模式
    viewMode: '查看模式',
    // 【操作】保存变更
    save: '保存变更',
    // 【操作】保存并退出
    saveAndExit: '保存并退出',
    // 【操作】放弃变更
    discard: '放弃变更',
    // 【操作】撤销变更
    undo: '撤销变更',
    // 【提示】没有变更
    noChanges: '没有未保存的变更',
    // 【提示】有未保存的变更
    unsavedChanges: '有未保存的变更',
    // 【确认】确认退出
    confirmExit: '有未保存的变更，确定要退出吗？',
    // 【标签】变更统计
    changeStats: '变更统计',
    // 【统计】新增数量
    changeAdded: '新增',
    // 【统计】删除数量
    changeDeleted: '删除',
    // 【统计】修改数量
    changeModified: '修改'
  },

  // ==================== 菜单类型与状态 ====================
  type: {
    // 【类型】按钮
    button: '按钮',
    // 【类型】目录
    directory: '目录',
    // 【类型】菜单
    menu: '菜单',
    // 【类型】参数
    param: '参数',
    // 【状态】状态-隐藏
    hidden: '隐藏'
  },

  // ==================== 删除菜单 ====================
  delete: {
    // 【操作】删除
    action: '删除',
    // 【操作】删除菜单
    menu: '删除菜单',
    // 【提示】删除权限提示
    permissionTip: '您没有权限删除此菜单',
    // 【操作】确认删除
    confirm: '确认删除',
    // 【按钮】确认删除按钮
    confirmButton: '确定删除',
    // 【消息】确认删除消息
    message: '确定要删除此菜单吗？删除后不可恢复',
    // 【标题】确认删除标题
    title: '删除确认',
    // 【确认】确认删除含子菜单
    withChildren: '该菜单包含子菜单，确定要一并删除吗？'
  },

  // ==================== 菜单备份 ====================
  backup: {
    // 【操作】创建备份
    create: '创建备份',
    // 【标题】创建备份标题
    createTitle: '创建菜单备份',
    // 【消息】备份创建失败
    createFailed: '创建备份失败',
    // 【消息】备份创建成功
    createSuccess: '创建备份成功',
    // 【消息】备份删除失败
    deleteFailed: '删除备份失败',
    // 【消息】备份删除成功
    deleteSuccess: '删除备份成功',
    // 【标签】备份文件名
    fileName: '备份文件名',
    // 【标签】备份历史
    history: '备份历史',
    // 【标题】备份清单标题
    listTitle: '备份清单',
    // 【占位符】备份备注占位符
    remarkPlaceholder: '请输入备份备注（可选）',
    // 【提示】没有备份文件
    noFiles: '暂无备份文件',
    // 【标签】文件大小
    fileSize: '文件大小',
    // 【标签】创建时间
    createdAt: '创建时间',
    // 【标签】备注
    remark: '备注',
    // 【标签】当前备份路径
    currentPath: '当前备份路径',
    // 【提示】当前备份路径提示
    currentPathTip: '当前菜单备份文件存储的目录路径',
    // 【标签】新备份路径
    newPath: '新备份路径',
    // 【占位符】新备份路径占位符
    newPathPlaceholder: '请输入新的备份目录路径',
    // 【提示】新备份路径提示
    newPathTip: '输入新的菜单备份目录路径，点击保存后生效',
    // 【标题】备份路径标题
    pathTitle: '备份路径设置',
    // 【消息】保存路径失败
    savePathFailed: '修改备份路径失败',
    // 【消息】保存路径成功
    savePathSuccess: '修改备份路径成功'
  },

  // ==================== 预览 ====================
  preview: {
    // 【描述】预览描述
    desc: '预览菜单配置的实际效果',
    // 【操作】预览效果
    action: '预览效果',
    // 【消息】预览加载失败
    loadFailed: '加载预览数据失败',
    // 【提示】预览主要提示1
    mainTip: '预览窗口将在新标签页打开',
    // 【提示】预览主要提示2
    mainTip2: '预览数据保存在本地存储中，关闭预览窗口后失效',
    // 【标签】预览菜单数量
    menuCount: '预览菜单数量',
    // 【标签】预览模式
    mode: '预览模式',
    // 【提示】预览无数据
    noData: '暂无预览数据',
    // 【标签】预览时间
    time: '预览时间',
    // 【标题】预览标题
    title: '菜单预览'
  },

  // ==================== 注意事项 ====================
  warning: {
    // 【标题】警告标题
    title: '注意事项',
    // 【警告】警告1
    item1: '进入编辑模式后，所有修改在保存前不会生效',
    // 【警告】警告2
    item2: '删除菜单将同时删除其所有子菜单，请谨慎操作',
    // 【警告】警告3
    item3: '菜单标题使用国际化key，修改后需要在语言配置中添加对应翻译',
    // 【警告】警告4
    item4: '拖拽菜单可以调整排序和父子关系',
    // 【警告】警告5
    item5: '预览功能在新窗口中打开，用于查看菜单的实际显示效果'
  },

  // ==================== 菜单编辑弹窗 ====================
  dialog: {
    // 【标题】编辑菜单
    editTitle: '编辑菜单',
    // 【标题】新增菜单
    addTitle: '新增菜单',
    // 【标签】菜单ID
    menuId: '菜单ID',
    // 【占位符】菜单ID占位符
    menuIdPlaceholder: '如：_105_11',
    // 【标签】菜单类型
    menuType: '菜单类型',
    // 【标签】路由Name
    routeName: '路由Name',
    // 【占位符】路由Name占位符
    routeNamePlaceholder: '如：SuperMenuConfig',
    // 【标签】路由Path
    routePath: '路由Path',
    // 【占位符】路由Path占位符
    routePathPlaceholder: '如：menu-config',
    // 【标签】组件路径
    componentPath: '组件路径',
    // 【占位符】组件路径占位符
    componentPathPlaceholder: '如：super-panel/menu-config/index',
    // 【标签】重定向
    redirectLabel: '重定向',
    // 【占位符】重定向占位符
    redirectPlaceholder: '如：noRedirect',
    // 【标签】菜单标题(i18n)
    titleI18n: '菜单标题(i18n)',
    // 【占位符】菜单标题占位符
    titlePlaceholder: '如：layout.menu.superPanel.menuConfig.default',
    // 【标签】图标
    iconLabel: '图标',
    // 【占位符】图标占位符
    iconPlaceholder: '如：el-icon-setting',
    // 【标签】排序号
    sortNo: '排序号',
    // 【标签】是否隐藏
    hiddenFlag: '是否隐藏',
    // 【标签】永远展示
    alwaysShowFlag: '永远展示',
    // 【标签】不缓存
    noCacheFlag: '不缓存',
    // 【标签】父菜单ID
    parentId: '父菜单ID',
    // 【占位符】父菜单ID占位符
    parentIdPlaceholder: '顶级菜单留空，如：_105',
    // 【校验】菜单ID必填
    idRequired: '请输入菜单ID',
    // 【校验】路由Name必填
    nameRequired: '请输入路由Name',
    // 【校验】路由Path必填
    pathRequired: '请输入路由Path',
    // 【校验】菜单标题必填
    titleRequired: '请输入菜单标题',
    // 【校验】菜单类型必填
    typeRequired: '请选择菜单类型'
  },

  // ==================== 运行时消息 ====================
  messages: {
    loadFailed: '加载菜单数据失败',
    enterEdit: '已进入编辑模式',
    confirmExitTitle: '确认退出',
    noChangesToSave: '没有需要保存的修改',
    saveFailed: '保存失败',
    saveFailedRetry: '保存失败，请稍后重试',
    undone: '已撤销所有修改',
    refreshed: '菜单已刷新',
    importBadFormat: '导入文件格式不正确，缺少 menuData 字段',
    importBackupType: '备份文件',
    importExportType: '导出文件',
    importConfirm: '检测到{type}，导入将覆盖当前菜单配置，是否继续？',
    importConfirmTitle: '确认导入',
    importConfirmButton: '确定导入',
    importSuccess: '菜单配置已导入',
    importFailed: '导入失败，文件格式不正确',
    updated: '菜单已更新，保存后生效',
    added: '菜单已添加，保存后生效',
    markedDeleted: '菜单已标记删除，保存后生效',
    reordered: '菜单顺序已调整，保存后生效',
    topMenu: '顶级菜单'
  },

  // ==================== 通用操作 ====================
  common: {
    // 【操作】取消
    cancel: '取消',
    // 【操作】刷新
    refresh: '刷新',
    // 【操作】导入配置
    importConfig: '导入配置',
    // 【消息】保存成功
    saveSuccess: '保存成功',
    // 【提示】路径不能为空
    pathNotEmpty: '路径不能为空'
  }
}
