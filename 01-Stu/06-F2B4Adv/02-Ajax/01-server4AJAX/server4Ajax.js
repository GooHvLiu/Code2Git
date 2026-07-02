// 1. 引入express、cors
const express = require("express");
const cors = require("cors");

// 2. 创建应用对象、绕过跨域问题
const app = express();
app.use(cors());

// 3. 创建路由规则

// 3.11 原生GET
app.get("/server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Hello AYAX of GET");
});

// 3.12 原生POST
app.post("/server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send({
    name: "server",
    poss: "Wuxi"
  });
});

// 3.13 原生GET jSON
app.get("/json-server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");

  //相应数据
  const data = {
    name: "server",
    memo: "Wuxi"
  };

  //对对象进行字符串转换
  let jasonStr = JSON.stringify(data);

  //设置响应体
  res.send(jasonStr);
});

// 3.14 原生GET IE兼容
app.get("/ie", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  //设置响应体
  res.send("Hello IE -2");
});

// 3.15 原生GET 延时测试
app.get("/delay", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.send("延时响应前");
  setTimeout(() => {
    //设置响应体
    res.send("延时响应");
  }, 3000);
});

// 3.21 jQuery GET
app.get("/jquery-server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Hello GET jQuery.");
});

// 3.22 jQuery POST
app.post("/jquery-server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(
    JSON.stringify({
      name: "hahawa",
      address: "JiLin"
    })
  );
});

// 3.22 jQuery GET json
app.get("/jquery-json-server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(
    JSON.stringify({
      name: "hahawa-ajax",
      address: "JiLin-ajax"
    })
  );
});

// 3.21 axio GET
app.get("/axio-server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Hello GET axio.");
});

// 3.22 axio POST
app.post("/axio-server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Hello POST axio.");
});

// 3.22 axio GET json
app.get("/axio-json-server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(
    JSON.stringify({
      name: "json-axio-name",
      address: "json-axio-address"
    })
  );
});

// 3.23 axio ALL fetch
app.all("/axio-fetch-json-server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    name: "axio-fetch-json-name",
    address: "axio-fetch-json-address"
  });
});

// 3.31 JSONP ALL
app.all("/jsonp-server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 1.1 可以直接反馈js代码
  // res.send('console.log("Hello Jsonp")');
  // 1.21 可以将数据转为字符串返回
  const data = {
    name: "尚硅谷atguigu，我在server"
  };
  // 1.22 转为字符串
  let str = JSON.stringify(data);
  // 1.23 返回
  res.end(`handle(${str})`);
});

// 3.32 JSONP ALL DEMO
app.all("/jsonp-server-check-username", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 1.1 可以直接反馈js代码
  // res.send('console.log("Hello Jsonp")');
  // 1.21 可以将数据转为字符串返回
  const data = {
    exist: 1,
    msg: "用户名检测存在"
  };
  // 1.22 转为字符串
  let str = JSON.stringify(data);
  // 1.23 返回
  res.end(`handle(${str})`);
});

// 3.33 JSONP ALL jQuery 2 jsonp
app.all("/jQuery-jsonp-server", (req, res) => {
  //设置响应头 设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 1.1 可以直接反馈js代码
  // res.send('console.log("Hello Jsonp")');
  // 1.21 可以将数据转为字符串返回
  const data = {
    name: "尚硅谷",
    city: ["上海", "北京", "深圳"]
  };
  // 1.22 转为字符串
  let str = JSON.stringify(data);

  // 1.23 接收callback参数
  let cb = req.query.callback;

  // 1.24 返回
  res.end(`${cb}(${str})`);
});

// 3.4 cors-server
app.all("/cors-server", (req, res) => {
  //设置响应头 设置允许跨域

  res.setHeader("Access-Control-Allow-Origin", "*");
  // 1.1 可以直接反馈js代码
  // res.send('console.log("Hello Jsonp")');
  // 1.21 可以将数据转为字符串返回
  const data = {
    name: "cors-server",
    city: ["上海", "北京", "深圳"]
  };
  // 1.22 转为字符串
  let str = JSON.stringify(data);

  res.end(str);
});

// 4. 监听端口
app.listen(8000, () => {
  console.log("我正在监听8000端口中...");
});
