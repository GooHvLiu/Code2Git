/**
 * 文件上传中间件
 * 封装 Multer，提供本地磁盘存储和内存存储（用于 GitHub 图床）两种引擎
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadConfig = require('../config/upload.config');
const fileUtil = require('../utils/file');
const { BusinessError } = require('./error.middleware');
const { ERROR_CODE } = require('../constants/errorCode');

// ==================== 存储引擎 ====================

/**
 * 本地磁盘存储引擎
 * 文件名：UUID + 原扩展名，路径：年/月/日
 */
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dateDir = fileUtil.generateDateDir('day');
    const fullPath = path.join(uploadConfig.local.dir, dateDir);
    fs.mkdirSync(fullPath, { recursive: true });
    req._uploadDateDir = dateDir;
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const newFilename = fileUtil.generateUuidFileName(file.originalname);
    req._uploadFilename = newFilename;
    cb(null, newFilename);
  }
});

/**
 * 内存存储引擎（用于 GitHub 图床）
 * 文件以 Buffer 形式存在 req.file.buffer，不写磁盘
 */
const memoryStorage = multer.memoryStorage();

// ==================== 文件过滤 ====================

function fileFilter(req, file, cb) {
  if (!fileUtil.isAllowedMimeType(file.mimetype)) {
    return cb(new BusinessError(
      ERROR_CODE.FILE_TYPE_NOT_ALLOWED,
      `不支持的文件类型：${file.mimetype}`
    ), false);
  }
  if (!fileUtil.isAllowedExtname(file.originalname)) {
    return cb(new BusinessError(
      ERROR_CODE.FILE_TYPE_NOT_ALLOWED,
      `不支持的文件扩展名：${fileUtil.getExtname(file.originalname)}`
    ), false);
  }
  cb(null, true);
}

// ==================== Multer 实例 ====================

const localUpload = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: uploadConfig.local.maxSize }
});

const githubUpload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: uploadConfig.github.maxSize }
});

// ==================== 错误处理包装 ====================

function wrapMulterError(multerMiddleware, isGithub = false) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          const maxSize = isGithub ? uploadConfig.github.maxSize : uploadConfig.local.maxSize;
          switch (err.code) {
            case 'LIMIT_FILE_SIZE':
              return next(new BusinessError(
                ERROR_CODE.FILE_TOO_LARGE,
                `文件大小超出限制，最大允许 ${fileUtil.formatFileSize(maxSize)}`
              ));
            case 'LIMIT_FILE_COUNT':
              return next(new BusinessError(ERROR_CODE.FILE_LIMIT_EXCEEDED, '上传文件数量超出限制'));
            case 'LIMIT_UNEXPECTED_FILE':
              return next(new BusinessError(ERROR_CODE.PARAM_ERROR, `意外的文件字段：${err.field}`));
            default:
              return next(new BusinessError(ERROR_CODE.FILE_UPLOAD_FAIL, `文件上传失败：${err.message}`));
          }
        }
        return next(err);
      }
      next();
    });
  };
}

// ==================== 导出 ====================

module.exports = {
  // 本地存储
  localSingle: (fieldName = 'file') => wrapMulterError(localUpload.single(fieldName)),
  localArray: (fieldName = 'files', maxCount = 10) =>
    wrapMulterError(localUpload.array(fieldName, maxCount)),
  localFields: (fields) => wrapMulterError(localUpload.fields(fields)),

  // GitHub 图床（内存存储）
  githubSingle: (fieldName = 'file') => wrapMulterError(githubUpload.single(fieldName), true),
  githubArray: (fieldName = 'files', maxCount = 10) =>
    wrapMulterError(githubUpload.array(fieldName, maxCount), true),

  // 原始实例
  localUpload,
  githubUpload
};