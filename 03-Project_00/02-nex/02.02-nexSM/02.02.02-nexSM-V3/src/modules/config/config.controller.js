/**
 * 系统配置控制器
 * 处理系统配置相关的 HTTP 请求
 */
const configService = require('./config.service');
const configModel = require('./config.model');
const { triggerNotification } = require('../../services/notificationTrigger.service');

/**
 * 根据配置分类确定通知事件类型
 * @param {string} category - 配置分类
 * @returns {string} 事件类型
 */
function getNotificationEventType(category) {
  const eventMap = {
    'plc': 'config.plc.connection.update',
    'connection': 'config.connection.update',
    'device': 'config.device.params.update',
    'system': 'config.system.update',
    'security': 'config.system.update',
    'export': 'config.system.update'
  };
  return eventMap[category] || 'config.system.update';
}

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

    // 1. 获取旧配置，用于比较变化（注意：旧配置已根据 config_type 解析过）
    const oldConfigs = await configService.getAllConfigs(true);

    // 2. 比较新旧配置，找出实际发生变化的配置项
    const changedConfigs = {};
    const changedKeys = [];

    for (const [key, newValue] of Object.entries(configs)) {
      // 如果旧配置中没有这个 key，跳过（不视为变化，避免新增配置项误判）
      if (!(key in oldConfigs)) {
        continue;
      }

      const oldValue = oldConfigs[key];

      // 统一转换为字符串进行比较，处理数据类型不一致的问题
      // 例如：旧值是布尔值 false，新值是字符串 "false"
      const oldValueStr = oldValue === null || oldValue === undefined ? '' : String(oldValue);
      const newValueStr = newValue === null || newValue === undefined ? '' : String(newValue);

      if (oldValueStr !== newValueStr) {
        changedConfigs[key] = newValue;
        changedKeys.push(key);
      }
    }

    console.log(`[系统配置] 配置更新，提交配置项数: ${Object.keys(configs).length}, 实际变化项数: ${changedKeys.length}, 变化项: ${JSON.stringify(changedKeys)}`);

    // 没有变化的配置，直接返回，不更新数据库，不触发通知
    if (changedKeys.length === 0) {
      return res.json({
        code: 200,
        message: '配置无变化',
        data: oldConfigs
      });
    }

    // 3. 只更新变化的配置项（减少数据库操作）
    await configService.updateConfigs(changedConfigs);

    // 4. 返回更新后的配置
    const updatedConfigs = await configService.getAllConfigs(true);

    // 5. 根据变化的配置项确定分类和通知内容
    const categories = new Set();
    const changedConfigNames = [];

    for (const key of changedKeys) {
      try {
        const configItem = await configModel.getConfigByKey(key);
        const category = configItem?.category || 'system';
        categories.add(category);
        // 使用配置描述作为名称，如果没有描述则使用key
        changedConfigNames.push(configItem?.description || key);
      } catch (err) {
        console.error('[系统配置] 查询配置项分类失败:', key, err.message);
        changedConfigNames.push(key);
      }
    }

    // 6. 按优先级选择通知类型：device > plc > connection > system
    const categoryPriority = ['device', 'plc', 'connection', 'system', 'security', 'export'];
    let selectedCategory = 'system';
    for (const cat of categoryPriority) {
      if (categories.has(cat)) {
        selectedCategory = cat;
        break;
      }
    }

    // 7. 发送通知，内容包含变化的配置项数量和 key 列表（由前端根据当前语言进行国际化）
    const eventType = getNotificationEventType(selectedCategory);

    console.log(`[系统配置] 配置更新，涉及分类: ${JSON.stringify([...categories])}, 变化项: ${JSON.stringify(changedKeys)}, 选择通知类型: ${eventType}`);

    triggerNotification(eventType, {
      username: req.user?.username || '系统',
      count: changedKeys.length,
      configKeys: changedKeys.join(',')
    }, req.user?.id).then(result => {
    }).catch(err => {
      console.error('[系统配置] 触发通知失败:', err);
    });

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
