const express = require('express');
const router = express.Router();
const menuController = require('./menu.controller');
const { requireAuth } = require('../../middleware/auth.middleware');

// 需要登录的接口
router.use(requireAuth);

// 获取菜单最新版本号
router.get('/version', menuController.getVersion);

// 获取登录用户的菜单路由（支持版本号缓存）
router.get('/routers', menuController.getRouters);

// ==================== 菜单配置管理相关路由 ====================

// 获取所有菜单树（用于菜单配置页面）
router.get('/admin/tree', menuController.getAdminMenuTree);

// 创建菜单
router.post('/admin', menuController.createMenu);

// 更新菜单
router.put('/admin/:id', menuController.updateMenu);

// 删除菜单
router.delete('/admin/:id', menuController.deleteMenu);

// 拖拽菜单
router.put('/admin/:id/drag', menuController.dragMenu);

// 批量保存菜单修改
router.post('/admin/batch-save', menuController.batchSaveChanges);

// ==================== 备份管理相关路由 ====================

// 获取备份目录配置
router.get('/admin/backup/dir', menuController.getBackupDir);

// 设置备份目录
router.put('/admin/backup/dir', menuController.setBackupDir);

// 创建备份
router.post('/admin/backup', menuController.createBackup);

// 获取备份列表
router.get('/admin/backup/list', menuController.getBackupList);

// 恢复备份
router.post('/admin/backup/restore', menuController.restoreBackup);

// 删除备份
router.delete('/admin/backup/:fileName', menuController.deleteBackup);

module.exports = router;
