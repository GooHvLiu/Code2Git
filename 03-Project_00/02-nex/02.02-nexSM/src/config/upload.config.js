/**
 * 文件上传配置
 * 统一管理本地存储与 GitHub 图床配置
 */
module.exports = {
  // 本地存储配置
  local: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed'
    ],
    allowedExtnames: [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx',
      '.txt', '.zip'
    ],
    staticPrefix: '/uploads'
  },

  // GitHub 图床配置
  github: {
    enabled: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO),
    token: process.env.GITHUB_TOKEN || '',
    owner: process.env.GITHUB_OWNER || '',
    repo: process.env.GITHUB_REPO || '',
    branch: process.env.GITHUB_BRANCH || 'main',
    pathPrefix: process.env.GITHUB_PATH_PREFIX || 'images',
    rawBaseUrl: process.env.GITHUB_RAW_BASE_URL || 'https://raw.githubusercontent.com',
    // GitHub API 单文件限制 100MB，这里默认给 50MB
    maxSize: 50 * 1024 * 1024,
    // API 地址
    apiBaseUrl: 'https://api.github.com'
  }
};