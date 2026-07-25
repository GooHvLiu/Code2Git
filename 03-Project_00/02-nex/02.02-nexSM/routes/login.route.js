var express = require("express");
var router = express.Router();
const tokenAuth = require("@middleware/login.token.auth.help");
// 引入 生成验证码 和 唯一标识 依赖
const svgCaptcha = require("svg-captcha");
const { v4: uuidv4 } = require("uuid");
// 引入jwt
const jwt = require("jsonwebtoken");

// 定义全局存储容器，放在最上方
const captchaStore = new Map();

// 路由 验证码
router.get("/captchaImage", function (req, res, next) {
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

    // 3.1 保存验证码文本，有效期1分钟
    captchaStore.set(uuid, {
      code: cap.text.toLowerCase(),
      expire: Date.now() + 1 * 60 * 1000
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
router.post("/login", function (req, res) {
  const { username, password, code, uuid } = req.body;

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

  // 生成真实JWT Token,可以存放角色、用户id等非敏感信息，不要放密码！
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES = process.env.JWT_EXPIRES;
  const payload = {
    username: username
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  // 验证码&用户名&密码 全部校验成功
  res.json({
    code: 200,
    msg: "登录成功",
    data: {
      token: token
    }
  });
});

// 路由 鉴权接口 （全局中间件已经拦截，也可以局部再次声明）
router.get("/user/info", function (req, res) {
  // 直接使用 req.tokenUser
  console.log(req.tokenUser.userId, req.tokenUser.username);
  res.json({
    code: 200,
    msg: "获取用户信息成功",
    data: {
      userId: req.tokenUser.userId,
      username: req.tokenUser.username,
      nickname: "超级管理员",
      roles: ["admin"],
      permissions: ["*:*:*"]
    }
  });
});

module.exports = router;
