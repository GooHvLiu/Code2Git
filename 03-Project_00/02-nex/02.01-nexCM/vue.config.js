const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8082, // 端口
    open: true, // 启动自动打开浏览器
    host: "0.0.0.0" // 允许局域网其他设备访问本机项目
  },
  configureWebpack: {
    resolve: {
      alias: {
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
  }
});
