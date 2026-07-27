const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    // svg图标加载
    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, 'src/assets/icons/svg'))
      .end()

    config.module
      // 定义一个名叫 icons 的规则
      .rule('icons')

      // 设置 icons 的匹配正则
      .test(/\.svg$/)

      // 设置当前规则的作用目录，只在当前目录下才执行当前规则
      .include.add(path.join(__dirname, 'src/assets/icons/svg'))
      .end()

      // 指定一个名叫 svg-sprite 的 loader 配置
      .use('svg-sprite')

      // 该配置使用 svg-sprite-loader 作为处理 loader
      .loader('svg-sprite-loader')

      // 该 svg-sprite-loader 的配置
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
})

