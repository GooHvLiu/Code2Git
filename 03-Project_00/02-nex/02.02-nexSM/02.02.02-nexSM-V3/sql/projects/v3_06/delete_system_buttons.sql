-- ============================================
-- 删除字典管理、部门管理、角色管理、用户管理下面的按钮权限
-- ============================================

-- 1. 先查询一下这些页面下面的按钮权限数据
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE parent_id IN ('_104_01', '_104_02', '_104_03', '_104_04') AND type = 'button'
ORDER BY parent_id, sort;

-- 2. 删除角色权限关联表中对应的记录
DELETE FROM nex_role_menu
WHERE menu_id IN (
  SELECT id FROM nex_menu
  WHERE parent_id IN ('_104_01', '_104_02', '_104_03', '_104_04') AND type = 'button'
);

-- 3. 删除菜单表中这些页面下面的按钮权限数据
DELETE FROM nex_menu
WHERE parent_id IN ('_104_01', '_104_02', '_104_03', '_104_04') AND type = 'button';

-- 4. 再次查询，确认删除成功
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE parent_id IN ('_104_01', '_104_02', '_104_03', '_104_04')
ORDER BY parent_id, sort;

-- 5. 更新菜单版本号（触发前端重新获取菜单）
UPDATE nex_menu SET update_time = NOW() WHERE id = '_104';
