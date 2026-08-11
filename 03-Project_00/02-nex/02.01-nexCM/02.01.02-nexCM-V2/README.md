断点 宽度 设备 策略
xs <768px 手机 单列、汉堡菜单抽屉、表格转卡片
sm 768-992px 平板 侧边栏可收起、内容自适应
md 992-1200px 小桌面 正常布局，微调间距
lg ≥1200px 桌面 完整布局

src/
├── api/ # 【改】所有接口统一放这里，按业务模块分文件
│ ├── login.js # 登录、验证码、token 校验
│ ├── system/ # 系统管理
│ │ ├── user.js
│ │ ├── role.js
│ │ └── menu.js
│ └── biz/ # 业务模块（设备、PLC、工单等）
│ ├── device.js
│ ├── fixture.js
│ └── order.js
│
├── assets/
│ ├── icons/svg/ # 已有
│ ├── images/ # 【新增】图片资源
│ └── styles/ # 【新增】全局样式
│ ├── variables.less # 颜色、间距、圆角、字号变量
│ ├── mixin.less # 常用 mixin（文本省略、flex 居中等）
│ ├── transition.less # 过渡动画
│ ├── reset.less # 补充 reset（reset-css 之外的）
│ └── index.less # 统一出口
│
├── components/ # 【改】全局通用组件
│ ├── SvgIcon/ # 已有
│ ├── Breadcrumb/ # 已有
│ ├── Pagination/ # 【新增】封装分页（每个表格页都要用）
│ ├── RightPanel/ # 【新增】右侧抽屉
│ ├── Empty/ # 【新增】空状态
│ └── SearchForm/ # 【新增】搜索表单封装
│
├── config/ # 【新增】全局配置，所有不写死的都放这
│ ├── index.js # 系统名称、版本、默认分页大小等
│ ├── theme.js # 主题色、侧边栏宽度等
│ └── table.js # 表格默认配置
│
├── directives/ # 【新增】自定义指令
│ ├── permission.js # v-permission 权限按钮控制
│ └── index.js # 统一注册
│
├── layout/ # 【改】从 pages 移出来，布局组件独立
│ ├── index.vue # MainLayout
│ ├── components/
│ │ ├── Sidebar/ # NavBar → Sidebar
│ │ ├── Navbar/ # HeadView → Navbar
│ │ ├── TagsView/ # UserTags → TagsView
│ │ └── AppMain/ # ContentView → AppMain
│
├── mixins/ # 【新增】公共混入
│ ├── resize.js # 响应式检测 mixin
│ ├── table.js # 表格分页、排序、筛选 mixin
│ └── permission.js # 权限判断 mixin
│
├── plugins/ # 已有，可扩展
│ ├── element.js # 已有
│ └── message.js # 【新增】统一 Message 封装（防重复弹窗）
│
├── router/
│ ├── index.js # 路由实例
│ ├── constantRoutes.js # 【拆分】静态路由（登录、404、首页）
│ ├── asyncRoutes.js # 【拆分】动态路由（权限控制）
│ ├── permission.js # 路由守卫
│ └── helper/ # 已有
│
├── store/
│ ├── index.js
│ ├── getters.js # 【新增】全局 getters 统一出口
│ └── modules/
│ ├── app.js # 【新增】侧边栏折叠、设备类型、语言
│ ├── user.js # 已有
│ ├── permission.js # 【新增】路由权限
│ ├── tagsView.js # 【新增】标签页状态（从组件移到 Vuex）
│ └── settings.js # 【新增】系统设置
│
├── utils/
│ ├── auth.js # 【新增】token 存取（从 storage.util 拆出来）
│ ├── request.js # 【改】axios 实例统一出口
│ ├── storage.js # 已有
│ ├── validate.js # 已有校验
│ ├── errorCode.js # 【改】错误码从 request/base 移到 utils
│ └── index.js # 通用工具函数（深拷贝、防抖节流等）
│
├── views/ # 【改】pages → views（大厂惯例命名）
│ ├── login/
│ ├── home/
│ ├── profile/
│ ├── system/ # 系统管理页面
│ └── biz/ # 业务页面
│
├── App.vue
└── main.js
