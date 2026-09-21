<template>
  <div class="profile-page">
    <div class="profile-card">
      <!-- 顶部：头像 + 用户名 + 角色 -->
      <div class="profile-header">
        <div class="avatar-wrapper">
          <SvgIcon :icon-class="avatarIcon" class="avatar-svg-icon" />
        </div>
        <div class="user-info">
          <h2 class="username">{{ userInfo.realName || userInfo.username || '--' }}</h2>
          <p class="user-account">@{{ userInfo.username || '--' }}</p>
          <el-tag :type="roleTagType" class="role-tag">{{ roleText }}</el-tag>
        </div>
      </div>

      <!-- 分割线 -->
      <div class="profile-divider"></div>

      <!-- 详细信息 -->
      <div class="profile-body">
        <h3 class="section-title">{{ t('layout.profile.basicInfo') }}</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ t('layout.profile.username') }}</span>
            <span class="info-value">{{ userInfo.username || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('layout.profile.realName') }}</span>
            <span class="info-value">{{ userInfo.realName || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('layout.profile.role') }}</span>
            <span class="info-value">
              <el-tag :type="roleTagType" size="small">{{ roleText }}</el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('layout.profile.sex') }}</span>
            <span class="info-value">{{ sexText }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('layout.profile.phone') }}</span>
            <span class="info-value">{{ userInfo.phone || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('layout.profile.email') }}</span>
            <span class="info-value">{{ userInfo.email || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('layout.profile.status') }}</span>
            <span class="info-value">
              <el-tag :type="Number(userInfo.status) === 0 ? 'danger' : 'success'" size="small">
                {{ statusText }}
              </el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('layout.profile.createTime') }}</span>
            <span class="info-value">{{ formatTime(userInfo.createTime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 个人中心页
 * 展示当前登录用户的基本信息（头像随角色、角色/性别/状态标签取自数据字典）
 * 作者：GooHv
 */
import { computed } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useUserStore } from '@/store/modules/user'
import { useDict } from '@/composables/useDict'
import { useI18n } from '@/composables/useI18n'
import { formatDate, DATE_FORMATS } from '@/utils/data/date'
import type { UserInfo } from '@/types/user'

defineOptions({ name: 'Profile' })

const { t } = useI18n()
const userStore = useUserStore()

// 字典数据：角色 / 性别 / 状态
const { dict } = useDict(['user_role', 'user_sex', 'user_status'])

// 当前登录用户信息
const userInfo = computed<Partial<UserInfo>>(() => userStore.userInfo || {})

/**
 * 角色头像图标（与导航栏保持一致，依据数据库字段，不硬编码角色编码）
 * is_super_admin=1 → SuperAdmin；role_level 2/3/4 → Administrator/Engineer/Operator；其余 who
 */
const avatarIcon = computed<string>(() => {
  const info = userInfo.value
  if (Number(info.is_super_admin) === 1) return 'SuperAdmin'
  const levelMap: Record<number, string> = { 2: 'Administrator', 3: 'Engineer', 4: 'Operator' }
  return levelMap[Number(info.role_level)] || 'who'
})

/** 角色编码（后端可能返回字符串或数组，个人中心取主角色） */
const roleCode = computed<string>(() => {
  const role = userInfo.value.role
  if (Array.isArray(role)) return (role[0] as string) ?? ''
  return (role as string) ?? ''
})

/** 角色文本（数据字典） */
const roleText = computed<string>(() => {
  const item = (dict.value.user_role || []).find((i) => String(i.value) === String(roleCode.value))
  return item ? item.label : roleCode.value || '--'
})

/** el-tag 支持的类型 */
type TagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

/** 角色标签颜色（数据字典 list_class / css_class） */
const roleTagType = computed<TagType>(() => {
  const item = (dict.value.user_role || []).find((i) => String(i.value) === String(roleCode.value))
  return ((item && (item.list_class || item.css_class)) || 'info') as TagType
})

/** 性别文本（数据字典） */
const sexText = computed<string>(() => {
  const sex = userInfo.value.sex
  const item = (dict.value.user_sex || []).find((i) => String(i.value) === String(sex))
  return item ? item.label : '--'
})

/** 状态文本（数据字典） */
const statusText = computed<string>(() => {
  const status = userInfo.value.status
  const item = (dict.value.user_status || []).find((i) => String(i.value) === String(status))
  return item ? item.label : '--'
})

/** 格式化时间（统一走项目时间工具，空值/非法值显示 --） */
function formatTime(time?: string | null): string {
  if (!time) return '--'
  const formatted = formatDate(time, DATE_FORMATS.DATETIME)
  return formatted || '--'
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

  .avatar-svg-icon {
    width: 50px;
    height: 50px;
    font-size: 50px;
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
