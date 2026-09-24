/**
 * 菜单管理模块 - 路由层
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const menuController = require('./menu.controller');
const { requireAuth } = require('../../middleware/auth.middleware');

// 需要登录的接口
router.use(requireAuth);

/**
 * @openapi
 * /menu/version:
 *   get:
 *     tags: [菜单管理]
 *     summary: 获取菜单最新版本号（前端缓存用）
 *     responses:
 *       200:
 *         description: 菜单版本
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         version: { type: string, example: '20260924120000' }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
router.get('/version', menuController.getVersion);

/**
 * @openapi
 * /menu/routers:
 *   get:
 *     tags: [菜单管理]
 *     summary: 获取当前登录用户的动态菜单路由
 *     description: 根据用户角色返回可访问的路由树，支持版本号缓存（If-None-Match）。
 *     parameters:
 *       - in: query
 *         name: version
 *         schema: { type: string }
 *         description: 本地菜单版本号，一致时返回 10304 缓存命中
 *     responses:
 *       200:
 *         description: 用户路由树
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Menu' }
 */
router.get('/routers', menuController.getRouters);

// ==================== 菜单配置管理相关路由 ====================

/**
 * @openapi
 * /menu/admin/tree:
 *   get:
 *     tags: [菜单管理]
 *     summary: 获取全部菜单树（菜单配置页）
 *     responses:
 *       200:
 *         description: 菜单树
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: array, items: { $ref: '#/components/schemas/Menu' } }
 */
router.get('/admin/tree', menuController.getAdminMenuTree);

/**
 * @openapi
 * /menu/admin:
 *   post:
 *     tags: [菜单管理]
 *     summary: 创建菜单
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, path, type]
 *             properties:
 *               parentId: { type: integer, example: 0 }
 *               name: { type: string, example: '系统管理' }
 *               path: { type: string, example: '/system' }
 *               component: { type: string }
 *               icon: { type: string }
 *               sort: { type: integer }
 *               type: { type: integer, enum: [1, 2, 3] }
 *               perms: { type: string }
 *               visible: { type: integer, enum: [0, 1] }
 *           example: { parentId: 0, name: '系统管理', path: '/system', type: 1, icon: 'setting' }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/admin', menuController.createMenu);

/**
 * @openapi
 * /menu/admin/{id}:
 *   put:
 *     tags: [菜单管理]
 *     summary: 更新菜单
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 菜单字段
 *           example: { name: '系统设置', icon: 'tools' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/admin/:id', menuController.updateMenu);

/**
 * @openapi
 * /menu/admin/{id}:
 *   delete:
 *     tags: [菜单管理]
 *     summary: 删除菜单
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.delete('/admin/:id', menuController.deleteMenu);

/**
 * @openapi
 * /menu/admin/{id}/drag:
 *   put:
 *     tags: [菜单管理]
 *     summary: 拖拽排序菜单
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetParentId: { type: integer }
 *               targetSort: { type: integer }
 *           example: { targetParentId: 0, targetSort: 2 }
 *     responses:
 *       200:
 *         description: 拖拽成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/admin/:id/drag', menuController.dragMenu);

/**
 * @openapi
 * /menu/admin/batch-save:
 *   post:
 *     tags: [菜单管理]
 *     summary: 批量保存菜单修改
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               changes:
 *                 type: array
 *                 items: { type: object }
 *           example: { changes: [{ id: 1, sort: 3 }] }
 *     responses:
 *       200:
 *         description: 保存成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/admin/batch-save', menuController.batchSaveChanges);

// ==================== 备份管理相关路由 ====================

/**
 * @openapi
 * /menu/admin/backup/dir:
 *   get:
 *     tags: [菜单管理]
 *     summary: 获取备份目录配置
 *     responses:
 *       200:
 *         description: 备份目录
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.get('/admin/backup/dir', menuController.getBackupDir);

/**
 * @openapi
 * /menu/admin/backup/dir:
 *   put:
 *     tags: [菜单管理]
 *     summary: 设置备份目录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dir: { type: string }
 *           example: { dir: 'D:\\backup\\menu' }
 *     responses:
 *       200:
 *         description: 设置成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/admin/backup/dir', menuController.setBackupDir);

/**
 * @openapi
 * /menu/admin/backup:
 *   post:
 *     tags: [菜单管理]
 *     summary: 创建菜单备份
 *     responses:
 *       200:
 *         description: 备份成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/admin/backup', menuController.createBackup);

/**
 * @openapi
 * /menu/admin/backup/list:
 *   get:
 *     tags: [菜单管理]
 *     summary: 获取菜单备份列表
 *     responses:
 *       200:
 *         description: 备份列表
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.get('/admin/backup/list', menuController.getBackupList);

/**
 * @openapi
 * /menu/admin/backup/restore:
 *   post:
 *     tags: [菜单管理]
 *     summary: 从备份恢复菜单
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName: { type: string }
 *           example: { fileName: 'menu-backup-20260924.json' }
 *     responses:
 *       200:
 *         description: 恢复成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/admin/backup/restore', menuController.restoreBackup);

/**
 * @openapi
 * /menu/admin/backup/{fileName}:
 *   delete:
 *     tags: [菜单管理]
 *     summary: 删除指定菜单备份
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema: { type: string }
 *         description: 备份文件名
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.delete('/admin/backup/:fileName', menuController.deleteBackup);

module.exports = router;
