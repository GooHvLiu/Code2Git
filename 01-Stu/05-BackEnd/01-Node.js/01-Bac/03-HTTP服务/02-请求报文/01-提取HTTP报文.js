/* 
 * 项目：02-提取HTTP报文.js
 * 
 */
// 1. 引入 HTTP 模块
const http = require('http');

// 2. 创建服务对象
const server = http.createServer((request, response) => {
  /* //获取请求的方法
  console.log(request.method); */

  /* //获取请求的 url,只包含 url 中的路径与查询字符串
  console.log(request.url); */

  /* //获取 HTTP 协议的版本号
  console.log(request.httpVersion); */

  //获取 HTTP 的请求头:127.0.0.1:9000
  console.log(request.headers.host);

  //设置响应体,传递给浏览器的数据
  response.end('I have seen it.');
});

// 3. 监听端口，启动服务，http://127.0.0.1:9000
server.listen(9000, () => {
  console.log('服务已经启动...');

});