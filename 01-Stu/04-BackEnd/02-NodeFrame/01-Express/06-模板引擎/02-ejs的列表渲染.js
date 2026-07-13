/*
 * 项目：02-ejs的列表渲染.js
 * 要求：
 *    将'唐僧'，'孙悟空'，'猪八戒'，'沙僧'渲染为列表
 */
// 1. 安装ejs，命令：npm i ejs

const xiyou = ["唐僧", "孙悟空", "猪八戒", "沙僧", "白龙马"];

// 2. 引入ejs/fs
const ejs = require("ejs");
const fs = require("fs");

// 3. 原生JS实现
{
  let str = "<ul>";

  xiyou.forEach((item) => {
    str += `<li> ${item} </li>`;
  });

  str += "</ul>";

  console.log(str);
}

// 4. 使用ejs实现
const html = fs.readFileSync(__dirname + "/02_西游.html").toString();

const result = ejs.render(html, { xiyou: xiyou });

console.log(result);
