/* 
 * 需求：
 *     将source下的mp4文件复制一份新的
 * 
 * 文件：01-复制文件之同步读写.js
 * 作用：使用同步读写方式实现
 */

// 1. 引入fs模块
const fs = require('fs');

// 2. 引入path模块
const path = require('path');

// 3. 创建读取和输出文件路径
const readFilePath = path.join(__dirname, './source/汪小敏-笑看风云.mp4');
const writeFilePath = path.join(__dirname, './source/汪小敏-笑看风云-2.mp4');

// 4. 同步读取文件
let readedData = fs.readFileSync(readFilePath);

// 5. 同步写入文件
fs.writeFileSync(writeFilePath, readedData);