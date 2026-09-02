-- ==========================================
-- 部件寿命管理相关表
-- 创建时间：2026-09-02
-- ==========================================

-- 1. 部件模板表（系统预设，用户不可修改）
CREATE TABLE IF NOT EXISTS `device_part_template` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `template_key` VARCHAR(50) NOT NULL COMMENT '模板唯一标识（如 fill_needle）',
  `name_key` VARCHAR(100) NOT NULL COMMENT '名称国际化key',
  `code_prefix` VARCHAR(50) NOT NULL COMMENT '编码前缀（如 FILL-NEEDLE）',
  `default_spec` VARCHAR(200) DEFAULT '' COMMENT '默认规格型号',
  `life_unit` VARCHAR(20) NOT NULL DEFAULT 'times' COMMENT '寿命单位（times/hours/days/cycles）',
  `default_rated_life` DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT '默认额定寿命',
  `stat_method` VARCHAR(50) NOT NULL DEFAULT 'manual' COMMENT '统计方式（plc_count/runtime/manual）',
  `stat_tag` VARCHAR(100) DEFAULT '' COMMENT '统计用的PLC标签名',
  `icon` VARCHAR(50) DEFAULT 'el-icon-cpu' COMMENT '图标类名',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `enabled` TINYINT NOT NULL DEFAULT 1 COMMENT '是否启用（0-禁用 1-启用）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_template_key` (`template_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部件模板表（系统预设）';

-- 2. 部件实例表（用户管理，可增删改）
CREATE TABLE IF NOT EXISTS `device_part` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `template_id` INT NOT NULL COMMENT '关联模板ID',
  `template_key` VARCHAR(50) NOT NULL COMMENT '模板key（冗余，方便查询）',
  `part_code` VARCHAR(100) NOT NULL COMMENT '部件编码（如 FILL-NEEDLE-001）',
  `spec` VARCHAR(200) DEFAULT '' COMMENT '规格型号（可修改）',
  `rated_life` DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT '额定寿命（人工录入，可修改）',
  `used_life` DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT '已使用寿命（系统统计或人工录入）',
  `life_unit` VARCHAR(20) NOT NULL DEFAULT 'times' COMMENT '寿命单位（从模板继承）',
  `install_date` DATE DEFAULT NULL COMMENT '安装日期',
  `last_replace_date` DATE DEFAULT NULL COMMENT '上次更换日期',
  `last_stat_value` DECIMAL(12,2) DEFAULT 0 COMMENT '上次统计的PLC计数值（用于计算增量）',
  `status` VARCHAR(20) NOT NULL DEFAULT 'normal' COMMENT '状态（normal/notice/warning/expired）',
  `remark` TEXT COMMENT '备注',
  `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除（0-未删除 1-已删除）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_part_code` (`part_code`),
  KEY `idx_template_id` (`template_id`),
  KEY `idx_template_key` (`template_key`),
  KEY `idx_status` (`status`),
  KEY `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部件实例表（用户管理）';

-- 3. 部件更换记录表
CREATE TABLE IF NOT EXISTS `device_part_replace_record` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `part_id` INT NOT NULL COMMENT '关联部件实例ID',
  `template_key` VARCHAR(50) NOT NULL COMMENT '模板key',
  `old_code` VARCHAR(100) NOT NULL COMMENT '旧部件编码',
  `new_code` VARCHAR(100) NOT NULL COMMENT '新部件编码',
  `old_used_life` DECIMAL(12,2) DEFAULT 0 COMMENT '旧部件已使用寿命',
  `replace_reason` VARCHAR(100) DEFAULT '' COMMENT '更换原因',
  `operator_id` INT DEFAULT NULL COMMENT '操作人ID',
  `operator_name` VARCHAR(50) DEFAULT '' COMMENT '操作人姓名（冗余）',
  `remark` TEXT COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更换时间',
  PRIMARY KEY (`id`),
  KEY `idx_part_id` (`part_id`),
  KEY `idx_template_key` (`template_key`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部件更换记录表';

-- ==========================================
-- 初始化部件模板数据（系统预设）
-- ==========================================
INSERT INTO `device_part_template` (`template_key`, `name_key`, `code_prefix`, `default_spec`, `life_unit`, `default_rated_life`, `stat_method`, `stat_tag`, `icon`, `sort`, `enabled`) VALUES
('fill_needle', 'device.part.template.fillNeedle', 'FILL-NEEDLE', '2.0mL 标准型', 'times', 10000, 'plc_count', 'fillNeedleSuccessCount', 'el-icon-aim', 1, 1),
('fill_tube', 'device.part.template.fillTube', 'FILL-TUBE', '硅胶管 φ8×12', 'times', 50000, 'plc_count', 'fillMotorRotationCount', 'el-icon-s-operation', 2, 1),
('stopper_rod', 'device.part.template.stopperRod', 'STOPPER-ROD', '标准加塞杆', 'times', 20000, 'plc_count', 'stopperSuccessCount', 'el-icon-top-right', 3, 1),
('vacuum_unit', 'device.part.template.vacuumUnit', 'VACUUM-UNIT', '真空发生器组件', 'times', 80000, 'plc_count', 'vacuumHoldSuccessCount', 'el-icon-download', 4, 1);
