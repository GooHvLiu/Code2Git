/**
 * 客户模块 - 业务逻辑层
 */
const CustomerModel = require('./customer.model');
const { hashPassword } = require('../../utils/password');
const { BusinessError } = require('../../middleware/error.middleware');
const { ERROR_CODE } = require('../../constants/errorCode');
const { USER_STATUS } = require('../../constants/statusCode');

class CustomerService {
  /**
   * 分页查询 客户 列表
   * @param {Object} params 查询参数
   * @returns {Promise<Object>}
   */
  async getUserList(params) {
    const where = {};
    if (params.status !== undefined && params.status !== '') {
      where.status = params.status;
    }
    const result = await CustomerModel.getPageList(params, where);
    return result;
  }

  /**
   * 获取 单一客户 详情
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getUserById(id) {
    const user = await CustomerModel.getById(id);
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_EXIST, '客户不存在');
    }
    return user;
  }

  /**
   * 新增 客户
   * @param {Object} data 用户数据
   * @returns {Promise<Object>}
   */
  async createUser(data) {
    // 默认启用状态
    if (data.status === undefined) {
      data.status = USER_STATUS.ENABLED;
    }

    const result = await CustomerModel.create(data);
    return {
      id: result.insertId
    };
  }

  /**
   * 更新 客户
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async updateUser(id, data) {
    // 检查用户是否存在
    const user = await CustomerModel.getById(id);
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_EXIST, '客户不存在');
    }
    await CustomerModel.update(id, data);
  }

  /**
   * 删除 客户
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    const user = await CustomerModel.getById(id);
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_EXIST, '客户不存在');
    }

    await CustomerModel.delete(id);
  }

  /**
   * 批量删除 客户
   * @param {Array} ids
   * @returns {Promise<void>}
   */
  async batchDeleteUsers(ids) {
    if (!ids || ids.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '请选择要删除的信息');
    }
    await CustomerModel.batchDelete(ids);
  }

  /**
   * 修改用户状态
   * @param {number} id
   * @param {number} status
   * @returns {Promise<void>}
   */
  async updateUserStatus(id, status) {
    const user = await CustomerModel.getById(id);
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_EXIST, '客户不存在');
    }

    await CustomerModel.update(id, { status });
  }
}

module.exports = new CustomerService();
