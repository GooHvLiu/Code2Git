/**
 * icons/index.js - SVG 图标自动注册
 * 
 * 功能：
 * 1. 全局注册 SvgIcon 组件
 * 2. 使用 require.context 自动加载 svg 目录下所有 .svg 文件
 * 3. 配合 svg-sprite-loader 生成 SVG 雪碧图
 * 
 * 使用方式：<svg-icon icon-class="dashboard" />
 */
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'

// 全局注册 SvgIcon 组件
Vue.component('svg-icon', SvgIcon)

// require.context：webpack 提供的 API，自动导入模块
// 参数：目录、是否递归、匹配正则
const req = require.context('./svg', false, /\.svg$/)
// 导入所有 svg 文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
