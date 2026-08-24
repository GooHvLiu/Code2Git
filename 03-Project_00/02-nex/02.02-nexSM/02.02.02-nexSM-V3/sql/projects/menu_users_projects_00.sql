-- 插入新的一级菜单和二级菜单
-- 删除原来的用户菜单关联（关联旧菜单的记录）
DELETE FROM nex_user_menu WHERE menu_id IN (
  '_001', '_001_01', '_001_02',
  '_002', '_002_01', '_002_02', '_002_03',
  '_003', '_003_01', '_003_02'
);

-- 删除原来的菜单
DELETE FROM nex_menu WHERE id IN (
  '_001', '_001_01', '_001_02',
  '_002', '_002_01', '_002_02', '_002_03',
  '_003', '_003_01', '_003_02'
);
-- 设备管理（一级菜单）和生产管理（一级菜单）及各自二级菜单
INSERT INTO nex_menu (id, parent_id, name, path, component, redirect, title, title_en, icon, hidden, always_show, no_cache, sort) VALUES
('_101', '', 'Device', '/device', NULL, 'noRedirect', '设备管理', 'Device', 'device', 0, 1, 0, 1),
('_101_01', '_101', 'DevState', 'state', NULL, 'noRedirect', '设备状态', 'DevState', '#', 0, 0, 0, 1),
('_101_02', '_101', 'AlarmLog', 'alarm', NULL, 'noRedirect', '报警统计', 'AlarmLog', '#', 0, 0, 0, 2),
('_101_03', '_101', 'PartLife', 'part', NULL, 'noRedirect', '部件寿命', 'PartLife', '#', 0, 0, 0, 3),
('_102', '', 'Production', '/production', NULL, 'noRedirect', '生产管理', 'Production', 'product', 0, 1, 0, 2),
('_102_01', '_102', 'RecipeDB', 'recipe', NULL, 'noRedirect', '配方管理', 'Recipe', '#', 0, 0, 0, 1),
('_102_02', '_102', 'OrderLog', 'order', NULL, 'noRedirect', '订单管理', 'Order', '#', 0, 0, 0, 2);


-- 为所有用户添加新的菜单权限关联
INSERT INTO nex_user_menu (user_id, menu_id)
SELECT u.id, m.id
FROM nex_user u
CROSS JOIN nex_menu m
WHERE m.id IN (
  '_101', '_101_01', '_101_02', '_101_03',
  '_102', '_102_01', '_102_02'
)
AND u.is_delete = 0;
