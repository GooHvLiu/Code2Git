# nex-theme-picker

Vue 2 + Element UI 侧边栏主题调色板组件，支持多维度颜色配置、运行时切换、localStorage 持久化。

## 特性

- 10 个可配置颜色维度（侧边栏背景/文字/图标/悬停/选中、标签页、主内容区）
- 运行时 CSS 变量切换，无需重新编译
- localStorage 持久化用户配置
- 每个颜色项支持单独恢复默认
- 预设颜色 + 自定义颜色选择器
- JS / Less 共享变量，改一处两边生效
- 选中菜单右侧竖线指示

## 安装

```bash
npm install nex-theme-picker --save
npm install style-resources-loader --save-dev
```

## 快速开始

### 1. vue.config.js 配置

```js
const path = require('path')
const { configureTheme } = require('nex-theme-picker/vue-config')

const themeConfig = configureTheme({
  // 你的主题变量文件（可复制包内的默认配置修改）
  themeVarsPath: path.resolve(__dirname, 'src/config/themeVariables.js'),
  // 自动生成的 less 变量文件（加入 .gitignore）
  outputPath: path.resolve(__dirname, 'src/assets/styles/_theme_vars.less'),
  // 你的基础变量文件
  variablesLess: path.resolve(__dirname, 'src/assets/styles/variables.less'),
  // 你的 mixin 文件（可选）
  mixinLess: path.resolve(__dirname, 'src/assets/styles/mixin.less')
})

module.exports = {
  chainWebpack: themeConfig.chainWebpack,
  configureWebpack: themeConfig.configureWebpack
}
```

### 2. 创建 themeVariables.js

复制包内默认配置到你的项目：

```js
// src/config/themeVariables.js
module.exports = {
  'sidebar-bg': '#faf7f2',
  'sidebar-text': '#808080',
  'sidebar-icon-color': '#49c3ce',
  'sidebar-hover-bg': '#808080',
  'sidebar-hover-text': '#ffffff',
  'sidebar-active-bg': '#ffffff',
  'tag-active-bg': '#49c3ce',
  'tag-border': '#49c3ce',
  'tag-close-color': '#49c3ce',
  'app-main-bg': '#ffffff'
}
```

### 3. variables.less 定义基础变量

```less
// src/assets/styles/variables.less
@import '~nex-theme-picker/src/styles/variables.less';
// 或手动定义：
// @sidebar-bg: #faf7f2;
// @sidebar-text: #808080;
// ...
```

### 4. 全局引入运行时样式

```less
// src/assets/styles/index.less
@import '~nex-theme-picker/src/styles/runtime.less';
```

### 5. main.js 初始化

```js
import { initTheme } from 'nex-theme-picker'
initTheme()
```

### 6. 使用组件

```vue
<!-- 在 Navbar 右侧 -->
<template>
  <div class="navbar-right">
    <ThemePicker />
  </div>
</template>

<script>
import ThemePicker from 'nex-theme-picker'
export default {
  components: { ThemePicker }
}
</script>
```

## API

### 工具函数

```js
import {
  initTheme,        // 初始化（从 localStorage 恢复）
  setThemeField,    // 设置单个颜色
  getThemeField,    // 获取单个颜色
  resetThemeField,  // 重置单个颜色
  resetAllTheme,    // 重置所有颜色
  THEME_FIELDS,     // 可配置字段列表
  mixColor          // 颜色混合工具
} from 'nex-theme-picker'

// 设置侧边栏图标颜色
setThemeField('sidebarIconColor', '#ff0000')

// 获取当前颜色
getThemeField('sidebarBg') // '#faf7f2'

// 重置单个
resetThemeField('sidebarIconColor')

// 重置全部
resetAllTheme()
```

### 可配置字段

| key | 说明 | CSS 变量 |
|-----|------|---------|
| `sidebarBg` | 侧边栏背景 | `--sidebar-bg` |
| `sidebarText` | 侧边栏文字 | `--sidebar-text` |
| `sidebarIconColor` | 侧边栏图标 | `--sidebar-icon-color` |
| `sidebarHoverBg` | 悬停背景 | `--sidebar-hover-bg` |
| `sidebarHoverText` | 悬停文字 | `--sidebar-hover-text` |
| `sidebarActiveBg` | 选中菜单背景 | `--sidebar-active-bg` |
| `tagActiveBg` | 选中标签背景 | `--tag-active-bg` |
| `tagBorder` | 标签边框 | `--tag-border` |
| `tagCloseColor` | 标签叉号 | `--tag-close-color` |
| `appMainBg` | 主内容背景 | `--app-main-bg` |

## 目录结构

```
nex-theme-picker/
├── index.js                    # 主入口
├── vue-config.js               # vue.config.js 辅助函数
├── package.json
├── README.md
└── src/
    ├── ThemePicker.vue         # 调色板组件
    ├── theme.js                # 主题切换工具
    ├── themeVariables.js       # 默认颜色配置
    └── styles/
        ├── variables.less      # 基础 Less 变量
        └── runtime.less        # 运行时 CSS 变量和覆盖样式
```

## 注意事项

1. `_theme_vars.less` 是自动生成的，加入 `.gitignore`
2. SVG 图标需要设置 `fill="var(--sidebar-icon-color)"` 才能随主题变色
3. 依赖 Element UI 的 `el-icon-plus`、`el-icon-check` 等字体图标
4. 运行时无法修改源码 `themeVariables.js`，只能改 CSS 变量

## License

MIT
