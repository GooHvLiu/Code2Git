// ========================================
// ===writeFile异步写入
// ===需求：
//    新建一个文件夹，座右铭.txt，写入内容，三人行，必有我师焉
// ========================================

// require 是 Node.js 环境中的'全局'变量，用来导入模块
const fs = require('fs');

//path 是 Node.js 的内置核心模块，专门用来处理和操作文件路径！
const path = require('path');

// 获取脚本所在目录的绝对路径和写入内容
const filePath = path.join(__dirname, '../00-操作文件/01-异步座右铭.txt');
const testContent = "三人行，必有我师焉！";


//将 『三人行，必有我师焉。』 写入到当前文件夹下的『座右铭.txt』文件中
/* fs.writeFile(filePath, testContent, err => {
  //如果写入失败，则回调函数调用时，会传入错误对象，如写入成功，会传入 null
  if (err) {
    console.log('写入失败~~~');
    return;
  }
  console.log('写入成功~~~');
}) */

//将 『三人行，必有我师焉。』 写入到当前文件夹下的『座右铭.txt』文件中，追加写入:{ flag: 'a' }
fs.writeFile(filePath, testContent, { flag: 'a' }, err => {
  //如果写入失败，则回调函数调用时，会传入错误对象，如写入成功，会传入 null
  if (err) {
    console.log('写入失败~~~');
    return;
  }
  console.log('写入成功~~~');
})