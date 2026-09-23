# 尚医通 Mock 后端（Node.js + Express）

为配合尚硅谷尚医通 Vue3 前端学习而写的完整 Mock 后端。数据为内存虚拟数据，接口规范完全对齐官方教程，前后端分离。

## 快速启动

```bash
cd server
npm install
npm start          # 或 npm run dev（需自行安装 nodemon）
```

服务运行在 **http://localhost:8201**

## 测试账号

| 手机号 | 验证码 | 说明 |
|--------|--------|------|
| 13800000001 | 111111 | 已实名认证，有3个就诊人、5笔订单 |
| 13800000002 | 111111 | 已实名认证，有2个就诊人 |
| 任意手机号 | 111111 | 自动注册新用户 |

> 发送短信接口会在控制台打印真实验证码，前端测试直接填 `111111` 即可。

## API 文档

启动后访问：

- **文档页面**：http://localhost:8201/api/api-docs/
- **规范 JSON**：http://localhost:8201/api/api-docs/spec.json（可导入 Postman / Apifox）

文档基于 OpenAPI 3.0 规范，包含全部 24 个接口的详细描述、参数、请求体、响应示例和数据模型。

## 前端 Vite 代理配置

在 `web/vite.config.ts` 中配置：

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8201",
        changeOrigin: true,
      },
    },
  },
});
```

## 项目结构

```
server/
├── app.js                     # 入口，端口 8201
├── package.json
├── routes/
│   ├── hosp.js                # 医院/科室/排班/挂号（7个接口）
│   ├── user.js                # 登录/实名/就诊人（9个接口）
│   ├── msm.js                 # 短信验证码（1个接口）
│   ├── order.js               # 订单查询/取消（4个接口）
│   └── cmn.js                 # 数据字典（2个接口）
├── middlewares/
│   └── auth.js                # Token 认证中间件（内存 tokenStore）
├── utils/
│   └── response.js            # 统一响应格式 {code, message, ok, data}
├── data/                      # ★ 虚拟数据（可自行扩展）
│   ├── hospitals.js           # 42家真实三甲医院
│   ├── departments.js         # 科室树（每家医院10大科室+24子科室）
│   ├── schedules.js           # 医生排班（确定性生成，约3万条）
│   ├── dicts.js               # 省市区/医院等级等字典
│   ├── users.js               # 10个用户（北京/上海/广东）
│   ├── patients.js            # 20个就诊人
│   └── orders.js              # 32笔订单（关联真实排班）
└── openAPI/                   # ★ OpenAPI 文档（可复用模块）
    ├── config.js              # 项目级配置
    ├── swagger-helper/        # 可复用标准模块（loader/validator/ui/index）
    ├── paths/                 # 接口定义 YAML（按模块拆分）
    └── schemas/               # 数据模型 YAML
```

## 接口清单

### 医院管理 `/api/hosp/hospital`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/findHospitalPage/{page}/{limit}` | 分页医院列表，支持 hosname/hostype/provinceCode/cityCode/districtCode 查询 | 否 |
| GET | `/findHospitalDetail/{hoscode}` | 医院详情（含预约规则） | 否 |
| GET | `/department/{hoscode}` | 科室树形列表 | 否 |
| GET | `/doctor/{hoscode}/{depcode}/{page}/{limit}` | 医生排班分页 | 否 |
| GET | `/doctorInfo/{hoscode}/{depcode}/{scheduleId}` | 单条排班详情 | 否 |
| GET | `/show/{hoscode}/{depcode}/{scheduleId}` | 挂号确认页完整信息（医院+科室+排班） | 否 |
| POST | `/auth/userAuth` | 提交预约挂号，body: `{scheduleId, patientId}` | 是 |

### 用户中心 `/api/user`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/userInfo/login` | 手机号+验证码登录，返回 `{token, name}` | 否 |
| GET | `/userInfo/getUserInfo` | 当前用户信息 | 是 |
| POST | `/userInfo/authUser` | 实名认证，body: `{name, certificatesType, certificatesNo}` | 是 |
| GET | `/userInfo/auth/wxLogin` | 微信登录（Mock 返回提示） | 否 |
| POST | `/userInfo/logout` | 退出登录 | 是 |
| GET | `/patient/findAll` | 当前用户全部就诊人 | 是 |
| GET | `/patient/get/{id}` | 就诊人详情 | 是 |
| POST | `/patient/save` | 新增就诊人 | 是 |
| PUT | `/patient/update` | 修改就诊人（body 含 id） | 是 |
| DELETE | `/patient/delete/{id}` | 删除就诊人（逻辑删除） | 是 |

### 短信服务 `/api/user/msm`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/send/{phone}` | 发送6位验证码（控制台打印，测试用 111111） |

### 订单管理 `/api/order/orderInfo`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/auth/{page}/{limit}` | 我的订单分页 | 是 |
| GET | `/getOrders/{orderId}` | 订单详情 | 是 |
| GET | `/auth/getOrderStatus/{orderId}` | 订单状态码 | 是 |
| PUT | `/auth/cancelOrder/{orderId}` | 取消待支付订单 | 是 |

### 数据字典 `/api/cmn/dict`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/findByDictCode/{dictCode}` | 按 dictCode 查顶级字典（Province/Hostype） |
| GET | `/findChildData/{dictCode}` | 按父节点 value 查子级（省→市→区级联） |

## 统一响应格式

所有接口返回：

```json
{ "code": 200, "message": "成功", "ok": true, "data": {} }
```

分页接口 data 结构：

```json
{
  "totalElements": 42,
  "content": [],
  "totalPages": 5,
  "size": 10,
  "number": 1
}
```

### 错误码

| code | 说明 |
|------|------|
| 200 | 成功 |
| 201 | 业务失败（参数错误/号源已满/就诊人不存在等） |
| 208 | 未登录或 token 过期 |
| 404 | 接口不存在 |
| 500 | 服务器内部错误 |

## 认证机制

- 登录成功返回 `token`，前端存在 localStorage
- 需认证的接口在请求头携带 `token` 字段（非 `Authorization: Bearer`）
- Token 存在内存 `tokenStore` 中，重启服务后失效
- 认证中间件：`middlewares/auth.js`

## 数据说明

### 数据覆盖

- **地区**：北京（16区全）、上海（16区全）、广东（广州11区/深圳9区/佛山/东莞/珠海）
- **医院**：42家真实三甲医院（北京15 + 上海12 + 广东15）
- **科室**：每家医院10个大科室（内/外/妇产/儿/眼/耳鼻喉/口腔/皮肤/肿瘤/精神），共24个子科室
- **排班**：每个子科室4名医生，未来14天排班，约30,240条，确定性生成（ID稳定）
- **医生**：按专科分配真实姓名（如神内王拥军、心内张抒扬）
- **用户**：10个用户，身份证前6位与所在地区一致
- **就诊人**：20个，含老人/儿童，全部关联真实用户
- **订单**：32笔，全部关联真实 scheduleId、用户、就诊人，覆盖4种状态

### 数据关联性

所有跨表引用均已验证通过（0错误）：
- 医院省市区编码 ↔ 字典
- 科室 hoscode ↔ 医院
- 排班 hoscode/depcode ↔ 科室
- 订单 scheduleId ↔ 排班、patientId ↔ 就诊人、userId ↔ 用户

### 扩展数据

直接编辑 `data/` 目录下的 JS 文件即可：

- 新增医院：在 `hospitals.js` 的数组中追加对象，hoscode 保持唯一
- 新增科室：`departments.js` 自动遍历所有医院生成，修改 `depTemplates` 和 `subDeps` 即可
- 排班：`schedules.js` 自动生成，修改 `doctorPool` 可换医生姓名
- 用户/就诊人/订单：直接在对应文件数组中追加，注意外键关联

> 数据在内存中，重启服务后恢复初始值。`schedules.js` 使用确定性伪随机，每次重启 scheduleId 不变。

## swagger-helper 可复用模块

`openAPI/swagger-helper/` 是独立的可复用模块，其他项目只需：

```js
const swaggerHelper = require("./openAPI/swagger-helper");

app.use("/api-docs", swaggerHelper({
  title: "你的项目 API",
  version: "1.0.0",
  pathsDir: __dirname + "/paths",      // 接口 YAML 目录
  schemasDir: __dirname + "/schemas",  // 模型 YAML 目录
  servers: [{ url: "http://localhost:3000" }],
}));
```

模块功能：
- 自动加载合并 paths/ 和 schemas/ 下的所有 YAML
- 启动时校验 OpenAPI 规范合法性
- swagger-ui 配置封装（搜索、深链接、请求耗时、记住token）
- 提供 `/spec.json` 端点下载完整规范
