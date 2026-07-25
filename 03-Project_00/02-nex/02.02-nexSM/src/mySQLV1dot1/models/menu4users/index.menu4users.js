const { Menu4usersBase } = require("@MySQL/models/base/index.js");

class Menu4UsersModel {
  /**
   封装完整获取树形菜单对外方法
   @param {number} userId
   @returns {Array} 直接返回树形结构
   */
  async getUserMenuTree(userId) {
    const rawList = await Menu4usersBase.findUserMenuTree(userId);
    return rawList;
  }
}

module.exports = new Menu4UsersModel(
  process.env.MYSQL_DEV_DBNAME,
  process.env.MYSQL_DEV_MENU4USER_DBTABLE
);
