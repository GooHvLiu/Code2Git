/**
 * util.promisify 方法:错误优先的回调，返回一个promise的一个版本
 */
//引入 util 模块
const util = require('util');

//引入 fs 模块
const fs = require('fs');

//返回一个新的函数
let mineReadFile = util.promisify(fs.readFile);

//暂时不写失败的回调
mineReadFile('./resource/content.txt').then(value => {
    console.log(value.toString());
});