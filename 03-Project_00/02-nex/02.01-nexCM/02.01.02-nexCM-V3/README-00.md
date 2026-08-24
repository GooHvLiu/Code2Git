# nexCM-V2 管理系统模板

基于 Vue 2.6 + Element UI + Express + MySQL 的企业级前后端分离管理系统模板，开箱即用，适合快速搭建中后台项目。

## 功能特性

- **动态路由**：基于角色的菜单权限控制，后端返回菜单树，前端动态生成路由
- **菜单缓存**：localStorage + 版本号机制，减少首次进入 API 延迟，支持热刷新
- **主题定制**：10 维度颜色调色板（侧边栏背景/文字/悬停/图标/选中背景等），运行时切换，CSS 变量驱动
- **国际化**：中英文切换，菜单标题后端多语言字段支持，页面文字 i18n 驱动
- **骨架屏**：路由切换骨架屏，提升感知速度
- **标签页**：多标签页切换，支持右键菜单（刷新/关闭/关闭其他/关闭左右/全部关闭）
- **菜单搜索**：顶部搜索框，一级菜单加粗带图标，二级菜单无图标，支持键盘上下选择，直达对应菜单
- **系统设置统一管理**：`menuHelper.js` 作为唯一菜单工具，系统设置菜单（数据字典/角色管理/部门管理/用户管理/审计追踪）前端固定配置，仅管理员可见管理类菜单，审计追踪所有人可见
- **SVG 图标**：svg-sprite-loader 自动注册，CSS 变量控制颜色
- **用户管理**：完整 CRUD + 批量删除 + 导出 + 重置密码 + 电子签名
- **审计追踪**：GMP 21CFR Part 11 合规，哈希链防篡改，只增不改不删，管理员看全部/个人看自己
- **数据字典管理**：左右双栏（类型列表 + 字典项），前端 DictTag 组件联动，避免硬编码枚举
- **角色管理**：角色 CRUD + 菜单权限树分配 + 数据范围配置（全部/本部门/本部门及子部门/仅本人）
- **部门管理**：树形表格组织架构，支持新增子部门
- **通知中心 + 铃铛**：Navbar 铃铛图标实时显示未读角标（>9显示...），点击展开最近5条通知，WebSocket 实时推送，"查看全部"跳转通知中心完整页面
- **导出下拉组件**：`ExportDropdown` 分段下拉按钮，默认导出PDF，箭头展开可选Excel/PDF，统一所有列表页导出入口
- **表格导出**：标准导出模块，支持 Excel/PDF，全部导出/选中导出，PDF 含水印和导出人，国际化支持
- **多语言输入组件**：`I18nInput` 通用中英文双输入框，v-model 自动绑定 JSON 格式 `{"zh-CN": "...", "en-US": "..."}`，支持 input/textarea 两种模式，统一所有配置类数据的多语言录入
- **文件上传**：本地存储 + GitHub 图床双模式
- **验证码**：SVG 图形验证码
- **JWT 鉴权**：Token 认证 + 接口权限校验

## 技术栈

### 前端

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue | 2.6.14 |
| UI 组件库 | Element UI | 2.15.14 |
| 状态管理 | Vuex | 3.6.2 |
| 路由 | Vue Router | 3.6.5 |
| HTTP 请求 | Axios | 1.19.0 |
| 国际化 | Vue I18n | 8.28.2 |
| 样式 | Less + style-resources-loader | - |
| 构建工具 | Vue CLI 5 | - |
| 进度条 | NProgress | 0.2.0 |
| 过渡动画 | @morev/vue-transitions | 2.3.6 |

### 后端

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Express | 4.18.2 |
| 数据库 | MySQL (mysql2) | 3.6.5 |
| 参数校验 | Joi | 18.2.3 |
| 鉴权 | jsonwebtoken | 9.0.3 |
| 密码加密 | bcryptjs | 2.4.3 |
| 验证码 | svg-captcha | 1.4.0 |
| 文件上传 | multer | 1.4.5-lts.1 |
| 路径别名 | module-alias | 2.3.4 |

## 快速开始

### 环境要求

- Node.js >= 14
- MySQL >= 5.7
- npm >= 6

### 后端启动

```bash
cd 02.02-nexSM/02.02.02-nexSM-V2
npm install
# 复制 .env 并配置数据库连接
npm run dev
```

默认端口：3002

### 前端启动

```bash
cd 02.01-nexCM/02.01.02-nexCM-V2
npm install
npm run serve
```

默认访问地址：http://localhost:8082

### 生产构建

```bash
npm run build
```

## 项目结构

### 前端

```
src/
├── api/                    # 接口层（按业务模块分文件）
│   ├── index.js            # API 统一出口
│   ├── login.js            # 登录/注册/验证码/菜单/用户信息
│   ├── user.js             # 用户管理 CRUD
│   ├── customer.js         # 客户管理 CRUD
│   ├── audit.js            # 审计追踪接口
│   └── dict.js             # 数据字典
├── assets/                 # 静态资源
│   ├── icons/svg/          # SVG 图标（自动注册）
│   ├── images/             # 图片资源
│   └── styles/             # 全局样式（variables.less / index.less）
├── components/             # 全局通用组件
│   ├── SearchForm/         # 搜索表单
│   ├── TableToolbar/       # 表格工具栏
│   ├── Pagination/         # 分页组件
│   ├── DictTag/            # 字典标签
│   ├── SvgIcon/            # SVG 图标组件
│   ├── Breadcrumb/         # 面包屑
│   ├── ThemePicker/        # 主题调色板 + 语言切换
│   ├── MenuSearch/         # 菜单搜索
│   ├── Skeleton/           # 骨架屏
│   ├── I18nInput/          # 多语言输入组件（中英文双输入框）
│   ├── ExportDropdown/     # 导出下拉组件（PDF/Excel 分段下拉按钮）
│   └── NotificationBell/   # 通知铃铛组件（未读角标 + 最近通知）
├── config/                 # 全局配置
│   ├── index.js            # 聚合出口
│   ├── system.js           # 系统信息（名称/版本/Logo）
│   ├── network.js          # 网络请求配置
│   ├── ui.js               # UI 配置（分页/侧边栏/断点）
│   ├── themeVariables.js   # 主题颜色变量（JS/Less 共享）
│   └── messages.js         # 提示文案
├── directives/             # 自定义指令（v-permission 权限控制）
├── filters/                # 全局过滤器（日期格式化等）
├── i18n/                   # 国际化
│   ├── index.js            # i18n 实例 + setLanguage + LANGUAGES
│   └── langs/
│       ├── zh-CN.js        # 中文语言包
│       └── en-US.js        # 英文语言包
├── Layout/                 # 布局组件
│   ├── index.vue           # 主布局
│   └── components/
│       ├── Sidebar/        # 侧边栏（含 Logo + 菜单）
│       ├── Navbar/         # 顶部导航（折叠按钮 + 搜索 + 主题 + 用户）
│       ├── TagsView/       # 标签页（含右键菜单）
│       └── AppMain/        # 内容区（含骨架屏）
├── mixins/                 # 公共混入
│   ├── table.js            # 表格通用逻辑（搜索/分页/加载）
│   ├── dialog.js           # 弹窗通用逻辑
│   └── dict.js             # 字典数据加载
├── plugins/                # 插件（Element UI 注册 / 全局组件注册）
├── router/                 # 路由
│   ├── index.js            # 路由实例
│   ├── constantRoutes.js   # 静态路由（登录/404/首页/个人中心）
│   ├── permission.js       # 路由守卫（鉴权 + 动态路由生成）
│   ├── pathConstants.js    # 路径常量 + 首页标签
│   └── helper/
│       ├── menuHelper.js   # 菜单格式化（首页 + 后端菜单）
│       ├── routerHelper.js # 动态路由构建（懒加载）
│       └── componentsMap.js# 组件映射表
├── store/                  # Vuex 状态管理
│   ├── modules/
│   │   ├── app.js          # 侧边栏/设备
│   │   ├── user.js         # 用户信息/登出
│   │   ├── permission.js   # 路由权限 + 菜单缓存
│   │   ├── tagsView.js     # 标签页
│   │   └── errorLog.js     # 错误日志
├── utils/                  # 工具函数
│   ├── request.js          # Axios 封装（拦截器 + 10304 特殊处理）
│   ├── auth.js             # Token 存取
│   ├── storage.js          # 本地存储封装
│   ├── storageKey.js       # 存储 Key 常量
│   ├── validate.js         # 表单校验
│   ├── constants.js        # 业务码常量
│   ├── permission.js       # 权限判断工具
│   ├── theme.js            # 主题切换（THEME_FIELDS + setThemeField）
│   └── index.js            # 通用工具（downloadFile 等）
├── views/                  # 页面
│   ├── login/              # 登录/注册（左右滑动切换）
│   ├── home/               # 首页
│   ├── profile/            # 个人中心
│   ├── error/              # 403 / 404 / 错误日志
│   ├── redirect/           # 无刷新重载
│   └── system/user/        # 用户管理（标准业务模块示例）
├── App.vue
└── main.js
```

### 后端

```
src/
├── config/                 # 配置
│   ├── app.config.js       # 应用配置
│   ├── db.config.js        # 数据库配置
│   ├── jwt.config.js       # JWT 配置
│   └── upload.config.js    # 上传配置（本地 + GitHub）
├── constants/              # 常量
│   ├── errorCode.js        # 业务错误码 + 错误消息
│   └── statusCode.js       # 状态码常量
├── db/                     # 数据库
│   ├── index.js            # 连接池封装
│   └── BaseModel.js        # 基础模型（CRUD 封装）
├── middleware/             # 中间件
│   ├── auth.middleware.js  # JWT 鉴权
│   ├── validate.middleware.js # Joi 参数校验
│   ├── upload.middleware.js # 文件上传（multer）
│   ├── response.middleware.js # 统一响应格式
│   ├── error.middleware.js # 错误处理 + BusinessError
│   └── logger.middleware.js # 请求日志
├── modules/                # 业务模块（自动加载路由）
│   ├── user/               # 用户模块
│   │   ├── user.model.js   # 数据模型
│   │   ├── user.service.js # 业务逻辑
│   │   ├── user.controller.js # 控制器
│   │   ├── user.route.js   # 路由
│   │   └── user.schema.js  # Joi 校验
│   ├── menu/               # 菜单模块（含版本号缓存）
│   ├── customer/           # 客户模块
│   ├── captcha/            # 验证码模块
│   └── upload/             # 文件上传模块
└── utils/                  # 工具函数
    ├── jwt.js              # JWT 签发/验证
    ├── password.js         # 密码加密/比对
    ├── date.js             # 日期格式化
    └── file.js             # 文件处理
```

## 功能模块详解

### 1. 动态路由与菜单权限

**实现原理**
- 后端根据用户角色返回菜单树（`nex_user_menu` 关联表）
- 前端路由守卫调用 `permission/generateRoutes` 动态生成路由
- 组件懒加载：`buildDynamicRoutes` 使用 `import()` 异步加载
- 菜单缓存：localStorage 存储菜单数据 + 版本号，未变更时直接用缓存

**使用方法**

新增一个菜单页面，只需 3 步：

1. **数据库添加菜单记录**
```sql
INSERT INTO nex_menu (id, parent_id, name, path, component, title, title_en, icon, sort)
VALUES ('_005', '_000', 'Order', '/order', 'order/index', '订单管理', 'Order', 'order', 5);
```

2. **前端创建页面组件**：`src/views/order/index.vue`

3. **注册组件映射**：在 `src/router/helper/componentsMap.js` 中添加
```js
const componentsMap = {
  'order/index': () => import('@/views/order/index.vue'),
  // ...
}
```

4. **关联用户菜单**：在 `nex_user_menu` 表中添加 `user_id` + `menu_id` 关联

完成后登录即可看到菜单，无需修改路由配置。

**修改已有菜单字段对前端的影响**

| 数据库字段 | 改了之后前端要改吗 | 说明 |
|-----------|-------------------|------|
| `title`（中文名称） | **不需要** | 后端直接返回，前端渲染 `item.meta.title` |
| `title_en`（英文名称） | **不需要** | 后端根据 `?lang=en-US` 返回对应语言 |
| `path`（路径） | **看情况** | 动态 import 模式下，path 与页面目录必须对应 |
| `component`（组件名） | **看情况** | componentsMap 中有映射则不用改，否则忽略此字段 |
| `icon`（图标） | **需要** | 前端 `src/assets/icons/svg/` 下要有同名 SVG 文件 |

组件加载优先级：
1. `component` 字段在 `componentsMap.js` 中有注册 → 用映射表组件
2. 否则 → 动态 import `@/views/{父path}/{子path}/index.vue`

> 目前 `componentsMap.js` 默认为空，走动态 import，因此 **path 必须与页面文件目录对应**。

---

### 2. 菜单缓存机制

**实现原理**
- 数据库 `nex_menu.update_time` 作为版本号（ON UPDATE CURRENT_TIMESTAMP）
- 前端先请求 `/menu/version` 获取最新版本号
- 版本一致 → 用缓存；版本变更 → 重新拉取
- 后端返回业务码 `10304` 表示菜单未变更
- 管理员修改菜单后调用 `permission/refreshMenu` 强制刷新

**使用方法**

| 场景 | 操作 |
|------|------|
| 手动清除缓存 | F12 → Application → Local Storage → 删除 `nex_menu_cache_zh-CN` 和 `nex_menu_version` |
| 代码中强制刷新 | `this.$store.dispatch('permission/refreshMenu')` |
| 管理员改菜单后 | 修改 `nex_menu` 表任意记录，`update_time` 自动更新，前端下次请求自动感知 |
| 多语言缓存 | 每种语言独立缓存，key 为 `nex_menu_cache_${lang}` |

缓存 key 定义在 `src/utils/storageKey.js`，如需修改缓存策略，编辑 `src/store/modules/permission.js` 的 `generateRoutes` 方法。

---

### 3. 主题定制

**实现原理**
- 10 个可配置颜色维度，定义在 `src/config/themeVariables.js`
- JS/Less 共享变量：`vue.config.js` 的 `ThemeVarsGeneratorPlugin` 注入 Less
- 运行时切换通过 CSS 变量实现，`src/utils/theme.js` 提供 `setThemeField`
- 用户选择持久化到 localStorage，刷新不丢失
- 每个维度支持"恢复默认"

**使用方法**

在组件中使用主题颜色：

```vue
<template>
  <!-- 直接用 CSS 变量 -->
  <div :style="{ color: 'var(--sidebar-text)' }">文字</div>
  <div class="my-bg">背景</div>
</template>

<style lang="less" scoped>
.my-bg {
  background: var(--sidebar-bg); /* Less 中也可直接用 CSS 变量 */
}
</style>
```

代码中动态修改主题颜色：
```js
import { setThemeField, getThemeValue } from '@/utils/theme'

// 设置某个维度的颜色
setThemeField('sidebar-bg', '#1a1a2e')

// 获取当前颜色值
const color = getThemeValue('sidebar-icon-color')
```

新增主题颜色维度：
1. `src/config/themeVariables.js` 添加变量
2. `src/utils/theme.js` 的 `THEME_FIELDS` 数组添加配置（含 key、label、默认色、预设色板）
3. 组件中用 `var(--你的变量名)` 引用

---

### 4. 国际化

**实现原理**
- 语言包按模块分组：`common/login/layout/error/home/profile/user/theme/audit`
- 切换语言：`setLanguage(lang)` 自动持久化 + 设置 html lang 属性 + **同步设置 Element UI 语言**
- 菜单标题：后端 `nex_menu.title_en` 字段，请求时带 `?lang=en-US`
- 路由标题：`constantRoutes` 的 `meta.titles` 用 i18n key，渲染时 `$t()` 翻译
- 语言切换后自动刷新页面，重新拉取对应语言的菜单
- Element UI 组件（分页、日期选择器、下拉框等）通过 `element-ui/lib/locale` 同步切换语言

**使用方法**

模板中使用：
```vue
<template>
  <div>{{ $t('common.confirm') }}</div>
  <el-button>{{ $t('user.add') }}</el-button>
  <!-- 带变量插值 -->
  <div>{{ $t('error.countdown', { count: 5 }) }}</div>
</template>
```

JS 中使用：
```js
// 组件内
this.$t('login.title')

// 非组件（如 store/router）
import i18n from '@/i18n'
i18n.t('layout.home')
```

data 中的中文需改成 computed：
```js
// ❌ 错误：data 中 this.$t 不响应语言切换
data() {
  return { title: this.$t('user.title') }
}

// ✅ 正确：用 computed
computed: {
  title() { return this.$t('user.title') }
}
```

新增翻译：
1. `src/i18n/langs/zh-CN.js` 添加中文
2. `src/i18n/langs/en-US.js` 添加英文
3. 保持两个文件的 key 结构一致

切换语言：
```js
import { setLanguage } from '@/i18n'
setLanguage('en-US') // 自动持久化 + 刷新页面
```

---

### 5. SVG 图标

**实现原理**
- `svg-sprite-loader` 自动扫描 `src/assets/icons/svg/` 目录
- 使用：`<svg-icon icon-file-name="home" />`
- 颜色控制：SVG 内部 path 直接写 `fill="var(--sidebar-icon-color)"`，与主题联动

**使用方法**

1. **添加图标**：将 `.svg` 文件放入 `src/assets/icons/svg/` 目录，文件名即图标名

2. **使用图标**：
```vue
<template>
  <svg-icon icon-file-name="home" class="menu-icon" />
</template>

<style scoped>
.menu-icon {
  width: 16px;
  height: 16px;
}
</style>
```

3. **让图标跟随主题颜色**：编辑 SVG 文件，将 path 的 fill 改为 CSS 变量
```xml
<!-- ❌ 写死颜色 -->
<path fill="#49c3ce" d="..." />

<!-- ✅ 跟随主题 -->
<path fill="var(--sidebar-icon-color)" d="..." />
```

4. **菜单中使用**：数据库 `nex_menu.icon` 字段填图标文件名（不含 `.svg`），如 `home`、`user`

---

### 6. 骨架屏

**实现原理**
- 路由切换时显示骨架屏（非首次进入 + 目标页面不在缓存中）
- 组件：`src/components/Skeleton/index.vue`
- 在 `AppMain.vue` 中通过 `v-if` 控制显示

**使用方法**

骨架屏已全局集成，无需额外配置。路由切换时自动显示。

如需为特定页面自定义骨架屏：

1. 在页面组件中添加 `name`，并在 `AppMain.vue` 的 `cachedViews` 中配置
2. 或直接在页面组件内部使用骨架屏组件：
```vue
<template>
  <div>
    <Skeleton v-if="loading" />
    <div v-else>实际内容</div>
  </div>
</template>

<script>
import Skeleton from '@/components/Skeleton'
export default {
  components: { Skeleton }
}
</script>
```

调整骨架屏显示时长：编辑 `src/Layout/components/AppMain/AppMain.vue` 中的 `skeletonDelay`（默认 300ms，避免快页面闪烁）。

---

### 7. 表格导出模块（Excel / PDF）

**实现原理**
- 纯前端生成，无需后端接口，支持大数据量导出
- Excel 导出：基于 `xlsx`（SheetJS）库，支持列宽自适应、表头样式
- PDF 导出：基于 `html2canvas` + `jspdf`，动态生成美观的 HTML 表格后转为图片放入 PDF，完美支持中文
- 支持**全部导出**和**选中导出**（勾选表格复选框后只导出选中行）
- PDF 支持**背景水印**（当前用户名，防泄露）、**导出人信息**（副标题显示）
- 标题和文件名支持**国际化配置**（调用方传入 `$t()` 翻译后的文本）
- 模块化设计，任何列表页面均可复用

**依赖安装**
```bash
npm install xlsx jspdf html2canvas --save
```

**核心文件**
- `src/utils/exportTable.js` — 导出工具模块（统一入口）

**API 说明**

```javascript
import { exportTable, exportExcel, exportPdf } from '@/utils/exportTable'

// 方式一：统一入口（推荐）
exportTable({
  data: tableData,           // 全部数据数组
  columns: columns,           // 列配置
  title: '用户列表',          // 导出标题（国际化后传入，PDF显示）
  filename: '用户列表',       // 文件名（国际化后传入，不含扩展名，自动加时间戳）
  format: 'excel',           // 'excel' | 'pdf'
  selected: selectedRows,    // 可选，选中行数据，传了则只导出选中
  exporter: 'admin',         // 可选，导出人（当前用户名），PDF 副标题显示
  watermark: true,           // 可选，PDF 是否启用水印，默认 true
  watermarkText: 'admin',     // 可选，水印文字，默认用 exporter
  labels: {                   // 可选，PDF 副标题国际化标签
    exporter: '导出人',        // Exporter
    time: '导出时间',          // Export Time
    countPrefix: '共',         // Total
    countSuffix: '条记录'      // records
  }
})

// 方式二：单独调用
exportExcel(data, columns, { filename, sheetName })
exportPdf(data, columns, { title, filename, exporter, watermark, watermarkText })
```

**列配置（columns）格式**

```javascript
const columns = [
  { label: '用户名', prop: 'username', width: 120 },
  { label: '真实姓名', prop: 'real_name', width: 100 },
  {
    label: '角色',
    prop: 'role',
    width: 100,
    formatter: row => roleMap[row.role] || row.role  // 自定义格式化
  },
  {
    label: '状态',
    prop: 'status',
    width: 80,
    formatter: row => row.status === 1 ? '启用' : '禁用'
  },
  { label: '创建时间', prop: 'create_time', width: 170, formatter: row => formatDate(row.create_time) },
  { label: '操作', prop: 'action', export: false }  // export: false 排除该列
]
```

**列配置字段说明**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| label | String | 是 | 列标题 |
| prop | String | 是 | 数据字段名 |
| width | Number | 否 | 列宽（像素），Excel 自动换算，PDF 用于最大宽度 |
| formatter | Function | 否 | 自定义格式化函数，参数为行数据 row，返回显示值 |
| export | Boolean | 否 | 是否导出，默认 true，设为 false 可排除操作列等 |
| align | String | 否 | 对齐方式（PDF 用），默认 center |

**在列表页面中使用（标准写法）**

1. 在 `TableToolbar` 的 `#right` 插槽中添加导出按钮：
```vue
<template #right>
  <el-button type="success" icon="el-icon-download" size="small" @click="handleExport('excel')">
    导出Excel
  </el-button>
  <el-button type="warning" icon="el-icon-document" size="small" @click="handleExport('pdf')">
    导出PDF
  </el-button>
</template>
```

2. 在 `data` 中保存选中行：
```javascript
data() {
  return {
    selectedRows: []  // 选中行数据
  }
}
```

3. 多选变化时保存：
```javascript
handleSelectionChange(selection) {
  this.selectedIds = selection.map(item => item.id)
  this.selectedRows = selection  // 保存选中行
}
```

4. 添加导出列配置（computed）：
```javascript
computed: {
  exportColumns() {
    return [
      { label: '用户名', prop: 'username', width: 120 },
      { label: '真实姓名', prop: 'real_name', width: 100 },
      // ... 更多列
    ]
  }
}
```

5. 添加导出方法（标题和文件名用 `$t()` 国际化，导出人取当前用户名）：
```javascript
methods: {
  handleExport(format) {
    const hasSelected = this.selectedRows && this.selectedRows.length > 0
    const title = hasSelected
      ? `${this.$t('user.title')}(${this.$t('common.selected')})`
      : this.$t('user.title')
    const filename = `${this.$t('user.title')}_${formatDate(new Date(), 'YYYYMMDD_HHmmss')}`
    exportTable({
      data: this.tableData,
      columns: this.exportColumns,
      title,
      filename,
      format,
      selected: hasSelected ? this.selectedRows : null,
      exporter: this.$store.state.user.userInfo?.username || '',
      watermark: true,
      labels: this.$t('common.exportLabels')
    })
  }
}
```

**国际化配置**

导出模块本身不包含语言包，所有显示文本由调用方传入：
- `title`：PDF 大标题，用 `this.$t('xxx.title')` 传入
- `filename`：导出文件名，用国际化文本 + 时间戳拼接
- `columns[].label`：列标题，在 computed 中用 `this.$t()` 翻译
- `exporter`：导出人，取 `this.$store.state.user.userInfo?.username`
- `labels`：PDF 副标题标签（导出人/导出时间/共N条记录），用 `this.$t('common.exportLabels')` 传入
- 按钮文本：`common.exportExcel` / `common.exportPdf`（已内置中英文）

**内置国际化字段**（`common.exportLabels`）：

| 字段 | 中文 | 英文 |
|------|------|------|
| exporter | 导出人 | Exporter |
| time | 导出时间 | Export Time |
| countPrefix | 共 | Total |
| countSuffix | 条记录 | records |

**已集成导出功能的页面**
- 用户管理 `src/views/system/user/index.vue` — 支持全部/选中导出，PDF 含水印和导出人
- 审计追踪 `src/views/system/audit/index.vue` — 支持全部导出，管理员/普通用户列不同

**导出效果**
- Excel：标准 .xlsx 格式，表头加粗，列宽自适应，可直接用 Excel/WPS 打开
- PDF：A4 纸张，包含标题、导出人、导出时间、记录总数、美观的斑马纹表格、背景水印（当前用户名）、自动分页、中文完美显示

---

### 8. 审计追踪（GMP 21CFR Part 11 合规）

**实现原理**
- 符合 GMP 21CFR Part 11 电子记录与电子签名要求
- 后端：`src/modules/audit/` 模块，提供 `/audit/list`（全部）、`/audit/my`（个人）、`/audit/verify`（哈希链校验）接口
- 前端：`src/views/system/audit/index.vue` 页面，管理员看全部，普通用户只看自己
- 数据库表：`nex_audit_log`，记录操作人、操作类型、操作对象、修改前后值、操作原因、结果、IP、时间、哈希链

**GMP 合规特性**

| 特性 | 实现方式 | 说明 |
|------|---------|------|
| 哈希链防篡改 | SHA-256 哈希链，每条记录包含前一条的哈希 | 任何一条记录被修改，后续哈希链全部断裂 |
| 只增不改不删 | 数据库触发器禁止 UPDATE/DELETE | 审计日志一旦写入，无法修改或删除 |
| 电子签名 | 关键操作需密码验证 + 操作原因 | 删除用户、修改 PLC 参数等操作需电子签名 |
| 登录失败锁定 | 连续失败 5 次锁定 30 分钟 | 防止暴力破解 |
| 会话超时登出 | 30 分钟无操作自动登出 | 防止未授权访问 |
| 操作原因 | 关键操作必须填写原因 | GMP 要求"为什么做" |

**审计覆盖范围**

| 操作 | 记录内容 |
|------|---------|
| 用户登录成功/失败 | 用户名、IP、结果、失败原因 |
| 用户注册 | 用户名、IP |
| 新增/修改/删除用户 | 操作人、目标用户、修改前后值、原因 |
| 批量删除用户 | 操作人、目标ID列表、原因 |
| 修改用户状态 | 操作人、目标用户、状态变化、原因 |
| PLC 参数修改 | 操作人、点位、修改前后值、回读验证、原因、电子签名 |

**权限控制**

| 角色 | 可见范围 | 操作权限 |
|------|---------|---------|
| 管理员（administrator） | 全部用户的审计日志 | 查看 + 按用户名/操作类型/时间范围筛选 + 哈希链校验 |
| 普通用户（engineer/operator） | 仅自己的操作记录 | 仅查看，无删除/修改 |

**使用方法**

入口：右上角用户头像下拉菜单 → **审计追踪**

代码中记录审计日志（后端）：
```js
// 推荐：使用 auditLogger 统一入口，自动提取操作人信息
const auditLogger = require('@/modules/audit/auditLogger')

// 方式一：传入 req，自动提取 userId/userName/ip/userAgent
await auditLogger.log(req, {
  action: auditLogger.ACTION.PLC_WRITE,  // 使用预定义常量
  target: 'fillVolume (灌装体积)',
  oldValue: '100.0',
  newValue: '150.5',
  result: 'success',
  reason: '工艺调整'
})

// 方式二：手动传入操作人信息
await auditLogger.log({ userId: 1, userName: 'admin', ip: '127.0.0.1' }, {
  action: '自定义操作类型',
  target: '操作对象',
  result: 'success'
})

// 方式三：使用快捷方法
await auditLogger.logUserUpdate(req, target, oldValue, newValue)
await auditLogger.logPlcWrite(req, target, oldValue, newValue, reason)
await auditLogger.logExport(req, target)
```

**审计模块独立化设计**：
- 其他业务模块只依赖 `auditLogger.js`，不直接引用 `audit.service.js`
- 新增操作类型在 `auditLogger.ACTION` 中添加常量
- 替换存储方式（如 Elasticsearch）只需重写 `audit.model.js`，外部调用无需修改
- 模块独立 README：`src/modules/audit/README.md`

**审计范围说明**

默认只记录**写操作**（新增、修改、删除、登录），不记录查询操作，原因：
1. 查询操作量大，会导致日志表膨胀
2. 查询不改变数据，GMP 合规通常不要求
3. 避免性能影响和存储成本

如需记录特定敏感数据的查询，可针对性调用 `auditService.create()`。

**API 接口**

| 接口 | 方法 | 说明 |
|------|------|------|
| `/prod-api/v2/audit/list` | GET | 分页查询全部审计日志（管理员），支持 `userId`/`action`/`target`/`startTime`/`endTime`/`page`/`pageSize` 筛选 |
| `/prod-api/v2/audit/my` | GET | 查询当前登录用户的操作记录 |

---

### 9. 数据字典管理

#### 功能说明

统一管理系统枚举值，前端 DictTag 组件可根据字典编码自动加载并渲染带颜色的标签。

#### 页面位置

`src/views/system/dict/index.vue` — 左侧字典类型列表，右侧字典项管理。

#### DictTag 组件使用

```vue
<!-- 方式一：手动传入 options -->
<dict-tag :options="statusOptions" :value="row.status" />

<!-- 方式二：传入 dict-code，自动从后端加载 -->
<dict-tag dict-code="user_status" :value="row.status" />
```

#### API 文件

`src/api/dict.js` — 字典类型和字典项的 CRUD 接口。

#### 使用场景

- 用户状态、性别、角色等枚举值的统一管理
- 表格中自动渲染带颜色的标签
- 避免硬编码枚举值

### 9.1 多语言输入组件 I18nInput

#### 功能说明

通用中英文双输入框组件，v-model 自动绑定 JSON 格式 `{"zh-CN": "...", "en-US": "..."}`，支持 input/textarea 两种模式，统一所有配置类数据的多语言录入。

#### 组件位置

`src/components/I18nInput/index.vue` — 已全局注册，可直接使用。

#### 使用方式

```vue
<!-- 输入框模式 -->
<i18n-input
  v-model="form.role_name"
  type="input"
  zh-label="角色名称(中文)"
  en-label="角色名称(English)"
  :maxlength="50"
/>

<!-- 文本域模式 -->
<i18n-input
  v-model="form.description"
  type="textarea"
  :rows="3"
  zh-label="描述(中文)"
  en-label="描述(English)"
  :maxlength="200"
/>
```

#### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value / v-model | 绑定值，JSON 格式 `{"zh-CN": "...", "en-US": "..."}` | Object/String | `{}` |
| type | 输入类型，可选 `input` / `textarea` | String | `input` |
| zh-label | 中文输入框标签 | String | `中文` |
| en-label | 英文输入框标签 | String | `English` |
| zh-placeholder | 中文占位符 | String | `请输入中文` |
| en-placeholder | 英文占位符 | String | `Please enter English` |
| disabled | 是否禁用 | Boolean | `false` |
| maxlength | 最大长度 | Number | `200` |
| rows | textarea 行数 | Number | `2` |

#### 使用场景

- 数据字典类型名称、字典项标签的多语言录入
- 角色名称、描述的多语言录入
- 部门名称的多语言录入
- 所有需要存储中英文的配置类数据

### 10. 角色管理

#### 功能说明

管理系统角色，支持角色的增删改查，以及角色与菜单权限的关联分配。

#### 页面位置

`src/views/system/role/index.vue` — 角色列表 + 菜单权限树分配。

#### API 文件

`src/api/role.js` — 角色 CRUD 接口。

#### 数据范围

| data_scope | 说明 |
|------------|------|
| `all` | 全部数据 |
| `dept` | 本部门数据 |
| `dept_and_child` | 本部门及子部门数据 |
| `self` | 仅本人数据 |

### 11. 部门管理

#### 功能说明

管理组织架构，支持树形结构的部门管理。

#### 页面位置

`src/views/system/dept/index.vue` — 树形表格展示部门结构，支持新增子部门。

#### API 文件

`src/api/dept.js` — 部门 CRUD 接口。

### 12. 通知中心

#### 功能说明

系统通知管理，支持通知列表、标记已读、删除，配合 WebSocket 实现实时推送。

#### 页面位置

`src/views/notification/index.vue` — 通知列表页面，支持全部/未读/已读筛选。

#### Navbar 通知铃铛

`src/components/NotificationBell/index.vue` — 可放置在 Navbar 中，显示未读数量，点击展开最近通知。

```vue
<!-- 在 Navbar 中使用 -->
<notification-bell />
```

#### API 文件

`src/api/notification.js` — 通知查询、标记已读、删除接口。

### 13. WebSocket 实时推送

#### 功能说明

通用 WebSocket 客户端，支持自动重连、心跳检测、消息订阅。

#### 工具类

`src/utils/websocket.js`

#### 使用方式

```js
import { websocket } from '@/utils/websocket'

// 连接（登录后调用）
websocket.connect(userId)

// 订阅通知
websocket.on('notification', (data) => {
  this.$notify({ title: data.title, message: data.content })
})

// 断开连接（退出登录时调用）
websocket.disconnect()
```

#### 配置

```bash
# .env.development
VUE_APP_WS_PORT=3002
```

### 14. Swagger API 文档

#### 访问地址

后端启动后访问：`http://localhost:3002/api-docs`

#### 使用方式

1. 点击右上角 "Authorize"，输入 `Bearer <token>`
2. 选择接口，点击 "Try it out" 在线调试
3. 生产环境自动禁用

---

## 后续增加功能指南

### 新增业务模块（以"订单管理"为例）

#### 后端

1. **新建模块目录**：`src/modules/order/`
2. **创建文件**：
   - `order.model.js` — 继承 BaseModel 或自定义查询
   - `order.service.js` — **继承 BaseService**，自动拥有通用 CRUD，只需实现特殊业务逻辑
   - `order.controller.js` — **继承 BaseController**，自动拥有 7 个标准 REST 接口
   - `order.route.js` — 路由，`router.get('/', ...)`
   - `order.schema.js` — Joi 参数校验
3. **路由自动加载**：`routes/router.js` 自动扫描 `modules/*/` 下的 `*.route.js`，无需手动注册
4. **数据库建表**：`nex_order` 表，含 `create_time`、`update_time` 等标准字段

**后端基类使用建议**：
- Service 继承 `BaseService`，在构造函数中配置 `name`（模块名称）和 `langFields`（需要多语言处理的字段数组）
- Controller 继承 `BaseController`，在构造函数中传入 service 实例
- 通用 CRUD（getList/getAll/getById/create/update/delete/batchDelete）自动拥有，无需重复实现
- 特殊业务逻辑在子类中添加新方法即可
- 自定义查询条件可重写 `buildWhere(params)` 方法
- 详细使用方式请参考后端 README 的"通用基类（BaseService / BaseController）"章节

#### 前端

1. **新建 API 文件**：`src/api/order.js`，封装接口调用
2. **新建页面**：`src/views/order/index.vue`，参考 `system/user/index.vue` 模板
3. **新建组件**（如需）：`src/views/order/components/OrderDialog.vue`
4. **组件映射**：在 `src/router/helper/componentsMap.js` 中注册组件
5. **菜单配置**：在数据库 `nex_menu` 表添加菜单记录，`nex_user_menu` 关联角色
6. **国际化**（如需）：在 `zh-CN.js` / `en-US.js` 中添加翻译

### 新增主题颜色维度

1. `src/config/themeVariables.js` — 添加变量
2. `src/utils/theme.js` — `THEME_FIELDS` 数组添加配置
3. `src/assets/styles/variables.less` — 添加 Less 变量
4. 组件中使用 `var(--你的变量名)`

### 新增语言（如日语）

1. 新建 `src/i18n/langs/ja-JP.js`
2. `src/i18n/index.js` — `messages` 中注册 + `LANGUAGES` 中添加
3. 后端 `nex_menu` 表添加 `title_ja` 字段
4. `menu.model.js` — SQL 的 CASE 分支添加日语判断

## API 接口文档

基础路径：`/prod-api/v2`

### 用户模块 `/user`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | `/user/login` | 登录 | 否 |
| POST | `/user/register` | 注册 | 否 |
| GET | `/user/tokenvalid` | 验证 Token 有效性 | 可选 |
| GET | `/user/info` | 获取当前用户信息 | 是 |
| GET | `/user/` | 用户列表（分页+搜索） | 是 |
| GET | `/user/:id` | 用户详情 | 是 |
| POST | `/user/` | 创建用户 | 是 |
| PUT | `/user/:id` | 更新用户 | 是 |
| DELETE | `/user/:id` | 删除用户 | 是 |
| DELETE | `/user/batch` | 批量删除 | 是 |

### 菜单模块 `/menu`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/menu/version` | 获取菜单最新版本号 | 是 |
| GET | `/menu/getRouters?version=xxx&lang=zh-CN` | 获取用户菜单路由 | 是 |

**菜单接口说明**：
- `version`：前端缓存的版本号，传入后若未变更返回 `code=10304`
- `lang`：语言代码，`zh-CN` / `en-US`，控制返回的菜单标题语言
- 返回结构：`{ menu: [...], version: "2026-08-16T..." }`

### 客户模块 `/customer`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/customer/` | 客户列表 | 是 |
| GET | `/customer/:id` | 客户详情 | 是 |
| POST | `/customer/` | 创建客户 | 是 |
| PUT | `/customer/:id` | 更新客户 | 是 |
| DELETE | `/customer/:id` | 删除客户 | 是 |
| DELETE | `/customer/batch` | 批量删除 | 是 |

### 验证码模块 `/captcha`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/captcha/captchaImage` | 获取 SVG 验证码 | 否 |

### 文件上传模块 `/upload`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | `/upload/local` | 本地上传单文件 | 是 |
| POST | `/upload/local/batch` | 本地批量上传 | 是 |
| DELETE | `/upload/local` | 本地删除文件 | 是 |
| POST | `/upload/github` | GitHub 图床上传 | 是 |
| POST | `/upload/github/batch` | GitHub 批量上传 | 是 |
| DELETE | `/upload/github/batch` | GitHub 批量删除 | 是 |

### 审计追踪模块 `/audit`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/audit/list` | 分页查询全部审计日志（管理员），支持 `userId`/`action`/`target`/`startTime`/`endTime`/`page`/`pageSize` 筛选 | 是 |
| GET | `/audit/my` | 查询当前登录用户的操作记录 | 是 |
| GET | `/audit/verify` | 校验哈希链完整性（仅管理员），返回 `{ valid, brokenAt, total }` | 是（管理员） |

**PLC 写操作接口变更（GMP电子签名）**：
`POST /plc/write-tag` 请求体新增必填字段：
- `reason`：操作原因（至少2个字符）
- `password`：当前用户密码（电子签名验证）

### 统一响应格式

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": { ... },
  "timestamp": 1786874894734
}
```

## 错误代码说明

### 编码规则

| 范围 | 模块 |
|------|------|
| 200 | 成功 |
| 10xxx | 通用错误（参数/鉴权/验证码/系统） |
| 20xxx | 用户模块 |
| 30xxx | 设备模块（预留） |
| 40xxx | PLC 模块（预留） |
| 50xxx | 报警模块（预留） |
| 60xxx | 工单模块（预留） |
| 70xxx | 文件上传模块 |

### 通用错误码

| 错误码 | 常量名 | 说明 |
|--------|--------|------|
| 200 | SUCCESS | 操作成功 |
| 10001 | PARAM_ERROR | 参数错误 |
| 10002 | PARAM_MISSING | 缺少必填参数 |
| 10003 | PARAM_INVALID | 参数格式不正确 |
| 10101 | UNAUTHORIZED | 未登录 |
| 10102 | TOKEN_EXPIRED | Token 已过期 |
| 10103 | TOKEN_INVALID | Token 无效 |
| 10104 | PERMISSION_DENIED | 权限不足 |
| 10201 | CAPTCHA_EXPIRED | 验证码已失效 |
| 10202 | CAPTCHA_ERROR | 验证码错误 |
| 10304 | MENU_NOT_MODIFIED | 菜单未变更（缓存命中） |
| 10404 | NOT_FOUND | 接口/资源不存在 |
| 10500 | SYSTEM_ERROR | 系统错误 |
| 10501 | DATABASE_ERROR | 数据库操作失败 |
| 10502 | NETWORK_ERROR | 网络错误 |

### 用户模块错误码

| 错误码 | 常量名 | 说明 |
|--------|--------|------|
| 20001 | USER_NOT_EXIST | 用户不存在 |
| 20002 | USER_ALREADY_EXIST | 用户已存在 |
| 20003 | USER_PASSWORD_ERROR | 密码错误 |
| 20004 | USER_DISABLED | 账号已被禁用 |
| 20005 | USER_REGISTER_FAIL | 注册失败 |

### 文件上传错误码

| 错误码 | 常量名 | 说明 |
|--------|--------|------|
| 70001 | FILE_NOT_EXIST | 文件不存在 |
| 70002 | FILE_TOO_LARGE | 文件大小超出限制 |
| 70003 | FILE_TYPE_NOT_ALLOWED | 文件类型不允许 |
| 70004 | FILE_UPLOAD_FAIL | 文件上传失败 |
| 70005 | FILE_DELETE_FAIL | 文件删除失败 |
| 70101 | GITHUB_CONFIG_ERROR | GitHub 配置错误 |
| 70102 | GITHUB_UPLOAD_FAIL | GitHub 上传失败 |

## 数据库表结构

### 核心表

| 表名 | 说明 |
|------|------|
| nex_user | 用户表（含 role/status/password 等） |
| nex_menu | 菜单表（含 title/title_en/path/icon/component 等） |
| nex_user_menu | 用户-菜单关联表（user_id + menu_id） |
| nex_customer | 客户表（示例业务表） |
| nex_audit_log | 审计日志表（GMP 21CFR Part 11 电子记录） |

### nex_menu 关键字段

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(32) | 菜单ID（如 _001, _001_01） |
| parent_id | varchar(32) | 父菜单ID |
| name | varchar(50) | 路由 name |
| path | varchar(100) | 路由路径 |
| component | varchar(100) | 组件路径 |
| title | varchar(50) | 中文标题 |
| title_en | varchar(100) | 英文标题 |
| icon | varchar(50) | 图标名 |
| sort | int | 排序 |
| hidden | tinyint | 是否隐藏 |
| always_show | tinyint | 是否始终显示 |
| no_cache | tinyint | 是否不缓存 |
| update_time | timestamp | 更新时间（版本号用，ON UPDATE CURRENT_TIMESTAMP） |

### nex_audit_log 关键字段

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键自增 |
| user_id | int | 操作人ID |
| user_name | varchar(50) | 操作人姓名 |
| action | varchar(100) | 操作类型（PLC参数修改/用户登录/数据导出等） |
| target | varchar(200) | 操作对象 |
| old_value | text | 修改前值 |
| new_value | text | 修改后值 |
| result | varchar(20) | 操作结果 success/failed |
| reason | varchar(500) | 操作原因（GMP要求，电子签名时必填） |
| ip | varchar(50) | 操作IP |
| user_agent | varchar(500) | 浏览器UA |
| prev_hash | varchar(64) | 前一条记录哈希值（哈希链，防篡改） |
| current_hash | varchar(64) | 当前记录哈希值（SHA-256） |
| created_at | datetime | 操作时间 |

**数据库触发器（GMP合规）**：
- `trg_audit_log_no_update`：禁止 UPDATE 操作
- `trg_audit_log_no_delete`：禁止 DELETE 操作

**哈希链校验接口**：`GET /prod-api/v2/audit/verify`（仅管理员），返回 `{ valid, brokenAt, total }`

## 配置文件说明

### 前端配置

| 文件 | 说明 |
|------|------|
| `.env.development` | 开发环境变量（API 路径/代理目标/端口） |
| `.env.production` | 生产环境变量 |
| `.env.example` | 环境变量示例 |
| `vue.config.js` | Vue CLI 配置（代理/Less 注入/SVG 处理） |
| `babel.config.js` | Babel 配置（Element UI 按需引入） |
| `jsconfig.json` | VS Code 路径别名配置 |
| `src/settings.js` | 系统全局设置（水印/标签页/会话超时时间等） |

**`src/settings.js` 关键配置**：
- `sessionTimeout: 30` — 会话超时时间（分钟），用户无操作超过此时间自动登出（GMP 合规）
- `watermark: false` — 是否启用水印（显示当前用户名，防止截图泄露）
- `tagsView: true` — 是否显示标签页导航

### 后端配置

| 文件 | 说明 |
|------|------|
| `.env` | 环境变量（数据库/JWT/上传/GitHub） |
| `src/config/db.config.js` | 数据库连接配置 |
| `src/config/jwt.config.js` | JWT 密钥/过期时间 |
| `src/config/upload.config.js` | 上传路径/大小限制/GitHub 配置 |

**NTP 时间同步（GMP 合规要求）**：

审计日志的时间戳必须准确可信，生产环境必须配置 NTP 时间同步：

**Windows 服务器**：
```powershell
# 设置 NTP 服务器（阿里云公共 NTP）
w32tm /config /manualpeerlist:"ntp.aliyun.com time.windows.com" /syncfromflags:manual /reliable:yes /update
# 立即同步
w32tm /resync
# 查看同步状态
w32tm /query /status
```

**Linux 服务器**：
```bash
# 安装 chrony
yum install chrony -y
# 配置 NTP 服务器
echo "server ntp.aliyun.com iburst" >> /etc/chrony.conf
# 启动并设置开机自启
systemctl start chronyd && systemctl enable chronyd
# 查看同步状态
chronyc sources -v
```

**GMP 要求**：时间偏差应控制在 ±1 分钟以内，建议每 24 小时自动同步一次。

## 作为管理系统模板的改进建议

### 已具备的能力

- 完整的登录/注册/鉴权流程
- 动态路由 + 菜单权限
- 用户管理 CRUD 完整示例
- 主题定制 + 国际化
- 菜单缓存 + 骨架屏
- 文件上传（本地 + GitHub 图床）
- 审计追踪（GMP 21CFR Part 11 合规，哈希链防篡改）
- 表格导出（Excel/PDF，全部/选中导出，水印，国际化）
- 电子签名（关键操作密码验证 + 操作原因）
- 个人中心（用户信息展示，只读）

### 建议补充的能力

1. **数据字典管理**：后端字典表 + 前端 DictTag 组件联动
2. **角色管理**：目前角色是写死的（admin/engineer/operator），建议做成可配置
3. **部门管理**：支持组织架构
4. **导入功能**：Excel 批量导入（目前只有导出）
5. **单元测试**：后端 Jest 已配置，建议补充核心模块测试
6. **Docker 部署**：Dockerfile + docker-compose，一键启动
7. **API 文档**：集成 Swagger/OpenAPI，自动生成接口文档
8. **WebSocket**：如需实时推送（报警/通知），可集成
9. **数据权限**：行级数据权限控制（目前只有菜单级权限）
10. **通知中心**：系统消息/报警通知推送

## License

MIT

## 系统配置模块

### 功能说明
系统配置模块提供统一的配置管理界面，支持查看和修改系统参数。配置项按分类管理，包括系统设置、安全设置、设备连接、导出设置、连接设置等。

### 页面路径
- 菜单：系统设置 > 参数配置
- 路由：\/system/config\`n- 组件：\src/views/system/config/index.vue\`n
### 配置管理工具
\src/utils/config.js\ — 前端配置管理工具，提供配置的加载、缓存、获取和实时生效功能。

\\\javascript
import { loadConfig, getConfig, applyConfig } from '@/utils/config'

// 应用启动时加载配置
await loadConfig()

// 获取配置值
const heartbeatInterval = getConfig('heartbeatInterval', 25000)

// 更新配置并实时生效
applyConfig({ heartbeatInterval: 30000 })
\\\`n
### API 接口
\src/api/config.js\ — 系统配置 API 接口

| 方法 | 函数 | 说明 |
|------|------|------|
| GET | \equestGetAllConfigsApi()\ | 获取所有配置 |
| GET | \equestGetConfigsByCategoryApi(category)\ | 根据分类获取配置 |
| PUT | \equestUpdateConfigsApi(configs)\ | 批量更新配置 |
| POST | \equestResetConfigsApi()\ | 重置所有配置为默认值 |

### 配置项清单

#### 系统设置
- \sessionTimeout\ — 会话超时时间（分钟），默认 30
- \defaultPageSize\ — 默认每页条数，默认 20
- \defaultLanguage\ — 默认语言，默认 zh-CN
- \dateFormat\ — 日期显示格式，默认 YYYY-MM-DD

#### 安全设置
- \watermarkEnabled\ — 是否启用水印，默认 false
- \watermarkText\ — 水印文字（为空时使用当前用户名）

#### 设备连接设置
- \plcProtocol\ — 通信协议，默认 ModbusTcp
- \plcHost\ — 设备IP地址，默认 127.0.0.1
- \plcPort\ — 设备端口，默认 502
- \plcUnitId\ — Modbus单元ID，默认 1
- \pollFastInterval\ — 快速轮询间隔（ms），默认 200
- \pollSlowInterval\ — 慢速轮询间隔（ms），默认 1000

#### 导出设置
- \pdfWatermarkEnabled\ — PDF导出水印开关，默认 true
- \pdfWatermarkText\ — PDF水印文字（为空时使用当前用户名）

#### 连接设置
- \heartbeatInterval\ — WebSocket心跳间隔（ms），默认 25000

### 实时生效说明
配置保存后，以下配置项会实时生效：
- \heartbeatInterval\ — WebSocket 心跳间隔
- \sessionTimeout\ — 会话超时时间
- \defaultPageSize\ — 默认每页条数

其他配置项（如 PLC 连接参数）需要重新连接设备后生效。

