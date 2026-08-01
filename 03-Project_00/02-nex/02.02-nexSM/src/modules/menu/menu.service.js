/**
 * 菜单模块 - 业务逻辑层
 */
const menuModel = require('./menu.model');
const { BusinessError } = require('../../middleware/error.middleware');
const { ERROR_CODE } = require('../../constants/errorCode');

class MenuService {
  /**
   * 获取用户菜单树
   * @param {number} userId 用户ID
   * @returns {Promise<Array>} 树形菜单数组
   */
  async getUserMenuTree(userId) {
    // 1. 参数校验
    if (!userId) {
      throw new BusinessError(ERROR_CODE.PARAM_MISSING, '用户ID不能为空');
    }

    // 2. 调用 Model 层获取数据
    const menuTree = await menuModel.findUserMenuTree(userId);

    // 3. 返回结果
    return menuTree;
  }
}

module.exports = new MenuService();