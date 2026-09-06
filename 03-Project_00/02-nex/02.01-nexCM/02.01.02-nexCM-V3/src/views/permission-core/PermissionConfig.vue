<template>
  <div class="permission-config-page">
    <!-- 顶部标题栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ $t(titleKey) }}
        </h2>
        <p class="page-desc">{{ $t(descKey) }}</p>
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
          <el-tag size="mini" type="info">{{ visibleRoles.length }}</el-tag>
        </div>
        <div class="role-list" v-loading="roleLoading">
          <div
            v-for="role in visibleRoles"
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
          <div v-if="!roleLoading && visibleRoles.length === 0" class="empty-tip">
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
            <el-button size="small" @click="handleReset" :disabled="!hasChanges">
              <i class="el-icon-refresh-left" />
              {{ $t("common.reset") }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleSave(saveSuccessKey)"
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
import { onMounted } from "vue";
import { resolveMenuTitle } from "@/router/helper/menuTitle";
import i18n from "@/i18n";
import { usePermissionConfig } from "./composables/usePermissionConfig";
import {
  getNodeIcon,
  getNodeIconClass,
  getRoleAvatarIcon,
  getRoleName,
} from "./utils/permissionTree";

// ===== Props =====
const props = defineProps({
  // 模式：system（系统设置）/ super（超级面板）
  mode: {
    type: String,
    default: "system",
    validator: (v) => ["system", "super"].includes(v),
  },
  // 是否显示超级管理员角色
  showSuperAdmin: {
    type: Boolean,
    default: false,
  },
  // 是否显示超级面板相关权限（superOnly 节点）
  showSuperPermissions: {
    type: Boolean,
    default: false,
  },
  // 标题 i18n key
  titleKey: {
    type: String,
    default: "menu.system.permission.page.title",
  },
  // 描述 i18n key
  descKey: {
    type: String,
    default: "menu.system.permission.page.desc",
  },
  // 保存成功提示 i18n key
  saveSuccessKey: {
    type: String,
    default: "menu.system.permission.page.saveSuccess",
  },
});

// ===== 核心逻辑 =====
const {
  loading,
  saving,
  roleLoading,
  currentRole,
  permissionTree,
  filterType,
  treeProps,
  visibleRoles,
  filteredTreeData,
  checkedCount,
  menuCheckedCount,
  buttonCheckedCount,
  paramCheckedCount,
  hasChanges,
  handleSelectRole,
  handleCheckChange,
  handleFilterType,
  handleExpandAll,
  handleCollapseAll,
  handleRefresh,
  handleReset,
  handleSave,
  init,
} = usePermissionConfig(props);

// ===== 工具函数 =====
function getTypeName(type) {
  const map = {
    menu: i18n.t("menu.system.permission.page.menu"),
    button: i18n.t("menu.system.permission.page.button"),
    param: i18n.t("menu.system.permission.page.param"),
  };
  return map[type] || type;
}

// ===== 初始化 =====
onMounted(() => {
  init();
});
</script>

<style scoped lang="less">
.permission-config-page {
  padding: 0;
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
    }

    .page-desc {
      margin: 6px 0;
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
