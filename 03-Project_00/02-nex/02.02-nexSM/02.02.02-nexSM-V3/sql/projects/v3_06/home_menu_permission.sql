-- ============================================
-- 网站首页菜单和权限配置
-- ============================================

-- 1. 网站首页（一级菜单）
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_101', '', 'Home', '/home', 'Layout', '/home/overview',
  'menu.home.title', 'Home', 'el-icon-s-home', 0, 1, 0,
  1, 'home:view', 'menu', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  icon = VALUES(icon),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 2. 概览（二级菜单）
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_101_01', '_101', 'Overview', 'overview', 'home/overview/index', 'noRedirect',
  'menu.home.overview', 'Overview', 'el-icon-data-analysis', 0, 0, 0,
  1, 'home:overview:view', 'menu', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  icon = VALUES(icon),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 3. 仪表盘（二级菜单）
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_101_02', '_101', 'Dashboard', 'dashboard', 'home/dashboard/index', 'noRedirect',
  'menu.home.dashboard', 'Dashboard', 'el-icon-monitor', 0, 0, 0,
  2, 'home:dashboard:view', 'menu', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  icon = VALUES(icon),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 4. 数据管理（二级菜单）
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_101_03', '_101', 'DataManagement', 'data', 'home/data/index', 'noRedirect',
  'menu.home.data', 'Data Management', 'el-icon-data-line', 0, 0, 0,
  3, 'home:data:view', 'menu', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  icon = VALUES(icon),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 5. 导出按钮（数据管理下的按钮）
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_101_03_01', '_101_03', 'DataExport', '', NULL, 'noRedirect',
  'menu.home.data.export', 'Export', '#', 1, 0, 0,
  1, 'home:data:export', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 6. 详情按钮（数据管理下的按钮）
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_101_03_02', '_101_03', 'DataDetail', '', NULL, 'noRedirect',
  'menu.home.data.detail', 'Detail', '#', 1, 0, 0,
  2, 'home:data:detail', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 7. 给管理员角色分配网站首页菜单权限
-- 先查询管理员角色ID
-- SELECT id, name, role_code FROM nex_role WHERE role_code LIKE '%admin%' OR name LIKE '%管理员%';

-- 假设管理员角色ID是 1，插入角色-菜单关联
INSERT IGNORE INTO nex_role_menu (role_id, menu_id) VALUES
  (1, '_101'),
  (1, '_101_01'),
  (1, '_101_02'),
  (1, '_101_03'),
  (1, '_101_03_01'),
  (1, '_101_03_02');

-- 8. 更新菜单版本号（触发前端重新获取菜单）
UPDATE nex_menu SET update_time = NOW() WHERE id = '_101';
