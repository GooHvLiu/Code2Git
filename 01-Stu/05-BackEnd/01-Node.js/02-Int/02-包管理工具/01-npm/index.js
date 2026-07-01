/* 
 * 项目：index.js
 * 目的:引入uniq,其作用为:Removes all duplicates from an array in place.
 *      1) First install using npm:npm install uniq
 *      2) Then use it as follows:
 *          var arr = [1, 1, 2, 2, 3, 5]
 *           require("uniq")(arr)
 *           console.log(arr)        
 *           //Prints:1,2,3,5
 */

// 1. 引入uniq
// const uniq=require('uniq');

// 1. 引入uniq,实际上是导入node_modules/uniq/uniq.js文件
//若没有找到，则在上级目录中下的 node_modules 中寻找同名的文件夹，直至找到磁盘根目录；
const uniq=require('./node_modules/uniq/uniq.js');

// 2. 使用其函数
let arr=[1,2,3,4,5,4,3,2,1];

const result=uniq(arr);

console.log(result);