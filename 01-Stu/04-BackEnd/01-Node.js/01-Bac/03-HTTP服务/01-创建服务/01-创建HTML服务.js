/* 
 * 项目：01-创建HTML服务.js
 * 
 */
// 1. 引入http
const http = require('http');

// 2. 创建http对象
const server = http.createServer((request, response) => {
  response.setHeader('content-type', 'text/html;charset=utf-8');
  response.end('你好，服务启动' + "Hello Server Start...");//设置响应体

});

// 3. 监听端口，启动服务，http://127.0.0.1:9000
server.listen(9000, () => {
  console.log('服务已经启动...');

});