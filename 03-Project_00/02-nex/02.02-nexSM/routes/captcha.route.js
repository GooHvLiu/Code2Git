var express = require("express");
var router = express.Router();
// 引入 生成验证码 和 唯一标识 依赖
const svgCaptcha = require("svg-captcha");
const { v4: uuidv4 } = require("uuid");
// 定义全局存储容器，放在最上方
const captchaStore = new Map();

// 路由 主页
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// 路由 验证码
router.get("/prod-api/captchaImage", function (req, res, next) {
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

    // 3.1 保存验证码文本，有效期5分钟
    captchaStore.set(uuid, {
      code: cap.text.toLowerCase(),
      expire: Date.now() + 5 * 60 * 1000
    });
    // 3.2 自动清理过期验证码（简易方案）
    for (const [key, val] of captchaStore.entries()) {
      if (val.expire < Date.now()) captchaStore.delete(key);
    }

    // 4. 返回你截图相同结构JSON
    res.json({
      code: 200,
      msg: "获取验证码 - 操作成功",
      data: {
        captchaEnabled: true,
        img: cap.data, // svg原始字符串，前端直接赋值给img src
        uuid: uuid
      }
    });
  } catch (error) {
    res.json({
      code: 400,
      msg: "获取验证码 - 操作失败",
      data: error
    });
  }
});

// 路由 登录
router.post("/prod-api/login", function (req, res) {
  const { username, password, code, uuid } = req.body;
  console.log(req.body);

  // 1. 根据uuid查询缓存
  const cacheInfo = captchaStore.get(uuid);

  // 场景1：uuid不存在 / 已过期
  if (!cacheInfo) {
    return res.json({
      code: 400,
      msg: "验证码已失效，请重新获取验证码",
      data: null
    });
  }

  // 场景2：验证码不匹配
  if (cacheInfo.code !== code.toLowerCase()) {
    return res.json({
      code: 400,
      msg: "验证码输入错误",
      data: null
    });
  }

  // 场景3：账号密码校验（模拟）
  if (username !== "admin" || password !== "123456") {
    return res.json({
      code: 400,
      msg: "用户名或者密码错误",
      data: null
    });
  }

  // 验证码 校验通过，删除验证码（防止重复使用）
  captchaStore.delete(uuid);

  // 验证码&用户名&密码 全部校验成功
  res.json({
    code: 200,
    msg: "登录成功",
    data: {
      token: "模拟token字符串"
    }
  });
});

module.exports = router;
