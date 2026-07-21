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
    host: "0.0.0.0"
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
        "@public": path.resolve(__dirname, "public")
      }
    }
  }
});
