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
-- Table structure for table `device_part`
--

DROP TABLE IF EXISTS `device_part`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_part` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `template_id` int NOT NULL COMMENT '关联模板ID',
  `template_key` varchar(50) NOT NULL COMMENT '模板key（冗余，方便查询）',
  `part_code` varchar(100) NOT NULL COMMENT '部件编码（如 FILL-NEEDLE-001）',
  `spec` varchar(200) DEFAULT '' COMMENT '规格型号（可修改）',
  `rated_life` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '额定寿命（人工录入，可修改）',
  `used_life` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '已使用寿命（系统统计或人工录入）',
  `life_unit` varchar(20) NOT NULL DEFAULT 'times' COMMENT '寿命单位（从模板继承）',
  `install_date` date DEFAULT NULL COMMENT '安装日期',
  `last_replace_date` date DEFAULT NULL COMMENT '上次更换日期',
  `last_stat_value` decimal(12,2) DEFAULT '0.00' COMMENT '上次统计的PLC计数值（用于计算增量）',
  `status` varchar(20) NOT NULL DEFAULT 'normal' COMMENT '状态（normal/notice/warning/expired）',
  `remark` text COMMENT '备注',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除（0-未删除 1-已删除）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_part_code` (`part_code`),
  KEY `idx_template_id` (`template_id`),
  KEY `idx_template_key` (`template_key`),
  KEY `idx_status` (`status`),
  KEY `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='部件实例表（用户管理）';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_part`
--

LOCK TABLES `device_part` WRITE;
/*!40000 ALTER TABLE `device_part` DISABLE KEYS */;
INSERT INTO `device_part` VALUES (1,1,'fill_needle','FILL-NEEDLE-001','2.0mL 标准型',8000.00,0.00,'times','2026-09-02',NULL,0.00,'normal','全新灌装针组件',0,'2026-09-02 18:39:56','2026-09-02 18:39:56'),(2,2,'fill_tube','FILL-TUBE-001','硅胶管 φ8×12',50000.00,0.00,'times','2026-09-02',NULL,0.00,'normal','新装灌装针',0,'2026-09-02 18:40:55','2026-09-02 18:40:55'),(3,3,'stopper_rod','STOPPER-ROD-001','标准加塞杆',20000.00,0.00,'times','2026-09-02',NULL,0.00,'normal','新装加塞杆',0,'2026-09-02 18:41:19','2026-09-02 18:41:19'),(4,4,'vacuum_unit','VACUUM-UNIT-001','真空发生器组件',77000.00,0.00,'times','2026-09-02',NULL,0.00,'normal','新装真空模组',0,'2026-09-02 18:41:37','2026-09-02 18:41:37');
/*!40000 ALTER TABLE `device_part` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_part_replace_record`
--

DROP TABLE IF EXISTS `device_part_replace_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_part_replace_record` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `part_id` int NOT NULL COMMENT '关联部件实例ID',
  `template_key` varchar(50) NOT NULL COMMENT '模板key',
  `old_code` varchar(100) NOT NULL COMMENT '旧部件编码',
  `new_code` varchar(100) NOT NULL COMMENT '新部件编码',
  `old_used_life` decimal(12,2) DEFAULT '0.00' COMMENT '旧部件已使用寿命',
  `replace_reason` varchar(100) DEFAULT '' COMMENT '更换原因',
  `operator_id` int DEFAULT NULL COMMENT '操作人ID',
  `operator_name` varchar(50) DEFAULT '' COMMENT '操作人姓名（冗余）',
  `remark` text COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更换时间',
  PRIMARY KEY (`id`),
  KEY `idx_part_id` (`part_id`),
  KEY `idx_template_key` (`template_key`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='部件更换记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_part_replace_record`
--

LOCK TABLES `device_part_replace_record` WRITE;
/*!40000 ALTER TABLE `device_part_replace_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `device_part_replace_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_part_template`
--

DROP TABLE IF EXISTS `device_part_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_part_template` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `template_key` varchar(50) NOT NULL COMMENT '模板唯一标识（如 fill_needle）',
  `name_key` varchar(100) NOT NULL COMMENT '名称国际化key',
  `code_prefix` varchar(50) NOT NULL COMMENT '编码前缀（如 FILL-NEEDLE）',
  `default_spec` varchar(200) DEFAULT '' COMMENT '默认规格型号',
  `life_unit` varchar(20) NOT NULL DEFAULT 'times' COMMENT '寿命单位（times/hours/days/cycles）',
  `default_rated_life` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '默认额定寿命',
  `stat_method` varchar(50) NOT NULL DEFAULT 'manual' COMMENT '统计方式（plc_count/runtime/manual）',
  `stat_tag` varchar(100) DEFAULT '' COMMENT '统计用的PLC标签名',
  `icon` varchar(50) DEFAULT 'el-icon-cpu' COMMENT '图标类名',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `enabled` tinyint NOT NULL DEFAULT '1' COMMENT '是否启用（0-禁用 1-启用）',
  `is_base_template` tinyint DEFAULT '0' COMMENT '是否基础模板(1:是,0:否)',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除 0-未删除 1-已删除',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_template_key` (`template_key`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='部件模板表（系统预设）';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_part_template`
--

LOCK TABLES `device_part_template` WRITE;
/*!40000 ALTER TABLE `device_part_template` DISABLE KEYS */;
INSERT INTO `device_part_template` VALUES (1,'fill_needle','menu.device.part.page.template.fillNeedle','FILL-NEEDLE','3.0mL 标准型','times',10000.00,'plc_count','fillNeedleSuccessCount','',1,1,1,0,'2026-09-02 12:52:59','2026-09-04 18:51:50'),(2,'fill_tube','menu.device.part.page.template.fillTube','FILL-TUBE','高精度_硅胶管','times',50000.00,'plc_count','fillMotorRotationCount','',5,1,1,0,'2026-09-02 12:52:59','2026-09-04 19:05:04'),(3,'stopper_rod','menu.device.part.page.template.stopperRod','STOPPER-ROD','通用加塞杆','times',20000.00,'plc_count','stopperSuccessCount','',7,1,1,0,'2026-09-02 12:52:59','2026-09-04 19:05:04'),(4,'vacuum_unit','menu.device.part.page.template.vacuumUnit','VACUUM-UNIT','真空保持组件','times',80000.00,'plc_count','vacuumHoldSuccessCount','',8,1,1,0,'2026-09-02 12:52:59','2026-09-04 19:05:04');
/*!40000 ALTER TABLE `device_part_template` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=346 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='审计日志表(GMP 21CFR Part 11)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_audit_log`
--

LOCK TABLES `nex_audit_log` WRITE;
/*!40000 ALTER TABLE `nex_audit_log` DISABLE KEYS */;
INSERT INTO `nex_audit_log` VALUES (333,9,'buqiangqiang','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','','3388f5395bdf316b5641b594b99bc00a854760526879ccd215df9b6194ee379c','2026-09-05 13:17:44'),(334,9,'buqiangqiang','config.security.change','配置分类:security, 变化项数:1','{\"watermarkEnabled\":false}','{\"watermarkEnabled\":true}','success','管理员修改系统配置','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','3388f5395bdf316b5641b594b99bc00a854760526879ccd215df9b6194ee379c','b6efaad3865e0dc97cabe04025df66769cdfe6673965b131515aa3117e0a0e61','2026-09-05 13:19:01'),(335,9,'buqiangqiang','config.security.change','配置分类:security, 变化项数:1','{\"watermarkEnabled\":true}','{\"watermarkEnabled\":false}','success','管理员修改系统配置','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','b6efaad3865e0dc97cabe04025df66769cdfe6673965b131515aa3117e0a0e61','a42c2666601ae157849ea86319dfdc48d36b1d3a4d3cec60bc6376bc185b636f','2026-09-05 13:19:05'),(336,9,'buqiangqiang','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','a42c2666601ae157849ea86319dfdc48d36b1d3a4d3cec60bc6376bc185b636f','ee156a300561f4b4e3b351d960bd8cc5e4fa8b9d1051a1526beb7ce421b61e64','2026-09-05 13:28:15'),(337,9,'buqiangqiang','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','ee156a300561f4b4e3b351d960bd8cc5e4fa8b9d1051a1526beb7ce421b61e64','f23f152cb007e78bf680f4eda64f0177621edca403375ceb41da704525531176','2026-09-05 14:02:09'),(338,1,'liuguohui','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','f23f152cb007e78bf680f4eda64f0177621edca403375ceb41da704525531176','50f7a71d891c7935d8d5c955df910f3521a4aad981660ef7c944653ae796bcd5','2026-09-05 14:20:04'),(339,9,'buqiangqiang','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','50f7a71d891c7935d8d5c955df910f3521a4aad981660ef7c944653ae796bcd5','15d8a92d58fe6b1edb0c6d778c390f275c0db9f889213df68c8fdb46737f6c3a','2026-09-05 14:20:18'),(340,1,'liuguohui','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','15d8a92d58fe6b1edb0c6d778c390f275c0db9f889213df68c8fdb46737f6c3a','5721341d1e5c326b9615a39c59af2f501a7ab7c049f8ab188d36c151cf0ffdd5','2026-09-05 14:26:44'),(341,1,'liuguohui','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','5721341d1e5c326b9615a39c59af2f501a7ab7c049f8ab188d36c151cf0ffdd5','70323327bb356835771df164b253178402f73ff7cc1e9c26b0af9d4e39f84d3e','2026-09-05 15:21:46'),(342,1,'liuguohui','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','70323327bb356835771df164b253178402f73ff7cc1e9c26b0af9d4e39f84d3e','5ba543738c9f3b4201803ed30054848277c544bd30b2814528f638b8bec34d5c','2026-09-05 15:23:34'),(343,1,'liuguohui','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','5ba543738c9f3b4201803ed30054848277c544bd30b2814528f638b8bec34d5c','e5dd560541d9332498b4fad620c1f648c47115f41742d46fa1c44a8a871367fa','2026-09-05 15:24:09'),(344,1,'liuguohui','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','e5dd560541d9332498b4fad620c1f648c47115f41742d46fa1c44a8a871367fa','b726a219743cb9ad4483a279c55b34925e28a9a1d257cfddc4e469fe6003f78b','2026-09-05 15:25:39'),(345,1,'liuguohui','user.login','系统登录','','','success','','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','b726a219743cb9ad4483a279c55b34925e28a9a1d257cfddc4e469fe6003f78b','060568259713d236e9e1623f619032f9349470b641382bfe61ff7633e89c6ac6','2026-09-05 16:59:42');
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
  `dept_name` varchar(100) NOT NULL COMMENT '部门名称',
  `parent_id` int DEFAULT '0' COMMENT '父部门ID，顶级为0',
  `order_num` int DEFAULT '0' COMMENT '排序号',
  `leader` varchar(50) DEFAULT '' COMMENT '负责人',
  `phone` varchar(20) DEFAULT '' COMMENT '联系电话',
  `email` varchar(100) DEFAULT '' COMMENT '邮箱',
  `status` tinyint DEFAULT '1' COMMENT '状态 1启用 0禁用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='部门表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_dept`
--

LOCK TABLES `nex_dept` WRITE;
/*!40000 ALTER TABLE `nex_dept` DISABLE KEYS */;
INSERT INTO `nex_dept` VALUES (100,'赛诺智能医疗科技（无锡）有限公司',0,0,'刘国辉','18662605940','liugh@sainuo-medical.com',1,'2026-01-01 00:00:00','2026-09-05 13:14:01');
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
  `label` varchar(100) NOT NULL COMMENT '字典标签',
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
INSERT INTO `nex_dict_item` VALUES (1,1,'1','启用','success','',1,1,1,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(2,1,'0','禁用','danger','',0,1,2,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(3,2,'0','未知','info','',1,1,1,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(4,2,'1','男','primary','',0,1,2,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(5,2,'2','女','warning','',0,1,3,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(6,3,'administrator','管理员','danger','',0,1,1,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(7,3,'engineer','工程师','warning','',0,1,2,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(8,3,'operator','操作员','info','',1,1,3,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(9,4,'USER_LOGIN','用户登录','primary','',0,1,1,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(10,4,'USER_REGISTER','用户注册','success','',0,1,2,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(11,4,'USER_CREATE','新增用户','success','',0,1,3,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(12,4,'USER_UPDATE','修改用户','warning','',0,1,4,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(13,4,'USER_DELETE','删除用户','danger','',0,1,5,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(14,4,'PLC_WRITE','PLC参数修改','warning','',0,1,6,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(15,4,'SYSTEM_EXPORT','数据导出','info','',0,1,7,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(16,5,'success','成功','success','',1,1,1,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(17,5,'failed','失败','danger','',0,1,2,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(18,6,'system','系统通知','primary','',1,1,1,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(19,6,'plc','PLC告警','danger','',0,1,2,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(20,6,'user','用户相关','success','',0,1,3,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(21,6,'audit','审计相关','warning','',0,1,4,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(22,7,'normal','普通','info','',1,1,1,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(23,7,'high','高','warning','',0,1,2,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(24,7,'critical','紧急','danger','',0,1,3,'','2026-01-01 00:00:00','2026-09-05 12:36:46'),(25,4,'USER_LOGIN_FAILED','用户登录失败','danger','',0,1,8,'','2026-08-22 13:38:22','2026-09-05 12:36:46'),(26,4,'USER_LOGOUT','用户登出','info','',0,1,9,'','2026-08-22 13:38:22','2026-09-05 12:36:46'),(27,4,'USER_BATCH_DELETE','批量删除用户','danger','',0,1,10,'','2026-08-22 13:38:22','2026-09-05 12:36:46'),(28,4,'USER_STATUS_CHANGE','修改用户状态','warning','',0,1,11,'','2026-08-22 13:39:45','2026-09-05 12:36:46'),(29,4,'USER_RESET_PASSWORD','重置密码','warning','',0,1,12,'','2026-08-22 13:39:45','2026-09-05 12:36:46'),(30,4,'PLC_READ','PLC参数读取','primary','',0,1,13,'','2026-08-22 13:39:45','2026-09-05 12:36:46'),(31,4,'PLC_CONNECT','PLC连接','success','',0,1,14,'','2026-08-22 13:39:45','2026-09-05 12:36:46'),(32,4,'PLC_DISCONNECT','PLC断开','danger','',0,1,15,'','2026-08-22 13:39:45','2026-09-05 12:36:46'),(33,4,'PLC_RECONNECT','PLC重连','warning','',0,1,16,'','2026-08-22 13:39:45','2026-09-05 12:36:46'),(34,4,'SYSTEM_CONFIG_CHANGE','系统配置修改','warning','',0,1,17,'','2026-08-22 13:39:45','2026-09-05 12:36:46'),(35,4,'SYSTEM_IMPORT','数据导入','info','',0,1,18,'','2026-08-22 13:39:45','2026-09-05 12:36:46'),(36,4,'AUDIT_VERIFY','审计哈希链校验','primary','',0,1,19,'','2026-08-22 13:39:45','2026-09-05 12:36:46');
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
  `dict_name` varchar(100) NOT NULL COMMENT '字典类型名称',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
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
INSERT INTO `nex_dict_type` VALUES (1,'user_status','用户状态','用户账号状态',1,1,'2026-01-01 00:00:00','2026-09-05 12:36:46'),(2,'user_sex','性别','用户性别',1,2,'2026-01-01 00:00:00','2026-09-05 12:36:46'),(3,'user_role','用户角色','用户角色类型',1,3,'2026-01-01 00:00:00','2026-09-05 12:36:46'),(4,'audit_action','审计操作类型','审计日志操作类型',1,4,'2026-01-01 00:00:00','2026-09-05 12:36:46'),(5,'audit_result','审计操作结果','审计日志操作结果',1,5,'2026-01-01 00:00:00','2026-09-05 12:36:46'),(6,'notification_type','通知类型','系统通知类型',1,6,'2026-01-01 00:00:00','2026-09-05 12:36:46'),(7,'notification_priority','通知优先级','系统通知优先级',1,7,'2026-01-01 00:00:00','2026-09-05 12:36:46');
/*!40000 ALTER TABLE `nex_dict_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nex_email_config`
--

DROP TABLE IF EXISTS `nex_email_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_email_config` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(64) NOT NULL COMMENT '配置名称',
  `provider` varchar(32) NOT NULL DEFAULT 'custom' COMMENT '服务商：qq/163/126/gmail/outlook/custom',
  `host` varchar(128) NOT NULL COMMENT 'SMTP服务器地址',
  `port` int NOT NULL DEFAULT '465' COMMENT 'SMTP端口',
  `secure` tinyint DEFAULT '1' COMMENT '是否使用SSL 0-否 1-是',
  `username` varchar(128) NOT NULL COMMENT '邮箱账号',
  `password` varchar(512) NOT NULL COMMENT '邮箱授权码（AES加密存储）',
  `from_name` varchar(64) DEFAULT '' COMMENT '发件人名称',
  `is_default` tinyint DEFAULT '0' COMMENT '是否为默认配置 0-否 1-是',
  `is_system` tinyint DEFAULT '0' COMMENT '是否系统内置 0-否 1-是',
  `status` tinyint DEFAULT '1' COMMENT '状态 0-禁用 1-启用',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除 0-未删除 1-已删除',
  `remark` varchar(255) DEFAULT '' COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_provider` (`provider`),
  KEY `idx_is_default` (`is_default`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='邮箱配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_email_config`
--

LOCK TABLES `nex_email_config` WRITE;
/*!40000 ALTER TABLE `nex_email_config` DISABLE KEYS */;
INSERT INTO `nex_email_config` VALUES (1,'系统默认邮箱','qq','smtp.qq.com',465,0,'879639340@qq.com','ade2ba998464fe6da4a43115d6c2f7ac:91415b3d96d896e23b250d90b0d881a4a092ffbc3048c6f978379ec16d7ced32','nexSM系统通知',1,1,1,0,'系统默认邮箱配置test01','system','2026-09-01 13:35:18','2026-09-04 17:02:19');
/*!40000 ALTER TABLE `nex_email_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nex_email_log`
--

DROP TABLE IF EXISTS `nex_email_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_email_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `config_id` int DEFAULT '0' COMMENT '使用的邮箱配置ID（0表示系统默认）',
  `config_name` varchar(64) DEFAULT '' COMMENT '使用的邮箱配置名称',
  `to_email` varchar(128) NOT NULL COMMENT '收件人邮箱',
  `cc_email` varchar(500) DEFAULT '' COMMENT '抄送邮箱（多个用逗号分隔）',
  `subject` varchar(255) NOT NULL COMMENT '邮件主题',
  `template` varchar(64) DEFAULT '' COMMENT '使用的模板',
  `content` text COMMENT '邮件内容（HTML）',
  `status` tinyint DEFAULT '0' COMMENT '发送状态 0-待发送 1-成功 2-失败',
  `error_msg` varchar(500) DEFAULT '' COMMENT '失败原因',
  `retry_count` int DEFAULT '0' COMMENT '重试次数',
  `send_duration` int DEFAULT '0' COMMENT '发送耗时（毫秒）',
  `ip` varchar(64) DEFAULT '' COMMENT '请求IP',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `send_time` datetime DEFAULT NULL COMMENT '发送时间',
  PRIMARY KEY (`id`),
  KEY `idx_to_email` (`to_email`),
  KEY `idx_status` (`status`),
  KEY `idx_config_id` (`config_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='邮件发送记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_email_log`
--

LOCK TABLES `nex_email_log` WRITE;
/*!40000 ALTER TABLE `nex_email_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `nex_email_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nex_feature_config`
--

DROP TABLE IF EXISTS `nex_feature_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_feature_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `feature_key` varchar(100) NOT NULL COMMENT '功能标识',
  `feature_name` varchar(100) NOT NULL COMMENT '功能名称（国际化key）',
  `description` varchar(255) DEFAULT NULL COMMENT '功能描述（国际化key）',
  `category` varchar(50) NOT NULL COMMENT '分类：notification/email/audit/auth/system',
  `sub_category` varchar(50) DEFAULT NULL COMMENT '子分类',
  `value_type` varchar(20) NOT NULL DEFAULT 'boolean' COMMENT '值类型：boolean/string/number/json',
  `default_value` text COMMENT '默认值',
  `current_value` text COMMENT '当前值',
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用：1启用 0禁用',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `feature_key` (`feature_key`),
  KEY `idx_category` (`category`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='功能配置表（超级面板专用）';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_feature_config`
--

LOCK TABLES `nex_feature_config` WRITE;
/*!40000 ALTER TABLE `nex_feature_config` DISABLE KEYS */;
INSERT INTO `nex_feature_config` VALUES (1,'notification.system.backup.success','menu.superPanel.feature.notification.system.backupSuccess','menu.superPanel.feature.notification.system.backupSuccessDesc','notification','system','boolean','true','true',1,101,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(2,'notification.system.backup.failed','menu.superPanel.feature.notification.system.backupFailed','menu.superPanel.feature.notification.system.backupFailedDesc','notification','system','boolean','true','true',1,102,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(3,'notification.license.expiring','menu.superPanel.feature.notification.system.expiring','menu.superPanel.feature.notification.system.expiringDesc','notification','system','boolean','true','true',1,103,'2026-09-05 14:54:45','2026-09-05 15:38:29'),(4,'notification.license.expired','menu.superPanel.feature.notification.system.expired','menu.superPanel.feature.notification.system.expiredDesc','notification','system','boolean','true','true',1,104,'2026-09-05 14:54:45','2026-09-05 15:38:29'),(5,'notification.user.register','menu.superPanel.feature.notification.user.register','menu.superPanel.feature.notification.user.registerDesc','notification','user','boolean','true','true',1,201,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(6,'notification.user.create','menu.superPanel.feature.notification.user.create','menu.superPanel.feature.notification.user.createDesc','notification','user','boolean','true','true',1,202,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(7,'notification.user.update','menu.superPanel.feature.notification.user.update','menu.superPanel.feature.notification.user.updateDesc','notification','user','boolean','true','true',1,203,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(8,'notification.user.status.change','menu.superPanel.feature.notification.user.statusChange','menu.superPanel.feature.notification.user.statusChangeDesc','notification','user','boolean','true','true',1,204,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(9,'notification.user.password.reset','menu.superPanel.feature.notification.user.passwordReset','menu.superPanel.feature.notification.user.passwordResetDesc','notification','user','boolean','true','true',1,205,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(10,'notification.user.login.failed','menu.superPanel.feature.notification.user.loginFailed','menu.superPanel.feature.notification.user.loginFailedDesc','notification','user','boolean','true','true',1,206,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(11,'notification.user.role.change','menu.superPanel.feature.notification.user.roleChange','menu.superPanel.feature.notification.user.roleChangeDesc','notification','user','boolean','true','true',1,207,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(12,'notification.device.param.change','menu.superPanel.feature.notification.device.paramChange','menu.superPanel.feature.notification.device.paramChangeDesc','notification','device','boolean','true','true',1,301,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(13,'notification.device.maintenance.reminder','menu.superPanel.feature.notification.device.maintenanceReminder','menu.superPanel.feature.notification.device.maintenanceReminderDesc','notification','device','boolean','true','true',1,302,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(14,'notification.device.part.life.warning','menu.superPanel.feature.notification.device.partLifeWarning','menu.superPanel.feature.notification.device.partLifeWarningDesc','notification','device','boolean','true','true',1,303,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(15,'notification.production.order.create','menu.superPanel.feature.notification.production.orderCreate','menu.superPanel.feature.notification.production.orderCreateDesc','notification','production','boolean','true','true',1,401,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(16,'notification.production.order.update','menu.superPanel.feature.notification.production.orderUpdate','menu.superPanel.feature.notification.production.orderUpdateDesc','notification','production','boolean','true','true',1,402,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(17,'notification.production.order.complete','menu.superPanel.feature.notification.production.orderComplete','menu.superPanel.feature.notification.production.orderCompleteDesc','notification','production','boolean','true','true',1,403,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(18,'notification.production.batch.complete','menu.superPanel.feature.notification.production.batchComplete','menu.superPanel.feature.notification.production.batchCompleteDesc','notification','production','boolean','true','true',1,404,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(19,'notification.config.system.update','menu.superPanel.feature.notification.config.systemUpdate','menu.superPanel.feature.notification.config.systemUpdateDesc','notification','config','boolean','true','true',1,501,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(20,'notification.config.plc.connection.update','menu.superPanel.feature.notification.config.plcConnectionUpdate','menu.superPanel.feature.notification.config.plcConnectionUpdateDesc','notification','config','boolean','true','true',1,502,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(21,'notification.config.connection.update','menu.superPanel.feature.notification.config.connectionUpdate','menu.superPanel.feature.notification.config.connectionUpdateDesc','notification','config','boolean','true','true',1,503,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(22,'notification.config.device.params.update','menu.superPanel.feature.notification.config.deviceParamsUpdate','menu.superPanel.feature.notification.config.deviceParamsUpdateDesc','notification','config','boolean','true','true',1,504,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(23,'notification.config.export.update','menu.superPanel.feature.notification.config.exportUpdate','menu.superPanel.feature.notification.config.exportUpdateDesc','notification','config','boolean','true','true',1,505,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(24,'notification.config.security.update','menu.superPanel.feature.notification.config.securityUpdate','menu.superPanel.feature.notification.config.securityUpdateDesc','notification','config','boolean','true','true',1,506,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(25,'notification.audit.log.export','menu.superPanel.feature.notification.security.logExport','menu.superPanel.feature.notification.security.logExportDesc','notification','security','boolean','true','true',1,601,'2026-09-05 14:54:45','2026-09-05 15:38:29'),(26,'notification.audit.log.view','menu.superPanel.feature.notification.security.logView','menu.superPanel.feature.notification.security.logViewDesc','notification','security','boolean','true','true',1,602,'2026-09-05 14:54:45','2026-09-05 15:38:29'),(27,'notification.permission.change','menu.superPanel.feature.notification.security.permissionChange','menu.superPanel.feature.notification.security.permissionChangeDesc','notification','security','boolean','true','true',1,603,'2026-09-05 14:54:45','2026-09-05 15:38:29'),(28,'notification.data.export','menu.superPanel.feature.notification.security.dataExport','menu.superPanel.feature.notification.security.dataExportDesc','notification','security','boolean','true','true',1,604,'2026-09-05 14:54:45','2026-09-05 15:38:29'),(29,'notification.data.delete','menu.superPanel.feature.notification.security.dataDelete','menu.superPanel.feature.notification.security.dataDeleteDesc','notification','security','boolean','true','true',1,605,'2026-09-05 14:54:45','2026-09-05 15:38:29'),(30,'email.user.password.reset','menu.superPanel.feature.email.user.passwordReset','menu.superPanel.feature.email.user.passwordResetDesc','email','user','boolean','true','true',1,1001,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(31,'email.user.forgotPassword.code','menu.superPanel.feature.email.user.forgotPasswordCode','menu.superPanel.feature.email.user.forgotPasswordCodeDesc','email','user','boolean','true','true',1,1002,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(32,'email.user.password.resetSuccess','menu.superPanel.feature.email.user.resetSuccess','menu.superPanel.feature.email.user.resetSuccessDesc','email','user','boolean','true','true',1,1003,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(33,'email.notification.forward','menu.superPanel.feature.email.notification.forward','menu.superPanel.feature.email.notification.forwardDesc','email','notification','boolean','false','false',1,1004,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(34,'email.device.alarm','menu.superPanel.feature.email.device.alarm','menu.superPanel.feature.email.device.alarmDesc','email','device','boolean','false','false',1,1005,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(35,'audit.user','menu.superPanel.feature.audit.user','menu.superPanel.feature.audit.userDesc','audit','user','boolean','true','true',1,2001,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(36,'audit.permission','menu.superPanel.feature.audit.permission','menu.superPanel.feature.audit.permissionDesc','audit','permission','boolean','true','true',1,2002,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(37,'audit.config','menu.superPanel.feature.audit.config','menu.superPanel.feature.audit.configDesc','audit','config','boolean','true','true',1,2003,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(38,'audit.device','menu.superPanel.feature.audit.device','menu.superPanel.feature.audit.deviceDesc','audit','device','boolean','true','true',1,2004,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(39,'audit.production','menu.superPanel.feature.audit.production','menu.superPanel.feature.audit.productionDesc','audit','production','boolean','true','true',1,2005,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(40,'audit.data','menu.superPanel.feature.audit.data','menu.superPanel.feature.audit.dataDesc','audit','data','boolean','true','true',1,2006,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(41,'audit.plc','menu.superPanel.feature.audit.plc','menu.superPanel.feature.audit.plcDesc','audit','plc','boolean','true','true',1,2007,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(42,'audit.audit','menu.superPanel.feature.audit.audit','menu.superPanel.feature.audit.auditDesc','audit','audit','boolean','true','true',1,2008,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(43,'audit.license','menu.superPanel.feature.audit.license','menu.superPanel.feature.audit.licenseDesc','audit','license','boolean','true','true',1,2009,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(44,'audit.email','menu.superPanel.feature.audit.email','menu.superPanel.feature.audit.emailDesc','audit','email','boolean','true','true',1,2010,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(45,'auth.register.enabled','menu.superPanel.feature.auth.register','menu.superPanel.feature.auth.registerDesc','auth','register','boolean','false','false',1,3001,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(46,'auth.forgotPassword.enabled','menu.superPanel.feature.auth.forgotPassword','menu.superPanel.feature.auth.forgotPasswordDesc','auth','password','boolean','true','true',1,3002,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(47,'auth.firstLogin.changePassword','menu.superPanel.feature.auth.firstLoginChangePassword','menu.superPanel.feature.auth.firstLoginChangePasswordDesc','auth','password','boolean','true','true',1,3003,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(48,'auth.loginFailed.lock.enabled','menu.superPanel.feature.auth.loginFailedLock','menu.superPanel.feature.auth.loginFailedLockDesc','auth','security','boolean','true','true',1,3004,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(49,'system.notification.enabled','menu.superPanel.feature.system.notificationMaster','menu.superPanel.feature.system.notificationMasterDesc','system','master','boolean','true','true',1,4001,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(50,'system.email.enabled','menu.superPanel.feature.system.emailMaster','menu.superPanel.feature.system.emailMasterDesc','system','master','boolean','true','true',1,4002,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(51,'system.audit.enabled','menu.superPanel.feature.system.auditMaster','menu.superPanel.feature.system.auditMasterDesc','system','master','boolean','true','true',1,4003,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(52,'system.maintenance.task.enabled','menu.superPanel.feature.system.maintenanceTaskMaster','menu.superPanel.feature.system.maintenanceTaskMasterDesc','system','master','boolean','true','true',1,4004,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(53,'system.data.export.enabled','menu.superPanel.feature.system.dataExportMaster','menu.superPanel.feature.system.dataExportMasterDesc','system','master','boolean','true','true',1,4005,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(54,'system.watermark.enabled','menu.superPanel.feature.system.watermark','menu.superPanel.feature.system.watermarkDesc','system','display','boolean','true','true',1,4006,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(55,'system.onlineDevice.limit.enabled','menu.superPanel.feature.system.onlineDeviceLimit','menu.superPanel.feature.system.onlineDeviceLimitDesc','system','security','boolean','true','true',1,4007,'2026-09-05 14:54:45','2026-09-05 15:33:21'),(56,'system.audit.verify.enabled','menu.superPanel.feature.system.auditVerify','menu.superPanel.feature.system.auditVerifyDesc','system','audit','boolean','true','true',1,4008,'2026-09-05 14:54:45','2026-09-05 15:33:21');
/*!40000 ALTER TABLE `nex_feature_config` ENABLE KEYS */;
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
  `redirect` varchar(100) DEFAULT 'noRedirect' COMMENT '重定向路径',
  `title` varchar(100) NOT NULL COMMENT '菜单标题（i18n key）',
  `icon` varchar(50) DEFAULT NULL COMMENT '图标名称',
  `permission_code` varchar(100) DEFAULT NULL COMMENT '统一权限码（唯一标识，如 device:state:view）',
  `type` varchar(20) DEFAULT 'menu' COMMENT '权限类型：menu菜单/button按钮/param参数',
  `super_only` tinyint NOT NULL DEFAULT '0' COMMENT '仅超级管理员可见：1是 0否',
  `hidden` tinyint DEFAULT '0' COMMENT '是否隐藏菜单 0显示 1隐藏',
  `always_show` tinyint DEFAULT '0' COMMENT '是否永远展示父菜单（有子菜单时生效）',
  `no_cache` tinyint DEFAULT '0' COMMENT '是否不缓存页面',
  `sort` int DEFAULT '0' COMMENT '排序号',
  `api_path` varchar(200) DEFAULT NULL COMMENT '关联后端接口路径（button/param类型用）',
  `api_method` varchar(10) DEFAULT NULL COMMENT '接口方法：GET/POST/PUT/DELETE（button/param类型用）',
  `param_key` varchar(100) DEFAULT NULL COMMENT '参数标识（param类型用，如 fillVolume）',
  `param_mode` varchar(20) DEFAULT NULL COMMENT '参数权限模式：view可见/edit可编辑/hidden隐藏（param类型用）',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permission_code` (`permission_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_menu`
--

LOCK TABLES `nex_menu` WRITE;
/*!40000 ALTER TABLE `nex_menu` DISABLE KEYS */;
INSERT INTO `nex_menu` VALUES ('_101','','HomeDash','/home',NULL,'/home/overview','menu.home.default','HomeDash','home:view','menu',0,0,1,0,1,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:51:37'),('_101_01','_101','Overview','overview','home/overview/index','noRedirect','menu.home.overview.default','#','home:overview:view','menu',0,0,0,0,1,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-09-05 02:04:40'),('_101_02','_101','Dashboard','dashboard','home/dashboard/index','noRedirect','menu.home.dashboard.default','#','home:dashboard:view','menu',0,0,0,0,2,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-09-05 02:04:40'),('_101_03','_101','DataView','data','home/data/index','noRedirect','menu.home.dataview.default','#','home:data:view','menu',0,0,0,0,3,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-09-05 02:04:40'),('_101_03_alarm','_101_03','AlarmData','','','noRedirect','menu.home.dataview.alarm.title','#','home:data:alarm:view','tab',0,0,0,0,40,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_alarm_detail','_101_03_production','AlarmDataDetail','','','noRedirect','menu.home.dataview.detail','#','home:data:production:detail','button',0,0,0,0,5,'','','','','2026-09-04 11:07:14','2026-09-05 02:04:40'),('_101_03_alarm_export','_101_03_alarm','AlarmDataExport','','','noRedirect','menu.home.dataview.export','#','home:data:alarm:export','button',0,0,0,0,3,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_alarm_exportSingle','_101_03_production','AlarmDataExportSingle','','','noRedirect','menu.home.dataview.exportSingle','#','home:data:production:exportSingle','button',0,0,0,0,6,'','','','','2026-09-04 11:07:14','2026-09-05 02:04:40'),('_101_03_alarm_refresh','_101_03_alarm','AlarmDataRefresh','','','noRedirect','menu.home.dataview.refresh','#','home:data:alarm:refresh','button',0,0,0,0,4,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_alarm_reset','_101_03_alarm','AlarmDataReset','','','noRedirect','menu.home.dataview.reset','#','home:data:alarm:reset','button',0,0,0,0,2,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_alarm_search','_101_03_alarm','AlarmDataSearch','','','noRedirect','menu.home.dataview.search','#','home:data:alarm:search','button',0,0,0,0,1,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_oee','_101_03','OeeData','','','noRedirect','menu.home.dataview.oee.title','#','home:data:oee:view','tab',0,0,0,0,20,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_oee_export','_101_03_oee','OeeDataExport','','','noRedirect','menu.home.dataview.export','#','home:data:oee:export','button',0,0,0,0,3,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_oee_refresh','_101_03_oee','OeeDataRefresh','','','noRedirect','menu.home.dataview.refresh','#','home:data:oee:refresh','button',0,0,0,0,4,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_oee_reset','_101_03_oee','OeeDataReset','','','noRedirect','menu.home.dataview.reset','#','home:data:oee:reset','button',0,0,0,0,2,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_oee_search','_101_03_oee','OeeDataSearch','','','noRedirect','menu.home.dataview.search','#','home:data:oee:search','button',0,0,0,0,1,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_output','_101_03','OutputData','','','noRedirect','menu.home.dataview.output.title','#','home:data:output:view','tab',0,0,0,0,10,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_output_export','_101_03_output','OutputDataExport','','','noRedirect','menu.home.dataview.export','#','home:data:output:export','button',0,0,0,0,3,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_output_refresh','_101_03_output','OutputDataRefresh','','','noRedirect','menu.home.dataview.refresh','#','home:data:output:refresh','button',0,0,0,0,4,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_output_reset','_101_03_output','OutputDataReset','','','noRedirect','menu.home.dataview.reset','#','home:data:output:reset','button',0,0,0,0,2,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_output_search','_101_03_output','OutputDataSearch','','','noRedirect','menu.home.dataview.search','#','home:data:output:search','button',0,0,0,0,1,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_production','_101_03','ProductionData','','','noRedirect','menu.home.dataview.production.title','#','home:data:production:view','tab',0,0,0,0,30,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_production_export','_101_03_production','ProductionDataExport','','','noRedirect','menu.home.dataview.export','#','home:data:production:export','button',0,0,0,0,3,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_production_refresh','_101_03_production','ProductionDataRefresh','','','noRedirect','menu.home.dataview.refresh','#','home:data:production:refresh','button',0,0,0,0,4,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_production_reset','_101_03_production','ProductionDataReset','','','noRedirect','menu.home.dataview.reset','#','home:data:production:reset','button',0,0,0,0,2,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_101_03_production_search','_101_03_production','ProductionDataSearch','','','noRedirect','menu.home.dataview.search','#','home:data:production:search','button',0,0,0,0,1,'','','','','2026-09-04 10:58:54','2026-09-05 02:04:40'),('_102','','DeviceMg','/device',NULL,'noRedirect','menu.device.default','DeviceMg','device:view','menu',0,0,1,0,2,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:51:37'),('_102_01','_102','DevState','state','device/state/index','noRedirect','menu.device.state.default','#','device:state:view','menu',0,0,0,0,1,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:51:37'),('_102_02','_102','AlarmLog','alarm','device/alarm/index','noRedirect','menu.device.alarm.default','#','device:alarm:view','menu',0,0,0,0,2,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:51:37'),('_102_02_dashboard','_102_02','AlarmDashboard','','','noRedirect','menu.device.alarm.dashboard.title','#','device:alarm:dashboard:view','tab',0,0,0,0,10,'','','','','2026-09-04 13:11:21','2026-09-05 02:04:40'),('_102_02_list','_102_02','AlarmList','','','noRedirect','menu.device.alarm.list.title','#','device:alarm:list:view','tab',0,0,0,0,20,'','','','','2026-09-04 13:11:21','2026-09-05 02:04:40'),('_102_02_list_detail','_102_02_list','AlarmDetail','','','noRedirect','menu.device.alarm.detail','#','device:alarm:detail','button',0,0,0,0,5,'','','','','2026-09-04 13:11:21','2026-09-05 02:04:40'),('_102_02_list_export','_102_02_list','AlarmExport','','','noRedirect','menu.device.alarm.export','#','device:alarm:export','button',0,0,0,0,3,'','','','','2026-09-04 13:11:21','2026-09-05 02:04:40'),('_102_02_list_handle','_102_02_list','AlarmHandle','','','noRedirect','menu.device.alarm.handle','#','device:alarm:handle','button',0,0,0,0,6,'','','','','2026-09-04 13:11:21','2026-09-05 02:04:40'),('_102_02_list_refresh','_102_02_list','AlarmRefresh','','','noRedirect','menu.device.alarm.refresh','#','device:alarm:refresh','button',0,0,0,0,4,'','','','','2026-09-04 13:11:21','2026-09-05 02:04:40'),('_102_02_list_reset','_102_02_list','AlarmReset','','','noRedirect','menu.device.alarm.reset','#','device:alarm:reset','button',0,0,0,0,2,'','','','','2026-09-04 13:11:21','2026-09-05 02:04:40'),('_102_02_list_search','_102_02_list','AlarmSearch','','','noRedirect','menu.device.alarm.search','#','device:alarm:search','button',0,0,0,0,1,'','','','','2026-09-04 13:11:21','2026-09-05 02:04:40'),('_102_03','_102','PartLife','part','device/part/index','noRedirect','menu.device.part.default','#','device:part:view','menu',0,0,0,0,3,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:51:37'),('_102_03_add','_102_03_life','PartAdd','','','noRedirect','menu.device.part.add','#','device:part:add','button',0,0,0,0,2,'','','','','2026-09-04 11:16:35','2026-09-05 02:04:40'),('_102_03_delete','_102_03_life','PartDelete','','','noRedirect','menu.device.part.delete','#','device:part:delete','button',0,0,0,0,6,'','','','','2026-09-04 11:16:35','2026-09-05 02:04:40'),('_102_03_edit','_102_03_life','PartEdit','','','noRedirect','menu.device.part.edit','#','device:part:edit','button',0,0,0,0,4,'','','','','2026-09-04 11:16:35','2026-09-05 02:04:40'),('_102_03_life','_102_03','PartLife','life',NULL,'noRedirect','menu.device.part.tab.life','#','device:part:life:view','tab',0,0,0,0,5,NULL,NULL,NULL,NULL,'2026-09-04 19:00:19','2026-09-05 02:04:40'),('_102_03_operate','_102_03_life','PartOperate','','','noRedirect','menu.device.part.operate','#','device:part:operate','button',0,0,0,0,5,'','','','','2026-09-04 11:16:35','2026-09-05 02:04:40'),('_102_03_refresh','_102_03_life','PartRefresh','','','noRedirect','menu.device.part.refresh','#','device:part:refresh','button',0,0,0,0,3,'','','','','2026-09-04 11:16:35','2026-09-05 02:04:40'),('_102_03_search','_102_03_life','PartSearch','','','noRedirect','menu.device.part.search','#','device:part:search','button',0,0,0,0,1,'','','','','2026-09-04 11:16:35','2026-09-05 02:04:40'),('_102_03_template','_102_03','PartTemplate','template',NULL,'noRedirect','menu.device.part.tab.template','#','device:part:template:view','tab',0,1,0,0,10,NULL,NULL,NULL,NULL,'2026-09-04 18:25:13','2026-09-05 02:04:40'),('_102_03_template_add','_102_03_template','PartTemplateAdd','',NULL,'noRedirect','新增模板','#','device:part:template:add','button',0,0,0,0,2,NULL,NULL,NULL,NULL,'2026-09-04 18:25:13','2026-09-05 02:04:40'),('_102_03_template_delete','_102_03_template','PartTemplateDelete','',NULL,'noRedirect','删除模板','#','device:part:template:delete','button',0,0,0,0,4,NULL,NULL,NULL,NULL,'2026-09-04 18:25:13','2026-09-05 02:04:40'),('_102_03_template_edit','_102_03_template','PartTemplateEdit','',NULL,'noRedirect','编辑模板','#','device:part:template:edit','button',0,0,0,0,3,NULL,NULL,NULL,NULL,'2026-09-04 18:25:13','2026-09-05 02:04:40'),('_102_03_template_refresh','_102_03_template','PartTemplateRefresh','',NULL,'noRedirect','刷新','#','device:part:template:refresh','button',0,0,0,0,5,NULL,NULL,NULL,NULL,'2026-09-04 18:25:13','2026-09-05 02:04:40'),('_102_03_template_search','_102_03_template','PartTemplateSearch','',NULL,'noRedirect','搜索模板','#','device:part:template:search','button',0,0,0,0,1,NULL,NULL,NULL,NULL,'2026-09-04 18:25:13','2026-09-05 02:04:40'),('_103','','ProdMgmt','/production',NULL,'noRedirect','menu.production.default','ProdMgmt','production:view','menu',0,0,1,0,3,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:51:37'),('_103_01','_103','RecipeDB','recipe','production/recipe/index','noRedirect','menu.production.recipe.default','#','production:recipe:view','menu',0,0,0,0,1,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:51:37'),('_103_01_01','_103_01','download','','1','noRedirect','menu.production.recipe.download','#','production:recipe:download','button',0,0,0,0,1,NULL,NULL,NULL,NULL,'2026-08-30 17:34:13','2026-09-05 02:04:40'),('_103_02','_103','OrderLog','order','production/order/index','noRedirect','menu.production.order.default','#','production:order:view','menu',0,0,0,0,2,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:51:37'),('_103_02_comp','_103_02','OrderCompleted','','','noRedirect','menu.production.order.completed.title','#','production:order:completed:view','tab',0,0,0,0,10,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_comp_dl','_103_02_comp','OrderDl','','','noRedirect','menu.production.order.download','#','production:order:completed:download','button',0,0,0,0,3,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_comp_dlAll','_103_02_comp','OrderDlAll','','','noRedirect','menu.production.order.download','#','production:order:completed:downloadAll','button',0,0,0,0,2,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_comp_dlSel','_103_02_comp','OrderDlSelected','','','noRedirect','menu.production.order.download','#','production:order:completed:downloadSelected','button',0,0,0,0,1,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_plan','_103_02','OrderPlanned','','','noRedirect','menu.production.order.planned.title','#','production:order:planned:view','tab',0,0,0,0,30,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_plan_add','_103_02_plan','OrderAdd','','','noRedirect','menu.production.order.add','#','production:order:planned:add','button',0,0,0,0,1,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_plan_del','_103_02_plan','OrderDelete','','','noRedirect','menu.production.order.delete','#','production:order:planned:delete','button',0,0,0,0,5,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_plan_dlAll','_103_02_plan','OrderDlAll','','','noRedirect','menu.production.order.download','#','production:order:planned:downloadAll','button',0,0,0,0,3,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_plan_dlSel','_103_02_plan','OrderDlSelected','','','noRedirect','menu.production.order.download','#','production:order:planned:downloadSelected','button',0,0,0,0,2,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_plan_edit','_103_02_plan','OrderEdit','','','noRedirect','menu.production.order.edit','#','production:order:planned:edit','button',0,0,0,0,4,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_run','_103_02','OrderRunning','','','noRedirect','menu.production.order.running.title','#','production:order:running:view','tab',0,0,0,0,20,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_run_dl','_103_02_run','OrderDl','','','noRedirect','menu.production.order.download','#','production:order:running:download','button',0,0,0,0,3,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_run_dlAll','_103_02_run','OrderDlAll','','','noRedirect','menu.production.order.download','#','production:order:running:downloadAll','button',0,0,0,0,2,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_103_02_run_dlSel','_103_02_run','OrderDlSelected','','','noRedirect','menu.production.order.download','#','production:order:running:downloadSelected','button',0,0,0,0,1,'','','','','2026-09-04 13:12:38','2026-09-05 02:04:40'),('_104','','SysSetup','/system',NULL,'/system/config','menu.system.default','SysSetup','system:view','menu',0,0,1,0,4,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:51:37'),('_104_04','_104','SystemUser','user','system/user/index','noRedirect','menu.system.user.default','#','system:user:view','menu',0,0,0,0,4,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:50:52'),('_104_05','_104','AuditLog','audit','system/audit/index','noRedirect','menu.system.audit.default','#','system:audit:view','menu',0,0,0,0,5,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:50:52'),('_104_06','_104','ConfData','config','system/config/index','noRedirect','menu.system.config.default','#','system:config:view','menu',0,0,0,0,6,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:50:52'),('_104_06_02','_104_06','EmailLog','emailLog','','noRedirect','menu.system.config.childrenMenu.emailLog.title','#','system:config:emailLog:view','tab',0,0,0,0,90,NULL,NULL,NULL,NULL,'2026-09-01 15:29:29','2026-09-05 02:04:40'),('_104_06_02_btn1','_104_06_02','EmailLogExport','','','noRedirect','menu.system.config.childrenMenu.emailLog.exportBtn','#','system:config:emailLog:export','button',0,0,0,0,1,NULL,NULL,NULL,NULL,'2026-09-01 15:29:29','2026-09-05 02:04:40'),('_104_06_02_btn2','_104_06_02','EmailLogDelete','','','noRedirect','menu.system.config.childrenMenu.emailLog.deleteBtn','#','system:config:emailLog:delete','button',0,0,0,0,2,NULL,NULL,NULL,NULL,'2026-09-01 15:29:29','2026-09-05 02:04:40'),('_104_06_02_btn3','_104_06_02','EmailLogDetail','','','noRedirect','menu.system.config.childrenMenu.emailLog.viewDetail','#','system:config:emailLog:detail','button',0,0,0,0,3,'','','','','2026-09-04 10:36:58','2026-09-05 02:04:40'),('_104_06_btn_reset','_104_06','ConfigReset','','','noRedirect','menu.system.config.childrenMenu.reset','#','system:config.reset','button',0,1,0,0,2,NULL,NULL,NULL,NULL,'2026-09-03 22:03:35','2026-09-05 02:04:40'),('_104_06_btn1','_104_06','ConfigSave','',NULL,'noRedirect','menu.system.config.childrenMenu.save','#','system:config:edit','button',0,1,0,0,1,'/api/system/config/edit','PUT',NULL,NULL,'2026-08-28 11:19:43','2026-09-03 14:04:43'),('_104_06_device','_104_06','DeviceConfig','device','','noRedirect','menu.system.config.childrenMenu.device.title','#','system:config:device:view','tab',0,0,0,0,60,NULL,NULL,NULL,NULL,'2026-09-03 19:57:11','2026-09-05 02:04:40'),('_104_06_export','_104_06','ExportConfig','export','','noRedirect','menu.system.config.childrenMenu.export.title','#','system:config:export:view','tab',0,0,0,0,40,NULL,NULL,NULL,NULL,'2026-09-03 19:57:11','2026-09-05 02:04:40'),('_104_06_license','_104_06','LicenseConfig','license','','noRedirect','menu.system.config.childrenMenu.license.manageTitle','#','system:config:license:view','tab',0,0,0,0,100,NULL,NULL,NULL,NULL,'2026-09-03 19:58:27','2026-09-05 02:04:40'),('_104_06_license_btn1','_104_06_license','LicenseRefresh','','','noRedirect','menu.system.config.childrenMenu.license.refresh','#','system:config:license:refresh','button',0,1,0,0,10,NULL,NULL,NULL,NULL,'2026-09-03 22:14:52','2026-09-05 02:04:40'),('_104_06_license_btn2','_104_06_license','LicenseImport','','','noRedirect','menu.system.config.childrenMenu.license.importLicense','#','system:config:license:import','button',0,1,0,0,20,NULL,NULL,NULL,NULL,'2026-09-03 22:14:52','2026-09-05 02:04:40'),('_104_06_license_btn3','_104_06_license','LicenseDownload','','','noRedirect','menu.system.config.childrenMenu.license.download','#','system:config:license:download','button',0,1,0,0,30,NULL,NULL,NULL,NULL,'2026-09-03 22:14:52','2026-09-05 02:04:40'),('_104_06_licenseSetting','_104_06','LicenseSetting','licenseSetting',NULL,'noRedirect','menu.system.config.childrenMenu.licenseSetting.title','#','system:config:licenseSetting:view','tab',0,0,0,0,97,NULL,NULL,NULL,NULL,'2026-09-05 16:27:28','2026-09-05 08:27:28'),('_104_06_licenseSetting_param1','_104_06_licenseSetting','ParamLicenseExpiringDaysView','',NULL,'noRedirect','menu.system.config.childrenMenu.licenseSetting.expiringDays','#','system:config:param:licenseExpiringDays:view','param',0,0,0,0,1,NULL,NULL,NULL,NULL,'2026-09-05 16:34:58','2026-09-05 08:34:58'),('_104_06_licenseSetting_param2','_104_06_licenseSetting','ParamLicenseExpiringDaysEdit','',NULL,'noRedirect','menu.system.config.childrenMenu.licenseSetting.expiringDays','#','system:config:param:licenseExpiringDays:edit','param',0,0,0,0,2,NULL,NULL,NULL,NULL,'2026-09-05 16:34:58','2026-09-05 08:34:58'),('_104_06_licenseSetting_param3','_104_06_licenseSetting','ParamLicenseGracePeriodView','',NULL,'noRedirect','menu.system.config.childrenMenu.licenseSetting.gracePeriod','#','system:config:param:licenseGracePeriod:view','param',0,0,0,0,3,NULL,NULL,NULL,NULL,'2026-09-05 16:34:58','2026-09-05 08:34:58'),('_104_06_licenseSetting_param4','_104_06_licenseSetting','ParamLicenseGracePeriodEdit','',NULL,'noRedirect','menu.system.config.childrenMenu.licenseSetting.gracePeriod','#','system:config:param:licenseGracePeriod:edit','param',0,0,0,0,4,NULL,NULL,NULL,NULL,'2026-09-05 16:34:58','2026-09-05 08:34:58'),('_104_06_licenseSetting_param5','_104_06_licenseSetting','ParamLicenseCheckIntervalView','',NULL,'noRedirect','menu.system.config.childrenMenu.licenseSetting.checkInterval','#','system:config:param:licenseCheckInterval:view','param',0,0,0,0,5,NULL,NULL,NULL,NULL,'2026-09-05 16:34:58','2026-09-05 08:34:58'),('_104_06_licenseSetting_param6','_104_06_licenseSetting','ParamLicenseCheckIntervalEdit','',NULL,'noRedirect','menu.system.config.childrenMenu.licenseSetting.checkInterval','#','system:config:param:licenseCheckInterval:edit','param',0,0,0,0,6,NULL,NULL,NULL,NULL,'2026-09-05 16:34:58','2026-09-05 08:34:58'),('_104_06_notification','_104_06','NotificationConfig','notification',NULL,'noRedirect','menu.system.config.childrenMenu.notification.title','#','system:config:notification:view','tab',0,0,0,0,92,NULL,NULL,NULL,NULL,'2026-09-05 16:21:55','2026-09-05 08:22:15'),('_104_06_notification_param1','_104_06_notification','ParamNotificationAutoReadDaysView','',NULL,'noRedirect','menu.system.config.childrenMenu.notification.autoReadDays','#','system:config:param:notificationAutoReadDays:view','param',0,0,0,0,1,NULL,NULL,NULL,NULL,'2026-09-05 16:34:07','2026-09-05 08:34:07'),('_104_06_notification_param2','_104_06_notification','ParamNotificationAutoReadDaysEdit','',NULL,'noRedirect','menu.system.config.childrenMenu.notification.autoReadDays','#','system:config:param:notificationAutoReadDays:edit','param',0,0,0,0,2,NULL,NULL,NULL,NULL,'2026-09-05 16:34:07','2026-09-05 08:34:07'),('_104_06_notification_param3','_104_06_notification','ParamNotificationSoundEnabledView','',NULL,'noRedirect','menu.system.config.childrenMenu.notification.soundEnabled','#','system:config:param:notificationSoundEnabled:view','param',0,0,0,0,3,NULL,NULL,NULL,NULL,'2026-09-05 16:34:07','2026-09-05 08:34:07'),('_104_06_notification_param4','_104_06_notification','ParamNotificationSoundEnabledEdit','',NULL,'noRedirect','menu.system.config.childrenMenu.notification.soundEnabled','#','system:config:param:notificationSoundEnabled:edit','param',0,0,0,0,4,NULL,NULL,NULL,NULL,'2026-09-05 16:34:07','2026-09-05 08:34:07'),('_104_06_order','_104_06','OrderConfig','order','','noRedirect','menu.system.config.childrenMenu.order.title','#','system:config:order:view','tab',0,0,0,0,95,NULL,NULL,NULL,NULL,'2026-09-03 19:57:11','2026-09-05 08:21:55'),('_104_06_param1','_104_06_system','ParamSessionTimeoutView','',NULL,'noRedirect','menu.system.config.param.sessionTimeout.view','#','system:config:param:sessionTimeout:view','param',0,1,0,0,1,NULL,NULL,'sessionTimeout','view','2026-08-28 11:20:06','2026-09-03 14:03:35'),('_104_06_param10','_104_06_security','ParamWatermarkTextEdit','',NULL,'noRedirect','menu.system.config.param.watermarkText.edit','#','system:config:param:watermarkText:edit','param',0,1,0,0,10,NULL,NULL,'watermarkText','edit','2026-08-28 11:20:08','2026-09-03 11:58:59'),('_104_06_param15','_104_06_security','ParamLoginFailedThresholdView','','','noRedirect','menu.system.config.childrenMenu.security.loginFailedThreshold','#','system:config:param:loginFailedThreshold:view','param',0,1,0,0,160,NULL,NULL,'loginFailedThreshold','view','2026-09-03 22:05:29','2026-09-05 02:04:40'),('_104_06_param16','_104_06_security','ParamLoginFailedThresholdEdit','','','noRedirect','menu.system.config.childrenMenu.security.loginFailedThreshold','#','system:config:param:loginFailedThreshold:edit','param',0,1,0,0,170,NULL,NULL,'loginFailedThreshold','edit','2026-09-03 22:05:29','2026-09-05 02:04:40'),('_104_06_param17','_104_06_security','ParamLockDurationMinutesView','','','noRedirect','menu.system.config.childrenMenu.security.lockDurationMinutes','','system:config:param:lockDurationMinutes:view','param',0,1,0,0,180,NULL,NULL,'lockDurationMinutes','view','2026-09-03 22:05:29','2026-09-03 14:05:29'),('_104_06_param18','_104_06_security','ParamLockDurationMinutesEdit','','','noRedirect','menu.system.config.childrenMenu.security.lockDurationMinutes','','system:config:param:lockDurationMinutes:edit','param',0,1,0,0,190,NULL,NULL,'lockDurationMinutes','edit','2026-09-03 22:05:29','2026-09-03 14:05:29'),('_104_06_param2','_104_06_system','ParamSessionTimeoutEdit','',NULL,'noRedirect','menu.system.config.param.sessionTimeout.edit','#','system:config:param:sessionTimeout:edit','param',0,1,0,0,2,NULL,NULL,'sessionTimeout','edit','2026-08-28 11:20:06','2026-09-03 14:03:35'),('_104_06_param27','_104_06_export','ParamPdfWatermarkEnabledView','','','noRedirect','menu.system.config.childrenMenu.export.pdfWatermarkEnabled','','system:config:param:pdfWatermarkEnabled:view','param',0,1,0,0,280,NULL,NULL,'pdfWatermarkEnabled','view','2026-09-03 22:11:27','2026-09-03 14:11:27'),('_104_06_param28','_104_06_export','ParamPdfWatermarkEnabledEdit','','','noRedirect','menu.system.config.childrenMenu.export.pdfWatermarkEnabled','','system:config:param:pdfWatermarkEnabled:edit','param',0,1,0,0,290,NULL,NULL,'pdfWatermarkEnabled','edit','2026-09-03 22:11:27','2026-09-03 14:11:27'),('_104_06_param29','_104_06_export','ParamPdfWatermarkTextView','','','noRedirect','menu.system.config.childrenMenu.export.pdfWatermarkText','','system:config:param:pdfWatermarkText:view','param',0,1,0,0,300,NULL,NULL,'pdfWatermarkText','view','2026-09-03 22:11:27','2026-09-03 14:11:27'),('_104_06_param3','_104_06_system','ParamDefaultPageSizeView','',NULL,'noRedirect','menu.system.config.param.defaultPageSize.view','#','system:config:param:defaultPageSize:view','param',0,1,0,0,3,NULL,NULL,'defaultPageSize','view','2026-08-28 11:20:06','2026-09-03 11:58:59'),('_104_06_param30','_104_06_export','ParamPdfWatermarkTextEdit','','','noRedirect','menu.system.config.childrenMenu.export.pdfWatermarkText','','system:config:param:pdfWatermarkText:edit','param',0,1,0,0,310,NULL,NULL,'pdfWatermarkText','edit','2026-09-03 22:11:27','2026-09-03 14:11:27'),('_104_06_param4','_104_06_system','ParamDefaultPageSizeEdit','',NULL,'noRedirect','menu.system.config.param.defaultPageSize.edit','#','system:config:param:defaultPageSize:edit','param',0,1,0,0,4,NULL,NULL,'defaultPageSize','edit','2026-08-28 11:20:06','2026-09-03 11:58:59'),('_104_06_param41','_104_06_device','ParamDeviceNameView','','','noRedirect','menu.system.config.childrenMenu.device.deviceName','','system:config:param:deviceName:view','param',0,1,0,0,10,NULL,NULL,'deviceName','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param42','_104_06_device','ParamDeviceNameEdit','','','noRedirect','menu.system.config.childrenMenu.device.deviceName','','system:config:param:deviceName:edit','param',0,1,0,0,11,NULL,NULL,'deviceName','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param43','_104_06_device','ParamDeviceCodeView','','','noRedirect','menu.system.config.childrenMenu.device.deviceCode','','system:config:param:deviceCode:view','param',0,1,0,0,20,NULL,NULL,'deviceCode','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param44','_104_06_device','ParamDeviceCodeEdit','','','noRedirect','menu.system.config.childrenMenu.device.deviceCode','','system:config:param:deviceCode:edit','param',0,1,0,0,21,NULL,NULL,'deviceCode','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param45','_104_06_device','ParamDeviceRegionView','','','noRedirect','menu.system.config.childrenMenu.device.deviceRegion','','system:config:param:deviceRegion:view','param',0,1,0,0,30,NULL,NULL,'deviceRegion','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param46','_104_06_device','ParamDeviceRegionEdit','','','noRedirect','menu.system.config.childrenMenu.device.deviceRegion','','system:config:param:deviceRegion:edit','param',0,1,0,0,31,NULL,NULL,'deviceRegion','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param47','_104_06_device','ParamDeviceInstallDateView','','','noRedirect','menu.system.config.childrenMenu.device.deviceInstallDate','','system:config:param:deviceInstallDate:view','param',0,1,0,0,40,NULL,NULL,'deviceInstallDate','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param48','_104_06_device','ParamDeviceInstallDateEdit','','','noRedirect','menu.system.config.childrenMenu.device.deviceInstallDate','','system:config:param:deviceInstallDate:edit','param',0,1,0,0,41,NULL,NULL,'deviceInstallDate','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param49','_104_06_device','ParamPartLifeReminderEnabledView','','','noRedirect','menu.system.config.childrenMenu.device.partLifeReminderEnabled','','system:config:param:partLifeReminderEnabled:view','param',0,1,0,0,50,NULL,NULL,'partLifeReminderEnabled','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param5','_104_06_system','ParamDefaultLanguageView','',NULL,'noRedirect','menu.system.config.param.defaultLanguage.view','#','system:config:param:defaultLanguage:view','param',0,1,0,0,5,NULL,NULL,'defaultLanguage','view','2026-08-28 11:20:06','2026-09-03 11:58:59'),('_104_06_param50','_104_06_device','ParamPartLifeReminderEnabledEdit','','','noRedirect','menu.system.config.childrenMenu.device.partLifeReminderEnabled','','system:config:param:partLifeReminderEnabled:edit','param',0,1,0,0,51,NULL,NULL,'partLifeReminderEnabled','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param51','_104_06_device','ParamPartLifeThresholdView','','','noRedirect','menu.system.config.childrenMenu.device.partLifeThreshold','','system:config:param:partLifeThreshold:view','param',0,1,0,0,60,NULL,NULL,'partLifeThreshold','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param52','_104_06_device','ParamPartLifeThresholdEdit','','','noRedirect','menu.system.config.childrenMenu.device.partLifeThreshold','','system:config:param:partLifeThreshold:edit','param',0,1,0,0,61,NULL,NULL,'partLifeThreshold','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param53','_104_06_device','ParamPartLifeRemindIntervalView','','','noRedirect','menu.system.config.childrenMenu.device.partLifeRemindInterval','','system:config:param:partLifeRemindInterval:view','param',0,1,0,0,70,NULL,NULL,'partLifeRemindInterval','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param54','_104_06_device','ParamPartLifeRemindIntervalEdit','','','noRedirect','menu.system.config.childrenMenu.device.partLifeRemindInterval','','system:config:param:partLifeRemindInterval:edit','param',0,1,0,0,71,NULL,NULL,'partLifeRemindInterval','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param55','_104_06_device','ParamPartLifeSnoozeIntervalView','','','noRedirect','menu.system.config.childrenMenu.device.snoozeInterval','','system:config:param:partLifeSnoozeInterval:view','param',0,1,0,0,80,NULL,NULL,'partLifeSnoozeInterval','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param56','_104_06_device','ParamPartLifeSnoozeIntervalEdit','','','noRedirect','menu.system.config.childrenMenu.device.snoozeInterval','','system:config:param:partLifeSnoozeInterval:edit','param',0,1,0,0,81,NULL,NULL,'partLifeSnoozeInterval','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param57','_104_06_order','ParamAllowNoOrderProductionView','','','noRedirect','menu.system.config.childrenMenu.order.allowNoOrderProduction','','system:config:param:allowNoOrderProduction:view','param',0,1,0,0,10,NULL,NULL,'allowNoOrderProduction','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param58','_104_06_order','ParamAllowNoOrderProductionEdit','','','noRedirect','menu.system.config.childrenMenu.order.allowNoOrderProduction','','system:config:param:allowNoOrderProduction:edit','param',0,1,0,0,11,NULL,NULL,'allowNoOrderProduction','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param59','_104_06_order','ParamNoOrderProductionHighlightView','','','noRedirect','menu.system.config.childrenMenu.order.noOrderProductionHighlight','','system:config:param:noOrderProductionHighlight:view','param',0,1,0,0,20,NULL,NULL,'noOrderProductionHighlight','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param6','_104_06_system','ParamDefaultLanguageEdit','',NULL,'noRedirect','menu.system.config.param.defaultLanguage.edit','#','system:config:param:defaultLanguage:edit','param',0,1,0,0,6,NULL,NULL,'defaultLanguage','edit','2026-08-28 11:20:06','2026-09-03 11:58:59'),('_104_06_param60','_104_06_order','ParamNoOrderProductionHighlightEdit','','','noRedirect','menu.system.config.childrenMenu.order.noOrderProductionHighlight','','system:config:param:noOrderProductionHighlight:edit','param',0,1,0,0,21,NULL,NULL,'noOrderProductionHighlight','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param61','_104_06_order','ParamOrderSwitchConfirmView','','','noRedirect','menu.system.config.childrenMenu.order.orderSwitchConfirm','','system:config:param:orderSwitchConfirm:view','param',0,1,0,0,30,NULL,NULL,'orderSwitchConfirm','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param62','_104_06_order','ParamOrderSwitchConfirmEdit','','','noRedirect','menu.system.config.childrenMenu.order.orderSwitchConfirm','','system:config:param:orderSwitchConfirm:edit','param',0,1,0,0,31,NULL,NULL,'orderSwitchConfirm','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param63','_104_06_order','ParamAutoArchiveCompletedView','','','noRedirect','menu.system.config.childrenMenu.order.autoArchiveCompleted','','system:config:param:autoArchiveCompleted:view','param',0,1,0,0,40,NULL,NULL,'autoArchiveCompleted','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param64','_104_06_order','ParamAutoArchiveCompletedEdit','','','noRedirect','menu.system.config.childrenMenu.order.autoArchiveCompleted','','system:config:param:autoArchiveCompleted:edit','param',0,1,0,0,41,NULL,NULL,'autoArchiveCompleted','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param65','_104_06_order','ParamShowOperatorNameView','','','noRedirect','menu.system.config.childrenMenu.order.showOperatorName','','system:config:param:showOperatorName:view','param',0,1,0,0,50,NULL,NULL,'showOperatorName','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param66','_104_06_order','ParamShowOperatorNameEdit','','','noRedirect','menu.system.config.childrenMenu.order.showOperatorName','','system:config:param:showOperatorName:edit','param',0,1,0,0,51,NULL,NULL,'showOperatorName','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param67','_104_06_order','ParamShowAlarmCountView','','','noRedirect','menu.system.config.childrenMenu.order.showAlarmCount','','system:config:param:showAlarmCount:view','param',0,1,0,0,60,NULL,NULL,'showAlarmCount','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param68','_104_06_order','ParamShowAlarmCountEdit','','','noRedirect','menu.system.config.childrenMenu.order.showAlarmCount','','system:config:param:showAlarmCount:edit','param',0,1,0,0,61,NULL,NULL,'showAlarmCount','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param69','_104_06_order','ParamShowRuntimeView','','','noRedirect','menu.system.config.childrenMenu.order.showRuntime','','system:config:param:showRuntime:view','param',0,1,0,0,70,NULL,NULL,'showRuntime','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param7','_104_06_security','ParamWatermarkEnabledView','',NULL,'noRedirect','menu.system.config.param.watermarkEnabled.view','#','system:config:param:watermarkEnabled:view','param',0,1,0,0,7,NULL,NULL,'watermarkEnabled','view','2026-08-28 11:20:08','2026-09-03 11:58:59'),('_104_06_param70','_104_06_order','ParamShowRuntimeEdit','','','noRedirect','menu.system.config.childrenMenu.order.showRuntime','','system:config:param:showRuntime:edit','param',0,1,0,0,71,NULL,NULL,'showRuntime','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param71','_104_06_order','ParamReportIncludeAlarmDetailView','','','noRedirect','menu.system.config.childrenMenu.order.reportIncludeAlarmDetail','','system:config:param:reportIncludeAlarmDetail:view','param',0,1,0,0,80,NULL,NULL,'reportIncludeAlarmDetail','view','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param72','_104_06_order','ParamReportIncludeAlarmDetailEdit','','','noRedirect','menu.system.config.childrenMenu.order.reportIncludeAlarmDetail','','system:config:param:reportIncludeAlarmDetail:edit','param',0,1,0,0,81,NULL,NULL,'reportIncludeAlarmDetail','edit','2026-09-03 22:14:52','2026-09-03 14:14:52'),('_104_06_param73','_104_06_order','ParamreportIncludeOperatorDetailView','','','noRedirect','menu.system.config.childrenMenu.order.reportIncludeOperatorDetail','#','system:config:param:reportIncludeOperatorDetail:view','param',0,0,0,0,91,'','','reportIncludeOperatorDetail','view','2026-09-04 10:36:58','2026-09-05 02:03:15'),('_104_06_param74','_104_06_order','ParamreportIncludeOperatorDetailEdit','','','noRedirect','menu.system.config.childrenMenu.order.reportIncludeOperatorDetail','#','system:config:param:reportIncludeOperatorDetail:edit','param',0,0,0,0,92,'','','reportIncludeOperatorDetail','edit','2026-09-04 10:36:58','2026-09-05 02:03:15'),('_104_06_param75','_104_06_order','ParamreportIncludeDownloadCountView','','','noRedirect','menu.system.config.childrenMenu.order.reportIncludeDownloadCount','#','system:config:param:reportIncludeDownloadCount:view','param',0,0,0,0,101,'','','reportIncludeDownloadCount','view','2026-09-04 10:36:58','2026-09-05 02:03:15'),('_104_06_param76','_104_06_order','ParamreportIncludeDownloadCountEdit','','','noRedirect','menu.system.config.childrenMenu.order.reportIncludeDownloadCount','#','system:config:param:reportIncludeDownloadCount:edit','param',0,0,0,0,102,'','','reportIncludeDownloadCount','edit','2026-09-04 10:36:58','2026-09-05 02:03:15'),('_104_06_param77','_104_06_order','ParamallowRunningOrderDownloadView','','','noRedirect','menu.system.config.childrenMenu.order.allowRunningOrderDownload','#','system:config:param:allowRunningOrderDownload:view','param',0,0,0,0,111,'','','allowRunningOrderDownload','view','2026-09-04 10:36:58','2026-09-05 02:03:15'),('_104_06_param78','_104_06_order','ParamallowRunningOrderDownloadEdit','','','noRedirect','menu.system.config.childrenMenu.order.allowRunningOrderDownload','#','system:config:param:allowRunningOrderDownload:edit','param',0,0,0,0,112,'','','allowRunningOrderDownload','edit','2026-09-04 10:36:58','2026-09-05 02:03:15'),('_104_06_param8','_104_06_security','ParamWatermarkEnabledEdit','',NULL,'noRedirect','menu.system.config.param.watermarkEnabled.edit','#','system:config:param:watermarkEnabled:edit','param',0,1,0,0,8,NULL,NULL,'watermarkEnabled','edit','2026-08-28 11:20:08','2026-09-03 11:58:59'),('_104_06_param9','_104_06_security','ParamWatermarkTextView','',NULL,'noRedirect','menu.system.config.param.watermarkText.view','#','system:config:param:watermarkText:view','param',0,1,0,0,9,NULL,NULL,'watermarkText','view','2026-08-28 11:20:08','2026-09-03 11:58:59'),('_104_06_security','_104_06','SecurityConfig','security','','noRedirect','menu.system.config.childrenMenu.security.title','#','system:config:security:view','tab',0,0,0,0,20,NULL,NULL,NULL,NULL,'2026-09-03 19:57:11','2026-09-05 02:03:15'),('_104_06_system','_104_06','SystemConfig','system','','noRedirect','menu.system.config.childrenMenu.system.title','#','system:config:system:view','tab',0,0,0,0,10,NULL,NULL,NULL,NULL,'2026-09-03 19:57:11','2026-09-05 02:03:15'),('_104_06_system_dateFormat_edit','_104_06_system','ParamDateFormatEdit','','','noRedirect','menu.system.config.childrenMenu.system.dateFormat','#','system:config:param:dateFormat:edit','param',0,1,0,0,31,NULL,NULL,'dateFormat','edit','2026-09-03 22:03:35','2026-09-05 02:03:15'),('_104_06_system_dateFormat_view','_104_06_system','ParamDateFormatView','','','noRedirect','menu.system.config.childrenMenu.system.dateFormat','#','system:config:param:dateFormat:view','param',0,1,0,0,30,NULL,NULL,'dateFormat','view','2026-09-03 22:03:35','2026-09-05 02:03:15'),('_104_07','_104','AuthMgmt','permission','system/permission/index','noRedirect','menu.system.permission.default','#','system:permission:view','menu',0,0,0,0,7,NULL,NULL,NULL,NULL,'2026-08-28 11:18:45','2026-08-30 10:50:52'),('_104_08','_104','DeviceMgmt','device','system/device/index','noRedirect','menu.system.device.default','#','system:device:view','menu',0,0,0,0,8,NULL,NULL,NULL,NULL,'2026-08-28 17:21:01','2026-08-30 10:50:52'),('_104_08_01','_104_08','DeviceKick','',NULL,'noRedirect','menu.system.device.kick','#','system:device:kick','button',0,1,0,0,1,'/prod-api/v2/user/device/:id/kick','POST',NULL,NULL,'2026-08-28 17:21:02','2026-08-28 09:21:02'),('_104_08_02','_104_08','DeviceDelete','',NULL,'noRedirect','menu.system.device.delete','#','system:device:delete','button',0,1,0,0,2,'/prod-api/v2/user/device/:id','DELETE',NULL,NULL,'2026-08-29 14:20:16','2026-08-30 10:53:19'),('_105','','SuperPanel','/super-panel',NULL,'/super-panel/dict','menu.superPanel.default','SuperPanel','super:panel:view','menu',1,0,1,0,5,NULL,NULL,NULL,NULL,'2026-09-05 09:16:16','2026-09-05 02:33:34'),('_105_01','_105','SuperDict','dict','super-panel/dict/index',NULL,'menu.superPanel.dict.default','#','super:dict:view','menu',1,0,0,0,1,NULL,NULL,NULL,NULL,'2026-09-05 09:16:16','2026-09-05 03:06:46'),('_105_02','_105','SuperDept','dept','super-panel/dept/index',NULL,'menu.superPanel.dept.default','#','super:dept:view','menu',1,0,0,0,2,NULL,NULL,NULL,NULL,'2026-09-05 09:16:16','2026-09-05 03:06:46'),('_105_03','_105','SuperRole','role','super-panel/role/index',NULL,'menu.superPanel.role.default','#','super:role:view','menu',1,0,0,0,3,NULL,NULL,NULL,NULL,'2026-09-05 09:16:16','2026-09-05 03:06:46'),('_105_04','_105','SuperConfig','config','super-panel/config/index','noRedirect','menu.superPanel.config.default','#','super:config:view','menu',1,0,0,0,4,NULL,NULL,NULL,NULL,'2026-09-05 10:41:44','2026-09-05 03:06:46'),('_105_05','_105','SuperPermission','permission','super-panel/permission/index','noRedirect','menu.superPanel.permission.default','#','super:permission:view','menu',1,0,0,0,5,NULL,NULL,NULL,NULL,'2026-09-05 11:50:28','2026-09-05 03:50:28'),('_105_06','_105','SuperFeature','feature','super-panel/feature/index',NULL,'menu.superPanel.feature.default','#','super-panel:feature:view','menu',1,0,0,0,6,NULL,NULL,NULL,NULL,'2026-09-05 15:05:59','2026-09-05 07:28:03'),('_105_07','_105','SuperDatabase','database','super-panel/database/index','noRedirect','menu.superPanel.database.default','#',NULL,'menu',1,0,0,0,7,NULL,NULL,NULL,NULL,'2026-09-05 16:55:07','2026-09-05 08:55:07');
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
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `title_key` varchar(100) DEFAULT '' COMMENT '标题国际化key',
  `title_params` text COMMENT '标题国际化参数（JSON）',
  `content_key` varchar(100) DEFAULT '' COMMENT '内容国际化key',
  `content_params` text COMMENT '内容国际化参数（JSON）',
  `type` varchar(50) DEFAULT 'system' COMMENT '通知类型 system/plc/user/audit',
  `priority` varchar(20) DEFAULT 'normal' COMMENT '优先级 high/normal/low',
  `link` varchar(500) DEFAULT '' COMMENT '跳转链接',
  `is_read` tinyint DEFAULT '0' COMMENT '是否已读 1是 0否',
  `read_time` datetime DEFAULT NULL COMMENT '阅读时间',
  `is_archived` tinyint DEFAULT '0' COMMENT '是否已归档：1是 0否',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_read` (`is_read`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=1337 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='通知表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_notification`
--

LOCK TABLES `nex_notification` WRITE;
/*!40000 ALTER TABLE `nex_notification` DISABLE KEYS */;
INSERT INTO `nex_notification` VALUES (1324,9,NULL,NULL,'notification.config.securityUpdate.title','{\"username\":\"buqiangqiang\",\"count\":1,\"configKeys\":\"watermarkEnabled\"}','notification.config.securityUpdate.content','{\"username\":\"buqiangqiang\",\"count\":1,\"configKeys\":\"watermarkEnabled\"}','system','high','',1,'2026-09-05 13:19:07',0,'2026-09-05 13:19:00'),(1325,10,NULL,NULL,'notification.config.securityUpdate.title','{\"username\":\"buqiangqiang\",\"count\":1,\"configKeys\":\"watermarkEnabled\"}','notification.config.securityUpdate.content','{\"username\":\"buqiangqiang\",\"count\":1,\"configKeys\":\"watermarkEnabled\"}','system','high','',0,NULL,0,'2026-09-05 13:19:00'),(1326,9,NULL,NULL,'notification.config.securityUpdate.title','{\"username\":\"buqiangqiang\",\"count\":1,\"configKeys\":\"watermarkEnabled\"}','notification.config.securityUpdate.content','{\"username\":\"buqiangqiang\",\"count\":1,\"configKeys\":\"watermarkEnabled\"}','system','high','',1,'2026-09-05 13:19:07',0,'2026-09-05 13:19:04'),(1327,10,NULL,NULL,'notification.config.securityUpdate.title','{\"username\":\"buqiangqiang\",\"count\":1,\"configKeys\":\"watermarkEnabled\"}','notification.config.securityUpdate.content','{\"username\":\"buqiangqiang\",\"count\":1,\"configKeys\":\"watermarkEnabled\"}','system','high','',0,NULL,0,'2026-09-05 13:19:04'),(1328,9,NULL,NULL,'notification.audit.logView.title','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','notification.audit.logView.content','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','audit','low','',1,'2026-09-05 13:21:07',0,'2026-09-05 13:19:29'),(1329,10,NULL,NULL,'notification.audit.logView.title','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','notification.audit.logView.content','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','audit','low','',0,NULL,0,'2026-09-05 13:19:29'),(1330,9,NULL,NULL,'notification.audit.logView.title','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','notification.audit.logView.content','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','audit','low','',0,NULL,0,'2026-09-05 14:20:38'),(1331,10,NULL,NULL,'notification.audit.logView.title','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','notification.audit.logView.content','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','audit','low','',0,NULL,0,'2026-09-05 14:20:38'),(1332,9,NULL,NULL,'notification.audit.logView.title','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"en-US\\\"}\"}','notification.audit.logView.content','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"en-US\\\"}\"}','audit','low','',0,NULL,0,'2026-09-05 14:26:35'),(1333,10,NULL,NULL,'notification.audit.logView.title','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"en-US\\\"}\"}','notification.audit.logView.content','{\"username\":\"buqiangqiang\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"en-US\\\"}\"}','audit','low','',0,NULL,0,'2026-09-05 14:26:35'),(1334,9,NULL,NULL,'notification.audit.logView.title','{\"username\":\"liuguohui\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','notification.audit.logView.content','{\"username\":\"liuguohui\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','audit','low','',0,NULL,0,'2026-09-05 15:06:31'),(1335,10,NULL,NULL,'notification.audit.logView.title','{\"username\":\"liuguohui\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','notification.audit.logView.content','{\"username\":\"liuguohui\",\"query\":\"{\\\"page\\\":\\\"1\\\",\\\"pageSize\\\":\\\"20\\\",\\\"orderBy\\\":\\\"\\\",\\\"orderDir\\\":\\\"desc\\\",\\\"userName\\\":\\\"\\\",\\\"action\\\":\\\"\\\",\\\"target\\\":\\\"\\\",\\\"lang\\\":\\\"zh-CN\\\"}\"}','audit','low','',0,NULL,0,'2026-09-05 15:06:31'),(1336,1,NULL,NULL,'notification.kickedOutTitle','','notification.kickedOutContent','{\"time\":\"2026-09-05T07:23:34.325Z\",\"ip\":\"127.0.0.1\"}','security','high','',1,'2026-09-05 15:24:42',0,'2026-09-05 15:23:34');
/*!40000 ALTER TABLE `nex_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nex_notification_setting`
--

DROP TABLE IF EXISTS `nex_notification_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_notification_setting` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int NOT NULL COMMENT '用户ID',
  `settings` text COMMENT '通知设置（JSON格式）',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_notification_setting`
--

LOCK TABLES `nex_notification_setting` WRITE;
/*!40000 ALTER TABLE `nex_notification_setting` DISABLE KEYS */;
INSERT INTO `nex_notification_setting` VALUES (1,2,'{\"typeEnabled\":{\"system\":true,\"plc\":true,\"user\":true,\"audit\":true,\"device\":true,\"connection\":true},\"doNotDisturb\":{\"enabled\":false,\"startTime\":\"22:00\",\"endTime\":\"08:00\"},\"soundEnabled\":true,\"popupEnabled\":true}','2026-09-02 21:35:12','2026-09-02 21:35:12');
/*!40000 ALTER TABLE `nex_notification_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nex_password_reset_token`
--

DROP TABLE IF EXISTS `nex_password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_password_reset_token` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int NOT NULL COMMENT '用户ID',
  `username` varchar(64) NOT NULL COMMENT '用户名',
  `email` varchar(128) NOT NULL COMMENT '邮箱',
  `token` varchar(128) NOT NULL COMMENT '重置Token',
  `expires_at` datetime NOT NULL COMMENT '过期时间',
  `used` tinyint DEFAULT '0' COMMENT '是否已使用 0-未使用 1-已使用',
  `used_at` datetime DEFAULT NULL COMMENT '使用时间',
  `ip` varchar(64) DEFAULT '' COMMENT '请求IP',
  `user_agent` varchar(500) DEFAULT '' COMMENT '请求User-Agent',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_email` (`email`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='密码重置Token表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_password_reset_token`
--

LOCK TABLES `nex_password_reset_token` WRITE;
/*!40000 ALTER TABLE `nex_password_reset_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `nex_password_reset_token` ENABLE KEYS */;
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
  `role_name` varchar(100) NOT NULL COMMENT '角色名称',
  `description` varchar(500) DEFAULT NULL COMMENT '角色描述',
  `role_level` int NOT NULL DEFAULT '0' COMMENT '角色等级，数字越小等级越高',
  `is_super_admin` tinyint NOT NULL DEFAULT '0' COMMENT '是否为超级管理员：1是 0否',
  `is_builtin` tinyint NOT NULL DEFAULT '0' COMMENT '是否内置角色：1是(不可编辑删除) 0否',
  `is_hidden` tinyint NOT NULL DEFAULT '0' COMMENT '是否隐藏：0正常 1隐藏',
  `visible_role_levels` json DEFAULT NULL COMMENT '在权限配置中可见的角色等级列表',
  `status` tinyint DEFAULT '1' COMMENT '状态 1启用 0禁用',
  `sort` int DEFAULT '0' COMMENT '排序号',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_role`
--

LOCK TABLES `nex_role` WRITE;
/*!40000 ALTER TABLE `nex_role` DISABLE KEYS */;
INSERT INTO `nex_role` VALUES (1,'Super_Admin','超级管理员','拥有系统全部权限，用于系统的设置和修改参数',1,1,1,1,'[1, 2, 3, 4]',1,1,'2026-01-01 00:00:00','2026-09-05 12:13:56'),(2,'Administrator','系统管理员','拥有使用系统的全部权限，用于使用维度的修改',2,0,1,0,'[2, 3, 4]',1,2,'2026-01-01 00:00:00','2026-09-05 12:13:56'),(3,'Engineer','工程师','设备工程师，可管理设备参数',3,0,1,0,'[3, 4]',1,3,'2026-01-01 00:00:00','2026-09-05 12:13:56'),(4,'Operator','操作员','普通操作员，仅可查看和操作',4,0,1,0,'[4]',1,4,'2026-01-01 00:00:00','2026-09-05 12:13:56');
/*!40000 ALTER TABLE `nex_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nex_role_menu`
--

DROP TABLE IF EXISTS `nex_role_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_role_menu` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_id` int NOT NULL COMMENT '角色ID',
  `menu_id` varchar(32) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`),
  KEY `idx_role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1022544 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色菜单关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_role_menu`
--

LOCK TABLES `nex_role_menu` WRITE;
/*!40000 ALTER TABLE `nex_role_menu` DISABLE KEYS */;
INSERT INTO `nex_role_menu` VALUES (1021886,1,'_101'),(1021887,1,'_101_01'),(1021888,1,'_101_02'),(1021889,1,'_101_03'),(1021890,1,'_101_03_output'),(1021891,1,'_101_03_output_search'),(1021892,1,'_101_03_output_reset'),(1021893,1,'_101_03_output_export'),(1021894,1,'_101_03_output_refresh'),(1021895,1,'_101_03_oee'),(1021896,1,'_101_03_oee_search'),(1021897,1,'_101_03_oee_reset'),(1021898,1,'_101_03_oee_export'),(1021899,1,'_101_03_oee_refresh'),(1021900,1,'_101_03_production'),(1021901,1,'_101_03_production_search'),(1021902,1,'_101_03_production_reset'),(1021903,1,'_101_03_production_export'),(1021904,1,'_101_03_production_refresh'),(1021905,1,'_101_03_alarm'),(1021906,1,'_101_03_alarm_search'),(1021907,1,'_101_03_alarm_reset'),(1021908,1,'_101_03_alarm_export'),(1021909,1,'_101_03_alarm_refresh'),(1021910,1,'_101_03_alarm_detail'),(1021911,1,'_101_03_alarm_exportSingle'),(1021912,1,'_102'),(1021913,1,'_102_01'),(1021914,1,'_102_02'),(1021921,1,'_102_03'),(1021922,1,'_102_03_search'),(1021923,1,'_102_03_add'),(1021924,1,'_102_03_refresh'),(1021925,1,'_102_03_edit'),(1021926,1,'_102_03_operate'),(1021927,1,'_102_03_delete'),(1021928,1,'_103'),(1021929,1,'_103_01'),(1021930,1,'_103_01_01'),(1021931,1,'_103_02'),(1021936,1,'_104'),(1021940,1,'_104_04'),(1021941,1,'_104_05'),(1021942,1,'_104_06'),(1021943,1,'_104_06_btn1'),(1021944,1,'_104_06_btn_reset'),(1021945,1,'_104_06_system'),(1021946,1,'_104_06_param1'),(1021947,1,'_104_06_param2'),(1021948,1,'_104_06_param3'),(1021949,1,'_104_06_param4'),(1021950,1,'_104_06_param5'),(1021951,1,'_104_06_param6'),(1021952,1,'_104_06_system_dateFormat_view'),(1021953,1,'_104_06_system_dateFormat_edit'),(1021954,1,'_104_06_security'),(1021955,1,'_104_06_param7'),(1021956,1,'_104_06_param8'),(1021957,1,'_104_06_param9'),(1021958,1,'_104_06_param10'),(1021959,1,'_104_06_param15'),(1021960,1,'_104_06_param16'),(1021961,1,'_104_06_param17'),(1021962,1,'_104_06_param18'),(1021976,1,'_104_06_export'),(1021977,1,'_104_06_param27'),(1021978,1,'_104_06_param28'),(1021979,1,'_104_06_param29'),(1021980,1,'_104_06_param30'),(1021992,1,'_104_06_device'),(1021993,1,'_104_06_param41'),(1021994,1,'_104_06_param42'),(1021995,1,'_104_06_param43'),(1021996,1,'_104_06_param44'),(1021997,1,'_104_06_param45'),(1021998,1,'_104_06_param46'),(1021999,1,'_104_06_param47'),(1022000,1,'_104_06_param48'),(1022001,1,'_104_06_param49'),(1022002,1,'_104_06_param50'),(1022003,1,'_104_06_param51'),(1022004,1,'_104_06_param52'),(1022005,1,'_104_06_param53'),(1022006,1,'_104_06_param54'),(1022007,1,'_104_06_param55'),(1022008,1,'_104_06_param56'),(1022009,1,'_104_06_order'),(1022010,1,'_104_06_param57'),(1022011,1,'_104_06_param58'),(1022012,1,'_104_06_param59'),(1022013,1,'_104_06_param60'),(1022014,1,'_104_06_param61'),(1022015,1,'_104_06_param62'),(1022016,1,'_104_06_param63'),(1022017,1,'_104_06_param64'),(1022018,1,'_104_06_param65'),(1022019,1,'_104_06_param66'),(1022020,1,'_104_06_param67'),(1022021,1,'_104_06_param68'),(1022022,1,'_104_06_param69'),(1022023,1,'_104_06_param70'),(1022024,1,'_104_06_param71'),(1022025,1,'_104_06_param72'),(1022026,1,'_104_06_param73'),(1022027,1,'_104_06_param74'),(1022028,1,'_104_06_param75'),(1022029,1,'_104_06_param76'),(1022030,1,'_104_06_param77'),(1022031,1,'_104_06_param78'),(1022037,1,'_104_06_02'),(1022038,1,'_104_06_02_btn1'),(1022039,1,'_104_06_02_btn2'),(1022040,1,'_104_06_02_btn3'),(1022041,1,'_104_06_license'),(1022042,1,'_104_06_license_btn1'),(1022043,1,'_104_06_license_btn2'),(1022044,1,'_104_06_license_btn3'),(1022045,1,'_104_07'),(1022046,1,'_104_08'),(1022047,1,'_104_08_01'),(1022048,1,'_104_08_02'),(1022049,1,'_102_02_dashboard'),(1022050,1,'_102_02_list'),(1022051,1,'_102_02_list_search'),(1022052,1,'_102_02_list_reset'),(1022053,1,'_102_02_list_export'),(1022054,1,'_102_02_list_refresh'),(1022055,1,'_102_02_list_detail'),(1022056,1,'_102_02_list_handle'),(1022060,1,'_103_02_comp'),(1022061,1,'_103_02_run'),(1022062,1,'_103_02_plan'),(1022063,1,'_103_02_comp_dlSel'),(1022064,1,'_103_02_comp_dlAll'),(1022065,1,'_103_02_comp_dl'),(1022066,1,'_103_02_run_dlSel'),(1022067,1,'_103_02_run_dlAll'),(1022068,1,'_103_02_run_dl'),(1022069,1,'_103_02_plan_add'),(1022070,1,'_103_02_plan_dlSel'),(1022071,1,'_103_02_plan_dlAll'),(1022072,1,'_103_02_plan_edit'),(1022073,1,'_103_02_plan_del'),(1022101,3,'_101'),(1022102,3,'_101_01'),(1022103,3,'_101_02'),(1022104,3,'_102'),(1022105,3,'_102_01'),(1022106,3,'_102_02'),(1022107,3,'_102_03'),(1022108,3,'_102_03_search'),(1022109,3,'_102_03_add'),(1022110,3,'_102_03_refresh'),(1022111,3,'_102_03_edit'),(1022112,3,'_102_03_operate'),(1022113,3,'_102_03_delete'),(1022114,3,'_103'),(1022115,3,'_103_01'),(1022116,3,'_103_02'),(1022117,1,'_102_03_template'),(1022118,1,'_102_03_template_search'),(1022119,1,'_102_03_template_add'),(1022120,1,'_102_03_template_edit'),(1022121,1,'_102_03_template_delete'),(1022122,1,'_102_03_template_refresh'),(1022123,1,'_102_03_life'),(1022124,4,'_101'),(1022125,1,'_105'),(1022126,1,'_105_01'),(1022127,1,'_105_02'),(1022128,1,'_105_03'),(1022169,1,'_105_04'),(1022201,1,'_105_05'),(1022368,2,'_101'),(1022369,2,'_101_01'),(1022370,2,'_101_02'),(1022371,2,'_101_03'),(1022372,2,'_101_03_output'),(1022373,2,'_101_03_output_search'),(1022374,2,'_101_03_output_reset'),(1022375,2,'_101_03_output_export'),(1022376,2,'_101_03_output_refresh'),(1022377,2,'_101_03_oee'),(1022378,2,'_101_03_oee_search'),(1022379,2,'_101_03_oee_reset'),(1022380,2,'_101_03_oee_export'),(1022381,2,'_101_03_oee_refresh'),(1022382,2,'_101_03_production'),(1022383,2,'_101_03_production_search'),(1022384,2,'_101_03_production_reset'),(1022385,2,'_101_03_production_export'),(1022386,2,'_101_03_production_refresh'),(1022387,2,'_101_03_alarm_detail'),(1022388,2,'_101_03_alarm_exportSingle'),(1022389,2,'_101_03_alarm'),(1022390,2,'_101_03_alarm_search'),(1022391,2,'_101_03_alarm_reset'),(1022392,2,'_101_03_alarm_export'),(1022393,2,'_101_03_alarm_refresh'),(1022394,2,'_102'),(1022395,2,'_102_01'),(1022396,2,'_102_02'),(1022397,2,'_102_02_dashboard'),(1022398,2,'_102_02_list'),(1022399,2,'_102_02_list_search'),(1022400,2,'_102_02_list_reset'),(1022401,2,'_102_02_list_export'),(1022402,2,'_102_02_list_refresh'),(1022403,2,'_102_02_list_detail'),(1022404,2,'_102_02_list_handle'),(1022405,2,'_102_03'),(1022406,2,'_102_03_life'),(1022407,2,'_102_03_search'),(1022408,2,'_102_03_add'),(1022409,2,'_102_03_refresh'),(1022410,2,'_102_03_edit'),(1022411,2,'_102_03_operate'),(1022412,2,'_102_03_delete'),(1022413,2,'_102_03_template'),(1022414,2,'_102_03_template_search'),(1022415,2,'_102_03_template_add'),(1022416,2,'_102_03_template_edit'),(1022417,2,'_102_03_template_delete'),(1022418,2,'_102_03_template_refresh'),(1022419,2,'_103'),(1022420,2,'_103_01'),(1022421,2,'_103_01_01'),(1022422,2,'_103_02'),(1022423,2,'_103_02_comp'),(1022424,2,'_103_02_comp_dlSel'),(1022425,2,'_103_02_comp_dlAll'),(1022426,2,'_103_02_comp_dl'),(1022427,2,'_103_02_run'),(1022428,2,'_103_02_run_dlSel'),(1022429,2,'_103_02_run_dlAll'),(1022430,2,'_103_02_run_dl'),(1022431,2,'_103_02_plan'),(1022432,2,'_103_02_plan_add'),(1022433,2,'_103_02_plan_dlSel'),(1022434,2,'_103_02_plan_dlAll'),(1022435,2,'_103_02_plan_edit'),(1022436,2,'_103_02_plan_del'),(1022437,2,'_104'),(1022438,2,'_104_04'),(1022439,2,'_104_05'),(1022440,2,'_104_06'),(1022441,2,'_104_06_btn1'),(1022442,2,'_104_06_btn_reset'),(1022443,2,'_104_06_system'),(1022444,2,'_104_06_param1'),(1022445,2,'_104_06_param2'),(1022446,2,'_104_06_param3'),(1022447,2,'_104_06_param4'),(1022448,2,'_104_06_param5'),(1022449,2,'_104_06_param6'),(1022450,2,'_104_06_system_dateFormat_view'),(1022451,2,'_104_06_system_dateFormat_edit'),(1022452,2,'_104_06_security'),(1022453,2,'_104_06_param7'),(1022454,2,'_104_06_param8'),(1022455,2,'_104_06_param9'),(1022456,2,'_104_06_param10'),(1022457,2,'_104_06_param15'),(1022458,2,'_104_06_param16'),(1022459,2,'_104_06_param17'),(1022460,2,'_104_06_param18'),(1022461,2,'_104_06_export'),(1022462,2,'_104_06_param27'),(1022463,2,'_104_06_param28'),(1022464,2,'_104_06_param29'),(1022465,2,'_104_06_param30'),(1022466,2,'_104_06_device'),(1022467,2,'_104_06_param41'),(1022468,2,'_104_06_param42'),(1022469,2,'_104_06_param43'),(1022470,2,'_104_06_param44'),(1022471,2,'_104_06_param45'),(1022472,2,'_104_06_param46'),(1022473,2,'_104_06_param47'),(1022474,2,'_104_06_param48'),(1022475,2,'_104_06_param49'),(1022476,2,'_104_06_param50'),(1022477,2,'_104_06_param51'),(1022478,2,'_104_06_param52'),(1022479,2,'_104_06_param53'),(1022480,2,'_104_06_param54'),(1022481,2,'_104_06_param55'),(1022482,2,'_104_06_param56'),(1022483,2,'_104_06_order'),(1022484,2,'_104_06_param57'),(1022485,2,'_104_06_param58'),(1022486,2,'_104_06_param59'),(1022487,2,'_104_06_param60'),(1022488,2,'_104_06_param61'),(1022489,2,'_104_06_param62'),(1022490,2,'_104_06_param63'),(1022491,2,'_104_06_param64'),(1022492,2,'_104_06_param65'),(1022493,2,'_104_06_param66'),(1022494,2,'_104_06_param67'),(1022495,2,'_104_06_param68'),(1022496,2,'_104_06_param69'),(1022497,2,'_104_06_param70'),(1022498,2,'_104_06_param71'),(1022499,2,'_104_06_param72'),(1022500,2,'_104_06_param73'),(1022501,2,'_104_06_param74'),(1022502,2,'_104_06_param75'),(1022503,2,'_104_06_param76'),(1022504,2,'_104_06_param77'),(1022505,2,'_104_06_param78'),(1022506,2,'_104_06_02'),(1022507,2,'_104_06_02_btn1'),(1022508,2,'_104_06_02_btn2'),(1022509,2,'_104_06_02_btn3'),(1022510,2,'_104_06_license'),(1022511,2,'_104_06_license_btn1'),(1022512,2,'_104_06_license_btn2'),(1022513,2,'_104_06_license_btn3'),(1022514,2,'_104_07'),(1022515,2,'_104_08'),(1022516,2,'_104_08_01'),(1022517,2,'_104_08_02'),(1022518,1,'_105_06'),(1022519,1,'_104_06_notification'),(1022520,2,'_104_06_notification'),(1022521,1,'_104_06_licenseSetting'),(1022522,2,'_104_06_licenseSetting'),(1022523,1,'_104_06_notification_param1'),(1022524,2,'_104_06_notification_param1'),(1022525,1,'_104_06_notification_param2'),(1022526,2,'_104_06_notification_param2'),(1022527,1,'_104_06_notification_param3'),(1022528,2,'_104_06_notification_param3'),(1022529,1,'_104_06_notification_param4'),(1022530,2,'_104_06_notification_param4'),(1022531,1,'_104_06_licenseSetting_param1'),(1022532,2,'_104_06_licenseSetting_param1'),(1022533,1,'_104_06_licenseSetting_param2'),(1022534,2,'_104_06_licenseSetting_param2'),(1022535,1,'_104_06_licenseSetting_param3'),(1022536,2,'_104_06_licenseSetting_param3'),(1022537,1,'_104_06_licenseSetting_param4'),(1022538,2,'_104_06_licenseSetting_param4'),(1022539,1,'_104_06_licenseSetting_param5'),(1022540,2,'_104_06_licenseSetting_param5'),(1022541,1,'_104_06_licenseSetting_param6'),(1022542,2,'_104_06_licenseSetting_param6'),(1022543,1,'_105_07');
/*!40000 ALTER TABLE `nex_role_menu` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_system_config`
--

LOCK TABLES `nex_system_config` WRITE;
/*!40000 ALTER TABLE `nex_system_config` DISABLE KEYS */;
INSERT INTO `nex_system_config` VALUES (41,'sessionTimeout','40','number','会话超时时间（分钟）','system',1,'2026-08-27 22:03:46','2026-09-04 16:53:03'),(42,'defaultPageSize','20','number','默认每页条数','system',2,'2026-08-27 22:03:46','2026-08-28 14:23:55'),(43,'defaultLanguage','zh-CN','string','默认语言','system',3,'2026-08-27 22:03:46','2026-08-28 13:56:04'),(44,'dateFormat','YYYY-MM-DD','string','日期显示格式','system',4,'2026-08-27 22:03:46','2026-08-27 22:03:46'),(45,'watermarkEnabled','false','boolean','是否启用水印','security',1,'2026-08-27 22:03:46','2026-09-05 13:19:04'),(46,'watermarkText','','string','水印文字（为空时使用当前用户名）','security',2,'2026-08-27 22:03:46','2026-08-28 14:23:39'),(47,'plcProtocol','ModbusTcp','string','通信协议','plc',1,'2026-08-27 22:03:46','2026-08-27 22:03:46'),(48,'plcHost','127.0.0.1','string','设备IP地址','plc',2,'2026-08-27 22:03:46','2026-08-27 22:03:46'),(49,'plcPort','502','number','设备端口','plc',3,'2026-08-27 22:03:46','2026-08-27 22:03:46'),(50,'plcUnitId','1','number','Modbus单元ID','plc',4,'2026-08-27 22:03:46','2026-08-27 22:03:46'),(51,'pollFastInterval','150','number','快速轮询间隔（ms）','plc',5,'2026-08-27 22:03:46','2026-09-04 16:53:38'),(52,'pollSlowInterval','1500','number','慢速轮询间隔（ms）','plc',6,'2026-08-27 22:03:46','2026-09-01 18:18:23'),(53,'pdfWatermarkEnabled','true','boolean','PDF导出水印开关','export',1,'2026-08-27 22:03:46','2026-09-04 17:04:59'),(54,'pdfWatermarkText','','string','PDF水印文字（为空时使用当前用户名）','export',2,'2026-08-27 22:03:46','2026-08-27 22:03:46'),(55,'heartbeatInterval','24000','number','WebSocket心跳间隔（ms）','connection',1,'2026-08-27 22:03:46','2026-09-04 16:53:46'),(56,'deviceName','nexCM-灌装机-001','string','设备名称','device',1,'2026-08-28 14:10:14','2026-08-28 14:10:14'),(57,'deviceCode','NEXCM-FILL-2026-001','string','设备编号','device',2,'2026-08-28 14:10:14','2026-08-28 14:10:14'),(58,'deviceRegion','[\"CN\",\"CN-WX\"]','json','设备所在地区（国家编码,城市编码）','device',3,'2026-08-28 14:10:14','2026-08-28 14:10:14'),(59,'deviceInstallDate','2026-01-14','string','设备安装日期','device',4,'2026-08-28 14:10:14','2026-09-04 16:53:59'),(60,'partLifeReminderEnabled','false','boolean','部件寿命提醒开关','device',5,'2026-08-28 14:10:15','2026-08-28 14:55:08'),(61,'partLifeThreshold','20','string','部件寿命提醒阈值（%）','device',6,'2026-08-28 14:10:15','2026-08-28 14:10:15'),(62,'partLifeRemindInterval','day','string','部件寿命提醒频率（hour/shift/day）','device',7,'2026-08-28 14:10:15','2026-08-28 14:10:15'),(63,'partLifeSnoozeInterval','10','number','稍后提醒间隔（分钟）','device',8,'2026-08-28 14:10:15','2026-08-28 14:10:15'),(64,'allowNoOrderProduction','false','boolean','允许无订单生产','order',1,'2026-08-28 14:10:16','2026-08-28 14:10:16'),(65,'noOrderProductionHighlight','false','boolean','无订单生产高亮提示','order',2,'2026-08-28 14:10:16','2026-08-28 14:10:16'),(66,'showOperatorName','true','boolean','显示操作员姓名','order',3,'2026-08-28 14:10:16','2026-09-04 16:54:10'),(67,'showAlarmCount','true','boolean','显示报警数量','order',4,'2026-08-28 14:10:16','2026-08-28 14:10:16'),(68,'showRuntime','true','boolean','显示运行时长','order',5,'2026-08-28 14:10:16','2026-08-28 14:10:16'),(69,'reportIncludeAlarmDetail','true','boolean','报表包含报警详情','order',6,'2026-08-28 14:10:16','2026-08-28 14:10:16'),(70,'reportIncludeOperatorDetail','true','boolean','报表包含操作员详情','order',7,'2026-08-28 14:10:16','2026-08-28 14:10:16'),(71,'reportIncludeDownloadCount','true','boolean','报表包含下载次数','order',8,'2026-08-28 14:10:16','2026-08-28 14:10:16'),(72,'allowRunningOrderDownload','false','boolean','允许运行中订单下载','order',9,'2026-08-28 14:10:16','2026-08-28 14:10:16'),(73,'autoArchiveCompleted','true','boolean','自动归档已完成订单','order',10,'2026-08-28 14:10:16','2026-08-28 14:10:16'),(74,'orderSwitchConfirm','true','boolean','订单切换确认','order',11,'2026-08-28 14:10:16','2026-08-28 14:10:16'),(79,'deviceStatusCheckInterval','300','number','设备状态检查间隔（秒）','connection',2,'2026-08-29 20:03:18','2026-08-29 20:03:18'),(80,'deviceOfflineThreshold','600','number','设备离线阈值（秒）','connection',3,'2026-08-29 20:03:18','2026-08-29 20:03:18'),(81,'loginFailedThreshold','3','number','登录失败次数阈值（达到该次数触发通知）','security',3,'2026-08-31 19:25:05','2026-09-01 18:38:02'),(82,'maintenanceCheckInterval','24','number','设备维护检查间隔（小时）','connection',4,'2026-08-31 19:25:05','2026-08-31 19:25:05'),(91,'lockDurationMinutes','25','number','账户锁定时长（分钟）','security',10,'2026-09-01 19:20:44','2026-09-04 16:53:23'),(92,'partLifeStatInterval','5','number','部件寿命统计间隔（分钟）','connection',5,'2026-09-02 17:00:08','2026-09-02 17:00:08'),(105,'plcReconnectDelay','3000','number','PLC重连延迟时间（毫秒）','plc',70,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(106,'plcEnablePoll','true','boolean','是否启用PLC轮询','plc',80,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(107,'plcEnableWriteAudit','true','boolean','是否启用PLC写入审计','plc',90,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(108,'plcMaxWriteRetry','1','number','PLC写入最大重试次数','plc',100,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(109,'emailSendTimeout','30000','number','邮件发送超时时间（毫秒）','email',10,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(110,'emailMaxRetries','3','number','邮件发送最大重试次数','email',20,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(111,'emailRetryDelay','5000','number','邮件发送重试间隔（毫秒）','email',30,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(112,'uploadMaxFileSize','10','number','上传文件最大大小（MB）','upload',10,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(113,'uploadAllowedTypes','image,pdf,excel,word','string','允许上传的文件类型（逗号分隔）','upload',20,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(114,'uploadPath','/uploads','string','上传文件存储路径','upload',30,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(115,'uploadEnableAudit','true','boolean','是否启用上传审计','upload',40,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(116,'auditRetentionDays','365','number','审计日志保留天数','audit',10,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(117,'auditAutoArchive','true','boolean','是否自动归档审计日志','audit',20,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(118,'licenseExpiringDays','30','number','授权到期提前提醒天数','license',10,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(119,'licenseGracePeriod','7','number','授权到期宽限期（天）','license',20,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(120,'licenseCheckInterval','24','number','授权状态检查间隔（小时）','license',30,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(121,'notificationAutoReadDays','7','number','通知自动标记已读天数','notification',10,'2026-09-05 15:56:04','2026-09-05 15:56:04'),(122,'notificationSoundEnabled','false','boolean','是否启用通知声音提醒','notification',20,'2026-09-05 15:56:04','2026-09-05 15:56:04');
/*!40000 ALTER TABLE `nex_system_config` ENABLE KEYS */;
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
  `role` varchar(50) DEFAULT 'Operator' COMMENT '岗位类别：Super_Admin超级管理员 / Administrator系统管理员 / Engineer工程师 / Operator操作员',
  `real_name` varchar(50) DEFAULT 'operator' COMMENT '用户真实姓名',
  `sex` tinyint DEFAULT '0' COMMENT '性别 1男 2女 0未知',
  `phone` varchar(20) DEFAULT '' COMMENT '联系手机号',
  `email` varchar(100) DEFAULT '' COMMENT '邮箱地址',
  `dept_id` int DEFAULT NULL COMMENT '所属部门ID，关联nex_dept表',
  `avatar` varchar(255) DEFAULT '' COMMENT '头像地址',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '账号状态：1启用 0禁用',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '软删除：0正常 1删除',
  `is_first_login` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否首次登录 1是 0否',
  `first_login_at` datetime DEFAULT NULL COMMENT '首次登录时间',
  `login_ip` varchar(50) DEFAULT '' COMMENT '最后登录IP',
  `login_date` datetime DEFAULT NULL COMMENT '最后登录时间',
  `lock_until` datetime DEFAULT NULL COMMENT '锁定到期时间，null表示未锁定',
  `failed_attempts` int DEFAULT '0' COMMENT '登录失败次数',
  `lock_reason` varchar(255) DEFAULT NULL COMMENT '锁定原因',
  `permission_version` int DEFAULT '0' COMMENT '权限版本号，权限变更时+1',
  `token_version` int NOT NULL DEFAULT '0' COMMENT 'Token版本号，每次登录+1，用于单点登录踢人',
  `remark` varchar(500) DEFAULT '' COMMENT '备注信息',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_dept` (`dept_id`),
  KEY `idx_status_del` (`status`,`is_delete`),
  CONSTRAINT `chk_is_delete` CHECK ((`is_delete` in (0,1))),
  CONSTRAINT `chk_sex` CHECK ((`sex` in (0,1,2))),
  CONSTRAINT `chk_status` CHECK ((`status` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统用户表 | nex 管理平台';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_user`
--

LOCK TABLES `nex_user` WRITE;
/*!40000 ALTER TABLE `nex_user` DISABLE KEYS */;
INSERT INTO `nex_user` VALUES (1,'liuguohui','$2a$10$LWEIoMRlVuRcjVSKR7J3M.i3PZ6q8xnlAqy/Oy22UIgASHYT1MYEu','Super_Admin','刘国辉',1,'18662605940','879639340@qq.com',0,'',1,0,0,NULL,'127.0.0.1','2026-09-05 16:59:42',NULL,0,NULL,0,17,'超级管理员','2026-08-27 17:53:38','2026-09-05 16:59:41'),(9,'buqiangqiang','$2a$10$T73UL2VPX2L970Ech3JQu.EYvq7Z1dnp4LXog4IUGqHhvcZis/wEK','Administrator','卜强强',1,'13587954587','buqq@sainuo-medical.com',103,'',1,0,1,NULL,'127.0.0.1','2026-09-05 14:20:18',NULL,0,NULL,1788585110,7,'系统管理员','2026-08-25 19:28:29','2026-09-05 14:20:17'),(10,'wangshuai','$2a$10$.TNOzIpZN2ZVbIxQK55ssu2bpXRoPGV6Hw/4QjjGkorjUnbmpq2rK','Administrator','王帅',1,'15878954587','wangs@sainuo-medical.com',105,'',1,0,1,NULL,'127.0.0.1','2026-08-31 16:18:31',NULL,0,NULL,1788585110,1,'系统管理员','2026-08-25 19:29:06','2026-09-05 13:11:50'),(11,'wangleixin','$2a$10$gvjXveI0pXAv9j3fUT4osOUrGi24FoMcJkSluQIimtb1gqd3hDbEq','Operator','王磊鑫',1,'13587896584','879639340@qq.com',109,'',1,0,1,NULL,'127.0.0.1',NULL,NULL,0,NULL,1788570033,0,'操作员','2026-08-25 19:30:06','2026-09-05 09:00:33'),(12,'lilikang','$2a$10$JLvbnJokqv5fLC.ZamNccu5jjuWiNiwZm0PIzpplxFb.WP97EH2Wq','Engineer','李立康',1,'15487855878','879639340@qq.com',106,'',1,0,1,NULL,'127.0.0.1',NULL,NULL,0,NULL,1,0,'工程师','2026-08-25 19:30:39','2026-09-04 22:13:10'),(13,'test01','$2a$10$LWEIoMRlVuRcjVSKR7J3M.i3PZ6q8xnlAqy/Oy22UIgASHYT1MYEu','Operator','operator',0,'15487855878','879639340@qq.com',108,'',1,0,1,NULL,'127.0.0.1','2026-09-02 08:28:31',NULL,0,NULL,1788570033,18,'操作员','2026-08-27 17:53:38','2026-09-05 09:00:33');
/*!40000 ALTER TABLE `nex_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nex_user_device`
--

DROP TABLE IF EXISTS `nex_user_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nex_user_device` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int NOT NULL COMMENT '用户ID',
  `device_id` varchar(100) NOT NULL COMMENT '设备唯一标识（前端生成，存储在localStorage）',
  `device_name` varchar(255) DEFAULT '' COMMENT '设备名称（可自定义，默认从User-Agent解析）',
  `ip` varchar(50) DEFAULT '' COMMENT '登录IP',
  `user_agent` text COMMENT '浏览器User-Agent',
  `login_time` datetime DEFAULT NULL COMMENT '登录时间',
  `last_active_time` datetime DEFAULT NULL COMMENT '最后活跃时间（心跳更新）',
  `status` tinyint DEFAULT '1' COMMENT '状态：1=在线，0=离线',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_device` (`user_id`,`device_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户在线设备表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nex_user_device`
--

LOCK TABLES `nex_user_device` WRITE;
/*!40000 ALTER TABLE `nex_user_device` DISABLE KEYS */;
INSERT INTO `nex_user_device` VALUES (23,1,'device_1788579191461_u99v50jmk','Chrome 150 · Windows 10','127.0.0.1','','2026-09-05 18:25:08','2026-09-05 18:25:32',1,'2026-09-05 12:36:12','2026-09-05 18:25:32'),(24,9,'device_1788579191461_u99v50jmk','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','2026-09-05 14:26:34','2026-09-05 14:26:34',0,'2026-09-05 13:17:44','2026-09-05 14:26:37');
/*!40000 ALTER TABLE `nex_user_device` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-05 18:25:33
