// 引入 生成验证码 和 唯一标识 依赖
const svgCaptcha = require("svg-captcha");
const { v4: uuidv4 } = require("uuid");
// 定义全局存储容器，放在最上方
const captchaStore = new Map();

class CaptchaService {
  generateCaptcha() {
    try {
      // 1. 生成验证码
      const cap = svgCaptcha.create({
        size: 4,
        ignoreChars: "0o1iIl",
        noise: 3,
        width: 120,
        height: 40
      });

      // 2. 创建唯一uuid
      const uuid = uuidv4();

      // 3.1 保存验证码文本，有效期2分钟
      captchaStore.set(uuid, {
        code: cap.text.toLowerCase(),
        expire: Date.now() + 2 * 60 * 1000
      });
      // 3.2 自动清理过期验证码（简易方案）
      for (const [key, val] of captchaStore.entries()) {
        if (val.expire < Date.now()) captchaStore.delete(key);
      }
      // 4. 返回你截图相同结构JSON
      return {
        captchaEnabled: true,
        // svg原始字符串，前端直接赋值给img src
        img: cap.data,
        uuid: uuid
      };
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new CaptchaService();
