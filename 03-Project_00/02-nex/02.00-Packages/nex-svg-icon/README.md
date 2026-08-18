# nex-svg-icon

Vue 2 SVG 图标组件，配合 svg-sprite-loader 使用，支持字体图标和 SVG 图标自动切换。

## 安装

```bash
npm install nex-svg-icon svg-sprite-loader --save
```

## 配置

### 1. vue.config.js

```js
const path = require('path')
const { configureSvgIcon } = require('nex-svg-icon/vue-config')

module.exports = {
  chainWebpack: config => {
    configureSvgIcon(config, {
      svgDir: path.resolve(__dirname, 'src/assets/icons/svg')
    })
  }
}
```

### 2. 全局注册（main.js）

```js
import SvgIcon from 'nex-svg-icon'
Vue.component('svg-icon', SvgIcon)
```

### 3. 自动导入 SVG（main.js）

```js
const req = require.context('@/assets/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
```

## 使用

```vue
<!-- SVG 图标 -->
<svg-icon icon-file-name="home" class="menu-icon" />

<!-- 字体图标（el-icon- 开头自动渲染 i 标签） -->
<svg-icon icon-file-name="el-icon-user" />
```

## SVG 文件规范

- 放在 `src/assets/icons/svg/` 目录
- 文件名即 icon-file-name（不含 .svg）
- 建议 path 设置 `fill="currentColor"` 或 `fill="var(--xxx)"` 支持颜色切换

## API

### Props

| 参数 | 说明 | 类型 | 必填 |
|------|------|------|------|
| icon-file-name | 图标文件名（不含 .svg）或 el-icon-xxx | String | 是 |

## License

MIT
