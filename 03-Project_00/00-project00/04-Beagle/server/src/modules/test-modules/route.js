/**
 * 旧模块路由（兼容层）
 * 新代码请使用 /api/plugins。此文件保留是为了兼容 dashboard/reports 等页面。
 */
const express = require('express');
const router = express.Router();
const registry = require('../../test-modules/registry');
const { getDb } = require('../../db');

function db() { return getDb(); }

// 模块列表（从 registry 代码读取，合并数据库启用状态）
router.get('/list', (req, res) => {
  try {
    const modules = registry.listModules();
    const result = modules.map(mod => {
      const row = db().prepare('SELECT enabled FROM plugins WHERE module_type = ?').get(mod.moduleType);
      return {
        moduleType: mod.moduleType,
        moduleName: mod.moduleName,
        description: mod.description,
        icon: mod.icon,
        category: mod.category,
        version: mod.version,
        author: mod.author,
        progressStages: mod.progressStages,
        configSchema: mod.configSchema,
        enabled: row ? row.enabled === 1 : true
      };
    });
    res.success(result);
  } catch (err) {
    res.error(err.message);
  }
});

// 获取项目的模块配置（从 project_plugins 读取）
router.get('/config/:projectId', (req, res) => {
  try {
    const rows = db().prepare(
      'SELECT module_type, config, enabled FROM project_plugins WHERE project_id = ?'
    ).all(req.params.projectId);
    const configs = {};
    for (const r of rows) {
      configs[r.module_type] = {
        config: JSON.parse(r.config || '{}'),
        enabled: r.enabled === 1
      };
    }
    res.success(configs);
  } catch (err) {
    res.error(err.message);
  }
});

// 保存项目的模块配置（写入 project_plugins）
router.post('/config/:projectId', (req, res) => {
  try {
    const { module_type, config = {}, enabled = 1 } = req.body;
    if (!module_type) return res.error('module_type 不能为空', 400);

    const existing = db().prepare(
      'SELECT id FROM project_plugins WHERE project_id=? AND module_type=?'
    ).get(req.params.projectId, module_type);

    if (existing) {
      db().prepare(
        `UPDATE project_plugins SET config=?, enabled=?, updated_at=datetime('now','localtime') WHERE id=?`
      ).run(JSON.stringify(config), enabled ? 1 : 0, existing.id);
    } else {
      db().prepare(
        'INSERT INTO project_plugins (project_id, module_type, config, enabled) VALUES (?, ?, ?, ?)'
      ).run(req.params.projectId, module_type, JSON.stringify(config), enabled ? 1 : 0);
    }
    res.success(null, '配置已保存');
  } catch (err) {
    res.error(err.message);
  }
});

module.exports = router;
