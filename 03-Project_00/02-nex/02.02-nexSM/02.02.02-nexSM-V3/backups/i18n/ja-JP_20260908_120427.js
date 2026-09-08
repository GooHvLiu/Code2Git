/**
 * ja-JP 国际化配置文件
 * 由国际化管理模块自动生成
 * 请勿手动修改此文件，除非您了解其结构
 * 
 * 最后更新时间: 2026-09-08T04:04:12.927Z
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
      default: 'ホームページtopページ',
      overview: {
        default: 'プロフィールプレビュー'
      },
      dashboard: {
        default: 'データカンバン'
      },
      dataview: {
        default: 'データの管理',
        search: '検索する。',
        reset: 'リセットする',
        export: 'エクスポートエクスポート',
        refresh: 'リフレッシュする。',
        detail: '詳細はこちら',
        exportSingle: '単一エクスポート',
        output: {
          title: '生産能力データ'
        },
        oee: {
          title: '稼働率データ'
        },
        production: {
          title: '生産データ'
        },
        alarm: {
          title: 'アラームデータ'
        }
      }
    },
    device: {
      default: 'デバイス管理',
      state: {
        default: 'デバイスのステータス',
        control: '機器の制御'
      },
      alarm: {
        default: 'アラーム統計',
        dashboard: {
          title: '統計カンバン'
        },
        list: {
          title: '詳細なレコード'
        },
        search: '検索する。',
        reset: 'リセットする',
        export: 'エクスポートエクスポート',
        refresh: 'リフレッシュする。',
        detail: '詳細はこちら',
        handle: '処理の仕方'
      },
      part: {
        default: '部品の寿命',
        search: '検索する。',
        add: 'その他追加',
        refresh: 'リフレッシュする。',
        edit: '編集者。',
        operate: '交換する。',
        delete: '削除する',
        tab: {
          life: '寿命の詳細',
          template: 'テンプレート管理'
        },
        template: {
          add: 'テンプレートの追加',
          edit: '編集者。',
          delete: '削除する',
          search: '検索テンプレート',
          refresh: 'リフレッシュする。',
          searchPlaceholder: 'テンプレート名/エンコーディングの検索',
          fillNeedle: '充填針アセンブリ',
          fillTube: '充填チューブアセンブリ',
          stopper: 'ガゼット·ロッド·パーツ',
          vacuum: '真空アセンブリ',
          column: {
            templateName: 'テンプレート名',
            templateKey: 'テンプレート符号化',
            codePrefix: '符号化プレフィックス',
            defaultSpec: 'デフォルト仕様モデル',
            defaultRatedLife: 'デフォルトの定格寿命',
            statMethod: '統計的アプローチ',
            statTag: '統計ラベル',
            icon: 'Iconアイコン',
            status: '状態の状態',
            sort: 'ソート·ソート',
            action: 'オペレーション·オペレーション'
          },
          form: {
            templateName: 'テンプレート名',
            templateKey: 'テンプレート符号化',
            codePrefix: '符号化プレフィックス',
            defaultSpec: 'デフォルト仕様モデル',
            defaultRatedLife: 'デフォルトの定格寿命',
            statMethod: '統計的アプローチ',
            statTag: '統計ラベル',
            icon: 'Iconアイコン',
            enabled: '状態の状態',
            sort: 'ソート·ソート'
          },
          tips: {
            templateName: 'デフォルトの仕様と定格寿命が自動的に入力される基準部品テンプレートを選択します。',
            defaultSpec: 'このテンプレート部品のデフォルト仕様モデル。部品を追加すると自動的に入力されます。',
            defaultRatedLife: 'このテンプレート部品の既定の定格寿命回数。部品が新規に追加されると自動的に入力されます。'
          },
          statMethod: {
            successCount: '実行成功回数',
            rotationCount: 'モーターの回転数',
            manual: '手動統計'
          },
          status: {
            enabled: '有効にする',
            disabled: '禁止する。'
          },
          message: {
            addSuccess: '新規テンプレート成功',
            editSuccess: 'テンプレートの編集成功',
            deleteSuccess: 'テンプレートの削除に成功',
            deleteConfirm: 'テンプレートを削除してもよろしいですか？'
          }
        },
        page: {
          title: '部品寿命管理',
          addBtn: '部品の追加',
          editBtn: '編集者。',
          deleteBtn: '削除する',
          replaceBtn: 'エントリの置き換え',
          refreshBtn: 'リフレッシュする。',
          searchPlaceholder: '部品名/エンコードのサーチ',
          template: {
            fillNeedle: '充填針アセンブリ',
            fillTube: '充填チューブアセンブリ',
            stopperRod: 'ガゼット·ロッド·パーツ',
            vacuumUnit: '真空アセンブリ'
          },
          form: {
            template: '部品テンプレート',
            partName: '部品名',
            partCode: '部品コード化',
            specModel: 'Specificationモデル',
            ratedLife: '定格寿命',
            usedLife: '耐用年数は',
            installDate: '設置日付',
            remark: '備考：コメント',
            newCode: '新素材コード',
            replaceReason: '交換の理由',
            confirmReplace: '交換の確認',
            replacePart: 'パーツ交換',
            currentCode: '現在のコード。'
          },
          status: {
            normal: '普通に。',
            warning: 'リマインダー：リマインダー',
            critical: '警告する。',
            expired: '期限切れになった'
          },
          unit: {
            times: '次は。'
          },
          message: {
            addSuccess: '部品の追加に成功しました',
            updateSuccess: '部品の更新が成功しました',
            deleteSuccess: '部品の削除に成功しました',
            replaceSuccess: 'パーツ交換の記録に成功',
            deleteConfirm: 'パーツを削除してもよろしいですか履歴は削除後も残ります。',
            loadFailed: '部品リストのロードに失敗しました',
            noData: '部品データなし',
            updateFailed: '部品の更新に失敗しました',
            addFailed: '部品の追加に失敗しました',
            saveFailed: '部品の保存に失敗しました',
            deleteFailed: '部品の削除に失敗しました',
            deleteFailedCatch: '部品の削除に失敗しました',
            replaceFailed: 'パーツ交換の失敗',
            deleteConfirmTitle: '削除の確認',
            confirmBtn: '決定する。',
            cancelBtn: 'キャンセル。',
            remaining: '残りは',
            recentReplaceRecords: '最近の交換記録',
            statusSuccess: '成功した',
            statusFailed: '失敗する。',
            oldCode: '旧コード。',
            newCode: '新しいコード。',
            operator: 'オペレーターマン',
            replaceDialogTitle: 'パーツ交換エントリ'
          },
          placeholder: {
            selectTemplate: '部品テンプレートを選択してください',
            partName: '部品名を入力してください',
            partCode: '部品コードを入力してください例fill Needle 001',
            specModel: '仕様モデルを入力してください',
            installDate: 'インストール日の選択',
            remark: 'コメント情報を入力してください',
            newCode: '新規品目コードを入力してください',
            replaceReason: '交換理由を選択してください。',
            ratedLife: '寿命を入力してください。'
          },
          tips: {
            template: '部品テンプレートを選択すると、部品名、仕様モデル、および定格寿命が自動的に入力されます。',
            partName: '部品名はテンプレートによって自動的に入力され、手動で修正できません',
            partCode: '在库管理およびペギング用の部品の一意の品目コード',
            specModel: '仕様モデルはテンプレートによって自動的に入力され、手動で変更できません',
            ratedLife: '定格寿命はテンプレートによって自動的に入力され、部品の設計使用回数を表します',
            installDate: '部品が実際にデバイスに取り付けられた日付。使用回数の計算に使用されます。',
            remark: '追加情報を記録するオプションの入力'
          },
          replaceReason: {
            life: '耐用年数の達成',
            damage: '破損の障害',
            maintenance: '定期的なメンテナンス',
            changeover: '製品の種類変更',
            other: 'その他の'
          },
          table: {
            lifeProgress: '人生の進歩',
            remainingLife: '残りの寿命',
            status: '状態の状態',
            operation: 'オペレーション·オペレーション'
          }
        }
      }
    },
    production: {
      default: '生産管理の管理',
      recipe: {
        default: 'フォーミュラ管理',
        download: 'ダウンロードダウンロード',
        page: {
          desc: '生産フォーミュラ管理とパラメータ構成',
          recipe: 'レシピは？',
          recipeList: 'フォーミュラ·リスト',
          recipeCode: 'フォーミュラ番号',
          recipeName: 'フォーミュラ名',
          productType: '製品の種類',
          fillVolume: '充填量は',
          inUse: '使用中です。',
          notInUse: '未使用。',
          download: 'ダウンロードダウンロード',
          downloadAll: 'すべてダウンロード。',
          exportExcel: 'Excelのエクスポート',
          exportPdf: 'Pdfの書き出し',
          basicInfo: 'プロフィールプロフィール',
          axisParams: '軸位置パラメータ',
          speedParams: '速度パラメータ',
          delayParams: '遅延とプロセスパラメータ',
          analysis: 'インテリジェント分析',
          fillAngle: '充填角度。',
          suckBackAngle: '吸引角度です。',
          fillAxisInit: '充填軸の初期位置',
          fillAxisReach: '充填シャフトがある',
          fixAxisInit: '固定軸初期ビット',
          fixAxisReach: '固定シャフト位置',
          fixAxisPreLift: '固定軸プリリフト',
          stopperAxisInit: 'ボトルの初期位置',
          stopperAxisPrePress: 'ボトルシャフト予圧',
          stopperAxisReach: 'ボトルを設置。',
          fillAxisInitSpeed: '充填軸の初期速度',
          fillAxisReachSpeed: '充填シャフトの位置速度',
          fixAxisInitSpeed: '固定軸の初期速度',
          fixAxisReachSpeed: '固定軸位置速度',
          fixAxisPreLiftSpeed: '固定軸のプリリフト速度',
          stopperAxisInitSpeed: 'ボトルの初期速度',
          stopperAxisPrePressSpeed: 'ボトルシャフトの予圧速度',
          stopperAxisReachSpeed: 'ボトルの速度を保つ。',
          fillDelay: '充填の遅延',
          vacuumDelay: '真空遅延の発生',
          fillSpeed: '充填速度は',
          suckBackSpeed: '速度を取り戻す。',
          usageCount: '使用回数は',
          faultRate: '故障率は',
          avgQualifiedRate: '平均合格率は',
          lastUsed: '最後の使用'
        }
      },
      order: {
        default: '生産注文の種類',
        completed: {
          title: '注文の完了'
        },
        running: {
          title: '進行中の注文'
        },
        planned: {
          title: 'オーダーの計画'
        },
        add: 'その他追加',
        edit: '編集者。',
        delete: '削除する',
        download: 'ダウンロードダウンロード',
        export: 'エクスポートエクスポート',
        print: '印刷する',
        page: {
          desc: '生産注文管理とレポートエクスポート',
          completed: '注文の完了',
          running: '進行中の注文',
          planned: 'オーダーの計画',
          orderNo: '注文番号',
          productName: '製品名：製品名',
          recipeName: 'レシピは？',
          batchNo: 'ロット番号',
          targetQty: 'ターゲット数',
          completedQty: '完了数量は',
          qualifiedQty: '適格な数量',
          unqualifiedQty: '不適格な数量',
          qualifiedRate: '合格率は',
          operator: 'オペレーショナル·スタッフ',
          startTime: '開始時間です。',
          endTime: '終了時間。',
          runtime: '実行時間は',
          alarmCount: 'アラームの数',
          status: '状態の状態',
          progress: '生産の進捗状況',
          estimatedEnd: '完成予定です。',
          priority: '優先順位は',
          queuePosition: 'キューの位置',
          downloadCount: 'ダウンロード回数は',
          download: 'レポートのダウンロード',
          downloadSelected: 'ダウンロード選択。',
          downloadAll: '全てダウンロード。',
          exportPdf: 'Pdfレポートのエクスポート',
          noOrderProduction: '受注なしの生産',
          orderReport: '受注生産レポート',
          reportBasicInfo: 'プロフィールプロフィール',
          reportProductionStats: '生産統計の作成',
          reportQualityStats: '品質統計学',
          reportAlarmDetail: 'アラームの詳細',
          reportOperatorDetail: 'オペレーターの詳細',
          reportGeneratedBy: '成人の報告',
          reportGeneratedAt: 'レポート生成',
          high: 'ハイ·ハイ',
          normal: '普通に',
          low: '低い。',
          statusCompleted: '完了しました',
          statusRunning: '生産中の',
          statusPlanned: '生産される。',
          selectOrderTip: 'ダウンロードする注文を選択してください',
          plannedNoDownload: 'レポートのダウンロードはサポートされていないスケジュールオーダー',
          runningNoDownload: '進行中の注文はサポートされていませんレポートのダウンロード（システム設定で有効になります）',
          add: '新規注文の追加',
          edit: '注文の編集',
          delete: '削除する',
          orderNoPlaceholder: '注文番号を入力してください。',
          productNamePlaceholder: '製品名を入力してください',
          recipeNamePlaceholder: 'レシピを選択してください',
          batchNoPlaceholder: 'ロット番号を入力してください。',
          startTimePlaceholder: '開始時間を選択してください。',
          estimatedEndPlaceholder: '完了予定時間を選択してください',
          tips: {
            orderNo: '生産オーダーを識別およびペグするためのオーダーの一意の番号',
            productName: 'この製品の名称',
            recipeName: '生産プロセス·パラメータを決定する生産フォーミュラの選択',
            batchNo: '品質ペギング用の生産ロット番号',
            targetQty: '本生産の目標数量',
            startTime: '生産開始の予定時刻',
            estimatedEnd: '生産完了までの見込み時間'
          },
          addSuccess: '新規注文成功',
          editSuccess: '注文の編集に成功',
          deleteSuccess: '注文の削除が成功しました',
          deleteConfirm: '注文“{order No}”を削除してもよろしいですかこの操作は回復できません。',
          formRequired: '完全な注文情報をご記入ください'
        }
      }
    },
    system: {
      default: 'システムの設定',
      user: {
        default: 'ユーザー管理',
        page: {
          title: 'ユーザー管理',
          pageDesc: 'ロール割り当て、ステータス管理、パスワードリセットをサポートするシステムユーザーアカウントの管理',
          username: 'ユーザー名',
          usernamePlaceholder: 'ユーザー名を入力してください。',
          realName: '本名は。',
          realNamePlaceholder: '本名を入力してください。',
          email: 'メールボックス',
          emailPlaceholder: 'メールをご入力ください。',
          phone: '携帯電話番号',
          phonePlaceholder: '電話番号を入力してください。',
          role: '役割の役割',
          rolePlaceholder: '役割を選択してください。',
          dept: '部門別部門',
          deptPlaceholder: '部門を選択する。',
          status: '状態の状態',
          createTime: '創造の時間',
          password: 'コードコードコード',
          passwordPlaceholder: 'コードを入力してください。',
          confirmPassword: 'パスワードの確認',
          sex: '性別は',
          remark: '備考：コメント',
          remarkPlaceholder: 'ご入力くださいコメント',
          add: '追加ユーザー数',
          edit: 'ユーザーの編集',
          resetPassword: 'パスワードのリセット',
          unlock: 'ロック解除',
          unlockConfirm: 'このユーザーをロック解除してもよろしいですか',
          unlockSuccess: 'ユーザーのロック解除に成功',
          import: 'インポート',
          export: 'エクスポートエクスポート',
          passwordMismatch: '2回入力されたパスワードが一致しません',
          resetPasswordSuccess: 'パスワードのリセット成功'
        }
      },
      audit: {
        default: '監査ログ',
        search: '検索/リセット/リフレッシュ',
        export: 'エクスポートエクスポート',
        detail: '詳細はこちら',
        page: {
          title: '監査ログ',
          myTitle: '私の作戦日誌',
          pageDesc: 'システムのすべての操作ログを記録し、ユーザー、操作タイプ、時間範囲などの条件で選別することをサポートする',
          userName: 'ユーザー名',
          action: 'オペレーションの種類',
          target: '運用目標は',
          timeRange: '時間枠の設定',
          startTime: '開始時間です。',
          endTime: '終了時間。',
          oldValue: '古い値。',
          newValue: '新しい価値観',
          result: '操作の結果',
          ip: 'Ipアドレス',
          createdAt: '創造の時間',
          detail: '詳細はこちら',
          detailTitle: '監査ログの詳細',
          verify: 'レビュー：review'
        }
      },
      config: {
        default: 'パラメータ設定',
        edit: '編集者。',
        export: 'エクスポートエクスポート',
        refresh: 'キャッシュのリフレッシュ',
        param: {
          sessionTimeout: {
            view: 'セッション·タイムアウト 表示',
            edit: 'セッション·タイムアウト 編集'
          },
          defaultPageSize: {
            view: 'デフォルトのページング·サイズ 表示',
            edit: 'デフォルトのページング·サイズ 編集'
          },
          defaultLanguage: {
            view: 'デフォルト言語 表示',
            edit: 'デフォルト言語 編集'
          },
          watermarkEnabled: {
            view: 'ウォーターマークスイッチ 表示',
            edit: 'ウォーターマークスイッチ 編集'
          },
          watermarkText: {
            view: '透かし文字 表示',
            edit: '透かしテキスト 編集'
          },
          plcHost: {
            view: 'Plcホスト 表示',
            edit: 'Plcホスト 編集'
          },
          plcPort: {
            view: 'Plcポート 表示',
            edit: 'Plcポート 編集'
          }
        },
        childrenMenu: {
          title: 'パラメータ設定',
          desc: 'システムパラメータ構成管理',
          save: '保存する。',
          reset: 'リセットする',
          loading: '設定ロード中です。お待ちください。..',
          loadError: '構成ロードに失敗しました',
          loadErrorDesc: 'ネットワーク接続を確認するか、管理者に問い合わせてください',
          reload: 'リロードする',
          incomplete: '不完全な構成',
          incompleteDesc: '{count}個の初期化されていない設定項目が検出されました。現在のページは編集と保存が禁止されています。',
          missingKeys: '欠けている構成要素：',
          incompleteTip: '管理者に連絡して設定初期化 Sqlを実行するか、下のボタンをクリックして再ロードしてください。',
          system: {
            title: 'システム構成',
            sessionTimeout: 'セッション·タイムアウト',
            minutes: '数分。',
            defaultPageSize: 'デフォルトのページサイズ',
            defaultLanguage: 'デフォルトの言語',
            dateFormat: '日付形式',
            sessionTimeoutTip: 'ユーザーがログインした後、アクションなしで自動的にログインを終了する時間',
            defaultPageSizeTip: 'リストページのデフォルトでは、1ページあたりに表示されるデータ数',
            defaultLanguageTip: 'システムのデフォルト表示言語（中国語/英語）',
            dateFormatTip: 'システム内の日付の表示形式yyy Mm Ddなど'
          },
          security: {
            title: 'セキュリティ設定',
            watermarkEnabled: 'ウォーターマークの有効化',
            watermarkText: 'ウォーターマーク文字',
            watermarkPlaceholder: '透かし文字を入力してください',
            watermarkTextTip: '透かしで表示されるテキスト空白の場合は現在のユーザ名を使用',
            loginFailedThreshold: 'ログインのしきい値',
            loginFailedThresholdTip: '连続ログインがその回数に达した、通知とアカウントロックをトリガする',
            lockDurationMinutes: 'アカウントロックの長さ',
            lockDurationMinutesTip: 'アカウントがロックされてからどのくらいの時間が自動的にロックされますか？',
            watermarkEnabledTip: 'ページに透かしを表示するかどうか（スクリーンショットの漏洩防止）'
          },
          export: {
            title: '設定のエクスポート',
            format: 'エクスポート·フォーマット',
            filename: 'ファイル名プレフィックス',
            pdfWatermarkEnabled: 'Pdfウォーターマークの有効化',
            pdfWatermarkEnabledTip: 'Pdfの書き出し時にpdfに透かしを追加するかどうか',
            pdfWatermarkText: 'Pdf透かし文字',
            pdfWatermarkPlaceholder: 'Pdf透かし文字を入力してください',
            pdfWatermarkTextTip: 'Pdfに表示される透かし文字（空白のはのユーザー名を使用）'
          },
          device: {
            title: 'デバイスの設定',
            maxOnlineDevices: '最大オンラインデバイス数',
            deviceName: 'デバイス名',
            deviceNameTip: 'ページ表示および通知用のデバイスの表示名',
            deviceCode: 'デバイスコーディング',
            deviceCodeTip: 'ユニットを識別するユニットの一意の番号',
            deviceRegion: '機器エリア',
            deviceRegionTip: 'タイムゾーンとローカリゼーションのためのデバイスの国/都市',
            deviceInstallDate: '設置日付',
            deviceInstallDateTip: 'デバイスの耐用年数を計算するためのデバイスの設置日',
            partLifeSettingsTitle: 'パーツライフアラート設定',
            partLifeReminderEnabled: '部品ライフスパンのアラートを有効にする',
            partLifeReminderEnabledTip: '部品の有効期限の警告を有効にするかどうか',
            partLifeThreshold: 'ライフタイムアラートしきい値',
            partLifeThresholdTip: '部品の残存寿命がこの割合を下回ると、アラートがトリガーされます。',
            partLifeRemindInterval: 'リマインダー間隔',
            intervalHour: '1時間ごとに',
            intervalShift: '各シフトごとに',
            intervalDay: '毎日。',
            partLifeRemindIntervalTip: '部品寿命アラートの繰り返し頻度毎時/シフト毎/日',
            snoozeInterval: '間隔は後で。',
            snooze5min: '5分。',
            snooze10min: '10分です',
            snooze30min: '30分。',
            snooze1hour: '1時間。',
            snooze2hour: '2時間です',
            snoozeIntervalTip: '“後でリマインダー”機能の遅延時間の設定',
            partLifeSnoozeIntervalTip: 'ユーザーが“後でリマインダー”をクリックした後、どのくらいの時間が経過してから再度リマインダーが発生しますか？'
          },
          order: {
            title: 'オーダーの設定',
            autoComplete: 'オートコンプリート',
            productionControl: '生産の管理',
            allowNoOrderProduction: '受注なし生産の許可',
            allowNoOrderProductionTip: '生産注文なしで生産を開始できるかどうか',
            noOrderProductionHighlight: 'No Order Productionハイライト',
            noOrderProductionHighlightTip: '无注文时にページ上でハイライト表示をするかどうか',
            orderSwitchConfirm: '注文切り替えの確認',
            orderSwitchConfirmTip: '生産オーダーを切り替える際、確認が必要かどうか',
            autoArchiveCompleted: '完了したオーダーの自動アーカイブ',
            autoArchiveCompletedTip: '注文完了後に自動的にアーカイブされるかどうか',
            statDisplay: '統計の表示',
            showOperatorName: 'オペレーター名の表示',
            showOperatorNameTip: 'オーダーリストおよびにオペレータ名を表示するかどうか',
            showAlarmCount: 'アラーム数の表示',
            showAlarmCountTip: 'オーダー·リストおよび詳細にアラーム数量が表示されるかどうか',
            showRuntime: '実行時間の表示',
            showRuntimeTip: '受注リストおよび詳細に実行時間を表示するかどうか',
            reportConfig: 'レポート構成',
            reportIncludeAlarmDetail: 'アラームの詳細を含むレポート',
            reportIncludeAlarmDetailTip: '受注レポートをエクスポートするときにアラーム詳細を含めるかどうか',
            reportIncludeOperatorDetail: 'レポートにはオペレータの詳細が含まれます',
            reportIncludeOperatorDetailTip: '受注レポートをエクスポートするときにオペレータ詳細を含めるかどうか',
            reportIncludeDownloadCount: 'レポートにはダウンロード数が含まれています',
            reportIncludeDownloadCountTip: '受注レポートのエクスポート時にダウンロード回数を含めるかどうか',
            allowRunningOrderDownload: '実行中の注文のダウンロードを許可する',
            allowRunningOrderDownloadTip: '実行中の受注レポートのダウンロードを許可するかどうか'
          },
          emailLog: {
            title: 'メール·ログ',
            searchPlaceholder: '受信者/件名/設定名の検索',
            statusFilter: 'ステータスのフィルタリング',
            statusSending: '送信中です。',
            statusSuccess: '成功した',
            statusFailed: '失敗する。',
            configFilter: 'フィルタの構成',
            batchDelete: '一括削除',
            refreshBtn: 'リフレッシュする。',
            configName: '構成名の設定',
            recipient: '受取人',
            subject: 'メールの件名',
            template: 'テンプレートの使用',
            exportBtn: 'エクスポートエクスポート',
            deleteBtn: '削除する',
            status: '状態の状態',
            retryCount: '再試行回数',
            duration: '送信に時間がかかる',
            errorMsg: 'エラーメッセージの表示',
            sendTime: '送信時間です。',
            operations: 'オペレーション·オペレーション',
            viewDetail: '詳細はこちら',
            delete: '削除する',
            detailTitle: 'Mail Logの詳細',
            logId: 'ログid',
            cc: 'Ccのコピー',
            ip: 'Ipアドレス',
            emailContent: 'メールの内容',
            close: '閉店。',
            loadFailed: 'メッセージログのロードに失敗しました',
            detailFailed: 'ログ詳細のロードに失敗しました',
            deleteConfirm: 'このログを削除してもよろしいですか？',
            deleteTitle: '削除の確認',
            deleteSuccess: '削除に成功',
            batchDeleteConfirm: '選択した{count}個のログを削除してもよろしいですか',
            batchDeleteSuccess: '一括削除成功'
          },
          notification: {
            title: '通知の設定',
            autoReadDays: '自動読取り日数',
            autoReadDaysTip: '通知が指定日数を経过すると的に既読とマークされる',
            soundEnabled: '音のリマインダー。',
            soundEnabledTip: '新しい通知を受信したときに音声リマインダーを再生するかどうか',
            unitDay: '神よ。'
          },
          licenseSetting: {
            title: '認可の設定',
            expiringDays: '有効期限リマインダー日数',
            expiringDaysTip: '承認期限が切れるまでの日数',
            gracePeriod: 'Grace Period',
            gracePeriodTip: '権限満了後の継続使用が許可される猶予日数',
            checkInterval: 'チェック間隔',
            checkIntervalTip: '認可ステータスを定期的にチェックする間隔',
            unitDay: '神よ。',
            unitHour: '1時間あたり。'
          },
          license: {
            manageTitle: '権限委譲管理',
            refresh: 'リフレッシュする。',
            importLicense: '認可のインポート',
            download: 'ライセンスのダウンロード',
            statusValid: '有効な権限',
            statusInvalid: '無効な権限',
            expireTime: '有効期限',
            remaining: '残り時間は',
            projectName: 'プロジェクト名',
            customerName: 'クライアント名',
            detailTitle: '認可の詳細',
            licenseId: '認証id',
            projectId: 'プロジェクトid',
            licenseKey: '認証コード',
            licenseType: '認可の種類',
            maxDevices: '機器の最大数',
            maxUsers: '最大ユーザー数',
            createdAt: '創造の時間',
            activatedAt: 'アクティベーション時間。',
            issuedAt: '発行時期のお知らせ',
            contact: '連絡先は',
            phone: '連絡先の電話',
            email: 'メールボックス',
            unlimited: '制限なし。',
            features: '機能性の特徴',
            allFeatures: '全機能。',
            machineBind: 'マシン·バインディング',
            currentMachineId: '現在のマシンid',
            boundMachineId: 'マシンidの結合',
            notBoundAny: 'Unboundシングル',
            matchStatus: '一致のステータス',
            matched: 'マッチした。',
            notMatched: 'マッチしない。',
            timeGuard: 'タイムガード。',
            timeGuardStatus: 'タイムガードの状態',
            enabled: '有効化された',
            notInitialized: '初期化されない',
            lastVerified: '最終検証時刻',
            serverTime: 'サーバーの時間',
            operation: 'オペレーション·オペレーション',
            networkDiagnosis: 'ネットワーク診断',
            fileInfo: 'ライセンスファイル情報',
            filePath: 'ファイルパス',
            fileName: 'ファイル名：file Name',
            fileSize: 'ファイルサイズ',
            lastModified: '最終修正の時間',
            noLicenseFile: '許可書類なし',
            importDialogTitle: '認可のインポート',
            importTip: '.lic形式の承認ファイルを選択してください',
            dragUpload: 'ファイルをここにドラッグするか、アップロードをクリックします。',
            cancel: 'キャンセル。',
            confirmImport: 'インポートの確認',
            licenseManager: {
              brandTitle: '認可管理システム',
              brandDesc: '安全で安定した信頼性の高いソフトウェアライセンスソリューション',
              featureRsa: 'Rsa 非対称暗号化',
              featureTimeGuard: 'タイムフォールバック防止',
              featureMachineBind: 'マシンコードハードウェアバインディング',
              importFormTitle: '承認ファイルのインポート',
              statusValid: '有効な権限',
              statusInvalid: '無効な権限',
              expireTime: '有効期限',
              permanentValid: '永久に有効',
              currentMachineId: '現在のマシンコード',
              copy: 'レプリケーション',
              copySuccess: 'レプリケーション成功',
              copyFailed: 'レプリケーションの失敗',
              machineIdTip: 'このマシンコードをサプライヤーに送信して認証ファイルを生成してください',
              dragUploadTip: '.lic認証ファイルをここにドラッグするか、アップロードをクリックします。',
              fileSizeTip: '仅支持 .lic 格式的授权文件',
              remove: '削除する。',
              pleaseSelectFile: '最初に承認ファイルを選択してください',
              importSuccessTitle: '承認のインポートが成功しました',
              importSuccess: '承認ファイルのインポートに成功しました',
              licenseId: '認証id',
              project: 'プロジェクト名',
              licenseType: '認可の種類',
              issuedAt: '発行時期のお知らせ',
              maxUsers: '最大ユーザー数',
              unlimited: '制限なし。',
              importLicense: '認可のインポート',
              enterSystem: 'システムへのアクセス',
              refreshStatus: 'ステータスのリフレッシュ',
              cannotGetStatus: '認可ステータスを取得できませんでした',
              typeTrial: 'トライアル版',
              typeStandard: 'スタンダード·エディション',
              typeEnterprise: 'エンタープライズ版',
              typePerpetual: '永久版です。',
              reasonUnknown: '原因不明。',
              reasonFileNotFound: '認証ファイルが存在しないか、検証に失敗しました',
              reasonProjectMismatch: 'アイテムの不一致',
              reasonMachineMismatch: 'マシンコードの不一致ハードウェアバインディング',
              reasonExpired: '権限が切れた',
              reasonMissingFeatures: '機能権限の欠如',
              reasonTimeRollback: 'システム時間のロールバックが検出されました',
              reasonNetworkSyncFailed: 'ネットワーク時間の調整に失敗しました'
            }
          }
        }
      },
      permission: {
        default: '権限構成',
        save: '保存する。',
        reset: 'リセットする',
        refresh: 'キャッシュのリフレッシュ',
        page: {
          title: '権限構成',
          desc: 'ロール権限管理',
          expandAll: '全てを展開。',
          collapseAll: '全てを閉じる。',
          roleList: '登場人物一覧',
          current: '現在は',
          noRole: '役割なし。',
          permissionTree: 'アクセス権ツリー',
          all: 'すべてのもの',
          menu: 'Menuメニュー',
          button: 'ボタンを押す。',
          param: '参数',
          searchPlaceholder: '検索権限..。',
          selectRoleTip: '権限設定用の左側のロールを選択してください',
          save: '保存する。',
          reset: 'リセットする',
          selected: '選択する。',
          saveSuccess: 'アクセス権の保存に成功',
          saveFailed: 'アクセス権の保存に失敗しました',
          confirmReset: '権限をリセットしますか？',
          resetSuccess: '権限のリセットが成功しました',
          selectedCount: '{count}エントリが選択されました',
          halfSelectedCount: '{count}項目を半分選択',
          totalCount: '合計{count}項目'
        }
      },
      device: {
        default: 'オンライン管理',
        kick: '装備を落とす。',
        delete: 'デバイスの削除',
        page: {
          title: 'オンライン管理',
          pageDesc: 'オンラインデバイスとユーザー管理',
          onlineDevices: 'オンラインデバイス',
          unlimited: '制限なし。',
          maxDevices: '機器の最大数',
          onlineUsers: 'オンライン利用者',
          usageRate: 'オンライン利用率',
          searchPlaceholder: 'デバイスまたはユーザーを検索します。..',
          filterStatus: 'ステータスのフィルタリング',
          statusOnline: 'オンラインで',
          statusOffline: 'オフラインで。',
          deviceName: 'デバイス名',
          deviceNameTip: 'デバイスの表示名',
          deviceInfo: 'デバイス情報',
          user: 'ユーザーは',
          ip: 'Ipアドレス',
          loginTime: '登録時間は',
          lastActive: '最後のアクティブ時間',
          lastActiveTime: '最後のアクティブ時間',
          status: '状態の状態',
          operation: 'オペレーション·オペレーション',
          kick: 'キックオフ。',
          kickConfirm: '本当にこのデバイスを削除しますか？',
          kickConfirmTitle: '装備を確認。',
          kickWarningTitle: '機器の削除警告',
          kickWarningDesc: 'デバイス{device Name}をキックしてもよい',
          kickSuccess: '装備は撤去された。',
          kickFailed: '機器の故障。',
          delete: '削除する',
          deleteConfirm: 'オフラインのデバイスを削除してもよろしいですか',
          deleteConfirmTitle: 'デバイス削除の確認',
          deleteWarningTitle: 'デバイス警告の削除',
          deleteWarningDesc: 'オフライン·デバイス{device Name}を削除してもよろしいですか',
          deleteSuccess: 'デバイスは削除された。',
          deleteFailed: 'デバイスの削除に失敗しました',
          fetchFailed: 'デバイスリストの取得に失敗しました',
          unknownDevice: '不明なデバイス',
          currentDevice: '現在の設備',
          refresh: 'リフレッシュする。',
          refreshStatus: 'ステータスのリフレッシュ',
          refreshSuccess: 'ステータス更新済み',
          refreshStatusSuccess: 'ステータスの更新は成功しました',
          refreshStatusFailed: 'ステータスの更新に失敗しました',
          noData: 'データなし。',
          loading: '装填中···'
        }
      }
    },
    superPanel: {
      default: 'スーパーパネル',
      dict: {
        default: '辞書の管理',
        page: {
          title: '辞書の管理',
          pageDesc: 'システムのディクショナリ·タイプとディクショナリ·エントリの管理、多言語構成のサポート',
          typeList: '辞書タイプの一覧',
          typeName: '辞書の名前',
          typeCode: '辞書のコーディング',
          itemLabelRequired: '辞書項目ラベルを入力してください',
          itemValueRequired: '辞書項目値を入力してください',
          typeCodePlaceholder: '辞書コードを入力',
          typeNamePlaceholder: '辞書名を入力してください',
          typeNameRequired: '辞書名を入力してください',
          typeCodeRequired: '辞書コードを入力',
          itemList: '辞書項目の一覧',
          itemLabel: '辞書タグ',
          itemValue: '辞書キー値',
          itemValuePlaceholder: '辞書キーを入力してください',
          itemLabelPlaceholder: '辞書ラベルを入力してください',
          itemStatus: '状態の状態',
          addItem: '辞書エントリの追加',
          addType: '新しい辞書タイプ',
          deleteItemConfirm: '辞書エントリを削除してもよろしいですか？',
          deleteTypeConfirm: 'この辞書タイプを削除してもよろしいですか',
          editItem: '辞書項目の編集',
          editType: '辞書タイプの編集',
          tips: {
            typeName: 'ページ内で表示する辞書タイプの表示名',
            typeCode: '辞書型の一意のエンコーディングで、コード内で参照され、作成後は変更できません。',
            description: '辞書タイプの詳細な説明、辞書の目的を説明します。',
            status: 'ディクショナリ·タイプの有効状態。無効にすると、そのディクショナリの下にあるすべてのディクショナリ·アイテムが使用できなくなります。',
            sort: '辞書型の表示ソート、数値が小さいほど上位',
            itemLabel: 'ページ内で表示する辞書項目の表示タグ',
            itemValue: 'コードに格納および比較するための辞書項目の実際の値',
            itemStatus: 'ディクショナリ·アイテムの有効状態。無効にすると使用できなくなります。',
            itemSort: '辞書項目の表示ソート、数値が小さいほど上位',
            itemRemark: 'ディクショナリ·エントリの注釈情報（オプションで入力）'
          }
        }
      },
      dept: {
        default: 'セクターマネジメント',
        page: {
          title: 'セクターマネジメント',
          pageDesc: 'ツリー階層管理をサポートする組織部門構造の管理',
          rootDept: 'トップセクター',
          deptName: '部門の名称',
          deptNamePlaceholder: '部門名を入力してください',
          deptNameRequired: '部門名を入力してください',
          orderNum: 'ソートを表示',
          leader: '責任者は',
          phone: '連絡先の電話',
          email: 'メールボックス',
          addChild: 'サブセクターの追加',
          parentDept: 'トップ>>',
          parentDeptPlaceholder: '上級部門の選択',
          addDept: '新部門の追加',
          deleteConfirm: 'この部門を削除してもよろしいですか？',
          editDept: '編集部です。',
          tips: {
            parentDept: 'その部署の上位部署を選択します。上位部署は空白のままです。',
            deptName: 'ページに表示する部門の表示名',
            orderNum: '部門の表示ソート、数値が小さいほど上位',
            leader: '部門長の氏名',
            phone: '部門の電話番号',
            email: '部門の連絡先メール',
            status: '部門の有効ステータス。無効にすると使用できなくなります。'
          }
        }
      },
      role: {
        default: 'ロール管理',
        page: {
          title: 'ロール管理',
          pageDesc: 'システムロールを管理し、ロールの追加、編集、削除をサポート',
          roleName: 'ロール名',
          roleNameRequired: 'ロール名を入力してください',
          roleCode: 'ロールコーディング',
          roleCodeRequired: 'ロールコードを入力してください。',
          addRole: '追加の役割',
          editRole: 'ロールの編集',
          deleteConfirm: 'このロールを削除してもよろしいですか',
          basicRoleCannotEdit: 'システム組み込みロールで編集が許可されていない',
          basicRoleCannotDelete: 'システム組み込みの役割は削除できません',
          tips: {
            roleName: 'ページ内で表示するロールの表示名',
            roleCode: 'コード内で参照されるロールの一意のエンコーディングで、作成後は変更できません。',
            status: 'ロールの有効状態。無効にすると使用できなくなります。',
            description: 'ロールの権限と目的を示すロールのな'
          }
        }
      },
      config: {
        default: 'パラメータ設定',
        pageTitle: 'パラメータ設定',
        childrenMenu: {
          title: 'パラメータ設定',
          desc: 'システムパラメータ構成管理',
          save: '保存する。',
          reset: 'リセットする',
          loading: '設定ロード中です。お待ちください。..',
          loadError: '構成ロードに失敗しました',
          loadErrorDesc: 'ネットワーク接続を確認するか、管理者に問い合わせてください',
          reload: 'リロードする',
          incomplete: '不完全な構成',
          incompleteDesc: '{count}個の初期化されていない設定項目が検出されました。現在のページは編集と保存が禁止されています。',
          missingKeys: '欠けている構成要素：',
          incompleteTip: '管理者に連絡して設定初期化 Sqlを実行するか、下のボタンをクリックして再ロードしてください。',
          plc: {
            title: 'Plc通信の略。',
            protocol: '通信プロトコル',
            protocolTip: 'Plcと通信するプロトコルの種類',
            host: 'Plcアドレス',
            hostTip: 'Plcデバイスのipアドレス',
            port: 'ポートポートポート',
            portTip: 'Plc通信ポート、modbusデフォルト50 2',
            unitId: 'ユニットid',
            unitIdTip: 'Plcステーション番号/ユニットid、通常は1',
            timeout: 'タイムアウト時間',
            retryCount: '再試行回数',
            pollSettings: 'ポーリング設定',
            pollFast: '高速ポーリング間隔',
            pollFastTip: '高周波データ収集間隔',
            pollSlow: '低速ポーリング間隔',
            pollSlowTip: '低周波データ収集間隔',
            plcProtocolTip: 'Plc通信で使用されるプロトコル（modbus Tcpなど）',
            plcHostTip: 'Plcデバイスのipアドレス',
            plcPortTip: 'Plcデバイスのポート番号',
            plcUnitIdTip: 'Modbus通信のセルid/スレーブアドレス',
            pollFastIntervalTip: '高速ポーリングモードでplcデータを読み取る間隔',
            pollSlowIntervalTip: '低速ポーリングモードでのplcデータの読み取り間隔',
            reconnectDelay: '再接続の遅延',
            reconnectDelayTip: 'Plc接続が切断された後、再接続を試みるまでの時間',
            enablePoll: 'ポーリングの有効化',
            enablePollTip: 'Plcデータポーリング取得を有効にする',
            enableWriteAudit: '書き込み監査の有効化',
            enableWriteAuditTip: 'Plc書き込み操作の監査ログを記録するかどうか',
            maxWriteRetry: '書き込み最大再試行',
            maxWriteRetryTip: 'Plc書き込み操作失敗後の再試行の最大回数'
          },
          connection: {
            title: '接続の設定',
            heartbeatInterval: 'ハートビート間隔',
            heartbeatIntervalTip: '接続を維持するためのweb Socket接続のハートビートパケット送信間隔',
            deviceStatusCheckInterval: 'プレゼンス·チェック間隔',
            deviceStatusCheckIntervalTip: 'デバイスのオンライン/オフライン状態を定期的にチェックする間隔',
            deviceOfflineThreshold: 'プレゼンス·オフラインのしきい値',
            deviceOfflineThresholdTip: 'デバイスが応答しなくなってから、オフラインと判定された期間',
            unitSecond: '秒ごとに',
            maintenanceCheckInterval: '保守点検の間隔',
            maintenanceCheckIntervalTip: '機器のメンテナンス状態、部品寿命、ライセンス満了間隔を定期的にチェックする',
            unitHour: '1時間あたり。',
            partLifeStatInterval: '部品寿命統計',
            partLifeStatIntervalTip: 'Plcからカウンタデータを定期的に読み取り、部品寿命の間隔を更新します。',
            unitMinute: '数分。'
          },
          email: {
            title: 'メールボックスの構成',
            addBtn: '新しい構成',
            refreshBtn: 'リフレッシュする。',
            configName: '構成名の設定',
            provider: 'サービスプロバイダー。',
            smtpHost: 'Smtpサーバ',
            smtpPort: 'ポートポートポート',
            portTip: 'Plc通信ポート、modbusデフォルト50 2',
            emailAccount: 'メールアカウント番号',
            senderName: '送信者名',
            isDefault: 'デフォルトかどうか',
            default: 'デフォルト',
            status: '状態の状態',
            operations: 'オペレーション·オペレーション',
            addTitle: '新しいメールボックスの構成',
            editTitle: 'メールボックス構成の編集',
            editBtn: '編集者。',
            deleteBtn: '削除する',
            testBtn: 'テストテスト',
            setDefaultBtn: 'デフォルトに設定する',
            configNamePlaceholder: '構成名を入力してください',
            searchPlaceholder: '設定名またはメールアカウントの検索',
            useSSL: 'Sslの使用',
            authCode: '認証コード',
            authCodePlaceholder: 'メールボックス認証コードを入力してください',
            authCodePlaceholderEdit: '空白は変更なし',
            authCodeTip: 'Qqメールボックスはsmtpサービスを開き、認証コードを取得する必要があります。',
            senderNamePlaceholder: '送信者名を入力してください',
            remark: '備考：コメント',
            cancelBtn: 'キャンセル。',
            saveBtn: '保存する。',
            confirmBtn: '決定する。',
            testEmailTitle: 'テストメールの送信',
            testConfigName: '構成名の設定',
            testReceiver: '宛先メールボックス',
            sendTestBtn: 'テストメールの送信',
            testReceiverRequired: 'テスト受信者メールボックスを入力してください',
            configNameRequired: '構成名を入力してください',
            providerRequired: 'プロバイダーを選択してください',
            smtpHostRequired: 'Smtpサーバのアドレスを入力してください',
            smtpPortRequired: 'Smtpポートを入力してください',
            emailAccountRequired: 'メールアカウントをご入力ください。',
            emailFormatError: 'メールボックスの形式が正しくない',
            authCodeRequired: 'メールボックス認証コードを入力してください',
            loadFailed: 'メールボックス構成リストのロードに失敗しました',
            addSuccess: '追加の成功',
            updateSuccess: '更新成功です。',
            deleteSuccess: '削除に成功',
            setDefaultSuccess: 'デフォルト構成に設定',
            enableSuccess: '有効化された',
            disableSuccess: '禁止された',
            testSendSuccess: 'テストメールが送信されました。',
            deleteTitle: '削除の確認',
            deleteConfirm: 'このメールボックス設定を削除してもよろしいですか',
            sendTimeout: '送信タイムアウト',
            sendTimeoutTip: 'メッセージ送信のタイムアウト時間ミリ秒',
            maxRetries: '最大再試行回数',
            maxRetriesTip: 'メール送信后の最大再数',
            retryDelay: '再試行間隔',
            retryDelayTip: 'メッセージの送信に失敗した後、再試行する時間（ミリ秒）'
          },
          language: {
            title: 'サポート言語',
            desc: 'システムのプリセット言語リストを管理し、システムがサポートする言語を設定します。変更後はバックエンドサービスの再起動が必要です。',
            tipTitle: '注意事項について',
            tipContent: 'デフォルトの言語設定を変更した後、バックエンドサービスを再起動する必要があります。設定ファイルの形式が正しいことを確認してください。そうでないと、システムの例外が発生する可能性があります。',
            tipExtra: 'ヒント：国旗アイコンはフロントエンドのsrc/assets/icons/svg/flags/ディレクトリにあります。新しい言語を追加する際には、対応する国旗svgファイルも追加してください。',
            loadFailed: '言語構成のロードに失敗しました',
            saveSuccess: '保存成功です。',
            saveFailed: '保存の失敗',
            emptyWarning: '設定内容は空にできません',
            resetInfo: '元のコンテンツにリセットされた',
            currentSupportedLangs: '現在サポートされる言語',
            viewLanguages: '言語を参照。',
            totalLangs: '[count]の言語',
            totalLangsUnit: '言語の種類'
          },
          translation: {
            title: '翻訳の設定',
            enabled: '有効化された',
            disabled: '未使用です。',
            basicSettings: '基本セットアップ',
            enableTranslation: '自動翻訳の有効化',
            enableTranslationTip: '有効にすると、国際化管理ページで自動翻訳機能を使用して、中国語コンテンツを他の言語にすばやく翻訳できます。',
            provider: '翻訳サービスプロバイダー',
            providerTip: '使用する翻訳サービスプロバイダを選択し、現在tencent Cloud Translationをサポートしています。',
            masterLanguage: '言語のマスター',
            masterLanguageTip: 'バッチ翻訳時のソース言語。すべての翻訳はこの言語に基づいて行われます。デフォルトの中国語。必要に応じて既存の他の言語パックに変更可能',
            tencentSettings: 'クラウドの翻訳。',
            secretId: 'Secret Idの',
            secretIdTip: 'Tencent Cloud Apiキー Id、tencent Cloudコンソール Access Management Api Key Managementから取得',
            secretIdPlaceholder: 'Cloud Secret Idを入力してください。',
            secretKey: 'Secret Keyの記事',
            secretKeyTip: 'Tencent Cloud Api Key、secret Idとペアにして使用、機密保持にご注意ください',
            secretKeyPlaceholder: 'Cloud Secret Keyを入力してください。',
            region: 'エリアエリア',
            regionTip: 'Tencent Cloudサービスの地理的位置、遅延を低減するためにサーバーに最も近い地域を選択することをお勧めします。',
            projectId: 'プロジェクトid',
            projectIdTip: 'テンセントクラウド翻訳プロジェクトid，デフォルト0 表示使用デフォルト項目',
            testConfig: 'テスト構成',
            testSuccess: '構成は有効で、翻訳テストは成功しました',
            testFailed: 'テスト失敗',
            existingLangs: '既存の言語。',
            tipTitle: '取扱説明書',
            tipContent: '設定が完了すると、国際化管理ページで自動翻訳機能を使用して、中国語コンテンツを他の言語にすばやく翻訳できます。翻訳サービスはtencent Cloudコンソールで開いてapiキーを取得する必要があります。'
          },
          upload: {
            title: '設定のアップロード',
            maxFileSize: 'ファイルの最大サイズ',
            maxFileSizeTip: 'アップロードできる単一ファイルの最大サイズ（mb）',
            allowedTypes: '許可されたファイルタイプ',
            allowedTypesTip: 'アップロードできるファイルの種類。複数の種類はカンマで区切られています例image、pdf、excel、word',
            uploadPath: 'ストレージ·パス',
            uploadPathTip: 'アップロードされたファイルのサーバ上の保存パス',
            enableAudit: 'アップロード監査の有効化',
            enableAuditTip: 'ファイルアップロード操作の監査ログを記録するかどうか'
          },
          audit: {
            title: '监査',
            retentionDays: '保持日数',
            retentionDaysTip: '監査ログがデータベースに保持される日数、超過すると自動的にクリーンアップ',
            autoArchive: '自動アーカイブ',
            autoArchiveTip: '保存期限を過ぎた監査ログを自動的にアーカイブするかどうか'
          }
        }
      },
      permission: {
        default: '権限構成',
        page: {
          title: '権限構成',
          desc: 'スーパー管理者権限構成管理',
          expandAll: '全てを展開。',
          collapseAll: '全てを閉じる。',
          roleList: '登場人物一覧',
          current: '現在は',
          noRole: '役割なし。',
          permissionTree: 'アクセス権ツリー',
          all: 'すべてのもの',
          menu: 'Menuメニュー',
          button: 'ボタンを押す。',
          param: 'パラメータ',
          selectRoleTip: '権限設定用の左側のロールを選択してください',
          selected: '選択する。',
          saveSuccess: 'アクセス権の保存に成功'
        }
      },
      feature: {
        default: '機能の構成',
        page: {
          title: 'プロジェクト機能の構成',
          pageDesc: '管理システムの各機能モジュールのスイッチ配置、スーパー管理者のみアクセス可能',
          categoryList: '機能の分類',
          resetAll: '全てリセット。',
          resetCategory: '現在の分類のリセット',
          reset: 'リセットする',
          modified: '修正された',
          defaultValue: 'デフォルト値',
          noData: '機能なしの配置',
          items: '項目の詳細',
          updateSuccess: '機能構成の更新に成功しました',
          resetSuccess: 'デフォルトにリセットされました',
          resetConfirm: 'この機能の設定をデフォルトにリセットしますか',
          resetCategoryConfirm: '現在の分類のすべての機能構成をデフォルトにリセットしますか',
          resetAllConfirm: 'すべての機能構成をデフォルトにリセットしてもよろしいですかこの操作は取り消し不可能です!'
        },
        category: {
          notification: '通知センター',
          email: 'メールボックスシステム',
          audit: '監査モジュール',
          auth: '認証機能',
          system: 'システムの機能'
        },
        notification: {
          system: {
            backupSuccess: 'データバックアップ成功の通知',
            backupSuccessDesc: 'データバックアップ成功後に通知を送信',
            backupFailed: 'データバックアップの失敗通知',
            backupFailedDesc: 'データバックアップ失敗後の通知の送信',
            expiring: '権限の失効が近づいている通知',
            expiringDesc: 'ライセンスの有効期限が近づいている場合にリマインダーを送信',
            expired: '権限の失効通知',
            expiredDesc: '権限の有効期限後の通知の送信'
          },
          user: {
            register: '新規ユーザー登録のお知らせ',
            registerDesc: '新規ユーザーの登録が成功したら、管理者に通知する',
            create: '管理者によるユーザー通知の作成',
            createDesc: '管理者がユーザー作成後に関係者に通知',
            update: 'ユーザー変更通知',
            updateDesc: 'ユーザー情報の変更後の管理者への通知',
            statusChange: 'ユーザーステータス変更通知',
            statusChangeDesc: 'ユーザーによるステータス変更後の通知の有効化/無効化',
            passwordReset: 'ユーザーパスワードリセット通知',
            passwordResetDesc: 'ユーザーパスワードがリセットされた場合、管理者に通知する',
            loginFailed: 'ユーザーログイン通知',
            loginFailedDesc: 'ユーザーが複数回ログインに失敗した後に管理者に通知する',
            roleChange: 'ユーザーロール/権限変更通知',
            roleChangeDesc: 'ユーザーロールまたは権限変更后の通知'
          },
          device: {
            paramChange: 'デバイスパラメータ変更通知',
            paramChangeDesc: '設備パラメータ変更後の関係者への通知',
            maintenanceReminder: '機器メンテナンスのリマインダー通知',
            maintenanceReminderDesc: '機器のメンテナンスが必要な場合にリマインダーを送信',
            partLifeWarning: '部品寿命アラート通知',
            partLifeWarningDesc: '部品寿命がしきい値に達した場合のアラートの送信'
          },
          production: {
            orderCreate: '生産オーダー作成通知',
            orderCreateDesc: '生産オーダー作成後の関係者への通知',
            orderUpdate: '生産オーダー変更のお知らせ',
            orderUpdateDesc: '生産注文変更後、関係者に通知する',
            orderComplete: '生産オーダー完了通知',
            orderCompleteDesc: '生産オーダー完了後に関係者に通知する',
            batchComplete: 'ロット完了通知',
            batchCompleteDesc: 'ロット完了后の'
          },
          config: {
            systemUpdate: 'システム構成変更の通知',
            systemUpdateDesc: 'システム構成変更後の管理者への通知',
            plcConnectionUpdate: 'Plc接続構成変更の通知',
            plcConnectionUpdateDesc: 'Plc接続構成変更後の通知',
            connectionUpdate: '接続構成変更の通知',
            connectionUpdateDesc: '接続設定の変更後の関係者への通知',
            deviceParamsUpdate: 'デバイスパラメータ変更通知',
            deviceParamsUpdateDesc: 'デバイスパラメータ変更后通知',
            exportUpdate: 'コンフィギュレーション変更通知のエクスポート',
            exportUpdateDesc: 'コンフィギュレーション変更のエクスポート後に管理者に通知する',
            securityUpdate: 'セキュリティ構成変更の通知',
            securityUpdateDesc: 'セキュリティ設定変更後の管理者への通知'
          },
          security: {
            logExport: '監査ログのエクスポート通知',
            logExportDesc: '監査ログがエクスポートされると管理者に通知する',
            logView: '监査ログ表示通知',
            logViewDesc: '监査ログが表示されたときに管理者に通知',
            permissionChange: 'パーミッション設定変更の通知',
            permissionChangeDesc: 'パーミッション設定の変更後に管理者に通知する',
            dataExport: '機密データのエクスポート通知',
            dataExportDesc: '機密データがエクスポートされたときに管理者に通知する',
            dataDelete: 'データ削除アクションの通知',
            dataDeleteDesc: 'データが削除されたときに管理者に通知'
          }
        },
        email: {
          user: {
            passwordReset: '管理者パスワードリセットメール',
            passwordResetDesc: '管理者がユーザーパスワードをリセットした後、新しいパスワードをユーザーメールボックスに送信',
            forgotPasswordCode: 'パスワードを忘れたメール',
            forgotPasswordCodeDesc: 'ユーザがパスワードを忘れた場合にメールボックスに認証コードを送信する',
            resetSuccess: 'パスワードリセット成功通知メール',
            resetSuccessDesc: 'パスワードリセット成功後に通知メールを送信'
          },
          notification: {
            forward: '通知転送メール',
            forwardDesc: 'ユーザーメールボックスへのシステム通知の転送'
          },
          device: {
            alarm: 'デバイスアラームメール',
            alarmDesc: 'デバイスのアラーム時にメール通知を送信'
          }
        },
        audit: {
          user: 'ユーザー管理監査',
          userDesc: 'ユーザーのログイン、、追加削除改検、パスワードリセットなどの操作をする',
          permission: 'アクセス権管理監査',
          permissionDesc: 'ロールの追加削除改、権限配置変更などの操作をする',
          config: 'システム構成監査',
          configDesc: 'システム、セキュリティ、plc、エクスポート、接続、デバイス、注文の変更を',
          device: '設備管理監査',
          deviceDesc: '設備状態、パラメータ変更、部品寿命、アラーム処理などの操作を記録する',
          production: '生産管理監査',
          productionDesc: 'レシピのダウンロード、注文の追加添削、注文のダウンロードなどの操作を記録する',
          data: 'データ管理監査',
          dataDesc: 'データのエクスポート、データの詳細表示などの操作の記録',
          plc: 'Plc操作監査',
          plcDesc: 'Plcの読み書き、接続、切断、再接続などの操作を記録します。',
          audit: '自己監査の監査',
          auditDesc: '监査表示、监査、エクスポートなどの操作をする',
          license: '管理監査の委任',
          licenseDesc: '認可インポート、認可失効などのアクションの記録',
          email: 'メールボックス構成監査',
          emailDesc: 'メールボックスの配置変更、メールボックスのログ削除などの操作を記録する'
        },
        auth: {
          register: '登録機能です。',
          registerDesc: 'ユーザーが自己登録できるかどうか',
          forgotPassword: 'パスワード忘れ機能',
          forgotPasswordDesc: 'メールボックス認証コードによるパスワードのリセットを許可するかどうか',
          firstLoginChangePassword: '初回登録の強制変更',
          firstLoginChangePasswordDesc: '初回ログインでパスワードを変更する必要があるかどうか',
          loginFailedLock: 'ログインロック',
          loginFailedLockDesc: '連続ログイン失敗アカウントのロック'
        },
        system: {
          notificationMaster: '通知センターマスタースイッチ',
          notificationMasterDesc: 'シャットダウン後の通知はすべて送信されません',
          emailMaster: 'メールボックスシステムのマスタースイッチ',
          emailMasterDesc: '閉鎖後はすべてのメールを送信しない',
          auditMaster: '監査モジュールマスタースイッチ',
          auditMasterDesc: 'クローズ後のすべての監査は記録されません',
          maintenanceTaskMaster: 'タイムタスクマスタースイッチ',
          maintenanceTaskMasterDesc: 'シャットダウン後にすべてのスケジュール済みタスクが停止',
          dataExportMaster: 'データエクスポートの合計スイッチ',
          dataExportMasterDesc: '閉じるとすべてのエクスポート機能が無効になります',
          watermark: 'ページウォーターマーク',
          watermarkDesc: 'ページウォーターマークを表示するかどうか',
          onlineDeviceLimit: 'オンラインデバイス数の制限',
          onlineDeviceLimitDesc: 'シングルユーザーのオンラインデバイス数を制限するかどうか',
          auditVerify: '監査監査監査機能',
          auditVerifyDesc: '監査ログの監査が必要かどうか'
        }
      },
      database: {
        default: 'データの管理',
        title: 'プロジェクトデータベース管理',
        desc: 'データ表示、テーブル編集、バックアップ、ロールバックをサポートするデータベース管理ツールで、スーパー管理者のみがアクセスできます。',
        tabs: {
          dataView: 'データの表示',
          tableEdit: '構成表の編集',
          backup: 'バージョンバックアップ',
          restore: 'ロールバックガイド'
        },
        searchTable: '検索テーブル',
        configFileTip: '設定ファイルsrc/config/database.config.js',
        categories: {
          system: 'システム管理システム',
          user: 'ユーザー管理',
          security: 'セキュリティ·コンプライアンス',
          log: 'ログ管理',
          config: '構成管理',
          notification: 'メッセージ通知',
          device: 'デバイス管理',
          license: '権限委譲管理',
          other: 'その他の'
        },
        noTable: 'データシートなし',
        noDescription: '説明なし。',
        rows: 'Ok Okです。',
        dataRows: 'データ行数',
        fieldCount: 'フィールドの数',
        tableDescription: 'テーブルの説明',
        tips: {
          fieldValue: 'このフィールドの値は、実際の状況に応じて入力してください',
          quickPath: '一般的なバックアップストレージパス、クリックすると新しいパス入力ボックスにすばやく入力できます'
        },
        placeholder: {
          enterField: 'ご入力ください。'
        },
        selectTableTip: '左からデータテーブルを選択してください',
        refresh: 'リフレッシュする。',
        searchData: 'データの検索',
        search: '検索する。',
        selectConfigTable: '構成表の選択',
        selectConfigTableTip: '編集する構成表を選択してください',
        addRecord: '追加レコード',
        editRecord: 'レコードの編集',
        operation: 'オペレーション·オペレーション',
        edit: '編集者。',
        delete: '削除する',
        cancel: 'キャンセル。',
        confirm: '決定する。',
        warning: '警告する。',
        addSuccess: '追加の成功',
        addFailed: '追加の失敗',
        editSuccess: '編集成功。',
        editFailed: '編集失敗です。',
        saveFailed: '保存の失敗',
        deleteConfirm: 'このレコードを削除してもよろしいですか？この操作は取り消し不可能です!',
        deleteSuccess: '削除に成功',
        deleteFailed: '削除の失敗',
        createBackup: 'バックアップの作成',
        changePath: 'パスの変更',
        currentStoragePath: '現在のストレージパス',
        defaultPath: 'Backups/database（デフォルト）',
        pathDialogTitle: 'ストレージパスの変更',
        currentPath: '現在の経路',
        currentPathTip: 'すべてのバックアップファイルが保存される、現在のデータベースバックアップファイルの格納ディレクトリ。',
        newPath: '新しい道。',
        newPathTip: 'データベースバックアップファイルの保存ディレクトリを変更すると、変更後の新しいバックアップは新しいディレクトリに保存され、既存のバックアップは移動されません。',
        newPathPlaceholder: 'D/backups/databaseなどのストレージパスを入力してください。',
        browse: 'Browseする',
        quickPath: 'ショートカット·パス',
        pathWarning: '保存パスを変更した後も、履歴バックアップファイルは元のパスに残り、新しいバックアップは新しいパスに保存されます。ブラウザのセキュリティ制限のため、参照ボタンで取得できるのはフォルダ名のみです。フルパスは手動で入力してください。',
        backupTotal: '合計バックアップ数',
        successBackup: 'バックアップの成功',
        failedBackup: '失敗したバックアップ',
        totalSize: 'Totalサイズ',
        backupTip: 'バックアップファイルはサーバーのbackups/databaseディレクトリに保存され、テーブルデータを編集する前に現在のテーブルが自動的にバックアップされます',
        backupName: 'バックアップ名',
        backupType: 'バックアップの種類',
        fullBackup: 'フルバックアップ',
        tableBackup: 'シングルテーブルバックアップ',
        tableName: 'テーブルの名前',
        selectTable: 'テーブルの選択',
        backupSelectTableTip: 'バックアップするテーブルを選択してください',
        fileSize: 'ファイルサイズ',
        remark: '備考：コメント',
        backupRemarkPlaceholder: 'バックアップメモを入力してください。後で識別できます。',
        operator: 'オペレーターマン',
        status: '状態の状態',
        success: '成功した',
        failed: '失敗する。',
        createTime: '創造の時間',
        restore: 'ロールバックしろ',
        backupSuccess: 'バックアップの作成に成功',
        backupFailed: 'バックアップの作成に失敗しました',
        deleteBackupConfirm: 'バックアップ\'{name}\'を削除してもよろしいですか？この操作は取り消し不可能です!',
        restoreConfirm: 'バックアップ\'{name}\'にロールバックしてもよろしいですか現在のデータはロールバック前に自動的にバックアップされ、取り消し不可能です。',
        restoreSuccess: 'ロールバック成功。',
        restoreFailed: 'ロールバックの失敗',
        restoreGuideTitle: 'データベース·ロールバック·アクション·ガイド',
        restoreStep1Title: 'ステップ1：バックアップバージョンの選択',
        restoreStep1Desc: '[バージョンバックアップ]タブで、バックアップのリストからロールバックするターゲットバージョンを選択します。バックアップ時刻、メモ、ファイルサイズをよく確認して、正しいバージョンを選択していることを確認することをお勧めします。',
        restoreStep2Title: 'ステップ2ロールバック操作の確認',
        restoreStep2Desc: 'バックアップレコードの右側にある“ロールバック”ボタンをクリックすると、確認ダイアログがポップアップします。ロールバックは現在のデータベースを上書きし、取り消すことはできません。',
        restoreStep3Title: 'ステップ3：現在のデータの自動バックアップ',
        restoreStep3Desc: 'ロールバックが確認されると、現在のデータベース·データが自動的にバックアップされ（バックアップ名はpre Restore で始まる）、ロールバックが失敗した場合やリカバリが必要な場合にロールバック前の状態に戻すことができるようになります。',
        restoreStep4Title: 'ステップ4：ロールバックの実行と検証',
        restoreStep4Desc: '自動バックアップが完了すると、システムはロールバックを実行します。ロールバックが完了したら、ページをリフレッシュしてキーデータをチェックして、ロールバックの結果が期待通りであることを確認することをお勧めします。',
        restoreWarningTitle: 'ロールバックに関する注意事項',
        restoreWarning1: 'ロールバック操作では、現在のデータベースのすべてのデータが上書きされます。正しいバックアップバージョンが選択されていることを確認してください。',
        restoreWarning2: 'ロールバック前システムは現在のデータを自動的にバックアップしますが、重要な操作の前に手動でバックアップを作成し、メモを記入することをお勧めします。',
        restoreWarning3: 'データが破損する可能性があります。ロールバック中はページを閉じたり、サービスを再開したりしないでください。',
        goToBackup: 'バージョンバックアップへ'
      },
      projectConfig: {
        default: 'プロジェクト構成',
        title: 'プロジェクト構成',
        desc: 'プロジェクト実行のすべての構成情報を表示および管理し、プロファイルのオンライン編集をサポートし、スーパー管理者のみがアクセスできる',
        page: {
          title: 'プロジェクト構成管理',
          desc: 'プロジェクト実行のすべての構成情報の表示と管理、プロファイルのオンライン編集のサポート'
        },
        menu: {
          environment: '環境情報の提供',
          api: 'インタフェース構成',
          storage: 'ストレージ構成',
          security: 'セキュリティ設定',
          database: 'データ構成',
          license: '認可構成',
          email: 'メールボックスの構成',
          translation: '翻訳の設定',
          plc: 'Plc環境設定',
          i18n: 'サポート言語'
        },
        translation: {
          goToConfig: 'セットアップに移動',
          tipTitle: '構成の手順',
          tipContent: '翻訳管理システムの自動翻訳機能を設定します。設定が完了すると、国際化管理ページで自動翻訳機能を使用して、中国語コンテンツを他の言語にすばやく翻訳できます。翻訳サービスはtencent Cloudコンソールで開いてapiキーを取得する必要があります。'
        },
        i18n: {
          title: '国際化マネジメント',
          desc: '管理システムの多言語配置、オンライン検索、編集、国際化コンテンツの新規追加をサポートし、スーパー管理者だけがアクセスできる',
          addConfig: '構成',
          backup: 'バックアップ',
          backupPath: 'バックアップパス',
          searchPlaceholder: 'Keyまたはvalue...',
          searchResult: 'Search Results Forシングル',
          noData: 'データなし。',
          selectLanguageTitle: '言語を選択してください',
          selectLanguageDesc: '上のタブまたは下の言語カードをクリックして、編集する言語と読み込みを選択します。',
          addChild: '新しい子ノード',
          addSibling: '新しい兄弟ノード',
          deleteNode: 'ノードを削除',
          parentPath: '親のパス',
          parentPathTip: 'Commonやmenu.systemなど、新しい設定項目の親パスを選択します。',
          parentPathPlaceholder: '親パスを選択してください',
          keyName: 'キー名',
          keyNameTip: '新規設定項目のキー名（save、cancelなど）',
          keyNamePlaceholder: '例：confirm Save',
          valuePlaceholderWithLang: '{lang}の値を入力してください',
          autoTranslate: '自動翻訳です。',
          unsavedChanges: '現在保存されていない変更があります。言語を切り替えると変更が失われます。続行できますか？',
          noChanges: '保存する必要のある変更なし',
          saveSuccess: '保存に成功しました。ページを再コンパイルまたはリフレッシュしてください',
          saveFailed: '保存の失敗',
          backupSuccess: 'バックアップ成功',
          backupFailed: 'バックアップの失敗',
          loadFileListFailed: 'ファイルリストのロードに失敗しました',
          loadFileFailed: 'ファイルのロードに失敗しました',
          cannotAddChildToLeaf: 'リーフノードは子ノードを追加できません',
          confirmDelete: 'この構成項目を削除しますか',
          deleteSuccess: '削除に成功',
          deleteFailed: '削除の失敗',
          keyNotEmpty: 'キー名は空にできません',
          keyInvalid: 'Key名は正しくフォーマットされておらず、文字、数字、アンダースコア、ドル記号のみを使用でき、数字で始まることはできません。',
          addSuccess: '新規に成功しました。ページを再コンパイルまたは更新してください',
          addFailed: '追加の失敗',
          translateSourceEmpty: 'まず中国語を入力してください。',
          translateZhNotFound: '対応するキーが中国語パックで見つかりません。まず中国語パックに設定を追加してください。',
          translateStart: 'バッチ翻訳の開始',
          translateNoContent: '翻訳可能なコンテンツがない',
          translateBatchSuccess: '一括翻訳完了{lang}、成功 {success}項目、失敗{fail}項目',
          translateSaveFailed: '翻訳結果の保存失敗',
          translateTip: '自動翻訳は参考用です。翻訳内容を手動で確認してください。',
          translateProgress: '翻訳の進捗状況',
          translating: '翻訳では..。',
          totalCount: '合計数',
          currentCount: '完了しました',
          successCount: '成功した',
          failCount: '失敗する。',
          currentTranslating: '現在翻訳中。',
          translateProgressTip: 'ポップアップウィンドウを閉じると、翻訳はバックグラウンドで継続されます。翻訳ステータスアイコンをクリックしていつでも進捗状況を確認できます。',
          cancelTranslate: '翻訳のキャンセル',
          cancelTranslateConfirm: '翻訳をキャンセルしますか？翻訳されたコンテンツは保存されます。',
          translateCancelled: '翻訳キャンセル{lang}、{completed}エントリ完了、失敗{fail}エントリ',
          minimize: '最小化する。',
          closeTranslate: '閉じる翻訳はバックグラウンドで継続',
          restore: '復元する。',
          batchTranslate: 'バッチ翻訳の翻訳',
          batchTranslateTip: '翻訳モードを選択してください。翻訳中にポップアップウィンドウを閉じてバックグラウンドで翻訳を続行できます。',
          translateMissingOnly: '欠落項目のみの翻訳',
          translateMissingOnlyDesc: '現在空のフィールドのみを翻訳し、既存の翻訳を上書きしない（推奨）',
          translateAll: '全て再翻訳。',
          translateAllDesc: '既存の翻訳をすべて上書き（危険、注意してください）',
          nodeTranslate: 'ノードの翻訳',
          nodeTranslateTip: 'このノードの下にあるすべてのコンテンツのみが翻訳され、翻訳中にポップアップウィンドウを閉じてバックグラウンドで翻訳を続けることができます。',
          nodeTranslateLeafTip: 'リーフノードはノード翻訳できません。親ノードを選択してください。',
          nodeTranslateNoContent: 'このノードに翻訳可能なコンテンツがありません',
          translateSuccess: '翻訳成功。',
          translateFailed: '翻訳に失敗しました。翻訳設定を確認してください',
          translateOnlyLeaf: '葉のみ翻訳可能。',
          translateNotZh: '中国語は翻訳不要',
          formatNormal: '通常の翻訳（すべて小文字、スペース付き）',
          formatTitle: '大文字の頭文字単語の頭文字は大文字、スペース付き',
          formatCamel: 'こぶ命名头文字が小文字、それ以降の头文字が大文字、スペースなし',
          autoTranslateAll: '作成後の自動翻訳',
          autoTranslateAllTip: '開くと、言語ファイルを作成すると、中国語コンテンツが自動的に新しい言語に翻訳されます（値は大文字の頭文字を使用します）。',
          autoTranslateTip: '対応するキーの内容を中国語言語パックから取得し、現在の言語に翻訳します。キーが中国語言語パックにない場合、エラーが表示されます。',
          currentPath: '現在の経路',
          currentPathTip: 'すべてのバックアップファイルが保存される、現在の国際化されたファイルバックアップの保存ディレクトリ',
          newPath: '新しい道。',
          newPathTip: 'バックアップファイルの保存ディレクトリを変更すると、変更後の新しいバックアップは新しいディレクトリに保存され、既存のバックアップは移動されません。',
          pathNotEmpty: 'パスは空にできない',
          setPathSuccess: 'バックアップパスが正常に設定されました',
          setPathFailed: 'バックアップパスの設定に失敗しました',
          backupList: 'バックアップインベントリ',
          backupFileName: 'バックアップファイル名',
          backupFileSize: 'ファイルサイズ',
          backupCreateTime: '創造の時間',
          noBackup: 'バックアップファイルなし',
          confirmDeleteBackup: 'このバックアップファイルを削除しますか？',
          deleteBackupSuccess: 'バックアップの削除に成功',
          deleteBackupFailed: 'バックアップ削除に失敗しました',
          valuePlaceholder: '値を入力してください',
          actions: 'オペレーション·オペレーション',
          items: '項目の詳細',
          folders: '1つのファイル',
          total: '1つのノード',
          noChildren: '子ノードがない場合は上のボタンをクリック',
          selectNodeTip: '左のツリーから集するノードを选択してください',
          value: '価値観は',
          createLanguage: '言語は',
          sourceLanguage: 'ソース言語は',
          sourceLanguageTip: 'テンプレートとしてソース言語ファイルを選択すると、このファイルのキー構造に基づいて新しい言語が作成されます。',
          newLangCode: '新言語コード化',
          newLangCodeTip: 'Ja Jp.js、ko Kr.jsなど、“言語コード 地域コード.js”形式の新しい言語のファイル名',
          newLangCodePlaceholder: '例：ja Jp.js / Ko Kr.js / Fr Fr.js',
          newLangName: '新言語の名称',
          newLangNameTip: 'タブに表示される新しい言語の名前（“日本語”、“fran Ç Ais”など）',
          newLangNamePlaceholder: '例：日本語/п А/fran Ç Ais',
          copyValues: 'ソース言語コンテンツのコピー',
          copyValuesTip: '開くと、ソース言語の値の内容を新しい言語にコピーします。閉じると、キー構造のみが残り、値は空白のままです。',
          copyValuesYes: 'レプリケーション',
          copyValuesNo: '空白のまま',
          createLanguageTip: '作成後に言語リストに新しいタブが表示され、ページを再コンパイルまたは更新する必要があります。',
          createLanguageSuccess: '言語は正常に作成されました。ページを再コンパイルまたは更新してください',
          createLanguageFailed: '言語作成の失敗',
          sourceLangNotEmpty: 'ソース言語は空にできません',
          newLangCodeNotEmpty: '新しい言語エンコーディングは空にできません',
          newLangCodeFormat: '新しい言語コードは.jsで終わる必要がある',
          newLangNameNotEmpty: '新しい言語名は空にできません'
        },
        editType: {
          database: 'データベースの構成',
          configFile: 'プロファイル',
          envFile: '環境変数',
          code: 'コード定数',
          databaseTip: 'データベースに格納され、システム設定/スーパーパネルのパラメータ構成ページで直接修正でき、修正後すぐに有効になります。',
          configFileTip: 'バックエンドの設定ファイル（src/config/*.jsなど）に保存され、オンラインでファイルを編集し、バックエンドサービスを再起動する必要があります。',
          envFileTip: '環境変数ファイル（.envなど）に格納され、オンラインでファイルを編集してバックエンドサービスを再起動する必要があります。',
          codeTip: 'コード内にハードコードされているため、ソースコードを手動で変更して再構築する必要がある'
        },
        effectType: {
          immediate: '即時発効です。',
          restart: '背面を再起動する。',
          rebuild: '再構築が必要',
          immediateTip: '変更後すぐに有効になり、サービスの再開や再構築は不要',
          restartTip: '変更後はバックエンドサービスの再起動が必要',
          rebuildTip: '変更後に有効にするにはフロントエンドプロジェクトを再構築する必要がある'
        },
        ownerType: {
          frontend: 'フロント·エンド',
          backend: 'バックエンドの',
          frontendTip: 'この構成項目はフロントエンドプロジェクトであり、変更後にフロントエンドを再構築する必要があります。',
          backendTip: 'この構成項目はバックエンドプロジェクトであり、変更後はバックエンドサービスの再起動が必要です。'
        },
        sourceType: {
          file: 'プロファイル',
          database: 'データベースの構成',
          runtime: 'システム実行时（取得）',
          code: 'コード定数ハード·コード'
        },
        actions: {
          goToConfig: '設定へ移動',
          editFile: 'ファイルの編集'
        },
        tips: {
          codeConstant: 'この構成アイテムはコード定数であり、コードを変更して再構築する必要があります。',
          needCodeChange: 'コードの変更が必要',
          noFilePath: 'この構成アイテムにはファイルパスが関連付けられていません',
          notInWhitelist: 'このファイルは推奨編集のホワイトリストに含まれていません。オンライン編集でシステムが不安定になる可能性があります。編集を続行してもよろしいですか？',
          confirmFailed: '確認ボックスの呼び出しが失敗しました。コンソールのエラーメッセージを確認してください'
        },
        editor: {
          title: 'オンライン編集者',
          unsaved: '保存されない',
          saved: '保存された',
          syntaxCheck: '構文チェック',
          versionHistory: 'バージョン履歴',
          save: '保存する。',
          syntaxValid: '文法チェック通過',
          syntaxInvalid: '構文チェックの失敗',
          readFailed: 'ファイルの読み取りに失敗しました',
          syntaxCheckFailed: '構文チェックの失敗',
          saveSuccess: '保存成功です。',
          backupPath: 'バックアップパス',
          backupPathLoading: '装填中···'
        },
        backup: {
          title: 'バージョン履歴',
          operator: 'オペレーターマン',
          restore: 'ロールバックしろ',
          delete: '削除する',
          empty: 'バックアップ記録なし',
          loadFailed: 'バックアップリストのロードに失敗しました',
          viewTip: 'ロールバックボタンをクリックすると、このバージョンに復元できます',
          restoreConfirm: 'このバージョンにロールバックしてもよろしいですか現在のバージョンは自動的にバックアップされます。',
          restoreSuccess: 'ロールバック成功。',
          deleteConfirm: 'このバックアップを削除してもよろしいですかこの操作は取り消し不可能です。',
          deleteSuccess: 'バックアップの削除に成功'
        },
        saveDialog: {
          title: 'ファイルの保存',
          remark: '備考：コメント',
          remarkPlaceholder: 'この変更のコメントを入力してください（オプション）',
          warning: '保存後はバックエンド·サービスを再起動する必要がある',
          confirm: '保存の確認'
        },
        backupPathDialog: {
          title: 'バックアップ·パスの変更',
          currentPath: '現在の経路',
          newPath: '新しい道。',
          newPathPlaceholder: '新しいバックアップパス相対パスまたは絶対パスを入力してください',
          warning: 'バックアップパスを変更すると、新しいバックアップファイルは新しいパスに保存され、元のバックアップファイルは元のパスに残ります。',
          pathRequired: 'バックアップパスは空にできません',
          changeSuccess: 'バックアップパスの変更に成功しました'
        },
        empty: {
          noConfig: '設定なし。'
        },
        refresh: 'リフレッシュする。',
        loading: '装填中···',
        loadFailed: 'プロジェクト構成のロードに失敗しました',
        items: {
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
              },
              i18nDir: {
                label: 'バックアップカタログの国際化',
                description: '国際化された言語ファイルのバックアップストレージディレクトリ'
              },
              configDir: {
                label: 'データバックアップカタログの構成',
                description: 'プロファイルバージョン履歴バックアップストレージディレクトリ'
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
              label: 'ファイルの最大サイズ',
              description: '許可されたファイルのアップロードの最大サイズ制限'
            },
            allowedExtname: {
              label: '許可された拡張子',
              description: 'アップロードが許可されたファイル拡張子の一覧'
            }
          },
          email: {
            enabled: {
              label: 'メールボックスシステムスイッチ',
              description: 'メールボックス送信機能を有効にするかどうか'
            },
            defaultProvider: {
              label: 'デフォルトのサービスプロバイダー',
              description: 'Smtp、qq、163などのデフォルトのメールプロバイダ設定。'
            },
            host: {
              label: 'Smtpホスト',
              description: 'Smtpメール·サーバのアドレス'
            },
            port: {
              label: 'Smtpポート',
              description: 'Smtpメール·サーバ·ポート'
            },
            secure: {
              label: 'Ssl暗号化',
              description: 'Ssl暗号化を使用してメール·サーバーに接続するかどうか'
            },
            username: {
              label: 'メールアカウント番号',
              description: 'メールの送信に使用するメールアカウント'
            },
            fromName: {
              label: '送信者名',
              description: 'メッセージ表示の送信者名'
            },
            send: {
              maxRetries: {
                label: '送信の最大再回数',
                description: 'メール送信后の最大再数'
              },
              retryDelay: {
                label: '再試行の遅延',
                description: 'メッセージ送信失敗後の再試行の遅延時間（ミリ秒）'
              },
              timeout: {
                label: '送信タイムアウト時間',
                description: 'メール送信のタイムアウト'
              },
              logEnabled: {
                label: 'ログを送信する',
                description: 'メール送信の詳細なログを記録するかどうか'
              }
            },
            passwordReset: {
              tokenExpiresIn: {
                label: 'トークン有効期間のリセット',
                description: 'パスワードリセットリンクの有効期間'
              },
              tokenLength: {
                label: 'トークン長のリセット',
                description: 'パスワードリセットtokenの文字数'
              },
              maxActiveTokens: {
                label: 'アクティブトークンの最大数',
                description: '1人のユーザーが同時に存在できる有効なパスワードリセットトークンの最大数'
              }
            }
          },
          plc: {
            activeProtocol: {
              label: '通信プロトコル',
              description: '現在使用されているplc通信プロトコル'
            },
            supportedProtocols: {
              label: 'サポートされる協定',
              description: 'システムでサポートされるplc通信プロトコルの一覧'
            },
            connection: {
              host: {
                label: 'Plcデバイスip',
                description: 'Plcデバイスのipアドレス'
              },
              port: {
                label: 'Plcポート',
                description: 'Plcデバイスの通信ポート'
              },
              unitId: {
                label: 'ユニットid',
                description: 'Modbusプロトコルのスレーブユニットid、通常は1'
              },
              rack: {
                label: 'ラック番号',
                description: 'S 7プロトコルのラック番号、通常は0'
              },
              slot: {
                label: 'スロット番号',
                description: 'S 7プロトコルのスロット番号、通常は1または2'
              }
            },
            poll: {
              fastInterval: {
                label: '高速ポーリング間隔',
                description: 'デバイスがオンラインであるときのポーリング間隔'
              },
              slowInterval: {
                label: '低速ポーリング間隔',
                description: 'デバイスがオフライン時のポーリング間隔'
              },
              reconnectDelay: {
                label: '再接続の遅延',
                description: 'デバイス切断后の再接続の遅延（ミリ秒）'
              }
            },
            enablePoll: {
              label: '自動ポーリング',
              description: 'Plcデータの自動ポーリングを有効にするかどうか'
            },
            enableWriteAudit: {
              label: '書き込み監査',
              description: 'Plc書き込み操作の監査ログを記録するかどうか'
            },
            maxWriteRetry: {
              label: '最大書き込み再試行',
              description: 'Plc書き込み操作失敗後の再試行の最大回数'
            },
            timeouts: {
              connect: {
                label: '接続タイムアウト',
                description: 'Plc接続のタイムアウト時間ミリ秒'
              },
              read: {
                label: '読み取りタイムアウト',
                description: 'Plcの単一読み取りのタイムアウト時間（ミリ秒）'
              },
              readBatch: {
                label: '一括読取りタイムアウト',
                description: 'Plcバッチ読み取りのタイムアウト時間ミリ秒'
              },
              write: {
                label: '書き込みタイムアウト',
                description: 'Plc書き込み操作のタイムアウト時間（ミリ秒）'
              },
              general: {
                label: 'ユニバーサルタイムアウト',
                description: 'Plcのその他の操作の汎用タイムアウト時間（ミリ秒）'
              }
            },
            multiDeviceEnabled: {
              label: 'マルチデバイスモード',
              description: '複数のplcデバイスを同時に接続できるマルチデバイスモードを有効にするかどうか'
            }
          }
        }
      },
      i18n: {
        default: '言語設定',
        title: '言語設定',
        desc: '管理システムの多言語配置、オンライン検索、編集、国際化コンテンツの新規追加をサポートし、スーパー管理者だけがアクセスできる'
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
    title: 'システムのログイン',
    username: 'ユーザー名',
    password: 'コードコードコード',
    captcha: 'Captchaコード',
    loginBtn: '登録する。',
    registerBtn: 'ノートブック',
    rememberMe: 'Remember Meシングル',
    forgotPassword: 'パスワードを忘れた？',
    noAccount: 'まだアカウントがない？',
    hasAccount: 'アカウントはありますか？',
    goLogin: 'ログインします。',
    goRegister: '登録する。',
    loginNow: '今すぐログイン',
    registerNow: '今すぐ登録',
    usernameRequired: 'ユーザー名を入力してください。',
    passwordRequired: 'コードを入力してください。',
    captchaRequired: 'Captchaをご入力ください',
    emailRequired: 'メールをご入力ください。',
    usernamePlaceholder: 'ユーザー名を入力してください。',
    passwordPlaceholder: 'コードを入力してください。',
    captchaPlaceholder: 'Captchaをご入力ください',
    loginSuccess: 'ログイン成功。',
    loginFailed: 'ログインの失敗',
    logoutSuccess: '終了成功です。',
    logoutConfirm: 'ログインを解除してもよろしいですか？',
    registerTitle: 'ユーザー登録。',
    realName: '本名は。',
    email: 'メールボックス',
    phone: '携帯電話番号',
    confirmPassword: 'パスワードの確認',
    confirmPasswordRequired: 'パスワードを入力してください',
    registerSuccess: '登録成功ですログインしてください',
    deviceLimitExceeded: 'オンラインデバイスの数が上限（最大{max Devices} 台）に達しました。管理者に連絡して、他のデバイスをドロップしてください。',
    kickedOffline: 'アカウントが他のデバイスにログインされ、オフラインになりました。',
    kickNotice: 'ダウンライン通知',
    kickReason: 'アカウントが他のデバイスに登録されている',
    firstLoginTitle: '初めてのログイン',
    firstLoginDesc: '初めてログインしていることが検出されました。初期パスワードを変更してください',
    oldPassword: 'オリジナルコード。',
    newPassword: '新しいコード。',
    modifyPassword: 'パスワードの変更',
    passwordStrength: 'パスワードの強度',
    passwordWeak: '弱い。',
    passwordMedium: '中では',
    passwordStrong: '強い。',
    passwordTips: 'パスワードの長さは8 20桁で、大文字と小文字、数字、特殊文字が含まれます。'
  },
  layout: {
    user: 'ユーザーは',
    fullscreen: 'フルスクリーン',
    exitFullscreen: 'フルスクリーンを終了',
    searchMenu: '検索メニュー。',
    profile: 'パーソナルセンター',
    settings: 'システムの設定',
    logout: 'ログインの終了',
    notificationCenter: '通知センター',
    collapse: '閉じる。',
    expand: '展開する'
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
