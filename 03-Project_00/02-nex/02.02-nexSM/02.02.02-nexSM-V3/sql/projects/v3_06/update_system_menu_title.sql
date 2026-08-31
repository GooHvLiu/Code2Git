-- ============================================
-- 更新系统设置菜单下面的子菜单的title字段为国际化key
-- ============================================
-- 说明：
-- 1. 本脚本用于更新系统设置菜单下面的子菜单的title字段为国际化key
-- 2. 国际化key的格式：menu.system.{page}.default
-- 3. 请先执行查询语句，确认当前的title字段存储的是什么，然后再执行更新语句

-- ============================================
-- 第一部分：查询当前系统设置菜单下面的子菜单的title字段
-- ============================================

SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE parent_id = '_104'
ORDER BY sort;

-- ============================================
-- 第二部分：更新系统设置菜单下面的子菜单的title字段为国际化key
-- ============================================

-- 1. 更新字典管理
UPDATE nex_menu SET title = 'menu.system.dict.default' WHERE id = '_104_01';

-- 2. 更新部门管理
UPDATE nex_menu SET title = 'menu.system.dept.default' WHERE id = '_104_02';

-- 3. 更新角色管理
UPDATE nex_menu SET title = 'menu.system.role.default' WHERE id = '_104_03';

-- 4. 更新用户管理
UPDATE nex_menu SET title = 'menu.system.user.default' WHERE id = '_104_04';

-- 5. 更新审计日志
UPDATE nex_menu SET title = 'menu.system.audit.default' WHERE id = '_104_05';

-- 6. 更新参数配置
UPDATE nex_menu SET title = 'menu.system.config.default' WHERE id = '_104_06';

-- 7. 更新权限配置
UPDATE nex_menu SET title = 'menu.system.permission.default' WHERE id = '_104_07';

-- 8. 更新在线管理
UPDATE nex_menu SET title = 'menu.system.device.default' WHERE id = '_104_08';

-- ============================================
-- 第三部分：验证更新结果
-- ============================================

SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE parent_id = '_104'
ORDER BY sort;

-- ============================================
-- 第四部分：更新菜单版本号，触发前端重新获取菜单
-- ============================================

UPDATE nex_menu SET update_time = NOW() WHERE id = '_104';
