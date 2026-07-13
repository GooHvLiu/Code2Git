// ========================================
// ===readFile异步读取
// ===需求：
//    读取01-异步座右铭.txt文件
// ========================================

// require 是 Node.js 环境中的'全局'变量，用来导入模块
const fs = require('fs');

//path 是 Node.js 的内置核心模块，专门用来处理和操作文件路径！
const path = require('path');

// 获取脚本所在目录的绝对路径和读取内容
const filePath = path.join(__dirname, '../00-操作文件/01-异步座右铭.txt');

//异步读取对应的文件,data为读取到的文件
fs.readFile(filePath, (err, data) => {
  if (err) {
    console.log('读取失败~~~');
    return;
  }
  console.log('读取成功:', data.toString());
})