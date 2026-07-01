<!-- 
* *****第一种代理方式(单一代理+唯一无服务器发请求)：
* 脚手架代理官方推荐使用axios
* 第1步：安装  npm i axios
* 第2步：引入 import axios from 'axios'
* 第3步：使用 
*   axios.get('http://localhost:5000/students').then(
        response=>{
          console.log('请求成功了',response.data)
        },
        error=>{
          console.log('请求失败了',error.message);
        }
* 遇到CORS（跨域）问题，什么是跨域问题：浏览器的同源策略是跨域问题的根源。两个URL要满足以下三个条件完全相同才算"同源"：协议（Protocol） + 域名（Domain） + 端口（Port）
* 第4步：解决CORS（跨域）问题：
*   1）cors--最标准解决方案（个人搭建应用最广），但 后台给数据时同时带着头信息，浏览器会根据服务器给出的确定信息（服务器已经确定一定要给数据），浏览器忽略跨域问题-但是有风险，任何人都可以请求数据
*   2）jsonp--特别巧妙，通过script下的src引入地址不受同源限制的特殊性实现，但是在实际开发中应用极少，需要前端和后端共同配合，只能解决get请求
    3）代理服务器--应用最广泛的方法：
      3.1 代理服务器在8080（前端）与5000（后端）之间存在，代理服务器处于8080端
      3.2 终端请求向代理服务器请求数据，代理服务器向5000服务器请求，然后代理服务器再把数据给到8080终端
      3.3 同源要求是在前端与后端服务器之间，即使用除了http之外的其他请求时的限制（get/push/ajax）
      3.4 代理服务器与实际服务器之间的通讯，不使用ajax通讯，使用http请求，没有同源要求
*   4）解决及处理：
      4.1 vue-cli最简单的解决方式
      4.2 需求整理如下：
        4.2.1 客户端端口号：8080
        4.2.2 服务器端口号：5000
        4.2.3 代理服务器端口号：8080
*   5）vue.config.js：
        5.1 访问官网：https://cli.vuejs.org/zh/config/#devserver-proxy
        5.2 复制核心代码
        devServer: {
          proxy: 'http://localhost:4000'
        }
        5.3 修改代码并添加如下：
        //以下1行为原始存在，只是为了体现devServer应该放在哪里
        transpileDependencies: true,
        // 开启代理服务器
        devServer: {
          // 此处需要写的不是代理服务器的端口号，而是终端服务器的端口号，只需要写到端口号，5000是该项目的终端服务器的端口号
          proxy: 'http://localhost:5000'
        }
*   6）将原有代码axios.get数据请求中的端口号（原始为终端服务器端口号）更改为与客户端相同的代理服务器端口号
*   7）修改后即实现跨域数据请求
* 备注：
*   1. 本地localhost:8080代指public文件夹
*   2. 不完美1：需要请求的文件本地存在的情况下，代理服务器不会向服务器请求
*   3. 不完美2：该种方法配置的代理，只能1种，也就是说8080只能通过代理服务器转发给5000服务器，不可以向其他服务器发送请求
* 

-->

<template>
  <div>
    <button @click="getStudentsMsg">获取学生信息</button>
  </div>
</template>


<script>
import axios from 'axios'
export default {
  name: 'App',
  methods: {
    getStudentsMsg(){
      axios.get('http://localhost:8080/students').then(
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