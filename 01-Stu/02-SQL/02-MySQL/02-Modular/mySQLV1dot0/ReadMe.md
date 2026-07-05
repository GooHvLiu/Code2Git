##### mySQL-V1.0_01

###### 版本描述

* <span style="color:#black;font-weight:normal;font-family:'楷体">1.0_01版本更新了mySQL的基本使用。</span>

###### 文件架构

```文本
mySQLV1dot0
 ┣ config                            # 全局配置文件夹
 ┃ ┗ db.config.js                    # MySQL数据库连接池配置
 ┣ controllers                       # 控制器层（接收请求、统一返回）
 ┃ ┗ index.controller.js             # 集合：用户接口控制器
 ┃ ┗ users.controller.js             # 用户接口控制器
 ┣ models                            # 数据库底层模块
 ┃ ┣ base                            # 数据表模型层
 ┃ ┃ ┗ base.model.js                 # 基础通用CRUD父类模型
 ┃ ┃ ┗ index.js                      # 数据库连接池初始化
 ┃ ┣ index.model.js                  # 集合：用户表模型/字段白名单
 ┃ ┗ users.modex.js                  # 用户表模型/字段白名单
 ┣ middlewares                       # 全局中间件
 ┃ ┗ error.middleware.js             # 全局统一异常处理
 ┣ service                           # 业务逻辑层
 ┃ ┗ index.service.js                # 集合：用户业务校验与逻辑处理
 ┃ ┗ users.service.js                # 用户业务校验与逻辑处理
 ┣ test4Using                        # 本地测试目录（仅开发调试）
 ┃ ┣ node_modules                    # 测试依赖包
 ┃ ┣ routes                          # 路由注册目录
 ┃ ┃ ┗ user.route.js                 # 用户接口路由配置
 ┃ ┣ .env                            # 环境变量配置文件
 ┃ ┣ app.js                          # 项目入口启动文件
 ┃ ┣ package-lock.json               # 依赖版本锁定文件
 ┃ ┣ package.json                    # 项目依赖与脚本配置
 ┃ ┣ test.user.controller.mysql.js   # 控制器模拟测试脚本
 ┃ ┗ test.user.service.mysql.js      # 业务层测试脚本
 ┣ utils                             # 全局工具函数
 ┃ ┣ sql.util.js                     # SQL安全/分页工具
 ┃ ┗ validator.util.js               # 参数校验工具
 ┗ ReadMe.md                         # 项目说明文档
```

###### 安装依赖

```bash
npm i express dotenv dotenv-expand mysql2 module-alias
```

> module-alias是为了解决路径引入错乱问题

###### 完整代码

config/db.config.js用于数据库开发环境配置：

```js
/**
 * MySQL 多环境配置
 */
const env = process.env.NODE_ENV || "development";

const envConfig = {
  development: {
    host: process.env.MYSQL_DEV_DBHOST || "127.0.0.1",
    port: process.env.MYSQL_DEV_DBPORT || 3306,
    user: process.env.MYSQL_DEV_USERNAME || "root",
    password: process.env.MYSQL_DEV_PASSWORD || "123456",
    database: process.env.MYSQL_DEV_DBNAME || "mydb4demo",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    timezone: "+08:00",
    charset: "utf8mb4"
  },
  test: {
    host: process.env.MYSQL_TEST_DBHOST || "127.0.0.1",
    port: process.env.MYSQL_TEST_DBPORT || 3306,
    user: process.env.MYSQL_TEST_USERNAME || "root",
    password: process.env.MYSQL_TEST_PASSWORD || "123456",
    database: process.env.MYSQL_TEST_PASSWORD || "test_db",
    connectionLimit: 5
  },
  production: {
    host: "线上数据库IP",
    port: 3306,
    user: "prod_root",
    password: "线上强密码",
    database: "prod_db",
    connectionLimit: 20,
    ssl: true
  }
};

module.exports = envConfig[env];

```

controllers/index.controller.js负责整体导入：

```js
const usersController = require("./users.controller.js");

module.exports = {
  usersController
};
```

controllers/users.controller.js负责请求响应：

```js
const { usersService } = require("@MySQL/service/index.service.js");
const { validateParams } = require("@MySQL/utils/validator.util.js");

/**
 * 用户控制器层 UserController
 * 分层规范职责：
 * 1. 仅处理HTTP请求相关逻辑：接收GET/POST参数、路径参数
 * 2. 统一参数格式校验、基础合法性校验
 * 3. 调用对应Service业务方法，只传递清洗后的干净参数
 * 4. 统一封装标准接口返回JSON格式（code/msg/data）
 * 5. 捕获所有同步/异步异常，交给全局错误中间件统一处理
 * 禁止：写业务逻辑、直接导入Model、手写SQL、复杂数据处理
 */
class UsersController {
  /**
   * findAll 分页查询用户列表接口
   * 接口地址：GET /api/user/list
   * 前端传参方式：URL Query参数（?username=xxx&status=1&page=1&pageSize=10&fields=id,username）
   * @param {Express.Request} req Express内置请求对象，存储前端所有请求信息
   * @param {Express.Response} res Express内置响应对象，用于向前端返回JSON数据
   * @param {Express.NextFunction} next Express错误中转函数，抛出异常交给全局错误中间件
   * @returns {Promise<void>} 无返回值，直接通过res.json向前端输出响应
   */
  async getUserPage(req, res, next) {
    try {
      // 1. 组装查询条件对象：从req.query提取前端所有筛选分页参数
      const query = {
        // 模糊/精确匹配用户名筛选，前端不传则为undefined，Service自动忽略该条件
        username: req.query.username,
        // 用户状态筛选 0禁用/1正常，不传为undefined，Service自动忽略该条件
        status: req.query.status,
        // 页码：前端传参转数字，为空/非数字则默认第1页
        page: Number(req.query.page) || 1,
        // 每页条数：前端传参转数字，为空/非数字则默认每页10条
        pageSize: Number(req.query.pageSize) || 10,
        // 自定义返回字段，不传默认查询id,username两个字段
        fields: req.query.fields || "id,username"
      };

      // 2. 调用通用工具校验页码必须是数字，非法直接抛出错误进入catch
      validateParams(query.page, "number", "页码必须为数字");

      // 3. 调用业务层Service分页查询方法，传入组装好的筛选参数
      const data = await usersService.getUserPage(query);

      // 4. 统一标准成功返回格式，code=200代表业务正常
      return res.json({
        code: 200,
        msg: "查询成功",
        data
      });
    } catch (err) {
      // 捕获当前接口内所有异常（参数校验错误、数据库报错、业务自定义报错）
      // 交给全局统一错误处理中间件，统一返回500错误格式
      next(err);
    }
  }

  /**
   * findAll 不分页查询用户列表接口
   * 接口地址：GET /api/user/list
   * 前端传参方式：URL Query参数（?username=xxx&status=1&fields=id,username）
   * @param {Express.Request} req Express内置请求对象，存储前端所有请求信息
   * @param {Express.Response} res Express内置响应对象，用于向前端返回JSON数据
   * @param {Express.NextFunction} next Express错误中转函数，抛出异常交给全局错误中间件
   * @returns {Promise<void>} 无返回值，直接通过res.json向前端输出响应
   */
  async getUserAll(req, res, next) {
    try {
      // 1. 组装查询条件对象：从req.query提取前端所有筛选分页参数
      const query = {
        // 模糊/精确匹配用户名筛选，前端不传则为undefined，Service自动忽略该条件
        username: req.query.username,
        // 用户状态筛选 0禁用/1正常，不传为undefined，Service自动忽略该条件
        status: req.query.status,
        // 自定义返回字段，不传默认查询id,username两个字段
        fields: req.query.fields || "id,username"
      };

      // 3. 调用业务层Service分页查询方法，传入组装好的筛选参数
      const data = await usersService.getUserAll(query);

      // 4. 统一标准成功返回格式，code=200代表业务正常
      return res.json({
        code: 200,
        msg: "查询成功",
        data
      });
    } catch (err) {
      // 捕获当前接口内所有异常（参数校验错误、数据库报错、业务自定义报错）
      // 交给全局统一错误处理中间件，统一返回500错误格式
      next(err);
    }
  }

  /**
   * findOne 根据主键ID查询单条用户详情接口
   * 接口地址：GET /api/user/:id
   * 前端传参方式：URL路径参数，例如 /api/user/1
   * @param {Express.Request} req Express内置请求对象
   * @param {Express.Response} res Express内置响应对象
   * @param {Express.NextFunction} next 错误中转函数
   * @returns {Promise<void>}
   */
  async getUserInfo(req, res, next) {
    try {
      // 1. 从路径参数中提取用户主键ID，并转为数字类型
      const id = Number(req.params.id);

      // 2. 校验ID必须为有效数字，空/字符串会直接抛出错误
      validateParams(id, "number", "用户ID不能为空");

      // 3. 调用业务层方法，根据ID查询单条用户数据
      const user = await usersService.getUserInfo(id);

      // 4. 成功统一返回标准JSON
      res.json({
        code: 200,
        msg: "查询成功",
        data: user
      });
    } catch (err) {
      // 异常转发至全局错误中间件
      next(err);
    }
  }

  /**
   * create 新增用户接口
   * 接口地址：POST /api/user/add
   * 前端传参方式：请求体JSON（Body）提交表单数据
   * @param {Express.Request} req Express内置请求对象
   * @param {Express.Response} res Express内置响应对象
   * @param {Express.NextFunction} next 错误中转函数
   * @returns {Promise<void>}
   */
  async addUser(req, res, next) {
    try {
      // 1. 提取前端POST提交的完整表单数据对象
      const userData = req.body;

      // 2. 调用业务层新增用户方法，内部完成用户名重复校验、密码格式校验、默认字段填充
      const userId = await usersService.addUser(userData);

      // 3. 新增成功返回自增主键ID，标准返回格式
      res.json({
        code: 200,
        msg: "新增成功",
        data: { userId }
      });
    } catch (err) {
      // 捕获业务层抛出的自定义错误（用户名重复、密码格式错误等）
      next(err);
    }
  }

  /**
   * update 更新用户信息 PUT /api/user/:id
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  async editUser(req, res, next) {
    try {
      // 1. 获取路径中的用户主键ID，并转为数字
      const id = Number(req.params.id);
      // 2. 基础参数校验：ID必须是有效数字
      validateParams(id, "number", "用户ID不能为空且必须为数字");
      // 3. 前端提交的更新表单数据
      const updateFormData = req.body;
      // 4. 调用业务层执行更新逻辑
      const affectedRows = await usersService.editUser(id, updateFormData);

      res.json({
        code: 200,
        msg: affectedRows > 0 ? "用户信息更新成功" : "未修改任何数据",
        data: { affectedRows }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * delete 物理删除用户 DELETE /api/user/remove/:id
   * 直接从数据库删除数据，谨慎调用
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  async removeUser(req, res, next) {
    try {
      const id = Number(req.params.id);
      validateParams(id, "number", "删除用户ID不能为空且必须为数字");
      const affectedRows = await usersService.removeUser(id);

      res.json({
        code: 200,
        msg: affectedRows > 0 ? "物理删除用户成功" : "目标用户不存在，删除失败",
        data: { affectedRows }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * updateDelete 软删除用户（逻辑删除） PATCH /api/user/softRemove/:id
   * 仅修改isDelete=1，保留原始数据，推荐线上使用
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  async softRemoveUser(req, res, next) {
    try {
      const id = Number(req.params.id);
      validateParams(id, "number", "软删除用户ID不能为空且必须为数字");
      const affectedRows = await usersService.softRemoveUser(id);

      res.json({
        code: 200,
        msg: affectedRows > 0 ? "用户已软删除" : "目标用户不存在，操作失败",
        data: { affectedRows }
      });
    } catch (err) {
      next(err);
    }
  }
}

// 控制器全局单例导出，路由层直接导入使用，无需重复实例化
module.exports = new UsersController();

```

middlewares/error.middleware.js为验证中间件，定义：

```js
/**
 * 全局异常捕获中间件
 */
function errorHandler(err, req, res, next) {
  console.error("全局错误捕获：", err.message);
  res.json({
    code: 500,
    msg: err.message || "服务器内部错误",
    data: null
  });
}

module.exports = errorHandler;

```

models/index.model.js为注册model定义：

```js
const UsersModel = require("./users.model.js");

module.exports = {
  UsersModel
};

```

models/users.model.js为users数模定义：

```js
const BaseModel = require("@MySQL/models/base/base.model.js");

// 用户表允许字段白名单
const USER_ALLOW_FIELDS = [
  "id",
  "username",
  "password",
  "status",
  "isDelete",
  "create_time"
];

// 实例化导出单例
const UsersModel = new BaseModel(
  process.env.MYSQL_DEV_DBNAME,
  process.env.MYSQL_DEV_DBTABLE,
  USER_ALLOW_FIELDS
);

module.exports = UsersModel;

```

services/index.service.js为数据库实际包统一注册：

```js
const usersService = require("./users.service.js");

module.exports = {
  usersService
};

```

services/users.service.js为user数据库实际操作：

```js
const { UsersModel } = require("@MySQL/models/index.model.js");

/**
 * 用户业务服务层 UserService
 * 分层标准职责（大厂MVC规范）
 * 上游调用方：UserController 控制器（HTTP入口）
 * 下游依赖：UsersModel 数据模型层（通用CRUD封装、防注入处理）
 * 核心职责：
    1. 接收控制器清洗后的请求参数，组装数据库查询条件对象
    2. 业务规则校验：用户名重复、密码格式、状态合法、数据存在性校验
    3. 填充公共默认字段（创建时间、更新时间、软删除默认值）
    4. 调用Model层执行数据库操作，不直接操作底层SQL、连接池
    5. 业务校验不通过时主动抛出Error异常，由Controller统一捕获处理
 * 禁止行为：
    1. 不接收原生req/res对象，不处理HTTP返回
    2. 不手写原生SQL、不直接导入db/execSql
    3. 不捕获异常、不封装前端响应JSON
    4. 不做参数基础类型校验（数字/空值校验交给Controller工具函数）
 */
class UsersService {
  /**
   * findAll 分页查询用户列表
   * 接口上游：controller.getUserPage
   * @param {Object} [query={}] 前端分页筛选参数，不传默认空对象，防止解构报错
   * @param {string} [query.username] 用户名精确筛选条件，不传则不拼接该WHERE条件
   * @param {number|string} [query.status] 用户状态 0禁用/1正常，不传则不拼接条件
   * @param {number} [query.page=1] 分页页码，未传参默认查询第1页
   * @param {number} [query.pageSize=10] 单页展示条数，未传参默认10条
   * @param {string} [query.fields="id,username"] 自定义查询返回字段，默认只查id、username
   * @returns {Promise<{list: Array, total: number}>}
   *    list：当前页用户数据数组；total：符合条件总数据条数
   */
  async getUserPage(query = {}) {
    // 解构分页/筛选参数，同时给分页、字段设置内部默认兜底值
    const {
      username,
      status,
      page = 1,
      pageSize = 10,
      fields = "id,username"
    } = query;

    // 初始化空条件对象，统一传给Model的条件拼接工具函数
    const where = {};

    // 仅当前端传递了用户名，才加入等值筛选条件
    // 空字符串、undefined、null会自动忽略，不拼进WHERE
    if (username) where.username = username;
    // status区分「不传」和「传0/1」：只有完全不传才不加入条件
    // 前端传0（禁用）、1（正常）都会生成 status = ? 筛选
    if (status !== undefined) where.status = status;

    // 调用基础Model封装好的通用分页查询方法
    // 入参顺序：查询条件对象、自定义查询字段、页码、每页条数
    return await UsersModel.pageList(where, fields, page, pageSize);
  }

  /**
   * findAll 不分页全量查询用户列表
   * 适用场景：下拉选择框、导出全部数据、内部关联查询
   * @param {Object} [query={}] 筛选条件对象，不传默认空对象
   * @param {string} [query.username] 用户名筛选
   * @param {number|string} [query.status] 用户状态筛选
   * @param {string} [query.fields="id,username"] 自定义返回字段
   * @returns {Promise<Array<Object>>} 匹配条件的全部用户数据数组
   */
  async getUserAll(query = {}) {
    // 解构筛选参数，设置查询字段默认值
    const { username, status, fields = "id,username" } = query;

    // 初始化空条件载体
    const where = {};

    // 有用户名则加入筛选条件
    if (username) where.username = username;
    // status存在值（0/1）才加入筛选，不传则忽略
    if (status !== undefined) where.status = status;

    // 调用Model不分页全量查询方法
    return await UsersModel.allList(where, fields);
  }

  /**
   * findOne 根据主键ID查询单条用户详情
   * @param {number|string} id 用户主键自增ID
   * @returns {Promise<Object|null>}
   *    找到数据返回用户对象；无匹配数据返回null
   */
  async getUserInfo(id) {
    // 调用Model根据主键单条查询方法
    return await UsersModel.findById(id);
  }

  /**
   * create 新增用户业务逻辑
   * @param {Object} userData 前端提交的表单原始数据对象
   * @returns {Promise<number>} 数据库新增成功返回自增主键ID
   * @throws {Error} 用户名重复、密码格式不合法时抛出业务异常
   */
  async addUser(userData) {
    // 浅拷贝表单数据，避免修改外部传入的原始对象，防止污染上层参数
    const saveData = { ...userData };

    // 业务校验1：校验用户名是否已存在（唯一性约束）
    // 查询同用户名全部数据，判断数组长度大于0代表已注册
    const existUser = await UsersModel.allList({ username: saveData.username });
    if (existUser.length > 0) {
      // 校验不通过直接抛出异常，向上传递给Controller捕获返回前端
      throw new Error("该用户名已被注册，请更换用户名。");
    }

    // 业务校验2：密码格式正则校验，仅允许6-16位大小写字母+数字
    const pwdReg = /^[A-Za-z0-9]{6,16}$/;
    if (!pwdReg.test(saveData.password)) {
      throw new Error("密码必须为6-16位字母或数字。");
    }

    // 统一填充公共默认字段（业务层统一处理，前端无需传）
    saveData.createTime = new Date(); // 创建时间为当前系统时间
    // 前端未传递状态时，默认新用户为正常状态1
    if (saveData.status === undefined) {
      saveData.status = 1;
    }
    saveData.isDelete = 0; // 软删除标记，新增数据默认未删除0

    // 调用Model新增方法：内部自动过滤白名单合法字段、使用占位符防注入
    return await UsersModel.create(userData);
  }

  /**
   * update 根据主键ID编辑更新用户信息
   * @param {number|string} id 待更新用户主键ID
   * @param {Object} data 前端提交的待更新字段对象
   * @returns {Promise<number>} affectedRows 受影响行数，0=无匹配数据，>0更新成功
   * @throws {Error} 用户不存在、用户名重复、状态非法、密码格式错误抛异常
   */
  async editUser(id, data) {
    // 浅拷贝更新参数，不污染外部原始对象
    const updateData = { ...data };

    // 业务校验1：先查询目标用户是否存在，不存在直接抛出异常
    const targetUser = await UsersModel.findById(id);
    if (!targetUser) {
      throw new Error("目标用户不存在，更新失败");
    }

    // 业务校验2：如果本次更新包含用户名，校验用户名唯一性（排除自身）
    if (updateData.username) {
      // 查询数据库中所有同名用户
      const sameNameList = await UsersModel.allList({
        username: updateData.username
      });
      // 过滤是否存在其他ID的同名用户
      const hasOtherSameName = sameNameList.some((item) => item.id !== id);
      if (hasOtherSameName) {
        throw new Error("该用户名已被其他用户占用，请更换");
      }
    }

    // 业务校验3：状态值合法性校验，仅允许0/1
    if (updateData.status !== undefined) {
      if (![0, 1].includes(Number(updateData.status))) {
        throw new Error("用户状态仅支持0(禁用)、1(正常)");
      }
    }

    // 业务校验4：如果更新密码，复用密码正则校验格式
    if (updateData.password) {
      const pwdReg = /^[A-Za-z0-9]{6,16}$/;
      if (!pwdReg.test(updateData.password)) {
        throw new Error("密码必须为6-16位字母或数字");
      }
    }

    // 统一填充更新时间字段，记录本次修改时间
    updateData.updateTime = new Date();

    // 调用Model执行更新操作，自动过滤白名单字段、占位符防注入
    const affectRows = await UsersModel.updateById(id, updateData);
    return affectRows;
  }

  /**
   * delete 物理删除用户（直接DELETE数据库数据，谨慎使用）
   * @param {number|string} id 待删除用户主键ID
   * @returns {Promise<number>} 受影响行数，0=无数据，1=删除成功
   */
  async removeUser(id) {
    return await UsersModel.deleteById(id);
  }

  /**
   * updateDelete 软删除用户（逻辑删除，仅修改isDelete标记，保留原始数据）
   * @param {number|string} id 待软删除用户主键ID
   * @returns {Promise<number>} 受影响行数，0=无数据，1=标记更新成功
   */
  async softRemoveUser(id) {
    // 调用Model封装的通用软删除方法，默认更新isDelete=1
    return await UsersModel.updateDeleteById(id);
  }
}

// 全局单例实例导出，路由/控制器直接导入复用，无需重复new实例
module.exports = new UsersService();

```

utils/sql.util.js为过滤合法查询字段：

```js
/**
 * 过滤合法查询字段，防止标识符注入
 * @param {string} inputFields 前端传入字段，逗号分割
 * @param {string[]} allowList 允许字段白名单
 * @returns string
 */
function filterSafeFields(inputFields, allowList) {
  //前端没传参数或为空，undifined，null或直接传过来* ，则，直接放行，无需过滤
  if (!inputFields || inputFields.trim() === "*") return "*";
  //把前端传入字符串按逗号切割为数组，例：id, username, password → ["id"," username"," password"]
  const inputArr = inputFields.split(",").map((item) => item.trim());
  // 将前端传入的数组通过白名单allowlist进行过滤，将不允许的去掉，只保留允许的字段
  const safeArr = inputArr.filter((field) => allowList.includes(field));
  //如果过滤之后，safeAll长度为0，那么用户传入的所有字段全是非法内容
  if (safeArr.length === 0) throw new Error("存在非法查询字段");
  // 返回拼接之后的SQL字符串，例：["id","username"] → "id,username"
  return safeArr.join(",");
}

/**
 * 自动拼接WHERE条件，自动生成?占位符
 * @param {Object} queryObj 条件对象 {username:'xxx', status:1}
 * @returns {whereStr, params}
 */
function buildWhereCondition(queryObj) {
  // 1. 存放每一段条件片段：["?? = ?", "?? = ?"]
  const conditions = [];
  // 2. 存放所有占位符对应参数，按顺序排列
  const params = [];
  // 3. 遍历条件对象每一组键值对
  // 3. 遍历条件对象每一组键值对
  Object.entries(queryObj).forEach(([key, val]) => {
    // 4. 过滤空值、undefined、null，不拼接无效条件
    if (val !== undefined && val !== null && val !== "") {
      // 5. 推入条件片段：?? 代表字段，? 代表值
      conditions.push("?? = ?");
      // 6. 先存字段名，再存对应值，一一对应占位符顺序
      params.push(key, val);
    }
  });

  // 7. 拼接完整 WHERE 语句；无条件则返回空字符串
  const whereStr = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  // 8. 返回组装好的条件字符串 + 对应参数数组
  return { whereStr, params };
}

/**
 * 生成分页 LIMIT 语句
 * @param {number} page 页码，默认第1页
 * @param {number} pageSize 每页条数，默认10条
 * @returns {string} LIMIT 0,10 格式字符串
 */
function buildPageLimit(page = 1, pageSize = 10) {
  // 1. 计算偏移量 offset
  const offset = (page - 1) * pageSize;
  // 2. 拼接 LIMIT 分页语句并返回
  return `LIMIT ${offset}, ${pageSize}`;
}

module.exports = {
  filterSafeFields,
  buildWhereCondition,
  buildPageLimit
};

```

utils/validator.util.js为简单参数校验：

```js
/**
 * 简单参数校验
 * @param {any} value 校验值
 * @param {string} type 类型 number/string
 * @param {string} msg 错误提示
 */
function validateParams(value, type, msg) {
  //检查传入的数据类型和真实传进来的值是否匹配
  if (type === "number" && isNaN(Number(value))) {
    //如果检测不一致，则抛出错误信息
    throw new Error(msg);
  }
  //检查传入的数据类型和真实传进来的值是否匹配
  if (type === "string" && !value) {
    //如果检测不一致，则抛出错误信息
    throw new Error(msg);
  }
}

module.exports = { validateParams };

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
# MYSQL 多环境配置
# MYSQL_DEV_DBHOST：（开发环境）数据库主机IP地址
# MYSQL_DEV_DBPORT：（开发环境）数据库主机端口号
# MYSQL_DEV_USERNAME：（开发环境）登录数据库的用户名
# MYSQL_DEV_PASSWORD：（开发环境）登录数据库的密码
# MYSQL_DEV_DBNAME：（开发环境）数据库名称
# MYSQL_TEST_DBTABLE：（开发环境）表名称

# MYSQL_TEST_DBHOST：（测试环境）数据库主机IP地址
# MYSQL_TEST_DBPORT：（测试环境）数据库主机端口号
# MYSQL_TEST_USERNAME：（测试环境）登录数据库的用户名
# MYSQL_TEST_PASSWORD：（测试环境）登录数据库的密码
# MYSQL_TEST_DBNAME：（测试环境）数据库名称
# MYSQL_TEST_DBTABLE：（测试环境）表名称
# ============================================
MYSQL_DEV_DBHOST=${LOCAL_IP}
MYSQL_DEV_DBPORT=3306
MYSQL_DEV_USERNAME=root
MYSQL_DEV_PASSWORD=123456
MYSQL_DEV_DBNAME=mydb4demo
MYSQL_DEV_DBTABLE=users

MYSQL_TEST_DBHOST=${LOCAL_IP}
MYSQL_TEST_DBPORT=3306
MYSQL_TEST_USERNAME=root
MYSQL_TEST_PASSWORD=123456
MYSQL_TEST_DBNAME=mydb4demo
MYSQL_TEST_DBTABLE=users
```

* server服务层

包含测试程序和基本用法的详细介绍和说明，test.user.service.mysql.js示例：

```js
// 引入路径优化第三方库moudle-alias
require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());
const connectDB = require("@MySQL/models/base/index.js");
const { usersService } = require("@MySQL/service/index.service.js");
// 连接MySQL数据库
connectDB.pool;

/* // 1. findAll测试分页查询用户列表
getUserPage(); */

/* // 2. findAll测试不分页查询用户列表
getUserAll(); */

/* // 3. findOne根据ID进行查找
getUserInfo(); */

/* // 4. Create 新建用户
addUser(); */

/* // 5. Update 更新用户
editUser(); */

/* // 6. removeUser 物理删除用户
removeUser(); */

/* // 7. softRemoveUser 软删除用户
softRemoveUser(); */

async function getUserAll() {
  try {
    const query = {};
    const usersList = await usersService.getUserAll(query);
    console.log("目前数据库人员如下：", usersList);
  } catch (error) {
    console.log("系统出现异常:", error);
  }
}

async function getUserPage() {
  try {
    // 统一分页参数，统一每页2条
    const pageSize = 6;
    let currentPage = 1;
    // 第一页查询参数
    let query = { page: currentPage, pageSize };
    let usersPage = await usersService.getUserPage(query);
    // 计算总页数
    const totalCount = usersPage.total;
    const totalPage = Math.ceil(totalCount / pageSize);
    console.log(
      `===== 第${currentPage}页 / 总条数：${totalCount} / 总页数：${totalPage} =====`
    );
    console.log("当前页数据：", usersPage);
    // 只有总页数大于1，才循环遍历后续页面
    if (totalPage > 1) {
      // 从第2页循环到最后一页
      for (let i = 2; i <= totalPage; i++) {
        // 每次新建查询参数，不重复变量名
        const loopQuery = { page: i, pageSize };
        const pageData = await usersService.getUserPage(loopQuery);
        console.log(`===== 第${i}页 / 总页数：${totalPage} =====`);
        console.log("当前页数据：", pageData);
      }
    }

    console.log("✅ 全部分页数据遍历完成");
  } catch (error) {
    console.log("系统出现异常:", error);
  }
}

async function getUserInfo() {
  try {
    const id = 9;
    const userInfo = await usersService.getUserInfo(id);
    console.log("目前数据库人员如下：", userInfo);
  } catch (error) {
    console.log("系统出现异常", error);
  }
}

async function addUser() {
  try {
    for (let i = 0; i < 10; i++) {
      const userData = { username: `rest0${i}`, password: `admin123456a${i}` };
      const userInfo = await usersService.addUser(userData);
      if (userInfo > 0) {
        console.log("添加成功");
      } else {
        console.log("添加失败");
      }
    }
    getUserAll();
  } catch (error) {
    console.log("当前错误，", error);
  }
}

async function editUser() {
  try {
    const id = 31;
    const data = {
      username: "test074self"
    };
    const userInfo = await usersService.editUser(id, data);
    if (userInfo > 0) {
      console.log("更新成功");
    } else {
      console.log("更新失败");
    }
  } catch (error) {
    console.log("更新出现异常：", error);
  }
}

async function removeUser() {
  try {
    const id = 31;

    const userInfo = await usersService.removeUser(id);
    if (userInfo > 0) {
      console.log("删除成功");
    } else {
      console.log("删除失败");
    }
  } catch (error) {
    console.log("删除出现异常：", error);
  }
}

async function softRemoveUser() {
  try {
    const id = 12;

    const userInfo = await usersService.softRemoveUser(id);
    if (userInfo > 0) {
      console.log("软删除成功");
    } else {
      console.log("软删除失败");
    }
  } catch (error) {
    console.log("软删除出现异常：", error);
  }
}

```

* control 控制层

基本数据，模拟req和res，test4Using/test.user.controller.mysql.js：

```js
// 引入路径优化第三方库moudle-alias
require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());
const connectDB = require("@MySQL/models/base/index.js");
const { usersController } = require("@MySQL/controllers/index.controller.js");
// 连接MySQL数据库
connectDB.pool;

// 模拟req，res
/**
 * 生成模拟 req 请求对象
 * @param {Object} query 模拟URL查询参数 ?username=xxx&status=1
 * @param {Object} params 模拟路径参数 /api/user/1
 * @param {Object} body 模拟POST/PUT提交的JSON表单
 * @returns {Object} 模拟req
 */
function mockReq(query = {}, params = {}, body = {}) {
  return {
    query,
    params,
    body
  };
}

/**
 * 生成模拟 res 响应对象
 * 重写 json 方法，捕获控制器返回的JSON数据并打印
 * @returns {Object} 模拟res，包含捕获结果的缓存
 */
function mockRes() {
  const res = {
    // 缓存接口返回的json数据
    responseData: null,
    json: function (result) {
      this.responseData = result;
      console.log(
        "===== 接口返回JSON结果 =====",
        JSON.stringify(this.responseData, null, 2)
      );
    }
  };
  return res;
}

/**
 * 生成模拟 next 错误中转函数
 * 捕获控制器抛出的所有异常并打印
 * @returns {Function} next(err)
 */
function mockNext() {
  return function (err) {
    console.error("===== 捕获接口异常 =====", err.message);
  };
}

/* // 1. findAll测试分页查询用户列表
getUserPage(); */

/* // 2. findAll测试不分页查询用户列表
getUserAll(); */

/* // 3. findOne根据ID进行查找
getUserInfo(); */

/* // 4. Create 新建用户
addUser(); */

/* // 5. Update 更新用户
editUser(); */

/* // 6. removeUser 物理删除用户
removeUser(); */

/* // 7. softRemoveUser 软删除用户
softRemoveUser(); */

async function getUserAll() {
  const req = mockReq(
    {
      status: 0,
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {},
    {}
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.getUserAll(req, res, next);
}

async function getUserPage() {
  const req = mockReq(
    {
      status: 0,
      page: 1,
      pageSize: 5,
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {},
    {}
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.getUserPage(req, res, next);
}

async function getUserInfo() {
  const req = mockReq(
    {
      status: 0,
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {
      id: 12
    },
    {}
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.getUserInfo(req, res, next);
}

async function addUser() {
  const req = mockReq(
    {
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {},
    {
      username: "xiaodidiao",
      password: "xiaodidiao123321",
      status: 0
    }
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.addUser(req, res, next);
}

async function editUser() {
  const req = mockReq(
    {
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {
      id: 44
    },
    {
      username: "xiaoDiDiaoBei"
    }
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.editUser(req, res, next);
}

async function removeUser() {
  const req = mockReq(
    {
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {
      id: 44
    },
    {}
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.removeUser(req, res, next);
}

async function softRemoveUser() {
  const req = mockReq(
    {
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {
      id: 12
    },
    {}
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.softRemoveUser(req, res, next);
}

```
