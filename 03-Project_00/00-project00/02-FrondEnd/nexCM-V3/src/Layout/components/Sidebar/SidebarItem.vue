<template>
  <!-- 有子菜单：渲染 el-submenu，内部递归 -->
  <el-submenu v-if="hasChildren" :index="item.path">
    <template slot="title">
      <svg-icon v-if="item.icon" :icon-file-name="item.icon" class="menu-icon" />
      <span v-else class="menu-icon-placeholder"></span>
      <span slot="title">{{ displayTitle }}</span>
    </template>
    <sidebar-item
      v-for="child in item.children"
      :key="child.path"
      :item="child"
    />
  </el-submenu>

  <!-- 无子菜单：渲染 el-menu-item -->
  <el-menu-item v-else :index="item.path">
    <svg-icon v-if="item.icon" :icon-file-name="item.icon" class="menu-icon" />
    <span v-else class="menu-icon-placeholder"></span>
    <span slot="title">{{ displayTitle }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    /** 只有一个子节点时不显示展开箭头，直接当菜单项 */
    hasChildren() {
      return this.item.children && this.item.children.length > 0
    },
    /** 显示标题：判断是否是 i18n key，是就翻译，不是就直接显示 */
    displayTitle() {
      const title = this.item.title
      if (!title) return ''
      return this.$te(title) ? this.$t(title) : title
    }
  }
}
</script>

<style scoped lang="less">
.menu-icon {
  margin-right: @sidebar-menu-icon-margin;
  font-size: @sidebar-menu-icon-size;
  vertical-align: middle;
}

/* 无图标时的占位元素，保持与有图标时一致的左边距 */
.menu-icon-placeholder {
  display: inline-block;
  width: @sidebar-menu-icon-size;
  margin-right: @sidebar-menu-icon-margin;
  vertical-align: middle;
}
</style>
