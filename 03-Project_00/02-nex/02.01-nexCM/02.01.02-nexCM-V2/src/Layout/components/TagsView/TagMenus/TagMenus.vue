<template>
  <!-- 全屏遮罩 @click.self：只有点击遮罩空白区域触发，点击菜单内部不会关闭 -->
  <div class="context-menu-mask" @click.self="$emit('close')">
    <div class="context-menu" :style="menuStyle">
      <ul class="menu-item-group">
        <li
          v-for="item in filterMenu"
          :key="item.id"
          class="menu-item"
          @click="handleMenuClick(item.id)"
        >
          <i :class="item.icon"></i>{{ item.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// 右键菜单尺寸（与 variables.less 中 @context-menu-width / @context-menu-estimated-height 保持一致）
const MENU_WIDTH = 120
const MENU_ESTIMATED_HEIGHT = 240

export default {
  name: 'TagMenus',
  props: {
    mouseX: { type: Number, default: 0 },
    mouseY: { type: Number, default: 0 },
    currentRightIndex: { type: Number, required: true },
    totalTagArr: { type: Number, required: true }
  },
  data() {
    return {
      tagMenu: [
        { id: 1, icon: 'el-icon-refresh-right', text: '刷新页面' },
        { id: 2, icon: 'el-icon-close', text: '关闭当前' },
        { id: 3, icon: 'el-icon-circle-close', text: '关闭其他' },
        { id: 4, icon: 'el-icon-back', text: '关闭左侧' },
        { id: 5, icon: 'el-icon-right', text: '关闭右侧' },
        { id: 6, icon: 'el-icon-circle-close', text: '全部关闭' }
      ]
    }
  },
  computed: {
    /** 根据当前右键位置和标签总数，过滤不可用的菜单项 */
    filterMenu() {
      const totalLength = this.totalTagArr
      const hideIds = new Set()

      // 首页（索引0）：隐藏"关闭当前"和"关闭左侧"
      if (this.currentRightIndex === 0) {
        hideIds.add(2)
        hideIds.add(4)
      }
      // 最后一个标签：隐藏"关闭右侧"
      if (this.currentRightIndex === totalLength - 1) {
        hideIds.add(5)
      }
      // 只有一个标签：隐藏"关闭其他"和"全部关闭"
      if (totalLength === 1) {
        hideIds.add(3)
        hideIds.add(6)
      }
      // 第二个标签（索引1）：隐藏"关闭左侧"（左侧只有首页，不可关）
      if (this.currentRightIndex === 1) {
        hideIds.add(4)
      }

      if (hideIds.size === 0) return this.tagMenu
      return this.tagMenu.filter(item => !hideIds.has(item.id))
    },

    /** 菜单位置，防止溢出视口 */
    menuStyle() {
      const winW = window.innerWidth
      const winH = window.innerHeight

      let x = this.mouseX
      let y = this.mouseY

      if (x + MENU_WIDTH > winW) x = x - MENU_WIDTH
      if (y + MENU_ESTIMATED_HEIGHT > winH) y = y - MENU_ESTIMATED_HEIGHT

      return { left: `${x}px`, top: `${y}px` }
    }
  },
  methods: {
    handleMenuClick(menuId) {
      this.$emit('menu-click', menuId)
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
.context-menu-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: @z-context-menu-mask;

  .context-menu {
    width: @context-menu-width;
    position: fixed;
    background-color: @context-menu-bg;
    border: 1px solid @border-light;
    border-radius: @border-radius-base;
    box-shadow: @shadow-base;
    z-index: @z-context-menu;

    .menu-item-group {
      .menu-item {
        font-size: @font-size-sm;
        padding: @context-menu-item-padding;
        display: flex;
        align-items: center;
        gap: @context-menu-item-gap;
        cursor: pointer;
        color: @text-regular;

        &:hover {
          background: @bg-gray;
        }
      }
    }
  }
}
</style>
