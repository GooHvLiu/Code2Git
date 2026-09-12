/**
 * 测试执行路由
 * 触发测试、查询执行记录、获取报告
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { getDb } = require('../../db');
const registry = require('../../test-modules/registry');

// 懒加载 db 代理
const db = new Proxy({}, {
  get(_, prop) {
    const realDb = getDb();
    return typeof realDb[prop] === 'function' ? realDb[prop].bind(realDb) : realDb[prop];
  }
});

const REPORTS_DIR = path.join(__dirname, '../../../reports');
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// 触发测试执行
router.post('/run', async (req, res) => {
  try {
    const { project_id, module_type, config } = req.body;
    if (!project_id || !module_type) {
      return res.error('project_id 和 module_type 不能为空', 400);
    }

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(project_id);
    if (!project) return res.error('项目不存在', 404);

    if (!registry.has(module_type)) {
      return res.error(`未找到模块类型: ${module_type}`, 400);
    }

    // 创建执行记录
    const runResult = db.prepare(
      `INSERT INTO test_runs (project_id, module_type, status, triggered_by)
       VALUES (?, ?, 'running', 'manual')`
    ).run(project_id, module_type);
    const runId = runResult.lastInsertRowid;

    // 异步执行测试（不阻塞响应）
    (async () => {
      try {
        // 获取模块配置：优先用请求传入的，否则从 project_plugins 读取
        let moduleConfig = config || {};
        if (!config) {
          const cfgRow = db.prepare(
            'SELECT config FROM project_plugins WHERE project_id = ? AND module_type = ?'
          ).get(project_id, module_type);
          if (cfgRow) moduleConfig = JSON.parse(cfgRow.config || '{}');
        }

        const instance = registry.createInstance(module_type, project, moduleConfig);
        const report = await instance.run();

        // 保存报告文件
        const reportDir = path.join(REPORTS_DIR, String(project_id));
        if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
        const reportFile = path.join(reportDir, `${module_type}_${runId}.json`);
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');

        // 更新执行记录
        db.prepare(
          `UPDATE test_runs SET status = ?, total_count = ?, pass_count = ?, fail_count = ?,
           duration = ?, report_path = ?, finished_at = datetime('now', 'localtime')
           WHERE id = ?`
        ).run(
          report.fail > 0 ? 'failed' : 'success',
          report.total, report.pass, report.fail,
          report.duration, reportFile, runId
        );
      } catch (err) {
        console.error('[TestRun] 执行出错:', err);
        db.prepare(
          `UPDATE test_runs SET status = 'error', error_message = ?, finished_at = datetime('now', 'localtime')
           WHERE id = ?`
        ).run(err.message, runId);
      }
    })();

    res.success({ run_id: runId }, '测试已开始执行');
  } catch (err) {
    res.error(err.message);
  }
});

// 查询执行记录列表
router.get('/list', (req, res) => {
  try {
    const { page = 1, pageSize = 20, project_id, module_type, status } = req.query;
    const offset = (page - 1) * pageSize;
    let where = 'WHERE 1=1';
    const params = [];
    if (project_id) { where += ' AND project_id = ?'; params.push(project_id); }
    if (module_type) { where += ' AND module_type = ?'; params.push(module_type); }
    if (status) { where += ' AND status = ?'; params.push(status); }

    const total = db.prepare(`SELECT COUNT(*) as count FROM test_runs ${where}`).get(...params).count;
    const list = db.prepare(
      `SELECT r.*, p.name as project_name
       FROM test_runs r LEFT JOIN projects p ON r.project_id = p.id
       ${where} ORDER BY r.id DESC LIMIT ? OFFSET ?`
    ).all(...params, Number(pageSize), offset);
    res.success({ list, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    res.error(err.message);
  }
});

// 查询执行记录详情
router.get('/:id', (req, res) => {
  try {
    const run = db.prepare(
      `SELECT r.*, p.name as project_name
       FROM test_runs r LEFT JOIN projects p ON r.project_id = p.id
       WHERE r.id = ?`
    ).get(req.params.id);
    if (!run) return res.error('执行记录不存在', 404);
    res.success(run);
  } catch (err) {
    res.error(err.message);
  }
});

// 获取测试报告
router.get('/:id/report', (req, res) => {
  try {
    const run = db.prepare('SELECT * FROM test_runs WHERE id = ?').get(req.params.id);
    if (!run) return res.error('执行记录不存在', 404);
    if (!run.report_path || !fs.existsSync(run.report_path)) {
      return res.error('报告文件不存在', 404);
    }
    const report = JSON.parse(fs.readFileSync(run.report_path, 'utf-8'));
    res.success(report);
  } catch (err) {
    res.error(err.message);
  }
});

// 删除执行记录
router.delete('/:id', (req, res) => {
  try {
    const run = db.prepare('SELECT report_path FROM test_runs WHERE id = ?').get(req.params.id);
    if (run && run.report_path && fs.existsSync(run.report_path)) {
      try { fs.unlinkSync(run.report_path); } catch (e) { /* 忽略 */ }
    }
    db.prepare('DELETE FROM test_runs WHERE id = ?').run(req.params.id);
    res.success(null, '删除成功');
  } catch (err) {
    res.error(err.message);
  }
});

module.exports = router;
