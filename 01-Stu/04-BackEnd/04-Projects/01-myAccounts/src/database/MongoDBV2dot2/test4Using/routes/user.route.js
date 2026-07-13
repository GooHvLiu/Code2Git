const express = require("express");
const router = express.Router();
const userCtrl = require("@MongoDB/controllers/users.controller.js");
const {
  authMiddleware,
  adminAuth,
} = require("@MongoDB/middleware/auth.middleware.js");

// 公开接口
router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
// 完全公开接口
router.get("/user", (req, res) => {
  //console.log(req);
  res.json({
    code: 201,
    msg: "访问测试成功",
  });
});

// 需要登录
router.get("/info", authMiddleware, userCtrl.getInfo);

// 需要管理员权限
router.get("/userslist", authMiddleware, adminAuth, userCtrl.getUserList);
router.delete("/:id", authMiddleware, adminAuth, userCtrl.deleteUser);

module.exports = router;
