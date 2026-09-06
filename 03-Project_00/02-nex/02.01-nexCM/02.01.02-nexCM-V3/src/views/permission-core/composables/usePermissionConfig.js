/**
 * 权限配置核心逻辑 Composable
 * 封装角色列表加载、权限树处理、保存等通用逻辑
 * 可被系统设置和超级面板两个入口复用
 */
import { ref, computed, nextTick } from "vue";
import { Message } from "element-ui";
import i18n from "@/i18n";
import {
  requestGetRoleAllApi,
  requestGetAllPermissionsApi,
  requestGetRoleMenuIdsApi,
  requestSaveRolePermissionsApi,
} from "@/api";
import {
  scopeSuperOnlyNodes,
  filterTreeByType,
  countNodesByType,
} from "../utils/permissionTree";

export function usePermissionConfig(props = {}) {
  // ===== 响应式数据 =====
  const loading = ref(false);
  const saving = ref(false);
  const roleLoading = ref(false);

  // 角色列表
  const roleList = ref([]);
  const currentRole = ref(null);

  // 权限树
  const permissionTree = ref(null);
  const allPermissions = ref([]);
  const originalCheckedKeys = ref([]); // 原始已选 keys（用于判断是否有修改）
  const filterType = ref("all");

  // 树形配置
  const treeProps = {
    id: "id",
    label: "name",
    children: "children",
  };

  // ===== 计算属性 =====

  /**
   * 可见角色列表（根据 showSuperAdmin 过滤超级管理员）
   */
  const visibleRoles = computed(() => {
    if (props.showSuperAdmin) return roleList.value;
    return roleList.value.filter((r) => Number(r.is_super_admin) !== 1);
  });

  /**
   * 当前正在配置的角色是否为超级管理员（依据数据库 is_super_admin 字段）
   */
  const isConfiguringSuperRole = computed(
    () => Number(currentRole.value?.is_super_admin) === 1
  );

  /**
   * 根据当前配置角色裁剪超级专属节点
   */
  const roleScopedTreeData = computed(() => {
    // showSuperPermissions=false 时，直接剔除所有 superOnly 节点
    // showSuperPermissions=true 时，配置超管角色保留但禁用，配置其他角色剔除
    const keepSuper =
      props.showSuperPermissions && isConfiguringSuperRole.value;
    return scopeSuperOnlyNodes(allPermissions.value, keepSuper);
  });

  /** 过滤后的树形数据（先按角色裁剪超级专属节点，再按类型筛选） */
  const filteredTreeData = computed(() => {
    if (filterType.value === "all") return roleScopedTreeData.value;
    return filterTreeByType(roleScopedTreeData.value, filterType.value);
  });

  /** 已选中的节点数量（包含半选父节点的所有子节点） */
  const checkedCount = computed(() => {
    if (!permissionTree.value) return 0;
    const checked = permissionTree.value.getCheckedKeys() || [];
    const halfChecked = permissionTree.value.getHalfCheckedKeys() || [];
    return checked.length + halfChecked.length;
  });

  /** 按类型统计已选中数量 */
  const menuCheckedCount = computed(() => countCheckedByType("menu"));
  const buttonCheckedCount = computed(() => countCheckedByType("button"));
  const paramCheckedCount = computed(() => countCheckedByType("param"));

  /** 是否有修改 */
  const hasChanges = computed(() => {
    if (!permissionTree.value) return false;
    const currentChecked = permissionTree.value.getCheckedKeys() || [];
    if (currentChecked.length !== originalCheckedKeys.value.length) return true;
    return !currentChecked.every((key) =>
      originalCheckedKeys.value.includes(key)
    );
  });

  // ===== 方法 =====

  /** 统计指定类型的已选中数量 */
  function countCheckedByType(type) {
    if (!permissionTree.value) return 0;
    const checked = permissionTree.value.getCheckedKeys() || [];
    const halfChecked = permissionTree.value.getHalfCheckedKeys() || [];
    const allKeys = [...checked, ...halfChecked];
    return countNodesByType(allPermissions.value, type, allKeys);
  }

  /** 加载角色列表 */
  async function loadRoleList() {
    roleLoading.value = true;
    try {
      const res = await requestGetRoleAllApi();
      roleList.value = Array.isArray(res.data) ? res.data : [];
      // 默认选中第一个可见角色
      if (visibleRoles.value.length > 0 && !currentRole.value) {
        await handleSelectRole(visibleRoles.value[0]);
      }
    } catch (e) {
      // 错误已由拦截器处理
    } finally {
      roleLoading.value = false;
    }
  }

  /** 加载所有权限列表 */
  async function loadAllPermissions() {
    loading.value = true;
    try {
      const res = await requestGetAllPermissionsApi();
      allPermissions.value = res.data?.permissions || [];
    } catch (e) {
      // 错误已由拦截器处理
    } finally {
      loading.value = false;
    }
  }

  /** 加载角色已分配的权限 */
  async function loadRolePermissions(roleId) {
    try {
      const res = await requestGetRoleMenuIdsApi(roleId);
      const menuIds = res.data?.menuIds || [];

      originalCheckedKeys.value = [...menuIds];
      await nextTick();
      if (permissionTree.value) {
        // 关键修复：先禁用父子节点关联，精确设置每个节点的选中状态
        const treeEl = permissionTree.value;
        const oldCheckStrictly = treeEl.store.checkStrictly;
        treeEl.store.checkStrictly = true;

        // 先清空所有选中状态
        treeEl.setCheckedKeys([]);

        // 逐个设置节点的选中状态，确保精确控制
        menuIds.forEach((id) => {
          const node = treeEl.store.nodesMap[id];
          if (node) {
            treeEl.setChecked(node, true, false);
          }
        });

        // 恢复父子节点关联
        treeEl.store.checkStrictly = oldCheckStrictly;

        // 确保 DOM 更新完成
        await nextTick();
      }
    } catch (e) {
      // 错误已由拦截器处理
    }
  }

  /** 选择角色 */
  async function handleSelectRole(role) {
    currentRole.value = role;
    filterType.value = "all";
    await loadRolePermissions(role.id);
  }

  /** 勾选变化 */
  function handleCheckChange() {
    // 触发计算属性更新
  }

  /** 类型筛选 */
  function handleFilterType() {
    // 类型切换时，恢复数据库中的原始选中状态并自动展开所有节点
    if (!permissionTree.value) return;
    setTimeout(() => {
      if (!permissionTree.value) return;
      const treeEl = permissionTree.value;
      // 先清空所有选中状态
      treeEl.setCheckedKeys([]);
      // 使用数据库中的原始选中状态逐个设置
      originalCheckedKeys.value.forEach((id) => {
        const node = treeEl.store.nodesMap[id];
        if (node) {
          treeEl.setChecked(node, true, false);
        }
      });
      // 自动展开所有节点
      const nodes = treeEl.store.nodesMap;
      Object.keys(nodes).forEach((key) => {
        nodes[key].expanded = true;
      });
    }, 100);
  }

  /** 展开全部 */
  function handleExpandAll() {
    if (!permissionTree.value) return;
    const nodes = permissionTree.value.store.nodesMap;
    Object.keys(nodes).forEach((key) => {
      nodes[key].expanded = true;
    });
  }

  /** 折叠全部 */
  function handleCollapseAll() {
    if (!permissionTree.value) return;
    const nodes = permissionTree.value.store.nodesMap;
    Object.keys(nodes).forEach((key) => {
      nodes[key].expanded = false;
    });
  }

  /** 刷新 */
  async function handleRefresh() {
    await Promise.all([loadRoleList(), loadAllPermissions()]);
    if (currentRole.value) {
      await loadRolePermissions(currentRole.value.id);
    }
  }

  /** 重置 */
  async function handleReset() {
    if (!currentRole.value) return;
    await loadRolePermissions(currentRole.value.id);
  }

  /** 保存 */
  async function handleSave(successKey) {
    if (!currentRole.value) return;
    if (!permissionTree.value) return;

    const checkedKeys = permissionTree.value.getCheckedKeys() || [];
    const halfCheckedKeys = permissionTree.value.getHalfCheckedKeys() || [];
    // 半选的父节点也需要保存（因为它的子节点被选中了）
    const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys];

    saving.value = true;
    try {
      await requestSaveRolePermissionsApi({
        roleId: currentRole.value.id,
        roleCode: currentRole.value.role_code,
        menuIds: allCheckedKeys,
      });
      originalCheckedKeys.value = [...allCheckedKeys];
      Message.success(i18n.t(successKey || "common.saveSuccess"));
    } catch (e) {
      // 错误已由拦截器处理
    } finally {
      saving.value = false;
    }
  }

  /** 初始化（先加载权限树，再加载角色，确保选中状态能正确设置） */
  async function init() {
    await loadAllPermissions();
    await loadRoleList();
  }

  return {
    // 数据
    loading,
    saving,
    roleLoading,
    roleList,
    currentRole,
    permissionTree,
    allPermissions,
    originalCheckedKeys,
    filterType,
    treeProps,
    // 计算属性
    visibleRoles,
    isConfiguringSuperRole,
    roleScopedTreeData,
    filteredTreeData,
    checkedCount,
    menuCheckedCount,
    buttonCheckedCount,
    paramCheckedCount,
    hasChanges,
    // 方法
    loadRoleList,
    loadAllPermissions,
    loadRolePermissions,
    handleSelectRole,
    handleCheckChange,
    handleFilterType,
    handleExpandAll,
    handleCollapseAll,
    handleRefresh,
    handleReset,
    handleSave,
    init,
  };
}
