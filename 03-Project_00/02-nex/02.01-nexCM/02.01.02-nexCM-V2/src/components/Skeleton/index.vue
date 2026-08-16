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
    <!-- 加载中显示骨架 -->
    <div v-if="loading" class="skeleton">
      <!-- 头像占位 -->
      <div v-if="avatar" class="skeleton-avatar" :style="{ width: avatarSize + 'px', height: avatarSize + 'px' }"></div>
      <!-- 标题占位 -->
      <div v-if="title" class="skeleton-title"></div>
      <!-- 段落占位 -->
      <div class="skeleton-paragraph">
        <div
          v-for="i in rows"
          :key="i"
          class="skeleton-row"
          :style="{ width: getRowWidth(i) }"
        ></div>
      </div>
    </div>
    <!-- 加载完成显示实际内容 -->
    <slot v-else></slot>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
export default {
  name: 'Skeleton',
  props: {
    /** 是否加载中 */
    loading: {
      type: Boolean,
      default: true
    },
    /** 段落行数 */
    rows: {
      type: Number,
      default: 3
    },
    /** 是否显示头像占位 */
    avatar: {
      type: Boolean,
      default: false
    },
    /** 头像大小（px） */
    avatarSize: {
      type: Number,
      default: 40
    },
    /** 是否显示标题占位 */
    title: {
      type: Boolean,
      default: false
    },
    /** 是否开启动画 */
    animated: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * 计算每行宽度，模拟真实文本的不规则长度
     */
    getRowWidth(index) {
      // 最后一行短一些，更真实
      if (index === this.rows) return '60%'
      // 倒数第二行稍短
      if (index === this.rows - 1) return '80%'
      return '100%'
    }
  }
}
</script>

<style scoped lang="less">
.skeleton-wrapper {
  width: 100%;
}

.skeleton {
  padding: @spacing-md;
}

.skeleton-avatar {
  border-radius: 50%;
  background: @border-lighter;
  margin-bottom: @spacing-md;
}

.skeleton-title {
  height: 16px;
  background: @border-lighter;
  border-radius: @border-radius-sm;
  margin-bottom: @spacing-md;
  width: 40%;
}

.skeleton-paragraph {
  .skeleton-row {
    height: 12px;
    background: @border-lighter;
    border-radius: @border-radius-sm;
    margin-bottom: @spacing-sm;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 骨架屏动画（从左到右的微光扫过效果）
.skeleton-avatar,
.skeleton-title,
.skeleton-row {
  position: relative;
  overflow: hidden;

  &::after {
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
}

@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
