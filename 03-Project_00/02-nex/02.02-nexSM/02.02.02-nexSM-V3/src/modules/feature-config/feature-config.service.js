/**
 * ==========================================
 * 功能配置模块 - 业务逻辑层
 * ==========================================
 * 处理功能配置的查询、更新、重置等业务逻辑
 * 提供功能开关检查的统一入口
 */
const featureConfigModel = require('./feature-config.model')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')

// 内存缓存（避免频繁查询数据库）
const cache = new Map()
const CACHE_TTL = 60 * 1000 // 1分钟缓存

class FeatureConfigService {
  /**
   * 获取所有功能配置（带分类分组）
   * @returns {Promise<Object>} { categories, list, stats }
   */
  async getAllConfig() {
    const list = await featureConfigModel.getAll()
    const stats = await featureConfigModel.getCategoryStats()

    // 按分类分组
    const categories = {}
    for (const item of list) {
      if (!categories[item.category]) {
        categories[item.category] = []
      }
      categories[item.category].push(item)
    }

    return { categories, list, stats }
  }

  /**
   * 按分类获取功能配置
   * @param {string} category - 分类
   * @returns {Promise<Array>} 功能配置列表
   */
  async getByCategory(category) {
    return await featureConfigModel.getByCategory(category)
  }

  /**
   * 更新单个功能配置
   * @param {string} featureKey - 功能标识
   * @param {string} value - 新值
   * @returns {Promise<Object>} 更新后的配置
   */
  async updateConfig(featureKey, value) {
    const config = await featureConfigModel.getByKey(featureKey)
    if (!config) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { name: '功能配置' })
    }

    // 校验值类型
    if (config.value_type === 'boolean') {
      if (value !== 'true' && value !== 'false' && value !== true && value !== false) {
        throw new BusinessError(ERROR_CODE.PARAM_ERROR, null, { name: '值类型', expected: 'boolean' })
      }
    }

    await featureConfigModel.updateValue(featureKey, String(value))

    // 清除缓存
    this.clearCache(featureKey)

    return await featureConfigModel.getByKey(featureKey)
  }

  /**
   * 批量更新功能配置
   * @param {Array<Object>} updates - 更新列表 [{ featureKey, value }]
   * @returns {Promise<Object>} { successCount, failedCount }
   */
  async batchUpdateConfig(updates) {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null, { name: '更新列表' })
    }

    let successCount = 0
    let failedCount = 0

    for (const update of updates) {
      try {
        await this.updateConfig(update.featureKey, update.value)
        successCount++
      } catch (err) {
        failedCount++
        console.error(`[功能配置] 更新失败 ${update.featureKey}:`, err.message)
      }
    }

    return { successCount, failedCount, total: updates.length }
  }

  /**
   * 重置单个功能配置为默认值
   * @param {string} featureKey - 功能标识
   * @returns {Promise<Object>} 重置后的配置
   */
  async resetConfig(featureKey) {
    const config = await featureConfigModel.getByKey(featureKey)
    if (!config) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { name: '功能配置' })
    }

    await featureConfigModel.resetToDefault(featureKey)
    this.clearCache(featureKey)

    return await featureConfigModel.getByKey(featureKey)
  }

  /**
   * 按分类重置为默认值
   * @param {string} category - 分类
   * @returns {Promise<Object>} { category, resetCount }
   */
  async resetCategory(category) {
    const list = await featureConfigModel.getByCategory(category)
    await featureConfigModel.resetCategoryToDefault(category)

    // 清除缓存
    for (const item of list) {
      this.clearCache(item.feature_key)
    }

    return { category, resetCount: list.length }
  }

  /**
   * 全部重置为默认值
   * @returns {Promise<Object>} { resetCount }
   */
  async resetAll() {
    const list = await featureConfigModel.getAll()
    await featureConfigModel.resetAllToDefault()

    // 清除所有缓存
    cache.clear()

    return { resetCount: list.length }
  }

  /**
   * 检查功能是否启用（带缓存）
   * @param {string} featureKey - 功能标识
   * @returns {Promise<boolean>} 是否启用
   */
  async isFeatureEnabled(featureKey) {
    // 检查缓存
    const cached = cache.get(featureKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.value
    }

    // 查询数据库
    const enabled = await featureConfigModel.isEnabled(featureKey)

    // 更新缓存
    cache.set(featureKey, { value: enabled, timestamp: Date.now() })

    return enabled
  }

  /**
   * 批量检查功能是否启用
   * @param {Array<string>} featureKeys - 功能标识列表
   * @returns {Promise<Object>} { featureKey: boolean }
   */
  async areFeaturesEnabled(featureKeys) {
    const result = {}
    for (const key of featureKeys) {
      result[key] = await this.isFeatureEnabled(key)
    }
    return result
  }

  /**
   * 清除缓存
   * @param {string} [featureKey] - 功能标识，不传则清除全部
   */
  clearCache(featureKey) {
    if (featureKey) {
      cache.delete(featureKey)
    } else {
      cache.clear()
    }
  }
}

module.exports = new FeatureConfigService()
