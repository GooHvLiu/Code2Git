/**
 * 布局模块 - 菜单数据翻译国际化字段
 * 侧边栏菜单、面包屑导航、标签页标题相关翻译
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  // 【菜单】首页
  home: {
    // 【菜单】默认标题
    default: '网站首页',
    // 【菜单】概况预览
    overview: {
      // 【菜单】默认标题
      default: '概况预览'
    },
    // 【菜单】数据看板
    dashboard: {
      // 【菜单】默认标题
      default: '数据看板'
    },
    // 【菜单】数据管理
    dataview: {
      // 【菜单】默认标题
      default: '数据管理',
      // 【操作】搜索
      search: '搜索',
      // 【操作】重置
      reset: '重置',
      // 【操作】导出
      export: '导出',
      // 【操作】刷新
      refresh: '刷新',
      // 【操作】详情
      detail: '详情',
      // 【操作】单个导出
      exportSingle: '单个导出',
      // 【子菜单】产能数据
      output: {
        // 【菜单】标题
        title: '产能数据'
      },
      // 【子菜单】稼动率数据
      oee: {
        // 【菜单】标题
        title: '稼动率数据'
      },
      // 【子菜单】生产数据
      production: {
        // 【菜单】标题
        title: '生产数据'
      },
      // 【子菜单】报警数据
      alarm: {
        // 【菜单】标题
        title: '报警数据'
      }
    }
  },
  // 【菜单】设备管理
  device: {
    // 【菜单】默认标题
    default: '设备管理',
    // 【菜单】设备状态
    state: {
      // 【菜单】默认标题
      default: '设备状态',
      // 【菜单】设备控制
      control: '设备控制'
    },
    // 【菜单】报警统计
    alarm: {
      // 【菜单】默认标题
      default: '报警统计',
      // 【子菜单】统计看板
      dashboard: {
        // 【菜单】标题
        title: '统计看板'
      },
      // 【子菜单】详细记录
      list: {
        // 【菜单】标题
        title: '详细记录'
      },
      // 【操作】搜索
      search: '搜索',
      // 【操作】重置
      reset: '重置',
      // 【操作】导出
      export: '导出',
      // 【操作】刷新
      refresh: '刷新',
      // 【操作】详情
      detail: '详情',
      // 【操作】处理
      handle: '处理'
    },
    // 【菜单】部件寿命
    part: {
      // 【菜单】默认标题
      default: '部件寿命',
      // 【操作】搜索
      search: '搜索',
      // 【操作】新增
      add: '新增',
      // 【操作】刷新
      refresh: '刷新',
      // 【操作】编辑
      edit: '编辑',
      // 【操作】更换
      operate: '更换',
      // 【操作】删除
      delete: '删除',
      // 【标签页】寿命详情
      tab: {
        life: '寿命详情',
        template: '模板管理'
      },
      // 【子模块】部件页面
      page: {
        // 【子模块】基础部件模板名称（数据库 device_part_template.name_key 动态引用）
        template: {
          // 【部件】灌装针组件
          fillNeedle: '灌装针组件',
          // 【部件】灌装管组件
          fillTube: '灌装管组件',
          // 【部件】加塞杆部件
          stopperRod: '加塞杆部件',
          // 【部件】真空组件
          vacuumUnit: '真空组件'
        }
      },
      // 【子模块】模板管理按钮菜单（数据库 nex_menu 在用）
      template: {
        // 【操作】新增模板
        add: '新增模板',
        // 【操作】编辑
        edit: '编辑',
        // 【操作】删除
        delete: '删除',
        // 【操作】搜索模板
        search: '搜索模板',
        // 【操作】刷新
        refresh: '刷新'
      }
    }
  },
  // 【菜单】生产管理
  production: {
    // 【菜单】默认标题
    default: '生产管理',
    // 【菜单】配方管理
    recipe: {
      // 【菜单】默认标题
      default: '配方管理',
      // 【操作】下载
      download: '下载'
    },
    // 【菜单】订单管理
    order: {
      // 【菜单】默认标题
      default: '订单管理',
      // 【标签页】已完成
      completed: {
        // 【菜单】标题
        title: '已完成'
      },
      // 【操作】下载
      download: '下载',
      // 【标签页】已计划
      planned: {
        // 【菜单】标题
        title: '已计划'
      },
      // 【操作】新增
      add: '新增',
      // 【操作】删除
      delete: '删除',
      // 【操作】编辑
      edit: '编辑',
      // 【标签页】运行中
      running: {
        // 【菜单】标题
        title: '运行中'
      }
    }
  },
  // 【菜单】系统设置
  system: {
    // 【菜单】默认标题
    default: '系统设置',
    // 【菜单】用户管理
    user: {
      // 【菜单】默认标题
      default: '用户管理'
    },
    // 【菜单】审计日志
    audit: {
      // 【菜单】默认标题
      default: '审计日志'
    },
    // 【菜单】参数配置
    config: {
      // 【菜单】默认标题
      default: '参数管理',
      // 【子菜单】子菜单
      childrenMenu: {
        // 【子菜单】邮件日志
        emailLog: {
          // 【菜单】标题
          title: '邮件日志',
          // 【操作】导出按钮
          exportBtn: '导出',
          // 【操作】删除按钮
          deleteBtn: '删除',
          // 【操作】查看详情
          viewDetail: '查看详情'
        },
        // 【操作】重置
        reset: '重置',
        // 【操作】保存
        save: '保存',
        // 【子菜单】设备配置
        device: {
          // 【菜单】标题
          title: '设备配置',
          // 【参数】设备名称
          deviceName: '设备名称',
          // 【参数】设备编码
          deviceCode: '设备编码',
          // 【参数】设备区域
          deviceRegion: '设备区域',
          // 【参数】设备安装日期
          deviceInstallDate: '设备安装日期',
          // 【参数】部件寿命提醒启用
          partLifeReminderEnabled: '部件寿命提醒启用',
          // 【参数】部件寿命阈值
          partLifeThreshold: '部件寿命阈值',
          // 【参数】部件寿命提醒间隔
          partLifeRemindInterval: '部件寿命提醒间隔',
          // 【参数】贪睡间隔
          snoozeInterval: '贪睡间隔'
        },
        // 【子菜单】导出配置
        export: {
          // 【菜单】标题
          title: '导出配置',
          // 【参数】PDF水印启用
          pdfWatermarkEnabled: 'PDF水印启用',
          // 【参数】PDF水印文本
          pdfWatermarkText: 'PDF水印文本'
        },
        // 【子菜单】授权配置
        license: {
          // 【菜单】管理标题
          manageTitle: '授权信息',
          // 【操作】刷新
          refresh: '刷新',
          // 【操作】导入授权
          importLicense: '导入授权',
          // 【操作】下载
          download: '下载'
        },
        // 【子菜单】授权设置
        licenseSetting: {
          // 【菜单】标题
          title: '授权配置',
          // 【参数】到期天数
          expiringDays: '到期天数',
          // 【参数】宽限期
          gracePeriod: '宽限期',
          // 【参数】检查间隔
          checkInterval: '检查间隔'
        },
        // 【子菜单】通知配置
        notification: {
          // 【菜单】标题
          title: '通知配置',
          // 【参数】自动已读天数
          autoReadDays: '自动已读天数',
          // 【参数】声音启用
          soundEnabled: '声音启用'
        },
        // 【子菜单】订单配置
        order: {
          // 【菜单】标题
          title: '订单配置',
          // 【参数】允许无订单生产
          allowNoOrderProduction: '允许无订单生产',
          // 【参数】无订单生产高亮
          noOrderProductionHighlight: '无订单生产高亮',
          // 【参数】订单切换确认
          orderSwitchConfirm: '订单切换确认',
          // 【参数】自动归档已完成
          autoArchiveCompleted: '自动归档已完成',
          // 【参数】显示操作人姓名
          showOperatorName: '显示操作人姓名',
          // 【参数】显示报警数量
          showAlarmCount: '显示报警数量',
          // 【参数】显示运行时长
          showRuntime: '显示运行时长',
          // 【参数】报告包含报警详情
          reportIncludeAlarmDetail: '报告包含报警详情',
          // 【参数】报告包含操作人详情
          reportIncludeOperatorDetail: '报告包含操作人详情',
          // 【参数】报告包含下载数量
          reportIncludeDownloadCount: '报告包含下载数量',
          // 【参数】允许运行中订单下载
          allowRunningOrderDownload: '允许运行中订单下载'
        },
        // 【子菜单】安全配置
        security: {
          // 【菜单】标题
          title: '安全配置',
          // 【参数】登录失败阈值
          loginFailedThreshold: '登录失败阈值',
          // 【参数】锁定时长分钟
          lockDurationMinutes: '锁定时长分钟'
        },
        // 【子菜单】系统配置
        system: {
          // 【菜单】标题
          title: '系统配置',
          // 【参数】日期格式
          dateFormat: '日期格式'
        }
      },
      // 【参数】参数
      param: {
        // 【参数】会话超时
        sessionTimeout: {
          // 【操作】查看
          view: '查看',
          // 【操作】编辑
          edit: '编辑'
        },
        // 【参数】默认页面大小
        defaultPageSize: {
          // 【操作】查看
          view: '查看',
          // 【操作】编辑
          edit: '编辑'
        },
        // 【参数】默认语言
        defaultLanguage: {
          // 【操作】查看
          view: '查看',
          // 【操作】编辑
          edit: '编辑'
        },
        // 【参数】水印启用
        watermarkEnabled: {
          // 【操作】查看
          view: '查看',
          // 【操作】编辑
          edit: '编辑'
        },
        // 【参数】水印文本
        watermarkText: {
          // 【操作】查看
          view: '查看',
          // 【操作】编辑
          edit: '编辑'
        }
      }
    },
    // 【菜单】权限管理
    permission: {
      // 【菜单】默认标题
      default: '权限管理'
    },
    // 【菜单】设备管理
    device: {
      // 【菜单】默认标题
      default: '设备管理',
      // 【操作】踢下线
      kick: '踢下线',
      // 【操作】删除
      delete: '删除'
    }
  },
  // 【菜单】超级面板
  superPanel: {
    // 【菜单】默认标题
    default: '超级面板',
    // 【菜单】字典管理
    dict: {
      // 【菜单】默认标题
      default: '字典管理'
    },
    // 【菜单】部门管理
    dept: {
      // 【菜单】默认标题
      default: '部门管理'
    },
    // 【菜单】角色管理
    role: {
      // 【菜单】默认标题
      default: '角色管理'
    },
    // 【菜单】参数配置
    config: {
      // 【菜单】默认标题
      default: '参数管理'
    },
    // 【菜单】权限管理
    permission: {
      // 【菜单】默认标题
      default: '权限管理',
      // 【子模块】页面
      page: {
        // 【页面】页面标题
        title: '权限配置',
        // 【页面】页面描述
        desc: '角色权限配置管理',
        // 【消息】保存成功
        saveSuccess: '权限保存成功'
      }
    },
    // 【菜单】功能配置
    feature: {
      // 【菜单】默认标题
      default: '功能管理'
    },
    // 【菜单】数据库管理
    database: {
      // 【菜单】默认标题
      default: '数据管理'
    },
    // 【菜单】项目配置
    projectConfig: {
      // 【菜单】默认标题
      default: '项目管理'
    },
    // 【菜单】菜单配置
    menuConfig: {
      // 【菜单】默认标题
      default: '菜单管理'
    },
    // 【菜单】语言配置
    i18n: {
      // 【菜单】默认标题
      default: '语言管理'
    }
  }
}
