##### MongoDB-V2.1

2.1版本在2.0版本的基础上，增加了一个新的数据模型，并共同在项目中使用。

###### 文件架构

```文本
MongoDB-V2.1
 ┣ controllers/                 # 业务控制器（处理请求、组装返回）
 ┃ ┗ user.controller.js         # 处理users请求、组装返回
 ┃ ┗ accounts.controller.js     # 处理accounts请求、组装返回
 ┣ config/                      # 全局配置
 ┃ ┗ db.js                      # MongoDB 连接配置
 ┣ models/                      # 数据模型 Schema（核心）
 ┃ ┣ index.model.js             # 模型统一注册
 ┃ ┗ users.model.js             # users模型定义配置
 ┃ ┗ accounts.model.js          # accounts模型定义配置
 ┣ services/                    # 数据服务层（纯数据库操作，抽离复用）
 ┃ ┗ index.service.js           # 模型统一注册
 ┃ ┗ user.service.js            # users模型 数据库操作
 ┃ ┗ accounts.service.js        # accounts模型 数据库操作
 ┣ middleware/                  # 全局中间件
 ┃ ┗ auth.middleware.js         # token鉴权
 ┃ ┗ error.middleware.js        # 全局错误捕获
 ┃ ┗ validate.middleware.js     # 参数校验
 ┣ utils/                       # 通用工具
 ┃ ┣ encryptSalted.js           # 密码加密
 ┃ ┗ test.bcryptjs.js           # 密码加密测试工具
 ┃ ┗ pagination.js              # 分页封装
 ┃ ┗ response.js                # 统一返回格式
 ┣ test4Using/                  # 测试工具
 ┃ ┣ test4dbOperater4Accounts.js# *2 MongoDB对应Accounts使用核心模块及测试模块
 ┃ ┣ test4dbOperater4Users.js   # MongoDB对应Users使用核心模块及测试模块
 ┃ ┗ app.js                     # 内部搭建了express模块，可以根据需求进行使用
 ┣ .env                         # 环境变量（git忽略）
 ┣ ReadMe.md                    # 使用手册
```

###### 安装依赖

```bash
npm i express mongoose dotenv bcryptjs dotenv-expand module-alias
```

> module-alias是为了解决路径引入错乱问题

###### 完整代码

config/db.js用于数据库连接：

```js
// 1. 引入mongoose
const mongoose = require("mongoose");

//2. 定义数据库连接函数变量
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb://${process.env.MONGODB_DBHOST}:${process.env.MONGODB_DBPORT}/${process.env.MONGODB_DBNAME}`,
      {
        // 新版mongoose无需废弃参数，保持简洁
      },
    );
    console.log(
      `MongoDB Connected Succes. Connecting to: ${conn.connection.host}:${conn.connection.port}`,
    );
  } catch (error) {
    console.error("MongoDB Connected Fail. Error is:", error.message);
    throw new Error(error.message);
  }
};

// 3. 连接函数变量导出
module.exports = connectDB;

```

controllers/users.controller.js负责请求响应：

```js
const jwt = require("jsonwebtoken");
const { success, fail } = require("@utils/response.js");
const { usersService } = require("@services/index.service.js");
const { comparePassword } = require("@utils/encryptSalted.js");

class UserController {
  // 注册用户
  async register(req, res) {
    const { username, email, password } = req.body;
    // 空字符串、undefined、null 全部替换成默认邮箱,这么做是为了在特殊项目中,email不做要求,直接注册就好了
    const realEmail = email || "email@email.com";
    const exist = await usersService.findOne({
      $or: [{ username }, { realEmail }],
    });
    if (exist) return fail(res, "用户名或邮箱已存在");
    const user = await usersService.createUser({
      username,
      realEmail,
      password,
    });
    return success(res, { id: user._id, username: user.username }, "注册成功");
  }

  // 登录用户
  async login(req, res) {
    const { username, password } = req.body;
    const user = await usersService.findOne({ username });
    if (!user) return fail(res, "账号不存在");
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return fail(res, "密码错误");

    // 生成token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "2h",
    });
    return success(
      res,
      {
        token,
        user: { id: user._id, username: user.username, role: user.role },
      },
      "登录成功",
    );
  }

  // 获取用户列表（管理员）
  async getUserList(req, res) {
    const { page = 1, limit = 10, username } = req.query;
    const query = {};
    if (username) query.username = new RegExp(username, "i");
    const data = await usersService.getUserList(query, page, limit);
    return success(res, data);
  }

  // 获取当前登录用户信息
  async getInfo(req, res) {
    return success(res, req.user);
  }

  // 删除用户（软删）
  async deleteUser(req, res) {
    const { id } = req.params;
    await usersService.deleteById(id);
    return success(res, null, "删除成功");
  }
}

module.exports = new UserController();

```

controllers/accounts.controller.js负责请求响应：

```js
const { success, fail } = require("@utils/response.js");
const { accountsService } = require("@services/index.service.js");

class AccountsController {
  // 获取账单列表（管理员）
  async getAccountsList(req, res) {
    const { page = 1, limit = 10, username } = req.query;
    const query = {};
    if (username) query.username = new RegExp(username, "i");
    const data = await accountsService.getAccountsList(query, page, limit);
    return success(res, data);
  }

  // 获取当前登录用户信息
  async getInfo(req, res) {
    return success(res, req.user);
  }

  // 删除用户（软删）
  async deleteUser(req, res) {
    const { id } = req.params;
    await accountsService.deleteById(id);
    return success(res, null, "删除成功");
  }
}

module.exports = new AccountsController();

```

middleware/auth.middleware.js为token鉴权，定义：

```js
const jwt = require("jsonwebtoken");
const { fail } = require("@utils/response.js");
const userService = require("@services/users.service.js");

const authMiddleware = async (req, res, next) => {
  try {
    // 获取token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return fail(res, "未登录，请先登录", 401);

    // 解析token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.findById(decode.userId);
    if (!user) return fail(res, "用户不存在", 401);

    // 挂载用户到请求对象，全局控制器可直接使用
    req.user = user;
    next();
  } catch (err) {
    return fail(res, "token失效，请重新登录", 401);
  }
};

// 管理员权限校验
const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return fail(res, "无管理员权限", 403);
  }
  next();
};

module.exports = { authMiddleware, adminAuth };

```

middleware/error.middleware.js为全局错误捕获，定义：

```js
const { fail } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error("全局错误：", err);
  // mongo唯一键冲突
  if (err.code === 11000) {
    return fail(res, "数据重复，用户名/邮箱已存在", 400);
  }
  return fail(res, err.message || "服务器异常", 500);
};

module.exports = errorHandler;

```

middleware/validate.middleware.js为验证中间件，定义：

```js
const Joi = require("joi");
const { responseError } = require("../utils/response");

/**
 * 参数校验中间件工厂函数
 * @param {Object} schemaRules - Joi校验规则对象 { body, params, query }
 * @returns 中间件函数
 */
const validateMiddleware = (schemaRules) => {
  return (req, res, next) => {
    // 待校验数据映射
    const sourceMap = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    // 遍历所有需要校验的字段域
    for (const [key, schema] of Object.entries(schemaRules)) {
      if (!sourceMap.hasOwnProperty(key)) continue;

      // 执行校验
      const { error } = schema.validate(sourceMap[key], {
        abortEarly: false, // 返回全部错误，不只第一条
        stripUnknown: true, // 剔除未定义的多余字段
      });

      if (error) {
        // 拼接错误提示
        const errMsg = error.details.map((item) => item.message).join("、");
        return responseError(res, 400, `参数校验失败：${errMsg}`);
      }
    }
    next();
  };
};

module.exports = validateMiddleware;

```

models/index.model.js为注册model定义：

```js
const Users = require("./users.model.js");
const Accounts = require("./accounts.model.js");

module.exports = {
  Users,
  Accounts,
};

```

models/users.model.js为users数模定义：

```js
// 1.1 引入相关所有依赖包
const mongoose = require("mongoose");
// 1.2 引入加密包
const bcryptjsSalted = require("@utils/encryptSalted.js");

// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "用户名不能为空"],
    unique: true,
    trim: true,
    minlength: [3, "用户名至少3个字符"],
    maxlength: [30, "用户名最多30个字符"],
    index: true, // 单字段索引，加速查询
  },
  password: {
    type: String,
    required: [true, "密码不能为空"],
    minlength: [6, "密码至少6个字符"],
    //select: false, // 默认不返回密码字段
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

// 3.1 复合索引：查询未删除用户时加速
usersSchema.index({ username: 1, isDeleted: 1 });
// 3.2 全局查询钩子：默认过滤已删除数据
usersSchema.pre(/^find/, function () {
  this.find({ isDeleted: false });
});

// 4. 保存前使用pre("save")钩子函数自动加密密码
usersSchema.pre("save", async function () {
  const user = this;

  // 4.1 如果密码未修改，直接跳过
  if (!user.isModified("password")) {
    return;
  }

  // 4.2 如果密码被修改了，加密密码
  try {
    const hashedPassword = await bcryptjsSalted.hashPassword(user.password);
    console.log("被加密的密码：", hashedPassword);
    user.password = hashedPassword;
  } catch (error) {
    console.log("错误信息是：", error);
    throw error; // 让 Mongoose 处理错误
  }
});

// 5. 创建Model(模型)对象，对文档操作的封装对象，第一个参数表示创建的集合的名称，mongoose会自动将集合名变为复数，第二个参数表示利用的模式对象
const usersModel = mongoose.model(
  process.env.MONGODB_USERCOLLECTION,
  usersSchema,
);
console.log(
  "当前处理的数据库名为：",
  process.env.MONGODB_DBNAME,
  "数据库集合为：",
  process.env.MONGODB_USERCOLLECTION,
);
// 6. 导出DemoModel，供其他文件使用
module.exports = usersModel;

```

models/accounts.model.js为accounts数模定义：

```js
// 1.1 引入相关所有依赖包
const mongoose = require("mongoose");

// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const usersSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    trim: true,
    index: true, // 单字段索引，加速查询
  },
  type: {
    type: Number,
    enum: [-1, 1],
    required: true,
    default: -1,
  },
  account: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  remarks: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

// 3.1 复合索引：查询未删除用户时加速
usersSchema.index({ username: 1, isDeleted: 1 });
// 3.2 全局查询钩子：默认过滤已删除数据
usersSchema.pre(/^find/, function () {
  this.find({ isDeleted: false });
});

// 5. 创建Model(模型)对象，对文档操作的封装对象，第一个参数表示创建的集合的名称，mongoose会自动将集合名变为复数，第二个参数表示利用的模式对象
const usersModel = mongoose.model(
  process.env.MONGODB_ACCOUNTSCOLLECTION,
  usersSchema,
);
console.log(
  "当前处理的数据库名为：",
  process.env.MONGODB_DBNAME,
  "数据库集合为：",
  process.env.MONGODB_ACCOUNTSCOLLECTION,
);
// 6. 导出DemoModel，供其他文件使用
module.exports = usersModel;

```

services/index.service.js为数据库实际包统一注册：

```js
const usersService = require("./users.service");
const accountsService = require("./accounts.service");

module.exports = {
  usersService,
  accountsService,
};

```

services/users.service.js为user数据库实际操作：

```js
const { Users } = require("@models/index.model.js");
const pagination = require("@utils/pagination.js");

class UsersService {
  /**
   *创建用户
   * @param {Object} Object 与用户模型匹配的数据
   * @returns
   */
  async createUser(Object) {
    const users = new Users(Object);
    return await users.save();
  }

  /**
   * 根据ID查询
   * @param {string} id 数据库中id数值
   * @returns
   */
  async findById(id) {
    return await Users.findById(id);
  }

  /**
   * 条件查询单条
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @returns
   */
  async findOne(queryObject) {
    return await Users.findOne(queryObject);
  }

  /**
   * 分页列表
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @param {number} page 当前页码
   * @param {number} limit 每页展示多少条数据
   * @returns
   */
  async getUserList(queryObject, page, limit) {
    return pagination(Users, queryObject, { page, limit });
  }

  /**
   * 更新用户
   * @param {String} id 用户对应的唯一标识码id
   * @param {Object} updateObject 需要更新的内容，一般为对象类型
   * @returns
   */
  async updateById(id, updateObject) {
    return await Users.findByIdAndUpdate(id, updateObject, { new: true });
  }

  /**
   * 软删除
   * @param {String} id 用户对应的唯一标识码id
   * @returns
   */
  async deleteById(id) {
    return await Users.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }
}

module.exports = new UsersService();

```

services/accounts.service.js为accounts数据库实际操作：

```js
const { Accounts } = require("@models/index.model.js");
const pagination = require("@utils/pagination.js");

class AccountsService {
  /**
   *创建账目
   * @param {Object} Object 与用户模型匹配的数据
   * @returns
   */
  async createAccount(Object) {
    const accounts = new Accounts(Object);
    return await accounts.save();
  }

  /**
   * 根据ID查询
   * @param {string} id 数据库中id数值
   * @returns
   */
  async findById(id) {
    return await Accounts.findById(id);
  }

  /**
   * 条件查询单条
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @returns
   */
  async findOne(queryObject) {
    return await Accounts.findOne(queryObject);
  }

  /**
   * 分页列表
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @param {number} page 当前页码
   * @param {number} limit 每页展示多少条数据
   * @returns
   */
  async getAccountsList(queryObject, page, limit) {
    return pagination(Accounts, queryObject, { page, limit });
  }

  /**
   * 更新用户
   * @param {String} id 用户对应的唯一标识码id
   * @param {Object} updateObject 需要更新的内容，一般为对象类型
   * @returns
   */
  async updateById(id, updateObject) {
    return await Accounts.findByIdAndUpdate(id, updateObject, { new: true });
  }

  /**
   * 软删除
   * @param {String} id 用户对应的唯一标识码id
   * @returns
   */
  async deleteById(id) {
    return await Accounts.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }
}

module.exports = new AccountsService();

```

utils/encryptSalted.js为加盐模块：

```js
// 1. 引入依赖包
const bcrypt = require("bcryptjs");

class bcryptjsSalted {
  /**
   * 加密密码
   * @param {String} password 用户输入的需要加密的密码
   * @returns
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * 校验密码
   * @param {String} inputValue  用户输入的需要比对的密码
   * @param {String} hashValue  存储在数据库中加密的密码
   * @returns
   */
  async comparePassword(inputValue, hashValue) {
    return bcrypt.compare(inputValue, hashValue);
  }
}

module.exports = new bcryptjsSalted();

```

utils/test.bcryptjs.js为加盐测试模块：

```js
const salted = require("./encryptSalted.js");

const inputValue = "hello123";
// 数据库存的正确哈希
const hashValue1 =
  "$2b$10$CjirYW6S46LjHg2EcELebeoi3nTViVhY0G.bhP7bXVl/j.UiQxBma";
// 错误哈希
const hashValue2 = "woshibuduide";

// 1. 加密测试：同一密码每次生成不同hash
async function testEncrypt() {
  const newHash = await salted.hashPassword(inputValue);
  console.log(`原始密码：${inputValue}`);
  console.log(`本次生成哈希：${newHash}\n`);
}

// 2. 正确密码校验
async function testCompare() {
  const matchRight = await salted.comparePassword(inputValue, hashValue1);
  console.log("=== 正确密码校验 ===");
  console.log(`输入密码：${inputValue}`);
  console.log(`库中哈希：${hashValue1}`);
  console.log(`是否匹配：${matchRight}\n`);

  // 3. 错误密码校验
  const matchWrong = await salted.comparePassword("wrongpwd", hashValue1);
  console.log("=== 错误密码校验 ===");
  console.log(`输入密码：wrongpwd`);
  console.log(`库中哈希：${hashValue1}`);
  console.log(`是否匹配：${matchWrong}\n`);

  // 4. 乱码哈希直接返回false
  const invalidHash = await salted.comparePassword(inputValue, hashValue2);
  console.log("=== 非法哈希字符串校验 ===");
  console.log(`是否匹配：${invalidHash}`);
}

// 串行执行测试
(async () => {
  await testEncrypt();
  await testCompare();
})();
```

utils/pagination.js为分页模块：

```js
/**
 * mongo分页封装
 * @param {Model} model mongoose模型
 * @param {Object} query 查询条件
 * @param {Object} options {page, limit, sort, select}
 * @returns {Object} {list, total, page, limit, pages}
 */
const pagination = async (model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = "",
  } = options;
  const skip = (Number(page) - 1) * Number(limit);

  // 并行查询总数+列表，性能更优
  const [list, total] = await Promise.all([
    model.find(query).select(select).sort(sort).skip(skip).limit(Number(limit)),
    model.countDocuments(query),
  ]);

  return {
    list,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / limit),
  };
};

module.exports = pagination;

```

utils/response.js为响应模块：

```js
/**
 * 成功返回
 * @param {Object} res express响应对象
 * @param {*} data 返回数据
 * @param {string} msg 提示信息
 */
const success = (res, data = null, msg = "操作成功") => {
  return res.status(200).json({
    code: 200,
    msg,
    data,
  });
};

/**
 * 失败返回
 * @param {Object} res
 * @param {string} msg
 * @param {number} code
 */
const fail = (res, msg = "操作失败", code = 500) => {
  return res.status(code).json({
    code,
    msg,
    data: null,
  });
};

module.exports = { success, fail };

```

###### 测试程序

* 环境变量

test4Using/.env环境变量：

```env
# ============================================
# 服务器配置
# process.env.LISTEN_AREA: 用于设定是否在本地使用还是局域网内使用
# ============================================
PORT=1234
LISTEN_AREA=0.0.0.0
NODE_ENV=development
SERVER_IP=http://${LOCAL_IP}:${PORT}

# ============================================
# 局域网IP
# 自动获取的局域网IP（由 setup-env.js 自动更新）
# ============================================
LOCAL_IP=127.0.0.1

# ============================================
# MongoDB数据库配置
# 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
# require("dotenv-expand").expand(require("dotenv").config());
# ============================================
MONGODB_DBHOST=${LOCAL_IP}
MONGODB_DBPORT=27017
MONGODB_DBNAME=expressTest4Demo
MONGODB_USERCOLLECTION=users4mongov2dot1
MONGODB_ACCOUNTSCOLLECTION=accounts4mongov2dot1
MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_POOL_SIZE=10
MONGODB_TIMEOUT=3000
EXIT_ON_DB_ERROR=true

# ============================================
# JWT 配置
# JWT_EXPIRES 合法过期时间：s秒 m分 h时 d天
# ============================================
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-too
JWT_EXPIRES=2h

# ============================================
# API 配置
# ============================================
API_PREFIX=/api

# ============================================
# 文件上传配置
# ============================================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# ============================================
# CORS 配置
# ============================================
CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]
```

* 基本操作层

包含测试程序和基本用法的详细介绍和说明，test4Using/test4dbOperater4Users.js为整体测试及核心代码使用示例：

```js
// 0. 引入路径优化第三方库module-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@config/db.js");
// 1.3 引入services文件
const { usersService } = require("@services/index.service.js");

// 2. 连接数据库,采用IIFE表达式，第1个外括号内的表示是一个函数的箭头函数简写，第二个括号代码传参，是最简写形式
(async () => {
  try {
    // 2.1 尝试连接数据库
    await dbConnect();
    // 2.2 连接数据库后，对数据库进行项目操作
    dbOperate();
  } catch (error) {
    // 2.3 数据库如果连接失败做提示，并进行错误后操作
    console.log("主程序获取连接错误：" + error);
  }
})();

// 3. 进行services纯数据库操作工作
async function dbOperate() {
  // 3.1  调用创建批量用户方法
  // await createUsers();
  // 3.2  调用创建一个用户方法
  await createUser();
  // 3.3 通过id查询用户(存在和软删除中不存在的用户)
  /* {
    console.log(
    "查找已存在，且没有被删除的用户:",
    await usersService.findById("6a34c7e056a43dd97747bf6a"),
  );
  console.log(
    "查找已存在，且被删除的用户:",
    await usersService.findById("6a34c99f97e4116f5303d4dc"),
  );
  } */
  // 3.4 条件查询单条
  /* console.log(
    await usersService.findOne({
      role: "user",
    }),
  ); */
  // 3.5 分页列表
  //console.log(await usersService.getUserList({ role: "user" }, 2, 50));
  // 3.6 更新用户啊
  /* console.log(
    await usersService.updateById("6a34c7db56a43dd97747bf16", {
      loginCount: 2,
    }),
  ); */
  // 3.7 软删除
  // console.log(await usersService.deleteById("6a34c7db56a43dd97747bf16"));
}

// 创建批量用户
async function createUsers() {
  for (let index = 5; index < 256; index++) {
    const usersObject = {
      username: `test4Uers0${index}`,
      password: `test4Uers0${index}123`,
      role: "user",
      lastLogin: Date.now(),
      loginCount: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    };
    console.log(await usersService.createUser(usersObject));
  }
}

// 创建单个用户
async function createUser() {
  const userObject = {
    username: `test4Uers0321`,
    password: `test4Uers0321123`,
    role: "user",
    lastLogin: Date.now(),
    loginCount: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  };
  console.log(await usersService.createUser(userObject));
}

```

> 用于Users测试，程序包含了所有MongoDB核心功能查询语句

包含测试程序和基本用法的详细介绍和说明，test4Using/test4dbOperater4Accounts.js为整体测试及核心代码使用示例：

```js
// 0. 引入路径优化第三方库moudle-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@config/db.js");
// 1.3 引入services文件
const { accountsService } = require("@services/index.service.js");

// 2. 连接数据库,采用IIFE表达式，第1个外括号内的表示是一个函数的箭头函数简写，第二个括号代码传参，是最简写形式
(async () => {
  try {
    // 2.1 尝试连接数据库
    await dbConnect();
    // 2.2 连接数据库后，对数据库进行项目操作
    dbOperate();
  } catch (error) {
    // 2.3 数据库如果连接失败做提示，并进行错误后操作
    console.log("主程序获取连接错误：" + error);
  }
})();

// 3. 进行services纯数据库操作工作
async function dbOperate() {
  // 3.1  调用创建批量用户方法
  // await createAccounts();
  // 3.2  调用创建一个用户方法
  // await createAccount();
  // 3.3 通过id查询用户(存在和软删除中不存在的用户)
  /* {
    console.log(
      "查找已存在，且没有被删除的用户:",
      await accountsService.findById("6a3678fbedb95ed3e05fe04a"),
    );
    console.log(
      "查找已存在，且被删除的用户:",
      await accountsService.findById("6a3678fbedb95ed3e05fdfe6"),
    );
  } */
  // 3.4 条件查询单条
  /* console.log(
    await accountsService.findOne({
      remarks: "趁着暑假赚点钱买手机Iphone112",
    }),
  ); */
  // 3.5 分页列表
  // console.log(await accountsService.getAccountsList({ type: 1 }, 2, 50));
  // 3.6 更新用户啊
  /* console.log(
    await accountsService.updateById("6a3678fbedb95ed3e05fdff1", {
      remarks: "不准备买手机了，买笔记本电脑",
    }),
  ); */
  // 3.7 软删除
  // console.log(await accountsService.deleteById("6a3678fbedb95ed3e05fdff1"));
}

// 创建批量账目
async function createAccounts() {
  for (let index = 5; index < 123; index++) {
    const accountsObject = {
      item: `给培训机构Aline第${index}个分店做宣传`,
      type: 1,
      account: `13${index}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      remarks: `趁着暑假赚点钱买手机Iphone${index}`,
      isDeleted: false,
    };
    console.log(await accountsService.createAccount(accountsObject));
  }
}

// 创建单个账目
async function createAccount() {
  const accountObject = {
    item: "给培训机构做宣传",
    type: 1,
    account: 132,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    remarks: "趁着暑假赚点钱买手机",
    isDeleted: false,
  };
  console.log(await accountsService.createAccount(accountObject));
}

```

> 用于Accounts测试，程序包含了所有MongoDB核心功能查询语句

* 流程完整层

搭建express环境，并设置test4Using/app.js:

```js
// 引入路径优化第三方库moudle-alias
require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());
const express = require("express");
const cors = require("cors");
const connectDB = require("@config/db.js");
const router = require("@routes/user.route.js");
const errorHandler = require("@middleware/error.middleware.js");

// 连接数据库
connectDB();

const app = express();

// 全局中间件
app.use(cors());
app.use(express.json()); // 解析json请求体

// 挂载路由
app.use("/", router);

// 全局错误处理（必须放在所有路由之后）
app.use(errorHandler);

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务启动成功，端口：${PORT}`);
});

```

搭建express环境，并设置test4Using/routes/index.js:

```js
const express = require("express");
const router = express.Router();

const userRoute = require("./user.route");

router.use("/user", userRoute);

module.exports = router;

```

设置test4Using/routes/user.route.js:

```js
const express = require("express");
const router = express.Router();
const userCtrl = require("@controllers/users.controller.js");
const { authMiddleware, adminAuth } = require("@middleware/auth.middleware.js");

// 公开接口
router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
// 完全公开接口
router.get("/user", (req, res) => {
  //console.log(req);
  res.json({
    code: 201,
    msg: "访问测试成功",
  });
});

// 需要登录
router.get("/info", authMiddleware, userCtrl.getInfo);

// 需要管理员权限
router.get("/userslist", authMiddleware, adminAuth, userCtrl.getUserList);
router.delete("/:id", authMiddleware, adminAuth, userCtrl.deleteUser);

module.exports = router;

```

###### 测试工具

使用Apipost工具，创建如下工具测试：

* 公开接口测试
  * GET 127.0.0.1:1234/user

```js
{

  "code": 201,

  "msg": "访问测试成功"

}
```

* 登录login测试
  * POST 127.0.0.1:1234/login
  * Body-raw-json-{"username":"test4Uers","password":"test4Uers123"}

```js
{
	"code": 200,
	"msg": "登录成功",
	"data": {
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTM0ZTdkMGZlZGM2Y2FlMDVmMzFjY2UiLCJpYXQiOjE3ODE4NTUxMjAsImV4cCI6MTc4MTg2MjMyMH0.pirHIib8_44wZ_dPhemSfX5f_uNyh5d-vcOYvCsTzWs",
		"user": {
			"id": "6a34e7d0fedc6cae05f31cce",
			"username": "test4Uers",
			"role": "admin"
		}
	}
}
```

* 注册register测试

  * POST 127.0.0.1:1234/register

  * Body-raw-json-{"username":"test4Uers260","password":"test4Uers260123","role":"admin"}

```js
{
	"code": 200,
	"msg": "注册成功",
	"data": {
		"id": "6a34f350cac759397ae8eb5b",
		"username": "test4Uers260"
	}
}
```

* 需要登录测试

  * POST 127.0.0.1:1234/info

  * Header - key='Authorization',Value=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTM0ZTdkMGZlZGM2Y2FlMDVmMzFjY2UiLCJpYXQiOjE3ODE4NTMwMzIsImV4cCI6MTc4MTg2MDIzMn0.kYDACtKXxhOB7p7zZxrDg_7esc9BgNmcWrqKmaxrBIw
  * Value值必须是管理员登录使用的taken

```js
{
	"code": 200,
	"msg": "操作成功",
	"data": {
		"_id": "6a34e7d0fedc6cae05f31cce",
		"username": "test4Uers",
		"password": "$2b$10$vDXaSasWkakNMvF93Y5u9udee7/IJuLlbZAQDtcXU1bP37G.MJFlq",
		"role": "admin",
		"lastLogin": null,
		"loginCount": 0,
		"createdAt": "2026-06-19T06:55:10.652Z",
		"isDeleted": false,
		"updatedAt": "2026-06-19T06:55:13.000Z",
		"__v": 0
	}
}
```

* 管理员获取列表测试

  * POST 127.0.0.1:1234/list

  * Header - key='Authorization',Value=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTM0ZTdkMGZlZGM2Y2FlMDVmMzFjY2UiLCJpYXQiOjE3ODE4NTMwMzIsImV4cCI6MTc4MTg2MDIzMn0.kYDACtKXxhOB7p7zZxrDg_7esc9BgNmcWrqKmaxrBIw
  * Value值必须是管理员登录使用的taken

```js
{
	"code": 200,
	"msg": "操作成功",
	"data": {
		"list": [
			{
				"_id": "6a34f350cac759397ae8eb5b",
				"username": "test4Uers260",
				"password": "$2b$10$lA3zgHbkkmTvpPZ..j2kMewzsh0/wxqUzWQ0jmWg37Vi6YEVvfuxm",
				"role": "user",
				"lastLogin": null,
				"loginCount": 0,
				"createdAt": "2026-06-19T07:26:56.041Z",
				"isDeleted": false,
				"updatedAt": "2026-06-19T07:44:16.821Z",
				"__v": 0
			},
			{
				"_id": "6a34e7d0fedc6cae05f31cce",
				"username": "test4Uers",
				"password": "$2b$10$vDXaSasWkakNMvF93Y5u9udee7/IJuLlbZAQDtcXU1bP37G.MJFlq",
				"role": "admin",
				"lastLogin": null,
				"loginCount": 0,
				"createdAt": "2026-06-19T06:55:10.652Z",
				"isDeleted": false,
				"updatedAt": "2026-06-19T06:55:13.000Z",
				"__v": 0
			},...
```

