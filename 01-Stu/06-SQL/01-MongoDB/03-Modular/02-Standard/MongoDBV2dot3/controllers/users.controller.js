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
      const { username, password, rememberMe } = req.body;
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

      // 更新最后登录时间、登录次数
      await usersService.updateById(user._id, {
        lastLogin: new Date(),
        $inc: { loginCount: 1 },
      });

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

      // 记住我Cookie过期逻辑
      if (rememberMe === "on") {
        // 勾选记住我：设置cookie有效期?天，持久化

        req.session.cookie.maxAge = Number(
          process.env.SESSION_REMEMBER_MAX_AGE,
        );
      } else {
        // 不勾选：会话Cookie，关闭浏览器立即失效
        req.session.cookie.maxAge = null;
      }

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
