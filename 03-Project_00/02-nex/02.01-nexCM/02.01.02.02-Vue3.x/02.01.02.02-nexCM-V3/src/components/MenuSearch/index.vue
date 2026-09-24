<template>
  <div class="menu-search">
    <el-input
      v-model="keyword"
      :placeholder="t('layout.navbar.searchMenu')"
      size="default"
      clearable
      :prefix-icon="Search"
      class="search-input"
      @focus="showDropdown = true"
      @blur="handleBlur"
      @input="handleInput"
      @keydown.up.prevent="handleKeyUp"
      @keydown.down.prevent="handleKeyDown"
      @keydown.enter="handleEnter"
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
          <svg-icon v-if="item.isTopLevel && item.icon" :icon-class="item.icon" class="item-icon" />
          <span v-else class="item-icon-placeholder"></span>
          <span class="item-title">{{ item.title }}</span>
          <span v-if="item.parentTitle" class="item-parent">{{ item.parentTitle }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
/**
 * 顶部菜单搜索（键盘上下选择 + 回车跳转）
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { usePermissionStore } from '@/store/modules/permission'
import { flattenMenu } from '@/router/helper/menuHelper'
import type { FlatMenuItem } from '@/types/router'

defineOptions({ name: 'MenuSearch' })

const { t } = useI18n()
const router = useRouter()
const permissionStore = usePermissionStore()

const keyword = ref('')
const showDropdown = ref(false)
const activeIndex = ref(0)

const flatMenus = computed<FlatMenuItem[]>(() => flattenMenu(permissionStore.userMenu))

const filteredMenus = computed<FlatMenuItem[]>(() => {
  if (!keyword.value.trim()) return flatMenus.value.slice(0, 50)
  const kw = keyword.value.trim().toLowerCase()
  return flatMenus.value.filter(item => item.title.toLowerCase().includes(kw)).slice(0, 50)
})

watch(filteredMenus, () => {
  activeIndex.value = 0
})

function handleInput(): void {
  showDropdown.value = true
  activeIndex.value = 0
}

function handleBlur(): void {
  // 延迟关闭，让 mousedown 先触发
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

function handleKeyUp(): void {
  if (activeIndex.value > 0) activeIndex.value--
}

function handleKeyDown(): void {
  if (activeIndex.value < filteredMenus.value.length - 1) activeIndex.value++
}

function handleEnter(): void {
  const item = filteredMenus.value[activeIndex.value]
  if (item) selectMenu(item)
}

function selectMenu(item: FlatMenuItem): void {
  router.push(item.path)
  keyword.value = ''
  showDropdown.value = false
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

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .menu-search {
    flex: 0 1 140px;
    min-width: 100px;
  }
}

@media (max-width: 768px) {
  .menu-search {
    display: none;
  }
}
</style>
