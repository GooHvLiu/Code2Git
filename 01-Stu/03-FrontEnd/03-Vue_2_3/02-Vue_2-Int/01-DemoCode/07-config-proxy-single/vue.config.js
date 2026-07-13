const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 开启代理服务器
  devServer: {
    // 方法1：此处需要写的不是代理服务器的端口号，而是终端服务器的端口号
    proxy: 'http://localhost:5000'
  }
})
