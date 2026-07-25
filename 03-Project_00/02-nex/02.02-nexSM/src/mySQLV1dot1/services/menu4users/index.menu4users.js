const { Menu4UsersModel } = require("@models/index.js");

/**
 * Menu4Users业务层说明：
 * 1. 获取树形菜单
 */
class Menu4UsersService {
  /**
   封装完整获取树形菜单对外方法
   @param {number} userId
   @returns {Array} 直接返回树形结构
   */
  async getUserMenuTree(userId) {
    const rawList = await Menu4UsersModel.getUserMenuTree(userId);
    return rawList;
  }
}

module.exports = new Menu4UsersService();
