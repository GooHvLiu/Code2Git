/*
 * 项目：01-ejs的基本使用方法.js
 */
// 1. 安装ejs，命令：npm i ejs

// 2. 引入ejs/fs
const ejs = require("ejs");
const fs = require("fs");

// 正常使用：字符串
let china = "中国";
let weather = "今天天气不错";

//字符串合并
let str = "";
fs.readFile(__dirname + "/01_html.html", (err, data) => {
  if (err) {
    console.log("Read Err.");
    return;
  }

  str = data.toString();

  //使用ejs渲染,将str中对应的内容替换掉，实现了html与js的完全分离
  let result = ejs.render(str, { china: china, weather: weather });

  console.log(result);
});
