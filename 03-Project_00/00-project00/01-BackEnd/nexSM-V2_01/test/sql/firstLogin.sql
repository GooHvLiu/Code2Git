USE nexsm_v2_dev;

-- 增加是否首次登录 tinyint(1)，默认1：新用户默认是首次登录
ALTER TABLE nex_user 
ADD COLUMN is_first_login TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否首次登录 1是 0否',
ADD COLUMN first_login_at DATETIME NULL COMMENT '首次登录时间';
