/* 
 * 需求：
 *     1）将05-观书有感.txt文件移动到本路径下；
 *     2）将05-观书有感.txt文件重命名为观书有感重启版.txt
 * 
 * 使用：该代码使用异步操作，同步操作不再演示
 */

// 1.引入fs模块
const fs = require('fs');

// 2.引入path模块
const path = require('path');

// 3.创建原始路径
const oldFilePath = path.join(__dirname, '../00-操作文件/05-观书有感.txt');
const NewMoveFilePath = path.join(__dirname, '观书有感重启版.txt');
const newRenameFilePath = path.join(__dirname, '../00-操作文件/05-观书有感重启版.txt');

/* // 4. 对原始文件重新命名
fs.rename(oldFilePath, newRenameFilePath, err => {
  if (err) {
    console.log('重命名错误~~~');
    return;
  }
  console.log('重命名成功！');
}) */

// 5. 对原始文件移动到新路径
fs.rename(oldFilePath, NewMoveFilePath, err => {
  if (err) {
    console.log('移动错误~~~');
    return;
  }
  console.log('移动成功！');
})