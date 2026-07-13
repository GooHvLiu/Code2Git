/* 
 * 项目：04 提取HTTP报文中URL的路径与查询字符串.js
 * 
 */
// 1. 引入http模块,url模块
const http = require('http');
const url = require('url');

// 2. 创建服务对象
const server = http.createServer((request, response) => {
  //a. 解析request.url:/index-test/http
  // console.log(request.url);

  //request.url:只包含路径和查询字符串部分，不包含协议、主机名、端口等
  //true:将查询字符串解析为对象
  let res = url.parse(request.url, true);

  //所以打印出来的res很多在request.url不包含的都是null
  console.log(res);

  //b. 路径
  let pathname = res.pathname;

  //只获取res里面的pathname信息：/index-test/http
  // console.log(pathname);

  //c. 查询字符串
  let keyword = res.query.keyword;

  //只获取res里面的query.keyword信息：query为null，所以获取的也是null
  console.log(keyword);

  response.end('I have seen it.');

})

//3.监听端口
server.listen(9000, () => {
  console.log('I am listening...')
}) 