/* 
 * 需求：
 *     将source下的mp4文件复制一份新的
 * 
 * 文件：03-复制文件之流式读写.js
 * 作用：使用异步读写方式实现
 */

// 1. 引入fs模块
const fs = require('fs');

// 2. 引入path模块
const path = require('path');

// 3. 创建读取和写入文件路径变量
const readFilePath = path.join(__dirname, './source/汪小敏-笑看风云.mp4');
const writeFilePath = path.join(__dirname, './source/汪小敏-笑看风云-4.mp4');

// 4. 创建流式读取
let rs = fs.createReadStream(readFilePath);

// 5. 创建流式写入
let ws = fs.createWriteStream(writeFilePath);

// 6. 流式读取绑定data事件
rs.on('data', chunk => {
  ws.write(chunk);
});

//读取完毕后, 执行 end 回调
rs.on('end', () => {
  console.log('读取完成！')
})