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

<script>
import TagMenus from './TagMenus/TagMenus.vue'
import { SESSIONSTORAGE_KEYS } from '@/utils/storageKey'
import { setSessionStorage, getSessionStorage } from '@/utils/storage'

/** 首页固定标签 */
const HOME_TAG = { title: '网站首页', path: '/home' }

export default {
  name: 'TagsView',
  components: { TagMenus },
  data() {
    return {
      tagArr: getSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST) || [{ ...HOME_TAG }],
      menuShow: false,
      mouseX: 0,
      mouseY: 0,
      currentRightIndex: null
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        this.addTag(to)
      }
    }
  },
  methods: {
    /** 获取路由标题，兼容 titles 数组和 title 字符串 */
    getRouteTitle(route) {
      if (route.meta?.titles?.length) {
        return route.meta.titles[route.meta.titles.length - 1]
      }
      return route.meta?.title || '未命名'
    },

    /** 添加标签 */
    addTag(route) {
      if (!route.name || route.path === '/redirect') return
      const existItem = this.tagArr.find(item => item.path === route.path)
      if (!existItem) {
        this.tagArr.push({
          title: this.getRouteTitle(route),
          path: route.path
        })
      }
      this.saveTagsCache()
    },

    /** 首页不可关闭 */
    isClosable(path) {
      return path !== HOME_TAG.path
    },

    /** 是否当前激活 */
    isTagActive(item) {
      return item.path === this.$route.path
    },

    /** 点击标签跳转 */
    clickTag(path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    },

    /** 关闭标签 */
    handleClose(index) {
      const delTag = this.tagArr[index]
      const isActive = delTag.path === this.$route.path

      this.tagArr.splice(index, 1)
      this.saveTagsCache()

      // 关闭的是当前页，跳到最后一个标签
      if (isActive && this.tagArr.length > 0) {
        const lastItem = this.tagArr[this.tagArr.length - 1]
        this.$router.push(lastItem.path)
      }
    },

    /** 右键菜单 */
    openContentMenu(e, index) {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
      this.currentRightIndex = index
      this.menuShow = true
    },

    /** 右键菜单操作 */
    handleMenuClick(menuId) {
      const idx = this.currentRightIndex
      const currentPath = this.tagArr[idx].path
      const isCurrentActive = currentPath === this.$route.path

      switch (menuId) {
        // 刷新
        case 1:
          location.reload()
          break
        // 关闭当前
        case 2:
          this.handleClose(idx)
          break
        // 关闭其他
        case 3:
          // 保留首页和当前标签（如果当前就是首页，只保留首页）
          this.tagArr = idx === 0
            ? [{ ...HOME_TAG }]
            : [{ ...HOME_TAG }, this.tagArr[idx]]
          this.saveTagsCache()
          if (!isCurrentActive) this.$router.push(currentPath)
          break
        // 关闭左侧（首页不可关，从索引1开始删）
        case 4:
          this.tagArr.splice(1, idx - 1)
          this.saveTagsCache()
          if (!this.tagArr.find(t => t.path === this.$route.path)) {
            this.$router.push(currentPath)
          }
          break
        // 关闭右侧
        case 5:
          this.tagArr.splice(idx + 1)
          this.saveTagsCache()
          if (!this.tagArr.find(t => t.path === this.$route.path)) {
            this.$router.push(currentPath)
          }
          break
        // 全部关闭（只留首页）
        case 6:
          this.tagArr = [{ ...HOME_TAG }]
          this.saveTagsCache()
          this.$router.push(HOME_TAG.path)
          break
      }
    },

    /** 持久化 */
    saveTagsCache() {
      setSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST, this.tagArr)
    }
  }
}
</script>

<style scoped lang="less">
.tags-view-container {
  height: @tagsview-height;
  background: @tagsview-bg;
  border-bottom: 1px solid @border-light;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
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
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
</style>
