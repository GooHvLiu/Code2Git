/**
 * 菜单模块 - 业务逻辑层
 */
const fs = require('fs');
const path = require('path');
const menuModel = require('./menu.model');
const { BusinessError } = require('../../middleware/error.middleware');
const { ERROR_CODE } = require('../../constants/errorCode');

// ========== 备份路径配置 ==========
// 默认备份目录
const DEFAULT_BACKUP_DIR = path.join(__dirname, '../../../backups', 'menu');
// 备份配置文件路径
const BACKUP_CONFIG_FILE = path.join(__dirname, '../../config', 'menu-backup-config.json');

// ========== 备份工具函数 ==========
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getBackupDir() {
  try {
    if (fs.existsSync(BACKUP_CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(BACKUP_CONFIG_FILE, 'utf-8'));
      if (config.backupDir) {
        return config.backupDir;
      }
    }
  } catch (e) {
    // 读取配置失败时使用默认目录
  }
  return DEFAULT_BACKUP_DIR;
}

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

class MenuService {
  /**
   * 获取菜单最新版本号
   * @returns {Promise<string|null>}
   */
  async getMenuVersion() {
    return await menuModel.getMenuVersion();
  }

  /**
   * 带版本号的菜单查询
   * @param {number} userId 用户ID
   * @param {string} version 前端缓存的版本号
   * @param {string} lang 语言代码
   * @returns {Promise<{tree: Array, version: string}|null>}
   */
  async getUserMenuTreeWithVersion(userId, version, lang = 'zh-CN') {
    if (!userId) {
      throw new BusinessError(ERROR_CODE.MENU_USER_ID_REQUIRED, null);
    }
    return await menuModel.findUserMenuTreeWithVersion(userId, version, lang);
  }

  // ==================== 菜单配置管理相关方法 ====================

  /**
   * 获取所有菜单树（用于菜单配置页面）
   * @returns {Promise<{tree: Array, list: Array}>} 菜单树和扁平列表
   */
  async getAllMenuTree() {
    const list = await menuModel.getAllMenuList();
    const tree = menuModel.buildAdminMenuTree(list);
    return { tree, list };
  }

  /**
   * 创建菜单
   * @param {Object} menuData 菜单数据
   * @returns {Promise<Object>} 创建的菜单信息
   */
  async createMenu(menuData) {
    if (!menuData.id) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单ID不能为空');
    }
    if (!menuData.name) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单name不能为空');
    }
    if (!menuData.path) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单path不能为空');
    }
    if (!menuData.title) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单title不能为空');
    }

    const existingMenu = await menuModel.getMenuById(menuData.id);
    if (existingMenu) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单ID已存在');
    }

    const nameUnique = await menuModel.checkNameUnique(menuData.name);
    if (!nameUnique) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单name已存在');
    }

    if (!menuData.sort) {
      const maxSort = await menuModel.getMaxSortByParent(menuData.parent_id);
      menuData.sort = maxSort + 1;
    }

    await menuModel.createMenu(menuData);
    const createdMenu = await menuModel.getMenuById(menuData.id);
    return createdMenu;
  }

  /**
   * 更新菜单
   * @param {string} id 菜单ID
   * @param {Object} menuData 菜单数据
   * @returns {Promise<Object>} 更新后的菜单信息
   */
  async updateMenu(id, menuData) {
    const existingMenu = await menuModel.getMenuById(id);
    if (!existingMenu) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单不存在');
    }

    if (!menuData.name) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单name不能为空');
    }
    if (!menuData.path) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单path不能为空');
    }
    if (!menuData.title) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单title不能为空');
    }

    const nameUnique = await menuModel.checkNameUnique(menuData.name, id);
    if (!nameUnique) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单name已存在');
    }

    await menuModel.updateMenu(id, menuData);
    const updatedMenu = await menuModel.getMenuById(id);
    return updatedMenu;
  }

  /**
   * 删除菜单（级联删除子菜单）
   * @param {string} id 菜单ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteMenu(id) {
    const existingMenu = await menuModel.getMenuById(id);
    if (!existingMenu) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单不存在');
    }

    const result = await menuModel.deleteMenuAndChildren(id);
    return result;
  }

  /**
   * 拖拽菜单（更新父级和排序）
   * @param {string} id 菜单ID
   * @param {string} parentId 新的父菜单ID
   * @param {number} sort 新的排序号
   * @returns {Promise<Object>} 更新结果
   */
  async dragMenu(id, parentId, sort) {
    const existingMenu = await menuModel.getMenuById(id);
    if (!existingMenu) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '菜单不存在');
    }

    if (parentId) {
      const childIds = await menuModel.getAllChildIds(id);
      if (childIds.includes(parentId)) {
        throw new BusinessError(ERROR_CODE.PARAM_ERROR, '不能将菜单拖拽到自己的子菜单下');
      }
    }

    const result = await menuModel.updateMenuParentAndSort(id, parentId, sort);
    return result;
  }

  /**
   * 批量保存菜单修改
   * @param {Array} changes 变更列表
   * @returns {Promise<Object>} 保存结果
   */
  async batchSaveChanges(changes) {
    if (!Array.isArray(changes) || changes.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '变更列表不能为空');
    }

    const results = {
      added: [],
      updated: [],
      deleted: []
    };

    for (const change of changes) {
      switch (change.type) {
        case 'add':
          const added = await this.createMenu(change.data);
          results.added.push(added);
          break;
        case 'update':
          const updated = await this.updateMenu(change.id, change.data);
          results.updated.push(updated);
          break;
        case 'delete':
          await this.deleteMenu(change.id);
          results.deleted.push(change.id);
          break;
        default:
          throw new BusinessError(ERROR_CODE.PARAM_ERROR, `未知的变更类型: ${change.type}`);
      }
    }

    return results;
  }

  // ==================== 备份管理相关方法 ====================

  /**
   * 获取备份目录配置
   * @returns {Promise<{backupDir: string}>}
   */
  async getBackupDirConfig() {
    return { backupDir: getBackupDir() };
  }

  /**
   * 设置备份目录
   * @param {string} dirPath 备份目录路径
   * @returns {Promise<{success: boolean, backupDir: string}>}
   */
  async setBackupDir(dirPath) {
    if (!dirPath) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '备份目录不能为空');
    }
    ensureDir(path.dirname(BACKUP_CONFIG_FILE));
    const config = { backupDir: dirPath, updatedAt: new Date().toISOString() };
    fs.writeFileSync(BACKUP_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    ensureDir(dirPath);
    return { success: true, backupDir: dirPath };
  }

  /**
   * 创建菜单备份
   * @param {string} remark 备份备注
   * @returns {Promise<{success: boolean, fileName: string, createdAt: string}>}
   */
  async createBackup(remark = '') {
    // 获取所有菜单数据
    const { tree, list } = await this.getAllMenuTree();

    const backupDir = getBackupDir();
    ensureDir(backupDir);

    const timestamp = getTimestamp();
    const fileName = `menu_backup_${timestamp}.json`;
    const filePath = path.join(backupDir, fileName);

    const backupData = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      remark: remark,
      menuCount: list ? list.length : 0,
      menuData: tree
    };

    // 写入备份文件
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf-8');

    // 获取文件大小
    let fileSize = 0;
    try {
      fileSize = fs.statSync(filePath).size;
    } catch (statErr) {
      console.warn('获取备份文件大小失败:', statErr.message);
    }

    return {
      success: true,
      fileName: fileName,
      createdAt: new Date().toISOString(),
      size: fileSize
    };
  }

  /**
   * 获取备份列表
   * @returns {Promise<Array>} 备份列表
   */
  async getBackupList() {
    try {
      const backupDir = getBackupDir();
      if (!fs.existsSync(backupDir)) {
        return [];
      }

      const allFiles = fs.readdirSync(backupDir);
      const backupFiles = allFiles.filter(f => f.endsWith('.json') && f.startsWith('menu_backup_'));

      const result = [];
      for (const f of backupFiles) {
        try {
          const filePath = path.join(backupDir, f);
          const stats = fs.statSync(filePath);
          let remark = '';
          let menuCount = 0;
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsed = JSON.parse(content);
            remark = parsed.remark || '';
            menuCount = parsed.menuCount || 0;
          } catch (parseErr) {
            // 解析失败时使用默认值，不影响其他文件
            console.warn(`解析备份文件失败: ${f}`, parseErr.message);
          }
          result.push({
            fileName: f,
            size: stats.size,
            createdAt: stats.mtime.toISOString(),
            remark: remark,
            menuCount: menuCount,
            path: filePath
          });
        } catch (fileErr) {
          // 单个文件处理失败时跳过，不影响其他文件
          console.warn(`处理备份文件失败: ${f}`, fileErr.message);
        }
      }

      // 按创建时间倒序排序
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return result;
    } catch (err) {
      console.error('获取备份列表失败:', err);
      return [];
    }
  }

  /**
   * 恢复备份
   * @param {string} fileName 备份文件名
   * @returns {Promise<{success: boolean, restoredFrom: string}>}
   */
  async restoreBackup(fileName) {
    const backupDir = getBackupDir();
    const filePath = path.join(backupDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '备份文件不存在');
    }

    // 先创建当前数据的备份
    await this.createBackup('恢复前自动备份');

    // 读取备份文件
    const backupData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!backupData.menuData) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '备份文件格式不正确');
    }

    // 清空当前菜单数据
    const allMenus = await menuModel.getAllMenuList();
    for (const menu of allMenus) {
      await menuModel.deleteMenuAndChildren(menu.id);
    }

    // 递归创建菜单
    const createMenusRecursive = (nodes, parentId = '') => {
      for (const node of nodes) {
        const menuData = {
          id: node.id,
          parent_id: parentId,
          name: node.name,
          path: node.path,
          component: node.component,
          redirect: node.redirect,
          title: node.title,
          icon: node.icon,
          hidden: node.hidden,
          always_show: node.alwaysShow || node.always_show,
          no_cache: node.noCache || node.no_cache,
          sort: node.sort,
          type: node.type || 2
        };
        menuModel.createMenu(menuData);
        if (node.children && node.children.length > 0) {
          createMenusRecursive(node.children, node.id);
        }
      }
    };

    createMenusRecursive(backupData.menuData);

    return {
      success: true,
      restoredFrom: fileName
    };
  }

  /**
   * 删除备份
   * @param {string} fileName 备份文件名
   * @returns {Promise<{success: boolean}>}
   */
  async deleteBackup(fileName) {
    const backupDir = getBackupDir();
    const filePath = path.join(backupDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '备份文件不存在');
    }

    fs.unlinkSync(filePath);
    return { success: true };
  }
}

module.exports = new MenuService();
