/**
 * 菜单模块 - 业务逻辑层
 */
const menuModel = require('./menu.model');
const { BusinessError } = require('../../middleware/error.middleware');
const { ERROR_CODE } = require('../../constants/errorCode');

class MenuService {
  /**
   * 获取菜单最新版本号
   * @returns {Promise<string|null>}
   */
  async getMenuVersion() {
    return await menuModel.getMenuVersion();
  }

  /**
   * 带版本号的菜单查询
   * @param {number} userId 用户ID
   * @param {string} version 前端缓存的版本号
   * @param {string} lang 语言代码
   * @returns {Promise<{tree: Array, version: string}|null>}
   */
  async getUserMenuTreeWithVersion(userId, version, lang = 'zh-CN') {
    if (!userId) {
      throw new BusinessError(ERROR_CODE.PARAM_MISSING, '用户ID不能为空');
    }
    return await menuModel.findUserMenuTreeWithVersion(userId, version, lang);
  }
}

module.exports = new MenuService();