/*
 * 项目：02-ejs的列表渲染.js
 * 要求：
 * 通过 isLogin 决定最终的输出内容
 * true   输出『<span>欢迎回来</span>』
 * false  输出『<button>登录</button>  <button>注册</button>』
 */
// 1. 安装ejs，命令：npm i ejs

//变量
let isLogin = true;

// 2. 引入ejs/fs
const ejs = require("ejs");
const fs = require("fs");

// 3. 原生JS实现
{
  if (isLogin) {
    console.log("<span>欢迎回来</span>");
  } else {
    console.log("<button>登录</button>  <button>注册</button>");
  }
}

// 4. 使用ejs实现
let html = fs.readFileSync("./03_home.html").toString();
let result = ejs.render(html, { isLogin: isLogin });

console.log(result);
