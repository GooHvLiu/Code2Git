/**
 * 短信路由 - /api/user/msm/...
 * 对应尚医通 service_msm
 */

const express = require("express");
const router = express.Router();
const { success, fail } = require("../utils/response");

// 验证码存在 user 路由的 msmCodes Map 中
const userRouter = require("./user");
const msmCodes = userRouter.msmCodes;

/**
 * GET /api/user/msm/send/{phone}
 * 发送验证码
 * Mock：不真实发送，控制台打印验证码，前端测试直接用 111111
 */
router.get("/send/:phone", (req, res) => {
  const { phone } = req.params;
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return fail(res, "手机号格式不正确");
  }

  // 生成 6 位随机验证码
  const code = String(Math.floor(100000 + Math.random() * 900000));
  msmCodes.set(phone, code);

  // 控制台打印（Mock 环境）
  console.log(`\n[Mock SMS] 给手机号 ${phone} 发送验证码: ${code}`);
  console.log(`[Mock SMS] 测试专用：验证码也可以直接使用 111111\n`);

  return success(res, null, "发送成功");
});

module.exports = router;
