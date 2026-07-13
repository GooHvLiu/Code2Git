// ========================================
// ===createWriteStream流式写入
// ===需求：
//    写入内容：写入一首诗
// ========================================

// require 是 Node.js 环境中的'全局'变量，用来导入模块
const fs = require('fs');

//path 是 Node.js 的内置核心模块，专门用来处理和操作文件路径！
const path = require('path');

// 获取脚本所在目录的绝对路径和写入内容
const filePath = path.join(__dirname, '../00-操作文件/05-观书有感.txt');

//创建写入流对象
const ws = fs.createWriteStream(filePath);

//写入文档
ws.write('床前明月光，\r\n');
ws.write('疑似地上霜，\r\n');
ws.write('举头望明月，\r\n');
ws.write('低头思故乡。\r\n');

//关闭文档流
ws.close();