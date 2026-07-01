/* 
 * 需求：
 *     1）创建、读取、删除文件夹；
 * 
 */

// 1. 引入fs
const fs = require('fs');

// 2. 引入path
const path = require('path');

// 3. 设定操作文件夹
const dirName = '00-操作文件 copy 2'
const opaDir = path.join(__dirname, '../' + dirName)

//创建文件夹
{
  // 4. 异步创建文件夹
  /*   fs.mkdir(opaDir, err => {
      if (err) {
        console.log('错误！');
        return;
      }
      console.log('成功');
  
    })
   */
  /*   // 4. 同步创建文件夹
    fs.mkdirSync(opaDir); */
}

//读取文件夹
{
  // 5. 异步读取文件夹
  /*   fs.readdir(opaDir, (err, data) => {
      if (err) {
        console.log('错误！');
        return;
      }
      console.log(data);
  
  
    }) */

  /*   // 5. 同步读取文件夹
    const files = fs.readdirSync(opaDir);
    console.log(files); */

}

//删除文件夹
{
  // 6. 异步删除单一文件夹
  /*   fs.rmdir(opaDir, err => {
      if (err) {
        console.log('错误！');
        return;
      }
      console.log(data);
    }) */

  // 6. 异步删除递归文件夹
  /*   fs.rmdir(opaDir, { recursive: true }, err => {
      if (err) {
        console.log('错误！');
        return;
      }
      console.log('递归删除');
    }) */

  // 6. 同步读取文件夹
  fs.rmdirSync(opaDir, { recursive: true });

}