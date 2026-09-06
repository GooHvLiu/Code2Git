/**
 * 部件寿命管理 - 路由配置
 */

const express = require('express');
const router = express.Router();
const devicePartController = require('./device-part.controller');
const { requireAuth } = require('../../middleware/auth.middleware');

// 所有路由都需要认证
router.use(requireAuth);

// ==================== 部件模板相关 ====================

/**
 * 获取所有部件模板
 * GET /prod-api/v2/device-part/templates
 */
router.get('/templates', devicePartController.getTemplates);

/**
 * 获取所有部件模板（用于管理页面）
 * GET /prod-api/v2/device-part/templates/admin
 */
router.get('/templates/admin', devicePartController.getTemplatesForAdmin);

/**
 * 获取所有基础模板（用于新增模板时选择源模板）
 * GET /prod-api/v2/device-part/templates/base
 */
router.get('/templates/base', devicePartController.getBaseTemplates);

/**
 * 获取模板详情
 * GET /prod-api/v2/device-part/templates/:id
 */
router.get('/templates/:id', devicePartController.getTemplateDetail);

/**
 * 新增模板
 * POST /prod-api/v2/device-part/templates/add
 */
router.post('/templates/add', devicePartController.addTemplate);

/**
 * 编辑模板
 * PUT /prod-api/v2/device-part/templates/update/:id
 */
router.put('/templates/update/:id', devicePartController.updateTemplate);

/**
 * 删除模板
 * DELETE /prod-api/v2/device-part/templates/delete/:id
 */
router.delete('/templates/delete/:id', devicePartController.deleteTemplate);

// ==================== 部件实例相关 ====================

/**
 * 获取所有部件实例
 * GET /prod-api/v2/device-part/list
 */
router.get('/list', devicePartController.getPartList);

/**
 * 获取部件详情
 * GET /prod-api/v2/device-part/:id
 */
router.get('/:id', devicePartController.getPartDetail);

/**
 * 添加部件实例
 * POST /prod-api/v2/device-part/add
 */
router.post('/add', devicePartController.addPart);

/**
 * 更新部件实例
 * PUT /prod-api/v2/device-part/update/:id
 */
router.put('/update/:id', devicePartController.updatePart);

/**
 * 删除部件实例
 * DELETE /prod-api/v2/device-part/delete/:id
 */
router.delete('/delete/:id', devicePartController.deletePart);

/**
 * 部件更换录入
 * POST /prod-api/v2/device-part/replace/:id
 */
router.post('/replace/:id', devicePartController.replacePart);

// ==================== 使用寿命统计相关 ====================

/**
 * 更新单个部件使用寿命
 * POST /prod-api/v2/device-part/update-life/:id
 */
router.post('/update-life/:id', devicePartController.updateUsedLife);

/**
 * 批量更新所有部件使用寿命（从PLC数据）
 * POST /prod-api/v2/device-part/batch-update-life
 */
router.post('/batch-update-life', devicePartController.batchUpdateUsedLife);

// ==================== 更换记录相关 ====================

/**
 * 获取更换记录列表
 * GET /prod-api/v2/device-part/replace-records/list
 */
router.get('/replace-records/list', devicePartController.getReplaceRecords);

// ==================== 预警相关 ====================

/**
 * 获取需要预警的部件列表
 * GET /prod-api/v2/device-part/warning-parts/list
 */
router.get('/warning-parts/list', devicePartController.getWarningParts);

module.exports = router;
