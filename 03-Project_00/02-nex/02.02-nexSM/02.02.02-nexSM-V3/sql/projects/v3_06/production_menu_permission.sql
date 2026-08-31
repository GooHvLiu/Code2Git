-- ============================================
-- 生产管理菜单按钮权限配置
-- ============================================

-- 1. 配方管理 - 下载按钮（只有下载权限，没有新增、编辑、删除）
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_103_01_01', '_103_01', 'RecipeDownload', '', NULL, 'noRedirect',
  'menu.production.recipe.download', 'Download', '#', 1, 0, 0,
  1, 'production:recipe:download', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 2. 生产订单 - 新增按钮
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_103_02_01', '_103_02', 'OrderAdd', '', NULL, 'noRedirect',
  'menu.production.order.add', 'Add', '#', 1, 0, 0,
  1, 'production:order:add', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 3. 生产订单 - 编辑按钮
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_103_02_02', '_103_02', 'OrderEdit', '', NULL, 'noRedirect',
  'menu.production.order.edit', 'Edit', '#', 1, 0, 0,
  2, 'production:order:edit', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 4. 生产订单 - 删除按钮
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_103_02_03', '_103_02', 'OrderDelete', '', NULL, 'noRedirect',
  'menu.production.order.delete', 'Delete', '#', 1, 0, 0,
  3, 'production:order:delete', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 5. 生产订单 - 下载按钮（合并下载选中、下载全部、下载）
INSERT INTO nex_menu (
  id, parent_id, name, path, component, redirect,
  title, title_en, icon, hidden, always_show, no_cache,
  sort, permission_code, type, api_path, api_method
) VALUES (
  '_103_02_04', '_103_02', 'OrderDownload', '', NULL, 'noRedirect',
  'menu.production.order.download', 'Download', '#', 1, 0, 0,
  4, 'production:order:download', 'button', NULL, NULL
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_en = VALUES(title_en),
  permission_code = VALUES(permission_code),
  update_time = NOW();

-- 6. 给管理员角色分配这些按钮权限
INSERT IGNORE INTO nex_role_menu (role_id, menu_id) VALUES
  (1, '_103_01_01'),
  (1, '_103_02_01'),
  (1, '_103_02_02'),
  (1, '_103_02_03'),
  (1, '_103_02_04');

-- 7. 更新菜单版本号（触发前端重新获取菜单）
UPDATE nex_menu SET update_time = NOW() WHERE id = '_103';
