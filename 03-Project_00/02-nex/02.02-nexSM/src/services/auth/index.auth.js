const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { UsersModel } = require("@models/index.js");

// 环境变量
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

class AuthService {
  /**
   登录业务：纯业务校验、加密、签发token
   数据库查询全部交给v
   @param {string} username
   @param {string} password
   */
  async login(username, password) {
    // 1. Model拿原始用户数据（只查库，无业务判断）
    const user = await UsersModel.findByName(username);

    // 以下全部为业务逻辑，留在Service
    if (!user) throw new Error("账号不存在");
    if (user.status !== 1) throw new Error("账号已禁用");

    // 密码比对（业务安全逻辑）
    // 生成哈希的方法:密码假定为123456 const hash = bcrypt.hashSync("123456", 10);
    const pwdOk = await bcrypt.compare(password, user.password);

    if (!pwdOk) throw new Error("账号或密码错误");

    // JWT签发（身份业务）
    const token = jwt.sign({ 
      id: user.id,
      username: user.username,
     }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES
    });

    return {
      token,
      userInfo: {
        username: user.username
      }
    };
  }
}

module.exports = new AuthService();
