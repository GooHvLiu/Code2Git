-- 测试菜单数据
INSERT INTO nex_menu
(id,parent_id,name,path,component,redirect,title,icon,hidden,always_show,no_cache,sort)
VALUES
('_001','','Customer','/customer','Layout','noRedirect','客户管理','peoples',0,1,0,1),
('_001_01','_001','Customer','customer','customer','noRedirect','客户档案','',0,0,0,1),
('_001_02','_001','Visit','visit','customer/visit','noRedirect','拜访记录','',0,0,0,2),
('_002','','Business','/business','Layout','noRedirect','修养预约','',0,0,0,2),
('_003','','Flow','/flow','Layout','noRedirect','流程管理','',0,0,0,3);