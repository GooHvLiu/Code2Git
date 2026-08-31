-- ============================================
-- 检查并恢复配方管理的下载按钮权限（修正版）
-- ============================================

-- 1. 先查询一下nex_menu表的结构，确认有哪些字段
DESCRIBE nex_menu;

-- 2. 先查询一下配方管理下面的按钮权限数据
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE parent_id = '_103_01'
ORDER BY sort;

-- 3. 如果下载按钮被删除了，就重新插入下载按钮
-- 注意：请先执行上面的查询，确认下载按钮是否被删除了
-- 如果下载按钮被删除了，请根据实际的表结构执行下面的INSERT语句

-- 方式1：只包含必要的字段（推荐）
-- INSERT INTO nex_menu (id, parent_id, name, title, permission_code, type, sort, create_time, update_time)
-- VALUES ('_103_01_01', '_103_01', 'download', 'menu.production.recipe.download', 'production:recipe:download', 'button', 1, NOW(), NOW());

-- 方式2：如果表中有icon、path、component、status等字段，可以包含这些字段
-- INSERT INTO nex_menu (id, parent_id, name, title, permission_code, type, sort, icon, path, component, status, create_time, update_time)
-- VALUES ('_103_01_01', '_103_01', 'download', 'menu.production.recipe.download', 'production:recipe:download', 'button', 1, '', '', '', 1, NOW(), NOW());

-- 4. 查询角色权限关联表中是否有下载按钮的关联记录
SELECT * FROM nex_role_menu WHERE menu_id = '_103_01_01';

-- 5. 如果角色权限关联表中没有下载按钮的关联记录，就为系统管理员角色添加下载按钮的关联记录
-- 注意：请先执行上面的查询，确认是否需要添加关联记录
-- 如果需要添加关联记录，请执行下面的INSERT语句

-- INSERT INTO nex_role_menu (role_id, menu_id, create_time)
-- VALUES (1, '_103_01_01', NOW());

-- 6. 更新菜单版本号（触发前端重新获取菜单）
UPDATE nex_menu SET update_time = NOW() WHERE id = '_103';
