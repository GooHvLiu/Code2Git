/**
 * 菜单模块 - 控制器层
 * 负责：参数接收、调用service、返回响应
 */
const menuService = require('./menu.service');
const { ERROR_CODE } = require('../../constants/errorCode');

class MenuController {
  /**
   * 获取登录用户的动态菜单路由（支持版本号缓存 + 多语言）
   * 接口：GET /api/menu/getRouters?version=xxx&lang=en-US
   */
  async getRouters(req, res, next) {
    try {
      const userId = req.user.id;
      const version = req.query.version;
      const lang = req.query.lang || 'zh-CN';

      const result = await menuService.getUserMenuTreeWithVersion(userId, version, lang);

      // 菜单未变更，返回 10304
      if (result === null) {
        return res.success(null, '菜单未变更', ERROR_CODE.MENU_NOT_MODIFIED);
      }

      // 返回菜单树 + 最新版本号
      res.success({ menu: result.tree, version: result.version }, '获取成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取菜单最新版本号
   * 接口：GET /api/menu/version
   */
  async getVersion(req, res, next) {
    try {
      const version = await menuService.getMenuVersion();
      res.success({ version }, '获取成功');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MenuController();
