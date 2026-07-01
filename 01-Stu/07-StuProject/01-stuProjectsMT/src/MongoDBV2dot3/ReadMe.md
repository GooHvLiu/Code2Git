##### MongoDB-V2.3_02

###### 版本描述

* <span style="color:#aaaaaa;font-weight:normal;font-family:'楷体">V2.0版本说明文档，详细介绍MongoDB数据库最新文件架构及数据库操作使用教程。</span>
* <span style="color:#aaaaaa;font-weight:normal;font-family:'楷体">2.1版本在2.0版本的基础上，增加了一个新的数据模型，并共同在项目中使用。</span>
* <span style="color:#aaaaaa;font-weight:normal;font-family:'楷体">2.2_02版本在2.1版本的基础上，增加了鉴权和优化了部分代码BUG，并共同在项目中使用。</span>
* <span style="color:#aaaaaa;font-weight:normal;font-family:'楷体">2.2_03版本在2.2_02版本的基础上，增加了测试工具并优化了部分代码，并共同在项目中使用。</span>
* <span style="color:#aaaaaa;font-weight:normal;font-family:'楷体">2.2_04版本在2.2_03版本的基础上，增加了用户名/密码/邮箱的基础检验和最终校验，并共同在项目中使用。</span>
* <span style="color:#aaaaaa;font-weight:normal;font-family:'楷体">2.3_01版本在2.2_04版本的基础上，增加了项目管理模型，并新增原生 spawn使用，用于管理子项目的运行，采用Lock 文件识别子项目状态，并共同在项目中使用。</span>
* <span style="color:#black;font-weight:normal;font-family:'楷体">2.3_02版本在2.3_01版本的基础上，增加了子项目开启所需要的功能模块，核心模块没有任何变化。</span>

###### 文件架构

```文本
MongoDB-V2.1
 ┣ controllers/                               # 业务控制器（处理请求、组装返回）
 ┃ ┗ user.controller.js                       # 处理users请求、组装返回
 ┃ ┗ accounts.controller.js                   # 处理accounts请求、组装返回
 ┃ ┗ projects.controller.js                   # 处理projects请求、组装返回
 ┣ config/                                    # 全局配置
 ┃ ┗ db.js                                    # MongoDB 连接配置
 ┣ models/                                    # 数据模型 Schema（核心）
 ┃ ┣ index.model.js                           # 模型统一注册
 ┃ ┗ users.model.js                           # users模型定义配置
 ┃ ┗ accounts.model.js                        # accounts模型定义配置
 ┃ ┗ projects.model.js                        # projects模型定义配置
 ┣ services/                                  # 数据服务层（纯数据库操作，抽离复用）
 ┃   ┣ projects/                              # 与projects相关的services支持包
 ┃      ┗ projectOperate.service.js           # 子项目启停业务操作服务类
 ┃      ┗ subProcess.service.js               # 子进程管理核心服务类
 ┃ ┗ index.service.js                         # 模型统一注册
 ┃ ┗ user.service.js                          # users模型 数据库操作
 ┃ ┗ accounts.service.js                      # accounts模型 数据库操作
 ┃ ┗ projects.service.js                      # projects模型 数据库操作
 ┣ middleware/                                # 全局中间件
 ┃ ┗ validate.middleware.js                   # 参数校验
 ┣ utils/                                     # 通用工具
 ┃   ┣ projects/                              # 与projects相关的通用工具包
 ┃      ┗ env.util.js                         # PID锁文件工具集
 ┃      ┗ lock.util.js                        # 子进程管理核心服务类
 ┃      ┗ log.parser.util.js                  # 解析子项目启动单行日志，提取可访问地址
 ┃ ┣ encryptSalted.js                         # 密码加密
 ┃ ┗ test.bcryptjs.js                         # 密码加密测试工具
 ┃ ┗ pagination.js                            # 分页封装
 ┃ ┗ response.js                              # 统一返回格式
 ┣ test4Using/                                # 测试工具
 ┃ ┣ test4Controllers.ReqResModule.js         # 测试Controllers使用的模拟req和res模块
 ┃ ┣ test4ControllersOperater4Accounts.js     # 测试Controllers-Accounts模块
 ┃ ┣ test4ControllersOperater4Users.js        # 测试Controllers-Users模块
 ┃ ┣ test4ServicesOperater4Accounts.js        # 测试Services-Accounts模块
 ┃ ┣ test4ServicesOperater4Users.js           # 测试Services-Users模块
 ┃ ┣ test4ControllersOperater4Projects.js     # 测试Controller-Projects模块
 ┃ ┗ app.js                                   # 内部搭建了express模块，可以根据需求进行使用
 ┣ .env                                       # 环境变量（git忽略）
 ┣ .env.example                               # 环境变量（git忽略）
 ┣ ReadMe.md                                  # 使用手册
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

controllers/index.controller.js负责整体导入：

```js
const usersController = require("./users.controller.js");
const accountsController = require("./accounts.controller.js");
const projectsController = require("./projects.controller.js");

module.exports = {
  usersController,
  accountsController,
  projectsController,
};

```

controllers/users.controller.js负责请求响应：

```js
const jwt = require("jsonwebtoken");
const { success, fail } = require("@MongoDB/utils/response.js");
const { usersService } = require("@MongoDB/services/index.service.js");
const { comparePassword } = require("@MongoDB/utils/encryptSalted.js");
const {
  PWD_MIN_LENGTH,
  validateUsername,
  validateEmail,
  validatePwdLength,
} = require("@MongoDB/middleware/validate.middleware.js");

class UserController {
  // 【API接口用】注册用户,返回JSON给前端ajax
  async register(req, res) {
    try {
      let { username, email, password } = req.body;
      // 前置轻校验（优化体验，快速返回）
      if (!validateUsername(username)) return fail(res, "用户名格式错误");
      if (!validateEmail(email)) return fail(res, "邮箱格式错误");
      if (!validatePwdLength(password))
        return fail(res, `密码至少${PWD_MIN_LENGTH}位`);
      // $or: [{ username }, { role }]
      const exist = await usersService.findOne({
        $or: [{ username }, { email }],
      });
      if (exist) return fail(res, "用户名已存在");
      const user = await usersService.createUser({
        username,
        password,
        email,
      });
      return success(
        res,
        { id: user._id, username: user.username, email: user.email },
        "注册成功",
      );
    } catch (err) {
      return fail(res, err);
    }
  }
  // 【页面模板渲染专用】注册用户,仅校验重复，返回用户对象，不返回JSON
  async registerData(req) {
    try {
      let { username, email, password } = req.body;
      // 前置轻校验（优化体验，快速返回）
      if (!validateUsername(username)) return fail(res, "用户名格式错误");
      if (!validateEmail(email)) return fail(res, "邮箱格式错误");
      if (!validatePwdLength(password))
        return fail(res, `密码至少${PWD_MIN_LENGTH}位`);
      // $or: [{ username }, { email }]
      const exist = await usersService.findOne({
        $or: [{ username }, { email }],
      });
      if (exist)
        return {
          type: 0,
          msg: "用户名已存在",
        };
      const user = await usersService.createUser({
        username,
        password,
        email,
      });
      return {
        type: 1,
        msg: "创建成功",
        user: { id: user._id, username: user.username, email: user.email },
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "创建失败，请检查填写数据",
        error: err,
      };
    }
  }
  // 【API接口用】登录用户,生成token,返回JSON给前端ajax
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await usersService.findOne({ username });
      if (!user) return fail(res, "账号不存在");
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) return fail(res, "密码错误");

      // 生成token
      const token = jwt.sign(
        { userId: user._id, tokenVersion: user.tokenVersion },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES || "2h",
        },
      );
      return success(res, token, "登录成功");
    } catch (err) {
      console.log("err:", err);

      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】登录用户,校验账号密码，返回session信息
  async loginData(req) {
    try {
      const { username, password } = req.body;
      const user = await usersService.findOne({ username });

      if (!user)
        return {
          type: -1,
          msg: "账号不存在",
          error: "账号不存在",
        };
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch)
        return {
          type: -1,
          msg: "密码错误",
          error: "密码错误",
        };
      // 登录刷新session，生成全新sessionId（安全规范）
      await new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) reject(err);
          resolve();
        });
      });
      // 生成session,写入session的主要目的就是为了让浏览器具备这个参数，以后访问的时候携带者这些数据
      req.session.userId = user._id;
      req.session.username = user.username;
      req.session.role = user.role;

      return {
        type: 1,
        msg: "登录成功",
        session: req.session,
        user: { id: user._id, username: user.username, role: user.role },
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "登录失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【API接口用】登出用户,token方案（废弃所有当前用户Token）
  async logout(req, res) {
    try {
      // 1. 取出请求头 Bearer Token，读取统一配置
      const headerKey = process.env.JWT_AUTH_HEADER_KEY || "authorization";
      const prefix = process.env.JWT_AUTH_PREFIX || "Bearer ";
      const authHeader = req.headers[headerKey];
      if (!authHeader || !authHeader.startsWith(prefix)) {
        throw new Error("未携带有效登录凭证，请重新登录");
      }
      const token = authHeader.slice("Bearer ".length).trim();

      // 2. 解析Token拿到用户ID与签发时的版本号
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = payload;

      // 3. 用户tokenVersion自增1，该用户所有旧Token全部失效
      await usersService.updateById(userId, {
        $inc: { tokenVersion: 1 },
      });

      // 4. 返回成功信息
      return success(res, null, "登出成功，登录凭证已失效");
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】登出用户,注销session数据
  async logoutData(req) {
    try {
      const result = await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) reject(err);
          resolve({
            type: 1,
            msg: "session已销毁",
            data: null,
          });
        });
      });
      return result;
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "session销毁异常",
        error: err,
      };
    }
  }

  // 【API接口用】获取用户列表（管理员）,返回JSON给前端ajax
  async getUserList(req, res) {
    try {
      const { page = 1, limit = 10, username } = req.query;
      const query = {};
      if (username) query.username = new RegExp(username, "i");
      const data = await usersService.getUserList(query, page, limit);
      return success(res, data);
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】获取用户列表（管理员）,分页原始数据
  async getUserListData(req) {
    try {
      const { page = 1, limit = 10, username } = req.query;
      const query = {};
      if (username) query.username = new RegExp(username, "i");
      const data = await usersService.getUserList(query, page, limit);
      return {
        type: 1,
        msg: "获取账单列表成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "获取账单列表失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【API接口用】获取当前登录用户信息,返回JSON给前端ajax
  async getInfo(req, res) {
    return success(res, req.user);
  }

  // 【页面模板渲染专用】个人中心页面：当前登录用户数据
  async getInfoData(req) {
    return {
      type: 1,
      msg: "获取成功",
      data: req.user,
    };
  }

  // 【API接口用】删除用户（软删）,返回JSON给前端ajax
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await usersService.deleteById(id);
      return success(res, null, "删除成功");
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】删除用户（软删）,仅执行删除逻辑，返回提示文本
  async deleteUserData(req) {
    try {
      const { id } = req.params;
      const data = await usersService.deleteById(id);
      return {
        type: 1,
        msg: "删除成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "删除创建失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【页面模板渲染专用】创建用户信息,返回结果
  async createUserData(Object) {
    try {
      const data = await usersService.createUser(Object);
      return {
        type: 1,
        msg: "创建成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "账目创建失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【页面模板渲染专用】通过ID查找用户信息,返回结果
  async findByIdData(Object) {
    try {
      const data = await usersService.findById(Object);
      return {
        type: 1,
        msg: "查找成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "没有找到对应的用户信息",
        error: err,
      };
    }
  }

  // 【页面模板渲染专用】条件查询单条,返回结果
  async findOneData(Object) {
    try {
      const data = await usersService.findOne(Object);
      return {
        type: 1,
        msg: "查找成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "没有找到对应的用户信息",
        error: err,
      };
    }
  }
}

module.exports = new UserController();

```

controllers/accounts.controller.js负责请求响应：

```js
const { success, fail } = require("@MongoDB/utils/response.js");
const { accountsService } = require("@MongoDB/services/index.service.js");

class AccountsController {
  // 【API接口用】获取所有账单列表（管理员）,返回JSON给前端ajax
  async getAccountsList(req, res) {
    try {
      const { page = 1, limit = 10, username } = req.query;
      const query = {};
      //下面是为了匹配有管理员的前提下
      // if (username) query.username = new RegExp(username, "i");
      const accountsListData = await accountsService.getAccountsList(
        query,
        page,
        limit,
      );
      return success(res, accountsListData);
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】获取所有账单列表（管理员）,只返回分页数据，不操作res
  async getAccountsListData(req) {
    try {
      const { page = 1, limit = 10, username } = req.query;

      const query = {};
      //下面是为了匹配有管理员的前提下
      // if (username) query.username = new RegExp(username, "i");
      const data = await accountsService.getAccountsList(query, page, limit);

      return {
        type: 1,
        msg: "获取账单列表成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "获取账单列表失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【API接口用】创建单一账目信息,返回JSON给前端ajax
  async createAccount(req, res) {
    try {
      const createAccountData = await accountsService.createAccount(req.body);
      return success(res, createAccountData, "创建成功");
    } catch (err) {
      return fail(res, err);
    }
  }
  // 【页面模板渲染专用】创建唯一账目信息,返回结果
  async createAccountData(Object) {
    try {
      const data = await accountsService.createAccount(Object);
      return {
        type: 1,
        msg: "创建成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "账目创建失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【API接口用】删除单一账目（软删）,返回JSON给前端ajax
  async deleteAccount(req, res) {
    try {
      const { id } = req.params;
      const deleteAccountData = await accountsService.deleteById(id);
      return success(res, deleteAccountData, "删除成功");
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】删除唯一账目（软删）,只处理，返回处理结果通知
  async deleteAccountData(req) {
    try {
      const { id } = req.params;
      const data = await accountsService.deleteById(id);
      return {
        type: 1,
        msg: "删除成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "删除账目失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【API接口用】根据ID查询,返回JSON给前端ajax
  async getOneAccountById(req, res) {
    try {
      const getOneAccountData = await accountsService.findById(req.params.id);
      return success(res, getOneAccountData, "查找成功");
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】根据ID查询,返回结果
  async getOneAccountByIdData(id) {
    try {
      const data = await accountsService.findById(id);
      return {
        type: 1,
        msg: "查询成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "根据ID查找失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【API接口用】更新单一账目，返回JSON给前端ajax
  async updateAccountById(req, res) {
    try {
      const { id } = req.params;
      const updateAccountData = await accountsService.updateById(id, req.body);
      return success(res, updateAccountData, "更新成功");
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】更新唯一账目
  async updateAccountByIdData(id, updateObject) {
    try {
      const data = await accountsService.updateById(id, updateObject);
      return {
        type: 1,
        msg: "更新成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "更新账目失败，请检查填写数据",
        error: err,
      };
    }
  }
}

module.exports = new AccountsController();

```

controllers/projects.controller.js负责请求响应：

```js
const { success, fail } = require("@MongoDB/utils/response.js");
const { projectsService } = require("@MongoDB/services/index.service.js");
const { isProcessRunning } = require("@MongoDB/utils/projects/lock.util.js");
class ProjectsController {
  // 私有：读取锁文件判断运行状态（仅数据库同步状态使用）
  async #getProjectRunStatus(project) {
    return await isProcessRunning(project);
  }
  // 【标准数据库接口】分页/全量查询所有项目，同步运行状态
  async getProjectsList(req, res) {
    try {
      const projectsListData = await projectsService.findAll();
      for (const item of projectsListData) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const running = await this.#getProjectRunStatus(item);
        item.status = running ? "active" : "stopped";
        await item.save();
      }
      return success(res, projectsListData, "获取项目列表成功");
    } catch (err) {
      console.error("获取项目列表异常", err);
      return fail(res, err.message);
    }
  }

  // 【标准数据库接口】EJS页面渲染专用查询数据
  async getProjectsListData(req) {
    try {
      const projectsListData = await projectsService.findAll({});
      for (const item of projectsListData) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const running = await this.#getProjectRunStatus(item);
        item.status = running ? "active" : "stopped";
        await item.save();
      }
      return {
        type: 1,
        msg: "获取项目列表成功",
        data: projectsListData,
      };
    } catch (err) {
      console.error("页面列表查询异常", err);
      return {
        type: -1,
        msg: err.message || "获取项目列表失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【标准数据库接口】新建项目（仅入库，不启动进程）
  async createProjects(req, res) {
    try {
      const createProjectsData = await projectsService.createProject(req.body);
      return success(res, createProjectsData, "创建成功");
    } catch (err) {
      console.error("创建项目异常", err);
      return fail(res, err.message);
    }
  }

  // 【标准内部方法】给页面渲染调用，纯数据库创建
  async createProjectsData(Object) {
    try {
      const data = await projectsService.createProject(Object);
      return {
        type: 1,
        msg: "创建成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "项目创建失败，请检查填写数据",
        error: err,
      };
    }
  }
}

module.exports = new ProjectsController();

```

middleware/validate.middleware.js为验证中间件，定义：

```js
/**
 * 全局通用字段校验规则
 * 用户名、邮箱、密码、手机号统一正则/长度规范
 */

// 局部常量（优先内部使用，避免this问题）.USERNAME_REG可导出做Mongoose校验
const USERNAME_REG = /^[A-Za-z0-9]{4,16}$/;
const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 16;

// 邮箱标准正则
const EMAIL_REG = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// 密码：至少6位，支持字母数字符号（可按需强化复杂度）
const PWD_MIN_LENGTH = 6;
const PWD_MAX_LENGTH = 32;
// 强密码：大小写+数字 同时存在
const STRONG_PWD_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/;

/**
 * 校验用户名
 * @param {string} username
 * @returns {Boolean}
 */
exports.validateUsername = function (username) {
  if (!username || typeof username !== "string") return false;
  const trim = username.trim();
  if (trim.length < USERNAME_MIN_LENGTH || trim.length > USERNAME_MAX_LENGTH)
    return false;
  return USERNAME_REG.test(trim);
};

/**
 * 校验邮箱（选填，空/空白串直接放行）
 * @param {string} email
 * @returns {Boolean}
 */
exports.validateEmail = function (email) {
  if (!email) return true;
  const trim = email.trim();
  if (trim === "") return true;
  return EMAIL_REG.test(trim);
};

/**
 * 仅校验密码长度
 * @param {string} pwd
 * @returns {Boolean}
 */
exports.validatePwdLength = function (pwd) {
  if (!pwd || typeof pwd !== "string") return false;
  const trim = pwd.trim();
  return trim.length >= PWD_MIN_LENGTH && trim.length <= PWD_MAX_LENGTH;
};

/**
 * 校验强密码：长度合规 + 包含大小写字母+数字
 * @param {string} pwd
 * @returns {Boolean}
 */
exports.validateStrongPwd = function (pwd) {
  // 先校验基础长度
  if (!exports.validatePwdLength(pwd)) return false;
  const trim = pwd.trim();
  // 使用强密码正则匹配
  return STRONG_PWD_REG.test(trim);
};

// 统一对外导出常量，其他地方可单独使用正则
exports.USERNAME_REG = USERNAME_REG;
exports.USERNAME_MIN_LENGTH = USERNAME_MIN_LENGTH;
exports.USERNAME_MAX_LENGTH = USERNAME_MAX_LENGTH;
exports.EMAIL_REG = EMAIL_REG;
exports.PWD_MIN_LENGTH = PWD_MIN_LENGTH;
exports.PWD_MAX_LENGTH = PWD_MAX_LENGTH;
exports.STRONG_PWD_REG = STRONG_PWD_REG;

//如何使用？
/* // 导入校验工具，直接调用封装好的校验函数（推荐，业务层通用）
const { validateStrongPwd } = require("@MongoDB/utils/validators");
const inputPwd = "Abc123456";
if (!validateStrongPwd(inputPwd)) {
  return { code: 400, msg: "密码必须包含大小写字母和数字，长度6-32位" };
} */

/* //单独引入 STRONG_PWD_REG 正则，自定义逻辑校验
const {
  STRONG_PWD_REG,
  validatePwdLength,
} = require("@MongoDB/utils/validators");

const pwd = "123456Aa";
// 先判断长度
if (validatePwdLength(pwd)) {
  // 单独使用强密码正则
  const isStrong = STRONG_PWD_REG.test(pwd.trim());
  console.log("是否强密码：", isStrong);
} */

/* //结合注册 / 创建账号接口实战示例（你的 createAccount）
const {
  validateStrongPwd,
  validateUsername,
  validateEmail,
} = require("@MongoDB/utils/validators");

async function register(reqBody) {
  const { username, email, password } = reqBody;

  // 1. 用户名校验
  if (!validateUsername(username)) {
    return { code: 400, msg: "用户名4-16位，仅支持字母数字" };
  }

  // 2. 邮箱校验
  if (!validateEmail(email)) {
    return { code: 400, msg: "邮箱格式错误" };
  }

  // 3. 强密码校验
  if (!validateStrongPwd(password)) {
    return { code: 400, msg: "密码长度6-32位，必须包含大写、小写、数字" };
  }

  // 校验全部通过，创建用户
}
 */

```

models/index.model.js为注册model定义：

```js
const Users = require("./users.model.js");
// const Accounts = require("./accounts.model.model.js");
const Projects = require("./projects.model.js");

module.exports = {
  Users,
  Projects,
  // Accounts,
};

```

models/users.model.js为users数模定义：

```js
// 1.1 引入相关所有依赖包
const mongoose = require("mongoose");
// 1.2 引入加密包
const bcryptjsSalted = require("@MongoDB/utils/encryptSalted.js");
// 1.3 引入验证包
const {
  USERNAME_REG,
  EMAIL_REG,
  PWD_MIN_LENGTH,
  PWD_MAX_LENGTH,
} = require("@MongoDB/middleware/validate.middleware.js");

// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "用户名不能为空"],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return USERNAME_REG.test(v);
      },
      message: "用户名必须4-16位，仅允许字母、数字",
    },
    index: true, // 单字段索引，加速查询
  },
  password: {
    type: String,
    required: [true, "密码不能为空"],
    minlength: [PWD_MIN_LENGTH, `密码最少${PWD_MIN_LENGTH}位`],
    maxlength: [PWD_MAX_LENGTH, `密码最大${PWD_MAX_LENGTH}位`],
  },
  email: {
    type: String,
    //required: [true, "邮箱不能为空"],  按需：如果邮箱可选删掉这一行
    unique: true,
    trim: true,
    lowercase: true, // 自动转小写，避免 Aa@163.com 和 aa@163.com 判定为两个邮箱
    validate: {
      validator: function (v) {
        if (!v) return true;
        return EMAIL_REG.test(v);
      },
      message: "邮箱格式不合法",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
usersSchema.index({ email: 1, isDeleted: 1 });
// 3.2 全局查询钩子：默认过滤已删除数据
usersSchema.pre(/^find/, function () {
  this.find({ isDeleted: false });
});

/** 
 * 4.1 全局预处理，所有写入前pre("validate")自动清洗字段
 * 4.2 保存前使用pre("save")钩子函数自动加密密码
 * 查询所有，包含已删除用户（管理后台专用）
    const allUsers = await usersModel.find({}, null, { skipMiddleware: true });
 * 根据ID查已删除用户
    const delUser = await usersModel.findById(id, null, { skipMiddleware: true }); 
 */
usersSchema.pre("validate", async function () {
  if (this.username) this.username = this.username.trim();
  if (this.email) this.email = this.email.trim();
  if (this.password) this.password = this.password.trim();
});
usersSchema.pre("save", async function () {
  const user = this;

  // 4.1 如果密码未修改，直接跳过
  if (!user.isModified("password")) {
    return;
  }

  // 4.2 如果密码被修改了，加密密码
  try {
    const hashedPassword = await bcryptjsSalted.hashPassword(user.password);
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
const accountsSchema = new mongoose.Schema({
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
accountsSchema.index({ username: 1, isDeleted: 1 });
// 3.2 全局查询钩子：默认过滤已删除数据
accountsSchema.pre(/^find/, function () {
  this.find({ isDeleted: false });
});

// 5. 创建Model(模型)对象，对文档操作的封装对象，第一个参数表示创建的集合的名称，mongoose会自动将集合名变为复数，第二个参数表示利用的模式对象
const accountsModel = mongoose.model(
  process.env.MONGODB_ACCOUNTSCOLLECTION,
  accountsSchema,
);
console.log(
  "当前处理的数据库名为：",
  process.env.MONGODB_DBNAME,
  "数据库集合为：",
  process.env.MONGODB_ACCOUNTSCOLLECTION,
);
// 6. 导出DemoModel，供其他文件使用
module.exports = accountsModel;

```

models/projects.model.js为projects数模定义：

```js
// 1.1 引入相关所有依赖包
const mongoose = require("mongoose");

// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const projectsSchema = new mongoose.Schema(
  {
    /**
     * 项目基础信息
     */
    title: { type: String, required: true, trim: true },
    icon: { type: String, default: "fas fa-cube" },
    description: { type: String, trim: true },
    tech: [{ type: String }],
    route: { type: String, unique: true }, // 前端访问路由
    bindIp: { type: String, default: "" },
    bindPort: { type: String, default: "" },

    /**
     * 进程启动核心配置
     */
    // 项目根目录绝对路径
    workDir: { type: String, required: true },
    // 启动命令 npm start / node app.js
    startCmd: { type: String, required: true },
    // 项目占用端口
    port: { type: Number },
    // pm2进程唯一标识
    pm2Name: { type: String, unique: true },

    /**
     * 运行状态
     */
    status: {
      type: String,
      enum: ["active", "development", "testing", "stopped"],
      default: "stopped",
    },

    /**
     * 日志路径
     */
    logOutPath: String,
    logErrPath: String,
    accessCount: { type: Number, default: 0 },

    //软删除
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

// 3.1 全局查询钩子：默认过滤已删除数据
projectsSchema.pre(/^find/, function () {
  this.find({ isDeleted: false });
});

// 4. 创建Model(模型)对象，对文档操作的封装对象，第一个参数表示创建的集合的名称，mongoose会自动将集合名变为复数，第二个参数表示利用的模式对象
const projectsModel = mongoose.model(
  process.env.MONGODB_PROJECTCOLLECTION,
  projectsSchema,
);
console.log(
  "当前处理的数据库名为：",
  process.env.MONGODB_DBNAME,
  "数据库集合为：",
  process.env.MONGODB_PROJECTCOLLECTION,
);
// 5. 导出DemoModel，供其他文件使用
module.exports = projectsModel;

```

services/index.service.js为数据库实际包统一注册：

```js
const usersService = require("./users.service.js");
const accountsService = require("./accounts.service.js");
const projectsService = require("./projects.service.js");

module.exports = {
  usersService,
  accountsService,
  projectsService,
};

```

services/users.service.js为user数据库实际操作：

```js
const { Users } = require("@MongoDB/models/index.model.js");
const pagination = require("@MongoDB/utils/pagination.js");

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
    return await Users.findByIdAndUpdate(id, updateObject, {
      new: true,
      runValidators: true,
    });
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
      { new: true, runValidators: true },
    );
  }
}

module.exports = new UsersService();

```

services/accounts.service.js为accounts数据库实际操作：

```js
const { Accounts } = require("@MongoDB/models/index.model.js");
const pagination = require("@MongoDB/utils/pagination.js");

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
   * 更新账目
   * @param {String} id 用户对应的唯一标识码id
   * @param {Object} updateObject 需要更新的内容，一般为对象类型
   * @returns
   */
  async updateById(id, updateObject) {
    return await Accounts.findByIdAndUpdate(id, updateObject, {
      returnDocument: "after",
    });
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
      { returnDocument: "after" },
    );
  }
}

module.exports = new AccountsService();

```

services/projects.service.js为projects数据库实际操作：

```js
const { Projects } = require("@MongoDB/models/index.model.js");
const pagination = require("@MongoDB/utils/pagination.js");

class ProjectsService {
  /**
   *创建项目
   * @param {Object} Object 与项目模型匹配的数据
   * @returns
   */
  async createProject(Object) {
    const projects = new Projects(Object);
    return await projects.save();
  }

  /**
   * 根据ID查询
   * @param {string} id 数据库中id数值
   * @returns
   */
  async findById(id) {
    return await Projects.findById(id);
  }

  /**
   * 条件查询单条
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @returns
   */
  async findOne(queryObject) {
    return await Projects.findOne(queryObject);
  }

  /**
   * 查询全部项目
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @returns
   */
  async findAll(queryObject) {
    return await Projects.find(queryObject).sort({ createdAt: -1 });
  }

  /**
   * 分页列表
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @param {number} page 当前页码
   * @param {number} limit 每页展示多少条数据
   * @returns
   */
  async getProjectsList(queryObject, page, limit) {
    return pagination(Projects, queryObject, { page, limit });
  }

  /**
   * 更新账目
   * @param {String} id 项目对应的唯一标识码id
   * @param {Object} updateObject 需要更新的内容，一般为对象类型
   * @returns
   */
  async updateById(id, updateObject) {
    return await Projects.findByIdAndUpdate(id, updateObject, {
      returnDocument: "after",
    });
  }

  /**
   * 软删除
   * @param {String} id 用户对应的唯一标识码id
   * @returns
   */
  async deleteById(id) {
    return await Projects.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { returnDocument: "after" },
    );
  }
}

module.exports = new ProjectsService();

```

services/projects/projectOperate.service.js为项目启停业务操作服务类：

```js
/**
 * 项目启停业务操作服务类
 * 分层：路由层仅分发请求，所有启停、重启业务逻辑统一封装在此
 * 依赖：数据库服务、子进程管理服务、环境隔离工具、PID锁文件工具
 * 对外提供三个核心方法：startProject / stopProject / restartProject
 */
const { success, fail } = require("@MongoDB/utils/response.js");
const { projectsService } = require("@MongoDB/services/index.service.js");
const {
  subProcessService,
} = require("@MongoDB/services/projects/subProcess.service.js");
const { getIsolatedChildEnv } = require("@MongoDB/utils/projects/env.util.js");
const {
  writeLock,
  removeLock,
  isProcessRunning,
  killPid,
} = require("@MongoDB/utils/projects/lock.util.js");
const fs = require("fs");
const path = require("path");

class ProjectOperateService {
  /**
   * 启动项目业务逻辑
   * @param {import("express").Request} req Express请求对象
   * @param {import("express").Response} res Express响应对象
   * @returns {Promise<any>} 统一封装成功/失败响应
   */
  async startProject(req, res) {
    try {
      const { id } = req.params;
      const project = await projectsService.findById(id);
      if (!project) return fail(res, "项目不存在");
      if (await isProcessRunning(project)) return fail(res, "项目已在运行");

      const rawCmd = project.startCmd.trim();
      if (!rawCmd) return fail(res, "项目启动命令不能为空");
      const cmdArr = rawCmd.split(/\s+/).filter((s) => s.trim());

      const env = getIsolatedChildEnv();
      const lockPath = path.join(project.workDir, ".running.lock");
      const spawnResult = subProcessService.spawn(
        id,
        project.workDir,
        cmdArr,
        env,
      );
      if (!spawnResult.success) return fail(res, "进程启动失败");
      writeLock(lockPath, spawnResult.pid);

      await new Promise((r) => setTimeout(r, 50));
      const alive = await isProcessRunning(project);
      if (!alive) {
        removeLock(lockPath);
        return fail(res, "项目启动后自动退出，请查看控制台日志修复代码");
      }
      project.status = "active";
      await project.save();
      return success(res, null, "项目启动成功");
    } catch (err) {
      console.error("启动项目接口异常", err);
      return fail(res, `启动失败：${err.message}`);
    }
  }

  /**
   * 停止项目业务逻辑
   * @param {import("express").Request} req Express请求对象
   * @param {import("express").Response} res Express响应对象
   * @returns {Promise<any>} 统一封装成功/失败响应
   */
  async stopProject(req, res) {
    try {
      const { id } = req.params;
      const project = await projectsService.findById(id);
      if (!project) return fail(res, "项目不存在");
      const lockPath = path.join(project.workDir, ".running.lock");
      if (!fs.existsSync(lockPath)) return fail(res, "项目未运行");

      subProcessService.kill(id);
      const pid = fs.readFileSync(lockPath, "utf8").trim();
      try {
        killPid(pid);
      } catch (cmdErr) {
        // 拦截Windows taskkill原生报错，替换友好提示
        console.warn("进程已自动结束，无需重复杀死", cmdErr.message);
      }
      removeLock(lockPath);
      project.status = "stopped";
      await project.save();
      return success(res, null, "项目已停止，3秒后自动刷新页面同步状态");
    } catch (err) {
      console.error("停止项目异常", err);
      return fail(res, `停止失败：${err.message}`);
    }
  }

  /**
   * 重启项目业务逻辑
   * 逻辑：先停止原有进程 → 等待800ms缓冲 → 复用startProject方法重新启动
   * @param {import("express").Request} req Express请求对象
   * @param {import("express").Response} res Express响应对象
   * @returns {Promise<any>} 统一封装成功/失败响应
   */
  async restartProject(req, res) {
    try {
      const { id } = req.params;
      const project = await projectsService.findById(id);
      if (!project) return fail(res, "项目不存在");

      // 先停止
      const lockPath = path.join(project.workDir, ".running.lock");
      if (fs.existsSync(lockPath)) {
        const pid = fs.readFileSync(lockPath, "utf8").trim();
        killPid(pid);
        removeLock(lockPath);
      }
      subProcessService.kill(id);
      await new Promise((r) => setTimeout(r, 800));

      // 复用自身启动方法，不再操作路由堆栈
      return await this.startProject(req, res);
    } catch (err) {
      console.error("重启项目异常", err);
      return fail(res, err.message);
    }
  }
}

module.exports = new ProjectOperateService();

```

services/projects/subProcess.service.js为子进程管理核心服务类：

```js
const { execa } = require("execa");
const EventEmitter = require("events");
const {
  parseNetworkUrl,
} = require("@MongoDB/utils/projects/log.parser.util.js");
const { projectsService } = require("@MongoDB/services/index.service.js");
/**
 * 子进程管理核心服务类
 * 基于execa实现Windows下Node子项目启停、日志监听、进程生命周期管理
 * 继承EventEmitter提供事件分发：logLine/error/close
 */
class SubProcessService extends EventEmitter {
  /**
   * 运行中进程缓存 Map<projectId, execa实例>
   * 用于判断项目是否正在运行、存储进程句柄用于销毁
   * @type {Map<string, import("execa").ExecaChildProcess>}
   */
  #runningMap = new Map();

  /**
   * 日志分片缓冲区，解决chunk分段输出导致单行日志被拆分问题
   * Map<projectId, string> 存储未完成换行的残留日志片段
   * @type {Map<string, string>}
   */
  #lineBufferMap = new Map();

  constructor() {
    // 父类EventEmitter构造器必须优先执行
    super();
    // 全局兜底捕获error事件，防止子进程异常导致主服务崩溃
    this.on("error", () => {});

    /**
     * 监听日志行事件，自动解析局域网地址并更新数据库
     * @param {Object} params
     * @param {string} params.projectId 项目数据库ID
     * @param {string} params.line 单行完整日志文本
     */
    this.on("logLine", async ({ projectId, line }) => {
      const addr = parseNetworkUrl(line);
      if (!addr) return;
      const { ip, port } = addr;
      const project = await projectsService.findById(projectId);
      if (!project) return;
      if (project.bindIp === ip && String(project.bindPort) === port) return;
      project.bindIp = ip;
      project.bindPort = Number(port);
      await project.save();
      console.log(
        `【子进程自动更新地址】${project.title} => http://${ip}:${port}`,
      );
    });
  }

  /**
   * 创建并启动子进程
   * @param {string} projectId 项目数据库唯一ID
   * @param {string} cwd 子项目工作目录（根路径）
   * @param {string[]} cmdArr 启动命令拆分数组，如["node", "./bin/www"]
   * @param {Object} env 隔离后的纯净环境变量对象
   * @returns {{success: boolean, pid?: number}} 启动结果+进程PID
   */
  spawn(projectId, cwd, cmdArr, env) {
    if (this.#runningMap.has(projectId)) return false;
    const proc = execa(cmdArr[0], cmdArr.slice(1), {
      cwd,
      env,
      detached: true,
      windowsHide: false,
      all: true,
      buffer: false,
    });
    const pid = proc.pid;
    this.#runningMap.set(projectId, proc);
    this.#lineBufferMap.set(projectId, "");

    proc.all.on("data", (chunk) => {
      const raw = chunk.toString("utf8");
      console.log(`【子进程实时输出】${raw}`);
      let buf = this.#lineBufferMap.get(projectId);
      buf += raw;
      const lines = buf.split(/\r?\n/);
      const remain = lines.pop();
      this.#lineBufferMap.set(projectId, remain);
      for (const line of lines) {
        const trim = line.trim();
        if (!trim) continue;
        this.emit("logLine", { projectId, line: trim });
      }
    });

    proc.catch((err) => {
      console.error(
        `【子进程业务终止】项目ID:${projectId} 信号:${err.signal ?? err.exitCode}`,
      );
      this.emit("error", { projectId, err });
    });

    proc.on("error", (err) => {
      console.error(`【子进程系统错误】项目ID:${projectId}`, err.message);
      this.emit("error", { projectId, err });
    });

    proc.on("close", (code, signal) => {
      this.#runningMap.delete(projectId);
      this.#lineBufferMap.delete(projectId);
      console.warn(
        `【子进程退出】项目ID:${projectId} 退出码:${code} 信号:${signal}`,
      );
      this.emit("close", { projectId, code, signal });
    });

    return { success: true, pid };
  }

  /**
   * 判断指定项目是否存在运行中的子进程
   * @param {string} projectId 项目数据库ID
   * @returns {boolean} true=正在运行
   */
  isRunning(projectId) {
    return this.#runningMap.has(projectId);
  }

  /**
   * 向子进程发送终止信号，销毁进程句柄缓存
   * @param {string} projectId 项目数据库ID
   * @returns {boolean} true=存在进程并执行销毁
   */
  kill(projectId) {
    const proc = this.#runningMap.get(projectId);
    if (!proc) return false;
    proc.kill("SIGTERM");
    this.#runningMap.delete(projectId);
    this.#lineBufferMap.delete(projectId);
    return true;
  }
}

module.exports = new SubProcessService();

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
  let errorMsg = "";
  if (typeof msg === "string") {
    errorMsg = msg;
  } else if (msg?.message) {
    errorMsg = msg.message;
  } else {
    errorMsg = "服务器内部异常";
  }
  return res.status(code).json({
    code,
    msg: errorMsg,
    data: null,
  });
};

module.exports = { success, fail };

```

utils/projects/env.util.js为隔离子进程环境变量工具函数：

```js
/**
 * 隔离子进程环境变量工具函数
 * 业务场景：Windows平台使用execa启动子Node项目时，隔离父主程序的全局环境变量，避免配置污染
 * 核心解决痛点：父主管理平台环境变量PORT=1234会被子项目继承，导致端口占用、启动崩溃
 * 实现逻辑：
 *  1、仅保留Windows运行node/npm必备的系统底层环境变量，保障命令正常执行
 *  2、强制清空PORT变量，阻断主程序端口配置向下传递
 *  3、批量删除数据库、鉴权、服务地址类业务变量，彻底隔离父子项目配置
 *  4、返回纯净独立env对象，传入execa作为子进程启动环境，子项目仅读取自身目录.env配置
 * @returns {Record<string, string | undefined>} 隔离后的纯净环境变量对象
 */
function getIsolatedChildEnv() {
  /**
   * 白名单：Windows系统运行node、npm、cmd命令不可缺失的底层环境变量
   * 缺失会导致子进程执行命令报错、系统路径找不到、终端功能异常
   * PATH：系统可执行文件搜索路径（node/npm全局命令依赖）
   * SystemRoot/windir：Windows系统根目录
   * TEMP/TMP：系统临时文件目录
   * USERNAME/COMPUTERNAME：当前用户、计算机标识
   * ComSpec：cmd.exe程序路径
   * OS：操作系统标识
   * PROCESSOR_ARCHITECTURE：CPU架构
   * LOCALAPPDATA/APPDATA：用户应用数据目录
   * HOSTNAME：本机主机名
   * @type {string[]}
   */
  const safeSystemKeys = [
    "PATH",
    "SystemRoot",
    "windir",
    "TEMP",
    "TMP",
    "USERNAME",
    "COMPUTERNAME",
    "ComSpec",
    "OS",
    "PROCESSOR_ARCHITECTURE",
    "LOCALAPPDATA",
    "APPDATA",
    "HOSTNAME",
  ];
  const cleanEnv = {};
  safeSystemKeys.forEach((key) => {
    if (process.env[key]) cleanEnv[key] = process.env[key];
  });

  /**
   * 强制覆盖PORT为空字符串
   * 作用：阻断主程序PORT=1234向下传递，子项目读取process.env.PORT得到空值
   * 子项目代码逻辑 `const port = process.env.PORT || 3000` 会自动使用自身.env默认端口3000/8080
   */
  cleanEnv.PORT = "";

  /**
   * 黑名单：需要彻底删除的业务配置类环境变量
   * 数据库连接、服务地址、鉴权密钥等父子项目独立配置，禁止互相继承
   * @type {string[]}
   */
  const businessDbKeys = [
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "MONGODB_URI",
    "MONGO_URL",
    "MONGO_HOST",
    "DATABASE",
    "LOCAL_IP",
    "SERVER_IP",
    "SECRET",
    "TOKEN_SECRET",
  ];
  businessDbKeys.forEach((key) => delete cleanEnv[key]);
  return cleanEnv;
}

module.exports = { getIsolatedChildEnv };

```

utils/projects/lock.util.js为PID锁文件工具集：

```js
/**
 * PID锁文件工具集
 * 业务场景：Windows平台管理Node子项目进程生命周期
 * 实现基于PID文件的进程存活判断、进程强制销毁、锁文件读写
 * 配套 subProcessService、projectOperateService 使用，解决以下问题：
 *  1、通过本地文件持久存储子进程PID，重启主服务后仍能识别旧进程；
 *  2、真实查询Windows系统tasklist校验进程是否存活，杜绝单纯时间戳误判；
 *  3、提供统一Windows杀进程命令封装，业务层无需手写cmd脚本；
 *  4、配套启停逻辑自动创建/删除锁文件，保证数据库状态与真实进程同步；
 *  编码注意：Windows cmd终端默认GBK编码，当前utf-8会导致中文报错乱码，生产建议改为 encoding:"gbk"
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * 写入锁文件：将子进程真实PID写入项目目录 .running.lock
 * @param {string} lockPath 锁文件完整绝对路径
 * @param {number} pid execa子进程返回的进程数字ID
 */
function writeLock(lockPath, pid) {
  fs.writeFileSync(lockPath, String(pid), "utf-8");
}

/**
 * 移除锁文件：进程停止/崩溃后删除本地锁文件
 * @param {string} lockPath 锁文件完整绝对路径
 */
function removeLock(lockPath) {
  if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
}

/**
 * 读取锁文件PID，调用Windows tasklist查询进程是否真实存活
 * @param {Object} project 数据库项目记录对象，包含 workDir 工作目录字段
 * @returns {Promise<boolean>} true=进程正在运行；false=进程不存在/已销毁
 */
async function isProcessRunning(project) {
  const lockFilePath = path.join(project.workDir, ".running.lock");
  if (!fs.existsSync(lockFilePath)) return false;
  try {
    const pid = fs.readFileSync(lockFilePath, "utf8").trim();
    if (!pid) return false;
    const taskOutput = execSync(`tasklist /FI "PID eq ${pid}"`, {
      encoding: "utf-8",
    });
    return taskOutput.includes(pid);
  } catch (err) {
    removeLock(lockFilePath);
    return false;
  }
}

/**
 * Windows 系统下强制杀死指定 PID 的进程
 * 底层封装 taskkill 系统命令，同步阻塞执行
 * @param {number | string} pid 待销毁进程ID
 */
function killPid(pid) {
  execSync(`taskkill /F /PID ${pid}`, { encoding: "utf-8" });
}

module.exports = {
  writeLock,
  removeLock,
  isProcessRunning,
  killPid,
};

```

utils/projects/log.parser.util.js为解析子项目启动单行日志，提取可访问地址：

```js
/**
 * 解析子项目启动单行日志，提取可访问地址
 * 业务用途：自动抓取子Express打印的 Local / Network 访问链接，更新数据库 bindIp、bindPort
 * 优先级规则：优先返回局域网Network地址，不存在则降级使用本机Local地址，无匹配返回null
 * 匹配日志示例：
 *  1、Network: http://172.25.96.1:3000
 *  2、Local: http://localhost:3000
 *  兼容中英文冒号 `:` / `：`，适配不同打印日志格式
 * @param {string} fullLog 子进程拆分后的单行完整日志文本
 * @returns {null | {ip:string, port:string}} 匹配成功返回IP+端口对象，无地址返回null
 */
function parseNetworkUrl(fullLog) {
  /**
   * 正则表达式拆解
   * /(Local|Network)[:：]\s*http:\/\/([0-9a-zA-Z.]+):(\d+)/gi
   * 分组1 (Local|Network)：匹配地址类型，区分局域网/本地
   * [:：]：兼容英文冒号、中文全角冒号两种写法
   * \s*：匹配0个或多个空格
   * http:\/\/：固定协议前缀
   * 分组2 ([0-9a-zA-Z.]+)：匹配IP/域名（localhost、172.25.96.1）
   * 分组3 (\d+)：匹配端口数字
   * gi：全局匹配 + 忽略大小写
   */
  const reg = /(Local|Network)[:：]\s*http:\/\/([0-9a-zA-Z.]+):(\d+)/gi;
  // 存储局域网地址匹配结果
  let networkMatch = null;
  // 存储本地本机地址匹配结果
  let localMatch = null;
  // 循环匹配结果临时变量
  let match;
  // 记录匹配到地址的总条数，判断日志内是否存在地址
  let matchCount = 0;

  // 循环遍历所有正则匹配结果，全局查找日志内全部地址
  while ((match = reg.exec(fullLog)) !== null) {
    matchCount++;
    // 地址类型 Local / Network
    const type = match[1];
    // IP或域名 localhost / 172.25.96.1
    const ip = match[2];
    const port = match[3];
    if (type === "Network") {
      networkMatch = { ip, port };
    } else {
      // 本地地址，低优先级
      localMatch = { ip, port };
    }
  }
  // 日志中未匹配到任何地址，直接返回null
  if (matchCount === 0) return null;
  // 空值合并运算符：存在Network局域网地址优先返回，否则返回Local本地地址
  return networkMatch ?? localMatch;
}

module.exports = { parseNetworkUrl };

```

###### 测试程序

* 环境变量

test4Using/.env环境变量：

```env
# ============================================
# 服务器配置
# PORT：设置服务器端口号
# LISTEN_AREA：设置后端监听区域
# NODE_ENV：设置当前阶段
# SERVER_IP设置后端服务器最终的IP地址（包括端口号）
# process.env.LISTEN_AREA: 用于设定是否在本地使用还是局域网内使用
# ============================================
PORT=1234
LISTEN_AREA=0.0.0.0
NODE_ENV=development
SERVER_IP=http://${LOCAL_IP}:${PORT}

# ============================================
# 局域网IP
# LOCAL_IP：自动获取的局域网IP（由 setup-env.js 自动更新）
# ============================================
LOCAL_IP=127.0.0.1

# ============================================
# MONGODB数据库配置
# MONGODB_DBHOST：数据库主机IP地址
# MONGODB_DBPORT：数据库主机端口号
# MONGODB_DBNAME：（用户）数据库名称
# MONGODB_USERCOLLECTION：（用户）集合名称

# MONGODB_DBNAME：（账单）数据库名称
# MONGODB_ACCOUNTSCOLLECTION：（账单）集合名称

# MONGODB_DBNAME：（项目）数据库名称
# MONGODB_PROJECTSCOLLECTION：（项目）集合名称
# MONGODB_USER：登录数据库用户
# MONGODB_PASSWORD：登录数据库密码
# MONGODB_POOL_SIZE：连接池最大连接数 
# MONGODB_TIMEOUT：数据库操作超时时间
# EXIT_ON_DB_ERROR：数据库连接失败时，直接退出 Node 进程
# ============================================
MONGODB_DBHOST=${LOCAL_IP}
MONGODB_DBPORT=27017
# MONGODB_DBNAME=expressTest4Demo
# MONGODB_USERCOLLECTION=users4mongov2dot2

# MONGODB_DBNAME=myaccounts
# MONGODB_ACCOUNTSCOLLECTION=accounts4mongov2dot2

MONGODB_DBNAME=stuProjects4mt
MONGODB_PROJECTCOLLECTION=projects

MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_POOL_SIZE=10
MONGODB_TIMEOUT=3000
EXIT_ON_DB_ERROR=true

# ============================================
# JWT 配置
# JWT_EXPIRES 合法过期时间：s秒 m分 h时 d天
# Bearer 是需要有空格的，非常重要
# ============================================
JWT_SECRET=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwianRpIjoiODAwN2QwOGItMzMzYi00MmFjLTgyYzktOTY2MDliNDU1NWNmIn0.MgSCWHLfQfq2tV8DR1nvk0QZsERX-gbSXTrxMKQFERI9iwPHCWVZ4TdAeG_X8ghJFYsxZ3DvrP87GID1VvDgARre2PMNRR2LN0wcwvz0tOXSpKl9mlYu2Le_4RE8NiAQidz_KW4zLb1hn4zT3pz4xO7tUzEKP-JUNzxJdgVCW1flH_ms9l9pDJcBIHtah-Qag2NyO8kQ-fPXHIS0fWmjUyNGfyNKjcITOkojRsmS_eCM9xPtocLjHkKS2xHb50Q71rJWtO0JjF8JNwj9e85k68ptt8im51va1CjtplEiV28yLrgDm4HhyW2OyPqhyvDS2_Z8XMRQNTj7OzjJ3FEN7A
JWT_REFRESH_SECRET=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJEaW5vQ2hpZXNhLmdpdGh1Yi5pbyIsInN1YiI6InNoZW5pcXVhIiwiYXVkIjoibmF0YWxpYSIsImlhdCI6MTc4MjEyNzQxOCwiZXhwIjoxNzgyMTI4MDE4LCJwcm9wWCI6MTcxNTd9.HwKE8r18zYjZvBHLA-MHhSwfZ228rLT0wZ105Gz1_tM3OKrwqNOX36BjQlo4fTVFH18AKBM4CT6WZB5GTW5cVC8mq39ireJiGXqmLxzJTQsZ9x71QTDqlEQBKnMM3chC93TQth7WVGpU05U8s7b75MB1RyPGuGi3eF5i7UERe9ENsPDrj5hvx9tkLzLItBlSLxYuM-5XXYEjVynT5XmZfH5WTUg42a68xzCLPScjlG_8au-72Fwaz4nnNCPVTwX9es1_3x4Hv5MZvWBCgFkiy7YVUidJckQx23Nf5QANWinC3lPrZ3LQHMQlRKkZW1KLRY2UUwmqMiIf4iyFraSk_Q
JWT_EXPIRES=2h
JWT_AUTH_HEADER_KEY=authorization
JWT_AUTH_PREFIX=Bearer 


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

包含测试程序和基本用法的详细介绍和说明，test4Using/test4ServicesOperater4Users.js示例：

```js
// 0. 引入路径优化第三方库module-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@MongoDB/config/db.js");
// 1.3 引入services文件
const { usersService } = require("@MongoDB/services/index.service.js");

// 2. 连接数据库,采用IIFE表达式，第1个外括号内的表示是一个函数的箭头函数简写，第二个括号代码传参，是最简写形式
(async () => {
  try {
    // 2.1 尝试连接数据库
    await dbConnect();
    // 2.2 连接数据库后，对数据库进行项目操作
    dbOperate();
  } catch (error) {
    // 2.3 数据库如果连接失败做提示，并进行错误后操作,退出程序，不再提供服务
    console.log("主程序获取连接错误：" + error);
    process.exit(1);
  }
})();

// 3. 进行services纯数据库操作工作
async function dbOperate() {
  // 3.1  调用创建批量用户方法
  // await createUsers();
  // 3.2  调用创建一个用户方法
  // await createUser();
  // 3.3 通过id查询用户(存在和软删除中不存在的用户)
  /* {
    console.log(
      "查找已存在，且没有被删除的用户:",
      await usersService.findById("6a3dd348e7373a4e9c4d2d86"),
    );
    console.log(
      "查找已存在，且被删除的用户:",
      await usersService.findById("6a3dd348e7373a4e9c4d2d12"),
    );
  } */
  // 3.4 条件查询单条
  /* console.log(
    await usersService.findOne({
      role: "user",
    }),
  ); */
  // 3.5 分页列表
  // console.log(await usersService.getUserList({ role: "user" }, 2, 5));
  // 3.6 更新用户啊
  /* console.log(
    await usersService.updateById("6a3dd33806d315abf9fab945", {
      role: "admin",
    }),
  ); */
  // 3.7 软删除
  // console.log(await usersService.deleteById("6a3dd33806d315abf9fab945"));
}

// 创建批量用户
async function createUsers() {
  for (let index = 1; index < 10; index++) {
    const usersObject = {
      username: `test4Uers0${index}`,
      password: `test4Uers0${index}123`,
      email: `test4Uers0${index}@test4Uers.com`,
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
    username: `test4Uers100`,
    password: `test4Uers100123`,
    email: `test4Uers100@test4Uers.com`,
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

包含测试程序和基本用法的详细介绍和说明，test4Using/test4ServicesOperater4Accounts.js示例：

```js
// 0. 引入路径优化第三方库moudle-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@MongoDB/config/db.js");
// 1.3 引入services文件
const { accountsService } = require("@MongoDB/services/index.service.js");

// 2. 异步自执行函数：等待数据库连接成功后再加载路由
(async () => {
  try {
    // 2.1 尝试连接数据库
    await dbConnect();
    // 2.2 连接数据库后，对数据库进行项目操作
    dbOperate();
  } catch (error) {
    // 2.3 数据库如果连接失败做提示，并进行错误后操作,退出程序，不再提供服务
    console.log("主程序获取连接错误：" + error);
    process.exit(1);
  }
})();

// 3. 进行services纯数据库操作工作
async function dbOperate() {
  // 3.1  调用创建批量用户方法
  await createAccounts();
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
  for (let index = 1; index < 10; index++) {
    const accountsObject = {
      item: `开了第${index}个个体户，自己做生意`,
      type: -1,
      account: `25${index}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      remarks: `趁着奶茶热，想着赚一波回回血`,
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

* 核心控制层

基本数据，模拟req和res，test4Using/test4Controllers.ReqResModule.js：

```js
/**
 * 模拟 Express req / res 对象，用于本地单元测试 Controller
 */
class ReqResModule {
  constructor(body = {}, params = {}, query = {}, session = {}) {
    // 模拟请求体 req.body
    this.body = body;
    // 路径参数 req.params
    this.params = params;
    // 查询参数 req.query
    this.query = query;
    // 模拟session
    this.session = session;
    // 请求头（用于JWT登出接口）
    this.headers = {};

    // res 存储返回结果
    this.resResult = null;
    this.resStatus = 200;
  }

  // 模拟 res.status + json（success / fail 内部调用）
  status(code) {
    this.resStatus = code;
    return this;
  }

  json(data) {
    this.resResult = data;
    return this;
  }

  // 获取完整返回结果
  getResponse() {
    return {
      status: this.resStatus,
      data: this.resResult,
    };
  }

  // 设置Authorization Bearer Token
  setAuthToken(token) {
    this.headers.authorization = `Bearer ${token}`;
  }
}

module.exports = ReqResModule;

```

响应和处理，test4Using/test4ControllersOperater4Users.js示例：

```js
// 0. 引入路径优化第三方库module-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@MongoDB/config/db.js");
// 1.3 引入controllers文件
const { usersController } = require("@MongoDB/controllers/index.controller.js");
// 1.4 导入模拟req,res的类方法
const reqResModule = require("@MongoDB/test4Using/test4Controllers.reqResModule.js");
// 2. 连接数据库,采用IIFE表达式，第1个外括号内的表示是一个函数的箭头函数简写，第二个括号代码传参，是最简写形式
(async () => {
  try {
    // 2.1 尝试连接数据库
    await dbConnect();
    // 2.2 连接数据库后，对数据库进行项目操作
    dbOperate();
  } catch (error) {
    // 2.3 数据库如果连接失败做提示，并进行错误后操作,退出程序，不再提供服务
    console.log("主程序获取连接错误：" + error);
    process.exit(1);
  }
})();

// 3. 进行controllers的API接口测试操作
async function dbOperate() {
  // 3.1 【API接口】注册 register
  /* {
    //只传入一个参数{...}，对应给了body,其他参数为默认值
    const regReq1 = new reqResModule({
      username: "test007",
      email: "test007@demo.com",
      password: "12345678",
    });

    await usersController.register(regReq1, regReq1);
    console.log("register 返回：", regReq1.getResponse(), "\n");
  } */
  // 3.2. 【页面专用】注册 registerData
  /* {
    const regDataReq = new reqResModule({
      username: "test008",
      email: "test008@demo.com",
      password: "12345678",
    });
    const regDataRes = await usersController.registerData(regDataReq);
    console.log("registerData 返回：", regDataRes, "\n");
  } */
  // 3.3 【API接口】登录 login（获取token）
  /* {
    const loginReq = new reqResModule({
      username: "test007",
      password: "12345678",
    });
    await usersController.login(loginReq, loginReq);
    const loginResp = loginReq.getResponse();
    const token = loginResp.data;
    console.log("login 返回token：", token, "\n");
  } */
  // 3.4. 【页面专用】登录 loginData（生成session）
  /* {
    const loginDataReq = new reqResModule(
      {
        username: "test007",
        password: "12345678",
      },
      {},
      {},
      { regenerate: (cb) => cb(null) },
    );
    const loginDataRes = await usersController.loginData(loginDataReq);
    console.log("loginData 返回：", loginDataRes, "\n");
  } */
  // 3.5. 【API接口】登出 logout（token失效）
  /* {
    //token是上面生成的
    token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTNkZGIzNDVlODAxZmJkMzI2OGE0MTkiLCJ0b2tlblZlcnNpb24iOjAsImlhdCI6MTc4MjQzOTIzNSwiZXhwIjoxNzgyNDQ2NDM1fQ.OQ4PR0CITU7rL6a5vrB8dUc7H5iYLSpfR8EvA-qGDdo";
    const logoutReq = new reqResModule();
    logoutReq.setAuthToken(token);
    await usersController.logout(logoutReq, logoutReq);
    console.log("logout 返回：", logoutReq.getResponse(), "\n");
  } */
  // 3.6. 【页面专用】登出 logoutData（销毁session）
  /* {
    const logoutDataReq = new reqResModule(
      {},
      {},
      {},
      { destroy: (cb) => cb(null, { type: 1 }) },
    );
    const logoutDataRes = await usersController.logoutData(logoutDataReq);
    console.log("logoutData 返回：", logoutDataRes, "\n");
  } */
  // 7. 【API接口】获取用户列表 getUserList
  /* {
    const listReq = new reqResModule({}, {}, { page: 1, limit: 10 });
    await usersController.getUserList(listReq, listReq);
    console.log("getUserList 返回：", listReq.getResponse(), "\n");
  } */
  // 8. 【页面专用】用户列表 getUserListData
  /* {
    const listDataReq = new reqResModule({}, {}, { page: 1, limit: 10 });
    const listDataRes = await usersController.getUserListData(listDataReq);
    console.log("getUserListData 返回：", listDataRes, "\n");
  } */
  // 9. 【API接口】获取当前登录用户 getInfo
  /* {
    const infoReq = new reqResModule();
    infoReq.user = { userId: "xxx", username: "test007" };
    await usersController.getInfo(infoReq, infoReq);
    console.log("getInfo 返回：", infoReq.getResponse(), "\n");
  } */
  // 10. 【页面专用】获取当前用户 getInfoData
  /* {
    const infoDataReq = new reqResModule();
    infoDataReq.user = { userId: "xxx", username: "test007" };
    const infoDataRes = await usersController.getInfoData(infoDataReq);
    console.log("getInfoData 返回：", infoDataRes, "\n");
  } */
  // 11. 【API接口】删除用户 deleteUser
  /* {
    const delReq = new reqResModule({}, { id: "6a3ddcfbf4bd6f00cbb58aee" });
    await usersController.deleteUser(delReq, delReq);
    console.log("deleteUser 返回：", delReq.getResponse(), "\n");
  } */
  // 12. 【页面专用】删除用户 deleteUserData
  /* {
    const delDataReq = new reqResModule({}, { id: "6a3ddcfbf4bd6f00cbb58aee" });
    const delDataRes = await usersController.deleteUserData(delDataReq);
    console.log("deleteUserData 返回：", delDataRes, "\n");
  } */
  // 13. 【页面专用】创建用户 createUserData
  /* {
    const createDataRes = await usersController.createUserData({
      username: "test009",
      email: "test009@demo.com",
      password: "123456",
    });
    console.log("createUserData 返回：", createDataRes, "\n");
  } */
  // 14. 【页面专用】按ID查找 findByIdData
  /* {
    const findIdRes = await usersController.findByIdData({
      _id: "6a3ddb345e801fbd3268a419",
    });
    console.log("findByIdData 返回：", findIdRes, "\n");
  } */
  // 15. 【页面专用】条件单条查询 findOneData
  /* {
    const findOneRes = await usersController.findOneData({
      username: "test007",
    });
    console.log("findOneData 返回：", findOneRes, "\n");
  } */
}

```

> 用于Users测试，程序包含了所有MongoDB核心功能查询语句

响应和处理，test4Using/test4ControllersOperater4Accounts.js示例：

```js
// 0. 引入路径优化第三方库module-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@MongoDB/config/db.js");
// 1.3 引入accounts控制器
const {
  accountsController,
} = require("@MongoDB/controllers/index.controller.js");
// 1.4 导入模拟req,res的类方法
const reqResModule = require("@MongoDB/test4Using/test4Controllers.reqResModule.js");

// 2. 连接数据库,采用IIFE表达式，连接成功后执行测试
(async () => {
  try {
    // 2.1 尝试连接数据库
    await dbConnect();
    // 2.2 连接数据库后，对数据库进行项目操作
    await dbOperate();
    process.exit(0);
  } catch (error) {
    // 2.3 数据库如果连接失败做提示，并退出程序
    console.log("主程序获取连接错误：" + error);
    process.exit(1);
  }
})();

// 3. 进行Accounts controllers的API接口测试操作
async function dbOperate() {
  // 测试用账单基础数据
  const testAccountBody = {
    item: "午餐支出",
    type: -1,
    account: 36.5,
    remark: "公司楼下快餐店",
    createTime: new Date(),
  };
  const updateAccountBody = {
    item: "午餐支出修改",
    account: 42,
    remark: "加了饮料",
  };

  // 3.1 【API接口】获取账单列表 getAccountsList
  /* {
    const listReq = new reqResModule({}, {}, { page: 1, limit: 10 });
    await accountsController.getAccountsList(listReq, listReq);
    console.log(
      "3.1 getAccountsList(API列表) 返回：",
      listReq.getResponse(),
      "\n",
    );
  } */
  // 3.2 【页面专用】获取账单列表 getAccountsListData
  /* {
    const listDataReq = new reqResModule({}, {}, { page: 1, limit: 10 });
    const listDataRes =
      await accountsController.getAccountsListData(listDataReq);
    console.log("3.2 getAccountsListData(页面列表) 返回：", listDataRes, "\n");
  } */
  // 3.3 【API接口】创建账单 createAccount
  {
    // 分开创建 req、res 模拟对象
    const mockReq = new reqResModule(testAccountBody);
    const mockRes = new reqResModule();
    // 分别传入 req、res
    await accountsController.createAccount(mockReq, mockRes);
    // 从 res 实例拿返回结果打印
    console.log(
      "3.3 createAccount(API创建) 返回：",
      mockRes.getResponse(),
      "\n",
    );
  }
  // 3.4 【页面专用】创建账单 createAccountData
  /* {
    const createDataRes =
      await accountsController.createAccountData(testAccountBody);
    console.log("3.4 createAccountData(页面创建) 返回：", createDataRes, "\n");
  } */
  // 3.5 【API接口】根据ID查询单条账单 getOneAccountById
  /* {
    const findReq = new reqResModule({}, { id: "6a3de4eded36737b562b3413" });
    await accountsController.getOneAccountById(findReq, findReq);
    console.log(
      "3.5 getOneAccountById(API单条查询) 返回：",
      findReq.getResponse(),
      "\n",
    );
  } */
  // 3.6 【页面专用】根据ID查询单条账单 getOneAccountByIdData
  /* {
    const findDataRes = await accountsController.getOneAccountByIdData(
      "6a3de4eded36737b562b3413",
    );
    console.log(
      "3.6 getOneAccountByIdData(页面单条查询) 返回：",
      findDataRes,
      "\n",
    );
  } */
  // 3.7 【API接口】更新账单 updateAccountById
  /* {
    const updateReq = new reqResModule(updateAccountBody, {
      id: "6a3de4eded36737b562b3413",
    });
    await accountsController.updateAccountById(updateReq, updateReq);
    console.log(
      "3.7 updateAccountById(API更新) 返回：",
      updateReq.getResponse(),
      "\n",
    );
  } */
  // 3.8 【页面专用】更新账单 updateAccountByIdData
  /* {
    const updateDataRes = await accountsController.updateAccountByIdData(
      "6a3de4eded36737b562b3413",
      updateAccountBody,
    );
    console.log(
      "3.8 updateAccountByIdData(页面更新) 返回：",
      updateDataRes,
      "\n",
    );
  } */
  // 3.9 【API接口】删除账单 deleteAccount
  /* {
    const delReq = new reqResModule({}, { id: "6a3de4eded36737b562b3413" });
    await accountsController.deleteAccount(delReq, delReq);
    console.log(
      "3.9 deleteAccount(API删除) 返回：",
      delReq.getResponse(),
      "\n",
    );
  } */
  // 3.10 【页面专用】删除账单 deleteAccountData
  /* {
    const delDataReq = new reqResModule({}, { id: "6a3de4eded36737b562b3413" });
    const delDataRes = await accountsController.deleteAccountData(delDataReq);
    console.log("3.10 deleteAccountData(页面删除) 返回：", delDataRes, "\n");
  } */
}

```

> 用于Accounts测试，程序包含了所有MongoDB核心功能查询语句

响应和处理，test4Using/test4ControllersOperater4Projects.js示例：

```js
// 0. 引入路径优化第三方库module-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@MongoDB/config/db.js");
// 1.3 引入accounts控制器
const {
  accountsController,
} = require("@MongoDB/controllers/index.controller.js");
// 1.4 导入模拟req,res的类方法
const reqResModule = require("@MongoDB/test4Using/test4Controllers.reqResModule.js");

// 2. 连接数据库,采用IIFE表达式，连接成功后执行测试
(async () => {
  try {
    // 2.1 尝试连接数据库
    await dbConnect();
    // 2.2 连接数据库后，对数据库进行项目操作
    await dbOperate();
    process.exit(0);
  } catch (error) {
    // 2.3 数据库如果连接失败做提示，并退出程序
    console.log("主程序获取连接错误：" + error);
    process.exit(1);
  }
})();

// 3. 进行Accounts controllers的API接口测试操作
async function dbOperate() {
  // 测试用账单基础数据
  const testAccountBody = {
    item: "午餐支出",
    type: -1,
    account: 36.5,
    remark: "公司楼下快餐店",
    createTime: new Date(),
  };
  const updateAccountBody = {
    item: "午餐支出修改",
    account: 42,
    remark: "加了饮料",
  };

  // 3.1 【API接口】获取账单列表 getAccountsList
  /* {
    const listReq = new reqResModule({}, {}, { page: 1, limit: 10 });
    await accountsController.getAccountsList(listReq, listReq);
    console.log(
      "3.1 getAccountsList(API列表) 返回：",
      listReq.getResponse(),
      "\n",
    );
  } */
  // 3.2 【页面专用】获取账单列表 getAccountsListData
  /* {
    const listDataReq = new reqResModule({}, {}, { page: 1, limit: 10 });
    const listDataRes =
      await accountsController.getAccountsListData(listDataReq);
    console.log("3.2 getAccountsListData(页面列表) 返回：", listDataRes, "\n");
  } */
  // 3.3 【API接口】创建账单 createAccount
  {
    // 分开创建 req、res 模拟对象
    const mockReq = new reqResModule(testAccountBody);
    const mockRes = new reqResModule();
    // 分别传入 req、res
    await accountsController.createAccount(mockReq, mockRes);
    // 从 res 实例拿返回结果打印
    console.log(
      "3.3 createAccount(API创建) 返回：",
      mockRes.getResponse(),
      "\n",
    );
  }
  // 3.4 【页面专用】创建账单 createAccountData
  /* {
    const createDataRes =
      await accountsController.createAccountData(testAccountBody);
    console.log("3.4 createAccountData(页面创建) 返回：", createDataRes, "\n");
  } */
  // 3.5 【API接口】根据ID查询单条账单 getOneAccountById
  /* {
    const findReq = new reqResModule({}, { id: "6a3de4eded36737b562b3413" });
    await accountsController.getOneAccountById(findReq, findReq);
    console.log(
      "3.5 getOneAccountById(API单条查询) 返回：",
      findReq.getResponse(),
      "\n",
    );
  } */
  // 3.6 【页面专用】根据ID查询单条账单 getOneAccountByIdData
  /* {
    const findDataRes = await accountsController.getOneAccountByIdData(
      "6a3de4eded36737b562b3413",
    );
    console.log(
      "3.6 getOneAccountByIdData(页面单条查询) 返回：",
      findDataRes,
      "\n",
    );
  } */
  // 3.7 【API接口】更新账单 updateAccountById
  /* {
    const updateReq = new reqResModule(updateAccountBody, {
      id: "6a3de4eded36737b562b3413",
    });
    await accountsController.updateAccountById(updateReq, updateReq);
    console.log(
      "3.7 updateAccountById(API更新) 返回：",
      updateReq.getResponse(),
      "\n",
    );
  } */
  // 3.8 【页面专用】更新账单 updateAccountByIdData
  /* {
    const updateDataRes = await accountsController.updateAccountByIdData(
      "6a3de4eded36737b562b3413",
      updateAccountBody,
    );
    console.log(
      "3.8 updateAccountByIdData(页面更新) 返回：",
      updateDataRes,
      "\n",
    );
  } */
  // 3.9 【API接口】删除账单 deleteAccount
  /* {
    const delReq = new reqResModule({}, { id: "6a3de4eded36737b562b3413" });
    await accountsController.deleteAccount(delReq, delReq);
    console.log(
      "3.9 deleteAccount(API删除) 返回：",
      delReq.getResponse(),
      "\n",
    );
  } */
  // 3.10 【页面专用】删除账单 deleteAccountData
  /* {
    const delDataReq = new reqResModule({}, { id: "6a3de4eded36737b562b3413" });
    const delDataRes = await accountsController.deleteAccountData(delDataReq);
    console.log("3.10 deleteAccountData(页面删除) 返回：", delDataRes, "\n");
  } */
}

```

* 流程完整层

搭建express环境，并设置test4Using/app.js:

```js
// 引入路径优化第三方库moudle-alias
require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());
const express = require("express");
const cors = require("cors");
const connectDB = require("@MongoDB/config/db.js");
const router = require("@MongoDB/routes/user.route.js");
const errorHandler = require("@MongoDB/middleware/error.middleware.js");

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

使用Apipost工具，创建如下工具测试，该项测试只是针对Users进行测试：

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

