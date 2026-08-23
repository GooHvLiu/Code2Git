# 代码注释规范

本文档定义了 nexSM-V2 后端和 nexCM-V2 前端项目的统一代码注释规范，所有开发人员必须遵守。

## 一、文件头部注释

每个文件的顶部必须包含文件说明注释，格式如下：

### JavaScript 文件（后端）

```javascript
/**
 * 模块名称 - 层级说明
 * 
 * 详细描述该文件的功能、用途和注意事项
 * 
 * @author 作者姓名
 * @date 创建日期
 * @lastModified 最后修改日期
 */
```

**示例：**

```javascript
/**
 * 用户管理模块 - 业务逻辑层
 * 
 * 处理用户的增删改查、密码重置、状态变更等业务逻辑
 * 包含数据权限过滤和审计日志记录
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-20
 */
```

### Vue 文件（前端）

```vue
<!--
 * 页面/组件名称
 * 
 * 详细描述该页面/组件的功能、用途和注意事项
 * 
 * @author 作者姓名
 * @date 创建日期
 * @lastModified 最后修改日期
-->
<template>
  ...
</template>
```

## 二、类注释

每个类必须包含类说明注释，格式如下：

```javascript
/**
 * 类名称
 * 
 * 详细描述该类的功能、用途和使用方法
 * 
 * @example
 * const instance = new ClassName(options)
 * instance.method()
 */
class ClassName {
  ...
}
```

## 三、方法/函数注释

每个方法/函数必须包含 JSDoc 格式的注释，格式如下：

```javascript
/**
 * 方法名称
 * 
 * 详细描述该方法的功能、用途和注意事项
 * 
 * @param {类型} 参数名 - 参数说明
 * @param {类型} [可选参数名] - 可选参数说明
 * @returns {返回类型} 返回值说明
 * @throws {错误类型} 抛出错误的说明
 * 
 * @example
 * const result = methodName(param1, param2)
 */
async methodName(param1, param2) {
  ...
}
```

### 常用类型说明

| 类型 | 说明 |
|------|------|
| `String` | 字符串 |
| `Number` | 数字 |
| `Boolean` | 布尔值 |
| `Array` | 数组 |
| `Object` | 对象 |
| `Function` | 函数 |
| `Promise` | Promise 对象 |
| `Date` | 日期对象 |
| `null` | 空值 |
| `undefined` | 未定义 |
| `*` | 任意类型 |

### 复杂类型说明

对于复杂类型，可以使用 `{Object<string, number>}`、`{Array<string>}` 等格式：

```javascript
/**
 * @param {Object<string, string>} langMap - 多语言映射表
 * @param {Array<number>} ids - ID 数组
 * @returns {Promise<{list: Array, total: number}>} 分页结果
 */
```

## 四、常量注释

每个常量必须包含注释，格式如下：

```javascript
/** 常量说明 */
const CONSTANT_NAME = 'value'
```

对于常量对象，每个属性也需要注释：

```javascript
/**
 * 错误码常量
 * 编码规则：
 * 200    - 成功
 * 10xxx  - 通用错误
 * 20xxx  - 用户模块
 */
const ERROR_CODE = {
  /** 成功 */
  SUCCESS: 200,
  /** 参数错误 */
  PARAM_ERROR: 10001
}
```

## 五、行内注释

对于复杂的业务逻辑或不易理解的代码，需要添加行内注释：

```javascript
// 计算分页偏移量：(当前页 - 1) * 每页数量
const offset = (page - 1) * pageSize

// 过滤掉空值和未定义的字段，避免 SQL 注入
const safeData = Object.fromEntries(
  Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
)
```

**行内注释规范：**
- 注释必须独占一行，放在代码上方
- 使用 `//` 开头，后面加一个空格
- 注释内容要简洁明了，说明"为什么这样做"，而不是"做了什么"
- 不要注释显而易见的代码

## 六、TODO 注释

对于未完成或需要后续优化的代码，使用 TODO 注释：

```javascript
// TODO: 后续优化为批量查询，减少数据库访问次数
// FIXME: 这里存在并发安全问题，需要加锁
// NOTE: 这里使用硬编码是因为业务需求固定，后续可改为配置
```

**TODO 注释规范：**
- 使用 `TODO`、`FIXME`、`NOTE` 等关键字开头
- 后面加冒号和空格，然后是说明内容
- 建议包含负责人和日期：`// TODO(@zhangsan, 2026-08-20): 优化查询性能`

## 七、Vue 组件注释规范

### Props 注释

```javascript
props: {
  /** 表格数据 */
  data: {
    type: Array,
    default: () => []
  },
  /** 是否加载中 */
  loading: {
    type: Boolean,
    default: false
  }
}
```

### Emit 事件注释

```javascript
// 在组件顶部注释所有事件
/**
 * @event change - 值改变时触发
 * @property {string} value - 新的值
 * 
 * @event search - 点击搜索按钮时触发
 * @property {Object} params - 搜索参数
 */
```

### Methods 注释

Vue 组件中的方法也需要 JSDoc 注释，与普通函数相同。

## 八、后端路由注释

每个路由接口必须包含注释，格式如下：

```javascript
/**
 * @api {GET} /prod-api/v2/user/list 获取用户列表
 * @apiName getUserList
 * @apiGroup User
 * 
 * @apiDescription 分页查询用户列表，支持按用户名、角色、状态筛选
 * 
 * @apiParam {Number} [page=1] 页码
 * @apiParam {Number} [pageSize=20] 每页数量
 * @apiParam {String} [username] 用户名（模糊查询）
 * @apiParam {String} [role] 角色
 * @apiParam {Number} [status] 状态 1启用 0禁用
 * 
 * @apiSuccess {Number} code 状态码 200成功
 * @apiSuccess {String} msg 提示信息
 * @apiSuccess {Object} data 返回数据
 * @apiSuccess {Array} data.list 用户列表
 * @apiSuccess {Number} data.total 总数
 * 
 * @apiSuccessExample {json} 成功响应示例
 * {
 *   "code": 200,
 *   "msg": "success",
 *   "data": {
 *     "list": [...],
 *     "total": 100
 *   }
 * }
 */
router.get('/list', requireAuth, userController.getUserList)
```

## 九、注释检查清单

提交代码前，请检查以下内容：

- [ ] 每个文件都有文件头部注释
- [ ] 每个类都有类说明注释
- [ ] 每个公共方法/函数都有 JSDoc 注释
- [ ] 每个常量都有注释
- [ ] 复杂的业务逻辑都有行内注释
- [ ] 未完成的功能都有 TODO 注释
- [ ] Vue 组件的 Props 都有注释
- [ ] 后端路由都有接口注释
- [ ] 注释内容准确、简洁，没有错别字

## 十、注释示例参考

### 后端 Service 完整示例

```javascript
/**
 * 用户管理模块 - 业务逻辑层
 * 
 * 处理用户的增删改查、密码重置、状态变更等业务逻辑
 * 包含数据权限过滤和审计日志记录
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-20
 */
const { UserModel } = require('./user.model')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')

class UserService {
  /**
   * 分页查询用户列表
   * 
   * 支持按用户名、角色、状态筛选，返回分页结果
   * 自动过滤已软删除的用户
   * 
   * @param {Object} params 查询参数
   * @param {Number} [params.page=1] 页码
   * @param {Number} [params.pageSize=20] 每页数量
   * @param {String} [params.username] 用户名（模糊查询）
   * @param {String} [params.role] 角色
   * @param {Number} [params.status] 状态 1启用 0禁用
   * @returns {Promise<{list: Array, total: number, page: number, pageSize: number}>} 分页结果
   * 
   * @example
   * const result = await userService.getUserList({ page: 1, pageSize: 10, role: 'admin' })
   */
  async getUserList(params = {}) {
    // 构建查询条件
    const where = { is_delete: 0 }
    if (params.username) where.username = { $like: `%${params.username}%` }
    if (params.role) where.role = params.role
    if (params.status !== undefined) where.status = params.status

    return await UserModel.getPageList(params, where)
  }
}

module.exports = new UserService()
```

### 前端工具函数完整示例

```javascript
/**
 * 日期工具封装
 * 
 * 基于 dayjs 封装常用日期处理方法
 * dayjs 轻量（2KB），API 与 moment 兼容
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-20
 */

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 注册插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 常用格式化模板
 */
export const DATE_FORMATS = {
  /** 年-月-日 */
  DATE: 'YYYY-MM-DD',
  /** 年-月-日 时:分:秒 */
  DATETIME: 'YYYY-MM-DD HH:mm:ss'
}

/**
 * 格式化日期
 * 
 * @param {Date|String|Number} date 日期
 * @param {String} [format=DATE_FORMATS.DATETIME] 格式化模板
 * @returns {String} 格式化后的字符串
 * 
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD') // '2026-08-20'
 */
export function formatDate(date, format = DATE_FORMATS.DATETIME) {
  if (!date) return ''
  return dayjs(date).format(format)
}
```

---

**最后更新：2026-08-22**
