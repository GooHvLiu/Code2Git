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
  const countSql = 'SELECT COUNT(*) as count FROM nex_system_config';
  const [result] = await db.query(countSql);
  if (result.count > 0) return;

  const defaultConfigs = [
    // 系统设置
    { key: 'sessionTimeout', value: '30', type: 'number', desc: '会话超时时间（分钟）', category: 'system', sort: 1 },
    { key: 'defaultPageSize', value: '20', type: 'number', desc: '默认每页条数', category: 'system', sort: 2 },
    { key: 'defaultLanguage', value: 'zh-CN', type: 'string', desc: '默认语言', category: 'system', sort: 3 },
    { key: 'dateFormat', value: 'YYYY-MM-DD', type: 'string', desc: '日期显示格式', category: 'system', sort: 4 },
    // 安全设置
    { key: 'watermarkEnabled', value: 'false', type: 'boolean', desc: '是否启用水印', category: 'security', sort: 1 },
    { key: 'watermarkText', value: '', type: 'string', desc: '水印文字（为空时使用当前用户名）', category: 'security', sort: 2 },
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
    { key: 'heartbeatInterval', value: '25000', type: 'number', desc: 'WebSocket心跳间隔（ms）', category: 'connection', sort: 1 }
  ];

  for (const config of defaultConfigs) {
    const sql = `
      INSERT INTO nex_system_config (config_key, config_value, config_type, description, category, sort)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [config.key, config.value, config.type, config.desc, config.category, config.sort]);
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
 * @param {Object} configs 配置对象 { key: value }
 */
async function updateConfigs(configs) {
  for (const [key, value] of Object.entries(configs)) {
    const sql = `
      UPDATE nex_system_config
      SET config_value = ?
      WHERE config_key = ?
    `;
    await db.query(sql, [String(value), key]);
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
