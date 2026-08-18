<template>
  <!--
    骨架屏组件
    数据加载中时显示占位动画，提升感知速度
    支持行、头像、标题、段落等多种占位类型

    用法：
    <skeleton :loading="loading" :rows="5" avatar>
      <div>实际内容</div>
    </skeleton>
  -->
  <div class="skeleton-wrapper">
    <div v-if="loading" class="skeleton">
      <div v-if="avatar" class="skeleton-avatar" :style="{ width: avatarSize + 'px', height: avatarSize + 'px' }"></div>
      <div v-if="title" class="skeleton-title"></div>
      <div class="skeleton-paragraph">
        <div
          v-for="i in rows"
          :key="i"
          class="skeleton-row"
          :style="{ width: getRowWidth(i) }"
        ></div>
      </div>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: 'Skeleton',
  props: {
    loading: { type: Boolean, default: true },
    rows: { type: Number, default: 3 },
    avatar: { type: Boolean, default: false },
    avatarSize: { type: Number, default: 40 },
    title: { type: Boolean, default: false },
    animated: { type: Boolean, default: true }
  },
  methods: {
    getRowWidth(index) {
      if (index === this.rows) return '60%'
      if (index === this.rows - 1) return '80%'
      return '100%'
    }
  }
}
</script>

<style scoped>
.skeleton-wrapper {
  width: 100%;
}

.skeleton {
  padding: 16px;
}

.skeleton-avatar {
  border-radius: 50%;
  background: #f0f0f0;
  margin-bottom: 16px;
}

.skeleton-title {
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 40%;
}

.skeleton-paragraph .skeleton-row {
  height: 12px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-paragraph .skeleton-row:last-child {
  margin-bottom: 0;
}

.skeleton-avatar,
.skeleton-title,
.skeleton-row {
  position: relative;
  overflow: hidden;
}

.skeleton-avatar::after,
.skeleton-title::after,
.skeleton-row::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: skeleton-shimmer 1.4s infinite;
}

@keyframes skeleton-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
