/**
 * 系统配置控制器
 * 处理系统配置相关的 HTTP 请求
 * 国际化规范：成功用 res.success(data)；错误用 res.error('错误码')，前端按 common.error.错误码 翻译
 * console 为后端调试日志，保留中文
 */
const configService = require('./config.service');
const configModel = require('./config.model');
const { triggerNotification } = require('../../utils/notification');
const deviceStatusManager = require('../../socket/deviceStatusManager');
const plcPollTask = require('../../plc/task/PlcPollTask');
const maintenanceTaskManager = require('../../socket/maintenanceTaskManager');
const audit = require('../../utils/audit');

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
    'security': 'config.security.update',
    'export': 'config.export.update'
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
    res.success(configs);
  } catch (err) {
    console.error('[系统配置] 获取配置失败:', err);
    res.error('SYSTEM_ERROR', null, 500);
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
    res.success(configs);
  } catch (err) {
    console.error('[系统配置] 获取分类配置失败:', err);
    res.error('SYSTEM_ERROR', null, 500);
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
      return res.error('PARAM_INVALID', null, 400);
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
      return res.success(oldConfigs);
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

    // 7. 记录审计日志：系统配置修改（按分类记录）
    for (const cat of categories) {
      const actionMap = {
        'system': audit.ACTION.CONFIG_SYSTEM_CHANGE,
        'security': audit.ACTION.CONFIG_SECURITY_CHANGE,
        'plc': audit.ACTION.CONFIG_PLC_CHANGE,
        'export': audit.ACTION.CONFIG_EXPORT_CHANGE,
        'connection': audit.ACTION.CONFIG_CONNECTION_CHANGE,
        'device': audit.ACTION.CONFIG_DEVICE_CHANGE,
        'order': audit.ACTION.CONFIG_ORDER_CHANGE
      };
      const action = actionMap[cat] || audit.ACTION.CONFIG_SYSTEM_CHANGE;
      audit.log(req, {
        action: action,
        target: `配置分类:${cat}, 变化项数:${changedKeys.length}`,
        oldValue: JSON.stringify(Object.fromEntries(changedKeys.map(k => [k, oldConfigs[k]]))),
        newValue: JSON.stringify(Object.fromEntries(changedKeys.map(k => [k, configs[k]]))),
        result: 'success',
        reason: '管理员修改系统配置'
      }).catch(err => {
        console.error('[系统配置修改] 记录审计日志失败:', err)
      });
    }

    // 8. 发送通知，内容包含变化的配置项数量和 key 列表（由前端根据当前语言进行国际化）
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


    // 8. 如果变化的配置项包含设备状态相关的配置，动态调整定时任务间隔
    const deviceStatusConfigKeys = ['deviceStatusCheckInterval', 'deviceOfflineThreshold'];
    const hasDeviceStatusConfigChanged = changedKeys.some(key => deviceStatusConfigKeys.includes(key));
    if (hasDeviceStatusConfigChanged) {
      console.log('[系统配置] 设备状态相关配置已变化，重启定时任务');
      deviceStatusManager.restartFromConfig().catch(err => {
        console.error('[系统配置] 重启设备状态定时任务失败:', err.message);
      });
    }

    // 9. 如果变化的配置项包含PLC轮询相关的配置，动态调整轮询间隔
    const plcPollConfigKeys = ['pollFastInterval', 'pollSlowInterval'];
    const hasPlcPollConfigChanged = changedKeys.some(key => plcPollConfigKeys.includes(key));
    if (hasPlcPollConfigChanged) {
      console.log('[系统配置] PLC轮询相关配置已变化，重启轮询任务');
      plcPollTask.restartFromConfig().catch(err => {
        console.error('[系统配置] 重启PLC轮询任务失败:', err.message);
      });
    }

    // 10. 如果变化的配置项包含维护检查间隔，动态调整维护任务间隔
    const maintenanceConfigKeys = ['maintenanceCheckInterval'];
    const hasMaintenanceConfigChanged = changedKeys.some(key => maintenanceConfigKeys.includes(key));
    if (hasMaintenanceConfigChanged) {
      console.log('[系统配置] 维护检查间隔配置已变化，重启维护任务');
      maintenanceTaskManager.restartFromConfig().catch(err => {
        console.error('[系统配置] 重启维护任务失败:', err.message);
      });
    }

    // 11. 如果变化的配置项包含部件寿命统计间隔，动态调整使用寿命统计任务间隔
    const partLifeStatConfigKeys = ['partLifeStatInterval'];
    const hasPartLifeStatConfigChanged = changedKeys.some(key => partLifeStatConfigKeys.includes(key));
    if (hasPartLifeStatConfigChanged) {
      console.log('[系统配置] 部件寿命统计间隔配置已变化，重启使用寿命统计任务');
      maintenanceTaskManager.restartPartLifeStatsFromConfig().catch(err => {
        console.error('[系统配置] 重启使用寿命统计任务失败:', err.message);
      });
    }

    res.success(updatedConfigs);
  } catch (err) {
    console.error('[系统配置] 更新配置失败:', err);
    res.error('SYSTEM_ERROR', null, 500);
  }
}


module.exports = {
  getAllConfigs,
  getConfigsByCategory,
  updateConfigs,
};
