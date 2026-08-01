// 引入 生成验证码 和 唯一标识 依赖 定义全局存储容器，放在最上方
const svgCaptcha = require("svg-captcha");
const { v4: uuidv4 } = require("uuid");
const captchaStore = new Map();

class CaptchaService {
  // 生成一个四位 二维码
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
      // 4. 返回JSON
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
  // 校验 二维码
  verifyCaptcha(code, uuid) {
    // 1. 根据uuid查询缓存
    const cacheInfo = captchaStore.get(uuid);
    // 场景1：uuid不存在 / 已过期
    if (!cacheInfo) {
      return {
        code: 401,
        msg: "验证码已失效，请重新获取验证码",
        data: null
      };
    }

    // 场景2：验证码不匹配
    console.log("实际的二维码：", cacheInfo.code);

    if (cacheInfo.code !== code.toLowerCase()) {
      return {
        code: 402,
        msg: "验证码输入错误",
        data: null
      };
    }
    // 场景3：验证码 校验通过，删除验证码（防止重复使用）
    captchaStore.delete(uuid);
    return {
      code: 200,
      msg: "验证码校验通过",
      data: null
    };
  }
}
module.exports = new CaptchaService();
