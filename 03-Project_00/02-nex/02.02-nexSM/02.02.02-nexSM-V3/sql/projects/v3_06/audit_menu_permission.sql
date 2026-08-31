-- ============================================
-- 审计日志页面按钮权限配置
-- ============================================

-- 1. 先查询一下审计日志页面的菜单id
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE parent_id = '_104' AND (name LIKE '%audit%' OR title LIKE '%审计%' OR permission_code LIKE '%audit%')
ORDER BY sort;

-- 2. 查询审计日志页面下面是否已经有按钮权限数据
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE parent_id = '_104_05' AND type = 'button'
ORDER BY sort;

-- 3. 如果没有按钮权限数据，就插入按钮权限数据
-- 注意：请先执行上面的查询，确认审计日志页面的菜单id是 _104_05
-- 如果菜单id不是 _104_05，请修改下面的INSERT语句中的parent_id

-- 按钮1：搜索/重置/刷新权限（合并为一个）
-- INSERT INTO nex_menu (id, parent_id, name, title, permission_code, type, sort, create_time, update_time)
-- VALUES ('_104_05_01', '_104_05', 'search', 'menu.system.audit.search', 'system:audit:search', 'button', 1, NOW(), NOW());

-- 按钮2：导出权限
-- INSERT INTO nex_menu (id, parent_id, name, title, permission_code, type, sort, create_time, update_time)
-- VALUES ('_104_05_02', '_104_05', 'export', 'menu.system.audit.export', 'system:audit:export', 'button', 2, NOW(), NOW());

-- 4. 为系统管理员角色添加按钮权限关联记录
-- 注意：请先执行上面的INSERT语句，然后再执行下面的INSERT语句

-- INSERT INTO nex_role_menu (role_id, menu_id, create_time)
-- VALUES (1, '_104_05_01', NOW());

-- INSERT INTO nex_role_menu (role_id, menu_id, create_time)
-- VALUES (1, '_104_05_02', NOW());

-- 5. 更新菜单版本号（触发前端重新获取菜单）
UPDATE nex_menu SET update_time = NOW() WHERE id = '_104';
