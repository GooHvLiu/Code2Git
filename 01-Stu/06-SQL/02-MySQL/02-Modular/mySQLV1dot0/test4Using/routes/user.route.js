const express = require("express");
const router = express.Router();
// 完全公开接口
router.get("/test", (req, res) => {
  console.log("访问测试成功");
  res.json({
    code: 201,
    msg: "访问测试成功"
  });
});

module.exports = router;
