/**
 * 文件管理模块 - 控制器层
 * 支持配置文件的在线读取、编辑、备份、回滚
 * 仅超级管理员可访问
 */
const fileManagerService = require('./file-manager.service');

class FileManagerController {
  /**
   * 获取可编辑的配置文件列表
   */
  async getFileList(req, res, next) {
    try {
      const list = await fileManagerService.getEditableFileList();
      res.success(list);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取备份目录路径
   */
  async getBackupDir(req, res, next) {
    try {
      const result = fileManagerService.getBackupDir();
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 修改备份目录路径
   */
  async setBackupDir(req, res, next) {
    try {
      const { backupPath } = req.body;
      const result = fileManagerService.setBackupDir(backupPath);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 读取指定文件的内容
   */
  async readFile(req, res, next) {
    try {
      const { filePath } = req.query;
      const content = await fileManagerService.readFile(filePath);
      res.success(content);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 写入文件内容（修改前自动备份）
   */
  async writeFile(req, res, next) {
    try {
      const { filePath, content, remark } = req.body;
      const result = await fileManagerService.writeFile(filePath, content, remark, req.user);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取指定文件的备份列表
   */
  async getBackupList(req, res, next) {
    try {
      const { filePath } = req.query;
      const list = await fileManagerService.getBackupList(filePath);
      res.success(list);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 读取备份文件内容
   */
  async readBackup(req, res, next) {
    try {
      const { filePath, backupName } = req.query;
      const content = await fileManagerService.readBackup(filePath, backupName);
      res.success(content);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 回滚到指定备份版本
   */
  async restoreBackup(req, res, next) {
    try {
      const { filePath, backupName } = req.body;
      const result = await fileManagerService.restoreBackup(filePath, backupName, req.user);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除指定备份
   */
  async deleteBackup(req, res, next) {
    try {
      const { filePath, backupName } = req.body;
      await fileManagerService.deleteBackup(filePath, backupName);
      res.success(null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 语法检查
   */
  async checkSyntax(req, res, next) {
    try {
      const { filePath, content } = req.body;
      const result = await fileManagerService.checkSyntax(filePath, content);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FileManagerController();
