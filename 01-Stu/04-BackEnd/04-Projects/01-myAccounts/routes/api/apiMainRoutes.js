const path = require("path");
var express = require("express");
const dayjs = require("dayjs");
const accountsController = require("@MongoDB/controllers/accounts.controller.js");
const loginAuth =
  require("@middleware/login.token.auth.help.js").checkTokenAuth;
var router = express.Router();

//ReadAll读取记账本列表路由  数据库直接返回前端需求 0000/1001/1002
router.get("/myAccounts", loginAuth, async function (req, res, next) {
  try {
    await accountsController.getAccountsList(req, res);
  } catch (err) {
    res.json({
      code: "1002",
      msg: "程序异常报错",
      data: err,
    });
  }
});

//CreateOne创建账目提交路由  数据库直接返回前端需求  req.body 0000/1101/1102
router.post("/createAccount", loginAuth, async function (req, res, next) {
  try {
    await accountsController.createAccount(req, res);
  } catch (err) {
    // 兜底捕获意外异常（controller内部理论不会走到这里）
    res.json({
      code: "1101",
      msg: "程序异常报错",
      data: globalErr,
    });
  }
});

//DeleteOne删除账目路由  数据库直接返回前端需求   req.parms.id 0000/1201/1202
router.delete("/delete/:id", loginAuth, async function (req, res, next) {
  try {
    await accountsController.deleteAccount(req, res);
  } catch (error) {
    res.json({
      code: "1202",
      msg: "程序异常报错",
      data: error,
    });
  }
});

//UpdateOne更新账目提交路由 req.parms.id,req.body 0000/1301/1302
router.patch("/edit/:id", loginAuth, async function (req, res, next) {
  try {
    await accountsController.updateAccountById(req, res);
  } catch (error) {
    res.json({
      code: "1202",
      msg: "程序异常报错",
      data: error,
    });
  }
});

//ReadOne读取某一记账本的账目路由  数据库直接返回前端需求 0000/1401/1402
router.get("/account/:id", loginAuth, async function (req, res, next) {
  try {
    await accountsController.getOneAccountById(req, res);
  } catch (err) {
    res.json({
      code: "1002",
      msg: "程序异常报错",
      data: err,
    });
  }
});

module.exports = router;
