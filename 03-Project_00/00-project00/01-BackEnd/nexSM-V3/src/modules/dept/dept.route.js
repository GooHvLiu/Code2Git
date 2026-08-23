/**
 * 部门管理模块 - 路由配置
 * 路由前缀：/prod-api/v2/dept（自动加载）
 */
const express = require('express')
const router = express.Router()
const deptController = require('./dept.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

// 获取部门树
router.get('/tree', requireAuth, deptController.getDeptTree)
// 获取部门详情
router.get('/:id', requireAuth, deptController.getDeptById)
// 创建部门
router.post('/', requireAuth, deptController.createDept)
// 更新部门
router.put('/:id', requireAuth, deptController.updateDept)
// 删除部门
router.delete('/:id', requireAuth, deptController.deleteDept)

module.exports = router
