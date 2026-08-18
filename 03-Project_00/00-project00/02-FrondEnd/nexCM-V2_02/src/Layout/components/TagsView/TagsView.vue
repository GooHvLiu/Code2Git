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
import { mapGetters, mapActions } from 'vuex'
import { HOME_TAG, ROUTE_PATHS } from '@/router/pathConstants'

export default {
  name: 'TagsView',
  components: { TagMenus },
  data() {
    return {
      menuShow: false,
      mouseX: 0,
      mouseY: 0,
      currentRightIndex: null
    }
  },
  computed: {
    ...mapGetters(['visitedViews']),
    /** 标签列表（兼容原 tagArr 命名） */
    tagArr() {
      return this.visitedViews
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        this.addView(to)
      }
    }
  },
  methods: {
    ...mapActions('tagsView', ['addView', 'delView', 'delOthersViews', 'delAllViews', 'delLeftViews', 'delRightViews']),

    /** 获取路由标题，兼容 titles 数组和 title 字符串 */
    getRouteTitle(route) {
      if (route.meta?.titles?.length) {
        return route.meta.titles[route.meta.titles.length - 1]
      }
      return route.meta?.title || this.$t('common.untitled')
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
    async handleClose(index) {
      const delTag = this.tagArr[index]
      const isActive = delTag.path === this.$route.path

      const remainViews = await this.delView(delTag)

      // 关闭的是当前页，跳到最后一个标签
      if (isActive && remainViews.length > 0) {
        const lastItem = remainViews[remainViews.length - 1]
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
    async handleMenuClick(menuId) {
      const idx = this.currentRightIndex
      const currentTag = this.tagArr[idx]
      const currentPath = currentTag.path
      const isCurrentActive = currentPath === this.$route.path

      switch (menuId) {
        // 刷新（无刷新重载：跳转到 /redirect 再跳回，组件销毁重建）
        case 1: {
          const fullPath = this.$route.fullPath
          this.$router.replace(`${ROUTE_PATHS.REDIRECT}?path=${encodeURIComponent(fullPath)}`)
          break
        }
        // 关闭当前
        case 2:
          this.handleClose(idx)
          break
        // 关闭其他
        case 3: {
          const remainViews = await this.delOthersViews(currentTag)
          if (!isCurrentActive && remainViews.length > 0) {
            this.$router.push(currentPath)
          }
          break
        }
        // 关闭左侧
        case 4: {
          const remainViews = await this.delLeftViews(currentTag)
          if (!remainViews.find(t => t.path === this.$route.path)) {
            this.$router.push(currentPath)
          }
          break
        }
        // 关闭右侧
        case 5: {
          const remainViews = await this.delRightViews(currentTag)
          if (!remainViews.find(t => t.path === this.$route.path)) {
            this.$router.push(currentPath)
          }
          break
        }
        // 全部关闭（只留首页）
        case 6:
          await this.delAllViews()
          this.$router.push(HOME_TAG.path)
          break
      }
    }
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
