<template>
  <div class="tags-view-container">
    <div ref="tagWrap" class="tags-view-wrap">
      <el-tag
        v-for="(item, index) in tagsViewStore.visitedViews"
        :key="item.path"
        size="small"
        class="tag-item"
        :class="{ active: isTagActive(item.path) }"
        :closable="isClosable(item.path)"
        :effect="isTagActive(item.path) ? 'dark' : 'plain'"
        :disable-transitions="true"
        @click="clickTag(item.path)"
        @close="handleClose(index)"
        @contextmenu.prevent="openContextMenu($event, index)"
      >
        <i v-if="isTagActive(item.path)" class="active-dot"></i>
        {{ formatTagTitle(item.title) }}
      </el-tag>
    </div>

    <TagMenus
      v-if="menuShow"
      :mouse-x="mouseX"
      :mouse-y="mouseY"
      :current-right-index="currentRightIndex"
      :total-tag-arr="tagsViewStore.visitedViews.length"
      @menu-click="handleMenuClick"
      @close="menuShow = false"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 标签栏：随路由新增标签，支持点击跳转、关闭、右键菜单
 * 作者：GooHv
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, type RouteLocationNormalized } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TagMenus from './TagMenus.vue'
import { HOME_TAG, ROUTE_PATHS } from '@/router/constant/pathConstants'
import { useTagsViewStore } from '@/store/modules/tagsView'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const { t, te } = useI18n()

// ===== 右键菜单状态 =====
const menuShow = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const currentRightIndex = ref<number>(0)
const tagWrap = ref<HTMLElement | null>(null)

// ===== 路由变化订阅：新增标签 =====
let removeAfterEach: (() => void) | null = null
onMounted(() => {
  tagsViewStore.addView(route as unknown as RouteLocationNormalized)
  removeAfterEach = router.afterEach(to => {
    tagsViewStore.addView(to)
  })
})
onBeforeUnmount(() => {
  if (typeof removeAfterEach === 'function') removeAfterEach()
})

// ===== 方法 =====
/**
 * 标签标题：store 中存的是 i18n key，此处响应式翻译（切换语言后自动更新）；
 * 若不是已注册的 key（如兜底 'no-name' 或历史会话缓存的字面量），则原样返回
 */
function formatTagTitle(title: string): string {
  if (title && te(title)) return t(title)
  return title
}

/** 首页不可关闭 */
function isClosable(path: string): boolean {
  return path !== HOME_TAG.path
}

/** 是否当前激活 */
function isTagActive(path: string): boolean {
  return route.path === path
}

/** 点击标签跳转 */
function clickTag(path: string): void {
  if (route.path !== path) router.push(path)
}

/** 关闭标签 */
async function handleClose(index: number): Promise<void> {
  const delTag = tagsViewStore.visitedViews[index]
  const isActive = delTag.path === route.path
  const remainViews = tagsViewStore.delView(delTag)
  if (isActive && remainViews.length > 0) {
    const lastItem = remainViews[remainViews.length - 1]
    router.push(lastItem.path)
  }
}

/** 打开右键菜单 */
function openContextMenu(e: MouseEvent, index: number): void {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  currentRightIndex.value = index
  menuShow.value = true
}

/** 右键菜单操作 */
async function handleMenuClick(menuId: number): Promise<void> {
  const idx = currentRightIndex.value
  const currentTag = tagsViewStore.visitedViews[idx]
  const tagPath = currentTag.path
  const isCurrentActive = tagPath === route.path

  switch (menuId) {
    // 刷新（经 /redirect 中转，强制组件重建）
    case 1: {
      const fullPath = router.currentRoute.value.fullPath
      router.replace(`${ROUTE_PATHS.REDIRECT}?path=${encodeURIComponent(fullPath)}`)
      break
    }
    // 关闭当前
    case 2:
      await handleClose(idx)
      break
    // 关闭其他
    case 3: {
      const remainViews = tagsViewStore.delOthersViews(currentTag)
      if (!isCurrentActive && remainViews.length > 0) router.push(tagPath)
      break
    }
    // 关闭左侧
    case 4: {
      const remainViews = tagsViewStore.delLeftViews(currentTag)
      if (!remainViews.find(t => t.path === route.path)) router.push(tagPath)
      break
    }
    // 关闭右侧
    case 5: {
      const remainViews = tagsViewStore.delRightViews(currentTag)
      if (!remainViews.find(t => t.path === route.path)) router.push(tagPath)
      break
    }
    // 全部关闭（只留首页）
    case 6:
      tagsViewStore.delAllViews()
      router.push(HOME_TAG.path)
      break
  }
}
</script>

<style scoped lang="less">
.tags-view-container {
  height: @tagsview-height;
  background: @tagsview-bg;
  border-bottom: 1px solid @border-light;
  box-shadow: @tagsview-shadow;
}

.tags-view-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 @spacing-sm;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: @text-placeholder;
    border-radius: 2px;
  }
}

.tag-item {
  margin: 0 @spacing-xs;
  cursor: pointer;
  flex-shrink: 0;
  height: 32px;
  line-height: 30px;
  font-size: 13px;
  padding: 0 12px;
  box-sizing: border-box;

  &:first-child {
    margin-left: 0;
  }

  &.active {
    .active-dot {
      display: inline-block;
    }
  }
}

.active-dot {
  display: none;
  width: @tagsview-active-dot-size;
  height: @tagsview-active-dot-size;
  background: @tagsview-active-dot-bg;
  border-radius: 50%;
  margin-right: @spacing-xs;
  vertical-align: middle;
}
</style>
