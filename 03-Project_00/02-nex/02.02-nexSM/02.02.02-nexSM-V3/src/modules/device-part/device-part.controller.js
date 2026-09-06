/**
 * 部件寿命管理 - 控制器层
 * 负责部件模板、部件实例、更换记录的HTTP请求处理
 */

const devicePartService = require('./device-part.service');
const { triggerNotification } = require('../../utils/notification');
const audit = require('../../utils/audit');

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

  /**
   * 获取所有部件模板（用于管理页面）
   * GET /api/v2/device-part/templates/admin
   */
  async getTemplatesForAdmin(req, res, next) {
    try {
      const templates = await devicePartService.getAllTemplatesForAdmin();
      res.json({
        code: 200,
        message: '获取成功',
        data: templates
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取所有基础模板（用于新增模板时选择源模板）
   * GET /api/v2/device-part/templates/base
   */
  async getBaseTemplates(req, res, next) {
    try {
      const templates = await devicePartService.getBaseTemplates();
      res.json({
        code: 200,
        message: '获取成功',
        data: templates
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取模板详情
   * GET /api/v2/device-part/templates/:id
   */
  async getTemplateDetail(req, res, next) {
    try {
      const { id } = req.params;
      const template = await devicePartService.getTemplateById(id);
      res.json({
        code: 200,
        message: '获取成功',
        data: template
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 新增模板
   * POST /api/v2/device-part/templates/add
   */
  async addTemplate(req, res, next) {
    try {
      const operator = req.user ? req.user.username : 'system';
      const template = await devicePartService.addTemplate(req.body, operator);
      
      // 记录审计日志
      await audit.log(audit.ACTION.DEVICE_PART_TEMPLATE_CREATE, {
        operator: operator,
        target: `模板: ${template.template_key}`,
        newValue: JSON.stringify(template)
      });
      
      res.json({
        code: 200,
        message: '新增成功',
        data: template
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 编辑模板
   * PUT /api/v2/device-part/templates/:id
   */
  async updateTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const operator = req.user ? req.user.username : 'system';
      const oldTemplate = await devicePartService.getTemplateById(id);
      const template = await devicePartService.updateTemplate(id, req.body, operator);
      
      // 记录审计日志
      await audit.log(audit.ACTION.DEVICE_PART_TEMPLATE_UPDATE, {
        operator: operator,
        target: `模板: ${template.template_key}`,
        oldValue: JSON.stringify(oldTemplate),
        newValue: JSON.stringify(template)
      });
      
      res.json({
        code: 200,
        message: '更新成功',
        data: template
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除模板
   * DELETE /api/v2/device-part/templates/:id
   */
  async deleteTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const operator = req.user ? req.user.username : 'system';
      const template = await devicePartService.getTemplateById(id);
      await devicePartService.deleteTemplate(id, operator);
      
      // 记录审计日志
      await audit.log(audit.ACTION.DEVICE_PART_TEMPLATE_DELETE, {
        operator: operator,
        target: `模板: ${template.template_key}`,
        oldValue: JSON.stringify(template)
      });
      
      res.json({
        code: 200,
        message: '删除成功'
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
      
      // 记录审计日志：新增部件
      audit.log(req, {
        action: audit.ACTION.DEVICE_PART_CREATE,
        target: `部件编码:${part.part_code}, 模板:${part.template_key}`,
        newValue: JSON.stringify(data),
        result: 'success',
        reason: '管理员添加部件'
      }).catch(err => {
        console.error('[部件寿命-新增] 记录审计日志失败:', err)
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
      
      // 记录审计日志：编辑部件
      audit.log(req, {
        action: audit.ACTION.DEVICE_PART_UPDATE,
        target: `部件ID:${id}, 部件编码:${part.part_code}`,
        newValue: JSON.stringify(data),
        result: 'success',
        reason: '管理员编辑部件'
      }).catch(err => {
        console.error('[部件寿命-编辑] 记录审计日志失败:', err)
      });

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
      
      // 记录审计日志：删除部件
      audit.log(req, {
        action: audit.ACTION.DEVICE_PART_DELETE,
        target: `部件ID:${id}`,
        result: 'success',
        reason: '管理员删除部件'
      }).catch(err => {
        console.error('[部件寿命-删除] 记录审计日志失败:', err)
      });

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
      
      // 记录审计日志：更换部件
      audit.log(req, {
        action: audit.ACTION.DEVICE_PART_REPLACE,
        target: `部件编码:${part.part_code}`,
        oldValue: `旧部件编码:${data.old_code}`,
        newValue: `新部件编码:${data.new_code}, 更换原因:${data.replace_reason}`,
        result: 'success',
        reason: data.replace_reason || '管理员更换部件'
      }).catch(err => {
        console.error('[部件寿命-更换] 记录审计日志失败:', err)
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

