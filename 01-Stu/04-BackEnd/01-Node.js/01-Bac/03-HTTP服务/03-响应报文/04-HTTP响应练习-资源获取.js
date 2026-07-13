// ========================================
// =项目名称：04-HTTP响应练习-资源获取.js
// =需求：
//    1）搭建 HTTP 服务
//    2）响应一个 4 行 3 列的表格
//    3) 表格有隔行换色效果，且点击单元格能高亮显示
// ========================================
// 1. 引入http fs模块
const http = require('http');
const fs = require('fs');

// 2. 创建服务对象
const server = http.createServer((request, response) => {
  //因为要获取的html内含css和js文件，都是单独请求的，所以，需要根据请求头url来进行确定是哪个请求，提供哪个数据
  //异步读取文件
  const htmlPath = __dirname + '/Sources/01-资源获取/HTTP响应练习_资源引入demo.html';
  const cssPath = __dirname + '/Sources/01-资源获取/index.css';
  const jsPath = __dirname + '/Sources/01-资源获取/index.js';

  let urlAdd = new URL(request.url, 'http://127.0.0.1');
  // console.log(urlAdd.pathname);

  //此为读取html的方法
  if (urlAdd.pathname === '/login') {
    readHtml();
  }
  //此为读取css的方法
  else if (urlAdd.pathname === '/index.css') {
    readCss();
  }

  //读取js文件
  else if (urlAdd.pathname === '/index.js') {
    readJs();
  }
  else {
    response.statusCode = '404';
    response.end('Err. Not Find Any Com...');
  }

  //此为读取html的方法
  function readHtml() {
    fs.readFile(htmlPath, (err, data) => {
      if (err) {
        console.log('Read html File Err.Please Read the Error Msg..');
        return;
      }
      else {
        response.end(data);
      }
    }
    )
  }

  //此为读取css的方法
  function readCss() {
    fs.readFile(cssPath, (err, data) => {
      if (err) {
        console.log('Read css File Err.Please Read the Error Msg..');
        return;
      }
      else {
        response.end(data);
      }
    }
    )
  }

  //此为读取js的方法
  function readJs() {
    fs.readFile(jsPath, (err, data) => {
      if (err) {
        console.log('Read js File Err.Please Read the Error Msg..');
        return;
      }
      else {
        response.end(data);
      }
    }
    )
  }
})


// 3. 监听端口，启动服务器
server.listen(9000, () => {
  console.log('I am listening.');

})