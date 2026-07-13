"use strict";
// object表示一个js对象
let a;
a = {};
a = function () {
};
// {} 用来指定对象中可以包含哪些属性
// 语法：{属性名:属性值,属性名:属性值}
// 在属性名后边加上?，表示属性是可选的
let b;
b = { name: '孙悟空', age: 18 };
// [propName: string]: any 表示任意类型的属性
let c;
c = { name: '猪八戒', age: 18, gender: '男' };
/*
*   设置函数结构的类型声明：
*       语法：(形参:类型, 形参:类型 ...) => 返回值
* */
let d;
// d = function (n1: string, n2: string): number{
//     return 10;
// }
/*
*   数组的类型声明：
*       类型[]
*       Array<类型>
* */
// string[] 表示字符串数组
let e;
e = ['a', 'b', 'c'];
// number[] 表示数值数值
let f;
let g;
g = [1, 2, 3];
/*
*   元组，元组就是固定长度的数组
*       语法：[类型, 类型, 类型]
* */
let h;
h = ['hello', 123];
/*
* enum 枚举
*
* */
var Gender;
(function (Gender) {
    Gender[Gender["Male"] = 0] = "Male";
    Gender[Gender["Female"] = 1] = "Female";
})(Gender || (Gender = {}));
let i;
i = {
    name: '孙悟空',
    gender: Gender.Male // 'male'
};
// console.log(i.gender === Gender.Male);
// &表示同时
let j;
let k;
let l;
let m;
k = 2;
