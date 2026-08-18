# nex-utils

Vue 2 后台管理系统通用工具集合：storage、date、validate、message 防重复。

## 安装

```bash
npm install nex-utils dayjs element-ui --save
```

## 模块

### 1. Storage 本地存储

```js
import { setLocalStorage, getLocalStorage, removeLocalStorage } from 'nex-utils'

setLocalStorage('user', { name: '张三' })  // 自动 JSON 序列化
getLocalStorage('user')                      // 自动 JSON 解析
removeLocalStorage('user')
```

### 2. Date 日期工具（基于 dayjs）

```js
import { formatDate, now, addDays, fromNow, DATE_FORMATS } from 'nex-utils'

formatDate(new Date(), DATE_FORMATS.DATE)  // '2024-01-15'
now()                                       // '2024-01-15 10:30:00'
addDays(new Date(), 7)                      // 7天后
fromNow('2024-01-10')                       // '5天前'
```

### 3. Validate 表单校验

```js
import { validateEmail, validatePhone, validateLength } from 'nex-utils'

// Element UI 表单 rules
rules: {
  email: [{ validator: validateEmail, trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  name: [{ validator: validateLength(2, 20, '姓名长度为2-20位'), trigger: 'blur' }]
}
```

### 4. Message 防重复提示

```js
import { showError, showSuccess } from 'nex-utils'

showError('请求失败')  // 3秒内相同内容只显示一次
showSuccess('保存成功')
```

全局注册（可选）：
```js
import { messagePlugin } from 'nex-utils'
Vue.use(messagePlugin)

// 组件中使用
this.$msg.error('请求失败')
this.$msg.success('保存成功')
```

## API 一览

### Storage
| 方法 | 说明 |
|------|------|
| setLocalStorage(key, value) | 存储（自动序列化） |
| getLocalStorage(key) | 读取（自动解析） |
| removeLocalStorage(key) | 删除 |
| setSessionStorage(key, value) | session 存储 |
| getSessionStorage(key) | session 读取 |
| removeSessionStorage(key) | session 删除 |

### Date
| 方法 | 说明 |
|------|------|
| formatDate(date, format) | 格式化日期 |
| now(format) | 当前时间 |
| addDays(date, days) | 加减天数 |
| diffDays(start, end) | 相差天数 |
| fromNow(date) | 相对时间 |
| isToday(date) | 是否今天 |

### Validate
| 方法 | 说明 |
|------|------|
| validateUsername | 用户名 3-16位 |
| validatePassword | 密码 6-20位 |
| validateConfirmPassword(pwd) | 确认密码 |
| validateEmail | 邮箱 |
| validatePhone | 手机号 |
| validateIdCard | 身份证 |
| validateUrl | URL |
| validateLength(min, max, msg) | 自定义长度 |
| validatePattern(pattern, msg) | 自定义正则 |

### Message
| 方法 | 说明 |
|------|------|
| showSuccess(msg) | 成功提示 |
| showError(msg) | 错误提示 |
| showWarning(msg) | 警告提示 |
| showInfo(msg) | 信息提示 |

## License

MIT
