-- 先执行这一行创建数据库
CREATE DATABASE IF NOT EXISTS nexsm_v2_dev DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 然后选中 nexsm_v2_dev 数据库，执行下面所有建表语句
USE nexsm_v2_dev;

-- ==================== 用户表 ====================
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  `password` VARCHAR(100) NOT NULL COMMENT '密码',
  `real_name` VARCHAR(20) COMMENT '真实姓名',
  `phone` VARCHAR(20) COMMENT '手机号',
  `email` VARCHAR(100) COMMENT '邮箱',
  `avatar` VARCHAR(255) COMMENT '头像',
  `role` TINYINT DEFAULT 3 COMMENT '角色：1管理员 2工程师 3操作员',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `remark` VARCHAR(255) COMMENT '备注',
  `last_login_time` DATETIME COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) COMMENT '最后登录IP',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

INSERT INTO `sys_user` (`username`, `password`, `real_name`, `role`, `status`) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '管理员', 1, 1),
('operator', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '工程师', 2, 1);

-- ==================== 设备表 ====================
DROP TABLE IF EXISTS `device`;
CREATE TABLE `device` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  `device_name` VARCHAR(100) NOT NULL COMMENT '设备名称',
  `device_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '设备编号',
  `device_type` VARCHAR(50) COMMENT '设备类型',
  `plc_ip` VARCHAR(30) NOT NULL COMMENT 'PLC通讯IP',
  `plc_port` INT DEFAULT 502 COMMENT 'PLC端口',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0停机 1运行 2故障 3维护',
  `factory` VARCHAR(100) COMMENT '生产厂商',
  `install_addr` VARCHAR(200) COMMENT '安装位置',
  `install_date` DATE COMMENT '安装日期',
  `remark` VARCHAR(255) COMMENT '备注',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备台账表';

INSERT INTO `device` (`device_name`, `device_no`, `device_type`, `plc_ip`, `status`, `factory`, `install_addr`) VALUES
('高压蒸汽灭菌器-01', 'STER-001', '灭菌器', '192.168.1.101', 1, '山东新华医疗', '消毒供应中心1号室'),
('高压蒸汽灭菌器-02', 'STER-002', '灭菌器', '192.168.1.102', 0, '山东新华医疗', '消毒供应中心1号室'),
('血液透析机-01', 'DIAL-001', '透析机', '192.168.1.201', 1, '费森尤斯', '血液透析科A区'),
('生化检测仪-01', 'TEST-001', '检测仪', '192.168.1.301', 2, '罗氏诊断', '检验科生化室');

-- ==================== PLC数据表 ====================
DROP TABLE IF EXISTS `plc_data`;
CREATE TABLE `plc_data` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  `device_id` INT NOT NULL COMMENT '设备ID',
  `temp` DECIMAL(6,2) COMMENT '腔体温度(℃)',
  `pressure` DECIMAL(6,2) COMMENT '腔内压力(MPa)',
  `run_speed` INT COMMENT '运行转速(rpm)',
  `set_temp` DECIMAL(6,2) COMMENT '设定温度(℃)',
  `run_time` INT COMMENT '已运行时间(分钟)',
  `collect_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '采集时间',
  INDEX idx_device_id (`device_id`),
  INDEX idx_collect_time (`collect_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='PLC采集数据表';

INSERT INTO `plc_data` (`device_id`, `temp`, `pressure`, `run_speed`, `set_temp`, `run_time`) VALUES
(1, 121.5, 0.21, 350, 121, 45),
(1, 121.3, 0.20, 348, 121, 46),
(1, 121.6, 0.22, 352, 121, 47),
(3, 36.8, 0.15, 280, 37, 120),
(3, 36.7, 0.14, 278, 37, 121);

-- ==================== 报警表 ====================
DROP TABLE IF EXISTS `alarm`;
CREATE TABLE `alarm` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  `device_id` INT NOT NULL COMMENT '设备ID',
  `alarm_type` VARCHAR(50) NOT NULL COMMENT '报警类型',
  `alarm_level` TINYINT DEFAULT 2 COMMENT '级别：1提示 2警告 3错误 4严重',
  `alarm_msg` VARCHAR(200) COMMENT '报警详情',
  `handle_status` TINYINT DEFAULT 0 COMMENT '状态：0未处理 1处理中 2已解决',
  `handle_user` VARCHAR(50) COMMENT '处理人',
  `handle_result` VARCHAR(500) COMMENT '处理结果',
  `handle_time` DATETIME COMMENT '处理时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '报警时间',
  INDEX idx_device_id (`device_id`),
  INDEX idx_handle_status (`handle_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备报警表';

INSERT INTO `alarm` (`device_id`, `alarm_type`, `alarm_level`, `alarm_msg`, `handle_status`) VALUES
(4, '设备故障', 3, '生化检测仪光源异常，无法正常检测', 0),
(1, '温度偏高', 2, '灭菌温度超过设定值0.5℃，已自动调节', 2),
(2, '通讯断开', 3, 'PLC通讯超时，设备离线', 1);

-- ==================== 工单表 ====================
DROP TABLE IF EXISTS `work_order`;
CREATE TABLE `work_order` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  `order_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '工单编号',
  `device_id` INT NOT NULL COMMENT '设备ID',
  `trouble_desc` VARCHAR(500) COMMENT '故障描述',
  `priority` TINYINT DEFAULT 2 COMMENT '优先级：1低 2中 3高 4紧急',
  `order_status` TINYINT DEFAULT 0 COMMENT '状态：0待处理 1处理中 2已完成 3已关闭',
  `assign_to` VARCHAR(50) COMMENT '指派维修人',
  `repair_result` VARCHAR(500) COMMENT '维修结果',
  `repair_hours` DECIMAL(5,1) COMMENT '维修时长(小时)',
  `finish_time` DATETIME COMMENT '完成时间',
  `create_user` VARCHAR(50) COMMENT '创建人',
  `remark` VARCHAR(255) COMMENT '备注',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_device_id (`device_id`),
  INDEX idx_order_status (`order_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='运维工单表';

INSERT INTO `work_order` (`order_no`, `device_id`, `trouble_desc`, `priority`, `order_status`, `assign_to`, `create_user`) VALUES
('WO20260730001', 4, '生化检测仪光源故障，无法开机', 4, 0, NULL, 'admin'),
('WO20260730002', 2, '设备PLC通讯不稳定，频繁掉线', 3, 1, 'operator', 'admin'),
('WO20260730003', 1, '灭菌舱密封圈老化，需要更换', 2, 2, 'operator', 'admin');