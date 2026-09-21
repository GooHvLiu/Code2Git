/**
 * ==========================================
 * 权限配置核心逻辑 Composable
 * ==========================================
 * 封装角色列表加载、权限树裁剪/筛选/勾选、保存等通用逻辑，
 * 可被「系统设置 - 权限配置」与「超级面板 - 权限」两个入口复用。
 *
 * 用法：
 *   const props = defineProps<PermissionConfigProps>()
 *   const pc = usePermissionConfig(props)
 *   onMounted(pc.init)
 * 作者：GooHv
 */
import { ref, computed, nextTick } from 'vue'
import { showSuccess } from '@/utils/ui/feedback'
import {
  requestGetRoleAllApi,
  requestGetAllPermissionsApi,
  requestGetRoleMenuIdsApi,
  requestSaveRolePermissionsApi
} from '@/api'
import {
  scopeSuperOnlyNodes,
  filterTreeByType,
  countNodesByType
} from '../utils/permissionTree'
import type { PermissionNode, Role } from '@/types/system'

/** 组件 Props（与 permission-core/index.vue 对齐） */
export interface PermissionConfigProps {
  /** 模式：system（系统设置）/ super（超级面板） */
  mode?: 'system' | 'super'
  /** 是否显示超级管理员角色 */
  showSuperAdmin?: boolean
  /** 是否显示超级面板相关权限（superOnly 节点） */
  showSuperPermissions?: boolean
  /** 标题 i18n key */
  titleKey?: string
  /** 描述 i18n key */
  descKey?: string
  /** 保存成功提示 i18n key */
  saveSuccessKey?: string
}

/** el-tree 内部 store 的最小结构（仅声明本模块用到的成员） */
interface TreeNode {
  expanded: boolean
  [key: string]: unknown
}
interface PermissionTreeExposed {
  getCheckedKeys(): Array<string | number>
  getHalfCheckedKeys(): Array<string | number>
  setCheckedKeys(keys: Array<string | number>): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setChecked(node: any, checked: boolean, deep?: boolean): void
  store: {
    checkStrictly: boolean
    nodesMap: Record<string | number, TreeNode>
  }
}

export function usePermissionConfig(props: PermissionConfigProps) {
  // ===== 响应式数据 =====
  const loading = ref(false)
  const saving = ref(false)
  const roleLoading = ref(false)

  const roleList = ref<Role[]>([])
  const currentRole = ref<Role | null>(null)

  // el-tree 组件实例（内部 store 访问按收窄类型处理）
  const permissionTree = ref<PermissionTreeExposed | null>(null)
  const allPermissions = ref<PermissionNode[]>([])
  /** 原始已选 keys（用于判断是否有修改） */
  const originalCheckedKeys = ref<Array<string | number>>([])
  const filterType = ref<'all' | 'menu' | 'button' | 'param'>('all')

  /** el-tree 节点字段映射 */
  const treeProps = {
    id: 'id',
    label: 'name',
    children: 'children'
  }

  // ===== 计算属性 =====

  /** 可见角色列表（showSuperAdmin=false 时过滤超级管理员） */
  const visibleRoles = computed<Role[]>(() => {
    if (props.showSuperAdmin) return roleList.value
    return roleList.value.filter((r) => Number(r.is_super_admin) !== 1)
  })

  /** 当前正在配置的角色是否为超级管理员 */
  const isConfiguringSuperRole = computed<boolean>(
    () => Number(currentRole.value?.is_super_admin) === 1
  )

  /** 根据当前配置角色裁剪超级专属节点 */
  const roleScopedTreeData = computed<PermissionNode[]>(() => {
    const keepSuper = !!(props.showSuperPermissions && isConfiguringSuperRole.value)
    return scopeSuperOnlyNodes(allPermissions.value, keepSuper)
  })

  /** 过滤后的树形数据（先按角色裁剪，再按类型筛选） */
  const filteredTreeData = computed<PermissionNode[]>(() => {
    if (filterType.value === 'all') return roleScopedTreeData.value
    return filterTreeByType(roleScopedTreeData.value, filterType.value)
  })

  /** 已选节点数量（含半选父节点） */
  const checkedCount = computed<number>(() => {
    if (!permissionTree.value) return 0
    const checked = permissionTree.value.getCheckedKeys() || []
    const halfChecked = permissionTree.value.getHalfCheckedKeys() || []
    return checked.length + halfChecked.length
  })

  /** 按类型统计已选数量 */
  const menuCheckedCount = computed(() => countCheckedByType('menu'))
  const buttonCheckedCount = computed(() => countCheckedByType('button'))
  const paramCheckedCount = computed(() => countCheckedByType('param'))

  /** 是否有修改 */
  const hasChanges = computed<boolean>(() => {
    if (!permissionTree.value) return false
    const currentChecked = permissionTree.value.getCheckedKeys() || []
    if (currentChecked.length !== originalCheckedKeys.value.length) return true
    return !currentChecked.every((key) => originalCheckedKeys.value.includes(key))
  })

  // ===== 方法 =====

  /** 统计指定类型的已选数量 */
  function countCheckedByType(type: string): number {
    if (!permissionTree.value) return 0
    const checked = permissionTree.value.getCheckedKeys() || []
    const halfChecked = permissionTree.value.getHalfCheckedKeys() || []
    const allKeys = [...checked, ...halfChecked]
    return countNodesByType(allPermissions.value, type, allKeys)
  }

  /** 加载角色列表，默认选中第一个可见角色 */
  async function loadRoleList(): Promise<void> {
    roleLoading.value = true
    try {
      const res = await requestGetRoleAllApi()
      roleList.value = Array.isArray(res.data) ? (res.data as Role[]) : []
      if (visibleRoles.value.length > 0 && !currentRole.value) {
        await handleSelectRole(visibleRoles.value[0])
      }
    } catch {
      // 错误已由拦截器统一处理
    } finally {
      roleLoading.value = false
    }
  }

  /** 加载所有权限列表 */
  async function loadAllPermissions(): Promise<void> {
    loading.value = true
    try {
      const res = await requestGetAllPermissionsApi()
      allPermissions.value = ((res.data as { permissions?: PermissionNode[] })?.permissions) || []
    } catch {
      // 错误已由拦截器统一处理
    } finally {
      loading.value = false
    }
  }

  /** 加载角色已分配的权限，精确回显选中状态 */
  async function loadRolePermissions(roleId: string | number): Promise<void> {
    try {
      const res = await requestGetRoleMenuIdsApi(String(roleId))
      const menuIds = ((res.data as { menuIds?: Array<string | number> })?.menuIds) || []

      originalCheckedKeys.value = [...menuIds]
      await nextTick()
      if (permissionTree.value) {
        const treeEl = permissionTree.value
        // 关键：先禁用父子节点关联，精确设置每个节点的选中状态
        const oldCheckStrictly = treeEl.store.checkStrictly
        treeEl.store.checkStrictly = true

        treeEl.setCheckedKeys([])
        menuIds.forEach((id) => {
          const node = treeEl.store.nodesMap[id]
          if (node) treeEl.setChecked(node, true, false)
        })

        treeEl.store.checkStrictly = oldCheckStrictly
        await nextTick()
      }
    } catch {
      // 错误已由拦截器统一处理
    }
  }

  /** 选择角色 */
  async function handleSelectRole(role: Role): Promise<void> {
    currentRole.value = role
    filterType.value = 'all'
    await loadRolePermissions(role.id)
  }

  /** 勾选变化（仅触发计算属性更新） */
  function handleCheckChange(): void {
    // no-op
  }

  /** 类型筛选：恢复原始选中状态并自动展开 */
  function handleFilterType(): void {
    if (!permissionTree.value) return
    setTimeout(() => {
      if (!permissionTree.value) return
      const treeEl = permissionTree.value
      treeEl.setCheckedKeys([])
      originalCheckedKeys.value.forEach((id) => {
        const node = treeEl.store.nodesMap[id]
        if (node) treeEl.setChecked(node, true, false)
      })
      Object.keys(treeEl.store.nodesMap).forEach((key) => {
        treeEl.store.nodesMap[key].expanded = true
      })
    }, 100)
  }

  /** 展开全部 */
  function handleExpandAll(): void {
    if (!permissionTree.value) return
    Object.keys(permissionTree.value.store.nodesMap).forEach((key) => {
      permissionTree.value!.store.nodesMap[key].expanded = true
    })
  }

  /** 折叠全部 */
  function handleCollapseAll(): void {
    if (!permissionTree.value) return
    Object.keys(permissionTree.value.store.nodesMap).forEach((key) => {
      permissionTree.value!.store.nodesMap[key].expanded = false
    })
  }

  /** 刷新 */
  async function handleRefresh(): Promise<void> {
    await Promise.all([loadRoleList(), loadAllPermissions()])
    if (currentRole.value) {
      await loadRolePermissions(currentRole.value.id)
    }
  }

  /** 重置为数据库原始选中状态 */
  async function handleReset(): Promise<void> {
    if (!currentRole.value) return
    await loadRolePermissions(currentRole.value.id)
  }

  /** 保存（全量覆盖，含半选父节点） */
  async function handleSave(successKey?: string): Promise<void> {
    if (!currentRole.value || !permissionTree.value) return

    const checkedKeys = permissionTree.value.getCheckedKeys() || []
    const halfCheckedKeys = permissionTree.value.getHalfCheckedKeys() || []
    const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]

    saving.value = true
    try {
      await requestSaveRolePermissionsApi({
        roleId: currentRole.value.id,
        roleCode: currentRole.value.role_code,
        menuIds: allCheckedKeys
      })
      originalCheckedKeys.value = [...allCheckedKeys]
      showSuccess((successKey || 'system.permission.page.saveSuccess') as string)
    } catch {
      // 错误已由拦截器统一处理
    } finally {
      saving.value = false
    }
  }

  /** 初始化（先加载权限树，再加载角色，确保回显正确） */
  async function init(): Promise<void> {
    await loadAllPermissions()
    await loadRoleList()
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
    init
  }
}
