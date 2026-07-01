// ========================================
// ===appendFileSync同步追加
// ===需求：
//    异步追加内容：择其善者而从之，择其不善者而改之
// ========================================

// require 是 Node.js 环境中的'全局'变量，用来导入模块
const fs = require('fs');

//path 是 Node.js 的内置核心模块，专门用来处理和操作文件路径！
const path = require('path');

// 获取脚本所在目录的绝对路径和写入内容
const filePath = path.join(__dirname, '../00-操作文件/02-同步座右铭.txt');
const testContent = "择其善者而从之，择其不善者而改之。";

//将 『三人行，必有我师焉。』 写入到当前文件夹下的『座右铭.txt』文件中
fs.appendFileSync(filePath, testContent)