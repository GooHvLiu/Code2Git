/**
 * ==========================================
 * English Language Pack
 * ==========================================
 * Grouped by module, add new text here
 * Keep structure consistent with zh-CN.js
 */
export default {
  // Role names and descriptions (mapped by role_code, built-in roles use i18n, custom roles use DB values)
  roles: {
    Super_Admin: {
      name: 'Super Administrator', // [未使用]
      desc: 'Full system access, for system setup and parameter modification', // [未使用]
    },
    Administrator: {
      name: 'System Administrator', // [未使用]
      desc: 'Full user system access, for usage-level modifications', // [未使用]
    },
    Engineer: {
      name: 'Engineer', // [未使用]
      desc: 'Device engineer, can manage device parameters', // [未使用]
    },
    Operator: {
      name: 'Operator', // [未使用]
      desc: 'Normal operator, view and operate only', // [未使用]
    },
  },
  // Data dictionary (mapped by dict_code + value, built-in dicts use i18n, custom dicts use DB values)
  dict: {
    types: {
      user_status: 'User Status', // [未使用]
      user_sex: 'Gender', // [未使用]
      user_role: 'User Role', // [未使用]
      audit_action: 'Audit Action Type', // [未使用]
      audit_result: 'Audit Result', // [未使用]
      notification_type: 'Notification Type', // [未使用]
      notification_priority: 'Notification Priority', // [未使用]
    },
    items: {
      environment: {
        nodeEnv: { label: 'Environment', description: 'Node.js运行环境，development为开发模式，production为生产模式' },
        appPort: { label: 'Service Port', description: '后端服务监听的端口号' },
        appHost: { label: 'Service Host', description: '后端服务绑定的主机地址，0.0.0.0表示监听所有网卡' },
        systemVersion: { label: 'System Version', description: '系统版本号，发布新版本时更新' },
        nodeVersion: { label: 'Node.js Version', description: '当前运行的Node.js版本，建议使用LTS版本' },
        platform: { label: 'Operating System', description: '当前运行的操作系统平台，如 win32、linux、darwin 等' },
        arch: { label: 'System Architecture', description: '当前操作系统的 CPU 架构，如 x64、arm64 等' },
        hostname: { label: 'Hostname', description: '当前服务器的主机名，用于标识服务器身份' },
        localIp: { label: 'Local IP Address', description: '当前服务器的本地 IP 地址，用于局域网内访问' },
        cwd: { label: 'Working Directory', description: '后端服务的当前工作目录，即启动服务时所在的目录' },
        projectRoot: { label: 'Project Root Directory', description: '后端项目的根目录路径，所有相对路径都基于此目录' }
      },
      api: {
        apiPrefix: { label: 'API Prefix', description: 'API接口统一前缀，前后端需保持一致' },
        corsEnabled: { label: 'CORS Switch', description: '是否开启CORS跨域支持，生产环境建议配置具体域名' },
        rateLimit: { label: 'Rate Limit', description: '单IP每分钟最大请求数，防止恶意刷接口' },
        requestTimeout: { label: 'Request Timeout', description: '前端请求超时时间，超时后自动取消请求' },
        maxBodySize: { label: 'Request Body Size Limit', description: '后端接收的请求体最大大小，防止超大请求攻击' },
        maxFileSize: { label: 'File Size Limit', description: '上传文件的最大大小限制' },
        corsOrigin: { label: 'CORS Origin', description: '允许跨域访问的来源地址，*表示允许所有来源，生产环境建议配置具体域名' },
        rateLimitWindow: { label: 'Rate Limit Window', description: '请求频率限制的时间窗口（秒），在该时间窗口内最多允许rateLimit次请求' }
      },
      storage: {
        upload: {
          dir: { label: 'Upload Directory', description: '本地上传文件的存储目录' },
          maxSize: { label: 'Max File Size', description: '本地上传文件的最大大小' },
          allowedTypes: { label: 'Allowed File Types', description: '允许上传的文件扩展名列表' },
          staticPrefix: { label: 'Static Resource Prefix', description: '本地上传文件的静态访问URL前缀，用于通过HTTP访问上传的文件' }
        },
        github: {
          enabled: { label: 'GitHub Image Host Switch', description: '是否启用GitHub图床存储图片' },
          owner: { label: 'Repository Owner', description: 'GitHub仓库所有者用户名' },
          repo: { label: 'Repository Name', description: 'GitHub图床仓库名称' },
          branch: { label: 'Branch', description: 'GitHub仓库分支，一般为main' },
          pathPrefix: { label: 'Path Prefix', description: 'GitHub仓库中存储图片的路径前缀，如 images/' },
          maxSize: { label: 'Max File Size', description: 'GitHub图床上传文件的最大大小限制' }
        },
        backup: {
          dir: { label: 'Database Backup Directory', description: '数据库备份文件存储目录' }
        },
        logs: {
          dir: { label: 'Log Directory', description: '系统日志文件存储目录' }
        },
        license: {
          dir: { label: 'License File Directory', description: '授权文件和密钥存储目录' },
          licensePath: { label: 'License File Path', description: '授权许可证文件的存储路径' },
          publicKeyPath: { label: 'Public Key File Path', description: '用于验证授权签名的公钥文件路径' },
          timeGuardPath: { label: 'Time Guard File Path', description: '时间保护文件的存储路径，用于记录最后验证时间，防止回拨系统时间' }
        }
      },
      security: {
        jwt: {
          expiresIn: { label: 'Token Expiration', description: 'JWT Token的有效期，过期后需要重新登录' },
          algorithm: { label: 'Encryption Algorithm', description: 'JWT签名加密算法，一般使用HS256' }
        },
        session: {
          timeout: { label: 'Session Timeout', description: '用户无操作多长时间后自动退出登录' }
        },
        login: {
          failedThreshold: { label: 'Login Failure Threshold', description: '连续登录失败多少次后锁定账户' },
          lockDuration: { label: 'Account Lock Duration', description: '登录失败锁定账户的时长' }
        },
        password: {
          minLength: { label: 'Password Min Length', description: '用户密码的最小长度要求' },
          requireUppercase: { label: 'Require Uppercase', description: '用户密码是否必须包含大写字母（A-Z）' },
          requireLowercase: { label: 'Require Lowercase', description: '用户密码是否必须包含小写字母（a-z）' },
          requireNumber: { label: 'Require Number', description: '用户密码是否必须包含数字（0-9）' },
          requireSymbol: { label: 'Require Symbol', description: '用户密码是否必须包含特殊符号（如!@#$%^&*）' },
          bcryptSaltRounds: { label: 'Password Encryption Strength', description: 'bcrypt加密的盐轮数，数值越大越安全但越慢' }
        },
        watermark: {
          enabled: { label: 'Page Watermark', description: '是否在页面显示水印，防止截图泄露' }
        }
      },
      database: {
        host: { label: 'Database Host', description: 'MySQL数据库服务器地址' },
        port: { label: 'Database Port', description: 'MySQL数据库端口，默认为3306' },
        user: { label: 'Database Username', description: 'MySQL数据库登录用户名' },
        password: { label: 'Database Password', description: 'MySQL数据库登录密码（已隐藏）' },
        database: { label: 'Database Name', description: '使用的MySQL数据库名称' },
        connectionLimit: { label: 'Connection Pool Size', description: '数据库连接池的最大连接数' },
        waitForConnections: { label: 'Wait for Connections', description: '连接池满时是否等待连接释放，true表示等待，false表示立即报错' },
        queueLimit: { label: 'Queue Limit', description: '等待连接的最大请求数，0表示不限制' }
      },
      license: {
        projectId: { label: 'Project ID', description: '授权系统的项目唯一标识' },
        strictMode: { label: 'Strict Mode', description: '严格模式下授权验证失败会拒绝服务，非严格模式只警告' },
        licensePath: { label: 'License File Path', description: '授权许可证文件的存储路径' },
        publicKeyPath: { label: 'Public Key File Path', description: '用于验证授权签名的公钥文件路径' },
        licenseServerUrl: { label: 'Time Sync Server', description: '用于时间校准的服务器地址，防止本地时间篡改' },
        timeGuardPath: { label: 'Time Guard File Path', description: '时间保护文件的存储路径，用于记录最后验证时间，防止回拨系统时间' },
        maxFileSize: { label: 'Max File Size', description: '授权文件上传的最大大小限制' },
        allowedExtname: { label: 'Allowed Extensions', description: '允许上传的授权文件扩展名列表' }
      },
      email: {
        enabled: { label: 'Email System Switch', description: '是否启用邮箱发送功能' },
        defaultProvider: { label: 'Default Provider', description: '默认使用的邮件服务商配置，如smtp、qq、163等' },
        host: { label: 'SMTP Host', description: 'SMTP邮件服务器地址' },
        port: { label: 'SMTP Port', description: 'SMTP邮件服务器端口' },
        secure: { label: 'SSL Encryption', description: '是否使用SSL加密连接邮件服务器' },
        username: { label: 'Email Account', description: '用于发送邮件的邮箱账号' },
        fromName: { label: 'Sender Name', description: '邮件显示的发件人名称' },
        send: {
          maxRetries: { label: 'Max Send Retries', description: '邮件发送失败后的最大重试次数' },
          retryDelay: { label: 'Retry Delay', description: '邮件发送失败后重试的延迟时间（毫秒）' },
          timeout: { label: 'Send Timeout', description: '邮件发送的超时时间' },
          logEnabled: { label: 'Send Log', description: '是否记录邮件发送的详细日志' }
        },
        passwordReset: {
          tokenExpiresIn: { label: 'Reset Token Expiration', description: '密码重置链接的有效期' },
          tokenLength: { label: 'Reset Token Length', description: '密码重置Token的字符长度' },
          maxActiveTokens: { label: 'Max Active Tokens', description: '单个用户最多可同时存在的有效密码重置Token数量' }
        }
      },
      plc: {
        activeProtocol: { label: 'Communication Protocol', description: '当前使用的PLC通信协议' },
        supportedProtocols: { label: 'Supported Protocols', description: '系统支持的PLC通信协议列表' },
        connection: {
          host: { label: 'PLC Device IP', description: 'PLC设备的IP地址' },
          port: { label: 'PLC Port', description: 'PLC设备的通信端口' },
          unitId: { label: 'Unit ID', description: 'Modbus协议的从站单元ID，一般为1' },
          rack: { label: 'Rack Number', description: 'S7协议的机架号，一般为0' },
          slot: { label: 'Slot Number', description: 'S7协议的槽位号，一般为1或2' }
        },
        poll: {
          fastInterval: { label: 'Fast Poll Interval', description: '设备在线时的轮询间隔' },
          slowInterval: { label: 'Slow Poll Interval', description: '设备离线时的轮询间隔' },
          reconnectDelay: { label: 'Reconnect Delay', description: '设备断开后重新连接的延迟时间（毫秒）' }
        },
        enablePoll: { label: 'Auto Poll', description: '是否启用PLC数据自动轮询' },
        enableWriteAudit: { label: 'Write Audit', description: '是否记录PLC写入操作的审计日志' },
        maxWriteRetry: { label: 'Max Write Retries', description: 'PLC写入操作失败后的最大重试次数' },
        timeouts: {
          connect: { label: 'Connection Timeout', description: 'PLC连接的超时时间（毫秒）' },
          read: { label: 'Read Timeout', description: 'PLC单次读取的超时时间（毫秒）' },
          readBatch: { label: 'Batch Read Timeout', description: 'PLC批量读取的超时时间（毫秒）' },
          write: { label: 'Write Timeout', description: 'PLC写入操作的超时时间（毫秒）' },
          general: { label: 'General Timeout', description: 'PLC其他操作的通用超时时间（毫秒）' }
        },
        multiDeviceEnabled: { label: 'Multi-device Mode', description: '是否启用多设备模式，支持同时连接多个PLC设备' }
      }
    },
  },
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save', // [未使用]
    delete: 'Delete', // [未使用]
    edit: 'Edit', // [未使用]
    add: 'Add',
    search: 'Search', // [未使用]
    reset: 'Reset', // [未使用]
    export: 'Export', // [未使用]
    exportExcel: 'Export Excel',
    exportPdf: 'Export PDF',
    selected: 'Selected', // [未使用]
    import: 'Import', // [未使用]
    refresh: 'Refresh', // [未使用]
    operation: 'Action',
    status: 'Status', // [未使用]
    index: 'No.',
    sort: 'Sort', // [未使用]
    description: 'Description',
    remark: 'Remark', // [未使用]
    newCode: 'New Material Code', // [未使用]
    replaceReason: 'Replacement Reason', // [未使用]
    confirmReplace: 'Confirm Replacement', // [未使用]
    replacePart: 'Replace Part', // [未使用]
    currentCode: 'Current Code', // [未使用]
    enable: 'Enable',
    all: 'All', // [未使用]
    disable: 'Disable',
    createTime: 'Create Time', // [未使用]
    updateTime: 'Update Time', // [未使用]
    loading: 'Loading...', // [未使用]
    success: 'Success', // [未使用]
    failed: 'Failed', // [未使用]
    tip: 'Tip',
    warning: 'Warning',
    error: 'Error', // [未使用]
    untitled: 'Untitled', // [未使用]
    redirect: 'Redirect', // [未使用]
    systemName: 'nexCM Manager Std.',
    systemDESC: 'Benchtop Filling and Stoppering Machine',
    featureComingSoon: 'Coming Soon', // [未使用]
    noDataToExport: 'No data to export',
    operator: 'Operator', // [未使用]
    reason: 'Reason', // [未使用]
    reasonPlaceholder: 'Please enter the reason for operation (GMP required)', // [未使用]
    reasonRequired: 'Please enter the reason', // [未使用]
    reasonMinLength: 'Reason must be at least 2 characters', // [未使用]
    password: 'Password', // [未使用]
    passwordRequired: 'Please enter password', // [未使用]
    sessionTimeout: 'Session timed out, please login again', // [未使用]
    download: 'Download', // [未使用]
    print: 'Print', // [未使用]
    viewDetail: 'View Detail', // [未使用]
    statusChange: 'Status Change', // [未使用]
    refreshCache: 'Refresh Cache', // [未使用]
    detail: 'Detail', // [未使用]
    close: 'Close',
    exportLabels: {
      exporter: 'Exporter', // [未使用]
      time: 'Export Time', // [未使用]
      countPrefix: 'Total', // [未使用]
      countSuffix: 'records' // [未使用]
    },
    createSuccess: 'Created successfully',
    deleteSuccess: 'Deleted successfully',
    operationFailed: 'Operation failed',
    updateSuccess: 'Updated successfully',
    refreshSuccess: 'Refresh successful',
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  menu: {
    home: {
      default: 'HomeView', // [未使用]
      overview: {
        default: 'OverView'
      },
      dashboard: {
        default: 'DashBoard' // [未使用]
      },
      dataview: {
        default: 'DataView', // [未使用]
        search: 'Search', // [未使用]
        reset: 'Reset', // [未使用]
        export: 'Export', // [未使用]
        refresh: 'Refresh', // [未使用]
        detail: 'Detail', // [未使用]
        exportSingle: 'Export Single', // [未使用]
        output: {
          title: 'Output Data'
        },
        oee: {
          title: 'OEE Data'
        },
        production: {
          title: 'Production Data'
        },
        alarm: {
          title: 'Alarm Data'
        }
      }
    },
    device: {
      default: 'DeviceMg', // [未使用]
      state: {
        default: 'DevState', // [未使用]
        control: 'Device Control' // [未使用]
      },
      alarm: {
        default: 'AlarmLog', // [未使用]
        dashboard: {
          title: 'Dashboard' // [未使用]
        },
        list: {
          title: 'Detail List' // [未使用]
        },
        search: 'Search', // [未使用]
        reset: 'Reset', // [未使用]
        export: 'Export', // [未使用]
        refresh: 'Refresh', // [未使用]
        detail: 'Detail', // [未使用]
        handle: 'Handle' // [未使用]
      },
      part: {
        default: 'PartLife', // [未使用]
        search: 'Search',
        add: 'Add',
        refresh: 'Refresh', // [未使用]
        edit: 'Edit',
        operate: 'Replace',
        delete: 'Delete',
        tab: {
          life: 'LifeDetails',
          template: 'TempManager'
        },
        template: {
          add: 'Add Template',
          edit: 'Edit',
          delete: 'Delete',
          search: 'Search Template', // [未使用]
          refresh: 'Refresh',
          searchPlaceholder: 'Search template name/code',
          fillNeedle: 'Filling Needle Assembly', // [未使用]
          fillTube: 'Filling Tube Assembly', // [未使用]
          stopper: 'Stopper Rod Component', // [未使用]
          vacuum: 'Vacuum Component', // [未使用]
          column: {
            templateName: 'Template Name',
            templateKey: 'Template Code', // [未使用]
            codePrefix: 'Code Prefix', // [未使用]
            defaultSpec: 'Default Spec',
            defaultRatedLife: 'Default Rated Life',
            statMethod: 'Stat Method', // [未使用]
            statTag: 'Stat Tag', // [未使用]
            icon: 'Icon', // [未使用]
            status: 'Status',
            sort: 'Sort', // [未使用]
            action: 'Action'
          },
          form: {
            templateName: 'Template Name',
            templateKey: 'Template Code',
            codePrefix: 'Code Prefix',
            defaultSpec: 'Default Spec',
            defaultRatedLife: 'Default Rated Life',
            statMethod: 'Stat Method',
            statTag: 'Stat Tag',
            icon: 'Icon', // [未使用]
            enabled: 'Status', // [未使用]
            sort: 'Sort'
          },
          statMethod: {
            successCount: 'Success Count',
            rotationCount: 'Rotation Count',
            manual: 'Manual'
          },
          status: {
            enabled: 'Enabled',
            disabled: 'Disabled'
          },
          message: {
            addSuccess: 'Template added successfully',
            editSuccess: 'Template updated successfully',
            deleteSuccess: 'Template deleted successfully',
            deleteConfirm: 'Are you sure you want to delete this template?'
          }
        },
        page: {
          title: 'Part Life Management',
          addBtn: 'Add Part',
          editBtn: 'Edit',
          deleteBtn: 'Delete', // [未使用]
          replaceBtn: 'Replace', // [未使用]
          refreshBtn: 'Refresh', // [未使用]
          searchPlaceholder: 'Search part name/code',
          form: {
            template: 'Part Template',
            partName: 'Part Name',
            partCode: 'Part Code',
            specModel: 'Spec Model',
            ratedLife: 'Rated Life',
            usedLife: 'Used Life',
            installDate: 'Install Date',
            remark: 'Remark',
            newCode: 'New Material Code',
            replaceReason: 'Replacement Reason',
            confirmReplace: 'Confirm Replacement',
            replacePart: 'Replace Part',
            currentCode: 'Current Code'
          },
          status: {
            normal: 'Normal', // [未使用]
            warning: 'Warning',
            critical: 'Critical',
            expired: 'Expired'
          },
          template: {
            fill_needle: 'Fill Needle Assembly', // [未使用]
            fill_tube: 'Fill Tube Assembly', // [未使用]
            stopper_rod: 'Stopper Rod Part', // [未使用]
            vacuum_unit: 'Vacuum Unit' // [未使用]
          },
          unit: {
            times: 'times'
          },
          message: {
            addSuccess: 'Part added successfully',
            updateSuccess: 'Part updated successfully',
            deleteSuccess: 'Part deleted successfully',
            replaceSuccess: 'Part replacement recorded successfully',
            deleteConfirm: 'Are you sure to delete this part? History records will be retained.',
            loadFailed: 'Failed to load part list',
            noData: 'No part data',
            updateFailed: 'Failed to update part',
            addFailed: 'Failed to add part',
            saveFailed: 'Failed to save part',
            deleteFailed: 'Failed to delete part',
            deleteFailedCatch: 'Failed to delete part',
            replaceFailed: 'Failed to replace part',
            deleteConfirmTitle: 'Delete Confirmation',
            confirmBtn: 'Confirm',
            cancelBtn: 'Cancel',
            remaining: 'Remaining',
            recentReplaceRecords: 'Recent Replacement Records',
            statusSuccess: 'Success',
            statusFailed: 'Failed',
            oldCode: 'Old Code',
            newCode: 'New Code',
            operator: 'Operator',
            replaceDialogTitle: 'Part Replacement'
          },
          placeholder: {
            selectTemplate: 'Please select part template',
            partName: 'Please enter part name',
            partCode: 'Please enter part code (e.g. FILL-NEEDLE-001)',
            specModel: 'Please enter specification model',
            installDate: 'Select install date',
            remark: 'Please enter remarks',
            newCode: 'Please enter new material code',
            replaceReason: 'Please select replacement reason',
            ratedLife: 'Please enter rated life'
          },
          replaceReason: {
            life: 'Reached service life',
            damage: 'Damage/Fault',
            maintenance: 'Regular maintenance',
            changeover: 'Product changeover',
            other: 'Other'
          },
          table: {
            lifeProgress: 'Life Progress',
            remainingLife: 'Remaining Life',
            status: 'Status',
            operation: 'Operation' // [未使用]
          }
        }
      }
    },
    production: {
      default: 'ProdMgmt', // [未使用]
      recipe: {
        default: 'RecipeDB',
        download: 'Download', // [未使用]
        page: {
          desc: 'Production recipe management and parameter configuration',
          recipe: 'Recipe',
          recipeList: 'Recipe List',
          recipeCode: 'Recipe Code',
          recipeName: 'Recipe Name',
          productType: 'Product Type',
          fillVolume: 'Fill Volume',
          inUse: 'In Use',
          notInUse: 'Not In Use',
          download: 'Download',
          downloadAll: 'Download All', // [未使用]
          exportExcel: 'Export Excel',
          exportPdf: 'Export PDF',
          basicInfo: 'Basic Information',
          axisParams: 'Axis Parameters',
          speedParams: 'Speed Parameters',
          delayParams: 'Delay and Process Parameters',
          analysis: 'Intelligent Analysis',
          fillAngle: 'Fill Angle',
          suckBackAngle: 'Suck-back Angle',
          fillAxisInit: 'Fill Axis Init',
          fillAxisReach: 'Fill Axis Reach',
          fixAxisInit: 'Fix Axis Init',
          fixAxisReach: 'Fix Axis Reach',
          fixAxisPreLift: 'Fix Axis Pre-lift',
          stopperAxisInit: 'Stopper Axis Init',
          stopperAxisPrePress: 'Stopper Axis Pre-press',
          stopperAxisReach: 'Stopper Axis Reach',
          fillAxisInitSpeed: 'Fill Axis Init Speed',
          fillAxisReachSpeed: 'Fill Axis Reach Speed',
          fixAxisInitSpeed: 'Fix Axis Init Speed',
          fixAxisReachSpeed: 'Fix Axis Reach Speed',
          fixAxisPreLiftSpeed: 'Fix Axis Pre-lift Speed',
          stopperAxisInitSpeed: 'Stopper Axis Init Speed',
          stopperAxisPrePressSpeed: 'Stopper Axis Pre-press Speed',
          stopperAxisReachSpeed: 'Stopper Axis Reach Speed',
          fillDelay: 'Fill Delay',
          vacuumDelay: 'Vacuum Delay',
          fillSpeed: 'Fill Speed',
          suckBackSpeed: 'Suck-back Speed',
          usageCount: 'Usage Count',
          faultRate: 'Fault Rate',
          avgQualifiedRate: 'Avg Qualified Rate',
          lastUsed: 'Last Used'
        }
      },
      order: {
        default: 'OrderLog', // [未使用]
        completed: {
          title: 'Completed Orders' // [未使用]
        },
        running: {
          title: 'In Progress Orders' // [未使用]
        },
        planned: {
          title: 'Planned Orders' // [未使用]
        },
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        download: 'Download',
        export: 'Export', // [未使用]
        print: 'Print', // [未使用]
        page: {
          desc: 'Production order management and report export', // [未使用]
          completed: 'Completed',
          running: 'In Progress',
          planned: 'Planned',
          orderNo: 'Order No.',
          productName: 'Product Name',
          recipeName: 'Recipe',
          batchNo: 'Batch No.',
          targetQty: 'Target Qty',
          completedQty: 'Completed Qty',
          qualifiedQty: 'Qualified Qty', // [未使用]
          unqualifiedQty: 'Unqualified Qty', // [未使用]
          qualifiedRate: 'Qualified Rate',
          operator: 'Operator',
          startTime: 'Start Time',
          endTime: 'End Time',
          runtime: 'Runtime',
          alarmCount: 'Alarm Count',
          status: 'Status',
          progress: 'Progress', // [未使用]
          estimatedEnd: 'Est. End',
          priority: 'Priority', // [未使用]
          queuePosition: 'Queue Pos.', // [未使用]
          downloadCount: 'Download Count', // [未使用]
          download: 'Download Report', // [未使用]
          downloadSelected: 'Download Selected', // [未使用]
          downloadAll: 'Download All', // [未使用]
          exportPdf: 'Export PDF Report', // [未使用]
          noOrderProduction: 'No-Order Production',
          orderReport: 'Production Order Report', // [未使用]
          reportBasicInfo: 'Basic Information', // [未使用]
          reportProductionStats: 'Production Statistics', // [未使用]
          reportQualityStats: 'Quality Statistics', // [未使用]
          reportAlarmDetail: 'Alarm Details', // [未使用]
          reportOperatorDetail: 'Operator Details', // [未使用]
          reportGeneratedBy: 'Generated By', // [未使用]
          reportGeneratedAt: 'Generated At', // [未使用]
          high: 'High', // [未使用]
          normal: 'Normal',
          low: 'Low', // [未使用]
          statusCompleted: 'Completed',
          statusRunning: 'In Production',
          statusPlanned: 'Pending',
          selectOrderTip: 'Please select orders to download',
          plannedNoDownload: 'Planned orders do not support report download',
          runningNoDownload: 'Running orders do not support report download yet (enable in system settings)',
          add: 'Add Order', // [未使用]
          edit: 'Edit Order', // [未使用]
          delete: 'Delete',
          orderNoPlaceholder: 'Enter order number',
          productNamePlaceholder: 'Enter product name',
          recipeNamePlaceholder: 'Select recipe',
          batchNoPlaceholder: 'Enter batch number',
          startTimePlaceholder: 'Select start time',
          estimatedEndPlaceholder: 'Select estimated end time',
          addSuccess: 'Order added successfully', // [未使用]
          editSuccess: 'Order updated successfully', // [未使用]
          deleteSuccess: 'Order deleted successfully', // [未使用]
          deleteConfirm: 'Are you sure you want to delete order "{orderNo}"? This action cannot be undone.', // [未使用]
          formRequired: 'Please fill in the complete order information' // [未使用]
        }
      }
    },
    system: {
      default: 'SysSetup', // [未使用]
      user: {
        default: 'UserMgmt', // [未使用]
        page: {
          title: 'User Management',
          pageDesc: 'Manage system user accounts, support role assignment, status management and password reset',
          username: 'Username',
          usernamePlaceholder: 'Please enter username', // [未使用]
          realName: 'Real Name', // [未使用]
          realNamePlaceholder: 'Please enter real name', // [未使用]
          email: 'Email', // [未使用]
          emailPlaceholder: 'Please enter email', // [未使用]
          phone: 'Phone', // [未使用]
          phonePlaceholder: 'Please enter phone number', // [未使用]
          role: 'Role',
          rolePlaceholder: 'Please select role', // [未使用]
          dept: 'Department',
          deptPlaceholder: 'Please select department', // [未使用]
          status: 'Status',
          createTime: 'Create Time',
          password: 'Password', // [未使用]
          passwordPlaceholder: 'Please enter password', // [未使用]
          confirmPassword: 'Confirm Password', // [未使用]
          confirmPasswordRequired: 'Please enter confirm password', // [未使用]
          sex: 'Sex', // [未使用]
          remark: 'Remark',
          remarkPlaceholder: 'Please enter remark', // [未使用]
          add: 'Add User', // [未使用]
          edit: 'Edit User', // [未使用]
          resetPassword: 'Reset Password',
          unlock: 'Unlock',
          unlockConfirm: 'Are you sure you want to unlock this user?',
          unlockSuccess: 'User unlocked successfully',
          import: 'Import', // [未使用]
          export: 'Export', // [未使用]
          passwordMismatch: 'The two passwords entered do not match',
          resetPasswordSuccess: 'Password reset successfully'
        }
      },
      audit: {
        default: 'AuditLog', // [未使用]
        search: 'Search/Reset/Refresh', // [未使用]
        export: 'Export', // [未使用]
        detail: 'Detail', // [未使用]
        page: {
          title: 'Audit Log',
          myTitle: 'My Operation Log',
          pageDesc: 'Record all system operation logs, support filtering by user, action type, time range, etc.',
          userName: 'Username',
          action: 'Action Type',
          target: 'Operation Target',
          timeRange: 'Time Range',
          startTime: 'Start Time',
          endTime: 'End Time',
          oldValue: 'Old Value',
          newValue: 'New Value',
          result: 'Operation Result',
          ip: 'IP Address',
          createdAt: 'Create Time',
          detail: 'Detail',
          detailTitle: 'Audit Log Detail',
          verify: 'Verify' // [未使用]
        }
      },
      config: {
        default: 'ParamConf', // [未使用]
        edit: 'Edit',
        export: 'Export',
        refresh: 'Refresh Cache', // [未使用]
        param: {
          sessionTimeout: {
            view: 'Session Timeout - View', // [未使用]
            edit: 'Session Timeout - Edit' // [未使用]
          },
          defaultPageSize: {
            view: 'Default Page Size - View', // [未使用]
            edit: 'Default Page Size - Edit' // [未使用]
          },
          defaultLanguage: {
            view: 'Default Language - View', // [未使用]
            edit: 'Default Language - Edit' // [未使用]
          },
          watermarkEnabled: {
            view: 'Watermark Enabled - View', // [未使用]
            edit: 'Watermark Enabled - Edit' // [未使用]
          },
          watermarkText: {
            view: 'Watermark Text - View', // [未使用]
            edit: 'Watermark Text - Edit' // [未使用]
          },
          plcHost: {
            view: 'PLC Host - View', // [未使用]
            edit: 'PLC Host - Edit' // [未使用]
          },
          plcPort: {
            view: 'PLC Port - View', // [未使用]
            edit: 'PLC Port - Edit' // [未使用]
          }
        },
        childrenMenu: {
          title: 'Parameter Configuration', // [未使用]
          desc: 'System parameter configuration management',
          save: 'Save', // [未使用]
          reset: 'Reset', // [未使用]
          loading: 'Configuration loading, please wait...', // [未使用]
          loadError: 'Configuration load failed', // [未使用]
          loadErrorDesc: 'Please check network connection or contact administrator', // [未使用]
          reload: 'Reload', // [未使用]
          incomplete: 'Configuration incomplete', // [未使用]
          incompleteDesc: 'Detected {count} uninitialized configuration items, editing and saving are prohibited on this page.', // [未使用]
          missingKeys: 'Missing configuration items:', // [未使用]
          incompleteTip: 'Please contact administrator to execute configuration initialization SQL, or click the button below to reload.', // [未使用]
          system: {
            title: 'Sys Setting',
            sessionTimeout: 'Session Timeout',
            minutes: 'minutes',
            defaultPageSize: 'Default Page Size',
            defaultLanguage: 'Default Language',
            dateFormat: 'Date Format',
            sessionTimeoutTip: 'How long the user stays logged in after no activity before automatic logout', // [未使用]
            defaultPageSizeTip: 'Default number of items per page in list views', // [未使用]
            defaultLanguageTip: 'Default display language of the system (Chinese/English)', // [未使用]
            dateFormatTip: 'Date display format in the system (e.g., YYYY-MM-DD)' // [未使用]
          },
          security: {
            title: 'SecSetting',
            watermarkEnabled: 'Enable Watermark',
            watermarkText: 'Watermark Text',
            watermarkPlaceholder: 'Please enter watermark text',
            watermarkTextTip: 'Watermark text (uses current username when empty)',
            loginFailedThreshold: 'LoginFailed Threshold',
            loginFailedThresholdTip: 'Trigger notification and account lockout after consecutive login failures reach this count',
            lockDurationMinutes: 'Lock Duration',
            lockDurationMinutesTip: 'How long the account remains locked before automatic unlock',
            watermarkEnabledTip: 'Whether to show watermark on pages (to prevent screenshot leakage)' // [未使用]
          },
          export: {
            title: 'ExpSetting',
            format: 'Export Format', // [未使用]
            filename: 'Filename Prefix', // [未使用]
            pdfWatermarkEnabled: 'PDF Watermark',
            pdfWatermarkEnabledTip: 'Whether to add watermark when exporting PDF',
            pdfWatermarkText: 'Watermark Text',
            pdfWatermarkPlaceholder: 'Please enter PDF watermark text',
            pdfWatermarkTextTip: 'Watermark text shown in PDF (uses current username when empty)'
          },
          device: {
            title: 'DevSetting',
            maxOnlineDevices: 'Max Online Devices', // [未使用]
            deviceName: 'Device Name', // [未使用]
            deviceNameTip: 'Display name of the device, used for page display and notifications',
            deviceCode: 'Device Code',
            deviceCodeTip: 'Unique code of the device, used to identify the device',
            deviceRegion: 'Device Region',
            deviceRegionTip: 'Country/city where the device is located, used for timezone and localization',
            deviceInstallDate: 'Install Date',
            deviceInstallDateTip: 'Installation date of the device, used to calculate device usage years',
            partLifeSettingsTitle: 'Part Life Reminder Settings',
            partLifeReminderEnabled: 'PartLife Reminder',
            partLifeReminderEnabledTip: 'Whether to enable part life expiration reminder',
            partLifeThreshold: 'Reminder Threshold',
            partLifeThresholdTip: 'Trigger reminder when remaining part life is below this percentage',
            partLifeRemindInterval: 'Reminder Interval',
            intervalHour: 'Every Hour',
            intervalShift: 'Every Shift',
            intervalDay: 'Every Day',
            partLifeRemindIntervalTip: 'Repeat frequency of part life reminders (hourly/shift/daily)',
            snoozeInterval: 'Snooze Interval',
            snooze5min: '5 minutes',
            snooze10min: '10 minutes',
            snooze30min: '30 minutes',
            snooze1hour: '1 hour',
            snooze2hour: '2 hours',
            snoozeIntervalTip: 'Set the delay time for the "Snooze" function',
            partLifeSnoozeIntervalTip: 'How long before reminding again after user clicks "Remind Later"' // [未使用]
          },
          order: {
            title: 'OrdSetting',
            autoComplete: 'Auto Complete', // [未使用]
            productionControl: 'Production Control',
            allowNoOrderProduction: 'Allow No-Order Production',
            allowNoOrderProductionTip: 'Whether to allow starting production without a production order',
            noOrderProductionHighlight: 'Highlight No-Order Production',
            noOrderProductionHighlightTip: 'Whether to highlight on page when producing without an order',
            orderSwitchConfirm: 'Order Switch Confirmation',
            autoArchiveCompleted: 'Auto Archive Completed Orders',
            autoArchiveCompletedTip: 'Whether to automatically archive orders after completion',
            statDisplay: 'Statistics Display',
            showOperatorName: 'Show Operator Name',
            showOperatorNameTip: 'Whether to show operator name in order list and details',
            showAlarmCount: 'Show Alarm Count',
            showAlarmCountTip: 'Whether to show alarm count in order list and details',
            showRuntime: 'Show Runtime',
            showRuntimeTip: 'Whether to show runtime in order list and details',
            reportConfig: 'Report Config',
            reportIncludeAlarmDetail: 'Report Include Alarm Details',
            reportIncludeOperatorDetail: 'Report Include Operator Details',
            reportIncludeDownloadCount: 'Report Include Download Count',
            reportIncludeDownloadCountTip: 'Whether to include download count when exporting order report',
            allowRunningOrderDownload: 'Allow Running Order Download',
            allowRunningOrderDownloadTip: 'Whether to allow downloading reports of running orders',
            orderSwitchConfirmTip: 'Whether to require confirmation when switching production orders',
            reportIncludeAlarmDetailTip: 'Whether to include alarm details when exporting order report',
            reportIncludeOperatorDetailTip: 'Whether to include operator details when exporting order report'
          },
          emailLog: {
            title: 'EmailLogs',
            searchPlaceholder: 'Search recipient/subject/config',
            statusFilter: 'Status',
            statusSending: 'Sending',
            statusSuccess: 'Success',
            statusFailed: 'Failed',
            configFilter: 'Config',
            batchDelete: 'Batch Delete',
            refreshBtn: 'Refresh',
            configName: 'Config Name',
            recipient: 'Recipient',
            subject: 'Subject',
            template: 'Template',
            exportBtn: 'Export', // [未使用]
            deleteBtn: 'Delete', // [未使用]
            status: 'Status',
            retryCount: 'Retries',
            duration: 'Duration',
            errorMsg: 'Error',
            sendTime: 'Send Time',
            operations: 'Operations',
            viewDetail: 'Detail',
            delete: 'Delete',
            detailTitle: 'Email Log Detail',
            logId: 'Log ID',
            cc: 'CC',
            ip: 'IP Address',
            emailContent: 'Email Content',
            close: 'Close',
            loadFailed: 'Failed to load email logs',
            detailFailed: 'Failed to load log detail',
            deleteConfirm: 'Are you sure to delete this log?',
            deleteTitle: 'Delete Confirm',
            deleteSuccess: 'Deleted successfully',
            batchDeleteConfirm: 'Are you sure to delete {count} selected logs?', // [未使用]
            batchDeleteSuccess: 'Batch deleted successfully'
          },
          notification: {
            title: 'Notification Settings',
            autoReadDays: 'Auto Read Days',
            autoReadDaysTip: 'Notifications are automatically marked as read after the specified number of days',
            soundEnabled: 'Sound Alert',
            soundEnabledTip: 'Whether to play a sound alert when a new notification is received',
            unitDay: 'days'
          },
          licenseSetting: {
            title: 'License Settings',
            expiringDays: 'Expiring Reminder Days',
            expiringDaysTip: 'Number of days before license expiration to start sending reminder notifications',
            gracePeriod: 'Grace Period',
            gracePeriodTip: 'Number of days after license expiration to allow continued use',
            checkInterval: 'Check Interval',
            checkIntervalTip: 'Interval for periodically checking license status',
            unitDay: 'days',
            unitHour: 'hours'
          },
          license: {
            manageTitle: 'LicenseMgt',
            refresh: 'Refresh',
            importLicense: 'Import License',
            download: 'Download License',
            statusValid: 'License Valid',
            statusInvalid: 'License Invalid',
            expireTime: 'Expire Time',
            remaining: 'Remaining Time',
            projectName: 'Project Name',
            customerName: 'Customer Name',
            detailTitle: 'License Details',
            licenseId: 'License ID', // [未使用]
            projectId: 'Project ID',
            licenseKey: 'License Key', // [未使用]
            licenseType: 'License Type', // [未使用]
            maxDevices: 'Max Devices',
            maxUsers: 'Max Users', // [未使用]
            createdAt: 'Created At', // [未使用]
            activatedAt: 'Activated At', // [未使用]
            issuedAt: 'Issued At', // [未使用]
            contact: 'Contact',
            phone: 'Phone',
            email: 'Email',
            unlimited: 'Unlimited',
            features: 'Features',
            allFeatures: 'All Features',
            machineBind: 'Machine Binding',
            currentMachineId: 'Current Machine ID',
            boundMachineId: 'Bound Machine ID',
            notBoundAny: 'Not Bound',
            matchStatus: 'Match Status',
            matched: 'Matched',
            notMatched: 'Not Matched',
            timeGuard: 'Time Guard',
            timeGuardStatus: 'Time Guard Status',
            enabled: 'Enabled',
            notInitialized: 'Not Initialized',
            lastVerified: 'Last Verified',
            serverTime: 'Server Time',
            operation: 'Operation',
            networkDiagnosis: 'Network Diagnosis',
            fileInfo: 'License File Info',
            filePath: 'File Path',
            fileName: 'File Name',
            fileSize: 'File Size',
            lastModified: 'Last Modified',
            noLicenseFile: 'No License File',
            importDialogTitle: 'Import License',
            importTip: 'Please select a .lic format license file',
            dragUpload: 'Drag the file here, or click to upload',
            cancel: 'Cancel',
            confirmImport: 'Confirm Import',
            licenseManager: {
              brandTitle: 'License Management System',
              brandDesc: 'Secure, stable and reliable software licensing solution',
              featureRsa: 'RSA Asymmetric Encryption',
              featureTimeGuard: 'Anti-Tamper Time Protection',
              featureMachineBind: 'Machine Code Hardware Binding',
              importFormTitle: 'Import License File',
              statusValid: 'License Valid',
              statusInvalid: 'License Invalid',
              expireTime: 'Expire Time',
              permanentValid: 'Permanent Valid',
              currentMachineId: 'Current Machine ID',
              copy: 'Copy',
              copySuccess: 'Copied successfully',
              copyFailed: 'Copy failed',
              machineIdTip: 'Please send this machine ID to the vendor to generate a license file',
              dragUploadTip: 'Drag the .lic license file here, or click to upload',
              fileSizeTip: 'Only .lic format license files are supported',
              remove: 'Remove',
              pleaseSelectFile: 'Please select a license file first',
              importSuccessTitle: 'License Imported Successfully',
              importSuccess: 'License file imported successfully',
              licenseId: 'License ID',
              project: 'Project Name', // [未使用]
              licenseType: 'License Type',
              issuedAt: 'Issued At',
              maxUsers: 'Max Users',
              unlimited: 'Unlimited',
              importLicense: 'Import License',
              enterSystem: 'Enter System',
              refreshStatus: 'Refresh Status',
              cannotGetStatus: 'Unable to get license status',
              typeTrial: 'Trial',
              typeStandard: 'Standard',
              typeEnterprise: 'Enterprise',
              typePerpetual: 'Perpetual',
              reasonUnknown: 'Unknown reason',
              reasonFileNotFound: 'License file not found or verification failed',
              reasonProjectMismatch: 'Project mismatch',
              reasonMachineMismatch: 'Machine code mismatch (hardware binding)',
              reasonExpired: 'License expired',
              reasonMissingFeatures: 'Missing feature authorization',
              reasonTimeRollback: 'System time rollback detected',
              reasonNetworkSyncFailed: 'Network time synchronization failed'
            }
          }
        }
      },
      permission: {
        default: 'PermConf', // [未使用]
        save: 'Save',
        reset: 'Reset',
        refresh: 'Refresh Cache', // [未使用]
        page: {
          title: 'Permission Configuration', // [未使用]
          desc: 'Role permission configuration management', // [未使用]
          expandAll: 'Expand All', // [未使用]
          collapseAll: 'Collapse All', // [未使用]
          roleList: 'Role List', // [未使用]
          current: 'Current', // [未使用]
          noRole: 'No Role',
          permissionTree: 'Permission Tree', // [未使用]
          all: 'All', // [未使用]
          menu: 'Menu', // [未使用]
          button: 'Button', // [未使用]
          param: 'Param', // [未使用]
          searchPlaceholder: 'Search permission...', // [未使用]
          selectRoleTip: 'Please select a role on the left to configure permissions', // [未使用]
          save: 'Save',
          selected: 'Selected',
          reset: 'Reset',
          saveSuccess: 'Permission saved successfully', // [未使用]
          saveFailed: 'Permission save failed', // [未使用]
          confirmReset: 'Are you sure you want to reset permissions?', // [未使用]
          resetSuccess: 'Permission reset successfully', // [未使用]
          selectedCount: 'Selected {count} items', // [未使用]
          halfSelectedCount: 'Half selected {count} items', // [未使用]
          totalCount: 'Total {count} items' // [未使用]
        }
      },
      device: {
        default: 'OnlineMgmt', // [未使用]
        kick: 'Kick Device',
        delete: 'Delete Device', // [未使用]
        page: {
          title: 'Online Management',
          pageDesc: 'Online device and user management',
          onlineDevices: 'Online Devices',
          unlimited: 'Unlimited',
          maxDevices: 'Max Devices',
          onlineUsers: 'Online Users',
          usageRate: 'Usage Rate',
          searchPlaceholder: 'Search device or user...',
          filterStatus: 'Status Filter',
          statusOnline: 'Online',
          statusOffline: 'Offline',
          deviceName: 'Device Name',
          deviceNameTip: 'Device display name', // [未使用]
          deviceInfo: 'Device Info',
          user: 'User',
          ip: 'IP Address',
          loginTime: 'Login Time',
          lastActive: 'Last Active Time',
          lastActiveTime: 'Last Active Time', // [未使用]
          status: 'Status',
          operation: 'Operation',
          kick: 'Kick', // [未使用]
          kickConfirm: 'Are you sure you want to kick this device?', // [未使用]
          kickConfirmTitle: 'Kick Device Confirmation',
          kickWarningTitle: 'Kick Device Warning',
          kickWarningDesc: 'Are you sure you want to kick device {deviceName}?', // [未使用]
          kickSuccess: 'Device kicked successfully',
          kickFailed: 'Failed to kick device',
          delete: 'Delete',
          deleteConfirm: 'Are you sure you want to delete this offline device?', // [未使用]
          deleteConfirmTitle: 'Delete Device Confirmation',
          deleteWarningTitle: 'Delete Device Warning',
          deleteWarningDesc: 'Are you sure you want to delete offline device {deviceName}?', // [未使用]
          deleteSuccess: 'Device deleted successfully',
          deleteFailed: 'Failed to delete device',
          fetchFailed: 'Failed to fetch device list',
          unknownDevice: 'Unknown Device',
          currentDevice: 'Current Device',
          refresh: 'Refresh',
          refreshStatus: 'Refresh Status',
          refreshSuccess: 'Status refreshed successfully', // [未使用]
          refreshStatusSuccess: 'Status refresh successful',
          refreshStatusFailed: 'Status refresh failed',
          noData: 'No Data', // [未使用]
          loading: 'Loading...' // [未使用]
        }
      }
    },
    superPanel: {
      default: 'SuperPnls', // [未使用]
      dict: {
        default: 'Dict Data', // [未使用]
        page: {
          title: 'Dictionary Management',
          pageDesc: 'Manage system dictionary types and items, support multi-language configuration',
          typeList: 'Dictionary Type List',
          typeName: 'Dictionary Name',
          typeCode: 'Dictionary Code',
          itemLabelRequired: 'Please enter item label',
          itemValueRequired: 'Please enter item value',
          typeCodePlaceholder: 'Please enter dictionary code',
          typeNamePlaceholder: 'Please enter dictionary name',
          typeNameRequired: 'Please enter dictionary name',
          typeCodeRequired: 'Please enter dictionary code',
          itemList: 'Dictionary Item List',
          itemLabel: 'Dictionary Label',
          itemValue: 'Dictionary Value',
          itemValuePlaceholder: 'Please enter dictionary value',
          itemLabelPlaceholder: 'Please enter dictionary label',
          itemStatus: 'Status',
          addItem: 'Add Dict Item',
          addType: 'Add Dict Type',
          deleteItemConfirm: 'Are you sure to delete this dict item?',
          deleteTypeConfirm: 'Are you sure to delete this dict type?',
          editItem: 'Edit Dict Item',
          editType: 'Edit Dict Type'
        }
      },
      dept: {
        default: 'DeptMgmt', // [未使用]
        page: {
          title: 'Department Management',
          pageDesc: 'Manage organization department structure, support tree hierarchy management',
          rootDept: 'Root Department',
          deptName: 'Department Name',
          deptNamePlaceholder: 'Please enter department name',
          deptNameRequired: 'Please enter department name',
          orderNum: 'Display Order',
          leader: 'Leader',
          phone: 'Phone',
          email: 'Email',
          addChild: 'Add Child Department',
          parentDept: 'Parent Department',
          parentDeptPlaceholder: 'Select parent department',
          addDept: 'Add Department',
          deleteConfirm: 'Are you sure to delete this department?',
          editDept: 'Edit Department'
        }
      },
      role: {
        default: 'RoleMgmt', // [未使用]
        page: {
          title: 'Role Management',
          pageDesc: 'Manage system roles, support add, edit and delete roles',
          roleName: 'Role Name',
          roleNameRequired: 'Please enter role name',
          roleCode: 'Role Code',
          roleCodeRequired: 'Please enter role code',
          addRole: 'Add Role',
          editRole: 'Edit Role',
          deleteConfirm: 'Are you sure to delete this role?',
          basicRoleCannotEdit: 'System built-in roles cannot be edited',
          basicRoleCannotDelete: 'System built-in roles cannot be deleted'
        }
      },
      config: {
        default: 'ParamConf',
        pageTitle: 'Parameter Configuration',
        childrenMenu: {
          title: 'Parameter Configuration',
          desc: 'System parameter configuration management',
          save: 'Save',
          reset: 'Reset',
          loading: 'Configuration loading, please wait...', // [未使用]
          loadError: 'Configuration load failed', // [未使用]
          loadErrorDesc: 'Please check network connection or contact administrator', // [未使用]
          reload: 'Reload', // [未使用]
          incomplete: 'Configuration incomplete', // [未使用]
          incompleteDesc: 'Detected {count} uninitialized configuration items, editing and saving are prohibited on this page.', // [未使用]
          missingKeys: 'Missing configuration items:', // [未使用]
          incompleteTip: 'Please contact administrator to execute configuration initialization SQL, or click the button below to reload.', // [未使用]
          plc: {
            title: 'PLCConnect',
            protocol: 'Comm Protocol',
            protocolTip: 'Protocol type for PLC communication',
            host: 'PLC Address',
            hostTip: 'IP address of PLC device',
            port: 'Port',
            portTip: 'PLC communication port, Modbus default 502', // [未使用]
            unitId: 'Unit ID',
            unitIdTip: 'PLC station/unit ID, usually 1',
            timeout: 'Timeout', // [未使用]
            retryCount: 'Retry Count', // [未使用]
            pollSettings: 'Poll Settings',
            pollFast: 'Fast Poll Interval',
            pollFastTip: 'High-frequency data collection interval',
            pollSlow: 'Slow Poll Interval',
            pollSlowTip: 'Low-frequency data collection interval',
            plcProtocolTip: 'Protocol used for PLC communication (e.g., ModbusTcp)', // [未使用]
            plcHostTip: 'IP address of the PLC device', // [未使用]
            plcPortTip: 'Port number of the PLC device', // [未使用]
            plcUnitIdTip: 'Unit ID/Slave address for Modbus communication', // [未使用]
            pollFastIntervalTip: 'Interval for reading PLC data in fast polling mode', // [未使用]
            pollSlowIntervalTip: 'Interval for reading PLC data in slow polling mode', // [未使用]
            reconnectDelay: 'Reconnect Delay',
            reconnectDelayTip: 'Wait time before attempting to reconnect after PLC connection is lost',
            enablePoll: 'Enable Polling',
            enablePollTip: 'Whether to enable PLC data polling collection',
            enableWriteAudit: 'Enable Write Audit',
            enableWriteAuditTip: 'Whether to record audit logs for PLC write operations',
            maxWriteRetry: 'Max Write Retry',
            maxWriteRetryTip: 'Maximum number of retries after PLC write operation fails'
          },
          connection: {
            title: 'ConnectConf',
            heartbeatInterval: 'Heartbeat Interval',
            heartbeatIntervalTip: 'Heartbeat packet interval for WebSocket connection, used to maintain connection',
            deviceStatusCheckInterval: 'Online Status Check',
            deviceStatusCheckIntervalTip: 'Interval for periodically checking device online/offline status',
            deviceOfflineThreshold: 'OnOffThreshold',
            deviceOfflineThresholdTip: 'How long the device has no response before being marked as offline',
            unitSecond: 's',
            maintenanceCheckInterval: 'Maintenance Check',
            maintenanceCheckIntervalTip: 'Interval for periodically checking device maintenance status, part life, and license expiration',
            unitHour: 'h',
            partLifeStatInterval: 'PartLife Stat',
            partLifeStatIntervalTip: 'Interval for periodically reading counter data from PLC and updating part usage life',
            unitMinute: 'min'
          },
          email: {
            title: 'EmailConfig',
            addBtn: 'Add Config',
            refreshBtn: 'Refresh',
            configName: 'Config Name',
            provider: 'Provider',
            smtpHost: 'SMTP Server',
            smtpPort: 'Port',
            portTip: 'PLC communication port, Modbus default 502',
            emailAccount: 'Email Account',
            senderName: 'Sender Name',
            isDefault: 'Is Default',
            default: 'Default',
            status: 'Status',
            operations: 'Operations',
            testBtn: 'Test',
            setDefaultBtn: 'Set Default',
            editBtn: 'Edit',
            deleteBtn: 'Delete',
            addTitle: 'Add Email Config',
            editTitle: 'Edit Email Config',
            configNamePlaceholder: 'Please enter config name',
            searchPlaceholder: 'Search name or email account',
            useSSL: 'Use SSL',
            authCode: 'Auth Code',
            authCodePlaceholder: 'Please enter email auth code',
            authCodePlaceholderEdit: 'Leave blank to keep unchanged',
            authCodeTip: 'For QQ Mail, enable SMTP service in settings and get the auth code',
            senderNamePlaceholder: 'Please enter sender name',
            remark: 'Remark',
            cancelBtn: 'Cancel',
            saveBtn: 'Save',
            confirmBtn: 'Confirm',
            testEmailTitle: 'Send Test Email',
            testConfigName: 'Config Name',
            testReceiver: 'Receiver Email',
            sendTestBtn: 'Send Test Email',
            testReceiverRequired: 'Please enter test receiver email',
            configNameRequired: 'Please enter config name',
            providerRequired: 'Please select provider',
            smtpHostRequired: 'Please enter SMTP server address',
            smtpPortRequired: 'Please enter SMTP port',
            emailAccountRequired: 'Please enter email account',
            emailFormatError: 'Invalid email format',
            authCodeRequired: 'Please enter email auth code',
            loadFailed: 'Failed to load email config list',
            addSuccess: 'Added successfully',
            updateSuccess: 'Updated successfully',
            deleteSuccess: 'Deleted successfully',
            setDefaultSuccess: 'Set as default config',
            enableSuccess: 'Enabled',
            disableSuccess: 'Disabled',
            testSendSuccess: 'Test email sent successfully, please check',
            deleteTitle: 'Delete Confirm',
            deleteConfirm: 'Are you sure you want to delete this email config?',
            sendTimeout: 'Send Timeout', // [未使用]
            sendTimeoutTip: 'Timeout for email sending (milliseconds)', // [未使用]
            maxRetries: 'Max Retries', // [未使用]
            maxRetriesTip: 'Maximum number of retries after email sending fails', // [未使用]
            retryDelay: 'Retry Delay', // [未使用]
            retryDelayTip: 'Wait time before retrying after email sending fails (milliseconds)' // [未使用]
          },
          upload: {
            title: 'UploadConf',
            maxFileSize: 'Max File Size',
            maxFileSizeTip: 'Maximum size of a single uploaded file (MB)',
            allowedTypes: 'Allowed File Types',
            allowedTypesTip: 'Allowed file types for upload, separated by commas (e.g., image,pdf,excel,word)',
            uploadPath: 'Storage Path',
            uploadPathTip: 'Storage path for uploaded files on the server',
            enableAudit: 'Enable Upload Audit',
            enableAuditTip: 'Whether to record audit logs for file upload operations'
          },
          audit: {
            title: 'AuditConf',
            retentionDays: 'Retention Days',
            retentionDaysTip: 'Number of days audit logs are retained in the database, automatically cleaned after expiration',
            autoArchive: 'Auto Archive',
            autoArchiveTip: 'Whether to automatically archive audit logs that exceed the retention period'
          },
        },
      },
      permission: {
        default: 'PermConf', // [未使用]
        page: {
          title: 'Permission Configuration', // [未使用]
          desc: 'Super admin permission configuration management', // [未使用]
          expandAll: 'Expand All',
          collapseAll: 'Collapse All',
          roleList: 'Role List',
          current: 'Current',
          noRole: 'No Roles', // [未使用]
          permissionTree: 'Permission Tree',
          all: 'All',
          menu: 'Menu',
          button: 'Button',
          param: 'Param',
          selectRoleTip: 'Please select a role on the left to configure permissions',
          selected: 'Selected',
          saveSuccess: 'Permissions saved successfully', // [未使用]
        },
      },
      feature: {
        default: 'Feat Conf', // [未使用]
        page: {
          title: 'Feature Configuration',
          pageDesc: 'Manage feature switches for all system modules, accessible only by super admin',
          categoryList: 'Categories', // [未使用]
          resetAll: 'Reset All',
          resetCategory: 'Reset Category',
          reset: 'Reset',
          modified: 'Modified',
          defaultValue: 'Default',
          noData: 'No feature configuration',
          items: 'items',
          updateSuccess: 'Feature configuration updated successfully',
          resetSuccess: 'Reset to default value',
          resetConfirm: 'Are you sure you want to reset this feature to default?',
          resetCategoryConfirm: 'Are you sure you want to reset all features in this category?',
          resetAllConfirm: 'Are you sure you want to reset ALL features to default? This cannot be undone!'
        },
        category: {
          notification: 'Notification', // [未使用]
          email: 'Email',
          audit: 'Audit', // [未使用]
          auth: 'Authentication', // [未使用]
          system: 'System' // [未使用]
        },
        notification: {
          system: {
            backupSuccess: 'Data Backup Success Notification', // [未使用]
            backupSuccessDesc: 'Send notification when data backup succeeds', // [未使用]
            backupFailed: 'Data Backup Failed Notification', // [未使用]
            backupFailedDesc: 'Send notification when data backup fails', // [未使用]
            expiring: 'License Expiring Notification', // [未使用]
            expiringDesc: 'Send reminder when license is about to expire', // [未使用]
            expired: 'License Expired Notification', // [未使用]
            expiredDesc: 'Send notification when license has expired' // [未使用]
          },
          user: {
            register: 'New User Registration Notification', // [未使用]
            registerDesc: 'Notify admin when new user registers', // [未使用]
            create: 'Admin Created User Notification', // [未使用]
            createDesc: 'Notify relevant personnel when admin creates a user', // [未使用]
            update: 'User Info Update Notification', // [未使用]
            updateDesc: 'Notify admin when user info changes', // [未使用]
            statusChange: 'User Status Change Notification', // [未使用]
            statusChangeDesc: 'Notify when user enable/disable status changes', // [未使用]
            passwordReset: 'User Password Reset Notification', // [未使用]
            passwordResetDesc: 'Notify admin when user password is reset', // [未使用]
            loginFailed: 'User Login Failed Notification', // [未使用]
            loginFailedDesc: 'Notify admin after multiple failed login attempts', // [未使用]
            roleChange: 'User Role/Permission Change Notification', // [未使用]
            roleChangeDesc: 'Notify when user role or permission changes' // [未使用]
          },
          device: {
            paramChange: 'Device Parameter Change Notification', // [未使用]
            paramChangeDesc: 'Notify relevant personnel when device parameters change', // [未使用]
            maintenanceReminder: 'Device Maintenance Reminder', // [未使用]
            maintenanceReminderDesc: 'Send reminder when device needs maintenance', // [未使用]
            partLifeWarning: 'Part Life Warning Notification', // [未使用]
            partLifeWarningDesc: 'Send warning when part life reaches threshold' // [未使用]
          },
          production: {
            orderCreate: 'Production Order Create Notification', // [未使用]
            orderCreateDesc: 'Notify relevant personnel when production order is created', // [未使用]
            orderUpdate: 'Production Order Update Notification', // [未使用]
            orderUpdateDesc: 'Notify relevant personnel when production order changes', // [未使用]
            orderComplete: 'Production Order Complete Notification', // [未使用]
            orderCompleteDesc: 'Notify relevant personnel when production order completes', // [未使用]
            batchComplete: 'Batch Complete Notification', // [未使用]
            batchCompleteDesc: 'Notify relevant personnel when production batch completes' // [未使用]
          },
          config: {
            systemUpdate: 'System Config Change Notification', // [未使用]
            systemUpdateDesc: 'Notify admin when system config changes', // [未使用]
            plcConnectionUpdate: 'PLC Connection Config Change Notification', // [未使用]
            plcConnectionUpdateDesc: 'Notify when PLC connection config changes', // [未使用]
            connectionUpdate: 'Connection Config Change Notification', // [未使用]
            connectionUpdateDesc: 'Notify relevant personnel when connection config changes', // [未使用]
            deviceParamsUpdate: 'Device Parameter Config Change Notification', // [未使用]
            deviceParamsUpdateDesc: 'Notify when device parameter config changes', // [未使用]
            exportUpdate: 'Export Config Change Notification', // [未使用]
            exportUpdateDesc: 'Notify admin when export config changes', // [未使用]
            securityUpdate: 'Security Config Change Notification', // [未使用]
            securityUpdateDesc: 'Notify admin when security config changes' // [未使用]
          },
          security: {
            logExport: 'Audit Log Export Notification', // [未使用]
            logExportDesc: 'Notify admin when audit log is exported', // [未使用]
            logView: 'Audit Log View Notification', // [未使用]
            logViewDesc: 'Notify admin when audit log is viewed', // [未使用]
            permissionChange: 'Permission Config Change Notification', // [未使用]
            permissionChangeDesc: 'Notify admin when permission config changes', // [未使用]
            dataExport: 'Sensitive Data Export Notification', // [未使用]
            dataExportDesc: 'Notify admin when sensitive data is exported', // [未使用]
            dataDelete: 'Data Delete Operation Notification', // [未使用]
            dataDeleteDesc: 'Notify admin when data is deleted' // [未使用]
          }
        },
        email: {
          user: {
            passwordReset: 'Admin Reset Password Email', // [未使用]
            passwordResetDesc: 'Send new password to user email after admin resets password', // [未使用]
            forgotPasswordCode: 'Forgot Password Verification Code Email', // [未使用]
            forgotPasswordCodeDesc: 'Send verification code to email when user requests password reset', // [未使用]
            resetSuccess: 'Password Reset Success Notification Email', // [未使用]
            resetSuccessDesc: 'Send notification email after password reset succeeds' // [未使用]
          },
          notification: {
            forward: 'Notification Forward Email', // [未使用]
            forwardDesc: 'Forward system notifications to user email' // [未使用]
          },
          device: {
            alarm: 'Device Alarm Email', // [未使用]
            alarmDesc: 'Send email notification when device alarms' // [未使用]
          }
        },
        audit: {
          user: 'User Management Audit', // [未使用]
          userDesc: 'Record user login, registration, CRUD, password reset operations', // [未使用]
          permission: 'Permission Management Audit', // [未使用]
          permissionDesc: 'Record role CRUD, permission config changes', // [未使用]
          config: 'System Config Audit', // [未使用]
          configDesc: 'Record system, security, PLC, export, connection, device, order config changes', // [未使用]
          device: 'Device Management Audit', // [未使用]
          deviceDesc: 'Record device status, parameter changes, part life, alarm handling', // [未使用]
          production: 'Production Management Audit', // [未使用]
          productionDesc: 'Record recipe download, order CRUD, order download operations', // [未使用]
          data: 'Data Management Audit', // [未使用]
          dataDesc: 'Record data export, data detail view operations', // [未使用]
          plc: 'PLC Operation Audit', // [未使用]
          plcDesc: 'Record PLC read/write, connect, disconnect, reconnect operations', // [未使用]
          audit: 'Audit Self Audit', // [未使用]
          auditDesc: 'Record audit view, verify, export operations', // [未使用]
          license: 'License Management Audit', // [未使用]
          licenseDesc: 'Record license import, license expiration operations', // [未使用]
          email: 'Email Config Audit', // [未使用]
          emailDesc: 'Record email config changes, email log delete operations' // [未使用]
        },
        auth: {
          register: 'Registration Feature', // [未使用]
          registerDesc: 'Whether to allow users to self-register accounts', // [未使用]
          forgotPassword: 'Forgot Password Feature', // [未使用]
          forgotPasswordDesc: 'Whether to allow password reset via email verification code', // [未使用]
          firstLoginChangePassword: 'First Login Force Password Change', // [未使用]
          firstLoginChangePasswordDesc: 'Whether password must be changed on first login', // [未使用]
          loginFailedLock: 'Login Failed Lock', // [未使用]
          loginFailedLockDesc: 'Whether to lock account after consecutive failed logins' // [未使用]
        },
        system: {
          notificationMaster: 'Notification Master Switch', // [未使用]
          notificationMasterDesc: 'All notifications disabled when turned off', // [未使用]
          emailMaster: 'Email System Master Switch', // [未使用]
          emailMasterDesc: 'All emails disabled when turned off', // [未使用]
          auditMaster: 'Audit Module Master Switch', // [未使用]
          auditMasterDesc: 'All audits disabled when turned off', // [未使用]
          maintenanceTaskMaster: 'Scheduled Task Master Switch', // [未使用]
          maintenanceTaskMasterDesc: 'All scheduled tasks stopped when turned off', // [未使用]
          dataExportMaster: 'Data Export Master Switch', // [未使用]
          dataExportMasterDesc: 'All export functions disabled when turned off', // [未使用]
          watermark: 'Page Watermark', // [未使用]
          watermarkDesc: 'Whether to display page watermark', // [未使用]
          onlineDeviceLimit: 'Online Device Limit', // [未使用]
          onlineDeviceLimitDesc: 'Whether to limit online devices per user', // [未使用]
          auditVerify: 'Audit Verification Feature', // [未使用]
          auditVerifyDesc: 'Whether audit logs need verification' // [未使用]
        }
      },
      database: {
        default: 'DataMgmt', // [未使用]
        title: 'Database Management',
        desc: 'Database management tool, supports data viewing, table editing, backup and restore, only accessible to super admin',
        tabs: {
          dataView: 'Data View',
          tableEdit: 'Table Edit',
          backup: 'Backup',
          restore: 'Restore Guide'
        },
        searchTable: 'Search Table',
        noTable: 'No tables found',
        selectTableTip: 'Please select a table from the left',
        refresh: 'Refresh',
        searchData: 'Search Data',
        search: 'Search',
        selectConfigTable: 'Select Config Table',
        selectConfigTableTip: 'Please select a config table to edit',
        addRecord: 'Add Record',
        editRecord: 'Edit Record',
        operation: 'Operation',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        confirm: 'Confirm',
        warning: 'Warning',
        addSuccess: 'Add success',
        addFailed: 'Add failed',
        editSuccess: 'Edit success',
        editFailed: 'Edit failed',
        saveFailed: 'Save failed',
        deleteConfirm: 'Are you sure you want to delete this record? This operation cannot be undone!',
        deleteSuccess: 'Delete success',
        deleteFailed: 'Delete failed',
        createBackup: 'Create Backup',
        backupTip: 'Backup files will be saved in the server backups/database directory. Current table will be automatically backed up before editing table data.',
        backupName: 'Backup Name',
        backupType: 'Backup Type',
        fullBackup: 'Full Backup',
        tableBackup: 'Table Backup',
        tableName: 'Table Name',
        selectTable: 'Select Table',
        backupSelectTableTip: 'Please select a table to backup',
        fileSize: 'File Size',
        remark: 'Remark',
        backupRemarkPlaceholder: 'Please enter backup remark for easy identification later',
        operator: 'Operator',
        status: 'Status',
        success: 'Success',
        failed: 'Failed',
        createTime: 'Create Time',
        restore: 'Restore',
        backupSuccess: 'Backup created successfully',
        backupFailed: 'Backup creation failed',
        deleteBackupConfirm: 'Are you sure you want to delete backup "{name}"? This operation cannot be undone!', // [未使用]
        restoreConfirm: 'Are you sure you want to restore to backup "{name}"? Current data will be automatically backed up before restore. This operation cannot be undone!', // [未使用]
        restoreSuccess: 'Restore success',
        restoreFailed: 'Restore failed',
        restoreGuideTitle: 'Database Restore Operation Guide',
        restoreStep1Title: 'Step 1: Select Backup Version',
        restoreStep1Desc: 'In the "Backup" tab, select the target backup version from the backup list. It is recommended to carefully check the backup time, remarks and file size to confirm the correct version is selected.',
        restoreStep2Title: 'Step 2: Confirm Restore Operation',
        restoreStep2Desc: 'Click the "Restore" button on the right side of the backup record, and the system will pop up a confirmation dialog. Please read the prompt carefully. The restore operation will overwrite the current database and cannot be undone.',
        restoreStep3Title: 'Step 3: Auto Backup Current Data',
        restoreStep3Desc: 'After confirming the restore, the system will automatically backup the current database data first (backup name starts with pre_restore_), ensuring that you can roll back to the pre-restore state if the restore fails or needs to be recovered.',
        restoreStep4Title: 'Step 4: Execute Restore and Verify',
        restoreStep4Desc: 'After the automatic backup is completed, the system will execute the restore operation. After the restore is completed, it is recommended to refresh the page and check the key data to confirm that the restore result meets expectations.',
        restoreWarningTitle: 'Restore Notes',
        restoreWarning1: 'The restore operation will overwrite all data in the current database. Please make sure the correct backup version is selected.',
        restoreWarning2: 'The system will automatically backup the current data before restore, but it is still recommended to manually create a backup and fill in remarks before important operations.',
        restoreWarning3: 'Do not close the page or restart the service during the restore process, otherwise it may cause data corruption.',
        goToBackup: 'Go to Backup'
      },
      projectConfig: {
        default: 'Proj Conf', // [未使用]
        title: 'Proj Conf', // [未使用]
        desc: 'View and manage all configuration information of the project, support online editing of config files. Only super admin can access.', // [未使用]
        page: {
          title: 'Project Configuration Management',
          desc: 'View and manage all configuration information of the project, support online editing of config files'
        },
        menu: {
          environment: 'EnvConf', // [未使用]
          api: 'ApiConf', // [未使用]
          storage: 'Storage', // [未使用]
          security: 'Security', // [未使用]
          database: 'DbConf', // [未使用]
          license: 'License', // [未使用]
          email: 'E-mail', // [未使用]
          plc: 'PlcConf' // [未使用]
        },
        editType: {
          database: 'Database Config', // [未使用]
          configFile: 'Config File', // [未使用]
          envFile: 'Env Variable', // [未使用]
          code: 'Code Constant', // [未使用]
          databaseTip: 'Stored in database, can be modified directly in System Settings/Super Panel config page, takes effect immediately', // [未使用]
          configFileTip: 'Stored in backend config file (e.g. src/config/*.js), need to edit file online and restart backend service', // [未使用]
          envFileTip: 'Stored in environment variable file (e.g. .env), need to edit file online and restart backend service', // [未使用]
          codeTip: 'Hardcoded in source code, need to manually modify source code and rebuild' // [未使用]
        },
        effectType: {
          immediate: 'Immediate', // [未使用]
          restart: 'Restart Required', // [未使用]
          rebuild: 'Rebuild Required', // [未使用]
          immediateTip: 'Takes effect immediately after modification, no need to restart service or rebuild', // [未使用]
          restartTip: 'Need to restart backend service to take effect after modification', // [未使用]
          rebuildTip: 'Need to rebuild frontend project to take effect after modification' // [未使用]
        },
        ownerType: {
          frontend: 'Frontend', // [未使用]
          backend: 'Backend', // [未使用]
          frontendTip: 'This config item belongs to frontend project, need to rebuild frontend after modification', // [未使用]
          backendTip: 'This config item belongs to backend project, need to restart backend service after modification' // [未使用]
        },
        sourceType: {
          file: 'Config File', // [未使用]
          database: 'Database Config', // [未使用]
          runtime: 'System Runtime Info (Auto)',
          code: 'Code Constant (Hardcoded)'
        },
        actions: {
          goToConfig: 'Go to Config',
          editFile: 'Edit File'
        },
        tips: {
          codeConstant: 'This config item is a code constant, need to modify code and rebuild',
          needCodeChange: 'Need Code Change',
          noFilePath: 'This config item has no associated file path',
          notInWhitelist: 'This file is not in the recommended editing whitelist. Online editing may cause system instability. Are you sure you want to continue editing?',
          confirmFailed: 'Confirm dialog call failed, please check console error messages'
        },
        editor: {
          title: 'Online Editor',
          unsaved: 'Unsaved',
          saved: 'Saved',
          syntaxCheck: 'Syntax Check',
          versionHistory: 'Version History',
          save: 'Save',
          syntaxValid: 'Syntax check passed',
          syntaxInvalid: 'Syntax check failed',
          readFailed: 'Failed to read file',
          syntaxCheckFailed: 'Syntax check failed',
          saveSuccess: 'Saved successfully',
          backupPath: 'Backup Path',
          backupPathLoading: 'Loading...'
        },
        backup: {
          title: 'Version History',
          operator: 'Operator',
          restore: 'Rollback',
          delete: 'Delete',
          empty: 'No backup records',
          loadFailed: 'Failed to load backup list',
          viewTip: 'Click the rollback button to restore to this version', // [未使用]
          restoreConfirm: 'Are you sure you want to rollback to this version? The current version will be automatically backed up.',
          restoreSuccess: 'Rollback successful',
          deleteConfirm: 'Are you sure you want to delete this backup? This operation cannot be undone.',
          deleteSuccess: 'Backup deleted successfully'
        },
        saveDialog: {
          title: 'Save File',
          remark: 'Remark',
          remarkPlaceholder: 'Please enter the remark for this change (optional)',
          warning: 'You need to restart the backend service to take effect after saving',
          confirm: 'Confirm Save'
        },
        backupPathDialog: {
          title: 'Change Backup Path',
          currentPath: 'Current Path',
          newPath: 'New Path',
          newPathPlaceholder: 'Please enter the new backup path (relative or absolute)',
          warning: 'After changing the backup path, new backup files will be saved to the new path, and existing backup files will remain in the original path.',
          pathRequired: 'Backup path cannot be empty',
          changeSuccess: 'Backup path changed successfully'
        },
        empty: {
          noConfig: 'No config items'
        },
        refresh: 'Refresh',
        loading: 'Loading...',
        loadFailed: 'Failed to load project config',
        items: {
          environment: {
            nodeEnv: { label: 'Environment', description: 'Node.js runtime environment, development for dev mode, production for production mode' },
            appPort: { label: 'Service Port', description: 'Backend service listening port' },
            appHost: { label: 'Service Host', description: 'Backend service binding host address, 0.0.0.0 means listening on all network interfaces' },
            systemVersion: { label: 'System Version', description: 'System version number, updated when releasing new version' },
            nodeVersion: { label: 'Node.js Version', description: 'Current running Node.js version, LTS version is recommended' },
            platform: { label: 'Operating System', description: 'Current running OS platform, such as win32, linux, darwin, etc.' },
            arch: { label: 'System Architecture', description: 'Current OS CPU architecture, such as x64, arm64, etc.' },
            hostname: { label: 'Hostname', description: 'Current server hostname, used to identify server identity' },
            localIp: { label: 'Local IP Address', description: 'Current server local IP address, used for LAN access' },
            cwd: { label: 'Working Directory', description: 'Backend service current working directory, the directory where the service is started' },
            projectRoot: { label: 'Project Root Directory', description: 'Backend project root directory path, all relative paths are based on this directory' }
          },
          api: {
            apiPrefix: { label: 'API Prefix', description: 'API interface unified prefix, frontend and backend must be consistent' },
            corsEnabled: { label: 'CORS Switch', description: 'Whether to enable CORS cross-origin support, specific domain is recommended for production' },
            rateLimit: { label: 'Rate Limit', description: 'Max requests per minute per single IP, to prevent malicious API attacks' },
            requestTimeout: { label: 'Request Timeout', description: 'Frontend request timeout, request will be automatically cancelled after timeout' },
            maxBodySize: { label: 'Request Body Size Limit', description: 'Max request body size accepted by backend, to prevent oversized request attacks' },
            maxFileSize: { label: 'File Size Limit', description: 'Max uploaded file size limit' },
            corsOrigin: { label: 'CORS Origin', description: 'Allowed cross-origin access source address, * means all sources allowed, specific domain is recommended for production' },
            rateLimitWindow: { label: 'Rate Limit Window', description: 'Time window (seconds) for rate limit, max rateLimit requests allowed within this window' }
          },
          storage: {
            upload: {
              dir: { label: 'Upload Directory', description: 'Local upload file storage directory' },
              maxSize: { label: 'Max File Size', description: 'Max local upload file size' },
              allowedTypes: { label: 'Allowed File Types', description: 'List of allowed upload file extensions' },
              staticPrefix: { label: 'Static Resource Prefix', description: 'Static access URL prefix for local upload files, used to access uploaded files via HTTP' }
            },
            github: {
              enabled: { label: 'GitHub Image Host Switch', description: 'Whether to enable GitHub image host for storing images' },
              owner: { label: 'Repository Owner', description: 'GitHub repository owner username' },
              repo: { label: 'Repository Name', description: 'GitHub image host repository name' },
              branch: { label: 'Branch', description: 'GitHub repository branch, usually main' },
              pathPrefix: { label: 'Path Prefix', description: 'Path prefix for storing images in GitHub repository, such as images/' },
              maxSize: { label: 'Max File Size', description: 'Max file size limit for GitHub image host upload' }
            },
            backup: {
              dir: { label: 'Database Backup Directory', description: 'Database backup file storage directory' }
            },
            logs: {
              dir: { label: 'Log Directory', description: 'System log file storage directory' }
            },
            license: {
              dir: { label: 'License File Directory', description: 'License file and key storage directory' },
              licensePath: { label: 'License File Path', description: 'License file storage path' },
              publicKeyPath: { label: 'Public Key File Path', description: 'Public key file path used to verify license signature' },
              timeGuardPath: { label: 'Time Guard File Path', description: 'Time guard file storage path, used to record last verification time, prevent system time rollback' }
            }
          },
          security: {
            jwt: {
              expiresIn: { label: 'Token Expiration', description: 'JWT Token expiration, need to re-login after expiration' },
              algorithm: { label: 'Encryption Algorithm', description: 'JWT signature encryption algorithm, usually HS256' }
            },
            session: {
              timeout: { label: 'Session Timeout', description: 'Auto logout after user inactivity for this duration' }
            },
            login: {
              failedThreshold: { label: 'Login Failure Threshold', description: 'Account will be locked after consecutive login failures' },
              lockDuration: { label: 'Account Lock Duration', description: 'Account lock duration after login failure' }
            },
            password: {
              minLength: { label: 'Password Min Length', description: 'User password minimum length requirement' },
              requireUppercase: { label: 'Require Uppercase', description: 'Whether user password must contain uppercase letters (A-Z)' },
              requireLowercase: { label: 'Require Lowercase', description: 'Whether user password must contain lowercase letters (a-z)' },
              requireNumber: { label: 'Require Number', description: 'Whether user password must contain numbers (0-9)' },
              requireSymbol: { label: 'Require Symbol', description: 'Whether user password must contain special symbols (such as !@#$%^&*)' },
              bcryptSaltRounds: { label: 'Password Encryption Strength', description: 'bcrypt encryption salt rounds, higher value is more secure but slower' }
            },
            watermark: {
              enabled: { label: 'Page Watermark', description: 'Whether to display watermark on page, prevent screenshot leakage' }
            }
          },
          database: {
            host: { label: 'Database Host', description: 'MySQL database server address' },
            port: { label: 'Database Port', description: 'MySQL database port, default is 3306' },
            user: { label: 'Database Username', description: 'MySQL database login username' },
            password: { label: 'Database Password', description: 'MySQL database login password (hidden)' },
            database: { label: 'Database Name', description: 'MySQL database name in use' },
            connectionLimit: { label: 'Connection Pool Size', description: 'Max connections in database connection pool' },
            waitForConnections: { label: 'Wait for Connections', description: 'Whether to wait for connection release when pool is full, true means wait, false means immediate error' },
            queueLimit: { label: 'Queue Limit', description: 'Max number of waiting connection requests, 0 means no limit' }
          },
          license: {
            projectId: { label: 'Project ID', description: 'Unique identifier of the project in license system' },
            strictMode: { label: 'Strict Mode', description: 'In strict mode, license verification failure will deny service, non-strict mode only warns' },
            licensePath: { label: 'License File Path', description: 'License file storage path' },
            publicKeyPath: { label: 'Public Key File Path', description: 'Public key file path used to verify license signature' },
            licenseServerUrl: { label: 'Time Sync Server', description: 'Server address used for time synchronization, prevent local time tampering' },
            timeGuardPath: { label: 'Time Guard File Path', description: 'Time guard file storage path, used to record last verification time, prevent system time rollback' },
            maxFileSize: { label: 'Max File Size', description: 'Max file size limit for license file upload' },
            allowedExtname: { label: 'Allowed Extensions', description: 'List of allowed license file extensions' }
          },
          email: {
            enabled: { label: 'Email System Switch', description: 'Whether to enable email sending function' },
            defaultProvider: { label: 'Default Provider', description: 'Default email service provider configuration, such as smtp, qq, 163, etc.' },
            host: { label: 'SMTP Host', description: 'SMTP email server address' },
            port: { label: 'SMTP Port', description: 'SMTP email server port' },
            secure: { label: 'SSL Encryption', description: 'Whether to use SSL encryption to connect to email server' },
            username: { label: 'Email Account', description: 'Email account used for sending emails' },
            fromName: { label: 'Sender Name', description: 'Sender name displayed in email' },
            send: {
              maxRetries: { label: 'Max Send Retries', description: 'Max retries after email sending failure' },
              retryDelay: { label: 'Retry Delay', description: 'Delay time (ms) before retry after email sending failure' },
              timeout: { label: 'Send Timeout', description: 'Email sending timeout' },
              logEnabled: { label: 'Send Log', description: 'Whether to record detailed logs of email sending' }
            },
            passwordReset: {
              tokenExpiresIn: { label: 'Reset Token Expiration', description: 'Password reset link expiration' },
              tokenLength: { label: 'Reset Token Length', description: 'Password reset token character length' },
              maxActiveTokens: { label: 'Max Active Tokens', description: 'Max number of valid password reset tokens that can exist simultaneously for a single user' }
            }
          },
          plc: {
            activeProtocol: { label: 'Communication Protocol', description: 'Current PLC communication protocol in use' },
            supportedProtocols: { label: 'Supported Protocols', description: 'List of PLC communication protocols supported by the system' },
            connection: {
              host: { label: 'PLC Device IP', description: 'PLC device IP address' },
              port: { label: 'PLC Port', description: 'PLC device communication port' },
              unitId: { label: 'Unit ID', description: 'Modbus protocol slave unit ID, usually 1' },
              rack: { label: 'Rack Number', description: 'S7 protocol rack number, usually 0' },
              slot: { label: 'Slot Number', description: 'S7 protocol slot number, usually 1 or 2' }
            },
            poll: {
              fastInterval: { label: 'Fast Poll Interval', description: 'Poll interval when device is online' },
              slowInterval: { label: 'Slow Poll Interval', description: 'Poll interval when device is offline' },
              reconnectDelay: { label: 'Reconnect Delay', description: 'Delay time (ms) before reconnecting after device disconnect' }
            },
            enablePoll: { label: 'Auto Poll', description: 'Whether to enable PLC data auto polling' },
            enableWriteAudit: { label: 'Write Audit', description: 'Whether to record audit logs for PLC write operations' },
            maxWriteRetry: { label: 'Max Write Retries', description: 'Max retries after PLC write operation failure' },
            timeouts: {
              connect: { label: 'Connection Timeout', description: 'PLC connection timeout (ms)' },
              read: { label: 'Read Timeout', description: 'PLC single read timeout (ms)' },
              readBatch: { label: 'Batch Read Timeout', description: 'PLC batch read timeout (ms)' },
              write: { label: 'Write Timeout', description: 'PLC write operation timeout (ms)' },
              general: { label: 'General Timeout', description: 'General timeout for other PLC operations (ms)' }
            },
            multiDeviceEnabled: { label: 'Multi-device Mode', description: 'Whether to enable multi-device mode, support connecting multiple PLC devices simultaneously' }
          }
        }
      }
    },
  },
  tagsview: {
    refresh: 'Refresh Page',
    close: 'Close Page',
    closeOthers: 'Close Others',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All'
  },
  login: {
    title: 'System Login',
    username: 'Username',
    password: 'Password',
    captcha: 'Captcha',
    loginBtn: 'Login',
    registerBtn: 'Register',
    rememberMe: 'Remember me', // [未使用]
    forgotPassword: 'Forgot password?',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',
    goLogin: 'Go to login', // [未使用]
    goRegister: 'Go to register', // [未使用]
    loginNow: 'Login Now',
    registerNow: 'Register Now',
    usernameRequired: 'Please enter username',
    passwordRequired: 'Please enter password',
    captchaRequired: 'Please enter captcha',
    emailRequired: 'Please enter email',
    usernamePlaceholder: 'Enter username', // [未使用]
    passwordPlaceholder: 'Enter password', // [未使用]
    captchaPlaceholder: 'Enter captcha', // [未使用]
    loginSuccess: 'Login successful', // [未使用]
    loginFailed: 'Login failed', // [未使用]
    logoutSuccess: 'Logout successful', // [未使用]
    logoutConfirm: 'Are you sure you want to logout?', // [未使用]
    registerTitle: 'User Registration',
    realName: 'Real Name',
    email: 'Email',
    phone: 'Phone',
    confirmPassword: 'Confirm Password',
    registerSuccess: 'Registration successful, please login',
    deviceLimitExceeded: 'Maximum number of online devices reached (max {maxDevices} devices), please contact administrator to kick other devices', // [未使用]
    kickedOffline: 'Your account has been logged in on another device, you have been kicked offline', // [未使用]
    kickNotice: 'Kick Notice', // [未使用]
    kickReason: 'Your account has been logged in on another device', // [未使用]
    firstLoginTitle: 'First Login', // [未使用]
    firstLoginDesc: 'Detected that you are logging in for the first time, please change your initial password', // [未使用]
    oldPassword: 'Old Password', // [未使用]
    newPassword: 'New Password', // [未使用]
    modifyPassword: 'Change Password', // [未使用]
    passwordStrength: 'Password Strength', // [未使用]
    passwordWeak: 'Weak', // [未使用]
    passwordMedium: 'Medium', // [未使用]
    passwordStrong: 'Strong', // [未使用]
    passwordTips: 'Password length 8-20 characters, including uppercase and lowercase letters, numbers and special characters', // [未使用]
    confirmPasswordRequired: 'Please confirm your password'
  },
  layout: {
    user: 'User',
    fullscreen: 'Fullscreen', // [未使用]
    exitFullscreen: 'Exit Fullscreen', // [未使用]
    searchMenu: 'Search Menu',
    profile: 'Profile',
    settings: 'System Settings', // [未使用]
    logout: 'Logout',
    notificationCenter: 'Notification Center', // [未使用]
    collapse: 'Collapse', // [未使用]
    expand: 'Expand' // [未使用]
  },
  profile: {
    title: 'Profile', // [未使用]
    basicInfo: 'Basic Info',
    username: 'Username',
    realName: 'Real Name',
    role: 'User Role',
    sex: 'User Sex',
    phone: 'Phone No.',
    email: 'Email Add.',
    status: 'Status',
    createTime: 'Create Time'
  },
  quickMenu: {
    title: 'Quick Menu',
    theme: {
      palette: 'Theme Palette',
      resetAll: 'Reset All',
      reset: 'Reset',
      custom: 'Custom',
      sidebarBg: 'Sidebar Background', // [未使用]
      sidebarHoverText: 'Sidebar Hover Text', // [未使用]
      sidebarHoverBg: 'Sidebar Hover Background', // [未使用]
      sidebarIconColor: 'Icon Color', // [未使用]
      sidebarActiveBg: 'Sidebar Active Background' // [未使用]
    },
    language: {
      title: 'Language',
      switchedToZh: 'Switched to Chinese',
      switchedToEn: 'Switched to English'
    }
  },
  notification: {
    title: 'Notification Center',
    center: 'Notification Center',
    empty: 'No notifications',
    viewAll: 'View All',
    notificationSettings: 'Notification Settings',
    markAllRead: 'Mark All Read',
    markAllConfirm: 'Are you sure you want to mark all notifications as read?',
    markAllSuccess: 'All notifications marked as read',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this notification?',
    deleteSuccess: 'Notification deleted',
    batchDelete: 'Batch Delete',
    batchDeleteConfirm: 'Are you sure you want to delete the selected {count} notifications?', // [未使用]
    batchDeleteSuccess: 'Selected notifications deleted',
    type: 'Notification Type',
    content: 'Notification Content',
    read: 'Read',
    unread: 'Unread',
    createdAt: 'Created At',
    unarchived: 'Unarchived',
    archived: 'Archived',
    archive: 'Archive',
    unarchive: 'Unarchive',
    batchArchive: 'Batch Archive',
    batchUnarchive: 'Batch Unarchive',
    all: 'All',
    typeSystem: 'System', // [未使用]
    typePlc: 'PLC', // [未使用]
    typeUser: 'User', // [未使用]
    typeAudit: 'Audit', // [未使用]
    typeDevice: 'Device', // [未使用]
    typeConnection: 'Connection', // [未使用]
    typeSecurity: 'Security', // [未使用]
    typeProduction: 'Production', // [未使用]
    typeConfig: 'Config', // [未使用]
    typeLicense: 'License', // [未使用]
    priority: 'Priority',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    timeRange: 'Time Range',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    custom: 'Custom',
    to: 'To',
    startDate: 'Start Date',
    endDate: 'End Date',
    searchPlaceholder: 'Search notifications...',
    reset: 'Reset',
    markRead: 'Mark Read',
    batchMarkRead: 'Batch Mark Read',
    selectedCount: '{count} selected', // [未使用]
    clearSelection: 'Clear Selection',
    justNow: 'Just now',
    minutesAgo: ' minutes ago',
    hoursAgo: ' hours ago',
    daysAgo: ' days ago',
    userLoginTitle: 'User Login', // [未使用]
    userLoginContent: 'User {username} logged in to the system', // [未使用]
    kickOutTitle: 'Offline Notification', // [未使用]
    kickOutContent: 'Your account has been logged in on another device', // [未使用]
    kickedOutTitle: 'Account Kicked Offline', // [未使用]
    kickedOutContent: 'Your account was logged in on device with IP {ip} at {time}, current device has been kicked offline', // [未使用]
    deviceKickedTitle: 'Device Kicked Offline', // [未使用]
    deviceKickedContent: 'Your device {deviceName} was kicked offline by administrator {operator} at {time}', // [未使用]
    deviceKickedAdminTitle: 'Device Kicked Offline (Admin Notification)', // [未使用]
    deviceKickedAdminContent: 'Administrator {operator} kicked device {deviceName} of user {userId} offline at {time}', // [未使用]
    system: {
      backupSuccess: {
        title: 'Data Backup Successful', // [未使用]
        content: 'System data backup completed successfully' // [未使用]
      },
      backupFailed: {
        title: 'Data Backup Failed', // [未使用]
        content: 'System data backup failed, please check backup configuration' // [未使用]
      }
    },
    license: {
      expiring: {
        title: 'License Expiring Soon', // [未使用]
        content: 'System license will expire within 30 days, please renew in time' // [未使用]
      },
      expired: {
        title: 'License Expired', // [未使用]
        content: 'System license has expired, some features are restricted' // [未使用]
      }
    },
    user: {
      register: {
        title: 'New User Registered', // [未使用]
        content: 'User {username} has registered successfully' // [未使用]
      },
      create: {
        title: 'User Created', // [未使用]
        content: 'Administrator created user {username}' // [未使用]
      },
      update: {
        title: 'User Information Updated', // [未使用]
        content: 'User {username} information has been updated' // [未使用]
      },
      statusChange: {
        title: 'User Status Changed', // [未使用]
        content: 'User {username} status has been changed to {status}' // [未使用]
      },
      passwordReset: {
        title: 'Password Reset', // [未使用]
        content: 'User {username} password has been reset' // [未使用]
      },
      loginFailed: {
        title: 'User Login Failed', // [未使用]
        content: 'User {username} failed to login {count} times consecutively, please pay attention' // [未使用]
      },
      roleChange: {
        title: 'User Role Changed', // [未使用]
        content: 'User {username} role has been changed to {role}' // [未使用]
      }
    },
    device: {
      paramChange: {
        title: 'Device Parameter Changed', // [未使用]
        content: 'Device parameter {tag} has been modified by {operator}' // [未使用]
      },
      maintenanceReminder: {
        title: 'Device Maintenance Reminder', // [未使用]
        content: 'Device {deviceName} is about to reach maintenance time, please arrange maintenance in time' // [未使用]
      },
      partLifeWarning: {
        title: 'Part Life Warning', // [未使用]
        content: 'Part {partName} service life is about to expire, please replace it in time' // [未使用]
      }
    },
    production: {
      orderCreate: {
        title: 'Production Order Created', // [未使用]
        content: 'Production order {orderNo} has been created' // [未使用]
      },
      orderUpdate: {
        title: 'Production Order Updated', // [未使用]
        content: 'Production order {orderNo} has been updated' // [未使用]
      },
      orderComplete: {
        title: 'Production Order Completed', // [未使用]
        content: 'Production order {orderNo} has been completed' // [未使用]
      },
      batchComplete: {
        title: 'Batch Completed', // [未使用]
        content: 'Batch {batchNo} has completed production' // [未使用]
      }
    },
    config: {
      systemUpdate: {
        title: 'System Configuration Changed', // [未使用]
        content: 'System configuration has been modified by {username}' // [未使用]
      },
      plcConnectionUpdate: {
        title: 'PLC Connection Configuration Changed', // [未使用]
        content: 'PLC connection configuration has been modified by {username}' // [未使用]
      },
      connectionUpdate: {
        title: 'Connection Configuration Changed', // [未使用]
        content: 'Connection configuration has been modified by {username}' // [未使用]
      },
      deviceParamsUpdate: {
        title: 'Device Parameter Configuration Changed', // [未使用]
        content: 'Device parameter configuration has been modified by {username}' // [未使用]
      },
      exportUpdate: {
        title: 'Export Configuration Changed', // [未使用]
        content: 'Export configuration has been modified by {username}' // [未使用]
      },
      securityUpdate: {
        title: 'Security Configuration Changed', // [未使用]
        content: 'Security configuration has been modified by {username}' // [未使用]
      }
    },
    audit: {
      logExport: {
        title: 'Audit Log Exported', // [未使用]
        content: 'User {username} exported audit logs' // [未使用]
      },
      logView: {
        title: 'Audit Log Viewed', // [未使用]
        content: 'User {username} viewed audit logs' // [未使用]
      }
    },
    permission: {
      change: {
        title: 'Permission Configuration Changed', // [未使用]
        content: 'Role {roleName} permission configuration has been modified by {operator}' // [未使用]
      }
    },
    data: {
      export: {
        title: 'Sensitive Data Exported', // [未使用]
        content: 'User {username} exported sensitive data' // [未使用]
      },
      delete: {
        title: 'Data Deletion Operation', // [未使用]
        content: 'User {username} deleted data' // [未使用]
      }
    },
    settings: {
      title: 'Notification Settings',
      notificationTypes: 'Notification Types',
      typeEnabled: 'Enabled',
      system: 'System Notification', // [未使用]
      plc: 'PLC Notification', // [未使用]
      user: 'User Notification', // [未使用]
      audit: 'Audit Notification', // [未使用]
      device: 'Device Notification', // [未使用]
      connection: 'Connection Notification', // [未使用]
      doNotDisturb: 'Do Not Disturb',
      doNotDisturbEnabled: 'Enable DND',
      reminderMethods: 'Reminder Methods',
      reminderMethodsDesc: 'Select how to receive notifications',
      soundEnabled: 'Sound Reminder',
      popupEnabled: 'Popup Reminder',
      save: 'Save',
      endTime: 'End Time',
      saveSuccess: 'Saved successfully',
      startTime: 'Start Time'
    },
    operationFailed: 'Operation failed'
  },
  audit: {
    // Module names
    module: {
      user: 'User Management', // [未使用]
      permission: 'Permission Management', // [未使用]
      config: 'System Configuration', // [未使用]
      device: 'Device Management', // [未使用]
      production: 'Production Management', // [未使用]
      data: 'Data Management', // [未使用]
      plc: 'PLC Operation', // [未使用]
      audit: 'Audit Self', // [未使用]
      license: 'License Management', // [未使用]
      email: 'Email Configuration' // [未使用]
    },
    // User management operations
    user: {
      register: { title: 'User Register' },
      login: { title: 'User Login' },
      loginFailed: { title: 'User Login Failed' },
      logout: { title: 'User Logout' },
      create: { title: 'Create User' },
      update: { title: 'Update User' },
      delete: { title: 'Delete User' },
      batchDelete: { title: 'Batch Delete User' },
      statusChange: { title: 'Change User Status' },
      resetPassword: { title: 'Reset Password' },
      changePassword: { title: 'Change Password' },
      roleChange: { title: 'User Role Change' }
    },
    // Permission management operations
    role: {
      create: { title: 'Create Role' },
      update: { title: 'Update Role' },
      delete: { title: 'Delete Role' }
    },
    permission: {
      change: { title: 'Permission Configuration Change' },
      cacheClear: { title: 'Permission Cache Clear' }
    },
    // System configuration operations
    config: {
      system: { change: { title: 'System Parameter Change' } },
      security: { change: { title: 'Security Configuration Change' } },
      plc: { change: { title: 'PLC Connection Configuration Change' } },
      export: { change: { title: 'Export Configuration Change' } },
      connection: { change: { title: 'Connection Configuration Change' } },
      device: { change: { title: 'Device Configuration Change' } },
      order: { change: { title: 'Order Configuration Change' } }
    },
    // Device management operations
    device: {
      statusChange: { title: 'Device Status Change' },
      paramChange: { title: 'Device Parameter Change' },
      part: {
        create: { title: 'Create Part' },
        update: { title: 'Update Part' },
        replace: { title: 'Replace Part' },
        delete: { title: 'Delete Part' }
      },
      alarm: {
        handle: { title: 'Alarm Handle' }
      }
    },
    // Production management operations
    production: {
      recipe: {
        download: { title: 'Recipe Download' }
      },
      order: {
        create: { title: 'Create Production Order' },
        update: { title: 'Update Production Order' },
        delete: { title: 'Delete Production Order' },
        download: { title: 'Download Production Order' }
      }
    },
    // Data management operations
    data: {
      export: { title: 'Data Export' },
      viewDetail: { title: 'Data View Detail' }
    },
    // PLC operations
    plc: {
      write: { title: 'PLC Parameter Write' },
      read: { title: 'PLC Parameter Read' },
      connect: { title: 'PLC Connect' },
      disconnect: { title: 'PLC Disconnect' },
      reconnect: { title: 'PLC Reconnect' }
    },
    // Audit self operations
    audit: {
      view: { title: 'Audit Log View' },
      verify: { title: 'Audit Hash Chain Verify' },
      export: { title: 'Audit Log Export' }
    },
    // License management operations
    license: {
      import: { title: 'License Import' },
      expire: { title: 'License Expire' }
    },
    // Email configuration operations
    email: {
      configChange: { title: 'Email Configuration Change' },
      logDelete: { title: 'Email Log Delete' }
    }
  },
  heartbeat: {
    statusOnline: 'Online',
    statusOffline: 'Offline',
    statusAuthenticating: 'Authenticating...',
    statusDeviceDisconnected: 'Device Offline',
    statusReconnecting: 'Reconnecting({count})', // [未使用]
    statusManualReconnecting: 'Reconnecting...',
    serverConnected: 'Server: Connected',
    serverDisconnected: 'Server: Disconnected',
    serverAuthenticating: 'Server: Authenticating',
    serverReconnecting: 'Server: Reconnecting (Attempt {count})', // [未使用]
    deviceConnected: 'Device: Connected',
    deviceDisconnected: 'Device: Disconnected',
    tooltipManualReconnecting: 'Manual reconnecting...',
    detailTitle: 'Connection Status Details',
    detailServerLabel: 'Server Status',
    detailDeviceLabel: 'Device Status',
    detailLastHeartbeatLabel: 'Last Heartbeat',
    detailHeartbeatIntervalLabel: 'Heartbeat Interval',
    detailHeartbeatIntervalValue: '{seconds}s', // [未使用]
    detailConnected: 'Connected ✓',
    detailDisconnected: 'Disconnected ✗',
    detailManualReconnecting: 'Attempting manual reconnect, please wait...',
    detailServerConnected: 'Server Status: Connected ✓', // [未使用]
    detailServerDisconnected: 'Server Status: Disconnected ✗', // [未使用]
    detailServerAuthenticating: 'Server Status: Authenticating...', // [未使用]
    detailServerReconnecting: 'Server Status: Reconnecting (Attempt {count})', // [未使用]
    detailDeviceConnected: 'Device Status: Connected ✓', // [未使用]
    detailDeviceDisconnected: 'Device Status: Disconnected ✗', // [未使用]
    detailLastHeartbeat: 'Last Heartbeat: {time}', // [未使用]
    detailHeartbeatInterval: 'Heartbeat Interval: {seconds}s', // [未使用]
    detailReconnectSuccess: '✓ Manual reconnect successful!',
    detailReconnectFailed: '✗ Manual reconnect failed: {error}', // [未使用]
    reconnectFailedUnknown: 'Unknown error',
    confirm: 'OK',
    timeNever: 'Never',
    timeSecondsAgo: '{n}s ago', // [未使用]
    timeMinutesAgo: '{n}m ago', // [未使用]
    timeHoursAgo: '{n}h ago' // [未使用]
  },
  error: {
    PARAM_ERROR: 'Parameter error', // [未使用]
    PARAM_MISSING: 'Missing required parameter', // [未使用]
    PARAM_INVALID: {
      default: 'Invalid parameter format', // [未使用]
      password: {
        string_min: 'Password must be at least {limit} characters', // [未使用]
        string_max: 'Password must be at most {limit} characters', // [未使用]
        string_empty: 'Password is required', // [未使用]
        any_required: 'Password is required' // [未使用]
      },
      username: {
        string_min: 'Username must be at least {limit} characters', // [未使用]
        string_max: 'Username must be at most {limit} characters', // [未使用]
        string_empty: 'Username is required', // [未使用]
        any_required: 'Username is required' // [未使用]
      },
      email: {
        string_email: 'Invalid email format', // [未使用]
        string_empty: 'Email is required', // [未使用]
        any_required: 'Email is required' // [未使用]
      },
      string_min: '{field} must be at least {limit} characters', // [未使用]
      string_max: '{field} must be at most {limit} characters', // [未使用]
      string_empty: '{field} is required', // [未使用]
      any_required: '{field} is required', // [未使用]
      string_base: '{field} must be a string', // [未使用]
      number_base: '{field} must be a number' // [未使用]
    },
    UNAUTHORIZED: 'Please login first', // [未使用]
    TOKEN_EXPIRED: 'Login expired, please login again', // [未使用]
    TOKEN_INVALID: 'Invalid token', // [未使用]
    TOKEN_KICKED_OUT: 'Your account has been logged in on another device, current device has been kicked offline', // [未使用]
    PERMISSION_DENIED: 'Permission denied', // [未使用]
    CAPTCHA_EXPIRED: 'Captcha has expired, please get a new one', // [未使用]
    CAPTCHA_ERROR: 'Incorrect captcha', // [未使用]
    NOT_FOUND: 'Interface not found', // [未使用]
    SYSTEM_ERROR: 'System error', // [未使用]
    DATABASE_ERROR: 'Database operation failed', // [未使用]
    NETWORK_ERROR: 'Network error', // [未使用]
    UNKNOWN_ERROR: 'Unknown error', // [未使用]
    DEPT_NOT_FOUND: 'Department not found', // [未使用]
    DEPT_PARENT_INVALID: 'Parent department cannot be set to itself', // [未使用]
    DEPT_HAS_CHILDREN: 'Has child departments, cannot delete', // [未使用]
    DEPT_HAS_USERS: 'There are users under this department, cannot delete', // [未使用]
    ROLE_NOT_FOUND: 'Role not found', // [未使用]
    ROLE_CODE_EXISTS: 'Role code already exists', // [未使用]
    USER_NOT_FOUND: 'User not found', // [未使用]
    USER_USERNAME_EXISTS: 'Username already exists', // [未使用]
    USER_PASSWORD_ERROR: 'Incorrect password', // [未使用]
    USER_DISABLED: 'Account has been disabled', // [未使用]
    USER_LOCKED: 'Account has been locked', // [未使用]
    USER_REGISTER_FAIL: 'Registration failed', // [未使用]
    DEVICE_LIMIT_EXCEEDED: 'Online device limit reached (max {maxDevices} devices), please contact administrator to kick other devices', // [未使用]
    DICT_TYPE_NOT_FOUND: 'Dictionary type not found', // [未使用]
    DICT_TYPE_CODE_EXISTS: 'Dictionary type code already exists', // [未使用]
    DICT_ITEM_NOT_FOUND: 'Dictionary item not found', // [未使用]
    DICT_ITEM_VALUE_DUPLICATE: 'Values cannot be duplicated under the same dictionary type', // [未使用]
    AUDIT_NOT_MODIFIABLE: 'Audit logs cannot be modified', // [未使用]
    AUDIT_NOT_DELETABLE: 'Audit logs cannot be deleted', // [未使用]
    NOTIFICATION_NOT_FOUND: 'Notification not found', // [未使用]
    CUSTOMER_NOT_FOUND: 'Customer not found', // [未使用]
    MENU_USER_ID_REQUIRED: 'User ID cannot be empty', // [未使用]
    FILE_NOT_EXIST: 'Please select a file to upload', // [未使用]
    FILE_PATH_EMPTY: 'File path cannot be empty', // [未使用]
    FILE_PATH_INVALID: 'Invalid file path', // [未使用]
    FILE_TOO_LARGE: 'File size exceeds limit', // [未使用]
    FILE_TYPE_NOT_ALLOWED: 'Unsupported file type', // [未使用]
    FILE_UPLOAD_FAIL: 'File upload failed', // [未使用]
    FILE_DELETE_FAIL: 'File deletion failed', // [未使用]
    FILE_LIMIT_EXCEEDED: 'Number of uploaded files exceeds limit', // [未使用]
    FILE_UNEXPECTED_FIELD: 'Unexpected file field', // [未使用]
    GITHUB_CONFIG_ERROR: 'GitHub image hosting configuration incomplete', // [未使用]
    GITHUB_UPLOAD_FAIL: 'GitHub upload failed', // [未使用]
    GITHUB_DELETE_FAIL: 'GitHub file deletion failed', // [未使用]
    GITHUB_API_ERROR: 'GitHub API call failed', // [未使用]
    NOTIFICATION_TITLE_CONTENT_REQUIRED: 'Title and content cannot be empty', // [未使用]
    NOTIFICATION_USER_ID_REQUIRED: 'userId cannot be empty (or use broadcast: true to broadcast)', // [未使用]
    EMAIL_CONFIG_NOT_FOUND: 'Email configuration not found', // [未使用]
    EMAIL_CONFIG_NAME_EXISTS: 'Configuration name already exists', // [未使用]
    EMAIL_CONFIG_DEFAULT_CANNOT_DELETE: 'Default configuration cannot be deleted, please set another configuration as default first', // [未使用]
    EMAIL_CONFIG_SYSTEM_CANNOT_DELETE: 'System built-in configuration cannot be deleted', // [未使用]
    EMAIL_CONFIG_DEFAULT_CANNOT_DISABLE: 'Default configuration cannot be disabled, please set another configuration as default first', // [未使用]
    EMAIL_CONFIG_ONLY_ENABLED_CAN_DEFAULT: 'Only enabled configurations can be set as default', // [未使用]
    EMAIL_NAME_REQUIRED: 'Configuration name cannot be empty', // [未使用]
    EMAIL_PROVIDER_REQUIRED: 'Provider cannot be empty', // [未使用]
    EMAIL_HOST_REQUIRED: 'SMTP server address cannot be empty', // [未使用]
    EMAIL_PORT_REQUIRED: 'SMTP port cannot be empty', // [未使用]
    EMAIL_USERNAME_REQUIRED: 'Email account cannot be empty', // [未使用]
    EMAIL_PASSWORD_REQUIRED: 'Email authorization code cannot be empty', // [未使用]
    EMAIL_CONFIG_ID_REQUIRED: 'Configuration ID cannot be empty', // [未使用]
    EMAIL_TO_EMAIL_REQUIRED: 'Test recipient email cannot be empty', // [未使用]
    EMAIL_STATUS_REQUIRED: 'Status cannot be empty', // [未使用]
    EMAIL_FORMAT_INVALID: 'Invalid email format', // [未使用]
    EMAIL_VALIDATION_FAILED: 'Configuration validation failed: {errors}', // [未使用]
    EMAIL_TEST_SEND_FAILED: 'Test email sending failed: {error}', // [未使用]
    PART_CODE_EXISTS: 'Part code {partCode} already exists', // [未使用]
    PART_CODE_SAME_AS_OLD: 'New part code {partCode} is the same as the old code, no need to replace', // [未使用]
    PART_SPEC_NOT_MATCH: 'Spec model {userSpec} does not match template spec model {templateSpec}, must use the spec model defined in the template', // [未使用]
    PART_RATED_LIFE_NOT_MATCH: 'Rated life {userRatedLife} does not match template rated life {templateRatedLife}, must use the rated life defined in the template' // [未使用]
  },
  errorLog: {
    clear: 'Clear',
    empty: 'No error logs',
    pageUrl: 'Page URL',
    stackInfo: 'Stack Info',
    triggerLocation: 'Trigger Location',
    clearConfirm: 'Are you sure you want to clear all error logs?',
    title: 'Error Log'
  },
  order: {
    orderReport: 'Order Production Report',
    reportGeneratedBy: 'Generated By',
    reportGeneratedAt: 'Generated At',
    orderNo: 'Order No.',
    reportBasicInfo: 'Basic Information',
    productName: 'Product Name',
    recipeName: 'Recipe',
    batchNo: 'Batch No.',
    operator: 'Operator',
    status: 'Order Status',
    statusCompleted: 'Completed',
    statusRunning: 'In Production',
    statusPlanned: 'Planned',
    startTime: 'Start Time',
    endTime: 'End Time',
    reportProductionStats: 'Production Statistics',
    targetQty: 'Target Quantity',
    completedQty: 'Completed Quantity',
    qualifiedQty: 'Qualified Quantity',
    unqualifiedQty: 'Unqualified Quantity',
    qualifiedRate: 'Qualified Rate',
    runtime: 'Runtime',
    alarmCount: 'Alarm Count',
    downloadCount: 'Download Count',
    reportAlarmDetail: 'Alarm Details',
    reportOperatorDetail: 'Operator Details'
  },
  theme: {
    sidebarBg: 'Sidebar Background Color',
    sidebarHoverText: 'Sidebar Hover Text Color',
    sidebarHoverBg: 'Sidebar Hover Background Color',
    sidebarIconColor: 'Sidebar Icon Color',
    sidebarActiveBg: 'Sidebar Active Background Color'
  },
  errorPage: {
    back: 'Back',
    backHome: 'Back to Home',
    forbidden: '403 - Forbidden',
    forbiddenDesc: 'Sorry, you do not have permission to access this page',
    notFound: '404 - Page Not Found'
  },
  license: {
    adminOnly: 'Admin only',
    brandDesc: 'Brand Description',
    cancel: 'Cancel',
    confirmImport: 'Confirm Import',
    contact: 'Contact',
    customerName: 'Customer Name',
    detailTitle: 'License Details',
    download: 'Download',
    dragUpload: 'Drag license file here, or click to upload',
    email: 'Email',
    enabled: 'Enabled',
    expireAt: 'Expire At',
    expireTime: 'Expire Time',
    expired: 'Expired',
    features: 'Features',
    fileInfo: 'File Info',
    fileName: 'File Name',
    filePath: 'File Path',
    fileSize: 'File Size',
    importDialogTitle: 'Import License',
    importLicense: 'Import License',
    importNewLicense: 'Import New License',
    importTip: 'Please select a .lic format license file',
    issuedAt: 'Issued At',
    lastModified: 'Last Modified',
    lastVerified: 'Last Verified',
    licenseId: 'License ID',
    licenseStatus: 'License Status',
    licenseType: 'License Type',
    manageTitle: 'License Management',
    matchStatus: 'Match Status',
    matched: 'Matched',
    maxDevices: 'Max Devices',
    maxUsers: 'Max Users',
    noLicenseFile: 'No license file found',
    notInitialized: 'Not Initialized',
    notMatched: 'Not Matched',
    phone: 'Phone',
    project: 'Project',
    projectId: 'Project ID',
    projectName: 'Project Name',
    refresh: 'Refresh',
    serverTime: 'Server Time',
    statusInvalid: 'Status Invalid',
    statusValid: 'Status Valid',
    syncTime: 'Sync Time',
    timeGuard: 'Time Guard',
    timeGuardStatus: 'Time Guard Status',
    timeRemaining: 'Time Remaining',
    unknownReason: 'Unknown Reason',
    unlimited: 'Unlimited'
  },
  systemConfig: {
    device: {
      reminderContent: 'Reminder Content',
      reminderNoData: 'No reminder data',
      reminderRemindLater: 'Remind Later',
      reminderTitle: 'Part Life Reminder',
      reminderViewDetail: 'View Details'
    }
  }
}
