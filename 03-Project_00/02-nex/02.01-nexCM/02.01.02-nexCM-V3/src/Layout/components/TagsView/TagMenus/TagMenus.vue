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

<script setup>
import { computed } from "vue";
import { useI18n } from "@/composables/useI18n";

// 右键菜单尺寸（与 variables.less 中 @context-menu-width / @context-menu-estimated-height 保持一致）
const MENU_WIDTH = 120;
const MENU_ESTIMATED_HEIGHT = 240;

const { t: $t } = useI18n();

const props = defineProps({
  mouseX: { type: Number, default: 0 },
  mouseY: { type: Number, default: 0 },
  currentRightIndex: { type: Number, required: true },
  totalTagArr: { type: Number, required: true },
});

const emit = defineEmits(["menu-click", "close"]);

// ===== 计算属性 =====
/** 右键菜单项（国际化） */
const tagMenu = computed(() => [
  { id: 1, icon: "el-icon-refresh-right", text: $t("tagsview.refresh") },
  { id: 2, icon: "el-icon-close", text: $t("tagsview.close") },
  { id: 3, icon: "el-icon-circle-close", text: $t("tagsview.closeOthers") },
  { id: 4, icon: "el-icon-back", text: $t("tagsview.closeLeft") },
  { id: 5, icon: "el-icon-right", text: $t("tagsview.closeRight") },
  { id: 6, icon: "el-icon-circle-close", text: $t("tagsview.closeAll") },
]);

/** 根据当前右键位置和标签总数，过滤不可用的菜单项 */
const filterMenu = computed(() => {
  const totalLength = props.totalTagArr;
  const hideIds = new Set();

  // 首页（索引0）：隐藏"关闭当前"和"关闭左侧"
  if (props.currentRightIndex === 0) {
    hideIds.add(2);
    hideIds.add(4);
  }
  // 最后一个标签：隐藏"关闭右侧"
  if (props.currentRightIndex === totalLength - 1) {
    hideIds.add(5);
  }
  // 只有一个标签：隐藏"关闭其他"和"全部关闭"
  if (totalLength === 1) {
    hideIds.add(3);
    hideIds.add(6);
  }
  // 第二个标签（索引1）：隐藏"关闭左侧"（左侧只有首页，不可关）
  if (props.currentRightIndex === 1) {
    hideIds.add(4);
  }

  if (hideIds.size === 0) return tagMenu.value;
  return tagMenu.value.filter((item) => !hideIds.has(item.id));
});

/** 菜单位置，防止溢出视口 */
const menuStyle = computed(() => {
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  let x = props.mouseX;
  let y = props.mouseY;

  if (x + MENU_WIDTH > winW) x = x - MENU_WIDTH;
  if (y + MENU_ESTIMATED_HEIGHT > winH) y = y - MENU_ESTIMATED_HEIGHT;

  return { left: `${x}px`, top: `${y}px` };
});

// ===== 方法 =====
function handleMenuClick(menuId) {
  emit("menu-click", menuId);
  emit("close");
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
