/**
 * Beagle 测试平台 - 数据库初始化
 * 使用 sql.js（纯 JS 实现的 SQLite，WebAssembly，零编译）
 * 封装了类似 better-sqlite3 的 API（prepare/get/all/run/exec）
 */
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'beagle.db');

let dbInstance = null;
let isInitialized = false;

/**
 * 数据库封装类，提供类似 better-sqlite3 的 API
 */
class DatabaseWrapper {
  constructor(db) {
    this.db = db;
  }

  /**
   * 准备 SQL 语句，返回 { get, all, run }
   */
  prepare(sql) {
    const self = this;
    return {
      /** 获取单行 */
      get(...params) {
        const stmt = self.db.prepare(sql);
        try {
          stmt.bind(params.length === 1 && typeof params[0] === 'object' ? params[0] : params);
          let result = null;
          if (stmt.step()) {
            result = stmt.getAsObject();
          }
          return result;
        } finally {
          stmt.free();
        }
      },
      /** 获取所有行 */
      all(...params) {
        const stmt = self.db.prepare(sql);
        try {
          stmt.bind(params.length === 1 && typeof params[0] === 'object' ? params[0] : params);
          const results = [];
          while (stmt.step()) {
            results.push(stmt.getAsObject());
          }
          return results;
        } finally {
          stmt.free();
        }
      },
      /** 执行写入操作 */
      run(...params) {
        const flatParams = params.length === 1 && typeof params[0] === 'object'
          ? Object.values(params[0])
          : params;
        const stmt = self.db.prepare(sql);
        try {
          stmt.bind(flatParams);
          stmt.step();
        } finally {
          stmt.free();
        }
        // 关键：必须在 save()(内部 db.export()) 之前读取自增 id 和影响行数，
        // 否则 export 会重置连接状态，导致 lastInsertRowid / changes 变成 0。
        let lastId = 0;
        try {
          const rows = self.db.exec('SELECT last_insert_rowid() AS id');
          if (rows && rows[0] && Array.isArray(rows[0].values) && rows[0].values[0]) {
            lastId = Number(rows[0].values[0][0]) || 0;
          }
        } catch (e) {
          console.error('[DB] 读取 last_insert_rowid 失败:', e.message);
        }
        const changes = self.db.getRowsModified();
        self.save();
        if (/^\s*(INSERT|REPLACE)/i.test(sql) && lastId === 0) {
          console.error('[DB] 警告: INSERT 后 lastInsertRowid=0, sql=', sql.slice(0, 80), 'params=', flatParams);
        }
        return { lastInsertRowid: lastId, changes };
      }
    };
  }

  /** 执行多条 SQL */
  exec(sql) {
    this.db.exec(sql);
    this.save();
  }

  /** pragma（sql.js 不支持，忽略） */
  pragma() {}

  /** 持久化到文件 */
  save() {
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch (err) {
      console.error('[DB] 保存数据库失败:', err.message);
    }
  }
}

/**
 * 初始化数据库
 */
async function initDatabase() {
  if (isInitialized) return dbInstance;

  console.log('[DB] 正在初始化 sql.js...');
  const SQL = await initSqlJs();

  let db;
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('[DB] 已从文件加载数据库:', DB_PATH);
  } else {
    db = new SQL.Database();
    console.log('[DB] 已创建新数据库:', DB_PATH);
  }

  dbInstance = new DatabaseWrapper(db);

  // 初始化表结构
  initSchema(dbInstance);

  isInitialized = true;
  console.log('[DB] 数据库初始化完成');
  return dbInstance;
}

/**
 * 初始化数据库表
 */
function initSchema(db) {
  db.exec(`
    -- 被测项目表
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      frontend_path TEXT DEFAULT '',
      backend_path TEXT DEFAULT '',
      api_base_url TEXT DEFAULT '',
      admin_username TEXT DEFAULT '',
      admin_password TEXT DEFAULT '',
      env_vars TEXT DEFAULT '{}',
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    -- 测试模块配置表
    CREATE TABLE IF NOT EXISTS module_configs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      module_type TEXT NOT NULL,
      config TEXT DEFAULT '{}',
      enabled INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 全局插件状态表（元信息从插件代码读取，数据库只存启用状态）
    CREATE TABLE IF NOT EXISTS plugins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_type TEXT NOT NULL UNIQUE,
      module_name TEXT DEFAULT '',
      description TEXT DEFAULT '',
      icon TEXT DEFAULT 'Setting',
      category TEXT DEFAULT 'other',
      version TEXT DEFAULT '1.0.0',
      author TEXT DEFAULT '',
      path TEXT DEFAULT '',
      enabled INTEGER DEFAULT 1,
      installed_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    -- 项目-插件关联表（多对多）
    CREATE TABLE IF NOT EXISTS project_plugins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      module_type TEXT NOT NULL,
      config TEXT DEFAULT '{}',
      enabled INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime')),
      UNIQUE(project_id, module_type),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 测试执行记录表
    CREATE TABLE IF NOT EXISTS test_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      module_type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      total_count INTEGER DEFAULT 0,
      pass_count INTEGER DEFAULT 0,
      fail_count INTEGER DEFAULT 0,
      duration INTEGER DEFAULT 0,
      report_path TEXT DEFAULT '',
      triggered_by TEXT DEFAULT 'manual',
      error_message TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      finished_at TEXT DEFAULT '',
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 定时任务表
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      module_type TEXT NOT NULL,
      cron_expression TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      last_run_at TEXT DEFAULT '',
      next_run_at TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 系统配置表
    CREATE TABLE IF NOT EXISTS system_configs (
      key TEXT PRIMARY KEY,
      value TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);
}

/**
 * 获取数据库实例（必须在 initDatabase 之后调用）
 */
function getDb() {
  if (!dbInstance) {
    throw new Error('数据库尚未初始化，请先调用 initDatabase()');
  }
  return dbInstance;
}

module.exports = { initDatabase, getDb };
