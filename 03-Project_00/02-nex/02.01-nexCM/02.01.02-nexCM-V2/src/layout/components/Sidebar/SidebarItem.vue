<!--
  SidebarItem.vue - 递归菜单项组件
  支持多级菜单，自己调用自己
-->
<template>
  <div v-if="!item.hidden">
    <!-- 只有一个可见子菜单时，直接显示菜单项 -->
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 多个子菜单时，显示子菜单 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- 递归渲染子菜单 -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import AppLink from './Link'
import Item from './Item'

export default {
  name: 'SidebarItem', // 递归组件必须有 name
  components: { AppLink, Item },
  props: {
    item: { type: Object, required: true }, // 路由配置
    basePath: { type: String, default: '' } // 基础路径
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  methods: {
    /**
     * 判断是否只有一个可见子菜单
     * 用于优化：只有一个子菜单时不显示二级菜单
     */
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })

      if (showingChildren.length === 1) {
        return true
      }

      // 没有可见子菜单时，显示父菜单
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    // 解析完整路径
    resolvePath(routePath) {
      if (/^(https?:|mailto:|tel:)/.test(routePath)) {
        return routePath
      }
      if (/^(https?:|mailto:|tel:)/.test(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
