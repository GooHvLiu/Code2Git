# 05-数据库

## NoSQL

### LowDB

#### 基本介绍

##### 概念

LowDB（Low Database）是一个轻量级的本地 JSON 数据库，专为 Node.js 环境设计。它使用 Lodash 作为内部数据操作库，通过简单易用的 API 提供文件系统级别的持久化存储。项目地址可以参考 https://github.com/typicode/lowdb

##### 特性

|特性 |说明 |
|---|---|
|🚀 轻量级 |无需安装数据库服务器，零配置启动 |
|💾 JSON 存储 |数据以 JSON 格式存储在本地文件中 |
|🔗 链式调用 |基于 Lodash，支持流畅的链式查询 |
|⚡ 简单易用 |仅需几行代码即可实现数据的增删改查 |
|📦 多种适配器 |支持文件、内存、浏览器等多种存储方式 |
|🔐 数据持久化 |自动保存到文件，无需手动写入 |

#### 适用范围

##### 应用场景

|序号 |类别 |应用场景 |
|---|---|---|
|1 |小型项目数据存储 |个人博客、任务管理器、记账应用、配置文件管理 |
|2 |原型开发 |快速验证想法、概念验证（PoC）、教学演示项目 |
|3 |桌面应用 |Electron 应用数据存储、本地客户端应用 |
|4 |开发环境 |测试数据存储、开发阶段的临时数据 |
|5 |无服务器环境 |Serverless 应用、静态网站后端 |

##### 数据规模

|适用性 |场景 |说明 |
|---|---|---|
|✅ 适合 |文件大小 |0 ~ 200MB 的 JSON 文件 |
|✅ 适合 |访问模式 |读多写少的场景 |
|✅ 适合 |并发需求 |单用户或低并发应用 |
|❌ 不适合 |应用规模 |大型企业级应用 |
|❌ 不适合 |并发场景 |高并发场景 |
|❌ 不适合 |数据类型 |复杂的关系型数据 |

#### 前期准备

##### 包安装

```cmd
# 使用 npm
npm install lowdb

# 使用 yarn
yarn add lowdb

# 使用 pnpm
pnpm add lowdb
```

##### 初始化

###### 基础用法

```js
const { Low, JSONFile } = require("lowdb");
const path = require("path");

// 数据文件路径
const dbPath = path.join(__dirname, "db.json");

// 创建适配器和数据库实例
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

// 初始化默认数据
async function init() {
  await db.read();

  // 如果数据文件不存在，设置默认数据
  db.data = db.data || {
    posts: [],
    users: [],
    settings: {},
  };

  // 写入数据
  await db.write();
}

init();
```

###### 完整示例

```js
const { Low, JSONFile } = require("lowdb");
const path = require("path");

// 数据文件路径
const dbPath = path.join(__dirname, "db.json");

// 创建适配器
const adapter = new JSONFile(dbPath);

// 创建数据库实例
const db = new Low(adapter);

// 初始化数据库
async function initDatabase() {
  // 读取数据
  await db.read();

  // 设置默认数据结构
  db.data = db.data || {
    users: [],
    posts: [],
    comments: [],
    settings: {
      siteName: "我的网站",
      theme: "light",
    },
  };

  // 写入数据
  await db.write();

  console.log("✅ 数据库初始化成功");
}

// 导出数据库实例
module.exports = { db, initDatabase };
```

#### 数据操作

##### Read查询

```js
// 获取所有用户
const users = db.data.users;

// 根据 ID 查询用户
const user = db.data.users.find((u) => u.id === 1);

// 查询多个用户
const admins = db.data.users.filter((u) => u.role === "admin");

// 使用 Lodash 方法
const _ = require("lodash");
const user = _.find(db.data.users, { id: 1 });
const count = _.countBy(db.data.users, "role");
```

##### Create新增

```js
// 添加新用户
db.data.users.push({
  id: Date.now(),
  name: "张三",
  email: "zhangsan@example.com",
  createdAt: new Date().toISOString(),
});

// 批量添加
db.data.users.push(
  { id: 2, name: "李四", email: "lisi@example.com" },
  { id: 3, name: "王五", email: "wangwu@example.com" },
);

// 写入文件
await db.write();
```

##### Update修改

```js
// 查找并更新用户
const user = db.data.users.find((u) => u.id === 1);
if (user) {
  user.name = "张三丰";
  user.email = "zhangsanfeng@example.com";
  await db.write();
}

// 使用 Lodash 更新
const _ = require("lodash");
_.find(db.data.users, { id: 1 }).name = "张三丰";
await db.write();
```

##### Delete删除

```js
// 删除指定用户
db.data.users = db.data.users.filter((u) => u.id !== 1);
await db.write();

// 批量删除
db.data.users = db.data.users.filter((u) => u.role !== "guest");
await db.write();

// 清空所有数据
db.data.users = [];
await db.write();
```

##### 链式操作

```js
const _ = require("lodash");

// 链式查询
const result = _(db.data.users)
  .filter({ role: "admin" })
  .sortBy("name")
  .map((user) => ({
    id: user.id,
    name: user.name.toUpperCase(),
    email: user.email,
  }))
  .value();

console.log(result);
```

##### 常用 Lodash

```js
const _ = require("lodash");

// find - 查找单个元素
const user = _.find(db.data.users, { id: 1 });

// filter - 过滤多个元素
const admins = _.filter(db.data.users, { role: "admin" });

// map - 映射转换
const names = _.map(db.data.users, "name");

// sortBy - 排序
const sortedUsers = _.sortBy(db.data.users, "name");

// orderBy - 多字段排序
const orderedUsers = _.orderBy(
  db.data.users,
  ["role", "name"],
  ["asc", "desc"],
);

// groupBy - 分组
const grouped = _.groupBy(db.data.users, "role");

// countBy - 计数
const count = _.countBy(db.data.users, "role");

// sumBy - 求和
const total = _.sumBy(db.data.accounts, "amount");

// maxBy / minBy - 最大/最小值
const maxUser = _.maxBy(db.data.users, "age");
const minUser = _.minBy(db.data.users, "age");

// some / every - 条件判断
const hasAdmin = _.some(db.data.users, { role: "admin" });
const allActive = _.every(db.data.users, { active: true });

// omit / pick - 选择字段
const user = _.omit(db.data.users[0], ["password"]);
const summary = _.pick(db.data.users[0], ["id", "name", "email"]);
```

#### 基本应用

##### 用户管理系统

```js
// user.service.js
const { Low, JSONFile } = require("lowdb");
const path = require("path");
const crypto = require("crypto");

class UserService {
  constructor() {
    const dbPath = path.join(__dirname, "data/users.json");
    const adapter = new JSONFile(dbPath);
    this.db = new Low(adapter);
    this.init();
  }

  async init() {
    await this.db.read();
    this.db.data = this.db.data || { users: [] };
    await this.db.write();
  }

  // 创建用户
  async createUser(userData) {
    const user = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.data.users.push(user);
    await this.db.write();
    return user;
  }

  // 获取所有用户
  async getAllUsers() {
    return this.db.data.users;
  }

  // 根据 ID 获取用户
  async getUserById(id) {
    return this.db.data.users.find((u) => u.id === id);
  }

  // 更新用户
  async updateUser(id, updateData) {
    const user = this.db.data.users.find((u) => u.id === id);
    if (!user) return null;

    Object.assign(user, updateData, {
      updatedAt: new Date().toISOString(),
    });

    await this.db.write();
    return user;
  }

  // 删除用户
  async deleteUser(id) {
    const index = this.db.data.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.db.data.users.splice(index, 1);
    await this.db.write();
    return true;
  }

  // 根据邮箱查找用户
  async findByEmail(email) {
    return this.db.data.users.find((u) => u.email === email);
  }

  // 用户登录
  async login(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    // 简单密码验证（实际应使用加密）
    if (user.password === password) {
      return user;
    }

    return null;
  }
}

module.exports = new UserService();
```

##### 博客文章

```js
// post.service.js
const { Low, JSONFile } = require("lowdb");
const path = require("path");

class PostService {
  constructor() {
    const dbPath = path.join(__dirname, "data/posts.json");
    const adapter = new JSONFile(dbPath);
    this.db = new Low(adapter);
    this.init();
  }

  async init() {
    await this.db.read();
    this.db.data = this.db.data || { posts: [] };
    await this.db.write();
  }

  // 创建文章
  async createPost(postData) {
    const post = {
      id: Date.now().toString(),
      ...postData,
      views: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.data.posts.push(post);
    await this.db.write();
    return post;
  }

  // 获取所有文章
  async getAllPosts() {
    return this.db.data.posts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  // 获取文章详情
  async getPostById(id) {
    const post = this.db.data.posts.find((p) => p.id === id);
    if (post) {
      // 增加浏览量
      post.views += 1;
      await this.db.write();
    }
    return post;
  }

  // 更新文章
  async updatePost(id, updateData) {
    const post = this.db.data.posts.find((p) => p.id === id);
    if (!post) return null;

    Object.assign(post, updateData, {
      updatedAt: new Date().toISOString(),
    });

    await this.db.write();
    return post;
  }

  // 删除文章
  async deletePost(id) {
    const index = this.db.data.posts.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.db.data.posts.splice(index, 1);
    await this.db.write();
    return true;
  }

  // 添加评论
  async addComment(postId, commentData) {
    const post = this.db.data.posts.find((p) => p.id === postId);
    if (!post) return null;

    const comment = {
      id: Date.now().toString(),
      ...commentData,
      createdAt: new Date().toISOString(),
    };

    post.comments.push(comment);
    post.updatedAt = new Date().toISOString();
    await this.db.write();

    return comment;
  }

  // 按分类获取文章
  async getPostsByCategory(category) {
    return this.db.data.posts
      .filter((p) => p.category === category)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // 搜索文章
  async searchPosts(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return this.db.data.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerKeyword) ||
        post.content.toLowerCase().includes(lowerKeyword) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(lowerKeyword)),
    );
  }
}

module.exports = new PostService();
```

##### 配置管理

```js
// config.service.js
const { Low, JSONFile } = require("lowdb");
const path = require("path");

class ConfigService {
  constructor() {
    const dbPath = path.join(__dirname, "data/config.json");
    const adapter = new JSONFile(dbPath);
    this.db = new Low(adapter);
    this.defaults = {
      site: {
        name: "我的网站",
        description: "",
        keywords: [],
        logo: "",
      },
      theme: {
        primaryColor: "#3498db",
        secondaryColor: "#2ecc71",
        mode: "light",
      },
      features: {
        comments: true,
        socialShare: true,
        analytics: false,
      },
      smtp: {
        host: "",
        port: 587,
        user: "",
        pass: "",
      },
    };
    this.init();
  }

  async init() {
    await this.db.read();
    this.db.data = this.db.data || this.defaults;
    await this.db.write();
  }

  // 获取配置
  async get(key, defaultValue = null) {
    const keys = key.split(".");
    let value = this.db.data;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  // 设置配置
  async set(key, value) {
    const keys = key.split(".");
    let current = this.db.data;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = value;
    await this.db.write();
    return true;
  }

  // 获取所有配置
  async getAll() {
    return this.db.data;
  }

  // 重置为默认配置
  async reset() {
    this.db.data = { ...this.defaults };
    await this.db.write();
    return this.db.data;
  }

  // 合并配置
  async merge(config) {
    this.db.data = { ...this.db.data, ...config };
    await this.db.write();
    return this.db.data;
  }
}

module.exports = new ConfigService();
```

#### 案例分析

本案例采用个人记账本应用进行说明。

##### 项目结构

```js
```

##### 数据模型

```js
// db.json
{
  "accounts": [
    {
      "id": "1704067200000",
      "date": "2024-01-01",
      "type": "支出",
      "category": "餐饮",
      "amount": 50.5,
      "description": "午餐",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "categories": [
    {
      "id": "1",
      "name": "餐饮",
      "type": "支出",
      "icon": "🍽️"
    },
    {
      "id": "2",
      "name": "工资",
      "type": "收入",
      "icon": "💰"
    }
  ],
  "statistics": {
    "totalIncome": 10000,
    "totalExpense": 5000,
    "balance": 5000
  }
}
```

##### 核心代码

```js
// services/account.service.js
const { Low, JSONFile } = require("lowdb");
const path = require("path");

class AccountService {
  constructor() {
    const dbPath = path.join(__dirname, "../data/db.json");
    const adapter = new JSONFile(dbPath);
    this.db = new Low(adapter);
    this.init();
  }

  async init() {
    await this.db.read();
    this.db.data = this.db.data || {
      accounts: [],
      categories: [],
      statistics: {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
      },
    };
    await this.db.write();
  }

  // 创建账单
  async createAccount(accountData) {
    const account = {
      id: Date.now().toString(),
      ...accountData,
      createdAt: new Date().toISOString(),
    };

    this.db.data.accounts.push(account);

    // 更新统计
    if (account.type === "收入") {
      this.db.data.statistics.totalIncome += account.amount;
    } else {
      this.db.data.statistics.totalExpense += account.amount;
    }
    this.db.data.statistics.balance =
      this.db.data.statistics.totalIncome -
      this.db.data.statistics.totalExpense;

    await this.db.write();
    return account;
  }

  // 获取账单列表
  async getAccounts(filters = {}) {
    let accounts = [...this.db.data.accounts];

    // 按日期过滤
    if (filters.startDate || filters.endDate) {
      accounts = accounts.filter((account) => {
        const date = new Date(account.date);
        const startDate = filters.startDate
          ? new Date(filters.startDate)
          : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;

        if (startDate && date < startDate) return false;
        if (endDate && date > endDate) return false;
        return true;
      });
    }

    // 按类型过滤
    if (filters.type) {
      accounts = accounts.filter((a) => a.type === filters.type);
    }

    // 按分类过滤
    if (filters.category) {
      accounts = accounts.filter((a) => a.category === filters.category);
    }

    // 排序
    accounts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return accounts;
  }

  // 获取统计信息
  async getStatistics() {
    return this.db.data.statistics;
  }

  // 按月统计
  async getMonthlyStats(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const accounts = this.db.data.accounts.filter((account) => {
      const date = new Date(account.date);
      return date >= startDate && date <= endDate;
    });

    const income = accounts
      .filter((a) => a.type === "收入")
      .reduce((sum, a) => sum + a.amount, 0);

    const expense = accounts
      .filter((a) => a.type === "支出")
      .reduce((sum, a) => sum + a.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      count: accounts.length,
    };
  }

  // 删除账单
  async deleteAccount(id) {
    const index = this.db.data.accounts.findIndex((a) => a.id === id);
    if (index === -1) return false;

    const account = this.db.data.accounts[index];

    // 更新统计
    if (account.type === "收入") {
      this.db.data.statistics.totalIncome -= account.amount;
    } else {
      this.db.data.statistics.totalExpense -= account.amount;
    }
    this.db.data.statistics.balance =
      this.db.data.statistics.totalIncome -
      this.db.data.statistics.totalExpense;

    this.db.data.accounts.splice(index, 1);
    await this.db.write();
    return true;
  }
}

module.exports = new AccountService();
```

##### 路由示例

```js
// routes/account.routes.js
const express = require("express");
const router = express.Router();
const accountService = require("../services/account.service");

// 获取账单列表
router.get("/", async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const accounts = await accountService.getAccounts({
      type,
      category,
      startDate,
      endDate,
    });
    res.json({ success: true, data: accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建账单
router.post("/", async (req, res) => {
  try {
    const account = await accountService.createAccount(req.body);
    res.json({ success: true, data: account });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除账单
router.delete("/:id", async (req, res) => {
  try {
    const success = await accountService.deleteAccount(req.params.id);
    if (success) {
      res.json({ success: true, message: "删除成功" });
    } else {
      res.status(404).json({ success: false, message: "账单不存在" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取统计
router.get("/statistics", async (req, res) => {
  try {
    const stats = await accountService.getStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 按月统计
router.get("/monthly/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;
    const stats = await accountService.getMonthlyStats(
      parseInt(year),
      parseInt(month),
    );
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

#### 实操案例

以下操作基本涵盖了常用功能和命令。

```js
//lowdb.js
// 安装 npm lowdb
//导入 lowdb
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
//自身配置
const adapter = new FileSync("db.json");
//获取 db 对象
const db = low(adapter);

/* //初始化数据;
db.defaults({ posts: [], user: {} }).write(); */

/* //写入数据
db.get("posts").push({ id: 2, title: "今天天气还不错o ~~" }).write();
db.get("posts").unshift({ id: 3, title: "今天天气还不错0 ~~" }).write(); */

/* //获取单条数据
let res = db.get("posts").find({ id: 1 }).value();
console.log(res); */

/* //获取数据
console.log(db.get('posts').value()); */

/* //删除数据
let res = db.get("posts").remove({ id: 2 }).write();
console.log(res); */

/* //更新数据
db.get('posts').find({id: 1}).assign({title: '今天下雨啦!!!'}).write() */
```

#### 注意事项

##### 数据安全性

```js
// ❌ 不要在生产环境中存储敏感信息
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "password": "123456"  // 明文密码，非常危险！
    }
  ]
}

// ✅ 正确做法：使用加密
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
```

##### 并发问题

```js
// ❌ LowDB 不支持高并发写入
// 多个请求同时写入可能导致数据丢失

// ✅ 使用锁机制
const lockfile = require("proper-lockfile");

async function safeWrite(db, data) {
  const release = await lockfile.lock("/tmp/mydb.lock");
  try {
    db.data = data;
    await db.write();
  } finally {
    await release();
  }
}
```

##### 性能问题

```js
// ❌ 大量数据时性能会下降
// 每次操作都会读取/写入整个 JSON 文件

// ✅ 优化建议
// 1. 定期清理无用数据
// 2. 使用索引（虽然 LowDB 本身不支持）
// 3. 对于大数据量，考虑使用真正的数据库
```

##### 数据备份

```js
// ✅ 定期备份数据
const fs = require("fs");
const path = require("path");

async function backupDatabase(dbPath, backupDir) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `backup-${timestamp}.json`);

  try {
    await fs.promises.copyFile(dbPath, backupPath);
    console.log(`✅ 备份成功: ${backupPath}`);

    // 保留最近 7 天的备份
    const backups = await fs.promises.readdir(backupDir);
    const sortedBackups = backups.sort().reverse();

    if (sortedBackups.length > 7) {
      for (let i = 7; i < sortedBackups.length; i++) {
        await fs.promises.unlink(path.join(backupDir, sortedBackups[i]));
      }
    }
  } catch (error) {
    console.error("❌ 备份失败:", error);
  }
}
```

#### 使用建议

##### 数据结构设计

```js
// ✅ 良好的数据结构设计
{
  "version": "1.0.0",  // 数据版本，便于迁移
  "metadata": {
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "users": [
    {
      "id": "uuid",  // 使用 UUID 而不是自增
      "username": "string",
      "email": "string",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  ]
}
```

##### 错误处理

```js
// ✅ 完善的错误处理
async function safeOperation(operation) {
  try {
    return await operation();
  } catch (error) {
    console.error("数据库操作失败:", error);

    // 记录错误日志
    await logError(error);

    // 返回友好的错误信息
    throw new Error("数据操作失败，请稍后重试");
  }
}

// 使用示例
async function getUser(id) {
  return safeOperation(async () => {
    await db.read();
    const user = db.data.users.find((u) => u.id === id);
    if (!user) {
      throw new Error("用户不存在");
    }
    return user;
  });
}
```

##### 数据验证

```js
// ✅ 使用验证库
const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().integer().min(18).max(100),
});

async function createUser(userData) {
  // 验证数据
  const { error, value } = userSchema.validate(userData);
  if (error) {
    throw new Error(`数据验证失败: ${error.message}`);
  }

  // 创建用户
  const user = {
    id: Date.now().toString(),
    ...value,
    createdAt: new Date().toISOString(),
  };

  db.data.users.push(user);
  await db.write();

  return user;
}
```

##### 环境配置

```js
// ✅ 根据环境使用不同的数据库
const path = require("path");

function getDbPath() {
  const env = process.env.NODE_ENV || "development";

  if (env === "production") {
    return path.join(__dirname, "data", "production.json");
  } else if (env === "test") {
    return path.join(__dirname, "data", "test.json");
  } else {
    return path.join(__dirname, "data", "development.json");
  }
}

const dbPath = getDbPath();
```

#### 对比特性

|特性 |LowDB |SQLite |MongoDB |MySQL |
|---|---|---|---|---|
|数据库类型 |NoSQL (文档型) |SQL (关系型) |NoSQL (文档型) |SQL (关系型) |
|数据模型 |JSON 文档 |表格 |BSON 文档 |表格 |
|查询语言 |JavaScript/Lodash |SQL |MongoDB Query |SQL |
|安装要求 |无需安装 |需要安装 |需要安装 |需要安装 |
|配置复杂度 |零配置 |简单 |中等 |复杂 |
|学习曲线 |很低 |低 |中等 |高 |
|性能 |低（小数据） |中等 |高 |高 |
|并发支持 |不支持 |支持 |支持 |支持 |
|事务支持 |❌ |✅ |✅ (4.0+) |✅ |
|索引支持 |❌ |✅ |✅ |✅ |
|适用场景 |小型项目 |中小型项目 |大型项目 |企业级 |

#### 模块使用

##### 标准功能

通过如下命令行，了解其使用方法

```js
// 创建lowdb.js文件
//导入 lowdb
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
//自身配置
const adapter = new FileSync("db.json");
//获取 db 对象
const db = low(adapter);

/* //初始化数据;
db.defaults({ posts: [], user: {} }).write(); */

/* //写入数据
db.get("posts").push({ id: 2, title: "今天天气还不错o ~~" }).write();
db.get("posts").unshift({ id: 3, title: "今天天气还不错0 ~~" }).write(); */

/* //获取单条数据
let res = db.get("posts").find({ id: 1 }).value();
console.log(res); */

/* //获取数据
console.log(db.get('posts').value()); */

/* //删除数据
let res = db.get("posts").remove({ id: 2 }).write();
console.log(res); */

/* //更新数据
db.get('posts').find({id: 1}).assign({title: '今天下雨啦!!!'}).write() */
```

> 目前使用不要使用最新版本，因为最新版本需要ES6语法，为了简单操作，可以选用1.0.0，具体下载、安装、使用网址如下：https://www.npmjs.com/package/lowdb/v/1.0.0

##### 模块应用

###### 创建数据

根目录下创建ldb.json，写入如下模板数据库：

```json
{
  "myAccounts": []
}
```

###### 封装操作

根目录下创建dbOperate.js，写入如下模板数据库：

```js
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const ldbJsonPath = path.join(
  process.cwd(),
  "src",
  "database",
  "lowdb",
  "ldb.json",
);

//lowdb自身配置，修改w为实际存储路径
const adapter = new FileSync(ldbJsonPath);
//获取 lowdb db 对象
const db = low(adapter);

// 引入nano,用下面这种方式的原因是因为nanoid方法除了nanoid外，还有其他很多方法，而我们只是使用namoid这个属性
const { nanoid } = require("nanoid");

class DbOperate {
  /**
   * 获取随机ID函数
   * @returns 返回获得的随机数
   */
  getId() {
    try {
      console.log("使用lowDB生成的随机ID为：", nanoid());
      return nanoid();
    } catch (error) {
      return error;
    }
  }

  /**
   * 初始化数据库，定义数据库基本结构，类似model模型
   * @param {*} Objects 数据库结构，如{ "posts": [], "users": {} }，表示创建了两个表，分别为posts金额users
   * @returns 创建后的结构
   */
  init(Objects) {
    try {
      // defaults 自动补全缺失字段，不手动调用write减少文件触碰
      db.defaults(Objects);
      // 仅当数据库为空/结构缺失时才写入，减少文件修改
      return db;
    } catch (error) {
      return error;
    }
  }

  /**
   * 获取全部数据库数据
   * @param {string} tableName 需要查询的表名，如"posts"
   * @returns 返回数据库查询结果
   */
  findAll(tableName) {
    try {
      return db.get(tableName).value();
    } catch (error) {
      return error;
    }
  }

  /**
   * 获取单条数据
   * @param {*} tableName 需要查询的表名，如"posts"
   * @param {*} conditions 需要查询指定范围，如{"id":1}
   * @returns 返回数据库查询结果
   */
  findOne(tableName, conditions) {
    try {
      return db.get(tableName).find(conditions).value();
    } catch (error) {
      return error;
    }
  }

  /**
   * 写入尾部数据
   * @param {*} tableName 需要写入对应的表名，如："posts"
   * @param {*} Objects 需要写入对应的内容，如：{ "id":10," title":"lowdb教程", "content":"xxx" }
   * @returns 返回数据库写入数据
   */
  writePush(tableName, Objects) {
    try {
      return db.get(tableName).push(Objects).write();
    } catch (error) {
      return error;
    }
  }

  /**
   * 写入头部数据
   * @param {*} tableName 需要写入对应的表名，如："posts"
   * @param {*} Objects 需要写入对应的内容，如：{ "id":10," title":"lowdb教程", "content":"xxx" }
   * @returns 返回数据库写入数据
   */
  writeUnshift(tableName, Objects) {
    try {
      return db.get(tableName).unshift(Objects).write();
    } catch (error) {
      return error;
    }
  }

  /**
   * 删除数据
   * @param {*} tableName 需要删除对应的表名，如："posts"
   * @param {*} conditions 需要删除对应的内容，如：{"id":10}
   * @returns 返回数据库删除数据
   */
  deleteData(tableName, conditions) {
    try {
      return db.get(tableName).remove(conditions).write();
    } catch (error) {
      return error;
    }
  }

  /**
   * 更新数据
   * @param {*} tableName 需要更新对应的表名，如："posts"
   * @param {*} conditions 需要更新对应的id,如：{ "id":1 }
   * @param {*} Objects 需要更新对应的内容，如：{ "title":"C++教程", "content":"xwxx" }
   * @returns 返回数据库更新后的数据
   */
  updateData(tableName, conditions, Objects) {
    try {
      return db.get(tableName).find(conditions).assign(Objects).write();
    } catch (error) {
      return error;
    }
  }
}

module.exports = new DbOperate();

```

###### 测试模块

创建lowdb.test.js，测试所有封装功能：

```js
const dbOperate = require("./dbOperate.js");
// 获取随机数
/* dbOperate.getId(); */

//对数据库结构进行初始化设定
console.log(
  dbOperate.init({
    posts: [],
    users: {},
  }),
);

const tableName = "posts";

//写入数据，在后面插入
/* dbOperate.writePush(tableName, {
  id: dbOperate.getId(),
  title: "lowdb教程-0",
  content: "我喜欢的书籍",
}); */

//写入数据，在前面插入
/* dbOperate.writeUnshift(tableName, {
  id: dbOperate.getId(),
  title: "lowdb教程-3",
  content: "我喜欢的书籍3",
}); */

//查询全部数据
/* console.log(dbOperate.findAll(tableName)); */

//查询单条数据
/* console.log(
  dbOperate.findOne(tableName, {
    title: "lowdb教程-3",
  }),
);
 */

//更新数据
/* console.log(
  dbOperate.updateData(
    tableName,
    { title: "lowdb教程-1" },
    { content: "我不喜欢的书籍" },
  ),
);
 */

//删除数据
/* console.log(dbOperate.deleteData(tableName, { content: "我不喜欢的书籍" }));
 */

```

