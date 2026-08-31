-- ============================================
-- 设备管理菜单和权限配置
-- ============================================

-- 1. 增加设备管理菜单（系统设置 -> 设备管理）
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_104_08', '_104', 'DeviceMgmt', 'device', 'system/device/index', 'noRedirect',
  'menu.system.device', 'DeviceMgmt', '#', 0, 0, 0,
  8, 'system:device:view', 'menu', NULL, NULL
);

-- 2. 增加按钮权限 - 踢掉设备
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_104_08_01', '_104_08', 'DeviceKick', '', NULL, 'noRedirect',
  'menu.system.device.kick', 'KickDevice', '#', 1, 0, 0,
  1, 'system:device:kick', 'button', '/prod-api/v2/user/device/:id/kick', 'POST'
);

-- 3. 给管理员角色分配设备管理菜单权限
-- 先查询管理员角色ID
SELECT id, name, role_code FROM nex_role WHERE role_code LIKE '%admin%' OR name LIKE '%管理员%';

-- 假设管理员角色ID是 1，插入角色-菜单关联
-- 请根据实际查询结果调整 role_id
INSERT INTO nex_role_menu (role_id, menu_id) VALUES
  (1, '_104_08'),
  (1, '_104_08_01');

-- 4. 更新菜单版本号（触发前端重新获取菜单）
UPDATE nex_menu SET update_time = NOW() WHERE id = '_104';
