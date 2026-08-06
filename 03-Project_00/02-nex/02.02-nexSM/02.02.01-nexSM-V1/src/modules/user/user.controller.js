/**
 * 用户模块 - 控制器层
 * 负责参数接收、校验、调用service、返回响应
 */
const userService = require('./user.service');
const { validateRequired, isEmpty } = require('../../utils/validator');
const { ERROR_CODE } = require('../../constants/errorCode');

class UserController {
  /**
   * 用户登录
   */
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // 参数校验
      const validate = validateRequired(req.body, ['username', 'password']);
      if (!validate.valid) {
        return res.error(validate.message);
      }

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
      const { id } = req.params;
      if (isEmpty(id)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      const userInfo = await userService.getUserById(id);
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
      // 参数校验
      const validate = validateRequired(req.body, ['username', 'password']);
      if (!validate.valid) {
        return res.error(validate.message);
      }

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
      const { id } = req.params;
      if (isEmpty(id)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await userService.updateUser(id, req.body);
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
      const { id } = req.params;
      if (isEmpty(id)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await userService.deleteUser(id);
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
      const { ids } = req.body;
      if (!ids || ids.length === 0) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await userService.batchDeleteUsers(ids);
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
      const { id } = req.params;
      const { status } = req.body;

      if (isEmpty(id) || isEmpty(status)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await userService.updateUserStatus(id, status);
      res.success(null, '状态修改成功');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
