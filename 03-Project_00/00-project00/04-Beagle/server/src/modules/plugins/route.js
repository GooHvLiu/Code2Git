/**
 * 插件管理路由
 * 架构原则：插件元信息（name/icon/author/version等）始终从插件代码读取，
 * 数据库只存储用户操作产生的状态（enabled、项目绑定关系、项目级配置）。
 */
const express = require('express');
const router = express.Router();
const registry = require('../../test-modules/registry');
const { getDb } = require('../../db');

function db() { return getDb(); }

/**
 * 确保数据库中有该插件的状态记录（不存在则创建，默认启用）
 */
function ensurePluginRecord(moduleType) {
  const existing = db().prepare('SELECT id FROM plugins WHERE module_type = ?').get(moduleType);
  if (!existing) {
    // module_name 在旧 schema 中是 NOT NULL，提供空字符串兼容，元信息实际从代码读取
    db().prepare('INSERT INTO plugins (module_type, module_name, enabled) VALUES (?, ?, 1)').run(moduleType, '');
  }
}

/**
 * 获取插件全局启用状态（默认启用）
 */
function getPluginEnabled(moduleType) {
  const row = db().prepare('SELECT enabled FROM plugins WHERE module_type = ?').get(moduleType);
  return row ? row.enabled === 1 : true;
}

// ========== 插件列表 ==========
// 元信息从 registry（代码）读取，enabled 从数据库读取
router.get('/list', (req, res) => {
  try {
    const modules = registry.listModules();
    const result = modules.map(mod => {
      ensurePluginRecord(mod.moduleType);
      return {
        module_type: mod.moduleType,
        module_name: mod.moduleName,
        description: mod.description,
        icon: mod.icon,
        category: mod.category,
        version: mod.version,
        author: mod.author,
        progressStages: mod.progressStages,
        configSchema: mod.configSchema,
        enabled: getPluginEnabled(mod.moduleType) ? 1 : 0
      };
    });
    // 按 category 排序
    result.sort((a, b) => (a.category || '').localeCompare(b.category || '') || a.module_type.localeCompare(b.module_type));
    res.success(result);
  } catch (err) {
    console.error('[Plugins] list error:', err);
    res.error(err.message);
  }
});

// ========== 启用/禁用插件 ==========
router.put('/toggle/:moduleType', (req, res) => {
  try {
    const { enabled } = req.body;
    const mt = req.params.moduleType;
    ensurePluginRecord(mt);
    db().prepare(`UPDATE plugins SET enabled=?, updated_at=datetime('now','localtime') WHERE module_type=?`)
      .run(enabled ? 1 : 0, mt);
    res.success(null, enabled ? '插件已启用' : '插件已禁用');
  } catch (err) {
    res.error(err.message);
  }
});

// ========== 获取项目已绑定的插件 ==========
router.get('/project/:projectId', (req, res) => {
  try {
    const projectId = req.params.projectId;
    const bindRows = db().prepare('SELECT * FROM project_plugins WHERE project_id = ?').all(projectId);
    const bindMap = {};
    for (const r of bindRows) {
      bindMap[r.module_type] = {
        config: JSON.parse(r.config || '{}'),
        projectEnabled: r.enabled === 1
      };
    }

    const modules = registry.listModules();
    const result = modules
      .filter(mod => bindMap[mod.moduleType])
      .map(mod => ({
        module_type: mod.moduleType,
        module_name: mod.moduleName,
        description: mod.description,
        icon: mod.icon,
        category: mod.category,
        version: mod.version,
        author: mod.author,
        config: bindMap[mod.moduleType].config,
        project_enabled: bindMap[mod.moduleType].projectEnabled ? 1 : 0,
        global_enabled: getPluginEnabled(mod.moduleType) ? 1 : 0
      }));
    res.success(result);
  } catch (err) {
    res.error(err.message);
  }
});

// ========== 绑定插件到项目 ==========
router.post('/project/:projectId/bind', (req, res) => {
  try {
    const { module_type, config = {}, enabled = 1 } = req.body;
    if (!module_type) return res.error('模块类型不能为空', 400);

    const existing = db().prepare('SELECT id FROM project_plugins WHERE project_id=? AND module_type=?')
      .get(req.params.projectId, module_type);

    if (existing) {
      db().prepare(`UPDATE project_plugins SET config=?, enabled=?, updated_at=datetime('now','localtime') WHERE id=?`)
        .run(JSON.stringify(config), enabled ? 1 : 0, existing.id);
    } else {
      db().prepare(`INSERT INTO project_plugins (project_id, module_type, config, enabled) VALUES (?, ?, ?, ?)`)
        .run(req.params.projectId, module_type, JSON.stringify(config), enabled ? 1 : 0);
    }
    res.success(null, '插件已绑定到项目');
  } catch (err) {
    res.error(err.message);
  }
});

// ========== 解除项目插件绑定 ==========
router.delete('/project/:projectId/unbind/:moduleType', (req, res) => {
  try {
    db().prepare('DELETE FROM project_plugins WHERE project_id=? AND module_type=?')
      .run(req.params.projectId, req.params.moduleType);
    res.success(null, '已解除绑定');
  } catch (err) {
    res.error(err.message);
  }
});

// ========== 获取项目可用插件（已绑定 + 全局启用 + 项目启用）==========
router.get('/project/:projectId/available', (req, res) => {
  try {
    const projectId = req.params.projectId;
    const bindRows = db().prepare('SELECT * FROM project_plugins WHERE project_id = ? AND enabled = 1').all(projectId);
    const bindMap = {};
    for (const r of bindRows) {
      bindMap[r.module_type] = JSON.parse(r.config || '{}');
    }

    const modules = registry.listModules();
    const result = [];
    const grouped = {};

    for (const mod of modules) {
      // 必须绑定到项目
      if (!bindMap[mod.moduleType]) continue;
      // 必须全局启用
      if (!getPluginEnabled(mod.moduleType)) continue;

      const item = {
        moduleType: mod.moduleType,
        moduleName: mod.moduleName,
        description: mod.description,
        icon: mod.icon,
        category: mod.category,
        version: mod.version,
        author: mod.author,
        progressStages: mod.progressStages,
        configSchema: mod.configSchema,
        config: bindMap[mod.moduleType]
      };
      result.push(item);
      if (!grouped[mod.category]) grouped[mod.category] = [];
      grouped[mod.category].push(item);
    }

    res.success({ plugins: result, grouped });
  } catch (err) {
    res.error(err.message);
  }
});

module.exports = router;
