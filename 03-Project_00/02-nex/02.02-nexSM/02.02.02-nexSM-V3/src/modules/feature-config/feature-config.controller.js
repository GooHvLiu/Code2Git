/**
 * ==========================================
 * 功能配置模块 - 控制器层
 * ==========================================
 * 负责参数接收、调用 Service 层、返回统一响应
 * 仅超级管理员可访问（由路由中间件控制）
 */
const featureConfigService = require('./feature-config.service')
const audit = require('../../utils/audit')

class FeatureConfigController {
  /**
   * 获取所有功能配置
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getAllConfig(req, res, next) {
    try {
      const result = await featureConfigService.getAllConfig()
      res.success(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 按分类获取功能配置
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params.category - 分类
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getByCategory(req, res, next) {
    try {
      const { category } = req.params
      const list = await featureConfigService.getByCategory(category)
      res.success({ category, list })
    } catch (err) {
      next(err)
    }
  }

  /**
   * 获取单个功能配置
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params.featureKey - 功能标识
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getConfig(req, res, next) {
    try {
      const { featureKey } = req.params
      const featureConfigModel = require('./feature-config.model')
      const config = await featureConfigModel.getByKey(featureKey)
      if (!config) {
        const { BusinessError } = require('../../middleware/error.middleware')
        const { ERROR_CODE } = require('../../constants/errorCode')
        throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { name: '功能配置' })
      }
      res.success(config)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 更新单个功能配置
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params.featureKey - 功能标识
   * @param {Object} req.body.value - 新值
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async updateConfig(req, res, next) {
    try {
      const { featureKey } = req.params
      const { value } = req.body

      const config = await featureConfigService.updateConfig(featureKey, value)

      // 记录审计日志
      audit.log(req, {
        action: audit.ACTION.CONFIG_SYSTEM_CHANGE,
        target: `功能配置:${featureKey}`,
        newValue: `值:${value}`,
        result: 'success',
        reason: '超级管理员修改功能配置'
      }).catch(err => {
        console.error('[功能配置] 记录审计日志失败:', err)
      })

      res.success(config)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 批量更新功能配置
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body.updates - 更新列表 [{ featureKey, value }]
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async batchUpdateConfig(req, res, next) {
    try {
      const { updates } = req.body
      const result = await featureConfigService.batchUpdateConfig(updates)

      // 记录审计日志
      audit.log(req, {
        action: audit.ACTION.CONFIG_SYSTEM_CHANGE,
        target: '功能配置批量更新',
        newValue: `更新${result.successCount}项，失败${result.failedCount}项`,
        result: 'success',
        reason: '超级管理员批量修改功能配置'
      }).catch(err => {
        console.error('[功能配置] 记录审计日志失败:', err)
      })

      res.success(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 重置单个功能配置为默认值
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params.featureKey - 功能标识
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async resetConfig(req, res, next) {
    try {
      const { featureKey } = req.params
      const config = await featureConfigService.resetConfig(featureKey)

      // 记录审计日志
      audit.log(req, {
        action: audit.ACTION.CONFIG_SYSTEM_CHANGE,
        target: `功能配置重置:${featureKey}`,
        newValue: '重置为默认值',
        result: 'success',
        reason: '超级管理员重置功能配置'
      }).catch(err => {
        console.error('[功能配置] 记录审计日志失败:', err)
      })

      res.success(config)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 按分类重置为默认值
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params.category - 分类
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async resetCategory(req, res, next) {
    try {
      const { category } = req.params
      const result = await featureConfigService.resetCategory(category)

      // 记录审计日志
      audit.log(req, {
        action: audit.ACTION.CONFIG_SYSTEM_CHANGE,
        target: `功能配置分类重置:${category}`,
        newValue: `重置${result.resetCount}项`,
        result: 'success',
        reason: '超级管理员按分类重置功能配置'
      }).catch(err => {
        console.error('[功能配置] 记录审计日志失败:', err)
      })

      res.success(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 全部重置为默认值
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async resetAll(req, res, next) {
    try {
      const result = await featureConfigService.resetAll()

      // 记录审计日志
      audit.log(req, {
        action: audit.ACTION.CONFIG_SYSTEM_CHANGE,
        target: '功能配置全部重置',
        newValue: `重置${result.resetCount}项`,
        result: 'success',
        reason: '超级管理员全部重置功能配置'
      }).catch(err => {
        console.error('[功能配置] 记录审计日志失败:', err)
      })

      res.success(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 检查功能是否启用（供其他模块调用）
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params.featureKey - 功能标识
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async checkFeatureEnabled(req, res, next) {
    try {
      const { featureKey } = req.params
      const enabled = await featureConfigService.isFeatureEnabled(featureKey)
      res.success({ featureKey, enabled })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new FeatureConfigController()
