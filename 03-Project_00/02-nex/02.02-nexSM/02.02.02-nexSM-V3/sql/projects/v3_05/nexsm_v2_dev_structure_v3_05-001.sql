-- ============================================
-- nex_user_device - 用户在线设备表
-- 用于客户端授权（限制在线人数）和设备管理
-- ============================================

CREATE TABLE IF NOT EXISTS `nex_user_device` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `device_id` VARCHAR(100) NOT NULL COMMENT '设备唯一标识（前端生成，存储在localStorage）',
  `device_name` VARCHAR(255) DEFAULT '' COMMENT '设备名称（可自定义，默认从User-Agent解析）',
  `ip` VARCHAR(50) DEFAULT '' COMMENT '登录IP',
  `user_agent` TEXT COMMENT '浏览器User-Agent',
  `login_time` DATETIME DEFAULT NULL COMMENT '登录时间',
  `last_active_time` DATETIME DEFAULT NULL COMMENT '最后活跃时间（心跳更新）',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1=在线，0=离线',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_device_id` (`device_id`),
  INDEX `idx_status` (`status`),
  UNIQUE KEY `uk_user_device` (`user_id`, `device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户在线设备表';
