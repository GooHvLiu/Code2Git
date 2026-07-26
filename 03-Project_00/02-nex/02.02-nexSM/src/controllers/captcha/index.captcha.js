// 引入 生成验证码 服务层
const { CaptchaService } = require("@services/index.js");

class CaptchaController {
  // 生成 二维码 并直接响应前端
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

  // 校验 二维码 不正确的话直接返回给前端
  verifyCaptcha(req, res, next){
    const { code, uuid } = req.body;
    const data =CaptchaService.verifyCaptcha(code, uuid);
    if(data.code!=200){
      return res.json(data);
    }
      return data;
  }
}
module.exports = new CaptchaController();
