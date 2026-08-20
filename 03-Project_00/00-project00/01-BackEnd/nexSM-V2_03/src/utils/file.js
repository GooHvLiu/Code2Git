/**
 * 文件处理工具函数
 */
const path = require('path');
const crypto = require('crypto');
const uploadConfig = require('../config/upload.config');

/**
 * 从文件名中提取扩展名（小写，带点）
 */
function getExtname(filename) {
  if (!filename) return '';
  return path.extname(filename).toLowerCase();
}

/**
 * 校验文件 MIME 类型是否在白名单内
 */
function isAllowedMimeType(mimeType) {
  return uploadConfig.local.allowedMimeTypes.includes(mimeType);
}

/**
 * 校验文件扩展名是否在白名单内
 */
function isAllowedExtname(filename) {
  const ext = getExtname(filename);
  return uploadConfig.local.allowedExtnames.includes(ext);
}

/**
 * 生成 UUID 文件名（UUID + 原扩展名）
 */
function generateUuidFileName(originalName) {
  const ext = getExtname(originalName);
  const uuid = crypto.randomUUID();
  return `${uuid}${ext}`;
}

/**
 * 生成按日期分层的相对路径（年/月）
 * GitHub 图床用 年/月 两级即可，本地用 年/月/日
 */
function generateDateDir(level = 'month') {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  if (level === 'day') {
    return path.join(year.toString(), month, day).replace(/\\/g, '/');
  }
  return path.join(year.toString(), month).replace(/\\/g, '/');
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

/**
 * 构建本地文件访问 URL
 */
function buildLocalFileUrl(relativePath, host) {
  const prefix = uploadConfig.local.staticPrefix;
  const normalizedPath = relativePath.replace(/\\/g, '/');
  if (host) {
    return `${host.replace(/\/$/, '')}${prefix}/${normalizedPath}`;
  }
  return `${prefix}/${normalizedPath}`;
}

/**
 * 构建 GitHub 图床文件访问 URL
 * 格式：https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{pathPrefix}/{dateDir}/{filename}
 */
function buildGithubFileUrl(objectPath) {
  const { rawBaseUrl, owner, repo, branch } = uploadConfig.github;
  const base = `${rawBaseUrl}/${owner}/${repo}/${branch}`;
  const normalizedPath = objectPath.replace(/^\//, '');
  return `${base}/${normalizedPath}`;
}

module.exports = {
  getExtname,
  isAllowedMimeType,
  isAllowedExtname,
  generateUuidFileName,
  generateDateDir,
  formatFileSize,
  buildLocalFileUrl,
  buildGithubFileUrl
};