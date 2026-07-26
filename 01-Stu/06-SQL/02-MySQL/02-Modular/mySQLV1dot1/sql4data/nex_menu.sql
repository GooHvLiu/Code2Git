-- 菜单表（匹配vue-element-admin路由规范）
CREATE TABLE nex_menu (
id VARCHAR(32) PRIMARY KEY COMMENT '菜单唯一标识 index值',
  parent_id VARCHAR(32) DEFAULT '' COMMENT '父菜单ID，顶级菜单为空',
  name VARCHAR(50) NOT NULL COMMENT '路由name（组件name）',
  path VARCHAR(100) NOT NULL COMMENT '前端路由path',
  component VARCHAR(100) COMMENT '前端组件名称 Layout / customer/visit',
  redirect VARCHAR(100) DEFAULT 'noRedirect',
  title VARCHAR(50) NOT NULL COMMENT '菜单标题',
  icon VARCHAR(50) COMMENT '图标名称',
  hidden TINYINT DEFAULT 0 COMMENT '是否隐藏菜单 0显示 1隐藏',
  always_show TINYINT DEFAULT 0 COMMENT '是否永远展示父菜单（有子菜单时生效）',
  no_cache TINYINT DEFAULT 0 COMMENT '是否不缓存页面',
  sort INT DEFAULT 0 COMMENT '排序号'
);
