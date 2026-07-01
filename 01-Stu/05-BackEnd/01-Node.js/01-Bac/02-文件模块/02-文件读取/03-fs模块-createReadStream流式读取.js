// ========================================
// ===createReadStream流式读取
// ===需求：
//    读取05-观书有感.txt文件
// ========================================

// require 是 Node.js 环境中的'全局'变量，用来导入模块
const fs = require('fs');

//path 是 Node.js 的内置核心模块，专门用来处理和操作文件路径！
const path = require('path');

// 获取脚本所在目录的绝对路径和读取内容
const filePath = path.join(__dirname, '../00-操作文件/05-观书有感.txt');

//使用流式读取有以下几步：
let rs = fs.createReadStream(filePath);

//step1:绑定事件,chunk有块，大块的意思。每次取出65538字节，即 64k 数据后执行一次 data 回调
rs.on('data', chunk => {
  console.log(chunk.toString());
  console.log(chunk.length);
})

//读取完毕后, 执行 end 回调
rs.on('end', () => {
  console.log('读取完成！')
})