-- ============================================
-- 删除设备状态下多余的按钮权限
-- ============================================

-- 1. 先查询一下设备状态下面的按钮权限数据
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE parent_id = '_102_01' AND type = 'button'
ORDER BY sort;

-- 2. 删除角色权限关联表中对应的记录
DELETE FROM nex_role_menu
WHERE menu_id IN (
  SELECT id FROM nex_menu WHERE parent_id = '_102_01' AND type = 'button'
);

-- 3. 删除菜单表中设备状态下面的按钮权限数据
DELETE FROM nex_menu
WHERE parent_id = '_102_01' AND type = 'button';

-- 4. 再次查询，确认删除成功
SELECT id, parent_id, name, title, permission_code, type, sort
FROM nex_menu
WHERE parent_id = '_102_01'
ORDER BY sort;

-- 5. 更新菜单版本号（触发前端重新获取菜单）
UPDATE nex_menu SET update_time = NOW() WHERE id = '_102';
