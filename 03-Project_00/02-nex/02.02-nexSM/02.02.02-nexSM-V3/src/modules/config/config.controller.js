/**
 * 系统配置控制器
 * 处理系统配置相关的 HTTP 请求
 */
const configService = require('./config.service');

/**
 * 获取所有配置
 * GET /api/v2/config
 */
async function getAllConfigs(req, res) {
  try {
    const configs = await configService.getAllConfigs(true);
    res.json({
      code: 200,
      message: 'success',
      data: configs
    });
  } catch (err) {
    console.error('[系统配置] 获取配置失败:', err);
    res.status(500).json({
      code: 500,
      message: '获取配置失败',
      error: err.message
    });
  }
}

/**
 * 根据分类获取配置
 * GET /api/v2/config/category/:category
 */
async function getConfigsByCategory(req, res) {
  try {
    const { category } = req.params;
    const configs = await configService.getConfigsByCategory(category);
    res.json({
      code: 200,
      message: 'success',
      data: configs
    });
  } catch (err) {
    console.error('[系统配置] 获取分类配置失败:', err);
    res.status(500).json({
      code: 500,
      message: '获取分类配置失败',
      error: err.message
    });
  }
}

/**
 * 批量更新配置
 * PUT /api/v2/config
 */
async function updateConfigs(req, res) {
  try {
    const configs = req.body;
    if (!configs || typeof configs !== 'object') {
      return res.status(400).json({
        code: 400,
        message: '配置数据格式错误'
      });
    }

    await configService.updateConfigs(configs);

    // 返回更新后的配置
    const updatedConfigs = await configService.getAllConfigs(true);

    res.json({
      code: 200,
      message: '配置更新成功',
      data: updatedConfigs
    });
  } catch (err) {
    console.error('[系统配置] 更新配置失败:', err);
    res.status(500).json({
      code: 500,
      message: '更新配置失败',
      error: err.message
    });
  }
}

/**
 * 重置所有配置为默认值
 * POST /api/v2/config/reset
 */
async function resetAllConfigs(req, res) {
  try {
    await configService.resetAllConfigs();
    const configs = await configService.getAllConfigs(true);
    res.json({
      code: 200,
      message: '配置已重置为默认值',
      data: configs
    });
  } catch (err) {
    console.error('[系统配置] 重置配置失败:', err);
    res.status(500).json({
      code: 500,
      message: '重置配置失败',
      error: err.message
    });
  }
}

module.exports = {
  getAllConfigs,
  getConfigsByCategory,
  updateConfigs,
  resetAllConfigs
};
