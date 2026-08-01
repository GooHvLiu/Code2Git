/**
 * 菜单模块 - 控制器层
 * 负责：参数接收、调用service、返回响应
 */
const menuService = require('./menu.service');

class MenuController {
  /**
   * 获取登录用户的动态菜单路由
   * 接口：GET /api/menu/getRouters
   */
  async getRouters(req, res, next) {
    try {
      // 从鉴权中间件挂载的 req.user 中获取用户ID
      const userId = req.user.id;

      // 调用业务层获取菜单树
      const menuTree = await menuService.getUserMenuTree(userId);

      // 统一成功响应
      res.success(menuTree, '获取成功');
    } catch (err) {
      // 异常交给全局错误中间件处理
      next(err);
    }
  }
}

module.exports = new MenuController();