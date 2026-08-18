/**
 * ==========================================
 * nex-svg-icon vue.config.js 辅助函数
 * ==========================================
 * 自动配置 svg-sprite-loader
 *
 * 用法：
 * const path = require('path')
 * const { configureSvgIcon } = require('nex-svg-icon/vue-config')
 *
 * module.exports = {
 *   chainWebpack: config => {
 *     configureSvgIcon(config, {
 *       svgDir: path.resolve(__dirname, 'src/assets/icons/svg')
 *     })
 *   }
 * }
 */
const path = require('path')

/**
 * 配置 svg-sprite-loader
 * @param {Object} config chainWebpack 的 config 对象
 * @param {Object} options
 * @param {string} options.svgDir SVG 图标目录绝对路径
 * @param {string} [options.symbolId] symbol ID 模板，默认 'icon-[name]'
 */
function configureSvgIcon(config, options = {}) {
  const svgDir = options.svgDir
  const symbolId = options.symbolId || 'icon-[name]'

  if (!svgDir) {
    throw new Error('[nex-svg-icon] svgDir is required')
  }

  // 排除默认 svg 规则对图标目录的处理
  config.module
    .rule('svg')
    .exclude.add(svgDir)
    .end()

  // 新增 icons 规则，使用 svg-sprite-loader
  config.module
    .rule('icons')
    .test(/\.svg$/)
    .include.add(svgDir)
    .end()
    .use('svg-sprite')
    .loader('svg-sprite-loader')
    .options({ symbolId })
    .end()
}

module.exports = { configureSvgIcon }
