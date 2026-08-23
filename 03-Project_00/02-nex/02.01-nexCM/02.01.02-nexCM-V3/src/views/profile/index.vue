<template>
  <div class="profile-page">
    <div class="profile-card">
      <!-- 顶部：头像 + 用户名 + 角色 -->
      <div class="profile-header">
        <div class="avatar-wrapper">
          <img v-if="isValidAvatar(userInfo.avatar)" :src="userInfo.avatar" class="avatar-img" />
          <i v-else class="el-icon-user-solid avatar-icon"></i>
        </div>
        <div class="user-info">
          <h2 class="username">{{ userInfo.realName || userInfo.username || '--' }}</h2>
          <p class="user-account">@{{ userInfo.username || '--' }}</p>
          <el-tag :type="roleTagType" size="medium" class="role-tag">
            {{ roleText }}
          </el-tag>
        </div>
      </div>

      <!-- 分割线 -->
      <div class="profile-divider"></div>

      <!-- 详细信息 -->
      <div class="profile-body">
        <h3 class="section-title">{{ $t('profile.basicInfo') }}</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ $t('profile.username') }}</span>
            <span class="info-value">{{ userInfo.username || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('profile.realName') }}</span>
            <span class="info-value">{{ userInfo.realName || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('profile.role') }}</span>
            <span class="info-value">
              <el-tag :type="roleTagType" size="small">{{ roleText }}</el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('profile.sex') }}</span>
            <span class="info-value">{{ sexText }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('profile.phone') }}</span>
            <span class="info-value">{{ userInfo.phone || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('profile.email') }}</span>
            <span class="info-value">{{ userInfo.email || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('profile.status') }}</span>
            <span class="info-value">
              <el-tag :type="userInfo.status === 0 ? 'danger' : 'success'" size="small">
                {{ statusText }}
              </el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('profile.createTime') }}</span>
            <span class="info-value">{{ formatTime(userInfo.createTime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { mapState } from 'vuex'
import dictMixin from '@/mixins/dict'

export default {
  name: 'Profile',
  mixins: [dictMixin],
  data() {
    return {
      /** 需要加载的字典编码 */
      dictCodes: ['user_role', 'user_sex', 'user_status']
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    /** 角色文本（从数据字典获取） */
    roleText() {
      const role = this.userInfo?.role
      const item = (this.dict.user_role || []).find(i => i.value === role)
      return item ? item.label : (role || '--')
    },
    /** 角色标签颜色（从数据字典获取） */
    roleTagType() {
      const role = this.userInfo?.role
      const item = (this.dict.user_role || []).find(i => i.value === role)
      return item ? (item.list_class || item.css_class || 'info') : 'info'
    },
    /** 性别文本（从数据字典获取） */
    sexText() {
      const sex = this.userInfo?.sex
      const item = (this.dict.user_sex || []).find(i => i.value === sex)
      return item ? item.label : '--'
    },
    /** 状态文本（从数据字典获取） */
    statusText() {
      const status = this.userInfo?.status
      const item = (this.dict.user_status || []).find(i => i.value === status)
      return item ? item.label : '--'
    }
  },
  methods: {
    /** 判断头像是否是有效URL */
    isValidAvatar(avatar) {
      if (!avatar) return false
      return /^(https?:)?\/\//i.test(avatar) || avatar.startsWith('/')
    },
    /** 格式化时间 */
    formatTime(time) {
      if (!time) return '--'
      const date = new Date(time)
      if (isNaN(date.getTime())) return '--'
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const h = String(date.getHours()).padStart(2, '0')
      const min = String(date.getMinutes()).padStart(2, '0')
      const s = String(date.getSeconds()).padStart(2, '0')
      return `${y}-${m}-${d} ${h}:${min}:${s}`
    }
  }
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
}

.avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-right: 24px;
  background: #c0c4cc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-icon {
  font-size: 40px;
  color: #fff;
}

.user-info {
  flex: 1;
}

.username {
  margin: 0 0 8px 0;
  font-size: 24px;
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
  margin: 0;
}

.profile-body {
  padding: 24px 32px 32px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;

  &:nth-child(2n) {
    border-right: none;
  }

  &:nth-last-child(-n+2) {
    border-bottom: none;
  }
}

.info-label {
  width: 90px;
  flex-shrink: 0;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  background: #fafafa;
  padding: 4px 8px;
  margin-right: 12px;
  border-radius: 2px;
}

.info-value {
  flex: 1;
  font-size: 13px;
  color: #303133;
  word-break: break-all;
}
</style>
