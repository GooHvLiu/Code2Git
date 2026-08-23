/**
 * 数据字典模块 - 路由配置
 * 路由前缀：/prod-api/v2/dict（自动加载）
 */
const express = require('express')
const router = express.Router()
const dictController = require('./dict.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

// ==================== 字典类型 ====================

// 分页查询字典类型列表
router.get('/type', requireAuth, dictController.getTypeList)
// 获取字典类型详情
router.get('/type/:id', requireAuth, dictController.getTypeById)
// 创建字典类型
router.post('/type', requireAuth, dictController.createType)
// 更新字典类型
router.put('/type/:id', requireAuth, dictController.updateType)
// 删除字典类型
router.delete('/type/:id', requireAuth, dictController.deleteType)

// ==================== 字典项 ====================

// 分页查询字典项列表
router.get('/item', requireAuth, dictController.getItemList)
// 根据字典类型编码获取字典项列表（前端 DictTag 组件用，无需鉴权或登录即可获取）
router.get('/items/:code', requireAuth, dictController.getItemsByTypeCode)
// 批量获取多个字典类型的字典项
router.post('/items/batch', requireAuth, dictController.getItemsByTypeCodes)
// 获取字典项详情
router.get('/item/:id', requireAuth, dictController.getItemById)
// 创建字典项
router.post('/item', requireAuth, dictController.createItem)
// 更新字典项
router.put('/item/:id', requireAuth, dictController.updateItem)
// 删除字典项
router.delete('/item/:id', requireAuth, dictController.deleteItem)

module.exports = router
