-- ============================================================
-- 系统配置表
-- ============================================================

DROP TABLE IF EXISTS `nex_system_config`;
CREATE TABLE `nex_system_config` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_value` text COMMENT '配置值',
  `config_type` varchar(20) DEFAULT 'string' COMMENT '配置类型：string/number/boolean/json',
  `description` varchar(200) DEFAULT '' COMMENT '配置描述',
  `category` varchar(50) DEFAULT 'system' COMMENT '配置分类：system/security/plc/export/connection',
  `sort` int DEFAULT 0 COMMENT '排序号',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- ============================================================
-- 初始化默认配置数据
-- ============================================================

-- 系统设置
INSERT INTO `nex_system_config` (`config_key`, `config_value`, `config_type`, `description`, `category`, `sort`) VALUES
('sessionTimeout', '30', 'number', '会话超时时间（分钟）', 'system', 1),
('defaultPageSize', '20', 'number', '默认每页条数', 'system', 2),
('defaultLanguage', 'zh-CN', 'string', '默认语言', 'system', 3),
('dateFormat', 'YYYY-MM-DD', 'string', '日期显示格式', 'system', 4);

-- 安全设置
INSERT INTO `nex_system_config` (`config_key`, `config_value`, `config_type`, `description`, `category`, `sort`) VALUES
('watermarkEnabled', 'false', 'boolean', '是否启用水印', 'security', 1),
('watermarkText', '', 'string', '水印文字（为空时使用当前用户名）', 'security', 2);

-- 设备连接设置
INSERT INTO `nex_system_config` (`config_key`, `config_value`, `config_type`, `description`, `category`, `sort`) VALUES
('plcProtocol', 'ModbusTcp', 'string', '通信协议', 'plc', 1),
('plcHost', '127.0.0.1', 'string', '设备IP地址', 'plc', 2),
('plcPort', '502', 'number', '设备端口', 'plc', 3),
('plcUnitId', '1', 'number', 'Modbus单元ID', 'plc', 4),
('pollFastInterval', '200', 'number', '快速轮询间隔（ms）', 'plc', 5),
('pollSlowInterval', '1000', 'number', '慢速轮询间隔（ms）', 'plc', 6);

-- 导出设置
INSERT INTO `nex_system_config` (`config_key`, `config_value`, `config_type`, `description`, `category`, `sort`) VALUES
('pdfWatermarkEnabled', 'true', 'boolean', 'PDF导出水印开关', 'export', 1),
('pdfWatermarkText', '', 'string', 'PDF水印文字（为空时使用当前用户名）', 'export', 2);

-- 连接设置
INSERT INTO `nex_system_config` (`config_key`, `config_value`, `config_type`, `description`, `category`, `sort`) VALUES
('heartbeatInterval', '25000', 'number', 'WebSocket心跳间隔（ms）', 'connection', 1);
