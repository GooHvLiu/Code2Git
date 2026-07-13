// ========================================
// =项目名称：06-HTTP响应练习-MIME+解决乱码.js
// =需求：
//    1）GET  /index.html   响应  index.html的文件内容
//    2）GET  /css/index.css  响应  css/index.css的文件内容
//    3) GET  /images/logo.png  响应  images/logo,png的文件内容
//    4) 增加MIME：媒体类型， Multipurpose Internet Mail Extensions ，是一种标准，用来表示文档、文件或字节流的性质和格式
//    5）解决中文乱码问题
// ========================================
// 1. 引入http fs模块
const http = require('http');
const fs = require('fs');
const path=require('path');

//创建MIME对象用于检索，实际上，html内部已经设置了MIME类型，重新设定优先级>html内置优先级
/* ** charset=utf-8：中文乱码问题的解决方案：response.setHeader('content-type',type+';charset=utf-8');
   ** 在html内置了charset=utf-8 ，所以，不会乱码，但是单独访问js,css文件会存在乱码问题
   ** 可加可不加
 */
const mimes={
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  json: 'application/json'
}

// 2. 创建服务对象
const server = http.createServer((request, response) => {

  let urlAdd = new URL(request.url, 'http://127.0.0.1');
  // console.log(urlAdd.pathname);

  //拼接路径,可以拼接处对应不同的数据请求类型，如：index.js/index.css/logo.png
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
      //获取文件的后缀，也就是文件类型
      //slice(1):获取从索引1以后的所有数据
      let ext=path.extname(filePath).slice(1);

      //获取对应的类型
      let type=mimes[ext];
      if(type){
        //匹配到了,type+';charset=utf-8':增加了解码说明，防止查看文件乱码
        response.setHeader('content-type',type+';charset=utf-8');
      }
      else{
        //没有匹配到了
        response.setHeader('content-type', application/octet-stream);
      }
      response.end(data);
    }
  }
  )
})

// 3. 监听端口，启动服务器
server.listen(9000, () => {
  console.log('I am listening.');

})