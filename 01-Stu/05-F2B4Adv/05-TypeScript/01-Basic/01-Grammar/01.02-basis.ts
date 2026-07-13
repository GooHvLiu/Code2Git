// 声明一个变量a，同时指定它的类型为number
let a: number;

// a 的类型设置为了number，在以后的使用过程中a的值只能是数字
a = 10;
a - 30;
// a = 'hello'; // 此行代码会报错，因为变量a的类型是number，不能赋值字符串
let b: string;
b = 'hello';
//b = 123;

// 声明完变量直接进行赋值
// let c: boolean = false;

// 如果变量的声明和赋值是同时进行的，TS可以自动对变量进行类型检测
let c = false;
c = true;

// JS中的函数是不考虑参数的类型和个数的
// function sum(a, b){
//     return a + b;
// }

// console.log(sum(123, 456)); // 579
// console.log(sum(123, "456")); // "123456"

function sum(a: number, b: number): number {
  return a + b;
}

let result = sum(123, 456);

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