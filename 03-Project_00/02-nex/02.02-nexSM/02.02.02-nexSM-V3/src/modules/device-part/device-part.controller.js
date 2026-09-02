/**
 * 部件寿命管理 - 控制器层
 * 负责部件模板、部件实例、更换记录的HTTP请求处理
 */

const devicePartService = require('./device-part.service');
const { triggerNotification } = require('../../utils/notification');

class DevicePartController {
  // ==================== 部件模板相关 ====================

  /**
   * 获取所有部件模板
   * GET /api/v2/device-part/templates
   */
  async getTemplates(req, res, next) {
    try {
      const templates = await devicePartService.getAllTemplates();
      res.json({
        code: 200,
        message: '获取成功',
        data: templates
      });
    } catch (err) {
      next(err);
    }
  }

  // ==================== 部件实例相关 ====================

  /**
   * 获取所有部件实例
   * GET /api/v2/device-part/list
   */
  async getPartList(req, res, next) {
    try {
      const parts = await devicePartService.getAllParts();
      res.json({
        code: 200,
        message: '获取成功',
        data: parts
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取部件详情
   * GET /api/v2/device-part/:id
   */
  async getPartDetail(req, res, next) {
    try {
      const { id } = req.params;
      const part = await devicePartService.getPartById(id);
      res.json({
        code: 200,
        message: '获取成功',
        data: part
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 添加部件实例
   * POST /api/v2/device-part/add
   */
  async addPart(req, res, next) {
    try {
      const data = req.body;
      const operator = req.user;
      const part = await devicePartService.addPart(data, operator);
      
      // 触发通知
      triggerNotification('device.part.add', {
        part_code: part.part_code,
        template_key: part.template_key
      }, operator ? operator.id : null).catch(err => {
        console.error('[部件寿命] 触发通知失败:', err.message);
      });
      
      res.json({
        code: 200,
        message: '添加成功',
        data: part
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 更新部件实例
   * PUT /api/v2/device-part/update/:id
   */
  async updatePart(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const operator = req.user;
      const part = await devicePartService.updatePart(id, data, operator);
      
      res.json({
        code: 200,
        message: '更新成功',
        data: part
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除部件实例
   * DELETE /api/v2/device-part/delete/:id
   */
  async deletePart(req, res, next) {
    try {
      const { id } = req.params;
      const operator = req.user;
      await devicePartService.deletePart(id, operator);
      
      res.json({
        code: 200,
        message: '删除成功'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 部件更换录入
   * POST /api/v2/device-part/replace/:id
   */
  async replacePart(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const operator = req.user;
      const part = await devicePartService.replacePart(id, data, operator);
      
      // 触发通知
      triggerNotification('device.part.replace', {
        part_code: part.part_code,
        old_code: data.old_code,
        new_code: data.new_code,
        replace_reason: data.replace_reason
      }, operator ? operator.id : null).catch(err => {
        console.error('[部件寿命] 触发通知失败:', err.message);
      });
      
      res.json({
        code: 200,
        message: '更换成功',
        data: part
      });
    } catch (err) {
      next(err);
    }
  }

  // ==================== 使用寿命统计相关 ====================

  /**
   * 更新单个部件使用寿命
   * POST /api/v2/device-part/update-life/:id
   */
  async updateUsedLife(req, res, next) {
    try {
      const { id } = req.params;
      const { plc_value } = req.body;
      const result = await devicePartService.updateUsedLife(id, plc_value);
      
      res.json({
        code: 200,
        message: '更新成功',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 批量更新所有部件使用寿命（从PLC数据）
   * POST /api/v2/device-part/batch-update-life
   */
  async batchUpdateUsedLife(req, res, next) {
    try {
      const { plc_data } = req.body;
      const results = await devicePartService.batchUpdateUsedLife(plc_data);
      
      res.json({
        code: 200,
        message: '批量更新成功',
        data: results
      });
    } catch (err) {
      next(err);
    }
  }

  // ==================== 更换记录相关 ====================

  /**
   * 获取更换记录列表
   * GET /api/v2/device-part/replace-records
   */
  async getReplaceRecords(req, res, next) {
    try {
      const { page = 1, pageSize = 20, template_key, part_id } = req.query;
      const result = await devicePartService.getReplaceRecords({
        page: Number(page),
        pageSize: Number(pageSize),
        templateKey: template_key,
        partId: part_id ? Number(part_id) : null
      });
      
      res.json({
        code: 200,
        message: '获取成功',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  // ==================== 预警相关 ====================

  /**
   * 获取需要预警的部件列表
   * GET /api/v2/device-part/warning-parts
   */
  async getWarningParts(req, res, next) {
    try {
      const { threshold = 20 } = req.query;
      const parts = await devicePartService.getWarningParts(Number(threshold));
      
      res.json({
        code: 200,
        message: '获取成功',
        data: parts
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DevicePartController();
