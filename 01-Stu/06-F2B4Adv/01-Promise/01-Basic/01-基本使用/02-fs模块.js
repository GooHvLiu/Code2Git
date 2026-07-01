//fs模块是node.js中的，主要功能是对本地硬盘进行读写
//运行时，可以在node环境下使用：node 02-fs模块.js来运行此js文件

const fs = require('fs');

//如下为常规方式，非Promise方式，回调函数 形式
// fs.readFile('./resource/content.txt', (err, data) => {
//     // 如果出错 则抛出错误
//     if(err)  throw err;
//     //输出文件内容
//     console.log(data.toString());
// });

//Promise 形式
let p = new Promise((resolve, reject) => {
    fs.readFile('./resource/content.txt', (err, data) => {
        //如果出错
        if (err) reject(err);
        //如果成功
        resolve(data);
    });
});

//调用 then 
p.then(value => {
    console.log(value.toString());
}, reason => {
    console.log(reason);
});
