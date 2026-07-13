const path = require("path");
var express = require("express");
const dayjs = require("dayjs");
const accountsController = require("@MongoDB/controllers/accounts.controller.js");
const myAccountsRouter = express.Router();
const loginAuth =
  require("@middleware/login.session.auth.help.js").checkSessionLogin;
const { getSafeRedirectUrl } = require("@middleware/urlHelper.js");

//ReadAll设置记账本列表路由
myAccountsRouter.get("/", loginAuth, async function (req, res, next) {
  try {
    const resresult = await accountsController.getAccountsListData(req);

    // 判断业务状态码
    if (resresult.type === 1) {
      // 成功：渲染成功页面，可携带创建后的账目数据
      res.render("accountsList", {
        accounts: resresult.data.list,
        page: resresult.data.page, // 当前页码
        limit: resresult.data.limit, // 每页条数
        pages: resresult.data.pages, // 总页数
        total: resresult.data.total, // 总数据量
        userInfo: req.session, // 用户数据
        dayjs: dayjs,
      });
    } else {
      const safeUrl = getSafeRedirectUrl(
        process.env.ACCOUNTSLIST_REDIRECT_URL,
        "error",
      );
      res.render("error", {
        msg: resData.msg,
        error: {
          status: null,
          stack: null,
        },
        url: safeUrl,
      });
    }
  } catch (err) {
    const safeUrl = getSafeRedirectUrl(
      process.env.ACCOUNTSLIST_REDIRECT_URL,
      "error",
    );
    res.render("error", {
      msg: "Read Accounts List Fail.",
      url: safeUrl,
      error: err,
    });
  }
});

//CreateOne创建账目页面路由
myAccountsRouter.get("/create", loginAuth, function (req, res, next) {
  res.render("createAccount");
});

// CreateOne创建账目提交路由 req.body
myAccountsRouter.post(
  "/createAccount",
  loginAuth,
  async function (req, res, next) {
    try {
      const resData = await accountsController.createAccountData(req.body);

      // 判断业务状态码
      if (resData.type === 1) {
        const safeUrl = getSafeRedirectUrl(
          process.env.ACCOUNTSLIST_REDIRECT_URL,
          "success",
        );
        res.render("success", {
          msg: "Create Account Success!",
          url: safeUrl,
          waitTime: process.env.REDIRECT_WAITTIME,
        });
      } else {
        const safeUrl = getSafeRedirectUrl(
          process.env.CREATEACCOUNT_REDIRECT_URL,
          "error",
        );
        res.render("error", {
          msg: resData.msg,
          error: {
            status: null,
            stack: null,
          },
          url: safeUrl,
          waitTime: process.env.REDIRECT_WAITTIME,
        });
      }
    } catch (err) {
      const safeUrl = getSafeRedirectUrl(
        process.env.CREATEACCOUNT_REDIRECT_URL,
        "error",
      );
      res.render("error", {
        msg: "Create Accounts Fail.",
        url: safeUrl,
        error: err,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    }
  },
);

//DeleteOne删除账目路由 req.parms.id
myAccountsRouter.get("/delete/:id", loginAuth, async function (req, res, next) {
  try {
    const delData = await accountsController.deleteAccountData(req);

    if (delData.type === 1) {
      const safeUrl = getSafeRedirectUrl(
        process.env.ACCOUNTSLIST_REDIRECT_URL,
        "success",
      );
      res.render("success", {
        msg: "Delete Account Success!",
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    } else {
      const safeUrl = getSafeRedirectUrl(
        process.env.ACCOUNTSLIST_REDIRECT_URL,
        "error",
      );
      res.render("error", {
        msg: delData.msg,
        error: {
          status: null,
          stack: null,
        },
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    }
  } catch (err) {
    res.render("error", {
      msg: "Delete Accounts Fail.",
      url: process.env.ACCOUNTSLIST_REDIRECT_URL,
      error: err,
      waitTime: process.env.REDIRECT_WAITTIME,
    });
  }
});

//UpdateOne更新账目页面路由 req.parms.id
myAccountsRouter.get("/edit/:id", loginAuth, async function (req, res, next) {
  try {
    const findByIdData = await accountsController.getOneAccountByIdData(
      req.params.id,
    );

    if (findByIdData.type === 1) {
      res.render("editAccount", {
        data: findByIdData.data,
        dayjs: dayjs,
      });
    } else {
      const safeUrl = getSafeRedirectUrl(
        process.env.ACCOUNTSLIST_REDIRECT_URL,
        "error",
      );

      res.render("error", {
        msg: findByIdData.msg,
        error: {
          status: null,
          stack: null,
        },
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    }
  } catch (err) {
    const safeUrl = getSafeRedirectUrl(
      process.env.ACCOUNTSLIST_REDIRECT_URL,
      "error",
    );
    res.render("error", {
      msg: "Open Update Accounts Page Fail.",
      url: safeUrl,
      error: err,
      waitTime: process.env.REDIRECT_WAITTIME,
    });
  }
});

//UpdateOne更新账目提交路由 req.parms.id,req.body
myAccountsRouter.post("/edit/:id", loginAuth, async function (req, res, next) {
  try {
    const UpdateByIdData = await accountsController.updateAccountByIdData(
      req.params.id,
      req.body,
    );
    if (UpdateByIdData.type === 1) {
      const safeUrl = getSafeRedirectUrl(
        process.env.ACCOUNTSLIST_REDIRECT_URL,
        "success",
      );
      res.render("success", {
        msg: "Update Account Success!",
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    }
  } catch (err) {
    const safeUrl = getSafeRedirectUrl(
      process.env.ACCOUNTSLIST_REDIRECT_URL,
      "error",
    );
    res.render("error", {
      msg: "Update Accounts Fail.",
      url: safeUrl,
      error: err,
      waitTime: process.env.REDIRECT_WAITTIME,
    });
  }
});

module.exports = myAccountsRouter;
