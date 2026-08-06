<!--
  Link.vue - 菜单链接组件
  自动判断是外部链接还是内部路由
-->
<template>
  <!-- 外部链接用 a 标签 -->
  <a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
    <slot />
  </a>
  <!-- 内部路由用 router-link -->
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>

<script>
export default {
  name: 'AppLink',
  props: {
    to: { type: String, required: true }
  },
  methods: {
    // 判断是否外部链接
    isExternal(path) {
      return /^(https?:|mailto:|tel:)/.test(path)
    }
  }
}
</script>
