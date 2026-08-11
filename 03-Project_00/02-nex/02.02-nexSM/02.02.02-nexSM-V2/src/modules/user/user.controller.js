/**
 * 用户模块 - 控制器层
 * 负责参数接收、调用service、返回响应
 * 参数校验全部由 validate 中间件在路由层完成，这里不做格式校验
 */
const userService = require('./user.service');

class UserController {
  /**
   * 用户登录
   */
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const ip = req.ip || req.connection.remoteAddress;
      const result = await userService.login(username, password, ip);
      res.success(result, '登录成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取当前登录用户信息
   */
  async getCurrentUser(req, res, next) {
    try {
      const userInfo = await userService.getUserById(req.user.id);
      res.success(userInfo);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 分页查询用户列表
   */
  async getUserList(req, res, next) {
    try {
      // req.query 已被 validate 中间件清洗，page/pageSize 都是合法数字
      const result = await userService.getUserList(req.query);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取用户详情
   */
  async getUserDetail(req, res, next) {
    try {
      // req.params.id 已被校验为正整数
      const userInfo = await userService.getUserById(req.params.id);
      res.success(userInfo);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 新增用户
   */
  async createUser(req, res, next) {
    try {
      // req.body 已被 validate 中间件清洗，多余字段已被 stripUnknown 剔除
      const result = await userService.createUser(req.body);
      res.success(result, '新增用户成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 更新用户
   */
  async updateUser(req, res, next) {
    try {
      await userService.updateUser(req.params.id, req.body);
      res.success(null, '更新用户成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      res.success(null, '删除用户成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 批量删除用户
   */
  async batchDeleteUsers(req, res, next) {
    try {
      await userService.batchDeleteUsers(req.body.ids);
      res.success(null, '批量删除成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 修改用户状态
   */
  async updateUserStatus(req, res, next) {
    try {
      await userService.updateUserStatus(req.params.id, req.body.status);
      res.success(null, '状态修改成功');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
