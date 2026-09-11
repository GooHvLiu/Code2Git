/**
 * 菜单模块 - 控制器层
 * 负责：参数接收、调用service、返回响应
 */
const menuService = require('./menu.service');
const { ERROR_CODE } = require('../../constants/errorCode');

class MenuController {
  /**
   * 获取登录用户的动态菜单路由（支持版本号缓存 + 多语言）
   * 接口：GET /api/menu/getRouters?version=xxx&lang=en-US
   */
  async getRouters(req, res, next) {
    try {
      const userId = req.user.id;
      const version = req.query.version;
      const lang = req.query.lang || 'zh-CN';

      const result = await menuService.getUserMenuTreeWithVersion(userId, version, lang);

      if (result === null) {
        return res.success(null, null, ERROR_CODE.MENU_NOT_MODIFIED);
      }

      res.success({ menu: result.tree, version: result.version });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取菜单最新版本号
   * 接口：GET /api/menu/version
   */
  async getVersion(req, res, next) {
    try {
      const version = await menuService.getMenuVersion();
      res.success({ version });
    } catch (err) {
      next(err);
    }
  }

  // ==================== 菜单配置管理相关接口 ====================

  /**
   * 获取所有菜单树（用于菜单配置页面）
   * 接口：GET /api/menu/admin/tree
   */
  async getAdminMenuTree(req, res, next) {
    try {
      const result = await menuService.getAllMenuTree();
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 创建菜单
   * 接口：POST /api/menu/admin
   */
  async createMenu(req, res, next) {
    try {
      const menuData = req.body;
      const result = await menuService.createMenu(menuData);
      res.success(result, '菜单创建成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 更新菜单
   * 接口：PUT /api/menu/admin/:id
   */
  async updateMenu(req, res, next) {
    try {
      const { id } = req.params;
      const menuData = req.body;
      const result = await menuService.updateMenu(id, menuData);
      res.success(result, '菜单更新成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除菜单
   * 接口：DELETE /api/menu/admin/:id
   */
  async deleteMenu(req, res, next) {
    try {
      const { id } = req.params;
      const result = await menuService.deleteMenu(id);
      res.success(result, '菜单删除成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 拖拽菜单
   * 接口：PUT /api/menu/admin/:id/drag
   */
  async dragMenu(req, res, next) {
    try {
      const { id } = req.params;
      const { parentId, sort } = req.body;
      const result = await menuService.dragMenu(id, parentId, sort);
      res.success(result, '菜单拖拽成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 批量保存菜单修改
   * 接口：POST /api/menu/admin/batch-save
   */
  async batchSaveChanges(req, res, next) {
    try {
      const { changes } = req.body;
      const result = await menuService.batchSaveChanges(changes);
      res.success(result, '批量保存成功');
    } catch (err) {
      next(err);
    }
  }

  // ==================== 备份管理相关接口 ====================

  /**
   * 获取备份目录配置
   * 接口：GET /api/menu/admin/backup/dir
   */
  async getBackupDir(req, res, next) {
    try {
      const result = await menuService.getBackupDirConfig();
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 设置备份目录
   * 接口：PUT /api/menu/admin/backup/dir
   */
  async setBackupDir(req, res, next) {
    try {
      const { backupDir } = req.body;
      const result = await menuService.setBackupDir(backupDir);
      res.success(result, '备份目录设置成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 创建备份
   * 接口：POST /api/menu/admin/backup
   */
  async createBackup(req, res, next) {
    try {
      const { remark } = req.body || {};
      const result = await menuService.createBackup(remark);
      res.success(result, '备份创建成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取备份列表
   * 接口：GET /api/menu/admin/backup/list
   */
  async getBackupList(req, res, next) {
    try {
      const result = await menuService.getBackupList();
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 恢复备份
   * 接口：POST /api/menu/admin/backup/restore
   */
  async restoreBackup(req, res, next) {
    try {
      const { fileName } = req.body;
      const result = await menuService.restoreBackup(fileName);
      res.success(result, '备份恢复成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除备份
   * 接口：DELETE /api/menu/admin/backup/:fileName
   */
  async deleteBackup(req, res, next) {
    try {
      const { fileName } = req.params;
      const result = await menuService.deleteBackup(fileName);
      res.success(result, '备份删除成功');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MenuController();
