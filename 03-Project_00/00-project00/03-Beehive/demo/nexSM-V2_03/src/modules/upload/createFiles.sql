CREATE TABLE IF NOT EXISTS `files` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `original_name` varchar(255) NOT NULL COMMENT '原始文件名',
  `file_name` varchar(255) DEFAULT NULL COMMENT '重命名后文件名',
  `file_size` bigint DEFAULT 0 COMMENT '文件大小（字节）',
  `mime_type` varchar(100) DEFAULT NULL COMMENT 'MIME类型',
  `extname` varchar(20) DEFAULT NULL COMMENT '扩展名',
  `storage_type` varchar(20) NOT NULL DEFAULT 'local' COMMENT '存储类型: local/github',
  `file_path` varchar(500) DEFAULT NULL COMMENT '相对路径或GitHub path',
  `file_url` varchar(1000) DEFAULT NULL COMMENT '访问URL',
  `uploader_id` bigint DEFAULT NULL COMMENT '上传者ID',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_storage_type` (`storage_type`),
  KEY `idx_uploader_id` (`uploader_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件上传记录表';