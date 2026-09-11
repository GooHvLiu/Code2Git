/**
 * 系统设置模块 - 审计日志国际化字段
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */

export default {
  // 【子模块】页面
  page: {
    // 【标签】操作
    action: '操作',
    // 【标签】创建时间
    createdAt: '创建时间',
    // 【标题】详情标题
    detailTitle: '审计详情',
    // 【标签】结束时间
    endTime: '结束时间',
    // 【标签】IP地址
    ip: 'IP地址',
    // 【标题】我的标题
    myTitle: '我的审计日志',
    // 【标签】新值
    newValue: '新值',
    // 【标签】旧值
    oldValue: '旧值',
    // 【页面】页面描述
    pageDesc: '查看系统操作审计日志',
    // 【标签】结果
    result: '结果',
    // 【标签】开始时间
    startTime: '开始时间',
    // 【标签】目标
    target: '目标',
    // 【标签】时间范围
    timeRange: '时间范围',
    // 【页面】标题
    title: '审计日志',
    // 【标签】用户名
    userName: '用户名'
  },

  // 【子模块】审计操作类型与所属模块名（后端 auditRules 的 titleKey/moduleKey 动态引用）
  action: {
    audit: {
      export: {
        title: '审计日志导出',
      },
      verify: {
        title: '审计哈希链校验',
      },
      view: {
        title: '审计日志查看',
      },
    },
    config: {
      connection: {
        change: {
          title: '连接配置修改',
        },
      },
      device: {
        change: {
          title: '设备配置修改',
        },
      },
      export: {
        change: {
          title: '导出配置修改',
        },
      },
      order: {
        change: {
          title: '订单配置修改',
        },
      },
      plc: {
        change: {
          title: 'PLC连接配置修改',
        },
      },
      security: {
        change: {
          title: '安全配置修改',
        },
      },
      system: {
        change: {
          title: '系统参数修改',
        },
      },
    },
    data: {
      export: {
        title: '数据导出',
      },
      viewDetail: {
        title: '数据查看详情',
      },
    },
    device: {
      alarm: {
        handle: {
          title: '报警处理',
        },
      },
      paramChange: {
        title: '设备参数修改',
      },
      part: {
        create: {
          title: '新增部件',
        },
        delete: {
          title: '删除部件',
        },
        replace: {
          title: '更换部件',
        },
        update: {
          title: '编辑部件',
        },
      },
      statusChange: {
        title: '设备状态变更',
      },
    },
    email: {
      configChange: {
        title: '邮箱配置修改',
      },
      logDelete: {
        title: '邮箱日志删除',
      },
    },
    license: {
      expire: {
        title: '授权到期',
      },
      import: {
        title: '授权导入',
      },
    },
    permission: {
      cacheClear: {
        title: '权限缓存清除',
      },
      change: {
        title: '权限配置变更',
      },
    },
    plc: {
      connect: {
        title: 'PLC连接',
      },
      disconnect: {
        title: 'PLC断开',
      },
      read: {
        title: 'PLC参数读取',
      },
      reconnect: {
        title: 'PLC重连',
      },
      write: {
        title: 'PLC参数写入',
      },
    },
    production: {
      order: {
        create: {
          title: '新增生产订单',
        },
        delete: {
          title: '删除生产订单',
        },
        download: {
          title: '下载生产订单',
        },
        update: {
          title: '编辑生产订单',
        },
      },
      recipe: {
        download: {
          title: '配方下载',
        },
      },
    },
    role: {
      create: {
        title: '创建角色',
      },
      delete: {
        title: '删除角色',
      },
      update: {
        title: '修改角色',
      },
    },
    user: {
      batchDelete: {
        title: '批量删除用户',
      },
      changePassword: {
        title: '修改密码',
      },
      create: {
        title: '创建用户',
      },
      delete: {
        title: '删除用户',
      },
      login: {
        title: '用户登录',
      },
      loginFailed: {
        title: '用户登录失败',
      },
      logout: {
        title: '用户登出',
      },
      register: {
        title: '用户注册',
      },
      resetPassword: {
        title: '重置密码',
      },
      roleChange: {
        title: '用户角色变更',
      },
      statusChange: {
        title: '修改用户状态',
      },
      update: {
        title: '修改用户',
      },
    },
  },
  module: {
    audit: '审计自身',
    config: '系统配置',
    data: '数据管理',
    device: '设备管理',
    email: '邮箱配置',
    license: '授权管理',
    permission: '权限管理',
    plc: 'PLC操作',
    production: '生产管理',
    user: '用户管理',
  },
}
