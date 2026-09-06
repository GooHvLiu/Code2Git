/**
 * ==========================================
 * 功能配置模块 - 数据模型层
 * ==========================================
 * 对应数据库表：nex_feature_config
 * 超级面板专用，用于管理系统各功能模块的开关配置
 */
const { query } = require('../../db/index')

class FeatureConfigModel {
  /**
   * 获取所有功能配置（按分类和排序）
   * @returns {Promise<Array>} 功能配置列表
   */
  async getAll() {
    const sql = `
      SELECT * FROM nex_feature_config
      WHERE is_enabled = 1
      ORDER BY category ASC, sort ASC, id ASC
    `
    return await query(sql)
  }

  /**
   * 按分类获取功能配置
   * @param {string} category - 分类
   * @returns {Promise<Array>} 功能配置列表
   */
  async getByCategory(category) {
    const sql = `
      SELECT * FROM nex_feature_config
      WHERE category = ? AND is_enabled = 1
      ORDER BY sub_category ASC, sort ASC, id ASC
    `
    return await query(sql, [category])
  }

  /**
   * 根据功能标识获取配置
   * @param {string} featureKey - 功能标识
   * @returns {Promise<Object|null>} 功能配置
   */
  async getByKey(featureKey) {
    const sql = `
      SELECT * FROM nex_feature_config
      WHERE feature_key = ? AND is_enabled = 1
      LIMIT 1
    `
    const rows = await query(sql, [featureKey])
    return rows[0] || null
  }

  /**
   * 批量获取功能配置
   * @param {Array<string>} featureKeys - 功能标识列表
   * @returns {Promise<Array>} 功能配置列表
   */
  async getByKeys(featureKeys) {
    if (!featureKeys || featureKeys.length === 0) return []
    const placeholders = featureKeys.map(() => '?').join(',')
    const sql = `
      SELECT * FROM nex_feature_config
      WHERE feature_key IN (${placeholders}) AND is_enabled = 1
    `
    return await query(sql, featureKeys)
  }

  /**
   * 检查功能是否启用
   * @param {string} featureKey - 功能标识
   * @returns {Promise<boolean>} 是否启用
   */
  async isEnabled(featureKey) {
    const config = await this.getByKey(featureKey)
    if (!config) return false
    return config.current_value === 'true' || config.current_value === true
  }

  /**
   * 更新功能配置值
   * @param {string} featureKey - 功能标识
   * @param {string} value - 新值
   * @returns {Promise<Object>} 更新结果
   */
  async updateValue(featureKey, value) {
    const sql = `
      UPDATE nex_feature_config
      SET current_value = ?, updated_at = NOW()
      WHERE feature_key = ? AND is_enabled = 1
    `
    return await query(sql, [value, featureKey])
  }

  /**
   * 批量更新功能配置值
   * @param {Array<Object>} updates - 更新列表 [{ featureKey, value }]
   * @returns {Promise<void>}
   */
  async batchUpdateValues(updates) {
    for (const update of updates) {
      await this.updateValue(update.featureKey, update.value)
    }
  }

  /**
   * 重置为默认值
   * @param {string} featureKey - 功能标识
   * @returns {Promise<Object>} 更新结果
   */
  async resetToDefault(featureKey) {
    const sql = `
      UPDATE nex_feature_config
      SET current_value = default_value, updated_at = NOW()
      WHERE feature_key = ? AND is_enabled = 1
    `
    return await query(sql, [featureKey])
  }

  /**
   * 按分类重置为默认值
   * @param {string} category - 分类
   * @returns {Promise<Object>} 更新结果
   */
  async resetCategoryToDefault(category) {
    const sql = `
      UPDATE nex_feature_config
      SET current_value = default_value, updated_at = NOW()
      WHERE category = ? AND is_enabled = 1
    `
    return await query(sql, [category])
  }

  /**
   * 全部重置为默认值
   * @returns {Promise<Object>} 更新结果
   */
  async resetAllToDefault() {
    const sql = `
      UPDATE nex_feature_config
      SET current_value = default_value, updated_at = NOW()
      WHERE is_enabled = 1
    `
    return await query(sql)
  }

  /**
   * 获取分类统计
   * @returns {Promise<Array>} 分类统计列表
   */
  async getCategoryStats() {
    const sql = `
      SELECT
        category,
        COUNT(*) as total,
        SUM(CASE WHEN current_value = 'true' THEN 1 ELSE 0 END) as enabled_count
      FROM nex_feature_config
      WHERE is_enabled = 1
      GROUP BY category
      ORDER BY category ASC
    `
    return await query(sql)
  }
}

module.exports = new FeatureConfigModel()
