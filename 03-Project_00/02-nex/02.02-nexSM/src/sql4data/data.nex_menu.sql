-- 测试菜单数据
INSERT INTO nex_menu
(id,parent_id,name,path,component,redirect,title,icon,hidden,always_show,no_cache,sort)
VALUES
('_001','','Customer','/customer','','noRedirect','客户管理','peoples',0,1,0,1),
('_001_01','_001','Customer','customer','','noRedirect','客户档案','',0,0,0,1),
('_001_02','_001','Visit','visit','','noRedirect','拜访记录','',0,0,0,2),
('_002','','Business','/business','','noRedirect','修养预约','',0,0,0,2),
('_002_01','_002','Appointment','appointment','','noRedirect','预约信息','',0,0,0,1),
('_002_02','_002','Service','service','','noRedirect','服务项目','',0,0,0,2),
('_002_03','_002','Statement','statement','','noRedirect','结算单据','',0,0,0,3),
('_003','','Flow','/flow','','noRedirect','流程管理','',0,0,0,3),
('_003_01','_003','Definition','/definition','','noRedirect','流程定义','',0,0,0,1),
('_003_02','_003','Approve','/approve','','noRedirect','审核流程','',0,0,0,2);

