<template>
  <!-- 有子菜单：渲染 el-sub-menu，内部递归 -->
  <el-sub-menu v-if="hasChildren" :index="item.path">
    <template #title>
      <SvgIcon v-if="showIcon" :icon-class="item.icon" class="menu-icon" />
      <span v-else class="menu-icon-placeholder"></span>
      <span>{{ displayTitle }}</span>
    </template>
    <SidebarItem
      v-for="child in item.children"
      :key="child.path"
      :item="child"
    />
  </el-sub-menu>

  <!-- 无子菜单：渲染 el-menu-item -->
  <el-menu-item v-else :index="item.path">
    <template #title>
      <SvgIcon v-if="showIcon" :icon-class="item.icon" class="menu-icon" />
      <span v-else class="menu-icon-placeholder"></span>
      <span>{{ displayTitle }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
/**
 * 递归菜单项
 * 图标与文字统一放入 #title 插槽（Element Plus 折叠时仅渲染 title 插槽）
 * 作者：GooHv
 */
import { computed } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import type { SidebarMenu } from '@/types/router'

const props = defineProps<{
  item: SidebarMenu
}>()

/** 存在子菜单 */
const hasChildren = computed(() =>
  Array.isArray(props.item.children) && props.item.children.length > 0
)

/** 显示标题：formatMenu 已通过 resolveMenuTitle 转换，直接使用 */
const displayTitle = computed(() => props.item.title || '')

/**
 * 是否渲染真实图标
 * icon 为空或为占位标记 '#'（后端用于"无图标"的菜单项）时渲染等宽占位元素，
 * 避免生成指向不存在 symbol 的 #icon-# 引用。
 */
const showIcon = computed(() => Boolean(props.item.icon) && props.item.icon !== '#')
</script>

<style scoped lang="less">
.menu-icon {
  margin-right: @sidebar-menu-icon-margin;
  font-size: @sidebar-menu-icon-size;
  width: @sidebar-menu-icon-size;
  height: @sidebar-menu-icon-size;
  vertical-align: -0.15em;
  flex-shrink: 0;
}

/* 无图标时的占位元素，保持与有图标时一致的左边距 */
.menu-icon-placeholder {
  display: inline-block;
  width: @sidebar-menu-icon-size;
  height: @sidebar-menu-icon-size;
  margin-right: @sidebar-menu-icon-margin;
  flex-shrink: 0;
}
</style>
