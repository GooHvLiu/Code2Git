/**
 * 文件记录模型
 * 对应数据库表 files
 */
const BaseModel = require('../../db/BaseModel');

// 允许操作的字段白名单
const ALLOW_FIELDS = [
  'original_name',    // 原始文件名
  'file_name',        // 重命名后文件名
  'file_size',        // 文件大小（字节）
  'mime_type',        // MIME 类型
  'extname',          // 扩展名
  'storage_type',     // 存储类型：local / github
  'file_path',        // 文件相对路径或 GitHub object path
  'file_url',         // 访问 URL
  'uploader_id',      // 上传者用户 ID（可选）
  'created_at'        // 创建时间
];

class FileModel extends BaseModel {
  constructor() {
    super('files', ALLOW_FIELDS, 'id');
  }
}

module.exports = new FileModel();