/**
 * 数据库表/字段使用分析器
 * 1) 静态扫描后端代码中引用的表（SQL 关键字 + ORM 定义）与字段
 * 2) 扫描 .sql 文件中的建表定义
 * 3) 可选连接真实数据库（mysql，动态依赖，缺失则自动降级为纯静态分析）
 * 4) 对比得出：代码使用但未定义的表、定义但未使用的表、多语言列/JSON 多语言字段
 */
const fs = require('fs');
const path = require('path');
const { walk, readText, toRel } = require('./fileWalker');

// SQL 中提取表名
const TABLE_FROM_RE = /(?:from|join|into|update|table)\s+`?([a-zA-Z_][\w]*)`?/gi;
// CREATE TABLE 定义
const CREATE_TABLE_RE = /create\s+table\s+(?:if\s+not\s+exists\s+)?`?([a-zA-Z_][\w]*)`?\s*\(([\s\S]*?)\)\s*[;)]/gi;
// 列定义（建表括号内，逐行）
const COLUMN_RE = /^\s*`?([a-zA-Z_][\w]*)`?\s+([A-Za-z]+(?:\([\d,\s]+\))?)/;
// 多语言列后缀
const I18N_COLUMN_RE = /^(.+?)_(zh|en|ja|ko|fr|de|es|ru|ar|pt)$/i;
// JSON 多语言字段值 {"zh":..,"en":..}
const JSON_I18N_RE = /['"](?:zh-?cn|en-?us|zh|en|ja)['"]\s*:/gi;

/**
 * 静态分析后端目录
 */
function staticAnalyze(backendPath, opts = {}) {
  const out = {
    usedTables: new Set(),
    tableLocations: {},   // table -> [files]
    definedTables: {},    // table -> { columns: [], source }
    sqlFiles: [],
    ormModels: [],
    i18nColumns: {},      // table -> [columns]
    jsonI18nHits: []
  };
  if (!backendPath || !fs.existsSync(backendPath)) return finalize(out, '后端路径不存在，未做数据库静态分析');

  const codeExts = ['.js', '.ts', '.mjs', '.cjs', '.sql'];
  const { files } = walk(backendPath, { exts: codeExts, maxFiles: opts.maxFiles || 15000 });

  for (const file of files) {
    const content = readText(file);
    if (content == null) continue;
    const rel = toRel(backendPath, file);
    const ext = path.extname(file).toLowerCase();

    if (ext === '.sql') {
      out.sqlFiles.push(rel);
      parseCreateTable(content, out, rel);
      // SQL 文件里的 from/join 也算使用
      collectUsedTables(content, out, rel);
      continue;
    }

    // 代码文件：收集使用的表名
    collectUsedTables(content, out, rel);

    // ORM 模型定义线索：sequelize.define('x') / mongoose.model('x') / tableName: 'x'
    const ormRe = /(?:define|model|tableName)\s*[:(]\s*['"`]([a-zA-Z_][\w]*)['"`]/g;
    let m;
    while ((m = ormRe.exec(content)) !== null) {
      out.ormModels.push({ table: m[1], file: rel });
      out.usedTables.add(m[1]);
    }

    // JSON 多语言字段线索
    if (JSON_I18N_RE.test(content)) {
      out.jsonI18nHits.push(rel);
    }
  }
  return finalize(out, null);
}

function collectUsedTables(content, out, rel) {
  TABLE_FROM_RE.lastIndex = 0;
  let m;
  while ((m = TABLE_FROM_RE.exec(content)) !== null) {
    const t = m[1];
    // 过滤 SQL 关键字误判
    if (/^(select|where|set|values)$/i.test(t)) continue;
    out.usedTables.add(t);
    if (!out.tableLocations[t]) out.tableLocations[t] = [];
    if (out.tableLocations[t].length < 10) out.tableLocations[t].push(rel);
  }
}

function parseCreateTable(content, out, rel) {
  CREATE_TABLE_RE.lastIndex = 0;
  let m;
  while ((m = CREATE_TABLE_RE.exec(content)) !== null) {
    const table = m[1];
    const body = m[2];
    const columns = [];
    for (const line of body.split('\n')) {
      const trimmed = line.trim().replace(/,$/, '');
      const cm = trimmed.match(COLUMN_RE);
      if (cm && !/^(primary|foreign|unique|key|constraint|index)$/i.test(cm[1])) {
        columns.push(cm[1]);
        const i18m = cm[1].match(I18N_COLUMN_RE);
        if (i18m) {
          if (!out.i18nColumns[table]) out.i18nColumns[table] = [];
          out.i18nColumns[table].push(cm[1]);
        }
      }
    }
    out.definedTables[table] = { columns, source: rel };
  }
}

function finalize(out, warning) {
  const definedNames = new Set(Object.keys(out.definedTables));
  const usedButNotDefined = [...out.usedTables].filter(t => !definedNames.has(t));
  const definedButNotUsed = [...definedNames].filter(t => !out.usedTables.has(t));
  return {
    warning,
    usedTables: [...out.usedTables].sort(),
    definedTables: out.definedTables,
    sqlFiles: out.sqlFiles,
    ormModels: out.ormModels,
    usedButNotDefined,
    definedButNotUsed,
    i18nColumns: out.i18nColumns,
    jsonI18nHits: [...new Set(out.jsonI18nHits)],
    tableLocations: out.tableLocations
  };
}

/**
 * 尝试连接真实数据库比对（可选，动态依赖）
 * 支持 mysql/mariadb。依赖缺失或连接失败时返回 null（调用方降级）。
 */
async function connectAndInspect(dbConfig) {
  if (!dbConfig || !dbConfig.host || dbConfig.type !== 'mysql') return null;
  let mysql;
  try {
    mysql = require('mysql2/promise');
  } catch (e) {
    return { available: false, reason: '未安装 mysql2，已跳过真实库比对（仅静态分析）' };
  }
  let conn;
  try {
    conn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port || 3306,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });
    const [rows] = await conn.execute(
      `SELECT table_name AS t, table_rows AS rows_est
       FROM information_schema.tables WHERE table_schema = ?`, [dbConfig.database]);
    const tables = {};
    for (const r of rows) {
      const [cols] = await conn.execute(
        `SELECT column_name AS c, data_type AS dt, is_nullable AS nullable
         FROM information_schema.columns WHERE table_schema=? AND table_name=?`,
        [dbConfig.database, r.t]);
      tables[r.t] = { rowsEst: r.rows_est, columns: cols.map(c => c.c) };
    }
    return { available: true, tables };
  } catch (e) {
    return { available: false, reason: `数据库连接失败: ${e.message}` };
  } finally {
    if (conn) try { await conn.end(); } catch (e) { /* ignore */ }
  }
}

module.exports = { staticAnalyze, connectAndInspect, I18N_COLUMN_RE };
