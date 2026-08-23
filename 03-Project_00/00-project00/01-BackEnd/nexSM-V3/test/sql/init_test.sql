-- MySQL dump 10.13  Distrib 9.7.0, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: nexsm_v2_dev
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='审计日志表(GMP 21CFR Part 11)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_audit_log`
--

LOCK TABLES `nex_audit_log` WRITE;
/*!40000 ALTER TABLE `nex_audit_log` DISABLE KEYS */;
INSERT INTO `nex_audit_log` VALUES (1,2,'liuguohui','PLC参数修改','fillVolume (灌装体积(mL))','156','156','success','','127.0.0.1','PostmanRuntime-ApipostRuntime/1.1.0','','','2026-08-20 15:01:42'),(2,2,'liuguohui','PLC参数修改','fillVolume (灌装体积(mL))','156','158','success','','127.0.0.1','PostmanRuntime-ApipostRuntime/1.1.0','','','2026-08-20 15:01:48'),(3,2,'liuguohui','用户登录','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','','42d3079d0cd223dc90ec8b4738f1b2e73506947909a387fc900443e6a23ce2c0','2026-08-22 13:00:05'),(4,2,'liuguohui','用户登录','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','42d3079d0cd223dc90ec8b4738f1b2e73506947909a387fc900443e6a23ce2c0','28c65267dae4c464b1f8641dc9f2990a243233b017467ecdb8c4c83a45244bfb','2026-08-22 13:01:43'),(5,6,'engineer02','用户登录','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','28c65267dae4c464b1f8641dc9f2990a243233b017467ecdb8c4c83a45244bfb','1b4f08bdb93e97e78c4582fc1cffd81f42b2fd70a54731d57816644ef566f6b5','2026-08-22 13:02:19'),(6,6,'engineer02','用户登录','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','1b4f08bdb93e97e78c4582fc1cffd81f42b2fd70a54731d57816644ef566f6b5','5cf60653af62a8e28a40bf681deca39504f82f6d767932c7456d349a7a99a510','2026-08-22 13:02:40'),(7,2,'liuguohui','用户登录','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','5cf60653af62a8e28a40bf681deca39504f82f6d767932c7456d349a7a99a510','60f2a305ccb0271419856f988769e8bc2a12b1ab28f198bae755962f17d78afe','2026-08-22 13:03:08'),(8,2,'liuguohui','USER_LOGIN','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','60f2a305ccb0271419856f988769e8bc2a12b1ab28f198bae755962f17d78afe','bc58302b7bcc69b83b6ebd5ad14b9ff8a945246703cfa3f97c5cf9a40318d3db','2026-08-22 13:45:04'),(9,2,'liuguohui','USER_LOGIN','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','bc58302b7bcc69b83b6ebd5ad14b9ff8a945246703cfa3f97c5cf9a40318d3db','6fab50e15c281474de30375368311d3df64a2e2564d1b32472036d07f1952584','2026-08-22 13:45:30');
/*!40000 ALTER TABLE `nex_audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nex_dept`
--

DROP TABLE IF EXISTS `nex_dept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_dept` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `parent_id` int DEFAULT '0' COMMENT '父部门ID，顶级为0',
  `dept_name` json NOT NULL COMMENT '部门名称（多语言）',
  `order_num` int DEFAULT '0' COMMENT '排序号',
  `leader` varchar(50) DEFAULT '' COMMENT '负责人',
  `phone` varchar(20) DEFAULT '' COMMENT '联系电话',
  `email` varchar(100) DEFAULT '' COMMENT '邮箱',
  `status` tinyint DEFAULT '1' COMMENT '状态 1启用 0禁用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='部门表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_dept`
--

LOCK TABLES `nex_dept` WRITE;
/*!40000 ALTER TABLE `nex_dept` DISABLE KEYS */;
INSERT INTO `nex_dept` VALUES (100,0,'{\"en-US\": \"Headquarters\", \"zh-CN\": \"总公司\"}',0,'张总','13800000000','ceo@nexcm.com',1,'2026-01-01 00:00:00','2026-08-22 13:16:49'),(101,100,'{\"en-US\": \"Technology Department\", \"zh-CN\": \"技术部\"}',1,'王工','13800000001','tech@nexcm.com',1,'2026-01-01 00:00:00','2026-08-22 13:16:49'),(102,100,'{\"en-US\": \"Production Department\", \"zh-CN\": \"生产部\"}',2,'李工','13800000002','prod@nexcm.com',1,'2026-01-01 00:00:00','2026-08-22 13:16:49');
/*!40000 ALTER TABLE `nex_dept` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `nex_dict_item`
--

LOCK TABLES `nex_dict_item` WRITE;
/*!40000 ALTER TABLE `nex_dict_item` DISABLE KEYS */;
INSERT INTO `nex_dict_item` VALUES (1,1,'1','{\"en-US\": \"Enabled\", \"zh-CN\": \"启用\"}','success','',1,1,1,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(2,1,'0','{\"en-US\": \"Disabled\", \"zh-CN\": \"禁用\"}','danger','',0,1,2,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(3,2,'0','{\"en-US\": \"Unknown\", \"zh-CN\": \"未知\"}','info','',1,1,1,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(4,2,'1','{\"en-US\": \"Male\", \"zh-CN\": \"男\"}','primary','',0,1,2,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(5,2,'2','{\"en-US\": \"Female\", \"zh-CN\": \"女\"}','warning','',0,1,3,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(6,3,'administrator','{\"en-US\": \"Administrator\", \"zh-CN\": \"管理员\"}','danger','',0,1,1,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(7,3,'engineer','{\"en-US\": \"Engineer\", \"zh-CN\": \"工程师\"}','warning','',0,1,2,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(8,3,'operator','{\"en-US\": \"Operator\", \"zh-CN\": \"操作员\"}','info','',1,1,3,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(9,4,'USER_LOGIN','{\"en-US\": \"User Login\", \"zh-CN\": \"用户登录\"}','primary','',0,1,1,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(10,4,'USER_REGISTER','{\"en-US\": \"User Register\", \"zh-CN\": \"用户注册\"}','success','',0,1,2,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(11,4,'USER_CREATE','{\"en-US\": \"Create User\", \"zh-CN\": \"新增用户\"}','success','',0,1,3,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(12,4,'USER_UPDATE','{\"en-US\": \"Update User\", \"zh-CN\": \"修改用户\"}','warning','',0,1,4,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(13,4,'USER_DELETE','{\"en-US\": \"Delete User\", \"zh-CN\": \"删除用户\"}','danger','',0,1,5,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(14,4,'PLC_WRITE','{\"en-US\": \"PLC Parameter Update\", \"zh-CN\": \"PLC参数修改\"}','warning','',0,1,6,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(15,4,'SYSTEM_EXPORT','{\"en-US\": \"Data Export\", \"zh-CN\": \"数据导出\"}','info','',0,1,7,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(16,5,'success','{\"en-US\": \"Success\", \"zh-CN\": \"成功\"}','success','',1,1,1,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(17,5,'failed','{\"en-US\": \"Failed\", \"zh-CN\": \"失败\"}','danger','',0,1,2,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(18,6,'system','{\"en-US\": \"System\", \"zh-CN\": \"系统通知\"}','primary','',1,1,1,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(19,6,'plc','{\"en-US\": \"PLC Alert\", \"zh-CN\": \"PLC告警\"}','danger','',0,1,2,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(20,6,'user','{\"en-US\": \"User\", \"zh-CN\": \"用户相关\"}','success','',0,1,3,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(21,6,'audit','{\"en-US\": \"Audit\", \"zh-CN\": \"审计相关\"}','warning','',0,1,4,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(22,7,'normal','{\"en-US\": \"Normal\", \"zh-CN\": \"普通\"}','info','',1,1,1,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(23,7,'high','{\"en-US\": \"High\", \"zh-CN\": \"高\"}','warning','',0,1,2,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(24,7,'critical','{\"en-US\": \"Critical\", \"zh-CN\": \"紧急\"}','danger','',0,1,3,'','2026-01-01 00:00:00','2026-08-22 13:16:49'),(25,4,'USER_LOGIN_FAILED','{\"en-US\": \"User Login Failed\", \"zh-CN\": \"鐢ㄦ埛鐧诲綍澶辫触\"}','danger','',0,1,8,'','2026-08-22 13:38:22','2026-08-22 13:38:22'),(26,4,'USER_LOGOUT','{\"en-US\": \"User Logout\", \"zh-CN\": \"鐢ㄦ埛鐧诲嚭\"}','info','',0,1,9,'','2026-08-22 13:38:22','2026-08-22 13:38:22'),(27,4,'USER_BATCH_DELETE','{\"en-US\": \"Batch Delete User\", \"zh-CN\": \"鎵归噺鍒犻櫎鐢ㄦ埛\"}','danger','',0,1,10,'','2026-08-22 13:38:22','2026-08-22 13:38:22'),(28,4,'USER_STATUS_CHANGE','{\"en-US\": \"Change User Status\", \"zh-CN\": \"修改用户状态\"}','warning','',0,1,11,'','2026-08-22 13:39:45','2026-08-22 13:39:45'),(29,4,'USER_RESET_PASSWORD','{\"en-US\": \"Reset Password\", \"zh-CN\": \"重置密码\"}','warning','',0,1,12,'','2026-08-22 13:39:45','2026-08-22 13:39:45'),(30,4,'PLC_READ','{\"en-US\": \"PLC Parameter Read\", \"zh-CN\": \"PLC参数读取\"}','primary','',0,1,13,'','2026-08-22 13:39:45','2026-08-22 13:39:45'),(31,4,'PLC_CONNECT','{\"en-US\": \"PLC Connect\", \"zh-CN\": \"PLC连接\"}','success','',0,1,14,'','2026-08-22 13:39:45','2026-08-22 13:39:45'),(32,4,'PLC_DISCONNECT','{\"en-US\": \"PLC Disconnect\", \"zh-CN\": \"PLC断开\"}','danger','',0,1,15,'','2026-08-22 13:39:45','2026-08-22 13:39:45'),(33,4,'PLC_RECONNECT','{\"en-US\": \"PLC Reconnect\", \"zh-CN\": \"PLC重连\"}','warning','',0,1,16,'','2026-08-22 13:39:45','2026-08-22 13:39:45'),(34,4,'SYSTEM_CONFIG_CHANGE','{\"en-US\": \"System Config Change\", \"zh-CN\": \"系统配置修改\"}','warning','',0,1,17,'','2026-08-22 13:39:45','2026-08-22 13:39:45'),(35,4,'SYSTEM_IMPORT','{\"en-US\": \"Data Import\", \"zh-CN\": \"数据导入\"}','info','',0,1,18,'','2026-08-22 13:39:45','2026-08-22 13:39:45'),(36,4,'AUDIT_VERIFY','{\"en-US\": \"Audit Hash Verify\", \"zh-CN\": \"审计哈希链校验\"}','primary','',0,1,19,'','2026-08-22 13:39:45','2026-08-22 13:39:45');
/*!40000 ALTER TABLE `nex_dict_item` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `nex_dict_type`
--

LOCK TABLES `nex_dict_type` WRITE;
/*!40000 ALTER TABLE `nex_dict_type` DISABLE KEYS */;
INSERT INTO `nex_dict_type` VALUES (1,'user_status','{\"en-US\": \"User Status\", \"zh-CN\": \"用户状态\"}','{\"en-US\": \"用户账号状态\", \"zh-CN\": \"用户账号状态\"}',1,1,'2026-01-01 00:00:00','2026-08-22 13:16:49'),(2,'user_sex','{\"en-US\": \"Gender\", \"zh-CN\": \"性别\"}','{\"en-US\": \"用户性别\", \"zh-CN\": \"用户性别\"}',1,2,'2026-01-01 00:00:00','2026-08-22 13:16:49'),(3,'user_role','{\"en-US\": \"User Role\", \"zh-CN\": \"用户角色\"}','{\"en-US\": \"用户角色类型\", \"zh-CN\": \"用户角色类型\"}',1,3,'2026-01-01 00:00:00','2026-08-22 13:16:49'),(4,'audit_action','{\"en-US\": \"Audit Action Type\", \"zh-CN\": \"审计操作类型\"}','{\"en-US\": \"审计日志操作类型\", \"zh-CN\": \"审计日志操作类型\"}',1,4,'2026-01-01 00:00:00','2026-08-22 13:16:49'),(5,'audit_result','{\"en-US\": \"Audit Result\", \"zh-CN\": \"审计操作结果\"}','{\"en-US\": \"审计日志操作结果\", \"zh-CN\": \"审计日志操作结果\"}',1,5,'2026-01-01 00:00:00','2026-08-22 13:16:49'),(6,'notification_type','{\"en-US\": \"Notification Type\", \"zh-CN\": \"通知类型\"}','{\"en-US\": \"系统通知类型\", \"zh-CN\": \"系统通知类型\"}',1,6,'2026-01-01 00:00:00','2026-08-22 13:16:49'),(7,'notification_priority','{\"en-US\": \"Notification Priority\", \"zh-CN\": \"通知优先级\"}','{\"en-US\": \"系统通知优先级\", \"zh-CN\": \"系统通知优先级\"}',1,7,'2026-01-01 00:00:00','2026-08-22 13:16:49');
/*!40000 ALTER TABLE `nex_dict_type` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_menu`
--

LOCK TABLES `nex_menu` WRITE;
/*!40000 ALTER TABLE `nex_menu` DISABLE KEYS */;
INSERT INTO `nex_menu` VALUES ('_001','','Customer','/customer',NULL,'noRedirect','客户管理','Customer','customer',0,1,0,1,'2026-08-16 04:46:11'),('_001_01','_001','Customer','customer',NULL,'noRedirect','客户档案','Customer Profile','#',0,0,0,1,'2026-08-16 04:20:00'),('_001_02','_001','Visit','visit',NULL,'noRedirect','拜访记录','Visit Records','#',0,0,0,2,'2026-08-16 04:20:01'),('_002','','Business','/business',NULL,'noRedirect','修养预约','Appointment','appointment',0,0,0,2,'2026-08-16 04:20:02'),('_002_01','_002','Appointment','appointment',NULL,'noRedirect','预约信息','Appointment Info','#',0,0,0,1,'2026-08-16 04:20:02'),('_002_02','_002','Service','service',NULL,'noRedirect','服务项目','Service Items','#',0,0,0,2,'2026-08-16 04:20:03'),('_002_03','_002','Statement','statement',NULL,'noRedirect','结算单据','Settlement','#',0,0,0,3,'2026-08-16 04:20:04'),('_003','','Flow','/flow',NULL,'noRedirect','流程管理','Flow','flow',0,0,0,3,'2026-08-16 04:46:11'),('_003_01','_003','Definition','definition',NULL,'noRedirect','流程定义','Flow Definition','#',0,0,0,1,'2026-08-16 04:20:05'),('_003_02','_003','Approve','approve',NULL,'noRedirect','审核流程','Approval Flow','#',0,0,0,2,'2026-08-16 04:20:08');
/*!40000 ALTER TABLE `nex_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nex_notification`
--

DROP TABLE IF EXISTS `nex_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_notification` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `user_id` int NOT NULL COMMENT '接收用户ID',
  `title` varchar(200) NOT NULL COMMENT '通知标题',
  `content` text COMMENT '通知内容',
  `type` varchar(50) DEFAULT 'system' COMMENT '通知类型 system/plc/user/audit',
  `priority` varchar(20) DEFAULT 'normal' COMMENT '优先级 high/normal/low',
  `link` varchar(500) DEFAULT '' COMMENT '跳转链接',
  `is_read` tinyint DEFAULT '0' COMMENT '是否已读 1是 0否',
  `read_time` datetime DEFAULT NULL COMMENT '阅读时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_read` (`is_read`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='通知表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_notification`
--

LOCK TABLES `nex_notification` WRITE;
/*!40000 ALTER TABLE `nex_notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `nex_notification` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `nex_role`
--

LOCK TABLES `nex_role` WRITE;
/*!40000 ALTER TABLE `nex_role` DISABLE KEYS */;
INSERT INTO `nex_role` VALUES (1,'administrator','{\"en-US\": \"System Administrator\", \"zh-CN\": \"系统管理员\"}','{\"en-US\": \"Full system access\", \"zh-CN\": \"拥有系统全部权限\"}','all',1,1,'2026-01-01 00:00:00','2026-08-22 13:16:49'),(2,'engineer','{\"en-US\": \"Engineer\", \"zh-CN\": \"工程师\"}','{\"en-US\": \"Device engineer, can manage device parameters\", \"zh-CN\": \"设备工程师，可管理设备参数\"}','dept',1,2,'2026-01-01 00:00:00','2026-08-22 13:16:49'),(3,'operator','{\"en-US\": \"Operator\", \"zh-CN\": \"操作员\"}','{\"en-US\": \"Normal operator, view and operate only\", \"zh-CN\": \"普通操作员，仅可查看和操作\"}','self',1,3,'2026-01-01 00:00:00','2026-08-22 13:16:49');
/*!40000 ALTER TABLE `nex_role` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色菜单关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_role_menu`
--

LOCK TABLES `nex_role_menu` WRITE;
/*!40000 ALTER TABLE `nex_role_menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `nex_role_menu` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_dept` (`dept_id`),
  KEY `idx_status_del` (`status`,`is_delete`),
  CONSTRAINT `chk_is_delete` CHECK ((`is_delete` in (0,1))),
  CONSTRAINT `chk_role` CHECK ((`role` in (_utf8mb4'administrator',_utf8mb4'engineer',_utf8mb4'operator'))),
  CONSTRAINT `chk_sex` CHECK ((`sex` in (0,1,2))),
  CONSTRAINT `chk_status` CHECK ((`status` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统用户表 | nex 管理平台';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_user`
--

LOCK TABLES `nex_user` WRITE;
/*!40000 ALTER TABLE `nex_user` DISABLE KEYS */;
INSERT INTO `nex_user` VALUES (1,'admin','$2b$10$lI1m4nPUhnYEBSvHjoSIzu10hVhNjy.y6X3EJCuMy8HexrRXgw4.u','administrator','系统管理员',1,'13800000001','admin@nexcm.com',100,'administrator','127.0.0.1','2026-08-16 20:42:31','超级管理员',1,0,'2026-07-28 18:57:46','admin','2026-08-16 20:42:31','',0,NULL),(2,'liuguohui','$2b$10$lI1m4nPUhnYEBSvHjoSIzu10hVhNjy.y6X3EJCuMy8HexrRXgw4.u','administrator','刘国辉',1,'13800000002','liu@nexcm.com',100,'administrator','127.0.0.1','2026-08-22 13:45:30','设备负责人',1,0,'2026-07-28 18:57:46','admin','2026-08-22 13:45:30','',0,NULL),(3,'engineer01','$2b$10$lI1m4nPUhnYEBSvHjoSIzu10hVhNjy.y6X3EJCuMy8HexrRXgw4.u','engineer','王强',1,'13800000003','wang@nexcm.com',101,'engineer','192.168.1.105','2026-07-25 08:15:00','设备工程师',1,0,'2026-07-28 18:57:46','liuguohui','2026-08-11 10:11:53','',0,NULL),(5,'operator02','$2b$10$lI1m4nPUhnYEBSvHjoSIzu10hVhNjy.y6X3EJCuMy8HexrRXgw4.u','operator','李泽楷',1,'13800000005','li@nexcm.com',102,'operator','192.168.1.110','2026-06-30 16:20:00','已离职',0,0,'2026-07-28 18:57:46','liuguohui','2026-08-11 10:11:53','',0,NULL),(6,'engineer02','$2a$10$J6K/o9sRQNVZD1LGkpT.metMC16.NS26O0DUaAx6peVqqximnuA.O','operator','张海琪',0,'15898785847','engineer123456@test.com',NULL,'operator','127.0.0.1','2026-08-22 13:02:40','',1,0,'2026-08-16 18:29:21','','2026-08-22 13:02:39','',1,NULL);
/*!40000 ALTER TABLE `nex_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nex_user_menu`
--

DROP TABLE IF EXISTS `nex_user_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_user_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户id',
  `menu_id` varchar(32) NOT NULL COMMENT '菜单id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_user_menu`
--

LOCK TABLES `nex_user_menu` WRITE;
/*!40000 ALTER TABLE `nex_user_menu` DISABLE KEYS */;
INSERT INTO `nex_user_menu` VALUES (21,1,'_001'),(22,1,'_001_01'),(23,1,'_001_02'),(24,1,'_002'),(25,1,'_002_01'),(26,1,'_002_02'),(27,1,'_002_03'),(28,1,'_003'),(29,1,'_003_01'),(30,1,'_003_02'),(31,2,'_001'),(32,2,'_001_01'),(33,2,'_001_02'),(34,2,'_002'),(35,2,'_002_01'),(36,2,'_002_02'),(37,2,'_002_03'),(38,2,'_003'),(39,2,'_003_01'),(40,2,'_003_02'),(41,3,'_002'),(42,3,'_002_01'),(43,3,'_002_02'),(44,3,'_002_03'),(45,3,'_003'),(46,3,'_003_01'),(47,3,'_003_02'),(48,4,'_002'),(49,4,'_002_01'),(50,4,'_002_02'),(51,4,'_002_03'),(52,6,'_001'),(53,6,'_001_01'),(54,6,'_001_02'),(55,6,'_002'),(56,6,'_002_01'),(57,6,'_002_02'),(58,6,'_002_03'),(59,6,'_003'),(60,6,'_003_01'),(61,6,'_003_02');
/*!40000 ALTER TABLE `nex_user_menu` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-22 14:11:19
