/**
 * ============================================================
 * Swagger / OpenAPI 3.0 文档配置
 * ------------------------------------------------------------
 * 作者: GooHv
 * 访问地址: http://localhost:3002/api-docs
 *
 * 说明:
 *  - 业务接口统一挂载前缀 /prod-api/v2/<module>
 *  - server.url 已含 /prod-api/v2,故各 @openapi 路径不再重复该前缀
 *  - 注释写在各 *.route.js 文件中 (JSDoc + @openapi 标签)
 *  - 本文件同时导出 swagger-ui-express 的 UI 选项 (见 app.js)
 * ============================================================
 */
const swaggerJsdoc = require('swagger-jsdoc')

// 标签展示顺序（按业务重要性/使用频率排列）
const TAG_ORDER = [
  '用户管理',
  '客户管理',
  '角色管理',
  '部门管理',
  '菜单管理',
  '权限管理',
  '数据字典',
  '系统配置',
  '功能配置',
  '项目配置',
  '授权管理',
  '审计追踪',
  'PLC 通讯',
  '设备部件',
  '通知中心',
  '文件上传',
  '文件管理',
  '数据库管理',
  '邮箱服务',
  '国际化管理',
  '翻译服务',
  '验证码',
  '健康检查'
]

const definition = {
  openapi: '3.0.0',
  info: {
    title: 'nexSM 管理平台 API 文档',
    version: '2.0.0',
    description:
      'nexSM 管理平台后端 RESTful API 接口文档 (OpenAPI 3.0 / Swagger UI)\n\n' +
      '## 统一响应格式\n' +
      '所有接口返回统一结构: `{ code, msg, data, timestamp }`\n\n' +
      '| 字段 | 类型 | 说明 |\n' +
      '| ---- | ---- | ---- |\n' +
      '| code | integer/string | 业务码, 200 表示成功 |\n' +
      '| msg | string | 提示信息(后端调试用,前端按 code 做国际化) |\n' +
      '| data | any | 业务数据,成功时返回 |\n' +
      '| timestamp | integer | 服务端时间戳(ms) |\n\n' +
      '## 认证说明\n' +
      '需要登录的接口,请先调用 `POST /user/login` 获取 token,然后点击右上角 **Authorize** 按钮输入 `Bearer <token>`。\n\n' +
      '## 主要错误码\n' +
      '| code | HTTP | 含义 |\n' +
      '| ---- | ---- | ---- |\n' +
      '| 200 | 200 | 成功 |\n' +
      '| 10001 | 500 | 系统内部错误 |\n' +
      '| 10002 | 400 | 参数校验失败 |\n' +
      '| 10003 | 401 | 未登录 / token 失效 |\n' +
      '| 10004 | 404 | 资源不存在 |\n' +
      '| 10403 | 403 | 无权限 |\n' +
      '| 10304 | 200 | 菜单未变更(缓存命中) |\n\n' +
      '> 备注: 根路径 `GET /` 为服务健康检查(未挂在 /prod-api/v2 下),返回 `{ State: "Connected Success." }`。'
  },
  servers: [
    {
      url: 'http://localhost:3002/prod-api/v2',
      description: '开发环境 (localhost:3002)'
    }
  ],
  // 全局默认需要登录；公开接口(登录/注册/验证码/授权状态等)在各自端点用 security: [] 关闭
  security: [{ bearerAuth: [] }],
  tags: [
    { name: '用户管理', description: '登录、注册、用户 CRUD、在线设备管理' },
    { name: '客户管理', description: '客户档案 CRUD' },
    { name: '角色管理', description: '角色列表、CRUD' },
    { name: '部门管理', description: '组织架构树形管理' },
    { name: '菜单管理', description: '动态路由菜单、拖拽排序、备份恢复' },
    { name: '权限管理', description: '权限码查询、角色菜单授权' },
    { name: '数据字典', description: '字典类型与字典项管理' },
    { name: '系统配置', description: '系统级配置项读写' },
    { name: '功能配置', description: '功能开关与参数(仅超管)' },
    { name: '项目配置', description: '项目只读配置(仅超管)' },
    { name: '授权管理', description: 'Beehive License 导入、状态、下载' },
    { name: '审计追踪', description: '21CFR Part 11 电子记录审计日志与哈希链校验' },
    { name: 'PLC 通讯', description: 'PLC 点位读写、连接状态、重连' },
    { name: '设备部件', description: '部件模板/实例、寿命统计、更换记录、预警' },
    { name: '通知中心', description: '站内通知查询、已读、归档、用户设置' },
    { name: '文件上传', description: '本地上传与 GitHub 图床' },
    { name: '文件管理', description: '服务端配置文件在线编辑与备份(仅超管)' },
    { name: '数据库管理', description: '数据表查看、配置表编辑、备份回滚(仅超管)' },
    { name: '邮箱服务', description: 'SMTP 配置、发送测试与日志' },
    { name: '国际化管理', description: '多语言包读取、节点编辑、备份恢复(仅超管写)' },
    { name: '翻译服务', description: '机器翻译配置与文本翻译' },
    { name: '验证码', description: '图形验证码生成' },
    { name: '健康检查', description: '服务连通性测试' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      // ---------- 通用信封 ----------
      ApiResponse: {
        type: 'object',
        description: '统一响应信封',
        properties: {
          code: { type: 'integer', example: 200 },
          msg: { type: 'string', nullable: true, example: '操作成功' },
          data: { type: 'object', nullable: true, description: '业务数据' },
          timestamp: { type: 'integer', example: 1787196636487 }
        }
      },
      BadRequest: {
        type: 'object',
        properties: {
          code: { type: 'string', example: '10002' },
          msg: { type: 'string', example: '参数校验失败' },
          data: { type: 'object', nullable: true },
          timestamp: { type: 'integer', example: 1787196636487 }
        }
      },
      Unauthorized: {
        type: 'object',
        properties: {
          code: { type: 'string', example: '10003' },
          msg: { type: 'string', example: '未登录或登录已过期' },
          data: { type: 'object', nullable: true },
          timestamp: { type: 'integer', example: 1787196636487 }
        }
      },
      Forbidden: {
        type: 'object',
        properties: {
          code: { type: 'string', example: '10403' },
          msg: { type: 'string', example: '无权限访问' },
          data: { type: 'object', nullable: true },
          timestamp: { type: 'integer', example: 1787196636487 }
        }
      },
      NotFound: {
        type: 'object',
        properties: {
          code: { type: 'string', example: '10004' },
          msg: { type: 'string', example: '资源不存在' },
          data: { type: 'object', nullable: true },
          timestamp: { type: 'integer', example: 1787196636487 }
        }
      },
      InternalError: {
        type: 'object',
        properties: {
          code: { type: 'string', example: '10001' },
          msg: { type: 'string', example: '系统内部错误' },
          data: { type: 'object', nullable: true },
          timestamp: { type: 'integer', example: 1787196636487 }
        }
      },

      // ---------- 通用分页 ----------
      PaginationQuery: {
        type: 'object',
        description: '分页查询通用参数',
        properties: {
          page: { type: 'integer', example: 1, description: '页码,从1开始' },
          pageSize: { type: 'integer', example: 10, description: '每页条数,最大100' }
        }
      },
      PageResult: {
        type: 'object',
        description: '分页返回结构',
        properties: {
          list: { type: 'array', items: { type: 'object' }, description: '当前页数据列表' },
          total: { type: 'integer', example: 100, description: '总记录数' },
          page: { type: 'integer', example: 1 },
          pageSize: { type: 'integer', example: 10 }
        }
      },

      // ---------- 数据模型 ----------
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'admin' },
          role: { type: 'string', example: 'administrator', description: '角色编码' },
          real_name: { type: 'string', example: '系统管理员' },
          sex: { type: 'integer', enum: [0, 1, 2], example: 1, description: '0未知 1男 2女' },
          phone: { type: 'string', example: '13800000001' },
          email: { type: 'string', example: 'admin@nexcm.com' },
          dept_id: { type: 'integer', nullable: true, example: 1 },
          remark: { type: 'string', example: '系统内置管理员' },
          status: { type: 'integer', enum: [0, 1], example: 1, description: '1启用 0禁用' },
          login_ip: { type: 'string', example: '127.0.0.1' },
          login_date: { type: 'string', format: 'date-time' },
          create_time: { type: 'string', format: 'date-time' }
        }
      },
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: '示例客户有限公司' },
          contact: { type: 'string', example: '张三' },
          phone: { type: 'string', example: '13800000000' },
          email: { type: 'string', example: 'contact@example.com' },
          address: { type: 'string', example: '江苏省无锡市' },
          status: { type: 'integer', enum: [0, 1], example: 1 },
          remark: { type: 'string', example: '' },
          create_time: { type: 'string', format: 'date-time' }
        }
      },
      Role: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          role_name: { type: 'string', example: '系统管理员' },
          role_code: { type: 'string', example: 'administrator' },
          description: { type: 'string', example: '拥有全部权限' },
          status: { type: 'integer', enum: [0, 1], example: 1 },
          create_time: { type: 'string', format: 'date-time' }
        }
      },
      Dept: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          parent_id: { type: 'integer', example: 0 },
          dept_name: { type: 'string', example: '研发部' },
          order_num: { type: 'integer', example: 1 },
          status: { type: 'integer', enum: [0, 1], example: 1 },
          children: {
            type: 'array',
            items: { $ref: '#/components/schemas/Dept' }
          }
        }
      },
      Menu: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          parent_id: { type: 'integer', example: 0 },
          name: { type: 'string', example: '系统管理' },
          path: { type: 'string', example: '/system' },
          component: { type: 'string', example: 'Layout' },
          icon: { type: 'string', example: 'setting' },
          sort: { type: 'integer', example: 1 },
          type: { type: 'integer', enum: [1, 2, 3], example: 1, description: '1目录 2菜单 3按钮' },
          perms: { type: 'string', example: 'system:user:list' },
          visible: { type: 'integer', enum: [0, 1], example: 1 },
          children: {
            type: 'array',
            items: { $ref: '#/components/schemas/Menu' }
          }
        }
      },
      DictType: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          dict_name: { type: 'string', example: '用户性别' },
          dict_type: { type: 'string', example: 'sys_user_sex' },
          status: { type: 'integer', enum: [0, 1], example: 1 },
          remark: { type: 'string', example: '' }
        }
      },
      DictItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          dict_type: { type: 'string', example: 'sys_user_sex' },
          label: { type: 'string', example: '男' },
          value: { type: 'string', example: '1' },
          sort: { type: 'integer', example: 1 },
          status: { type: 'integer', enum: [0, 1], example: 1 }
        }
      },
      AuditLog: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          user_name: { type: 'string', example: 'admin' },
          action: { type: 'string', example: 'PLC参数修改' },
          target: { type: 'string', example: 'fillVolume' },
          old_value: { type: 'string', nullable: true },
          new_value: { type: 'string', nullable: true },
          result: { type: 'string', example: 'success' },
          reason: { type: 'string', nullable: true },
          ip: { type: 'string', example: '127.0.0.1' },
          create_time: { type: 'string', format: 'date-time' }
        }
      },
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: '部件寿命预警' },
          content: { type: 'string', example: '灌装头已达寿命阈值' },
          type: { type: 'string', example: 'warning', description: 'info/warning/error/success' },
          priority: { type: 'string', example: 'high' },
          is_read: { type: 'integer', enum: [0, 1], example: 0 },
          is_archived: { type: 'integer', enum: [0, 1], example: 0 },
          create_time: { type: 'string', format: 'date-time' }
        }
      },
      DevicePartTemplate: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: '灌装头模板' },
          code: { type: 'string', example: 'FILL_HEAD' },
          life_hours: { type: 'integer', example: 8000, description: '设计寿命(小时)' },
          description: { type: 'string', example: '' }
        }
      },
      DevicePart: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          template_id: { type: 'integer', example: 1 },
          name: { type: 'string', example: '灌装头#1' },
          used_life: { type: 'number', example: 120.5, description: '已使用寿命' },
          life_hours: { type: 'integer', example: 8000 },
          status: { type: 'integer', example: 1, description: '1正常 0预警 2报废' },
          install_date: { type: 'string', format: 'date-time' }
        }
      },
      EmailConfig: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          provider: { type: 'string', example: 'smtp' },
          host: { type: 'string', example: 'smtp.exmail.qq.com' },
          port: { type: 'integer', example: 465 },
          secure: { type: 'boolean', example: true },
          username: { type: 'string', example: 'no-reply@nexsm.com' },
          is_default: { type: 'integer', enum: [0, 1], example: 1 },
          status: { type: 'integer', enum: [0, 1], example: 1 }
        }
      },
      LoginResult: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          userInfo: { $ref: '#/components/schemas/User' }
        }
      }
    }
  }
}

const options = {
  definition,
  // 扫描所有路由文件(注释写在 route 文件中)
  apis: [
    './src/modules/**/*.route.js',
    './src/modules/**/*.controller.js',
    './routes/*.js'
  ]
}

const specs = swaggerJsdoc(options)

// ------------------------------------------------------------
// swagger-ui-express 展示选项 (深色专业主题)
// 注意: v5 中 HTML 级选项(explorer/customCss/customSiteTitle/customfavIcon)在顶层,
//       SwaggerUI 运行时选项(docExpansion/filter/sorter 等)必须嵌套在 swaggerOptions 下
// ------------------------------------------------------------
const uiOptions = {
  explorer: true,                 // 顶部搜索框(接口过滤)
  customSiteTitle: 'nexSM 管理平台 API 文档',
  customfavIcon:
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#1f6feb"/><text x="50" y="68" font-size="52" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">N</text></svg>'
    ),
  customCss:
    '.swagger-ui { filter: invert(0.92) hue-rotate(180deg); }' +
    '.swagger-ui .topbar { background: #0b1b33; padding: 12px 0; }' +
    '.swagger-ui .topbar-wrapper img { content: url(\'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#1f6feb"/><text x="50" y="68" font-size="52" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">N</text></svg>') + '\'); }' +
    '.swagger-ui .info .title { color: #1f6feb; font-size: 28px; font-weight: 700; }' +
    '.swagger-ui .info { margin: 20px 0 30px; }' +
    '.swagger-ui .scheme-container { background: #10233f; border-radius: 6px; }' +
    '.swagger-ui .opblock.opblock-post { border-color: #2ea043; }' +
    '.swagger-ui .opblock.opblock-get { border-color: #1f6feb; }' +
    '.swagger-ui .opblock.opblock-put { border-color: #d29922; }' +
    '.swagger-ui .opblock.opblock-delete { border-color: #f85149; }' +
    '.swagger-ui .opblock.opblock-patch { border-color: #a371f7; }' +
    '.swagger-ui .opblock-summary-method { font-weight: 700; }' +
    '.swagger-ui table thead tr th, .swagger-ui table thead tr td { border-bottom: 1px solid #2a3f5f; }',
  // SwaggerUI 运行时选项
  swaggerOptions: {
    docExpansion: 'none',         // 默认折叠所有接口
    showRequestHeaders: true,     // 显示请求头
    filter: true,                 // 标签过滤器输入框
    deepLinking: true,
    tryItOutEnabled: true,
    operationsSorter: 'alpha',   // 同标签内按路径排序
    tagsSorter: function (a, b) { // 标签按预设业务顺序排序(数组内联,避免闭包引用 Node 常量)
      var order = ['用户管理','客户管理','角色管理','部门管理','菜单管理','权限管理','数据字典','系统配置','功能配置','项目配置','授权管理','审计追踪','PLC 通讯','设备部件','通知中心','文件上传','文件管理','数据库管理','邮箱服务','国际化管理','翻译服务','验证码','健康检查'];
      var ia = order.indexOf(a);
      var ib = order.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    }
  }
}

module.exports = { specs, uiOptions, definition }
