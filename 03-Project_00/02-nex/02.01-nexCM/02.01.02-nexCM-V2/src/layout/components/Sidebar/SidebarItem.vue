<template>
  <!-- 有子菜单：渲染 el-submenu，内部递归 -->
  <el-submenu v-if="hasChildren" :index="item.path">
    <template slot="title">
      <svg-icon v-if="item.icon" :icon-file-name="item.icon" class="menu-icon" />
      <span slot="title">{{ item.title }}</span>
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
    <span slot="title">{{ item.title }}</span>
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
    }
  }
}
</script>

<style scoped lang="less">
.menu-icon {
  margin-right: 8px;
  font-size: 16px;
  vertical-align: middle;
}
</style>
