<template>
  <div class="permission-config-page">
    <!-- 顶部标题栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ $t("menu.system.permission.page.title") }}
        </h2>
        <p class="page-desc">{{ $t("menu.system.permission.page.desc") }}</p>
      </div>
      <div class="header-right">
        <el-tooltip
          :content="$t('menu.system.permission.page.expandAll')"
          placement="bottom"
        >
          <el-button
            icon="el-icon-arrow-down"
            circle
            @click="handleExpandAll"
          />
        </el-tooltip>
        <el-tooltip
          :content="$t('menu.system.permission.page.collapseAll')"
          placement="bottom"
        >
          <el-button
            icon="el-icon-arrow-right"
            circle
            @click="handleCollapseAll"
          />
        </el-tooltip>
        <el-tooltip :content="$t('common.refresh')" placement="bottom">
          <el-button
            icon="el-icon-refresh"
            circle
            @click="handleRefresh"
            :loading="loading"
          />
        </el-tooltip>
      </div>
    </div>

    <!-- 主体内容：左右布局 -->
    <div class="page-body">
      <!-- 左侧：角色列表 -->
      <div class="role-panel">
        <div class="panel-header">
          <span class="panel-title">
            <i class="el-icon-user-solid" />
            {{ $t("menu.system.permission.page.roleList") }}
          </span>
          <el-tag size="mini" type="info">{{ roleList.length }}</el-tag>
        </div>
        <div class="role-list" v-loading="roleLoading">
          <div
            v-for="role in roleList"
            :key="role.id"
            class="role-item"
            :class="{ active: currentRole?.id === role.id }"
            @click="handleSelectRole(role)"
          >
            <svg-icon
              :icon-file-name="getRoleAvatarIcon(role)"
              class="role-avatar-icon"
            />
            <div class="role-info">
              <div class="role-name">{{ getRoleName(role) }}</div>
              <div class="role-code">{{ role.role_code }}</div>
            </div>
            <el-tag
              v-if="currentRole?.id === role.id"
              size="mini"
              type="success"
              effect="dark"
            >
              {{ $t("menu.system.permission.page.current") }}
            </el-tag>
          </div>
          <div v-if="!roleLoading && roleList.length === 0" class="empty-tip">
            <i class="el-icon-user-solid empty-icon" />
            <p class="empty-text">
              {{ $t("menu.system.permission.page.noRole") }}
            </p>
          </div>
        </div>
      </div>

      <!-- 右侧：权限配置 -->
      <div class="permission-panel">
        <div class="panel-header">
          <div class="panel-title">
            <i class="el-icon-menu" />
            {{ $t("menu.system.permission.page.permissionTree") }}
            <span v-if="currentRole" class="current-role-name">
              - {{ getRoleName(currentRole) }}
            </span>
          </div>
          <div class="panel-actions">
            <!-- 类型筛选 -->
            <el-radio-group
              v-model="filterType"
              size="small"
              @change="handleFilterType"
            >
              <el-radio-button label="all">{{
                $t("menu.system.permission.page.all")
              }}</el-radio-button>
              <el-radio-button label="menu">{{
                $t("menu.system.permission.page.menu")
              }}</el-radio-button>
              <el-radio-button label="button">{{
                $t("menu.system.permission.page.button")
              }}</el-radio-button>
              <el-radio-button label="param">{{
                $t("menu.system.permission.page.param")
              }}</el-radio-button>
            </el-radio-group>
            <!-- 搜索框 -->
            <el-input
              v-model="searchKeyword"
              :placeholder="$t('menu.system.permission.page.searchPlaceholder')"
              prefix-icon="el-icon-search"
              size="small"
              clearable
              style="width: 220px"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- 权限树形结构 -->
        <div class="permission-tree-wrapper" v-loading="loading">
          <div v-if="!currentRole" class="empty-tip empty-tip-large">
            <i class="el-icon-menu empty-icon" />
            <p class="empty-text">
              {{ $t("menu.system.permission.page.selectRoleTip") }}
            </p>
          </div>
          <el-tree
            v-else
            ref="permissionTree"
            :data="filteredTreeData"
            :props="treeProps"
            :node-key="treeProps.id"
            show-checkbox
            :check-strictly="true"
            :default-expand-all="false"
            :expand-on-click-node="false"
            :check-on-click-node="false"
            @check="handleCheckChange"
          >
            <span class="custom-tree-node" slot-scope="{ data }">
              <span class="node-icon" :class="getNodeIconClass(data)">
                <i :class="getNodeIcon(data)" />
              </span>
              <span class="node-label" :title="resolveMenuTitle(data.title)">
                {{ resolveMenuTitle(data.title) }}
              </span>
              <span class="node-type-tag" :class="`tag-${data.type}`">
                {{ getTypeName(data.type) }}
              </span>
              <span
                v-if="data.permissionCode"
                class="node-code"
                :title="data.permissionCode"
              >
                {{ data.permissionCode }}
              </span>
            </span>
          </el-tree>
        </div>

        <!-- 底部统计和操作栏 -->
        <div class="panel-footer" v-if="currentRole">
          <div class="stats-info">
            <span class="stat-item">
              <i class="el-icon-s-check" />
              {{ $t("menu.system.permission.page.selected") }}:
              <b>{{ checkedCount }}</b>
            </span>
            <span class="stat-item stat-menu">
              <i class="el-icon-menu" />
              {{ $t("menu.system.permission.page.menu") }}:
              <b>{{ menuCheckedCount }}</b>
            </span>
            <span class="stat-item stat-button">
              <i class="el-icon-thumb" />
              {{ $t("menu.system.permission.page.button") }}:
              <b>{{ buttonCheckedCount }}</b>
            </span>
            <span class="stat-item stat-param">
              <i class="el-icon-setting" />
              {{ $t("menu.system.permission.page.param") }}:
              <b>{{ paramCheckedCount }}</b>
            </span>
          </div>
          <div class="footer-actions">
            <el-button @click="handleReset" :disabled="!hasChanges">
              <i class="el-icon-refresh-left" />
              {{ $t("common.reset") }}
            </el-button>
            <el-button
              type="primary"
              @click="handleSave"
              :loading="saving"
              :disabled="!hasChanges"
            >
              <i class="el-icon-check" />
              {{ $t("common.save") }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { Message, MessageBox } from "element-ui";
import { resolveMenuTitle } from "@/router/helper/menuTitle";
import i18n from "@/i18n";
import {
  requestGetRoleAllApi,
  requestGetAllPermissionsApi,
  requestGetRoleMenuIdsApi,
  requestSaveRolePermissionsApi,
} from "@/api";

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
const searchKeyword = ref("");
const filterType = ref("all");

// 树形配置
const treeProps = {
  id: "id",
  label: "name",
  children: "children",
};

// ===== 计算属性 =====

/** 过滤后的树形数据（根据类型筛选） */
const filteredTreeData = computed(() => {
  if (filterType.value === "all") return allPermissions.value;
  return filterTreeByType(allPermissions.value, filterType.value);
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

/** 按类型过滤树形数据 */
function filterTreeByType(tree, type) {
  if (!Array.isArray(tree)) return [];
  return tree
    .map((node) => {
      const children = node.children
        ? filterTreeByType(node.children, type)
        : [];
      // 如果当前节点类型匹配，或者有子节点匹配，则保留
      if (node.type === type || children.length > 0) {
        return { ...node, children };
      }
      return null;
    })
    .filter(Boolean);
}

/** 统计指定类型的已选中数量 */
function countCheckedByType(type) {
  if (!permissionTree.value) return 0;
  const checked = permissionTree.value.getCheckedKeys() || [];
  const halfChecked = permissionTree.value.getHalfCheckedKeys() || [];
  const allKeys = [...checked, ...halfChecked];
  // 遍历所有节点，统计类型匹配且已选中的数量
  return countNodesByType(allPermissions.value, type, allKeys);
}

function countNodesByType(nodes, type, keys) {
  let count = 0;
  nodes.forEach((node) => {
    if (node.type === type && keys.includes(node.id)) count++;
    if (node.children && node.children.length > 0) {
      count += countNodesByType(node.children, type, keys);
    }
  });
  return count;
}

/** 获取角色名称（支持多语言） */
function getRoleName(role) {
  if (!role) return "";
  if (typeof role.role_name === "object") {
    return role.role_name["zh-CN"] || role.role_name["en-US"] || "";
  }
  return role.role_name || "";
}

/**
 * 根据角色编码获取头像图标文件名
 * 与右上角用户头像保持一致的图标映射
 * administrator → administrator.svg
 * operator → operator.svg
 * engineer → engineer.svg
 * user → user.svg
 * 其他/未匹配 → who.svg（默认）
 */
function getRoleAvatarIcon(role) {
  const roleMap = {
    administrator: "administrator",
    operator: "operator",
    engineer: "engineer",
    user: "user",
    viewer: "user",
  };
  const code = role?.role_code || "";
  return roleMap[code] || "who";
}

/** 获取节点图标 */
function getNodeIcon(data) {
  switch (data.type) {
    case "menu":
      return "el-icon-folder";
    case "button":
      return "el-icon-thumb";
    case "param":
      return "el-icon-setting";
    default:
      return "el-icon-document";
  }
}

/** 获取节点图标样式类 */
function getNodeIconClass(data) {
  return `icon-${data.type || "default"}`;
}

/** 获取类型名称 */
function getTypeName(type) {
  const map = {
    menu: i18n.t("menu.system.permission.page.menu"),
    button: i18n.t("menu.system.permission.page.button"),
    param: i18n.t("menu.system.permission.page.param"),
  };
  return map[type] || type;
}

/** 加载角色列表 */
async function loadRoleList() {
  roleLoading.value = true;
  try {
    const res = await requestGetRoleAllApi();
    roleList.value = Array.isArray(res.data) ? res.data : [];
    // 默认选中第一个角色
    if (roleList.value.length > 0 && !currentRole.value) {
      await handleSelectRole(roleList.value[0]);
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
/** 加载角色已分配的权限 */
/** 加载角色已分配的权限 */
async function loadRolePermissions(roleId) {
  try {
    const res = await requestGetRoleMenuIdsApi(roleId);
    const menuIds = res.data?.menuIds || [];

    originalCheckedKeys.value = [...menuIds];
    await nextTick();
    if (permissionTree.value) {
      // 关键修复：先禁用父子节点关联，精确设置每个节点的选中状态
      // 否则如果父节点被选中，tree 组件会自动选中所有子节点
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
/** 选择角色 */
async function handleSelectRole(role) {
  currentRole.value = role;
  searchKeyword.value = "";
  filterType.value = "all";
  await loadRolePermissions(role.id);
}

/** 勾选变化 */
function handleCheckChange() {
  // 触发计算属性更新
}

/** 搜索 */
function handleSearch(value) {
  if (!permissionTree.value) return;
  permissionTree.value.filter(value);
  // 搜索时自动展开匹配的节点
  if (value) {
    nextTick(() => {
      const nodes = permissionTree.value.store.nodesMap;
      Object.keys(nodes).forEach((key) => {
        const node = nodes[key];
        if (node.visible !== false) {
          node.expanded = true;
        }
      });
    });
  }
}

/** 类型筛选 */
function handleFilterType() {
  // 类型切换时，保留已选状态
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
  await loadAllPermissions();
  if (currentRole.value) {
    await loadRolePermissions(currentRole.value.id);
  }
  Message.success(i18n.t("menu.system.permission.page.refreshSuccess"));
}

/** 重置 */
async function handleReset() {
  if (!currentRole.value) return;
  try {
    await MessageBox.confirm(
      i18n.t("menu.system.permission.page.resetConfirm"),
      i18n.t("common.tip"),
      {
        confirmButtonText: i18n.t("common.confirm"),
        cancelButtonText: i18n.t("common.cancel"),
        type: "warning",
      }
    );
    await loadRolePermissions(currentRole.value.id);
    Message.success(i18n.t("menu.system.permission.page.resetSuccess"));
  } catch (e) {
    // 用户取消
  }
}

/** 保存 */
/** 保存 */
async function handleSave() {
  if (!currentRole.value) return;
  if (!permissionTree.value) return;

  const checkedKeys = permissionTree.value.getCheckedKeys() || [];
  const halfCheckedKeys = permissionTree.value.getHalfCheckedKeys() || [];
  // 半选的父节点也需要保存（因为它的子节点被选中了）
  const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys];

  // [调试] 打印保存的权限信息

  saving.value = true;
  try {
    await requestSaveRolePermissionsApi({
      roleId: currentRole.value.id,
      roleCode: currentRole.value.role_code,
      menuIds: allCheckedKeys,
    });
    originalCheckedKeys.value = [...allCheckedKeys];
    Message.success(i18n.t("menu.system.permission.page.saveSuccess"));
  } catch (e) {
    // 错误已由拦截器处理
  } finally {
    saving.value = false;
  }
}

// ===== 初始化 =====
loadRoleList();
loadAllPermissions();
</script>

<style scoped lang="less">
.permission-config-page {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 顶部标题栏 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .header-left {
    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;

      .title-icon {
        color: #409eff;
        margin-right: 8px;
        font-size: 20px;
      }
    }

    .page-desc {
      margin: 6px 0 0 28px;
      font-size: 13px;
      color: #909399;
    }
  }

  .header-right {
    display: flex;
    gap: 8px;
  }
}

/* 主体内容 */
.page-body {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
}

/* 左侧角色面板 */
.role-panel {
  width: 280px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 1px solid #ebeef5;

    .panel-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;
      gap: 6px;

      i {
        color: #409eff;
      }
    }
  }

  .role-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;

    .role-item {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 4px;

      &:hover {
        background: #f5f7fa;
      }

      &.active {
        background: #ecf5ff;
        border: 1px solid #b3d8ff;

        .role-name {
          color: #409eff;
        }
      }

      .role-avatar-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 14px;
        flex-shrink: 0;
        background: #f0f2f5;
        overflow: hidden;

        /* SVG 图标大小 */
        /deep/ svg {
          width: 22px;
          height: 22px;
        }
      }

      .role-info {
        flex: 1;
        min-width: 0;

        .role-name {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .role-code {
          font-size: 12px;
          color: #909399;
          margin-top: 2px;
        }
      }
    }
  }
}

/* 右侧权限面板 */
.permission-panel {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 1px solid #ebeef5;
    flex-wrap: wrap;
    gap: 12px;

    .panel-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;
      gap: 6px;

      i {
        color: #409eff;
      }

      .current-role-name {
        color: #409eff;
        font-weight: 500;
      }
    }

    .panel-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  .permission-tree-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 16px;

    ::v-deep .el-tree {
      background: transparent;
    }

    ::v-deep .el-tree-node__content {
      height: 36px;
      border-radius: 4px;

      &:hover {
        background: #f5f7fa;
      }
    }

    .custom-tree-node {
      display: flex;
      align-items: center;
      flex: 1;
      padding-right: 8px;
      gap: 8px;

      .node-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        font-size: 12px;

        &.icon-menu {
          color: #409eff;
          background: #ecf5ff;
        }

        &.icon-button {
          color: #67c23a;
          background: #f0f9eb;
        }

        &.icon-param {
          color: #e6a23c;
          background: #fdf6ec;
        }

        &.icon-default {
          color: #909399;
          background: #f4f4f5;
        }
      }

      .node-label {
        font-size: 14px;
        color: #303133;
        flex-shrink: 0;
      }

      .node-type-tag {
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 3px;
        flex-shrink: 0;

        &.tag-menu {
          color: #409eff;
          background: #ecf5ff;
        }

        &.tag-button {
          color: #67c23a;
          background: #f0f9eb;
        }

        &.tag-param {
          color: #e6a23c;
          background: #fdf6ec;
        }
      }

      .node-code {
        font-size: 11px;
        color: #c0c4cc;
        font-family: "Consolas", "Monaco", monospace;
        background: #f5f7fa;
        padding: 1px 6px;
        border-radius: 3px;
        flex-shrink: 0;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  /* 底部统计和操作栏 */
  .panel-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-top: 1px solid #ebeef5;
    background: #fafafa;

    .stats-info {
      display: flex;
      gap: 20px;

      .stat-item {
        font-size: 13px;
        color: #606266;
        display: flex;
        align-items: center;
        gap: 4px;

        b {
          color: #303133;
          font-weight: 600;
        }

        &.stat-menu i {
          color: #409eff;
        }
        &.stat-button i {
          color: #67c23a;
        }
        &.stat-param i {
          color: #e6a23c;
        }
      }
    }

    .footer-actions {
      display: flex;
      gap: 8px;
    }
  }
}

/* 空状态提示 */
.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #909399;

  .empty-icon {
    font-size: 48px;
    color: #c0c4cc;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 14px;
    color: #909399;
    margin: 0;
  }

  &.empty-tip-large {
    padding: 80px 20px;

    .empty-icon {
      font-size: 64px;
    }

    .empty-text {
      font-size: 15px;
    }
  }
}
</style>
