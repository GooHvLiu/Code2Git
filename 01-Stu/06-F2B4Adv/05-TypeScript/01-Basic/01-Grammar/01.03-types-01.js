"use strict";
// 也可以直接使用字面量进行类型声明
let a;
a = 10;
// 可以使用 | 来连接多个类型（联合类型）
let b;
b = "male";
b = "female";
let c;
c = true;
c = 'hello';
// any 表示的是任意类型，一个变量设置类型为any后相当于对该变量关闭了TS的类型检测
// 使用TS时，不建议使用any类型
// let d: any;
// 声明变量如果不指定类型，则TS解析器会自动判断变量的类型为any （隐式的any）
let d;
d = 10;
d = 'hello';
d = true;
// unknown 表示未知类型的值
let e;
e = 10;
e = "hello";
e = true;
let s;
// d的类型是any，它可以赋值给任意变量
// s = d;
e = 'hello';
// unknown 实际上就是一个类型安全的any
// unknown类型的变量，不能直接赋值给其他变量
if (typeof e === "string") {
    s = e;
}
// 类型断言，可以用来告诉解析器变量的实际类型
/*
* 语法：
*   变量 as 类型
*   <类型>变量
*
* */
s = e;
s = e;
// void 用来表示空，以函数为例，就表示没有返回值的函数
function fn() {
}
// never 表示永远不会返回结果
function fn2() {
    throw new Error('报错了！');
}
/*
** 1. 下载Node.js
**  - 64位：https://nodejs.org/dist/v14.15.1/node-v14.15.1-x64.msi
**  - 32位：https://nodejs.org/dist/v14.15.1/node-v14.15.1-x86.msi

** 2. 安装Node.js

** 3. 使用npm全局安装typescript
**  - 进入命令行
**  - 输入：npm i -g typescript

** 4. 创建一个ts文件

** 5. 使用tsc对ts文件进行编译
**  - 进入命令行
**  - 进入ts文件所在目录
**  - 执行命令：tsc xxx.ts
*/ 
