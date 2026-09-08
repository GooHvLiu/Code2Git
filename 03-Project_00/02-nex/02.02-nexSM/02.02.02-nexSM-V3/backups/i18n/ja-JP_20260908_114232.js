/**
 * ja-JP 国际化配置文件
 * 由国际化管理模块自动生成
 * 请勿手动修改此文件，除非您了解其结构
 * 
 * 最后更新时间: 2026-09-08T03:26:44.180Z
 */

export default {
  roles: {
    Super_Admin: {
      name: 'スーパーマネージャー。',
      desc: 'システムパラメータの設定と変更のためのシステム全体の権限'
    },
    Administrator: {
      name: 'システム管理者',
      desc: '次元の変更を使用するシステムの完全なアクセス権を持つ。'
    },
    Engineer: {
      name: 'エンジニア（エンジニア）',
      desc: '機器パラメータを管理できる機器エンジニア'
    },
    Operator: {
      name: 'オペレーターオペレーター',
      desc: '通常のオペレータ、表示および操作のみ'
    }
  },
  dict: {
    types: {
      user_status: 'ユーザーの状態',
      user_sex: '性別は',
      user_role: 'ユーザーの役割',
      audit_action: '監査操作の種類',
      audit_result: '監査操作の結果',
      notification_type: '通知の種類',
      notification_priority: '通知の優先順位'
    },
    items: {
      user_sex: {
        '0': '男は',
        '1': '女性のために',
        '2': '不明。'
      },
      user_status: {
        '0': '禁止する。',
        '1': '普通に。'
      },
      user_role: {
        super_admin: 'スーパーマネージャー。',
        administrator: '管理者のこと',
        engineer: 'エンジニア（エンジニア）',
        operator: 'オペレーターオペレーター'
      },
      environment: {
        nodeEnv: {
          label: '実行環境',
          description: 'Node.jsの実行環境、開発モードは開発モード、プロダクションモードはプロダクションモード'
        },
        appPort: {
          label: 'サービスポート',
          description: 'バックエンド·サービスがリスニングするポート番号'
        },
        appHost: {
          label: 'サービスホスト',
          description: 'バックエンド·サービス·バインディングのホスト·アドレス。0.0.0.0はすべてのネットワーク·カードをリッスンする。'
        },
        systemVersion: {
          label: 'システムのバージョン',
          description: 'システム·バージョン番号、新しいバージョンがリリースされたときに更新'
        },
        nodeVersion: {
          label: 'Node.jsのバージョン',
          description: '現在実行中のnode.jsのバージョン、ltsバージョンを推奨'
        },
        platform: {
          label: 'オペレーティングシステム',
          description: 'Win 32、linux、darwinなど、現在実行中のオペレーティングシステムプラットフォーム。'
        },
        arch: {
          label: 'システムアーキテクチャ',
          description: '現在のオペレーティングシステムのcpuアーキテクチャ（x 64、arm64など）'
        },
        hostname: {
          label: 'ホスト名>',
          description: '現在のサーバーのホスト名。サーバーのアイデンティティを識別します。'
        },
        localIp: {
          label: 'ローカルipアドレス',
          description: 'Lan内アクセス用の現在のサーバのローカルipアドレス'
        },
        cwd: {
          label: '作業ディレクトリ',
          description: 'バックエンド·サービスの現在の作業ディレクトリ、つまりサービスが開始されたときのディレクトリ'
        },
        projectRoot: {
          label: 'プロジェクトのルート',
          description: 'バックエンドプロジェクトのルートパス。すべての相対パスはこのディレクトリに基づく'
        }
      },
      api: {
        apiPrefix: {
          label: 'Api接頭辞',
          description: 'Apiインターフェイスの統一プレフィックス、前面と背面の一貫性が必要'
        },
        corsEnabled: {
          label: 'クロスドメインスイッチ',
          description: 'Corsクロスドメインサポートを有効にするかどうか、本番環境では特定のドメイン名を推奨'
        },
        rateLimit: {
          label: 'リクエスト頻度の制限',
          description: '単一ipの最大リクエスト数/分、不正なインターフェイスのブラシを防ぐ'
        },
        requestTimeout: {
          label: 'インタフェースのタイムアウト時間',
          description: 'フロントエンド要求がタイムアウトし、タイムアウトすると自動的に要求がキャンセルされる'
        },
        maxBodySize: {
          label: 'リクエストボディサイズの制限',
          description: 'バックエンドが受信するリクエストボディの最大サイズにより、大規模なリクエスト攻撃を防ぐ'
        },
        maxFileSize: {
          label: 'ファイルサイズの制限',
          description: 'アップロードされるファイルの最大サイズ制限'
        },
        corsOrigin: {
          label: 'クロスドメインソース',
          description: 'クロスドメイン·アクセスを許可するソース·アドレス。* はすべてのソースを許可することを意味し、本番環境では特定のドメイン名の設定を推奨'
        },
        rateLimitWindow: {
          label: '制限時間ウィンドウ',
          description: '最大rate Limitリクエストを許可するリクエスト頻度制限の時間ウィンドウ（秒）。'
        }
      },
      storage: {
        upload: {
          dir: {
            label: 'カタログのアップロード',
            description: 'ローカルにアップロードされたファイルの保存ディレクトリ'
          },
          maxSize: {
            label: 'ファイルの最大サイズ',
            description: 'ローカルにアップロードされるファイルの最大サイズ'
          },
          allowedTypes: {
            label: '許可されるファイルの種類',
            description: 'アップロードが許可されるファイル拡張子の一覧'
          },
          staticPrefix: {
            label: '静的リソースプレフィックス',
            description: 'Http経由でアップロードされたファイルにアクセスするために、ローカルにアップロードされたファイルの静的アクセスurlプレフィックス'
          }
        },
        github: {
          enabled: {
            label: 'Githubトゥベッドスイッチ',
            description: 'Git Hubの画像保存を有効にする'
          },
          owner: {
            label: '倉庫のオーナー。',
            description: 'Git Hubリポジトリ所有者のユーザー名'
          },
          repo: {
            label: '倉庫の名前',
            description: 'Git Hubのリポジトリ名'
          },
          branch: {
            label: '分岐する枝',
            description: 'Git Hubリポジトリ、通常はメイン。'
          },
          pathPrefix: {
            label: 'パスのプレフィックス',
            description: 'Git Hubリポジトリに画像を格納するパスプレフィックス（images/など）'
          },
          maxSize: {
            label: 'ファイルの最大サイズ',
            description: 'Git Hubのグラフベッドでのファイルの最大サイズ制限'
          }
        },
        backup: {
          dir: {
            label: 'データベースバックアップカタログ',
            description: 'データベース·バックアップ·ファイル格納ディレクトリ{{でーたべ ーすばっくあっぷふぁいるとおくろぐ}}'
          }
        },
        logs: {
          dir: {
            label: 'ログディレクトリ',
            description: 'システム·ログ·ファイル格納ディレクトリ'
          }
        },
        license: {
          dir: {
            label: '認可ファイルディレクトリ',
            description: 'ファイルおよびキーストアディレクトリ'
          },
          licensePath: {
            label: '承認ファイルのパス',
            description: 'ライセンスファイルの保存パス'
          },
          publicKeyPath: {
            label: '公開鍵ファイルのパス',
            description: '署名の'
          },
          timeGuardPath: {
            label: '时间保护文件路径',
            description: 'システム時刻のコールバックを防止するために、最後の検証時刻を記録する時間保護ファイルの保存パス'
          }
        }
      },
      security: {
        jwt: {
          expiresIn: {
            label: 'トークンの有効期限',
            description: 'Jwtトークンの有効期間、有効期限が切れると再ログインが必要'
          },
          algorithm: {
            label: '暗号化アルゴリズム',
            description: 'Hs256を使用するjwt署名暗号化アルゴリズム'
          }
        },
        session: {
          timeout: {
            label: 'セッション·タイムアウト',
            description: 'ユーザーが無操作の後に自動的にログインを終了するまでの期間'
          }
        },
        login: {
          failedThreshold: {
            label: 'ログイン失敗のしきい値',
            description: 'ログイン失敗後のアカウントロックの回数'
          },
          lockDuration: {
            label: 'アカウントロックの長さ',
            description: 'ログイン失敗後のアカウントロック'
          }
        },
        password: {
          minLength: {
            label: 'パスワードの最小長',
            description: 'ユーザーパスワードの最小長要件'
          },
          requireUppercase: {
            label: '大文字が必要',
            description: 'ユーザーパスワードに大文字a ~ Zを使用する必要があるかどうか'
          },
          requireLowercase: {
            label: '小文字が必要',
            description: 'ユーザーパスワードに小文字a ~ Zを使用するかどうか'
          },
          requireNumber: {
            label: '数字が必要です',
            description: 'ユーザーパスワードに数字（0 9）を含める必要があるかどうか'
          },
          requireSymbol: {
            label: '特殊記号が必要',
            description: 'ユーザーパスワードに特殊なを含める必要があるかどうか!@#$%^&* など'
          },
          bcryptSaltRounds: {
            label: 'パスワード暗号化強度',
            description: 'Bcrypt暗号化されたソルトラウンド数、大きいほど安全だが遅い'
          }
        },
        watermark: {
          enabled: {
            label: 'ページウォーターマーク',
            description: 'スクリーンショットの漏洩を防ぐためにページに透かしを表示するかどうか'
          }
        }
      },
      database: {
        host: {
          label: 'データベースホスト',
          description: 'My Sqlデータベースサーバーアドレス'
        },
        port: {
          label: 'データベース·ポート',
          description: 'My Sqlデータベースポート、デフォルトは3306'
        },
        user: {
          label: 'データベース·ユーザー名',
          description: 'My Sqlデータベースログインユーザー名'
        },
        password: {
          label: 'データベースのパスワード',
          description: 'My Sqlデータベースのログインパスワード非表示'
        },
        database: {
          label: 'データベース名。',
          description: '使用されているmy Sqlデータベース名'
        },
        connectionLimit: {
          label: '接続プールのサイズ',
          description: 'データベース接続プールの最大接続数'
        },
        waitForConnections: {
          label: '接続待ちです。',
          description: '接続プールがいっぱいになったときに接続の解放を待つかどうか。trueは待機、falseは直ちにエラーを報告する'
        },
        queueLimit: {
          label: 'キューの制限事項',
          description: '接続を待機するリクエストの最大数。0は無制限を意味します。'
        }
      },
      license: {
        projectId: {
          label: 'プロジェクトid',
          description: '承認システムのアイテム固有id'
        },
        strictMode: {
          label: 'Strictモード',
          description: 'Strictモードでは認証が失敗するとサービス拒否、非strictモードでは警告のみ'
        },
        licensePath: {
          label: '承認ファイルのパス',
          description: 'ライセンスファイルの保存パス'
        },
        publicKeyPath: {
          label: '公開鍵ファイルのパス',
          description: '署名の'
        },
        licenseServerUrl: {
          label: '時刻調整サーバー',
          description: '時刻較正用のサーバアドレスで、ローカル時刻の改ざんを防止'
        },
        timeGuardPath: {
          label: '时间保护文件路径',
          description: 'システム時刻のコールバックを防止するために、最後の検証時刻を記録する時間保護ファイルの保存パス'
        },
        maxFileSize: {
          label: '最大文件大小',
          description: '授权文件上传的最大大小限制'
        },
        allowedExtname: {
          label: '允许的扩展名',
          description: '允许上传的授权文件扩展名列表'
        }
      },
      email: {
        enabled: {
          label: '邮箱系统开关',
          description: '是否启用邮箱发送功能'
        },
        defaultProvider: {
          label: '默认服务商',
          description: '默认使用的邮件服务商配置，如smtp、qq、163等'
        },
        host: {
          label: 'SMTP主机',
          description: 'SMTP邮件服务器地址'
        },
        port: {
          label: 'SMTP端口',
          description: 'SMTP邮件服务器端口'
        },
        secure: {
          label: 'SSL加密',
          description: '是否使用SSL加密连接邮件服务器'
        },
        username: {
          label: '邮箱账号',
          description: '用于发送邮件的邮箱账号'
        },
        fromName: {
          label: '发件人名称',
          description: '邮件显示的发件人名称'
        },
        send: {
          maxRetries: {
            label: '发送最大重试次数',
            description: '邮件发送失败后的最大重试次数'
          },
          retryDelay: {
            label: '重试延迟',
            description: '邮件发送失败后重试的延迟时间（毫秒）'
          },
          timeout: {
            label: '发送超时时间',
            description: '邮件发送的超时时间'
          },
          logEnabled: {
            label: '发送日志',
            description: '是否记录邮件发送的详细日志'
          }
        },
        passwordReset: {
          tokenExpiresIn: {
            label: '重置Token有效期',
            description: '密码重置链接的有效期'
          },
          tokenLength: {
            label: '重置Token长度',
            description: '密码重置Token的字符长度'
          },
          maxActiveTokens: {
            label: '最大活跃Token数',
            description: '单个用户最多可同时存在的有效密码重置Token数量'
          }
        }
      },
      plc: {
        activeProtocol: {
          label: '通信协议',
          description: '当前使用的PLC通信协议'
        },
        supportedProtocols: {
          label: '支持的协议',
          description: '系统支持的PLC通信协议列表'
        },
        connection: {
          host: {
            label: 'PLC设备IP',
            description: 'PLC设备的IP地址'
          },
          port: {
            label: 'PLC端口',
            description: 'PLC设备的通信端口'
          },
          unitId: {
            label: '单元ID',
            description: 'Modbus协议的从站单元ID，一般为1'
          },
          rack: {
            label: '机架号',
            description: 'S7协议的机架号，一般为0'
          },
          slot: {
            label: '槽位号',
            description: 'S7协议的槽位号，一般为1或2'
          }
        },
        poll: {
          fastInterval: {
            label: '快速轮询间隔',
            description: '设备在线时的轮询间隔'
          },
          slowInterval: {
            label: '慢速轮询间隔',
            description: '设备离线时的轮询间隔'
          },
          reconnectDelay: {
            label: '重连延迟',
            description: '设备断开后重新连接的延迟时间（毫秒）'
          }
        },
        enablePoll: {
          label: '自动轮询',
          description: '是否启用PLC数据自动轮询'
        },
        enableWriteAudit: {
          label: '写入审计',
          description: '是否记录PLC写入操作的审计日志'
        },
        maxWriteRetry: {
          label: '最大写入重试',
          description: 'PLC写入操作失败后的最大重试次数'
        },
        timeouts: {
          connect: {
            label: '连接超时',
            description: 'PLC连接的超时时间（毫秒）'
          },
          read: {
            label: '读取超时',
            description: 'PLC单次读取的超时时间（毫秒）'
          },
          readBatch: {
            label: '批量读取超时',
            description: 'PLC批量读取的超时时间（毫秒）'
          },
          write: {
            label: '写入超时',
            description: 'PLC写入操作的超时时间（毫秒）'
          },
          general: {
            label: '通用超时',
            description: 'PLC其他操作的通用超时时间（毫秒）'
          }
        },
        multiDeviceEnabled: {
          label: '多设备模式',
          description: '是否启用多设备模式，支持同时连接多个PLC设备'
        }
      }
    }
  },
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
    newCode: '新物料编码',
    replaceReason: '更换原因',
    confirmReplace: '确认更换',
    replacePart: '更换部件',
    currentCode: '当前编码',
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
    featureComingSoon: '功能开发中',
    noDataToExport: '没有可导出的数据',
    operator: '操作人',
    reason: '操作原因',
    reasonPlaceholder: '请输入操作原因（GMP要求）',
    reasonRequired: '请填写操作原因',
    reasonMinLength: '操作原因至少2个字符',
    password: '密码',
    passwordRequired: '请输入密码',
    sessionTimeout: '会话超时，请重新登录',
    download: '下载',
    print: '打印',
    viewDetail: '查看详情',
    statusChange: '状态切换',
    refreshCache: '刷新缓存',
    detail: '详情',
    close: '关闭',
    exportLabels: {
      exporter: '导出人',
      time: '导出时间',
      countPrefix: '共',
      countSuffix: '条记录'
    },
    createSuccess: '创建成功',
    deleteSuccess: '删除成功',
    operationFailed: '操作失败',
    updateSuccess: '更新成功',
    refreshSuccess: '刷新成功',
    enabled: '已启用',
    disabled: '已禁用'
  },
  menu: {
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
        search: '搜索',
        reset: '重置',
        export: '导出',
        refresh: '刷新',
        detail: '详情',
        exportSingle: '单个导出',
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
      default: '设备管理',
      state: {
        default: '设备状态',
        control: '设备控制'
      },
      alarm: {
        default: '报警统计',
        dashboard: {
          title: '统计看板'
        },
        list: {
          title: '详细记录'
        },
        search: '搜索',
        reset: '重置',
        export: '导出',
        refresh: '刷新',
        detail: '详情',
        handle: '处理'
      },
      part: {
        default: '部件寿命',
        search: '搜索',
        add: '新增',
        refresh: '刷新',
        edit: '编辑',
        operate: '更换',
        delete: '删除',
        tab: {
          life: '寿命详情',
          template: '模板管理'
        },
        template: {
          add: '新增模板',
          edit: '编辑',
          delete: '删除',
          search: '搜索模板',
          refresh: '刷新',
          searchPlaceholder: '搜索模板名称/编码',
          fillNeedle: '灌装针组件',
          fillTube: '灌装管组件',
          stopper: '加塞杆部件',
          vacuum: '真空组件',
          column: {
            templateName: '模板名称',
            templateKey: '模板编码',
            codePrefix: '编码前缀',
            defaultSpec: '默认规格型号',
            defaultRatedLife: '默认额定寿命',
            statMethod: '统计方式',
            statTag: '统计标签',
            icon: '图标',
            status: '状态',
            sort: '排序',
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
            icon: '图标',
            enabled: '状态',
            sort: '排序'
          },
          tips: {
            templateName: '选择基础部件模板，将自动填充默认规格和额定寿命',
            defaultSpec: '该模板部件的默认规格型号，新增部件时会自动填充',
            defaultRatedLife: '该模板部件的默认额定寿命（次数），新增部件时会自动填充'
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
          deleteBtn: '删除',
          replaceBtn: '更换录入',
          refreshBtn: '刷新',
          searchPlaceholder: '搜索部件名称/编码',
          template: {
            fillNeedle: '灌装针组件',
            fillTube: '灌装管组件',
            stopperRod: '加塞杆部件',
            vacuumUnit: '真空组件'
          },
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
            statusSuccess: '成功',
            statusFailed: '失败',
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
          tips: {
            template: '选择部件模板后，将自动填充部件名称、规格型号和额定寿命',
            partName: '部件名称由模板自动填充，不可手动修改',
            partCode: '部件的唯一物料编码，用于库存管理和追溯',
            specModel: '规格型号由模板自动填充，不可手动修改',
            ratedLife: '额定寿命由模板自动填充，表示部件的设计使用次数',
            installDate: '部件实际安装到设备上的日期，用于计算已使用次数',
            remark: '可选填写，用于记录额外信息'
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
        completed: {
          title: '完成订单'
        },
        running: {
          title: '进行中订单'
        },
        planned: {
          title: '计划订单'
        },
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
          add: '新增订单',
          edit: '编辑订单',
          delete: '删除',
          orderNoPlaceholder: '请输入订单编号',
          productNamePlaceholder: '请输入产品名称',
          recipeNamePlaceholder: '请选择配方',
          batchNoPlaceholder: '请输入批次号',
          startTimePlaceholder: '请选择开始时间',
          estimatedEndPlaceholder: '请选择预计完成时间',
          tips: {
            orderNo: '订单的唯一编号，用于标识和追溯生产订单',
            productName: '本次生产的产品名称',
            recipeName: '选择生产配方，配方决定生产工艺参数',
            batchNo: '生产批次号，用于质量追溯',
            targetQty: '本次生产的目标数量',
            startTime: '计划开始生产的时间',
            estimatedEnd: '预计完成生产的时间'
          },
          addSuccess: '订单新增成功',
          editSuccess: '订单编辑成功',
          deleteSuccess: '订单删除成功',
          deleteConfirm: '确定要删除订单「{orderNo}」吗？此操作不可恢复。',
          formRequired: '请填写完整的订单信息'
        }
      }
    },
    system: {
      default: '系统设置',
      user: {
        default: '用户管理',
        page: {
          title: '用户管理',
          pageDesc: '管理系统用户账户，支持角色分配、状态管理和密码重置',
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
          unlock: '解锁',
          unlockConfirm: '确定要解锁该用户吗？',
          unlockSuccess: '用户解锁成功',
          import: '导入',
          export: '导出',
          passwordMismatch: '两次输入的密码不一致',
          resetPasswordSuccess: '密码重置成功'
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
          ip: 'IP地址',
          createdAt: '创建时间',
          detail: '详情',
          detailTitle: '审计日志详情',
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
            title: '系统配置',
            sessionTimeout: '会话超时时间',
            minutes: '分钟',
            defaultPageSize: '默认分页大小',
            defaultLanguage: '默认语言',
            dateFormat: '日期格式',
            sessionTimeoutTip: '用户登录后，多长时间无操作会自动退出登录',
            defaultPageSizeTip: '列表页面默认每页显示多少条数据',
            defaultLanguageTip: '系统默认显示的语言（中文/英文）',
            dateFormatTip: '系统中日期的显示格式（如 YYYY-MM-DD）'
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
            watermarkEnabledTip: '是否在页面上显示水印（防止截图泄露）'
          },
          export: {
            title: '导出设置',
            format: '导出格式',
            filename: '文件名前缀',
            pdfWatermarkEnabled: 'PDF 启用水印',
            pdfWatermarkEnabledTip: '导出PDF时，是否在PDF中添加水印',
            pdfWatermarkText: 'PDF 水印文字',
            pdfWatermarkPlaceholder: '请输入 PDF 水印文字',
            pdfWatermarkTextTip: 'PDF中显示的水印文字（为空时使用当前用户名）'
          },
          device: {
            title: '设备设置',
            maxOnlineDevices: '最大在线设备数',
            deviceName: '设备名称',
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
            partLifeSnoozeIntervalTip: '用户点击"稍后提醒"后，多长时间后再次提醒'
          },
          order: {
            title: '订单设置',
            autoComplete: '自动完成',
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
            exportBtn: '导出',
            deleteBtn: '删除',
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
            batchDeleteConfirm: '确定要删除选中的 {count} 条日志吗？',
            batchDeleteSuccess: '批量删除成功'
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
              project: '项目名称',
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
          deviceNameTip: '设备显示名称',
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
    },
    superPanel: {
      default: '超级面板',
      dict: {
        default: '字典管理',
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
          editType: '编辑字典类型',
          tips: {
            typeName: '字典类型的显示名称，用于在页面中展示',
            typeCode: '字典类型的唯一编码，用于代码中引用，创建后不可修改',
            description: '字典类型的详细描述，说明该字典的用途',
            status: '字典类型的启用状态，禁用后该字典下的所有字典项将不可用',
            sort: '字典类型的显示排序，数值越小越靠前',
            itemLabel: '字典项的显示标签，用于在页面中展示',
            itemValue: '字典项的实际值，用于代码中存储和比较',
            itemStatus: '字典项的启用状态，禁用后该字典项将不可用',
            itemSort: '字典项的显示排序，数值越小越靠前',
            itemRemark: '字典项的备注信息，可选填写'
          }
        }
      },
      dept: {
        default: '部门管理',
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
          editDept: '编辑部门',
          tips: {
            parentDept: '选择该部门的上级部门，顶级部门可留空',
            deptName: '部门的显示名称，用于在页面中展示',
            orderNum: '部门的显示排序，数值越小越靠前',
            leader: '部门的负责人姓名',
            phone: '部门的联系电话',
            email: '部门的联系邮箱',
            status: '部门的启用状态，禁用后该部门将不可用'
          }
        }
      },
      role: {
        default: '角色管理',
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
          basicRoleCannotDelete: '系统内置角色不允许删除',
          tips: {
            roleName: '角色的显示名称，用于在页面中展示',
            roleCode: '角色的唯一编码，用于代码中引用，创建后不可修改',
            status: '角色的启用状态，禁用后该角色将不可用',
            description: '角色的详细描述，说明该角色的权限和用途'
          }
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
          loading: '配置加载中，请稍候...',
          loadError: '配置加载失败',
          loadErrorDesc: '请检查网络连接或联系管理员',
          reload: '重新加载',
          incomplete: '配置不完整',
          incompleteDesc: '检测到 {count} 个未初始化的配置项，当前页面禁止编辑和保存。',
          missingKeys: '缺失的配置项：',
          incompleteTip: '请联系管理员执行配置初始化 SQL，或点击下方按钮重新加载。',
          plc: {
            title: 'PLC 通讯',
            protocol: '通讯协议',
            protocolTip: '与PLC通讯的协议类型',
            host: 'PLC 地址',
            hostTip: 'PLC设备的IP地址',
            port: '端口',
            portTip: 'PLC通讯端口，Modbus默认502',
            unitId: '单元 ID',
            unitIdTip: 'PLC站号/单元ID，通常为1',
            timeout: '超时时间',
            retryCount: '重试次数',
            pollSettings: '轮询设置',
            pollFast: '快速轮询间隔',
            pollFastTip: '高频数据采集间隔',
            pollSlow: '慢速轮询间隔',
            pollSlowTip: '低频数据采集间隔',
            plcProtocolTip: 'PLC通信使用的协议（如 ModbusTcp）',
            plcHostTip: 'PLC设备的IP地址',
            plcPortTip: 'PLC设备的端口号',
            plcUnitIdTip: 'Modbus通信的单元ID/从站地址',
            pollFastIntervalTip: '快速轮询模式下，读取PLC数据的间隔时间',
            pollSlowIntervalTip: '慢速轮询模式下，读取PLC数据的间隔时间',
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
            sendTimeout: '发送超时',
            sendTimeoutTip: '邮件发送的超时时间（毫秒）',
            maxRetries: '最大重试次数',
            maxRetriesTip: '邮件发送失败后的最大重试次数',
            retryDelay: '重试间隔',
            retryDelayTip: '邮件发送失败后，等待多长时间后重试（毫秒）'
          },
          language: {
            title: '支持语言',
            desc: '管理系统预设语言列表，配置系统支持哪些语言。修改后需重启后端服务生效。',
            tipTitle: '注意事项',
            tipContent: '修改预设语言配置后，需要重启后端服务才能生效。请确保配置文件格式正确，否则可能导致系统异常。',
            tipExtra: '提示：国旗图标存放在前端 src/assets/icons/svg/flags/ 目录下，添加新语言时请同时添加对应的国旗SVG文件。',
            loadFailed: '加载语言配置失败',
            saveSuccess: '保存成功',
            saveFailed: '保存失败',
            emptyWarning: '配置内容不能为空',
            resetInfo: '已重置为原始内容',
            currentSupportedLangs: '当前支持的语言',
            viewLanguages: '查看语言',
            totalLangs: '共 {count} 种语言',
            totalLangsUnit: '种语言'
          },
          translation: {
            title: '翻译配置',
            enabled: '已启用',
            disabled: '未启用',
            basicSettings: '基本设置',
            enableTranslation: '启用自动翻译',
            enableTranslationTip: '开启后，可在国际化管理页面使用自动翻译功能，将中文内容快速翻译为其他语言',
            provider: '翻译服务商',
            providerTip: '选择使用哪家翻译服务提供商，目前支持腾讯云翻译',
            masterLanguage: '母版语言',
            masterLanguageTip: '批量翻译时的源语言，所有翻译都基于此语言进行。默认中文，可根据需要修改为其他已存在的语言包',
            tencentSettings: '腾讯云翻译配置',
            secretId: 'SecretId',
            secretIdTip: '腾讯云 API 密钥 ID，在腾讯云控制台-访问管理-API 密钥管理中获取',
            secretIdPlaceholder: '请输入腾讯云 SecretId',
            secretKey: 'SecretKey',
            secretKeyTip: '腾讯云 API 密钥 Key，与 SecretId 配对使用，请注意保密',
            secretKeyPlaceholder: '请输入腾讯云 SecretKey',
            region: '区域',
            regionTip: '腾讯云服务所在地域，建议选择距离服务器最近的区域以降低延迟',
            projectId: '项目 ID',
            projectIdTip: '腾讯云翻译项目 ID，默认 0 表示使用默认项目',
            testConfig: '测试配置',
            testSuccess: '配置有效，翻译测试成功',
            testFailed: '测试失败',
            existingLangs: '已存在的语言',
            tipTitle: '使用说明',
            tipContent: '配置完成后，可在国际化管理页面使用自动翻译功能，快速将中文内容翻译为其他语言。翻译服务需要在腾讯云控制台开通并获取 API 密钥。'
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
          }
        }
      },
      permission: {
        default: '权限配置',
        page: {
          title: '权限配置',
          desc: '超级管理员权限配置管理',
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
          saveSuccess: '权限保存成功'
        }
      },
      feature: {
        default: '功能配置',
        page: {
          title: '项目功能配置',
          pageDesc: '管理系统各功能模块的开关配置，仅超级管理员可访问',
          categoryList: '功能分类',
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
          notification: '通知中心',
          email: '邮箱系统',
          audit: '审计模块',
          auth: '认证功能',
          system: '系统功能'
        },
        notification: {
          system: {
            backupSuccess: '数据备份成功通知',
            backupSuccessDesc: '数据备份成功后发送通知',
            backupFailed: '数据备份失败通知',
            backupFailedDesc: '数据备份失败后发送通知',
            expiring: '授权即将到期通知',
            expiringDesc: '授权即将到期时发送提醒通知',
            expired: '授权已过期通知',
            expiredDesc: '授权过期后发送通知'
          },
          user: {
            register: '新用户注册通知',
            registerDesc: '新用户注册成功后通知管理员',
            create: '管理员创建用户通知',
            createDesc: '管理员创建用户后通知相关人员',
            update: '用户信息变更通知',
            updateDesc: '用户信息变更后通知管理员',
            statusChange: '用户状态变更通知',
            statusChangeDesc: '用户启用/禁用状态变更后通知',
            passwordReset: '用户密码重置通知',
            passwordResetDesc: '用户密码被重置后通知管理员',
            loginFailed: '用户登录失败通知',
            loginFailedDesc: '用户多次登录失败后通知管理员',
            roleChange: '用户角色/权限变更通知',
            roleChangeDesc: '用户角色或权限变更后通知'
          },
          device: {
            paramChange: '设备参数变更通知',
            paramChangeDesc: '设备参数变更后通知相关人员',
            maintenanceReminder: '设备维护提醒通知',
            maintenanceReminderDesc: '设备需要维护时发送提醒',
            partLifeWarning: '配件寿命预警通知',
            partLifeWarningDesc: '配件寿命达到阈值时发送预警'
          },
          production: {
            orderCreate: '生产订单创建通知',
            orderCreateDesc: '生产订单创建后通知相关人员',
            orderUpdate: '生产订单变更通知',
            orderUpdateDesc: '生产订单变更后通知相关人员',
            orderComplete: '生产订单完成通知',
            orderCompleteDesc: '生产订单完成后通知相关人员',
            batchComplete: '批次完成通知',
            batchCompleteDesc: '生产批次完成后通知相关人员'
          },
          config: {
            systemUpdate: '系统配置变更通知',
            systemUpdateDesc: '系统配置变更后通知管理员',
            plcConnectionUpdate: 'PLC连接配置变更通知',
            plcConnectionUpdateDesc: 'PLC连接配置变更后通知',
            connectionUpdate: '连接配置变更通知',
            connectionUpdateDesc: '连接配置变更后通知相关人员',
            deviceParamsUpdate: '设备参数配置变更通知',
            deviceParamsUpdateDesc: '设备参数配置变更后通知',
            exportUpdate: '导出配置变更通知',
            exportUpdateDesc: '导出配置变更后通知管理员',
            securityUpdate: '安全配置变更通知',
            securityUpdateDesc: '安全配置变更后通知管理员'
          },
          security: {
            logExport: '审计日志导出通知',
            logExportDesc: '审计日志被导出时通知管理员',
            logView: '审计日志查看通知',
            logViewDesc: '审计日志被查看时通知管理员',
            permissionChange: '权限配置变更通知',
            permissionChangeDesc: '权限配置变更后通知管理员',
            dataExport: '敏感数据导出通知',
            dataExportDesc: '敏感数据被导出时通知管理员',
            dataDelete: '数据删除操作通知',
            dataDeleteDesc: '数据被删除时通知管理员'
          }
        },
        email: {
          user: {
            passwordReset: '管理员重置密码邮件',
            passwordResetDesc: '管理员重置用户密码后发送新密码到用户邮箱',
            forgotPasswordCode: '忘记密码验证码邮件',
            forgotPasswordCodeDesc: '用户申请忘记密码时发送验证码到邮箱',
            resetSuccess: '密码重置成功通知邮件',
            resetSuccessDesc: '密码重置成功后发送通知邮件'
          },
          notification: {
            forward: '通知转发邮件',
            forwardDesc: '将系统通知转发到用户邮箱'
          },
          device: {
            alarm: '设备报警邮件',
            alarmDesc: '设备报警时发送邮件通知'
          }
        },
        audit: {
          user: '用户管理审计',
          userDesc: '记录用户登录、注册、增删改查、密码重置等操作',
          permission: '权限管理审计',
          permissionDesc: '记录角色增删改、权限配置变更等操作',
          config: '系统配置审计',
          configDesc: '记录系统、安全、PLC、导出、连接、设备、订单配置变更',
          device: '设备管理审计',
          deviceDesc: '记录设备状态、参数变更、部件寿命、报警处理等操作',
          production: '生产管理审计',
          productionDesc: '记录配方下载、订单增删改查、订单下载等操作',
          data: '数据管理审计',
          dataDesc: '记录数据导出、数据详情查看等操作',
          plc: 'PLC操作审计',
          plcDesc: '记录PLC读写、连接、断开、重连等操作',
          audit: '审计自身审计',
          auditDesc: '记录审计查看、审核、导出等操作',
          license: '授权管理审计',
          licenseDesc: '记录授权导入、授权过期等操作',
          email: '邮箱配置审计',
          emailDesc: '记录邮箱配置变更、邮箱日志删除等操作'
        },
        auth: {
          register: '注册功能',
          registerDesc: '是否允许用户自助注册账号',
          forgotPassword: '忘记密码功能',
          forgotPasswordDesc: '是否允许通过邮箱验证码重置密码',
          firstLoginChangePassword: '首次登录强制改密',
          firstLoginChangePasswordDesc: '首次登录是否必须修改密码',
          loginFailedLock: '登录失败锁定',
          loginFailedLockDesc: '连续登录失败是否锁定账号'
        },
        system: {
          notificationMaster: '通知中心总开关',
          notificationMasterDesc: '关闭后所有通知不发送',
          emailMaster: '邮箱系统总开关',
          emailMasterDesc: '关闭后所有邮件不发送',
          auditMaster: '审计模块总开关',
          auditMasterDesc: '关闭后所有审计不记录',
          maintenanceTaskMaster: '定时任务总开关',
          maintenanceTaskMasterDesc: '关闭后所有定时任务停止',
          dataExportMaster: '数据导出总开关',
          dataExportMasterDesc: '关闭后所有导出功能禁用',
          watermark: '页面水印',
          watermarkDesc: '是否显示页面水印',
          onlineDeviceLimit: '在线设备数限制',
          onlineDeviceLimitDesc: '是否限制单用户在线设备数',
          auditVerify: '审计审核功能',
          auditVerifyDesc: '是否需要审核审计日志'
        }
      },
      database: {
        default: '数据管理',
        title: '项目数据库管理',
        desc: '数据库管理工具，支持数据查看、表编辑、备份和回滚，仅超级管理员可访问',
        tabs: {
          dataView: '数据查看',
          tableEdit: '配置表编辑',
          backup: '版本备份',
          restore: '回滚指南'
        },
        searchTable: '搜索表',
        configFileTip: '配置文件: src/config/database.config.js',
        categories: {
          system: '系统管理',
          user: '用户管理',
          security: '安全合规',
          log: '日志管理',
          config: '配置管理',
          notification: '消息通知',
          device: '设备管理',
          license: '授权管理',
          other: '其他'
        },
        noTable: '暂无数据表',
        noDescription: '暂无描述',
        rows: '行',
        dataRows: '数据行数',
        fieldCount: '字段数量',
        tableDescription: '表描述',
        tips: {
          fieldValue: '该字段的值，请根据实际情况输入',
          quickPath: '常用的备份存储路径，点击可快速填充到新路径输入框'
        },
        placeholder: {
          enterField: '请输入'
        },
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
        changePath: '修改路径',
        currentStoragePath: '当前存储路径：',
        defaultPath: 'backups/database (默认)',
        pathDialogTitle: '修改存储路径',
        currentPath: '当前路径',
        currentPathTip: '当前数据库备份文件的存储目录，所有备份文件都会保存在此目录下',
        newPath: '新路径',
        newPathTip: '修改数据库备份文件的存储目录，修改后新的备份会保存在新目录下，已有备份不会移动',
        newPathPlaceholder: '请输入存储路径，如：D:/backups/database',
        browse: '浏览',
        quickPath: '快捷路径',
        pathWarning: '修改存储路径后，历史备份文件仍保留在原路径，新备份将保存到新路径。由于浏览器安全限制，浏览按钮只能获取文件夹名称，完整路径请手动输入。',
        backupTotal: '备份总数',
        successBackup: '成功备份',
        failedBackup: '失败备份',
        totalSize: '总大小',
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
        deleteBackupConfirm: '确定要删除备份「{name}」吗？此操作不可撤销！',
        restoreConfirm: '确定要回滚到备份「{name}」吗？回滚前会自动备份当前数据，此操作不可撤销！',
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
        default: '项目配置',
        title: '项目配置',
        desc: '查看和管理项目运行的所有配置信息，支持在线编辑配置文件，仅超级管理员可访问',
        page: {
          title: '项目配置管理',
          desc: '查看和管理项目运行的所有配置信息，支持在线编辑配置文件'
        },
        menu: {
          environment: '环境信息',
          api: '接口配置',
          storage: '存储配置',
          security: '安全配置',
          database: '数据配置',
          license: '授权配置',
          email: '邮箱配置',
          translation: '翻译配置',
          plc: 'PLC 配置',
          i18n: '支持语言'
        },
        translation: {
          goToConfig: '前往设置',
          tipTitle: '配置说明',
          tipContent: '翻译配置用于管理系统的自动翻译功能。配置完成后，可在国际化管理页面使用自动翻译功能，快速将中文内容翻译为其他语言。翻译服务需要在腾讯云控制台开通并获取 API 密钥。'
        },
        i18n: {
          title: '国际化管理',
          desc: '管理系统多语言配置，支持在线搜索、编辑、新增国际化内容，仅超级管理员可访问',
          addConfig: '配置',
          backup: '备份',
          backupPath: '备份路径',
          searchPlaceholder: '搜索 key 或 value...',
          searchResult: '搜索结果',
          noData: '暂无数据',
          selectLanguageTitle: '请选择语言',
          selectLanguageDesc: '点击上方 Tab 或下方语言卡片选择要编辑的语言，需要哪个加载哪个',
          addChild: '新增子节点',
          addSibling: '新增同级节点',
          deleteNode: '删除节点',
          parentPath: '父级路径',
          parentPathTip: '选择新增配置项的父级路径，如 common 或 menu.system',
          parentPathPlaceholder: '请选择父级路径',
          keyName: 'Key 名称',
          keyNameTip: '新增配置项的 key 名称，如 save、cancel 等',
          keyNamePlaceholder: '如：confirmSave',
          valuePlaceholderWithLang: '请输入{lang}的值',
          autoTranslate: '自动翻译',
          unsavedChanges: '当前有未保存的修改，切换语言将丢失修改，确定继续吗？',
          noChanges: '没有需要保存的修改',
          saveSuccess: '保存成功，请重新编译或刷新页面',
          saveFailed: '保存失败',
          backupSuccess: '备份成功',
          backupFailed: '备份失败',
          loadFileListFailed: '加载文件列表失败',
          loadFileFailed: '加载文件失败',
          cannotAddChildToLeaf: '叶子节点不能新增子节点',
          confirmDelete: '确定要删除该配置项吗',
          deleteSuccess: '删除成功',
          deleteFailed: '删除失败',
          keyNotEmpty: 'Key 名称不能为空',
          keyInvalid: 'Key 名称格式不正确，只能包含字母、数字、下划线和美元符号，且不能以数字开头',
          addSuccess: '新增成功，请重新编译或刷新页面',
          addFailed: '新增失败',
          translateSourceEmpty: '请先输入中文内容',
          translateZhNotFound: '中文语言包中找不到对应的 key，请先在中文语言包中添加该配置',
          translateStart: '开始批量翻译',
          translateNoContent: '没有可翻译的内容',
          translateBatchSuccess: '批量翻译完成: {lang}，成功 {success} 项，失败 {fail} 项',
          translateSaveFailed: '翻译结果保存失败',
          translateTip: '自动翻译仅供参考，请人工核对翻译内容',
          translateProgress: '翻译进度',
          translating: '翻译中...',
          totalCount: '总数',
          currentCount: '已完成',
          successCount: '成功',
          failCount: '失败',
          currentTranslating: '当前正在翻译',
          translateProgressTip: '关闭弹窗后翻译将在后台继续，可随时点击翻译状态图标重新查看进度',
          cancelTranslate: '取消翻译',
          cancelTranslateConfirm: '确定要取消翻译吗？已翻译的内容将被保存。',
          translateCancelled: '翻译已取消: {lang}，已完成 {completed} 项，失败 {fail} 项',
          minimize: '最小化',
          closeTranslate: '关闭（翻译在后台继续）',
          restore: '还原',
          batchTranslate: '批量翻译',
          batchTranslateTip: '请选择翻译模式，翻译过程中可以关闭弹窗在后台继续翻译',
          translateMissingOnly: '仅翻译缺失项',
          translateMissingOnlyDesc: '只翻译当前为空的字段，不覆盖已有翻译（推荐）',
          translateAll: '全部重新翻译',
          translateAllDesc: '覆盖所有已有翻译（危险，请谨慎操作）',
          nodeTranslate: '节点翻译',
          nodeTranslateTip: '将只翻译该节点下的所有内容，翻译过程中可以关闭弹窗在后台继续翻译',
          nodeTranslateLeafTip: '叶子节点不能进行节点翻译，请选择父级节点',
          nodeTranslateNoContent: '该节点下没有可翻译的内容',
          translateSuccess: '翻译成功',
          translateFailed: '翻译失败，请检查翻译配置',
          translateOnlyLeaf: '只能翻译叶子节点',
          translateNotZh: '中文语言不需要翻译',
          formatNormal: '正常翻译（全小写，带空格）',
          formatTitle: '首字大写（单词首字母大写，带空格）',
          formatCamel: '驼峰命名（首词小写，后续首字母大写，无空格）',
          autoTranslateAll: '创建后自动翻译',
          autoTranslateAllTip: '开启后，创建语言文件时会自动将中文内容翻译为新语言（value 使用首字大写格式），可能消耗较多翻译额度',
          autoTranslateTip: '从中文语言包中获取对应 key 的内容，翻译为当前语言。如果中文语言包中没有该 key，会报错提示。',
          currentPath: '当前路径',
          currentPathTip: '当前国际化文件备份的存储目录，所有备份文件都会保存在此目录下',
          newPath: '新路径',
          newPathTip: '修改备份文件的存储目录，修改后新的备份会保存在新目录下，已有备份不会移动',
          pathNotEmpty: '路径不能为空',
          setPathSuccess: '备份路径设置成功',
          setPathFailed: '备份路径设置失败',
          backupList: '备份清单',
          backupFileName: '备份文件名',
          backupFileSize: '文件大小',
          backupCreateTime: '创建时间',
          noBackup: '暂无备份文件',
          confirmDeleteBackup: '确定要删除该备份文件吗',
          deleteBackupSuccess: '备份删除成功',
          deleteBackupFailed: '备份删除失败',
          valuePlaceholder: '请输入值',
          actions: '操作',
          items: '项',
          folders: '个文件夹',
          total: '个节点',
          noChildren: '暂无子节点，点击上方按钮新增',
          selectNodeTip: '请从左侧树形结构选择要编辑的节点',
          value: '值',
          createLanguage: '语言',
          sourceLanguage: '源语言',
          sourceLanguageTip: '选择作为模板的源语言文件，新语言将基于此文件的 key 结构创建',
          newLangCode: '新语言编码',
          newLangCodeTip: '新语言的文件名，格式为"语言编码-地区编码.js"，如 ja-JP.js、ko-KR.js',
          newLangCodePlaceholder: '如：ja-JP.js / ko-KR.js / fr-FR.js',
          newLangName: '新语言名称',
          newLangNameTip: '新语言在 Tab 标签上显示的名称，如"日本語"、"한국어"、"Français"',
          newLangNamePlaceholder: '如：日本語 / 한국어 / Français',
          copyValues: '复制源语言内容',
          copyValuesTip: '开启后将复制源语言的 value 内容到新语言；关闭后只保留 key 结构，value 留空',
          copyValuesYes: '复制',
          copyValuesNo: '留空',
          createLanguageTip: '创建后将在语言列表中显示新的 Tab，需要重新编译或刷新页面后生效',
          createLanguageSuccess: '语言创建成功，请重新编译或刷新页面',
          createLanguageFailed: '语言创建失败',
          sourceLangNotEmpty: '源语言不能为空',
          newLangCodeNotEmpty: '新语言编码不能为空',
          newLangCodeFormat: '新语言编码必须以 .js 结尾',
          newLangNameNotEmpty: '新语言名称不能为空'
        },
        editType: {
          database: '数据库配置',
          configFile: '配置文件',
          envFile: '环境变量',
          code: '代码常量',
          databaseTip: '存储在数据库中，可在系统设置/超级面板的参数配置页面直接修改，修改后立即生效',
          configFileTip: '存储在后端的配置文件中（如 src/config/*.js），需要在线编辑文件并重启后端服务后生效',
          envFileTip: '存储在环境变量文件中（如 .env），需要在线编辑文件并重启后端服务后生效',
          codeTip: '硬编码在代码中，需要手动修改源代码并重新构建后才能生效'
        },
        effectType: {
          immediate: '立即生效',
          restart: '需重启后端',
          rebuild: '需重新构建',
          immediateTip: '修改后立即生效，无需重启服务或重新构建',
          restartTip: '修改后需要重启后端服务才能生效',
          rebuildTip: '修改后需要重新构建前端项目才能生效'
        },
        ownerType: {
          frontend: '前端',
          backend: '后端',
          frontendTip: '该配置项属于前端项目，修改后需要重新构建前端',
          backendTip: '该配置项属于后端项目，修改后需要重启后端服务'
        },
        sourceType: {
          file: '配置文件',
          database: '数据库配置',
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
          viewTip: '点击回滚按钮可恢复到此版本',
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
            nodeEnv: {
              label: '运行环境',
              description: 'Node.js运行环境，development为开发模式，production为生产模式'
            },
            appPort: {
              label: '服务端口',
              description: '后端服务监听的端口号'
            },
            appHost: {
              label: '服务主机',
              description: '后端服务绑定的主机地址，0.0.0.0表示监听所有网卡'
            },
            systemVersion: {
              label: '系统版本',
              description: '系统版本号，发布新版本时更新'
            },
            nodeVersion: {
              label: 'Node.js版本',
              description: '当前运行的Node.js版本，建议使用LTS版本'
            },
            platform: {
              label: '操作系统',
              description: '当前运行的操作系统平台，如 win32、linux、darwin 等'
            },
            arch: {
              label: '系统架构',
              description: '当前操作系统的 CPU 架构，如 x64、arm64 等'
            },
            hostname: {
              label: '主机名',
              description: '当前服务器的主机名，用于标识服务器身份'
            },
            localIp: {
              label: '本地IP地址',
              description: '当前服务器的本地 IP 地址，用于局域网内访问'
            },
            cwd: {
              label: '工作目录',
              description: '后端服务的当前工作目录，即启动服务时所在的目录'
            },
            projectRoot: {
              label: '项目根目录',
              description: '后端项目的根目录路径，所有相对路径都基于此目录'
            }
          },
          api: {
            apiPrefix: {
              label: 'API前缀',
              description: 'API接口统一前缀，前后端需保持一致'
            },
            corsEnabled: {
              label: '跨域开关',
              description: '是否开启CORS跨域支持，生产环境建议配置具体域名'
            },
            rateLimit: {
              label: '请求频率限制',
              description: '单IP每分钟最大请求数，防止恶意刷接口'
            },
            requestTimeout: {
              label: '接口超时时间',
              description: '前端请求超时时间，超时后自动取消请求'
            },
            maxBodySize: {
              label: '请求体大小限制',
              description: '后端接收的请求体最大大小，防止超大请求攻击'
            },
            maxFileSize: {
              label: '文件大小限制',
              description: '上传文件的最大大小限制'
            },
            corsOrigin: {
              label: '跨域来源',
              description: '允许跨域访问的来源地址，*表示允许所有来源，生产环境建议配置具体域名'
            },
            rateLimitWindow: {
              label: '限流时间窗口',
              description: '请求频率限制的时间窗口（秒），在该时间窗口内最多允许rateLimit次请求'
            }
          },
          storage: {
            upload: {
              dir: {
                label: '上传目录',
                description: '本地上传文件的存储目录'
              },
              maxSize: {
                label: '最大文件大小',
                description: '本地上传文件的最大大小'
              },
              allowedTypes: {
                label: '允许的文件类型',
                description: '允许上传的文件扩展名列表'
              },
              staticPrefix: {
                label: '静态资源前缀',
                description: '本地上传文件的静态访问URL前缀，用于通过HTTP访问上传的文件'
              }
            },
            github: {
              enabled: {
                label: 'GitHub图床开关',
                description: '是否启用GitHub图床存储图片'
              },
              owner: {
                label: '仓库所有者',
                description: 'GitHub仓库所有者用户名'
              },
              repo: {
                label: '仓库名',
                description: 'GitHub图床仓库名称'
              },
              branch: {
                label: '分支',
                description: 'GitHub仓库分支，一般为main'
              },
              pathPrefix: {
                label: '路径前缀',
                description: 'GitHub仓库中存储图片的路径前缀，如 images/'
              },
              maxSize: {
                label: '最大文件大小',
                description: 'GitHub图床上传文件的最大大小限制'
              }
            },
            backup: {
              dir: {
                label: '数据库备份目录',
                description: '数据库备份文件存储目录'
              },
              i18nDir: {
                label: '国际化备份目录',
                description: '国际化语言文件备份存储目录'
              },
              configDir: {
                label: '配置数据备份目录',
                description: '配置文件版本历史备份存储目录'
              }
            },
            logs: {
              dir: {
                label: '日志目录',
                description: '系统日志文件存储目录'
              }
            },
            license: {
              dir: {
                label: '授权文件目录',
                description: '授权文件和密钥存储目录'
              },
              licensePath: {
                label: '授权文件路径',
                description: '授权许可证文件的存储路径'
              },
              publicKeyPath: {
                label: '公钥文件路径',
                description: '用于验证授权签名的公钥文件路径'
              },
              timeGuardPath: {
                label: '时间保护文件路径',
                description: '时间保护文件的存储路径，用于记录最后验证时间，防止回拨系统时间'
              }
            }
          },
          security: {
            jwt: {
              expiresIn: {
                label: 'Token有效期',
                description: 'JWT Token的有效期，过期后需要重新登录'
              },
              algorithm: {
                label: '加密算法',
                description: 'JWT签名加密算法，一般使用HS256'
              }
            },
            session: {
              timeout: {
                label: '会话超时时间',
                description: '用户无操作多长时间后自动退出登录'
              }
            },
            login: {
              failedThreshold: {
                label: '登录失败阈值',
                description: '连续登录失败多少次后锁定账户'
              },
              lockDuration: {
                label: '账户锁定时长',
                description: '登录失败锁定账户的时长'
              }
            },
            password: {
              minLength: {
                label: '密码最小长度',
                description: '用户密码的最小长度要求'
              },
              requireUppercase: {
                label: '需要大写字母',
                description: '用户密码是否必须包含大写字母（A-Z）'
              },
              requireLowercase: {
                label: '需要小写字母',
                description: '用户密码是否必须包含小写字母（a-z）'
              },
              requireNumber: {
                label: '需要数字',
                description: '用户密码是否必须包含数字（0-9）'
              },
              requireSymbol: {
                label: '需要特殊符号',
                description: '用户密码是否必须包含特殊符号（如!@#$%^&*）'
              },
              bcryptSaltRounds: {
                label: '密码加密强度',
                description: 'bcrypt加密的盐轮数，数值越大越安全但越慢'
              }
            },
            watermark: {
              enabled: {
                label: '页面水印',
                description: '是否在页面显示水印，防止截图泄露'
              }
            }
          },
          database: {
            host: {
              label: '数据库主机',
              description: 'MySQL数据库服务器地址'
            },
            port: {
              label: '数据库端口',
              description: 'MySQL数据库端口，默认为3306'
            },
            user: {
              label: '数据库用户名',
              description: 'MySQL数据库登录用户名'
            },
            password: {
              label: '数据库密码',
              description: 'MySQL数据库登录密码（已隐藏）'
            },
            database: {
              label: '数据库名',
              description: '使用的MySQL数据库名称'
            },
            connectionLimit: {
              label: '连接池大小',
              description: '数据库连接池的最大连接数'
            },
            waitForConnections: {
              label: '等待连接',
              description: '连接池满时是否等待连接释放，true表示等待，false表示立即报错'
            },
            queueLimit: {
              label: '队列限制',
              description: '等待连接的最大请求数，0表示不限制'
            }
          },
          license: {
            projectId: {
              label: '项目ID',
              description: '授权系统的项目唯一标识'
            },
            strictMode: {
              label: '严格模式',
              description: '严格模式下授权验证失败会拒绝服务，非严格模式只警告'
            },
            licensePath: {
              label: '授权文件路径',
              description: '授权许可证文件的存储路径'
            },
            publicKeyPath: {
              label: '公钥文件路径',
              description: '用于验证授权签名的公钥文件路径'
            },
            licenseServerUrl: {
              label: '时间校准服务器',
              description: '用于时间校准的服务器地址，防止本地时间篡改'
            },
            timeGuardPath: {
              label: '时间保护文件路径',
              description: '时间保护文件的存储路径，用于记录最后验证时间，防止回拨系统时间'
            },
            maxFileSize: {
              label: '最大文件大小',
              description: '授权文件上传的最大大小限制'
            },
            allowedExtname: {
              label: '允许的扩展名',
              description: '允许上传的授权文件扩展名列表'
            }
          },
          email: {
            enabled: {
              label: '邮箱系统开关',
              description: '是否启用邮箱发送功能'
            },
            defaultProvider: {
              label: '默认服务商',
              description: '默认使用的邮件服务商配置，如smtp、qq、163等'
            },
            host: {
              label: 'SMTP主机',
              description: 'SMTP邮件服务器地址'
            },
            port: {
              label: 'SMTP端口',
              description: 'SMTP邮件服务器端口'
            },
            secure: {
              label: 'SSL加密',
              description: '是否使用SSL加密连接邮件服务器'
            },
            username: {
              label: '邮箱账号',
              description: '用于发送邮件的邮箱账号'
            },
            fromName: {
              label: '发件人名称',
              description: '邮件显示的发件人名称'
            },
            send: {
              maxRetries: {
                label: '发送最大重试次数',
                description: '邮件发送失败后的最大重试次数'
              },
              retryDelay: {
                label: '重试延迟',
                description: '邮件发送失败后重试的延迟时间（毫秒）'
              },
              timeout: {
                label: '发送超时时间',
                description: '邮件发送的超时时间'
              },
              logEnabled: {
                label: '发送日志',
                description: '是否记录邮件发送的详细日志'
              }
            },
            passwordReset: {
              tokenExpiresIn: {
                label: '重置Token有效期',
                description: '密码重置链接的有效期'
              },
              tokenLength: {
                label: '重置Token长度',
                description: '密码重置Token的字符长度'
              },
              maxActiveTokens: {
                label: '最大活跃Token数',
                description: '单个用户最多可同时存在的有效密码重置Token数量'
              }
            }
          },
          plc: {
            activeProtocol: {
              label: '通信协议',
              description: '当前使用的PLC通信协议'
            },
            supportedProtocols: {
              label: '支持的协议',
              description: '系统支持的PLC通信协议列表'
            },
            connection: {
              host: {
                label: 'PLC设备IP',
                description: 'PLC设备的IP地址'
              },
              port: {
                label: 'PLC端口',
                description: 'PLC设备的通信端口'
              },
              unitId: {
                label: '单元ID',
                description: 'Modbus协议的从站单元ID，一般为1'
              },
              rack: {
                label: '机架号',
                description: 'S7协议的机架号，一般为0'
              },
              slot: {
                label: '槽位号',
                description: 'S7协议的槽位号，一般为1或2'
              }
            },
            poll: {
              fastInterval: {
                label: '快速轮询间隔',
                description: '设备在线时的轮询间隔'
              },
              slowInterval: {
                label: '慢速轮询间隔',
                description: '设备离线时的轮询间隔'
              },
              reconnectDelay: {
                label: '重连延迟',
                description: '设备断开后重新连接的延迟时间（毫秒）'
              }
            },
            enablePoll: {
              label: '自动轮询',
              description: '是否启用PLC数据自动轮询'
            },
            enableWriteAudit: {
              label: '写入审计',
              description: '是否记录PLC写入操作的审计日志'
            },
            maxWriteRetry: {
              label: '最大写入重试',
              description: 'PLC写入操作失败后的最大重试次数'
            },
            timeouts: {
              connect: {
                label: '连接超时',
                description: 'PLC连接的超时时间（毫秒）'
              },
              read: {
                label: '读取超时',
                description: 'PLC单次读取的超时时间（毫秒）'
              },
              readBatch: {
                label: '批量读取超时',
                description: 'PLC批量读取的超时时间（毫秒）'
              },
              write: {
                label: '写入超时',
                description: 'PLC写入操作的超时时间（毫秒）'
              },
              general: {
                label: '通用超时',
                description: 'PLC其他操作的通用超时时间（毫秒）'
              }
            },
            multiDeviceEnabled: {
              label: '多设备模式',
              description: '是否启用多设备模式，支持同时连接多个PLC设备'
            }
          }
        }
      },
      i18n: {
        default: '语言配置',
        title: '语言配置',
        desc: '管理系统多语言配置，支持在线搜索、编辑、新增国际化内容，仅超级管理员可访问'
      }
    }
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
    registerTitle: '用户注册',
    realName: '真实姓名',
    email: '邮箱',
    phone: '手机号',
    confirmPassword: '确认密码',
    confirmPasswordRequired: '请输入确认密码',
    registerSuccess: '注册成功，请登录',
    deviceLimitExceeded: '在线设备数已达上限（最多 {maxDevices} 台），请联系管理员踢掉其他设备',
    kickedOffline: '您的账号已在其他设备登录，您已被踢下线',
    kickNotice: '下线通知',
    kickReason: '您的账号已在其他设备登录',
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
  layout: {
    user: '用户',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    searchMenu: '搜索菜单',
    profile: '个人中心',
    settings: '系统设置',
    logout: '退出登录',
    notificationCenter: '通知中心',
    collapse: '收起',
    expand: '展开'
  },
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
  quickMenu: {
    title: '快捷菜单',
    theme: {
      palette: '主题调色',
      resetAll: '重置全部',
      reset: '重置',
      custom: '自定义',
      sidebarBg: '侧边栏背景',
      sidebarHoverText: '侧边栏悬停文字',
      sidebarHoverBg: '侧边栏悬停背景',
      sidebarIconColor: '图标颜色',
      sidebarActiveBg: '侧边栏激活背景'
    },
    language: {
      title: '语言',
      switchedToZh: '已切换为中文',
      switchedToEn: '已切换为英文',
      switched: '已切换为 {lang}',
      switchFailed: '语言切换失败'
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
    batchDeleteConfirm: '确定要删除选中的 {count} 条通知吗？',
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
    typeSystem: '系统通知',
    typePlc: 'PLC通知',
    typeUser: '用户通知',
    typeAudit: '审计通知',
    typeDevice: '设备通知',
    typeConnection: '连接通知',
    typeSecurity: '安全通知',
    typeProduction: '生产通知',
    typeConfig: '配置通知',
    typeLicense: '授权通知',
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
    selectedCount: '已选择 {count} 项',
    clearSelection: '取消选择',
    justNow: '刚刚',
    minutesAgo: '分钟前',
    hoursAgo: '小时前',
    daysAgo: '天前',
    userLoginTitle: '用户登录',
    userLoginContent: '用户 {username} 登录系统',
    kickOutTitle: '下线通知',
    kickOutContent: '您的账号已在其他设备登录',
    kickedOutTitle: '账号被踢下线',
    kickedOutContent: '您的账号已于 {time} 在IP {ip} 的设备上登录，当前设备已下线',
    deviceKickedTitle: '设备被踢下线',
    deviceKickedContent: '您的设备 {deviceName} 已于 {time} 被管理员 {operator} 踢下线',
    deviceKickedAdminTitle: '设备被踢下线（管理员通知）',
    deviceKickedAdminContent: '管理员 {operator} 已于 {time} 将用户 {userId} 的设备 {deviceName} 踢下线',
    system: {
      backupSuccess: {
        title: '数据备份成功',
        content: '系统数据备份已成功完成'
      },
      backupFailed: {
        title: '数据备份失败',
        content: '系统数据备份失败，请检查备份配置'
      }
    },
    license: {
      expiring: {
        title: '授权即将到期',
        content: '系统授权将在30天内到期，请及时续费'
      },
      expired: {
        title: '授权已过期',
        content: '系统授权已过期，部分功能已受限'
      }
    },
    user: {
      register: {
        title: '新用户注册',
        content: '用户 {username} 已注册成功'
      },
      create: {
        title: '用户创建',
        content: '管理员创建了用户 {username}'
      },
      update: {
        title: '用户信息变更',
        content: '用户 {username} 的信息已更新'
      },
      statusChange: {
        title: '用户状态变更',
        content: '用户 {username} 的状态已变更为 {status}'
      },
      passwordReset: {
        title: '密码重置',
        content: '用户 {username} 的密码已被重置'
      },
      loginFailed: {
        title: '用户登录失败',
        content: '用户 {username} 连续登录失败 {count} 次，请关注'
      },
      roleChange: {
        title: '用户角色变更',
        content: '用户 {username} 的角色已变更为 {role}'
      }
    },
    device: {
      paramChange: {
        title: '设备参数变更',
        content: '设备参数 {tag} 已由 {operator} 修改'
      },
      maintenanceReminder: {
        title: '设备维护提醒',
        content: '设备 {deviceName} 即将到达维护时间，请及时安排维护'
      },
      partLifeWarning: {
        title: '配件寿命预警',
        content: '配件 {partName} 使用寿命即将到期，请及时更换'
      }
    },
    production: {
      orderCreate: {
        title: '生产订单创建',
        content: '生产订单 {orderNo} 已创建'
      },
      orderUpdate: {
        title: '生产订单变更',
        content: '生产订单 {orderNo} 已更新'
      },
      orderComplete: {
        title: '生产订单完成',
        content: '生产订单 {orderNo} 已完成'
      },
      batchComplete: {
        title: '批次完成',
        content: '批次 {batchNo} 已完成生产'
      }
    },
    config: {
      systemUpdate: {
        title: '系统配置变更',
        content: '系统配置已由 {username} 修改'
      },
      plcConnectionUpdate: {
        title: 'PLC连接配置变更',
        content: 'PLC连接配置已由 {username} 修改'
      },
      connectionUpdate: {
        title: '连接配置变更',
        content: '连接配置已由 {username} 修改'
      },
      deviceParamsUpdate: {
        title: '设备参数配置变更',
        content: '设备参数配置已由 {username} 修改'
      },
      exportUpdate: {
        title: '导出配置变更',
        content: '导出配置已由 {username} 修改'
      },
      securityUpdate: {
        title: '安全配置变更',
        content: '安全配置已由 {username} 修改'
      }
    },
    audit: {
      logExport: {
        title: '审计日志导出',
        content: '用户 {username} 导出了审计日志'
      },
      logView: {
        title: '审计日志查看',
        content: '用户 {username} 查看了审计日志'
      }
    },
    permission: {
      change: {
        title: '权限配置变更',
        content: '角色 {roleName} 的权限配置已由 {operator} 修改'
      }
    },
    data: {
      export: {
        title: '敏感数据导出',
        content: '用户 {username} 导出了敏感数据'
      },
      delete: {
        title: '数据删除操作',
        content: '用户 {username} 删除了数据'
      }
    },
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
      endTime: '结束时间',
      saveSuccess: '保存成功',
      startTime: '开始时间'
    },
    operationFailed: '操作失败'
  },
  audit: {
    module: {
      user: '用户管理',
      permission: '权限管理',
      config: '系统配置',
      device: '设备管理',
      production: '生产管理',
      data: '数据管理',
      plc: 'PLC操作',
      audit: '审计自身',
      license: '授权管理',
      email: '邮箱配置'
    },
    user: {
      register: {
        title: '用户注册'
      },
      login: {
        title: '用户登录'
      },
      loginFailed: {
        title: '用户登录失败'
      },
      logout: {
        title: '用户登出'
      },
      create: {
        title: '创建用户'
      },
      update: {
        title: '修改用户'
      },
      delete: {
        title: '删除用户'
      },
      batchDelete: {
        title: '批量删除用户'
      },
      statusChange: {
        title: '修改用户状态'
      },
      resetPassword: {
        title: '重置密码'
      },
      changePassword: {
        title: '修改密码'
      },
      roleChange: {
        title: '用户角色变更'
      }
    },
    role: {
      create: {
        title: '创建角色'
      },
      update: {
        title: '修改角色'
      },
      delete: {
        title: '删除角色'
      }
    },
    permission: {
      change: {
        title: '权限配置变更'
      },
      cacheClear: {
        title: '权限缓存清除'
      }
    },
    config: {
      system: {
        change: {
          title: '系统参数修改'
        }
      },
      security: {
        change: {
          title: '安全配置修改'
        }
      },
      plc: {
        change: {
          title: 'PLC连接配置修改'
        }
      },
      export: {
        change: {
          title: '导出配置修改'
        }
      },
      connection: {
        change: {
          title: '连接配置修改'
        }
      },
      device: {
        change: {
          title: '设备配置修改'
        }
      },
      order: {
        change: {
          title: '订单配置修改'
        }
      }
    },
    device: {
      statusChange: {
        title: '设备状态变更'
      },
      paramChange: {
        title: '设备参数修改'
      },
      part: {
        create: {
          title: '新增部件'
        },
        update: {
          title: '编辑部件'
        },
        replace: {
          title: '更换部件'
        },
        delete: {
          title: '删除部件'
        }
      },
      alarm: {
        handle: {
          title: '报警处理'
        }
      }
    },
    production: {
      recipe: {
        download: {
          title: '配方下载'
        }
      },
      order: {
        create: {
          title: '新增生产订单'
        },
        update: {
          title: '编辑生产订单'
        },
        delete: {
          title: '删除生产订单'
        },
        download: {
          title: '下载生产订单'
        }
      }
    },
    data: {
      export: {
        title: '数据导出'
      },
      viewDetail: {
        title: '数据查看详情'
      }
    },
    plc: {
      write: {
        title: 'PLC参数写入'
      },
      read: {
        title: 'PLC参数读取'
      },
      connect: {
        title: 'PLC连接'
      },
      disconnect: {
        title: 'PLC断开'
      },
      reconnect: {
        title: 'PLC重连'
      }
    },
    audit: {
      view: {
        title: '审计日志查看'
      },
      verify: {
        title: '审计哈希链校验'
      },
      export: {
        title: '审计日志导出'
      }
    },
    license: {
      import: {
        title: '授权导入'
      },
      expire: {
        title: '授权到期'
      }
    },
    email: {
      configChange: {
        title: '邮箱配置修改'
      },
      logDelete: {
        title: '邮箱日志删除'
      }
    }
  },
  heartbeat: {
    statusOnline: '在线',
    statusOffline: '离线',
    statusAuthenticating: '认证中...',
    statusDeviceDisconnected: '设备未连接',
    statusReconnecting: '重连中({count})',
    statusManualReconnecting: '重连中...',
    serverConnected: '服务器: 已连接',
    serverDisconnected: '服务器: 未连接',
    serverAuthenticating: '服务器: 认证中',
    serverReconnecting: '服务器: 重连中(第{count}次)',
    deviceConnected: '设备: 已连接',
    deviceDisconnected: '设备: 未连接',
    tooltipManualReconnecting: '正在手动重连...',
    detailTitle: '连接状态详情',
    detailServerLabel: '服务器状态',
    detailDeviceLabel: '设备状态',
    detailLastHeartbeatLabel: '最后心跳',
    detailHeartbeatIntervalLabel: '心跳间隔',
    detailHeartbeatIntervalValue: '{seconds}秒',
    detailConnected: '已连接 ✓',
    detailDisconnected: '未连接 ✗',
    detailManualReconnecting: '正在尝试手动重连，请稍候...',
    detailServerConnected: '服务器状态: 已连接 ✓',
    detailServerDisconnected: '服务器状态: 未连接 ✗',
    detailServerAuthenticating: '服务器状态: 认证中...',
    detailServerReconnecting: '服务器状态: 重连中 (第 {count} 次)',
    detailDeviceConnected: '设备状态: 已连接 ✓',
    detailDeviceDisconnected: '设备状态: 未连接 ✗',
    detailLastHeartbeat: '最后心跳: {time}',
    detailHeartbeatInterval: '心跳间隔: {seconds}秒',
    detailReconnectSuccess: '✓ 手动重连成功！',
    detailReconnectFailed: '✗ 手动重连失败: {error}',
    reconnectFailedUnknown: '未知错误',
    confirm: '确定',
    timeNever: '从未',
    timeSecondsAgo: '{n}秒前',
    timeMinutesAgo: '{n}分钟前',
    timeHoursAgo: '{n}小时前'
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
    batchDeleteConfirm: '确定要删除选中的 {count} 条日志吗？',
    batchDeleteSuccess: '批量删除成功'
  },
  error: {
    PARAM_ERROR: '参数错误',
    PARAM_MISSING: '缺少必填参数',
    PARAM_INVALID: {
      default: '参数格式不正确',
      password: {
        string_min: '密码最少{limit}个字符',
        string_max: '密码最多{limit}个字符',
        string_empty: '密码不能为空',
        any_required: '密码不能为空'
      },
      username: {
        string_min: '用户名最少{limit}个字符',
        string_max: '用户名最多{limit}个字符',
        string_empty: '用户名不能为空',
        any_required: '用户名不能为空'
      },
      email: {
        string_email: '邮箱格式不正确',
        string_empty: '邮箱不能为空',
        any_required: '邮箱不能为空'
      },
      string_min: '{field}最少{limit}个字符',
      string_max: '{field}最多{limit}个字符',
      string_empty: '{field}不能为空',
      any_required: '{field}不能为空',
      string_base: '{field}必须是字符串',
      number_base: '{field}必须是数字'
    },
    UNAUTHORIZED: '未登录，请先登录',
    TOKEN_EXPIRED: '登录已过期，请重新登录',
    TOKEN_INVALID: 'Token无效',
    TOKEN_KICKED_OUT: '您已在其他设备登录，当前设备已下线',
    PERMISSION_DENIED: '权限不足',
    CAPTCHA_EXPIRED: '验证码已失效，请重新获取',
    CAPTCHA_ERROR: '验证码输入错误',
    NOT_FOUND: '接口不存在',
    SYSTEM_ERROR: '系统错误',
    DATABASE_ERROR: '数据库操作失败',
    NETWORK_ERROR: '网络错误',
    UNKNOWN_ERROR: '未知错误',
    DEPT_NOT_FOUND: '部门不存在',
    DEPT_PARENT_INVALID: '上级部门不能设置为自己',
    DEPT_HAS_CHILDREN: '存在子部门，无法删除',
    DEPT_HAS_USERS: '该部门下有用户，无法删除',
    ROLE_NOT_FOUND: '角色不存在',
    ROLE_CODE_EXISTS: '角色编码已存在',
    USER_NOT_FOUND: '用户不存在',
    USER_USERNAME_EXISTS: '用户名已存在',
    USER_PASSWORD_ERROR: '密码错误',
    USER_DISABLED: '账号已被禁用',
    USER_LOCKED: '账户已锁定',
    USER_REGISTER_FAIL: '注册失败',
    DEVICE_LIMIT_EXCEEDED: '在线设备数已达上限（最多 {maxDevices} 台），请联系管理员踢掉其他设备',
    DICT_TYPE_NOT_FOUND: '字典类型不存在',
    DICT_TYPE_CODE_EXISTS: '字典类型编码已存在',
    DICT_ITEM_NOT_FOUND: '字典项不存在',
    DICT_ITEM_VALUE_DUPLICATE: '同一字典类型下值不能重复',
    AUDIT_NOT_MODIFIABLE: '审计日志不允许修改',
    AUDIT_NOT_DELETABLE: '审计日志不允许删除',
    NOTIFICATION_NOT_FOUND: '通知不存在',
    CUSTOMER_NOT_FOUND: '客户不存在',
    MENU_USER_ID_REQUIRED: '用户ID不能为空',
    FILE_NOT_EXIST: '请选择要上传的文件',
    FILE_PATH_EMPTY: '文件路径不能为空',
    FILE_PATH_INVALID: '非法的文件路径',
    FILE_TOO_LARGE: '文件大小超出限制',
    FILE_TYPE_NOT_ALLOWED: '不支持的文件类型',
    FILE_UPLOAD_FAIL: '文件上传失败',
    FILE_DELETE_FAIL: '文件删除失败',
    FILE_LIMIT_EXCEEDED: '上传文件数量超出限制',
    FILE_UNEXPECTED_FIELD: '意外的文件字段',
    GITHUB_CONFIG_ERROR: 'GitHub 图床配置不完整',
    GITHUB_UPLOAD_FAIL: 'GitHub 上传失败',
    GITHUB_DELETE_FAIL: 'GitHub 文件删除失败',
    GITHUB_API_ERROR: 'GitHub API 调用失败',
    NOTIFICATION_TITLE_CONTENT_REQUIRED: '标题和内容不能为空',
    NOTIFICATION_USER_ID_REQUIRED: 'userId不能为空（或使用 broadcast: true 广播）',
    EMAIL_CONFIG_NOT_FOUND: '邮箱配置不存在',
    EMAIL_CONFIG_NAME_EXISTS: '配置名称已存在',
    EMAIL_CONFIG_DEFAULT_CANNOT_DELETE: '默认配置不能删除，请先将其他配置设为默认',
    EMAIL_CONFIG_SYSTEM_CANNOT_DELETE: '系统内置配置不能删除',
    EMAIL_CONFIG_DEFAULT_CANNOT_DISABLE: '默认配置不能禁用，请先将其他配置设为默认',
    EMAIL_CONFIG_ONLY_ENABLED_CAN_DEFAULT: '只能将启用的配置设为默认',
    EMAIL_NAME_REQUIRED: '配置名称不能为空',
    EMAIL_PROVIDER_REQUIRED: '服务商不能为空',
    EMAIL_HOST_REQUIRED: 'SMTP服务器地址不能为空',
    EMAIL_PORT_REQUIRED: 'SMTP端口不能为空',
    EMAIL_USERNAME_REQUIRED: '邮箱账号不能为空',
    EMAIL_PASSWORD_REQUIRED: '邮箱授权码不能为空',
    EMAIL_CONFIG_ID_REQUIRED: '配置ID不能为空',
    EMAIL_TO_EMAIL_REQUIRED: '测试收件人邮箱不能为空',
    EMAIL_STATUS_REQUIRED: '状态不能为空',
    EMAIL_FORMAT_INVALID: '邮箱格式不正确',
    EMAIL_VALIDATION_FAILED: '配置校验失败：{errors}',
    EMAIL_TEST_SEND_FAILED: '测试邮件发送失败：{error}',
    PART_CODE_EXISTS: '部件编码 {partCode} 已存在',
    PART_CODE_SAME_AS_OLD: '新部件编码 {partCode} 与原编码相同，无需更换',
    PART_SPEC_NOT_MATCH: '规格型号 {userSpec} 与模板规格型号 {templateSpec} 不匹配，必须使用模板定义的规格型号',
    PART_RATED_LIFE_NOT_MATCH: '额定寿命 {userRatedLife} 与模板额定寿命 {templateRatedLife} 不匹配，必须使用模板定义的额定寿命'
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
