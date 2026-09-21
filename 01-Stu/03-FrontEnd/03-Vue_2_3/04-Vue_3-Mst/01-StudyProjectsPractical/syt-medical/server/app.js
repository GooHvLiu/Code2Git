/**
 * 尚医通 Mock 后端 - Node.js + Express
 *
 * 端口：8201（与尚硅谷教程 Nginx 网关端口一致）
 * 所有接口前缀 /api，与教程前端 axios baseURL 一致
 *
 * 启动方式：
 *   npm install
 *   npm run dev   （自动重启）
 *   npm start
 */

const express = require("express");

// 引入 Open API 需要的资源 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openAPI/data/swagger-output.json');

const cors = require("cors");

const app = express();
const PORT = 8201;

// ===== 中间件 =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 打印请求日志（学习用，方便看前端调了什么接口）
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

// ========== 挂载swagger页面 ==========
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }'
}));

// ===== 路由 =====
// 医院模块
app.use("/api/hosp/hospital", require("./routes/hosp"));
// 用户/就诊人模块
app.use("/api/user", require("./routes/user"));
// 短信模块
app.use("/api/user/msm", require("./routes/msm"));
// 订单模块
app.use("/api/order/orderInfo", require("./routes/order"));
// 字典模块
app.use("/api/cmn/dict", require("./routes/cmn"));

// ===== 根路由 =====
app.get("/", (req, res) => {
  res.send(`
    <h1>尚医通 Mock 后端已启动</h1>
    <p>端口：${PORT}</p>
    <p>接口前缀：/api</p>
    <ul>
      <li>GET  /api/hosp/hospital/findHospitalPage/1/10 - 医院列表</li>
      <li>GET  /api/hosp/hospital/department/1000_0 - 科室列表</li>
      <li>POST /api/user/userInfo/login - 登录</li>
      <li>GET  /api/cmn/dict/findByDictCode/Hostype - 字典</li>
    </ul>
  `);
});

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: `接口不存在: ${req.method} ${req.url}`,
    ok: false,
    data: null,
  });
});

// ===== 错误处理 =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    code: 500,
    message: "服务器内部错误: " + err.message,
    ok: false,
    data: null,
  });
});

app.listen(PORT, () => {
  console.log("========================================");
  console.log("  尚医通 Mock 后端启动成功！");
  console.log(`  地址: http://localhost:${PORT}`);
  console.log("========================================");
  console.log("");
  console.log("测试登录手机号：13800000001 或 13800000002");
  console.log("测试验证码：111111（任意手机号均可登录）");
  console.log("");
  console.log("记得在前端 vite.config.ts 中配置代理：");
  console.log("  server: { proxy: { '/api': 'http://localhost:8201' } }");
});
