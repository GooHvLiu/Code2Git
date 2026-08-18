# nex-request

Vue 2 + Axios 请求统一封装，支持 Token 注入、错误处理、请求重试、防重复请求、Loading 计数。

## 安装

```bash
npm install nex-request axios --save
```

## 使用

### 创建请求实例（src/utils/request.js）

```js
import { createRequest } from 'nex-request'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router'

const request = createRequest({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
  tokenHeader: 'Authorization',
  tokenPrefix: 'Bearer',
  getToken: () => localStorage.getItem('token'),
  noTokenApis: ['/login', '/register'],
  successCode: 200,
  tokenExpiredCodes: [401],
  permissionDeniedCode: 403,

  // Token 过期回调
  onTokenExpired: () => {
    return MessageBox.confirm('登录已过期，是否重新登录？', '提示', {
      confirmButtonText: '重新登录',
      type: 'warning'
    }).then(() => {
      localStorage.removeItem('token')
      router.push('/login')
    })
  },

  // 权限不足回调
  onPermissionDenied: (res) => {
    Message.error(res.msg || '权限不足')
  },

  // 通用错误提示
  onError: (msg) => {
    Message.error(msg)
  },

  // Loading 计数（配合全局 loading）
  onLoadingShow: () => store.dispatch('app/showLoading'),
  onLoadingHide: () => store.dispatch('app/hideLoading'),

  // 请求重试
  maxRetries: 2,
  retryDelay: 500,
  retryableStatus: [500, 502, 503, 504]
})

export default request
```

### 发请求

```js
import request from '@/utils/request'

// GET
export function getUserList(params) {
  return request({ url: '/user/list', method: 'get', params })
}

// POST
export function createUser(data) {
  return request({ url: '/user/create', method: 'post', data })
}
```

### 路由切换取消未完成请求

```js
// router/index.js
import request from '@/utils/request'
router.beforeEach((to, from, next) => {
  request.cancelAllPending()
  next()
})
```

## 配置项

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| baseURL | 请求基础路径 | String | '' |
| timeout | 超时时间（ms） | Number | 10000 |
| tokenHeader | Token 请求头 | String | 'Authorization' |
| tokenPrefix | Token 前缀 | String | 'Bearer' |
| getToken | 获取 Token 函数 | Function | () => '' |
| noTokenApis | 不需要 Token 的接口 | Array | [] |
| successCode | 业务成功码 | Number | 200 |
| tokenExpiredCodes | Token 过期码 | Array | [401] |
| permissionDeniedCode | 权限不足码 | Number | 403 |
| onTokenExpired | Token过期回调 | Function | null |
| onPermissionDenied | 权限不足回调 | Function | null |
| onError | 通用错误回调 | Function | null |
| onLoadingShow | Loading 显示回调 | Function | null |
| onLoadingHide | Loading 隐藏回调 | Function | null |
| maxRetries | 最大重试次数 | Number | 2 |
| retryDelay | 重试间隔（ms） | Number | 500 |
| retryableStatus | 可重试状态码 | Array | [500,502,503,504] |

## 方法

| 方法 | 说明 |
|------|------|
| request(config) | 发请求（同 axios） |
| request.cancelAllPending(message) | 取消所有未完成请求 |

## License

MIT
