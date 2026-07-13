/* 
 * 需求：
 *     1）将00-待删除文件-01.txt文件删除；
 * 
 */
// 1. fs文件引入
const fs = require('fs');

// 2. 引入path
const path = require('path');

// 3. 设定删除文件的path路径
const filePath = path.join(__dirname, '../00-操作文件/00-待删除文件-01.txt');

/* // 4. 使用同步unlink方式删除文件
fs.unlinkSync(filePath); */

/* // 4. 使用异步unlink方式删除文件
fs.unlink(filePath, err => {
  if (err) {
    console.log('err');
    return
  }
  console.log('Success!!!');

}); */

// 4. fs.rm() - 删除文件或目录（Node.js 14.14.0+）
// recursive: true -- 表示递归删除
// force: true -- 表示强制删除
fs.rm(filePath, { recursive: true, force: true }, err => {
  if (err) {
    console.error('删除失败:', err);
    return;
  }
  console.log('删除成功');
});