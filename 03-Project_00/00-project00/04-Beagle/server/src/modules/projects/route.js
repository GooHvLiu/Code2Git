/**
 * 项目管理路由
 * 被测项目的增删改查
 */
const express = require('express');
const router = express.Router();
const { getDb } = require('../../db');

// 懒加载 db 代理（数据库异步初始化，运行时才获取真实实例）
const db = new Proxy({}, {
  get(_, prop) {
    const realDb = getDb();
    return typeof realDb[prop] === 'function' ? realDb[prop].bind(realDb) : realDb[prop];
  }
});

// 获取项目列表
router.get('/', (req, res) => {
  try {
    const { page = 1, pageSize = 20, keyword = '' } = req.query;
    const offset = (page - 1) * pageSize;
    let where = '';
    const params = [];
    if (keyword) {
      where = 'WHERE name LIKE ? OR description LIKE ?';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    const total = db.prepare(`SELECT COUNT(*) as count FROM projects ${where}`).get(...params).count;
    const list = db.prepare(
      `SELECT id, name, description, frontend_path, backend_path, api_base_url, status, created_at, updated_at
       FROM projects ${where} ORDER BY id DESC LIMIT ? OFFSET ?`
    ).all(...params, Number(pageSize), offset);
    res.success({ list, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    res.error(err.message);
  }
});

// 获取所有项目（下拉选择用）
router.get('/all', (req, res) => {
  try {
    const list = db.prepare('SELECT id, name FROM projects WHERE status = ? ORDER BY id').all('active');
    res.success(list);
  } catch (err) {
    res.error(err.message);
  }
});

// 获取项目详情
router.get('/:id', (req, res) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) return res.error('项目不存在', 404);
    // 密码不返回明文
    if (project.admin_password) {
      project.admin_password = '******';
    }
    project.env_vars = JSON.parse(project.env_vars || '{}');
    res.success(project);
  } catch (err) {
    res.error(err.message);
  }
});

// 新增项目
router.post('/', (req, res) => {
  try {
    const { name, description = '', frontend_path = '', backend_path = '',
            api_base_url = '', admin_username = '', admin_password = '', env_vars = {} } = req.body;
    if (!name) return res.error('项目名称不能为空', 400);
    const result = db.prepare(
      `INSERT INTO projects (name, description, frontend_path, backend_path, api_base_url, admin_username, admin_password, env_vars)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(name, description, frontend_path, backend_path, api_base_url,
          admin_username, admin_password === '******' ? '' : admin_password, JSON.stringify(env_vars));
    res.success({ id: result.lastInsertRowid }, '创建成功');
  } catch (err) {
    res.error(err.message);
  }
});

// 更新项目
router.put('/:id', (req, res) => {
  try {
    const { name, description, frontend_path, backend_path, api_base_url,
            admin_username, admin_password, env_vars, status } = req.body;
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) return res.error('项目不存在', 404);

    const updates = [];
    const params = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (frontend_path !== undefined) { updates.push('frontend_path = ?'); params.push(frontend_path); }
    if (backend_path !== undefined) { updates.push('backend_path = ?'); params.push(backend_path); }
    if (api_base_url !== undefined) { updates.push('api_base_url = ?'); params.push(api_base_url); }
    if (admin_username !== undefined) { updates.push('admin_username = ?'); params.push(admin_username); }
    if (admin_password !== undefined && admin_password !== '******') {
      updates.push('admin_password = ?'); params.push(admin_password);
    }
    if (env_vars !== undefined) { updates.push('env_vars = ?'); params.push(JSON.stringify(env_vars)); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    updates.push("updated_at = datetime('now', 'localtime')");
    params.push(req.params.id);

    db.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    res.success(null, '更新成功');
  } catch (err) {
    res.error(err.message);
  }
});

// 删除项目
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    res.success(null, '删除成功');
  } catch (err) {
    res.error(err.message);
  }
});

module.exports = router;
