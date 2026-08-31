-- ============================================
-- 设备管理菜单按钮权限配置
-- ============================================

-- 1. 设备报警 - 导出按钮
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_102_02_01', '_102_02', 'AlarmExport', '', NULL, 'noRedirect',
  'menu.device.alarm.export', 'Export', '#', 1, 0, 0,
  1, 'device:alarm:export', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 2. 设备报警 - 详情按钮
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_102_02_02', '_102_02', 'AlarmDetail', '', NULL, 'noRedirect',
  'menu.device.alarm.detail', 'Detail', '#', 1, 0, 0,
  2, 'device:alarm:detail', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 3. 设备报警 - 处理按钮
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_102_02_03', '_102_02', 'AlarmHandle', '', NULL, 'noRedirect',
  'menu.device.alarm.handle', 'Handle', '#', 1, 0, 0,
  3, 'device:alarm:handle', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 4. 设备配件 - 操作按钮（合并更换录入、批量更换录入、更换、记录）
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_102_03_01', '_102_03', 'PartOperate', '', NULL, 'noRedirect',
  'menu.device.part.operate', 'Operate', '#', 1, 0, 0,
  1, 'device:part:operate', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 5. 设备配件 - 查看全部按钮
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_102_03_02', '_102_03', 'PartViewAll', '', NULL, 'noRedirect',
  'menu.device.part.viewAll', 'View All', '#', 1, 0, 0,
  2, 'device:part:viewAll', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 6. 给管理员角色分配这些按钮权限
INSERT IGNORE INTO nex_role_menu (role_id, menu_id) VALUES
  (1, '_102_02_01'),
  (1, '_102_02_02'),
  (1, '_102_02_03'),
  (1, '_102_03_01'),
  (1, '_102_03_02');

-- 7. 更新菜单版本号（触发前端重新获取菜单）
UPDATE nex_menu SET update_time = NOW() WHERE id = '_102';
