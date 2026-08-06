var express = require("express");
var router = express.Router();

// 测试连接状态路由
router.get("/", function (req, res, next) {
  return res.success({ State: "Connected Success." }, "成功连接服务器")

});

module.exports = router;
