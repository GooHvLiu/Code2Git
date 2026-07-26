// 引入 生成验证码 和 唯一标识 依赖
const { CaptchaService } = require("@services/index.js");

class CaptchaController {
  // 生成一个四位 二维码并直接响应前端
  generateCaptcha(req, res, next) {
    try {
      const data = CaptchaService.generateCaptcha();
      res.json({
        code: 200,
        msg: "获取验证码 - 操作成功",
        data: data
      });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new CaptchaController();
