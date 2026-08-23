/**
 * Swagger API 文档配置
 * 访问地址：http://localhost:3002/api-docs
 */
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'nexSM-V2 API 文档',
      version: '2.0.0',
      description: 'nex 管理平台后端 API 接口文档\n\n' +
        '## 认证说明\n' +
        '所有需要登录的接口，需在请求头中携带 `Authorization: Bearer <token>`\n\n' +
        '## 错误码说明\n' +
        '- 200: 成功\n' +
        '- 10001: 系统错误\n' +
        '- 10002: 参数错误\n' +
        '- 10003: 未授权\n' +
        '- 10004: 资源不存在\n' +
        '- 10304: 菜单未变更（缓存命中）'
    },
    servers: [
      {
        url: 'http://localhost:3002/prod-api/v2',
        description: '开发环境'
      }
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
        // 通用响应
        ApiResponse: {
          type: 'object',
          properties: {
            code: { type: 'integer', example: 200 },
            msg: { type: 'string', example: '操作成功' },
            data: { type: 'object' },
            timestamp: { type: 'integer', example: 1787196636487 }
          }
        },
        // 分页响应
        PageResponse: {
          type: 'object',
          properties: {
            list: { type: 'array', items: { type: 'object' } },
            total: { type: 'integer', example: 100 },
            page: { type: 'integer', example: 1 },
            pageSize: { type: 'integer', example: 20 }
          }
        },
        // 用户
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'admin' },
            role: { type: 'string', example: 'administrator' },
            real_name: { type: 'string', example: '系统管理员' },
            sex: { type: 'integer', example: 1 },
            phone: { type: 'string', example: '13800000001' },
            email: { type: 'string', example: 'admin@nexcm.com' },
            status: { type: 'integer', example: 1 },
            create_time: { type: 'string', format: 'date-time' }
          }
        },
        // 审计日志
        AuditLog: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            user_name: { type: 'string', example: 'admin' },
            action: { type: 'string', example: 'PLC参数修改' },
            target: { type: 'string', example: 'fillVolume' },
            old_value: { type: 'string' },
            new_value: { type: 'string' },
            result: { type: 'string', example: 'success' },
            reason: { type: 'string' },
            ip: { type: 'string', example: '127.0.0.1' },
            created_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: '用户管理', description: '用户登录、注册、CRUD 等接口' },
      { name: '审计追踪', description: 'GMP 21CFR Part 11 合规审计日志' },
      { name: 'PLC 通讯', description: 'PLC 点位读写、设备状态、批量采集' },
      { name: '菜单管理', description: '动态菜单、权限、版本缓存' },
      { name: '数据字典', description: '字典类型和字典项管理' },
      { name: '角色管理', description: '角色和菜单权限分配' },
      { name: '部门管理', description: '组织架构树形管理' },
      { name: '通知中心', description: '系统通知推送和管理' },
      { name: '文件上传', description: '文件上传和图床管理' },
      { name: '验证码', description: '图形验证码生成和校验' }
    ]
  },
  // 扫描路由文件中的注释
  apis: [
    './src/modules/*/*.route.js',
    './src/modules/*/*.controller.js'
  ]
}

const specs = swaggerJsdoc(options)

module.exports = specs
