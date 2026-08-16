# SVG 图标使用文档

## 概述

项目使用 `svg-sprite-loader` 将 SVG 图标自动注册为雪碧图，通过 `<svg-icon>` 组件使用。

## 图标存放位置

```
src/assets/icons/svg/
├── 404.svg
├── administrator.svg
├── appointment.svg
├── customer.svg
├── engineer.svg
├── flow.svg
├── home.svg
├── operator.svg
└── who.svg
```

## 使用方法

### 基本用法

```vue
<template>
  <!-- icon-file-name 为 svg 文件名（不含扩展名） -->
  <svg-icon icon-file-name="home" />
</template>
```

### 设置大小

```vue
<svg-icon icon-file-name="home" style="width: 24px; height: 24px;" />
```

### 设置颜色

SVG 图标颜色通过 `fill: currentColor` 继承父元素文字颜色：

```vue
<span style="color: #409eff;">
  <svg-icon icon-file-name="home" />
</span>
```

### 菜单中使用

路由配置的 `meta.icon` 字段直接写图标名（不含扩展名），Sidebar 会自动渲染：

```js
{
  path: '/home',
  name: 'Home',
  meta: { title: '首页', icon: 'home' }
}
```

## 新增图标

1. 将 SVG 文件放入 `src/assets/icons/svg/` 目录
2. 文件名即为图标名（建议使用小写英文，用连字符分隔）
3. 无需任何配置，自动注册生效

### SVG 文件规范

- 建议使用单色 SVG，颜色通过 CSS 控制
- SVG 中 `fill` 属性建议设为 `currentColor` 或移除
- 画布尺寸建议 24x24 或 16x16
- 文件名使用小写英文，如 `user-profile.svg`

## 组件 Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| icon-file-name | SVG 文件名（不含扩展名） | String | - |
| className | 自定义 class | String | '' |

## 实现原理

1. `src/assets/icons/index.js` 使用 `require.context` 自动加载 `svg/` 目录下所有 `.svg` 文件
2. `svg-sprite-loader` 将 SVG 编译为 `<symbol>` 元素，注入页面
3. `SvgIcon` 组件通过 `<use xlink:href="#icon-xxx">` 引用对应图标
4. 全局注册后可直接使用 `<svg-icon>` 标签

## 常见问题

### 图标不显示？
- 检查文件名是否正确（区分大小写，不含扩展名）
- 检查 SVG 文件是否在 `src/assets/icons/svg/` 目录下
- 检查 SVG 是否有语法错误

### 图标颜色改不了？
- 检查 SVG 文件中是否写死了 `fill` 属性，改为 `fill="currentColor"` 或移除
- 确保父元素设置了 `color` 属性
