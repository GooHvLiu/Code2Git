/**
 * 尚医通项目 OpenAPI 配置
 * 其他项目复用 swagger-helper 时，只需修改此文件
 */

const path = require("path");

module.exports = {
  title: "尚医通平台 API",
  version: "1.0.0",
  description: `
尚医通预约挂号平台后端接口文档。

## 项目简介
尚医通是一个在线预约挂号平台，用户可以通过平台查询医院、科室、医生排班，
在线预约挂号、管理就诊人、查看订单等。

## 统一响应格式
所有接口返回统一的 JSON 包装：
\`\`\`json
{
  "code": 200,
  "message": "成功",
  "ok": true,
  "data": {}
}
\`\`\`

## 认证说明
- 登录接口返回 \`token\`，后续需认证的接口在请求头中携带 \`token\` 字段
- 测试手机号：\`13800000001\`，验证码：\`111111\`
- 未登录或 token 过期返回 code=208

## 错误码
| code | 说明 |
|------|------|
| 200 | 成功 |
| 201 | 业务失败 |
| 208 | 未登录/登录过期 |
| 404 | 接口不存在 |
| 500 | 服务器内部错误 |
  `,
  contact: {
    name: "尚医通开发团队",
    email: "dev@syt-medical.com",
  },
  license: { name: "MIT" },
  servers: [
    { url: "http://localhost:8201", description: "开发环境" },
  ],
  tags: [
    { name: "医院管理", description: "医院列表、详情、科室、医生排班、预约挂号" },
    { name: "用户中心", description: "登录、实名认证、用户信息、就诊人管理" },
    { name: "订单管理", description: "挂号订单查询、详情、状态、取消" },
    { name: "数据字典", description: "省市区、医院等级等字典数据" },
    { name: "短信服务", description: "验证码发送" },
  ],
  pathsDir: path.join(__dirname, "paths"),
  schemasDir: path.join(__dirname, "schemas"),
  bearerAuth: true,
  ui: {
    customSiteTitle: "尚医通 API 文档",
  },
};
