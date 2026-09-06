/**
 * 数据库管理服务层
 * 负责数据库管理的业务逻辑
 */
const dbManagerModel = require('./db-manager.model');
const { BACKUP_DIR } = require('./db-manager.model');

/**
 * 获取所有表列表
 */
async function getAllTables() {
  return await dbManagerModel.getAllTables();
}

/**
 * 获取表结构
 * @param {string} tableName 表名
 */
async function getTableStructure(tableName) {
  return await dbManagerModel.getTableStructure(tableName);
}

/**
 * 获取表数据（分页）
 * @param {string} tableName 表名
 * @param {number} page 页码
 * @param {number} pageSize 每页条数
 * @param {string} search 搜索关键词
 */
async function getTableData(tableName, page = 1, pageSize = 20, search = '') {
  return await dbManagerModel.getTableData(tableName, page, pageSize, search);
}

/**
 * 更新表数据
 * @param {string} tableName 表名
 * @param {object} data 数据
 * @param {object} where 条件
 * @param {string} operator 操作人
 */
async function updateTableData(tableName, data, where, operator = '') {
  // 操作前自动备份原数据
  try {
    await dbManagerModel.createBackup('table', tableName, `编辑${tableName}前自动备份`, operator);
  } catch (err) {
    console.warn('自动备份失败:', err.message);
  }

  return await dbManagerModel.updateTableData(tableName, data, where);
}

/**
 * 插入表数据
 * @param {string} tableName 表名
 * @param {object} data 数据
 * @param {string} operator 操作人
 */
async function insertTableData(tableName, data, operator = '') {
  return await dbManagerModel.insertTableData(tableName, data);
}

/**
 * 删除表数据
 * @param {string} tableName 表名
 * @param {object} where 条件
 * @param {string} operator 操作人
 */
async function deleteTableData(tableName, where, operator = '') {
  // 操作前自动备份原数据
  try {
    await dbManagerModel.createBackup('table', tableName, `删除${tableName}数据前自动备份`, operator);
  } catch (err) {
    console.warn('自动备份失败:', err.message);
  }

  return await dbManagerModel.deleteTableData(tableName, where);
}

/**
 * 创建数据库备份
 * @param {string} backupType 备份类型：full全量/table单表
 * @param {string} tableName 单表备份时的表名
 * @param {string} remark 备份备注
 * @param {string} operator 操作人
 */
async function createBackup(backupType = 'full', tableName = null, remark = '', operator = '') {
  return await dbManagerModel.createBackup(backupType, tableName, remark, operator);
}

/**
 * 获取备份列表
 * @param {number} page 页码
 * @param {number} pageSize 每页条数
 */
async function getBackupList(page = 1, pageSize = 20) {
  const result = await dbManagerModel.getBackupList(page, pageSize);

  // 格式化文件大小
  result.list = result.list.map(item => {
    item.file_size_formatted = formatFileSize(item.file_size);
    return item;
  });

  // 返回存储路径的绝对路径
  result.storagePath = BACKUP_DIR;

  return result;
}

/**
 * 获取备份详情
 * @param {number} id 备份ID
 */
async function getBackupById(id) {
  const backup = await dbManagerModel.getBackupById(id);
  if (backup) {
    backup.file_size_formatted = formatFileSize(backup.file_size);
  }
  return backup;
}

/**
 * 删除备份
 * @param {number} id 备份ID
 */
async function deleteBackup(id) {
  return await dbManagerModel.deleteBackup(id);
}

/**
 * 执行数据库回滚
 * @param {number} backupId 备份ID
 * @param {string} operator 操作人
 */
async function restoreBackup(backupId, operator = '') {
  return await dbManagerModel.restoreBackup(backupId, operator);
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
  restoreBackup
};
