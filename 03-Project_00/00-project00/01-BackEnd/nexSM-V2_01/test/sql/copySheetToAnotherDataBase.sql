-- 在 nexsm_v2_dev 创建 nex_user_menu，同时把 nexsm_v1_dev 的数据全部复制过来
CREATE TABLE nexsm_v2_dev.nex_user_menu LIKE nexsm_v1_dev.nex_user_menu;

INSERT INTO nexsm_v2_dev.nex_user_menu 
SELECT * FROM nexsm_v1_dev.nex_user_menu;
