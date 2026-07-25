const Menu4UsersBaseModel = require("@MySQL/models/base/menu4users.base.js");

class Menu4UsersModel {
  /**
   封装完整获取树形菜单对外方法
   @param {number} userId
   @returns {Array} 直接返回树形结构
   */
  async getUserMenuTree(userId) {
    const rawList = await Menu4UsersBaseModel.findUserMenuTree(userId);
    return rawList;
  }
}

module.exports = new Menu4UsersModel();
