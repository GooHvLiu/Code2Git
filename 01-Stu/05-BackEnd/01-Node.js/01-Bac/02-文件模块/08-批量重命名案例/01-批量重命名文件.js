/* 
 * 需求：
 *     1）对文件名中以"-"分割；
 *     2）将"-"前面的数字后面都加上指定的特定字符串；
 * 
 */
// 1. 引入fs
const fs = require('fs');

// 2.引入path
const path = require('path');

// 3. 创建需要批量重命名文件夹路径
const renameDir = path.join(__dirname, '../00-操作文件');


// 4. 指定需要增加指定字符串
const preStr = '_change_';

// 5. 通过文件夹操作遍历文件夹内所有文件
fs.readdir(renameDir, (err, dataArr) => {
  if (err) {
    console.log(renameDir + ':读取错误！');

  }
  else {
    //此时拿到的dataArr就是一个数组
    for (let i = 0; i < dataArr.length; i++) {
      // console.log(dataArr[i].split('-'));


      /*  
      //使用split方式实现，但是此方法分割出来多个数组，效果不好
      //获取文件名字的前缀,unmodifiedFileAllNameArr是数组，是之前的文件名称字符串分割
      let unmodifiedFileAllNameArr = dataArr[i].split('-', 2);
      console.log(unmodifiedFileAllNameArr);  
      //unmodifiedFileFirstStr是字符串，就是文件名前面的2位数字
      let unmodifiedFileFirstStr = unmodifiedFileAllNameArr[0];
      // console.log(filePreNameStr);
      // */

      let index = dataArr[i].indexOf('-');
      //分割后的前部分
      let unmodifiedFileFirstStr = '';
      //分割后的后部分
      let unmodifiedFileSecondStr = '';
      if (index != -1) {
        unmodifiedFileFirstStr = dataArr[i].substring(0, index);
        unmodifiedFileSecondStr = dataArr[i].substring(index + 1);

      }

      //将前缀拼接成期待的文件前缀字符串，modifiedFileFirstStr是之后的文件名称字符串分割
      let modifiedFileFirstStr = unmodifiedFileFirstStr + preStr;
      // console.log(renameFilePreNameStr);

      //将dataArr中保留的文件名称拼接成想要的文件名称,modifiedFileAllName就是更新之后文件的名字
      let modifiedFileAllName = modifiedFileFirstStr + unmodifiedFileSecondStr;

      // console.log(renameDir + '\\' + dataArr[i], renameDir + '\\' + modifiedFileAllName);

      //文件名称修改
      fs.rename(renameDir + '\\' + dataArr[i], renameDir + '\\' + modifiedFileAllName, err => {
        if (err) {
          console.log('处理异常');
          return;
        }
        else
          console.log('处理成功，请确认！');

      })

    }
  }
});