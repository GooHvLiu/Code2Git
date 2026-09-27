/**
 * 短信路由 - /api/user/msm/...
 * 对应尚医通 service_msm
 *
 * 大厂规范：
 * - POST 请求，body 传 { phone }
 * - 严格手机号格式校验
 * - 60秒发送频率限制
 * - 每手机号每日10次上限
 * - 验证码5分钟过期
 * - Mock 环境响应中返回验证码（仅用于测试）
 */

const express = require("express");
const router = express.Router();
const { success, fail } = require("../utils/response");

// 验证码存储（与 user 路由共享）
// 结构：{ code: "111111", expireAt: 1234567890 }
const userRouter = require("./user");
const msmCodes = userRouter.msmCodes;

// ===== 频率限制存储（内存） =====
// 最近一次发送时间：phone -> timestamp
const lastSendTime = new Map();
// 今日发送次数：phone -> { date: "2026-09-27", count: 3 }
const dailyCount = new Map();

// ===== 常量配置 =====
const SMS_CONFIG = {
  CODE_LENGTH: 6,
  FIXED_CODE: "111111",       // Mock 环境固定验证码
  EXPIRE_SECONDS: 300,        // 验证码5分钟过期
  RESEND_INTERVAL: 60,        // 60秒内不能重复发送
  DAILY_LIMIT: 10,            // 每手机号每天最多10次
  PHONE_REGEX: /^1[3-9]\d{9}$/,
};

/**
 * 校验手机号格式
 */
function isValidPhone(phone) {
  return typeof phone === "string" && SMS_CONFIG.PHONE_REGEX.test(phone);
}

/**
 * 获取今日日期字符串
 */
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 检查发送频率限制
 * 返回 { allowed: boolean, reason?: string, waitSeconds?: number }
 */
function checkRateLimit(phone) {
  const now = Date.now();

  // 1. 60秒频率限制
  const last = lastSendTime.get(phone);
  if (last) {
    const elapsed = Math.floor((now - last) / 1000);
    if (elapsed < SMS_CONFIG.RESEND_INTERVAL) {
      return {
        allowed: false,
        reason: `发送过于频繁，请${SMS_CONFIG.RESEND_INTERVAL - elapsed}秒后重试`,
        waitSeconds: SMS_CONFIG.RESEND_INTERVAL - elapsed,
      };
    }
  }

  // 2. 每日次数限制
  const today = getToday();
  const record = dailyCount.get(phone);
  if (record && record.date === today) {
    if (record.count >= SMS_CONFIG.DAILY_LIMIT) {
      return {
        allowed: false,
        reason: `今日验证码发送次数已达上限（${SMS_CONFIG.DAILY_LIMIT}次），请明天再试`,
      };
    }
  }

  return { allowed: true };
}

/**
 * 记录发送（更新频率限制）
 */
function recordSend(phone) {
  const now = Date.now();
  const today = getToday();

  lastSendTime.set(phone, now);

  const record = dailyCount.get(phone);
  if (record && record.date === today) {
    record.count++;
  } else {
    dailyCount.set(phone, { date: today, count: 1 });
  }
}

/**
 * 生成并存储验证码
 */
function generateAndStoreCode(phone) {
  const code = SMS_CONFIG.FIXED_CODE;
  const expireAt = Date.now() + SMS_CONFIG.EXPIRE_SECONDS * 1000;

  msmCodes.set(phone, { code, expireAt });

  // Mock 环境：控制台打印
  console.log("\n========================================");
  console.log(`[Mock SMS] 手机号: ${phone}`);
  console.log(`[Mock SMS] 验证码: ${code}`);
  console.log(`[Mock SMS] 有效期: ${SMS_CONFIG.EXPIRE_SECONDS / 60}分钟`);
  console.log(`[Mock SMS] 测试提示: 固定验证码 111111 始终可用`);
  console.log("========================================\n");

  return code;
}

/**
 * POST /api/user/msm/send
 * 发送短信验证码（标准大厂接口）
 * body: { phone: "13800000001" }
 */
router.post("/send", (req, res) => {
  const { phone } = req.body;

  // 1. 参数必填校验
  if (!phone) {
    return fail(res, "手机号不能为空");
  }

  // 2. 手机号格式校验
  if (!isValidPhone(phone)) {
    return fail(res, "手机号格式不正确，请输入11位有效手机号");
  }

  // 3. 频率限制检查
  const rateCheck = checkRateLimit(phone);
  if (!rateCheck.allowed) {
    return fail(res, rateCheck.reason);
  }

  // 4. 生成验证码
  const code = generateAndStoreCode(phone);

  // 5. 记录发送
  recordSend(phone);

  // 6. 返回成功（Mock 环境返回验证码，仅用于测试）
  return success(res, { code }, "验证码发送成功，请注意查收（仅用于测试）");
});

/**
 * GET /api/user/msm/send/{phone}
 * 兼容旧版接口（已废弃，建议使用 POST /send）
 */
router.get("/send/:phone", (req, res) => {
  const { phone } = req.params;

  if (!isValidPhone(phone)) {
    return fail(res, "手机号格式不正确，请输入11位有效手机号");
  }

  const rateCheck = checkRateLimit(phone);
  if (!rateCheck.allowed) {
    return fail(res, rateCheck.reason);
  }

  const code = generateAndStoreCode(phone);
  recordSend(phone);

  return success(res, { code }, "验证码发送成功，请注意查收（仅用于测试）");
});

module.exports = router;
