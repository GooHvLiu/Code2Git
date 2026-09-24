<template>
  <!-- 全屏遮罩 @click.self：仅点击空白处关闭，点击菜单内部不关闭 -->
  <div class="context-menu-mask" @click.self="emit('close')">
    <div class="context-menu" :style="menuStyle">
      <ul class="menu-item-group">
        <li v-for="item in filterMenu" :key="item.id" class="menu-item" @click="handleMenuClick(item.id)">
          <el-icon class="menu-icon"><component :is="item.icon" /></el-icon>
          <span>{{ item.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 标签页右键菜单
 * 刷新 / 关闭当前 / 关闭其他 / 关闭左侧 / 关闭右侧 / 全部关闭
 * 作者：GooHv
 */
import { computed, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { RefreshRight, Close, CircleClose, Back, Right } from '@element-plus/icons-vue'

// 右键菜单尺寸（与 variables.less 中 @context-menu-width / @context-menu-estimated-height 保持一致）
const MENU_WIDTH = 120
const MENU_ESTIMATED_HEIGHT = 240

const { t } = useI18n()

const props = defineProps<{
  mouseX: number
  mouseY: number
  currentRightIndex: number
  totalTagArr: number
}>()

const emit = defineEmits<{
  (e: 'menu-click', id: number): void
  (e: 'close'): void
}>()

interface MenuItem {
  id: number
  icon: Component
  text: string
}

/** 右键菜单项（国际化） */
const tagMenu = computed<MenuItem[]>(() => [
  { id: 1, icon: RefreshRight, text: t('layout.tagsview.refresh') as string },
  { id: 2, icon: Close, text: t('layout.tagsview.close') as string },
  { id: 3, icon: CircleClose, text: t('layout.tagsview.closeOthers') as string },
  { id: 4, icon: Back, text: t('layout.tagsview.closeLeft') as string },
  { id: 5, icon: Right, text: t('layout.tagsview.closeRight') as string },
  { id: 6, icon: CircleClose, text: t('layout.tagsview.closeAll') as string }
])

/** 根据右键位置与标签总数，过滤不可用项 */
const filterMenu = computed<MenuItem[]>(() => {
  const totalLength = props.totalTagArr
  const hideIds = new Set<number>()

  // 首页（索引 0）：隐藏“关闭当前”和“关闭左侧”
  if (props.currentRightIndex === 0) {
    hideIds.add(2)
    hideIds.add(4)
  }
  // 最后一个标签：隐藏“关闭右侧”
  if (props.currentRightIndex === totalLength - 1) {
    hideIds.add(5)
  }
  // 只有一个标签：隐藏“关闭其他”和“全部关闭”
  if (totalLength === 1) {
    hideIds.add(3)
    hideIds.add(6)
  }
  // 第二个标签（索引 1）：隐藏“关闭左侧”
  if (props.currentRightIndex === 1) {
    hideIds.add(4)
  }

  if (hideIds.size === 0) return tagMenu.value
  return tagMenu.value.filter(item => !hideIds.has(item.id))
})

/** 菜单位置，防止溢出视口 */
const menuStyle = computed(() => {
  const winW = window.innerWidth
  const winH = window.innerHeight
  let x = props.mouseX
  let y = props.mouseY
  if (x + MENU_WIDTH > winW) x = x - MENU_WIDTH
  if (y + MENU_ESTIMATED_HEIGHT > winH) y = y - MENU_ESTIMATED_HEIGHT
  return { left: `${x}px`, top: `${y}px` }
})

function handleMenuClick(menuId: number): void {
  emit('menu-click', menuId)
  emit('close')
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

        .menu-icon {
          font-size: @font-size-base;
        }

        &:hover {
          background: @bg-gray;
        }
      }
    }
  }
}
</style>
