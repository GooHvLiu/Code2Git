/**
 * 文件管理模块 - 业务逻辑层
 * 支持配置文件的在线读取、编辑、备份、回滚、语法检查
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { BusinessError } = require('../../middleware/error.middleware');
const { ERROR_CODE } = require('../../constants/errorCode');

// 项目根目录
const PROJECT_ROOT = path.resolve(__dirname, '../../../');

// 备份文件存储目录（可配置）
let backupDir = path.join(PROJECT_ROOT, 'backups', 'config');

/**
 * 验证文件路径是否安全（防止路径遍历攻击）
 * 只允许访问项目根目录下的文件
 */
function validateFilePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('文件路径不能为空');
  }

  // 不允许绝对路径
  if (path.isAbsolute(filePath)) {
    throw new Error('不允许使用绝对路径');
  }

  // 不允许路径遍历
  if (filePath.includes('..')) {
    throw new Error('不允许使用路径遍历');
  }

  const fullPath = path.join(PROJECT_ROOT, filePath);
  const normalizedRoot = path.resolve(PROJECT_ROOT);
  const normalizedFull = path.resolve(fullPath);

  // 验证文件路径是否在项目根目录下
  if (!normalizedFull.startsWith(normalizedRoot)) {
    throw new Error('文件路径超出项目目录范围');
  }

  return fullPath;
}

// 可编辑的配置文件白名单
const EDITABLE_FILES = [
  {
    path: '.env',
    name: '环境变量',
    description: '后端环境变量配置',
    type: 'env',
    category: '环境变量'
  },
  {
    path: 'src/config/app.config.js',
    name: '应用配置',
    description: '应用基本配置，包括bcrypt加密强度等',
    type: 'js',
    category: '配置文件'
  },
  {
    path: 'src/config/db.config.js',
    name: '数据库配置',
    description: '数据库连接配置',
    type: 'js',
    category: '配置文件'
  },
  {
    path: 'src/config/jwt.config.js',
    name: 'JWT配置',
    description: 'JWT Token配置',
    type: 'js',
    category: '配置文件'
  },
  {
    path: 'src/config/upload.config.js',
    name: '上传配置',
    description: '文件上传配置，包括本地上传和GitHub图床',
    type: 'js',
    category: '配置文件'
  },
  {
    path: 'src/config/license.config.js',
    name: '授权配置',
    description: '授权系统配置',
    type: 'js',
    category: '配置文件'
  },
  {
    path: 'src/modules/email/email.config.js',
    name: '邮箱配置',
    description: '邮箱发送配置',
    type: 'js',
    category: '配置文件'
  },
  {
    path: 'src/plc/config/plcSetting.js',
    name: 'PLC配置',
    description: 'PLC通讯配置',
    type: 'js',
    category: '配置文件'
  }
];

class FileManagerService {
  constructor() {
    // 确保备份目录存在
    this.ensureBackupDir();
  }

  /**
   * 确保备份目录存在
   */
  ensureBackupDir() {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
  }

  /**
   * 获取备份目录路径
   */
  getBackupDir() {
    return {
      absolute: backupDir,
      relative: path.relative(PROJECT_ROOT, backupDir) || '.'
    };
  }

  /**
   * 修改备份目录路径
   * @param {string} newPath - 新的备份目录路径（相对路径或绝对路径）
   */
  setBackupDir(newPath) {
    if (!newPath || typeof newPath !== 'string') {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '备份路径不能为空');
    }

    // 解析为绝对路径
    const resolvedPath = path.isAbsolute(newPath)
      ? newPath
      : path.join(PROJECT_ROOT, newPath);

    // 确保新目录存在
    if (!fs.existsSync(resolvedPath)) {
      fs.mkdirSync(resolvedPath, { recursive: true });
    }

    // 更新备份目录
    const oldPath = backupDir;
    backupDir = resolvedPath;

    return {
      old: {
        absolute: oldPath,
        relative: path.relative(PROJECT_ROOT, oldPath) || '.'
      },
      new: {
        absolute: backupDir,
        relative: path.relative(PROJECT_ROOT, backupDir) || '.'
      }
    };
  }

  /**
   * 获取可编辑的配置文件列表
   */
  async getEditableFileList() {
    const list = EDITABLE_FILES.map(file => {
      const fullPath = path.join(PROJECT_ROOT, file.path);
      const exists = fs.existsSync(fullPath);
      let stat = null;
      if (exists) {
        stat = fs.statSync(fullPath);
      }
      return {
        ...file,
        exists,
        size: stat ? stat.size : 0,
        sizeFormatted: stat ? this.formatBytes(stat.size) : '0 B',
        lastModified: stat ? stat.mtime : null,
        lastModifiedFormatted: stat ? this.formatDate(stat.mtime) : '-'
      };
    });

    // 按分类分组
    const grouped = {};
    list.forEach(file => {
      if (!grouped[file.category]) {
        grouped[file.category] = [];
      }
      grouped[file.category].push(file);
    });

    return grouped;
  }

  /**
   * 读取指定文件的内容
   */
  async readFile(filePath) {
    // 安全验证文件路径
    const fullPath = validateFilePath(filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error('文件不存在');
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const stat = fs.statSync(fullPath);

    // 尝试获取文件信息（白名单内的文件有详细信息）
    const fileInfo = this.getFileInfo(filePath);
    const fileName = fileInfo ? fileInfo.name : path.basename(filePath);
    const fileType = fileInfo ? fileInfo.type : path.extname(filePath).slice(1) || 'unknown';

    return {
      path: filePath,
      name: fileName,
      type: fileType,
      content,
      size: stat.size,
      sizeFormatted: this.formatBytes(stat.size),
      lastModified: stat.mtime,
      lastModifiedFormatted: this.formatDate(stat.mtime)
    };
  }

  /**
   * 写入文件内容（修改前自动备份）
   */
  async writeFile(filePath, content, remark, user) {
    // 安全验证文件路径
    const fullPath = validateFilePath(filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error('文件不存在');
    }

    // 语法检查
    const syntaxResult = await this.checkSyntax(filePath, content);
    if (!syntaxResult.valid) {
      throw new Error(`语法检查失败: ${syntaxResult.error}`);
    }

    // 自动备份原文件
    const backupName = this.createBackup(filePath, user, remark || '修改前自动备份');

    // 写入新内容
    fs.writeFileSync(fullPath, content, 'utf-8');

    return {
      success: true,
      message: '文件保存成功',
      backupName,
      tip: '修改后需要重启后端服务才能生效'
    };
  }

  /**
   * 获取指定文件的备份列表
   */
  async getBackupList(filePath) {
    // 安全验证文件路径
    validateFilePath(filePath);

    // 备份文件命名：文件名_时间戳_操作人.bak
    const fileBaseName = path.basename(filePath).replace(/\./g, '_');
    const backupPrefix = `${fileBaseName}_`;

    if (!fs.existsSync(backupDir)) {
      return [];
    }

    const files = fs.readdirSync(backupDir);
    const backups = files
      .filter(file => file.startsWith(backupPrefix) && file.endsWith('.bak'))
      .map(file => {
        const fullPath = path.join(backupDir, file);
        const stat = fs.statSync(fullPath);
        // 解析文件名：文件名_时间戳_操作人_备注.bak
        const parts = file.replace(backupPrefix, '').replace('.bak', '').split('_');
        const timestamp = parts[0] || '';
        const operator = parts[1] || 'unknown';
        const remark = parts.slice(2).join('_') || '';

        return {
          name: file,
          size: stat.size,
          sizeFormatted: this.formatBytes(stat.size),
          createTime: stat.mtime,
          createTimeFormatted: this.formatDate(stat.mtime),
          timestamp,
          operator,
          remark: decodeURIComponent(remark)
        };
      })
      .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

    // 只保留最近20个备份
    return backups.slice(0, 20);
  }

  /**
   * 读取备份文件内容
   */
  async readBackup(filePath, backupName) {
    const fullPath = path.join(backupDir, backupName);
    if (!fs.existsSync(fullPath)) {
      throw new Error('备份文件不存在');
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    return {
      name: backupName,
      content
    };
  }

  /**
   * 回滚到指定备份版本
   */
  async restoreBackup(filePath, backupName, user) {
    // 安全验证文件路径
    const fullPath = validateFilePath(filePath);

    const backupPath = path.join(backupDir, backupName);
    if (!fs.existsSync(backupPath)) {
      throw new Error('备份文件不存在');
    }

    if (!fs.existsSync(fullPath)) {
      throw new Error('目标文件不存在');
    }

    // 读取备份内容
    const backupContent = fs.readFileSync(backupPath, 'utf-8');

    // 语法检查
    const syntaxResult = await this.checkSyntax(filePath, backupContent);
    if (!syntaxResult.valid) {
      throw new Error(`备份文件语法检查失败: ${syntaxResult.error}`);
    }

    // 回滚前自动备份当前版本
    const currentBackupName = this.createBackup(filePath, user, '回滚前自动备份');

    // 写入备份内容
    fs.writeFileSync(fullPath, backupContent, 'utf-8');

    return {
      success: true,
      message: '回滚成功',
      currentBackupName,
      tip: '回滚后需要重启后端服务才能生效'
    };
  }

  /**
   * 删除指定备份
   */
  async deleteBackup(filePath, backupName) {
    const fullPath = path.join(backupDir, backupName);
    if (!fs.existsSync(fullPath)) {
      throw new Error('备份文件不存在');
    }

    fs.unlinkSync(fullPath);
    return { success: true, message: '备份删除成功' };
  }

  /**
   * 语法检查
   */
  async checkSyntax(filePath, content) {
    const fileInfo = this.getFileInfo(filePath);
    if (!fileInfo) {
      return { valid: true, warning: '未知文件类型，跳过语法检查' };
    }

    if (fileInfo.type === 'js') {
      // JS文件语法检查：使用 node --check
      return new Promise((resolve) => {
        const tempFile = path.join(backupDir, `_temp_check_${Date.now()}.js`);
        try {
          fs.writeFileSync(tempFile, content, 'utf-8');
          exec(`node --check "${tempFile}"`, (error, stdout, stderr) => {
            // 清理临时文件
            if (fs.existsSync(tempFile)) {
              fs.unlinkSync(tempFile);
            }
            if (error) {
              resolve({
                valid: false,
                error: stderr || error.message
              });
            } else {
              resolve({ valid: true });
            }
          });
        } catch (err) {
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
          resolve({ valid: false, error: err.message });
        }
      });
    } else if (fileInfo.type === 'env') {
      // env文件语法检查：简单格式检查
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // 跳过空行和注释
        if (!line || line.startsWith('#')) continue;
        // 检查是否包含=
        if (!line.includes('=')) {
          return {
            valid: false,
            error: `第${i + 1}行格式错误：缺少=分隔符`
          };
        }
      }
      return { valid: true };
    }

    return { valid: true, warning: '未知文件类型，跳过语法检查' };
  }

  // ==================== 辅助方法 ====================

  /**
   * 获取文件信息
   */
  getFileInfo(filePath) {
    return EDITABLE_FILES.find(f => f.path === filePath);
  }

  /**
   * 创建备份
   */
  createBackup(filePath, user, remark) {
    const fullPath = path.join(PROJECT_ROOT, filePath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const fileBaseName = path.basename(filePath).replace(/\./g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const operator = user?.username || 'unknown';
    const remarkEncoded = encodeURIComponent(remark || '').replace(/%/g, '_');
    const backupName = `${fileBaseName}_${timestamp}_${operator}_${remarkEncoded}.bak`;
    const backupPath = path.join(backupDir, backupName);

    fs.writeFileSync(backupPath, content, 'utf-8');

    // 清理旧备份（只保留最近20个）
    this.cleanOldBackups(filePath);

    return backupName;
  }

  /**
   * 清理旧备份
   */
  cleanOldBackups(filePath) {
    const fileBaseName = path.basename(filePath).replace(/\./g, '_');
    const backupPrefix = `${fileBaseName}_`;

    if (!fs.existsSync(backupDir)) return;

    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith(backupPrefix) && file.endsWith('.bak'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        mtime: fs.statSync(path.join(backupDir, file)).mtime
      }))
      .sort((a, b) => new Date(b.mtime) - new Date(a.mtime));

    // 删除超过20个的旧备份
    if (files.length > 20) {
      files.slice(20).forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          // 忽略删除错误
        }
      });
    }
  }

  /**
   * 格式化字节数
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 格式化日期
   */
  formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}

module.exports = new FileManagerService();
