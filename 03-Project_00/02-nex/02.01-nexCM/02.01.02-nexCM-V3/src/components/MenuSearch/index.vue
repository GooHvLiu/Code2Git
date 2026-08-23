<template>
  <div class="menu-search">
    <el-input
      v-model="keyword"
      :placeholder="$t('layout.searchMenu')"
      size="small"
      clearable
      prefix-icon="el-icon-search"
      class="search-input"
      @focus="showDropdown = true"
      @blur="handleBlur"
      @input="handleInput"
      @keyup.up.native="handleKeyUp"
      @keyup.down.native="handleKeyDown"
      @keyup.enter.native="handleEnter"
    />
    <transition name="fade">
      <div v-show="showDropdown && filteredMenus.length > 0" class="search-dropdown">
        <div
          v-for="(item, index) in filteredMenus"
          :key="item.path + '-' + index"
          class="search-item"
          :class="{ active: index === activeIndex, 'top-level': item.isTopLevel }"
          @mousedown.prevent="selectMenu(item)"
          @mouseenter="activeIndex = index"
        >
          <svg-icon v-if="item.isTopLevel && item.icon" :icon-file-name="item.icon" class="item-icon" />
          <span v-else class="item-icon-placeholder"></span>
          <span class="item-title">{{ item.title }}</span>
          <span v-if="item.parentTitle" class="item-parent">{{ item.parentTitle }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { flattenMenu } from '@/router/helper/menuHelper'

export default {
  name: 'MenuSearch',
  data() {
    return {
      keyword: '',
      showDropdown: false,
      activeIndex: 0
    }
  },
  computed: {
    ...mapState('permission', { menuItems: 'userMenu' }),
    /** 扁平化所有菜单（统一使用 menuHelper.js 的工具函数） */
    flatMenus() {
      return flattenMenu(this.menuItems)
    },
    /** 过滤后的菜单 */
    filteredMenus() {
      if (!this.keyword.trim()) return this.flatMenus.slice(0, 20)
      const kw = this.keyword.trim().toLowerCase()
      return this.flatMenus
        .filter(item => item.title.toLowerCase().includes(kw))
        .slice(0, 20)
    }
  },
  watch: {
    filteredMenus() {
      this.activeIndex = 0
    }
  },
  methods: {
    handleInput() {
      this.showDropdown = true
      this.activeIndex = 0
    },
    handleBlur() {
      // 延迟关闭，让 mousedown 先触发
      setTimeout(() => {
        this.showDropdown = false
      }, 200)
    },
    handleKeyUp() {
      if (this.activeIndex > 0) {
        this.activeIndex--
      }
    },
    handleKeyDown() {
      if (this.activeIndex < this.filteredMenus.length - 1) {
        this.activeIndex++
      }
    },
    handleEnter() {
      if (this.filteredMenus[this.activeIndex]) {
        this.selectMenu(this.filteredMenus[this.activeIndex])
      }
    },
    selectMenu(item) {
      this.$router.push(item.path)
      this.keyword = ''
      this.showDropdown = false
    }
  }
}
</script>

<style scoped lang="less">
.menu-search {
  position: relative;
  flex: 0 1 200px;
  min-width: 120px;
}

.search-input {
  width: 100%;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 100%;
  max-height: 450px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 3000;
}

.search-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #606266;
  transition: background 0.15s;

  &:hover,
  &.active {
    background: #f5f7fa;
    color: #409eff;
  }

  /* 一级菜单：加粗 */
  &.top-level {
    font-weight: 600;
    color: #303133;
  }

  .item-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  /* 二级菜单图标占位，保持文字对齐 */
  .item-icon-placeholder {
    width: 16px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .item-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-parent {
    font-size: 11px;
    color: #909399;
    margin-left: 8px;
    flex-shrink: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 响应式：中等屏幕收缩 */
@media (max-width: 992px) {
  .menu-search {
    flex: 0 1 140px;
    min-width: 100px;
  }
}

/* 响应式：小屏幕隐藏 */
@media (max-width: 768px) {
  .menu-search {
    display: none;
  }
}
</style>
