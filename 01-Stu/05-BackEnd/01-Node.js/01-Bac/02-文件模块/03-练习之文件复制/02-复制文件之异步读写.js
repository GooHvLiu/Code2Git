/* 
 * 需求：
 *     将source下的mp4文件复制一份新的
 * 
 * 文件：02-复制文件之异步读写.js
 * 作用：使用异步读写方式实现
 */

// 1. 引入fs模块
const fs = require('fs');

// 2. 引入path模块
const path = require('path');

// 3. 创建读取和写入文件路径变量
const readFilePath = path.join(__dirname, './source/汪小敏-笑看风云.mp4');
const writeFilePath = path.join(__dirname, './source/汪小敏-笑看风云-3.mp4');

/* 
 * 如下是在异步读取文件后直接调用异步写入data
*/
// 4. 异步读取文件
fs.readFile(readFilePath, (err, data) => {
  if (err) {
    console.log('err');
    return;
  }
  // 5. 异步写入文件
  fs.writeFile(writeFilePath, data, err => {
    if (err) {
      console.log('err');
      return;
    }
    console.log('复制成功！');
  });
});