/**
 * 文件上传服务层
 * 本地存储 + GitHub 图床
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const https = require('https');

const uploadConfig = require('../../config/upload.config');
const fileUtil = require('../../utils/file');
const fileModel = require('./file.model');
const { BusinessError } = require('../../middleware/error.middleware');
const { ERROR_CODE } = require('../../constants/errorCode');

// GitHub API 专用 https agent（兼容你测试代码里的 rejectUnauthorized: false）
// 生产环境建议去掉 rejectUnauthorized，但你测试代码里用了，这里保持一致
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

class UploadService {
  // ==================== 本地上传 ====================

  /**
   * 组装本地单文件信息（Multer diskStorage 已写盘）
   */
  buildLocalFileInfo(file, options = {}) {
    if (!file) {
      throw new BusinessError(ERROR_CODE.FILE_NOT_EXIST, '请选择要上传的文件');
    }
    const dateDir = options.dateDir || fileUtil.generateDateDir('day');
    const relativePath = `${dateDir}/${file.filename}`;
    return {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      sizeText: fileUtil.formatFileSize(file.size),
      mimeType: file.mimetype,
      extname: fileUtil.getExtname(file.originalname),
      storageType: 'local',
      path: relativePath,
      url: fileUtil.buildLocalFileUrl(relativePath, options.host),
      uploadTime: new Date().toISOString()
    };
  }

  buildLocalFileList(files, options = {}) {
    if (!files || files.length === 0) {
      throw new BusinessError(ERROR_CODE.FILE_NOT_EXIST, '请选择要上传的文件');
    }
    return files.map(file => this.buildLocalFileInfo(file, options));
  }

  // ==================== GitHub 图床上传 ====================

  /**
   * 上传单个文件到 GitHub 图床
   * @param {Express.Multer.File} file memoryStorage 处理后的文件（含 buffer）
   * @param {Object} options { uploaderId }
   * @returns {Promise<Object>}
   */
  async uploadToGithub(file, options = {}) {
    if (!file) {
      throw new BusinessError(ERROR_CODE.FILE_NOT_EXIST, '请选择要上传的文件');
    }
    if (!uploadConfig.github.enabled) {
      throw new BusinessError(ERROR_CODE.GITHUB_CONFIG_ERROR, 'GitHub 图床配置不完整，请检查环境变量');
    }

    const { token, owner, repo, branch, pathPrefix, apiBaseUrl } = uploadConfig.github;

    // 1. 生成 GitHub 上的路径：images/年/月/uuid.ext
    const dateDir = fileUtil.generateDateDir('month');
    const newFilename = fileUtil.generateUuidFileName(file.originalname);
    const githubPath = `${pathPrefix}/${dateDir}/${newFilename}`;

    // 2. 文件内容 Base64 编码（GitHub API 要求）
    const content = file.buffer.toString('base64');

    // 3. 调用 GitHub Contents API
    const apiUrl = `${apiBaseUrl}/repos/${owner}/${repo}/contents/${githubPath}`;

    try {
      await axios.put(
        apiUrl,
        {
          message: `Upload ${newFilename} via API`,
          content: content,
          branch: branch
        },
        {
          headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'Node.js-App',
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github+json'
          },
          httpsAgent: httpsAgent,
          timeout: 30000
        }
      );
    } catch (err) {
      const githubMsg = err.response?.data?.message || err.message;
      console.error('[GitHub 上传失败]', githubMsg);
      throw new BusinessError(ERROR_CODE.GITHUB_UPLOAD_FAIL, `GitHub 上传失败：${githubMsg}`);
    }

    // 4. 拼接访问 URL
    const fileUrl = fileUtil.buildGithubFileUrl(githubPath);

    // 5. 写入数据库 files 表
    const fileInfo = {
      filename: newFilename,
      originalName: file.originalname,
      size: file.size,
      sizeText: fileUtil.formatFileSize(file.size),
      mimeType: file.mimetype,
      extname: fileUtil.getExtname(file.originalname),
      storageType: 'github',
      path: githubPath,
      objectPath: githubPath,
      url: fileUrl,
      uploadTime: new Date().toISOString()
    };

    try {
      const dbResult = await fileModel.create({
        original_name: file.originalname,
        file_name: newFilename,
        file_size: file.size,
        mime_type: file.mimetype,
        extname: fileUtil.getExtname(file.originalname),
        storage_type: 'github',
        file_path: githubPath,
        file_url: fileUrl,
        uploader_id: options.uploaderId || null
      });
      fileInfo.id = dbResult.insertId;
    } catch (dbErr) {
      // 数据库写入失败不影响上传结果，只记日志
      console.error('[文件记录写入数据库失败]', dbErr.message);
    }

    return fileInfo;
  }

  /**
   * 批量上传到 GitHub
   */
  async uploadBatchToGithub(files, options = {}) {
    if (!files || files.length === 0) {
      throw new BusinessError(ERROR_CODE.FILE_NOT_EXIST, '请选择要上传的文件');
    }
    // 并发上传
    const promises = files.map(file => this.uploadToGithub(file, options));
    return Promise.all(promises);
  }

  // ==================== 文件删除 ====================

  /**
   * 删除本地文件
   */
  deleteLocalFile(relativePath) {
    if (!relativePath) {
      throw new BusinessError(ERROR_CODE.FILE_NOT_EXIST, '文件路径不能为空');
    }
    // 防目录遍历
    const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, '');
    const fullPath = path.join(uploadConfig.local.dir, safePath);
    if (!fullPath.startsWith(path.resolve(uploadConfig.local.dir))) {
      throw new BusinessError(ERROR_CODE.PARAM_INVALID, '非法的文件路径');
    }
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
      return true;
    } catch (err) {
      console.error('[本地文件删除失败]', err);
      throw new BusinessError(ERROR_CODE.FILE_DELETE_FAIL, `文件删除失败：${err.message}`);
    }
  }

  /**
   * 删除 GitHub 文件
   * GitHub 删除文件需要先 GET 获取文件的 sha，再 PUT/DELETE
   */
  async deleteGithubFile(objectPath) {
    if (!objectPath) {
      throw new BusinessError(ERROR_CODE.FILE_NOT_EXIST, '文件路径不能为空');
    }
    if (!uploadConfig.github.enabled) {
      throw new BusinessError(ERROR_CODE.GITHUB_CONFIG_ERROR, 'GitHub 图床配置不完整');
    }

    const { token, owner, repo, branch, apiBaseUrl } = uploadConfig.github;
    const apiUrl = `${apiBaseUrl}/repos/${owner}/${repo}/contents/${objectPath}`;

    try {
      // 先获取文件 sha（GitHub 删除文件必须传 sha）
      const getRes = await axios.get(apiUrl, {
        params: { ref: branch },
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'Node.js-App',
          'Accept': 'application/vnd.github+json'
        },
        httpsAgent: httpsAgent
      });
      const sha = getRes.data.sha;

      // 再删除（用 DELETE 方法）
      await axios.delete(apiUrl, {
        data: {
          message: `Delete ${objectPath} via API`,
          sha: sha,
          branch: branch
        },
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'Node.js-App',
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github+json'
        },
        httpsAgent: httpsAgent
      });

      return true;
    } catch (err) {
      const githubMsg = err.response?.data?.message || err.message;
      console.error('[GitHub 文件删除失败]', githubMsg);
      throw new BusinessError(ERROR_CODE.GITHUB_DELETE_FAIL, `GitHub 文件删除失败：${githubMsg}`);
    }
  }
}

module.exports = new UploadService();