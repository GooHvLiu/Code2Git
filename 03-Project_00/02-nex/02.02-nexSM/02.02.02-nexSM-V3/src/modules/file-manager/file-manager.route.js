/**
 * 文件管理模块 - 路由层
 * 仅超级管理员可访问
 */
const express = require('express');
const router = express.Router();
const fileManagerController = require('./file-manager.controller');
const { requireAuth } = require('../../middleware/auth.middleware');
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware');

// 获取可编辑的配置文件列表
router.get('/files', requireAuth, requireSuperAdmin, fileManagerController.getFileList);

// 获取备份目录路径
router.get('/backup-dir', requireAuth, requireSuperAdmin, fileManagerController.getBackupDir);

// 修改备份目录路径
router.post('/backup-dir', requireAuth, requireSuperAdmin, fileManagerController.setBackupDir);

// 读取指定文件的内容
router.get('/file/read', requireAuth, requireSuperAdmin, fileManagerController.readFile);

// 写入文件内容（修改前自动备份）
router.post('/file/write', requireAuth, requireSuperAdmin, fileManagerController.writeFile);

// 获取指定文件的备份列表
router.get('/backups', requireAuth, requireSuperAdmin, fileManagerController.getBackupList);

// 读取备份文件内容
router.get('/backup/read', requireAuth, requireSuperAdmin, fileManagerController.readBackup);

// 回滚到指定备份版本
router.post('/backup/restore', requireAuth, requireSuperAdmin, fileManagerController.restoreBackup);

// 删除指定备份
router.post('/backup/delete', requireAuth, requireSuperAdmin, fileManagerController.deleteBackup);

// 语法检查
router.post('/check-syntax', requireAuth, requireSuperAdmin, fileManagerController.checkSyntax);

module.exports = router;
