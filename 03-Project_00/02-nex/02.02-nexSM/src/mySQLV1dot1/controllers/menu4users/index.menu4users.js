const { Menu4UsersServer } = require("@services/index.js");

class Menu4UsersController {
  /**
   获取用户动态树形路由
   */
  async getUserRouters(req, res, next) {
    try {
      const userId = req.user.userId;
      const treeData = await Menu4UsersServer.getUserMenuTree(userId);
      res.json({
        code: 200,
        msg: "操作成功",
        data: treeData
      });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new Menu4UsersController();
