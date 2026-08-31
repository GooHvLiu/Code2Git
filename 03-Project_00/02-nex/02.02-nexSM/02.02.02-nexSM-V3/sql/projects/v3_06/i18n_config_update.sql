-- ============================================
-- 国际化配置统一更新脚本
-- ============================================
-- 说明：
-- 1. 本脚本用于查询和更新菜单表的title字段，确保所有菜单的title字段都是国际化key
-- 2. 国际化key的格式：menu.{module}.{page}.default（菜单）或 menu.{module}.{page}.{button}（按钮）
-- 3. 请先执行查询语句，确认当前的title字段存储的是什么，然后再执行更新语句

-- ============================================
-- 第一部分：查询当前菜单表的title字段
-- ============================================

-- 1. 查询所有菜单的title字段
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
ORDER BY parent_id, sort;

-- 2. 查询title字段不是以menu.开头的菜单（可能是中文或其他格式）
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE title NOT LIKE 'menu.%'
ORDER BY parent_id, sort;

-- 3. 查询type为menu的菜单
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE type = 'menu'
ORDER BY parent_id, sort;

-- 4. 查询type为button的按钮
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE type = 'button'
ORDER BY parent_id, sort;

-- ============================================
-- 第二部分：更新菜单表的title字段为国际化key
-- ============================================
-- 注意：请先执行上面的查询语句，确认当前的title字段存储的是什么，然后再执行更新语句
-- 更新语句需要根据实际的查询结果来编写，以下是示例

-- 示例1：更新网站首页菜单的title字段
-- UPDATE nex_menu SET title = 'menu.home.default' WHERE id = '_101';
-- UPDATE nex_menu SET title = 'menu.home.overview.default' WHERE id = '_101_01';
-- UPDATE nex_menu SET title = 'menu.home.dashboard.default' WHERE id = '_101_02';
-- UPDATE nex_menu SET title = 'menu.home.data.default' WHERE id = '_101_03';
-- UPDATE nex_menu SET title = 'menu.home.data.export' WHERE id = '_101_03_01';
-- UPDATE nex_menu SET title = 'menu.home.data.detail' WHERE id = '_101_03_02';

-- 示例2：更新设备管理菜单的title字段
-- UPDATE nex_menu SET title = 'menu.device.default' WHERE id = '_102';
-- UPDATE nex_menu SET title = 'menu.device.state.default' WHERE id = '_102_01';
-- UPDATE nex_menu SET title = 'menu.device.alarm.default' WHERE id = '_102_02';
-- UPDATE nex_menu SET title = 'menu.device.alarm.export' WHERE id = '_102_02_01';
-- UPDATE nex_menu SET title = 'menu.device.alarm.detail' WHERE id = '_102_02_02';
-- UPDATE nex_menu SET title = 'menu.device.alarm.handle' WHERE id = '_102_02_03';
-- UPDATE nex_menu SET title = 'menu.device.part.default' WHERE id = '_102_03';
-- UPDATE nex_menu SET title = 'menu.device.part.operate' WHERE id = '_102_03_01';
-- UPDATE nex_menu SET title = 'menu.device.part.viewAll' WHERE id = '_102_03_02';

-- 示例3：更新生产管理菜单的title字段
-- UPDATE nex_menu SET title = 'menu.production.default' WHERE id = '_103';
-- UPDATE nex_menu SET title = 'menu.production.recipe.default' WHERE id = '_103_01';
-- UPDATE nex_menu SET title = 'menu.production.recipe.download' WHERE id = '_103_01_01';
-- UPDATE nex_menu SET title = 'menu.production.order.default' WHERE id = '_103_02';
-- UPDATE nex_menu SET title = 'menu.production.order.add' WHERE id = '_103_02_01';
-- UPDATE nex_menu SET title = 'menu.production.order.edit' WHERE id = '_103_02_02';
-- UPDATE nex_menu SET title = 'menu.production.order.delete' WHERE id = '_103_02_03';
-- UPDATE nex_menu SET title = 'menu.production.order.download' WHERE id = '_103_02_04';

-- 示例4：更新系统设置菜单的title字段
-- UPDATE nex_menu SET title = 'menu.system.default' WHERE id = '_104';
-- UPDATE nex_menu SET title = 'menu.system.dict.default' WHERE id = '_104_01';
-- UPDATE nex_menu SET title = 'menu.system.dept.default' WHERE id = '_104_02';
-- UPDATE nex_menu SET title = 'menu.system.role.default' WHERE id = '_104_03';
-- UPDATE nex_menu SET title = 'menu.system.user.default' WHERE id = '_104_04';
-- UPDATE nex_menu SET title = 'menu.system.audit.default' WHERE id = '_104_05';
-- UPDATE nex_menu SET title = 'menu.system.audit.search' WHERE id = '_104_05_01';
-- UPDATE nex_menu SET title = 'menu.system.audit.export' WHERE id = '_104_05_02';
-- UPDATE nex_menu SET title = 'menu.system.config.default' WHERE id = '_104_06';
-- UPDATE nex_menu SET title = 'menu.system.permission.default' WHERE id = '_104_07';
-- UPDATE nex_menu SET title = 'menu.system.device.default' WHERE id = '_104_08';
-- UPDATE nex_menu SET title = 'menu.system.device.kick' WHERE id = '_104_08_01';
-- UPDATE nex_menu SET title = 'menu.system.device.delete' WHERE id = '_104_08_02';

-- ============================================
-- 第三部分：更新菜单版本号，触发前端重新获取菜单
-- ============================================

-- 更新所有一级菜单的update_time字段
UPDATE nex_menu SET update_time = NOW() WHERE parent_id = '0' OR parent_id IS NULL;

-- 或者更新所有菜单的update_time字段
-- UPDATE nex_menu SET update_time = NOW();

-- ============================================
-- 第四部分：验证更新结果
-- ============================================

-- 查询所有菜单的title字段，确认都是国际化key
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE title NOT LIKE 'menu.%'
ORDER BY parent_id, sort;

-- 如果查询结果为空，说明所有菜单的title字段都是国际化key，更新成功
