## nexCM-V2

### 整体架构

#### 系统架构

```text
┌─────────────────────────────────────────────────────────────────┐
│                        客户端层                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  操作站  │  │  看板屏  │  │  管理端  │  │  工程师站 │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
└───────┼──────────────┼──────────────┼──────────────┼──────────────┘
        │              │              │              │
        └──────────────┴──────┬───────┴──────────────┘
                              │ HTTP/REST + WebSocket
┌─────────────────────────────┴───────────────────────────────────┐
│                        服务端层                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Express 网关层                        │    │
│  │  鉴权中间件 │ 权限中间件 │ 审计中间件 │ 参数校验 │ 限流  │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ 用户权限  │ │ 治具管理  │ │ 订单管理  │ │ 生产执行  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ 设备管理  │ │ 报表统计  │ │ 系统管理  │ │ ERP/MES  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────┴───────┐    ┌────────┴────────┐   ┌───────┴───────┐
│    MySQL      │    │  PLC 通信层      │   │   文件存储     │
│  业务数据      │    │  Modbus/TCP     │   │  报表/归档     │
│  审计日志      │    │  OPC UA         │   │   备份         │
└───────────────┘    └────────┬────────┘   └───────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   PLC/设备层       │
                    │  RFID读卡器/传感器 │
                    └───────────────────┘
```

#### 技术选型

| 层级      | 技术                       | 版本   | 说明               |
| --------- | -------------------------- | ------ | ------------------ |
| 前端框架  | Vue                        | 2.6.x  |                    |
| UI 组件库 | Element UI                 | 2.15.x |                    |
| 状态管理  | Vuex                       | 3.x    |                    |
| 路由      | Vue Router                 | 3.x    |                    |
| HTTP 请求 | Axios                      | 0.21.x |                    |
| 实时通信  | Socket.IO Client           | 4.x    | PLC 数据推送、看板 |
| 图表      | ECharts                    | 5.x    | 看板、报表         |
| Excel     | xlsx + file-saver          |        | 导入导出           |
| 后端框架  | Express                    | 4.x    |                    |
| ORM       | Sequelize                  | 6.x    | MySQL 操作         |
| 实时通信  | Socket.IO                  | 4.x    | 服务端推送         |
| PLC 通信  | modbus-serial / node-opcua |        | 设备通信           |
| 参数校验  | Joi / express-validator    |        | 接口参数校验       |
| 鉴权      | JWT                        |        | 无状态认证         |
| 日志      | winston + morgan           |        | 日志分级           |
| 定时任务  | node-cron                  |        | 数据归档、定时备份 |
| 数据库    | MySQL                      | 8.0    |                    |
| 缓存      | Redis（可选）              |        | 设备状态缓存       |

### 目录结构

#### 前端结构

```text
mcv-auto-web/
├── public/                     # 静态资源（不经过 webpack）
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── api/                    # 【接口层】按模块拆分
│   │   ├── system/             # 系统管理接口
│   │   │   ├── user.js         # 用户管理
│   │   │   ├── role.js         # 角色管理
│   │   │   ├── menu.js         # 菜单管理
│   │   │   └── dict.js         # 数据字典
│   │   ├── biz/                # 业务接口
│   │   │   ├── fixture.js      # 治具/RFID
│   │   │   ├── station.js      # 工位
│   │   │   ├── device.js       # 设备/PLC
│   │   │   ├── order.js        # 订单
│   │   │   ├── production.js   # 生产执行
│   │   │   └── report.js       # 报表
│   │   ├── monitor/            # 监控接口
│   │   │   ├── dashboard.js    # 看板
│   │   │   └── realtime.js     # 实时数据
│   │   └── integration/        # 外部集成
│   │       ├── erp.js          # ERP 接口
│   │       └── mes.js          # MES 接口
│   │
│   ├── assets/                 # 静态资源（经过 webpack）
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       ├── index.scss      # 全局样式入口
│   │       ├── variables.scss  # SCSS 变量
│   │       ├── mixin.scss      # 样式 mixin
│   │       ├── element-variables.scss  # Element UI 主题覆盖
│   │       └── reset.scss      # 样式重置
│   │
│   ├── components/             # 【公共组件】无业务基础组件
│   │   ├── Breadcrumb/         # 面包屑
│   │   ├── SvgIcon/            # SVG 图标
│   │   ├── Pagination/         # 分页（封装 el-pagination）
│   │   ├── RightPanel/         # 右侧面板
│   │   ├── SearchForm/         # 通用搜索表单
│   │   ├── ProTable/           # 高级表格（封装 el-table）
│   │   ├── DialogForm/         # 弹窗表单
│   │   ├── UploadExcel/        # Excel 导入
│   │   ├── ExportButton/       # 导出按钮
│   │   ├── CountDown/          # 倒计时
│   │   └── StatusTag/          # 状态标签
│   │
│   ├── business-components/    # 【业务组件】有业务但跨页面复用
│   │   ├── FixtureSelect/      # 治具选择器
│   │   ├── StationSelect/      # 工位选择器
│   │   ├── DeviceStatus/       # 设备状态指示灯
│   │   ├── OrderProgress/      # 订单进度条
│   │   ├── ProductionCounter/  # 生产计数器
│   │   └── DefectReasonSelect/ # 不良原因选择
│   │
│   ├── directive/              # 自定义指令
│   │   ├── permission.js       # v-permission 按钮权限
│   │   └── dialog-drag.js      # 弹窗拖拽
│   │
│   ├── filters/                # 全局过滤器
│   │   ├── index.js
│   │   ├── date.js             # 日期格式化
│   │   ├── status.js           # 状态格式化
│   │   └── number.js           # 数字格式化
│   │
│   ├── icons/                  # SVG 图标自动注册
│   │   ├── svg/
│   │   └── index.js
│   │
│   ├── layout/                 # 布局组件
│   │   ├── index.vue           # 主布局
│   │   ├── components/
│   │   │   ├── Sidebar/        # 侧边栏
│   │   │   ├── Navbar/         # 顶部导航
│   │   │   ├── TagsView/       # 标签页
│   │   │   └── AppMain/        # 内容区
│   │   └── mixin/
│   │       └── ResizeHandler.js
│   │
│   ├── router/                 # 路由
│   │   ├── index.js            # 路由实例
│   │   ├── constant.js         # 常量路由
│   │   ├── async.js            # 动态路由
│   │   └── modules/            # 路由模块
│   │       ├── system.js
│   │       ├── biz.js
│   │       └── monitor.js
│   │
│   ├── store/                  # Vuex
│   │   ├── index.js
│   │   ├── getters.js
│   │   └── modules/
│   │       ├── app.js          # 应用状态（侧边栏、设备类型）
│   │       ├── user.js         # 用户/权限
│   │       ├── permission.js   # 路由权限
│   │       ├── tagsView.js     # 标签页
│   │       ├── settings.js     # 系统设置
│   │       ├── device.js       # 设备实时状态
│   │       └── production.js   # 生产实时数据
│   │
│   ├── utils/                  # 工具函数
│   │   ├── request.js          # axios 封装
│   │   ├── socket.js           # WebSocket 封装
│   │   ├── auth.js             # token 管理
│   │   ├── permission.js       # 权限判断
│   │   ├── validate.js         # 校验函数
│   │   ├── storage.js          # 本地存储封装
│   │   ├── date.js             # 日期工具
│   │   ├── download.js         # 文件下载
│   │   ├── error-log.js        # 错误收集
│   │   └── plc-command.js      # PLC 指令封装
│   │
│   ├── views/                  # 页面
│   │   ├── login/              # 登录
│   │   ├── dashboard/          # 首页/看板
│   │   ├── system/             # 系统管理
│   │   │   ├── user/           # 用户管理
│   │   │   ├── role/           # 角色管理
│   │   │   ├── menu/           # 菜单管理
│   │   │   ├── dict/           # 数据字典
│   │   │   └── audit/          # 审计日志
│   │   ├── fixture/            # 治具管理
│   │   │   ├── list/           # 治具列表
│   │   │   └── register/       # 治具注册
│   │   ├── station/            # 工位管理
│   │   ├── device/             # 设备管理
│   │   │   ├── list/           # 设备列表
│   │   │   └── monitor/        # 设备监控
│   │   ├── order/              # 订单管理
│   │   │   ├── list/           # 订单列表
│   │   │   ├── create/         # 订单创建
│   │   │   └── detail/         # 订单详情
│   │   ├── production/         # 生产执行
│   │   │   ├── execute/        # 生产操作台
│   │   │   └── history/        # 生产历史
│   │   ├── report/             # 报表中心
│   │   │   ├── production/     # 生产报表
│   │   │   ├── defect/         # 不良分析
│   │   │   └── oee/            # OEE 统计
│   │   ├── kanban/             # 大屏看板
│   │   └── error/              # 错误页
│   │
│   ├── App.vue
│   ├── main.js
│   ├── permission.js           # 路由守卫
│   └── settings.js             # 系统配置
│
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── .eslintrc.js                # ESLint 配置
├── babel.config.js
├── vue.config.js
└── package.json
```

#### 后端结构

```text
mcv-auto-server/
├── bin/                        # 启动脚本
│   └── www
├── config/                     # 配置
│   ├── index.js                # 配置入口
│   ├── database.js             # 数据库配置
│   ├── jwt.js                  # JWT 配置
│   ├── plc.js                  # PLC 连接配置
│   ├── cors.js                 # 跨域配置
│   ├── log.js                  # 日志配置
│   └── archive.js              # 归档配置
├── migrations/                 # 数据库迁移脚本
│   └── 20260805_init.sql
├── seeders/                    # 初始化数据
│   └── init_data.sql
├── src/
│   ├── app.js                  # Express 实例
│   ├── server.js               # 服务启动入口
│   │
│   ├── middleware/             # 【中间件层】
│   │   ├── auth.js             # JWT 鉴权
│   │   ├── permission.js       # 权限校验
│   │   ├── audit.js            # 审计日志记录
│   │   ├── validator.js        # 参数校验
│   │   ├── error-handler.js    # 全局错误处理
│   │   ├── rate-limit.js       # 接口限流
│   │   └── response.js         # 统一响应格式
│   │
│   ├── modules/                # 【业务模块】按领域分目录
│   │   ├── system/             # 系统管理模块
│   │   │   ├── user.model.js   # 数据模型
│   │   │   ├── user.service.js # 业务逻辑
│   │   │   ├── user.controller.js
│   │   │   ├── user.route.js
│   │   │   ├── role.model.js
│   │   │   ├── role.service.js
│   │   │   ├── role.controller.js
│   │   │   ├── role.route.js
│   │   │   ├── menu.model.js
│   │   │   ├── dict.model.js
│   │   │   └── audit-log.model.js
│   │   │
│   │   ├── fixture/            # 治具模块
│   │   │   ├── fixture.model.js
│   │   │   ├── fixture.service.js
│   │   │   ├── fixture.controller.js
│   │   │   └── fixture.route.js
│   │   │
│   │   ├── station/            # 工位模块
│   │   │   ├── station.model.js
│   │   │   ├── station.service.js
│   │   │   ├── station.controller.js
│   │   │   └── station.route.js
│   │   │
│   │   ├── device/             # 设备/PLC 模块
│   │   │   ├── device.model.js
│   │   │   ├── device.service.js
│   │   │   ├── device.controller.js
│   │   │   ├── device.route.js
│   │   │   └── plc-client.js   # PLC 通信客户端
│   │   │
│   │   ├── order/              # 订单模块
│   │   │   ├── order.model.js
│   │   │   ├── order.service.js
│   │   │   ├── order.controller.js
│   │   │   └── order.route.js
│   │   │
│   │   ├── production/         # 生产执行模块
│   │   │   ├── production-record.model.js
│   │   │   ├── defect-record.model.js
│   │   │   ├── production.service.js
│   │   │   ├── production.controller.js
│   │   │   └── production.route.js
│   │   │
│   │   ├── report/             # 报表模块
│   │   │   ├── report.service.js
│   │   │   ├── report.controller.js
│   │   │   └── report.route.js
│   │   │
│   │   └── integration/        # 外部集成模块
│   │       ├── erp.service.js
│   │       ├── erp.controller.js
│   │       ├── erp.route.js
│   │       └── mes-adapter.js
│   │
│   ├── common/                 # 【公共层】
│   │   ├── constants/          # 常量定义
│   │   │   ├── error-code.js   # 错误码
│   │   │   ├── status.js       # 状态枚举
│   │   │   └── permission.js   # 权限标识
│   │   ├── utils/              # 工具函数
│   │   │   ├── jwt.js
│   │   │   ├── password.js
│   │   │   ├── date.js
│   │   │   ├── excel.js
│   │   │   └── csv.js
│   │   ├── exceptions/         # 自定义异常
│   │   │   ├── base-error.js
│   │   │   ├── auth-error.js
│   │   │   ├── business-error.js
│   │   │   └── not-found-error.js
│   │   └── socket/             # WebSocket
│   │       ├── index.js        # Socket.IO 服务
│   │       └── handlers/       # 事件处理
│   │           ├── device.js
│   │           └── production.js
│   │
│   ├── jobs/                   # 定时任务
│   │   ├── archive.js          # 数据归档
│   │   ├── backup.js           # 数据备份
│   │   └── device-heartbeat.js # 设备心跳检测
│   │
│   └── routes/                 # 路由汇总
│       └── index.js
│
├── logs/                       # 日志目录
├── uploads/                    # 上传文件
├── archive/                    # 归档数据
├── .env                        # 环境变量
├── .eslintrc.js
├── package.json
└── README.md
```

### 数据设计

#### 系统管理

```sql
-- 用户表
CREATE TABLE sys_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(100) NOT NULL COMMENT '密码（BCrypt 加密）',
  real_name VARCHAR(50) NOT NULL COMMENT '真实姓名',
  employee_no VARCHAR(30) COMMENT '工号',
  phone VARCHAR(20),
  email VARCHAR(100),
  avatar VARCHAR(255),
  dept_id BIGINT COMMENT '部门ID',
  status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
  last_login_time DATETIME,
  last_login_ip VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by BIGINT,
  updated_by BIGINT,
  deleted_at DATETIME COMMENT '软删除',
  INDEX idx_username(username),
  INDEX idx_dept(dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户';

-- 角色表
CREATE TABLE sys_role (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL,
  role_code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码：admin/operator/engineer/viewer',
  description VARCHAR(200),
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色';

-- 用户-角色关联
CREATE TABLE sys_user_role (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  UNIQUE KEY uk_user_role(user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 菜单/权限表
CREATE TABLE sys_menu (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  parent_id BIGINT DEFAULT 0,
  menu_name VARCHAR(50) NOT NULL,
  menu_type TINYINT COMMENT '1-目录 2-菜单 3-按钮',
  path VARCHAR(200),
  component VARCHAR(200),
  perm_code VARCHAR(100) COMMENT '权限标识：order:create',
  icon VARCHAR(50),
  sort_no INT DEFAULT 0,
  visible TINYINT DEFAULT 1,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单权限';

-- 角色-菜单关联
CREATE TABLE sys_role_menu (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_id BIGINT NOT NULL,
  menu_id BIGINT NOT NULL,
  UNIQUE KEY uk_role_menu(role_id, menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 设备权限表（哪些人能操作哪些设备）
CREATE TABLE sys_device_permission (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  device_id BIGINT NOT NULL,
  permission_type VARCHAR(30) COMMENT 'operate/maintain/view',
  UNIQUE KEY uk_user_device(user_id, device_id, permission_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备操作权限';

-- 审计日志表（21 CFR Part 11）
CREATE TABLE sys_audit_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  trace_id VARCHAR(64) COMMENT '链路追踪ID',
  user_id BIGINT,
  username VARCHAR(50),
  module VARCHAR(50) COMMENT '模块：order/fixture/device',
  action VARCHAR(50) COMMENT '操作：create/update/delete/start/stop',
  target_type VARCHAR(50) COMMENT '操作对象类型',
  target_id VARCHAR(100) COMMENT '操作对象ID',
  old_value JSON COMMENT '修改前数据',
  new_value JSON COMMENT '修改后数据',
  reason VARCHAR(500) COMMENT '操作原因（电子记录要求）',
  ip_address VARCHAR(50),
  user_agent VARCHAR(500),
  request_method VARCHAR(10),
  request_url VARCHAR(500),
  request_params JSON,
  response_code INT,
  execution_time INT COMMENT '耗时ms',
  status TINYINT COMMENT '1-成功 0-失败',
  error_msg VARCHAR(1000),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user(user_id),
  INDEX idx_module(module),
  INDEX idx_target(target_type, target_id),
  INDEX idx_created(created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审计日志';
```

#### 治具工位

```sql
-- 治具表（RFID）
CREATE TABLE biz_fixture (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  rfid_code VARCHAR(100) NOT NULL UNIQUE COMMENT 'RFID标签编码',
  fixture_code VARCHAR(50) NOT NULL UNIQUE COMMENT '治具编号',
  fixture_name VARCHAR(100) NOT NULL COMMENT '治具名称',
  fixture_type VARCHAR(50) COMMENT '治具类型',
  spec VARCHAR(100) COMMENT '规格型号',
  status VARCHAR(20) DEFAULT 'idle' COMMENT '状态：idle-空闲 in_use-使用中 maintenance-保养 scrapped-报废',
  current_station_id BIGINT COMMENT '当前所在工位',
  current_device_id BIGINT COMMENT '当前所在设备',
  last_check_time DATETIME COMMENT '上次校验时间',
  maintenance_cycle INT COMMENT '保养周期（天）',
  next_maintenance_date DATE COMMENT '下次保养日期',
  total_use_count INT DEFAULT 0 COMMENT '累计使用次数',
  max_use_count INT COMMENT '最大使用次数（寿命）',
  remark VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by BIGINT,
  deleted_at DATETIME,
  INDEX idx_rfid(rfid_code),
  INDEX idx_status(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='治具/RFID';

-- 治具校验记录
CREATE TABLE biz_fixture_check_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  fixture_id BIGINT NOT NULL,
  rfid_code VARCHAR(100),
  station_id BIGINT,
  device_id BIGINT,
  check_result VARCHAR(20) COMMENT 'pass/fail',
  fail_reason VARCHAR(500) COMMENT '失败原因：未注册/已报废/保养中/寿命到期',
  operator_id BIGINT,
  check_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_fixture(fixture_id),
  INDEX idx_time(check_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='治具校验记录';

-- 工位表
CREATE TABLE biz_station (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  station_code VARCHAR(50) NOT NULL UNIQUE COMMENT '工位编号',
  station_name VARCHAR(100) NOT NULL COMMENT '工位名称',
  workshop VARCHAR(50) COMMENT '车间',
  line_no VARCHAR(50) COMMENT '产线',
  sequence_no INT COMMENT '工序顺序',
  reader_id VARCHAR(100) COMMENT 'RFID读卡器编号',
  reader_ip VARCHAR(50) COMMENT '读卡器IP',
  status TINYINT DEFAULT 1 COMMENT '0-停用 1-启用',
  remark VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工位';

-- 设备表（PLC）
CREATE TABLE biz_device (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  device_code VARCHAR(50) NOT NULL UNIQUE COMMENT '设备编号',
  device_name VARCHAR(100) NOT NULL COMMENT '设备名称',
  device_type VARCHAR(50) COMMENT '设备类型',
  station_id BIGINT COMMENT '所属工位',
  plc_ip VARCHAR(50) NOT NULL COMMENT 'PLC IP地址',
  plc_port INT DEFAULT 502 COMMENT 'PLC端口',
  protocol VARCHAR(20) DEFAULT 'modbus_tcp' COMMENT '通信协议：modbus_tcp/opc_ua',
  slave_id INT DEFAULT 1 COMMENT '从站地址',
  status VARCHAR(20) DEFAULT 'offline' COMMENT '状态：offline/idle/running/fault/maintenance',
  last_heartbeat DATETIME COMMENT '最后心跳时间',
  fault_code VARCHAR(50) COMMENT '故障代码',
  fault_msg VARCHAR(500) COMMENT '故障信息',
  register_map JSON COMMENT '寄存器地址映射',
  remark VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_station(station_id),
  INDEX idx_status(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备/PLC';
```

#### 订单生产

```sql
-- 订单表
CREATE TABLE biz_order (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单编号',
  order_source VARCHAR(20) DEFAULT 'manual' COMMENT '来源：manual手动/erp同步/mes同步',
  external_order_no VARCHAR(100) COMMENT 'ERP/MES订单号',
  product_code VARCHAR(50) NOT NULL COMMENT '产品编码',
  product_name VARCHAR(200) NOT NULL COMMENT '产品名称',
  product_spec VARCHAR(200) COMMENT '规格型号',
  target_quantity INT NOT NULL COMMENT '目标数量',
  good_quantity INT DEFAULT 0 COMMENT '良品数量',
  bad_quantity INT DEFAULT 0 COMMENT '不良品数量',
  status VARCHAR(20) DEFAULT 'pending' COMMENT '状态：pending待下发/assigned已下发/running生产中/paused暂停/completed已完成/cancelled已取消',
  priority INT DEFAULT 5 COMMENT '优先级 1-9',
  assigned_device_id BIGINT COMMENT '分配的设备ID',
  assigned_station_id BIGINT COMMENT '分配的工位',
  required_fixture_type VARCHAR(50) COMMENT '要求的治具类型',
  issuer_id BIGINT COMMENT '下发人ID',
  issuer_name VARCHAR(50) COMMENT '下发人姓名',
  operator_id BIGINT COMMENT '操作人员ID',
  operator_name VARCHAR(50) COMMENT '操作人员姓名',
  plan_start_time DATETIME COMMENT '计划开始时间',
  actual_start_time DATETIME COMMENT '实际开始时间',
  actual_end_time DATETIME COMMENT '实际完成时间',
  pause_reason VARCHAR(500),
  cancel_reason VARCHAR(500),
  remark VARCHAR(500),
  erp_sync_status VARCHAR(20) DEFAULT 'none' COMMENT 'ERP同步状态',
  erp_sync_time DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME,
  INDEX idx_order_no(order_no),
  INDEX idx_status(status),
  INDEX idx_device(assigned_device_id),
  INDEX idx_time(actual_start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='生产订单';

-- 不良原因字典
CREATE TABLE biz_defect_reason (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  reason_code VARCHAR(50) NOT NULL UNIQUE,
  reason_name VARCHAR(100) NOT NULL,
  reason_category VARCHAR(50) COMMENT '分类：外观/尺寸/功能/材料',
  parent_id BIGINT DEFAULT 0,
  sort_no INT DEFAULT 0,
  status TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='不良原因';

-- 生产记录（每次计数一条）
CREATE TABLE biz_production_record (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  order_no VARCHAR(50),
  device_id BIGINT,
  station_id BIGINT,
  fixture_id BIGINT COMMENT '使用的治具',
  rfid_code VARCHAR(100),
  result VARCHAR(20) NOT NULL COMMENT 'good/bad',
  defect_reason_id BIGINT COMMENT '不良原因ID',
  defect_reason_name VARCHAR(100),
  defect_note VARCHAR(500) COMMENT '不良备注',
  operator_id BIGINT,
  operator_name VARCHAR(50),
  produce_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '生产时间',
  plc_counter_value INT COMMENT 'PLC计数器值',
  INDEX idx_order(order_id),
  INDEX idx_device(device_id),
  INDEX idx_time(produce_time),
  INDEX idx_result(result)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='生产记录';

-- 订单状态变更日志
CREATE TABLE biz_order_status_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  order_no VARCHAR(50),
  from_status VARCHAR(20),
  to_status VARCHAR(20),
  operator_id BIGINT,
  operator_name VARCHAR(50),
  reason VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order(order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单状态日志';

-- 设备当前状态（实时表，也可以放Redis）
CREATE TABLE biz_device_realtime (
  device_id BIGINT PRIMARY KEY,
  device_code VARCHAR(50),
  status VARCHAR(20),
  current_order_id BIGINT,
  current_order_no VARCHAR(50),
  current_fixture_id BIGINT,
  current_rfid VARCHAR(100),
  good_count INT DEFAULT 0,
  bad_count INT DEFAULT 0,
  last_counter_value INT DEFAULT 0,
  last_product_time DATETIME,
  fault_code VARCHAR(50),
  fault_msg VARCHAR(500),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备实时状态';
```

#### 归档数据

```sql
-- 归档表结构和原表一致，加 archive_time 字段
-- 定时任务每月将6个月前的数据迁移到归档表
CREATE TABLE archive_production_record LIKE biz_production_record;
ALTER TABLE archive_production_record ADD COLUMN archive_time DATETIME DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE archive_audit_log LIKE sys_audit_log;
ALTER TABLE archive_audit_log ADD COLUMN archive_time DATETIME DEFAULT CURRENT_TIMESTAMP;

-- 也可以导出为文件存储
```

### 后端接口

#### 统一规范

##### 基础路径

基础路径：/api/v1

##### 响应格式

```json
{
  "code": 20000,
  "message": "success",
  "data": {},
  "timestamp": 1691234567890
}
```

##### 错误代码

| 段          | 含义            |
| ----------- | --------------- |
| 20000       | 成功            |
| 40000-40099 | 参数错误        |
| 40100-40199 | 认证错误        |
| 40300-40399 | 权限错误        |
| 40400-40499 | 资源不存在      |
| 50000-50099 | 业务错误        |
| 50100-50199 | 设备 / PLC 错误 |

##### 分页查询

```text
?page=1&pageSize=20&keyword=xxx&status=1&startTime=xxx&endTime=xxx
```

分页响应

```json
{
  "code": 20000,
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

#### 认证接口

```text
POST   /api/v1/auth/login              # 登录
POST   /api/v1/auth/logout             # 登出
GET    /api/v1/auth/user-info          # 获取当前用户信息（含角色、权限）
PUT    /api/v1/auth/password           # 修改密码
```

##### 登录请求

```json
{ "username": "admin", "password": "xxx" }
```

##### 登录响应

```json
{
  "code": 20000,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 7200
  }
}
```

#### 系统接口

```text
# 用户管理
GET    /api/v1/system/users              # 用户列表（分页）
POST   /api/v1/system/users              # 创建用户
GET    /api/v1/system/users/:id          # 用户详情
PUT    /api/v1/system/users/:id          # 更新用户
DELETE /api/v1/system/users/:id          # 删除用户
PUT    /api/v1/system/users/:id/status   # 启用/禁用
PUT    /api/v1/system/users/:id/reset-pwd # 重置密码

# 角色管理
GET    /api/v1/system/roles
POST   /api/v1/system/roles
GET    /api/v1/system/roles/:id
PUT    /api/v1/system/roles/:id
DELETE /api/v1/system/roles/:id
GET    /api/v1/system/roles/:id/menus    # 获取角色权限
PUT    /api/v1/system/roles/:id/menus    # 分配权限

# 菜单管理
GET    /api/v1/system/menus/tree         # 菜单树
POST   /api/v1/system/menus
PUT    /api/v1/system/menus/:id
DELETE /api/v1/system/menus/:id

# 数据字典
GET    /api/v1/system/dicts
GET    /api/v1/system/dicts/:type/items
POST   /api/v1/system/dicts
PUT    /api/v1/system/dicts/:id

# 审计日志
GET    /api/v1/system/audit-logs         # 审计日志查询（分页）
GET    /api/v1/system/audit-logs/:id     # 审计详情（含变更前后数据）
GET    /api/v1/system/audit-logs/export  # 导出审计日志
```

#### 设备接口

```text
# 治具管理
GET    /api/v1/fixtures                  # 治具列表
POST   /api/v1/fixtures                  # 注册治具
GET    /api/v1/fixtures/:id              # 治具详情
PUT    /api/v1/fixtures/:id              # 更新治具
DELETE /api/v1/fixtures/:id              # 删除治具
POST   /api/v1/fixtures/check            # RFID校验（核心接口）
       # 请求：{ "rfidCode": "E2003412", "stationId": 1, "deviceId": 1 }
       # 响应：{ "valid": true, "fixture": {...}, "message": "可用" }
GET    /api/v1/fixtures/:id/check-logs   # 校验记录
PUT    /api/v1/fixtures/:id/maintenance  # 保养记录
PUT    /api/v1/fixtures/:id/scrap        # 报废

# 工位管理
GET    /api/v1/stations
POST   /api/v1/stations
GET    /api/v1/stations/:id
PUT    /api/v1/stations/:id
DELETE /api/v1/stations/:id

# 设备管理
GET    /api/v1/devices                   # 设备列表
POST   /api/v1/devices                   # 添加设备
GET    /api/v1/devices/:id
PUT    /api/v1/devices/:id
DELETE /api/v1/devices/:id
POST   /api/v1/devices/:id/connect       # 连接PLC
POST   /api/v1/devices/:id/disconnect    # 断开连接
GET    /api/v1/devices/:id/status        # 实时状态
GET    /api/v1/devices/:id/registers     # 读取寄存器值
PUT    /api/v1/devices/:id/registers     # 写入寄存器
GET    /api/v1/devices/status            # 所有设备实时状态（看板用）
POST   /api/v1/devices/:id/restart       # 重启设备
POST   /api/v1/devices/:id/reset-fault   # 复位故障
```

#### 订单接口

```text
GET    /api/v1/orders                    # 订单列表（分页、筛选）
POST   /api/v1/orders                    # 创建订单
GET    /api/v1/orders/:id                # 订单详情
PUT    /api/v1/orders/:id                # 修改订单（未开始的）
DELETE /api/v1/orders/:id                # 删除订单
POST   /api/v1/orders/:id/assign         # 分配设备/工位
POST   /api/v1/orders/:id/start          # 启动订单（给PLC发允许信号）
POST   /api/v1/orders/:id/pause          # 暂停订单
POST   /api/v1/orders/:id/resume         # 恢复订单
POST   /api/v1/orders/:id/complete       # 手动完成
POST   /api/v1/orders/:id/cancel         # 取消订单
GET    /api/v1/orders/:id/records        # 生产记录
GET    /api/v1/orders/:id/defect-stats   # 不良统计
GET    /api/v1/orders/active             # 当前活跃订单（设备正在生产的）
POST   /api/v1/orders/:id/good-count     # 良品计数（PLC回调）
POST   /api/v1/orders/:id/bad-count      # 不良计数（PLC回调）
       # 请求：{ "reasonId": 1, "note": "xxx", "rfidCode": "xxx" }
GET    /api/v1/orders/export             # 导出订单
```

> 订单启动核心逻辑：
>
> 1. 校验订单状态、设备状态、治具状态
> 2. 校验当前用户有该设备操作权限
> 3. 写入寄存器：允许生产标志位置 1
> 4. 更新订单状态为 running
> 5. 记录审计日志
> 6. WebSocket 推送状态更新

#### 执行接口

```text
GET    /api/v1/production/current        # 当前生产状态（操作台用）
POST   /api/v1/production/count          # 计数（PLC触发或人工触发）
POST   /api/v1/production/good           # 良品+1
POST   /api/v1/production/bad            # 不良+1（带原因）
GET    /api/v1/production/records        # 生产记录查询
GET    /api/v1/production/realtime       # 实时生产数据（看板）
GET    /api/v1/production/defect-reasons # 不良原因列表
POST   /api/v1/production/device-heartbeat # 设备心跳
```

#### 报表接口

```text
GET    /api/v1/reports/production        # 生产报表
       # 参数：startTime, endTime, deviceId, orderNo
GET    /api/v1/reports/production/export # 导出生产报表
GET    /api/v1/reports/defect-analysis   # 不良分析（按原因、按设备、按时间）
GET    /api/v1/reports/oee               # OEE 设备综合效率
GET    /api/v1/reports/device-utilization # 设备利用率
GET    /api/v1/reports/operator-output   # 人员产量统计
GET    /api/v1/reports/dashboard         # 看板汇总数据
```

#### 预留接口

```text
POST   /api/v1/integration/erp/orders/sync    # 从ERP同步订单
POST   /api/v1/integration/erp/orders/push    # 生产结果回推ERP
POST   /api/v1/integration/erp/callback       # ERP回调（订单状态变更）
GET    /api/v1/integration/erp/sync-logs      # 同步日志

POST   /api/v1/integration/mes/orders/receive # MES下发订单接收
POST   /api/v1/integration/mes/status/report  # 上报状态给MES
GET    /api/v1/integration/mes/config         # MES对接配置
PUT    /api/v1/integration/mes/config         # 更新MES配置
```

#### 推送事件

WebSocket 服务器实时推送:

| 事件名             | 数据                                | 说明            |
| ------------------ | ----------------------------------- | --------------- |
| `device:status`    | `{ deviceId, status, ... }`         | 设备状态变化    |
| `device:fault`     | `{ deviceId, faultCode, faultMsg }` | 设备故障        |
| `order:status`     | `{ orderId, orderNo, status }`      | 订单状态变化    |
| `order:count`      | `{ orderId, good, bad, target }`    | 计数更新        |
| `production:new`   | `{ orderId, result, ... }`          | 新产品产出      |
| `fixture:detected` | `{ rfidCode, stationId, valid }`    | RFID 检测到治具 |
| `heartbeat`        | `{ time }`                          | 心跳            |

客户端发送事件：

| 事件名             | 说明                    |
| ------------------ | ----------------------- |
| `subscribe:device` | 订阅设备状态            |
| `subscribe:order`  | 订阅订单状态            |
| `plc:command`      | 发送 PLC 指令（需权限） |

### 模块组件

#### 路由菜单

```js
// 常量路由（不需要登录）
const constantRoutes = [
  { path: "/login", component: "login", hidden: true },
  { path: "/404", component: "404", hidden: true },
  { path: "/401", component: "401", hidden: true },
  { path: "/kanban", component: "kanban/index", hidden: true } // 大屏看板
];

// 动态路由（按权限加载）
const asyncRoutes = [
  {
    path: "/",
    component: "Layout",
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: "dashboard/index",
        meta: { title: "首页", icon: "dashboard", affix: true }
      }
    ]
  },
  {
    path: "/production",
    component: "Layout",
    meta: { title: "生产执行", icon: "production" },
    children: [
      {
        path: "execute",
        name: "ProductionExecute",
        component: "production/execute",
        meta: { title: "生产操作台", icon: "play" }
      },
      {
        path: "history",
        name: "ProductionHistory",
        component: "production/history",
        meta: { title: "生产记录", icon: "list" }
      }
    ]
  },
  {
    path: "/order",
    component: "Layout",
    meta: { title: "订单管理", icon: "order" },
    children: [
      { path: "list", name: "OrderList", component: "order/list", meta: { title: "订单列表", icon: "list" } },
      {
        path: "create",
        name: "OrderCreate",
        component: "order/create",
        meta: { title: "创建订单", icon: "edit", perm: "order:create" }
      },
      { path: "detail/:id", name: "OrderDetail", component: "order/detail", meta: { title: "订单详情", hidden: true } }
    ]
  },
  {
    path: "/device",
    component: "Layout",
    meta: { title: "设备管理", icon: "device" },
    children: [
      { path: "list", name: "DeviceList", component: "device/list", meta: { title: "设备列表" } },
      { path: "monitor", name: "DeviceMonitor", component: "device/monitor", meta: { title: "设备监控" } }
    ]
  },
  {
    path: "/fixture",
    component: "Layout",
    meta: { title: "治具管理", icon: "fixture" },
    children: [
      { path: "list", name: "FixtureList", component: "fixture/list", meta: { title: "治具列表" } },
      {
        path: "register",
        name: "FixtureRegister",
        component: "fixture/register",
        meta: { title: "治具注册", perm: "fixture:create" }
      }
    ]
  },
  {
    path: "/station",
    component: "Layout",
    children: [
      { path: "list", name: "StationList", component: "station/list", meta: { title: "工位管理", icon: "station" } }
    ]
  },
  {
    path: "/report",
    component: "Layout",
    meta: { title: "报表中心", icon: "report" },
    children: [
      { path: "production", name: "ReportProduction", component: "report/production", meta: { title: "生产报表" } },
      { path: "defect", name: "ReportDefect", component: "report/defect", meta: { title: "不良分析" } },
      { path: "oee", name: "ReportOee", component: "report/oee", meta: { title: "OEE统计" } }
    ]
  },
  {
    path: "/system",
    component: "Layout",
    meta: { title: "系统管理", icon: "system", roles: ["admin"] },
    children: [
      { path: "user", name: "SystemUser", component: "system/user", meta: { title: "用户管理", perm: "system:user" } },
      { path: "role", name: "SystemRole", component: "system/role", meta: { title: "角色管理", perm: "system:role" } },
      { path: "menu", name: "SystemMenu", component: "system/menu", meta: { title: "菜单管理", perm: "system:menu" } },
      { path: "dict", name: "SystemDict", component: "system/dict", meta: { title: "数据字典" } },
      {
        path: "audit",
        name: "SystemAudit",
        component: "system/audit",
        meta: { title: "审计日志", perm: "system:audit" }
      }
    ]
  }
];
```

#### 页面组件

##### 生产操作

`views/production/execute/index.vue`,这是操作工用的核心页面，大按钮、大字体、状态醒目:

```text
页面结构：
┌─────────────────────────────────────────────────────────┐
│  设备状态区（左）  │  当前订单区（中）  │  计数区（右）    │
│  - 设备名称        │  - 订单号          │  ┌───────────┐  │
│  - 连接状态        │  - 产品名称        │  │ 目标: 100 │  │
│  - 运行状态        │  - 目标数量        │  │ 良品: 85  │  │
│  - 故障信息        │  - 进度条          │  │ 不良: 3   │  │
│  - 当前治具        │  - 已用时间        │  └───────────┘  │
├───────────────────┴───────────────────┴─────────────────┤
│  操作按钮区                                              │
│  [启动订单] [暂停] [良品+1] [不良+1] [结束订单]           │
├─────────────────────────────────────────────────────────┤
│  不良原因选择弹窗（点不良+1时弹出）                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 请选择不良原因：                                 │    │
│  │ [外观不良] [尺寸超差] [功能异常] [材料缺陷] [其他]│    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  最近生产记录（实时滚动）                                │
│  10:23:45  良品  RFID:E200...  治具:F-001               │
│  10:23:32  不良  原因:外观不良  RFID:E200...            │
└─────────────────────────────────────────────────────────┘
```

###### 变量定义

```js
data() {
  return {
    // 设备状态
    deviceInfo: {
      id: null,
      name: '',
      status: 'offline',  // offline/idle/running/fault
      connected: false,
      faultCode: '',
      faultMsg: ''
    },
    // 当前订单
    currentOrder: {
      id: null,
      orderNo: '',
      productName: '',
      targetQuantity: 0,
      goodQuantity: 0,
      badQuantity: 0,
      status: 'idle',
      startTime: null,
      elapsedTime: 0
    },
    // 当前治具
    currentFixture: {
      rfidCode: '',
      fixtureCode: '',
      fixtureName: '',
      valid: false
    },
    // 计数
    goodCount: 0,
    badCount: 0,
    // 不良弹窗
    defectDialogVisible: false,
    defectReasons: [],
    selectedDefectReason: null,
    defectNote: '',
    // 最近记录
    recentRecords: [],
    // loading
    starting: false,
    pausing: false,
    counting: false
  }
}
```

###### 核心方法

```js
methods: {
  // 启动订单：调用 POST /orders/:id/start
  async handleStartOrder() { ... },

  // 暂停订单
  async handlePauseOrder() { ... },

  // 良品+1：调用 POST /production/good
  async handleGoodCount() { ... },

  // 不良+1：先选原因再提交
  handleBadCount() { this.defectDialogVisible = true },
  async submitDefect() { ... },

  // 结束订单
  async handleCompleteOrder() { ... },

  // WebSocket 实时更新
  socket.on('order:count', (data) => { ... }),
  socket.on('device:status', (data) => { ... }),
  socket.on('fixture:detected', (data) => { ... })
}
```

##### 订单列表

`views/order/list/index.vue`,标准 CRUD 列表页，用 ProTable 组件：

```text
┌─────────────────────────────────────────────────────────┐
│ 搜索栏：订单号、产品名、状态、时间范围  [搜索] [重置]      │
│                            [新建订单] [导入] [导出]       │
├─────────────────────────────────────────────────────────┤
│ 表格列：                                                 │
│ 订单号 | 产品名称 | 目标 | 良品 | 不良 | 状态 | 设备 |    │
│ 操作人员 | 开始时间 | 操作                                │
│                                                          │
│ 操作：[详情] [启动] [暂停] [编辑] [删除]                  │
├─────────────────────────────────────────────────────────┤
│ 分页                                                     │
└─────────────────────────────────────────────────────────┘
```

##### 设备监控

`views/device/monitor/index.vue`设备拓扑图 + 实时状态：

```text
┌─────────────────────────────────────────────────────────┐
│ 设备总览：在线 5 台，运行 3 台，故障 1 台，离线 1 台      │
├─────────────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│ │ 设备1  │ │ 设备2  │ │ 设备3  │ │ 设备4  │            │
│ │ 运行中  │ │ 待机   │ │ 故障   │ │ 离线   │            │
│ │ 订单A  │ │        │ │ 急停   │ │        │            │
│ │ 85/100 │ │ 0/0    │ │        │ │        │            │
│ └────────┘ └────────┘ └────────┘ └────────┘            │
└─────────────────────────────────────────────────────────┘
```

##### 大屏看板

`views/kanban/index.vue`独立全屏页面，用于车间大屏展示：

```text
┌─────────────────────────────────────────────────────────┐
│  标题：生产实时看板                    时间：2026-08-05  │
├──────────┬──────────┬──────────┬────────────────────────┤
│ 今日产量  │ 良品率   │ 设备OEE  │ 当前订单数              │
│  1,234   │  98.5%   │  87.2%   │    5                   │
├──────────┴──────────┴──────────┴────────────────────────┤
│ 设备状态（每个设备卡片）                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│ │1号机  │ │2号机  │ │3号机  │ │4号机  │ │5号机  │         │
│ │运行中 │ │运行中 │ │待机   │ │故障   │ │运行中 │         │
│ │85%   │ │62%   │ │      │ │      │ │45%   │         │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘          │
├─────────────────────────────────────────────────────────┤
│ 不良原因分布（饼图）        │  24小时产量趋势（折线图）   │
├─────────────────────────────────────────────────────────┤
│ 实时生产流水（滚动）                                     │
└─────────────────────────────────────────────────────────┘
```

##### 审计日志

`views/system/audit/index.vue`21 CFR Part 11 要求：

- 不可删除、不可修改
- 记录谁、什么时间、做了什么、改了什么、为什么改
- 支持筛选、导出

```text
┌─────────────────────────────────────────────────────────┐
│ 搜索：操作人、模块、时间范围、操作类型                    │
├─────────────────────────────────────────────────────────┤
│ 时间 | 操作人 | 模块 | 操作 | 对象 | 结果 | IP | 详情     │
│                                                          │
│ 详情弹窗：                                               │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 操作人：admin                                   │    │
│ │ 时间：2026-08-05 14:30:22                       │    │
│ │ 操作：启动订单                                   │    │
│ │ 变更前：{ status: 'pending' }                   │    │
│ │ 变更后：{ status: 'running', operatorId: 1 }    │    │
│ │ 操作原因：开始生产                               │    │
│ └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

#### 公共组件

##### 高级表格

ProTable 封装 el-table + 分页 + 搜索 + 操作列，所有列表页复用。

###### 数据配置

```js
props: {
  columns: { type: Array, required: true },  // 列配置
  request: { type: Function, required: true }, // 请求方法
  rowKey: { type: String, default: 'id' },
  pagination: { type: Boolean, default: true },
  selection: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  pageSize: { type: Number, default: 20 }
}
```

###### 配置格式

```js
columns: [
  { prop: "orderNo", label: "订单号", width: 150 },
  { prop: "productName", label: "产品名称" },
  { prop: "status", label: "状态", formatter: (row) => this.formatStatus(row.status) },
  { label: "操作", slot: "actions", width: 200, fixed: "right" }
];
```

> Events：
>
> - `selection-change`
> - `sort-change`
>
> Methods（通过 ref 调用）：
>
> - `refresh()` — 刷新
> - `reset()` — 重置搜索并刷新
> - `clearSelection()` — 清空选中

##### 搜索表单

SearchForm，封装搜索区域，支持收起 / 展开：

```vue
<SearchForm :fields="searchFields" @search="handleSearch" @reset="handleReset">
  <template #buttons>
    <el-button type="primary">新建</el-button>
  </template>
</SearchForm>
```

###### 字段配置

```js
searchFields: [
  { type: 'input', prop: 'orderNo', label: '订单号' },
  { type: 'select', prop: 'status', label: '状态', options: [...] },
  { type: 'daterange', prop: 'dateRange', label: '时间范围' }
]
```

##### 弹窗表单

DialogForm，封装弹窗 + 表单 + 确定 / 取消：

```vue
<DialogForm v-model="dialogVisible" :title="dialogTitle" :loading="submitLoading" @submit="handleSubmit">
  <el-form :model="form" :rules="rules" ref="form">
    <el-form-item label="订单号" prop="orderNo">
      <el-input v-model="form.orderNo" />
    </el-form-item>
  </el-form>
</DialogForm>
```

##### 状态标签

StatusTag，根据状态显示不同颜色的 Tag：

```vue
<StatusTag :status="order.status" :options="statusOptions" />
```

##### 设备状态

DeviceStatusLight，设备状态灯：

```vue
<DeviceStatusLight :status="device.status" />
<!-- 绿色=运行 黄色=待机 红色=故障 灰色=离线 -->
```

### 公共模块

#### 请求封装

前端 request.js 封装：

```js
import axios from "axios";
import { Message, MessageBox } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 15000
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    // 加链路ID，用于审计追踪
    config.headers["X-Trace-Id"] = generateTraceId();
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 20000) {
      Message.error(res.message || "请求失败");

      // token 过期
      if (res.code === 40101 || res.code === 40102) {
        MessageBox.confirm("登录已过期，请重新登录", "提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          store.dispatch("user/resetToken").then(() => location.reload());
        });
      }
      return Promise.reject(new Error(res.message));
    }
    return res.data; // 直接返回 data 部分
  },
  (error) => {
    Message.error(error.message || "网络错误");
    return Promise.reject(error);
  }
);

export default service;
```

#### 推送封装

WebSocket 封装 `utils/socket.js`

```js
import { io } from "socket.io-client";
import { getToken } from "./auth";

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    this.socket = io(process.env.VUE_APP_SOCKET_URL, {
      auth: { token: getToken() },
      transports: ["websocket"]
    });

    this.socket.on("connect", () => console.log("WS connected"));
    this.socket.on("disconnect", () => console.log("WS disconnected"));

    // 统一分发事件
    this.socket.onAny((event, data) => {
      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach((cb) => cb(data));
      }
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const cbs = this.listeners.get(event).filter((cb) => cb !== callback);
      this.listeners.set(event, cbs);
    }
  }

  emit(event, data) {
    this.socket?.emit(event, data);
  }
}

export default new SocketClient();
```

#### 中间件链

每个请求经过的中间件顺序：

```text
请求 → cors → morgan(日志) → rateLimit(限流) → auth(鉴权) → permission(权限)
    → audit(审计记录开始) → validator(参数校验) → 业务处理 → audit(审计记录结束)
    → errorHandler(错误处理) → 响应
```

#### 错误处理

```js
// 自定义错误类
class BusinessError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

// 使用
throw new BusinessError(50001, "订单状态不允许此操作");

// 全局错误处理中间件
app.use((err, req, res, next) => {
  // 记录错误日志
  logger.error(err);

  // 记录审计日志（失败的操作也要记）
  if (req.auditContext) {
    recordAuditLog(req, { status: 0, errorMsg: err.message });
  }

  // 返回错误
  res.status(err.httpStatus || 200).json({
    code: err.code || 50000,
    message: err.message || "服务器内部错误",
    data: null
  });
});
```

#### 通信模块

PLC 通信模块 `plc-client.js`:

```js
const ModbusRTU = require('modbus-serial')

class PLCClient {
  constructor(device) {
    this.device = device
    this.client = new ModbusRTU()
    this.client.setTimeout(1000)
    this.connected = false
    this.pollingTimer = null
  }

  async connect() {
    await this.client.connectTCP(this.device.plc_ip, { port: this.device.plc_port })
    this.client.setID(this.device.slave_id)
    this.connected = true
    this.startPolling()
  }

  // 轮询读取状态
  startPolling() {
    this.pollingTimer = setInterval(async () => {
      try {
        // 读取状态寄存器
        const status = await this.readHoldingRegisters(0, 10)
        // 读取计数器
        const counter = await this.readHoldingRegisters(10, 2)
        // 读取故障码
        const fault = await this.readHoldingRegisters(20, 1)

        // 更新实时状态
        await this.updateRealtimeStatus({ status, counter, fault })

        // WebSocket 推送
        io.emit('device:status', { ... })
      } catch (e) {
        this.connected = false
        io.emit('device:fault', { deviceId: this.device.id, error: e.message })
      }
    }, 500)  // 500ms 轮询一次
  }

  // 写入允许生产标志
  async allowProduction(allow) {
    // 寄存器地址 100，写 1=允许，0=禁止
    await this.writeRegister(100, allow ? 1 : 0)
  }

  // 读取计数器值
  async getCounter() {
    const result = await this.readHoldingRegisters(10, 2)
    return result.data[0] * 65536 + result.data[1]
  }

  async disconnect() {
    clearInterval(this.pollingTimer)
    this.client.close(() => {})
    this.connected = false
  }
}
```

#### 地址映射

寄存器地址映射（示例）：

```js
const REGISTER_MAP = {
  STATUS: 0, // 设备状态：0-待机 1-运行 2-故障
  COUNTER_HIGH: 10, // 计数器高位
  COUNTER_LOW: 11, // 计数器低位
  FAULT_CODE: 20, // 故障码
  ENABLE_PRODUCTION: 100, // 允许生产（上位机写）
  RESET_COUNTER: 101, // 复位计数器
  GOOD_SIGNAL: 200, // 良品信号（PLC写，上位机读）
  BAD_SIGNAL: 201, // 不良信号（PLC写，上位机读）
  RFID_DATA: 300 // RFID数据区
};
```

### 预留接口

#### 对接方式

支持两种模式：

1. **主动拉取**：定时调用 ERP/MES 接口拉取新订单
2. **被动接收**：ERP/MES 调用本系统接口推送订单

#### 同步订单

从 ERP 同步订单：

```js
// integration/erp.service.js
class ERPService {
  constructor(config) {
    this.baseURL = config.apiUrl;
    this.apiKey = config.apiKey;
  }

  // 拉取待生产订单
  async fetchPendingOrders(since) {
    const res = await axios.get(`${this.baseURL}/api/v1/orders`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
      params: { status: "released", modifiedAfter: since }
    });
    return res.data;
  }

  // 同步到本地
  async syncOrders() {
    const lastSyncTime = await this.getLastSyncTime();
    const erpOrders = await this.fetchPendingOrders(lastSyncTime);

    for (const erpOrder of erpOrders) {
      // 检查是否已存在
      const exists = await Order.findOne({
        where: { external_order_no: erpOrder.orderNo }
      });

      if (!exists) {
        await Order.create({
          order_no: this.generateLocalOrderNo(),
          order_source: "erp",
          external_order_no: erpOrder.orderNo,
          product_code: erpOrder.materialCode,
          product_name: erpOrder.materialName,
          target_quantity: erpOrder.quantity,
          status: "pending",
          erp_sync_status: "synced"
        });
      }
    }

    await this.updateLastSyncTime(new Date());
  }

  // 生产完成回推 ERP
  async pushOrderResult(order) {
    await axios.post(
      `${this.baseURL}/api/v1/orders/confirm`,
      {
        orderNo: order.external_order_no,
        status: "completed",
        goodQuantity: order.good_quantity,
        badQuantity: order.bad_quantity,
        startTime: order.actual_start_time,
        endTime: order.actual_end_time,
        operator: order.operator_name
      },
      {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      }
    );
  }
}
```

#### MES 接口

```js
// MES 下发订单（MES 调用本系统）
POST /api/v1/integration/mes/orders/receive
Headers: X-MES-Token: xxx

Request:
{
  "mesOrderNo": "MES20260805001",
  "materialCode": "P001",
  "materialName": "某医疗配件",
  "quantity": 500,
  "priority": 5,
  "requiredFixtureType": "F-Type-A",
  "planStartTime": "2026-08-06 08:00:00"
}

Response:
{
  "code": 20000,
  "data": {
    "localOrderNo": "ORD20260805001",
    "received": true
  }
}
```

#### 同步任务

```js
// jobs/erp-sync.js
const cron = require("node-cron");

// 每5分钟同步一次ERP订单
cron.schedule("*/5 * * * *", async () => {
  try {
    await erpService.syncOrders();
    logger.info("ERP订单同步完成");
  } catch (e) {
    logger.error("ERP同步失败", e);
  }
});
```

### 审计追踪

#### 核心要求

- 电子记录不可篡改：审计日志只增不改不删

- 操作留痕：谁、什么时间、做了什么、改了什么、为什么改

- 电子签名：关键操作需要再次输入密码确认

- 时间戳准确：服务器统一时间，不能客户端时间

- 可追溯：通过 traceId 串联整个操作链路

#### 审计中间件

```js
// middleware/audit.js
module.exports = function (options = {}) {
  return async (req, res, next) => {
    // 只记录写操作
    const writeMethods = ["POST", "PUT", "DELETE", "PATCH"];
    if (!writeMethods.includes(req.method)) return next();

    const startTime = Date.now();
    const traceId = req.headers["x-trace-id"] || uuid();

    // 保存操作前的数据（用于对比）
    let oldData = null;
    if (req.params.id && options.module) {
      oldData = await getOldData(options.module, req.params.id);
    }

    // 重写 res.json 拦截响应
    const originalJson = res.json;
    res.json = function (body) {
      const auditLog = {
        trace_id: traceId,
        user_id: req.user?.userId,
        username: req.user?.username,
        module: options.module,
        action: options.action || req.method.toLowerCase(),
        target_type: options.targetType,
        target_id: req.params.id,
        old_value: oldData,
        new_value: req.body,
        reason: req.body.reason || req.body.auditReason, // 操作原因
        ip_address: req.ip,
        user_agent: req.get("user-agent"),
        request_method: req.method,
        request_url: req.originalUrl,
        request_params: req.params,
        response_code: body.code,
        execution_time: Date.now() - startTime,
        status: body.code === 20000 ? 1 : 0,
        error_msg: body.code !== 20000 ? body.message : null
      };

      // 异步写入审计日志（不阻塞响应）
      AuditLog.create(auditLog).catch((err) => {
        logger.error("审计日志写入失败", err);
      });

      originalJson.call(this, body);
    };

    next();
  };
};

// 使用
router.post("/orders", auth, audit({ module: "order", action: "create", targetType: "order" }), orderController.create);
```

#### 电子签名

关键操作（启动订单、完成订单、删除数据、修改权限）需要二次密码确认：

```js
// 前端：关键操作弹出密码框
async function handleStartOrder(order) {
  const { value: password } = await this.$prompt("请输入密码确认操作", "电子签名", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputType: "password"
  });

  if (password) {
    await orderAPI.start(order.id, {
      password,
      reason: "开始生产" // 操作原因必填
    });
  }
}
```

```js
// 后端：验证密码
async startOrder(req, res) {
  const { password, reason } = req.body

  // 验证二次密码
  const user = await User.findByPk(req.user.userId)
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new BusinessError(40103, '密码错误，电子签名验证失败')
  }

  // 操作原因必填
  if (!reason) {
    throw new BusinessError(40001, '请填写操作原因')
  }

  // ... 执行业务逻辑
}
```

#### 定时任务

```js
// jobs/archive.js   数据归档定时任务
const cron = require("node-cron");
const { Op } = require("sequelize");

// 每月1号凌晨2点执行归档
cron.schedule("0 2 1 * *", async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // 1. 归档生产记录
  const oldRecords = await ProductionRecord.findAll({
    where: { produce_time: { [Op.lt]: sixMonthsAgo } }
  });

  if (oldRecords.length > 0) {
    // 写入归档表
    await ArchiveProductionRecord.bulkCreate(oldRecords.map((r) => ({ ...r.toJSON(), archive_time: new Date() })));
    // 删除原表数据
    await ProductionRecord.destroy({
      where: { produce_time: { [Op.lt]: sixMonthsAgo } }
    });

    logger.info(`归档生产记录 ${oldRecords.length} 条`);
  }

  // 2. 归档审计日志
  // 3. 可选：导出为 CSV/JSON 文件压缩存储到指定目录
  // 4. 记录归档操作本身的审计日志
});
```

### 流程时序

#### 生产流程

```text
1. 管理员创建订单 → 订单状态 pending
2. 调度员分配设备/工位 → 状态 assigned
3. 操作工刷卡登录 → 验证设备权限
4. 操作工选择订单，点"启动"
   → 系统校验：订单状态、设备状态、人员权限
   → 系统校验：RFID 治具是否已放置且有效
   → 电子签名确认
   → 写入 PLC 寄存器：允许生产 = 1
   → 订单状态 running
   → 记录审计日志
   → WebSocket 推送状态
5. 设备开始生产，每完成一个：
   → PLC 信号触发
   → 后端读取计数器
   → 判断良品/不良
   → 不良的话需要操作工选择原因
   → 写入生产记录
   → 更新订单计数
   → WebSocket 推送计数更新
6. 达到目标数量：
   → 系统自动写入 PLC：允许生产 = 0
   → 订单状态 completed
   → 记录完成时间、操作人员
   → 生成报表数据
   → 回推 ERP/MES
   → 记录审计日志
```

#### 检测流程

```text
// RFID检测流程
1. 操作工将治具放到设备上
2. RFID 读卡器读到标签
3. PLC 检测到 RFID 变化 → 通知上位机
4. 上位机查询数据库：
   - 该 RFID 是否注册？
   - 治具状态是否正常（非报废、非保养中）？
   - 治具类型是否匹配当前订单？
   - 治具寿命是否到期？
   - 是否在有效期内？
5. 校验通过：
   → 界面显示绿色"治具正常"
   → 允许启动订单
6. 校验不通过：
   → 界面显示红色"治具不可用"+原因
   → 禁止启动订单
   → 写入校验日志
   → 报警提示
```

### 开发顺序

按照依赖关系，建议按以下顺序开发：

#### 基础框架

1. 后端项目搭建（Express + Sequelize + 目录结构）
2. 前端项目搭建（Vue 2 + Element UI + 目录结构）
3. 数据库初始化脚本
4. 登录 / 鉴权 / 权限中间件
5. 系统管理模块（用户、角色、菜单）

#### 基础数据

1. 工位管理
2. 设备管理（PLC 连接先做模拟）
3. 治具 / RFID 管理
4. 数据字典（不良原因等）

#### 核心业务

1. 订单管理 CRUD
2. 生产执行页面
3. PLC 通信联调（真实设备）
4. RFID 校验逻辑
5. 计数逻辑（良品 / 不良）

#### 报表看板

1. 生产报表
2. 不良分析
3. 实时看板
4. Excel 导入导出

#### 高级功能

1. 审计追踪完善
2. 电子签名
3. 数据归档
4. ERP/MES 对接
5. 大屏看板

### 设计要点

| 要点               | 设计方案                                                                     |
| ------------------ | ---------------------------------------------------------------------------- |
| **上位机控制 PLC** | 设备只有 "允许生产" 信号由上位机控制，PLC 无法自行启动，必须等上位机写寄存器 |
| **无订单不生产**   | 启动按钮前端置灰 + 后端接口校验 + PLC 寄存器禁止，三重保障                   |
| **订单完成条件**   | 良品数 >= 目标数才允许完成，后端校验，前端按钮状态控制                       |
| **RFID 校验**      | 启动前必须校验，运行中实时检测，异常立即停机并报警                           |
| **权限粒度**       | 菜单权限 + 按钮权限 + 设备操作权限，三层控制                                 |
| **审计追踪**       | 中间件自动记录所有写操作，变更前后数据都存，不可删除                         |
| **实时性**         | WebSocket 推送，不用轮询，500ms 轮询 PLC 状态                                |
| **数据归档**       | 定时任务每月归档 6 个月前数据，可导出文件                                    |
| **ERP/MES**        | 预留标准接口，支持主动拉取和被动接收两种模式                                 |
| **21 CFR Part 11** | 电子签名、操作原因、不可篡改日志、准确时间戳                                 |
