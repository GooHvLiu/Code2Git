-- 用户菜单权限关联表
CREATE TABLE nex_user_menu(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户id',
  menu_id VARCHAR(32) NOT NULL COMMENT '菜单id'
);