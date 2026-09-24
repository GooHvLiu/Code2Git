/**
 * ============================================================
 * 数据库迁移执行器（轻量自定义方案，无 ORM）
 * ------------------------------------------------------------
 * 功能描述：
 *   - 自动扫描本目录下的迁移文件（按文件名排序，约定：NNN_xxx.js）。
 *   - 在数据库中维护 schema_migrations 表，记录已执行的迁移。
 *   - 支持正向迁移与指定回滚：
 *       node src/migrations/index.js up               执行所有未执行的迁移
 *       node src/migrations/index.js down <name>      回滚指定迁移（name 为文件名，可不含 .js）
 *   - 每个迁移文件需导出 up(pool) / down(pool) 函数，参数为 mysql2/promise 连接池。
 * 说明：本脚本独立运行，自带 dotenv 加载，不依赖 app.js。
 * ------------------------------------------------------------
 * 作者：GooHv
 * 创建日期：2026-09-24
 * ============================================================
 */

'use strict';

// 独立运行时先加载环境变量
require('dotenv-expand').expand(require('dotenv').config());

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

const MIGRATIONS_DIR = __dirname;

/**
 * 创建数据库连接池（迁移专用）
 */
function createPool() {
  return mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    multipleStatements: true
  });
}

/**
 * 确保迁移记录表存在
 */
async function ensureMigrationsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) PRIMARY KEY,
      executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

/**
 * 读取已执行的迁移名集合
 */
async function getExecutedMigrations(pool) {
  const [rows] = await pool.query('SELECT name FROM schema_migrations');
  return new Set(rows.map((r) => r.name));
}

/**
 * 扫描并加载迁移文件（排除 index.js 自身），按文件名升序
 */
function loadMigrationFiles() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.js') && f !== 'index.js')
    .sort();
}

/**
 * 正向迁移：执行所有未执行的迁移
 */
async function up(pool) {
  await ensureMigrationsTable(pool);
  const executed = await getExecutedMigrations(pool);
  const files = loadMigrationFiles();

  let applied = 0;
  for (const file of files) {
    const name = file.replace(/\.js$/, '');
    if (executed.has(name)) {
      console.log(`  [skip] ${name}（已执行）`);
      continue;
    }

    const migration = require(path.join(MIGRATIONS_DIR, file));
    if (typeof migration.up !== 'function') {
      console.warn(`  [warn] ${name} 未定义 up()，跳过`);
      continue;
    }

    console.log(`  [up]   ${name} ...`);
    await migration.up(pool);
    await pool.query('INSERT INTO schema_migrations (name) VALUES (?)', [name]);
    applied++;
    console.log(`  [done] ${name}`);
  }

  console.log(`\n迁移完成：本次新执行 ${applied} 个，共 ${files.length} 个迁移文件。`);
}

/**
 * 回滚指定迁移
 * @param {object} pool mysql2 promise pool
 * @param {string} name 迁移名（文件名，可不含 .js 后缀）
 */
async function down(pool, name) {
  await ensureMigrationsTable(pool);
  const target = name.replace(/\.js$/, '');
  const files = loadMigrationFiles();
  const file = files.find((f) => f.replace(/\.js$/, '') === target);

  if (!file) {
    console.error(`未找到迁移文件：${name}`);
    process.exit(1);
  }

  const migration = require(path.join(MIGRATIONS_DIR, file));
  if (typeof migration.down !== 'function') {
    console.error(`迁移 ${target} 未定义 down()，无法回滚`);
    process.exit(1);
  }

  console.log(`  [down] ${target} ...`);
  await migration.down(pool);
  await pool.query('DELETE FROM schema_migrations WHERE name = ?', [target]);
  console.log(`  [done] ${target} 已回滚`);
}

/**
 * 入口
 */
async function main() {
  const command = process.argv[2] || 'up';
  const pool = createPool();

  try {
    if (command === 'up') {
      await up(pool);
    } else if (command === 'down') {
      const name = process.argv[3];
      if (!name) {
        console.error('用法：node src/migrations/index.js down <name>');
        process.exit(1);
      }
      await down(pool, name);
    } else {
      console.error(`未知命令：${command}（支持 up / down <name>）`);
      process.exit(1);
    }
  } catch (err) {
    console.error('迁移执行失败：', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
