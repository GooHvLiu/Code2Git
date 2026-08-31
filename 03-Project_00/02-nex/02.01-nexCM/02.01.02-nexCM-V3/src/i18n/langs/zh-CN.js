/**
 * ==========================================
 * 中文语言包
 * ==========================================
 * 按模块分组，新增文案在此添加
 * 结构与 en-US.js 保持一致
 */
export default {
  // 通用
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
    exportExcel: '导出Excel',
    exportPdf: '导出PDF',
    selected: '已选中',
    import: '导入',
    refresh: '刷新',
    operation: '操作',
    status: '状态',
    index: '序号',
    sort: '排序',
    description: '描述',
    remark: '备注',
    enable: '启用',
    all: '全部',
    disable: '禁用',
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
    systemName: 'nexCM 管理系统',
    systemDESC: '桌面式灌装加塞设备',
    electronicSignature: '电子签名',
    featureComingSoon: '功能开发中',
    noDataToExport: '没有可导出的数据',
    operator: '操作人',
    reason: '操作原因',
    reasonPlaceholder: '请输入操作原因（GMP要求）',
    reasonRequired: '请填写操作原因',
    reasonMinLength: '操作原因至少2个字符',
    password: '密码',
    passwordPlaceholder: '请输入密码进行电子签名',
    passwordRequired: '请输入密码',
    sessionTimeout: '会话超时，请重新登录',
    // 权限相关通用按钮
    download: '下载',
    print: '打印',
    viewDetail: '查看详情',
    statusChange: '状态切换',
    refreshCache: '刷新缓存',
    // 导出 PDF 副标题标签
    exportLabels: {
      exporter: '导出人',
      time: '导出时间',
      countPrefix: '共',
      countSuffix: '条记录'
    },
  },
  // 菜单（权限系统用，后端返回 i18n key） 
  menu: {
    // 网站首页
    home: {
      default: '网站首页',
      overview: {
        default: '概况预览'
      },
      dashboard: {
        default: '数据看板'
      },
      dataview: {
        default: '数据管理',
        export: '导出',
        detail: '详情',
        view: '详情'
      }
    },
    // 设备管理
    device: {
      default: '设备管理',
      state: {
        default: '设备状态',
        control: '设备控制'
      },
      alarm: {
        default: '报警统计',
        export: '导出',
        detail: '详情',
        handle: '处理'
      },
      part: {
        default: '部件寿命',
        operate: '操作',
        viewAll: '查看全部'
      }
    },
    // 生产管理
    production: {
      default: '生产管理',
      recipe: {
        default: '配方管理',
        download: '下载',
        page: {
          desc: '生产配方管理与参数配置',
          recipe: '配方',
          recipeList: '配方列表',
          recipeCode: '配方编号',
          recipeName: '配方名称',
          productType: '产品类型',
          fillVolume: '灌装量',
          inUse: '使用中',
          notInUse: '未使用',
          download: '下载',
          downloadAll: '全部下载',
          exportExcel: '导出 Excel',
          exportPdf: '导出 PDF',
          basicInfo: '基本信息',
          axisParams: '轴位参数',
          speedParams: '速度参数',
          delayParams: '延时与工艺参数',
          analysis: '智能分析',
          fillAngle: '灌装角度',
          suckBackAngle: '回吸角度',
          fillAxisInit: '灌装轴初始位',
          fillAxisReach: '灌装轴到位',
          fixAxisInit: '固定轴初始位',
          fixAxisReach: '固定轴到位',
          fixAxisPreLift: '固定轴预抬',
          stopperAxisInit: '挡瓶轴初始位',
          stopperAxisPrePress: '挡瓶轴预压',
          stopperAxisReach: '挡瓶轴到位',
          fillAxisInitSpeed: '灌装轴初始速度',
          fillAxisReachSpeed: '灌装轴到位速度',
          fixAxisInitSpeed: '固定轴初始速度',
          fixAxisReachSpeed: '固定轴到位速度',
          fixAxisPreLiftSpeed: '固定轴预抬速度',
          stopperAxisInitSpeed: '挡瓶轴初始速度',
          stopperAxisPrePressSpeed: '挡瓶轴预压速度',
          stopperAxisReachSpeed: '挡瓶轴到位速度',
          fillDelay: '灌装延时',
          vacuumDelay: '真空延时',
          fillSpeed: '灌装速度',
          suckBackSpeed: '回吸速度',
          usageCount: '使用次数',
          faultRate: '故障率',
          avgQualifiedRate: '平均合格率',
          lastUsed: '上次使用'
        }
      },
      order: {
        default: '生产订单',
        add: '新增',
        edit: '编辑',
        delete: '删除',
        download: '下载',
        export: '导出',
        print: '打印',
        page: {
          desc: '生产订单管理与报告导出',
          completed: '完成订单',
          running: '进行中订单',
          planned: '计划订单',
          orderNo: '订单编号',
          productName: '产品名称',
          recipeName: '配方',
          batchNo: '批次号',
          targetQty: '目标数量',
          completedQty: '完成数量',
          qualifiedQty: '合格数量',
          unqualifiedQty: '不合格数量',
          qualifiedRate: '合格率',
          operator: '操作人员',
          startTime: '开始时间',
          endTime: '结束时间',
          runtime: '运行时长',
          alarmCount: '报警次数',
          status: '状态',
          progress: '生产进度',
          estimatedEnd: '预计完成',
          priority: '优先级',
          queuePosition: '排队位置',
          downloadCount: '已下载次数',
          download: '下载报告',
          downloadSelected: '下载选中',
          downloadAll: '下载全部',
          exportPdf: '导出 PDF 报告',
          noOrderProduction: '无订单生产',
          orderReport: '订单生产报告',
          reportBasicInfo: '基本信息',
          reportProductionStats: '生产统计',
          reportQualityStats: '质量统计',
          reportAlarmDetail: '报警明细',
          reportOperatorDetail: '操作人员明细',
          reportGeneratedBy: '报告生成人',
          reportGeneratedAt: '报告生成时间',
          high: '高',
          normal: '普通',
          low: '低',
          statusCompleted: '已完成',
          statusRunning: '生产中',
          statusPlanned: '待生产',
          selectOrderTip: '请选择要下载的订单',
          plannedNoDownload: '计划订单不支持下载报告',
          runningNoDownload: '进行中订单暂不支持下载报告（可在系统设置中开启）',
          // 新增/编辑订单
          add: '新增订单',
          edit: '编辑订单',
          delete: '删除',
          orderNoPlaceholder: '请输入订单编号',
          productNamePlaceholder: '请输入产品名称',
          recipeNamePlaceholder: '请选择配方',
          batchNoPlaceholder: '请输入批次号',
          startTimePlaceholder: '请选择开始时间',
          estimatedEndPlaceholder: '请选择预计完成时间',
          addSuccess: '订单新增成功',
          editSuccess: '订单编辑成功',
          deleteSuccess: '订单删除成功',
          deleteConfirm: '确定要删除订单「{orderNo}」吗？此操作不可恢复。',
          formRequired: '请填写完整的订单信息'
        }
      }
    },
    // 系统设置
    system: {
      default: '系统设置',
      dict: {
        default: '字典管理',
        page: {
          typeList: '字典类型列表',
          typeName: '字典名称',
          typeCode: '字典编码',
          itemLabelRequired: '请输入字典项标签',
          itemValueRequired: '请输入字典项值',
          typeCodePlaceholder: '请输入字典编码',
          typeNameRequired: '请输入字典名称',
          typeCodeRequired: '请输入字典编码',
          itemList: '字典项列表',
          itemLabel: '字典标签',
          itemValue: '字典键值',
          itemValuePlaceholder: '请输入字典键值',
          itemStatus: '状态'
        }
      },
      dept: {
        default: '部门管理',
        page: {
          title: '部门管理',
          deptName: '部门名称',
          deptNamePlaceholder: '请输入部门名称',
          deptNameRequired: '请输入部门名称',
          orderNum: '显示排序',
          leader: '负责人',
          phone: '联系电话',
          email: '邮箱',
          addChild: '新增子部门',
          parentDept: '上级部门',
          parentDeptPlaceholder: '选择上级部门'
        }
      },
      role: {
        default: '角色管理',
        page: {
          title: '角色管理',
          roleName: '角色名称',
          roleCode: '角色编码',
          permission: '权限配置',
          permissionTitle: '菜单权限分配',
          dataScope: '数据范围',
          dataScopeAll: '全部数据',
          dataScopeDept: '本部门数据',
          dataScopeDeptAndChild: '本部门及以下数据',
          dataScopeSelf: '仅本人数据'
        }
      },
      user: {
        default: '用户管理',
        page: {
          title: '用户管理',
          username: '用户名',
          usernamePlaceholder: '请输入用户名',
          realName: '真实姓名',
          realNamePlaceholder: '请输入真实姓名',
          email: '邮箱',
          emailPlaceholder: '请输入邮箱',
          phone: '手机号',
          phonePlaceholder: '请输入手机号',
          role: '角色',
          rolePlaceholder: '请选择角色',
          dept: '部门',
          deptPlaceholder: '请选择部门',
          status: '状态',
          createTime: '创建时间',
          password: '密码',
          passwordPlaceholder: '请输入密码',
          confirmPassword: '确认密码',
          sex: '性别',
          remark: '备注',
          remarkPlaceholder: '请输入备注',
          add: '新增用户',
          edit: '编辑用户',
          resetPassword: '重置密码',
          import: '导入',
          export: '导出'
        }
      },
      audit: {
        default: '审计日志',
        search: '搜索/重置/刷新',
        export: '导出',
        detail: '详情',
        page: {
          title: '审计日志',
          myTitle: '我的操作日志',
          userName: '用户名',
          action: '操作类型',
          target: '操作目标',
          timeRange: '时间范围',
          startTime: '开始时间',
          endTime: '结束时间',
          oldValue: '旧值',
          newValue: '新值',
          result: '操作结果',
          ip: 'IP地址',
          createdAt: '创建时间',
          detail: '详情',
          verify: '审核'
        }
      },
      config: {
        default: '参数配置',
        edit: '编辑',
        export: '导出',
        refresh: '刷新缓存',
        param: {
          sessionTimeout: {
            view: '会话超时-查看',
            edit: '会话超时-编辑'
          },
          defaultPageSize: {
            view: '默认分页大小-查看',
            edit: '默认分页大小-编辑'
          },
          defaultLanguage: {
            view: '默认语言-查看',
            edit: '默认语言-编辑'
          },
          watermarkEnabled: {
            view: '水印开关-查看',
            edit: '水印开关-编辑'
          },
          watermarkText: {
            view: '水印文字-查看',
            edit: '水印文字-编辑'
          },
          plcHost: {
            view: 'PLC主机-查看',
            edit: 'PLC主机-编辑'
          },
          plcPort: {
            view: 'PLC端口-查看',
            edit: 'PLC端口-编辑'
          }
        },
        childrenMenu: {
          title: '参数配置',
          desc: '系统参数配置管理',
          save: '保存',
          reset: '重置',
          loading: '配置加载中，请稍候...',
          loadError: '配置加载失败',
          loadErrorDesc: '请检查网络连接或联系管理员',
          reload: '重新加载',
          incomplete: '配置不完整',
          incompleteDesc: '检测到 {count} 个未初始化的配置项，当前页面禁止编辑和保存。',
          missingKeys: '缺失的配置项：',
          incompleteTip: '请联系管理员执行配置初始化 SQL，或点击下方按钮重新加载。',
          system: {
            title: '系统设置',
            sessionTimeout: '会话超时时间',
            minutes: '分钟',
            defaultPageSize: '默认分页大小',
            defaultLanguage: '默认语言',
            dateFormat: '日期格式'
          },
          security: {
            title: '安全设置',
            watermarkEnabled: '启用水印',
            watermarkText: '水印文字',
            watermarkPlaceholder: '请输入水印文字'
          },
          plc: {
            title: 'PLC 设置',
            protocol: '通讯协议',
            host: 'PLC 地址',
            port: '端口',
            unitId: '单元 ID',
            timeout: '超时时间',
            retryCount: '重试次数',
            pollSettings: '轮询设置',
            pollFast: '快速轮询间隔',
            pollSlow: '慢速轮询间隔'
          },
          export: {
            title: '导出设置',
            format: '导出格式',
            filename: '文件名前缀',
            pdfWatermarkEnabled: 'PDF 启用水印',
            pdfWatermarkText: 'PDF 水印文字',
            pdfWatermarkPlaceholder: '请输入 PDF 水印文字'
          },
          connection: {
            title: '连接设置',
            heartbeatInterval: '心跳间隔',
            deviceStatusCheckInterval: '设备状态检查间隔',
            deviceOfflineThreshold: '设备离线阈值',
            unitSecond: '秒'
          },
          device: {
            title: '设备设置',
            maxOnlineDevices: '最大在线设备数',
            deviceName: '设备名称',
            deviceCode: '设备编码',
            deviceRegion: '设备区域',
            deviceInstallDate: '安装日期',
            partLifeSettingsTitle: '部件寿命提醒设置',
            partLifeReminderEnabled: '启用部件寿命提醒',
            partLifeReminderEnabledTip: '启用后，当部件寿命低于阈值时将自动提醒',
            partLifeThreshold: '寿命提醒阈值',
            partLifeThresholdTip: '当部件剩余寿命低于该阈值时触发提醒',
            partLifeRemindInterval: '提醒间隔',
            intervalHour: '每小时',
            intervalShift: '每班次',
            intervalDay: '每天',
            partLifeRemindIntervalTip: '设置部件寿命提醒的重复间隔',
            snoozeInterval: '稍后提醒间隔',
            snooze5min: '5分钟',
            snooze10min: '10分钟',
            snooze30min: '30分钟',
            snooze1hour: '1小时',
            snooze2hour: '2小时',
            snoozeIntervalTip: '设置"稍后提醒"功能的延迟时间'
          },
          order: {
            title: '订单设置',
            autoComplete: '自动完成',
            productionControl: '生产控制',
            allowNoOrderProduction: '允许无订单生产',
            allowNoOrderProductionTip: '启用后，操作员可以在没有生产订单的情况下开始生产',
            noOrderProductionHighlight: '无订单生产高亮显示',
            noOrderProductionHighlightTip: '启用后，无订单生产的记录将以橙色高亮显示',
            orderSwitchConfirm: '订单切换确认',
            autoArchiveCompleted: '自动归档已完成订单',
            statDisplay: '统计展示',
            showOperatorName: '显示操作员姓名',
            showAlarmCount: '显示报警数量',
            showRuntime: '显示运行时长',
            reportConfig: '报告配置',
            reportIncludeAlarmDetail: '报告包含报警详情',
            reportIncludeOperatorDetail: '报告包含操作员详情',
            reportIncludeDownloadCount: '报告包含下载次数',
            allowRunningOrderDownload: '允许运行中订单下载',
            allowRunningOrderDownloadTip: '启用后，正在运行的订单也可以下载报告'
          },
          license: {
            manageTitle: '授权管理',
            refresh: '刷新',
            importLicense: '导入授权',
            download: '下载授权',
            statusValid: '授权有效',
            statusInvalid: '授权无效',
            expireTime: '过期时间',
            remaining: '剩余时间',
            projectName: '项目名称',
            customerName: '客户名称',
            detailTitle: '授权详细信息',
            licenseId: '授权ID',
            projectId: '项目ID',
            licenseKey: '授权码',
            licenseType: '授权类型',
            maxDevices: '最大设备数',
            maxUsers: '最大用户数',
            createdAt: '创建时间',
            activatedAt: '激活时间',
            issuedAt: '签发时间',
            contact: '联系人',
            phone: '联系电话',
            email: '邮箱',
            unlimited: '无限制',
            features: '功能特性',
            allFeatures: '全部功能',
            machineBind: '机器绑定',
            currentMachineId: '当前机器ID',
            boundMachineId: '绑定机器ID',
            notBoundAny: '未绑定',
            matchStatus: '匹配状态',
            matched: '已匹配',
            notMatched: '未匹配',
            timeGuard: '时间防护',
            timeGuardStatus: '时间防护状态',
            enabled: '已启用',
            notInitialized: '未初始化',
            lastVerified: '上次验证时间',
            serverTime: '服务器时间',
            operation: '操作',
            networkDiagnosis: '网络诊断',
            fileInfo: '授权文件信息',
            filePath: '文件路径',
            fileName: '文件名',
            fileSize: '文件大小',
            lastModified: '最后修改时间',
            noLicenseFile: '暂无授权文件',
            importDialogTitle: '导入授权',
            importTip: '请选择 .lic 格式的授权文件',
            dragUpload: '将文件拖到此处，或点击上传',
            cancel: '取消',
            confirmImport: '确认导入',
            licenseManager: {
              // 品牌信息
              brandTitle: '授权管理系统',
              brandDesc: '安全、稳定、可靠的软件授权解决方案',

              // 功能特性
              featureRsa: 'RSA 非对称加密',
              featureTimeGuard: '时间防回退保护',
              featureMachineBind: '机器码硬件绑定',

              // 表单标题
              importFormTitle: '授权文件导入',

              // 授权状态
              statusValid: '授权有效',
              statusInvalid: '授权无效',
              expireTime: '过期时间',
              permanentValid: '永久有效',

              // 机器码
              currentMachineId: '当前机器码',
              copy: '复制',
              copySuccess: '复制成功',
              copyFailed: '复制失败',
              machineIdTip: '请将此机器码发送给供应商以生成授权文件',

              // 上传区域
              dragUploadTip: '将 .lic 授权文件拖到此处，或点击上传',
              fileSizeTip: '仅支持 .lic 格式的授权文件',
              remove: '移除',
              pleaseSelectFile: '请先选择授权文件',

              // 导入成功
              importSuccessTitle: '授权导入成功',
              importSuccess: '授权文件导入成功',
              licenseId: '授权ID',
              project: '项目名称',
              licenseType: '授权类型',
              issuedAt: '签发时间',
              maxUsers: '最大用户数',
              unlimited: '无限制',

              // 操作按钮
              importLicense: '导入授权',
              enterSystem: '进入系统',
              refreshStatus: '刷新状态',
              cannotGetStatus: '无法获取授权状态',

              // 授权类型
              typeTrial: '试用版',
              typeStandard: '标准版',
              typeEnterprise: '企业版',
              typePerpetual: '永久版',

              // 授权失效原因
              reasonUnknown: '未知原因',
              reasonFileNotFound: '授权文件不存在或验证失败',
              reasonProjectMismatch: '项目不匹配',
              reasonMachineMismatch: '机器码不匹配（硬件绑定）',
              reasonExpired: '授权已过期',
              reasonMissingFeatures: '缺少功能授权',
              reasonTimeRollback: '检测到系统时间回退',
              reasonNetworkSyncFailed: '联网时间校准失败'
            }
          },
        }

      },
      permission: {
        default: '权限配置',
        save: '保存',
        reset: '重置',
        refresh: '刷新缓存',
        page: {
          title: '权限配置',
          desc: '角色权限配置管理',
          expandAll: '展开全部',
          collapseAll: '收起全部',
          roleList: '角色列表',
          current: '当前',
          noRole: '暂无角色',
          permissionTree: '权限树',
          all: '全部',
          menu: '菜单',
          button: '按钮',
          param: '参数',
          searchPlaceholder: '搜索权限...',
          selectRoleTip: '请选择左侧角色进行权限配置',
          save: '保存',
          reset: '重置',
          selected: '选中',
          saveSuccess: '权限保存成功',
          saveFailed: '权限保存失败',
          confirmReset: '确定要重置权限吗？',
          resetSuccess: '权限重置成功',
          selectedCount: '已选中 {count} 项',
          halfSelectedCount: '半选中 {count} 项',
          totalCount: '共 {count} 项'
        }
      },
      device: {
        default: '在线管理',
        kick: '踢掉设备',
        delete: '删除设备',
        page: {
          pageDesc: '在线设备和用户管理',
          onlineDevices: '在线设备',
          unlimited: '无限制',
          maxDevices: '最大设备数',
          onlineUsers: '在线用户',
          usageRate: '在线使用率',
          searchPlaceholder: '搜索设备或用户...',
          filterStatus: '状态筛选',
          statusOnline: '在线',
          statusOffline: '离线',
          deviceName: '设备名称',
          deviceInfo: '设备信息',
          user: '用户',
          ip: 'IP地址',
          loginTime: '登录时间',
          lastActive: '最后活跃时间',
          lastActiveTime: '最后活跃时间',
          status: '状态',
          operation: '操作',
          kick: '踢掉',
          kickConfirm: '确定要踢掉该设备吗？',
          kickConfirmTitle: '踢掉设备确认',
          kickWarningTitle: '踢掉设备警告',
          kickWarningDesc: '确定要踢掉设备 {deviceName} 吗？',
          kickSuccess: '设备已踢掉',
          kickFailed: '踢掉设备失败',
          delete: '删除',
          deleteConfirm: '确定要删除该离线设备吗？',
          deleteConfirmTitle: '删除设备确认',
          deleteWarningTitle: '删除设备警告',
          deleteWarningDesc: '确定要删除离线设备 {deviceName} 吗？',
          deleteSuccess: '设备已删除',
          deleteFailed: '删除设备失败',
          fetchFailed: '获取设备列表失败',
          unknownDevice: '未知设备',
          currentDevice: '当前设备',
          refresh: '刷新',
          refreshStatus: '刷新状态',
          refreshSuccess: '状态已刷新',
          refreshStatusSuccess: '状态刷新成功',
          refreshStatusFailed: '状态刷新失败',
          noData: '暂无数据',
          loading: '加载中...'
        }
      }
    }
  },
  // 标签页
  tagsview: {
    refresh: '刷新页面',
    close: '关闭页面',
    closeOthers: '关闭其他',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '关闭全部'
  },
  // 登录 / 注册
  login: {
    title: '系统登录',
    username: '用户名',
    password: '密码',
    captcha: '验证码',
    loginBtn: '登 录',
    registerBtn: '注 册',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    noAccount: '还没有账号？',
    hasAccount: '已有账号？',
    goLogin: '去登录',
    goRegister: '去注册',
    loginNow: '立即登录',
    registerNow: '立即注册',
    usernameRequired: '请输入用户名',
    passwordRequired: '请输入密码',
    captchaRequired: '请输入验证码',
    emailRequired: '请输入邮箱',
    usernamePlaceholder: '请输入用户名',
    passwordPlaceholder: '请输入密码',
    captchaPlaceholder: '请输入验证码',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    logoutSuccess: '退出成功',
    logoutConfirm: '确定要退出登录吗？',
    // 注册
    registerTitle: '用户注册',
    realName: '真实姓名',
    email: '邮箱',
    phone: '手机号',
    confirmPassword: '确认密码',
    confirmPasswordRequired: '请输入确认密码',
    registerSuccess: '注册成功，请登录',
    // 单点登录
    deviceLimitExceeded: '在线设备数已达上限（最多 {maxDevices} 台），请联系管理员踢掉其他设备',
    kickedOffline: '您的账号已在其他设备登录，您已被踢下线',
    kickNotice: '下线通知',
    kickReason: '您的账号已在其他设备登录',
    // 首次登录
    firstLoginTitle: '首次登录',
    firstLoginDesc: '检测到您是首次登录，请修改初始密码',
    oldPassword: '原密码',
    newPassword: '新密码',
    modifyPassword: '修改密码',
    passwordStrength: '密码强度',
    passwordWeak: '弱',
    passwordMedium: '中',
    passwordStrong: '强',
    passwordTips: '密码长度8-20位，包含大小写字母、数字和特殊字符'
  },
  // 布局
  layout: {
    // 顶部导航
    user: '用户',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    searchMenu: '搜索菜单',
    // 用户菜单
    profile: '个人中心',
    settings: '系统设置',
    logout: '退出登录',
    notificationCenter: '通知中心',
    // 侧边栏
    collapse: '收起',
    expand: '展开'
  },
  // 个人中心
  profile: {
    title: '个人中心',
    basicInfo: '基本信息',
    username: '用户姓名',
    realName: '真实姓名',
    role: '用户角色',
    sex: '用户性别',
    phone: '手机号码',
    email: '用户邮箱',
    status: '用户状态',
    createTime: '创建时间'
  },
  // 快捷菜单
  quickMenu: {
    title: '快捷菜单',
    // 主题调色
    theme: {
      palette: '主题调色',
      resetAll: '重置全部',
      reset: '重置',
      custom: '自定义',
      sidebarBg: '侧边栏背景',
      sidebarHoverText: '侧边栏悬停文字',
      sidebarHoverBg: '侧边栏悬停背景',
      sidebarIconColor: '侧边栏图标颜色',
      sidebarActiveBg: '侧边栏激活背景'
    },
    // 语言
    language: {
      title: '语言',
      switchedToZh: '已切换为中文',
      switchedToEn: '已切换为英文'
    },
  },
  // 通知中心
  notification: {
    title: '通知中心',
    center: '通知中心',
    empty: '暂无通知',
    viewAll: '查看全部',
    notificationSettings: '通知设置',
    markAllRead: '全部已读',
    markAllConfirm: '确定要将所有通知标记为已读吗？',
    markAllSuccess: '已全部标记为已读',
    delete: '删除',
    deleteConfirm: '确定要删除这条通知吗？',
    deleteSuccess: '通知已删除',
    batchDelete: '批量删除',
    batchDeleteConfirm: '确定要删除选中的 {count} 条通知吗？',
    batchDeleteSuccess: '已删除选中的通知',
    type: '通知类型',
    content: '通知内容',
    read: '已读',
    unread: '未读',
    createdAt: '创建时间',
    // 归档
    unarchived: '未归档',
    archived: '已归档',
    archive: '归档',
    unarchive: '取消归档',
    batchArchive: '批量归档',
    batchUnarchive: '批量取消归档',
    // 筛选
    all: '全部',
    typeSystem: '系统',
    typePlc: 'PLC',
    typeUser: '用户',
    typeAudit: '审计',
    typeDevice: '设备',
    typeConnection: '连接',
    typeSecurity: '安全',
    priority: '优先级',
    priorityHigh: '高',
    priorityMedium: '中',
    priorityLow: '低',
    timeRange: '时间范围',
    today: '今天',
    thisWeek: '本周',
    thisMonth: '本月',
    custom: '自定义',
    to: '至',
    startDate: '开始日期',
    endDate: '结束日期',
    searchPlaceholder: '搜索通知...',
    reset: '重置',
    // 操作
    markRead: '标记已读',
    batchMarkRead: '批量标记已读',
    selectedCount: '已选择 {count} 项',
    clearSelection: '取消选择',
    // 时间
    justNow: '刚刚',
    minutesAgo: '分钟前',
    hoursAgo: '小时前',
    daysAgo: '天前',
    // 通知标题和内容（示例）
    userLoginTitle: '用户登录',
    userLoginContent: '用户 {username} 登录系统',
    // 踢下线通知
    kickOutTitle: '下线通知',
    kickOutContent: '您的账号已在其他设备登录',
    // 通知设置页面
    settings: {
      title: '通知设置',
      notificationTypes: '通知类型',
      typeEnabled: '启用',
      system: '系统通知',
      plc: 'PLC通知',
      user: '用户通知',
      audit: '审计通知',
      device: '设备通知',
      connection: '连接通知',
      doNotDisturb: '勿扰模式',
      doNotDisturbEnabled: '启用勿扰',
      reminderMethods: '提醒方式',
      reminderMethodsDesc: '选择接收通知的方式',
      soundEnabled: '声音提醒',
      popupEnabled: '弹窗提醒',
      save: '保存',
    }
  },
  // 心跳指示器
  heartbeat: {
    // 状态文本（导航栏显示）
    statusOnline: '在线',
    statusOffline: '离线',
    statusAuthenticating: '认证中...',
    statusDeviceDisconnected: '设备未连接',
    statusReconnecting: '重连中({count})',
    // 服务器状态
    serverConnected: '服务器: 已连接',
    serverDisconnected: '服务器: 未连接',
    serverAuthenticating: '服务器: 认证中',
    serverReconnecting: '服务器: 重连中(第{count}次)',
    // 设备状态
    deviceConnected: '设备: 已连接',
    deviceDisconnected: '设备: 未连接',
    // 详情弹窗
    detailTitle: '连接状态详情',
    detailServerConnected: '服务器状态: 已连接 ✓',
    detailServerDisconnected: '服务器状态: 未连接 ✗',
    detailServerAuthenticating: '服务器状态: 认证中...',
    detailServerReconnecting: '服务器状态: 重连中 (第 {count} 次)',
    detailDeviceConnected: '设备状态: 已连接 ✓',
    detailDeviceDisconnected: '设备状态: 未连接 ✗',
    detailLastHeartbeat: '最后心跳: {time}',
    detailHeartbeatInterval: '心跳间隔: {seconds}秒',
    confirm: '确定',
    // 相对时间
    timeNever: '从未',
    timeSecondsAgo: '{n}秒前',
    timeMinutesAgo: '{n}分钟前',
    timeHoursAgo: '{n}小时前'
  },

}