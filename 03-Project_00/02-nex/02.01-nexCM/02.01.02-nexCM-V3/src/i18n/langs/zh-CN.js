/**
 * ==========================================
 * 中文语言包
 * ==========================================
 * 按模块分组，新增文案在此添加
 * 结构与 en-US.js 保持一致
 */
export default {
  // 角色名称和描述（通过 role_code 映射，内置角色使用国际化，自定义角色使用数据库值）
  roles: {
    Super_Admin: {
      name: '超级管理员', // [未使用]
      desc: '拥有系统全部权限，用于系统的设置和修改参数', // [未使用]
    },
    Administrator: {
      name: '系统管理员', // [未使用]
      desc: '拥有使用系统的全部权限，用于使用维度的修改', // [未使用]
    },
    Engineer: {
      name: '工程师', // [未使用]
      desc: '设备工程师，可管理设备参数', // [未使用]
    },
    Operator: {
      name: '操作员', // [未使用]
      desc: '普通操作员，仅可查看和操作', // [未使用]
    },
  },
  // 数据字典（通过 dict_code + value 映射，内置字典使用国际化，自定义字典使用数据库值）
  dict: {
    types: {
      user_status: '用户状态', // [未使用]
      user_sex: '性别', // [未使用]
      user_role: '用户角色', // [未使用]
      audit_action: '审计操作类型', // [未使用]
      audit_result: '审计操作结果', // [未使用]
      notification_type: '通知类型', // [未使用]
      notification_priority: '通知优先级', // [未使用]
    },
    items: {
      environment: {
        nodeEnv: { label: '运行环境', description: 'Node.js运行环境，development为开发模式，production为生产模式' },
        appPort: { label: '服务端口', description: '后端服务监听的端口号' },
        appHost: { label: '服务主机', description: '后端服务绑定的主机地址，0.0.0.0表示监听所有网卡' },
        systemVersion: { label: '系统版本', description: '系统版本号，发布新版本时更新' },
        nodeVersion: { label: 'Node.js版本', description: '当前运行的Node.js版本，建议使用LTS版本' },
        platform: { label: '操作系统', description: '当前运行的操作系统平台，如 win32、linux、darwin 等' },
        arch: { label: '系统架构', description: '当前操作系统的 CPU 架构，如 x64、arm64 等' },
        hostname: { label: '主机名', description: '当前服务器的主机名，用于标识服务器身份' },
        localIp: { label: '本地IP地址', description: '当前服务器的本地 IP 地址，用于局域网内访问' },
        cwd: { label: '工作目录', description: '后端服务的当前工作目录，即启动服务时所在的目录' },
        projectRoot: { label: '项目根目录', description: '后端项目的根目录路径，所有相对路径都基于此目录' }
      },
      api: {
        apiPrefix: { label: 'API前缀', description: 'API接口统一前缀，前后端需保持一致' },
        corsEnabled: { label: '跨域开关', description: '是否开启CORS跨域支持，生产环境建议配置具体域名' },
        rateLimit: { label: '请求频率限制', description: '单IP每分钟最大请求数，防止恶意刷接口' },
        requestTimeout: { label: '接口超时时间', description: '前端请求超时时间，超时后自动取消请求' },
        maxBodySize: { label: '请求体大小限制', description: '后端接收的请求体最大大小，防止超大请求攻击' },
        maxFileSize: { label: '文件大小限制', description: '上传文件的最大大小限制' },
        corsOrigin: { label: '跨域来源', description: '允许跨域访问的来源地址，*表示允许所有来源，生产环境建议配置具体域名' },
        rateLimitWindow: { label: '限流时间窗口', description: '请求频率限制的时间窗口（秒），在该时间窗口内最多允许rateLimit次请求' }
      },
      storage: {
        upload: {
          dir: { label: '上传目录', description: '本地上传文件的存储目录' },
          maxSize: { label: '最大文件大小', description: '本地上传文件的最大大小' },
          allowedTypes: { label: '允许的文件类型', description: '允许上传的文件扩展名列表' },
          staticPrefix: { label: '静态资源前缀', description: '本地上传文件的静态访问URL前缀，用于通过HTTP访问上传的文件' }
        },
        github: {
          enabled: { label: 'GitHub图床开关', description: '是否启用GitHub图床存储图片' },
          owner: { label: '仓库所有者', description: 'GitHub仓库所有者用户名' },
          repo: { label: '仓库名', description: 'GitHub图床仓库名称' },
          branch: { label: '分支', description: 'GitHub仓库分支，一般为main' },
          pathPrefix: { label: '路径前缀', description: 'GitHub仓库中存储图片的路径前缀，如 images/' },
          maxSize: { label: '最大文件大小', description: 'GitHub图床上传文件的最大大小限制' }
        },
        backup: {
          dir: { label: '数据库备份目录', description: '数据库备份文件存储目录' }
        },
        logs: {
          dir: { label: '日志目录', description: '系统日志文件存储目录' }
        },
        license: {
          dir: { label: '授权文件目录', description: '授权文件和密钥存储目录' },
          licensePath: { label: '授权文件路径', description: '授权许可证文件的存储路径' },
          publicKeyPath: { label: '公钥文件路径', description: '用于验证授权签名的公钥文件路径' },
          timeGuardPath: { label: '时间保护文件路径', description: '时间保护文件的存储路径，用于记录最后验证时间，防止回拨系统时间' }
        }
      },
      security: {
        jwt: {
          expiresIn: { label: 'Token有效期', description: 'JWT Token的有效期，过期后需要重新登录' },
          algorithm: { label: '加密算法', description: 'JWT签名加密算法，一般使用HS256' }
        },
        session: {
          timeout: { label: '会话超时时间', description: '用户无操作多长时间后自动退出登录' }
        },
        login: {
          failedThreshold: { label: '登录失败阈值', description: '连续登录失败多少次后锁定账户' },
          lockDuration: { label: '账户锁定时长', description: '登录失败锁定账户的时长' }
        },
        password: {
          minLength: { label: '密码最小长度', description: '用户密码的最小长度要求' },
          requireUppercase: { label: '需要大写字母', description: '用户密码是否必须包含大写字母（A-Z）' },
          requireLowercase: { label: '需要小写字母', description: '用户密码是否必须包含小写字母（a-z）' },
          requireNumber: { label: '需要数字', description: '用户密码是否必须包含数字（0-9）' },
          requireSymbol: { label: '需要特殊符号', description: '用户密码是否必须包含特殊符号（如!@#$%^&*）' },
          bcryptSaltRounds: { label: '密码加密强度', description: 'bcrypt加密的盐轮数，数值越大越安全但越慢' }
        },
        watermark: {
          enabled: { label: '页面水印', description: '是否在页面显示水印，防止截图泄露' }
        }
      },
      database: {
        host: { label: '数据库主机', description: 'MySQL数据库服务器地址' },
        port: { label: '数据库端口', description: 'MySQL数据库端口，默认为3306' },
        user: { label: '数据库用户名', description: 'MySQL数据库登录用户名' },
        password: { label: '数据库密码', description: 'MySQL数据库登录密码（已隐藏）' },
        database: { label: '数据库名', description: '使用的MySQL数据库名称' },
        connectionLimit: { label: '连接池大小', description: '数据库连接池的最大连接数' },
        waitForConnections: { label: '等待连接', description: '连接池满时是否等待连接释放，true表示等待，false表示立即报错' },
        queueLimit: { label: '队列限制', description: '等待连接的最大请求数，0表示不限制' }
      },
      license: {
        projectId: { label: '项目ID', description: '授权系统的项目唯一标识' },
        strictMode: { label: '严格模式', description: '严格模式下授权验证失败会拒绝服务，非严格模式只警告' },
        licensePath: { label: '授权文件路径', description: '授权许可证文件的存储路径' },
        publicKeyPath: { label: '公钥文件路径', description: '用于验证授权签名的公钥文件路径' },
        licenseServerUrl: { label: '时间校准服务器', description: '用于时间校准的服务器地址，防止本地时间篡改' },
        timeGuardPath: { label: '时间保护文件路径', description: '时间保护文件的存储路径，用于记录最后验证时间，防止回拨系统时间' },
        maxFileSize: { label: '最大文件大小', description: '授权文件上传的最大大小限制' },
        allowedExtname: { label: '允许的扩展名', description: '允许上传的授权文件扩展名列表' }
      },
      email: {
        enabled: { label: '邮箱系统开关', description: '是否启用邮箱发送功能' },
        defaultProvider: { label: '默认服务商', description: '默认使用的邮件服务商配置，如smtp、qq、163等' },
        host: { label: 'SMTP主机', description: 'SMTP邮件服务器地址' },
        port: { label: 'SMTP端口', description: 'SMTP邮件服务器端口' },
        secure: { label: 'SSL加密', description: '是否使用SSL加密连接邮件服务器' },
        username: { label: '邮箱账号', description: '用于发送邮件的邮箱账号' },
        fromName: { label: '发件人名称', description: '邮件显示的发件人名称' },
        send: {
          maxRetries: { label: '发送最大重试次数', description: '邮件发送失败后的最大重试次数' },
          retryDelay: { label: '重试延迟', description: '邮件发送失败后重试的延迟时间（毫秒）' },
          timeout: { label: '发送超时时间', description: '邮件发送的超时时间' },
          logEnabled: { label: '发送日志', description: '是否记录邮件发送的详细日志' }
        },
        passwordReset: {
          tokenExpiresIn: { label: '重置Token有效期', description: '密码重置链接的有效期' },
          tokenLength: { label: '重置Token长度', description: '密码重置Token的字符长度' },
          maxActiveTokens: { label: '最大活跃Token数', description: '单个用户最多可同时存在的有效密码重置Token数量' }
        }
      },
      plc: {
        activeProtocol: { label: '通信协议', description: '当前使用的PLC通信协议' },
        supportedProtocols: { label: '支持的协议', description: '系统支持的PLC通信协议列表' },
        connection: {
          host: { label: 'PLC设备IP', description: 'PLC设备的IP地址' },
          port: { label: 'PLC端口', description: 'PLC设备的通信端口' },
          unitId: { label: '单元ID', description: 'Modbus协议的从站单元ID，一般为1' },
          rack: { label: '机架号', description: 'S7协议的机架号，一般为0' },
          slot: { label: '槽位号', description: 'S7协议的槽位号，一般为1或2' }
        },
        poll: {
          fastInterval: { label: '快速轮询间隔', description: '设备在线时的轮询间隔' },
          slowInterval: { label: '慢速轮询间隔', description: '设备离线时的轮询间隔' },
          reconnectDelay: { label: '重连延迟', description: '设备断开后重新连接的延迟时间（毫秒）' }
        },
        enablePoll: { label: '自动轮询', description: '是否启用PLC数据自动轮询' },
        enableWriteAudit: { label: '写入审计', description: '是否记录PLC写入操作的审计日志' },
        maxWriteRetry: { label: '最大写入重试', description: 'PLC写入操作失败后的最大重试次数' },
        timeouts: {
          connect: { label: '连接超时', description: 'PLC连接的超时时间（毫秒）' },
          read: { label: '读取超时', description: 'PLC单次读取的超时时间（毫秒）' },
          readBatch: { label: '批量读取超时', description: 'PLC批量读取的超时时间（毫秒）' },
          write: { label: '写入超时', description: 'PLC写入操作的超时时间（毫秒）' },
          general: { label: '通用超时', description: 'PLC其他操作的通用超时时间（毫秒）' }
        },
        multiDeviceEnabled: { label: '多设备模式', description: '是否启用多设备模式，支持同时连接多个PLC设备' }
      }
    },
  },
  common: {
    confirm: '确定',
    cancel: '取消',
    save: '保存', // [未使用]
    delete: '删除', // [未使用]
    edit: '编辑', // [未使用]
    add: '新增',
    search: '搜索', // [未使用]
    reset: '重置', // [未使用]
    export: '导出', // [未使用]
    exportExcel: '导出Excel',
    exportPdf: '导出PDF',
    selected: '已选中',
    import: '导入', // [未使用]
    refresh: '刷新', // [未使用]
    operation: '操作', // [未使用]
    status: '状态', // [未使用]
    index: '序号',
    sort: '排序', // [未使用]
    description: '描述',
    remark: '备注', // [未使用]
    newCode: '新物料编码', // [未使用]
    replaceReason: '更换原因', // [未使用]
    confirmReplace: '确认更换', // [未使用]
    replacePart: '更换部件', // [未使用]
    currentCode: '当前编码', // [未使用]
    enable: '启用',
    all: '全部', // [未使用]
    disable: '禁用',
    createTime: '创建时间', // [未使用]
    updateTime: '更新时间', // [未使用]
    loading: '加载中...', // [未使用]
    success: '操作成功', // [未使用]
    failed: '操作失败', // [未使用]
    tip: '提示',
    warning: '警告',
    error: '错误', // [未使用]
    untitled: '未命名', // [未使用]
    redirect: '重定向', // [未使用]
    systemName: 'nexCM 管理系统',
    systemDESC: '桌面式灌装加塞设备',
    featureComingSoon: '功能开发中', // [未使用]
    noDataToExport: '没有可导出的数据',
    operator: '操作人', // [未使用]
    reason: '操作原因', // [未使用]
    reasonPlaceholder: '请输入操作原因（GMP要求）', // [未使用]
    reasonRequired: '请填写操作原因', // [未使用]
    reasonMinLength: '操作原因至少2个字符', // [未使用]
    password: '密码', // [未使用]
    passwordRequired: '请输入密码', // [未使用]
    sessionTimeout: '会话超时，请重新登录', // [未使用]
    download: '下载', // [未使用]
    print: '打印', // [未使用]
    viewDetail: '查看详情', // [未使用]
    statusChange: '状态切换', // [未使用]
    refreshCache: '刷新缓存', // [未使用]
    detail: '详情', // [未使用]
    close: '关闭', // [未使用]
    exportLabels: {
      exporter: '导出人', // [未使用]
      time: '导出时间', // [未使用]
      countPrefix: '共', // [未使用]
      countSuffix: '条记录' // [未使用]
    },
    createSuccess: '创建成功',
    deleteSuccess: '删除成功', // [未使用]
    operationFailed: '操作失败',
    updateSuccess: '更新成功',
    refreshSuccess: '刷新成功',
    enabled: '已启用',
    disabled: '已禁用'
  },
  menu: {
    home: {
      default: '网站首页', // [未使用]
      overview: {
        default: '概况预览'
      },
      dashboard: {
        default: '数据看板' // [未使用]
      },
      dataview: {
        default: '数据管理', // [未使用]
        search: '搜索', // [未使用]
        reset: '重置', // [未使用]
        export: '导出', // [未使用]
        refresh: '刷新', // [未使用]
        detail: '详情', // [未使用]
        exportSingle: '单个导出', // [未使用]
        output: {
          title: '产能数据'
        },
        oee: {
          title: '稼动率数据'
        },
        production: {
          title: '生产数据'
        },
        alarm: {
          title: '报警数据'
        }
      }
    },
    device: {
      default: '设备管理', // [未使用]
      state: {
        default: '设备状态', // [未使用]
        control: '设备控制' // [未使用]
      },
      alarm: {
        default: '报警统计', // [未使用]
        dashboard: {
          title: '统计看板' // [未使用]
        },
        list: {
          title: '详细记录' // [未使用]
        },
        search: '搜索', // [未使用]
        reset: '重置', // [未使用]
        export: '导出', // [未使用]
        refresh: '刷新', // [未使用]
        detail: '详情', // [未使用]
        handle: '处理' // [未使用]
      },
      part: {
        default: '部件寿命', // [未使用]
        search: '搜索',
        add: '新增',
        refresh: '刷新', // [未使用]
        edit: '编辑',
        operate: '更换',
        delete: '删除', // [未使用]
        tab: {
          life: '寿命详情',
          template: '模板管理'
        },
        template: {
          add: '新增模板',
          edit: '编辑',
          delete: '删除',
          search: '搜索模板', // [未使用]
          refresh: '刷新',
          searchPlaceholder: '搜索模板名称/编码',
          fillNeedle: '灌装针组件', // [未使用]
          fillTube: '灌装管组件', // [未使用]
          stopper: '加塞杆部件', // [未使用]
          vacuum: '真空组件', // [未使用]
          column: {
            templateName: '模板名称',
            templateKey: '模板编码', // [未使用]
            codePrefix: '编码前缀', // [未使用]
            defaultSpec: '默认规格型号',
            defaultRatedLife: '默认额定寿命',
            statMethod: '统计方式', // [未使用]
            statTag: '统计标签', // [未使用]
            icon: '图标', // [未使用]
            status: '状态', // [未使用]
            sort: '排序', // [未使用]
            action: '操作'
          },
          form: {
            templateName: '模板名称',
            templateKey: '模板编码',
            codePrefix: '编码前缀',
            defaultSpec: '默认规格型号',
            defaultRatedLife: '默认额定寿命',
            statMethod: '统计方式',
            statTag: '统计标签',
            icon: '图标', // [未使用]
            enabled: '状态', // [未使用]
            sort: '排序'
          },
          statMethod: {
            successCount: '运行成功次数',
            rotationCount: '电机旋转圈数',
            manual: '手动统计'
          },
          status: {
            enabled: '启用',
            disabled: '禁用'
          },
          message: {
            addSuccess: '新增模板成功',
            editSuccess: '编辑模板成功',
            deleteSuccess: '删除模板成功',
            deleteConfirm: '确定要删除该模板吗？'
          }
        },
        page: {
          title: '部件寿命管理',
          addBtn: '添加部件',
          editBtn: '编辑',
          deleteBtn: '删除', // [未使用]
          replaceBtn: '更换录入', // [未使用]
          refreshBtn: '刷新', // [未使用]
          searchPlaceholder: '搜索部件名称/编码',
          form: {
            template: '部件模板',
            partName: '部件名称',
            partCode: '部件编码',
            specModel: '规格型号',
            ratedLife: '额定寿命',
            usedLife: '使用寿命',
            installDate: '安装日期',
            remark: '备注',
            newCode: '新物料编码',
            replaceReason: '更换原因',
            confirmReplace: '确认更换',
            replacePart: '更换部件',
            currentCode: '当前编码'
          },
          status: {
            normal: '正常',
            warning: '提醒',
            critical: '警告',
            expired: '已过期'
          },
          template: {
            fillNeedle: '灌装针组件', // [未使用]
            fillTube: '灌装管组件', // [未使用]
            stopperRod: '加塞杆部件', // [未使用]
            vacuumUnit: '真空组件' // [未使用]
          },
          unit: {
            times: '次'
          },
          message: {
            addSuccess: '部件添加成功',
            updateSuccess: '部件更新成功',
            deleteSuccess: '部件删除成功',
            replaceSuccess: '部件更换记录成功',
            deleteConfirm: '确定要删除该部件吗？删除后历史记录仍保留。',
            loadFailed: '加载部件列表失败',
            noData: '暂无部件数据',
            updateFailed: '部件更新失败',
            addFailed: '部件添加失败',
            saveFailed: '保存部件失败',
            deleteFailed: '部件删除失败',
            deleteFailedCatch: '删除部件失败',
            replaceFailed: '部件更换失败',
            deleteConfirmTitle: '删除确认',
            confirmBtn: '确定',
            cancelBtn: '取消',
            remaining: '剩余',
            recentReplaceRecords: '近期更换记录',
            statusSuccess: '成功', // [未使用]
            statusFailed: '失败', // [未使用]
            oldCode: '旧编码',
            newCode: '新编码',
            operator: '操作人',
            replaceDialogTitle: '部件更换录入'
          },
          placeholder: {
            selectTemplate: '请选择部件模板',
            partName: '请输入部件名称',
            partCode: '请输入部件编码（如 FILL-NEEDLE-001）',
            specModel: '请输入规格型号',
            installDate: '选择安装日期',
            remark: '请输入备注信息',
            newCode: '请输入新物料编码',
            replaceReason: '请选择更换原因',
            ratedLife: '请输入额定寿命'
          },
          replaceReason: {
            life: '达到使用寿命',
            damage: '损坏故障',
            maintenance: '定期维护',
            changeover: '产品换型',
            other: '其他'
          },
          table: {
            lifeProgress: '寿命进度',
            remainingLife: '剩余寿命',
            status: '状态',
            operation: '操作'
          }
        }
      }
    },
    production: {
      default: '生产管理', // [未使用]
      recipe: {
        default: '配方管理',
        download: '下载', // [未使用]
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
          downloadAll: '全部下载', // [未使用]
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
        default: '生产订单', // [未使用]
        completed: {
          title: '完成订单' // [未使用]
        },
        running: {
          title: '进行中订单' // [未使用]
        },
        planned: {
          title: '计划订单' // [未使用]
        },
        add: '新增',
        edit: '编辑',
        delete: '删除',
        download: '下载',
        export: '导出', // [未使用]
        print: '打印', // [未使用]
        page: {
          desc: '生产订单管理与报告导出', // [未使用]
          completed: '完成订单',
          running: '进行中订单',
          planned: '计划订单',
          orderNo: '订单编号',
          productName: '产品名称',
          recipeName: '配方',
          batchNo: '批次号',
          targetQty: '目标数量',
          completedQty: '完成数量',
          qualifiedQty: '合格数量', // [未使用]
          unqualifiedQty: '不合格数量', // [未使用]
          qualifiedRate: '合格率',
          operator: '操作人员',
          startTime: '开始时间',
          endTime: '结束时间',
          runtime: '运行时长',
          alarmCount: '报警次数',
          status: '状态',
          progress: '生产进度', // [未使用]
          estimatedEnd: '预计完成',
          priority: '优先级', // [未使用]
          queuePosition: '排队位置', // [未使用]
          downloadCount: '已下载次数', // [未使用]
          download: '下载报告', // [未使用]
          downloadSelected: '下载选中', // [未使用]
          downloadAll: '下载全部', // [未使用]
          exportPdf: '导出 PDF 报告', // [未使用]
          noOrderProduction: '无订单生产',
          orderReport: '订单生产报告', // [未使用]
          reportBasicInfo: '基本信息', // [未使用]
          reportProductionStats: '生产统计', // [未使用]
          reportQualityStats: '质量统计', // [未使用]
          reportAlarmDetail: '报警明细', // [未使用]
          reportOperatorDetail: '操作人员明细', // [未使用]
          reportGeneratedBy: '报告生成人', // [未使用]
          reportGeneratedAt: '报告生成时间', // [未使用]
          high: '高', // [未使用]
          normal: '普通', // [未使用]
          low: '低', // [未使用]
          statusCompleted: '已完成',
          statusRunning: '生产中',
          statusPlanned: '待生产',
          selectOrderTip: '请选择要下载的订单',
          plannedNoDownload: '计划订单不支持下载报告',
          runningNoDownload: '进行中订单暂不支持下载报告（可在系统设置中开启）',
          add: '新增订单', // [未使用]
          edit: '编辑订单', // [未使用]
          delete: '删除',
          orderNoPlaceholder: '请输入订单编号',
          productNamePlaceholder: '请输入产品名称',
          recipeNamePlaceholder: '请选择配方',
          batchNoPlaceholder: '请输入批次号',
          startTimePlaceholder: '请选择开始时间',
          estimatedEndPlaceholder: '请选择预计完成时间',
          addSuccess: '订单新增成功', // [未使用]
          editSuccess: '订单编辑成功', // [未使用]
          deleteSuccess: '订单删除成功', // [未使用]
          deleteConfirm: '确定要删除订单「{orderNo}」吗？此操作不可恢复。', // [未使用]
          formRequired: '请填写完整的订单信息' // [未使用]
        }
      }
    },
    system: {
      default: '系统设置', // [未使用]
      user: {
        default: '用户管理', // [未使用]
        page: {
          title: '用户管理',
          pageDesc: '管理系统用户账户，支持角色分配、状态管理和密码重置',
          username: '用户名',
          usernamePlaceholder: '请输入用户名', // [未使用]
          realName: '真实姓名', // [未使用]
          realNamePlaceholder: '请输入真实姓名', // [未使用]
          email: '邮箱',
          emailPlaceholder: '请输入邮箱', // [未使用]
          phone: '手机号', // [未使用]
          phonePlaceholder: '请输入手机号', // [未使用]
          role: '角色',
          rolePlaceholder: '请选择角色', // [未使用]
          dept: '部门',
          deptPlaceholder: '请选择部门', // [未使用]
          status: '状态',
          createTime: '创建时间',
          password: '密码', // [未使用]
          passwordPlaceholder: '请输入密码', // [未使用]
          confirmPassword: '确认密码', // [未使用]
          sex: '性别', // [未使用]
          remark: '备注',
          remarkPlaceholder: '请输入备注', // [未使用]
          add: '新增用户', // [未使用]
          edit: '编辑用户', // [未使用]
          resetPassword: '重置密码',
          unlock: '解锁',
          unlockConfirm: '确定要解锁该用户吗？',
          unlockSuccess: '用户解锁成功',
          import: '导入', // [未使用]
          export: '导出', // [未使用]
          passwordMismatch: '两次输入的密码不一致',
          resetPasswordSuccess: '密码重置成功'
        }
      },
      audit: {
        default: '审计日志', // [未使用]
        search: '搜索/重置/刷新', // [未使用]
        export: '导出', // [未使用]
        detail: '详情', // [未使用]
        page: {
          title: '审计日志',
          myTitle: '我的操作日志',
          pageDesc: '记录系统所有操作日志，支持按用户、操作类型、时间范围等条件筛选',
          userName: '用户名',
          action: '操作类型',
          target: '操作目标',
          timeRange: '时间范围',
          startTime: '开始时间',
          endTime: '结束时间',
          oldValue: '旧值',
          newValue: '新值',
          result: '操作结果',
          ip: 'IP地址', // [未使用]
          createdAt: '创建时间', // [未使用]
          detail: '详情',
          detailTitle: '审计日志详情',
          verify: '审核' // [未使用]
        }
      },
      config: {
        default: '参数配置', // [未使用]
        edit: '编辑',
        export: '导出',
        refresh: '刷新缓存', // [未使用]
        param: {
          sessionTimeout: {
            view: '会话超时-查看', // [未使用]
            edit: '会话超时-编辑' // [未使用]
          },
          defaultPageSize: {
            view: '默认分页大小-查看', // [未使用]
            edit: '默认分页大小-编辑' // [未使用]
          },
          defaultLanguage: {
            view: '默认语言-查看', // [未使用]
            edit: '默认语言-编辑' // [未使用]
          },
          watermarkEnabled: {
            view: '水印开关-查看', // [未使用]
            edit: '水印开关-编辑' // [未使用]
          },
          watermarkText: {
            view: '水印文字-查看', // [未使用]
            edit: '水印文字-编辑' // [未使用]
          },
          plcHost: {
            view: 'PLC主机-查看', // [未使用]
            edit: 'PLC主机-编辑' // [未使用]
          },
          plcPort: {
            view: 'PLC端口-查看', // [未使用]
            edit: 'PLC端口-编辑' // [未使用]
          }
        },
        childrenMenu: {
          title: '参数配置', // [未使用]
          desc: '系统参数配置管理',
          save: '保存', // [未使用]
          reset: '重置', // [未使用]
          loading: '配置加载中，请稍候...', // [未使用]
          loadError: '配置加载失败', // [未使用]
          loadErrorDesc: '请检查网络连接或联系管理员', // [未使用]
          reload: '重新加载', // [未使用]
          incomplete: '配置不完整', // [未使用]
          incompleteDesc: '检测到 {count} 个未初始化的配置项，当前页面禁止编辑和保存。', // [未使用]
          missingKeys: '缺失的配置项：', // [未使用]
          incompleteTip: '请联系管理员执行配置初始化 SQL，或点击下方按钮重新加载。', // [未使用]
          system: {
            title: '系统配置',
            sessionTimeout: '会话超时时间',
            minutes: '分钟',
            defaultPageSize: '默认分页大小',
            defaultLanguage: '默认语言',
            dateFormat: '日期格式',
            sessionTimeoutTip: '用户登录后，多长时间无操作会自动退出登录', // [未使用]
            defaultPageSizeTip: '列表页面默认每页显示多少条数据', // [未使用]
            defaultLanguageTip: '系统默认显示的语言（中文/英文）', // [未使用]
            dateFormatTip: '系统中日期的显示格式（如 YYYY-MM-DD）' // [未使用]
          },
          security: {
            title: '安全设置',
            watermarkEnabled: '启用水印',
            watermarkText: '水印文字',
            watermarkPlaceholder: '请输入水印文字',
            watermarkTextTip: '水印显示的文字（为空时使用当前用户名）',
            loginFailedThreshold: '登录失败次数阈值',
            loginFailedThresholdTip: '连续登录失败达到该次数时，触发通知和账户锁定',
            lockDurationMinutes: '账户锁定时长',
            lockDurationMinutesTip: '账户被锁定后，多长时间后自动解锁',
            watermarkEnabledTip: '是否在页面上显示水印（防止截图泄露）' // [未使用]
          },
          export: {
            title: '导出设置',
            format: '导出格式', // [未使用]
            filename: '文件名前缀', // [未使用]
            pdfWatermarkEnabled: 'PDF 启用水印',
            pdfWatermarkEnabledTip: '导出PDF时，是否在PDF中添加水印',
            pdfWatermarkText: 'PDF 水印文字',
            pdfWatermarkPlaceholder: '请输入 PDF 水印文字',
            pdfWatermarkTextTip: 'PDF中显示的水印文字（为空时使用当前用户名）'
          },
          device: {
            title: '设备设置',
            maxOnlineDevices: '最大在线设备数', // [未使用]
            deviceName: '设备名称', // [未使用]
            deviceNameTip: '设备的显示名称，用于页面展示和通知',
            deviceCode: '设备编码',
            deviceCodeTip: '设备的唯一编号，用于标识设备',
            deviceRegion: '设备区域',
            deviceRegionTip: '设备所在的国家/城市，用于时区和本地化',
            deviceInstallDate: '安装日期',
            deviceInstallDateTip: '设备的安装日期，用于计算设备使用年限',
            partLifeSettingsTitle: '部件寿命提醒设置',
            partLifeReminderEnabled: '启用部件寿命提醒',
            partLifeReminderEnabledTip: '是否启用部件寿命到期提醒',
            partLifeThreshold: '寿命提醒阈值',
            partLifeThresholdTip: '部件剩余寿命低于该百分比时，触发提醒',
            partLifeRemindInterval: '提醒间隔',
            intervalHour: '每小时',
            intervalShift: '每班次',
            intervalDay: '每天',
            partLifeRemindIntervalTip: '部件寿命提醒的重复频率（每小时/每班次/每天）',
            snoozeInterval: '稍后提醒间隔',
            snooze5min: '5分钟',
            snooze10min: '10分钟',
            snooze30min: '30分钟',
            snooze1hour: '1小时',
            snooze2hour: '2小时',
            snoozeIntervalTip: '设置"稍后提醒"功能的延迟时间',
            partLifeSnoozeIntervalTip: '用户点击"稍后提醒"后，多长时间后再次提醒' // [未使用]
          },
          order: {
            title: '订单设置',
            autoComplete: '自动完成', // [未使用]
            productionControl: '生产控制',
            allowNoOrderProduction: '允许无订单生产',
            allowNoOrderProductionTip: '是否允许在没有生产订单的情况下启动生产',
            noOrderProductionHighlight: '无订单生产高亮显示',
            noOrderProductionHighlightTip: '无订单生产时，是否在页面上高亮提示',
            orderSwitchConfirm: '订单切换确认',
            orderSwitchConfirmTip: '切换生产订单时，是否需要确认',
            autoArchiveCompleted: '自动归档已完成订单',
            autoArchiveCompletedTip: '订单完成后，是否自动归档',
            statDisplay: '统计展示',
            showOperatorName: '显示操作员姓名',
            showOperatorNameTip: '订单列表和详情中是否显示操作员姓名',
            showAlarmCount: '显示报警数量',
            showAlarmCountTip: '订单列表和详情中是否显示报警数量',
            showRuntime: '显示运行时长',
            showRuntimeTip: '订单列表和详情中是否显示运行时长',
            reportConfig: '报告配置',
            reportIncludeAlarmDetail: '报告包含报警详情',
            reportIncludeAlarmDetailTip: '导出订单报表时，是否包含报警详情',
            reportIncludeOperatorDetail: '报告包含操作员详情',
            reportIncludeOperatorDetailTip: '导出订单报表时，是否包含操作员详情',
            reportIncludeDownloadCount: '报告包含下载次数',
            reportIncludeDownloadCountTip: '导出订单报表时，是否包含下载次数',
            allowRunningOrderDownload: '允许运行中订单下载',
            allowRunningOrderDownloadTip: '是否允许下载正在运行中的订单报表'
          },
          emailLog: {
            title: '邮件日志', // [未使用]
            searchPlaceholder: '搜索收件人/主题/配置名', // [未使用]
            statusFilter: '状态筛选', // [未使用]
            statusSending: '发送中', // [未使用]
            statusSuccess: '成功',
            statusFailed: '失败',
            configFilter: '配置筛选', // [未使用]
            batchDelete: '批量删除', // [未使用]
            refreshBtn: '刷新', // [未使用]
            configName: '配置名称', // [未使用]
            recipient: '收件人', // [未使用]
            subject: '邮件主题', // [未使用]
            template: '使用模板', // [未使用]
            exportBtn: '导出', // [未使用]
            deleteBtn: '删除', // [未使用]
            status: '状态',
            retryCount: '重试次数', // [未使用]
            duration: '发送耗时', // [未使用]
            errorMsg: '错误信息', // [未使用]
            sendTime: '发送时间', // [未使用]
            operations: '操作', // [未使用]
            viewDetail: '详情', // [未使用]
            delete: '删除',
            detailTitle: '邮件日志详情', // [未使用]
            logId: '日志ID', // [未使用]
            cc: '抄送', // [未使用]
            ip: 'IP地址',
            emailContent: '邮件内容', // [未使用]
            close: '关闭',
            loadFailed: '加载邮件日志失败', // [未使用]
            detailFailed: '加载日志详情失败', // [未使用]
            deleteConfirm: '确定要删除这条日志吗？', // [未使用]
            deleteTitle: '删除确认', // [未使用]
            deleteSuccess: '删除成功',
            batchDeleteConfirm: '确定要删除选中的 {count} 条日志吗？', // [未使用]
            batchDeleteSuccess: '批量删除成功' // [未使用]
          },
          notification: {
            title: '通知设置',
            autoReadDays: '自动已读天数',
            autoReadDaysTip: '通知超过指定天数后自动标记为已读',
            soundEnabled: '声音提醒',
            soundEnabledTip: '收到新通知时是否播放声音提醒',
            unitDay: '天'
          },
          licenseSetting: {
            title: '授权设置',
            expiringDays: '到期提醒天数',
            expiringDaysTip: '授权到期前多少天开始发送提醒通知',
            gracePeriod: '宽限期',
            gracePeriodTip: '授权到期后允许继续使用的宽限天数',
            checkInterval: '检查间隔',
            checkIntervalTip: '定时检查授权状态的间隔时间',
            unitDay: '天',
            unitHour: '小时'
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
            licenseId: '授权ID', // [未使用]
            projectId: '项目ID',
            licenseKey: '授权码', // [未使用]
            licenseType: '授权类型', // [未使用]
            maxDevices: '最大设备数',
            maxUsers: '最大用户数', // [未使用]
            createdAt: '创建时间',
            activatedAt: '激活时间', // [未使用]
            issuedAt: '签发时间', // [未使用]
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
              brandTitle: '授权管理系统',
              brandDesc: '安全、稳定、可靠的软件授权解决方案',
              featureRsa: 'RSA 非对称加密',
              featureTimeGuard: '时间防回退保护',
              featureMachineBind: '机器码硬件绑定',
              importFormTitle: '授权文件导入',
              statusValid: '授权有效',
              statusInvalid: '授权无效',
              expireTime: '过期时间',
              permanentValid: '永久有效',
              currentMachineId: '当前机器码',
              copy: '复制',
              copySuccess: '复制成功',
              copyFailed: '复制失败',
              machineIdTip: '请将此机器码发送给供应商以生成授权文件',
              dragUploadTip: '将 .lic 授权文件拖到此处，或点击上传',
              fileSizeTip: '仅支持 .lic 格式的授权文件',
              remove: '移除',
              pleaseSelectFile: '请先选择授权文件',
              importSuccessTitle: '授权导入成功',
              importSuccess: '授权文件导入成功',
              licenseId: '授权ID',
              project: '项目名称', // [未使用]
              licenseType: '授权类型',
              issuedAt: '签发时间',
              maxUsers: '最大用户数',
              unlimited: '无限制',
              importLicense: '导入授权',
              enterSystem: '进入系统',
              refreshStatus: '刷新状态',
              cannotGetStatus: '无法获取授权状态',
              typeTrial: '试用版',
              typeStandard: '标准版',
              typeEnterprise: '企业版',
              typePerpetual: '永久版',
              reasonUnknown: '未知原因',
              reasonFileNotFound: '授权文件不存在或验证失败',
              reasonProjectMismatch: '项目不匹配',
              reasonMachineMismatch: '机器码不匹配（硬件绑定）',
              reasonExpired: '授权已过期',
              reasonMissingFeatures: '缺少功能授权',
              reasonTimeRollback: '检测到系统时间回退',
              reasonNetworkSyncFailed: '联网时间校准失败'
            }
          }
        }
      },
      permission: {
        default: '权限配置', // [未使用]
        save: '保存',
        reset: '重置',
        refresh: '刷新缓存', // [未使用]
        page: {
          title: '权限配置', // [未使用]
          desc: '角色权限配置管理', // [未使用]
          expandAll: '展开全部', // [未使用]
          collapseAll: '收起全部', // [未使用]
          roleList: '角色列表', // [未使用]
          current: '当前', // [未使用]
          noRole: '暂无角色', // [未使用]
          permissionTree: '权限树', // [未使用]
          all: '全部', // [未使用]
          menu: '菜单', // [未使用]
          button: '按钮', // [未使用]
          param: '参数', // [未使用]
          searchPlaceholder: '搜索权限...', // [未使用]
          selectRoleTip: '请选择左侧角色进行权限配置', // [未使用]
          save: '保存',
          reset: '重置',
          selected: '选中', // [未使用]
          saveSuccess: '权限保存成功', // [未使用]
          saveFailed: '权限保存失败', // [未使用]
          confirmReset: '确定要重置权限吗？', // [未使用]
          resetSuccess: '权限重置成功', // [未使用]
          selectedCount: '已选中 {count} 项', // [未使用]
          halfSelectedCount: '半选中 {count} 项', // [未使用]
          totalCount: '共 {count} 项' // [未使用]
        }
      },
      device: {
        default: '在线管理', // [未使用]
        kick: '踢掉设备',
        delete: '删除设备', // [未使用]
        page: {
          title: '在线管理',
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
          deviceNameTip: '设备显示名称', // [未使用]
          deviceInfo: '设备信息',
          user: '用户',
          ip: 'IP地址',
          loginTime: '登录时间',
          lastActive: '最后活跃时间',
          lastActiveTime: '最后活跃时间', // [未使用]
          status: '状态',
          operation: '操作',
          kick: '踢掉', // [未使用]
          kickConfirm: '确定要踢掉该设备吗？', // [未使用]
          kickConfirmTitle: '踢掉设备确认',
          kickWarningTitle: '踢掉设备警告',
          kickWarningDesc: '确定要踢掉设备 {deviceName} 吗？', // [未使用]
          kickSuccess: '设备已踢掉',
          kickFailed: '踢掉设备失败',
          delete: '删除',
          deleteConfirm: '确定要删除该离线设备吗？', // [未使用]
          deleteConfirmTitle: '删除设备确认',
          deleteWarningTitle: '删除设备警告',
          deleteWarningDesc: '确定要删除离线设备 {deviceName} 吗？', // [未使用]
          deleteSuccess: '设备已删除',
          deleteFailed: '删除设备失败',
          fetchFailed: '获取设备列表失败',
          unknownDevice: '未知设备',
          currentDevice: '当前设备',
          refresh: '刷新',
          refreshStatus: '刷新状态',
          refreshSuccess: '状态已刷新', // [未使用]
          refreshStatusSuccess: '状态刷新成功',
          refreshStatusFailed: '状态刷新失败',
          noData: '暂无数据', // [未使用]
          loading: '加载中...' // [未使用]
        }
      }
    },
    superPanel: {
      default: '超级面板', // [未使用]
      dict: {
        default: '字典管理', // [未使用]
        page: {
          title: '字典管理',
          pageDesc: '管理系统字典类型和字典项，支持多语言配置',
          typeList: '字典类型列表',
          typeName: '字典名称',
          typeCode: '字典编码',
          itemLabelRequired: '请输入字典项标签',
          itemValueRequired: '请输入字典项值',
          typeCodePlaceholder: '请输入字典编码',
          typeNamePlaceholder: '请输入字典名称',
          typeNameRequired: '请输入字典名称',
          typeCodeRequired: '请输入字典编码',
          itemList: '字典项列表',
          itemLabel: '字典标签',
          itemValue: '字典键值',
          itemValuePlaceholder: '请输入字典键值',
          itemLabelPlaceholder: '请输入字典标签',
          itemStatus: '状态',
          addItem: '新增字典项',
          addType: '新增字典类型',
          deleteItemConfirm: '确定要删除该字典项吗？',
          deleteTypeConfirm: '确定要删除该字典类型吗？',
          editItem: '编辑字典项',
          editType: '编辑字典类型'
        }
      },
      dept: {
        default: '部门管理', // [未使用]
        page: {
          title: '部门管理',
          pageDesc: '管理组织部门结构，支持树形层级管理',
          rootDept: '顶级部门',
          deptName: '部门名称',
          deptNamePlaceholder: '请输入部门名称',
          deptNameRequired: '请输入部门名称',
          orderNum: '显示排序',
          leader: '负责人',
          phone: '联系电话',
          email: '邮箱',
          addChild: '新增子部门',
          parentDept: '上级部门',
          parentDeptPlaceholder: '选择上级部门',
          addDept: '新增部门',
          deleteConfirm: '确定要删除该部门吗？',
          editDept: '编辑部门'
        }
      },
      role: {
        default: '角色管理', // [未使用]
        page: {
          title: '角色管理',
          pageDesc: '管理系统角色，支持角色的新增、编辑和删除',
          roleName: '角色名称',
          roleNameRequired: '请输入角色名称',
          roleCode: '角色编码',
          roleCodeRequired: '请输入角色编码',
          addRole: '新增角色',
          editRole: '编辑角色',
          deleteConfirm: '确定要删除该角色吗？',
          basicRoleCannotEdit: '系统内置角色不允许编辑',
          basicRoleCannotDelete: '系统内置角色不允许删除'
        }
      },
      config: {
        default: '参数配置',
        pageTitle: '参数配置',
        childrenMenu: {
          title: '参数配置',
          desc: '系统参数配置管理',
          save: '保存',
          reset: '重置',
          loading: '配置加载中，请稍候...', // [未使用]
          loadError: '配置加载失败', // [未使用]
          loadErrorDesc: '请检查网络连接或联系管理员', // [未使用]
          reload: '重新加载', // [未使用]
          incomplete: '配置不完整', // [未使用]
          incompleteDesc: '检测到 {count} 个未初始化的配置项，当前页面禁止编辑和保存。', // [未使用]
          missingKeys: '缺失的配置项：', // [未使用]
          incompleteTip: '请联系管理员执行配置初始化 SQL，或点击下方按钮重新加载。', // [未使用]
          plc: {
            title: 'PLC 通讯',
            protocol: '通讯协议',
            protocolTip: '与PLC通讯的协议类型',
            host: 'PLC 地址',
            hostTip: 'PLC设备的IP地址',
            port: '端口',
            portTip: 'PLC通讯端口，Modbus默认502', // [未使用]
            unitId: '单元 ID',
            unitIdTip: 'PLC站号/单元ID，通常为1',
            timeout: '超时时间', // [未使用]
            retryCount: '重试次数', // [未使用]
            pollSettings: '轮询设置',
            pollFast: '快速轮询间隔',
            pollFastTip: '高频数据采集间隔',
            pollSlow: '慢速轮询间隔',
            pollSlowTip: '低频数据采集间隔',
            plcProtocolTip: 'PLC通信使用的协议（如 ModbusTcp）', // [未使用]
            plcHostTip: 'PLC设备的IP地址', // [未使用]
            plcPortTip: 'PLC设备的端口号', // [未使用]
            plcUnitIdTip: 'Modbus通信的单元ID/从站地址', // [未使用]
            pollFastIntervalTip: '快速轮询模式下，读取PLC数据的间隔时间', // [未使用]
            pollSlowIntervalTip: '慢速轮询模式下，读取PLC数据的间隔时间', // [未使用]
            reconnectDelay: '重连延迟',
            reconnectDelayTip: 'PLC连接断开后，等待多长时间后尝试重新连接',
            enablePoll: '启用轮询',
            enablePollTip: '是否启用PLC数据轮询采集',
            enableWriteAudit: '启用写入审计',
            enableWriteAuditTip: '是否记录PLC写入操作的审计日志',
            maxWriteRetry: '写入最大重试',
            maxWriteRetryTip: 'PLC写入操作失败后的最大重试次数'
          },
          connection: {
            title: '连接设置',
            heartbeatInterval: '心跳间隔',
            heartbeatIntervalTip: 'WebSocket连接的心跳包发送间隔，用于保持连接',
            deviceStatusCheckInterval: '在线状态检查间隔',
            deviceStatusCheckIntervalTip: '定时检查设备在线/离线状态的间隔时间',
            deviceOfflineThreshold: '在线状态离线阈值',
            deviceOfflineThresholdTip: '设备多长时间无响应后，判定为离线',
            unitSecond: '秒',
            maintenanceCheckInterval: '维护检查间隔',
            maintenanceCheckIntervalTip: '定时检查设备维护状态、部件寿命、授权到期的间隔时间',
            unitHour: '小时',
            partLifeStatInterval: '部件寿命统计',
            partLifeStatIntervalTip: '定时从PLC读取计数器数据，更新部件使用寿命的间隔时间',
            unitMinute: '分钟'
          },
          email: {
            title: '邮箱配置',
            addBtn: '新增配置',
            refreshBtn: '刷新',
            configName: '配置名称',
            provider: '服务商',
            smtpHost: 'SMTP服务器',
            smtpPort: '端口',
            portTip: 'PLC通讯端口，Modbus默认502',
            emailAccount: '邮箱账号',
            senderName: '发件人名称',
            isDefault: '是否默认',
            default: '默认',
            status: '状态',
            operations: '操作',
            addTitle: '新增邮箱配置',
            editTitle: '编辑邮箱配置',
            editBtn: '编辑',
            deleteBtn: '删除',
            testBtn: '测试',
            setDefaultBtn: '设为默认',
            configNamePlaceholder: '请输入配置名称',
            searchPlaceholder: '搜索配置名称或邮箱账号',
            useSSL: '使用SSL',
            authCode: '授权码',
            authCodePlaceholder: '请输入邮箱授权码',
            authCodePlaceholderEdit: '留空表示不修改',
            authCodeTip: 'QQ邮箱需在设置中开启SMTP服务并获取授权码',
            senderNamePlaceholder: '请输入发件人名称',
            remark: '备注',
            cancelBtn: '取消',
            saveBtn: '保存',
            confirmBtn: '确定',
            testEmailTitle: '发送测试邮件',
            testConfigName: '配置名称',
            testReceiver: '收件人邮箱',
            sendTestBtn: '发送测试邮件',
            testReceiverRequired: '请输入测试收件人邮箱',
            configNameRequired: '请输入配置名称',
            providerRequired: '请选择服务商',
            smtpHostRequired: '请输入SMTP服务器地址',
            smtpPortRequired: '请输入SMTP端口',
            emailAccountRequired: '请输入邮箱账号',
            emailFormatError: '邮箱格式不正确',
            authCodeRequired: '请输入邮箱授权码',
            loadFailed: '加载邮箱配置列表失败',
            addSuccess: '新增成功',
            updateSuccess: '更新成功',
            deleteSuccess: '删除成功',
            setDefaultSuccess: '已设为默认配置',
            enableSuccess: '已启用',
            disableSuccess: '已禁用',
            testSendSuccess: '测试邮件发送成功，请查收',
            deleteTitle: '删除确认',
            deleteConfirm: '确定要删除该邮箱配置吗？',
            sendTimeout: '发送超时', // [未使用]
            sendTimeoutTip: '邮件发送的超时时间（毫秒）', // [未使用]
            maxRetries: '最大重试次数', // [未使用]
            maxRetriesTip: '邮件发送失败后的最大重试次数', // [未使用]
            retryDelay: '重试间隔', // [未使用]
            retryDelayTip: '邮件发送失败后，等待多长时间后重试（毫秒）' // [未使用]
          },
          upload: {
            title: '上传设置',
            maxFileSize: '最大文件大小',
            maxFileSizeTip: '允许上传的单个文件最大大小（MB）',
            allowedTypes: '允许文件类型',
            allowedTypesTip: '允许上传的文件类型，多个类型用逗号分隔（如：image,pdf,excel,word）',
            uploadPath: '存储路径',
            uploadPathTip: '上传文件在服务器上的存储路径',
            enableAudit: '启用上传审计',
            enableAuditTip: '是否记录文件上传操作的审计日志'
          },
          audit: {
            title: '审计配置',
            retentionDays: '保留天数',
            retentionDaysTip: '审计日志在数据库中保留的天数，超过后自动清理',
            autoArchive: '自动归档',
            autoArchiveTip: '是否自动归档超过保留期限的审计日志'
          },
        },
      },
      permission: {
        default: '权限配置', // [未使用]
        page: {
          title: '权限配置', // [未使用]
          desc: '超级管理员权限配置管理', // [未使用]
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
          selectRoleTip: '请选择左侧角色进行权限配置',
          selected: '选中',
          saveSuccess: '权限保存成功', // [未使用]
        },
      },
      feature: {
        default: '功能配置', // [未使用]
        page: {
          title: '功能配置',
          pageDesc: '管理系统各功能模块的开关配置，仅超级管理员可访问',
          categoryList: '功能分类', // [未使用]
          resetAll: '全部重置',
          resetCategory: '重置当前分类',
          reset: '重置',
          modified: '已修改',
          defaultValue: '默认值',
          noData: '暂无功能配置',
          items: '项',
          updateSuccess: '功能配置更新成功',
          resetSuccess: '已重置为默认值',
          resetConfirm: '确定要重置该功能配置为默认值吗？',
          resetCategoryConfirm: '确定要重置当前分类的所有功能配置为默认值吗？',
          resetAllConfirm: '确定要重置所有功能配置为默认值吗？此操作不可撤销！'
        },
        category: {
          notification: '通知中心', // [未使用]
          email: '邮箱系统', // [未使用]
          audit: '审计模块', // [未使用]
          auth: '认证功能', // [未使用]
          system: '系统功能' // [未使用]
        },
        notification: {
          system: {
            backupSuccess: '数据备份成功通知', // [未使用]
            backupSuccessDesc: '数据备份成功后发送通知', // [未使用]
            backupFailed: '数据备份失败通知', // [未使用]
            backupFailedDesc: '数据备份失败后发送通知', // [未使用]
            expiring: '授权即将到期通知', // [未使用]
            expiringDesc: '授权即将到期时发送提醒通知', // [未使用]
            expired: '授权已过期通知', // [未使用]
            expiredDesc: '授权过期后发送通知' // [未使用]
          },
          user: {
            register: '新用户注册通知', // [未使用]
            registerDesc: '新用户注册成功后通知管理员', // [未使用]
            create: '管理员创建用户通知', // [未使用]
            createDesc: '管理员创建用户后通知相关人员', // [未使用]
            update: '用户信息变更通知', // [未使用]
            updateDesc: '用户信息变更后通知管理员', // [未使用]
            statusChange: '用户状态变更通知', // [未使用]
            statusChangeDesc: '用户启用/禁用状态变更后通知', // [未使用]
            passwordReset: '用户密码重置通知', // [未使用]
            passwordResetDesc: '用户密码被重置后通知管理员', // [未使用]
            loginFailed: '用户登录失败通知', // [未使用]
            loginFailedDesc: '用户多次登录失败后通知管理员', // [未使用]
            roleChange: '用户角色/权限变更通知', // [未使用]
            roleChangeDesc: '用户角色或权限变更后通知' // [未使用]
          },
          device: {
            paramChange: '设备参数变更通知', // [未使用]
            paramChangeDesc: '设备参数变更后通知相关人员', // [未使用]
            maintenanceReminder: '设备维护提醒通知', // [未使用]
            maintenanceReminderDesc: '设备需要维护时发送提醒', // [未使用]
            partLifeWarning: '配件寿命预警通知', // [未使用]
            partLifeWarningDesc: '配件寿命达到阈值时发送预警' // [未使用]
          },
          production: {
            orderCreate: '生产订单创建通知', // [未使用]
            orderCreateDesc: '生产订单创建后通知相关人员', // [未使用]
            orderUpdate: '生产订单变更通知', // [未使用]
            orderUpdateDesc: '生产订单变更后通知相关人员', // [未使用]
            orderComplete: '生产订单完成通知', // [未使用]
            orderCompleteDesc: '生产订单完成后通知相关人员', // [未使用]
            batchComplete: '批次完成通知', // [未使用]
            batchCompleteDesc: '生产批次完成后通知相关人员' // [未使用]
          },
          config: {
            systemUpdate: '系统配置变更通知', // [未使用]
            systemUpdateDesc: '系统配置变更后通知管理员', // [未使用]
            plcConnectionUpdate: 'PLC连接配置变更通知', // [未使用]
            plcConnectionUpdateDesc: 'PLC连接配置变更后通知', // [未使用]
            connectionUpdate: '连接配置变更通知', // [未使用]
            connectionUpdateDesc: '连接配置变更后通知相关人员', // [未使用]
            deviceParamsUpdate: '设备参数配置变更通知', // [未使用]
            deviceParamsUpdateDesc: '设备参数配置变更后通知', // [未使用]
            exportUpdate: '导出配置变更通知', // [未使用]
            exportUpdateDesc: '导出配置变更后通知管理员', // [未使用]
            securityUpdate: '安全配置变更通知', // [未使用]
            securityUpdateDesc: '安全配置变更后通知管理员' // [未使用]
          },
          security: {
            logExport: '审计日志导出通知', // [未使用]
            logExportDesc: '审计日志被导出时通知管理员', // [未使用]
            logView: '审计日志查看通知', // [未使用]
            logViewDesc: '审计日志被查看时通知管理员', // [未使用]
            permissionChange: '权限配置变更通知', // [未使用]
            permissionChangeDesc: '权限配置变更后通知管理员', // [未使用]
            dataExport: '敏感数据导出通知', // [未使用]
            dataExportDesc: '敏感数据被导出时通知管理员', // [未使用]
            dataDelete: '数据删除操作通知', // [未使用]
            dataDeleteDesc: '数据被删除时通知管理员' // [未使用]
          }
        },
        email: {
          user: {
            passwordReset: '管理员重置密码邮件', // [未使用]
            passwordResetDesc: '管理员重置用户密码后发送新密码到用户邮箱', // [未使用]
            forgotPasswordCode: '忘记密码验证码邮件', // [未使用]
            forgotPasswordCodeDesc: '用户申请忘记密码时发送验证码到邮箱', // [未使用]
            resetSuccess: '密码重置成功通知邮件', // [未使用]
            resetSuccessDesc: '密码重置成功后发送通知邮件' // [未使用]
          },
          notification: {
            forward: '通知转发邮件', // [未使用]
            forwardDesc: '将系统通知转发到用户邮箱' // [未使用]
          },
          device: {
            alarm: '设备报警邮件', // [未使用]
            alarmDesc: '设备报警时发送邮件通知' // [未使用]
          }
        },
        audit: {
          user: '用户管理审计', // [未使用]
          userDesc: '记录用户登录、注册、增删改查、密码重置等操作', // [未使用]
          permission: '权限管理审计', // [未使用]
          permissionDesc: '记录角色增删改、权限配置变更等操作', // [未使用]
          config: '系统配置审计', // [未使用]
          configDesc: '记录系统、安全、PLC、导出、连接、设备、订单配置变更', // [未使用]
          device: '设备管理审计', // [未使用]
          deviceDesc: '记录设备状态、参数变更、部件寿命、报警处理等操作', // [未使用]
          production: '生产管理审计', // [未使用]
          productionDesc: '记录配方下载、订单增删改查、订单下载等操作', // [未使用]
          data: '数据管理审计', // [未使用]
          dataDesc: '记录数据导出、数据详情查看等操作', // [未使用]
          plc: 'PLC操作审计', // [未使用]
          plcDesc: '记录PLC读写、连接、断开、重连等操作', // [未使用]
          audit: '审计自身审计', // [未使用]
          auditDesc: '记录审计查看、审核、导出等操作', // [未使用]
          license: '授权管理审计', // [未使用]
          licenseDesc: '记录授权导入、授权过期等操作', // [未使用]
          email: '邮箱配置审计', // [未使用]
          emailDesc: '记录邮箱配置变更、邮箱日志删除等操作' // [未使用]
        },
        auth: {
          register: '注册功能', // [未使用]
          registerDesc: '是否允许用户自助注册账号', // [未使用]
          forgotPassword: '忘记密码功能', // [未使用]
          forgotPasswordDesc: '是否允许通过邮箱验证码重置密码', // [未使用]
          firstLoginChangePassword: '首次登录强制改密', // [未使用]
          firstLoginChangePasswordDesc: '首次登录是否必须修改密码', // [未使用]
          loginFailedLock: '登录失败锁定', // [未使用]
          loginFailedLockDesc: '连续登录失败是否锁定账号' // [未使用]
        },
        system: {
          notificationMaster: '通知中心总开关', // [未使用]
          notificationMasterDesc: '关闭后所有通知不发送', // [未使用]
          emailMaster: '邮箱系统总开关', // [未使用]
          emailMasterDesc: '关闭后所有邮件不发送', // [未使用]
          auditMaster: '审计模块总开关', // [未使用]
          auditMasterDesc: '关闭后所有审计不记录', // [未使用]
          maintenanceTaskMaster: '定时任务总开关', // [未使用]
          maintenanceTaskMasterDesc: '关闭后所有定时任务停止', // [未使用]
          dataExportMaster: '数据导出总开关', // [未使用]
          dataExportMasterDesc: '关闭后所有导出功能禁用', // [未使用]
          watermark: '页面水印', // [未使用]
          watermarkDesc: '是否显示页面水印', // [未使用]
          onlineDeviceLimit: '在线设备数限制', // [未使用]
          onlineDeviceLimitDesc: '是否限制单用户在线设备数', // [未使用]
          auditVerify: '审计审核功能', // [未使用]
          auditVerifyDesc: '是否需要审核审计日志' // [未使用]
        }
      },
      database: {
        default: '数据管理', // [未使用]
        title: '数据管理',
        desc: '数据库管理工具，支持数据查看、表编辑、备份和回滚，仅超级管理员可访问',
        tabs: {
          dataView: '数据查看',
          tableEdit: '配置表编辑',
          backup: '版本备份',
          restore: '回滚指南'
        },
        searchTable: '搜索表',
        noTable: '暂无数据表',
        selectTableTip: '请从左侧选择一个数据表',
        refresh: '刷新',
        searchData: '搜索数据',
        search: '搜索',
        selectConfigTable: '选择配置表',
        selectConfigTableTip: '请选择要编辑的配置表',
        addRecord: '新增记录',
        editRecord: '编辑记录',
        operation: '操作',
        edit: '编辑',
        delete: '删除',
        cancel: '取消',
        confirm: '确定',
        warning: '警告',
        addSuccess: '新增成功',
        addFailed: '新增失败',
        editSuccess: '编辑成功',
        editFailed: '编辑失败',
        saveFailed: '保存失败',
        deleteConfirm: '确定要删除这条记录吗？此操作不可撤销！',
        deleteSuccess: '删除成功',
        deleteFailed: '删除失败',
        createBackup: '创建备份',
        backupTip: '备份文件将保存在服务器 backups/database 目录下，编辑表数据前会自动备份当前表',
        backupName: '备份名称',
        backupType: '备份类型',
        fullBackup: '全量备份',
        tableBackup: '单表备份',
        tableName: '表名',
        selectTable: '选择表',
        backupSelectTableTip: '请选择要备份的表',
        fileSize: '文件大小',
        remark: '备注',
        backupRemarkPlaceholder: '请输入备份备注，便于后续识别',
        operator: '操作人',
        status: '状态',
        success: '成功',
        failed: '失败',
        createTime: '创建时间',
        restore: '回滚',
        backupSuccess: '备份创建成功',
        backupFailed: '备份创建失败',
        deleteBackupConfirm: '确定要删除备份「{name}」吗？此操作不可撤销！', // [未使用]
        restoreConfirm: '确定要回滚到备份「{name}」吗？回滚前会自动备份当前数据，此操作不可撤销！', // [未使用]
        restoreSuccess: '回滚成功',
        restoreFailed: '回滚失败',
        restoreGuideTitle: '数据库回滚操作指南',
        restoreStep1Title: '第一步：选择备份版本',
        restoreStep1Desc: '在「版本备份」标签页中，从备份列表中选择要回滚的目标版本。建议仔细查看备份时间、备注和文件大小，确认选择正确的版本。',
        restoreStep2Title: '第二步：确认回滚操作',
        restoreStep2Desc: '点击备份记录右侧的「回滚」按钮，系统会弹出确认对话框。请仔细阅读提示信息，回滚操作会覆盖当前数据库，且不可撤销。',
        restoreStep3Title: '第三步：自动备份当前数据',
        restoreStep3Desc: '确认回滚后，系统会自动先备份当前数据库数据（备份名称以 pre_restore_ 开头），确保回滚失败或需要恢复时可以回退到回滚前的状态。',
        restoreStep4Title: '第四步：执行回滚并验证',
        restoreStep4Desc: '自动备份完成后，系统会执行回滚操作。回滚完成后，建议刷新页面并检查关键数据，确认回滚结果符合预期。',
        restoreWarningTitle: '回滚注意事项',
        restoreWarning1: '回滚操作会覆盖当前数据库的所有数据，请确保已选择正确的备份版本。',
        restoreWarning2: '回滚前系统会自动备份当前数据，但仍建议重要操作前手动创建备份并填写备注。',
        restoreWarning3: '回滚过程中请勿关闭页面或重启服务，否则可能导致数据损坏。',
        goToBackup: '前往版本备份'
      },
      projectConfig: {
        default: '项目配置', // [未使用]
        title: '项目配置', // [未使用]
        desc: '查看和管理项目运行的所有配置信息，支持在线编辑配置文件，仅超级管理员可访问', // [未使用]
        page: {
          title: '项目配置管理',
          desc: '查看和管理项目运行的所有配置信息，支持在线编辑配置文件'
        },
        menu: {
          environment: '环境信息', // [未使用]
          api: '接口配置', // [未使用]
          storage: '存储配置', // [未使用]
          security: '安全配置', // [未使用]
          database: '数据配置', // [未使用]
          license: '授权配置', // [未使用]
          email: '邮箱配置', // [未使用]
          plc: 'PLC 配置' // [未使用]
        },
        editType: {
          database: '数据库配置', // [未使用]
          configFile: '配置文件', // [未使用]
          envFile: '环境变量', // [未使用]
          code: '代码常量', // [未使用]
          databaseTip: '存储在数据库中，可在系统设置/超级面板的参数配置页面直接修改，修改后立即生效', // [未使用]
          configFileTip: '存储在后端的配置文件中（如 src/config/*.js），需要在线编辑文件并重启后端服务后生效', // [未使用]
          envFileTip: '存储在环境变量文件中（如 .env），需要在线编辑文件并重启后端服务后生效', // [未使用]
          codeTip: '硬编码在代码中，需要手动修改源代码并重新构建后才能生效' // [未使用]
        },
        effectType: {
          immediate: '立即生效', // [未使用]
          restart: '需重启后端', // [未使用]
          rebuild: '需重新构建', // [未使用]
          immediateTip: '修改后立即生效，无需重启服务或重新构建', // [未使用]
          restartTip: '修改后需要重启后端服务才能生效', // [未使用]
          rebuildTip: '修改后需要重新构建前端项目才能生效' // [未使用]
        },
        ownerType: {
          frontend: '前端', // [未使用]
          backend: '后端', // [未使用]
          frontendTip: '该配置项属于前端项目，修改后需要重新构建前端', // [未使用]
          backendTip: '该配置项属于后端项目，修改后需要重启后端服务' // [未使用]
        },
        sourceType: {
          file: '配置文件', // [未使用]
          database: '数据库配置', // [未使用]
          runtime: '系统运行时信息（自动获取）',
          code: '代码常量（硬编码）'
        },
        actions: {
          goToConfig: '前往配置',
          editFile: '编辑文件'
        },
        tips: {
          codeConstant: '该配置项为代码常量，需要修改代码后重新构建',
          needCodeChange: '需修改代码',
          noFilePath: '该配置项没有关联的文件路径',
          notInWhitelist: '该文件不在建议编辑的白名单内，在线编辑可能导致系统不稳定，确定要继续编辑吗？',
          confirmFailed: '确认框调用失败，请查看控制台错误信息'
        },
        editor: {
          title: '在线编辑',
          unsaved: '未保存',
          saved: '已保存',
          syntaxCheck: '语法检查',
          versionHistory: '版本历史',
          save: '保存',
          syntaxValid: '语法检查通过',
          syntaxInvalid: '语法检查失败',
          readFailed: '读取文件失败',
          syntaxCheckFailed: '语法检查失败',
          saveSuccess: '保存成功',
          backupPath: '备份路径',
          backupPathLoading: '加载中...'
        },
        backup: {
          title: '版本历史',
          operator: '操作人',
          restore: '回滚',
          delete: '删除',
          empty: '暂无备份记录',
          loadFailed: '加载备份列表失败',
          viewTip: '点击回滚按钮可恢复到此版本', // [未使用]
          restoreConfirm: '确定要回滚到此版本吗？当前版本会自动备份。',
          restoreSuccess: '回滚成功',
          deleteConfirm: '确定要删除该备份吗？此操作不可撤销。',
          deleteSuccess: '备份删除成功'
        },
        saveDialog: {
          title: '保存文件',
          remark: '备注',
          remarkPlaceholder: '请输入本次修改的备注（可选）',
          warning: '保存后需要重启后端服务才能生效',
          confirm: '确认保存'
        },
        backupPathDialog: {
          title: '修改备份路径',
          currentPath: '当前路径',
          newPath: '新路径',
          newPathPlaceholder: '请输入新的备份路径（相对路径或绝对路径）',
          warning: '修改备份路径后，新的备份文件将保存到新路径，原有备份文件仍保留在原路径。',
          pathRequired: '备份路径不能为空',
          changeSuccess: '备份路径修改成功'
        },
        empty: {
          noConfig: '暂无配置项'
        },
        refresh: '刷新',
        loading: '加载中...',
        loadFailed: '加载项目配置失败',
        items: {
          environment: {
            nodeEnv: { label: '运行环境', description: 'Node.js运行环境，development为开发模式，production为生产模式' },
            appPort: { label: '服务端口', description: '后端服务监听的端口号' },
            appHost: { label: '服务主机', description: '后端服务绑定的主机地址，0.0.0.0表示监听所有网卡' },
            systemVersion: { label: '系统版本', description: '系统版本号，发布新版本时更新' },
            nodeVersion: { label: 'Node.js版本', description: '当前运行的Node.js版本，建议使用LTS版本' },
            platform: { label: '操作系统', description: '当前运行的操作系统平台，如 win32、linux、darwin 等' },
            arch: { label: '系统架构', description: '当前操作系统的 CPU 架构，如 x64、arm64 等' },
            hostname: { label: '主机名', description: '当前服务器的主机名，用于标识服务器身份' },
            localIp: { label: '本地IP地址', description: '当前服务器的本地 IP 地址，用于局域网内访问' },
            cwd: { label: '工作目录', description: '后端服务的当前工作目录，即启动服务时所在的目录' },
            projectRoot: { label: '项目根目录', description: '后端项目的根目录路径，所有相对路径都基于此目录' }
          },
          api: {
            apiPrefix: { label: 'API前缀', description: 'API接口统一前缀，前后端需保持一致' },
            corsEnabled: { label: '跨域开关', description: '是否开启CORS跨域支持，生产环境建议配置具体域名' },
            rateLimit: { label: '请求频率限制', description: '单IP每分钟最大请求数，防止恶意刷接口' },
            requestTimeout: { label: '接口超时时间', description: '前端请求超时时间，超时后自动取消请求' },
            maxBodySize: { label: '请求体大小限制', description: '后端接收的请求体最大大小，防止超大请求攻击' },
            maxFileSize: { label: '文件大小限制', description: '上传文件的最大大小限制' },
            corsOrigin: { label: '跨域来源', description: '允许跨域访问的来源地址，*表示允许所有来源，生产环境建议配置具体域名' },
            rateLimitWindow: { label: '限流时间窗口', description: '请求频率限制的时间窗口（秒），在该时间窗口内最多允许rateLimit次请求' }
          },
          storage: {
            upload: {
              dir: { label: '上传目录', description: '本地上传文件的存储目录' },
              maxSize: { label: '最大文件大小', description: '本地上传文件的最大大小' },
              allowedTypes: { label: '允许的文件类型', description: '允许上传的文件扩展名列表' },
              staticPrefix: { label: '静态资源前缀', description: '本地上传文件的静态访问URL前缀，用于通过HTTP访问上传的文件' }
            },
            github: {
              enabled: { label: 'GitHub图床开关', description: '是否启用GitHub图床存储图片' },
              owner: { label: '仓库所有者', description: 'GitHub仓库所有者用户名' },
              repo: { label: '仓库名', description: 'GitHub图床仓库名称' },
              branch: { label: '分支', description: 'GitHub仓库分支，一般为main' },
              pathPrefix: { label: '路径前缀', description: 'GitHub仓库中存储图片的路径前缀，如 images/' },
              maxSize: { label: '最大文件大小', description: 'GitHub图床上传文件的最大大小限制' }
            },
            backup: {
              dir: { label: '数据库备份目录', description: '数据库备份文件存储目录' }
            },
            logs: {
              dir: { label: '日志目录', description: '系统日志文件存储目录' }
            },
            license: {
              dir: { label: '授权文件目录', description: '授权文件和密钥存储目录' },
              licensePath: { label: '授权文件路径', description: '授权许可证文件的存储路径' },
              publicKeyPath: { label: '公钥文件路径', description: '用于验证授权签名的公钥文件路径' },
              timeGuardPath: { label: '时间保护文件路径', description: '时间保护文件的存储路径，用于记录最后验证时间，防止回拨系统时间' }
            }
          },
          security: {
            jwt: {
              expiresIn: { label: 'Token有效期', description: 'JWT Token的有效期，过期后需要重新登录' },
              algorithm: { label: '加密算法', description: 'JWT签名加密算法，一般使用HS256' }
            },
            session: {
              timeout: { label: '会话超时时间', description: '用户无操作多长时间后自动退出登录' }
            },
            login: {
              failedThreshold: { label: '登录失败阈值', description: '连续登录失败多少次后锁定账户' },
              lockDuration: { label: '账户锁定时长', description: '登录失败锁定账户的时长' }
            },
            password: {
              minLength: { label: '密码最小长度', description: '用户密码的最小长度要求' },
              requireUppercase: { label: '需要大写字母', description: '用户密码是否必须包含大写字母（A-Z）' },
              requireLowercase: { label: '需要小写字母', description: '用户密码是否必须包含小写字母（a-z）' },
              requireNumber: { label: '需要数字', description: '用户密码是否必须包含数字（0-9）' },
              requireSymbol: { label: '需要特殊符号', description: '用户密码是否必须包含特殊符号（如!@#$%^&*）' },
              bcryptSaltRounds: { label: '密码加密强度', description: 'bcrypt加密的盐轮数，数值越大越安全但越慢' }
            },
            watermark: {
              enabled: { label: '页面水印', description: '是否在页面显示水印，防止截图泄露' }
            }
          },
          database: {
            host: { label: '数据库主机', description: 'MySQL数据库服务器地址' },
            port: { label: '数据库端口', description: 'MySQL数据库端口，默认为3306' },
            user: { label: '数据库用户名', description: 'MySQL数据库登录用户名' },
            password: { label: '数据库密码', description: 'MySQL数据库登录密码（已隐藏）' },
            database: { label: '数据库名', description: '使用的MySQL数据库名称' },
            connectionLimit: { label: '连接池大小', description: '数据库连接池的最大连接数' },
            waitForConnections: { label: '等待连接', description: '连接池满时是否等待连接释放，true表示等待，false表示立即报错' },
            queueLimit: { label: '队列限制', description: '等待连接的最大请求数，0表示不限制' }
          },
          license: {
            projectId: { label: '项目ID', description: '授权系统的项目唯一标识' },
            strictMode: { label: '严格模式', description: '严格模式下授权验证失败会拒绝服务，非严格模式只警告' },
            licensePath: { label: '授权文件路径', description: '授权许可证文件的存储路径' },
            publicKeyPath: { label: '公钥文件路径', description: '用于验证授权签名的公钥文件路径' },
            licenseServerUrl: { label: '时间校准服务器', description: '用于时间校准的服务器地址，防止本地时间篡改' },
            timeGuardPath: { label: '时间保护文件路径', description: '时间保护文件的存储路径，用于记录最后验证时间，防止回拨系统时间' },
            maxFileSize: { label: '最大文件大小', description: '授权文件上传的最大大小限制' },
            allowedExtname: { label: '允许的扩展名', description: '允许上传的授权文件扩展名列表' }
          },
          email: {
            enabled: { label: '邮箱系统开关', description: '是否启用邮箱发送功能' },
            defaultProvider: { label: '默认服务商', description: '默认使用的邮件服务商配置，如smtp、qq、163等' },
            host: { label: 'SMTP主机', description: 'SMTP邮件服务器地址' },
            port: { label: 'SMTP端口', description: 'SMTP邮件服务器端口' },
            secure: { label: 'SSL加密', description: '是否使用SSL加密连接邮件服务器' },
            username: { label: '邮箱账号', description: '用于发送邮件的邮箱账号' },
            fromName: { label: '发件人名称', description: '邮件显示的发件人名称' },
            send: {
              maxRetries: { label: '发送最大重试次数', description: '邮件发送失败后的最大重试次数' },
              retryDelay: { label: '重试延迟', description: '邮件发送失败后重试的延迟时间（毫秒）' },
              timeout: { label: '发送超时时间', description: '邮件发送的超时时间' },
              logEnabled: { label: '发送日志', description: '是否记录邮件发送的详细日志' }
            },
            passwordReset: {
              tokenExpiresIn: { label: '重置Token有效期', description: '密码重置链接的有效期' },
              tokenLength: { label: '重置Token长度', description: '密码重置Token的字符长度' },
              maxActiveTokens: { label: '最大活跃Token数', description: '单个用户最多可同时存在的有效密码重置Token数量' }
            }
          },
          plc: {
            activeProtocol: { label: '通信协议', description: '当前使用的PLC通信协议' },
            supportedProtocols: { label: '支持的协议', description: '系统支持的PLC通信协议列表' },
            connection: {
              host: { label: 'PLC设备IP', description: 'PLC设备的IP地址' },
              port: { label: 'PLC端口', description: 'PLC设备的通信端口' },
              unitId: { label: '单元ID', description: 'Modbus协议的从站单元ID，一般为1' },
              rack: { label: '机架号', description: 'S7协议的机架号，一般为0' },
              slot: { label: '槽位号', description: 'S7协议的槽位号，一般为1或2' }
            },
            poll: {
              fastInterval: { label: '快速轮询间隔', description: '设备在线时的轮询间隔' },
              slowInterval: { label: '慢速轮询间隔', description: '设备离线时的轮询间隔' },
              reconnectDelay: { label: '重连延迟', description: '设备断开后重新连接的延迟时间（毫秒）' }
            },
            enablePoll: { label: '自动轮询', description: '是否启用PLC数据自动轮询' },
            enableWriteAudit: { label: '写入审计', description: '是否记录PLC写入操作的审计日志' },
            maxWriteRetry: { label: '最大写入重试', description: 'PLC写入操作失败后的最大重试次数' },
            timeouts: {
              connect: { label: '连接超时', description: 'PLC连接的超时时间（毫秒）' },
              read: { label: '读取超时', description: 'PLC单次读取的超时时间（毫秒）' },
              readBatch: { label: '批量读取超时', description: 'PLC批量读取的超时时间（毫秒）' },
              write: { label: '写入超时', description: 'PLC写入操作的超时时间（毫秒）' },
              general: { label: '通用超时', description: 'PLC其他操作的通用超时时间（毫秒）' }
            },
            multiDeviceEnabled: { label: '多设备模式', description: '是否启用多设备模式，支持同时连接多个PLC设备' }
          }
        }
      }
    },
  },
  tagsview: {
    refresh: '刷新页面',
    close: '关闭页面',
    closeOthers: '关闭其他',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '关闭全部'
  },
  login: {
    title: '系统登录',
    username: '用户名',
    password: '密码',
    captcha: '验证码',
    loginBtn: '登 录',
    registerBtn: '注 册',
    rememberMe: '记住我', // [未使用]
    forgotPassword: '忘记密码？',
    noAccount: '还没有账号？',
    hasAccount: '已有账号？',
    goLogin: '去登录', // [未使用]
    goRegister: '去注册', // [未使用]
    loginNow: '立即登录',
    registerNow: '立即注册',
    usernameRequired: '请输入用户名',
    passwordRequired: '请输入密码',
    captchaRequired: '请输入验证码',
    emailRequired: '请输入邮箱',
    usernamePlaceholder: '请输入用户名', // [未使用]
    passwordPlaceholder: '请输入密码', // [未使用]
    captchaPlaceholder: '请输入验证码', // [未使用]
    loginSuccess: '登录成功', // [未使用]
    loginFailed: '登录失败', // [未使用]
    logoutSuccess: '退出成功', // [未使用]
    logoutConfirm: '确定要退出登录吗？', // [未使用]
    registerTitle: '用户注册',
    realName: '真实姓名',
    email: '邮箱',
    phone: '手机号',
    confirmPassword: '确认密码',
    confirmPasswordRequired: '请输入确认密码',
    registerSuccess: '注册成功，请登录',
    deviceLimitExceeded: '在线设备数已达上限（最多 {maxDevices} 台），请联系管理员踢掉其他设备', // [未使用]
    kickedOffline: '您的账号已在其他设备登录，您已被踢下线', // [未使用]
    kickNotice: '下线通知', // [未使用]
    kickReason: '您的账号已在其他设备登录', // [未使用]
    firstLoginTitle: '首次登录', // [未使用]
    firstLoginDesc: '检测到您是首次登录，请修改初始密码', // [未使用]
    oldPassword: '原密码', // [未使用]
    newPassword: '新密码', // [未使用]
    modifyPassword: '修改密码', // [未使用]
    passwordStrength: '密码强度', // [未使用]
    passwordWeak: '弱', // [未使用]
    passwordMedium: '中', // [未使用]
    passwordStrong: '强', // [未使用]
    passwordTips: '密码长度8-20位，包含大小写字母、数字和特殊字符' // [未使用]
  },
  layout: {
    user: '用户',
    fullscreen: '全屏', // [未使用]
    exitFullscreen: '退出全屏', // [未使用]
    searchMenu: '搜索菜单',
    profile: '个人中心',
    settings: '系统设置', // [未使用]
    logout: '退出登录',
    notificationCenter: '通知中心', // [未使用]
    collapse: '收起', // [未使用]
    expand: '展开' // [未使用]
  },
  profile: {
    title: '个人中心', // [未使用]
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
  quickMenu: {
    title: '快捷菜单',
    theme: {
      palette: '主题调色',
      resetAll: '重置全部',
      reset: '重置',
      custom: '自定义',
      sidebarBg: '侧边栏背景', // [未使用]
      sidebarHoverText: '侧边栏悬停文字', // [未使用]
      sidebarHoverBg: '侧边栏悬停背景', // [未使用]
      sidebarIconColor: '图标颜色', // [未使用]
      sidebarActiveBg: '侧边栏激活背景' // [未使用]
    },
    language: {
      title: '语言',
      switchedToZh: '已切换为中文',
      switchedToEn: '已切换为英文'
    }
  },
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
    batchDeleteConfirm: '确定要删除选中的 {count} 条通知吗？', // [未使用]
    batchDeleteSuccess: '已删除选中的通知',
    type: '通知类型',
    content: '通知内容',
    read: '已读',
    unread: '未读',
    createdAt: '创建时间',
    unarchived: '未归档',
    archived: '已归档',
    archive: '归档',
    unarchive: '取消归档',
    batchArchive: '批量归档',
    batchUnarchive: '批量取消归档',
    all: '全部',
    typeSystem: '系统通知', // [未使用]
    typePlc: 'PLC通知', // [未使用]
    typeUser: '用户通知', // [未使用]
    typeAudit: '审计通知', // [未使用]
    typeDevice: '设备通知', // [未使用]
    typeConnection: '连接通知', // [未使用]
    typeSecurity: '安全通知', // [未使用]
    typeProduction: '生产通知', // [未使用]
    typeConfig: '配置通知', // [未使用]
    typeLicense: '授权通知', // [未使用]
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
    markRead: '标记已读',
    batchMarkRead: '批量标记已读',
    selectedCount: '已选择 {count} 项', // [未使用]
    clearSelection: '取消选择',
    justNow: '刚刚',
    minutesAgo: '分钟前',
    hoursAgo: '小时前',
    daysAgo: '天前',
    userLoginTitle: '用户登录', // [未使用]
    userLoginContent: '用户 {username} 登录系统', // [未使用]
    kickOutTitle: '下线通知', // [未使用]
    kickOutContent: '您的账号已在其他设备登录', // [未使用]
    kickedOutTitle: '账号被踢下线', // [未使用]
    kickedOutContent: '您的账号已于 {time} 在IP {ip} 的设备上登录，当前设备已下线', // [未使用]
    deviceKickedTitle: '设备被踢下线', // [未使用]
    deviceKickedContent: '您的设备 {deviceName} 已于 {time} 被管理员 {operator} 踢下线', // [未使用]
    deviceKickedAdminTitle: '设备被踢下线（管理员通知）', // [未使用]
    deviceKickedAdminContent: '管理员 {operator} 已于 {time} 将用户 {userId} 的设备 {deviceName} 踢下线', // [未使用]
    system: {
      backupSuccess: {
        title: '数据备份成功', // [未使用]
        content: '系统数据备份已成功完成' // [未使用]
      },
      backupFailed: {
        title: '数据备份失败', // [未使用]
        content: '系统数据备份失败，请检查备份配置' // [未使用]
      }
    },
    license: {
      expiring: {
        title: '授权即将到期', // [未使用]
        content: '系统授权将在30天内到期，请及时续费' // [未使用]
      },
      expired: {
        title: '授权已过期', // [未使用]
        content: '系统授权已过期，部分功能已受限' // [未使用]
      }
    },
    user: {
      register: {
        title: '新用户注册', // [未使用]
        content: '用户 {username} 已注册成功' // [未使用]
      },
      create: {
        title: '用户创建', // [未使用]
        content: '管理员创建了用户 {username}' // [未使用]
      },
      update: {
        title: '用户信息变更', // [未使用]
        content: '用户 {username} 的信息已更新' // [未使用]
      },
      statusChange: {
        title: '用户状态变更', // [未使用]
        content: '用户 {username} 的状态已变更为 {status}' // [未使用]
      },
      passwordReset: {
        title: '密码重置', // [未使用]
        content: '用户 {username} 的密码已被重置' // [未使用]
      },
      loginFailed: {
        title: '用户登录失败', // [未使用]
        content: '用户 {username} 连续登录失败 {count} 次，请关注' // [未使用]
      },
      roleChange: {
        title: '用户角色变更', // [未使用]
        content: '用户 {username} 的角色已变更为 {role}' // [未使用]
      }
    },
    device: {
      paramChange: {
        title: '设备参数变更', // [未使用]
        content: '设备参数 {tag} 已由 {operator} 修改' // [未使用]
      },
      maintenanceReminder: {
        title: '设备维护提醒', // [未使用]
        content: '设备 {deviceName} 即将到达维护时间，请及时安排维护' // [未使用]
      },
      partLifeWarning: {
        title: '配件寿命预警', // [未使用]
        content: '配件 {partName} 使用寿命即将到期，请及时更换' // [未使用]
      }
    },
    production: {
      orderCreate: {
        title: '生产订单创建', // [未使用]
        content: '生产订单 {orderNo} 已创建' // [未使用]
      },
      orderUpdate: {
        title: '生产订单变更', // [未使用]
        content: '生产订单 {orderNo} 已更新' // [未使用]
      },
      orderComplete: {
        title: '生产订单完成', // [未使用]
        content: '生产订单 {orderNo} 已完成' // [未使用]
      },
      batchComplete: {
        title: '批次完成', // [未使用]
        content: '批次 {batchNo} 已完成生产' // [未使用]
      }
    },
    config: {
      systemUpdate: {
        title: '系统配置变更', // [未使用]
        content: '系统配置已由 {username} 修改' // [未使用]
      },
      plcConnectionUpdate: {
        title: 'PLC连接配置变更', // [未使用]
        content: 'PLC连接配置已由 {username} 修改' // [未使用]
      },
      connectionUpdate: {
        title: '连接配置变更', // [未使用]
        content: '连接配置已由 {username} 修改' // [未使用]
      },
      deviceParamsUpdate: {
        title: '设备参数配置变更', // [未使用]
        content: '设备参数配置已由 {username} 修改' // [未使用]
      },
      exportUpdate: {
        title: '导出配置变更', // [未使用]
        content: '导出配置已由 {username} 修改' // [未使用]
      },
      securityUpdate: {
        title: '安全配置变更', // [未使用]
        content: '安全配置已由 {username} 修改' // [未使用]
      }
    },
    audit: {
      logExport: {
        title: '审计日志导出', // [未使用]
        content: '用户 {username} 导出了审计日志' // [未使用]
      },
      logView: {
        title: '审计日志查看', // [未使用]
        content: '用户 {username} 查看了审计日志' // [未使用]
      }
    },
    permission: {
      change: {
        title: '权限配置变更', // [未使用]
        content: '角色 {roleName} 的权限配置已由 {operator} 修改' // [未使用]
      }
    },
    data: {
      export: {
        title: '敏感数据导出', // [未使用]
        content: '用户 {username} 导出了敏感数据' // [未使用]
      },
      delete: {
        title: '数据删除操作', // [未使用]
        content: '用户 {username} 删除了数据' // [未使用]
      }
    },
    settings: {
      title: '通知设置',
      notificationTypes: '通知类型',
      typeEnabled: '启用',
      system: '系统通知', // [未使用]
      plc: 'PLC通知', // [未使用]
      user: '用户通知', // [未使用]
      audit: '审计通知', // [未使用]
      device: '设备通知', // [未使用]
      connection: '连接通知', // [未使用]
      doNotDisturb: '勿扰模式',
      doNotDisturbEnabled: '启用勿扰',
      reminderMethods: '提醒方式',
      reminderMethodsDesc: '选择接收通知的方式',
      soundEnabled: '声音提醒',
      popupEnabled: '弹窗提醒',
      save: '保存',
      endTime: '结束时间',
      saveSuccess: '保存成功',
      startTime: '开始时间'
    },
    operationFailed: '操作失败'
  },
  audit: {
    // 模块名称
    module: {
      user: '用户管理', // [未使用]
      permission: '权限管理', // [未使用]
      config: '系统配置', // [未使用]
      device: '设备管理', // [未使用]
      production: '生产管理', // [未使用]
      data: '数据管理', // [未使用]
      plc: 'PLC操作', // [未使用]
      audit: '审计自身', // [未使用]
      license: '授权管理', // [未使用]
      email: '邮箱配置' // [未使用]
    },
    // 用户管理操作
    user: {
      register: { title: '用户注册' },
      login: { title: '用户登录' },
      loginFailed: { title: '用户登录失败' },
      logout: { title: '用户登出' },
      create: { title: '创建用户' },
      update: { title: '修改用户' },
      delete: { title: '删除用户' },
      batchDelete: { title: '批量删除用户' },
      statusChange: { title: '修改用户状态' },
      resetPassword: { title: '重置密码' },
      changePassword: { title: '修改密码' },
      roleChange: { title: '用户角色变更' }
    },
    // 权限管理操作
    role: {
      create: { title: '创建角色' },
      update: { title: '修改角色' },
      delete: { title: '删除角色' }
    },
    permission: {
      change: { title: '权限配置变更' },
      cacheClear: { title: '权限缓存清除' }
    },
    // 系统配置操作
    config: {
      system: { change: { title: '系统参数修改' } },
      security: { change: { title: '安全配置修改' } },
      plc: { change: { title: 'PLC连接配置修改' } },
      export: { change: { title: '导出配置修改' } },
      connection: { change: { title: '连接配置修改' } },
      device: { change: { title: '设备配置修改' } },
      order: { change: { title: '订单配置修改' } }
    },
    // 设备管理操作
    device: {
      statusChange: { title: '设备状态变更' },
      paramChange: { title: '设备参数修改' },
      part: {
        create: { title: '新增部件' },
        update: { title: '编辑部件' },
        replace: { title: '更换部件' },
        delete: { title: '删除部件' }
      },
      alarm: {
        handle: { title: '报警处理' }
      }
    },
    // 生产管理操作
    production: {
      recipe: {
        download: { title: '配方下载' }
      },
      order: {
        create: { title: '新增生产订单' },
        update: { title: '编辑生产订单' },
        delete: { title: '删除生产订单' },
        download: { title: '下载生产订单' }
      }
    },
    // 数据管理操作
    data: {
      export: { title: '数据导出' },
      viewDetail: { title: '数据查看详情' }
    },
    // PLC操作
    plc: {
      write: { title: 'PLC参数写入' },
      read: { title: 'PLC参数读取' },
      connect: { title: 'PLC连接' },
      disconnect: { title: 'PLC断开' },
      reconnect: { title: 'PLC重连' }
    },
    // 审计自身操作
    audit: {
      view: { title: '审计日志查看' },
      verify: { title: '审计哈希链校验' },
      export: { title: '审计日志导出' }
    },
    // 授权管理操作
    license: {
      import: { title: '授权导入' },
      expire: { title: '授权到期' }
    },
    // 邮箱配置操作
    email: {
      configChange: { title: '邮箱配置修改' },
      logDelete: { title: '邮箱日志删除' }
    }
  },
  heartbeat: {
    statusOnline: '在线',
    statusOffline: '离线',
    statusAuthenticating: '认证中...',
    statusDeviceDisconnected: '设备未连接',
    statusReconnecting: '重连中({count})', // [未使用]
    statusManualReconnecting: '重连中...',
    serverConnected: '服务器: 已连接',
    serverDisconnected: '服务器: 未连接',
    serverAuthenticating: '服务器: 认证中',
    serverReconnecting: '服务器: 重连中(第{count}次)', // [未使用]
    deviceConnected: '设备: 已连接',
    deviceDisconnected: '设备: 未连接',
    tooltipManualReconnecting: '正在手动重连...',
    detailTitle: '连接状态详情',
    detailServerLabel: '服务器状态',
    detailDeviceLabel: '设备状态',
    detailLastHeartbeatLabel: '最后心跳',
    detailHeartbeatIntervalLabel: '心跳间隔',
    detailHeartbeatIntervalValue: '{seconds}秒', // [未使用]
    detailConnected: '已连接 ✓',
    detailDisconnected: '未连接 ✗',
    detailManualReconnecting: '正在尝试手动重连，请稍候...',
    detailServerConnected: '服务器状态: 已连接 ✓', // [未使用]
    detailServerDisconnected: '服务器状态: 未连接 ✗', // [未使用]
    detailServerAuthenticating: '服务器状态: 认证中...', // [未使用]
    detailServerReconnecting: '服务器状态: 重连中 (第 {count} 次)', // [未使用]
    detailDeviceConnected: '设备状态: 已连接 ✓', // [未使用]
    detailDeviceDisconnected: '设备状态: 未连接 ✗', // [未使用]
    detailLastHeartbeat: '最后心跳: {time}', // [未使用]
    detailHeartbeatInterval: '心跳间隔: {seconds}秒', // [未使用]
    detailReconnectSuccess: '✓ 手动重连成功！',
    detailReconnectFailed: '✗ 手动重连失败: {error}', // [未使用]
    reconnectFailedUnknown: '未知错误',
    confirm: '确定',
    timeNever: '从未',
    timeSecondsAgo: '{n}秒前', // [未使用]
    timeMinutesAgo: '{n}分钟前', // [未使用]
    timeHoursAgo: '{n}小时前' // [未使用]
  },
  emailLog: {
    title: '邮件日志',
    searchPlaceholder: '搜索收件人/主题/配置名',
    statusFilter: '状态筛选',
    statusSending: '发送中',
    statusSuccess: '成功',
    statusFailed: '失败',
    configFilter: '配置筛选',
    batchDelete: '批量删除',
    refreshBtn: '刷新',
    configName: '配置名称',
    recipient: '收件人',
    subject: '邮件主题',
    template: '使用模板',
    status: '状态',
    retryCount: '重试次数',
    duration: '发送耗时',
    errorMsg: '错误信息',
    sendTime: '发送时间',
    operations: '操作',
    viewDetail: '详情',
    delete: '删除',
    detailTitle: '邮件日志详情',
    logId: '日志ID',
    cc: '抄送',
    ip: 'IP地址',
    emailContent: '邮件内容',
    close: '关闭',
    loadFailed: '加载邮件日志失败',
    detailFailed: '加载日志详情失败',
    deleteConfirm: '确定要删除这条日志吗？',
    deleteTitle: '删除确认',
    deleteSuccess: '删除成功',
    batchDeleteConfirm: '确定要删除选中的 {count} 条日志吗？', // [未使用]
    batchDeleteSuccess: '批量删除成功'
  },
  error: {
    PARAM_ERROR: '参数错误', // [未使用]
    PARAM_MISSING: '缺少必填参数', // [未使用]
    PARAM_INVALID: {
      default: '参数格式不正确', // [未使用]
      password: {
        string_min: '密码最少{limit}个字符', // [未使用]
        string_max: '密码最多{limit}个字符', // [未使用]
        string_empty: '密码不能为空', // [未使用]
        any_required: '密码不能为空' // [未使用]
      },
      username: {
        string_min: '用户名最少{limit}个字符', // [未使用]
        string_max: '用户名最多{limit}个字符', // [未使用]
        string_empty: '用户名不能为空', // [未使用]
        any_required: '用户名不能为空' // [未使用]
      },
      email: {
        string_email: '邮箱格式不正确', // [未使用]
        string_empty: '邮箱不能为空', // [未使用]
        any_required: '邮箱不能为空' // [未使用]
      },
      string_min: '{field}最少{limit}个字符', // [未使用]
      string_max: '{field}最多{limit}个字符', // [未使用]
      string_empty: '{field}不能为空', // [未使用]
      any_required: '{field}不能为空', // [未使用]
      string_base: '{field}必须是字符串', // [未使用]
      number_base: '{field}必须是数字' // [未使用]
    },
    UNAUTHORIZED: '未登录，请先登录', // [未使用]
    TOKEN_EXPIRED: '登录已过期，请重新登录', // [未使用]
    TOKEN_INVALID: 'Token无效', // [未使用]
    TOKEN_KICKED_OUT: '您已在其他设备登录，当前设备已下线', // [未使用]
    PERMISSION_DENIED: '权限不足', // [未使用]
    CAPTCHA_EXPIRED: '验证码已失效，请重新获取', // [未使用]
    CAPTCHA_ERROR: '验证码输入错误', // [未使用]
    NOT_FOUND: '接口不存在', // [未使用]
    SYSTEM_ERROR: '系统错误', // [未使用]
    DATABASE_ERROR: '数据库操作失败', // [未使用]
    NETWORK_ERROR: '网络错误', // [未使用]
    UNKNOWN_ERROR: '未知错误', // [未使用]
    DEPT_NOT_FOUND: '部门不存在', // [未使用]
    DEPT_PARENT_INVALID: '上级部门不能设置为自己', // [未使用]
    DEPT_HAS_CHILDREN: '存在子部门，无法删除', // [未使用]
    DEPT_HAS_USERS: '该部门下有用户，无法删除', // [未使用]
    ROLE_NOT_FOUND: '角色不存在', // [未使用]
    ROLE_CODE_EXISTS: '角色编码已存在', // [未使用]
    USER_NOT_FOUND: '用户不存在', // [未使用]
    USER_USERNAME_EXISTS: '用户名已存在', // [未使用]
    USER_PASSWORD_ERROR: '密码错误', // [未使用]
    USER_DISABLED: '账号已被禁用', // [未使用]
    USER_LOCKED: '账户已锁定', // [未使用]
    USER_REGISTER_FAIL: '注册失败', // [未使用]
    DEVICE_LIMIT_EXCEEDED: '在线设备数已达上限（最多 {maxDevices} 台），请联系管理员踢掉其他设备', // [未使用]
    DICT_TYPE_NOT_FOUND: '字典类型不存在', // [未使用]
    DICT_TYPE_CODE_EXISTS: '字典类型编码已存在', // [未使用]
    DICT_ITEM_NOT_FOUND: '字典项不存在', // [未使用]
    DICT_ITEM_VALUE_DUPLICATE: '同一字典类型下值不能重复', // [未使用]
    AUDIT_NOT_MODIFIABLE: '审计日志不允许修改', // [未使用]
    AUDIT_NOT_DELETABLE: '审计日志不允许删除', // [未使用]
    NOTIFICATION_NOT_FOUND: '通知不存在', // [未使用]
    CUSTOMER_NOT_FOUND: '客户不存在', // [未使用]
    MENU_USER_ID_REQUIRED: '用户ID不能为空', // [未使用]
    FILE_NOT_EXIST: '请选择要上传的文件', // [未使用]
    FILE_PATH_EMPTY: '文件路径不能为空', // [未使用]
    FILE_PATH_INVALID: '非法的文件路径', // [未使用]
    FILE_TOO_LARGE: '文件大小超出限制', // [未使用]
    FILE_TYPE_NOT_ALLOWED: '不支持的文件类型', // [未使用]
    FILE_UPLOAD_FAIL: '文件上传失败', // [未使用]
    FILE_DELETE_FAIL: '文件删除失败', // [未使用]
    FILE_LIMIT_EXCEEDED: '上传文件数量超出限制', // [未使用]
    FILE_UNEXPECTED_FIELD: '意外的文件字段', // [未使用]
    GITHUB_CONFIG_ERROR: 'GitHub 图床配置不完整', // [未使用]
    GITHUB_UPLOAD_FAIL: 'GitHub 上传失败', // [未使用]
    GITHUB_DELETE_FAIL: 'GitHub 文件删除失败', // [未使用]
    GITHUB_API_ERROR: 'GitHub API 调用失败', // [未使用]
    NOTIFICATION_TITLE_CONTENT_REQUIRED: '标题和内容不能为空', // [未使用]
    NOTIFICATION_USER_ID_REQUIRED: 'userId不能为空（或使用 broadcast: true 广播）', // [未使用]
    EMAIL_CONFIG_NOT_FOUND: '邮箱配置不存在', // [未使用]
    EMAIL_CONFIG_NAME_EXISTS: '配置名称已存在', // [未使用]
    EMAIL_CONFIG_DEFAULT_CANNOT_DELETE: '默认配置不能删除，请先将其他配置设为默认', // [未使用]
    EMAIL_CONFIG_SYSTEM_CANNOT_DELETE: '系统内置配置不能删除', // [未使用]
    EMAIL_CONFIG_DEFAULT_CANNOT_DISABLE: '默认配置不能禁用，请先将其他配置设为默认', // [未使用]
    EMAIL_CONFIG_ONLY_ENABLED_CAN_DEFAULT: '只能将启用的配置设为默认', // [未使用]
    EMAIL_NAME_REQUIRED: '配置名称不能为空', // [未使用]
    EMAIL_PROVIDER_REQUIRED: '服务商不能为空', // [未使用]
    EMAIL_HOST_REQUIRED: 'SMTP服务器地址不能为空', // [未使用]
    EMAIL_PORT_REQUIRED: 'SMTP端口不能为空', // [未使用]
    EMAIL_USERNAME_REQUIRED: '邮箱账号不能为空', // [未使用]
    EMAIL_PASSWORD_REQUIRED: '邮箱授权码不能为空', // [未使用]
    EMAIL_CONFIG_ID_REQUIRED: '配置ID不能为空', // [未使用]
    EMAIL_TO_EMAIL_REQUIRED: '测试收件人邮箱不能为空', // [未使用]
    EMAIL_STATUS_REQUIRED: '状态不能为空', // [未使用]
    EMAIL_FORMAT_INVALID: '邮箱格式不正确', // [未使用]
    EMAIL_VALIDATION_FAILED: '配置校验失败：{errors}', // [未使用]
    EMAIL_TEST_SEND_FAILED: '测试邮件发送失败：{error}', // [未使用]
    PART_CODE_EXISTS: '部件编码 {partCode} 已存在', // [未使用]
    PART_CODE_SAME_AS_OLD: '新部件编码 {partCode} 与原编码相同，无需更换', // [未使用]
    PART_SPEC_NOT_MATCH: '规格型号 {userSpec} 与模板规格型号 {templateSpec} 不匹配，必须使用模板定义的规格型号', // [未使用]
    PART_RATED_LIFE_NOT_MATCH: '额定寿命 {userRatedLife} 与模板额定寿命 {templateRatedLife} 不匹配，必须使用模板定义的额定寿命' // [未使用]
  },
  errorLog: {
    clear: '清空',
    empty: '暂无错误日志',
    pageUrl: '页面地址',
    stackInfo: '堆栈信息',
    triggerLocation: '触发位置',
    clearConfirm: '确定要清空所有错误日志吗？',
    title: '错误日志'
  },
  order: {
    orderReport: '订单生产报告',
    reportGeneratedBy: '报告生成人',
    reportGeneratedAt: '报告生成时间',
    orderNo: '订单编号',
    reportBasicInfo: '基本信息',
    productName: '产品名称',
    recipeName: '配方',
    batchNo: '批次号',
    operator: '操作人员',
    status: '订单状态',
    statusCompleted: '已完成',
    statusRunning: '生产中',
    statusPlanned: '待生产',
    startTime: '开始时间',
    endTime: '结束时间',
    reportProductionStats: '生产统计',
    targetQty: '目标数量',
    completedQty: '完成数量',
    qualifiedQty: '合格数量',
    unqualifiedQty: '不合格数量',
    qualifiedRate: '合格率',
    runtime: '运行时长',
    alarmCount: '报警次数',
    downloadCount: '已下载次数',
    reportAlarmDetail: '报警明细',
    reportOperatorDetail: '操作人员明细'
  },
  theme: {
    sidebarBg: '侧边栏背景色',
    sidebarHoverText: '侧边栏悬停文字色',
    sidebarHoverBg: '侧边栏悬停背景色',
    sidebarIconColor: '侧边栏图标颜色',
    sidebarActiveBg: '侧边栏选中背景色'
  },
  errorPage: {
    back: '返回',
    backHome: '返回首页',
    forbidden: '403 - 禁止访问',
    forbiddenDesc: '抱歉，您没有权限访问此页面',
    notFound: '404 - 页面不存在'
  },
  license: {
    adminOnly: '仅管理员可操作',
    brandDesc: '品牌描述',
    cancel: '取消',
    confirmImport: '确认导入',
    contact: '联系方式',
    customerName: '客户名称',
    detailTitle: '授权详情',
    download: '下载',
    dragUpload: '将授权文件拖到此处，或点击上传',
    email: '邮箱',
    enabled: '已启用',
    expireAt: '到期时间',
    expireTime: '过期时间',
    expired: '已过期',
    features: '功能特性',
    fileInfo: '文件信息',
    fileName: '文件名',
    filePath: '文件路径',
    fileSize: '文件大小',
    importDialogTitle: '导入授权',
    importLicense: '导入授权',
    importNewLicense: '导入新授权',
    importTip: '请选择 .lic 格式的授权文件',
    issuedAt: '签发时间',
    lastModified: '最后修改时间',
    lastVerified: '最后验证时间',
    licenseId: '授权ID',
    licenseStatus: '授权状态',
    licenseType: '授权类型',
    manageTitle: '授权管理',
    matchStatus: '匹配状态',
    matched: '已匹配',
    maxDevices: '最大设备数',
    maxUsers: '最大用户数',
    noLicenseFile: '未找到授权文件',
    notInitialized: '未初始化',
    notMatched: '未匹配',
    phone: '电话',
    project: '项目',
    projectId: '项目ID',
    projectName: '项目名称',
    refresh: '刷新',
    serverTime: '服务器时间',
    statusInvalid: '状态无效',
    statusValid: '状态有效',
    syncTime: '同步时间',
    timeGuard: '时间守护',
    timeGuardStatus: '时间守护状态',
    timeRemaining: '剩余时间',
    unknownReason: '未知原因',
    unlimited: '无限制'
  },
  systemConfig: {
    device: {
      reminderContent: '提醒内容',
      reminderNoData: '暂无提醒数据',
      reminderRemindLater: '稍后提醒',
      reminderTitle: '部件寿命提醒',
      reminderViewDetail: '查看详情'
    }
  }
}
