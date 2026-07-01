const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 开启代理服务器，方法1：单一
  // devServer: {
  //   // 此处需要写的不是代理服务器的端口号，而是终端服务器的端口号
  //   proxy: 'http://localhost:5000'
  // },

  // 开启代理服务器，方法2：多个
  devServer: {
    proxy: {
      //api:请求前缀，/api表示代理，api可以修改为其他的，要在端口号后面添加，原来有的不要删除
      //实际：http://localhost:8080/students
      //变更为：http://localhost:8080/api/students
      '/api1': {
        target: 'http://localhost:5000',
        //将客户端传过来的路径中包含/api的删除
        pathRewrite: { '^/api1': '' },
        ws: true,//websocket,用于支持websocket，默认为true
        changeOrigin: true //true为默认，用于控制请求头中的host值
      },
      //api2:请求前缀，/api2表示代理，api2可以修改为其他的，要在端口号后面添加，原来有的不要删除
      //实际：http://localhost:8080/carss
      //变更为：http://localhost:8080/api2/students
      '/api2': {
        target: 'http://localhost:5001',
        //将客户端传过来的路径中包含/api的删除
        pathRewrite: { '^/api2': '' },
        ws: true,//websocket,用于支持websocket，默认为true
        changeOrigin: true //true为默认，用于控制请求头中的host值
      }
    }
  },
})
