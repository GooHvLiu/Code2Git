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
 * 执行数据库备份
 * @param {string} backupType 备份类型：full全量/table单表
 * @param {string} tableName 单表备份时的表名
 * @param {string} remark 备份备注
 * @param {string} operator 操作人
 */
async function createBackup(backupType = 'full', tableName = null, remark = '', operator = '') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `${backupType}_${timestamp}.sql`;
  const filePath = path.join(BACKUP_DIR, backupName);

  // 使用项目统一的数据库配置，添加 --set-gtid-purged=OFF 避免回滚时GTID冲突
  // 排除 nex_db_backup 表，避免回滚时备份记录丢失
  let dumpCommand = `mysqldump --set-gtid-purged=OFF --ignore-table=${dbConfig.database}.nex_db_backup -h${dbConfig.host} -P${dbConfig.port} -u${dbConfig.user} -p${dbConfig.password} ${dbConfig.database}`;
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
        // 记录失败的备份
        await db.query(`
          INSERT INTO nex_db_backup (backup_name, backup_type, table_name, file_path, file_size, remark, operator, status, error_msg)
          VALUES (?, ?, ?, ?, 0, ?, ?, 'failed', ?)
        `, [backupName, backupType, tableName, filePath, remark, operator, error.message + '\n' + stderr]);
        reject(error);
        return;
      }

      // 获取文件大小
      const fileSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;

      // 记录备份
      await db.query(`
        INSERT INTO nex_db_backup (backup_name, backup_type, table_name, file_path, file_size, remark, operator, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'success')
      `, [backupName, backupType, tableName, filePath, fileSize, remark, operator]);

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

  const countResult = await db.query('SELECT COUNT(*) as total FROM nex_db_backup');
  const total = countResult[0]?.total || 0;

  const list = await db.query(`
    SELECT * FROM nex_db_backup 
    ORDER BY created_at DESC 
    LIMIT ${pageSizeNum} OFFSET ${offset}
  `);

  return { list, total, page: pageNum, pageSize: pageSizeNum };
}

/**
 * 获取备份详情
 * @param {number} id 备份ID
 */
async function getBackupById(id) {
  const result = await db.query('SELECT * FROM nex_db_backup WHERE id = ?', [id]);
  return result[0] || null;
}

/**
 * 删除备份
 * @param {number} id 备份ID
 */
async function deleteBackup(id) {
  const backup = await getBackupById(id);
  if (!backup) {
    throw new Error('Backup not found');
  }

  // 删除文件
  if (fs.existsSync(backup.file_path)) {
    fs.unlinkSync(backup.file_path);
  }

  // 删除记录
  await db.query('DELETE FROM nex_db_backup WHERE id = ?', [id]);
  return true;
}

/**
 * 执行数据库回滚
 * @param {number} backupId 备份ID
 * @param {string} operator 操作人
 */
async function restoreBackup(backupId, operator = '') {
  const backup = await getBackupById(backupId);
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

  const preDumpCommand = `mysqldump --set-gtid-purged=OFF --ignore-table=${dbConfig.database}.nex_db_backup -h${dbConfig.host} -P${dbConfig.port} -u${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > "${preRestoreFilePath}"`;

  console.log('[数据库回滚] 回滚前自动备份命令:', preDumpCommand);

  return new Promise((resolve, reject) => {
    exec(preDumpCommand, async (preError, preStdout, preStderr) => {
      if (preError) {
        console.warn('[数据库回滚] 回滚前自动备份失败:', preError.message);
        console.warn('[数据库回滚] stderr:', preStderr);
      } else {
        const preFileSize = fs.existsSync(preRestoreFilePath) ? fs.statSync(preRestoreFilePath).size : 0;
        await db.query(`
          INSERT INTO nex_db_backup (backup_name, backup_type, table_name, file_path, file_size, remark, operator, status)
          VALUES (?, 'full', NULL, ?, ?, '回滚前自动备份', ?, 'success')
        `, [preRestoreBackupName, preRestoreFilePath, preFileSize, operator]);
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
        resolve({ success: true, backupId, restoredAt: new Date() });
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
