# nexCM-V2 管理系统模板

基于 Vue 2.6 + Element UI + Express + MySQL 的企业级前后端分离管理系统模板，开箱即用，适合快速搭建中后台项目。

## 功能特性

- **动态路由**：基于角色的菜单权限控制，后端返回菜单树，前端动态生成路由
- **菜单缓存**：localStorage + 版本号机制，减少首次进入 API 延迟，支持热刷新
- **主题定制**：10 维度颜色调色板（侧边栏背景/文字/悬停/图标/选中背景等），运行时切换，CSS 变量驱动
- **国际化**：中英文切换，菜单标题后端多语言字段支持，页面文字 i18n 驱动
- **骨架屏**：路由切换骨架屏，提升感知速度
- **标签页**：多标签页切换，支持右键菜单（刷新/关闭/关闭其他/关闭左右/全部关闭）
- **菜单搜索**：顶部搜索框，直达对应菜单
- **SVG 图标**：svg-sprite-loader 自动注册，CSS 变量控制颜色
- **用户管理**：完整 CRUD + 批量删除 + 导出 + 重置密码
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
│   └── Skeleton/           # 骨架屏
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
- 语言包按模块分组：`common/login/layout/error/home/profile/user/theme`
- 切换语言：`setLanguage(lang)` 自动持久化 + 设置 html lang 属性
- 菜单标题：后端 `nex_menu.title_en` 字段，请求时带 `?lang=en-US`
- 路由标题：`constantRoutes` 的 `meta.titles` 用 i18n key，渲染时 `$t()` 翻译
- 语言切换后自动刷新页面，重新拉取对应语言的菜单

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

## 后续增加功能指南

### 新增业务模块（以"订单管理"为例）

#### 后端

1. **新建模块目录**：`src/modules/order/`
2. **创建文件**：
   - `order.model.js` — 继承 BaseModel 或自定义查询
   - `order.service.js` — 业务逻辑
   - `order.controller.js` — 控制器，调用 service
   - `order.route.js` — 路由，`router.get('/', ...)`
   - `order.schema.js` — Joi 参数校验
3. **路由自动加载**：`routes/router.js` 自动扫描 `modules/*/` 下的 `*.route.js`，无需手动注册
4. **数据库建表**：`nex_order` 表，含 `create_time`、`update_time` 等标准字段

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

### 后端配置

| 文件 | 说明 |
|------|------|
| `.env` | 环境变量（数据库/JWT/上传/GitHub） |
| `src/config/db.config.js` | 数据库连接配置 |
| `src/config/jwt.config.js` | JWT 密钥/过期时间 |
| `src/config/upload.config.js` | 上传路径/大小限制/GitHub 配置 |

## 作为管理系统模板的改进建议

### 已具备的能力

- 完整的登录/注册/鉴权流程
- 动态路由 + 菜单权限
- 用户管理 CRUD 完整示例
- 主题定制 + 国际化
- 菜单缓存 + 骨架屏
- 文件上传（本地 + GitHub 图床）

### 建议补充的能力

1. **操作日志**：记录用户关键操作（增删改），便于审计
2. **数据字典管理**：后端字典表 + 前端 DictTag 组件联动
3. **角色管理**：目前角色是写死的（admin/engineer/operator/guest），建议做成可配置
4. **部门管理**：支持组织架构
5. **导入功能**：Excel 批量导入（目前只有导出）
6. **单元测试**：后端 Jest 已配置，建议补充核心模块测试
7. **Docker 部署**：Dockerfile + docker-compose，一键启动
8. **API 文档**：集成 Swagger/OpenAPI，自动生成接口文档
9. **WebSocket**：如需实时推送（报警/通知），可集成
10. **数据权限**：行级数据权限控制（目前只有菜单级权限）

## License

MIT
