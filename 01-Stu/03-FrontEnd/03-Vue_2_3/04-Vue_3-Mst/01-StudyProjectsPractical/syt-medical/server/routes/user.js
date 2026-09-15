/**
 * 用户路由 - /api/user/...
 * 包含：登录、实名认证、就诊人管理
 */

const express = require("express");
const router = express.Router();
const { users } = require("../data/users");
const { patients, patientIdSeq } = require("../data/patients");
const { success, fail } = require("../utils/response");
const { auth, generateToken } = require("../middlewares/auth");

// ===== 短信验证码（Mock 存在内存） =====
// GET /api/user/msm/send/{phone} 在 msm 路由
// 这里保存验证码
const msmCodes = new Map();

// 导出给 msm 路由用
router.msmCodes = msmCodes;

/**
 * POST /api/user/userInfo/login
 * body: { phone, code }
 * 返回 token 和用户信息
 */
router.post("/userInfo/login", (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return fail(res, "手机号和验证码不能为空");
  }

  // Mock：验证码 111111 直接通过；其他验证码检查 msmCodes
  let codeValid = (code === "111111");
  if (!codeValid) {
    const saved = msmCodes.get(phone);
    if (saved && saved === code) {
      codeValid = true;
      msmCodes.delete(phone);
    }
  }
  if (!codeValid) {
    return fail(res, "验证码错误");
  }

  let user = users.find((u) => u.phone === phone);
  if (!user) {
    // 自动注册新用户
    user = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      username: phone,
      name: "",
      phone,
      certificatesType: null,
      certificatesNo: null,
      sex: null,
      age: null,
      authStatus: 0,
      status: 1,
      openid: null,
      nickName: "用户" + phone.slice(-4),
      avatar: "",
      createTime: new Date().toISOString().replace("T", " ").slice(0, 19),
      updateTime: new Date().toISOString().replace("T", " ").slice(0, 19),
      isDeleted: 0,
    };
    users.push(user);
  }

  if (user.status === 0) {
    return fail(res, "账号已被禁用");
  }

  const token = generateToken(user.id);
  return success(res, { token, name: user.nickName || user.name });
});

/**
 * GET /api/user/userInfo/getUserInfo
 * 获取当前登录用户信息
 */
router.get("/userInfo/getUserInfo", auth, (req, res) => {
  const u = req.currentUser;
  return success(res, {
    id: u.id,
    nickName: u.nickName,
    avatar: u.avatar,
    authStatus: u.authStatus,
    name: u.name,
    certificatesType: u.certificatesType,
    certificatesNo: u.certificatesNo,
    sex: u.sex,
    age: u.age,
    phone: u.phone,
  });
});

/**
 * POST /api/user/userInfo/authUser
 * 实名认证
 * body: { name, certificatesType, certificatesNo, ... }
 */
router.post("/userInfo/authUser", auth, (req, res) => {
  const { name, certificatesType, certificatesNo } = req.body;
  if (!name || !certificatesType || !certificatesNo) {
    return fail(res, "姓名、证件类型、证件号码不能为空");
  }
  const user = req.currentUser;
  user.name = name;
  user.certificatesType = certificatesType;
  user.certificatesNo = certificatesNo;
  user.authStatus = 2; // Mock：直接认证通过
  return success(res, null, "实名认证成功");
});

/**
 * GET /api/user/userInfo/auth/wxLogin
 * 微信扫码登录（Mock 直接走手机号登录流程，此处保留接口）
 */
router.get("/userInfo/auth/wxLogin", (req, res) => {
  return fail(res, "请使用手机号登录");
});

/**
 * POST /api/user/userInfo/logout
 * 退出登录
 */
router.post("/userInfo/logout", auth, (req, res) => {
  const { tokenStore } = require("../middlewares/auth");
  const token = req.headers.token;
  if (token) tokenStore.delete(token);
  return success(res, null, "退出成功");
});

// ===== 就诊人管理 =====

/**
 * GET /api/user/patient/findAll
 * 查询当前用户所有就诊人
 */
router.get("/patient/findAll", auth, (req, res) => {
  const list = patients.filter((p) => p.userId === req.userId && p.isDeleted === 0);
  return success(res, list);
});

/**
 * GET /api/user/patient/get/{id}
 * 根据 id 查询就诊人
 */
router.get("/patient/get/:id", auth, (req, res) => {
  const p = patients.find(
    (x) => x.id == req.params.id && x.userId === req.userId && x.isDeleted === 0
  );
  if (!p) return fail(res, "就诊人不存在");
  return success(res, p);
});

/**
 * POST /api/user/patient/save
 * 新增就诊人
 */
router.post("/patient/save", auth, (req, res) => {
  const body = req.body;
  const p = {
    id: patientIdSeq++,
    userId: req.userId,
    name: body.name,
    certificatesType: body.certificatesType,
    certificatesNo: body.certificatesNo,
    sex: body.sex,
    birthDate: body.birthDate,
    phone: body.phone,
    isInsure: body.isInsure !== undefined ? body.isInsure : 1,
    cardNo: body.cardNo || "",
    address: body.address || "",
    createTime: new Date().toISOString().replace("T", " ").slice(0, 19),
    updateTime: new Date().toISOString().replace("T", " ").slice(0, 19),
    isDeleted: 0,
  };
  patients.push(p);
  return success(res, p.id, "新增成功");
});

/**
 * PUT /api/user/patient/update
 * 修改就诊人
 */
router.put("/patient/update", auth, (req, res) => {
  const body = req.body;
  const p = patients.find(
    (x) => x.id == body.id && x.userId === req.userId && x.isDeleted === 0
  );
  if (!p) return fail(res, "就诊人不存在");
  Object.assign(p, body, {
    updateTime: new Date().toISOString().replace("T", " ").slice(0, 19),
  });
  return success(res, null, "修改成功");
});

/**
 * DELETE /api/user/patient/delete/{id}
 * 删除就诊人
 */
router.delete("/patient/delete/:id", auth, (req, res) => {
  const p = patients.find(
    (x) => x.id == req.params.id && x.userId === req.userId && x.isDeleted === 0
  );
  if (!p) return fail(res, "就诊人不存在");
  p.isDeleted = 1;
  return success(res, null, "删除成功");
});

module.exports = router;
