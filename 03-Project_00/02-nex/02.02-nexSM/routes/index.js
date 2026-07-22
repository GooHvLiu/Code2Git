var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({
    code: 200,
    msg: "链接成功",
    data: "Success"
  });
});

module.exports = router;
