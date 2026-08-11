/**
 * ==========================================
 * Vue CLI 配置文件
 * ==========================================
 */
const { defineConfig } = require('@vue/cli-service');
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,

  // 开发服务器配置
  devServer: {
    // 端口
    port: 8082,
    // 允许局域网其他设备访问
    host: "0.0.0.0",
    // 代理配置
    proxy: {
      // 代理前缀从环境变量读取
      [process.env.VUE_APP_BASE_API]: {
        // 后端真实地址从环境变量读取
        target: process.env.VUE_APP_PROXY_TARGET || "http://127.0.0.1:3002",
        changeOrigin: true
      }
    }
  },

  // Webpack 链式配置
  chainWebpack: config => {
    // ========== SVG 图标配置 ==========
    // 排除默认 svg 规则对图标目录的处理
    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, 'src/assets/icons/svg'))
      .end()

    // 新增 icons 规则，使用 svg-sprite-loader
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, 'src/assets/icons/svg'))
      .end()
      .use('svg-sprite')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // ========== 全局注入 Less 变量和 Mixin ==========
    // 所有 .less 文件无需手动 @import 即可使用 variables.less 和 mixin.less 中的内容
    const oneOfsMap = config.module.rule('less').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('style-resources-loader')
        .loader('style-resources-loader')
        .options({
          patterns: [
            path.resolve(__dirname, 'src/assets/styles/variables.less'),
            path.resolve(__dirname, 'src/assets/styles/mixin.less')
          ]
        })
        .end()
    })

    // ========== 页面标题 ==========
    config.plugin('html').tap(args => {
      args[0].title = 'nexCM 管理系统'
      return args
    })
  },

  // 路径别名
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    }
  }
});
