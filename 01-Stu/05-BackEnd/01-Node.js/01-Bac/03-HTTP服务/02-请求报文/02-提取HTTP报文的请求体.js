/* 
 * 项目：03-提取HTTP报文的请求体.js
 * 
 */
// 1. 引入http
const http = require('http');

// 2. 创建服务对象
const server = http.createServer((request, response) => {
  //1. 声明一个变量
  let body = '';

  //2. 绑定data事件,'data' 是一个事件名称，当请求体（request body）的数据到达时触发；chunk 是数据块，是每次 'data' 事件触发时传递的参数。
  request.on('data', chunk => {
    body += chunk;
  });

  //3. 绑定end事件
  request.on('end', () => {
    //body:'username=12&password=12313'
    console.log(body);

    //设置响应体
    response.end('I have seen it.');
  });
});

// 3. 监听端口，启动服务，http://127.0.0.1:9000
server.listen(9000, () => {
  console.log('服务已经启动...');

});