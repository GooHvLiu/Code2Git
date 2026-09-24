/**
 * 文件管理模块 - 路由层（仅超级管理员）
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const fileManagerController = require('./file-manager.controller');
const { requireAuth } = require('../../middleware/auth.middleware');
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware');

/**
 * @openapi
 * /file-manager/files:
 *   get:
 *     tags: [文件管理]
 *     summary: 获取可编辑的配置文件列表
 *     responses:
 *       200:
 *         description: 可编辑文件列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name: { type: string, example: 'application.yml' }
 *                           path: { type: string }
 *                           size: { type: integer }
 *       403: { description: 非超级管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
// 获取可编辑的配置文件列表
router.get('/files', requireAuth, requireSuperAdmin, fileManagerController.getFileList);

/**
 * @openapi
 * /file-manager/backup-dir:
 *   get:
 *     tags: [文件管理]
 *     summary: 获取备份目录路径
 *     responses:
 *       200:
 *         description: 备份目录
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
 *                         backupDir: { type: string, example: 'D:\\backup\\config' }
 */
// 获取备份目录路径
router.get('/backup-dir', requireAuth, requireSuperAdmin, fileManagerController.getBackupDir);

/**
 * @openapi
 * /file-manager/backup-dir:
 *   post:
 *     tags: [文件管理]
 *     summary: 修改备份目录路径
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [backupDir]
 *             properties:
 *               backupDir: { type: string }
 *           example: { backupDir: 'D:\\backup\\config' }
 *     responses:
 *       200:
 *         description: 设置成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 修改备份目录路径
router.post('/backup-dir', requireAuth, requireSuperAdmin, fileManagerController.setBackupDir);

/**
 * @openapi
 * /file-manager/file/read:
 *   get:
 *     tags: [文件管理]
 *     summary: 读取指定配置文件内容
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema: { type: string }
 *         description: 文件相对路径
 *     responses:
 *       200:
 *         description: 文件内容
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
 *                         content: { type: string }
 */
// 读取指定文件的内容
router.get('/file/read', requireAuth, requireSuperAdmin, fileManagerController.readFile);

/**
 * @openapi
 * /file-manager/file/write:
 *   post:
 *     tags: [文件管理]
 *     summary: 写入文件内容（修改前自动备份）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [path, content]
 *             properties:
 *               path: { type: string }
 *               content: { type: string }
 *           example: { path: 'config/app.json', content: '{ "port": 3002 }' }
 *     responses:
 *       200:
 *         description: 写入成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 写入文件内容（修改前自动备份）
router.post('/file/write', requireAuth, requireSuperAdmin, fileManagerController.writeFile);

/**
 * @openapi
 * /file-manager/backups:
 *   get:
 *     tags: [文件管理]
 *     summary: 获取指定文件的备份列表
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 备份列表
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 获取指定文件的备份列表
router.get('/backups', requireAuth, requireSuperAdmin, fileManagerController.getBackupList);

/**
 * @openapi
 * /file-manager/backup/read:
 *   get:
 *     tags: [文件管理]
 *     summary: 读取备份文件内容
 *     parameters:
 *       - in: query
 *         name: file
 *         required: true
 *         schema: { type: string }
 *         description: 备份文件名
 *     responses:
 *       200:
 *         description: 备份内容
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 读取备份文件内容
router.get('/backup/read', requireAuth, requireSuperAdmin, fileManagerController.readBackup);

/**
 * @openapi
 * /file-manager/backup/restore:
 *   post:
 *     tags: [文件管理]
 *     summary: 回滚到指定备份版本
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file: { type: string, description: 备份文件名 }
 *           example: { file: 'app.json.bak.20260924' }
 *     responses:
 *       200:
 *         description: 回滚成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 回滚到指定备份版本
router.post('/backup/restore', requireAuth, requireSuperAdmin, fileManagerController.restoreBackup);

/**
 * @openapi
 * /file-manager/backup/delete:
 *   post:
 *     tags: [文件管理]
 *     summary: 删除指定备份
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file: { type: string }
 *           example: { file: 'app.json.bak.20260101' }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 删除指定备份
router.post('/backup/delete', requireAuth, requireSuperAdmin, fileManagerController.deleteBackup);

/**
 * @openapi
 * /file-manager/check-syntax:
 *   post:
 *     tags: [文件管理]
 *     summary: 配置文件语法检查
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, type]
 *             properties:
 *               content: { type: string }
 *               type: { type: string, enum: [json, yaml, js] }
 *           example: { content: '{ "port": 3002 }', type: 'json' }
 *     responses:
 *       200:
 *         description: 检查结果
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 语法检查
router.post('/check-syntax', requireAuth, requireSuperAdmin, fileManagerController.checkSyntax);

module.exports = router;
