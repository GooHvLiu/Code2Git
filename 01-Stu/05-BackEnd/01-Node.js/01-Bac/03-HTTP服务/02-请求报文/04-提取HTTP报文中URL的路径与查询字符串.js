/* 
 * 项目：05-提取HTTP报文中URL的路径与查询字符串.js
 * 
 */
// 1. 导入 http 模块
const http = require('http');

// 2. 创建服务对象
const server = http.createServer((request, response) => {
  //实例化 URL 的对象
  // let url = new URL('/search?a=100&b=200', 'http://127.0.0.1:9000');
  console.log('我是01_' + request.url);

  //request.url:要解析的 URL 字符串（可以是相对路径或绝对路径）
  //http://127.0.0.1:基础 URL（当 urlString 是相对路径时必需）
  let url = new URL(request.url, 'http://127.0.0.1');

  //输出路径
  console.log('我是02_' + url);
  console.log('我是02_' + url.pathname);

  //输出 keyword 查询字符串
  console.log('我是03_' + url.searchParams.get('keyword'));

  response.end('I have seen it.');
});

// 3. 监听端口, 启动服务
server.listen(9000, () => {
  console.log('I am listening...')
});
