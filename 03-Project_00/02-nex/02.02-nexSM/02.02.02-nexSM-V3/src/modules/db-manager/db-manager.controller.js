/**
 * 数据库管理控制器
 * 负责数据库管理相关的请求处理
 * 国际化规范：成功用 res.success(data)；错误用 res.error('错误码')，前端按 common.error.错误码 翻译
 * console.error 为后端调试日志，保留中文
 */
const dbManagerService = require('./db-manager.service');

/**
 * 获取所有表列表
 */
async function getAllTables(req, res) {
  try {
    const tables = await dbManagerService.getAllTables();
    res.success(tables);
  } catch (err) {
    console.error('[数据库管理] 获取表列表失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
}

/**
 * 获取表结构
 */
async function getTableStructure(req, res) {
  try {
    const { tableName } = req.params;
    const structure = await dbManagerService.getTableStructure(tableName);
    res.success(structure);
  } catch (err) {
    console.error('[数据库管理] 获取表结构失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
}

/**
 * 获取表数据
 */
async function getTableData(req, res) {
  try {
    const { tableName } = req.params;
    const { page = 1, pageSize = 20, search = '' } = req.query;
    const result = await dbManagerService.getTableData(tableName, parseInt(page), parseInt(pageSize), search);
    res.success(result);
  } catch (err) {
    console.error('[数据库管理] 获取表数据失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
}

/**
 * 更新表数据
 */
async function updateTableData(req, res) {
  try {
    const { tableName } = req.params;
    const { data, where } = req.body;
    const operator = req.user?.username || 'unknown';

    if (!data || !where) {
      return res.error('PARAM_MISSING', null, 400);
    }

    const result = await dbManagerService.updateTableData(tableName, data, where, operator);
    res.success(result);
  } catch (err) {
    console.error('[数据库管理] 更新表数据失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
}

/**
 * 插入表数据
 */
async function insertTableData(req, res) {
  try {
    const { tableName } = req.params;
    const { data } = req.body;
    const operator = req.user?.username || 'unknown';

    if (!data) {
      return res.error('PARAM_MISSING', null, 400);
    }

    const result = await dbManagerService.insertTableData(tableName, data, operator);
    res.success(result);
  } catch (err) {
    console.error('[数据库管理] 插入表数据失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
}

/**
 * 删除表数据
 */
async function deleteTableData(req, res) {
  try {
    const { tableName } = req.params;
    const { where } = req.body;
    const operator = req.user?.username || 'unknown';

    if (!where) {
      return res.error('PARAM_MISSING', null, 400);
    }

    const result = await dbManagerService.deleteTableData(tableName, where, operator);
    res.success(result);
  } catch (err) {
    console.error('[数据库管理] 删除表数据失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
}

/**
 * 创建数据库备份
 */
async function createBackup(req, res) {
  try {
    const { backupType = 'full', tableName = null, remark = '' } = req.body;
    const operator = req.user?.username || 'unknown';

    const result = await dbManagerService.createBackup(backupType, tableName, remark, operator);
    res.success(result);
  } catch (err) {
    console.error('[数据库管理] 创建备份失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
}

/**
 * 获取备份列表
 */
async function getBackupList(req, res) {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const result = await dbManagerService.getBackupList(parseInt(page), parseInt(pageSize));
    res.success(result);
  } catch (err) {
    console.error('[数据库管理] 获取备份列表失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
}

/**
 * 获取备份详情
 */
async function getBackupById(req, res) {
  try {
    const { id } = req.params;
    const backup = await dbManagerService.getBackupById(parseInt(id));
    if (!backup) {
      return res.error('NOT_FOUND', null, 404);
    }
    res.success(backup);
  } catch (err) {
    console.error('[数据库管理] 获取备份详情失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
}

/**
 * 删除备份
 */
async function deleteBackup(req, res) {
  try {
    const { id } = req.params;
    await dbManagerService.deleteBackup(parseInt(id));
    res.success();
  } catch (err) {
    console.error('[数据库管理] 删除备份失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
}

/**
 * 执行数据库回滚
 */
async function restoreBackup(req, res) {
  try {
    const { id } = req.params;
    const operator = req.user?.username || 'unknown';

    const result = await dbManagerService.restoreBackup(parseInt(id), operator);
    res.success(result);
  } catch (err) {
    console.error('[数据库管理] 回滚失败:', err);
    res.error('DATABASE_ERROR', null, 500);
  }
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
