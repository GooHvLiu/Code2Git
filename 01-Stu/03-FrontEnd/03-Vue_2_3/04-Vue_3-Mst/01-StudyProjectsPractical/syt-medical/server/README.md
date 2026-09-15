# 尚医通 Mock 后端（Node.js + Express）

为配合尚硅谷尚医通 Vue3 前端学习而写的完整 Mock 后端，数据为内存虚拟数据，接口规范完全对齐官方教程。

## 启动

```bash
cd server
npm install
npm run dev
```

服务运行在 **http://localhost:8201**

## 测试账号

| 手机号 | 验证码 | 说明 |
|--------|--------|------|
| 13800000001 | 111111 | 已实名认证，有就诊人/订单数据 |
| 13800000002 | 111111 | 已实名认证 |
| 任意手机号 | 111111 | 自动注册新用户 |

> 发送短信接口会在控制台打印真实验证码，但前端测试直接填 `111111` 即可。

## 前端 Vite 代理配置

在 `web/vite.config.ts` 中加入 proxy：

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

## 已实现接口清单

### 医院模块 `/api/hosp/hospital`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/findHospitalPage/{page}/{limit}` | 分页医院列表（支持 hosname/hostype/provinceCode 等查询） |
| GET | `/findHospitalDetail/{hoscode}` | 医院详情 |
| GET | `/department/{hoscode}` | 科室树形列表 |
| GET | `/doctor/{hoscode}/{depcode}/{page}/{limit}` | 医生排班分页 |
| GET | `/doctorInfo/{hoscode}/{depcode}/{scheduleId}` | 医生排班详情 |
| GET | `/show/{hoscode}/{depcode}/{scheduleId}` | 挂号页完整信息 |
| POST | `/auth/userAuth` | 提交预约挂号（需登录） |

### 用户模块 `/api/user`

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/userInfo/login` | 手机号+验证码登录，返回 token |
| GET | `/userInfo/getUserInfo` | 当前用户信息（需登录） |
| POST | `/userInfo/authUser` | 实名认证（需登录） |
| POST | `/userInfo/logout` | 退出登录（需登录） |
| GET | `/patient/findAll` | 全部就诊人（需登录） |
| GET | `/patient/get/{id}` | 就诊人详情（需登录） |
| POST | `/patient/save` | 新增就诊人（需登录） |
| PUT | `/patient/update` | 修改就诊人（需登录） |
| DELETE | `/patient/delete/{id}` | 删除就诊人（需登录） |

### 短信模块 `/api/user/msm`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/send/{phone}` | 发送验证码（控制台打印） |

### 订单模块 `/api/order/orderInfo`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/auth/{page}/{limit}` | 我的订单分页（需登录） |
| GET | `/getOrders/{orderId}` | 订单详情（需登录） |
| GET | `/auth/getOrderStatus/{orderId}` | 订单状态（需登录） |
| PUT | `/auth/cancelOrder/{orderId}` | 取消订单（需登录） |

### 字典模块 `/api/cmn/dict`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/findByDictCode/{dictCode}` | 按 dictCode 查顶级字典 |
| GET | `/findChildData/{dictCode}` | 查子级（省→市→区） |

## 返回格式

与官方一致：

```json
{ "code": 200, "message": "成功", "ok": true, "data": {} }
```

分页：

```json
{
  "code": 200,
  "message": "成功",
  "ok": true,
  "data": {
    "totalElements": 18,
    "content": [],
    "totalPages": 2,
    "size": 10,
    "number": 1
  }
}
```

## 数据扩展

所有虚拟数据在 `data/` 目录下，均为 JS 模块，直接编辑即可：

- `hospitals.js` — 医院（18 家，覆盖多省市）
- `departments.js` — 科室树
- `schedules.js` — 医生排班（按未来 14 天自动生成）
- `dicts.js` — 省市区/医院等级/证件类型等字典
- `users.js` — 用户
- `patients.js` — 就诊人
- `orders.js` — 订单

> 数据在内存中，重启服务后会恢复初始值。你可以直接在这些文件里加数据。
