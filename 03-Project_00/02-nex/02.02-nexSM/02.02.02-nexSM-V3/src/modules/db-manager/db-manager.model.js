/**
 * 数据库管理数据模型
 * 负责数据库管理相关的数据库操作
 */
const db = require('../../db');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const dbConfig = require('../../config/db.config');

// 备份文件存储目录
const BACKUP_DIR = path.join(__dirname, '../../../backups/database');

// 确保备份目录存在
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * 获取所有表列表
 */
async function getAllTables() {
  const sql = `
    SELECT 
      TABLE_NAME as table_name,
      TABLE_COMMENT as table_comment,
      TABLE_ROWS as table_rows,
      DATA_LENGTH as data_length,
      CREATE_TIME as create_time,
      UPDATE_TIME as update_time
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() 
    ORDER BY TABLE_NAME
  `;
  return await db.query(sql);
}

/**
 * 获取表结构
 * @param {string} tableName 表名
 */
async function getTableStructure(tableName) {
  // 防止SQL注入，只允许字母数字下划线
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    throw new Error('Invalid table name');
  }
  const sql = `
    SELECT 
      COLUMN_NAME as column_name,
      COLUMN_TYPE as column_type,
      IS_NULLABLE as is_nullable,
      COLUMN_KEY as column_key,
      COLUMN_DEFAULT as column_default,
      EXTRA as extra,
      COLUMN_COMMENT as column_comment,
      ORDINAL_POSITION as ordinal_position
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
    ORDER BY ORDINAL_POSITION
  `;
  return await db.query(sql, [tableName]);
}

/**
 * 获取表数据（分页）
 * @param {string} tableName 表名
 * @param {number} page 页码
 * @param {number} pageSize 每页条数
 * @param {string} search 搜索关键词
 */
async function getTableData(tableName, page = 1, pageSize = 20, search = '') {
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    throw new Error('Invalid table name');
  }

  const pageNum = parseInt(page) || 1;
  const pageSizeNum = parseInt(pageSize) || 20;
  const offset = (pageNum - 1) * pageSizeNum;

  // 获取总数
  let countSql = `SELECT COUNT(*) as total FROM \`${tableName}\``;
  let countParams = [];

  if (search) {
    // 获取表结构，用于搜索
    const columns = await getTableStructure(tableName);
    const searchConditions = columns
      .filter(col => col.column_type.includes('varchar') || col.column_type.includes('text') || col.column_type.includes('char'))
      .map(col => `\`${col.column_name}\` LIKE ?`)
      .join(' OR ');
    if (searchConditions) {
      countSql = `SELECT COUNT(*) as total FROM \`${tableName}\` WHERE ${searchConditions}`;
      countParams = columns
        .filter(col => col.column_type.includes('varchar') || col.column_type.includes('text') || col.column_type.includes('char'))
        .map(() => `%${search}%`);
    }
  }

  const countResult = await db.query(countSql, countParams);
  const total = countResult[0]?.total || 0;

  // 获取数据
  let dataSql = `SELECT * FROM \`${tableName}\` LIMIT ${pageSizeNum} OFFSET ${offset}`;
  let dataParams = [];

  if (search) {
    const columns = await getTableStructure(tableName);
    const searchConditions = columns
      .filter(col => col.column_type.includes('varchar') || col.column_type.includes('text') || col.column_type.includes('char'))
      .map(col => `\`${col.column_name}\` LIKE ?`)
      .join(' OR ');
    if (searchConditions) {
      dataSql = `SELECT * FROM \`${tableName}\` WHERE ${searchConditions} LIMIT ${pageSizeNum} OFFSET ${offset}`;
      dataParams = columns
        .filter(col => col.column_type.includes('varchar') || col.column_type.includes('text') || col.column_type.includes('char'))
        .map(() => `%${search}%`);
    }
  }

  const data = await db.query(dataSql, dataParams);

  return { data, total, page: pageNum, pageSize: pageSizeNum };
}

/**
 * 更新表数据
 * @param {string} tableName 表名
 * @param {object} data 数据
 * @param {object} where 条件
 */
async function updateTableData(tableName, data, where) {
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    throw new Error('Invalid table name');
  }

  const setClauses = Object.keys(data).map(key => `\`${key}\` = ?`).join(', ');
  const whereClauses = Object.keys(where).map(key => `\`${key}\` = ?`).join(' AND ');
  const params = [...Object.values(data), ...Object.values(where)];

  const sql = `UPDATE \`${tableName}\` SET ${setClauses} WHERE ${whereClauses}`;
  return await db.query(sql, params);
}

/**
 * 插入表数据
 * @param {string} tableName 表名
 * @param {object} data 数据
 */
async function insertTableData(tableName, data) {
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    throw new Error('Invalid table name');
  }

  const columns = Object.keys(data).map(key => `\`${key}\``).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const params = Object.values(data);

  const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
  return await db.query(sql, params);
}

/**
 * 删除表数据
 * @param {string} tableName 表名
 * @param {object} where 条件
 */
async function deleteTableData(tableName, where) {
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    throw new Error('Invalid table name');
  }

  const whereClauses = Object.keys(where).map(key => `\`${key}\` = ?`).join(' AND ');
  const params = Object.values(where);

  const sql = `DELETE FROM \`${tableName}\` WHERE ${whereClauses}`;
  return await db.query(sql, params);
}

/**
 * 从文件名解析备份信息
 * @param {string} fileName 文件名
 * @returns {Object} 备份信息
 */
function parseBackupFileName(fileName) {
  // 去掉 .sql 后缀
  const nameWithoutExt = fileName.replace(/\.sql$/, '');
  const parts = nameWithoutExt.split('_');

  let backupType = 'full';
  let tableName = null;
  let remark = '';
  let timestamp = '';

  if (parts[0] === 'pre' && parts[1] === 'restore') {
    // 回滚前自动备份: pre_restore_{timestamp}.sql
    backupType = 'full';
    remark = '回滚前自动备份';
    timestamp = parts.slice(2).join('_');
  } else if (parts[0] === 'table') {
    // 单表备份: table_{tableName}_{timestamp}.sql
    backupType = 'table';
    // 表名可能包含下划线，需要找到时间戳的位置
    // 时间戳格式: 2026-09-09T05-44-13-971Z
    const timestampIndex = parts.findIndex(p => /^\d{4}-\d{2}-\d{2}T/.test(p));
    if (timestampIndex > 1) {
      tableName = parts.slice(1, timestampIndex).join('_');
      timestamp = parts.slice(timestampIndex).join('_');
    } else {
      tableName = parts[1] || '';
      timestamp = parts.slice(2).join('_');
    }
  } else {
    // 全量备份: full_{timestamp}.sql
    backupType = 'full';
    timestamp = parts.slice(1).join('_');
  }

  return { backupType, tableName, remark, timestamp };
}

/**
 * 执行数据库备份
 * @param {string} backupType 备份类型：full全量/table单表
 * @param {string} tableName 单表备份时的表名
 * @param {string} remark 备份备注
 * @param {string} operator 操作人
 */
async function createBackup(backupType = 'full', tableName = null, remark = '', operator = '') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  let backupName;
  if (backupType === 'table' && tableName) {
    backupName = `table_${tableName}_${timestamp}.sql`;
  } else {
    backupName = `full_${timestamp}.sql`;
  }
  const filePath = path.join(BACKUP_DIR, backupName);

  // 使用项目统一的数据库配置，添加 --set-gtid-purged=OFF 避免回滚时GTID冲突
  let dumpCommand = `mysqldump --set-gtid-purged=OFF -h${dbConfig.host} -P${dbConfig.port} -u${dbConfig.user} -p${dbConfig.password} ${dbConfig.database}`;
  if (backupType === 'table' && tableName) {
    dumpCommand += ` ${tableName}`;
  }
  dumpCommand += ` > "${filePath}"`;

  console.log('[数据库备份] 执行命令:', dumpCommand);

  return new Promise((resolve, reject) => {
    exec(dumpCommand, async (error, stdout, stderr) => {
      if (error) {
        console.error('[数据库备份] 失败:', error.message);
        console.error('[数据库备份] stderr:', stderr);
        // 备份失败时删除可能生成的不完整文件
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
        }
        reject(error);
        return;
      }

      // 获取文件大小
      const fileSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;

      resolve({ backupName, filePath, fileSize });
    });
  });
}

/**
 * 获取备份列表
 * @param {number} page 页码
 * @param {number} pageSize 每页条数
 */
async function getBackupList(page = 1, pageSize = 20) {
  const pageNum = parseInt(page) || 1;
  const pageSizeNum = parseInt(pageSize) || 20;
  const offset = (pageNum - 1) * pageSizeNum;

  if (!fs.existsSync(BACKUP_DIR)) {
    return { list: [], total: 0, page: pageNum, pageSize: pageSizeNum };
  }

  const allFiles = fs.readdirSync(BACKUP_DIR);
  const backupFiles = allFiles.filter(f => f.endsWith('.sql'));

  const allBackups = [];
  for (const f of backupFiles) {
    try {
      const filePath = path.join(BACKUP_DIR, f);
      const stats = fs.statSync(filePath);
      const parsed = parseBackupFileName(f);
      allBackups.push({
        id: f,
        backup_name: f,
        backup_type: parsed.backupType,
        table_name: parsed.tableName,
        file_path: filePath,
        file_size: stats.size,
        remark: parsed.remark,
        operator: '',
        status: 'success',
        error_msg: null,
        create_time: stats.mtime
      });
    } catch (fileErr) {
      console.warn(`处理备份文件失败: ${f}`, fileErr.message);
    }
  }

  // 按创建时间倒序排序
  allBackups.sort((a, b) => new Date(b.create_time) - new Date(a.create_time));

  const total = allBackups.length;
  const list = allBackups.slice(offset, offset + pageSizeNum);

  return { list, total, page: pageNum, pageSize: pageSizeNum };
}

/**
 * 获取备份详情
 * @param {string} fileName 备份文件名
 */
async function getBackupById(fileName) {
  const filePath = path.join(BACKUP_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const stats = fs.statSync(filePath);
    const parsed = parseBackupFileName(fileName);
    return {
      id: fileName,
      backup_name: fileName,
      backup_type: parsed.backupType,
      table_name: parsed.tableName,
      file_path: filePath,
      file_size: stats.size,
      remark: parsed.remark,
      operator: '',
      status: 'success',
      error_msg: null,
      create_time: stats.mtime
    };
  } catch (err) {
    console.error('获取备份详情失败:', err);
    return null;
  }
}

/**
 * 删除备份
 * @param {string} fileName 备份文件名
 */
async function deleteBackup(fileName) {
  const filePath = path.join(BACKUP_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error('Backup file not found');
  }

  // 删除文件
  fs.unlinkSync(filePath);
  return true;
}

/**
 * 执行数据库回滚
 * @param {string} fileName 备份文件名
 * @param {string} operator 操作人
 */
async function restoreBackup(fileName, operator = '') {
  const backup = await getBackupById(fileName);
  if (!backup) {
    throw new Error('Backup not found');
  }

  if (!fs.existsSync(backup.file_path)) {
    throw new Error('Backup file not found: ' + backup.file_path);
  }

  console.log('[数据库回滚] 开始回滚，备份文件:', backup.file_path);

  // 回滚前自动备份当前数据
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const preRestoreBackupName = `pre_restore_${timestamp}.sql`;
  const preRestoreFilePath = path.join(BACKUP_DIR, preRestoreBackupName);

  const preDumpCommand = `mysqldump --set-gtid-purged=OFF -h${dbConfig.host} -P${dbConfig.port} -u${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > "${preRestoreFilePath}"`;

  console.log('[数据库回滚] 回滚前自动备份命令:', preDumpCommand);

  return new Promise((resolve, reject) => {
    exec(preDumpCommand, async (preError, preStdout, preStderr) => {
      if (preError) {
        console.warn('[数据库回滚] 回滚前自动备份失败:', preError.message);
        console.warn('[数据库回滚] stderr:', preStderr);
      } else {
        console.log('[数据库回滚] 回滚前自动备份成功:', preRestoreBackupName);
      }

      // 执行回滚
      const restoreCommand = `mysql -h${dbConfig.host} -P${dbConfig.port} -u${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} < "${backup.file_path}"`;

      console.log('[数据库回滚] 执行回滚命令:', restoreCommand);

      exec(restoreCommand, (restoreError, restoreStdout, restoreStderr) => {
        if (restoreError) {
          console.error('[数据库回滚] 回滚失败:', restoreError.message);
          console.error('[数据库回滚] stderr:', restoreStderr);
          reject(new Error(restoreError.message + '\n' + restoreStderr));
          return;
        }
        console.log('[数据库回滚] 回滚成功');
        resolve({ success: true, fileName, restoredAt: new Date() });
      });
    });
  });
}

module.exports = {
  getAllTables,
  getTableStructure,
  getTableData,
  updateTableData,
  insertTableData,
  deleteTableData,
  createBackup,
  getBackupList,
  getBackupById,
  deleteBackup,
  restoreBackup,
  BACKUP_DIR
};
