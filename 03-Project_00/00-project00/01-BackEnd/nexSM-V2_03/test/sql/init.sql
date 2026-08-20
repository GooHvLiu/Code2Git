-- ============================================
-- nexSM-V2 数据库初始化脚本
-- ============================================
-- 执行方式：
--   mysql -u root -p your_database < init.sql
--
-- 默认管理员账号：admin / 123456
-- 登录后请及时修改密码
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. 系统用户表
-- ============================================
DROP TABLE IF EXISTS `nex_user`;
CREATE TABLE `nex_user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '数据库自增主键',
  `username` varchar(50) NOT NULL COMMENT '登录账号(唯一)',
  `password` varchar(100) NOT NULL COMMENT 'bcrypt加密后的密码',
  `role` varchar(50) DEFAULT 'operator' COMMENT '岗位类别：administrator管理员 / engineer工程师 / operator操作员',
  `real_name` varchar(50) DEFAULT 'operator' COMMENT '用户真实姓名',
  `sex` tinyint DEFAULT '0' COMMENT '性别 1男 2女 0未知',
  `phone` varchar(20) DEFAULT '' COMMENT '联系手机号',
  `email` varchar(100) DEFAULT '' COMMENT '邮箱地址',
  `dept_id` int DEFAULT NULL COMMENT '所属部门ID',
  `avatar` varchar(255) DEFAULT '' COMMENT '头像地址',
  `login_ip` varchar(50) DEFAULT '' COMMENT '最后登录IP',
  `login_date` datetime DEFAULT NULL COMMENT '最后登录时间',
  `remark` varchar(500) DEFAULT '' COMMENT '备注信息',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '账号状态：1启用 0禁用',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '软删除：0正常 1删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_by` varchar(50) DEFAULT '' COMMENT '创建人账号',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_by` varchar(50) DEFAULT '' COMMENT '更新人账号',
  `is_first_login` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否首次登录 1是 0否',
  `first_login_at` datetime DEFAULT NULL COMMENT '首次登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_dept` (`dept_id`),
  KEY `idx_status_del` (`status`,`is_delete`),
  CONSTRAINT `chk_is_delete` CHECK ((`is_delete` in (0,1))),
  CONSTRAINT `chk_role` CHECK ((`role` in ('administrator','engineer','operator'))),
  CONSTRAINT `chk_sex` CHECK ((`sex` in (0,1,2))),
  CONSTRAINT `chk_status` CHECK ((`status` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统用户表';

-- ============================================
-- 2. 菜单表
-- ============================================
DROP TABLE IF EXISTS `nex_menu`;
CREATE TABLE `nex_menu` (
  `id` varchar(32) NOT NULL COMMENT '菜单唯一标识',
  `parent_id` varchar(32) DEFAULT '' COMMENT '父菜单ID，顶级菜单为空',
  `name` varchar(50) NOT NULL COMMENT '路由name',
  `path` varchar(100) NOT NULL COMMENT '前端路由path',
  `component` varchar(100) DEFAULT NULL COMMENT '前端组件名称',
  `redirect` varchar(100) DEFAULT 'noRedirect',
  `title` varchar(50) NOT NULL COMMENT '菜单标题（中文）',
  `title_en` varchar(100) DEFAULT NULL COMMENT '菜单标题（英文）',
  `icon` varchar(50) DEFAULT NULL COMMENT '图标名称',
  `hidden` tinyint DEFAULT '0' COMMENT '是否隐藏菜单 0显示 1隐藏',
  `always_show` tinyint DEFAULT '0' COMMENT '是否永远展示父菜单',
  `no_cache` tinyint DEFAULT '0' COMMENT '是否不缓存页面',
  `sort` int DEFAULT '0' COMMENT '排序号',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间（用于菜单缓存版本号）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统菜单表';

-- ============================================
-- 3. 用户-菜单关联表
-- ============================================
DROP TABLE IF EXISTS `nex_user_menu`;
CREATE TABLE `nex_user_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户id',
  `menu_id` varchar(32) NOT NULL COMMENT '菜单id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户菜单关联表';

-- ============================================
-- 4. 审计日志表（GMP 21CFR Part 11 电子记录）
-- ============================================
DROP TABLE IF EXISTS `nex_audit_log`;
CREATE TABLE `nex_audit_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int NOT NULL COMMENT '操作人ID',
  `user_name` varchar(50) DEFAULT '' COMMENT '操作人姓名',
  `action` varchar(100) NOT NULL COMMENT '操作类型(PLC参数修改/用户登录/数据导出等)',
  `target` varchar(200) DEFAULT '' COMMENT '操作对象',
  `old_value` text COMMENT '修改前值',
  `new_value` text COMMENT '修改后值',
  `result` varchar(20) DEFAULT 'success' COMMENT '操作结果 success/failed',
  `ip` varchar(50) DEFAULT '' COMMENT '操作IP',
  `user_agent` varchar(500) DEFAULT '' COMMENT '浏览器UA',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='审计日志表（GMP 21CFR Part 11）';

-- ============================================
-- 5. 初始数据
-- ============================================

-- 初始管理员账号：admin / 123456
INSERT INTO `nex_user` (`id`, `username`, `password`, `role`, `real_name`, `status`, `is_first_login`) VALUES
(1, 'admin', '$2b$10$lI1m4nPUhnYEBSvHjoSIzu10hVhNjy.y6X3EJCuMy8HexrRXgw4.u', 'administrator', '系统管理员', 1, 0);

-- 初始菜单示例（可根据业务需求增删）
-- 注意：网站首页、个人中心、用户管理为静态路由，无需在此配置
-- 动态菜单配置示例：
-- INSERT INTO `nex_menu` (`id`, `parent_id`, `name`, `path`, `component`, `title`, `title_en`, `icon`, `sort`) VALUES
-- ('_001', '', 'Example', '/example', NULL, '示例模块', 'Example', 'example', 1),
-- ('_001_01', '_001', 'ExampleList', 'list', 'example/list', '示例列表', 'Example List', '#', 1);

-- 初始用户菜单关联（admin 关联所有菜单）
-- 示例：INSERT INTO `nex_user_menu` (`user_id`, `menu_id`) VALUES (1, '_001'), (1, '_001_01');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 初始化完成
-- ============================================
-- 默认账号：admin / 123456
--
-- 添加动态菜单步骤：
--   1. 在 nex_menu 表插入菜单记录
--   2. 在 nex_user_menu 表关联用户和菜单
--   3. 前端页面放在 src/views/ 对应目录下
--   4. 菜单的 component 字段对应前端组件路径
--   5. mysql -u root -p your_database < init.sql
-- ============================================
