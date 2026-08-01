/**
 * 客户模块 - 控制器层
 * 负责参数接收、校验、调用service、返回响应
 */
const CustomerService = require('./customer.service');
const { idToNameMap } = require('./id2nameMap')
const { validateRequired, isEmpty } = require('../../utils/validator');
const { ERROR_CODE } = require('../../constants/errorCode');

class CustomerController {
  /**
   * 分页查询用户列表
   */
  async getUserList(req, res, next) {
    try {
      const result = await CustomerService.getUserList(req.query);
      // console.log("result", result);

      // 通过 idToNameMap 处理，将原有只有业务员 id 的更改为实际人名
      const newResult = await idToNameMap(result);
      // console.log("newResult", newResult);
      res.success(newResult);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取 指定客户 详情
   */
  async getUserDetail(req, res, next) {
    try {
      const { id } = req.params;
      if (isEmpty(id)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }
      const userInfo = await CustomerService.getUserById(id);
      res.success(userInfo);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 新增 客户
   */
  async createUser(req, res, next) {
    try {
      // 参数校验
      const validate = validateRequired(req.body, ['name']);
      if (!validate.valid) {
        return res.error(validate.message);
      }

      const result = await CustomerService.createUser(req.body);
      res.success(result, '新增 客户 成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 更新 客户
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      if (isEmpty(id)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await CustomerService.updateUser(id, req.body);
      res.success(null, '更新 客户 成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除 客户
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      if (isEmpty(id)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await CustomerService.deleteUser(id);
      res.success(null, '删除 客户 成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 批量删除客户 
   */
  async batchDeleteUsers(req, res, next) {
    try {
      const { ids } = req.body;
      if (!ids || ids.length === 0) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await CustomerService.batchDeleteUsers(ids);
      res.success(null, '批量删除成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 修改 客户 状态
   */
  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (isEmpty(id) || isEmpty(status)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await CustomerService.updateUserStatus(id, status);
      res.success(null, '状态修改成功');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CustomerController();
