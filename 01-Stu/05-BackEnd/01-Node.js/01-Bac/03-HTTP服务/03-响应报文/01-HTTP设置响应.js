// 1. 引入http模块
const http = require('http');

// 2. 创建服务对象
const server = http.createServer((request, response) => {

  // a. 设置响应状态码
  response.statusCode = 203;

  // b. 响应状态的描述
  response.statusMessage = 'i love you';

  // c. 响应头
  response.setHeader('content-type', 'text/html;charset=utf-8');
  response.setHeader('Server', 'node.js');
  response.setHeader('myHeader', 'lulululalala');
  response.setHeader('test', ['a', 'b', 'c']);

  // d. 响应体的设置,一般设置了write，就不会在response.end设置了。response.end();
  response.write('Approved.Plesase go ahead.');

  // e. 设置响应结束，只能有1个end方法，end和write内的内容选择一个即可
  response.end();
})

// 3. 监听端口，启动服务器
server.listen(9000, () => {
  console.log('I am listening.');

})