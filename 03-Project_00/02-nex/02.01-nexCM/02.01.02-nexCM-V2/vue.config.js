/**
 * vue.config.js - Vue CLI 配置文件
 * 
 * 配置内容：
 * - 开发服务器端口：9528
 * - 路径别名：@ 指向 src 目录
 * - SVG 图标处理：使用 svg-sprite-loader 处理 src/icons 下的 svg 文件
 * - 关闭生产环境 sourceMap
 */
'use strict'
const path = require('path')

// 解析绝对路径
function resolve(dir) {
  return path.join(__dirname, dir)
}

// 页面标题
const name = '医疗设备上位机管理系统'
// 开发服务器端口
const port = 9528

module.exports = {
  // 部署应用包时的基本 URL
  publicPath: '/',
  // 生产环境构建输出目录
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的目录
  assetsDir: 'static',
  // 开发环境下每次保存时是否通过 eslint-loader 进行 lint 检查
  lintOnSave: process.env.NODE_ENV === 'development',
  // 生产环境是否生成 sourceMap 文件（关闭可加速构建）
  productionSourceMap: false,
  // 开发服务器配置
  devServer: {
    port: port,
    open: true, // 启动后自动打开浏览器
    // 编译错误/警告时是否全屏覆盖
    overlay: {
      warnings: false,
      errors: true
    }
  },
  // webpack 配置（简单配置）
  configureWebpack: {
    name: name, // 用于 html-webpack-plugin 的 title
    resolve: {
      alias: {
        '@': resolve('src') // @ 指向 src 目录
      }
    }
  },
  // webpack 链式配置（高级配置）
  chainWebpack(config) {
    // ========== SVG 图标配置 ==========
    // 排除默认 svg 规则对 src/icons 目录的处理
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    // 添加 icons 规则，使用 svg-sprite-loader 处理 src/icons 下的 svg
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]' // 生成的 symbol id 格式
      })
      .end()
  }
}
