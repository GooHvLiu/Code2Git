<template>
  <div class="profile-page">
    <div class="profile-card">
      <!-- 顶部：头像 + 用户名 + 角色 -->
      <div class="profile-header">
        <div class="avatar-wrapper">
          <svg-icon :icon-file-name="avatarIcon" class="avatar-svg-icon" />
        </div>
        <div class="user-info">
          <h2 class="username">
            {{ userInfo.realName || userInfo.username || "--" }}
          </h2>
          <p class="user-account">@{{ userInfo.username || "--" }}</p>
          <el-tag :type="roleTagType" size="medium" class="role-tag">
            {{ roleText }}
          </el-tag>
        </div>
      </div>

      <!-- 分割线 -->
      <div class="profile-divider"></div>

      <!-- 详细信息 -->
      <div class="profile-body">
        <h3 class="section-title">{{ $t("profile.basicInfo") }}</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ $t("profile.username") }}</span>
            <span class="info-value">{{ userInfo.username || "--" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("profile.realName") }}</span>
            <span class="info-value">{{ userInfo.realName || "--" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("profile.role") }}</span>
            <span class="info-value">
              <el-tag :type="roleTagType" size="small">{{ roleText }}</el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("profile.sex") }}</span>
            <span class="info-value">{{ sexText }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("profile.phone") }}</span>
            <span class="info-value">{{ userInfo.phone || "--" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("profile.email") }}</span>
            <span class="info-value">{{ userInfo.email || "--" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("profile.status") }}</span>
            <span class="info-value">
              <el-tag
                :type="userInfo.status === 0 ? 'danger' : 'success'"
                size="small"
              >
                {{ statusText }}
              </el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("profile.createTime") }}</span>
            <span class="info-value">{{
              formatTime(userInfo.createTime)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import store from "@/store";
import { useDict } from "@/composables/useDict";

// 字典数据
const { dict } = useDict(["user_role", "user_sex", "user_status"]);

// 从 store 获取用户信息
const userInfo = computed(() => store.state.user.userInfo);

/**
 * 根据角色确定头像图标（与导航栏保持一致）
 */
const avatarIcon = computed(() => {
  const info = userInfo.value || {};
  // 超级管理员（数据库字段）
  if (Number(info.is_super_admin) === 1) return "SuperAdmin";
  // 按角色等级映射头像
  const levelMap = { 2: "Administrator", 3: "Engineer", 4: "Operator" };
  const level = Number(info.role_level);
  return levelMap[level] || "who";
});

// 角色文本（从数据字典获取）
const roleText = computed(() => {
  const role = userInfo.value?.role;
  const item = (dict.value.user_role || []).find((i) => i.value === role);
  return item ? item.label : role || "--";
});

// 角色标签颜色（从数据字典获取）
const roleTagType = computed(() => {
  const role = userInfo.value?.role;
  const item = (dict.value.user_role || []).find((i) => i.value === role);
  return item ? item.list_class || item.css_class || "info" : "info";
});

// 性别文本（从数据字典获取）
const sexText = computed(() => {
  const sex = userInfo.value?.sex;
  const item = (dict.value.user_sex || []).find((i) => i.value === sex);
  return item ? item.label : "--";
});

// 状态文本（从数据字典获取）
const statusText = computed(() => {
  const status = userInfo.value?.status;
  const item = (dict.value.user_status || []).find((i) => i.value === status);
  return item ? item.label : "--";
});

// 头像使用根据角色确定的SVG图标（与导航栏保持一致）

// 格式化时间
function formatTime(time) {
  if (!time) return "--";
  const date = new Date(time);
  if (isNaN(date.getTime())) return "--";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}
</script>

<style scoped lang="less">
.profile-page {
  padding: 0;
}

.profile-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 32px;
}

.avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  flex-shrink: 0;
  /* 覆盖 svg-icon 组件内部的默认大小（1.6em） */
  ::v-deep .svg-icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.user-info {
  flex: 1;
  min-width: 0;
}

.username {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.user-account {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #909399;
}

.role-tag {
  margin: 0;
}

.profile-divider {
  height: 1px;
  background: #ebeef5;
  margin: 0 32px;
}

.profile-body {
  padding: 24px 32px 32px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 32px;
}

.info-item {
  display: flex;
  align-items: center;
  min-width: 0;
}

.info-label {
  width: 80px;
  flex-shrink: 0;
  font-size: 14px;
  color: #909399;
}

.info-value {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  color: #303133;
  word-break: break-all;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .avatar-wrapper {
    margin-right: 0;
    margin-bottom: 16px;
  }
}
</style>
