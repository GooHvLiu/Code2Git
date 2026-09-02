/**
 * plc模块 - 控制器层
 * 支持单设备和多设备模式
 */
const plcService = require('./plc.service')
const { ERROR_CODE } = require('../../constants/errorCode')
const userService = require('../user/user.service')
const { comparePassword } = require('../../utils/password')
const { triggerNotification } = require('../../utils/notification')

class PlcController {
  /**
   * 获取PLC通讯状态
   * GET /plc/status?device=xxx
   */
  async getStatus(req, res, next) {
    try {
      const { device } = req.query
      if (device) {
        const status = await plcService.getPlcStatus(device)
        res.success(status)
      } else {
        const status = plcService.getAllStatus()
        res.success(status)
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * 读取单个点位
   * GET /plc/read-tag?tag=deviceRunStatus&device=xxx
   */
  async readTag(req, res, next) {
    try {
      const { tag, device } = req.query
      if (!tag) throw new Error('缺少参数 tag')
      const result = await plcService.readPlcTag(tag, device)
      res.success(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 读取所有点位
   * GET /plc/read-all?device=xxx
   */
  async readAllTags(req, res, next) {
    try {
      const { device } = req.query
      const result = await plcService.readAllTags(device)
      res.success(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 下发写参数到PLC（GMP 电子签名：需密码验证 + 操作原因）
   * POST /plc/write-tag
   * body: { tag, value, reason, password, device? }
   */
  async writeParameter(req, res, next) {
    try {
      const { tag, value, reason, password, device } = req.body
      if (!tag) throw new Error('缺少参数 tag')
      if (value === undefined) throw new Error('缺少参数 value')
      if (!reason || reason.trim().length < 2) {
        return res.error(ERROR_CODE.PARAM_INVALID)
      }
      if (!password) {
        return res.error(ERROR_CODE.E_SIGNATURE_PASSWORD_REQUIRED)
      }

      // 电子签名：验证当前用户密码
      const currentUser = await userService.getUserById(req.user.id)
      if (!currentUser) {
        return res.error(ERROR_CODE.USER_NOT_FOUND)
      }
      const passwordValid = await comparePassword(password, currentUser.password)
      if (!passwordValid) {
        return res.error(ERROR_CODE.E_SIGNATURE_FAILED)
      }

      const operatorInfo = {
        userId: req.user?.id || 0,
        userName: req.user?.username || req.user?.userName || 'unknown',
        reason: reason.trim(),
        ip: req.ip || req.connection?.remoteAddress || '',
        userAgent: req.headers['user-agent'] || ''
      }
      const ret = await plcService.writePlcTag(tag, value, operatorInfo, device)

      // 触发通知：设备参数变更（通知管理员和工程师）
      triggerNotification('device.param.change', {
        tag: tag,
        value: value,
        device: device || 'default',
        operator: req.user.username
      }, req.user.id).catch(err => {
        console.error('[设备参数变更] 触发通知失败:', err)
      })
      res.success(ret)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new PlcController()
