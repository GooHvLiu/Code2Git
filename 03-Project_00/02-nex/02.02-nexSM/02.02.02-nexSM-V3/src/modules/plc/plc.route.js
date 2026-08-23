/**
 * plc模块 - 路由层
 * 所有接口需要登录鉴权
 */
const express = require('express')
const router = express.Router()
const plcController = require('./plc.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

// 所有 PLC 接口需要登录
router.use(requireAuth)

/**
 * @route GET /plc/status
 * @desc 获取PLC通讯状态
 */
router.get('/status', plcController.getStatus)

/**
 * @route GET /plc/read-tag
 * @desc 读取单个点位
 * @query {string} tag - 点位名称，如 deviceRunStatus
 */
router.get('/read-tag', plcController.readTag)

/**
 * @route GET /plc/read-all
 * @desc 读取所有点位
 */
router.get('/read-all', plcController.readAllTags)

/**
 * @route POST /plc/write-tag
 * @desc 下发写参数到PLC
 * @body {string} tag - 点位名称
 * @body {any} value - 写入值
 */
router.post('/write-tag', plcController.writeParameter)

module.exports = router
