/**
 * 客户模块 - 控制器层
 * 负责参数接收、调用service、返回响应
 * 参数校验全部由 validate 中间件在路由层完成，这里不做格式校验
 */
const CustomerService = require('./customer.service');
const { idToNameMap } = require('./id2nameMap');

class CustomerController {
  /**
   * 分页查询客户列表
   */
  async getUserList(req, res, next) {
    try {
      // req.query 已被 validate 中间件清洗
      const result = await CustomerService.getUserList(req.query);
      // 通过 idToNameMap 处理，将业务员 id 转换为实际人名
      const newResult = await idToNameMap(result);
      res.success(newResult);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取指定客户详情
   */
  async getUserDetail(req, res, next) {
    try {
      // req.params.id 已被校验为正整数
      const userInfo = await CustomerService.getUserById(req.params.id);
      res.success(userInfo);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 新增客户
   */
  async createUser(req, res, next) {
    try {
      // req.body 已被 validate 中间件清洗，多余字段已被 stripUnknown 剔除
      const result = await CustomerService.createUser(req.body);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 更新客户
   */
  async updateUser(req, res, next) {
    try {
      await CustomerService.updateUser(req.params.id, req.body);
      res.success(null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除客户
   */
  async deleteUser(req, res, next) {
    try {
      await CustomerService.deleteUser(req.params.id);
      res.success(null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 批量删除客户
   */
  async batchDeleteUsers(req, res, next) {
    try {
      // req.body.ids 已被校验为非空数组
      await CustomerService.batchDeleteUsers(req.body.ids);
      res.success(null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 修改客户状态
   */
  async updateUserStatus(req, res, next) {
    try {
      await CustomerService.updateUserStatus(req.params.id, req.body.status);
      res.success(null);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CustomerController();
