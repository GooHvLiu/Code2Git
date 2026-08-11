// 引入 生成验证码 服务层
const CaptchaService = require("./captcha.service");
const { ERROR_CODE } = require("../../constants/errorCode");

class CaptchaController {
  // 生成 二维码 并直接响应前端
  generateCaptcha(req, res, next) {
    try {
      const data = CaptchaService.generateCaptcha();
      return res.success(data, "获取验证码 - 操作成功")
    } catch (err) {
      next(err);
    }
  }

  // 校验 二维码 不正确的话直接返回给前端
  verifyCaptcha(req, res, next) {
    const { code, uuid } = req.body;
    const data = CaptchaService.verifyCaptcha(code, uuid);
    if (data.code !== ERROR_CODE.SUCCESS) {
      return res.error(data.msg, data.code)
    }
    console.log("二维码验证成功");

    return next();
  }
}
module.exports = new CaptchaController();
