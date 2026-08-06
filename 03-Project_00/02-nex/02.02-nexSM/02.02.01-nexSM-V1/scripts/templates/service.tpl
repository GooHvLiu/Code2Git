/**
 * {{name}} 模块 - 业务逻辑层
 * 自动生成，根据业务需求补充逻辑
 */
const {{name}}Model = require('./{{name}}.model');
const { BusinessError } = require('../../middleware/error.middleware');
const { ERROR_CODE } = require('../../constants/errorCode');

class {{Name}}Service {
  /**
   * 分页查询列表
   * @param {Object} params 查询参数
   * @returns {Promise<Object>}
   */
  async getList(params) {
    const where = {};
    // TODO: 根据业务需求添加查询条件
    // if (params.status !== undefined && params.status !== '') {
    //   where.status = params.status;
    // }

    return await {{name}}Model.getPageList(params, where);
  }

  /**
   * 获取详情
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const data = await {{name}}Model.getById(id);
    if (!data) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '数据不存在');
    }
    return data;
  }

  /**
   * 新增
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    // TODO: 新增前的业务校验
    const result = await {{name}}Model.create(data);
    return {
      id: result.insertId
    };
  }

  /**
   * 更新
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async update(id, data) {
    const exist = await {{name}}Model.getById(id);
    if (!exist) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '数据不存在');
    }

    // TODO: 更新前的业务校验
    await {{name}}Model.update(id, data);
  }

  /**
   * 删除
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    const exist = await {{name}}Model.getById(id);
    if (!exist) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '数据不存在');
    }

    // TODO: 删除前的业务校验
    await {{name}}Model.delete(id);
  }

  /**
   * 批量删除
   * @param {Array} ids
   * @returns {Promise<void>}
   */
  async batchDelete(ids) {
    if (!ids || ids.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '请选择要删除的数据');
    }
    await {{name}}Model.batchDelete(ids);
  }

  // ==================== 自定义业务方法 ====================
  // 在此处添加 {{name}} 模块专属业务方法

}

module.exports = new {{Name}}Service();
