-- 数据库改名在 MySQL 没有直接 RENAME DATABASE 安全命令（高版本已移除，有风险）--将 nexsm01 更改为 nexsm_dev

-- 第一步，创建目标数据库nexsm_v1_dev
CREATE DATABASE nexsm_v1_dev DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- 第二步，将 nexsm_dev 所有表迁移到 nexsm_v1_dev，采用SQL 脚本，批量迁移表（查询出所有表，生成迁移语句）
SELECT CONCAT('RENAME TABLE nexsm_dev.', TABLE_NAME, ' nexsm_v1_dev.', TABLE_NAME,';') AS move_sql
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'nexsm_dev';

-- 第三步，执行👆这条查询，复制输出的所有 RENAME TABLE 语句如下并批量运行，不同的数据库，下面的命令不一样。
RENAME TABLE nexsm_dev.nex_customer TO nexsm_v1_dev.nex_customer;
RENAME TABLE nexsm_dev.nex_menu TO nexsm_v1_dev.nex_menu;
RENAME TABLE nexsm_dev.nex_user TO nexsm_v1_dev.nex_user;
RENAME TABLE nexsm_dev.nex_user_menu TO nexsm_v1_dev.nex_user_menu;