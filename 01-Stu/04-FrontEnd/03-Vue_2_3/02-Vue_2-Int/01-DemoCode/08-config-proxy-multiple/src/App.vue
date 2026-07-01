<!-- 
*******第二种代理方式(多代理+多服务器发请求)：
*   4）解决及处理：
      4.1 vue-cli最简单的解决方式
      4.2 需求整理如下：
        4.2.1 客户端端口号：8080
        4.2.2 服务器端口号：5000
        4.2.3 代理服务器端口号：8080
*   5）vue.config.js：
        5.1 访问官网：https://cli.vuejs.org/zh/config/#devserver-proxy
        5.2 复制核心代码
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
        5.3 修改核心代码如下：
            因为需要增加前缀'/api'所以，需要通过pathRewrite: { '^/api': '' }删除，否则终端服务器的路径就会出问题
        5.4 可以增加另外的服务器地址
        -->

<template>
  <div>
    <button @click="getStudentsMsg">获取学生信息</button>
    <button @click="getCarsMsg">获取车辆信息</button>
  </div>
</template>


<script>
import axios from 'axios'
export default {
  name: 'App',
  methods: {
    getStudentsMsg(){
      //开启多个的方式，需要增加前缀/api1
      axios.get('http://localhost:8080/api1/students').then(
        response=>{
          console.log('请求成功了',response.data)
        },
        error=>{
          console.log('请求失败了',error.message);
        }
      )          
    },
    getCarsMsg(){
      //开启多个的方式，需要增加前缀/api2
      axios.get('http://localhost:8080/api2/cars').then(
        response=>{
          console.log('请求成功了',response.data)
        },
        error=>{
          console.log('请求失败了',error.message);
        }
      )          
    }
  },
}
</script>