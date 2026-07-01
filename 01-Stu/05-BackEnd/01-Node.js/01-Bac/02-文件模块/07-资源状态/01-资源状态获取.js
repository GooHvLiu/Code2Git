/* 
 * 需求：
 *     1）获取文件属性；
 * 
 */
// 1. 引入fs
const fs = require('fs');

// 2. 引入path
const path = require('path');

// 3. 设定需要获取的文件路径
const fileName = '00-待删除文件-02.txt';
const pathName = path.join(__dirname, '../00-操作文件/' + fileName);

/* // 4.异步获取资源状态新
fs.stat(pathName, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('dev:' + data.dev, 'mode:' + data.mode, 'nlink:' + data.nlink, 'uid:' + data.uid, 'gid:' + data.gid, 'rdev:' + data.rdev, 'atimeMs:' + data.atimeMs, 'size:' + data.size + ' MB', 'blocks:' + data.blocks,);

}) */

// 4.同步获取资源状态新
const data = fs.statSync(pathName);
console.log('dev:' + data.dev, 'mode:' + data.mode, 'nlink:' + data.nlink, 'uid:' + data.uid, 'gid:' + data.gid, 'rdev:' + data.rdev, 'atimeMs:' + data.atimeMs, 'size:' + data.size + ' MB', 'blocks:' + data.blocks,);
