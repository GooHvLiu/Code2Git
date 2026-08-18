-- 1. 给 nex_menu 表增加英文标题字段
ALTER TABLE nex_menu 
ADD COLUMN title_en VARCHAR(100) DEFAULT NULL COMMENT '英文标题' AFTER title;

-- 2. 给现有菜单填充英文翻译（根据你的实际菜单调整）
UPDATE nex_menu SET title_en = 'Customer Management' WHERE title = '客户管理';
UPDATE nex_menu SET title_en = 'Customer Profile' WHERE title = '客户档案';
UPDATE nex_menu SET title_en = 'Visit Records' WHERE title = '拜访记录';
UPDATE nex_menu SET title_en = 'Appointment' WHERE title = '修养预约';
UPDATE nex_menu SET title_en = 'Appointment Info' WHERE title = '预约信息';
UPDATE nex_menu SET title_en = 'Service Items' WHERE title = '服务项目';
UPDATE nex_menu SET title_en = 'Settlement' WHERE title = '结算单据';
UPDATE nex_menu SET title_en = 'Flow Management' WHERE title = '流程管理';
UPDATE nex_menu SET title_en = 'Flow Definition' WHERE title = '流程定义';
UPDATE nex_menu SET title_en = 'Approval Flow' WHERE title = '审核流程';

-- 3. 验证
SELECT id, title, title_en, path FROM nex_menu ORDER BY sort;
