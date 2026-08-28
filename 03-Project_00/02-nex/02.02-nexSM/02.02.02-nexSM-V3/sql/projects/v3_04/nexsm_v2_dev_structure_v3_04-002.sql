-- MySQL dump 10.13  Distrib 9.7.0, for Win64 (x86_64)
--
-- Host: localhost    Database: nexsm_v2_dev
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `nex_audit_log`
--

DROP TABLE IF EXISTS `nex_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_audit_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int NOT NULL COMMENT '操作人ID',
  `user_name` varchar(50) DEFAULT '' COMMENT '操作人姓名',
  `action` varchar(100) NOT NULL COMMENT '操作类型',
  `target` varchar(200) DEFAULT '' COMMENT '操作对象',
  `old_value` text COMMENT '修改前值',
  `new_value` text COMMENT '修改后值',
  `result` varchar(20) DEFAULT 'success' COMMENT '操作结果',
  `reason` varchar(500) DEFAULT '' COMMENT '操作原因',
  `ip` varchar(50) DEFAULT '' COMMENT '操作IP',
  `user_agent` varchar(500) DEFAULT '' COMMENT '浏览器UA',
  `prev_hash` varchar(64) DEFAULT '' COMMENT '前一条哈希',
  `current_hash` varchar(64) DEFAULT '' COMMENT '当前哈希',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='审计日志表(GMP 21CFR Part 11)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nex_dept`
--

DROP TABLE IF EXISTS `nex_dept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_dept` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `parent_id` int DEFAULT '0' COMMENT '父部门ID，顶级为0',
  `order_num` int DEFAULT '0' COMMENT '排序号',
  `leader` varchar(50) DEFAULT '' COMMENT '负责人',
  `phone` varchar(20) DEFAULT '' COMMENT '联系电话',
  `email` varchar(100) DEFAULT '' COMMENT '邮箱',
  `status` tinyint DEFAULT '1' COMMENT '状态 1启用 0禁用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `dept_name` varchar(100) NOT NULL COMMENT '部门名称',
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='部门表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nex_dict_item`
--

DROP TABLE IF EXISTS `nex_dict_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_dict_item` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '字典项ID',
  `type_id` int NOT NULL COMMENT '字典类型ID',
  `value` varchar(100) NOT NULL COMMENT '字典值',
  `label` json NOT NULL COMMENT '字典标签（多语言）',
  `css_class` varchar(50) DEFAULT '' COMMENT 'CSS样式类',
  `list_class` varchar(50) DEFAULT '' COMMENT '列表样式类',
  `is_default` tinyint DEFAULT '0' COMMENT '是否默认 1是 0否',
  `status` tinyint DEFAULT '1' COMMENT '状态 1启用 0禁用',
  `sort` int DEFAULT '0' COMMENT '排序号',
  `remark` varchar(500) DEFAULT '' COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字典项表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nex_dict_type`
--

DROP TABLE IF EXISTS `nex_dict_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_dict_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '字典类型ID',
  `dict_code` varchar(50) NOT NULL COMMENT '字典类型编码',
  `dict_name` json NOT NULL COMMENT '字典类型名称（多语言）',
  `description` json DEFAULT NULL COMMENT '描述（多语言）',
  `status` tinyint DEFAULT '1' COMMENT '状态 1启用 0禁用',
  `sort` int DEFAULT '0' COMMENT '排序号',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dict_code` (`dict_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字典类型表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nex_menu`
--

DROP TABLE IF EXISTS `nex_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_menu` (
  `id` varchar(32) NOT NULL COMMENT '菜单唯一标识 index值',
  `parent_id` varchar(32) DEFAULT '' COMMENT '父菜单ID，顶级菜单为空',
  `name` varchar(50) NOT NULL COMMENT '路由name（组件name）',
  `path` varchar(100) NOT NULL COMMENT '前端路由path',
  `component` varchar(100) DEFAULT NULL COMMENT '前端组件名称 Layout / customer/visit',
  `redirect` varchar(100) DEFAULT 'noRedirect',
  `title` varchar(50) NOT NULL COMMENT '菜单标题',
  `title_en` varchar(100) DEFAULT NULL COMMENT '英文标题',
  `icon` varchar(50) DEFAULT NULL COMMENT '图标名称',
  `hidden` tinyint DEFAULT '0' COMMENT '是否隐藏菜单 0显示 1隐藏',
  `always_show` tinyint DEFAULT '0' COMMENT '是否永远展示父菜单（有子菜单时生效）',
  `no_cache` tinyint DEFAULT '0' COMMENT '是否不缓存页面',
  `sort` int DEFAULT '0' COMMENT '排序号',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `permission_code` varchar(100) DEFAULT NULL COMMENT '统一权限码（唯一标识，如 device:state:view）',
  `type` varchar(20) DEFAULT 'menu' COMMENT '权限类型：menu菜单/button按钮/param参数',
  `api_path` varchar(200) DEFAULT NULL COMMENT '关联后端接口路径（button/param类型用）',
  `api_method` varchar(10) DEFAULT NULL COMMENT '接口方法：GET/POST/PUT/DELETE（button/param类型用）',
  `param_key` varchar(100) DEFAULT NULL COMMENT '参数标识（param类型用，如 fillVolume）',
  `param_mode` varchar(20) DEFAULT NULL COMMENT '参数权限模式：view可见/edit可编辑/hidden隐藏（param类型用）',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permission_code` (`permission_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nex_notification`
--

DROP TABLE IF EXISTS `nex_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_notification` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `user_id` int NOT NULL COMMENT '接收用户ID',
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `title_key` varchar(100) DEFAULT '',
  `title_params` text,
  `content_key` varchar(100) DEFAULT '',
  `content_params` text,
  `type` varchar(50) DEFAULT 'system' COMMENT '通知类型 system/plc/user/audit',
  `priority` varchar(20) DEFAULT 'normal' COMMENT '优先级 high/normal/low',
  `link` varchar(500) DEFAULT '' COMMENT '跳转链接',
  `is_read` tinyint DEFAULT '0' COMMENT '是否已读 1是 0否',
  `read_time` datetime DEFAULT NULL COMMENT '阅读时间',
  `is_archived` tinyint DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_read` (`is_read`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=389 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='通知表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nex_notification_setting`
--

DROP TABLE IF EXISTS `nex_notification_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_notification_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `settings` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nex_role`
--

DROP TABLE IF EXISTS `nex_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_code` varchar(50) NOT NULL COMMENT '角色编码',
  `role_name` json NOT NULL COMMENT '角色名称（多语言）',
  `description` json DEFAULT NULL COMMENT '描述（多语言）',
  `data_scope` varchar(20) DEFAULT 'self' COMMENT '数据范围 all/dept/dept_and_child/self',
  `status` tinyint DEFAULT '1' COMMENT '状态 1启用 0禁用',
  `sort` int DEFAULT '0' COMMENT '排序号',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nex_role_menu`
--

DROP TABLE IF EXISTS `nex_role_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_role_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL COMMENT '角色ID',
  `menu_id` varchar(32) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`),
  KEY `idx_role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=348 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色菜单关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nex_system_config`
--

DROP TABLE IF EXISTS `nex_system_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_system_config` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_value` text COMMENT '配置值',
  `config_type` varchar(20) DEFAULT 'string' COMMENT '配置类型：string/number/boolean/json',
  `description` varchar(200) DEFAULT '' COMMENT '配置描述',
  `category` varchar(50) DEFAULT 'system' COMMENT '配置分类：system/security/plc/export/connection',
  `sort` int DEFAULT '0' COMMENT '排序号',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nex_user`
--

DROP TABLE IF EXISTS `nex_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '数据库自增主键（接口对外映射为userId）',
  `username` varchar(50) NOT NULL COMMENT '登录账号(唯一)',
  `password` varchar(100) NOT NULL COMMENT 'bcrypt加密后的密码',
  `role` varchar(50) DEFAULT 'operator' COMMENT '岗位类别：administrator管理员 / engineer工程师 / operator操作员',
  `real_name` varchar(50) DEFAULT 'operator' COMMENT '用户真实姓名',
  `sex` tinyint DEFAULT '0' COMMENT '性别 1男 2女 0未知',
  `phone` varchar(20) DEFAULT '' COMMENT '联系手机号',
  `email` varchar(100) DEFAULT '' COMMENT '邮箱地址',
  `dept_id` int DEFAULT NULL COMMENT '所属部门ID，关联nex_dept表',
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
  `permission_version` int DEFAULT '0' COMMENT '权限版本号，权限变更时+1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_dept` (`dept_id`),
  KEY `idx_status_del` (`status`,`is_delete`),
  CONSTRAINT `chk_is_delete` CHECK ((`is_delete` in (0,1))),
  CONSTRAINT `chk_role` CHECK ((`role` in (_utf8mb4'administrator',_utf8mb4'engineer',_utf8mb4'operator'))),
  CONSTRAINT `chk_sex` CHECK ((`sex` in (0,1,2))),
  CONSTRAINT `chk_status` CHECK ((`status` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统用户表 | nex 管理平台';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'nexsm_v2_dev'
--

--
-- Dumping routines for database 'nexsm_v2_dev'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-28 15:10:11
