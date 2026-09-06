/**
 * plc模块 - 控制器层
 * 支持单设备和多设备模式
 */
const plcService = require('./plc.service')
const { ERROR_CODE } = require('../../constants/errorCode')
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
   * 下发写参数到PLC
   * POST /plc/write-tag
   * body: { tag, value, reason, device? }
   */
  async writeParameter(req, res, next) {
    try {
      const { tag, value, reason, device } = req.body
      if (!tag) throw new Error('缺少参数 tag')
      if (value === undefined) throw new Error('缺少参数 value')
      if (!reason || reason.trim().length < 2) {
        return res.error(ERROR_CODE.PARAM_INVALID)
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
  /**
   * 手动重连PLC
   * POST /plc/reconnect
   * body: { device? }
   */
  async reconnect(req, res, next) {
    try {
      const { device } = req.body || {}
      const result = await plcService.reconnectPlc(device)
      res.success(result)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new PlcController()
