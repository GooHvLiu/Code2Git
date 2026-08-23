/**
 * {{name}} 模块 - 控制器层
 * 自动生成，根据业务需求补充参数校验
 */
const {{name}}Service = require('./{{name}}.service');
const { validateRequired, isEmpty } = require('../../utils/validator');
const { ERROR_CODE } = require('../../constants/errorCode');

class {{Name}}Controller {
  /**
   * 分页查询列表
   */
  async getList(req, res, next) {
    try {
      const result = await {{name}}Service.getList(req.query);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取详情
   */
  async getDetail(req, res, next) {
    try {
      const { id } = req.params;
      if (isEmpty(id)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      const data = await {{name}}Service.getById(id);
      res.success(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 新增
   */
  async create(req, res, next) {
    try {
      // TODO: 补充必填参数校验
      // const validate = validateRequired(req.body, ['name']);
      // if (!validate.valid) {
      //   return res.error(validate.message);
      // }

      const result = await {{name}}Service.create(req.body);
      res.success(result, '新增成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 更新
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      if (isEmpty(id)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await {{name}}Service.update(id, req.body);
      res.success(null, '更新成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      if (isEmpty(id)) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await {{name}}Service.delete(id);
      res.success(null, '删除成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 批量删除
   */
  async batchDelete(req, res, next) {
    try {
      const { ids } = req.body;
      if (!ids || ids.length === 0) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }

      await {{name}}Service.batchDelete(ids);
      res.success(null, '批量删除成功');
    } catch (err) {
      next(err);
    }
  }

  // ==================== 自定义接口 ====================
  // 在此处添加 {{name}} 模块专属接口

}

module.exports = new {{Name}}Controller();
