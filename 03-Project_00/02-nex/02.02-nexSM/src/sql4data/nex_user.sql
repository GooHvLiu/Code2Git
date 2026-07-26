CREATE TABLE nex_user (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  username VARCHAR(50) NOT NULL COMMENT '登录账号',
  password VARCHAR(100) NOT NULL COMMENT '加密密码',
  nickname VARCHAR(50) NOT NULL COMMENT '昵称，仅允许 administrator / engineer / operator',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '状态 1启用 0禁用',
  isDelete TINYINT NOT NULL DEFAULT 0 COMMENT '软删除标记 0正常 1已删除',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY uk_username (username),
  CONSTRAINT chk_nickname CHECK (nickname IN ('administrator','engineer','operator')),
  CONSTRAINT chk_status CHECK (status IN (0,1)),
  CONSTRAINT chk_isDelete CHECK (isDelete IN (0,1))
) COMMENT = '用户表';