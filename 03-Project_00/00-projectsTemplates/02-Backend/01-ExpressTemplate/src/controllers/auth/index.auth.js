const { AuthService } = require("@services/index.js");
const { validateParams } = require("@utils/validator.util.js");

class AuthController {
  /**
   登录接口 POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      validateParams(username, "string", "登录账号不能为空");
      validateParams(password, "string", "登录密码不能为空");
      const loginData = await AuthService.login(username, password);
      res.json({
        code: 200,
        msg: "登录成功",
        data: loginData
      });
    } catch (err) {
      res.json({
        code: 400,
        msg: "登录失败",
        data: err
      });
      return next(err);
    }
  }
}
module.exports = new AuthController();
