/**
 * 数据库管理路由
 */
const express = require('express');
const router = express.Router();
const dbManagerController = require('./db-manager.controller');
const { requireAuth } = require('../../middleware/auth.middleware');
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware');

// 需要登录的接口
router.use(requireAuth);

// 所有数据库管理接口都需要超级管理员权限
router.use(requireSuperAdmin);

// 数据查看
router.get('/tables', dbManagerController.getAllTables);
router.get('/tables/:tableName/structure', dbManagerController.getTableStructure);
router.get('/tables/:tableName/data', dbManagerController.getTableData);

// 配置表编辑
router.put('/tables/:tableName/data', dbManagerController.updateTableData);
router.post('/tables/:tableName/data', dbManagerController.insertTableData);
router.delete('/tables/:tableName/data', dbManagerController.deleteTableData);

// 版本备份
router.post('/backup', dbManagerController.createBackup);
router.get('/backup', dbManagerController.getBackupList);
router.get('/backup/:id', dbManagerController.getBackupById);
router.delete('/backup/:id', dbManagerController.deleteBackup);

// 回滚
router.post('/backup/:id/restore', dbManagerController.restoreBackup);

module.exports = router;
