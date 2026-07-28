INSERT INTO nex_user
(username,password,role,real_name,sex,phone,email,dept_id,avatar,login_ip,login_date,remark,status,is_delete,create_by)
VALUES
-- 1.超级管理员
('admin','$2b$10$lI1m4nPUhnYEBSvHjoSIzu10hVhNjy.y6X3EJCuMy8HexrRXgw4.u','administrator','系统管理员',1,'13800000001','admin@nexcm.com',100,'administrator','127.0.0.1','2025-10-10 09:30:00','超级管理员',1,0,'admin'),
-- 2.设备管理员
('liuguohui','$2b$10$lI1m4nPUhnYEBSvHjoSIzu10hVhNjy.y6X3EJCuMy8HexrRXgw4.u','administrator','刘国辉',1,'13800000002','liu@nexcm.com',100,'administrator','127.0.0.1','2026-07-20 14:22:00','设备负责人',1,0,'admin'),
-- 3.设备维修工程师
('engineer01','$2b$10$lI1m4nPUhnYEBSvHjoSIzu10hVhNjy.y6X3EJCuMy8HexrRXgw4.u','engineer','王强',1,'13800000003','wang@nexcm.com',101,'engineer','192.168.1.105','2026-07-25 08:15:00','设备工程师',1,0,'liuguohui'),
-- 4.现场巡检操作员
('operator01','$2b$10$lI1m4nPUhnYEBSvHjoSIzu10hVhNjy.y6X3EJCuMy8HexrRXgw4.u','operator','张慧',2,'13800000004','zhang@nexcm.com',102,'operator','192.168.1.108','2026-07-27 10:05:00','设备操作员',1,0,'liuguohui'),
-- 5.离职禁用操作员
('operator02','$2b$10$lI1m4nPUhnYEBSvHjoSIzu10hVhNjy.y6X3EJCuMy8HexrRXgw4.u','operator','李泽楷',1,'13800000005','li@nexcm.com',102,'operator','192.168.1.110','2026-06-30 16:20:00','已离职',0,0,'liuguohui');