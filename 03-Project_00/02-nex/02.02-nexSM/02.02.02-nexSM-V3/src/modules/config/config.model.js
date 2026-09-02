/**
 * 系统配置数据模型
 * 负责系统配置的数据库操作
 */
const db = require('../../db');

/**
 * 初始化系统配置表（如果不存在）
 */
async function initTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS nex_system_config (
      id INT NOT NULL AUTO_INCREMENT COMMENT '主键',
      config_key VARCHAR(100) NOT NULL COMMENT '配置键',
      config_value TEXT COMMENT '配置值',
      config_type VARCHAR(20) DEFAULT 'string' COMMENT '配置类型：string/number/boolean/json',
      description VARCHAR(200) DEFAULT '' COMMENT '配置描述',
      category VARCHAR(50) DEFAULT 'system' COMMENT '配置分类：system/security/plc/export/connection',
      sort INT DEFAULT 0 COMMENT '排序号',
      create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (id),
      UNIQUE KEY uk_config_key (config_key),
      KEY idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';
  `;
  await db.query(sql);
}

/**
 * 初始化默认配置数据（如果表为空）
 */
async function initDefaultData() {
  // 查询已存在的配置键，只插入缺失的配置（自动补全新增参数）
  const existingKeysResult = await db.query('SELECT config_key FROM nex_system_config');
  const existingKeys = new Set(existingKeysResult.map(item => item.config_key));
  console.log('[配置初始化] 已存在配置项数量:', existingKeys.size);

  const defaultConfigs = [
    { key: 'sessionTimeout', value: '30', type: 'number', desc: '会话超时时间（分钟）', category: 'system', sort: 1 },
    { key: 'defaultPageSize', value: '20', type: 'number', desc: '默认每页条数', category: 'system', sort: 2 },
    { key: 'defaultLanguage', value: 'zh-CN', type: 'string', desc: '默认语言', category: 'system', sort: 3 },
    { key: 'dateFormat', value: 'YYYY-MM-DD', type: 'string', desc: '日期显示格式', category: 'system', sort: 4 },
    // 安全设置
    { key: 'watermarkEnabled', value: 'false', type: 'boolean', desc: '是否启用水印', category: 'security', sort: 1 },
    { key: 'watermarkText', value: '', type: 'string', desc: '水印文字（为空时使用当前用户名）', category: 'security', sort: 2 },
    { key: 'loginFailedThreshold', value: '5', type: 'number', desc: '登录失败次数阈值（达到该次数触发通知）', category: 'security', sort: 3 },
    { key: 'lockDurationMinutes', value: '30', type: 'number', desc: '账户锁定时长（分钟）', category: 'security', sort: 4 },
    // 设备连接设置
    { key: 'plcProtocol', value: 'ModbusTcp', type: 'string', desc: '通信协议', category: 'plc', sort: 1 },
    { key: 'plcHost', value: '127.0.0.1', type: 'string', desc: '设备IP地址', category: 'plc', sort: 2 },
    { key: 'plcPort', value: '502', type: 'number', desc: '设备端口', category: 'plc', sort: 3 },
    { key: 'plcUnitId', value: '1', type: 'number', desc: 'Modbus单元ID', category: 'plc', sort: 4 },
    { key: 'pollFastInterval', value: '200', type: 'number', desc: '快速轮询间隔（ms）', category: 'plc', sort: 5 },
    { key: 'pollSlowInterval', value: '1000', type: 'number', desc: '慢速轮询间隔（ms）', category: 'plc', sort: 6 },
    // 导出设置
    { key: 'pdfWatermarkEnabled', value: 'true', type: 'boolean', desc: 'PDF导出水印开关', category: 'export', sort: 1 },
    { key: 'pdfWatermarkText', value: '', type: 'string', desc: 'PDF水印文字（为空时使用当前用户名）', category: 'export', sort: 2 },
    // 连接设置
    { key: 'heartbeatInterval', value: '25000', type: 'number', desc: 'WebSocket心跳间隔（ms）', category: 'connection', sort: 1 },
    { key: 'deviceStatusCheckInterval', value: '300', type: 'number', desc: '设备状态检查间隔（秒）', category: 'connection', sort: 2 },
    { key: 'deviceOfflineThreshold', value: '600', type: 'number', desc: '设备离线阈值（秒）', category: 'connection', sort: 3 },
    { key: 'maintenanceCheckInterval', value: '24', type: 'number', desc: '设备维护检查间隔（小时）', category: 'connection', sort: 4 },
    { key: 'partLifeStatInterval', value: '5', type: 'number', desc: '部件寿命统计间隔（分钟）', category: 'connection', sort: 5 },
    // 设备参数
    { key: 'deviceName', value: 'nexCM-灌装机-001', type: 'string', desc: '设备名称', category: 'device', sort: 1 },
    { key: 'deviceCode', value: 'NEXCM-FILL-2026-001', type: 'string', desc: '设备编号', category: 'device', sort: 2 },
    { key: 'deviceRegion', value: '["CN","CN-WX"]', type: 'json', desc: '设备所在地区（国家编码,城市编码）', category: 'device', sort: 3 },
    { key: 'deviceInstallDate', value: '2026-01-15', type: 'string', desc: '设备安装日期', category: 'device', sort: 4 },
    // 部件寿命提醒设置
    { key: 'partLifeReminderEnabled', value: 'true', type: 'boolean', desc: '部件寿命提醒开关', category: 'device', sort: 5 },
    { key: 'partLifeThreshold', value: '20', type: 'string', desc: '部件寿命提醒阈值（%）', category: 'device', sort: 6 },
    { key: 'partLifeRemindInterval', value: 'day', type: 'string', desc: '部件寿命提醒频率（hour/shift/day）', category: 'device', sort: 7 },
    { key: 'partLifeSnoozeInterval', value: '10', type: 'number', desc: '稍后提醒间隔（分钟）', category: 'device', sort: 8 },
    // 订单设置
    { key: 'allowNoOrderProduction', value: 'false', type: 'boolean', desc: '允许无订单生产', category: 'order', sort: 1 },
    { key: 'noOrderProductionHighlight', value: 'false', type: 'boolean', desc: '无订单生产高亮提示', category: 'order', sort: 2 },
    { key: 'showOperatorName', value: 'true', type: 'boolean', desc: '显示操作员姓名', category: 'order', sort: 3 },
    { key: 'showAlarmCount', value: 'true', type: 'boolean', desc: '显示报警数量', category: 'order', sort: 4 },
    { key: 'showRuntime', value: 'true', type: 'boolean', desc: '显示运行时长', category: 'order', sort: 5 },
    { key: 'reportIncludeAlarmDetail', value: 'true', type: 'boolean', desc: '报表包含报警详情', category: 'order', sort: 6 },
    { key: 'reportIncludeOperatorDetail', value: 'true', type: 'boolean', desc: '报表包含操作员详情', category: 'order', sort: 7 },
    { key: 'reportIncludeDownloadCount', value: 'true', type: 'boolean', desc: '报表包含下载次数', category: 'order', sort: 8 },
    { key: 'allowRunningOrderDownload', value: 'false', type: 'boolean', desc: '允许运行中订单下载', category: 'order', sort: 9 },
    { key: 'autoArchiveCompleted', value: 'true', type: 'boolean', desc: '自动归档已完成订单', category: 'order', sort: 10 },
    { key: 'orderSwitchConfirm', value: 'true', type: 'boolean', desc: '订单切换确认', category: 'order', sort: 11 }
  ];

  let insertedCount = 0;
  for (const config of defaultConfigs) {
    // 只插入不存在的配置项
    if (!existingKeys.has(config.key)) {
      const sql = `
        INSERT INTO nex_system_config (config_key, config_value, config_type, description, category, sort)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.query(sql, [config.key, config.value, config.type, config.desc, config.category, config.sort]);
      insertedCount++;
      console.log('[配置初始化] 新增配置项:', config.key);
    }
  }
  if (insertedCount > 0) {
    console.log('[配置初始化] 共新增', insertedCount, '个配置项');
  } else {
    console.log('[配置初始化] 所有配置项已存在，无需新增');
  }
}

/**
 * 获取所有配置
 * @returns {Promise<Array>} 配置列表
 */
async function getAllConfigs() {
  const sql = 'SELECT * FROM nex_system_config ORDER BY category, sort';
  return await db.query(sql);
}

/**
 * 根据分类获取配置
 * @param {string} category 配置分类
 * @returns {Promise<Array>} 配置列表
 */
async function getConfigsByCategory(category) {
  const sql = 'SELECT * FROM nex_system_config WHERE category = ? ORDER BY sort';
  return await db.query(sql, [category]);
}

/**
 * 根据键获取配置
 * @param {string} key 配置键
 * @returns {Promise<Object>} 配置项
 */
async function getConfigByKey(key) {
  const sql = 'SELECT * FROM nex_system_config WHERE config_key = ?';
  const [result] = await db.query(sql, [key]);
  return result;
}

/**
 * 批量更新配置
 * 使用 INSERT ... ON DUPLICATE KEY UPDATE，配置项不存在时自动插入
 * @param {Object} configs 配置对象 { key: value }
 */
async function updateConfigs(configs) {
  for (const [key, value] of Object.entries(configs)) {
    const sql = `
      INSERT INTO nex_system_config (config_key, config_value, config_type, description, category, sort)
      VALUES (?, ?, 'string', '', 'system', 0)
      ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)
    `;
    await db.query(sql, [key, String(value)]);
  }
}

/**
 * 重置所有配置为默认值
 */
async function resetAllConfigs() {
  await db.query('DELETE FROM nex_system_config');
  await initDefaultData();
}

module.exports = {
  initTable,
  initDefaultData,
  getAllConfigs,
  getConfigsByCategory,
  getConfigByKey,
  updateConfigs,
  resetAllConfigs
};
