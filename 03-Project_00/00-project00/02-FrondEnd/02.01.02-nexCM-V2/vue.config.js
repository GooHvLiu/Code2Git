/**
 * ==========================================
 * Vue CLI 配置文件
 * ==========================================
 */
const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const fs = require('fs')

// ========== 生成 JS/Less 共享主题变量文件 ==========
// 读取 themeVariables.js，自动转成 Less 变量写入 _theme_vars.less
// 通过 style-resources-loader 注入到所有 .less 文件，实现改一处两边生效
const themeVarsPath = path.resolve(__dirname, 'src/config/themeVariables.js')
const themeVarsOutputPath = path.resolve(__dirname, 'src/assets/styles/_theme_vars.less')

function generateThemeVars() {
  // 清除 require 缓存，确保每次读取最新值（支持 dev server 热更新）
  delete require.cache[themeVarsPath]
  const themeVariables = require(themeVarsPath)
  const content = [
    '/**',
    ' * 自动生成文件，请勿手动编辑',
    ' * 由 vue.config.js 从 src/config/themeVariables.js 生成',
    ' * 修改颜色请编辑 themeVariables.js',
    ' */',
    ...Object.entries(themeVariables).map(([key, value]) => `@${key}: ${value};`)
  ].join('\n') + '\n'

  // 只有内容真正变化时才写入，避免触发无限编译循环
  let existing = ''
  try {
    existing = fs.readFileSync(themeVarsOutputPath, 'utf-8')
  } catch (e) {
    // 文件不存在时继续写入
  }
  if (existing !== content) {
    fs.writeFileSync(themeVarsOutputPath, content, 'utf-8')
  }
}

// 启动时先生成一次，确保文件存在
generateThemeVars()

/**
 * Webpack 插件：每次编译前重新生成 _theme_vars.less
 * 使 themeVariables.js 的改动在 dev server 热更新时即时生效
 */
class ThemeVarsGeneratorPlugin {
  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync('ThemeVarsGeneratorPlugin', (params, callback) => {
      generateThemeVars()
      callback()
    })
  }
}

module.exports = defineConfig({
  transpileDependencies: true,

  // 生产环境不生成 sourceMap，减小打包体积
  productionSourceMap: false,

  // 部署路径（微前端/子路径部署时修改环境变量 VUE_APP_PUBLIC_PATH）
  // 默认为 '/'，部署在子路径如 /admin/ 时设置为 '/admin/'
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',

  // 开发服务器配置
  devServer: {
    // 端口从环境变量读取
    port: process.env.VUE_APP_PORT || 8082,
    // 允许局域网其他设备访问
    host: '0.0.0.0',
    // 代理配置
    proxy: {
      // 代理前缀从环境变量读取
      [process.env.VUE_APP_BASE_API]: {
        // 后端真实地址从环境变量读取
        target: process.env.VUE_APP_PROXY_TARGET || 'http://127.0.0.1:3002',
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
    // 注入顺序：variables（默认变量）→ _theme_vars（自动生成，覆盖颜色变量）→ mixin
    // _theme_vars 由 themeVariables.js 生成，实现 JS/Less 共享颜色配置
    const oneOfsMap = config.module.rule('less').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('style-resources-loader')
        .loader('style-resources-loader')
        .options({
          patterns: [
            path.resolve(__dirname, 'src/assets/styles/variables.less'),
            path.resolve(__dirname, 'src/assets/styles/_theme_vars.less'),
            path.resolve(__dirname, 'src/assets/styles/mixin.less')
          ]
        })
        .end()
    })

    // ========== 页面标题 ==========
    config.plugin('html').tap(args => {
      args[0].title = process.env.VUE_APP_TITLE || 'nexCM 管理系统'
      return args
    })

    // ========== 生产环境优化 ==========
    config.when(process.env.NODE_ENV === 'production', config => {
      // 1. 代码分包：第三方库单独打包，利用浏览器缓存
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          // Vue 核心库
          vue: {
            name: 'chunk-vue',
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex|vue-i18n)[\\/]/,
            priority: 20,
            chunks: 'all'
          },
          // Element UI
          element: {
            name: 'chunk-element',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            priority: 20,
            chunks: 'all'
          },
          // 其他第三方库
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      })

      // 2. 去除 console.log 和 debugger
      config.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions.compress.drop_console = true
        args[0].terserOptions.compress.drop_debugger = true
        return args
      })
    })
  },

  // 路径别名
  configureWebpack: {
    plugins: [new ThemeVarsGeneratorPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
})
