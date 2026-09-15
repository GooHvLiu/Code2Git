/**
 * 超级面板模块 - 项目配置国际化字段
 * 大厂规范：统一嵌套对象结构，按功能区分组
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  'page': {
    'title': '项目配置',
    'desc': '查看和管理项目的各项配置信息',
    'loadFailed': '加载配置失败'
  },
  'actions': {
    'editFile': '编辑文件',
    'goToConfig': '前往配置'
  },
  'empty': {
    'noConfig': '暂无配置'
  },
  'translation': {
    'menu': '翻译配置',
    'goToConfig': '前往翻译设置',
    'tipTitle': '翻译设置提示',
    'tipContent': '翻译功能需要先在参数配置中启用并配置翻译服务'
  },
  'menu': {
    'environment': '环境信息',
    'api': '接口配置',
    'storage': '存储配置',
    'security': '安全配置',
    'database': '数据配置',
    'license': '授权配置',
    'email': '邮箱配置',
    'plc': 'PLC 配置',
    'i18n': '支持语言'
  },
  'editType': {
    'database': '数据库配置',
    'configFile': '配置文件',
    'envFile': '环境变量',
    'code': '代码常量',
    'databaseTip': '存储在数据库中，可在系统设置/超级面板的参数配置页面直接修改，修改后立即生效',
    'configFileTip': '存储在后端的配置文件中（如 src/config/*.js），需要在线编辑文件并重启后端服务后生效',
    'envFileTip': '存储在环境变量文件中（如 .env），需要在线编辑文件并重启后端服务后生效',
    'codeTip': '硬编码在代码中，需要手动修改源代码并重新构建后才能生效'
  },
  'effectType': {
    'immediate': '立即生效',
    'restart': '需重启后端',
    'rebuild': '需重新构建',
    'immediateTip': '修改后立即生效，无需重启服务或重新构建',
    'restartTip': '修改后需要重启后端服务才能生效',
    'rebuildTip': '修改后需要重新构建前端项目才能生效'
  },
  'ownerType': {
    'frontend': '前端',
    'backend': '后端',
    'frontendTip': '该配置项属于前端项目，修改后需要重新构建前端',
    'backendTip': '该配置项属于后端项目，修改后需要重启后端服务'
  },
  'sourceType': {
    'file': '配置文件',
    'database': '数据库配置',
    'runtime': '系统运行时信息（自动获取）',
    'code': '代码常量（硬编码）'
  },
  'tips': {
    'codeConstant': '此配置为代码常量，需要修改代码后重新构建',
    'confirmFailed': '确认失败，请检查配置',
    'needCodeChange': '此配置需要修改代码',
    'noFilePath': '未配置文件路径',
    'notInWhitelist': '此配置不在可编辑白名单中'
  },
  'editor': {
    'title': '配置文件编辑器',
    'backupPath': '备份路径',
    'backupPathLoading': '加载中...',
    'readFailed': '读取文件失败',
    'save': '保存',
    'saved': '已保存',
    'saveSuccess': '保存成功',
    'syntaxCheck': '语法检查',
    'syntaxCheckFailed': '语法检查失败',
    'syntaxInvalid': '语法错误',
    'syntaxValid': '语法正确',
    'unsaved': '有未保存的修改',
    'versionHistory': '版本历史'
  },
  'backup': {
    'title': '备份',
    'operator': '操作人',
    'restore': '恢复',
    'delete': '删除',
    'empty': '暂无备份',
    'loadFailed': '加载备份列表失败',
    'restoreConfirm': '确定要恢复此备份吗？当前配置将被覆盖',
    'restoreSuccess': '备份恢复成功',
    'deleteConfirm': '确定要删除此备份吗？',
    'deleteSuccess': '备份删除成功'
  },
  'saveDialog': {
    'title': '保存配置',
    'remark': '备注',
    'remarkPlaceholder': '请输入保存备注（可选）',
    'confirm': '确认保存',
    'warning': '保存后将覆盖当前配置，请确认'
  },
  'backupPathDialog': {
    'title': '备份路径设置',
    'currentPath': '当前路径',
    'newPath': '新路径',
    'newPathPlaceholder': '请输入新的备份路径',
    'pathRequired': '备份路径不能为空',
    'changeSuccess': '备份路径修改成功',
    'warning': '注意：修改备份路径后，原有备份文件不会自动迁移'
  },
  'items': {
    'api': {
      'apiPrefix': {
        'description': 'API接口统一前缀，前后端需保持一致',
        'label': 'API前缀'
      },
      'corsEnabled': {
        'description': '是否开启CORS跨域支持，生产环境建议配置具体域名',
        'label': '跨域开关'
      },
      'corsOrigin': {
        'description': '允许跨域访问的来源地址，*表示允许所有来源，生产环境建议配置具体域名',
        'label': '跨域来源'
      },
      'maxBodySize': {
        'description': '后端接收的请求体最大大小，防止超大请求攻击',
        'label': '请求体大小限制'
      },
      'maxFileSize': {
        'description': '上传文件的最大大小限制',
        'label': '文件大小限制'
      },
      'rateLimit': {
        'description': '单IP每分钟最大请求数，防止恶意刷接口',
        'label': '请求频率限制'
      },
      'rateLimitWindow': {
        'description': '请求频率限制的时间窗口（秒），在该时间窗口内最多允许rateLimit次请求',
        'label': '限流时间窗口'
      },
      'requestTimeout': {
        'description': '前端请求超时时间，超时后自动取消请求',
        'label': '接口超时时间'
      }
    },
    'database': {
      'connectionLimit': {
        'description': '数据库连接池的最大连接数',
        'label': '连接池大小'
      },
      'database': {
        'description': '使用的MySQL数据库名称',
        'label': '数据库名'
      },
      'host': {
        'description': 'MySQL数据库服务器地址',
        'label': '数据库主机'
      },
      'password': {
        'description': 'MySQL数据库登录密码（已隐藏）',
        'label': '数据库密码'
      },
      'port': {
        'description': 'MySQL数据库端口，默认为3306',
        'label': '数据库端口'
      },
      'queueLimit': {
        'description': '等待连接的最大请求数，0表示不限制',
        'label': '队列限制'
      },
      'user': {
        'description': 'MySQL数据库登录用户名',
        'label': '数据库用户名'
      },
      'waitForConnections': {
        'description': '连接池满时是否等待连接释放，true表示等待，false表示立即报错',
        'label': '等待连接'
      }
    },
    'email': {
      'defaultProvider': {
        'description': '默认使用的邮件服务商配置，如smtp、qq、163等',
        'label': '默认服务商'
      },
      'enabled': {
        'description': '是否启用邮箱发送功能',
        'label': '邮箱系统开关'
      },
      'fromName': {
        'description': '邮件显示的发件人名称',
        'label': '发件人名称'
      },
      'host': {
        'description': 'SMTP邮件服务器地址',
        'label': 'SMTP主机'
      },
      'passwordReset': {
        'maxActiveTokens': {
          'description': '单个用户最多可同时存在的有效密码重置Token数量',
          'label': '最大活跃Token数'
        },
        'tokenExpiresIn': {
          'description': '密码重置链接的有效期',
          'label': '重置Token有效期'
        },
        'tokenLength': {
          'description': '密码重置Token的字符长度',
          'label': '重置Token长度'
        }
      },
      'port': {
        'description': 'SMTP邮件服务器端口',
        'label': 'SMTP端口'
      },
      'secure': {
        'description': '是否使用SSL加密连接邮件服务器',
        'label': 'SSL加密'
      },
      'send': {
        'logEnabled': {
          'description': '是否记录邮件发送的详细日志',
          'label': '发送日志'
        },
        'maxRetries': {
          'description': '邮件发送失败后的最大重试次数',
          'label': '发送最大重试次数'
        },
        'retryDelay': {
          'description': '邮件发送失败后重试的延迟时间（毫秒）',
          'label': '重试延迟'
        },
        'timeout': {
          'description': '邮件发送的超时时间',
          'label': '发送超时时间'
        }
      },
      'username': {
        'description': '用于发送邮件的邮箱账号',
        'label': '邮箱账号'
      }
    },
    'environment': {
      'appHost': {
        'description': '后端服务绑定的主机地址，0.0.0.0表示监听所有网卡',
        'label': '服务主机'
      },
      'appPort': {
        'description': '后端服务监听的端口号',
        'label': '服务端口'
      },
      'arch': {
        'description': '当前操作系统的 CPU 架构，如 x64、arm64 等',
        'label': '系统架构'
      },
      'cwd': {
        'description': '后端服务的当前工作目录，即启动服务时所在的目录',
        'label': '工作目录'
      },
      'hostname': {
        'description': '当前服务器的主机名，用于标识服务器身份',
        'label': '主机名'
      },
      'localIp': {
        'description': '当前服务器的本地 IP 地址，用于局域网内访问',
        'label': '本地IP地址'
      },
      'nodeEnv': {
        'description': 'Node.js运行环境，development为开发模式，production为生产模式',
        'label': '运行环境'
      },
      'nodeVersion': {
        'description': '当前运行的Node.js版本，建议使用LTS版本',
        'label': 'Node.js版本'
      },
      'platform': {
        'description': '当前运行的操作系统平台，如 win32、linux、darwin 等',
        'label': '操作系统'
      },
      'projectRoot': {
        'description': '后端项目的根目录路径，所有相对路径都基于此目录',
        'label': '项目根目录'
      },
      'systemVersion': {
        'description': '系统版本号，发布新版本时更新',
        'label': '系统版本'
      }
    },
    'plc': {
      'activeProtocol': {
        'description': '当前使用的PLC通信协议',
        'label': '通信协议'
      },
      'connection': {
        'host': {
          'description': 'PLC设备的IP地址',
          'label': 'PLC设备IP'
        },
        'port': {
          'description': 'PLC设备的通信端口',
          'label': 'PLC端口'
        },
        'rack': {
          'description': 'S7协议的机架号，一般为0',
          'label': '机架号'
        },
        'slot': {
          'description': 'S7协议的槽位号，一般为1或2',
          'label': '槽位号'
        },
        'unitId': {
          'description': 'Modbus协议的从站单元ID，一般为1',
          'label': '单元ID'
        }
      },
      'enablePoll': {
        'description': '是否启用PLC数据自动轮询',
        'label': '自动轮询'
      },
      'enableWriteAudit': {
        'description': '是否记录PLC写入操作的审计日志',
        'label': '写入审计'
      },
      'maxWriteRetry': {
        'description': 'PLC写入操作失败后的最大重试次数',
        'label': '最大写入重试'
      },
      'multiDeviceEnabled': {
        'description': '是否启用多设备模式，支持同时连接多个PLC设备',
        'label': '多设备模式'
      },
      'poll': {
        'fastInterval': {
          'description': '设备在线时的轮询间隔',
          'label': '快速轮询间隔'
        },
        'reconnectDelay': {
          'description': '设备断开后重新连接的延迟时间（毫秒）',
          'label': '重连延迟'
        },
        'slowInterval': {
          'description': '设备离线时的轮询间隔',
          'label': '慢速轮询间隔'
        }
      },
      'supportedProtocols': {
        'description': '系统支持的PLC通信协议列表',
        'label': '支持的协议'
      },
      'timeouts': {
        'connect': {
          'description': 'PLC连接的超时时间（毫秒）',
          'label': '连接超时'
        },
        'general': {
          'description': 'PLC其他操作的通用超时时间（毫秒）',
          'label': '通用超时'
        },
        'read': {
          'description': 'PLC单次读取的超时时间（毫秒）',
          'label': '读取超时'
        },
        'readBatch': {
          'description': 'PLC批量读取的超时时间（毫秒）',
          'label': '批量读取超时'
        },
        'write': {
          'description': 'PLC写入操作的超时时间（毫秒）',
          'label': '写入超时'
        }
      }
    },
    'security': {
      'jwt': {
        'algorithm': {
          'description': 'JWT签名加密算法，一般使用HS256',
          'label': '加密算法'
        },
        'expiresIn': {
          'description': 'JWT Token的有效期，过期后需要重新登录',
          'label': 'Token有效期'
        }
      },
      'layout': {
        'login': {
          'failedThreshold': {
            'description': '连续登录失败多少次后锁定账户',
            'label': '登录失败阈值'
          },
          'lockDuration': {
            'description': '登录失败锁定账户的时长',
            'label': '账户锁定时长'
          }
        }
      },
      'password': {
        'bcryptSaltRounds': {
          'description': 'bcrypt加密的盐轮数，数值越大越安全但越慢',
          'label': '密码加密强度'
        },
        'minLength': {
          'description': '用户密码的最小长度要求',
          'label': '密码最小长度'
        },
        'requireLowercase': {
          'description': '用户密码是否必须包含小写字母（a-z）',
          'label': '需要小写字母'
        },
        'requireNumber': {
          'description': '用户密码是否必须包含数字（0-9）',
          'label': '需要数字'
        },
        'requireSymbol': {
          'description': '用户密码是否必须包含特殊符号（如!@#$%^&*）',
          'label': '需要特殊符号'
        },
        'requireUppercase': {
          'description': '用户密码是否必须包含大写字母（A-Z）',
          'label': '需要大写字母'
        }
      },
      'session': {
        'timeout': {
          'description': '用户无操作多长时间后自动退出登录',
          'label': '会话超时时间'
        }
      },
      'watermark': {
        'enabled': {
          'description': '是否在页面显示水印，防止截图泄露',
          'label': '页面水印'
        }
      }
    },
    'storage': {
      'backup': {
        'configDir': {
          'description': '配置文件版本历史备份存储目录',
          'label': '配置数据备份目录'
        },
        'dir': {
          'description': '数据库备份文件存储目录',
          'label': '数据库备份目录'
        },
        'i18nDir': {
          'description': '国际化语言文件备份存储目录',
          'label': '国际化备份目录'
        },
        'menuDir': {
          'description': '菜单配置备份文件存储目录',
          'label': '菜单备份目录'
        }
      },
      'github': {
        'branch': {
          'description': 'GitHub仓库分支，一般为main',
          'label': '分支'
        },
        'enabled': {
          'description': '是否启用GitHub图床存储图片',
          'label': 'GitHub图床开关'
        },
        'maxSize': {
          'description': 'GitHub图床上传文件的最大大小限制',
          'label': '最大文件大小'
        },
        'owner': {
          'description': 'GitHub仓库所有者用户名',
          'label': '仓库所有者'
        },
        'pathPrefix': {
          'description': 'GitHub仓库中存储图片的路径前缀，如 images/',
          'label': '路径前缀'
        },
        'repo': {
          'description': 'GitHub图床仓库名称',
          'label': '仓库名'
        }
      },
      'logs': {
        'dir': {
          'description': '系统日志文件存储目录',
          'label': '日志目录'
        }
      },
      'superPanel': {
        'license': {
          'dir': {
            'description': '授权文件和密钥存储目录',
            'label': '授权文件目录'
          },
          'licensePath': {
            'description': '授权许可证文件的存储路径',
            'label': '授权文件路径'
          },
          'publicKeyPath': {
            'description': '用于验证授权签名的公钥文件路径',
            'label': '公钥文件路径'
          },
          'timeGuardPath': {
            'description': '时间保护文件的存储路径，用于记录最后验证时间，防止回拨系统时间',
            'label': '时间保护文件路径'
          }
        }
      },
      'upload': {
        'allowedTypes': {
          'description': '允许上传的文件扩展名列表',
          'label': '允许的文件类型'
        },
        'dir': {
          'description': '本地上传文件的存储目录',
          'label': '上传目录'
        },
        'maxSize': {
          'description': '本地上传文件的最大大小',
          'label': '最大文件大小'
        },
        'staticPrefix': {
          'description': '本地上传文件的静态访问URL前缀，用于通过HTTP访问上传的文件',
          'label': '静态资源前缀'
        }
      }
    },
    'superPanel': {
      'license': {
        'allowedExtname': {
          'description': '允许上传的授权文件扩展名列表',
          'label': '允许的扩展名'
        },
        'licensePath': {
          'description': '授权许可证文件的存储路径',
          'label': '授权文件路径'
        },
        'licenseServerUrl': {
          'description': '用于时间校准的服务器地址，防止本地时间篡改',
          'label': '时间校准服务器'
        },
        'maxFileSize': {
          'description': '授权文件上传的最大大小限制',
          'label': '最大文件大小'
        },
        'projectId': {
          'description': '授权系统的项目唯一标识',
          'label': '项目ID'
        },
        'publicKeyPath': {
          'description': '用于验证授权签名的公钥文件路径',
          'label': '公钥文件路径'
        },
        'strictMode': {
          'description': '严格模式下授权验证失败会拒绝服务，非严格模式只警告',
          'label': '严格模式'
        },
        'timeGuardPath': {
          'description': '时间保护文件的存储路径，用于记录最后验证时间，防止回拨系统时间',
          'label': '时间保护文件路径'
        }
      }
    }
  }
}
