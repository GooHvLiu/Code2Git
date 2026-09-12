/**
 * 系统设置路由
 */
const express = require('express');
const router = express.Router();
const { getDb } = require('../../db');

const db = new Proxy({}, {
  get(_, prop) {
    const realDb = getDb();
    return typeof realDb[prop] === 'function' ? realDb[prop].bind(realDb) : realDb[prop];
  }
});

// 默认存储路径
const defaultStorage = {
  databasePath: 'server/data/beagle.db',
  reportPath: 'server/reports/',
  pluginPath: 'server/src/test-modules/',
  logPath: 'server/logs/'
};

// 获取存储路径配置
router.get('/storage', (req, res) => {
  try {
    const rows = db.prepare("SELECT key, value FROM system_configs WHERE key LIKE 'storage_%'").all();
    const result = { ...defaultStorage };
    for (const row of rows) {
      const key = row.key.replace('storage_', '');
      result[key] = row.value;
    }
    res.success(result);
  } catch (err) {
    res.success(defaultStorage);
  }
});

// 保存存储路径配置
router.post('/storage', (req, res) => {
  try {
    const data = req.body;
    const mapping = {
      databasePath: 'storage_databasePath',
      reportPath: 'storage_reportPath',
      pluginPath: 'storage_pluginPath',
      logPath: 'storage_logPath'
    };
    for (const [field, key] of Object.entries(mapping)) {
      if (data[field] !== undefined) {
        const existing = db.prepare('SELECT key FROM system_configs WHERE key = ?').get(key);
        if (existing) {
          db.prepare("UPDATE system_configs SET value = ?, updated_at = datetime('now','localtime') WHERE key = ?").run(data[field], key);
        } else {
          db.prepare('INSERT INTO system_configs (key, value) VALUES (?, ?)').run(key, data[field]);
        }
      }
    }
    res.success(null, '设置已保存');
  } catch (err) {
    res.error(err.message);
  }
});

module.exports = router;
