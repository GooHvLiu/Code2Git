// ========================================
// =项目名称：05-HTTP响应练习-静态资源搭建.js
// =需求：
//    1）GET  /index.html   响应  index.html的文件内容
//    2）GET  /css/index.css  响应  css/index.css的文件内容
//    3) GET  /images/logo.png  响应  images/logo,png的文件内容
// ========================================
// 1. 引入http fs模块
const http = require('http');
const fs = require('fs');

// 2. 创建服务对象
const server = http.createServer((request, response) => {

  let urlAdd = new URL(request.url, 'http://127.0.0.1');
  // console.log(urlAdd.pathname);

  //拼接路径
  let filePath = __dirname + '/Sources/02-静态资源' + urlAdd.pathname;
  console.log("拼接路径：" + filePath);

  //异步读取
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log('Read html File Err.Please Read the Error Msg..');
      response.end('文件读取失败~');
      return;
    }
    else {
      response.end(data);
    }
  }
  )
})

// 3. 监听端口，启动服务器
server.listen(9000, () => {
  console.log('I am listening.');

})