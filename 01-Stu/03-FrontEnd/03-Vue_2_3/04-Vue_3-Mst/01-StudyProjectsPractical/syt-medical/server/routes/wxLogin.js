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


/* // ========== 微信用户数据（内存存储） 开始 ==========
let wxUserIdSeq = 1;
const wxUsers = new Map();
// ========== 微信用户数据（内存存储） 结束 ========== */

/* // ========== 微信用户数据（Mysql存储） 开始 ==========
const pool = require("../config/db");
// ========== 微信用户数据（Mysql存储） 结束 ========== */

// ========== 微信用户数据（SQLite存储） 开始 ==========
const db = require("../config/db-sqlite");
// ========== 微信用户数据（SQLite存储） 结束 ==========

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

    /* // ========== 查找或创建微信用户（内存存储） 开始 ==========
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
    // ========== 查找或创建微信用户（内存存储） 结束 ==========
 */

    /*     // ========== 查找或创建微信用户（MySQL存储） 开始 ==========
        let [rows] = await pool.execute(
          "SELECT * FROM wx_user WHERE openid = ?",
          [openid]
        );
        let user = rows[0];
    
        if (!user) {
          // 新用户，插入数据库
          const [result] = await pool.execute(
            "INSERT INTO wx_user (openid, nickname) VALUES (?, ?)",
            [openid, nickname || "微信用户"]
          );
          user = {
            id: result.insertId,
            openid,
            nickname: nickname || "微信用户",
          };
        } else if (nickname && !user.nickname) {
          // 老用户更新昵称
          await pool.execute(
            "UPDATE wx_user SET nickname = ? WHERE openid = ?",
            [nickname, openid]
          );
          user.nickname = nickname;
        }
        // ========== 查找或创建微信用户（MySQL存储） 结束 ========== */

    // ========== 查找或创建微信用户（SQLite存储） 开始 ==========
    let user = db.prepare("SELECT * FROM wx_user WHERE openid = ?").get(openid);;

    if (!user) {
      const result = db.prepare(
        "INSERT INTO wx_user (openid, nickname) VALUES (?, ?)"
      ).run(openid, nickname || "微信用户");
      user = {
        id: result.lastInsertRowid,
        openid,
        nickname: nickname || "微信用户",
      };
    } else if (nickname && !user.nickname) {
      db.prepare("UPDATE wx_user SET nickname = ? WHERE openid = ?").run(
        nickname,
        openid
      );
      user.nickname = nickname;
    }
    // ========== 查找或创建微信用户（SQLite存储） 结束 ==========

    return success(res, { userId: user.id }, "扫码确认成功");
  } catch (e) {
    return fail(res, "微信登录失败: " + e.message);
  }
});

/**
 * GET /api/wx/scan/status?uuid=xxx
 * Web端轮询：检查扫码状态
 */
router.get("/scan/status", async (req, res) => {
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

  /*   // ========== 扫码成功，返回用户信息（内存存储） 开始 ==========
    const user = wxUsers.get(session.openid);
    const token = generateToken(user.id);
    // ========== 扫码成功，返回用户信息（内存存储） 结束 ========== */

  /*   // ========== 扫码成功，返回用户信息（MySQL 存储） 开始 ==========
    const [rows] = await pool.execute(
      "SELECT * FROM wx_user WHERE openid = ?",
      [session.openid]
    );
    const user = rows[0];
    const token = generateToken(user.id);
    // ========== 扫码成功，返回用户信息（MySQL 存储） 结束 ========== */

  // ========== 扫码成功，返回用户信息（SQLite 存储） 开始 ==========
  const user = db
    .prepare("SELECT * FROM wx_user WHERE openid = ?")
    .get(session.openid);
  const token = generateToken(user.id);
  // ========== 扫码成功，返回用户信息（SQLite 存储） 结束 ==========

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
