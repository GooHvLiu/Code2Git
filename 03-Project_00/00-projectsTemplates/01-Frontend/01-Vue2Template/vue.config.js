const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 端口设定
    port: 8082,
    // 启动自动打开浏览器
    open: true,
    // 允许局域网其他设备访问本机项目
    host: "0.0.0.0",
    // 配置vue服务器代理
    proxy: {
      "/prod-api": {
        // 后端真实地址（仅本地开发生效）
        target: "http://127.0.0.1:3002",
        changeOrigin: true
        // 路径重写：不需要则删除
        // pathRewrite: { '^/prod-api': '' }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        // 可以根据项目实际情况配置文件路径
        "@": path.resolve(__dirname, "src"),
        "@api": path.resolve(__dirname, "src/api"),
        "@common": path.resolve(__dirname, "src/common"),
        "@components": path.resolve(__dirname, "src/components"),
        "@filters": path.resolve(__dirname, "src/filters"),
        "@mock": path.resolve(__dirname, "src/mock"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@router": path.resolve(__dirname, "src/router"),
        "@store": path.resolve(__dirname, "src/store"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@public": path.resolve(__dirname, "public")
      }
    }
  },
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
});
