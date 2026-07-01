// ========================================
// =项目名称：03-HTTP响应练习-拆分体.js
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
  //异步读取文件
  const htmlPath = __dirname + '/Sources/HTTP响应练习_demo.html';

  fs.readFile(htmlPath, (err, data) => {
    if (err) {
      console.log('Please Read the Error.');
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