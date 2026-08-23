/**
 * 角色管理模块 - 路由配置
 * 路由前缀：/prod-api/v2/role（自动加载）
 */
const express = require('express')
const router = express.Router()
const roleController = require('./role.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

// 获取所有启用的角色（下拉选择用）
router.get('/all', requireAuth, roleController.getAllRoles)
// 分页查询角色列表
router.get('/', requireAuth, roleController.getRoleList)
// 获取角色详情
router.get('/:id', requireAuth, roleController.getRoleById)
// 创建角色
router.post('/', requireAuth, roleController.createRole)
// 更新角色
router.put('/:id', requireAuth, roleController.updateRole)
// 删除角色
router.delete('/:id', requireAuth, roleController.deleteRole)

module.exports = router
