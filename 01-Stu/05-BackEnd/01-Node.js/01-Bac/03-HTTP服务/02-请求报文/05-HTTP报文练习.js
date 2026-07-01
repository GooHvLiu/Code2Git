// ========================================
// =项目名称：06-HTTP报文练习.js
// =需求：
//    1）请求方法：get，路径：/login，响应体结果为：登录页面
//    2）请求方法：get，路径：/reg,响应体结果为：注册页面
// ========================================

// 1. 导入 http 模块
const http = require('http');

// 2. 创建服务对象
const server = http.createServer((request, response) => {
  // 2.1 获取请求方法
  let methods = request.method;

  // 2.2 获取路径方法
  let urls = new URL(request.url, 'http://127.0.0.1')

  /* // 测试输出获取的方法
  console.log('01-' + methods, '02-' + urls, '03-' + urls.pathname); */

  // 2.3 实现功能
  if (methods === 'GET' && urls.pathname === '/login') {
    response.end('Success Login!');
    console.log('methods:' + methods + ';urls.pathname:' + urls.pathname + '; Connecting. Success Login!');

  }
  else if (methods === 'GET' && urls.pathname === '/reg') {
    response.end('Success Register!');
    console.log('methods:' + methods + ';urls.pathname:' + urls.pathname + '; Connecting. Success Register!');
  }
  else if (methods === 'GET' && urls.pathname === '/favicon.ico') {
    response.end('Ignore:favicon.ico');
    console.log('methods:' + methods + ';urls.pathname:' + urls.pathname + '; Connecting. But it is favicon.ico files.');
  }
  else {
    response.end('Not Found.');
    console.log('methods:' + methods + ';urls.pathname:' + urls.pathname + '; Connecting. But Not Found.');
  }

})

// 3. 监听端口, 启动服务
server.listen(9000, () => {
  console.log('I am listening...')
});
