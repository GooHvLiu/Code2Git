/**
 * 微信扫码登录路由
 * 前缀：/api/wx
 */
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const wechat = require("../wx/wechat");
const {
  createLoginSession,
  getLoginSession,
  bindOpenid,
} = require("../wx/sessionStore");
const { success, fail } = require("../utils/response");
const { generateToken } = require("../middlewares/auth");


// ========== 微信用户数据（先用内存，后面对接MySQL） ==========
// key: openid, value: { id, openid, nickname, avatar, createTime }
let wxUserIdSeq = 1;
const wxUsers = new Map();

/**
 * GET /api/wx/qrcode
 * Web端请求：获取扫码登录二维码
 */
router.get("/qrcode", async (req, res) => {
  try {
    // 去掉横杠，变成32位 否则会报错：40169
    const uuid = uuidv4().replace(/-/g, "");
    createLoginSession(uuid);
    const png = await wechat.getWxACode(uuid);
    return success(res, {
      uuid,
      qrDataUrl: `data:image/png;base64,${png.toString("base64")}`,
    });
  } catch (e) {
    return fail(res, "获取二维码失败: " + e.message);
  }
});

/**
 * POST /api/wx/login
 * 小程序端上报：wx.login 拿到的 code + 扫码带过来的 uuid
 * body: { code, uuid }
 */
router.post("/login", async (req, res) => {
  const { code, uuid, nickname } = req.body;
  if (!code || !uuid) {
    return fail(res, "参数缺失：code 和 uuid 不能为空");
  }

  const session = getLoginSession(uuid);
  if (!session) {
    return fail(res, "二维码已过期，请刷新页面");
  }

  try {
    // code 换 openid
    const { openid } = await wechat.code2Session(code);

    // 绑定 openid 到会话
    bindOpenid(uuid, openid);

    // 查找或创建微信用户
    let user = wxUsers.get(openid);
    if (!user) {
      user = {
        id: wxUserIdSeq++,
        openid,
        nickname: nickname || "微信用户",
        avatar: "",
        createTime: new Date().toISOString().slice(0, 19),
      };
      wxUsers.set(openid, user);
    } else if (nickname && !user.nickname) {
      // 老用户更新昵称
      user.nickname = nickname;
    }

    return success(res, { userId: user.id }, "扫码确认成功");
  } catch (e) {
    return fail(res, "微信登录失败: " + e.message);
  }
});

/**
 * GET /api/wx/scan/status?uuid=xxx
 * Web端轮询：检查扫码状态
 */
router.get("/scan/status", (req, res) => {
  const { uuid } = req.query;
  if (!uuid) {
    return fail(res, "uuid 不能为空");
  }

  const session = getLoginSession(uuid);
  if (!session || session.status === "expired") {
    return success(res, { status: "expired" });
  }

  if (session.status !== "done") {
    return success(res, { status: "pending" });
  }

  // 扫码成功，返回用户信息
  const user = wxUsers.get(session.openid);
  const token = generateToken(user.id);
  return success(res, {
    status: "done",
    token,
    user: {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      openid: user.openid,
    },
  });

});

module.exports = router;
