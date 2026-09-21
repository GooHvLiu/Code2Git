/**
 * 布局模块 - 快捷菜单国际化字段
 * 快捷菜单、语言切换、主题切换相关文案
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  // 【标签】快捷菜单标题
  title: '快捷菜单',
  // 【子模块】语言切换
  language: {
    // 【标签】语言切换标题
    title: '语言切换',
    // 【消息】语言切换成功
    switched: '语言切换成功',
    // 【消息】语言切换失败
    switchFailed: '语言切换失败'
  },
  // 【子模块】主题切换
  theme: {
    // 【标签】自定义主题
    custom: '自定义主题',
    // 【标签】主题色板
    palette: '主题色板',
    // 【标签】侧边栏背景
    sidebarBg: '侧边栏背景',
    // 【标签】侧边栏激活背景
    sidebarActiveBg: '侧边栏激活背景',
    // 【标签】侧边栏悬停背景
    sidebarHoverBg: '侧边栏悬停背景',
    // 【标签】侧边栏悬停文字
    sidebarHoverText: '侧边栏悬停文字',
    // 【标签】侧边栏图标颜色
    sidebarIconColor: '图标颜色',
    // 【操作】重置主题
    reset: '重置主题',
    // 【操作】重置全部
    resetAll: '重置全部'
  }
}
