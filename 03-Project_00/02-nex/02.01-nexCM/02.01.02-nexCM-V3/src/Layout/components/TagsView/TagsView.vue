<template>
  <div class="tags-view-container">
    <div class="tags-view-wrap" ref="tagWrap">
      <el-tag
        v-for="(item, index) in tagArr"
        :key="item.path"
        size="small"
        class="tag-item"
        :class="{ active: isTagActive(item) }"
        :closable="isClosable(item.path)"
        :effect="isTagActive(item) ? 'dark' : 'plain'"
        :disable-transitions="true"
        @click="clickTag(item.path)"
        @close="handleClose(index)"
        @contextmenu.native.prevent="openContentMenu($event, index)"
      >
        <i v-if="isTagActive(item)" class="active-dot"></i>
        {{ item.title }}
      </el-tag>
    </div>

    <TagMenus
      v-if="menuShow"
      :mouse-x="mouseX"
      :mouse-y="mouseY"
      :current-right-index="currentRightIndex"
      :total-tag-arr="tagArr.length"
      @menu-click="handleMenuClick"
      @close="menuShow = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import TagMenus from "./TagMenus/TagMenus.vue";
import { HOME_TAG, ROUTE_PATHS } from "@/router/constant/pathConstants.js";
import store from '@/store'
import router from '@/router'

// ===== 响应式数据 =====
const menuShow = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const currentRightIndex = ref(null)
// 当前路由路径（响应式，用于标签激活状态判断）
const currentPath = ref(router.currentRoute.path)

// ===== 计算属性 =====
const visitedViews = computed(() => store.getters.visitedViews)
/** 标签列表（兼容原 tagArr 命名） */
const tagArr = computed(() => visitedViews.value)

// ===== 监听路由变化 =====
// router.currentRoute 不是响应式的，必须用 afterEach 监听
let afterEachHook = null
onMounted(() => {
  // 初始化时添加当前路由
  store.dispatch('tagsView/addView', router.currentRoute)
  // 监听路由变化
  afterEachHook = router.afterEach((to) => {
    currentPath.value = to.path
    store.dispatch('tagsView/addView', to)
  })
})
onBeforeUnmount(() => {
  if (typeof afterEachHook === 'function') {
    afterEachHook()
  }
})

// ===== 方法 =====
/** 首页不可关闭 */
function isClosable(path) {
  return path !== HOME_TAG.path;
}

/** 是否当前激活 */
function isTagActive(item) {
  return item.path === currentPath.value;
}

/** 点击标签跳转 */
function clickTag(path) {
  if (currentPath.value !== path) {
    router.push(path);
  }
}

/** 关闭标签 */
async function handleClose(index) {
  const delTag = tagArr.value[index];
  const isActive = delTag.path === currentPath.value;

  const remainViews = await store.dispatch('tagsView/delView', delTag);

  // 关闭的是当前页，跳到最后一个标签
  if (isActive && remainViews.length > 0) {
    const lastItem = remainViews[remainViews.length - 1];
    router.push(lastItem.path);
  }
}

/** 右键菜单 */
function openContentMenu(e, index) {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
  currentRightIndex.value = index;
  menuShow.value = true;
}

/** 右键菜单操作 */
async function handleMenuClick(menuId) {
  const idx = currentRightIndex.value;
  const currentTag = tagArr.value[idx];
  const tagPath = currentTag.path;
  const isCurrentActive = tagPath === currentPath.value;

  switch (menuId) {
    // 刷新（无刷新重载：跳转到 /redirect 再跳回，组件销毁重建）
    case 1: {
      const fullPath = router.currentRoute.fullPath;
      router.replace(
        `${ROUTE_PATHS.REDIRECT}?path=${encodeURIComponent(fullPath)}`
      );
      break;
    }
    // 关闭当前
    case 2:
      handleClose(idx);
      break;
    // 关闭其他
    case 3: {
      const remainViews = await store.dispatch('tagsView/delOthersViews', currentTag);
      if (!isCurrentActive && remainViews.length > 0) {
        router.push(tagPath);
      }
      break;
    }
    // 关闭左侧
    case 4: {
      const remainViews = await store.dispatch('tagsView/delLeftViews', currentTag);
      if (!remainViews.find((t) => t.path === currentPath.value)) {
        router.push(tagPath);
      }
      break;
    }
    // 关闭右侧
    case 5: {
      const remainViews = await store.dispatch('tagsView/delRightViews', currentTag);
      if (!remainViews.find((t) => t.path === currentPath.value)) {
        router.push(tagPath);
      }
      break;
    }
    // 全部关闭（只留首页）
    case 6:
      await store.dispatch('tagsView/delAllViews');
      router.push(HOME_TAG.path);
      break;
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
