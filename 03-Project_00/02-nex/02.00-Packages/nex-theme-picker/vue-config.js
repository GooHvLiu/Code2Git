/**
 * ==========================================
 * nex-theme-picker vue.config.js 辅助函数
 * ==========================================
 * 自动注入 style-resources-loader 和 ThemeVarsGeneratorPlugin
 *
 * 用法：
 * const path = require('path')
 * const { configureTheme } = require('nex-theme-picker/vue-config')
 *
 * const themeConfig = configureTheme({
 *   themeVarsPath: path.resolve(__dirname, 'src/config/themeVariables.js'),
 *   outputPath: path.resolve(__dirname, 'src/assets/styles/_theme_vars.less'),
 *   variablesLess: path.resolve(__dirname, 'src/assets/styles/variables.less'),
 *   mixinLess: path.resolve(__dirname, 'src/assets/styles/mixin.less')
 * })
 *
 * module.exports = {
 *   chainWebpack: themeConfig.chainWebpack,
 *   configureWebpack: themeConfig.configureWebpack
 * }
 */
const path = require('path')
const fs = require('fs')

/**
 * 生成 _theme_vars.less 文件
 * @param {string} themeVarsPath themeVariables.js 路径
 * @param {string} outputPath 输出路径
 */
function generateThemeVars(themeVarsPath, outputPath) {
  // 清除 require 缓存，确保每次读取最新值
  delete require.cache[themeVarsPath]
  const themeVariables = require(themeVarsPath)

  const lines = Object.entries(themeVariables).map(([key, value]) => {
    return `@${key}: ${value};`
  })

  const content = `// 自动生成，请勿手动修改\n// 由 nex-theme-picker 从 themeVariables.js 转换\n\n${lines.join('\n')}\n`
  fs.writeFileSync(outputPath, content, 'utf-8')
}

/**
 * Webpack 插件：每次编译前重新生成 _theme_vars.less
 */
class ThemeVarsGeneratorPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync('ThemeVarsGeneratorPlugin', (params, callback) => {
      generateThemeVars(this.options.themeVarsPath, this.options.outputPath)
      callback()
    })
  }
}

/**
 * 配置主题
 * @param {Object} options
 * @param {string} options.themeVarsPath themeVariables.js 绝对路径
 * @param {string} options.outputPath _theme_vars.less 输出路径
 * @param {string} options.variablesLess variables.less 路径
 * @param {string} [options.mixinLess] mixin.less 路径（可选）
 * @returns {Object} { chainWebpack, configureWebpack }
 */
function configureTheme(options = {}) {
  const themeVarsPath = options.themeVarsPath || path.resolve(__dirname, './themeVariables.js')
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'src/assets/styles/_theme_vars.less')
  const variablesLess = options.variablesLess
  const mixinLess = options.mixinLess

  // 首次生成
  generateThemeVars(themeVarsPath, outputPath)

  // 构建注入的 less 文件列表
  const patterns = [variablesLess, outputPath]
  if (mixinLess) patterns.push(mixinLess)
  const validPatterns = patterns.filter(Boolean)

  return {
    /**
     * chainWebpack 配置
     */
    chainWebpack(config) {
      // 注入 style-resources-loader
      const oneOfsMap = config.module.rule('less').oneOfs.store
      oneOfsMap.forEach(item => {
        item.use('style-resources-loader')
          .loader('style-resources-loader')
          .options({ patterns: validPatterns })
          .end()
      })
    },

    /**
     * configureWebpack 配置
     */
    configureWebpack: {
      plugins: [new ThemeVarsGeneratorPlugin({ themeVarsPath, outputPath })]
    }
  }
}

module.exports = {
  configureTheme,
  generateThemeVars,
  ThemeVarsGeneratorPlugin
}
